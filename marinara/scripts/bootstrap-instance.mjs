#!/usr/bin/env node
// Prepares a local Marinara Engine instance for UI/UX exploration.
//
// Three independent steps, each skippable:
//   1. Write a .env suitable for a throwaway local instance (random
//      ENCRYPTION_KEY and ADMIN_SECRET, loopback host, no browser launch, no
//      auto-update).
//   2. Create an API connection pointing at the mock provider from
//      $HARNESS/start-mock-provider.mjs, mark it default, and test it.
//   3. Optionally install a capability package from the official catalog.
//
// Steps 2 and 3 talk to a running server. Privileged APIs accept loopback
// requests without a secret by default, so no header is needed on 127.0.0.1;
// pass --admin-secret when calling from anywhere else.
//
// See docs/development/ui-ux-exploration-harness.md.
import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";

const HELP = `Usage: node $HARNESS/bootstrap-instance.mjs [options]

Options:
  --base-url <url>         Engine base URL (default: http://127.0.0.1:7860, or BASE_URL).
  --mock-url <url>         Mock provider base URL (default: http://127.0.0.1:7877/v1).
  --name <text>            Connection name (default: Mock Local).
  --model <id>             Chat model id (default: mock-chat-large).
  --embedding-model <id>   Embedding model id (default: text-embedding-3-small).
  --max-context <number>   Context window to record (default: 32000).
  --api-key <text>         Placeholder key stored on the connection (default: mock-key).
  --repo-root <path>       Marinara Engine checkout that receives .env (default: current directory).
  --install <packageId>    Install this capability package from the official catalog.
  --admin-secret <secret>  Sent as X-Admin-Secret for non-loopback calls.
  --skip-env               Do not create or modify .env.
  --skip-connection        Do not create or update the connection.
  --force-env              Rewrite .env even if it already exists.
  --help                   Show this message.

Examples:
  node $HARNESS/bootstrap-instance.mjs --skip-connection
  node $HARNESS/bootstrap-instance.mjs --skip-env --install long-term-memory
`;

const { values } = parseArgs({
  options: {
    "base-url": { type: "string" },
    "mock-url": { type: "string" },
    name: { type: "string" },
    model: { type: "string" },
    "embedding-model": { type: "string" },
    "max-context": { type: "string" },
    "api-key": { type: "string" },
    "repo-root": { type: "string" },
    install: { type: "string" },
    "admin-secret": { type: "string" },
    "skip-env": { type: "boolean", default: false },
    "skip-connection": { type: "boolean", default: false },
    "force-env": { type: "boolean", default: false },
    help: { type: "boolean", default: false },
  },
  allowPositionals: false,
});

if (values.help) {
  process.stdout.write(HELP);
  process.exit(0);
}

// The Engine checkout, not the harness checkout: these scripts are meant to sit
// outside the repository they drive, so .env belongs wherever the command was
// run from rather than beside this file.
const repoRoot = resolve(values["repo-root"] ?? process.cwd());
const baseUrl = (values["base-url"] ?? process.env.BASE_URL ?? "http://127.0.0.1:7860").replace(/\/+$/, "");
const mockUrl = (values["mock-url"] ?? "http://127.0.0.1:7877/v1").replace(/\/+$/, "");
const connectionName = values.name ?? "Mock Local";
const model = values.model ?? "mock-chat-large";
const embeddingModel = values["embedding-model"] ?? "text-embedding-3-small";
const maxContext = Number.parseInt(values["max-context"] ?? "32000", 10);
const apiKey = values["api-key"] ?? "mock-key";

const ENV_OVERRIDES = {
  HOST: "127.0.0.1",
  AUTO_OPEN_BROWSER: "false",
  AUTO_UPDATE_ENABLED: "false",
  LOG_LEVEL: "info",
};

function step(message) {
  console.log(`  [..] ${message}`);
}

function done(message) {
  console.log(`  [ok] ${message}`);
}

function setEnvValue(content, key, value) {
  const active = new RegExp(`^${key}=.*$`, "m");
  if (active.test(content)) return content.replace(active, `${key}=${value}`);
  const commented = new RegExp(`^#\\s*${key}=.*$`, "m");
  if (commented.test(content)) return content.replace(commented, `${key}=${value}`);
  return `${content.replace(/\n*$/, "\n")}${key}=${value}\n`;
}

function writeEnvFile() {
  const envPath = join(repoRoot, ".env");
  const examplePath = join(repoRoot, ".env.example");
  if (existsSync(envPath) && !values["force-env"]) {
    done(".env already exists; left untouched (use --force-env to rewrite)");
    return;
  }
  if (!existsSync(examplePath)) {
    throw new Error(`Missing ${examplePath}. Run this script from a Marinara Engine checkout.`);
  }
  step("writing .env from .env.example");
  let content = readFileSync(examplePath, "utf8");
  content = setEnvValue(content, "ENCRYPTION_KEY", randomBytes(32).toString("hex"));
  content = setEnvValue(content, "ADMIN_SECRET", randomBytes(16).toString("hex"));
  for (const [key, value] of Object.entries(ENV_OVERRIDES)) content = setEnvValue(content, key, value);
  writeFileSync(envPath, content, "utf8");
  done(`.env written with a random ENCRYPTION_KEY and ADMIN_SECRET (${envPath})`);
}

