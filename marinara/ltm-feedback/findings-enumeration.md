# Findings enumeration — working list

Flat list, no clusters. One line per finding so lines can be reordered, merged,
split or deleted freely. Order is loose pipeline order (first run → recall →
extraction → review → growth → errors → engine → corpus), which is **not** a
proposed cluster axis.

Every line is a problem statement only. No fixes, no alternatives.

Every claim here has a verdict row in [`verification-ledger.md`](verification-ledger.md).

Format: `id — sentence` · tags · severity · evidence grade.

**Tags:** `UX` `ARCH` `SCALE` `USER` `ENV` `MODEL` · `BUG` unintended behavior
rather than a design tradeoff · `ENGINE` Marinara Engine, not the package ·
`CORPUS` upstream of the package, what the vault is fed · `PROTO` the operator's
own workbench, not stock.

**Severity:** `critical` memory silently does not work, or data is lost ·
`high` blocks or corrupts a core workflow · `medium` real friction with a
workaround · `low` polish.

**Grades:** `source` read at a named symbol · `observed` reproduced with a
captured artifact · `measured` from a benchmark or analysis · `reported` from the
operator's account.

---

## Mental model and first run

1. **vocabulary-undefined** — The pipeline has seven nouns (source note, extraction, evidence unit, mutation, draft, note, section, chunk) with strict ordering and distinct meanings, and none is defined anywhere a user can reach, so every review decision is a decision about objects the reviewer cannot name. `UX` `ARCH` · high · observed
2. **default-source-tab-opens-empty** — The Sources screen opens on Chat Summaries, which on a new chat is necessarily empty, and its empty state neither explains that summaries are produced later by a different subsystem nor mentions that another tab already has something importable. `UX` · high · observed
3. **only-summaries-are-ingestible** — A live chat transcript can never be ingested: the only source kinds are character, lorebook and chat summary, source notes can only be created by the import routes, and for chats only `chat.metadata` summaries are read — so both the content and the timing of what memory can learn from a conversation are controlled by a separate engine service the package does not own. `ARCH` `UX` · high · source
4. **curation-and-recall-share-one-surface** — One four-tab workspace serves two loops with nothing in common but the vault: a bursty offline loop where the user reviews hundreds of proposals, and a per-turn automatic loop that reports on roughly twenty chunks, so the batch work crowds out any account of what recall just did. `UX` `ARCH` · medium · source
5. **source-notes-counted-as-memories** — Source notes are a note type in the same store, summed into the same totals that feed the navigation badge and listed first among the vault's type groups, and the only filters are status and free text, so the vault's count overstates retrievable memories with no way to reconcile the two numbers — while retrieval itself does exclude them. `UX` `ARCH` · high · source

## Does recall reach the model

