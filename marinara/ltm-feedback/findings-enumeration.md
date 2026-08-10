# Findings enumeration — working list

Flat list, no clusters. One line per finding so lines can be reordered, merged,
split or deleted freely. Order below is loose pipeline order (onboarding →
recall → extraction → review → growth → errors → engine → corpus), which is
**not** a proposed cluster axis — just something to read down.

Format: `id — sentence` then tags, then evidence grade.

Tags: `UX` `ARCH` `SCALE` `USER` `ENV` `MODEL` `ENGINE` (Marinara Engine, not the
package) `CORPUS` (upstream of the package — what the vault is fed) `PROTO`
(observed in the operator's own review workbench, not stock LTM).

Grades: `source` read in source at a named symbol · `observed` reproduced with a
captured artifact · `measured` from a benchmark or analysis · `reported` from the
operator's account or a session without source access.

---

## Mental model and first run

1. **vocabulary-undefined** — The pipeline has seven nouns (source note, extraction, evidence unit, mutation, draft, note, section, chunk) with strict ordering and distinct meanings, and none is defined anywhere a user can reach. `UX` `ARCH` · observed
2. **which-memory-system** — Nothing in the product tells a user whether their situation calls for lorebooks, LTM, or both. `UX` · reported
3. **empty-default-source-tab** — Sources opens on Chat Summaries, which is empty on a new chat, and the empty state explains neither why nor when that changes nor that an adjacent tab has an importable source. `UX` · observed
4. **conversation-is-not-a-source** — People arrive wanting to remember the conversation, but the conversation is not a source; only its summaries are, produced by a different subsystem on its own schedule. `UX` `ARCH` · source
5. **workspace-behind-long-descent** — The memory workspace is reached by an eight-step descent through Chat Settings, so nothing about the feature is reachable from where its results appear. `UX` · observed
6. **two-loops-one-surface** — The bursty offline curation loop and the every-turn recall loop share one four-tab workspace, so the batch loop drowns the per-turn loop and the per-turn loop has nowhere to report. `UX` `ARCH` · source
7. **source-notes-counted-as-memories** — Source notes are a note type in the same vault, folder listing and totals as real memories, so a vault reads "107 memories" when 11 are memories. `UX` `ARCH` · source

## Does recall reach the model

8. **preset-voids-injection** — When the active preset assembles the whole prompt and carries no `agent_data` marker section for the package, recall is discarded entirely: no injection, no context injection, and no receipt. `ENGINE` `ARCH` `UX` · source
9. **frozen-injection-readout** — The last-injection readout is driven by the receipt and has no negative state and no timestamp, so when nothing is injected it keeps displaying a previous run's number indefinitely. `UX` `ARCH` · observed
10. **born-mode-ineligible** — Memories extracted inside a Conversation chat are saved with Available modes set to Roleplay only, making them ineligible in the very chat that produced them, and the control that fixes it is never surfaced at accept time. `ARCH` `UX` · observed
11. **nothing-recalled-one-message** — Empty vault, no match, below score threshold, dropped for budget and ineligible for this chat mode all render identically as an absence. `UX` · source
12. **explain-discarded** — `budget.ts` computes a typed `rejectionReason`, lane scores, tier and estimated tokens for every discarded candidate on every turn, and throws it away unless debug mode is on, then routes it to a log file. `UX` `ARCH` · source
13. **no-recency-weighting** — `LtmRankCooldown` is declared and consumed inside `reciprocalRankFuse`, but the sole caller passes no options object, so the entire recency-penalty branch is unreachable. `ARCH` · source
14. **no-date-field** — Dates live in prose inside section text by convention only; there is no structured date field, and `chunk.updatedAt` exists and is never rendered at injection. `ARCH` `UX` · source
15. **provenance-stripped-at-injection** — `cleanLongTermMemoryChunkText` strips `[note: …]` and `[evidence: …]` labels before injection, removing provenance the model might otherwise have used to date or attribute a memory. `ARCH` · source
16. **ranking-internals-unsurfaced** — Priority tiers and per-lane scores decide what the model sees and are never named anywhere in the interface. `UX` · source
17. **embeddings-fail-silently** — The capability embedding host hard-wires the local ONNX embedder with no remote fallback; where its native binding cannot load, the vault rebuild still reports success and `embeddedChunkCount: 0` is presented as a value rather than an error. `ENV` `ARCH` `UX` `MODEL` · observed
18. **index-rebuild-failure-invisible** — A draft can be `accepted` while its post-apply index rebuild failed, so the memory exists, the vault looks correct, and recall cannot see it. `ARCH` `UX` · source

## Extraction

19. **personaid-unset-drops-a-third** — One unset scope field (`personaId`) failed the trusted-subject check for every claim about the operator's persona, dropping 132 of 200 candidates, and the run reported success. `USER` `UX` `ARCH` · observed
20. **rejections-invisible** — 200 auto-rejected candidates were reachable only through `GET /rejected-suggestions`, while the vault looked healthy. `UX` · observed
21. **rejections-inert-without-a-verb** — Even when the rejection pile is displayed, a list of things that didn't happen with no action attached goes unused. `UX` · reported
22. **drop-reasons-undifferentiated** — Eleven typed extraction drop reasons are presented to the reviewer as undifferentiated blocked items. `UX` `ARCH` · source
23. **no-extraction-completion-summary** — An extraction that discards a third of its output reports as a success, with no completion summary stating what was dropped or why. `UX` `ARCH` · observed
24. **model-compat-costs-money** — There is no capability probe, schema-compatibility check or single-entry dry run, so structured-output incompatibilities are discovered by paying for a full run and reading the rejection breakdown. `MODEL` `ARCH` `UX` · observed
25. **null-optional-not-tolerated** — The structured-output fallback matcher rejects explicit `null` for optional object fields, a common and trivially normalisable model behaviour that cost 28 claims. `MODEL` `ARCH` · observed
26. **no-progress-channel** — Extraction is per-source, synchronous, one HTTP request each, with no batching endpoint, no progress stream and no server-side job model, so a 25–35 minute run is indistinguishable from a hung process and a client crash loses position. `SCALE` `ARCH` `UX` · observed
27. **default-http-timeout-kills-extraction** — undici's default 300s headers timeout aborts long extraction requests, so any client must set an explicit timeout to survive. `ARCH` · observed
28. **fingerprint-trap** — A partly-failed extraction never earns its `extractionFingerprint`, so every later read computes freshness as `hashless` or `stale` and the drafts are permanently blocked behind a message describing a different cause. `ARCH` `UX` · source
29. **no-reextract-path** — Re-running an extraction from corrected sources silently skips work unless server-side fingerprints and ledgers are cleared, and no interface does that. `ARCH` `UX` · observed
30. **oversized-source-fails-extraction** — A single source entry large enough to exceed the model's output limit fails extraction outright, and nothing upstream enforces a size the summariser produced. `MODEL` `ARCH` · observed
31. **no-mutations-vs-stale-conflated** — "No mutation survived extraction" (every candidate was dropped in validation) and "the source changed" are different problems presented identically. `UX` · source
32. **freshness-changes-with-no-user-action** — Freshness is recomputed on every read, so editing the character card a source came from silently blocks its drafts with no notification. `ARCH` `UX` · source
33. **no-bulk-import-path** — None of the nine steps a real migration requires is bulk-addressable through the interface; each is a per-chat manual operation or has no surface at all. `SCALE` `UX` · observed

## Review

34. **review-per-draft-not-per-subject** — Review iterates sources when the story is organised by subject, so seeing 40 claims about one character means visiting 40 drafts, even though the review response already returns a `targets[]` array carrying exactly that pivot. `SCALE` `UX` `ARCH` · source
35. **no-bulk-anything** — At 97 drafts and ~1,150 claims the stock review surface offers no bulk action, no filter, no grouping, no search, no keyboard navigation and no progress tracking. `SCALE` `UX` · observed
36. **decisions-dont-persist** — Review decisions do not survive the session, so reviewing across two sittings starts over. `SCALE` `UX` · observed
37. **real-unit-is-a-cohort** — The unit of work a reviewer actually operates on is an ad-hoc slice (risk × subject × quality flag), worked to exhaustion and applied, not "a draft" and not "a note". `UX` · reported
38. **invariants-invisible-until-apply** — Whole-draft invariants spanning claims are checked at apply time and are invisible during review, surfacing only as atomic whole-draft failures afterward. `ARCH` `UX` · source
39. **reject-is-irreversible** — Dependency auto-inclusion draws only from mutations still in the draft, so leaving a dependency undecided is recoverable and explicitly rejecting it is not — the opposite of a reviewer's instinct to tidy up by rejecting redundant-looking items. `ARCH` `UX` · source
40. **no-preflight** — 14 of 25 apply-time failure modes are knowable from the selection before anything is sent, and none is checked. `ARCH` `UX` · source
41. **no-undo** — The transaction journal holding the before-state of every touched file is deleted on commit, so there is no revert route, no per-note history, and "accept all 412" is irreversible. `ARCH` · source
42. **disposition-not-the-grouping-key** — Grouping the queue by mutation kind sorts by mechanism; `disposition` (`new`/`merge`/`rewrite`) sorts by consequence, which given no undo is the only distinction that decides whether bulk action is safe. `ARCH` `UX` · source
43. **matchbasis-not-threaded** — Subject resolution records how a name was matched (`exact_name`, `spelling_variation`, `unique_alias`, …), but that signal never reaches the mutation, so claims bound to the wrong character by a weak match cannot be triaged. `ARCH` `UX` · source
44. **partial-apply-rewrites-the-draft** — Partial apply keeps the draft `pending` and replaces its mutation list with only the skipped ones, so applied work vanishes from that view with no record that it happened. `ARCH` `UX` · source
45. **auto-apply-is-silent** — Low-risk mutations from chat-summary sources can apply without review while character and lorebook sources never can, and nothing states which sources skip review or what was applied on the user's behalf. `ARCH` `UX` · source
46. **edited-mutations-undiscoverable** — Edit-before-accept is fully supported by the accept route and re-validated server-side, and is completely undiscoverable from the interface. `UX` · source
47. **conflicts-force-a-binary-choice** — A conflict offers replace or keep, when most apparent contradictions in a long story are the relationship moving rather than a factual dispute, and the missing third option (keep both as history) is how the timeline is preserved. `ARCH` `UX` · source
48. **no-usage-signal-on-existing-text** — Nothing tells a reviewer how often the model has actually leaned on the text they are about to overwrite. `UX` · source
49. **opaque-unclickable-ids** — Mutations reference timeline events and notes by opaque id with no way to inspect or navigate to what they point at, so a reviewer cannot tell near-duplicate targets apart. `UX` · reported
50. **export-breaks-on-content-uri** — The stock review export is an HTML file that, opened through Android's file provider, receives a `content://` URI from which relative fetches are impossible, so the page shows zero items on the platform that generated it. `ENV` `UX` · observed
51. **no-host-binding-guidance** — Loopback bypasses the admin secret and `HOST=0.0.0.0` is required to review from another device, and nothing in the product discusses the tradeoff. `ENV` `UX` · observed

## What happens over months

52. **caps-are-cliffs** — Seven hard limits (keywords 30, tags 100, links 250, conflicts 250, section text 20,000 chars, section contributions 100, evidence refs 100) are enforced at write time with no pressure indicator, warning threshold or pruning affordance. `ARCH` `UX` `SCALE` · source
53. **projector-unions-without-pruning** — Additive sections and keyword lists union without pruning, so saturation is not a risk but the guaranteed steady state of any long-running story. `ARCH` `SCALE` · source
54. **stored-dedup-inert** — The incoming↔stored dedup comparison Jaccards a single ~11-token claim against the entire section as one blob at a 0.85 threshold, so it can only fire when the section is nearly empty and goes silent exactly when a note is large enough to need it. `ARCH` `SCALE` · measured
55. **tokenize-truncates-at-500** — `tokenize()` slices to the first 500 tokens, so content late in a long section is invisible to duplicate comparison regardless of anything else. `ARCH` · source
56. **dedup-never-crosses-sections-or-notes** — The dedup key is `noteId + sectionKey`, so the same fact filed under two section keys, or landing on both halves of a split identity, survives twice. `ARCH` · source
57. **semantic-dedup-missing** — Duplicate detection is lexical, so a reworded restatement of an existing claim is stored and competes for retrieval budget forever; an embedding sweep found ~35 same-fact-different-words pairs lexical dedup had passed through. `ARCH` `SCALE` · measured
58. **no-compaction-story** — Additive sections under a hard cap have no decay, prune or compaction pass, and nothing in the product acknowledges that they must eventually fill. `ARCH` `UX` · source
59. **identity-section-mixes-five-claim-kinds** — A character note's identity section accumulates stable traits, trait changes, dispositions, backstory and events competing for one additive section and one budget, so the characters with the most development saturate first. `ARCH` `MODEL` `UX` · reported
60. **keyword-truncation-not-curation** — The 30-keyword cap is hit routinely, and the only available workaround trims blindly, destroying curated keyword lists as a side effect of applying unrelated claims. `ARCH` `UX` · observed
61. **identity-split-never-merges** — Fuzzy matching exists for initial subject binding, but nothing merges notes that have already split, and identity repair reported zero merge candidates for the very pair it was needed for. `ARCH` `USER` `UX` · observed
62. **note-ids-derive-from-strings-undocumented** — Note ids derive from claim subject strings, which is what makes name normalisation a prerequisite for a clean vault, and it is stated nowhere. `ARCH` `UX` · source
63. **no-claim-correction-path** — There is no stated mechanism for correcting a claim already in the vault short of re-ingesting from a corrected corpus. `ARCH` `UX` · source
64. **no-per-claim-provenance-grade** — Nothing distinguishes a near-verbatim extraction from a thrice-compressed paraphrase once it is in the vault. `ARCH` · source
65. **identity-note-bloat** — Roughly 10% of one real identity note was low-durability material — routines, schedules, one-off logistics — removable with no information loss. `SCALE` `MODEL` · measured

## Errors and observability

66. **errors-name-rule-not-object** — `"A projected section exceeds the 20,000-character text limit."` fired 35 times in one run with no note id, section key or current size, against a vault of 161 notes, while the note id was in scope at the throw site. `UX` `ARCH` · observed
67. **schema-dump-as-error** — The storage-contract error does name the note, then delivers the actionable part as a raw schema-validation dump. `UX` · observed
68. **instrumentation-no-consumer** — Five endpoints (`/rejected-suggestions`, `/debug-log`, `/last-injection/:chatId`, `/integrity`, `/status`) already know why memory is not working, and nothing assembles them into a surface a user can read. `UX` · source
69. **no-vault-state-view** — There is no "what state is my memory in" view at all, which is why a 503-line read-only diagnostic had to be written to answer it. `UX` · observed

## Marinara Engine

70. **backfill-into-consolidated-week-is-a-noop** — Writing a day summary for a day inside a consolidated week is skipped silently, so an unknown number of backfills over several months did nothing. `ENGINE` `USER` · source
71. **two-summary-subsystems-dont-know-about-each-other** — Roleplay and Conversation summaries use different storage, formats, compression behaviour and date handling, and nothing reconciles them for a story told in both modes. `ENGINE` `ARCH` · source
72. **no-roleplay-summary-compression** — Conversation summaries compress into weeks while roleplay summaries grow until a hard delete at 200 entries. `ENGINE` `ARCH` · source
73. **card-memory-leakage** — Concluded scenes wrote global `characterMemories[]` entries onto the character card, leaking scene-local state into every chat using that card. `ENGINE` · observed
74. **summary-order-derives-from-seq** — Entry ordering derives from a sequence number rather than narrative position, so a mis-sequenced input inverts the order of events within a day and propagates straight into the memory timeline. `ENGINE` `CORPUS` · observed

## What the vault is fed

75. **summariser-drifts-quantified-claims** — A numeric estimate survived summarisation exactly while its referent was replaced by the dominant nearby theme, producing a claim that is superficially correct, internally consistent and completely wrong. `CORPUS` `MODEL` · reported
76. **summariser-invents-superlatives** — "First time" attributions appeared on dates where the event did not occur, including the same event marked a first on two different dates. `CORPUS` `MODEL` · reported
77. **superlatives-and-numbers-are-the-risk-class** — Paraphrase drift silently changes meaning rather than merely losing detail precisely on superlatives and bare quantities, which is where a memory system can least afford it. `CORPUS` `MODEL` · reported
78. **boilerplate-becomes-durable-claims** — One scene-continuation phrase appeared 37 times, frequently doubled into a key-detail bullet, and was therefore extracted as a claim carrying no durable fact. `CORPUS` · measured
79. **chunk-filler-becomes-claims** — Status text like "scene ongoing" appeared as standalone bullets purely as an artifact of where the chunker cut, some with a real fact welded on so they could not be pattern-deleted. `CORPUS` · reported
80. **ooc-recorded-as-in-fiction-fact** — Out-of-character planning notes were summarised indistinguishably from events, and one planning entry's contents were later narrated, entering memory twice as plan and as event. `CORPUS` · reported
81. **multi-fact-bullets** — The ingest contract is roughly one bullet per claim, but bullets bundling an event, its cause and its resulting state become one muddled claim or are dropped. `CORPUS` · reported
82. **oversized-entries-degrade-toward-the-tail** — 17 of 97 entries exceeded the size threshold, and long entries visibly degrade as they go: dates and names get sloppier further in. `CORPUS` `MODEL` · measured
83. **layered-summarisation-compounds-drift** — Summarise, summarise again, merge: every pass is a drift opportunity, and the final artifact carries no signal distinguishing near-verbatim claims from thrice-compressed ones. `CORPUS` · reported
84. **cross-entry-contradictions** — When two source entries disagree the result is either a conflict requiring manual resolution or both versions retrieved and handed to the model together, and neither is recoverable automatically. `CORPUS` `ARCH` · reported

## Prototype workbench

Observed in the operator's own review tool, not stock LTM. Kept because the tool
is the design evidence for the review section; delete if it muddies the audience.

85. **proto-facets-dont-teach** — Facets that reflect the data model (draft status, mutation kind, risk) read identically to facets that are pure user convenience (saved views, ad-hoc tags), so the distinction the author clearly intended is not legible. `PROTO` `UX` · reported
86. **proto-nits** — Hotkeys swallow cmd+C; "collapse all" does not collapse everything; the stored-content section cannot be collapsed; the facet panel does not dismiss on click-away or Esc; cross-references are not clickable; the Clear button sits at the end of the facet row and is unreachable on mobile without scrolling it. `PROTO` `UX` · reported

---

## Not yet placed

- **What the system gets right** has no home in the current outline: the typed note model, evidence links and `extracted_from` provenance, conflicts recorded rather than resolved, dependency auto-inclusion, `editedMutations`, partial accept returning the draft to `pending`, permissive scope overlap, and the rejection data model. Needs a section — probably short, in orientation or as the opening of recommendations, framed as what not to touch.
- **Merge candidates** to consider: 11+12 (one message / discarded explain), 14+15 (no date field / provenance stripped), 52+53 (caps / union without pruning), 54+55+56 (the three dedup blind spots), 75+76+77 (the summariser accuracy cluster), 34+35+36 (review at scale).
- **Split candidate**: 8 is Engine-owned while 9 is package-owned, and they were one finding in the earlier draft.
- **Possibly not findings**: 27 (a client-side timeout the client must set), 65 and 79–83 (properties of this corpus rather than the product), 86 (prototype nits).
