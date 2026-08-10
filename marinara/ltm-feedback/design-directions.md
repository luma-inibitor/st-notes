# Design directions

Proposals for the findings that cannot be answered with a one-line fix. Everything
here is a direction, not a specification: the point is to argue for a shape, and
the shape matters more than any particular control.

Two things ground these proposals. The first is the package's own data model,
which already carries most of what the designs need. The second is a review
workbench the operator built to finish a migration the stock queue could not
support, which is used throughout as evidence about what the work actually
requires. Where a proposal cites that tool, it is citing observed behaviour under
real load, not a preference.

## The structural fact everything follows from

The package does two unrelated jobs and gives them one surface.

| | Curation | Recall |
| --- | --- | --- |
| Shape | material becomes source notes, then claims, then memories | memories are selected, budgeted, injected |
| Tempo | bursty, offline, hundreds of items at a time | every turn, automatic |
| Who acts | a person, at one step | nobody |
| What it needs | a way to decide in bulk | a way to report what happened |

They share the vault and nothing else. A workspace built for the first has no
natural place to report the second, which is why the recall loop currently
surfaces as a single count with no negative state. Design them apart.

---

## 1. The review workspace

### The unit of work is a slice, not a draft

The stock queue iterates sources, then drafts, then targets, then mutations. That
hierarchy is the shape of the extraction run, not the shape of the decision.

Under real load the operator worked differently: compose a cross-section, work it
to exhaustion, apply, compose the next. Quality-flagged claims with a low hit
count. Then high risk. Then high risk for one character. Then threads. Roughly
five to ten separate apply steps across the corpus, each against a different
slice.

No fixed set of categories expresses that. A taxonomy of lanes, however well
chosen, is the designer's ontology imposed on a corpus the designer has not read.
The interface should let a reviewer compose the cross-section they need and then
act on all of it.

### Derived signals are the thing that makes a thousand claims tractable

Grouping by fields the server already returns is table stakes. What made the
workbench usable was computing signals that do not exist in the payload:

| Signal | How it was derived | What it answers |
| --- | --- | --- |
| Restates the vault | shingle similarity against existing section lines, flagged at 0.45 | is this already known |
| Near-duplicate incoming | 4-word shingles across the batch, clustered at 0.7 | are these the same claim twice |
| Keyword pressure | projected keyword union against the 30 cap | will this fail on apply |
| Section pressure | projected section length against the 20,000 cap | will this fail on apply |
| Weak subject binding | `matchBasis` weaker than an exact name | is this the right character |
| Disposition | additive merge versus overwrite | can accepting this destroy something |

The first two are the ones the package cannot currently answer at all: stored
dedup cannot fire on a section of any size, and nothing compares a claim to what
the note already holds. The last four are already computed or already on the wire
and simply never surfaced.

A full pass of this kind over 1,142 claims against 161 notes measured 133 ms with
no model calls, so the cost is not the obstacle.

### One list, composable controls

```
┌─ facets ───────────┐  ┌─ 1,142 claims · 340 shown · 61 decided ──────────────┐
│ [clear]            │  │  group by [ target note ▾ ]   sort by [ risk ▾ ]     │
│                    │  ├──────────────────────────────────────────────────────┤
│ ▾ computed         │  │ ▾ char_dottore · 41 claims · trait 19.2k/20k  ⚠      │
│   restates vault 61│  │    ☐  high   restates vault 0.71                     │
│   dupes incoming 75│  │       "…claim text…"                      [ edit ]   │
│   keyword cap   24 │  │    ☐  med    new                                     │
│   section cap   35 │  │       "…claim text…"                      [ edit ]   │
│   weak match     9 │  │                                                      │
│                    │  │ ▾ rel_dottore_lumine · 12 claims                     │
│ ▾ from the model   │  │    ☐  high   overwrites  ▸ diff                      │
│   disposition    … │  │       "…claim text…"                      [ edit ]   │
│   risk           … │  └──────────────────────────────────────────────────────┘
│   importance     … │
│   drop reason    … │   [ apply 61 selected ]    preflight: 2 would fail  ⚠
│                    │
│ ▾ yours            │
│   saved slices   … │
└────────────────────┘
```

Four properties matter more than the layout.

**Group-by and sort are independent controls over one list.** Not a queue tab and
a by-note tab exposing the same facets under different names. The same filter set
survives regrouping, so a reviewer can pivot without losing their place.

**Facets are grouped by where they come from, and that grouping teaches.** Signals
computed by the reviewing tool sit visually apart from values the model or the
engine produced, which in turn sit apart from the reviewer's own saved slices. An
interface that mixes these silently is asserting that a heuristic and a schema
field carry the same authority.

**Editing is a first-class step, not a hidden affordance.** The observed loop is
spot-check, skim, edit, apply. The accept route already takes fully edited
mutations and re-validates them server side, so the capability exists and only
the surface is missing.

**Selection survives navigation.** Selection is currently cleared whenever the
chat, source or selected draft changes, which is what confines a batch to one
draft even though the apply path already groups its requests by draft.

### Apply is incremental, preflighted, and reported against the batch

Three properties, each answering a specific failure.

*Preflight before send.* Most apply-time failures are derivable from the selection
before anything is submitted: section and keyword caps, missing link targets,
ungrounded change claims, duplicate creates, scope mismatches. Showing "2 would
fail" with the reasons converts a mid-batch abort into a decision made up front.