6. **preset-voids-injection** — When the active preset assembles the whole prompt itself and carries no marker section for the package, the injection branch is skipped entirely: nothing is added to the prompt and no receipt is written, so one shared preset can disable memory across every chat using it. `ENGINE` `ARCH` `UX` · critical · source
7. **injection-readout-has-no-negative-state** — The last-injection readout is driven by the receipt and has neither a zero state nor a timestamp, so when nothing is injected it keeps displaying an earlier run's count indefinitely and reads as healthy. `UX` `ARCH` `BUG` · critical · observed
8. **imports-are-born-roleplay-only** — Character and lorebook sources are stamped for all three modes with an extraction mode of roleplay, and extracting one outside a chat resolves to roleplay only, so memories from an import are ineligible in a Conversation chat; manually created notes are hardcoded the same way. Chat-derived extraction inherits its chat's mode correctly. `ARCH` `UX` `BUG` · high · source
9. **mode-eligibility-invisible-at-accept** — The review queue shows a source's modes as read-only text and offers no control, so the setting that decides whether a memory can ever be recalled is only editable later, in a different workspace, inside the note editor. `UX` · high · source
10. **nothing-recalled-is-one-message** — An empty vault, no match, a score below threshold, a budget drop and ineligibility for the current chat mode all present identically as an absence, so the one question users ask about a memory system has a single undifferentiated answer. `UX` · high · source
11. **explain-data-mostly-never-leaves-the-process** — Recall computes fused score, normalized score, final normalized score, relevance, reasons, lanes, per-lane and raw per-lane scores, cooldown penalty, tier and estimated tokens per candidate; only relevance, lanes, reasons, estimated tokens and a rejection reason are ever emitted, and only into a debug log when debug recording is switched on, which it is not by default. `UX` `ARCH` · high · source
12. **recency-weighting-is-unreachable** — Recency weighting appears implemented — a cooldown penalty is declared and consumed inside the rank-fusion function — but the only caller passes no options, so the branch never executes and nothing anywhere derives a score from age. `ARCH` `BUG` · high · source
13. **no-chronology-between-event-memories** — Injected chunks are ordered by tier, then score, then chunk id, with timeline events in the lowest tier, so recalled events reach the model in relevance order with no sequence, grouping or relation between them, and no timestamp of any kind is rendered — which bites hardest in Conversation mode, where the engine does inject real dates and times the memories cannot be correlated with. `ARCH` `UX` · high · source
14. **injected-lines-cannot-be-attributed** — Chunking never copies a section's structured evidence onto the chunk and the chunk schema has no field for it, and while character and relationship lines are grouped under a note title, world, timeline, thread, tone and scene lines are emitted as bare bullets under a category header, so the model cannot tell which memory a claim came from or weigh it by its evidence. `ARCH` · medium · source
15. **embedding-lane-can-die-silently** — The capability embedding host is hard-wired to one local embedder with no remote or fallback provider, and when its native binding cannot load the rebuild still marks indexes clean and reports healthy while the embedded-chunk count sits at zero; no UI surface mentions embeddings at all, and the chunk count that is displayed stays high. `ENV` `ARCH` `UX` `BUG` · critical · observed
16. **index-rebuild-failure-invisible** — A draft can finish as accepted while its post-apply index rebuild failed, so the memory exists, the vault looks correct, and recall cannot see it. `ARCH` `UX` · critical · source

## Extraction

