#!/usr/bin/env node
// Playwright driver for UI/UX exploration.
//
// Runs one "step" module against a persistent Chromium profile. Because the
// profile is reused, browser state (dismissed tutorial, open chat, expanded
// accordions) survives between runs, so exploration can proceed in small steps
// instead of one long script that has to rebuild the world every time.
//
//   node $HARNESS/drive-browser.mjs $HARNESS/steps/example-tour.mjs
//
// A step module default-exports an async function receiving:
//   page, context      Playwright objects.
//   baseUrl            Engine URL under test.
//   shot(name)         Numbered screenshot into the shots directory.
//   outline(selector)  Visible interactive elements as "tag[role] @x,y :: label".
//   clickText(label)   DOM-side click by visible text, prefix-tolerant.
//   forceClick(sel)    Click through overlapping siblings via element.click().
//   setCheckbox(label, on) Toggle a visually hidden checkbox by its row label.
//   consoleErrors      Collected console and page errors.
//
// This driver deliberately does not use the repository's Playwright test runner
// or playwright.config.ts: the smoke suite wipes its fixtures each run, while
// exploration wants a long-lived instance with seeded data.
//
// See docs/development/ui-ux-exploration-harness.md.
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { createRequire } from "node:module";
import { parseArgs } from "node:util";
import { fileURLToPath, pathToFileURL } from "node:url";

const HELP = `Usage: node $HARNESS/drive-browser.mjs <step-file.mjs> [options]

Options:
  --base-url <url>     Engine base URL (default: http://127.0.0.1:7860, or BASE_URL).
  --profile <dir>      Persistent browser profile (default: .tmp/uiux/profile).
  --shots <dir>        Screenshot output directory (default: .tmp/uiux/shots).
  --width <number>     Viewport width (default: 1600).
  --height <number>    Viewport height (default: 1000).
  --headed             Run with a visible browser window.
  --reset              Ignore existing profile state by using a fresh profile dir.
  --help               Show this message.

Environment:
  PLAYWRIGHT_BROWSERS_PATH   Where prebuilt browsers live.
  PLAYWRIGHT_CHROMIUM_PATH   Exact Chromium binary, skipping discovery.
  PLAYWRIGHT_CORE_PATH       Exact playwright-core entry point, skipping discovery.
`;

const { values, positionals } = parseArgs({
  options: {
    "base-url": { type: "string" },
    profile: { type: "string" },
    shots: { type: "string" },
    width: { type: "string" },
    height: { type: "string" },
    headed: { type: "boolean", default: false },
    reset: { type: "boolean", default: false },
    help: { type: "boolean", default: false },
  },
  allowPositionals: true,
});

if (values.help || positionals.length === 0) {
  process.stdout.write(HELP);
  process.exit(values.help ? 0 : 1);
}

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const stepFile = resolve(positionals[0]);
const baseUrl = (values["base-url"] ?? process.env.BASE_URL ?? "http://127.0.0.1:7860").replace(/\/+$/, "");
const profileDir = resolve(
  values.profile ?? join(repoRoot, ".tmp", "uiux", values.reset ? `profile-${Date.now()}` : "profile"),
);
const shotsDir = resolve(values.shots ?? join(repoRoot, ".tmp", "uiux", "shots"));
const viewport = {
  width: Number.parseInt(values.width ?? "1600", 10),
  height: Number.parseInt(values.height ?? "1000", 10),
};

if (!existsSync(stepFile)) {
  console.error(`  [ERROR] Step file not found: ${stepFile}`);
  process.exit(1);
}
mkdirSync(profileDir, { recursive: true });
mkdirSync(shotsDir, { recursive: true });

// playwright-core is a transitive dependency, so with pnpm it does not sit at
// node_modules/playwright-core. Resolve it normally first, then fall back to a
// scan of the pnpm store rather than pinning a version in this file.
function resolvePlaywrightCore() {
  if (process.env.PLAYWRIGHT_CORE_PATH) return process.env.PLAYWRIGHT_CORE_PATH;
  try {
    return createRequire(import.meta.url).resolve("playwright-core");
  } catch {
    // Fall through to the store scan below.
  }
  const stores = [join(repoRoot, "node_modules", ".pnpm"), join(repoRoot, ".pnpm")];
  for (const store of stores) {
    if (!existsSync(store)) continue;
    const match = readdirSync(store)
      .filter((entry) => entry.startsWith("playwright-core@"))
      .sort()
      .reverse()
      .map((entry) => join(store, entry, "node_modules", "playwright-core", "index.mjs"))
      .find((candidate) => existsSync(candidate));
    if (match) return match;
  }
  return null;
}

// Prebuilt browsers may live outside the project. Find a Chromium binary in
// PLAYWRIGHT_BROWSERS_PATH; returning null lets Playwright use its own default.
function resolveChromium() {
  if (process.env.PLAYWRIGHT_CHROMIUM_PATH) return process.env.PLAYWRIGHT_CHROMIUM_PATH;
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH;
  if (!root || !existsSync(root)) return null;
  const relatives = [
    join("chrome-linux", "chrome"),
    join("chrome-mac", "Chromium.app", "Contents", "MacOS", "Chromium"),
    join("chrome-win", "chrome.exe"),
  ];
  const installs = readdirSync(root)
    .filter((entry) => entry.startsWith("chromium-"))
    .sort()
    .reverse();
  for (const install of installs) {
    for (const relative of relatives) {
      const candidate = join(root, install, relative);
      if (existsSync(candidate)) return candidate;
    }
  }
  return null;
}

