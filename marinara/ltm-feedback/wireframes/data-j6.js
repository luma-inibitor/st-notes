STATES.j6 = [
  {
    num: "01",
    label: "Cap pressure as a gradient",
    feas: "package",
    fx: [48, 45, 54],
    caption: 'Three pressures on one note, all three already computed at write time: characters, keywords and contributions. The amber is uniform on purpose, and a low-pressure note sits below it so the screen reads as a gradient rather than a wall. <b>Nothing on this vault has reached a cap</b>, so nothing is drawn in the failure colour, and red is held back for a limit actually hit. The current build renders none of the three and truncates section text at the cap in silence, which makes the first sign of a full note an apply that fails partway through a batch. Splitting identity into separate section keys is a schema change, so it is marked here rather than offered as one click.',
    desk: '<div class="dev"><div class="dev-desk">' +
      '<div class="side"><div class="side-title">Chats</div>' +
      '<div class="chat-row">Wren · harbour arc</div>' +
      '<div class="chat-row">Scene drafts</div>' +
      '<div class="chat-row on">Worldbuilding</div>' +
      '</div>' +
      '<div class="main">' +
      '<div class="topbar"><span class="ico">&lt;</span>LONG-TERM MEMORY<span class="ico hot">M</span></div>' +
      '<div class="rail"><span class="rt">Vault</span><span class="rt">Review</span><span class="rt">Sources</span>' +
      '<span class="rt on">Settings</span><span class="rt new">Recall</span></div>' +
      '<div class="pane">' +
      '<div class="hdr"><span class="grow">Notes under pressure</span><span class="sel">least headroom first</span>' +
      '<span class="tag warn">none at a cap yet</span></div>' +
      '<div class="grp">Wren · character<span class="c">identity section</span></div>' +
      '<div class="row"><span class="t">Section characters</span><span class="meta">19,240 / 20,000</span></div>' +
      '<div class="mtr warn"><i class="w96"></i></div>' +
      '<div class="row"><span class="t">Keywords</span><span class="meta">28 / 30</span></div>' +
      '<div class="mtr warn"><i class="w95"></i></div>' +
      '<div class="row"><span class="t">Contributions</span><span class="meta">91 / 100</span></div>' +
      '<div class="mtr warn"><i class="w90"></i></div>' +
      '<div class="grp">Harbour district · world<span class="c">room to grow</span></div>' +
      '<div class="row"><span class="t">Section characters</span><span class="meta">6,180 / 20,000</span></div>' +
      '<div class="mtr"><i class="w30"></i></div>' +
      '<div class="note-s">Identity holds traits, changes, dispositions, backstory and events against one cap.</div>' +
      '<div class="hdr"><span class="grow"></span><span class="btn pri">Compact</span><span class="btn">Split by claim kind</span></div>' +
      '</div></div></div></div>',
    phone: '<div class="dev"><div class="dev-phone">' +
      '<div class="topbar"><span class="ico">&lt;</span>NOTES UNDER PRESSURE<span class="ico hot">M</span></div>' +
      '<div class="rail"><span class="rt">Vault</span><span class="rt">Review</span><span class="rt">Sources</span>' +
      '<span class="rt on">Settings</span><span class="rt new">Recall</span></div>' +
      '<div class="pane">' +
      '<div class="hdr"><span class="grow">Least headroom first</span><span class="tag warn">none at a cap</span></div>' +
      '<div class="grp">Wren · identity<span class="c">3 pressures</span></div>' +
      '<div class="row"><span class="t">Characters</span><span class="meta">19,240 / 20,000</span></div>' +
      '<div class="mtr warn"><i class="w96"></i></div>' +
      '<div class="row"><span class="t">Keywords</span><span class="meta">28 / 30</span></div>' +
      '<div class="mtr warn"><i class="w95"></i></div>' +
      '<div class="row"><span class="t">Contributions</span><span class="meta">91 / 100</span></div>' +
      '<div class="mtr warn"><i class="w90"></i></div>' +
      '<div class="grp">Harbour district · world<span class="c">low</span></div>' +
      '<div class="row"><span class="t">Characters</span><span class="meta">6,180 / 20,000</span></div>' +
      '<div class="mtr"><i class="w30"></i></div>' +
      '<div class="note-s">Red is held back for a limit actually reached.</div>' +
      '<div class="btn pri">Compact</div>' +
      '</div>' +
      '<div class="inputbar"><span class="ico wide">Vault health</span></div>' +
      '</div></div>'
  },
  {
    num: "02",
    label: "Compaction preview",
    feas: "package",
    fx: [49, 50, 53, 60],
    caption: 'Additive sections union forever, so a compaction pass has to exist. Every removal here is justified one way only, by <b>naming another line in the same section that already says it</b>, and both lines are shown before anything is agreed to. A recall count of zero is not a reason and does not appear: on this vault the semantic lane is dead and the index rebuild failed on 14 notes, which makes zero a statement about reachability rather than worth, and deletion has no undo. For the same reason the pass is gated on index health, and repairing the index is the primary action while the index is dirty. Stored deduplication today compares a claim against the whole section as one blob, which cannot cross its threshold once the section holds real content.',
    desk: '<div class="dev"><div class="dev-desk">' +
      '<div class="side"><div class="side-title">Chats</div>' +
      '<div class="chat-row">Wren · harbour arc</div>' +
      '<div class="chat-row">Scene drafts</div>' +
      '<div class="chat-row on">Worldbuilding</div>' +
      '</div>' +
      '<div class="main">' +
      '<div class="topbar"><span class="ico">&lt;</span>COMPACTION PREVIEW<span class="ico hot">M</span></div>' +
      '<div class="rail"><span class="rt">Vault</span><span class="rt">Review</span><span class="rt">Sources</span>' +
      '<span class="rt on">Settings</span><span class="rt new">Recall</span></div>' +
      '<div class="pane">' +
      '<div class="hdr"><span class="grow">Wren · identity · 91 contributions</span><span class="sel">preview</span>' +
      '<span class="tag">nothing written yet</span></div>' +
      '<div class="row"><span class="cb on"></span><span class="t">Restates a line already in this section, and names the line it restates</span><span class="tag warn">remove</span></div>' +
      '<div class="row"><span class="cb on"></span><span class="t">Restates a line already in this section, and names the line it restates</span><span class="tag warn">remove</span></div>' +
      '<div class="row"><span class="cb on"></span><span class="t">Restates two earlier lines taken together, both shown before removal</span><span class="tag warn">remove</span></div>' +
      '<div class="row"><span class="cb"></span><span class="t">Says something no other line in the section says</span><span class="tag good">keep</span></div>' +
      '<div class="grp">After compaction<span class="c">12,880 / 20,000</span></div>' +
      '<div class="mtr"><i class="w65"></i></div>' +
      '<div class="row badrow"><span class="t">Gated on index health: the rebuild failed on 14 notes, so compaction stays blocked</span><span class="tag bad">blocked</span></div>' +
      '<div class="note-s">No removal is justified by a recall count. Zero recalls here means unreachable, not unimportant.</div>' +
      '<div class="hdr"><span class="grow"></span><span class="btn pri">Repair the index</span>' +
      '<span class="btn">Export backup</span><span class="btn">Apply compaction</span></div>' +
      '</div></div></div></div>',
    phone: '<div class="dev"><div class="dev-phone">' +
      '<div class="topbar"><span class="ico">&lt;</span>COMPACTION PREVIEW<span class="ico hot">M</span></div>' +
      '<div class="pane">' +
      '<div class="hdr"><span class="grow">Wren · identity</span><span class="sel">91 contributions</span></div>' +
      '<div class="row"><span class="cb on"></span><span class="t">Restates a line already in this section</span><span class="tag warn">remove</span></div>' +
      '<div class="row"><span class="cb on"></span><span class="t">Restates a line already in this section</span><span class="tag warn">remove</span></div>' +
      '<div class="row"><span class="cb on"></span><span class="t">Restates two earlier lines together</span><span class="tag warn">remove</span></div>' +
      '<div class="row"><span class="cb"></span><span class="t">Says something no other line says</span><span class="tag good">keep</span></div>' +
      '<div class="note-s">Tap a row to read it beside the line it restates.</div>' +
      '<div class="grp">After compaction<span class="c">12,880 / 20,000</span></div>' +
      '<div class="mtr"><i class="w65"></i></div>' +
      '<div class="row badrow"><span class="t">Blocked until the index is repaired: rebuild failed on 14 notes</span><span class="tag bad">blocked</span></div>' +
      '<div class="hdr"><span class="grow"></span><span class="btn pri">Repair the index</span><span class="btn">Backup</span></div>' +
      '</div>' +
      '<div class="inputbar"><span class="ico wide">Vault health</span></div>' +
      '</div></div>'
  },
  {
    num: "03",
    label: "Vault state in one view",
    feas: "package",
    fx: [64, 66, 65],
    caption: 'The single canonical health view: vault counts, index state, embedding availability and integrity, in one place and under one verb. The current build already fetches everything on screen here. The status response requested once on load carries the embedding flag, the dirty flag, the index errors and the build timestamp, and the integrity results sit one tab away, so this frame costs <b>a render, not a request</b>. Two of those fields are read today and the rest are dropped on the floor, which is how a vault with a dead semantic lane and a dirty index reports itself as healthy. Journey 5 links here rather than drawing these fields a second time under a second name.',
    desk: '<div class="dev"><div class="dev-desk">' +
      '<div class="side"><div class="side-title">Chats</div>' +
      '<div class="chat-row">Wren · harbour arc</div>' +
      '<div class="chat-row">Scene drafts</div>' +
      '<div class="chat-row on">Worldbuilding</div>' +
      '</div>' +
      '<div class="main">' +
      '<div class="topbar"><span class="ico">&lt;</span>VAULT HEALTH<span class="ico hot">M</span></div>' +
      '<div class="rail"><span class="rt">Vault</span><span class="rt">Review</span><span class="rt">Sources</span>' +
      '<span class="rt on">Settings</span><span class="rt new">Recall</span></div>' +
      '<div class="pane">' +
      '<div class="hdr"><span class="grow">Vault health</span><span class="tag warn">degraded</span></div>' +
      '<div class="kv"><span class="k">memories</span><span class="v">118</span></div>' +
      '<div class="kv"><span class="k">source notes, hidden by default</span><span class="v">43</span></div>' +
      '<div class="kv"><span class="k">embedded chunks</span><span class="v">0</span></div>' +
      '<div class="kv"><span class="k">index built</span><span class="v">2 Mar 09:14</span></div>' +
      '<div class="grp">Problems<span class="c">2</span></div>' +
      '<div class="row badrow"><span class="t">Embeddings unavailable: the native binding did not load, so the semantic lane is dead</span><span class="btn">Repair</span></div>' +
      '<div class="row warnrow"><span class="t">Index dirty: the rebuild failed on 14 notes and reported success anyway</span><span class="btn">Repair</span></div>' +
      '<div class="row warnrow"><span class="t">Integrity check found orphaned links</span><span class="btn">Review</span></div>' +
      '<div class="note-s">One verb for the fix, Repair, used here and referred to as Repair from journey 5.</div>' +
      '</div></div></div></div>',
    phone: '<div class="dev"><div class="dev-phone">' +
      '<div class="topbar"><span class="ico">&lt;</span>VAULT HEALTH<span class="ico hot">M</span></div>' +
      '<div class="rail"><span class="rt">Vault</span><span class="rt">Review</span><span class="rt">Sources</span>' +
      '<span class="rt on">Settings</span><span class="rt new">Recall</span></div>' +
      '<div class="pane">' +
      '<div class="hdr"><span class="grow">Vault health</span><span class="tag warn">degraded</span></div>' +
      '<div class="kv"><span class="k">memories</span><span class="v">118</span></div>' +
      '<div class="kv"><span class="k">source notes hidden</span><span class="v">43</span></div>' +
      '<div class="kv"><span class="k">embedded chunks</span><span class="v">0</span></div>' +
      '<div class="kv"><span class="k">index built</span><span class="v">2 Mar 09:14</span></div>' +
      '<div class="grp">Problems<span class="c">2</span></div>' +
      '<div class="row badrow"><span class="t">Embeddings unavailable, semantic lane dead</span><span class="btn">Repair</span></div>' +
      '<div class="row warnrow"><span class="t">Index dirty, rebuild failed on 14 notes</span><span class="btn">Repair</span></div>' +
      '<div class="row warnrow"><span class="t">Orphaned links found</span><span class="btn">Review</span></div>' +
      '<div class="note-s">Every field here is already fetched on load and then discarded.</div>' +
      '</div>' +
      '<div class="inputbar"><span class="ico wide">Back to settings</span></div>' +
      '</div></div>'
  }
];

