# Long-Term Memory: the short version

Feedback on the `long-term-memory` capability package (v1.1.6) running on
Marinara Engine 2.4.1. Written by Claude across several working sessions with one
operator, from a mix of first-run walkthroughs, a full production migration, and a
source read of the package.

This page is the forwardable summary. [`01-findings.md`](01-findings.md) carries
the evidence, [`02-design.md`](02-design.md) proposes directions, and
[`03-reproduction.md`](03-reproduction.md) is how to see any of it yourself.

## How this was produced

Three independent passes, deliberately different in shape:

1. **A cold first-run.** Fresh install, empty vault, follow the documentation and
   see how far you get. Ran against a mock model provider so extraction and
   embeddings worked without an API key.
2. **A production migration.** One operator moving roughly three weeks of
   continuous story off the engine's built-in chat summaries and into the LTM
   vault — 97 source entries, ~1,150 claims, 161 notes. This is where the
   scale findings come from.
3. **A source read.** Every mechanical claim below was checked against the
   package source at v1.1.6. Where earlier drafts of this feedback were wrong,
   the source read corrected them, and those corrections are called out in the
   findings rather than quietly fixed.

Two claims are backed by measurement rather than reading: the dedup analysis in
finding 4 comes from a line-for-line port of `deduplicateUnits()` run at corpus
scale, and the injection behaviour in finding 1 was confirmed by capturing the
actual request bodies leaving the server.

## The headline

**The architecture is in good shape. The layer that tells a person what the
architecture is doing is largely absent.**

Typed notes, evidence links, recorded conflicts, dependency auto-inclusion on
partial accept, structured rejection records — these are good decisions, and
several of them are better than what comparable systems ship. The problem is that
when this system fails, it almost always fails *quietly*, and the instrumentation
that would explain the failure already exists and has no consumer.

The operator in pass 2 made real mistakes, several of which are owned plainly in
the findings. But in every single case the honest counterfactual is *"and nothing
said so, for weeks."* That is the through-line.

## The six that cost every user something

Ordered by value per unit of work. None of these depend on a large corpus, an
unusual platform, or a particular model.

### 1. Recall can succeed and still reach nothing, with no signal anywhere

Two independent gates can silently void recall.

**Preset placement.** When the active preset assembles the whole prompt,
`generate.routes.ts` sets `presetOwnsAgentPlacement`, and the injection guard
reads `if (handledByPresetSection || !presetOwnsAgentPlacement)`. If the preset
owns placement and carries no `agent_data` marker section for
`long-term-memory`, the block is skipped entirely — no injection *and* no
receipt. Because the receipt is what drives the last-injection readout, the UI
then keeps showing the previous run's number indefinitely. The user sees a
healthy-looking count while nothing is being injected at all. One shared preset
disabled memory across four chats for an unknown period.

**Mode eligibility.** Memories extracted inside a Conversation chat are saved
with `Available modes` set to Roleplay only, which makes them ineligible in the
chat that produced them. Retrieval returns nothing and reports it as a neutral
state.

*Smallest fix:* give the readout a negative state and a timestamp, so "nothing
this turn" is distinguishable from "the last time it worked." Then state mode
eligibility at accept time, defaulted from the originating chat.

### 2. "Nothing recalled" has one message and at least five causes

Empty vault, no match, below score threshold, dropped for budget, or ineligible
for this chat mode — all present identically. Meanwhile `budget.ts` already
computes a typed `rejectionReason` for every discarded candidate
(`budget`, `lower_rank`, `score_threshold`, `duplicate_text`, `missing_chunk`)
along with per-candidate lane scores and tier. It is thrown away unless debug
mode happens to be on, and then it goes to a log file.

*Smallest fix:* compute `explain` unconditionally and surface the counts.
"18 used · 3 over budget · 2 below threshold · 1 not enabled here" is four
numbers you already have.

### 3. The vocabulary is never defined

The pipeline has seven nouns — source note, extraction, evidence unit, mutation,
draft, note, section, chunk — with strict ordering and distinct meanings. The
review UI shows *drafts* containing *mutations*. Neither word is defined
anywhere a user can reach.

An operator who had written a 38 KB integration script against this system said
directly that he did not know what a draft or a mutation was. A glossary had to
be written externally before a migration could even be planned.

