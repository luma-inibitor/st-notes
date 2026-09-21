# Issue 6388: Chat Settings blocked during generation

Repro for [Pasta-Devs/Marinara-Engine#6388](https://github.com/Pasta-Devs/Marinara-Engine/issues/6388) on upstream `staging` at `085f2a440` (2.4.6), using the exploration harness in this folder. Run on 2026-09-21 on macOS with the harness driver at phone width (430x900), so the sidebar and toolbar behave as on the Android app shell.

## Result

The symptom reproduces when two things hold at once:

1. Every one of the browser's six HTTP/1.1 sockets to the Engine origin is held by a long-lived stream (a generation whose provider has not finished).
2. The Chat Settings drawer's JavaScript chunk is not in the service worker cache.

Then a tap on Chat Settings shows the "Loading settings..." panel and never gets further. The server is idle the whole time; its `/api/health` round trip stays under 20 ms. What hangs is the browser: the drawer is a lazy chunk (`ChatSettingsDrawer-*.js`, about 350 KB, plus 18 sibling chunks), the Engine serves plain HTTP/1.1 with no compression, and Chromium queues every new request to an origin once six connections are busy. The chunk requests sit in the queue behind the streams forever.

| Case | Sockets pinned | Drawer chunk cached | Drawer visible after |
| --- | --- | --- | --- |
| One streaming generation | 1 | no | 347 ms, 359 ms, 389 ms |
| Five stalled generations plus one streaming | 6 | no | never (20 s and 30 s waits) |
| Four stalled generations plus one streaming | 5 | no | 389 ms |
| Five stalled generations plus one streaming | 6 | yes (service worker controlling) | 357 ms |

Section expansion took 200 to 430 ms in every case where the drawer opened. Server-side probes of `/api/health` and `GET /api/chats/:id` every 300 ms had a median of 3 ms and a maximum of 24 ms throughout, including while the drawer was stuck.

Requests left pending after 20 s in the stuck case:

```
/assets/ChatSettingsDrawer-Avj8HZHI.js
/assets/GameWidgetSetupEditor-BpQpLLfw.js
/assets/game-asset.store-C1lIrd-K.js
/assets/DraftNumberInput-_hE_8AhA.js
/assets/ColorPicker-BiE5kjXP.js
/assets/BackgroundPicker-BbIgepTG.js
/assets/ImageUploadDropzone-BfmF4XlA.js
/assets/ChatResourceActionButton-JUOPTexY.js
/assets/use-effective-generation-parameters-D1tTCAhi.js
/assets/GenerationParametersEditor-Bbs5mzxR.js
/assets/use-custom-generation-parameters-Dzq94n_G.js
/assets/ruleset-combat-bridge-yMY-W8jO.js
/assets/AgentAddSetupFields-C-1A1q19.js
/assets/AdvancedMemoryProgress-jx-IVATI.js
/assets/AdvancedMemoryProgress-v-HAB1ii.css
/assets/agent-cadence-BgpxjPh0.js
/assets/AgentOutputSpoiler-kXnTnNO7.js
/assets/touch-reorder-BXEWVd-F.js
/assets/use-custom-tools-DwalvhYA.js
/api/chats/autonomous-candidates
```

## Why it is intermittent and Android-shaped

The stream count and the cache state both vary from moment to moment.

- **What pins sockets.** Each `POST /api/generate` is one socket for as long as the provider is talking, and agents run inside that same stream. `POST /api/generate/retry-agents`, background autonomous chats (`use-background-autonomous.ts`, one stream per chat and they can overlap), Professor Mari's workspace stream, and TTS fetches each take another. The 1 s `GET /api/generate/status/:chatId` poll and the Android 10 s `/api/health` heartbeat churn through whatever is left. On top of that, only the main `/generate` stream arms the client's resume watchdog; after Android suspends Termux (the diagnostics in the report show a 63 s freeze), the other streams' readers can stay pending indefinitely, each holding a socket until the page reloads. On a desktop that has not been suspended, one or two sockets are pinned and there is no symptom. That is what the maintainer's fixture tested.
- **What empties the cache.** The service worker registers on idle after first load, updates only every six hours on mobile, and is `registerType: "prompt"`, so after an Engine update the old worker keeps controlling the page and its precache misses every new chunk hash until the "update available" prompt is accepted. Termux auto-updates on launch, so the window right after an update is the exposed one. A chunk that fails under starvation also fires `vite:preloadError`, which unregisters the worker, wipes Cache Storage and hard-reloads, so the next attempt is cold again.

The "agent stalling" observation fits: a stalled agent is a stream that never ends, and the server keeps that generation running for the client even after the client goes away (in this run, aborted streams stayed open to the provider for 291 s until `POST /api/generate/abort`).

## Rerun

Follow `ui-ux-exploration-harness.md` steps 1, 2 and 6 for the instance, but use the slow provider instead of the instant one, since the point is to hold sockets open.

```bash
export HARNESS=/path/to/st-notes/marinara/scripts
node $HARNESS/slow-provider.mjs &                                  # 127.0.0.1:7877, models slow-chat and stall-chat
node $HARNESS/bootstrap-instance.mjs --skip-env --model slow-chat  # default connection drips tokens for ~75 s
node $HARNESS/seed-chat.mjs --file $HARNESS/fixtures/roleplay-stoke-moran.json   # prints CHAT_ID
```

Create a connection on the stall model and a few chats bound to it. Each of those chats gives the step one generation that never returns.

```bash
B=http://127.0.0.1:7860; H='content-type: application/json'; O="Origin: $B"
CONN=$(curl -s -X POST $B/api/connections -H "$H" -H "$O" -d '{"name":"Stall","provider":"custom","baseUrl":"http://127.0.0.1:7877/v1","apiKey":"mock-key","model":"stall-chat","maxContext":32000,"treatAsLocalEndpoint":true}' | jq -r .id)
CH=$(curl -s -X POST $B/api/characters -H "$H" -H "$O" -d '{"data":{"name":"Stall Bot","first_mes":"..."}}' | jq -r .id)
IDS=$(for i in 1 2 3 4 5; do curl -s -X POST $B/api/chats -H "$H" -H "$O" -d "{\"name\":\"Stall $i\",\"mode\":\"roleplay\",\"characterIds\":[\"$CH\"],\"connectionId\":\"$CONN\"}" | jq -r .id; done | paste -sd, -)
```

Then drive the browser. `--reset` gives a cold cache; leave it off for a warm one.

```bash
export CHAT_ID=<from seed-chat> STALL_CONNECTION_ID=$CONN STALL_CHAT_IDS=$IDS
SCENARIO=main     node $HARNESS/drive-browser.mjs $HARNESS/steps/issue-6388-settings-during-generation.mjs --reset --width 430 --height 900
SCENARIO=saturate node $HARNESS/drive-browser.mjs $HARNESS/steps/issue-6388-settings-during-generation.mjs --reset --width 430 --height 900
```

The step prints when the drawer became visible, the time to expand each section, server probe latency, any page request slower than 300 ms, and, if the drawer never appears, the requests still pending. Screenshots land in `.tmp/uiux/shots`. Set `STALL_CHAT_IDS` to four ids to see the one-free-socket case.

Notes for this machine: the Engine needs Node 24 (`ASDF_NODEJS_VERSION=24.19.0` if asdf resolves to 22), and the driver wants `PLAYWRIGHT_CHROMIUM_PATH` pointed at the binary inside `~/Library/Caches/ms-playwright/chromium-*/chrome-mac-arm64/Google Chrome for Testing.app`.

## Checking a live Android instance

When it happens on the phone, two facts settle it without a debugger:

- `GET /api/health` from another device answers fast: the server is not the bottleneck.
- Chrome remote debugging of the WebView (chrome://inspect over USB) shows `ChatSettingsDrawer-*.js` in the Network panel with all of its time in "Stalled". `navigator.serviceWorker.controller` in the console says whether the chunk could have come from cache.

Cheaper stand-ins: count chats with `GET /api/generate/status/:chatId` returning `active: true`, and note whether the app had just updated (the "update available" prompt not yet accepted).