17. **empty-trusted-roster-still-enforces** — The trusted-subject roster is built from the persona ids of the chats resolved through the extraction scope, so a scope carrying no chats yields an empty roster while enforcement stays switched on, and every claim is rejected as an untrusted subject; nothing checks the roster before spending the model call. `ARCH` `UX` `BUG` · critical · source
18. **persona-scope-not-settable-in-ui** — The scope editor renders a persona id only as a removable pill, with add controls for chats, groups and character ids but none for a persona, so the field cannot be set through the interface at all; of the stock import targets only "current chat" carries one, and "All available" passes no scope whatsoever. `UX` `ARCH` · high · source
19. **rejected-candidates-are-easy-to-miss** — Dropped candidates are surfaced with a reason label, the target they would have hit, a recommended fix and a recover action, but inside a collapsed panel scoped to one selected source, so a run that discards a third of its output leaves no mark anywhere the user is looking. `UX` · high · source
20. **block-reasons-are-raw-enum-names** — All eleven extraction drop reasons carry distinct labels and distinct recommended fixes, but the eight draft block reason codes render as a humanized enum name plus a message with no explanation, and neither set is ever aggregated by cause, so identical failures are counted one at a time. `UX` · medium · source
21. **completion-summary-omits-what-was-dropped** — The outcome state is honest — a run that keeps some and drops some reports partial success with a warning badge — but the import panel's summary counts only requested, written, succeeded, failed, cancelled and missing, and the candidate totals, kept units and dropped units appear nowhere until a different screen. `UX` · high · source
22. **null-for-optional-fails-the-whole-unit** — Optional object fields on the evidence-unit schema are optional but not nullable, so a model emitting explicit null for one fails validation and the unit is dropped whole, even though the repair pass already coerces other malformed shapes and could normalize this one. `MODEL` `ARCH` `BUG` · high · source
23. **structured-output-needs-are-unstated** — The requirement is a generic OpenAI-compatible JSON-schema response format, deliberately not strict mode because the schema uses patterns, length bounds, uniqueness and conditional subschemas that strict mode rejects, with a documented fallback that retries without the response format and salvages embedded JSON — none of which is stated anywhere a user choosing a model could read, so incompatibility is discovered by paying for a full run. `MODEL` `ARCH` `UX` · high · source
24. **truncated-output-discards-everything** — When the model hits its output limit the entire extraction throws and is discarded rather than salvaging the valid prefix, so one oversized source loses the whole run's work for that note. `MODEL` `ARCH` · high · source
25. **no-size-guard-before-the-model-call** — An input-side preflight refuses to run when the prompt would exceed a known context window, but it silently passes when the provider reports no window, and there is no byte-size limit at import time and no chunking of large sources — source text is never truncated by design. `ARCH` · medium · source
26. **extraction-progress-is-unobservable** — A batch route exists that takes up to a hundred sources at configurable concurrency, but it is one long synchronous request returning only a terminal report, with no progress stream, no polling route and no server-side job record, so a run lasting tens of minutes is indistinguishable from a hang. `SCALE` `ARCH` `UX` · high · source
27. **package-cannot-set-its-own-timeout** — The capability surface exposes no timeout field, so extraction inherits the engine's chat-generation timeout, which is a deliberate five-minute default on the wait for the model's first byte; a per-request override helper exists in the engine and is never called from anywhere. `ARCH` `BUG` · medium · source
28. **re-extraction-is-one-at-a-time** — Re-extracting is a stock control and never skips work, but it runs a single source per request and disables itself while one is in flight, and a concurrent scope or mode change can abort it with a conflict *after* the model call has already been paid for. `ARCH` `UX` · medium · source
29. **draft-freshness-flips-with-no-notification** — Freshness is recomputed on every read and never stored, so changing a source note's text, title, provenance, modes or scope silently turns its drafts stale: the next time the queue is opened a pill has changed colour, a red panel reads that the source or extraction context changed, the drafts are excluded from bulk apply and applying anyway returns a conflict — with no event, log entry or prompt to go look. `ARCH` `UX` · high · source
30. **bulk-gaps-are-specific** — Import, note mutation, delete and transfer are all genuinely batch operations, but the two that a large corpus actually needs are not: re-extraction is per source and review accept and skip are per draft. `SCALE` `UX` · medium · source

## Review

