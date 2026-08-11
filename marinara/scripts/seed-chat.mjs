#!/usr/bin/env node
// Seeds characters, a persona, a chat, and its message history through the REST
// API so a UI/UX exploration run has real content to look at. Game-mode
// fixtures additionally build a world, so the HUD, map, party, and NPC panels
// have state instead of placeholders.
//
// Content comes from a JSON fixture (--file) or from flags. The fixture format
// is documented in $HARNESS/fixtures/README.md; the shipped fixtures are the
// working examples:
//
//   {
//     "character": { "name": "...", "description": "...", "first_mes": "..." },
//     "characters": [{ "name": "..." }],
//     "persona": { "name": "...", "aboutMe": "..." },
//     "chat": { "name": "...", "mode": "conversation" },
//     "game": { "setupConfig": { ... }, "world": { ... } },
//     "messages": [{ "role": "user", "content": "...", "at": "-3d 21:12" }]
//   }
//
// Character fields use SillyTavern v2 card names (`first_mes`, not
// `firstMessage`) and the create request wraps them in a `data` object.
//
// See ../ui-ux-exploration-harness.md.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseArgs } from "node:util";

const HELP = `Usage: node $HARNESS/seed-chat.mjs [options]

Options:
  --file <path>            JSON fixture with characters, chat, and messages.
  --base-url <url>         Engine base URL (default: http://127.0.0.1:7860, or BASE_URL).
  --character <name>       Character name (overrides the fixture).
  --description <text>     Character description.
  --personality <text>     Character personality.
  --scenario <text>        Character scenario.
  --first-message <text>   Character greeting (stored as first_mes).
  --chat <name>            Chat name (overrides the fixture).
  --mode <mode>            conversation | roleplay | game (default: conversation).
  --message <role:text>    Append one message; repeatable. Roles: user, assistant.
  --now <iso>              Anchor for relative "at" timestamps (default: the current time).
  --new-character          Always create a character instead of reusing one by name.
  --admin-secret <secret>  Sent as X-Admin-Secret for non-loopback calls.
  --help                   Show this message.

Examples:
  node $HARNESS/seed-chat.mjs --file $HARNESS/fixtures/conversation-late-shift.json
  node $HARNESS/seed-chat.mjs --file $HARNESS/fixtures/game-ashfall-contract.json
  node $HARNESS/seed-chat.mjs --character Wren --chat "Memory test" \\
    --message "user:Hello there" --message "assistant:Hello yourself."
`;

const MODES = ["conversation", "roleplay", "game"];
/** Gap applied to a message with no "at", so a fixture can time only the beats it cares about. */
const DEFAULT_GAP_MS = 90_000;

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
    now: { type: "string" },
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

const primaryCharacter = {
  ...fixtureCharacter,
  name: values.character ?? fixtureCharacter.name,
  description: values.description ?? fixtureCharacter.description ?? "",
  personality: values.personality ?? fixtureCharacter.personality ?? "",
  scenario: values.scenario ?? fixtureCharacter.scenario ?? "",
  first_mes: values["first-message"] ?? fixtureCharacter.first_mes ?? "",
};

const extraCharacters = Array.isArray(fixture.characters) ? fixture.characters : [];
const chatName = values.chat ?? fixtureChat.name ?? (primaryCharacter.name ? `${primaryCharacter.name} — seed` : null);
const mode = values.mode ?? fixtureChat.mode ?? "conversation";

const flagMessages = (values.message ?? []).map((entry) => {
  const separator = entry.indexOf(":");
  if (separator < 1) fail(`--message must look like "role:text". Received: ${entry}`);
  return { role: entry.slice(0, separator).trim(), content: entry.slice(separator + 1).trim() };
});
const messages = [...(fixture.messages ?? []), ...flagMessages].map((entry) =>
  Array.isArray(entry) ? { role: entry[0], content: entry[1] } : entry,
);

