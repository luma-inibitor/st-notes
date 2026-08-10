#!/usr/bin/env node
// Mock OpenAI-compatible provider for UI/UX exploration.
//
// Serves /v1/models, /v1/embeddings, and /v1/chat/completions (streaming and
// non-streaming) so Marinara Engine and installed agent packages can be driven
// end to end without a real API key and without network access.
//
// Two behaviors make it useful rather than merely quiet:
//   1. Embeddings are deterministic hashes of the input text, so semantic
//      recall and knowledge retrieval return stable, plausible results offline.
//   2. When a request carries `response_format.json_schema`, the reply is
//      synthesized from that schema, so structured-output agents receive data
//      they can parse instead of prose they reject.
//
// Pass --capture-dir to write every request body to disk. Reading a captured
// request is the fastest way to learn what prompt and schema an agent actually
// sends, which is what a custom responder needs in order to answer usefully.
//
// See docs/development/ui-ux-exploration-harness.md.
import { createServer } from "node:http";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { pathToFileURL } from "node:url";

const HELP = `Usage: node $HARNESS/start-mock-provider.mjs [options]

Options:
  --port <number>        Port to listen on (default: 7877, or MOCK_PORT).
  --host <address>       Address to bind (default: 127.0.0.1).
  --dims <number>        Embedding dimensions (default: 384).
  --models <list>        Comma-separated model ids to advertise
                         (default: mock-chat-large,mock-chat-small,text-embedding-3-small).
  --reply <text>         Plain-text reply used when no schema is requested.
  --responder <file>     ES module whose default export builds replies. It is
                         called with { body, messages, text, schema, helpers }
                         and may return a string, an object, or null to fall
                         back to the built-in behavior.
                         Example: $HARNESS/responders/example-schema-responder.mjs
  --capture-dir <dir>    Write each request body here as NNN-<route>.json plus
                         last-request.json.
  --quiet                Do not log each request.
  --help                 Show this message.
`;

const { values } = parseArgs({
  options: {
    port: { type: "string" },
    host: { type: "string" },
    dims: { type: "string" },
    models: { type: "string" },
    reply: { type: "string" },
    responder: { type: "string" },
    "capture-dir": { type: "string" },
    quiet: { type: "boolean", default: false },
    help: { type: "boolean", default: false },
  },
  allowPositionals: false,
});

if (values.help) {
  process.stdout.write(HELP);
  process.exit(0);
}

const PORT = Number.parseInt(values.port ?? process.env.MOCK_PORT ?? "7877", 10);
const HOST = values.host ?? "127.0.0.1";
const DIMS = Number.parseInt(values.dims ?? "384", 10);
const MODELS = (values.models ?? "mock-chat-large,mock-chat-small,text-embedding-3-small")
  .split(",")
  .map((entry) => entry.trim())
  .filter(Boolean);
const FALLBACK_REPLY = values.reply ?? "Understood. I have noted that and will keep it in mind as we talk.";
const CAPTURE_DIR = values["capture-dir"] ? resolve(values["capture-dir"]) : null;

if (!Number.isFinite(PORT) || PORT <= 0 || PORT > 65_535) {
  console.error(`  [ERROR] --port must be a number from 1 to 65535. Received: ${values.port}`);
  process.exit(1);
}
if (!Number.isFinite(DIMS) || DIMS < 8) {
  console.error(`  [ERROR] --dims must be a number of at least 8. Received: ${values.dims}`);
  process.exit(1);
}
if (CAPTURE_DIR) mkdirSync(CAPTURE_DIR, { recursive: true });

const responder = values.responder
  ? (await import(pathToFileURL(resolve(values.responder)).href)).default
  : null;
if (values.responder && typeof responder !== "function") {
  console.error(`  [ERROR] ${values.responder} must default-export a function.`);
  process.exit(1);
}

function log(...parts) {
  if (!values.quiet) process.stdout.write(`[mock-provider] ${parts.join(" ")}\n`);
}