31. **one-hard-coded-grouping-axis** — The queue's hierarchy is fixed at source, then draft, then target, then mutation, and although targets are already on the wire they render as unlabeled wrappers with no header, so the grouping is imperceptible and there is no way to organise the work by subject, risk, disposition or anything else a reviewer wants to slice by. `SCALE` `UX` `ARCH` · high · source
32. **selection-is-wiped-on-navigation** — Bulk accept and skip exist behind checkboxes, a select-all and a batch bar, and the request layer already groups by draft, but the selection set is cleared whenever the chat, source or selected draft changes, so a batch can never span more than a single draft. `UX` `BUG` · high · source
33. **in-progress-review-state-is-lost** — Decisions apply immediately so no applied work is ever lost, but selections and pending edits live only in component state and vanish on reload or navigation, so an interrupted pass over a large queue restarts from nothing. `SCALE` `UX` · medium · source
34. **no-review-progress-or-keyboard-path** — The queue reports depth — sources, pending mutations, ready, blocked — but never how much of it has been dealt with, and there are no accept, reject or next shortcuts, so a long pass is mouse-driven with no sense of an end. `SCALE` `UX` · medium · source
35. **conflicts-are-absent-from-review** — The review queue never reads a proposed note's conflicts at all, so a mutation that contradicts something already stored is presented exactly like one that does not; the vault later shows the field, resolution and proposed value while never displaying the existing value, so no diff exists anywhere in the product. `ARCH` `UX` `BUG` · critical · source
36. **destructive-and-additive-accepts-look-alike** — Whether accepting a mutation adds to a section or overwrites an existing belief is already computed and carried on every row as its disposition, and the interface does not distinguish them, so a reviewer working quickly cannot see which accepts can destroy something. `ARCH` `UX` · high · source
37. **whole-draft-invariants-are-invisible-until-apply** — Rules spanning claims within a draft — every mutation citing its source, link targets existing, change claims grounded in a timeline event from the same source, no duplicate creates, no writes to source or scene notes, matching scope — are checked only at apply time and surface as an atomic whole-draft failure afterward. `ARCH` `UX` · high · source
38. **rejecting-is-unrecoverable-while-undecided-is-safe** — Dependency auto-inclusion draws only from mutations still in the draft, and rejected mutations are removed before it runs, so leaving a dependency undecided is recoverable and explicitly rejecting one is not — the exact inverse of a reviewer's instinct to tidy up by rejecting things that look redundant. `ARCH` `UX` · critical · source
39. **applying-cannot-be-undone** — The transaction journal holding the before-state of every touched file is written, committed, then deleted, existing only for crash recovery, so there is no revert route and no per-note history: accepting hundreds of mutations is irreversible. `ARCH` · critical · source
40. **fourteen-of-twenty-five-apply-failures-are-knowable-early** — Most of what can fail at apply time is derivable from the selection before anything is sent, and none of it is checked, so preventable failures arrive after the work is submitted. `ARCH` `UX` · high · source
41. **partial-apply-rewrites-the-draft** — A partial apply keeps the draft pending and replaces its mutation list with only the skipped items, so the applied work vanishes from that view with nothing recording that it happened, and a draft that has had most of it accepted looks like a fresh small one. `ARCH` `UX` · medium · source
42. **weak-subject-matches-are-not-flagged** — Subject resolution records how a name was matched — exact, alias, spelling variation, qualified alias — and that basis never reaches the mutation, so claims bound to a character by a weak match are indistinguishable from certain ones at review time. `ARCH` `UX` · high · source
43. **auto-apply-is-unannounced** — Low-risk mutations from chat-summary sources can apply with no review while character and lorebook sources never can, and nothing states which sources bypass review or shows what was written on the user's behalf. `ARCH` `UX` · medium · source
44. **the-editor-is-unlabeled-and-partial** — Edit-before-accept works and is re-validated server-side, but it carries no label, button or icon, sits below the evidence and diagnostics inside an expanded row, and returns nothing at all for link, keyword, status and subject mutations — uneditable for four of the seven kinds. `UX` · medium · source
45. **section-text-is-silently-truncated** — The editor caps section text at twenty thousand characters by trimming without a counter, a warning or any indication that content was dropped. `UX` `BUG` · critical · source
46. **link-targets-are-invisible** — Ids are generally resolved to titles and rows offer ways to open the target memory or source, but a link mutation never surfaces what it points at and has no editor either, so a reviewer facing several near-identical link proposals cannot tell the referenced events apart; the projection preview also prints its before and after values raw. `UX` · medium · source
47. **no-usage-signal-on-what-is-being-replaced** — Nothing records or shows how often a memory has actually been recalled, so a reviewer overwriting stored text has no way to know how much the model has been leaning on it. `UX` · medium · source

## What happens over months

