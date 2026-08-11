STATES.j6 = [
  {
    num: "01",
    label: "Cap pressure as a gradient",
    feas: "package",
    fx: [48, 45, 54],
    caption: 'Three pressures on one note, and the package already computes all three at write time: characters, keywords and contributions. This is the Maintenance surface, so it says <i>notes</i> where the vault says <i>memories</i>; the product splits its own vocabulary that way and we match the surface rather than smoothing it over. The amber stays uniform on purpose, and a low-pressure note sits below it so the screen reads as a gradient rather than a wall. <b>Nothing on this vault has reached a limit</b>, so nothing takes the failure colour; red waits for a limit something actually hits. The product has no word for approaching a cap, only for the cap itself, so these frames extend its <i>Limits</i> vocabulary. Today the build renders none of the three and truncates section text at the cap in silence, which makes the first sign of a full note an apply that fails partway through a batch. Splitting identity into separate section keys means a schema change, so the frame marks it rather than offering it as one click.',
    desk: '<div class="dev"><div class="dev-desk">' +
      '<div class="side"><div class="side-title">Chats</div><div class="chat-row on">Wren · conversation</div><div class="chat-row">Wren · roleplay</div><div class="chat-row">Harbour district</div><div class="chat-row">Notes to self</div></div>' +
      '<div class="main">' +
      '<div class="topbar"><span class="ico">&lt;</span>MEMORY SETTINGS · MAINTENANCE<span class="ico hot">M</span></div>' +
      '<div class="rail"><span class="rt">Memory Vault</span><span class="rt">Review Queue</span><span class="rt">Sources</span>' +
      '<span class="rt on">Memory Settings</span><span class="rt new">Recall History</span></div>' +
      '<div class="pane">' +
      '<div class="hdr"><span class="grow">Notes under pressure</span><span class="sel">least headroom first</span>' +
      '<span class="tag warn">none at a limit yet</span></div>' +
      '<div class="grp">Wren · Character<span class="c">identity section</span></div>' +
      '<div class="row"><span class="t">Section characters</span><span class="meta">19,240 / 20,000</span></div>' +
      '<div class="mtr warn"><i class="w96"></i></div>' +
      '<div class="row"><span class="t">Keywords</span><span class="meta">28 / 30</span></div>' +
      '<div class="mtr warn"><i class="w95"></i></div>' +
      '<div class="row"><span class="t">Contributions</span><span class="meta">91 / 100</span></div>' +
      '<div class="mtr warn"><i class="w90"></i></div>' +
      '<div class="grp">Harbour district · World<span class="c">room to grow</span></div>' +
      '<div class="row"><span class="t">Section characters</span><span class="meta">6,180 / 20,000</span></div>' +
      '<div class="mtr"><i class="w30"></i></div>' +
      '<div class="note-s">Identity holds traits, changes, dispositions, backstory and events against one cap.</div>' +
      '<div class="hdr"><span class="grow"></span><span class="btn pri">Merge restated lines</span><span class="btn">Split by claim kind</span></div>' +
      '</div></div></div></div>',
    phone: '<div class="dev"><div class="dev-phone">' +
      '<div class="topbar"><span class="ico">&lt;</span>NOTES UNDER PRESSURE<span class="ico hot">M</span></div>' +
      '<div class="rail"><span class="rt">Memories</span><span class="rt">Review</span><span class="rt">Sources</span>' +
      '<span class="rt on">Settings</span><span class="rt new">Recall</span></div>' +
      '<div class="pane">' +
      '<div class="hdr"><span class="grow">Least headroom first</span><span class="tag warn">none at a limit</span></div>' +
      '<div class="grp">Wren · identity<span class="c">3 limits</span></div>' +
      '<div class="row"><span class="t">Section characters</span><span class="meta">19,240 / 20,000</span></div>' +
      '<div class="mtr warn"><i class="w96"></i></div>' +
      '<div class="row"><span class="t">Keywords</span><span class="meta">28 / 30</span></div>' +
      '<div class="mtr warn"><i class="w95"></i></div>' +
      '<div class="row"><span class="t">Contributions</span><span class="meta">91 / 100</span></div>' +
      '<div class="mtr warn"><i class="w90"></i></div>' +
      '<div class="grp">Harbour district · World<span class="c">low</span></div>' +
      '<div class="row"><span class="t">Section characters</span><span class="meta">6,180 / 20,000</span></div>' +
      '<div class="mtr"><i class="w30"></i></div>' +
      '<div class="note-s">Red is held back for a limit actually reached.</div>' +
      '<div class="btn pri">Merge restated lines</div>' +
      '</div>' +
      '<div class="inputbar"><span class="ico wide">Vault health</span></div>' +
      '</div></div>'
  },
  {
    num: "02",
    label: "Compaction preview",
    feas: "package",
    fx: [49, 50, 53, 60],
    caption: 'Additive sections union forever, so something has to compact them. The product ships no maintenance action that compacts and no verb for one, so this frame draws the pass as a Vault Maintenance action called <b>Merge restated lines</b>, previews it the way the product previews its other destructive work, and applies it through <b>Run selected maintenance</b>. Every removal justifies itself one way only, by <b>naming another line in the same section that already says it</b>, and the frame shows both lines before you agree to anything. A recall count of zero never counts as a reason: this vault\'s semantic lane is dead and its index rebuild failed on 14 notes, so zero describes reachability rather than worth, and deletion has no undo behind it. For the same reason index health gates the pass, and Reindex recall data takes the primary slot while the index stays dirty. Today stored deduplication compares a claim against the whole section as one blob, which cannot cross its threshold once the section holds real content.',
    desk: '<div class="dev"><div class="dev-desk">' +
      '<div class="side"><div class="side-title">Chats</div><div class="chat-row on">Wren · conversation</div><div class="chat-row">Wren · roleplay</div><div class="chat-row">Harbour district</div><div class="chat-row">Notes to self</div></div>' +
      '<div class="main">' +
      '<div class="topbar"><span class="ico">&lt;</span>MERGE RESTATED LINES · PREVIEW<span class="ico hot">M</span></div>' +
      '<div class="rail"><span class="rt">Memory Vault</span><span class="rt">Review Queue</span><span class="rt">Sources</span>' +
      '<span class="rt on">Memory Settings</span><span class="rt new">Recall History</span></div>' +
      '<div class="pane">' +
      '<div class="hdr"><span class="grow">Wren · identity · 91 contributions</span><span class="sel">preview</span>' +
      '<span class="tag">nothing written yet</span></div>' +
      '<div class="row"><span class="cb on"></span><span class="t">Restates a line already in this section</span><span class="tag warn">remove</span></div>' +
      '<div class="row"><span class="cb on"></span><span class="t">Restates a line already in this section</span><span class="tag warn">remove</span></div>' +
      '<div class="row"><span class="cb on"></span><span class="t">Restates two earlier lines together</span><span class="tag warn">remove</span></div>' +
      '<div class="row"><span class="cb"></span><span class="t">Says something no other line in the section says</span><span class="tag good">keep</span></div>' +
      '<div class="note-s">Each removal names the line it restates, and both are shown before it is agreed to.</div>' +
      '<div class="grp">After the merge<span class="c">12,880 / 20,000</span></div>' +
      '<div class="mtr"><i class="w65"></i></div>' +
      '<div class="row badrow"><span class="t">Blocked: index rebuild failed on 14 notes</span><span class="tag bad">blocked</span></div>' +
      '<div class="note-s">No removal is justified by a recall count.</div>' +
      '<div class="hdr"><span class="grow"></span><span class="btn pri">Reindex recall data</span>' +
      '<span class="btn">Export backup</span><span class="btn">Run selected maintenance</span></div>' +
      '</div></div></div></div>',
    phone: '<div class="dev"><div class="dev-phone">' +
      '<div class="topbar"><span class="ico">&lt;</span>MERGE RESTATED LINES<span class="ico hot">M</span></div>' +
      '<div class="pane">' +
      '<div class="hdr"><span class="grow">Wren · identity</span><span class="sel">91 contributions</span></div>' +
      '<div class="row"><span class="cb on"></span><span class="t">Restates a line already in this section</span><span class="tag warn">remove</span></div>' +
      '<div class="row"><span class="cb on"></span><span class="t">Restates a line already in this section</span><span class="tag warn">remove</span></div>' +
      '<div class="row"><span class="cb on"></span><span class="t">Restates two earlier lines together</span><span class="tag warn">remove</span></div>' +
      '<div class="row"><span class="cb"></span><span class="t">Says something no other line says</span><span class="tag good">keep</span></div>' +
      '<div class="note-s">Tap a row to read it beside the line it restates.</div>' +
      '<div class="grp">After the merge<span class="c">12,880 / 20,000</span></div>' +
      '<div class="mtr"><i class="w65"></i></div>' +
      '<div class="row badrow"><span class="t">Blocked: index rebuild failed on 14 notes</span><span class="tag bad">blocked</span></div>' +
      '<div class="hdr"><span class="grow"></span><span class="btn pri">Reindex recall data</span><span class="btn">Export backup</span></div>' +
      '</div>' +
      '<div class="inputbar"><span class="ico wide">Vault health</span></div>' +
      '</div></div>'
  },
  {
    num: "03",
    label: "Vault state in one view",
    feas: "package",
    fx: [64, 66, 65],
    caption: 'One canonical health view: vault counts, index state, embedding availability and integrity, in one place under one action name. The current build already fetches everything on this screen. The status response it requests once on load carries the embedding flag, the dirty flag, the index errors and the build timestamp, and the integrity results sit one tab away, so this frame costs <b>a render, not a request</b>. The state word is the product\'s own index-health label, <b>Vault degraded</b>. Today the client reads two of those fields and drops the rest on the floor, which is how a vault with a dead semantic lane and a dirty index reports itself as healthy. Journey 5 links here instead of drawing these fields a second time under a second name.',
    desk: '<div class="dev"><div class="dev-desk">' +
      '<div class="side"><div class="side-title">Chats</div><div class="chat-row on">Wren · conversation</div><div class="chat-row">Wren · roleplay</div><div class="chat-row">Harbour district</div><div class="chat-row">Notes to self</div></div>' +
      '<div class="main">' +
      '<div class="topbar"><span class="ico">&lt;</span>VAULT HEALTH<span class="ico hot">M</span></div>' +
      '<div class="rail"><span class="rt">Memory Vault</span><span class="rt">Review Queue</span><span class="rt">Sources</span>' +
      '<span class="rt on">Memory Settings</span><span class="rt new">Recall History</span></div>' +
      '<div class="pane">' +
      '<div class="hdr"><span class="grow">Vault health</span><span class="tag warn">Vault degraded</span></div>' +
      '<div class="kv"><span class="k">Memories</span><span class="v">118</span></div>' +
      '<div class="kv"><span class="k">Source notes, hidden by default</span><span class="v">43</span></div>' +
      '<div class="kv"><span class="k">Embedded chunks</span><span class="v">0</span></div>' +
      '<div class="kv"><span class="k">Index built</span><span class="v">2 Mar 09:14</span></div>' +
      '<div class="grp">Integrity issues found<span class="c">2</span></div>' +
      '<div class="row badrow"><span class="t">Embeddings unavailable · semantic lane dead</span><span class="btn">Details</span></div>' +
      '<div class="row warnrow"><span class="t">Index rebuild failed on 14 notes</span><span class="btn">Reindex recall data</span></div>' +
      '<div class="row warnrow"><span class="t">Orphaned links</span><span class="btn">Details</span></div>' +
      '<div class="note-s">One action name for the index fix, Reindex recall data, used here and in journey 5.</div>' +
      '</div></div></div></div>',
    phone: '<div class="dev"><div class="dev-phone">' +
      '<div class="topbar"><span class="ico">&lt;</span>VAULT HEALTH<span class="ico hot">M</span></div>' +
      '<div class="rail"><span class="rt">Memories</span><span class="rt">Review</span><span class="rt">Sources</span>' +
      '<span class="rt on">Settings</span><span class="rt new">Recall</span></div>' +
      '<div class="pane">' +
      '<div class="hdr"><span class="grow">Vault health</span><span class="tag warn">Vault degraded</span></div>' +
      '<div class="kv"><span class="k">Memories</span><span class="v">118</span></div>' +
      '<div class="kv"><span class="k">Source notes hidden</span><span class="v">43</span></div>' +
      '<div class="kv"><span class="k">Embedded chunks</span><span class="v">0</span></div>' +
      '<div class="kv"><span class="k">Index built</span><span class="v">2 Mar 09:14</span></div>' +
      '<div class="grp">Integrity issues found<span class="c">2</span></div>' +
      '<div class="row badrow"><span class="t">Embeddings unavailable</span><span class="btn">Details</span></div>' +
      '<div class="row warnrow"><span class="t">Index rebuild failed on 14 notes</span><span class="btn">Reindex</span></div>' +
      '<div class="row warnrow"><span class="t">Orphaned links</span><span class="btn">Details</span></div>' +
      '<div class="note-s">Every field here is already fetched on load and then discarded.</div>' +
      '</div>' +
      '<div class="inputbar"><span class="ico wide">Back to Memory Settings</span></div>' +
      '</div></div>'
  }
];

FLOWS.j6 = [
  { n: "01", t: "See pressure", d: "three meters, one gradient, no wall" },
  { n: "02", t: "Preview the merge", d: "each removal names the line it restates" },
  { n: "03", t: "Read vault state", d: "counts, index, embeddings, integrity", term: true }
];

TRADE.j6 = {
  win: [
    "Cap pressure is visible while there is still room to act on it.",
    "A compaction removal is auditable: the line that makes it redundant is on screen.",
    "One health view under one action name, so journey 5 links instead of repeating.",
    "A degraded vault stops reporting itself as healthy."
  ],
  cost: [
    "A fourth meter on a crowded settings tab, and three amber bars that never turn red on this vault.",
    "Merge restated lines is destructive with no undo, so it stays behind a backup and a gate.",
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
