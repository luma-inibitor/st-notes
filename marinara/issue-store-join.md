# Joined selects in the file-backed store block the server for minutes once many chats are loaded

## Summary

A joined select evaluates its join condition on every pair of rows resident in memory for the two tables, from every chat loaded since startup. Once enough chats have been opened, the agent phase of every generation blocks the whole server for minutes, so the app looks frozen and chat settings cannot open. Index the joined table on the join's equality column so each base row probes a bucket instead of scanning the table.

## Impact

Anyone with a tracker agent enabled and a server that stays up while they move between chats, which is normal use on Android/Termux. Shards are loaded per chat and never unloaded, and the join scans all resident rows of both tables regardless of chat, so the blocked window grows with uptime and with the number of chats opened. With 19,564 messages and 7,262 agent runs resident (66 and 14 chat shards, largest chat 3,150 messages) one generation blocked for 9.75 minutes, and the next one did the same. After a fresh start the same query is fast, which is why the symptom looks intermittent. During the window no route answers, including `/api/health` and `/api/generate/abort`, and the client shows a stalled agent. This is the server-side cause of the "chat settings blocked during agent generation" report in #6388.

## Environment

- Marinara Engine 2.4.6 on upstream `staging`; the join code is unchanged at `085f2a440`
- Server on Android / Termux, Pixel 10 Pro, Node 24.17.0
- 35 hours of uptime, 66 chats' messages (19,564 rows) and 14 chats' agent runs (7,262 rows) resident; tracker agent enabled on the chat being generated

## Steps to reproduce

1. Seed chats totalling about 20,000 messages and 5,000 successful agent runs, spread across any number of chats.
2. Open each chat once so its shards are resident, then enable the agent on one chat and send a message.
3. While the agent phase runs, request `GET /api/health` from another client.

Observed: the request does not answer until the generation's agent phase ends, minutes later. The log has no lines for the window, then the freeze detector reports `Process was suspended for ~N s`.
Expected: `/api/health` answers within milliseconds and the agent phase completes in seconds.

## Evidence

Log on 2026-09-22: the tracker agent's result line at 01:20:22 UTC, then nothing until `Process was suspended for ~536 s` at 01:30:09. The process was not suspended. Over that window `/proc/<pid>/status` showed the main thread in state R at one full core with zero major page faults, and `curl 127.0.0.1:7860/api/health` on the device timed out.

Six pauses through the Node inspector over two minutes all stopped in the same frames:

```
evaluateCondition  packages/server/dist/db/file-backed-store.js:1414
(anon)             packages/server/dist/db/file-backed-store.js:3926   join loop callback
run                packages/server/dist/db/file-backed-store.js:3920   SelectQuery.run
```

Evaluated on the paused `run` frame:

```
from:  agent_runs rows=7256
joins: messages rows=19564 on eq(agent_runs.message_id, messages.id)
where: and(eq(agent_config_id, …), eq(agent_runs.chat_id, …), eq(messages.chat_id, …),
           eq(success, "true"), lte(messages.created_at, …), ne(messages.id, …))
progress after 8 min: base row 1677 of 7257, matched=1591
```

That is the query built by `getPreviousOutput` in `packages/server/src/services/storage/agents.storage.ts`, reached from `generate.routes.ts` in the agent phase. The row counts are `store.rows(table).length`, every resident row of the table; the on-disk shards confirm they span 66 chats for messages and 14 for agent runs, and the chat being generated holds a small fraction of each. `process.memoryUsage()` during the loop showed the heap at 969 MB of a 1,008 MB total. The same stall recurred on the next generation of the same chat.

## Cause

`SelectQuery.run()` in `packages/server/src/db/file-backed-store.ts`, joined path:

```ts
for (const join of this.joins) {
  const joinedContexts: RowContext[] = [];
  const joinRows = this.store.rows(join.table.name);
  for (const ctx of contexts) {
    joinRows.forEach((row) => {
      const candidate: RowContext = { rows: { ...ctx.rows, [join.table.name]: row }, baseTable: ctx.baseTable, joined: true };
      if (evaluateCondition(join.condition, candidate)) joinedContexts.push(candidate);
    });
  }
  contexts = joinedContexts;
}
```

`store.rows()` returns every resident row of the table, and every base row is tested against every joined row with an object spread per pair: 7,256 × 19,564 is about 142 million evaluations and allocations on the event loop. `ensureQueryScopeLoaded` bounds which shards get loaded for the query, but not which resident rows get scanned, and the WHERE clause is applied only after the join, so neither the chat filter nor the base-table conjuncts (`agent_config_id`, `success`) shrink either side. Confirmed by the inspector samples above and by a regression that reproduces the minutes-long select on synthetic data.

## Proposed fix

When the join condition carries an equality between a column of the joined table and a column already in the context, bucket the joined table by that column once and look up each base row's bucket. The full join condition is still evaluated on every candidate, so results and their order are unchanged; joins without such an equality keep the current scan. Every shipped join has one, such as `eq(agentRuns.messageId, messages.id)` and `eq(agentRuns.agentConfigId, agentConfigs.id)`. A patch with a regression that joins 5,000 runs against 20,000 messages is on `luma-inibitor/Marinara-Engine` branch `patch/store-hash-join`: 19 ms with the index, over the runner's 30 s budget without it. Two smaller follow-ups would help every joined query: apply the WHERE conjuncts that name only the base table before joining, and scan only the shards the query scope loaded rather than all resident rows. Separately, `getPreviousOutput` only needs the newest successful run for one agent before one message and could filter `agent_runs` first and look up the few messages by id instead of joining.

## Workaround

Restart the server; the stall returns as more chats are opened. Disabling agents avoids the query entirely.

## Related

- #6388, the settings report this explains from the server side. A second, smaller mechanism exists on the client: with all six browser sockets to the origin held by generation streams and the settings drawer's chunk not in the service worker cache, the drawer's lazy load queues behind the streams. That one leaves the server idle and is reproducible with a Playwright fixture.
- #5592 Phase 0 fixed the same shape of problem for `inArray` membership sets; the join loop was left as it was.
