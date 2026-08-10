# Long-Term Memory: findings

Full catalogue behind [`00-brief.md`](00-brief.md). Written by Claude.

Every finding carries tags, evidence, and a counterfactual. Problem statements
only — proposed directions live in [`02-design.md`](02-design.md), deliberately
separated so a reader can disagree with a solution without discarding the
observation.

---

## 0. Front matter

### Environment

| | |
|---|---|
| Marinara Engine | 2.4.1 |
| Long-Term Memory package | 1.1.6, capability API 1.6 |
| Hosts | Termux on Android (migration); Linux container (first-run walkthrough) |
| Extraction model | GLM 5.2 primary; Gemini Flash and DS v4 evaluated |
| Embeddings | local ONNX (`Xenova/all-MiniLM-L6-v2`) — unavailable on the Termux host, see F5 |
| Migration corpus | 10 chats, 97 summary entries, ~1,150 claims, 161 notes, ~3.5 weeks of story |

### How claims are cited

By **symbol**, not line number — line numbers drift between releases. Where an
error message exists it is quoted verbatim, because those are greppable and
stable. Anything not verifiable from source is marked as reported rather than
confirmed.

### Aliases

The corpus was a private roleplay. Names are replaced consistently:

| Role | Alias | Note ids in examples |
|---|---|---|
| Main NPC / love interest | Dottore | `char_dottore` |
| Operator's persona | Lumine | `char_lumine` |
| Supporting character that fragmented into two notes | Kamisato Ayaka | `char_ayaka`, `char_kamisato_ayaka` |
| Relationship | — | `rel_dottore_lumine`, `rel_lumine_dottore` |
| Chats | — | `Chat A`–`Chat J`, with mode |

Raw chat identifiers are dropped, not aliased. Counts, identifier shapes and
mechanics are unchanged.

### Tags

| Tag | Meaning |
|---|---|
| `UX` | The package's interface and interaction design |
| `ARCH` | The package's API and code architecture |
| `SCALE` | Corpus size is a contributing factor |
| `USER` | The operator's own decisions or mistakes |
| `ENV` | The Android/Termux runtime |
| `MODEL` | Extraction or embedding provider behaviour |
| `ENGINE` | Marinara Engine rather than the package — detailed separately |

The counterfactual line — **"would not have hurt if…"** — is the discipline that
keeps the tags honest. If a finding survives *small corpus, ordinary desktop,
everything configured correctly*, it is a design problem and not circumstance.

### Mistakes that were the operator's

Stated up front, because the rest is more credible for it. During the migration
the operator:

- never set `personaId` on the extraction scope, which alone caused 132 of 200
  auto-rejections — a third of the corpus, and specifically his own side of the
  story
- did not normalise names before extraction, so `Ayaka` / `Kamisato` /
  `Kamisato Ayaka` produced separate notes
- merged two summarisation passes without reconciling them, carrying two
  accounts of the same day for ten dates
- ran backfills into consolidated week ranges, which is a silent no-op
- used a prompt-assembling preset on four chats, which is what discarded recall
- chose GLM 5.2 on price/performance, which has a structured-output quirk that
  cost 28 claims

Five of those are real errors. The argument here is not that they weren't. It is
that a system whose entire value proposition is *remembering things correctly
over months* should not let any of them run silently for weeks.

---

## 1. Silent failure

The strongest theme by a wide margin. Five independent subsystems fail quietly;
four of them required reading source to detect.

### F1. Recall selects, scores, and injects nothing

`ARCH` `UX` `ENGINE` `USER`

**Observation.** Recall ran, scored, and selected 7 chunks at 99% relevance. All
7 were discarded before reaching the model.

**Mechanism.** When the active preset assembles the prompt,
`generate.routes.ts` sets `presetOwnsAgentPlacement`. The injection guard reads:

