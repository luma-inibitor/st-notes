# Verification ledger

The record of every factual claim behind the LTM feedback, its verdict, and where
it was checked. The point of this file is that a claim verified here is settled:
if it comes up again, cite the row rather than re-investigating.

Nothing enters the findings document without a row here.

## What was read

| | |
|---|---|
| Long-Term Memory package | 1.1.6, capability API 1.6 |
| Marinara Engine | 2.4.1 |
| LTM source checkout | `Marinara-Agents` @ `packages/long-term-memory/src/engine/packages/{server,client,shared}/src` |
| Stock LTM UI | `client/src/features/long-term-memory/` — `ReviewQueue.tsx`, `MemoryVault.tsx`, `LtmWorkspace.tsx`, `SourcesWorkspace.tsx`, `LongTermMemoryDetail.tsx`, `MemorySettings.tsx`, `ChatSettings.tsx`, `ActivityView.tsx`, `LastInjectionSummary.tsx` |
| Engine source checkout | `Marinara-Engine` @ `packages/{server,client,shared}/src` |
| Operator tooling (not stock) | `maridiag.cjs` (503 lines), `embprobe.cjs` (178), `migrate.cjs` (1,981), `review-app.cjs` (2,545) |
| Verified | August 2026 |

## Citation convention

**File plus symbol, never line number.** Line numbers rot across releases and a
maintainer reading this later would find a citation pointing somewhere unrelated.
Where an error message exists, quote it verbatim — those are greppable and stable.

## Verdict vocabulary

| Verdict | Meaning |
|---|---|
| `confirmed` | Read in source at the cited symbol, or reproduced with a captured artifact |
| `refuted` | Source says otherwise; the claim as stated is wrong |
| `partial` | Directionally right, overstated or misframed as originally written |
| `attributed` | Behavior belongs to the operator's own tooling, not the stock package |
| `open` | Not yet checked |

---

## Package internals — confirmed