FLOWS.j6 = [
  { n: "01", t: "See pressure", d: "three meters, one gradient, no wall" },
  { n: "02", t: "Preview compaction", d: "each removal names the line it restates" },
  { n: "03", t: "Read vault state", d: "counts, index, embeddings, integrity", term: true }
];

TRADE.j6 = {
  win: [
    "Cap pressure is visible while there is still room to act on it.",
    "A compaction removal is auditable: the line that makes it redundant is on screen.",
    "One health view under one verb, so journey 5 links instead of repeating.",
    "A degraded vault stops reporting itself as healthy."
  ],
  cost: [
    "A fourth meter on a crowded settings tab, and three amber bars that never turn red on this vault.",
    "Compaction is destructive with no undo, so it stays behind a backup and a gate.",
    "Gating on index health means a dirty index blocks a pass someone came to run.",
    "Splitting identity by claim kind is deferred, so the one-cap problem stays visible but unfixed."
  ],
  build: [
    "All three caps are already enforced at write time, so the numbers exist and only need rendering.",
    "Restatement detection needs a per-line comparison, not the whole-section blob compare used today.",
    "The status payload already carries the embedding flag, the dirty flag, the errors and the timestamp.",
    "Integrity results are one existing tab away, so the health view costs a render rather than a request."
  ]
};