The coping strategy for reviewing objects you cannot name is to accept
everything, which turns review into a rubber stamp.

*Smallest fix:* inline definitions on first use in the review UI, and a short
concepts page in the docs.

### 4. Deduplication against stored content is effectively inert

`deduplicateUnits()` compares each incoming claim against both other incoming
claims and the existing note — good design. But the stored comparison Jaccards a
single claim (~11 tokens) against the **entire section as one blob**, and the
threshold is 0.85. Measured, with an exact-duplicate claim:

| stored section | Jaccard | fires? |
|---|---|---|
| 226 chars | 0.478 | no |
| 2 KB | 0.060 | no |
| 20 KB | 0.040 | no |

It can only fire when the section is nearly empty. `tokenize()` also caps at 500
tokens, so late content is invisible regardless.

The consequence is that the guard against restatement goes silent exactly when a
note is big enough to need it, and additive sections accumulate near-duplicate
text until they hit the 20,000-character cap. One real saturated section was
measured at 88% restatement.

*Smallest fix:* compare against section *lines*, not the whole blob. The
comparison is already cheap — a full pass over 1,142 claims against 161 notes
measured **133 ms** with no model calls.

### 5. Errors name the rule, not the object

```
A projected section exceeds the 20,000-character text limit.
```

Thirty-five times in one run, with no note id, no section key, and no current
size — against a vault of 161 notes. Diagnosing it required reading
`draft-projector.ts` to learn that additive sections are capped, then
`isAdditiveLtmSection()` to learn which sections are additive, then querying
every candidate note to find the full one.

The note id is in scope at the throw site.

*Smallest fix:* `char_dottore.trait is at 20,000 characters and cannot take
more.` One string change removes an entire diagnosis session.

### 6. The observability already exists and has no consumer

| Endpoint | Knows | Shown |
|---|---|---|
| `/rejected-suggestions` | why candidates were dropped, with recovery targets | nowhere |
| `/debug-log` | per-operation phase, status, error | nowhere |
| `/last-injection/:chatId` | what was actually injected | partially |
| `/integrity` | vault consistency | nowhere |
| `/status` | note counts, embedded chunks, index errors | partially |

In one migration, 200 candidates were auto-rejected during extraction — a third
of the corpus, and specifically the operator's own persona, dropped because one
scope field was unset. The vault looked fine. The rejection records were
well-structured, carrying reason code, message, source snippet, and a `recovery`
object naming the exact note and section the claim would have targeted. Nobody
built the display.

*Smallest fix:* a single "why is my memory not working" page assembling those
five endpoints. It would have caught three of the four silent failures in that
migration without a line of user code.

## What is genuinely good

Worth stating, because a reader deciding what to change should know what not to
touch.

- **The typed note model.** Character, relationship, world, thread, timeline
  event, tone, anchor, with per-type additive semantics. A real information
  model, and the thing that makes subject-grouped review possible at all.
- **Evidence links.** Every mutation cites its source; every note links
  `extracted_from`. None of the diagnosis in these documents would have been
  tractable without it.
- **Conflicts are recorded, not resolved.** The failure mode is "you decide,"
  which is correct for a memory system.
- **Dependency auto-inclusion on partial accept.** `filterAutoApplyDependencies()`
  pulls in the `create_note` and timeline links a partial selection depends on.
  Quiet, correct, and the reason incremental review is safe by default.
- **`editedMutations` on accept.** Edit-before-accept is exactly the right
  primitive for a review queue, and it is more than most review UIs offer. It is
  also completely undiscoverable from the interface.
- **The rejection data model.** Thoughtfully built by someone who anticipated the
  question. It just has no reader.

## A note on names

The migration corpus was a private roleplay. Character and scene names have been
replaced throughout with a consistent alias map drawn from Genshin Impact —
`char_dottore`, `char_lumine`, `char_ayaka` / `char_kamisato_ayaka`. Raw chat
identifiers have been dropped rather than aliased. The mechanics, counts, and
identifier *shapes* are unchanged, because those are the evidence.

## Scope

This covers the LTM package. Findings that belong to Marinara Engine — the
preset-placement behaviour in finding 1, consolidated-week summary handling, the
automated-summary hard cap, embedding capability reporting — are collected
separately in [`engine-issues.md`](engine-issues.md), since that is a different
repository with a different maintainer.