| Claim | Verdict | File | Symbol / anchor |
|---|---|---|---|
| Section text capped at 20,000 chars | `confirmed` | `draft-projector.ts` | inside `mergeSection()`; error `"A projected section exceeds the 20,000-character text limit."` |
| Section capped at 100 contributions | `confirmed` | `draft-projector.ts` | inside `mergeSection()`; error `"A projected section exceeds the 100-contribution limit."` |
| Which sections are additive | `confirmed` | `draft-projector.ts` | `isAdditiveLtmSection()` — timeline always; character except `items`/`progression`; relationship only `history`; world always; tone only `observations`; else `tags.includes("anchor")` or `key === "anchors"` |
| `add_link` is idempotent on duplicates | `confirmed` | `draft-projector.ts` | `linksEqual()` (target + relation + aspect) and `uniqueLinks()`; `changesForMutation` returns `[]` when the link already exists |
| `add_link` disposition is always `merge` | `confirmed` | `draft-projector.ts` | `dispositionForMutation()` |
| Fuzzy dedup exists at all | `confirmed` | `dedup.ts` | `deduplicateUnits()`, `lexicalThreshold = 0.85`, `existingSectionCandidates()` |
| Dedup key never crosses sections or notes | `confirmed` | `dedup.ts` | key is `noteId \0 sectionKey` inside `deduplicateUnits()` |
| Recency cooldown is unreachable | `confirmed` | `ranking.ts`, `retrieval.ts` | `LtmRankCooldown` type, consumed by `reciprocalRankFuse(lanes, { cooldowns })`; sole caller in `retrieval.ts` invokes `reciprocalRankFuse(lanes)` with no options, so `cooldowns` is always `undefined` |
| Provenance labels stripped before injection | `confirmed` | `chunking.ts` | `cleanLongTermMemoryChunkText()`, `LEGACY_LABEL_SUFFIX_PATTERN`, `INLINE_EVIDENCE_LABEL_PATTERN` |
| Timeline grounding is a whole-draft invariant | `confirmed` | `reconciliation.ts` | `preflight()`; errors `"Timeline event {id} must link to draft source {sourceNoteId}."` and `"Long-term memory {id} must link to a timeline event grounded in the same source."` |
| Dependency auto-inclusion covers undecided only, never rejected | `confirmed` | `reconciliation.ts` | `filterAutoApplyDependencies()` plus `autoIncludedMutationIds` accumulation in `applyInner()`; draws `add_link` and its `create_note` from `draft.mutations`, and rejected mutations are removed from the draft before that runs |
| Partial accept returns the draft to `pending` with only unselected mutations | `confirmed` | `reconciliation.ts` | `applyInner()` → `updateDraftStatusUnlocked(id, partial ? "pending" : "accepted", { applyState: partial ? "not_started" : "complete", mutations: partial ? <only skipped> : … })` |
| Low-risk auto-apply gate | `confirmed` | `reconciliation.ts` | `lowRisk()` — requires `risk === "low"`, excludes scene-prefixed notes and notes carrying `conflicts` |
| Seven mutation kinds | `confirmed` | shared schema | `create_note`, `append_section`, `update_section`, `add_link`, `set_keywords`, `set_status`, `set_subjects` |
| Extraction fingerprint is gated | `confirmed` | `source-processing.ts` | `canMarkCurrent()` — fingerprint written only on `success`, deterministic `partial_success` with no error diagnostics, or `no_suggestions_created` with zero drops |
| Freshness derived at read time, never stored | `confirmed` | `draft-review.ts` | `draftFreshness()` |
| Rejection records are structured | `confirmed` | `routes.ts`, extraction | `/rejected-suggestions`; each carries reason code, message, source snippet, and a `recovery` object naming note type, note id, section key and status |
| Embedding host is hard-wired local | `confirmed` | `capability-embedding.service.ts` | returns `localEmbed(...)` unconditionally; space id `local:Xenova/all-MiniLM-L6-v2:q8:mean:normalized:v1` |
| Budget computes per-candidate explain data | `confirmed` | `budget.ts` | typed `rejectionReason` from `budget`, `lower_rank`, `score_threshold`, `duplicate_text`, `missing_chunk`, plus lane scores, raw lane scores, cooldown penalty, tier, estimated tokens |
| Injection is verified against the real prompt | `confirmed` | `generation-injection.ts` | `recordGenerationLongTermMemoryDispatch()` checks `isLongTermMemoryPromptPresent(messages, receipt.artifact.content)` before recording |

## Engine internals — confirmed

| Claim | Verdict | File | Symbol / anchor |
|---|---|---|---|
| A prompt-assembling preset can void agent injection, receipt included | `confirmed` | `packages/server/src/routes/generate.routes.ts` | `presetOwnsAgentPlacement`; guard reads `if (handledByPresetSection \|\| !presetOwnsAgentPlacement)` — when the branch is skipped there is no injection and no `longTermMemoryRecallReceipt` assignment |
| Automated summary entries hard-capped | `confirmed` | `packages/shared/src/utils/chat-summary-entries.ts` | `MAX_AUTOMATED_CHAT_SUMMARY_ENTRIES = 200` |
| Day summaries inside a consolidated week are skipped | `confirmed` | `packages/server/src/routes/generate/conversation-history-runtime.ts` | `dayToWeek` map; `if (args.dayToWeek.has(date)) continue;` |

## Measurements

Numbers produced by analysis rather than read from source. The distinction
matters and is stated wherever these are cited.

