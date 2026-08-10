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
