// Times Chat Settings while generations are in flight (Marinara-Engine#6388).
//
//   SCENARIO=main      one streaming generation, then open settings
//   SCENARIO=saturate  STALL_CHAT_IDS generations that never answer pin the
//                      browser's per-host sockets, then open settings
//   SCENARIO=agent     a custom pre-generation agent whose call never returns
//   SCENARIO=reload    reload the page mid-generation, then open settings
//   SCENARIO=two-chats generate in CHAT_NAME and CHAT2_NAME, then open settings
//
// Env: CHAT_ID (required), CHAT_NAME (sidebar text, default "Holmes"), CHAT_TAB
// (RP|CONVO|GM, default RP), CHAT2_NAME, STALL_CHAT_IDS, STALL_CONNECTION_ID,
// SKIP_MAIN_SEND=1, DRAWER_TIMEOUT_MS. See ../../issue-6388-repro.md.
import { execSync } from "node:child_process";

const SCENARIO = process.env.SCENARIO ?? "main";
const CHAT_ID = process.env.CHAT_ID;
const CHAT_NAME = process.env.CHAT_NAME ?? "Holmes";
const CHAT2_NAME = process.env.CHAT2_NAME ?? "Devi";
const now = () => performance.now();
const ms = (t) => `${Math.round(t)}ms`;

async function api(baseUrl, path, method = "GET", body) {
  const t = now();
  const r = await fetch(baseUrl + path, { method, headers: { "content-type": "application/json", Origin: baseUrl }, body: body === undefined ? undefined : JSON.stringify(body) });
  const text = await r.text();
  return { status: r.status, ms: now() - t, json: (() => { try { return JSON.parse(text); } catch { return text; } })() };
}

// Established sockets from any process to the Engine port. Chromium caps
// HTTP/1.1 at six per host, and this driver's own fetches add one more.
function chromeSockets(baseUrl) {
  const { hostname, port } = new URL(baseUrl);
  try { return execSync(`lsof -nP -iTCP -sTCP:ESTABLISHED 2>/dev/null | grep -c -- '->${hostname}:${port || 80}'`, { encoding: "utf8" }).trim(); } catch { return "0"; }
}

async function openChat(page, clickText, name, tab) {
  const list = page.locator('button[aria-label="Chats"], [data-tour="sidebar"]').first();
  if (!(await page.locator('aside[aria-label="Chat list"]').isVisible().catch(() => false))) {
    const opener = page.locator('button[aria-label="Chats"], button[title="Chats"], button[aria-label="Open sidebar"]').first();
    if (await opener.count()) await opener.click().catch(() => {});
  }
  await page.waitForTimeout(500);
  console.log("tab ->", await clickText(tab, { exact: true }));
  await page.waitForTimeout(800);
  let hit = null;
  for (let i = 0; i < 20 && !hit; i++) { hit = await clickText(name); if (!hit) await page.waitForTimeout(500); }
  console.log("chat ->", hit);
  await page.locator(".mari-chat-input textarea").waitFor({ state: "visible", timeout: 30_000 });
}

async function send(page, forceClick, text) {
  await page.locator(".mari-chat-input textarea").fill(text);
  await page.waitForTimeout(200);
  console.log("send ->", await forceClick(".mari-chat-input button.mari-chat-send-btn, button.mari-chat-send-btn"));
}