```js
if (handledByPresetSection || !presetOwnsAgentPlacement) {
  if (!handledByPresetSection) appendSeparateAgentInjection("long-term-memory", recall.text);
  contextInjections.push({ agentType: "long-term-memory", text: recall.text });
  longTermMemoryRecallReceipt = recall.receipt;
}
```

If the preset owns placement and carries no `agent_data` marker section for
`long-term-memory`, the whole block is skipped: no injection, no context
injection, **and no receipt**.

**The receipt is load-bearing.** `recordGenerationLongTermMemoryDispatch()` only
records an injection when it has a receipt *and* confirms the artifact is
genuinely present in the dispatched messages. That verification is a good
design. But with no receipt, nothing is recorded at all — so the last-injection
readout keeps displaying the previous successful run's number, indefinitely. The
user sees a healthy count while nothing is reaching the model.

One preset shared by four chats disabled memory in all four simultaneously.

**A correction worth recording.** An earlier pass of this feedback concluded the
marker section was *not* required, having deleted it and watched injection
continue to work. That test used the shipped default preset, which does not take
this branch. Both observations are correct. The accurate statement is that **the
marker is conditionally required depending on preset type, and nothing indicates
which kind of preset is in use.** That ambiguity is itself the finding — if two
careful passes reached opposite conclusions, a user has no chance.

**Impact.** Memory completely non-functional in four chats for an unknown
period. Discovered only by explicitly checking after a migration.

**Would not have hurt if:** a non-assembling preset had been used. But every
layer reports success, the discard happens after the agent has finished, and no
surface anywhere reports it. The `USER` share is real and small.

---

### F2. Memories are born ineligible for the chat that created them

`ARCH` `UX`

**Observation.** Memories extracted inside a Conversation chat are saved with
`Available modes` set to Roleplay only, making them ineligible in the very chat
that produced them. Retrieval's eligibility filter drops them before ranking.

**Evidence.** Observed on a clean first-run install, not a migrated vault. The
full happy path — enable, import a source, extract, review, accept — completed,
and the subsequent turn recalled nothing. Ticking `Conversation` on the memory
and re-sending changed the readout from `No memories injected yet — 0 tokens` to
`1 memory injected — 112 tokens`, and the `<long_term_memory>` block appeared in
the captured outbound request.

**Impact.** A brand-new user can complete every documented step correctly and
end with a feature that does nothing. The control that fixes it is three
checkboxes inside the memory editor, behind two collapsed accordions on a
different screen, and it is never surfaced at the moment of acceptance.

**Would not have hurt if:** *nothing.* This is the first-run path.

---

### F3. "Nothing recalled" has one message and at least five causes

`UX`

**Observation.** Empty vault, no semantic match, below score threshold, dropped
for budget, ineligible for this chat mode — all render identically as an absence.

**Evidence.** `budget.ts` computes, per discarded candidate, a typed
`rejectionReason` from `budget`, `lower_rank`, `score_threshold`,
`duplicate_text`, `missing_chunk`, alongside lane scores, raw lane scores,
cooldown penalty, tier and estimated tokens. `generation-injection.ts` requests
this only when `recall.debugEnabled`, and routes it to the debug log rather than
any user-facing surface.

The readout also has no negative state and no timestamp — see F1 for why it can
sit frozen on a stale value.

**Impact.** The single question users ask about a memory system — *why didn't it
remember?* — is the one question the product cannot answer, using data it already
computes on every turn.

**Would not have hurt if:** *nothing.*

---

### F4. Rejected candidates are invisible, and inert even when surfaced

`UX`

**Observation.** 200 candidates were auto-rejected during one extraction,
retrievable only through `GET /api/long-term-memory/rejected-suggestions`.

| Count | Reason | Root cause |
|---|---|---|
| 132 | `untrusted_subject` | `personaId` never set on the scope |
| 29 | `invalid_format` — `evidence: Required` | model output |
| 28 | `invalid_format` — `dimensions`/`dimensionChanges: null` | GLM emits explicit `null` for optional object fields |
| 16 | `unsupported_bucket` | change claims with no stated causal event |
| 7 | `missing_source_evidence` | model output |