| Measurement | Method | Result |
|---|---|---|
| Cost of a full dedup pass | Line-for-line port of `tokenize()`, `jaccardSimilarity()` and `deduplicateUnits()`, run over 1,142 claims against 161 notes × 5 sections (3.2 MB stored text). **Not the shipped function under test.** | 123 ms to index stored sections, 10 ms to compare all units, **133 ms total** — no embeddings, no model calls, no network |
| Jaccard score of an exact-duplicate claim (~11 tokens) against the whole stored section, as the section grows | same port | 226 chars → 0.478 · 568 chars → 0.186 · 2 KB → 0.060 · 5 KB → 0.040 · 20 KB → 0.040. Threshold is 0.85, so it never fires |
| `tokenize()` truncation effect | same port | slices at 500 tokens, so a 20 KB section compares identically to a 5 KB one |
| Restatement in a real saturated section | Dedupe pass at 0.7 shingle similarity | 35,805 → 4,327 chars, i.e. **88% restatement** |
| Low-durability content in a real identity note | Manual audit | ~10% removable with no information loss |
| Semantic duplicates lexical dedup passed through | Embedding sweep over corpus bullets, cosine threshold ≈0.88 | ~35 genuine same-fact-different-words pairs |
| Corpus shape | Tokenizer count over the source file | 97 entries, 53,933 tokens, max 1,405 tokens / 60 key details, 17 over threshold; after cleanup 96 entries, max 776 tokens, 45,646 tokens |
| Extraction rejection breakdown | `GET /rejected-suggestions` after a full run | 200 rejected: 132 `untrusted_subject`, 29 `invalid_format` (`evidence: Required`), 28 `invalid_format` (`dimensions`/`dimensionChanges: null`), 16 `unsupported_bucket`, 7 `missing_source_evidence` |
| Summary context reclaimed by the migration | Token counts before and after | 71,635 → 10,050 |

## Corrections to earlier drafts

Recorded here only so the same wrong conclusion is not reached a third time. These
are settled; the findings document states the correct version without narrating
the history.

| Earlier claim | Correct position |
|---|---|
| The preset `agent_data` marker section is not required — deleting it left injection working | The marker is **conditionally** required. The shipped default preset does not take the `presetOwnsAgentPlacement` branch, so injection survives without it. A preset that assembles the whole prompt does take that branch, and there the missing marker voids injection entirely. Both observations were accurate; the general claim drawn from the first was not. |
| There is no fuzzy subject matching | Fuzzy matching exists. `subject-identity.ts` matches against a trusted catalogue and records the basis (`exact_name`, `unique_alias`, `spelling_variation`, `trait_or_qualified_alias`, …). The real gap is that **nothing merges notes that have already split** — identity repair reported 0 merge candidates for the pair it was needed for. |
| Deduplication is exact-match only | Fuzzy dedup exists (`dedup.ts`, Jaccard ≥ 0.85, both directions, keyed per note + section). The real gap is that the incoming↔stored comparison is structurally unable to fire on a non-trivial section. |
| The Chat Settings injection readout is a flat count | It is a `<details>` element; expanding it lists each recalled memory with token counts and links through to the vault. The real gap is the absence of a negative state and a timestamp. |

## Stock review UI — what actually exists

Checked in `client/src/features/long-term-memory/`. Several earlier claims were
overstated; the corrected position is what the findings document states.

