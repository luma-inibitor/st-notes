# Long-Term Memory: the review workflow (J2)

Deep-dive notes on the bulk curation journey, following on from
`ltm-journey-design-notes.md`. Working material, not maintainer documentation.

Grounded in: `draft-projector.ts`, `draft-review.ts`, `reconciliation.ts`,
`mutation-transaction.ts`, `subject-identity.ts`, and the shared schema.

## The two findings that shape everything

### 1. The review response is already pivotable

`ltmDraftReviewResponseSchema` returns `sources[] → { drafts[], targets[] }`,
where a target is:

```
{ noteId, title, noteType, rows: [{ draftId, mutation, disposition, diagnostics, changes }] }
```

So the API already tells you, per source, **which memories would change and what
the diff is**. The client's outer loop iterates sources; nothing stops it
iterating targets instead.

This matters because a real session has 583 mutations across 71 identically
named imports, but those touch a far smaller set of memories — dozens of
sessions all say things about the same handful of characters. "The 41 things we
learned about Kirei" is a reviewable unit. "6 changes from msgs 33-33" is not.

### 2. There is no undo

`commitLtmMutation` (mutation-transaction.ts):

1. writes a journal containing `{path, before, after}` for every file,
2. applies the `after` state,
3. marks the journal `committed`,
4. calls `publish()`, which appends events and then **`remove()`s the journal**.

The journal is crash-recovery scaffolding (`recoverLtmMutations` replays
incomplete transactions on boot), not history. There is no undo route, no
revert, and no per-note version history beyond a monotonic counter.

**"Accept all 412" is irreversible.** Two consequences:

- Sampling is not a convenience — it is the *substitute* for undo, the only way a
  user can earn justified confidence before an irreversible action.
- A bulk action over some threshold should offer a restore point. Backup export
  and import already exist and are routed.

The stronger fix is an engineering ask: **retain the last N committed transaction
journals instead of deleting them**. Each already holds the exact before state of
every touched file. A retention policy would give the feature real undo.

## The triage model

Every mutation already carries enough to sort itself. Fields, all existing:

| Field | Values | Source |
| --- | --- | --- |
| `disposition` | `new`, `merge`, `rewrite` | computed by `dispositionForMutation` |
| `mutation.kind` | 7 kinds | `ltmDraftMutationSchema` |
| `changes[].kind` | `section`, `link`, `keywords`, `status`, `subjects` | `changesForMutation` |
| `mutation.risk` | `low`, `medium`, `high` | on the mutation |
| `importance` | `critical`…`minor` | evidence unit |
| `conflicts[]` | `{field, existing, proposed, resolution, policy}` | on `create_note` |
| `matchBasis` | `exact_name`, `unique_alias`, `spelling_variation`, … | `subject-identity.ts` |
| `dropReason` | 11 values | extraction |
| `blockReason.code` | 8 values | `blockReasonsForDraft` |

### Disposition is the load-bearing key

```
create_note      + no existing        -> new
create_note      + existing           -> merge
append/update_section + additive      -> merge
append/update_section + NOT additive  -> rewrite     <- destructive
add_link | set_keywords               -> merge
set_status | set_subjects             -> rewrite
```

Grouping by mutation *kind* sorts by mechanism. Grouping by *disposition* sorts
by **consequence** — whether accepting can destroy something. Given there is no
undo, that is the only distinction that decides whether bulk action is safe, so
it should be the primary key.

### Five lanes, five different questions

| Lane | Derived from | Question | Action |
| --- | --- | --- | --- |
| Adds something new | `disposition=merge`, `risk=low`, no conflicts | "Is any of this wrong?" | sample 5, accept rest |
| Creates a new memory | `disposition=new` | "Is this worth remembering?" | skim titles, accept in blocks |
| Overwrites a belief | `disposition=rewrite` | "Which version is true?" | read the diff — **no bulk action** |
| Wrong character? | weak `matchBasis` | "Is this the same person?" | confirm or rebind subject |
| Couldn't be saved | `dropReason` / `blockReason` | "Do I want these at all?" | one fix per cause |

Lane 4 comes straight from `subject-identity.ts`, which records *how* a name was
matched. `spelling_variation` or a qualified alias is a much weaker binding than
`exact_name`. Facts silently attached to the wrong character is the classic
failure mode of memory systems, and the signal to catch it already exists — it
just is not threaded onto the mutation.

Lane 3 deliberately has no "accept all". A lane whose defining property is that
it destroys existing content should not offer one.

## Screens

1. **Inbox** — five lanes with counts, restore-point offer above them.
2. **Lane** — rows grouped by target memory; sampling drawn *across* distinct
   targets so five items say something about four hundred. Adaptive trust: five
   clean checks earns the offer to accept the remainder; one rejection withdraws
   it and expands the lane.
3. **Diff card** — only for lanes 3 and 4. `changes[]` already carries
   `before`/`after` per section key; conflicts are already structured as
   `{existing, proposed, policy}`.

The diff card needs a third option beyond replace/keep: **keep both as history**.
Most apparent contradictions in a long roleplay are the relationship moving, not
a factual conflict, and forcing a binary choice is how a memory system loses its
timeline. A `used 21×` count on the existing text is what makes the decision
possible — it says how much the model has been leaning on what you are about to
delete.

## Post-accept behaviours that will surprise a UI author

| Behaviour | Why it surprises | What the UI must do |
| --- | --- | --- |
| Partial apply keeps the draft `pending` and **replaces its mutation list with only the skipped ones** | accepted work vanishes from that view | report progress against the batch, never the draft |
| `accepted` and `indexRebuildStatus: failed` can coexist | memories exist but recall cannot see them | do not report success until the rebuild lands; badge affected memories if it fails |
| Auto-apply exists and is silent | low-risk mutations from chat summaries can apply without review; `reviewRequired` is set for `character` and `lorebook` provenance, so those never can | state which sources skip review, show what was applied on your behalf |

## Build order

1. Group the queue by `disposition` — client only.
2. Group blocked items by cause, one fix per cause — client only.
3. Pivot lanes by target memory (invert `sources[] → targets[]`) — client only.
4. Report batch progress and index-rebuild status honestly — values already
   returned by the apply call.
5. Offer a restore point before bulk actions — reuses backup export.
6. Thread `matchBasis` onto the mutation to enable lane 4 — small server change.
7. Retain the last N transaction journals — the real engineering item, and the
   one that makes everything above safe rather than merely careful.

Items 1–5 are presentation over data that already crosses the wire. The review
workflow is not missing information; it is missing a decision about which axis to
organise it on.
