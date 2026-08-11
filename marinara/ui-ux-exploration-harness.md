# UI/UX Exploration Harness (Developers)

This guide explains how to stand up a local Marinara Engine instance, install an agent package, seed test content, and drive the UI with Playwright to collect screenshots. It needs no real LLM API key and no network access beyond the package catalog.

Use it when you want to look at a feature, not test it. The repository's `pnpm smoke:ui` lane wipes its fixtures on every run, which is right for a smoke test and wrong for exploration. This harness keeps one long-lived instance with seeded data and a persistent browser profile, so you can poke at a screen across many small runs.

The scripts live beside this guide, in [`scripts/`](scripts/). They are
standalone Node ESM with no dependencies, and they talk to the Engine over HTTP,
so they do not need to sit inside the Engine checkout.

Commands below assume `$HARNESS` points at that folder and that you run them from
your Marinara Engine checkout root:

```bash
export HARNESS=/path/to/st-notes/marinara/scripts
```

| Script | Purpose |
| --- | --- |
| `start-mock-provider.mjs`                 | OpenAI-compatible provider that answers chat, embedding, and model requests. |
| `bootstrap-instance.mjs`                  | Writes `.env`, creates and defaults the mock connection, installs a package. |
| `seed-chat.mjs`                           | Creates a character, a chat, and its message history through the REST API.   |
| `drive-browser.mjs`                       | Playwright driver with a persistent profile and screenshot helpers.          |
| `steps/example-tour.mjs`                  | Example step module for the driver.                                          |
| `responders/example-schema-responder.mjs` | Example of building a schema-valid reply for a structured-output agent.      |
| `fixtures/example-chat.json`              | Example seed content.                                                        |

Every script is Node ESM with no dependencies of its own and prints `--help`.

## Prerequisites

Marinara Engine requires Node `>=24 <27` (`.nvmrc` pins 25) and pnpm 10.34.5. If the machine ships an older Node, install a supported one side by side rather than downgrading the repo:

```bash
curl -sL -o node24.tar.xz https://nodejs.org/dist/v24.11.0/node-v24.11.0-linux-x64.tar.xz
mkdir -p /opt/node24
tar -xJf node24.tar.xz -C /opt/node24 --strip-components=1
export PATH=/opt/node24/bin:$PATH
```

Export that `PATH` in every shell that runs a build, the server, or these scripts.

For Playwright, use browsers that are already installed. Do not run `playwright install` in a sandbox that ships them, because it downloads a second copy for no benefit. Point the driver at the existing ones instead:

```bash
export PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers
```

`drive-browser.mjs` finds the newest `chromium-*` install under that path. Override it with `PLAYWRIGHT_CHROMIUM_PATH` if you need a specific binary.

Because the repository uses pnpm, `playwright-core` is not at `node_modules/playwright-core`. It resolves through the pnpm store, so never hardcode its version in a script. Let Node find it:

```bash
node -e "console.log(require.resolve('playwright-core'))"
```

`drive-browser.mjs` tries that first, then scans the pnpm store for `playwright-core@*`, and finally accepts `PLAYWRIGHT_CORE_PATH`.

## Step 1: install dependencies and write .env

```bash
pnpm install
node $HARNESS/bootstrap-instance.mjs --skip-connection
```

`pnpm install` runs a postinstall that builds native dependencies and takes about thirty seconds.

The bootstrap step copies `.env.example` to `.env` and sets values suited to a throwaway local instance:

| Variable              | Value              | Why                                                   |
| --------------------- | ------------------ | ----------------------------------------------------- |
| `ENCRYPTION_KEY`      | random 32-byte hex | Required before connections can store credentials.    |
| `ADMIN_SECRET`        | random 16-byte hex | Needed only if you call privileged APIs off loopback. |
| `HOST`                | `127.0.0.1`        | Keeps the instance off the LAN.                       |
| `AUTO_OPEN_BROWSER`   | `false`            | Nothing to open in a headless environment.            |
| `AUTO_UPDATE_ENABLED` | `false`            | Stops the instance changing under you mid-session.    |
| `LOG_LEVEL`           | `info`             | Shows package activation and generation milestones.   |