| Claim as originally written | Verdict | What is actually true | Where |
|---|---|---|---|
| Rejections are invisible, reachable only through the API | `refuted` | A collapsed `<details>` panel titled "Suggestions that weren't saved" sits in the review workbench, fed by `/rejected-suggestions`. Per item it shows the proposed content, a mapped "Why it wasn't saved" label, "What was expected" built from the `recovery` object, and a "Recommended fix" — and offers two actions: **Recover manually**, which hands off to the Vault prefilled and deletes the suggestion on save, and **Delete**. The real gap is that it is collapsed by default and scoped to the selected source. | `ReviewQueue.tsx` → `data-ltm-rejected-suggestions`, `recoveryLabel()`, `onRecoverCandidate`; `MemoryVault.tsx` recovery handoff |
| A rejection has no action attached, so it is inert even when shown | `refuted` | The verb exists (Recover manually). The finding is that it was never found or understood, which is discoverability and labelling, not absence. | as above |
| No bulk action at all | `refuted` | Per-mutation checkboxes, a select-all with indeterminate state, and a sticky batch bar offering "Accept eligible (n)", "Skip selected (n)" and "Clear", plus per-row accept/skip buttons. The Vault has more: select-all-visible, bulk status, bulk modes, bulk delete with `retractExtracted`. | `ReviewQueue.tsx` → `SelectionCheckbox`, `runBatch()`, `data-ltm-review-batch-actions`; `MemoryVault.tsx` |
| — new finding replacing it | `confirmed` | Selection is wiped by an effect on any change of chat, source or selected draft, so a batch can never span drafts or sources even though `runBatch` already groups its requests by draft. Bulk action is real but confined to one draft at a time. | `ReviewQueue.tsx` → `selectedIds` reset effect vs `runBatch()` grouping |
| No filter, no search, no sort | `partial` | True of the review queue, which hard-codes its query to `/drafts/review?status=pending` with no controls at all. False of the Vault, which has search with clear, a status filter, scope and context-target selectors, `<details>` groups per note type, and a "n hidden by filters" line. Vault sort is alphabetical by title and not user-changeable. | `ReviewQueue.tsx` query; `MemoryVault.tsx` search/`statusFilter` |
| Review decisions do not persist, so a second sitting starts over | `partial` | Decisions are applied immediately — each click POSTs to `/drafts/:id/accept` or `/skip` — so no applied work is ever lost. What does not survive a reload or navigation is in-progress **selection and edits**, held only in React state. The onboarding flag and admin secret are the sole `localStorage` users in the feature. | `ReviewQueue.tsx` → `runBatch()`, `selectedIds`/`editedById` reset effect |
| Edit-before-accept is completely undiscoverable | `partial` | It exists and works: an editor inside the expanded mutation panel, sent as `editedMutations` on accept, covering note title, section text and per-section importance. But it carries no Edit label, button or icon, sits two levels deep past evidence and diagnostics, and returns nothing for `add_link`, `set_keywords`, `set_status` and `set_subjects` — genuinely uneditable for 4 of the 7 mutation kinds. | `ReviewQueue.tsx` → `MutationEditor`, `editedMutations` assembly |
| Conflicts force a binary replace-or-keep choice | `refuted`, and the truth is worse | The review queue never reads `mutation.note.conflicts` at all — the string "conflict" does not occur in the file — so a `create_note` carrying conflicts presents the reviewer with no conflict information and no options whatsoever. The only rendering is read-only in the Vault, showing field, resolution status and `conflict.proposed` while never displaying `conflict.existing`, so there is no diff anywhere. | `ReviewQueue.tsx` (zero occurrences); `MemoryVault.tsx` conflict block |
| The workspace is eight steps down through Chat Settings | `refuted` | Navigation is a persistent four-tab rail (Vault / Review / Sources / Settings) with a pending-review badge, defaulting to Vault. From an open chat it is roughly 3 steps to the Vault and 4 to the review queue, or 2 and 3 via the direct button in the in-chat settings slot. | `LongTermMemoryNavigation.tsx`; `LongTermMemoryDetail.tsx`; `ChatSettings.tsx` |
| Review iterates drafts when the story is organised by subject | `partial` | The hierarchy is source → draft → target → mutation, so `targets[]` **is** consumed. But a target renders as an unlabeled wrapper element with no header, so the grouping is imperceptible, and the axis is hard-coded with no pivot or group-by control. | `ReviewQueue.tsx` target mapping and `fallbackTargets` |
| Drop reasons are presented as undifferentiated blocked items | `partial` | All 11 extraction drop reasons have distinct labels **and** distinct recommended fixes. All 8 draft block reason codes render as a raw humanized enum name plus message, with no explanation or fix. Neither is aggregated or grouped by cause; rejected items are a flat list. | `ReviewQueue.tsx` → `rejectionReasonLabels`, `rejectionRecommendedLabels`, block reason rendering |
| Mutations reference targets by opaque unclickable id | `partial` | Ids are broadly resolved to titles, and rows offer "Open memory" and "Open source"; Vault link pills are clickable. Two real gaps remain: the projection preview prints `change.before`/`change.after` raw without humanizing, and an `add_link` row never surfaces its link target at all — so the referenced timeline event is invisible rather than merely opaque, and there is no editor for that kind either. | `ReviewQueue.tsx` → `humanizeReviewText()`, target title resolution, change preview |
| No cap pressure indicator or pruning affordance | `confirmed` | No keyword count and no enforcement of the 30-keyword cap in the editor, no character counters anywhere, and `contributions` is never rendered in any component. The only cap behavior is **silent truncation** of section text at 20,000 characters in the editor. | `MemoryVault.tsx` → `TokenEditor`; `ReviewQueue.tsx` → `maxLength`/`boundedTrim` |
| Nothing shows how often a memory has been used | `confirmed` | No cumulative recall counter exists in client, server or schema. The last-injection summary shows only the most recent recall; the activity view shows only the latest recall workflow. | `LastInjectionSummary.tsx`; `ActivityView.tsx`; schema |
| No keyboard navigation, no progress tracking | `partial` | No accept/reject/next shortcuts; the only key handling is roving-tab arrows and Escape/Enter in shared controls. Counts of sources, pending mutations, ready and blocked are rendered, which is queue depth rather than "x of y reviewed". | `LtmWorkspace.tsx`; `ReviewQueue.tsx` review summary |