The recovery hints were dominated by `char_lumine` (44) and `rel_dottore_lumine`
(11) — the missing third of the story was specifically the operator's own
persona.

**The data model here is good.** Each rejection carries a reason code, a human
message, the source snippet, and a `recovery` object naming the note type, note
id, section key and status the claim would have targeted. Someone anticipated
the question.

**But surfacing alone is not sufficient.** The operator's own review tool *did*
display the rejection pile, and he still never used it — *"I wasn't sure what to
do with it."* A rejection needs an attached verb. A list of things that didn't
happen, with no action, is inert regardless of visibility.

**Impact.** A third of the corpus missing while the vault looked healthy.

**Would not have hurt if:** *nothing.* Even one rejection is worth surfacing.

---

### F5. Embeddings unavailable; rebuild reports success

`ENV` `ARCH` `UX` `MODEL`

**Observation.** The capability embedding host returns `localEmbed(...)`
unconditionally, with a fixed space id
`local:Xenova/all-MiniLM-L6-v2:q8:mean:normalized:v1`. onnxruntime's Linux
binaries link glibc and libstdc++; Termux is bionic, so the load fails with
`dlopen failed: library "libstdc++.so.6" not found`.

The vault rebuild reports success regardless. `embeddedChunkCount` is `0` and
nothing draws attention to it.

**Impact.** One of the retrieval lanes silently dead, indefinitely. Retrieval
still returns results from the remaining lanes, so the degradation is invisible
without instrumentation. A dedicated probe script had to be written to establish
the cause, across three rounds of investigation.

**Would not have hurt if:** running on glibc. But the single hard-wired embedding
host with no remote fallback is a design decision, and reporting success for a
rebuild that embedded nothing is a UX one. `embeddedChunkCount: 0` after a
rebuild that was asked to embed is an error condition, not a value.

---

## 2. Mental model

### F6. Seven pipeline nouns, none defined in-product

`UX` `ARCH`

**Observation.** The pipeline is:

> source note → extraction → evidence unit → mutation → draft → note → section → chunk

Strict ordering, distinct meanings, and none of it defined anywhere a user can
reach. The review UI displays *drafts* containing *mutations* without explaining
either.

**Evidence.** An operator who had written a 38 KB integration script against
this system stated directly that he did not know what a draft or a mutation was,
and that this was not an exhaustive list of his confusions. A glossary had to be
written externally before the migration could be planned.

**Impact.** Every decision in review is a decision about objects the reviewer
cannot name. The natural coping strategy — accept everything — defeats the
purpose of having a review step.

**Would not have hurt if:** *nothing.* Any corpus size, any platform, any
configuration.

---

## 3. Review at scale

### F7. Review is per-draft; the story is per-subject

`SCALE` `UX`

**Observation.** At 97 drafts and ~1,150 claims the stock review surface offers
no bulk action, no filter, no grouping, no search, no persistence of decisions
across sessions, no keyboard navigation, and no progress tracking.

Reviewing one character meant visiting ~40 separate drafts to see 40 claims about
that person, with no way to view them together or against what the note already
held.

**Worth noting:** the API already supports the pivot. The draft review response
returns, per source, a `targets[]` array — the notes that would change, each with
its rows and computed diffs. The data to group by subject is already on the wire;
only the client's outer loop iterates sources.

**Impact.** Reviewing across two sittings means starting over. The rational
strategy becomes accepting everything.

**Would not have hurt if:** a handful of drafts. Adequate at 5, unusable at 97 —
but at a scale the feature explicitly invites, since its value proposition is a
long story.

---

### F8. The review unit and the failure unit disagree

`ARCH` `UX`

**Observation.** You review *claims*. The engine applies *drafts*, atomically,
enforcing invariants that span claims within a draft — checked in `preflight()`:

- every mutation must cite its source note
- every link target must exist or be created in the same batch
- every `change` claim's target must end up linked to a timeline event grounded
  in the same source
- no duplicate `create_note` for one id
- no writes to source or scene notes
- scope must match

None are visible while reviewing. They surface as whole-draft failures
afterward, with errors like:

```
Long-term memory {id} must link to a timeline event grounded in the same source.
Timeline event {id} must link to draft source {sourceNoteId}.
```

**The mitigating design is genuinely good.** `filterAutoApplyDependencies()` and
the auto-inclusion pass in `applyInner()` pull in dependencies a partial
selection needs — the `create_note` for a note a kept claim targets, and the
timeline events its change claims link to. Partial review is therefore safe by
default.

**But the asymmetry is undocumented and dangerous.** Auto-inclusion draws from
`draft.mutations` — everything still in the draft. Rejected mutations are
deleted from the draft *before* that runs, so they are not in the pool the
recovery mechanism searches. **Undecided is recoverable; rejected is not.**

**A worked example, from the migration.** The operator hit four near-duplicate
`add_link` mutations, all pointing at timeline events with opaque, unclickable
ids, and could not determine the right action: drop the links, drop the
duplicate timeline events, or both.

The correct answer is *keep them*, and it is not derivable from the interface:

- a duplicate `add_link` is already idempotent — `changesForMutation` returns
  `[]` when the link exists, and application runs through `uniqueLinks()` keyed
  on target + relation + aspect. Keeping a redundant link costs nothing.
- rejecting one can fail the entire draft, if it carried the only grounding link
  for a change claim on that note.
- the near-duplicates were never the links. They were four distinct timeline
  notes for one narrative beat — an identity problem one layer up, structurally
  the same as F13.

**Impact.** The reviewer's natural instinct — tidy up by rejecting things that
look redundant — is precisely the unsafe move, and the interface gives no signal.

**Would not have hurt if:** *nothing.* It bites the first time anyone partially
accepts a draft.

---

### F9. The default source tab is empty by construction

`UX`

**Observation.** On first run, `Sources` opens on `Chat Summaries`. A new
Conversation chat has no summaries yet, so the list is empty and says so without
explaining why or when that changes:

```
0 scanned, 0 pending, 0 imported
No new or retryable sources are ready to import.
```

The adjacent `Characters` tab had an importable source available the whole time.
Nothing points there.

**A deeper expectation gap:** people arrive wanting to remember *the
conversation*. The conversation is not a source. Only its summaries are, and
those are produced by a different subsystem on its own schedule.

**Impact.** A new user reading the empty state literally concludes the feature
has nothing to work with, on the first screen that matters.

**Would not have hurt if:** *nothing.* This is the first-run path.

---

## 4. Caps, decay, and vault health

### F10. Caps are cliffs, not gradients

`ARCH` `UX` `SCALE`

**Observation.** Multiple hard limits, all enforced at write time, none with a
pressure indicator, warning threshold, or pruning affordance:

| Limit | Value | Enforced in |
|---|---|---|
| Keywords per note | 30 | note create/update body |
| Tags per note | 100 | schema |
| Links per note | 250 | schema |
| Conflicts per note | 250 | schema |
| Section text | 20,000 chars | `mergeSection()` |
| Section contributions | 100 | `mergeSection()` |
| Section evidence refs | 100 | schema |

**Evidence.** In one run, 24 drafts were lost to the keyword cap, then 35 more to
the section cap — mid-run, after 218 claims had already been written. The
failure arrives at the least recoverable moment: partway through a bulk
operation, with no way to know beforehand how close you were.

**Aggravating detail.** The projector *unions without pruning*. Saturation is not
a risk; it is the guaranteed steady state of any long-running story. Nothing in
the product acknowledges this or offers decay, pruning, or compaction.