async function api(path, method = "GET", body) {
  const headers = { "content-type": "application/json", Origin: baseUrl };
  if (values["admin-secret"]) headers["X-Admin-Secret"] = values["admin-secret"];
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  let parsed = text;
  try {
    parsed = JSON.parse(text);
  } catch {
    // Leave non-JSON responses as text so errors stay readable.
  }
  if (!response.ok) {
    throw new Error(`${method} ${path} responded ${response.status}: ${text.slice(0, 400)}`);
  }
  return parsed;
}

async function requireServer() {
  try {
    const health = await api("/api/health");
    done(`server reachable at ${baseUrl} (version ${health.version ?? "unknown"})`);
  } catch (error) {
    console.error("");
    console.error(`  [ERROR] Could not reach ${baseUrl}/api/health.`);
    console.error("  Start the server first: node packages/server/dist/index.js");
    console.error(`  Details: ${error.message}`);
    console.error("");
    process.exit(1);
  }
}

async function ensureConnection() {
  const existing = await api("/api/connections");
  const found = Array.isArray(existing) ? existing.find((entry) => entry.name === connectionName) : null;

  let connection = found;
  if (connection) {
    done(`reusing connection "${connectionName}" (${connection.id})`);
  } else {
    step(`creating connection "${connectionName}" -> ${mockUrl}`);
    // Default flags are deliberately omitted here. `isDefault`/`fallbackForMain`
    // and `defaultForAgents`/`fallbackForAgents` are mutually exclusive pairs:
    // sending both members of a pair in one request cancels both out. Set them
    // in a follow-up PATCH instead.
    connection = await api("/api/connections", "POST", {
      name: connectionName,
      provider: "custom",
      baseUrl: mockUrl,
      apiKey,
      model,
      maxContext,
      embeddingModel,
      treatAsLocalEndpoint: true,
    });
    done(`connection created (${connection.id})`);
  }

  step("marking the connection default for chats and agents");
  await api(`/api/connections/${connection.id}`, "PATCH", { isDefault: true, defaultForAgents: true });

  const verified = (await api("/api/connections")).find((entry) => entry.id === connection.id);
  done(
    `flags: isDefault=${verified?.isDefault} defaultForAgents=${verified?.defaultForAgents} ` +
      `fallbackForMain=${verified?.fallbackForMain} fallbackForAgents=${verified?.fallbackForAgents}`,
  );
  if (verified?.isDefault !== "true" || verified?.defaultForAgents !== "true") {
    console.warn("  [warn] Expected isDefault and defaultForAgents to be \"true\". Check the mutually exclusive pairs.");
  }

  step("testing the connection");
  const result = await api(`/api/connections/${connection.id}/test`, "POST", {});
  done(`test result: ${JSON.stringify(result).slice(0, 300)}`);
  return connection;
}

async function installPackage(packageId) {
  step("fetching the capability package catalog");
  const catalog = await api("/api/capability-packages/catalog");
  // Catalog entries carry their identity on the nested manifest.
  const entries = (Array.isArray(catalog) ? catalog : (catalog.packages ?? [])).map((entry) => ({
    id: entry.id ?? entry.manifest?.id,
    version: entry.version ?? entry.manifest?.version,
    restartRequired: entry.restartRequired ?? entry.manifest?.restartRequired ?? false,
  }));
  const match = entries.find((entry) => entry.id === packageId);
  if (!match) {
    const available = entries.map((entry) => entry.id).join(", ") || "(catalog empty)";
    throw new Error(`Package "${packageId}" is not in the catalog. Available: ${available}`);
  }
  done(`catalog entry found: ${match.id}@${match.version ?? "unknown"}` + (match.restartRequired ? " (restart required)" : ""));

  step(`installing ${packageId}`);
  const installed = await api(`/api/capability-packages/${packageId}/install`, "POST", {});
  const version = installed.version ?? installed.manifest?.version ?? "unknown";
  done(`install status: ${installed.status ?? "unknown"} (version ${version})`);

  if (installed.status === "restart-required") {
    console.log("");
    console.log(`  Restart the server to finish activating ${packageId}:`);
    console.log("    node packages/server/dist/index.js");
    console.log("  The log then reports: Activated and verified capability package");
    console.log("");
    return;
  }

  const active = await api("/api/capability-packages/installed");
  const entry = (Array.isArray(active) ? active : []).find((item) => item.id === packageId);
  done(`installed state: status=${entry?.status ?? "unknown"} readiness=${entry?.readiness ?? "unknown"}`);
}

try {
  if (!values["skip-env"]) writeEnvFile();

  if (values["skip-connection"] && !values.install) {
    console.log("");
    console.log("  Next: build and start the server, then rerun without --skip-connection.");
    console.log("    pnpm build && node packages/server/dist/index.js");
    console.log("");
    process.exit(0);
  }

  await requireServer();
  if (!values["skip-connection"]) await ensureConnection();
  if (values.install) await installPackage(values.install);
  console.log("");
  done("bootstrap complete");
} catch (error) {
  console.error("");
  console.error(`  [ERROR] ${error.message}`);
  console.error("");
  process.exit(1);
}
