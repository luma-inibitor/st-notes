STATES.j5 = [
  {
    num: "01",
    label: "This turn, with reasons",
    feas: "package",
    fx: [7, 10, 11, 8],
    caption: 'The drawer shows the recall record for the turn that just ran, and opening it from Chat Settings keeps the conversation on screen beside it. It reports <b>3 injected and 11 rejected</b>, splits the eleven across the three reasons the budget pass already computes, and stamps a time and a turn reference on them. Two of those reasons carry the product\'s own rejection labels, Budget and Score threshold. The third is mode ineligibility, which the budget pass computes but never labels, so the panel borrows the memory field it comes from, Available modes. The package writes a record on every turn, including turns that inject nothing. Today the build prints one last-injection count per chat that keeps showing an old number when the newest turn injected nothing, so five different recall outcomes read as the same absence. This report cannot sit inside the transcript: conversation mounts key off a package kind this package lacks, and a fixed allowlist strips capability elements out of message HTML.',
    desk: '<div class="dev"><div class="dev-desk drawer">' +
      '<div class="side"><div class="side-title">Chats</div><div class="chat-row on">Wren · conversation</div><div class="chat-row">Wren · roleplay</div><div class="chat-row">Harbour district</div><div class="chat-row">Notes to self</div></div>' +
      '<div class="main">' +
      '<div class="topbar"><span class="ico">&lt;</span>WREN · HARBOUR ARC<span class="ico hot">M</span></div>' +
      '<div class="msgs">' +
      '<div class="msg"><div class="av"></div><div class="bd"><div class="who">You</div>' +
      '<div class="tx">What did Wren decide about the harbour job?</div></div></div>' +
      '<div class="msg"><div class="av"></div><div class="bd"><div class="who">Assistant</div>' +
      '<div class="tx">She has not mentioned the harbour to me before.</div>' +
      '<div class="bar-line"></div></div></div>' +
      '</div>' +
      '<div class="inputbar"><span class="ico wide">Message</span><span class="btn">Send</span></div>' +
      '</div>' +
      '<div class="drawer">' +
      '<div class="drawer-head"><span class="ico hot">M</span>Latest recall workflow</div>' +
      '<div class="drawer-body">' +
      '<div class="kv"><span class="k">Turn</span><span class="v">t214 · 14:41</span></div>' +
      '<div class="kv"><span class="k">Injected</span><span class="v">3</span></div>' +
      '<div class="grp">Rejected<span class="c">11</span></div>' +
      '<div class="row"><span class="t">Budget</span><span class="meta">2</span></div>' +
      '<div class="row"><span class="t">Score threshold</span><span class="meta">6</span></div>' +
      '<div class="row"><span class="t">Available modes</span><span class="meta">3</span></div>' +
      '<div class="btn">Open diagnostics</div>' +
      '</div></div>' +
      '</div></div>',
    phone: '<div class="dev"><div class="dev-phone">' +
      '<div class="topbar"><span class="ico">&lt;</span>RECALL WORKFLOW<span class="ico hot">M</span></div>' +
      '<div class="pane">' +
      '<div class="hdr"><span class="grow">Wren · harbour arc</span><span class="sel">t214 · 14:41</span></div>' +
      '<div class="grp">3 memories injected<span class="c">11 rejected</span></div>' +
      '<div class="row on"><span class="t">Wren distrusts the dockmaster</span><span class="tag acc">injected</span></div>' +
      '<div class="row on"><span class="t">Harbour district curfew</span><span class="tag acc">injected</span></div>' +
      '<div class="row on"><span class="t">Wren owes Sable a favour</span><span class="tag acc">injected</span></div>' +
      '<div class="grp">Rejected<span class="c">11</span></div>' +
      '<div class="row"><span class="t">Budget</span><span class="meta">2</span></div>' +
      '<div class="row"><span class="t">Score threshold</span><span class="meta">6</span></div>' +
      '<div class="row"><span class="t">Available modes</span><span class="meta">3</span></div>' +
      '<div class="note-s">The 3 are available in Roleplay only.</div>' +
      '<div class="btn">Open diagnostics</div>' +
      '</div>' +
      '<div class="inputbar"><span class="ico wide">Back to chat</span></div>' +
      '</div></div>'
  },
  {
    num: "02",
    label: "Assembled, then discarded",
    feas: "engine",
    fx: [6, 7, 10],
    caption: 'The same turn, on an install where a prompt-assembling preset owns placement and carries no memory section. Recall selected three memories and assembled them, and then <b>the preset threw all three away</b> before the send, because the prompt it built had no memory slot. The eleven the budget pass rejected earlier never mattered. Only engine code can write this record: the preset discards inside the engine\'s own prompt assembly, and nothing there writes anything down today. This is the single most important negative state in the document. Without this line, the turn looks exactly like memory having nothing to say, which is the reading the current build gives it.',
    desk: '<div class="dev"><div class="dev-desk drawer">' +
      '<div class="side"><div class="side-title">Chats</div><div class="chat-row on">Wren · conversation</div><div class="chat-row">Wren · roleplay</div><div class="chat-row">Harbour district</div><div class="chat-row">Notes to self</div></div>' +
      '<div class="main">' +
      '<div class="topbar"><span class="ico">&lt;</span>WREN · HARBOUR ARC<span class="ico hot">M</span></div>' +
      '<div class="msgs">' +
      '<div class="msg"><div class="av"></div><div class="bd"><div class="who">You</div>' +
      '<div class="tx">What did Wren decide about the harbour job?</div></div></div>' +
      '<div class="msg"><div class="av"></div><div class="bd"><div class="who">Assistant</div>' +
      '<div class="tx">She has not mentioned the harbour to me before.</div>' +
      '<div class="bar-line"></div></div></div>' +
      '</div>' +
      '<div class="inputbar"><span class="ico wide">Message</span><span class="btn">Send</span></div>' +
      '</div>' +
      '<div class="drawer">' +
      '<div class="drawer-head"><span class="ico hot">M</span>Latest recall workflow</div>' +
      '<div class="drawer-body">' +
      '<div class="kv"><span class="k">Turn</span><span class="v">t214 · 14:41</span></div>' +
      '<div class="kv"><span class="k">Selected</span><span class="v">3</span></div>' +
      '<div class="kv"><span class="k">Assembled</span><span class="v">3</span></div>' +
      '<div class="kv"><span class="k">Injected</span><span class="v">0</span></div>' +
      '<div class="row badrow"><span class="t">Discarded at assembly</span><span class="meta">3</span></div>' +
      '<div class="row"><span class="t">Rejected in recall</span><span class="meta">11</span></div>' +
      '<div class="btn">Open diagnostics</div>' +
      '</div></div>' +
      '</div></div>',
    phone: '<div class="dev"><div class="dev-phone">' +
      '<div class="topbar"><span class="ico">&lt;</span>RECALL WORKFLOW<span class="ico hot">M</span></div>' +
      '<div class="pane">' +
      '<div class="hdr"><span class="grow">Wren · harbour arc</span><span class="sel">t214 · 14:41</span></div>' +
      '<div class="grp">No memories injected<span class="c">0 of 3</span></div>' +
      '<div class="row badrow"><span class="t">Discarded at assembly: the preset had no memory slot</span><span class="meta">3</span></div>' +
      '<div class="kv"><span class="k">Selected</span><span class="v">3</span></div>' +
      '<div class="kv"><span class="k">Assembled</span><span class="v">3</span></div>' +
      '<div class="kv"><span class="k">Injected</span><span class="v">0</span></div>' +
      '<div class="grp">Rejected in recall<span class="c">11</span></div>' +
      '<div class="row"><span class="t">Budget</span><span class="meta">2</span></div>' +
      '<div class="row"><span class="t">Score threshold</span><span class="meta">6</span></div>' +
      '<div class="row"><span class="t">Available modes</span><span class="meta">3</span></div>' +
      '<div class="btn">Open diagnostics</div>' +
      '</div>' +
      '<div class="inputbar"><span class="ico wide">Back to chat</span></div>' +
      '</div></div>'
  },
  {
    num: "03",
    label: "Recall history",
    feas: "restart",
    fx: [12, 13, 11, 7],
    caption: 'The package appends a record per turn instead of overwriting one per chat, and a Recall History tab <b>added</b> to the workspace rail reads them, rather than taking a seat from Memory Vault, Review Queue, Sources or Memory Settings. The product ships one readout for the most recent recall and no plural noun for a run of them, so this tab extends <i>recall workflow</i> into a history. The gap at <b>t212</b> gets a row of its own reading "no record written", because an unexplained gap looks exactly like the silent injection failure this history exists to catch. Two rows carry known weaknesses: timeline events that arrived with no sequence, and ranking that ran age-blind, since nothing passes the cooldown option and no lane scores recency. Reading the history needs a new route.',
    desk: '<div class="dev"><div class="dev-desk">' +
      '<div class="side"><div class="side-title">Chats</div><div class="chat-row on">Wren · conversation</div><div class="chat-row">Wren · roleplay</div><div class="chat-row">Harbour district</div><div class="chat-row">Notes to self</div></div>' +
      '<div class="main">' +
      '<div class="topbar"><span class="ico">&lt;</span>LONG-TERM MEMORY<span class="ico hot">M</span></div>' +
      '<div class="rail"><span class="rt">Memory Vault</span><span class="rt">Review Queue</span><span class="rt">Sources</span>' +
      '<span class="rt">Memory Settings</span><span class="rt new on">Recall History<span class="b">t214</span></span></div>' +
      '<div class="pane">' +
      '<div class="hdr"><span class="grow">Recall history</span><span class="sel">Current chat</span><span class="sel">last 20 turns</span></div>' +
      '<div class="row badrow on"><span class="meta">t214</span><span class="t">3 injected · 11 rejected</span><span class="tag bad">discarded at assembly</span></div>' +
      '<div class="row"><span class="meta">t213</span><span class="t">2 injected · 4 rejected</span><span class="tag good">reached the model</span></div>' +
      '<div class="row warnrow"><span class="meta">t212</span><span class="t">no record written</span><span class="tag warn">unknown</span></div>' +
      '<div class="row"><span class="meta">t211</span><span class="t">5 injected · 1 rejected</span><span class="tag warn">no chronological order</span></div>' +
      '<div class="row"><span class="meta">t208</span><span class="t">0 injected · 0 candidates</span></div>' +
      '<div class="grp">t211 · Timeline Events in relevance order<span class="c">Details</span></div>' +
      '<div class="note-s">Every row ranked age-blind.</div>' +
      '</div></div></div></div>',
    phone: '<div class="dev"><div class="dev-phone">' +
      '<div class="topbar"><span class="ico">&lt;</span>RECALL HISTORY<span class="ico hot">M</span></div>' +
      '<div class="rail"><span class="rt">Memories</span><span class="rt">Review</span><span class="rt">Sources</span>' +
      '<span class="rt">Settings</span><span class="rt new on">Recall<span class="b">t214</span></span></div>' +
      '<div class="pane">' +
      '<div class="hdr"><span class="grow">Wren · harbour arc</span><span class="sel">last 20</span></div>' +
      '<div class="row badrow on"><span class="meta">t214</span><span class="t">3 injected · 11 rejected</span><span class="tag bad">discarded</span></div>' +
      '<div class="row"><span class="meta">t213</span><span class="t">2 injected · 4 rejected</span><span class="tag good">injected</span></div>' +
      '<div class="row warnrow"><span class="meta">t212</span><span class="t">no record written</span><span class="tag warn">unknown</span></div>' +
      '<div class="row"><span class="meta">t211</span><span class="t">5 injected · 1 rejected</span><span class="tag warn">no order</span></div>' +
      '<div class="row"><span class="meta">t208</span><span class="t">0 injected · 0 candidates</span></div>' +
      '<div class="note-s">A gap is a row, not a blank.</div>' +
      '<div class="btn">Open diagnostics</div>' +
      '</div>' +
      '<div class="inputbar"><span class="ico wide">Back to chat</span></div>' +
      '</div></div>'
  },
  {
    num: "04",
    label: "Diagnose one memory",
    feas: "package",
    fx: [8, 15, 16, 65],
    caption: 'The path from a turn to a memory to a reason. Recall passed over "Wren distrusts the dockmaster" on t214, and the frame walks down three causes in order: the import left it available in Roleplay only, the index rebuild failed on the 14 notes that include it, and the semantic lane is dead because the rebuild reported success after embedding nothing. One shipped maintenance action fixes the second, and both this journey and journey 6 call it by its label, <b>Reindex recall data</b>. Journey 6 draws the vault-wide state once and this frame <b>links to it rather than repeating it</b>. Today these three facts sit in three separate components with no path between them, and a memory can save successfully and stay invisible to recall without a word on screen.',
    desk: '<div class="dev"><div class="dev-desk">' +
      '<div class="side"><div class="side-title">Chats</div><div class="chat-row on">Wren · conversation</div><div class="chat-row">Wren · roleplay</div><div class="chat-row">Harbour district</div><div class="chat-row">Notes to self</div></div>' +
      '<div class="main">' +
      '<div class="topbar"><span class="ico">&lt;</span>DIAGNOSTICS<span class="ico hot">M</span></div>' +
      '<div class="rail"><span class="rt">Memory Vault</span><span class="rt">Review Queue</span><span class="rt">Sources</span>' +
      '<span class="rt">Memory Settings</span><span class="rt new on">Recall History</span></div>' +
      '<div class="pane split">' +
      '<div class="facets">' +
      '<div class="fgroup">Turn</div>' +
      '<div class="fac on">t214<span class="c">14</span></div>' +
      '<div class="fac">t213<span class="c">6</span></div>' +
      '<div class="fgroup">Rejected</div>' +
      '<div class="fac">Score threshold<span class="c">6</span></div>' +
      '<div class="fac on">Available modes<span class="c">3</span></div>' +
      '</div>' +
      '<div class="listcol">' +
      '<div class="hdr"><span class="grow">Why this memory was not recalled</span><span class="sel">t214</span></div>' +
      '<div class="grp">Wren distrusts the dockmaster<span class="c">recalled 21 times, last 2 Mar</span></div>' +
      '<div class="row warnrow"><span class="t">Available modes: Roleplay only, and this chat is Conversation</span><span class="btn">Set modes</span></div>' +
      '<div class="row warnrow"><span class="t">Index rebuild failed on 14 notes, including this one</span><span class="btn">Reindex recall data</span></div>' +
      '<div class="row badrow"><span class="t">Semantic lane dead · 0 embedded chunks</span><span class="btn">Vault health</span></div>' +
      '<div class="row"><span class="t">Rejected candidates from the last run</span><span class="meta">304 of 1,142</span></div>' +
      '<div class="note-s">Vault-wide state is rendered once, in Memory Settings.</div>' +
      '</div></div></div></div></div>',
    phone: '<div class="dev"><div class="dev-phone">' +
      '<div class="topbar"><span class="ico">&lt;</span>DIAGNOSTICS<span class="ico hot">M</span></div>' +
      '<div class="pane">' +
      '<div class="hdr"><span class="grow">Not recalled on t214</span><span class="sel">t214</span></div>' +
      '<div class="grp">Wren distrusts the dockmaster<span class="c">21 recalls</span></div>' +
      '<div class="row warnrow"><span class="t">Available modes: Roleplay only</span><span class="btn">Set modes</span></div>' +
      '<div class="row warnrow"><span class="t">Index rebuild failed on 14 notes</span><span class="btn">Reindex recall data</span></div>' +
      '<div class="row badrow"><span class="t">Semantic lane dead · 0 embedded chunks</span><span class="btn">Vault health</span></div>' +
      '<div class="row"><span class="t">Rejected candidates, last run</span><span class="meta">304 of 1,142</span></div>' +
      '<div class="hdr"><span class="grow">Vault state is drawn once</span><span class="btn">Vault health</span></div>' +
      '</div>' +
      '<div class="inputbar"><span class="ico wide">Back to recall history</span></div>' +
      '</div></div>'
  },
  {
    num: "05",
    label: "A 403 that names the fix",
    feas: "package",
    fx: [63],
    caption: 'A permissions failure that names its own remedy. This install demands an admin secret for memory routes, and the engine already ships copy naming both ways out, so nobody has to write anything new here. The views simply never reach it: Memory Vault, Review Queue, Sources and Memory Settings all took a 403, and all four printed <b>the same generic loading string</b> without reading the response status, so an authentication problem with a documented fix surfaces as "Memories could not load." One failure per screen. A projection-limit error belongs with the memory that overflowed and cannot co-occur with a 403 that stopped every read.',
    desk: '<div class="dev"><div class="dev-desk">' +
      '<div class="side"><div class="side-title">Chats</div><div class="chat-row on">Wren · conversation</div><div class="chat-row">Wren · roleplay</div><div class="chat-row">Harbour district</div><div class="chat-row">Notes to self</div></div>' +
      '<div class="main">' +
      '<div class="topbar"><span class="ico">&lt;</span>LONG-TERM MEMORY<span class="ico hot">M</span></div>' +
      '<div class="rail"><span class="rt">Memory Vault</span><span class="rt">Review Queue</span><span class="rt">Sources</span>' +
      '<span class="rt on">Memory Settings</span><span class="rt new">Recall History</span></div>' +
      '<div class="pane">' +
      '<div class="hdr"><span class="grow">Memory Settings</span><span class="tag bad">403</span></div>' +
      '<div class="empty">This install requires an admin secret for memory routes.</div>' +
      '<div class="grp">Two ways to get in<span class="c">either works</span></div>' +
      '<div class="row"><span class="t">Set ADMIN_SECRET in the server environment, then reload</span></div>' +
      '<div class="row"><span class="t">Or open the workspace from the local machine, where privileged routes are allowed</span></div>' +
      '<div class="hdr"><span class="grow"></span><span class="fld ph">admin secret</span><span class="btn pri">Save</span><span class="btn">How to set it</span></div>' +
      '<div class="note-s">The engine already ships this copy.</div>' +
      '<div class="row"><span class="t">All four panes returned 403</span><span class="meta">Memories could not load.</span></div>' +
      '</div></div></div></div>',
    phone: '<div class="dev"><div class="dev-phone">' +
      '<div class="topbar"><span class="ico">&lt;</span>MEMORY SETTINGS<span class="ico hot">M</span></div>' +
      '<div class="rail"><span class="rt">Memories</span><span class="rt">Review</span><span class="rt">Sources</span>' +
      '<span class="rt on">Settings</span><span class="rt new">Recall</span></div>' +
      '<div class="pane">' +
      '<div class="hdr"><span class="grow">Memories could not load.</span><span class="tag bad">403</span></div>' +
      '<div class="empty">This install requires an admin secret for memory routes.</div>' +
      '<div class="row"><span class="t">Set ADMIN_SECRET in the server environment, then reload</span></div>' +
      '<div class="row"><span class="t">Or open from the local machine</span></div>' +
      '<div class="hdr"><span class="grow"></span><span class="fld ph">admin secret</span><span class="btn pri">Save</span></div>' +
      '<div class="btn">How to set it</div>' +
      '</div>' +
      '<div class="inputbar"><span class="ico wide">Back to chat</span></div>' +
      '</div></div>'
  }
];