**Would not have hurt if:** the corpus were ~15 entries. Genuinely all three
tags: the caps are architectural, the absent indicator is UX, and only scale
makes them reachable.

---

### F11. Deduplication against stored sections is structurally inert

`ARCH` `SCALE`

**Observation.** `deduplicateUnits()` compares each incoming claim against both
other incoming claims (`seenInBatch`) and existing note content
(`existingSectionCandidates()`), using normalized-exact match **or**
`jaccardSimilarity >= 0.85`. The design intent is right and better than earlier
drafts of this feedback credited.

**But the stored comparison cannot fire in practice.** It Jaccards one claim
against the **entire section as a single blob**. Measured with a line-for-line
port, using an exact-duplicate claim of ~11 tokens:

| stored section | section tokens | Jaccard | ≥ 0.85? |
|---|---|---|---|
| 226 chars | 23 | 0.478 | no |
| 568 chars | 59 | 0.186 | no |
| 2 KB | 183 | 0.060 | no |
| 5 KB | 272 | 0.040 | no |
| 20 KB | 272 | 0.040 | no |

Jaccard is `shared / (claim + section − shared)`, so the score collapses as the
section grows. It only fires when the stored section contains essentially
nothing but that one claim. Compounding it, `tokenize()` slices to the first 500
tokens, so content late in a long section is invisible regardless.

**Two further blind spots**, both from the dedup key being `noteId + sectionKey`:
comparisons never cross section keys on the same note, and never cross notes. So
the same fact filed under two different sections survives twice, and a fact
landing on both halves of a fragmented identity (F13) survives twice.

**Impact.** The guard against restatement goes silent exactly when a note is
large enough to need it. Additive sections then accumulate reworded duplicates
until they hit the 20,000-character cap (F10). A dedupe pass at 0.7 shingle
similarity reduced one real saturated section from 35,805 to 4,327 characters —
**88% of it was restatement.**

The operator's own tooling matched this precisely: incoming↔incoming detection
flagged 75+ near-duplicates worth dropping, while incoming↔stored *"surfaced a
couple."*

**On cost.** A full pass over 1,142 claims against 161 notes × 5 sections
(3.2 MB of stored text) measured **133 ms** — 123 ms to index, 10 ms to compare.
No embeddings, no model calls, no network. Whatever the fix, affordability is not
the constraint.

**Would not have hurt if:** every section stayed short. Which is the same as
saying it hurts every long-running story.

---

### F12. The identity section carries five different kinds of claim

`ARCH` `MODEL` `UX`

**Observation.** With default prompting, a character note's identity section
accumulates a mixture of:

1. pre-existing, stable personality traits
2. personality *changes* over time
3. dispositions and beliefs (*wants X*, *thinks Y*)
4. backstory
5. events (*character did thing*)

Only the first is genuinely durable. Changes supersede, beliefs shift, events
belong to the timeline. All five compete for the same additive section and the
same 20,000-character budget.

**Impact.** Identity sections on characters with real development saturate
fastest, which inverts the intent: the more a character grows, the sooner the
system stops being able to record that growth. As of writing, the operator still
has dozens of pending mutations queued against a single character note that
cannot accept them.

**Would not have hurt if:** characters were static. Which is not what the format
is for.

---

### F13. Identity is string-derived, and split notes never merge

`ARCH` `USER` `UX`

**Observation.** Note ids derive from claim subjects. Inconsistent name forms —
`Ayaka`, `Kamisato`, `Kamisato Ayaka` — produced `char_ayaka` and
`char_kamisato_ayaka`: two notes for one person, each holding half the history.
The same happened to a relationship, yielding both `rel_dottore_lumine` and
`rel_lumine_dottore`.

**A correction to earlier feedback.** It is not true that there is no fuzzy name
matching. Subject resolution matches against a trusted catalogue and records
*how* it matched, via bases including `exact_name`, `unique_alias`,
`spelling_variation` and `trait_or_qualified_alias`. The gap is narrower and more
specific: **nothing merges notes that have already split.**
`identity-repair/preview` reported 9 notes correctly bound and **0 merge
candidates** — it did not recognise the pair it was most needed for.