if (!primaryCharacter.name) fail("A character name is required. Use --character or a fixture with character.name.");
if (!chatName) fail("A chat name is required. Use --chat or a fixture with chat.name.");
if (!MODES.includes(mode)) fail(`--mode must be one of ${MODES.join(", ")}. Received: ${mode}`);
for (const message of messages) {
  if (!["user", "assistant"].includes(message.role)) {
    fail(`Message role must be "user" or "assistant". Received: ${message.role}`);
  }
}
if (mode === "game" && !fixture.game) {
  console.warn('  [warn] Game-mode chat without a "game" block: the world, HUD, and map stay empty.');
}

// ── Timestamps ────────────────────────────────────────────────────────────────
// Fixtures describe when a beat happened, not the date they were written, so an
// "at" is either an absolute instant or an offset from the seeding run. A day
// offset may carry a wall-clock time, which is what puts a texting storyline at
// 03:12 on a night shift instead of whenever the script happened to run.
const RELATIVE_AT = /^([+-]?\d+(?:\.\d+)?)\s*([dhm])(?:\s+(\d{1,2}):(\d{2}))?$/;

const anchor = values.now ? new Date(values.now) : new Date();
if (Number.isNaN(anchor.getTime())) fail(`--now must be a parseable date. Received: ${values.now}`);

function parseAt(value, previousMs) {
  if (value == null) return previousMs == null ? anchor.getTime() : previousMs + DEFAULT_GAP_MS;

  const relative = String(value).trim().match(RELATIVE_AT);
  if (relative) {
    const [, amount, unit, hours, minutes] = relative;
    const scale = unit === "d" ? 86_400_000 : unit === "h" ? 3_600_000 : 60_000;
    const shifted = new Date(anchor.getTime() + Number.parseFloat(amount) * scale);
    if (hours != null) shifted.setHours(Number.parseInt(hours, 10), Number.parseInt(minutes, 10), 0, 0);
    return shifted.getTime();
  }

  const absolute = new Date(String(value));
  if (Number.isNaN(absolute.getTime())) fail(`Unparseable "at" value: ${value}`);
  return absolute.getTime();
}

// ── API ───────────────────────────────────────────────────────────────────────
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

async function ensureCharacter(card) {
  if (!values["new-character"]) {
    const response = await api("/api/characters");
    const existing = Array.isArray(response) ? response : (response.items ?? []);
    const found = existing.find((entry) => characterName(entry) === card.name);
    if (found) {
      console.log(`  [ok] reusing character "${card.name}" (${found.id})`);
      return found;
    }
  }
  // The character create request wraps card fields in `data`.
  const created = await api("/api/characters", "POST", { data: card });
  console.log(`  [ok] created character "${card.name}" (${created.id})`);
  return created;
}

async function ensurePersona(persona) {
  const existing = await api("/api/characters/personas/list");
  const list = Array.isArray(existing) ? existing : (existing.items ?? []);
  const found = list.find((entry) => entry.name === persona.name);
  if (found) {
    console.log(`  [ok] reusing persona "${persona.name}" (${found.id})`);
    return found;
  }
  const created = await api("/api/characters/personas", "POST", persona);
  console.log(`  [ok] created persona "${persona.name}" (${created.id})`);
  return created;
}

async function defaultConnectionId() {
  const connections = await api("/api/connections");
  const list = Array.isArray(connections) ? connections : (connections.items ?? []);
  // Connection flags are stored as the strings "true"/"false".
  const preferred = list.find((entry) => String(entry.isDefault) === "true") ?? list[0];
  return preferred?.id ?? null;
}