48. **caps-are-cliffs** — Seven hard limits — thirty keywords, a hundred tags, two hundred fifty links, two hundred fifty conflicts, twenty thousand section characters, a hundred contributions, a hundred evidence refs — are enforced at write time with no counter, no warning threshold and no pressure indicator anywhere, so the first sign of a full note is a failed apply partway through a batch. `ARCH` `UX` `SCALE` · critical · source
49. **saturation-is-the-steady-state** — Additive sections and keyword lists are unioned without pruning and nothing decays, compacts or expires, so filling every cap is not a risk but the guaranteed end state of any long-running story, and the product never says so. `ARCH` `SCALE` · critical · source
50. **stored-dedup-cannot-fire** — Incoming claims are compared against existing content by taking each section as a single blob and requiring a Jaccard score of 0.85, so a one-sentence claim against an accumulated section scores nowhere near the threshold and the guard against restatement goes quiet exactly when a note is large enough to need it; in-batch comparison, being unit against unit, works fine. `ARCH` `SCALE` · critical · measured
51. **tokenizer-hides-most-of-a-long-section** — Similarity tokenization keeps only the first five hundred tokens and discards every word shorter than four characters, so late content in a long section is invisible to comparison regardless of anything else. `ARCH` · high · source
52. **dedup-never-crosses-sections-or-notes** — The comparison key is a note id paired with a section key, so the same fact filed under two sections of one note, or landing on both halves of a split identity, survives twice. `ARCH` · high · source
53. **semantic-duplication-is-unchecked-by-design** — The write path never calls an embedding function at all — embeddings exist only for indexing and retrieval — so a reworded restatement of something already stored is always accepted and competes for retrieval budget forever; roughly thirty-five such pairs were found in one corpus. `ARCH` `SCALE` · critical · measured
54. **identity-sections-mix-five-claim-kinds** — A character's identity section accumulates stable traits, changes to those traits, dispositions and beliefs, backstory and plain events, all competing for one additive section and one budget, so the characters with the most development saturate first. `ARCH` `MODEL` `UX` · high · reported
55. **keyword-cap-has-no-cap-aware-affordance** — Keywords can be hand-edited and the merge tool reports the cap as a blocker, but nothing ranks, curates or trims when the union exceeds thirty, so hitting it is a hard projection failure and the only recourse destroys curated lists to apply unrelated claims. `ARCH` `UX` · high · observed
56. **split-identities-never-merge** — Fuzzy matching exists for binding a name to a subject, but nothing merges notes that have already split, and the repair preview reported zero merge candidates for the very pair it was needed for, so one person's history stays in two notes that dedup also never compares. `ARCH` `USER` `UX` · high · observed
57. **ids-derive-from-subject-strings-unstated** — Note ids are generated from claim subject strings, which makes normalising names beforehand a precondition for a clean vault, and this is stated nowhere. `ARCH` `UX` · high · source
58. **no-path-to-correct-a-stored-claim** — Once a wrong claim is in the vault there is no correction mechanism short of re-ingesting from a fixed corpus. `ARCH` `UX` · high · source
59. **compression-depth-is-not-recorded** — Nothing distinguishes a near-verbatim extraction from a claim that has been through several rounds of summarisation, and since each pass is an opportunity for meaning to drift, the vault ends up holding claims of very different reliability with no way to tell them apart. `ARCH` `CORPUS` · high · source
60. **derived-notes-accumulate-low-durability-content** — About a tenth of one real identity note was routines, schedules and one-off logistics sitting alongside load-bearing history, removable with no information loss. `SCALE` `MODEL` · medium · measured

## Errors and observability

61. **projection-errors-cannot-name-the-object** — The section-limit errors fire without a note id, section key or current size, and the function that throws them is never given the note id or section key at all, so the omission is structural rather than a matter of message wording; other errors in the same codebase do name their object, so the behaviour is inconsistent. `UX` `ARCH` · high · source
62. **storage-contract-error-dumps-schema** — The storage-contract failure does name the note, then delivers the actionable part as a raw schema-validation dump. `UX` · medium · observed
63. **auth-failure-reads-as-a-generic-error** — Every route in the package is privileged with no per-route distinction, so with no admin secret configured and no loopback exemption each request returns a forbidden response naming the remedy; the client reads only the error body and never the status code, and the settings screens discard even that, rendering a fixed "Could not load memory settings." The engine already ships copy that turns this into an actionable message and the package does not use it. `UX` `ARCH` `BUG` · high · source
64. **status-diagnostics-are-fetched-and-dropped** — The status response carries index errors, index warnings, a dirty flag, generation time, source hash, note counts by type and status, event counts and both embedding fields; the interface uses the total note count and the chunk count and discards the rest. `UX` `BUG` · high · source
65. **the-answers-are-scattered-and-one-is-off-by-default** — Four of the five diagnostic endpoints are consumed, but in four different places: rejected candidates in the review queue, integrity in a maintenance tab, last injection in two spots, and the activity feed inside a settings sub-tab that is not a navigation destination and sits behind a recording toggle that defaults off — so there is no surface that answers "why is my memory not working" and the richest one is disabled until someone finds it. `UX` · high · source
66. **vault-health-is-split-and-thin** — A health pill and warning appear when index health degrades, showing a derived label, the chunk count and a pointer to maintenance, while note counts by type, embedded chunk counts, index errors and warnings are fetched and never rendered, and integrity problems live in a different component again. `UX` · medium · source