**Follow-up raised by this pass:** the activity view renders the latest recall
workflow with per-candidate scores and rejection reasons, which bears directly on
the claim that budget explain data never reaches the interface. Whether that
surface is gated on a debug flag is being checked separately.

## Attribution — stock package vs operator tooling

The operator built a separate review workbench and migration orchestrator. Several
claims turned out to describe those rather than the package.

| Claim | Verdict | Where it actually lives |
|---|---|---|
| The 20,000-character section error omits the note id, which is in scope at the throw site | `confirmed` as stock, **but the "in scope" half is wrong** | `draft-projector.ts` → `mergeSection()` throws it with code `projection_limit_exceeded`. `mergeSection` receives neither note id nor section key — they exist one frame up in `applyMutation` as `current.id` and `mutation.sectionKey` and are not threaded down. So this is a structural omission, not a message-formatting oversight, and the fix is slightly larger than a string change. The operator's tooling only pattern-matches the stock string to attach its own explanation. |
| The codebase never names the object in a projection error | `refuted` | It is inconsistent, not uniformly anonymous. `evidence-unit-validation.ts` emits `` `Generated target note id '${noteId}' exceeds the long-term memory storage contract.` `` and `identity-repair.ts` → `blockers()` emits key-qualified messages such as `` `${key} exceeds the 20,000-character section limit.` `` |
| Incoming↔stored dedup compares a claim against the whole section as one blob | `confirmed` | `dedup.ts` → `existingSectionCandidates()` pushes exactly one candidate per section, `{ text: section.text.trim(), tokens: tokenize(text) }`, never splitting on lines. In-batch comparison via `seenInBatch` is unit-to-unit and does work. Threshold `lexicalThreshold = 0.85`; key `noteId \0 sectionKey`. |
| `tokenize()` truncates at 500 tokens | `confirmed`, with an additional detail | `utils.ts` → `tokenize()` does `.slice(0, 500)` **and** filters out every token shorter than `minLength = 4`, so short words never participate in similarity at all. The 500 cap is a prefix slice, so late section content is invisible. |
| The operator's tooling duplicates the stock dedup | `refuted` — it is materially different | `review-app.cjs` → `markDupes()`, `shingles()`, `jac()`, `lines()`, `dedupeSection()`: line-level rather than blob-level, 4-word shingles rather than length-≥4 unigrams, thresholds 0.45 and 0.7, no token cap, and it keeps the longest of each cluster instead of dropping. This is why its stored-vs-incoming detection found duplicates the stock path cannot. |
| Semantic dedup is missing because the embedding binding is broken | `refuted` — it is missing **by construction** | The write path (`evidence-unit-extraction.ts` → `deduplicateUnits` → `draft-projector.ts`) never calls an embedding function; there are no embedding references in `dedup.ts`, `draft-projector.ts`, `source-extraction.ts` or `source-processing.ts`. Embeddings appear only in the index and retrieval half — `embedding-adapter.ts`, `rebuild.ts`, `retrieval.ts` → `embeddingsAvailable`. A dead embedding binding degrades recall quality; it has no bearing on dedup. |
| The stock review export produces an HTML file that breaks under an Android `content://` URI | `attributed` — not stock at all | The package has exactly two downloadable exports, neither HTML and neither the review queue: `GET /debug-log/export` (a `.jsonl` attachment, consumed by `ActivityView.tsx`) and `GET /backup/export` (a `.json` backup, consumed by `MemorySettings.tsx`). No `text/html` response exists anywhere. The stock review queue is a live React view. The HTML artifact is `migrate.cjs` → `buildReviewHtml()`, written to `ltm-review.html`; the script's own comment says it serves over localhost to avoid `content://` URIs. **This finding must be dropped.** |
| There is no affordance for keyword curation | `partial` | Keywords can be hand-curated: a token editor in the note editor plus `PATCH /notes/:id`. What does not exist is any ranking, cap-aware trim control, or server-side auto-prune — nothing that acts when the 30-keyword cap is hit, at which point it is a hard projection failure. `identity-repair.ts` → `blockers()` does report "Combined keywords exceed the 30-keyword note limit." as a merge blocker. The blind auto-prune-and-retry is the operator's own (`review-app.cjs`). |
| None of the steps a real migration requires is bulk-addressable | `refuted` | `POST /import/source-notes` is a genuine batch route: `sourceIds` array capped at 100, `importConcurrency` 1–10, `extract` defaulting to true, returning a batch report with `batchStatus`, `imported[]`, `writeFailures[]`, `missingSourceIds[]`. `POST /notes/batch`, `POST /notes/permanent-delete` and `POST /notes/transfer` are also batch. The Sources UI has multi-select with select-all and posts `sourceIds` in bulk, abortable. **The narrowed claim that survives:** per-source re-extraction is single-item and serialized, and review accept/skip is per-draft. |
| Extraction has no batching endpoint, no progress stream, and no server-side job model | `partial` | No SSE, websocket, polling interval, job table or pollable operation status exists — `operationId` is minted per call and only echoed back, with no route to query it. But a batching endpoint **does** exist (`POST /import/source-notes`, up to 100 sources at concurrency up to 10). It is still one long synchronous request returning only a terminal report, so progress mid-batch is unobservable; the only mid-flight control is client-side abort, which the server does honor. |
| Re-running extraction silently skips work unless server-side fingerprints are cleared, and no interface does that | `refuted` on both halves | A stock re-extract control exists in the Sources UI (`reextract()` → `POST /notes/:id/extract`, surfaced as two buttons). And extraction never skips: `prepareLongTermMemorySource()` calls the model unconditionally; the fingerprint is written after the fact and is used only for a post-hoc 409 concurrency guard, draft staleness labelling, and preview freshness colouring — never as a skip gate. **The residual true observation:** re-extract is single-item and serialized, and the 409 guard can abort a re-extract *after* the model call has already been paid for if scope or modes changed concurrently. |

## Open — under investigation

Rows land here when a claim is raised and clear out when a verdict is recorded.
Currently pending: stock review UI capabilities (grouping, bulk actions, filters,
decision persistence, keyboard navigation, edit-before-accept discoverability,
conflict options, cap indicators, rejection display); attribution of the
20,000-char error message, the dedup implementation, the HTML review export and
keyword pruning between stock package and operator tooling; whether `personaId` is
reachable through the stock UI; structured-output requirements and whether
null-for-optional rejection is a bug; which hop the 300s timeout belongs to;
whether the real chronology finding is ordering between event memories rather than
a missing date field; the actual impact of provenance stripping; the ADMIN_SECRET
403 path and what the UI says when it fails; and a per-endpoint account of which
observability data the stock UI already surfaces.