**Impact.** Split memory. Retrieval finds one half and not the other. Nothing
flags it. Combined with F11's cross-note blind spot, the same fact can live on
both halves and be deduplicated against neither.

**Would not have hurt if:** names had been normalised before extraction — which
requires knowing in advance that ids derive from subject strings, stated nowhere.

---

### F14. Keyword handling has no curation, only truncation

`ARCH` `UX`

**Observation.** The projector unions keywords without pruning. With ~100 sources
feeding two character notes, saturation at the 30-keyword cap is inevitable.
`set_keywords` mutations then fail against it routinely.

**Impact.** The available workaround — trim to 10, retry, escalate to empty —
works but destroys curated keyword lists as a side effect of applying unrelated
claims. In the operator's words, *"some keywords are just getting unlucky"*:
whatever survives is an artifact of truncation order, not of relevance.

**Would not have hurt if:** few sources per note.

---

## 5. Chronology

### F15. Chronology is load-bearing and unenforced

`ARCH` `UX`

**Observation.** The complaint that motivated the whole migration was that
recalled memories carry no indication of *when* they happened, so the model
treats settled history as live.

The mechanics:

- Dates live in prose, inside section text, by convention only. There is no date
  field.
- `chunk.updatedAt` exists and is never rendered at injection.
- `cleanLongTermMemoryChunkText()` strips `[note: …]` and `[evidence: …]` labels
  before injection, removing provenance the model might otherwise have used.
- **There is no recency weighting.** `LtmRankCooldown` is declared and consumed
  inside `reciprocalRankFuse(lanes, { cooldowns })` — but the sole caller, in
  `retrieval.ts`, invokes `reciprocalRankFuse(lanes)` with no options object at
  all. `cooldowns` is unconditionally `undefined` and the entire penalty branch
  is unreachable.

**Impact.** The originating complaint is unaddressed at the architectural level.
Making chronology work required a mandatory prompt rule forcing every
`timeline_event` to begin with `[YYYY-MM-DD]` — smuggling a structured field
through free text and hoping the model complies.

**Would not have hurt if:** a short timeline in a single mode.

---

## 6. Errors and observability

### F16. Errors name the rule, not the object

`UX` `ARCH`

**Observation.**

```
A projected section exceeds the 20,000-character text limit.
```

Thirty-five identical failures in one run. No note id, no section key, no current
size, no indication which of 161 notes was at fault.

By contrast the storage-contract error *does* name the note:

```
Long-term memory projection for char_dottore exceeds its storage contract:
[{"code":"too_big","maximum":30,"type":"array", ...
```

— but delivers the actionable part as a raw schema dump.

**Impact.** Diagnosis required reading `draft-projector.ts` to learn additive
sections are capped, then `isAdditiveLtmSection()` to learn which sections are
additive, then querying every candidate note to find the full one.

**Would not have hurt if:** *nothing.* The note id is in scope at the throw site.

---

### F17. Instrumentation exists with no consumer

`UX`

**Observation.** The package has good instrumentation, all of it API-only:
`/rejected-suggestions`, `/debug-log`, `/last-injection/:chatId`, `/integrity`,
`/status`.

**Impact.** Every diagnosis across these sessions went through `curl`. The data
needed to answer *"why is my memory not working"* already exists and is not
assembled anywhere.

**Would not have hurt if:** *nothing.*

---

## 7. Extraction operations

### F18. One unset field silently cost a third of the extraction

`USER` `UX` `ARCH`

**Observation.** `personaId` was absent from the extraction scope. Every claim
whose subject was the operator's persona failed the trusted-subject check and was
dropped as `untrusted_subject` — 132 of 200 rejections.