An existing `.env` is left alone unless you pass `--force-env`. The port defaults to 7860. See [Configuration](https://github.com/Pasta-Devs/Marinara-Engine/blob/main/docs/CONFIGURATION.md) for every other variable.

## Step 2: build and start the server

```bash
pnpm build
node packages/server/dist/index.js
```

The build compiles shared, server, and client packages and takes several minutes. Leave the server running in its own terminal; the remaining steps talk to it over HTTP.

Confirm it is up:

```bash
curl -s http://127.0.0.1:7860/api/health
```

## Step 3: start the mock provider

```bash
node $HARNESS/start-mock-provider.mjs --capture-dir .tmp/uiux/capture
```

This is the piece that removes the need for an API key. It is a small HTTP server on `127.0.0.1:7877` that speaks enough of the OpenAI API for the Engine to treat it as a normal custom provider:

- `GET /v1/models` lists the mock model ids.
- `POST /v1/embeddings` returns a deterministic hash-based vector, L2-normalized, 384 dimensions by default. Similar text produces similar vectors, so semantic recall and knowledge retrieval behave sensibly offline instead of returning noise.
- `POST /v1/chat/completions` answers both streaming (SSE) and non-streaming requests.

The important behavior is on the chat route. When a request carries `response_format.json_schema`, the mock reads that schema and synthesizes a valid instance of it: enums resolve to their first value, `minItems` and `minimum` are honored, and `format: uuid` produces a stable identifier. Agents that demand structured output therefore receive data they can parse, so their UI reaches the states you actually want to photograph, instead of showing a parse-failure banner.

`--capture-dir` writes every request body to disk as `NNN-chat-completions.json`, plus `last-request.json`. Reading a captured request is the single most useful debugging technique in this workflow: it shows exactly what prompt, schema, and identifiers an agent sends, which is far quicker than reading a minified package bundle.

Useful flags:

```bash
node $HARNESS/start-mock-provider.mjs --help
node $HARNESS/start-mock-provider.mjs --port 7878 --models mock-chat-large,text-embedding-3-small
node $HARNESS/start-mock-provider.mjs --responder $HARNESS/responders/example-schema-responder.mjs
```

## Step 4: connect the Engine to the mock provider

```bash
node $HARNESS/bootstrap-instance.mjs --skip-env
```

That creates a `custom` connection named `Mock Local` pointing at `http://127.0.0.1:7877/v1`, marks it default for chats and for agents, and runs the built-in connection test.

The same thing by hand, if you want to vary it:

```bash
curl -s -X POST http://127.0.0.1:7860/api/connections \
  -H 'content-type: application/json' \
  -H 'Origin: http://127.0.0.1:7860' \
  -d '{
        "name": "Mock Local",
        "provider": "custom",
        "baseUrl": "http://127.0.0.1:7877/v1",
        "apiKey": "mock-key",
        "model": "mock-chat-large",
        "maxContext": 32000,
        "embeddingModel": "text-embedding-3-small",
        "treatAsLocalEndpoint": true
      }'
```

Privileged APIs accept loopback requests without a secret by default, so no `X-Admin-Secret` header is needed from `127.0.0.1`. Always send `Origin` and `content-type: application/json`; requests are rejected without a trusted host. If the instance sets `MARINARA_REQUIRE_ADMIN_SECRET_ON_LOOPBACK=true`, add `-H "X-Admin-Secret: <value from .env>"`.

**Do not set both members of an exclusive pair in one request.** `isDefault` and `fallbackForMain` are mutually exclusive, and so are `defaultForAgents` and `fallbackForAgents`. Sending both members as `true` makes them cancel each other out, and all four fields end up `"false"` with no error. Create the connection without those flags, then patch the two you want:

```bash
curl -s -X PATCH http://127.0.0.1:7860/api/connections/<id> \
  -H 'content-type: application/json' \
  -H 'Origin: http://127.0.0.1:7860' \
  -d '{"isDefault": true, "defaultForAgents": true}'
```

Verify, then test the connection:

```bash
curl -s http://127.0.0.1:7860/api/connections -H 'Origin: http://127.0.0.1:7860'
curl -s -X POST http://127.0.0.1:7860/api/connections/<id>/test \
  -H 'content-type: application/json' -H 'Origin: http://127.0.0.1:7860' -d '{}'
```

Connection flags are stored as the strings `"true"` and `"false"`, so read the response literally.

## Step 5: install a capability package

Optional agent features ship as downloadable packages rather than in the base build. See [Optional Agent and Capability Packages](https://github.com/Pasta-Devs/Marinara-Engine/blob/main/docs/development/optional-agent-packages.md) for the model.

```bash
node $HARNESS/bootstrap-instance.mjs --skip-env --skip-connection --install long-term-memory
```

By hand:

```bash
curl -s http://127.0.0.1:7860/api/capability-packages/catalog -H 'Origin: http://127.0.0.1:7860'
curl -s -X POST http://127.0.0.1:7860/api/capability-packages/long-term-memory/install \
  -H 'content-type: application/json' -H 'Origin: http://127.0.0.1:7860' -d '{}'
```

The catalog is fetched from `raw.githubusercontent.com/Pasta-Devs/Marinara-Agents`. The branch follows the Engine build branch, and Engine 2.x reads `/catalog/v2/catalog.json`. Set `MARINARA_AGENT_CATALOG_URL` to point at a different catalog.

A package whose manifest declares `restartRequired` responds with `"status": "restart-required"`. It is not usable yet. Restart the server, and the log then reports:

```text
Activated and verified capability package long-term-memory@1.1.6
```

Confirm before you start clicking:

```bash
curl -s http://127.0.0.1:7860/api/capability-packages/installed -H 'Origin: http://127.0.0.1:7860'
```

You want `"status": "active"` and `"readiness": "ready"`. `GET /api/health` reports the same summary.

## Step 6: seed test content

```bash
node $HARNESS/seed-chat.mjs --file $HARNESS/fixtures/example-chat.json
```

The script prints `CHARACTER_ID` and `CHAT_ID`. It reuses a character with the same name unless you pass `--new-character`. Content can also come from flags:

```bash
node $HARNESS/seed-chat.mjs --character Wren --chat "Memory test" \
  --message "user:Hello there" --message "assistant:Hello yourself."
```

Two details of the API are easy to get wrong:

- `POST /api/characters` wraps its payload: `{ "data": { "name": ..., "description": ..., "first_mes": ... } }`. Card fields use SillyTavern v2 names, so it is `first_mes`, not `firstMessage`.
- `POST /api/chats` takes `{ "name", "mode", "characterIds": [...] }`, where mode is `conversation`, `roleplay`, or `game`. Messages then go to `POST /api/chats/<id>/messages` as `{ "role", "content", "characterId" }`, with `role` being `user` or `assistant`.
- `GET /api/characters` returns each card with its fields inside a JSON string under `data`, so there is no top-level `name` to match on. Parse `data` before comparing names. The unpaged call returns an array; adding `?limit=` returns `{ "items": [...] }`.

Seed enough history that agents have real material. Extraction and summary agents behave very differently against three lines than against a dozen turns of specific, memorable detail.

## Step 7: drive the UI with Playwright

```bash
node $HARNESS/drive-browser.mjs $HARNESS/steps/example-tour.mjs
```

The driver launches Chromium with `launchPersistentContext` against `.tmp/uiux/profile`, so localStorage, the dismissed tutorial, the selected chat, and expanded accordions all survive between runs. That is what makes incremental exploration possible: each step file does one small thing and starts from where the last one stopped. Pass `--reset` for a clean profile. Screenshots, profiles, and captured requests all live under `.tmp/`, which is git-ignored.

A step module default-exports an async function and receives:

| Helper                   | What it does                                                           |
| ------------------------ | ---------------------------------------------------------------------- |
| `page`, `context`        | Playwright objects.                                                    |
| `baseUrl`                | Engine URL under test.                                                 |
| `shot(name)`             | Numbered PNG into `.tmp/uiux/shots`.                                   |
| `outline(selector)`      | Visible interactive elements as `tag[role] @x,y :: label`.             |
| `clickText(label, opts)` | DOM-side click by visible text, prefix-tolerant, optionally x-bounded. |
| `forceClick(selector)`   | `element.click()` from inside the page, ignoring overlap.              |
| `setCheckbox(label, on)` | Flips a visually hidden checkbox found by its row label.               |
| `consoleErrors`          | Console and page errors collected during the run.                      |

Prefer `outline()` over screenshots while you are searching for a control. It is a few lines of text instead of an image, it exposes the `aria-label` of icon-only buttons, and it gives coordinates you can use to disambiguate duplicates. Take screenshots once you know what you want to show.

Write new steps by copying `steps/example-tour.mjs`. Keep them idempotent, for the reasons in the troubleshooting section below.

## Teaching the mock provider an agent's contract

Generic schema synthesis produces valid but empty-looking data: `"mock summary"`, one array item, first enum value. That is enough to prove a screen renders. It is not enough when the screenshots need to look like real usage.

To go further, capture a real request and write a responder:

1. Start the mock provider with `--capture-dir .tmp/uiux/capture`.
2. Trigger the agent from the UI.
3. Read `.tmp/uiux/capture/last-request.json`. It contains the full prompt, the requested schema, and any identifiers the Engine pinned into that schema.
4. Copy `responders/example-schema-responder.mjs` and fill in content the agent's UI will display well.
5. Restart the mock provider with `--responder <your-file>`.

A responder default-exports a function receiving `{ body, messages, text, schema, helpers }`. Return a string to use verbatim, an object to send as JSON, or `null` to fall back to generic synthesis.

The shipped example is modelled on the Long-Term Memory package. Two details in it generalize to most structured-output agents:

- The Engine often pins an identifier into the schema as a single-value `enum`, such as a source hash. The response must echo it back, or the package discards the result as unattributable.
- The prompt carries references the reply must cite, such as an evidence id. Extract them from the message text with a regular expression rather than inventing values.

## Adapting this to another agent package

Nothing above is specific to one package. To explore a different one:

1. Install it: `node $HARNESS/bootstrap-instance.mjs --skip-env --skip-connection --install <package-id>`, and restart the server if the install reports `restart-required`.
2. Seed content that matches what the package consumes. A memory agent wants a long chat; a game surface wants a game-mode chat; a lorebook agent wants lore entries.
3. Enable it where it lives. Most agents are per chat, under **Chat Settings**, then **Agents**.
4. Capture one request and write a responder so its structured output is meaningful.
5. Look for package-specific test hooks before you resort to text matching. Long-Term Memory, for example, exposes `data-ltm-control` and `data-ltm-source-action` attributes that are far more stable than labels.

## Troubleshooting

### A control has no text, and text selectors never match it

Many controls are icon-only. They carry `aria-label` or `title` but no `innerText`. Prefer `aria-label`, and use `outline()` to discover it:

```js
await page.locator('button[aria-label="Chat Settings"]').first().click();
```

### A toggle cannot be clicked

Toggles render as visually hidden 1x1 `input[type=checkbox]` elements behind a styled row. Clicking their coordinates hits the decoration, not the input. Walk up from the input to the labelled row, match the label, and click the input directly. `setCheckbox("Long-Term Memory", true)` does this.

### Playwright times out with "intercepts pointer events"

A sibling element overlaps the target, so the actionability check never passes even though a user could click it. Dispatch the click from inside the page:

```js
await page.evaluate(() => document.querySelector("[data-ltm-control='open']")?.click());
```

`forceClick(selector)` is the same thing.

### A tab or button label does not match

Labels include count badges. A tab reads `Review Queue 2`, not `Review Queue`. Match by prefix, never by equality. `clickText()` accepts a prefix by default.

### A step works once and breaks on the second run

Accordion and panel expansion state is remembered between page loads. A blind "click to expand" therefore collapses the section on the next run. Make navigation idempotent: check whether the target content is already visible, and click only if it is not. The example step shows the pattern.

### A text selector resolves to the wrong element

`getByText()` can match an off-screen tooltip or a duplicate elsewhere in the DOM. Scope the match to the panel you mean by filtering on the bounding box, which is what the `minX` and `maxX` options of `clickText()` are for.

### The agent runs but its output is rejected

Read the captured request. Usually the reply is missing an echoed identifier, or a required field, or it violates an enum. Generic synthesis satisfies the schema but not the package's semantics; that is what responders are for.

### The connection tests fine but generation does nothing

Check that the connection really is the default. Read `GET /api/connections` and confirm `isDefault` and `defaultForAgents` are `"true"`. If all four flag fields are `"false"`, you hit the mutually exclusive pair described in step 4.

### Playwright cannot find a browser or playwright-core

Set `PLAYWRIGHT_BROWSERS_PATH` to the directory holding `chromium-*`, and `PLAYWRIGHT_CORE_PATH` to the resolved `playwright-core` entry point if the automatic scan fails. Do not add a version number to a script; the pnpm store path changes with every upgrade.

## Related guides

- [Optional Agent and Capability Packages](https://github.com/Pasta-Devs/Marinara-Engine/blob/main/docs/development/optional-agent-packages.md)
- [Frontend Architecture (Developers)](https://github.com/Pasta-Devs/Marinara-Engine/blob/main/docs/development/frontend.md)
- [Configuration](https://github.com/Pasta-Devs/Marinara-Engine/blob/main/docs/CONFIGURATION.md)
- [Contributing](https://github.com/Pasta-Devs/Marinara-Engine/blob/main/CONTRIBUTING.md)
