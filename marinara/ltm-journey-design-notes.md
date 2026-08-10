# Long-Term Memory: journeys and navigation design notes

Design notes derived from `ltm-state-machine-notes.md`. Working material, not
maintainer documentation.

The question this answers: given how the data actually flows, what should the
user journeys be, what is the smallest navigation that serves the happy path,
and how does that navigation absorb the error states?

## The structural finding: two loops, not one feature

Everything the package does belongs to one of two loops. They share exactly one
object — the vault — and nothing else.

| | Curation loop | Recall loop |
| --- | --- | --- |
| Shape | material → source note → extraction → draft → memories | memories → eligible → ranked → budgeted → prompt |
| Tempo | bursty, offline | every single turn |
| Volume | hundreds of items per burst | ~20 chunks, 4,096 tokens |
| Who acts | the user, at one step (review) | nobody; fully automatic |
| What the user needs | a way to decide in bulk | a way to see what happened |

The current design puts both loops behind one four-tab workspace reached by an
eight-step descent through Chat Settings. That is the root navigation error: the
batch loop drowns the per-turn loop, and the per-turn loop has nowhere to report.

## The six journeys

| ID | Goal in the user's words | Loop | Starts in |
| --- | --- | --- | --- |
| J1 | "I want this character to remember things about me." | both | chat |
| J2 | "I have a story bible and 90 sessions. Learn all of it." | curation | workspace |
| J3 | "Just write down that I'm allergic to shellfish." | curation | chat |
| J4 | "It just forgot my sister's name. Why?" | recall | chat |
| J5 | "That's wrong, and it keeps bringing it up." | both | chat |
| J6 | "Is this still working?" | maintenance | workspace |

Four of six start in the chat, and three of those are triggered by something the
user just read in the transcript. Only J2 and J6 want a dedicated workspace.

## Proposed surfaces

**An ambient strip in the chat** — the recall loop's report. One line at rest
("Wren remembered 2 things here"), a drawer when opened showing what was used,
what was dropped, and why. Serves J1's proof, J4's diagnosis, J5's correction,
and J3's shortcut.

**A workspace with three destinations** — the curation loop.

1. **Inbox** — everything waiting on you: drafts grouped by change kind, blocked
   items grouped by cause, health obligations. Replaces the Review Queue and the
   maintenance nags.
2. **Memories** — what it knows. Dense rows grouped by subject. Source records on
   their own tab.
3. **Teach it** — sources and import, named by the goal rather than the mechanism.

Settings becomes a gear, not a fourth peer tab.

## The governing rule

**Never show the user a state. Show an obligation or a result.**

The package exports ~30 state enums covering 100+ states. The test for surfacing
any of them: *does knowing this change what the user would do?* If not, resolve it
silently.

| Engine state | Show it? | Appears as |
| --- | --- | --- |
| `pending` + fresh + has mutations | yes | Inbox row, grouped by change kind |
| `superseded` | no | hidden; a newer extraction replaced it |
| `accepted` / `auto_applied` | no | leaves the Inbox; memory appears |
| `applying` | transiently | progress on the row |
| `source_missing` / `source_invalid` | yes | "the material behind these was deleted" |
| `hashless` / `stale` | yes | "this extraction didn't finish" → re-run |
| `no_mutations` | low priority | "nothing durable found in this material" |
| 11 `dropReason` values | grouped only | one Inbox row per cause + bulk fix |
| 5 budget `rejectionReason` values | yes, per turn | the "dropped" column in the chat strip |
| `indexRebuildStatus: failed` | yes | badge on the memory: "saved, not searchable" |
| `indexHealth` degraded/corrupt | once | one banner, one repair action |
| mode eligibility | yes | stated at accept time; offered as a fix at recall time |
| `active` / `resolved` / `archived` | partly | active default, resolved dimmed, archived aside |
| tiers, lane scores, cooldown penalties | no | feed ordering; never named |

## Happy paths

### J1 — activation, entirely in the chat

1. Switch on in Chat Settings.
2. Immediately show what it can learn from *right now*, with counts. Sources with
   nothing in them stay visible and explain their emptiness and when to return —
   never an empty list with no explanation.
3. Review the handful of proposals inline. Mode eligibility is stated here and
   defaulted from the current chat.
4. Two turns later the strip reads "Wren remembered 2 things here."

The journey ends on observed behaviour, not on a setting.

### J2 — bulk curation, four decisions instead of 583

Group by `(disposition × importance × confidence)` and by `dropReason`. All of
these are existing enum values, so this is a `GROUP BY`, not new modelling.

- routine additive merges → spot-check 5, accept the rest
- new memories → skim
- rewrites that contradict existing memories → review as diffs
- blocked, one cause → fix and requeue in one action

Order matters: cheapest bulk decision first so the queue drains fastest at the top.

### J4/J5 — the strip answers "why" and fixes it there

The engine already computes, per candidate per turn: lane scores, tier, estimated
tokens, and a typed `rejectionReason`. It is discarded unless `debugEnabled`, and
then it goes to a log file. Surfacing it turns "nothing recalled" from one
ambiguous message into four individually actionable causes.

Correction controls belong on the used rows, because the moment of noticing a
wrong memory is the moment it is quoted back at you.

## Recovery principles

1. **The error belongs where the consequence is, not where the cause is.** A
   memory that failed to index is broken in *Memories*, not on a maintenance tab.
2. **Every error names the journey it interrupted and offers the one action that
   resumes it** — the actual fix, executed in place, not a link to settings.

| What breaks | Journey | Currently | Recovery in place |
| --- | --- | --- | --- |
| Nothing to import yet | J1 | empty tab | source listed with reason + when to return |
| Extraction found nothing | J1 J2 | "No mutation survived extraction." | "nothing worth keeping here" → other source / add manually |
| Extraction partly failed | J2 | blocked as "the source changed" | "this extraction didn't finish" → re-run |
| Candidates rejected by category | J2 | 63 identical decisions | one row, one cause, one fix |
| Source edited or deleted | J2 | drafts silently block | "the material behind 12 changed" → re-extract or discard |
| Index rebuild failed | J2 J4 | nothing | badge "saved, not searchable" → rebuild |
| Mode ineligible | J1 J4 | nothing | dropped row → "enable for Conversation" |
| Budget / threshold drops | J4 | a token count | "2 didn't fit" → raise cap |
| Recall returned nothing | J4 | stale count from an earlier turn | "nothing recalled this turn" + timestamp + reason |
| A memory is wrong | J5 | eight steps away | `⋯` on the used row: edit / stop using / forget |

## Suggested order of work

1. Chat strip: negative state, timestamp, dropped-with-reasons. Requires
   `explain` computed unconditionally rather than only under debug.
2. Mode eligibility stated at accept time, defaulted from the originating chat.
3. Inbox grouped by change kind and drop reason.
4. Source records split out of the memory list.
5. Fingerprint message corrected, with a re-run action.
6. Index-failure badge on affected memories + Inbox obligation.
7. Move the strip into the transcript and the workspace behind three
   destinations — largest change, worth doing last.

Items 1–4 are plumbing over data the engine already computes.
