#!/usr/bin/env node
// Seeds a character, a chat, and its message history through the REST API so a
// UI/UX exploration run has real content to look at.
//
// Content comes from a JSON fixture (--file) or from flags. The fixture format
// is documented in $HARNESS/fixtures/example-chat.json:
//
//   {
//     "character": { "name": "...", "description": "...", "first_mes": "..." },
//     "chat": { "name": "...", "mode": "conversation" },
//     "messages": [{ "role": "user", "content": "..." }]
//   }
//
// Character fields use SillyTavern v2 card names (`first_mes`, not
// `firstMessage`) and the create request wraps them in a `data` object.
//
// See docs/development/ui-ux-exploration-harness.md.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseArgs } from "node:util";

const HELP = `Usage: node $HARNESS/seed-chat.mjs [options]

Options:
  --file <path>            JSON fixture with character, chat, and messages.
  --base-url <url>         Engine base URL (default: http://127.0.0.1:7860, or BASE_URL).
  --character <name>       Character name (overrides the fixture).
  --description <text>     Character description.
  --personality <text>     Character personality.
  --scenario <text>        Character scenario.
  --first-message <text>   Character greeting (stored as first_mes).
  --chat <name>            Chat name (overrides the fixture).
  --mode <mode>            conversation | roleplay | game (default: conversation).
  --message <role:text>    Append one message; repeatable. Roles: user, assistant.
  --new-character          Always create a character instead of reusing one by name.
  --admin-secret <secret>  Sent as X-Admin-Secret for non-loopback calls.
  --help                   Show this message.

Examples:
  node $HARNESS/seed-chat.mjs --file $HARNESS/fixtures/example-chat.json
  node $HARNESS/seed-chat.mjs --character Wren --chat "Memory test" \\
    --message "user:Hello there" --message "assistant:Hello yourself."
`;

const MODES = ["conversation", "roleplay", "game"];

const { values } = parseArgs({
  options: {
    file: { type: "string" },
    "base-url": { type: "string" },
    character: { type: "string" },
    description: { type: "string" },
    personality: { type: "string" },
    scenario: { type: "string" },
    "first-message": { type: "string" },
    chat: { type: "string" },
    mode: { type: "string" },
    message: { type: "string", multiple: true },
    "new-character": { type: "boolean", default: false },
    "admin-secret": { type: "string" },
    help: { type: "boolean", default: false },
  },
  allowPositionals: false,
});

if (values.help) {
  process.stdout.write(HELP);
  process.exit(0);
}

const baseUrl = (values["base-url"] ?? process.env.BASE_URL ?? "http://127.0.0.1:7860").replace(/\/+$/, "");

function fail(message) {
  console.error("");
  console.error(`  [ERROR] ${message}`);
  console.error("");
  process.exit(1);
}

const fixture = values.file ? JSON.parse(readFileSync(resolve(values.file), "utf8")) : {};
const fixtureCharacter = fixture.character ?? {};
const fixtureChat = fixture.chat ?? {};

const character = {
  name: values.character ?? fixtureCharacter.name,
  description: values.description ?? fixtureCharacter.description ?? "",
  personality: values.personality ?? fixtureCharacter.personality ?? "",
  scenario: values.scenario ?? fixtureCharacter.scenario ?? "",
  first_mes: values["first-message"] ?? fixtureCharacter.first_mes ?? "",
};

const chatName = values.chat ?? fixtureChat.name ?? (character.name ? `${character.name} — seed` : null);
const mode = values.mode ?? fixtureChat.mode ?? "conversation";

const flagMessages = (values.message ?? []).map((entry) => {
  const separator = entry.indexOf(":");
  if (separator < 1) fail(`--message must look like "role:text". Received: ${entry}`);
  return { role: entry.slice(0, separator).trim(), content: entry.slice(separator + 1).trim() };
});
const messages = [...(fixture.messages ?? []), ...flagMessages].map((entry) =>
  Array.isArray(entry) ? { role: entry[0], content: entry[1] } : entry,
);

if (!character.name) fail("A character name is required. Use --character or a fixture with character.name.");
if (!chatName) fail("A chat name is required. Use --chat or a fixture with chat.name.");
if (!MODES.includes(mode)) fail(`--mode must be one of ${MODES.join(", ")}. Received: ${mode}`);
for (const message of messages) {
  if (message.role !== "user" && message.role !== "assistant") {
    fail(`Message role must be "user" or "assistant". Received: ${message.role}`);
  }
}

// Listed characters keep their card fields in a JSON string under `data`, so
// the name is not a top-level property.
function characterName(entry) {
  if (typeof entry?.name === "string") return entry.name;
  const card = entry?.data;
  if (card && typeof card === "object") return card.name ?? null;
  if (typeof card !== "string") return null;
  try {
    return JSON.parse(card).name ?? null;
  } catch {
    return null;
  }
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
  if (!response.ok) throw new Error(`${method} ${path} responded ${response.status}: ${text.slice(0, 400)}`);
  return parsed;
}

try {
  let record = null;
  if (!values["new-character"]) {
    const response = await api("/api/characters");
    const existing = Array.isArray(response) ? response : (response.items ?? []);
    record = existing.find((entry) => characterName(entry) === character.name) ?? null;
  }
  if (record) {
    console.log(`  [ok] reusing character "${character.name}" (${record.id})`);
  } else {
    // The character create request wraps card fields in `data`.
    record = await api("/api/characters", "POST", { data: character });
    console.log(`  [ok] created character "${character.name}" (${record.id})`);
  }

  const chat = await api("/api/chats", "POST", { name: chatName, mode, characterIds: [record.id] });
  console.log(`  [ok] created ${mode} chat "${chatName}" (${chat.id})`);

  for (const message of messages) {
    await api(`/api/chats/${chat.id}/messages`, "POST", {
      role: message.role,
      content: message.content,
      characterId: message.role === "assistant" ? record.id : null,
    });
  }
  console.log(`  [ok] seeded ${messages.length} messages`);

  console.log("");
  console.log(`CHARACTER_ID=${record.id}`);
  console.log(`CHAT_ID=${chat.id}`);
} catch (error) {
  fail(error.message);
}
