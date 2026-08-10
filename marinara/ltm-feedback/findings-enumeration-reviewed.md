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

## removed

2. **which-memory-system** — too hairy

## Mental model and first run

1. **vocabulary-undefined** — The pipeline has seven nouns (source note, extraction, evidence unit, mutation, draft, note, section, chunk) with strict ordering and distinct meanings, and none is defined anywhere a user can reach. `UX` `ARCH` · observed
3. **empty-default-source-tab** — needs reword for clarity
4. **conversation-is-not-a-source** — suggest reword to reframe as an invariant that should exist but doesn't: "Memories should be enabled for the chat type they were sourced from."
5. **workspace-behind-long-descent** — needs reword
6. **two-loops-one-surface** — this needs reword. it's currently kmind of unclear
7. **source-notes-counted-as-memories** — Source notes are a note type in the same vault, folder listing and totals as real memories, so a vault reads "107 memories" when 11 are memories. `UX` `ARCH` · source

## Does recall reach the model

8. **preset-voids-injection** — needs reword
9. **frozen-injection-readout** — The last-injection readout is driven by the receipt and has no negative state and no timestamp, so when nothing is injected it keeps displaying a previous run's number indefinitely. `UX` `ARCH` · observed
10. **born-mode-ineligible** — is this not a dupe of 4?
11. **nothing-recalled-one-message** — Empty vault, no match, below score threshold, dropped for budget and ineligible for this chat mode all render identically as an absence. `UX` · source
12. **explain-discarded** — `budget.ts` computes a typed `rejectionReason`, lane scores, tier and estimated tokens for every discarded candidate on every turn, and throws it away unless debug mode is on, then routes it to a log file. `UX` `ARCH` · source
13. **no-recency-weighting** — reword for simplicity. maybe "Recency-based weighting appears to be implemented, but the code branch is currently unreachable"
14. **no-date-field** — this isn't necessarily a gap because RP and GM mode chats don't inject real-world date/time into model context by default. we should rethink this finding, possibly reframe as lack of chronology between event memories
15. **provenance-stripped-at-injection** — what's the impact of this? given the sources are always stored i thought this was a non issue
16. **ranking-internals-unsurfaced** — what's the impact of this? does the user really need to know?
17. **embeddings-fail-silently** — The capability embedding host hard-wires the local ONNX embedder with no remote fallback; where its native binding cannot load, the vault rebuild still reports success and `embeddedChunkCount: 0` is presented as a value rather than an error. `ENV` `ARCH` `UX` `MODEL` · observed
18. **index-rebuild-failure-invisible** — A draft can be `accepted` while its post-apply index rebuild failed, so the memory exists, the vault looks correct, and recall cannot see it. `ARCH` `UX` · source

## Extraction

19. **personaid-unset-drops-a-third** — is this an artifact of the way i tried to manage memories programmatically?
20. **rejections-invisible** — i'm not sure if this is true so much as the rejections are difficult to surface. some kind of rejection shows up in the main review queue, and then under settings>debug you can see additional information. it's just hard to find, the impact is unclear, and it's unclear what action the user is supposed to take
21. **rejections-inert-without-a-verb** — possibly should be folded into #20
22. **drop-reasons-undifferentiated** — reword for clarity
23. **no-extraction-completion-summary** — An extraction that discards a third of its output reports as a success, with no completion summary stating what was dropped or why. `UX` `ARCH` · observed
24. **model-compat-costs-money** — tbh unsure what maintainer should do about this. like what are the structured output reqs and why is this model specific?
25. **null-optional-not-tolerated** — is this a bug?
26. **no-progress-channel** — fact check?
27. **default-http-timeout-kills-extraction** — is this pebkac though? like should this be mitigated by preventing overly long sources from getting submitted in the first place?
28. **fingerprint-trap** — A partly-failed extraction never earns its `extractionFingerprint`, so every later read computes freshness as `hashless` or `stale` and the drafts are permanently blocked behind a message describing a different cause. `ARCH` `UX` · source
29. **no-reextract-path** — fact check?
30. **oversized-source-fails-extraction** — A single source entry large enough to exceed the model's output limit fails extraction outright, and nothing upstream enforces a size the summariser produced. `MODEL` `ARCH` · observed
31. **no-mutations-vs-stale-conflated** — reword to mention what the user sees vs the different underlying reasons
32. **freshness-changes-with-no-user-action** — wdym "silently blocks its drafts"?
33. **no-bulk-import-path** — fact check plz

## Review