## Marinara Engine

67. **character-memories-are-an-untyped-card-global-store** — Concluding a scene writes entries onto every participating character's card, and the memory command writes to any character matched by name across the whole roster; the field is an unvalidated key on card extensions, re-declared locally in three modules, with no interface to view, edit or clear it and no version history because the writes suppress snapshots. `ENGINE` `ARCH` `BUG` · high · source
68. **card-memories-cross-chat-scope-is-undocumented** — Those entries are read back for any conversation containing that character, filtered to the current local day for prompt injection and to the current schedule week for schedule regeneration, so scene-local state reaches unrelated chats for a bounded window that is documented nowhere. `ENGINE` `UX` · medium · source
69. **rangeless-summary-entries-order-by-creation-time** — Summary entries sort primarily on narrative position, but every automated entry and most manual ones carry no range and collapse to a sentinel, falling back to creation time — while a message count and message ids sit unused on the same entry. `ENGINE` `BUG` · medium · source
70. **unsummarised-day-details-emit-in-key-order** — Day details that have not been summarised are emitted in raw object-key order rather than any chronological one. `ENGINE` `BUG` · low · source
71. **backfilling-a-consolidated-week-does-nothing** — Writing a day summary for a day inside an already-consolidated week is skipped silently, so backfills into those ranges have no observable effect. `ENGINE` `USER` · high · source
72. **two-summary-subsystems-are-unaware-of-each-other** — Roleplay and Conversation summaries use different storage, formats, compression behaviour and date handling, and nothing reconciles them for one story told in both modes. `ENGINE` `ARCH` · high · source
73. **roleplay-summaries-never-compress** — Conversation summaries consolidate into weeks while roleplay summaries grow until a hard delete at two hundred entries. `ENGINE` `ARCH` · high · source

## What the vault is fed

74. **a-number-kept-its-value-and-lost-its-subject** — A summarised estimate preserved its figure exactly while what it was an estimate *of* was replaced by whatever theme dominated the surrounding entries, producing a claim that is internally consistent, plausible on its face, and wrong — the one error class nothing downstream can detect. `CORPUS` `MODEL` · critical · reported
75. **firsts-were-asserted-where-the-source-did-not** — Events were recorded as happening for the first time on dates where they did not occur, including the same event marked a first on two different days, because the summariser inferred the superlative from context rather than finding it in the text. `CORPUS` `MODEL` · high · reported
76. **numbers-and-superlatives-are-where-drift-changes-meaning** — Compression usually loses detail harmlessly, but on bare quantities and on first, only and never it resolves ambiguity toward the dominant nearby theme instead, which changes what the claim says rather than how much it says. `CORPUS` `MODEL` · high · reported
77. **chunk-boundary-artifacts-become-durable-claims** — Text that exists only because of where the chunker cut becomes permanent memory: one scene-continuation phrase appeared thirty-seven times and was often doubled into a key-detail bullet, and status filler was emitted as standalone bullets, some with a real fact welded on so they could not simply be pattern-deleted. `CORPUS` · high · measured
78. **planning-notes-are-recorded-as-events** — Out-of-character planning was summarised indistinguishably from things that happened, and one planning entry's contents were later narrated as well, so the same material entered memory twice, once as intention and once as event. `CORPUS` · high · reported
79. **bullets-bundle-several-facts** — The ingest contract is roughly one bullet per claim, and bullets that pack an event together with its cause and its resulting state become a single muddled claim or are dropped. `CORPUS` · medium · reported
80. **long-entries-degrade-toward-the-end** — Seventeen of ninety-seven entries exceeded the size threshold, and long entries visibly deteriorate as they run on, with dates and names getting looser further in. `CORPUS` `MODEL` · medium · measured
81. **contradictions-between-entries-have-no-automatic-resolution** — When two source entries disagree the outcome is either a conflict needing manual resolution or both versions being retrieved and handed to the model together. `CORPUS` `ARCH` · high · reported