FLOWS.j5 = [
  { n: "01", t: "Check this turn", d: "open the memory drawer beside the message" },
  { n: "02", t: "See the discard", d: "selected, assembled, never injected" },
  { n: "03", t: "Scroll back", d: "one record per turn, gaps named" },
  { n: "04", t: "Diagnose one memory", d: "turn, memory, reason" },
  { n: "05", t: "Act on the cause", d: "set modes, reindex, or supply the secret", term: true }
];

TRADE.j5 = {
  win: [
    "The five outcomes that all look like silence today become five different readings.",
    "A turn where the preset threw the injection away stops looking like a turn with nothing to recall.",
    "A gap in the history is labelled, so absence of a record is never read as absence of a problem.",
    "A 403 arrives naming its own remedy instead of as Memories could not load."
  ],
  cost: [
    "Per-turn records are storage that grows with the conversation and need a retention rule.",
    "The Recall History tab is a fifth destination in a rail that already holds four.",
    "The history is polled, so it lags the turn by one refresh interval.",
    "The most valuable frame in the set is the one the package cannot ship alone."
  ],
  build: [
    "State 02 needs an engine change: the discard record can only be written where the prompt is assembled.",
    "The recall history read is a new route, so it lands at a release boundary.",
    "The rejection counts already exist in the budget pass and are computed then dropped.",
    "Index and embedding state is rendered once in journey 6 and linked from state 04."
  ]
};