*Progress against the batch, never the draft.* A partial apply keeps the draft
pending and rewrites its mutation list to only the skipped items, so the draft is
a shrinking denominator. Reporting progress against it tells the reviewer nothing
true.

*A restore point before large applies.* There is no undo: the transaction journal
carrying the before-state of every touched file is deleted at commit. Until that
changes, sampling before a bulk accept is not a nicety, it is the only way to earn
justified confidence in an irreversible action. Backup export already exists and
is already routed.

### Conflicts need a third option

A conflict currently reaches the reviewer not at all: the review queue never reads
it, and the vault later shows the proposed value without the existing one. When it
is surfaced, replace-or-keep is the wrong pair of choices. Most apparent
contradictions in a long story are the relationship moving rather than a factual
dispute, and forcing a binary is how a memory system loses its own timeline. The
third option is to keep both, ordered.

A recall count on the existing text is what makes the choice possible, since it
says how much the model has been leaning on what is about to be overwritten.

---

## 2. The vault browser

The same facet engine, over stored memories rather than proposed ones.

This is the least speculative proposal here, because the operator's verdict on
their own vault view was that it was useful only for editing notes and checking
cap pressure, while the review browser was where all the leverage was. The two
surfaces answer the same question about different tenses of the same objects.

Concretely it needs what review needs: filter by type, subject, status, mode
eligibility and cap pressure; group and sort independently; act in bulk; and
exclude source notes by default, since they are audit records rather than
memories and currently inflate every count the interface shows.

---

## 3. The recall report

The curation loop gets a workspace. The recall loop gets a line in the chat, where
its results actually appear.

At rest it states what happened on this turn, including when nothing happened.
Opened, it shows what was used, what was dropped, and why. Every input already
exists: the injection receipt is verified against the dispatched prompt, and the
budget layer types a rejection reason for every discarded candidate alongside lane
scores, tier and estimated tokens.

Three properties it must have that the current readout does not:

- **A negative state.** "Nothing recalled this turn" is a different fact from the
  last successful count, and the absence of that distinction is what lets a dead
  injection path look healthy indefinitely.
- **A timestamp.** Without one, no reading of the number is safe.
- **Reasons, not just a count.** "18 used, 3 over budget, 2 below threshold, 1 not
  enabled here" is four numbers already computed on every turn.

The correction controls belong on the used rows, because the moment a wrong
memory is noticed is the moment it is quoted back at the reader.

---

## 4. Which states should reach a person

The package models more than a hundred states. The test for surfacing any of them
is whether knowing it changes what the reader would do. Everything else resolves
silently.

| State | Surface it | As what |
| --- | --- | --- |
| pending, fresh, has mutations | yes | a row of work |
| superseded, accepted, auto-applied | no | it leaves the queue |
| applying | transiently | progress on the row |
| source missing or invalid | yes | the material behind these is gone |
| extraction incomplete | yes | this extraction did not finish, run it again |
| no mutations | low priority | nothing durable was found here |
| 11 drop reasons | grouped | one row per cause with a count |
| 5 budget rejection reasons | yes, per turn | the dropped column in the chat report |
| index rebuild failed | yes, persistently | saved, not searchable |
| index health degraded | once | one banner, one repair |
| mode eligibility | yes | stated at accept time, defaulted from the originating chat |
| tiers, lane scores, cooldown penalties | no | they order the feed and are never named |

The current failure is not that these are modelled badly. It is that the ones a
person needs are computed and discarded, while the ones nobody needs are the ones
that leak into error messages.

---

## 5. The large items

Six findings have no cheap version. Their design implications, briefly.

**Chronology.** Timeline events carry no in-world date, only wall-clock
bookkeeping, and injected chunks are ordered by relevance with no relation between
them. Sorting by `createdAt` would order by when extraction ran, which is worse
than nothing. The direction is a structured in-world timestamp on the section,
populated at extraction, rendered at injection, and used to order events relative
to each other.

**Compaction.** Additive sections union without pruning, so every cap is reached
eventually by construction. Nothing decays, expires or compacts. Any long-running
deployment needs a pass that rewrites a section against a durability test rather
than appending to it forever.

**Semantic duplication.** The write path never calls an embedding function, so
restatement is accepted unconditionally. The retrieval half already embeds; the
missing piece is comparing a candidate against the lines a note already holds.

**Identity sections.** One section accumulates stable traits, changes to those
traits, dispositions, backstory and events, which is why the characters with the
most development saturate first. Splitting by claim kind is a schema change, and
the alternative is a prompt constraint that will hold unevenly.

**Two summary subsystems.** Roleplay and Conversation summaries differ in storage,
format, compression and date handling, and nothing reconciles them for one story
told in both modes.

**Undo.** Recorded for completeness and explicitly not a request. The journals
already contain the before-state of every touched file and are deleted at commit;
retaining the last N would give the feature real undo. It is a large lift and the
operator does not want it prioritised.

---

## Open questions

- How much of the derived-signal work belongs server side. Computing restatement
  against stored lines during review is cheap, but doing it at ingest would stop
  the duplicates from being proposed at all.
- Whether saved slices are worth persisting server side or are a client
  convenience.
- Whether the recall report belongs in the transcript or in chat settings, which
  depends on what the engine lets a capability package render.