// ── Game mode ─────────────────────────────────────────────────────────────────
// A game chat is a chat plus a generated world. Posting the world through
// /game/setup/apply-json runs the same validation and persistence the wizard
// uses, minus the model call, so the HUD, map, NPC, and party panels come up
// populated and the GM tags in the seeded turns have something to refer to.
async function buildGameWorld({ chatId, characterIds, personaId }) {
  const game = fixture.game ?? {};
  const connectionId = game.connectionId ?? (await defaultConnectionId());
  if (!connectionId) fail("Game seeding needs a connection. Run bootstrap-instance.mjs without --skip-connection.");

  const setupConfig = {
    genre: "Fantasy",
    setting: "",
    tone: "Heroic",
    difficulty: "Normal",
    playerGoals: "",
    gmMode: "standalone",
    rating: "sfw",
    ...(game.setupConfig ?? {}),
    partyCharacterIds: characterIds,
    personaId: personaId ?? null,
  };

  const created = await api("/api/game/create", "POST", {
    name: chatName,
    chatId,
    connectionId,
    preferences: game.preferences ?? "",
    setupConfig,
  });
  console.log(`  [ok] created game ${created.gameId}`);

  await api("/api/game/setup/apply-json", "POST", { chatId, rawJson: JSON.stringify(game.world ?? {}) });
  console.log("  [ok] applied the world payload (status: ready)");

  const started = await api("/api/game/start", "POST", { chatId });
  console.log(`  [ok] game status: ${started.status}`);
}

// ── Messages ──────────────────────────────────────────────────────────────────
function resolveReactions(entry, charactersByName, fallbackCharacterId) {
  if (!Array.isArray(entry.reactions)) return undefined;
  return entry.reactions.map((reaction) => ({
    emoji: reaction.emoji,
    by: (reaction.by ?? ["user"]).map((who) => {
      if (who === "user") return "user";
      if (who === "character") return fallbackCharacterId;
      const match = charactersByName.get(who);
      if (!match) fail(`Reaction "by" names an unknown character: ${who}`);
      return match;
    }),
  }));
}

try {
  const record = await ensureCharacter(primaryCharacter);
  const charactersByName = new Map([[primaryCharacter.name, record.id]]);
  for (const card of extraCharacters) {
    if (!card?.name) fail("Every entry in characters[] needs a name.");
    const created = await ensureCharacter(card);
    charactersByName.set(card.name, created.id);
  }

  const persona = fixture.persona ? await ensurePersona(fixture.persona) : null;

  const partyNames = fixture.game?.party;
  const characterIds = Array.isArray(partyNames)
    ? partyNames.map((name) => charactersByName.get(name) ?? fail(`party names an unknown character: ${name}`))
    : [...charactersByName.values()];

  const chat = await api("/api/chats", "POST", {
    name: chatName,
    mode,
    characterIds,
    personaId: persona?.id ?? null,
  });
  console.log(`  [ok] created ${mode} chat "${chatName}" (${chat.id})`);

  if (fixture.game) await buildGameWorld({ chatId: chat.id, characterIds, personaId: persona?.id ?? null });

  let previousMs = null;
  let firstMs = null;
  for (const message of messages) {
    const timestamp = parseAt(message.at, previousMs);
    if (previousMs != null && timestamp < previousMs) {
      console.warn(`  [warn] "at" moves backwards at: ${String(message.content).slice(0, 60)}`);
    }
    previousMs = timestamp;
    firstMs ??= timestamp;

    const speakerId = message.role === "assistant" ? (charactersByName.get(message.character) ?? record.id) : null;
    const reactions = resolveReactions(message, charactersByName, speakerId ?? record.id);
    const createdAt = new Date(timestamp).toISOString();

    // The server fills in the rest of `extra` (displayText, token counts,
    // generation info), so send only the fields the fixture set.
    const extra = {};
    if (reactions) extra.reactions = reactions;
    if (message.hiddenFromAI !== undefined) extra.hiddenFromAI = message.hiddenFromAI;

    await api(`/api/chats/${chat.id}/messages`, "POST", {
      role: message.role,
      content: message.content,
      characterId: speakerId,
      createdAt,
      updatedAt: createdAt,
      ...(Object.keys(extra).length > 0 ? { extra } : {}),
    });
  }
  const span = firstMs == null ? "none" : `${new Date(firstMs).toISOString()} → ${new Date(previousMs).toISOString()}`;
  console.log(`  [ok] seeded ${messages.length} messages (${span})`);

  console.log("");
  console.log(`CHARACTER_ID=${record.id}`);
  if (persona) console.log(`PERSONA_ID=${persona.id}`);
  console.log(`CHAT_ID=${chat.id}`);
} catch (error) {
  fail(error.message);
}