**Impact.** The extraction completed, reported success, and produced a vault
missing the operator's own side of the story. Discovered only by querying the
rejections endpoint after the vault *felt* thin.

**Would not have hurt if:** the field had been set. Squarely the operator's
mistake.

**But:** there is no validation, no warning at configuration time, no dry run,
and no completion summary. An extraction that discards a third of its output is
not a success, and should not report as one.

---

### F19. Model compatibility is discovered by spending money

`MODEL` `ARCH` `UX`

**Observation.** The evidence-unit schema is a discriminated union with optional
object fields. Two models failed it differently:

- **GLM 5.2** emits explicit `null` for optional object fields rather than
  omitting them — 28 claims lost to `dimensions`/`dimensionChanges: null`
- **Gemini Flash** rejected the schema outright, HTTP 400 in 4–5 seconds on every
  request

**Impact.** Both discovered by running a full extraction and reading the
rejection breakdown. There is no capability probe, no schema-compatibility check,
and no single-entry dry run.

**Aggravating detail.** The structured-output fallback matcher does not tolerate
the `null`-for-optional case, which is common and trivially normalisable.

**Would not have hurt if:** a model with stricter structured-output fidelity had
been used — but the operator's reason for choosing GLM is exactly the reason most
users would, and nothing warns them.

---

### F20. Extraction has no progress channel

`SCALE` `ARCH` `UX`

**Observation.** Extraction is per-source-note, synchronous, one HTTP request
each, with no batching endpoint and no progress stream. A 97-entry run takes
25–35 minutes. undici's default 300s headers timeout kills long requests. There
is no server-side job model, so a client crash loses position.

**Impact.** The client had to implement batching, concurrency limiting, explicit
timeouts, retries, a heartbeat, and a resumable ledger — and got the resume logic
wrong twice. A long run with no progress channel is indistinguishable from a hung
process.

**Would not have hurt if:** fewer than ~20 sources.

---

## 8. What the vault is fed

Upstream of the package, but it determines the quality of everything in it. From
a dedicated audit of the summary corpus before re-ingest.

### F21. Summarisation errors that read as plausible

`MODEL` `USER`

**Observation.** Three factual errors survived a summarisation pass, a merge, and
multiple automated readings. They were caught only by checking against raw
transcripts:

- **a quantified claim drifted toward the corpus's dominant theme** — the number
  was preserved exactly, but *what it was an estimate of* had been replaced with
  the most frequently recurring nearby subject. Superficially correct,
  internally consistent, completely wrong.
- **a spurious "first time" attribution** — an event recorded on a date where it
  did not occur
- **a contradicting "first"** — the same event marked "for the first time" on two
  different dates

**The pattern:** superlatives and quantified claims are the highest-risk content
for paraphrase drift. A summariser compressing a long passage resolves ambiguity
toward whatever theme dominates the surrounding text, and *first / never / only*
claims and bare numbers are exactly where that silently changes meaning rather
than merely losing detail.

**Impact.** The worst failure mode available to a memory system: a wrong claim
that nothing downstream can detect, retrieved confidently forever.

**Would not have hurt if:** claims had been verified against source — which is
what caught them, and which does not scale.

---

### F22. Structural artifacts become durable claims

`MODEL` `USER`

**Observation.** In a 97-entry corpus:

- **oversized entries** — 17 exceeded threshold. One was large enough that
  extraction exceeded the model's output limit and failed outright. Long entries
  visibly degrade toward the tail; dates and names get sloppier further in.
- **boilerplate scene-linkage prose** — one continuation phrase appeared 37
  times, carrying no durable fact, frequently *doubled* into a key-detail bullet
  and therefore extracted as a claim
- **chunking filler** — status text like "scene ongoing" as standalone bullets,
  an artifact of where the chunker cut. Some had a real fact welded on with an em
  dash, so they could not be pattern-deleted.
- **OOC content recorded as in-fiction fact** — planning notes summarised
  indistinguishably from events. One entry was *entirely* a planning note whose
  contents were then narrated in following entries, so the same material entered
  memory twice, once as plan and once as event.