// Deterministic pseudo-embedding: hash each token into a fixed-size vector and
// L2-normalize it. Similar text produces similar vectors, which is all that
// recall and retrieval need in order to behave sensibly offline.
function embed(text) {
  const vector = new Float64Array(DIMS);
  const tokens = String(text).toLowerCase().match(/[a-z0-9']+/g) ?? [];
  for (const token of tokens) {
    let hash = 2_166_136_261;
    for (let index = 0; index < token.length; index += 1) {
      hash ^= token.charCodeAt(index);
      hash = Math.imul(hash, 16_777_619);
    }
    vector[Math.abs(hash) % DIMS] += 1;
    vector[Math.abs(hash >> 8) % DIMS] += 0.5;
  }
  let norm = 0;
  for (const value of vector) norm += value * value;
  norm = Math.sqrt(norm) || 1;
  return Array.from(vector, (value) => value / norm);
}

let uuidCounter = 0;
function stableUuid() {
  uuidCounter += 1;
  return `00000000-0000-4000-8000-${uuidCounter.toString(16).padStart(12, "0")}`;
}

function placeholderString(schema, key) {
  if (Array.isArray(schema.enum) && schema.enum.length > 0) return schema.enum[0];
  if (schema.const !== undefined) return schema.const;
  if (schema.format === "uuid") return stableUuid();
  if (schema.format === "date-time") return new Date().toISOString();
  const label = schema.title ?? key ?? "value";
  return `mock ${label}`;
}

// Walk a JSON Schema and build a value that satisfies it. Enums, consts, and
// minimum counts are honored because agents usually validate them; anything
// unconstrained becomes an obvious "mock" placeholder so captured output is
// easy to recognize in the UI.
function synthesize(schema, key) {
  if (!schema || typeof schema !== "object") return null;
  if (Array.isArray(schema.enum) && schema.enum.length > 0) return schema.enum[0];
  if (schema.const !== undefined) return schema.const;
  for (const combinator of ["anyOf", "oneOf", "allOf"]) {
    if (Array.isArray(schema[combinator]) && schema[combinator].length > 0) {
      return synthesize(schema[combinator][0], key);
    }
  }

  const type = Array.isArray(schema.type) ? schema.type.find((entry) => entry !== "null") : schema.type;
  switch (type ?? (schema.properties ? "object" : schema.items ? "array" : "string")) {
    case "object": {
      const result = {};
      for (const [name, child] of Object.entries(schema.properties ?? {})) {
        result[name] = synthesize(child, name);
      }
      return result;
    }
    case "array": {
      const count = Math.max(1, Number(schema.minItems ?? 1));
      return Array.from({ length: count }, () => synthesize(schema.items ?? {}, key));
    }
    case "integer":
    case "number": {
      const minimum = Number(schema.minimum ?? schema.exclusiveMinimum ?? 1);
      return type === "integer" ? Math.ceil(minimum) : minimum;
    }
    case "boolean":
      return true;
    case "null":
      return null;
    default:
      return placeholderString(schema, key);
  }
}

function messageText(messages) {
  return (messages ?? [])
    .map((message) => (typeof message.content === "string" ? message.content : ""))
    .join("\n");
}

function buildReply(body) {
  const schema = body.response_format?.json_schema?.schema ?? null;
  const messages = body.messages ?? [];
  const context = {
    body,
    messages,
    text: messageText(messages),
    schema,
    helpers: { synthesize, stableUuid, embed },
  };

  if (responder) {
    const custom = responder(context);
    if (typeof custom === "string") return custom;
    if (custom && typeof custom === "object") return JSON.stringify(custom);
  }
  if (schema) return JSON.stringify(synthesize(schema, "root"));
  return FALLBACK_REPLY;
}

let captureCounter = 0;
function capture(route, body) {
  if (!CAPTURE_DIR) return;
  captureCounter += 1;
  const serialized = JSON.stringify(body, null, 2);
  const slug = route.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "") || "request";
  writeFileSync(join(CAPTURE_DIR, `${String(captureCounter).padStart(3, "0")}-${slug}.json`), serialized);
  writeFileSync(join(CAPTURE_DIR, "last-request.json"), serialized);
}

function sseChunk(id, model, delta, finishReason = null) {
  const payload = {
    id,
    object: "chat.completion.chunk",
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [{ index: 0, delta, finish_reason: finishReason }],
  };
  return `data: ${JSON.stringify(payload)}\n\n`;
}

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  if (chunks.length === 0) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return {};
  }
}

function sendJson(response, status, payload) {
  response.writeHead(status, { "content-type": "application/json" }).end(JSON.stringify(payload));
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://${HOST}:${PORT}`);
  const path = url.pathname.replace(/\/+$/, "") || "/";

  response.setHeader("access-control-allow-origin", "*");
  response.setHeader("access-control-allow-headers", "*");
  response.setHeader("access-control-allow-methods", "GET,POST,OPTIONS");
  if (request.method === "OPTIONS") {
    response.writeHead(204).end();
    return;
  }

  log(request.method, path);

  if (path.endsWith("/models")) {
    sendJson(response, 200, {
      object: "list",
      data: MODELS.map((id) => ({ id, object: "model", created: 1_700_000_000, owned_by: "mock" })),
    });
    return;
  }

  if (path.endsWith("/embeddings")) {
    const body = await readBody(request);
    capture("embeddings", body);
    const input = Array.isArray(body.input) ? body.input : [body.input ?? ""];
    sendJson(response, 200, {
      object: "list",
      model: body.model || "text-embedding-3-small",
      data: input.map((text, index) => ({ object: "embedding", index, embedding: embed(text) })),
      usage: { prompt_tokens: 8, total_tokens: 8 },
    });
    return;
  }

  if (path.endsWith("/chat/completions") || path.endsWith("/completions")) {
    const body = await readBody(request);
    capture("chat-completions", body);
    const model = body.model || MODELS[0] || "mock-chat-large";
    const text = buildReply(body);
    const id = `chatcmpl-mock-${Math.abs(Math.round(Math.random() * 1e9))}`;

    if (body.stream) {
      response.writeHead(200, {
        "content-type": "text/event-stream",
        "cache-control": "no-cache",
        connection: "keep-alive",
      });
      response.write(sseChunk(id, model, { role: "assistant", content: "" }));
      for (const piece of text.match(/[\s\S]{1,64}/g) ?? []) {
        response.write(sseChunk(id, model, { content: piece }));
      }
      response.write(sseChunk(id, model, {}, "stop"));
      response.write("data: [DONE]\n\n");
      response.end();
      return;
    }

    sendJson(response, 200, {
      id,
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model,
      choices: [{ index: 0, message: { role: "assistant", content: text }, finish_reason: "stop" }],
      usage: { prompt_tokens: 100, completion_tokens: 60, total_tokens: 160 },
    });
    return;
  }

  sendJson(response, 404, { error: { message: `No mock route for ${path}` } });
});

server.once("error", (error) => {
  if (error && typeof error === "object" && "code" in error && error.code === "EADDRINUSE") {
    console.error(`  [ERROR] Port ${PORT} is already in use. Start the mock provider on another port:`);
    console.error(`    node $HARNESS/start-mock-provider.mjs --port ${PORT + 1}`);
  } else {
    console.error(error);
  }
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  log(`listening on http://${HOST}:${PORT}/v1`);
  if (CAPTURE_DIR) log(`capturing requests to ${CAPTURE_DIR}`);
  if (values.responder) log(`using responder ${values.responder}`);
});
