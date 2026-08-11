# Seed fixtures

Content for `$HARNESS/seed-chat.mjs`. Each file is one chat: the cards it needs,
the chat itself, and its message history.

```bash
node $HARNESS/seed-chat.mjs --file $HARNESS/fixtures/conversation-late-shift.json
```

| Fixture | Mode | Messages | What it is for |
| --- | --- | --- | --- |
| `conversation-late-shift.json` | conversation | 53 | A texting storyline over six days: day dividers, odd-hour timestamps, reactions, double-texting. |
| `roleplay-stoke-moran.json` | roleplay | 37 | A long-prose Roleplay session adapted from *The Adventure of the Speckled Band* (Conan Doyle, 1892, public domain). |
| `game-ashfall-contract.json` | game | 23 | A Game Mode session with a built world: map, NPCs, party, HUD widgets, and GM command tags in the turns. |

All three are long on purpose. Both Conversation and Roleplay cross the client's
history page size, so opening them shows a **Load More** button, and there is
enough specific, memorable detail — names, dates, sums, promises — for
extraction and summary agents to have something to find. Three lines of "hello"
exercise neither.

For the minimal shape, read the Format section below rather than copying a
fixture: a character name, a chat name, a mode, and a list of messages is a
valid file.

## Format

Everything is optional except `character.name`, `chat.name`, and `chat.mode`.

```jsonc
{
  // The chat's main character. SillyTavern v2 card names: first_mes, not firstMessage.
  "character": {
    "name": "Devi Okonkwo",
    "description": "...",
    "personality": "...",
    "scenario": "...",
    "first_mes": "...",
    // Conversation-only profile fields, ignored in Roleplay and Game.
    "convoDisplayName": "devi 🚑",
    "aboutMe": "..."
  },

  // Further cards — group chat participants, or a Game Mode party.
  "characters": [{ "name": "Brother Ostrek", "description": "..." }],

  // Who the user plays. Created if missing, then attached to the chat.
  "persona": { "name": "Ari Salgado", "description": "...", "aboutMe": "..." },

  "chat": { "name": "Devi — the Marcus problem", "mode": "conversation" },

  "messages": [
    {
      "role": "user",              // user | assistant
      "content": "...",
      "at": "-5d 03:12",           // see Timestamps
      "character": "Sella Vane",   // which card said it; defaults to the main character
      "reactions": [{ "emoji": "❤️", "by": ["user"] }],
      "hiddenFromAI": false        // seed a message the UI shows but the prompt skips
    }
  ]
}
```

Cards are reused by name. Seeding the same fixture twice creates a second chat
against the same character and persona, which is usually what you want; pass
`--new-character` when it is not.

### Timestamps

`at` is either an absolute instant (`"2026-08-04T23:41:00Z"`) or an offset from
the moment you seed:

| Form | Means |
| --- | --- |
| `-6d 23:41` | Six days ago, at 23:41 local time |
| `-90m` | Ninety minutes ago |
| `-3h` | Three hours ago |
| *(omitted)* | 90 seconds after the previous message |

Offsets keep a fixture permanently fresh: a chat seeded today still reads as
"Yesterday at 10:35 PM", which is what makes day dividers, relative timestamps,
and the day-boundary summary bridge appear at all. Pass `--now <iso>` to pin the
anchor when you want two runs to produce byte-identical history.

Timestamps are honoured exactly, so a fixture is responsible for keeping them in
order; the seeder warns when one moves backwards.

### Reactions

`by` takes the string `user`, the string `character` (whoever authored the
message), or a card name from this fixture. Reactions render in Conversation
Mode only.

## Game Mode fixtures

A Game Mode chat is a chat plus a generated world. Without one, the map, HUD,
party, and NPC panels come up empty and the GM command tags in the turns have
nothing to refer to. A `game` block builds that world through the same endpoints
the setup wizard uses, minus the model call:

```jsonc
"game": {
  "party": ["Sella Vane", "Brother Ostrek"],  // names from character/characters
  "preferences": "Investigation over combat.",
  "setupConfig": { "genre": "...", "setting": "...", "tone": "...", "difficulty": "...", "gmMode": "standalone" },
  "world": { /* the world-generation payload: see below */ }
}
```

`world` is exactly what the GM returns from world generation, so its top-level
keys are fixed: `worldOverview`, `storyArc`, `plotTwists`, `startingMap`,
`startingNpcs`, `partyArcs`, `characterCards`, `artStylePrompt`, and
`blueprint`. `game-ashfall-contract.json` is a filled-in example of every one.
Region names on the node map are drawn in a tiny circle — keep them under about
twelve characters.

HUD widgets appear in two places in that fixture, and both are load-bearing:
`blueprint.hudWidgets` is what world generation produces, and
`setupConfig.customHudWidgets` is what the running HUD reads. Keep them
identical, and keep the list to four — that is the cap the setup config enforces.

### What seeded GM tags do and do not do

The turns carry real GM command tags (`[bg:]`, `[music:]`, `[choices:]`,
`[skill_check:]`, `[inventory:]`, `[widget:]`, `[reputation:]`, `[state:]`,
`[map_update:]`). On a seeded chat these are **replayed, not executed**: the
client parses each turn as it displays it, so choice cards, scene cues, and the
skill-check rows in the session log all render, while durable state — widget
values, inventory, reputation, discovered map nodes — stays wherever the world
payload put it, because that state is written during generation and there was no
generation here.

Set the state you want to photograph in `world`, and treat the tags in the turns
as what the screen should show.

Audio tags reference the shipped asset library by path, so
`[ambient: ambient:interior:dungeon-cave]` and
`[music: music:exploration:horror:tense:dark-forest]` resolve to real files.
`[bg:]` tags do not: backgrounds are generated or uploaded, so with visual
generation off the scene area stays empty by design.
