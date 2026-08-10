# Marinara Engine notes

Working notes on [Marinara Engine](https://github.com/Pasta-Devs/Marinara-Engine)
and its downloadable agent packages. Research and design material, not
maintainer documentation — written to be cleaned up later.

## Long-Term Memory agent

Notes from a UX review of the
[`long-term-memory`](https://github.com/Pasta-Devs/Marinara-Agents/blob/main/packages/long-term-memory/manifest.json)
package (v1.1.6) against Engine 2.4.1: a browser walkthrough of the onboarding
flow, then a source read of the package (~17k lines server, ~14k client).

Read them in this order.

- [ltm-state-machine-notes.md](ltm-state-machine-notes.md) — the state
  vocabulary (~30 enums, 100+ states), the pipeline stage by stage, where user
  actions sit on the machine, and which transitions produce no feedback.
  Includes two behaviours worth a maintainer's attention: the extraction
  fingerprint trap, and what partial apply does to a draft's mutation list.
- [ltm-journey-design-notes.md](ltm-journey-design-notes.md) — maps that machine
  onto six user journeys, finds the two-loop split underneath the feature, and
  proposes a navigation model plus a table deciding which engine states should
  ever reach a person.
- [ltm-review-workflow-notes.md](ltm-review-workflow-notes.md) — deep dive on
  bulk curation: triaging by mutation disposition rather than kind, and
  designing bulk actions against a storage layer that has no undo.

## Tooling

- [ui-ux-exploration-harness.md](ui-ux-exploration-harness.md) — how to stand up
  a local Engine instance with a mock LLM provider, install an agent package,
  seed test content, and drive the UI with Playwright for screenshots. No API
  key needed.
- [scripts/](scripts/) — the harness itself. Standalone Node ESM, no
  dependencies; it talks to the Engine over HTTP, so it runs from anywhere
  against a Marinara Engine checkout.

  | Script | Purpose |
  | --- | --- |
  | `start-mock-provider.mjs` | OpenAI-compatible provider answering chat, embedding, and model requests. Synthesises schema-valid replies for structured-output agents, and can capture requests so you can read an agent's contract off a live call. |
  | `bootstrap-instance.mjs` | Writes `.env`, creates and defaults the mock connection, optionally installs a catalog package. |
  | `seed-chat.mjs` | Creates a character, chat, and message history over the REST API. |
  | `drive-browser.mjs` | Playwright driver with a persistent browser profile and screenshot helpers. |