34. **review-per-draft-not-per-subject** — i think this is better stated as "review grouped by draft is clunky and users will want to group by different properties" -- based on my personal review tool
35. **no-bulk-anything** — fact-check this. there are some bulk ops and filters but there aren't enough and they're clunky
36. **decisions-dont-persist** — unclear where this comes from. i thought that when you submitted a review decision in the ltm ui, it's applied immediately. fact-check
37. **real-unit-is-a-cohort** — possible dupe of #34
38. **invariants-invisible-until-apply** — Whole-draft invariants spanning claims are checked at apply time and are invisible during review, surfacing only as atomic whole-draft failures afterward. `ARCH` `UX` · source
39. **reject-is-irreversible** — Dependency auto-inclusion draws only from mutations still in the draft, so leaving a dependency undecided is recoverable and explicitly rejecting it is not — the opposite of a reviewer's instinct to tidy up by rejecting redundant-looking items. `ARCH` `UX` · source
40. **no-preflight** — 14 of 25 apply-time failure modes are knowable from the selection before anything is sent, and none is checked. `ARCH` `UX` · source
41. **no-undo** — The transaction journal holding the before-state of every touched file is deleted on commit, so there is no revert route, no per-note history, and "accept all 412" is irreversible. `ARCH` · source
42. **disposition-not-the-grouping-key** — not sure what this is supposed to mean. what's the impact and what's the alternative?
43. **matchbasis-not-threaded** — Subject resolution records how a name was matched (`exact_name`, `spelling_variation`, `unique_alias`, …), but that signal never reaches the mutation, so claims bound to the wrong character by a weak match cannot be triaged. `ARCH` `UX` · source
44. **partial-apply-rewrites-the-draft** — Partial apply keeps the draft `pending` and replaces its mutation list with only the skipped ones, so applied work vanishes from that view with no record that it happened. `ARCH` `UX` · source
45. **auto-apply-is-silent** — Low-risk mutations from chat-summary sources can apply without review while character and lorebook sources never can, and nothing states which sources skip review or what was applied on the user's behalf. `ARCH` `UX` · source
46. **edited-mutations-undiscoverable** — wdym by this? i thought there was an edit-before-approve affordance in the frontend. are you saying it's just finicky or clunky or there's no broader visibilyt or something?
47. **conflicts-force-a-binary-choice** — A conflict offers replace or keep, when most apparent contradictions in a long story are the relationship moving rather than a factual dispute, and the missing third option (keep both as history) is how the timeline is preserved. `ARCH` `UX` · source
48. **no-usage-signal-on-existing-text** — Nothing tells a reviewer how often the model has actually leaned on the text they are about to overwrite. `UX` · source
49. **opaque-unclickable-ids** — Mutations reference timeline events and notes by opaque id with no way to inspect or navigate to what they point at, so a reviewer cannot tell near-duplicate targets apart. `UX` · reported
50. **export-breaks-on-content-uri** — this is specific to my personal review tool
51. **no-host-binding-guidance** — reword: if ADMIN_SECRET is unset, the ltm settings just don't load properly and the user doesn't get feedback about _why_. i discovered the ADMIN_SECRET thing was the problem by observing HTTP 403s in the network tools and then asking mari why i was getting 403's. the ltm ui just said there was an error.

## What happens over months

52. **caps-are-cliffs** — Seven hard limits (keywords 30, tags 100, links 250, conflicts 250, section text 20,000 chars, section contributions 100, evidence refs 100) are enforced at write time with no pressure indicator, warning threshold or pruning affordance. `ARCH` `UX` `SCALE` · source
53. **projector-unions-without-pruning** — Additive sections and keyword lists union without pruning, so saturation is not a risk but the guaranteed steady state of any long-running story. `ARCH` `SCALE` · source
54. **stored-dedup-inert** — is this specific to my personal review app? 
55. **tokenize-truncates-at-500** — is this specific to my personal review app?
56. **dedup-never-crosses-sections-or-notes** — The dedup key is `noteId + sectionKey`, so the same fact filed under two section keys, or landing on both halves of a split identity, survives twice. `ARCH` · source
57. **semantic-dedup-missing** — is this because of the bug where embeddings don't work or is this inherent? fact check on source please
58. **no-compaction-story** — Additive sections under a hard cap have no decay, prune or compaction pass, and nothing in the product acknowledges that they will eventually fill. `ARCH` `UX` · source
59. **identity-section-mixes-five-claim-kinds** — A character note's identity section accumulates stable traits, trait changes, dispositions, backstory and events competing for one additive section and one budget, so the characters with the most development saturate first. `ARCH` `MODEL` `UX` · reported
60. **keyword-truncation-not-curation** — the 30 keyword cap is just there and it doesn't give you any affordance for fixing it. my personal review app approahced this by auto-pruning keywords
61. **identity-split-never-merges** — Fuzzy matching exists for initial subject binding, but nothing merges notes that have already split, and identity repair reported zero merge candidates for the very pair it was needed for. `ARCH` `USER` `UX` · observed
62. **note-ids-derive-from-strings-undocumented** — Note ids derive from claim subject strings, which is what makes name normalisation a prerequisite for a clean vault, and it is stated nowhere. `ARCH` `UX` · source
63. **no-claim-correction-path** — There is no stated mechanism for correcting a claim already in the vault short of re-ingesting from a corrected corpus. `ARCH` `UX` · source
64. **no-per-claim-provenance-grade** — Nothing distinguishes a near-verbatim extraction from a thrice-compressed paraphrase once it is in the vault. `ARCH` · source
65. **identity-note-bloat** — Roughly 10% of one real identity note was low-durability material — routines, schedules, one-off logistics — removable with no information loss. `SCALE` `MODEL` · measured

## Errors and observability

66. **errors-name-rule-not-object** — i think this was specifci to my review app
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
