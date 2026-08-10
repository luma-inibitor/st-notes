# Long-Term Memory: state machine and UX notes

Working notes from a source read of the `long-term-memory` capability package
(v1.1.6) against Marinara Engine 2.4.1. These are research notes taken while
reviewing the package's UX, not maintainer documentation. They are written to be
cleaned up later.

Source read: `packages/long-term-memory/src/engine/packages/` in
[Pasta-Devs/Marinara-Agents](https://github.com/Pasta-Devs/Marinara-Agents) —
roughly 17k lines of server code and 14k lines of client code.

## Why this matters

The package's interface exposes about six states. The engine models more than a
hundred. Almost every confusing moment in the product traces back to a state the
engine knows about and the interface does not name.

## The state vocabulary

Every enum below is exported from
`shared/src/features/agents/long-term-memory/schema.ts`.

### Content states

| Enum | Values |
| --- | --- |
| `ltmNoteType` | `source`, `timeline_event`, `character`, `relationship`, `scene`, `thread`, `world`, `tone` |
| `ltmStatus` | `active`, `resolved`, `archived` |
| `ltmEvidenceUnitStatus` | `active`, `resolved`, `archived`, `developing` |
| `ltmEvidenceUnitBucket` | `timeline_event`, `character_fact`, `relationship_state`, `world_fact`, `thread`, `tone`, `anchor` |
| `ltmVaultFolder` | `sources`, `timeline`, `characters`, `relationships`, `scenes`, `threads`, `world`, `tone` |
| `ltmImportance` | `critical`, `major`, `moderate`, `minor` |
| `ltmClaimKind` | `static`, `change` |

Note that `source` is a note *type* and `sources` is a vault *folder*. Source
notes live in the same vault, are counted in the same totals, and render in the
same list as real memories. This is the direct cause of a vault reading
"107 memories" when only 11 are memories.

### Draft lifecycle states

| Enum | Values |
| --- | --- |
| `ltmDraftStatus` | `pending`, `accepted`, `auto_applied`, `superseded` |
| `ltmDraftApplyState` | `not_started`, `applying`, `complete` |
| `ltmDraftIndexRebuildStatus` | `not_requested`, `pending`, `succeeded`, `failed` |
| `ltmDraftFreshness` | `fresh`, `hashless`, `stale`, `missing`, `invalid`, `superseded`, `not_pending` |
| `ltmDraftBlockReasonCode` | `source_stale`, `source_context_unbound`, `source_missing`, `source_invalid`, `draft_superseded`, `draft_not_pending`, `projection_failed`, `no_mutations` |
| `ltmDraftRisk` | `low`, `medium`, `high` |
| `ltmMutationDisposition` | `new`, `merge`, `rewrite` |

A draft's real state is the product of four of these, not one:
`status × applyState × freshness × indexRebuildStatus`.

### Failure and rejection states

| Enum | Values |
| --- | --- |
| `ltmExtractionDropReason` | `invalid_format`, `placeholder_output`, `quote_not_found_in_source`, `missing_source_evidence`, `source_summary_payload`, `unsupported_bucket`, `target_note_outside_scope`, `ambiguous_subject`, `untrusted_subject`, `invalid_subject_cardinality`, `too_long_to_keep_safely` |
| `ltmExtractionOutcomeState` | `success`, `partial_success`, `no_suggestions_created` |
| `ltmImportSourceNotesBatchStatus` | `success`, `partial_success`, `failed`, `cancelled` |
| budget `rejectionReason` (`budget.ts`) | `budget`, `lower_rank`, `missing_chunk`, `score_threshold`, `duplicate_text` |

`unsupported_bucket` is what surfaces in the UI as "The candidate used an
unsupported memory category." Eleven distinct drop reasons exist; the review
queue presents them as undifferentiated blocked items.

### Index and health states

| Enum | Values |
| --- | --- |
| `ltmIndexHealth` | `not_built`, `healthy`, `degraded`, `stale`, `corrupt` |
| `ltmIndexRebuildState` | `idle`, `building`, `failed` |
| `ltmRepairAction` | `rebuild_indexes`, `quarantine_malformed_notes`, `backfill_imported_source_titles` |
| `ltmInteropPreviewFreshness` | `new`, `current`, `source_updated`, `context_updated`, `extraction_incomplete` |
| `ltmDebugPhase` | `import`, `source_note`, `extraction`, `llm`, `compiler`, `draft`, `apply`, `injection`, `retrieval`, `rebuild`, `repair`, `replay`, `diagnostic` |
| `ltmDebugStatus` | `started`, `ok`, `skipped`, `warning`, `error` |

## The pipeline, stage by stage

### 1. Import — source note created

`source-processing.ts: prepareLongTermMemorySource`

A character, lorebook, or chat summary is written into the vault as a **source
note** (`type: "source"`). This is audit evidence, not recall material — the
extraction prompt says so explicitly: *"Source notes are audit evidence, not
active recall memory."* The vault UI does not make this distinction.

`reviewRequired` is set to `true` when provenance is `character` or `lorebook`.
Chat-summary sources can auto-apply; character and lorebook sources never can.
This is a meaningful behavioural difference that is never stated in the UI.

### 2. Extraction — evidence units proposed

`evidence-unit-extraction.ts`, `source-extraction.ts`

The model is called with a strict `json_schema` response format and returns
`{ summary, units[] }`. Units are then validated and compiled. Candidates can be
dropped for any of the eleven `ltmExtractionDropReason` values. Dropped
candidates are persisted separately via `addRejectedSuggestions` and surface in
the UI as "Suggestions that weren't saved".

Outcome is one of `success`, `partial_success`, `no_suggestions_created`.

### 3. The extraction fingerprint — the hidden coupling

`source-processing.ts: canMarkCurrent`

After extraction the source note is stamped with an `extractionFingerprint`,
**but only if** `canMarkCurrent()` returns true:

- outcome is `success`, or
- deterministic extraction with `partial_success` and no error diagnostics, or
- `no_suggestions_created` with zero dropped units and no error diagnostics.

If extraction partly failed, the fingerprint is **not** written. Every later read
of that draft then computes freshness as `hashless` or `stale`, which becomes a
block reason, which makes the draft unapplyable. The user sees "The source or
extraction context changed after this extraction" — but nothing changed. The
extraction simply never earned its fingerprint.

**This is the most consequential undocumented behaviour found.** A partly-failed
extraction produces drafts that are permanently blocked with a message that
describes a different cause.

### 4. Freshness — derived at read time, never stored

`draft-review.ts: draftFreshness`

```
status === "superseded"        -> superseded
status !== "pending"           -> not_pending
source note missing            -> missing
source note not a source type  -> invalid
no extractionFingerprint       -> hashless
fingerprint current?           -> fresh : stale
```

Freshness is recomputed on every read. A draft can therefore change state with no
user action, because someone edited the character card the source came from.
Nothing notifies the user; the draft simply becomes blocked next time they look.

### 5. Blocking — derived from freshness plus emptiness

`draft-review.ts: blockReasonsForDraft`

Freshness maps 1:1 onto six block reasons; `projection_failed` is added if
projection throws, and `no_mutations` if the draft has none. "No mutation
survived extraction." is the `no_mutations` case — it means every candidate was
dropped during validation, which is a different problem from the source having
gone stale, and the UI presents both identically.

### 6. Apply — partial application mutates the draft in place

`reconciliation.ts: applyInner`

Preconditions: status must be `pending` (else HTTP 409, code
`ltm_draft_superseded` or `ltm_draft_not_pending`), and `assertFresh` must pass.

Terminal status depends on how much applied:

| Condition | Resulting status | `applyState` |
| --- | --- | --- |
| All mutations applied, user action | `accepted` | `complete` |
| All mutations applied, auto low-risk | `auto_applied` | `complete` |
| Some mutations skipped | **stays `pending`** | `not_started` |

On partial apply the draft's `mutations` array is **replaced with only the
skipped ones**. The applied mutations disappear from the draft. A user who
accepts 4 of 6 sees a draft that looks like a fresh 2-mutation draft, with no
record in that view that 4 were already applied.

### 7. Index rebuild — a separate failure axis

Applying a draft schedules an index rebuild
(`not_requested` → `pending` → `succeeded` | `failed`). If the rebuild fails, the
draft is still `accepted` — the memory exists but is not retrievable. The vault
looks correct and recall silently misses it. Index health becomes `stale` or
`degraded`; the user-facing advice is "Check Settings > Maintenance > Reindex
recall data."

### 8. Recall — ranking, tiers, budget

`retrieval.ts`, `ranking.ts`, `budget.ts`

Four retrieval lanes are fused with reciprocal rank fusion: semantic
(embeddings), lexical (BM25), graph expansion, keyword index. Weights are
user-tunable (`0.6 / 0.3 / 0.1 / 0.2` by default).

Candidates are filtered before ranking by: `archived` status, resolved threads
(unless `includeResolved`), **chat mode membership**, and scope. The mode filter
is where a Roleplay-only memory becomes invisible in a Conversation chat.

Priority tiers (`budget.ts: tierFor`):

- **Tier 1** — `tone` notes, and `character` notes in the `core` or
  `current_state` sections
- **Tier 2** — unresolved `thread` notes
- **Tier 3** — everything else

Budget then selects within `maxChunks` (default 20) and `maxTokens`
(default 4096), recording a `rejectionReason` for everything it drops:
`budget`, `lower_rank`, `missing_chunk`, `score_threshold`, `duplicate_text`.

**The explainability already exists.** `budget.ts` computes per-candidate lane
scores, raw lane scores, cooldown penalties, tier, estimated tokens, and a
rejection reason. None of it reaches the interface.

### 9. Injection — verified, then accounted

`generation-injection.ts`

1. `prepareGenerationLongTermMemory` retrieves, serialises the artifact, writes a
   **pending receipt** to disk, and returns the text.
2. `recordGenerationLongTermMemoryDispatch` checks
   `isLongTermMemoryPromptPresent(messages, receipt.artifact.content)` — the
   artifact must actually appear in the dispatched messages — and only then
   records the injection.

So the "N memories injected" readout is **verified against the real prompt**, not
merely asserted. It is trustworthy when it updates.

The problem is that it has **no negative state**. If retrieval returns nothing,
or the artifact never lands, nothing is recorded and the previous value persists
with no timestamp. Observed behaviour: the readout stayed at "1 memory injected —
112 tokens" across several later turns. It is a "last successful injection"
figure being read as a "this turn" figure.

`explain` is only enabled when `recall.debugEnabled` is true, and the explanation
goes to the debug log rather than the UI.

## Where user actions sit on the machine

Routes are registered in `routes.ts` (~45 endpoints).

| User action | Endpoint | State transition | What the UI tells you |
| --- | --- | --- | --- |
| Install package | engine catalog | — | restart required |
| Enable for chat | chat metadata | — | nothing visible |
| Import source | `POST /sources/import` | source note created | "Requested N; wrote N…" |
| Extract | same call | draft created, outcome computed | "Extraction completed" |
| — | — | fingerprint written **or not** | nothing |
| Open review | `GET /drafts/review` | freshness + blocks derived | counts row |
| Accept mutation(s) | `POST /drafts/:id/apply` | `pending` → `accepted` / stays `pending` | row disappears |
| — | — | index rebuild scheduled | nothing |
| Skip | `DELETE /drafts/:id` or per-mutation | draft deleted or narrowed | row disappears |
| Recover rejected | `POST /rejected-suggestions/:id/...` | new manual note | — |
| Edit memory modes | `PATCH /notes/:id` | changes recall eligibility | nothing |
| Reindex | `POST /rebuild` | index health → `healthy` | integrity line |
| Send a message | generation hook | retrieval + budget + injection | "N memories injected" |

Three transitions in that table have **no user-visible feedback at all**, and all
three are ones that determine whether the feature works:

1. whether the extraction fingerprint was written,
2. whether the post-apply index rebuild succeeded,
3. whether a memory is eligible for the current chat mode.

## First-principles read

If the feature's job is *deciding what the model should know*, then the user
needs answers to five questions, and the engine can already answer all five:

1. **What does it know?** — vault, minus source records, grouped by subject.
2. **What did it use just now, and what did it cost?** — the receipt already
   carries chunks and token counts.
3. **What did it decline to use, and why?** — `budget.ts` computes this per
   candidate and throws it away unless debug is on.
4. **What is waiting on me, and can I decide it in bulk?** — drop reasons and
   dispositions are already typed and aggregatable.
5. **Is anything broken?** — index health, rebuild status, and fingerprint state
   are all tracked.

The gap is not modelling. It is that every one of these is computed and then
either discarded, logged to a debug file, or flattened into a single number.

## Concrete, cheap wins

1. **Give the injection readout a negative state and a timestamp.** "Nothing
   recalled this turn" is different from the last successful count.
2. **Always compute `explain`, not just under debug.** Cost is per-candidate
   bookkeeping already being done; surface "4 dropped for budget, 2 below
   threshold".
3. **Split source notes out of the memory vault.** One boolean on the list query;
   removes 90% of the rows in a real vault.
4. **Group blocked drafts by `blockReasonCode` and dropped candidates by
   `dropReason`.** Both are enums. 63 items with one cause become one decision.
5. **Say when the fingerprint was not written**, and offer "extract again" in
   place of the misleading "the source changed" message.
6. **Surface `indexRebuildStatus: failed` on the memory**, since that memory is
   invisible to recall until reindexed.
7. **Show mode eligibility at accept time**, defaulted from the originating chat.

## Corrections to earlier review notes

- The Chat Settings injection readout is a `<details>` element. Expanding it
  lists each recalled memory with its token count and links through to the vault.
  An earlier note described it as a flat readout; that was wrong — it had simply
  never been expanded.
- The `{{agent::long-term-memory}}` preset marker is **not** required on this
  build. Deleting the marker section entirely and restoring the shipped preset's
  eleven original sections still produced a `<long_term_memory>` block in the
  captured outbound prompt, in both Conversation and Roleplay.