- **multi-fact bullets** — the contract is roughly one bullet per claim, but many
  bundle an event, its cause, and a resulting state, which become one muddled
  claim or get dropped
- **chronology ordering bugs** — in one day, entries were ordered by which
  summarisation pass produced them rather than by narrative sequence, inverting
  the actual order of events

**Impact.** Each artifact becomes a permanent claim competing for retrieval
budget on every turn.

**Would not have hurt if:** the corpus had not been layered through multiple
summarisation passes and a merge. Each pass is an opportunity for drift, and by
the final artifact there is no signal distinguishing near-verbatim claims from
thrice-compressed ones.

---

## 9. Attribution

Across the 22 findings:

| Tag | Count | Share |
|---|---|---|
| `UX` | 17 | 77% |
| `ARCH` | 13 | 59% |
| `USER` | 6 | 27% |
| `SCALE` | 5 | 23% |
| `MODEL` | 5 | 23% |
| `ENV` | 1 | 5% |
| `ENGINE` | 1 | 5% |

**The honest headline.** Corpus size contributes to fewer than a quarter of
findings and is the sole factor in none — no finding reads *"this is fine, the
corpus is just big."* Operator error contributes to six, which is a lot and worth
owning. But in every one of those six the counterfactual reads *"and nothing said
so"*, which is itself a UX finding.

**Seven** — F2, F3, F4, F6, F8, F9, F16, F17 — hurt regardless of corpus size,
platform, model or configuration. Those are the irreducible core: memories born
unusable, an unanswerable "why", invisible rejections, undefined vocabulary,
invariants that surface only as failures, an empty first screen, errors that name
the rule instead of the object, and instrumentation nobody reads. Fix nothing
else and those still cost every user something.

The distribution also shows why the `UX`/`ARCH` split matters. The architecture
is mostly sound. What is missing is almost entirely the layer that shows a person
what the architecture is doing.

---

## 10. Reframing the operator's mistakes

Six findings carry `USER`. Each has a product-side reading:

| Operator mistake | What would have made it hard to get wrong |
|---|---|
| `personaId` unset | validation at configuration, or refusal to extract |
| Names not normalised | a naming report before extraction, or merge candidates after |
| Two summary passes merged | working dedup against stored content (F11) |
| Backfilled into consolidated weeks | a warning instead of a silent no-op (engine-side) |
| Prompt-assembling preset | a warning that the preset discards agent output |
| Model with a structured-output quirk | a capability probe before a paid full run |

None of these require the user to be more careful. All of them require the system
to be less quiet.

---

## 11. Limits of this report

- **One operator, one primary deployment, one dataset, one main model.** Findings
  tagged `ENV` and `MODEL` especially may not generalise.
- **Version-bound.** Engine 2.4.1, LTM 1.1.6. Some findings may already be
  addressed.
- **Not investigated:** lorebook interop, the world-state agent, RP-time versus
  wall-clock reconciliation, multi-persona setups, group chats, and retrieval
  *quality* as opposed to retrieval plumbing.
- **The reviewer built a competing tool.** The operator wrote a review workbench
  to complete the migration, and its existence is used as evidence that gaps are
  real. The counterfactual column is the check on that bias.
- **Two measurements, not readings.** The dedup analysis in F11 comes from a
  faithful port of `deduplicateUnits()`, not the shipped function under test; the
  arithmetic is straightforward but it has not been run against a live server. The
  injection behaviour in F1 and F2 was confirmed by capturing outbound request
  bodies, which is direct evidence.
- **Earlier drafts of this feedback contained errors**, specifically about the
  preset marker requirement (F1) and the absence of fuzzy name matching (F13).
  Both are corrected in place and flagged, rather than silently fixed, because the
  fact that careful readers reached opposite conclusions is itself evidence about
  discoverability.
