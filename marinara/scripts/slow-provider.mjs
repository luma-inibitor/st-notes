#!/usr/bin/env node
// OpenAI-compatible provider that keeps generations in flight for a long time.
// Model "slow-chat" drips tokens; model "stall-chat" sends one chunk and then
// holds the stream open forever. Every request is logged with a timestamp.
//
//   node $HARNESS/slow-provider.mjs [--port 7877] [--tokens 1500] [--interval-ms 50]
//                                   [--nonstream-delay-ms 60000] [--stall]
//
// --stall makes every model behave like stall-chat. Non-streaming requests
// (agents) wait --nonstream-delay-ms before answering. Companion to
// start-mock-provider.mjs, which answers instantly and is the wrong tool when
// the point is to hold a socket open.
import { createServer } from "node:http";
import { parseArgs } from "node:util";

const { values: v } = parseArgs({ options: {
  port: { type: "string", default: "7877" },
  tokens: { type: "string", default: "1500" },
  "interval-ms": { type: "string", default: "50" },
  "nonstream-delay-ms": { type: "string", default: "60000" },
  stall: { type: "boolean", default: false },
}});
const PORT = +v.port, TOKENS = +v.tokens, INTERVAL = +v["interval-ms"], NONSTREAM = +v["nonstream-delay-ms"];
const WORDS = "the path winds on through mist and stone while lantern light flickers against the wet walls and every step echoes twice".split(" ");
const ts = () => new Date().toISOString().slice(11, 23);
const log = (...a) => process.stdout.write(`[slow-provider ${ts()}] ${a.join(" ")}\n`);
let seq = 0;

function embed(text) { const d = new Float64Array(384); for (const t of String(text).toLowerCase().split(/\W+/)) { let h = 2166136261; for (const c of t) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } d[Math.abs(h) % 384] += 1; } let n = Math.sqrt(d.reduce((s, x) => s + x * x, 0)) || 1; return Array.from(d, (x) => x / n); }
const chunk = (id, model, delta, fin = null) => `data: ${JSON.stringify({ id, object: "chat.completion.chunk", created: Math.floor(Date.now() / 1000), model, choices: [{ index: 0, delta, finish_reason: fin }] })}\n\n`;

createServer(async (req, res) => {
  const path = new URL(req.url, "http://x").pathname;
  const chunks = []; for await (const c of req) chunks.push(c);
  let body = {}; try { body = JSON.parse(Buffer.concat(chunks).toString()); } catch {}
  if (path.endsWith("/models")) { res.writeHead(200, { "content-type": "application/json" }).end(JSON.stringify({ object: "list", data: [{ id: "slow-chat", object: "model" }, { id: "stall-chat", object: "model" }, { id: "text-embedding-3-small", object: "model" }] })); return; }
  if (path.endsWith("/embeddings")) { const input = Array.isArray(body.input) ? body.input : [body.input ?? ""]; res.writeHead(200, { "content-type": "application/json" }).end(JSON.stringify({ object: "list", data: input.map((t, index) => ({ object: "embedding", index, embedding: embed(t) })), usage: { prompt_tokens: 1, total_tokens: 1 } })); return; }
  if (!path.endsWith("/completions")) { res.writeHead(404).end("{}"); return; }
  const id = `req-${++seq}`, model = body.model || "slow-chat";
  const stall = v.stall || model === "stall-chat";
  const sys = (body.messages ?? []).map((m) => (typeof m.content === "string" ? m.content : "")).join(" ").slice(0, 80).replace(/\s+/g, " ");
  log(id, "start", body.stream ? "stream" : "nonstream", `schema=${!!body.response_format?.json_schema}`, `msgs=${body.messages?.length}`, JSON.stringify(sys));
  const t0 = Date.now();
  res.on("close", () => log(id, "closed after", Date.now() - t0, "ms"));
  if (!body.stream) {
    await new Promise((r) => setTimeout(r, stall ? 2 ** 31 - 1 : NONSTREAM));
    res.writeHead(200, { "content-type": "application/json" }).end(JSON.stringify({ id, object: "chat.completion", model, choices: [{ index: 0, message: { role: "assistant", content: body.response_format?.json_schema ? "{}" : WORDS.join(" ") }, finish_reason: "stop" }], usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 } }));
    log(id, "done nonstream"); return;
  }
  res.writeHead(200, { "content-type": "text/event-stream", "cache-control": "no-cache", connection: "keep-alive" });
  res.write(chunk(id, model, { role: "assistant", content: "" }));
  res.write(chunk(id, model, { content: WORDS[0] + " " }));
  if (stall) { log(id, "stalling (holding stream open)"); return; }
  for (let i = 1; i < TOKENS && !res.destroyed; i++) {
    await new Promise((r) => setTimeout(r, INTERVAL));
    res.write(chunk(id, model, { content: WORDS[i % WORDS.length] + (i % 17 === 0 ? ".\n\n" : " ") }));
  }
  if (res.destroyed) return;
  res.write(chunk(id, model, {}, "stop")); res.write("data: [DONE]\n\n"); res.end();
  log(id, "done stream", Date.now() - t0, "ms");
}).listen(PORT, "127.0.0.1", () => log(`listening on http://127.0.0.1:${PORT}/v1 tokens=${TOKENS} interval=${INTERVAL}ms stall=${v.stall}`));