export default async function step({ page, baseUrl, shot, clickText, forceClick }) {
  const log = (...a) => console.log(`[${new Date().toISOString().slice(11, 23)}]`, ...a);

  // Network timing for every request the page makes; flagged when slow.
  const slow = [];
  const pending = new Map();
  let watching = false;
  page.on("request", (req) => { if (watching) pending.set(req, { url: req.url().replace(baseUrl, ""), at: Date.now() }); });
  page.on("requestfinished", (req) => pending.delete(req));
  page.on("requestfailed", (req) => pending.delete(req));
  const dumpPending = () => [...pending.values()].map((p) => `${p.url} (${Date.now() - p.at}ms)`);
  page.on("requestfinished", async (req) => {
    if (!watching) return;
    const t = req.timing();
    const total = t.responseEnd;
    if (total > 300) slow.push({ url: req.url().replace(baseUrl, ""), total: Math.round(total), requestStart: Math.round(t.requestStart), connectStart: Math.round(t.connectStart) });
  });
  page.on("requestfailed", (req) => watching && slow.push({ url: req.url().replace(baseUrl, ""), failed: req.failure()?.errorText }));

  await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 60_000 });
  for (const label of [/Skip Tutorial/i, /Got it/i, /Close/i]) {
    const b = page.getByRole("button", { name: label });
    if (await b.count()) { try { await b.first().click({ timeout: 2000 }); } catch {} }
  }

  if (SCENARIO === "agent") {
    const conn = (await api(baseUrl, "/api/connections")).json.find((c) => c.model === "slow-chat");
    const agent = await api(baseUrl, "/api/agents", "POST", { type: "custom", name: "Slow pre-gen agent", phase: "pre_generation", connectionId: conn.id, promptTemplate: "Return a short directive.", settings: { resultType: "context_injection", enabledTools: [] } });
    log("agent create", agent.status, JSON.stringify(agent.json).slice(0, 200));
    const meta = await api(baseUrl, `/api/chats/${CHAT_ID}/metadata`, "PATCH", { enableAgents: true, activeAgentIds: [agent.json.type], enableTools: false });
    log("metadata patch", meta.status);
    await page.reload({ waitUntil: "networkidle" });
  }

  await openChat(page, clickText, CHAT_NAME, process.env.CHAT_TAB ?? "RP");
  await page.waitForTimeout(1500);
  log("sockets before send:", chromeSockets(baseUrl));
  if (process.env.SKIP_MAIN_SEND !== "1") {
    await send(page, forceClick, "Continue.");
    await page.waitForTimeout(4000);
    log("sockets during generation:", chromeSockets(baseUrl));
  }

  if (SCENARIO === "reload") {
    await page.reload({ waitUntil: "networkidle" });
    await page.locator(".mari-chat-input textarea").waitFor({ state: "visible", timeout: 30_000 });
    await page.waitForTimeout(3000);
    log("sockets after reload:", chromeSockets(baseUrl));
  }
  if (SCENARIO === "saturate") {
    // Emulate zombie / background streams: N generations whose provider never
    // answers, each pinning one of the browser's six sockets to this origin.
    const ids = (process.env.STALL_CHAT_IDS ?? "").split(",").filter(Boolean);
    const conn = process.env.STALL_CONNECTION_ID;
    await page.evaluate(({ ids, conn }) => {
      window.__stalls = ids.map((chatId) => fetch("/api/generate", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ chatId, connectionId: conn, userMessage: "go", streaming: true }) }).then((r) => ({ status: r.status })).catch((e) => ({ error: String(e) })));
    }, { ids, conn });
    await page.waitForTimeout(4000);
    log(`sockets with ${ids.length} stalled streams pinned:`, chromeSockets(baseUrl));
  }
  if (SCENARIO === "two-chats") {
    await openChat(page, clickText, CHAT2_NAME, "CONVO");
    await page.waitForTimeout(1500);
    await send(page, forceClick, "Hey, you there?");
    await page.waitForTimeout(4000);
    log("sockets with two generations:", chromeSockets(baseUrl));
  }

  // Server-side probes while the drawer is exercised.
  const probes = { health: [], chat: [] };
  const timer = setInterval(async () => {
    probes.health.push((await api(baseUrl, "/api/health")).ms);
    probes.chat.push((await api(baseUrl, `/api/chats/${CHAT_ID}`)).ms);
  }, 300);

  watching = true;
  const t0 = now();
  log("settings click ->", await forceClick('[data-chat-toolbar-panel-action="settings"]'));
  const drawer = page.locator(".mari-chat-settings-drawer");
  log("service worker controlling:", await page.evaluate(() => !!navigator.serviceWorker?.controller));
  try {
    await drawer.waitFor({ state: "visible", timeout: Number(process.env.DRAWER_TIMEOUT_MS ?? 30_000) });
    log(`drawer visible after ${ms(now() - t0)}`);
  } catch {
    log(`DRAWER NOT VISIBLE after ${ms(now() - t0)}; still-pending page requests:`, JSON.stringify(dumpPending(), null, 1));
    await shot(`${SCENARIO}-stuck`);
    clearInterval(timer);
    log(`probe /api/health during stall n=${probes.health.length} max=${Math.round(Math.max(0, ...probes.health))}`);
    for (const id of (process.env.STALL_CHAT_IDS ?? "").split(",").filter(Boolean)) await api(baseUrl, "/api/generate/abort", "POST", { chatId: id });
    await api(baseUrl, "/api/generate/abort", "POST", { chatId: CHAT_ID });
    return;
  }
  await page.waitForTimeout(500);
  await shot(`${SCENARIO}-drawer`);

  const ids = await drawer.locator("[data-chat-settings-section]").evaluateAll((els) => els.map((e) => e.getAttribute("data-chat-settings-section")));
  log("sections:", ids.join(", "));
  const timings = [];
  for (const id of ids) {
    const section = drawer.locator(`[data-chat-settings-section="${id}"]`);
    const header = section.locator('[role="button"], button').first();
    const t = now();
    try {
      await section.scrollIntoViewIfNeeded();
      if ((await header.getAttribute("aria-expanded")) !== "true") await header.click({ timeout: 5000 });
      await header.locator("xpath=.").evaluate((el) => new Promise((res, rej) => { const d = Date.now(); (function poll() { if (el.getAttribute("aria-expanded") === "true" || Date.now() - d > 15000) res(); else setTimeout(poll, 20); })(); }));
      await page.waitForTimeout(150);
      timings.push({ id, ms: Math.round(now() - t), expanded: await header.getAttribute("aria-expanded") });
    } catch (e) { timings.push({ id, ms: Math.round(now() - t), error: String(e).split("\n")[0] }); }
  }
  await shot(`${SCENARIO}-sections`);
  clearInterval(timer);
  watching = false;

  log("section timings:", JSON.stringify(timings));
  const mx = (a) => (a.length ? Math.round(Math.max(...a)) : null), md = (a) => (a.length ? Math.round(a.sort((x, y) => x - y)[a.length >> 1]) : null);
  log(`probe /api/health  n=${probes.health.length} median=${md(probes.health)} max=${mx(probes.health)}`);
  log(`probe /api/chats/:id n=${probes.chat.length} median=${md(probes.chat)} max=${mx(probes.chat)}`);
  log("slow page requests (>300ms):", JSON.stringify(slow));
  log("sockets at end:", chromeSockets(baseUrl));
  for (const id of (process.env.STALL_CHAT_IDS ?? "").split(",").filter(Boolean)) await api(baseUrl, "/api/generate/abort", "POST", { chatId: id });
  await api(baseUrl, "/api/generate/abort", "POST", { chatId: CHAT_ID });
}