## Prototype workbench

Observed in the operator's own review tool, not stock. Kept because the tool is
the design evidence for the review findings; delete if it muddies the audience.

82. **proto-facets-dont-teach** — Facets reflecting the data model read identically to facets that are pure convenience, so the distinction the author intended is not legible. `PROTO` `UX` · low · reported
83. **proto-nits** — Hotkeys swallow copy; collapse-all does not collapse everything; the stored-content section cannot be collapsed; the facet panel does not dismiss on click-away or escape; cross-references are not clickable; the clear button sits at the end of the facet row, unreachable on mobile without scrolling it. `PROTO` `UX` · low · reported

---

## Removed

Dropped after verification. Details in the ledger; listed here only so they are
not reintroduced.

- **which-memory-system** — lorebooks versus memory guidance. Too hairy, per review.
- **export-breaks-on-content-uri** — the package ships no HTML export; the artifact and the `content://` problem both belong to the operator's `migrate.cjs`.
- **workspace-behind-long-descent** — navigation is a persistent four-tab rail roughly three steps from a chat, not an eight-step descent.
- **fingerprint-trap** — freshness never reads the source note's stored fingerprint, so a partly-failed extraction yields a fresh draft with no block reasons, and the real condition is already labelled "Extraction incomplete".
- **no-reextract-path** — a re-extract control exists and extraction never skips; what survives is now finding 28.
- **undici-timeout** — the five-minute limit is a deliberate, configurable engine setting on the server's own outbound call; what survives is now finding 27.
- **summary-order-derives-from-seq** — there is no sequence field and narrative position is already the primary sort key; the inverse problem is now finding 69.
- **provenance-stripped-at-injection** — the label stripper only cleans legacy patterns nothing writes; the real loss is now finding 14.
- **ranking-internals-unsurfaced** — merged into finding 11.
- **rejections-inert-without-a-verb** — a recover action does exist; merged into finding 19.
- **real-unit-is-a-cohort** — merged into finding 31.
- **no-vault-state-view** and **instrumentation-no-consumer** — both overstated; replaced by findings 64, 65 and 66.
- **chunk-filler-becomes-claims** — merged with the boilerplate finding into 77.
- **layered-summarisation-compounds-drift** — merged with per-claim provenance into 59.

## Notes for the next pass

- **Your suggested reword of the old #4** — "memories should be enabled for the chat type they were sourced from" — describes finding 8, not finding 3. Verification showed these are genuinely separate: 3 is about what can enter the pipeline, 8 about whether the output is eligible where it was made. The invariant phrasing now sits on 8.
- **Severity is a first draft and the distribution is bad.** 14 critical, 45 high, 21 medium, 3 low — with more than half the list at high or above, the axis currently carries almost no signal. It needs a stricter bar at both levels, and probably a rule that severity means severity *to a user who hits it*, not importance to the argument.
- **Nineteen findings are new since the last enumeration**, surfaced by verification rather than by the migration — among them silent section truncation, selection being wiped, conflicts being absent from review, the empty trusted roster, and the whole-response discard on truncated output.
- **`BUG` is on fifteen findings.** Several are arguable design tradeoffs rather than defects: 27, 69 and 70 are the weakest of them.