const corePath = resolvePlaywrightCore();
if (!corePath) {
  console.error("  [ERROR] Could not locate playwright-core.");
  console.error("  Run pnpm install, or set PLAYWRIGHT_CORE_PATH to its index.mjs.");
  process.exit(1);
}
const { chromium } = await import(pathToFileURL(corePath).href);
const executablePath = resolveChromium();

const context = await chromium.launchPersistentContext(profileDir, {
  ...(executablePath ? { executablePath } : {}),
  headless: !values.headed,
  viewport,
  deviceScaleFactor: 1,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const page = context.pages()[0] ?? (await context.newPage());

const consoleErrors = [];
page.on("console", (message) => {
  if (message.type() === "error") consoleErrors.push(message.text().slice(0, 300));
});
page.on("pageerror", (error) => consoleErrors.push(`pageerror: ${String(error).slice(0, 300)}`));

let shotIndex = 0;
async function shot(name) {
  shotIndex += 1;
  const file = join(shotsDir, `${String(shotIndex).padStart(2, "0")}-${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log(`[shot] ${file}`);
  return file;
}

// A compact list of what is on screen. Reading this is much cheaper than
// reading a screenshot when all you need is to find a control, and it surfaces
// the aria-label of icon-only buttons that carry no text.
async function outline(selector = "body") {
  const items = await page.evaluate((sel) => {
    const root = document.querySelector(sel);
    if (!root) return [`(no element matches ${sel})`];
    const results = [];
    const nodes = root.querySelectorAll(
      "button, a, input, select, textarea, [role=button], [role=tab], [role=switch], [role=menuitem], h1, h2, h3, h4, label",
    );
    for (const element of nodes) {
      const box = element.getBoundingClientRect();
      if (box.width === 0 || box.height === 0) continue;
      const label = (
        element.getAttribute("aria-label") ||
        element.innerText ||
        element.value ||
        element.placeholder ||
        element.getAttribute("title") ||
        ""
      )
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 90);
      if (!label) continue;
      const role = element.getAttribute("role");
      const state = element.getAttribute("aria-checked") ?? element.getAttribute("aria-selected") ?? "";
      results.push(
        `${element.tagName.toLowerCase()}${role ? `[${role}]` : ""}${state ? `{${state}}` : ""} ` +
          `@${Math.round(box.x)},${Math.round(box.y)} :: ${label}`,
      );
    }
    return results;
  }, selector);
  console.log(items.join("\n"));
  return items;
}

// Click by visible text from inside the page. Prefix matching handles labels
// that carry a count badge ("Review Queue 2"), and the x-range narrows the
// search to one panel when the same words appear elsewhere in the DOM.
async function clickText(label, { exact = false, minX = 0, maxX = 100_000 } = {}) {
  return page.evaluate(
    ({ label, exact, minX, maxX }) => {
      const selector = "button, a, div[role=button], [role=tab], span, h2, h3, h4, label, div";
      for (const element of document.querySelectorAll(selector)) {
        const text = (element.innerText || "").replace(/\s+/g, " ").trim();
        const matched = exact ? text === label : text === label || text.startsWith(`${label} `);
        if (!matched) continue;
        const box = element.getBoundingClientRect();
        if (box.width === 0 || box.height === 0) continue;
        if (box.x < minX || box.x > maxX) continue;
        const target = element.closest("button, a, [role=button], [role=tab]") ?? element;
        target.scrollIntoView({ block: "center" });
        target.click();
        return text;
      }
      return null;
    },
    { label, exact, minX, maxX },
  );
}

// Playwright refuses to click an element covered by a sibling. When the overlap
// is cosmetic, dispatch the click from inside the page instead.
async function forceClick(selector) {
  return page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element) return false;
    element.scrollIntoView({ block: "center" });
    element.click();
    return true;
  }, selector);
}

// Toggles render as visually hidden 1x1 checkboxes, so they cannot be clicked
// by coordinates. Find the input whose nearest labelled ancestor starts with
// `rowLabel` and click the input itself.
async function setCheckbox(rowLabel, checked = true) {
  return page.evaluate(
    ({ rowLabel, checked }) => {
      for (const input of document.querySelectorAll("input[type=checkbox]")) {
        let context = "";
        let node = input.parentElement;
        for (let depth = 0; depth < 6 && node; depth += 1) {
          const text = (node.innerText || "").replace(/\s+/g, " ").trim();
          if (text.length > 5) {
            context = text;
            break;
          }
          node = node.parentElement;
        }
        if (!context.startsWith(rowLabel)) continue;
        if (input.checked === checked) return `already ${checked}`;
        input.click();
        return `set to ${checked}`;
      }
      return "checkbox not found";
    },
    { rowLabel, checked },
  );
}

const api = {
  page,
  context,
  baseUrl,
  shotsDir,
  profileDir,
  consoleErrors,
  shot,
  outline,
  clickText,
  forceClick,
  setCheckbox,
};

try {
  const step = await import(pathToFileURL(stepFile).href);
  if (typeof step.default !== "function") {
    throw new Error(`${stepFile} must default-export an async function.`);
  }
  await step.default(api);
} catch (error) {
  console.error("[step-error]", error);
  try {
    await shot("ERROR");
  } catch {
    // The page may already be gone; the original error is what matters.
  }
  process.exitCode = 1;
}

if (consoleErrors.length > 0) {
  console.log("");
  console.log("[console-errors]");
  for (const message of [...new Set(consoleErrors)].slice(0, 15)) console.log(`  ${message}`);
}

await context.close();
