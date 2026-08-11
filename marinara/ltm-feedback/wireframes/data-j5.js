STATES.j5 = [
  {
    num: "01",
    label: "This turn, with reasons",
    feas: "package",
    fx: [7, 10, 11, 8],
    caption: 'The recall receipt for the turn that just ran, opened from the chat settings drawer so the conversation stays on screen beside it. <b>3 used and 11 dropped</b>, broken into the three reasons the budget pass already computes, stamped with a time and a turn reference. The current build prints one last-injection count per chat that keeps showing an old number when the newest turn injected nothing, so five different recall outcomes all read as the same absence. The report cannot sit inside the transcript: conversation mounts are gated on a package kind this package lacks, and message HTML is sanitised through a fixed allowlist.',
    desk: '<div class="dev"><div class="dev-desk drawer">' +
      '<div class="side"><div class="side-title">Chats</div>' +
      '<div class="chat-row on">Wren · harbour arc</div>' +
      '<div class="chat-row">Scene drafts</div>' +
      '<div class="chat-row">Worldbuilding</div>' +
      '<div class="chat-row">Notes to self</div></div>' +
      '<div class="main">' +
      '<div class="topbar"><span class="ico">&lt;</span>WREN · HARBOUR ARC<span class="ico hot">M</span><span class="ico">S</span></div>' +
      '<div class="msgs">' +
      '<div class="msg"><div class="av"></div><div class="bd"><div class="who">You</div>' +
      '<div class="tx">What did Wren decide about the harbour job?</div></div></div>' +
      '<div class="msg"><div class="av"></div><div class="bd"><div class="who">Assistant</div>' +
      '<div class="tx">She has not mentioned the harbour to me before.</div>' +
      '<div class="bar-line"></div><div class="bar-line"></div></div></div>' +
      '</div>' +
      '<div class="inputbar"><span class="ico wide">Message</span><span class="btn">Send</span></div>' +
      '</div>' +
      '<div class="drawer">' +
      '<div class="drawer-head"><span class="ico hot">M</span>This turn</div>' +
      '<div class="drawer-body">' +
      '<div class="kv"><span class="k">turn</span><span class="v">t214 · 14:41</span></div>' +
      '<div class="grp">3 used<span class="c">11 dropped</span></div>' +
      '<div class="row"><span class="t">Over the token budget</span><span class="meta">2</span></div>' +
      '<div class="row"><span class="t">Below the score threshold</span><span class="meta">6</span></div>' +
      '<div class="row"><span class="t">Not enabled for this chat mode</span><span class="meta">3</span></div>' +
      '<div class="note-s">A receipt is written on every turn, including turns that inject nothing.</div>' +
      '<div class="btn">Open diagnostics</div>' +
      '</div></div>' +
      '</div></div>',
    phone: '<div class="dev"><div class="dev-phone">' +
      '<div class="topbar"><span class="ico">&lt;</span>MEMORY · THIS TURN<span class="ico hot">M</span></div>' +
      '<div class="pane">' +
      '<div class="hdr"><span class="grow">Wren · harbour arc</span><span class="sel">t214 · 14:41</span></div>' +
      '<div class="grp">3 used<span class="c">11 dropped</span></div>' +
      '<div class="row on"><span class="t">Wren distrusts the dockmaster</span><span class="tag acc">used</span></div>' +
      '<div class="row on"><span class="t">Harbour district curfew</span><span class="tag acc">used</span></div>' +
      '<div class="row on"><span class="t">Wren owes Sable a favour</span><span class="tag acc">used</span></div>' +
      '<div class="grp">Dropped<span class="c">11</span></div>' +
      '<div class="row"><span class="t">Over the token budget</span><span class="meta">2</span></div>' +
      '<div class="row"><span class="t">Below the score threshold</span><span class="meta">6</span></div>' +
      '<div class="row"><span class="t">Not enabled for this chat mode</span><span class="meta">3</span></div>' +
      '<div class="note-s">Imported character and lorebook memories are eligible in Roleplay only.</div>' +
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
    caption: 'The same turn, on an install where a prompt-assembling preset owns placement and carries no memory section. Three memories were selected and assembled, and <b>none of them reached the model</b>. Only engine code can write this record, because the discard happens where the prompt is assembled and no receipt is ever assigned. This is the single most important negative state in the document: without this line the turn is indistinguishable from memory having nothing to say, which is the reading the current build gives it.',
    desk: '<div class="dev"><div class="dev-desk drawer">' +
      '<div class="side"><div class="side-title">Chats</div>' +
      '<div class="chat-row on">Wren · harbour arc</div>' +
      '<div class="chat-row">Scene drafts</div>' +
      '<div class="chat-row">Worldbuilding</div>' +
      '<div class="chat-row">Notes to self</div></div>' +
      '<div class="main">' +
      '<div class="topbar"><span class="ico">&lt;</span>WREN · HARBOUR ARC<span class="ico hot">M</span><span class="ico">S</span></div>' +
      '<div class="msgs">' +
      '<div class="msg"><div class="av"></div><div class="bd"><div class="who">You</div>' +
      '<div class="tx">What did Wren decide about the harbour job?</div></div></div>' +
      '<div class="msg"><div class="av"></div><div class="bd"><div class="who">Assistant</div>' +
      '<div class="tx">She has not mentioned the harbour to me before.</div>' +
      '<div class="bar-line"></div><div class="bar-line"></div></div></div>' +
      '</div>' +
      '<div class="inputbar"><span class="ico wide">Message</span><span class="btn">Send</span></div>' +
      '</div>' +
      '<div class="drawer">' +
      '<div class="drawer-head"><span class="ico hot">M</span>This turn</div>' +
      '<div class="drawer-body">' +
      '<div class="kv"><span class="k">turn</span><span class="v">t214 · 14:41</span></div>' +
      '<div class="kv"><span class="k">selected</span><span class="v">3</span></div>' +
      '<div class="kv"><span class="k">assembled</span><span class="v">3</span></div>' +
      '<div class="kv"><span class="k">sent</span><span class="v">0</span></div>' +
      '<div class="row badrow"><span class="t">The preset assembled the prompt with no memory slot, so all 3 were discarded before the send</span></div>' +
      '<div class="row"><span class="t">Dropped earlier in the pass</span><span class="meta">11</span></div>' +
      '<div class="note-s">Recorded where the prompt is assembled, not where recall runs.</div>' +
      '<div class="btn">Open diagnostics</div>' +
      '</div></div>' +
      '</div></div>',
    phone: '<div class="dev"><div class="dev-phone">' +
      '<div class="topbar"><span class="ico">&lt;</span>MEMORY · THIS TURN<span class="ico hot">M</span></div>' +
      '<div class="pane">' +
      '<div class="hdr"><span class="grow">Wren · harbour arc</span><span class="sel">t214 · 14:41</span></div>' +
      '<div class="grp">Nothing reached the model<span class="c">0 of 3</span></div>' +
      '<div class="row badrow"><span class="t">The preset assembled the prompt with no memory slot, so the 3 selected memories were discarded before the send</span></div>' +
      '<div class="kv"><span class="k">selected</span><span class="v">3</span></div>' +
      '<div class="kv"><span class="k">assembled</span><span class="v">3</span></div>' +
      '<div class="kv"><span class="k">sent</span><span class="v">0</span></div>' +
      '<div class="grp">Dropped in the pass<span class="c">11</span></div>' +
      '<div class="row"><span class="t">Over the token budget</span><span class="meta">2</span></div>' +
      '<div class="row"><span class="t">Below the score threshold</span><span class="meta">6</span></div>' +
      '<div class="row"><span class="t">Not enabled for this chat mode</span><span class="meta">3</span></div>' +
      '<div class="note-s">Without this record the turn reads as memory having nothing to say.</div>' +
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
    caption: 'Receipts appended per turn instead of overwritten once per chat, read from a Recall tab <b>added</b> to the workspace rail rather than taking a seat from Vault, Review, Sources or Settings. The gap at <b>t212</b> is printed as a row of its own and labelled "no receipt recorded", because an unexplained gap is indistinguishable from the silent injection failure this history exists to catch. Two rows carry known weaknesses: timeline events that arrived with no sequence, and ranking that ran age-blind, since the cooldown option is never passed and no lane derives a score from recency. Reading the history needs a new route.',
    desk: '<div class="dev"><div class="dev-desk">' +
      '<div class="side"><div class="side-title">Chats</div>' +
      '<div class="chat-row on">Wren · harbour arc</div>' +
      '<div class="chat-row">Scene drafts</div>' +
      '<div class="chat-row">Worldbuilding</div>' +
      '<div class="chat-row">Notes to self</div></div>' +
      '<div class="main">' +
      '<div class="topbar"><span class="ico">&lt;</span>LONG-TERM MEMORY<span class="ico hot">M</span></div>' +
      '<div class="rail"><span class="rt">Vault</span><span class="rt">Review</span><span class="rt">Sources</span>' +
      '<span class="rt">Settings</span><span class="rt new on">Recall<span class="b">t214</span></span></div>' +
      '<div class="pane">' +
      '<div class="hdr"><span class="grow">Recall history</span><span class="sel">this chat</span><span class="sel">last 20 turns</span></div>' +
      '<div class="row badrow on"><span class="meta">t214</span><span class="t">3 used · 11 dropped</span><span class="tag bad">discarded by preset</span></div>' +
      '<div class="row"><span class="meta">t213</span><span class="t">2 used · 4 dropped</span><span class="tag good">reached the model</span></div>' +
      '<div class="row warnrow"><span class="meta">t212</span><span class="t">no receipt recorded</span><span class="tag warn">unknown</span></div>' +
      '<div class="row"><span class="meta">t211</span><span class="t">5 used · 1 dropped</span><span class="tag warn">no chronological order</span></div>' +
      '<div class="row"><span class="meta">t208</span><span class="t">0 used · 0 candidates</span></div>' +
      '<div class="grp">t211 · timeline bullets injected in relevance order<span class="c">View</span></div>' +
      '<div class="note-s">Every row ranked age-blind: the cooldown option is never passed and no lane scores recency.</div>' +
      '<div class="hdr"><span class="grow">Polled on open, no push channel exists</span><span class="btn">Refresh</span></div>' +
      '</div></div></div></div>',
    phone: '<div class="dev"><div class="dev-phone">' +
      '<div class="topbar"><span class="ico">&lt;</span>RECALL HISTORY<span class="ico hot">M</span></div>' +
      '<div class="rail"><span class="rt">Vault</span><span class="rt">Review</span><span class="rt">Sources</span>' +
      '<span class="rt">Settings</span><span class="rt new on">Recall<span class="b">t214</span></span></div>' +
      '<div class="pane">' +
      '<div class="hdr"><span class="grow">Wren · harbour arc</span><span class="sel">last 20</span></div>' +
      '<div class="row badrow on"><span class="meta">t214</span><span class="t">3 used · 11 dropped</span><span class="tag bad">discarded</span></div>' +
      '<div class="row"><span class="meta">t213</span><span class="t">2 used · 4 dropped</span><span class="tag good">sent</span></div>' +
      '<div class="row warnrow"><span class="meta">t212</span><span class="t">no receipt recorded</span><span class="tag warn">unknown</span></div>' +
      '<div class="row"><span class="meta">t211</span><span class="t">5 used · 1 dropped</span><span class="tag warn">no order</span></div>' +
      '<div class="row"><span class="meta">t208</span><span class="t">0 used · 0 candidates</span></div>' +
      '<div class="note-s">A gap is a row, not a blank. Ranking ran age-blind on every turn.</div>' +
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
    caption: 'The path from a turn to a memory to a reason. "Wren distrusts the dockmaster" was not recalled on t214, and the answer walks down three causes in order: the memory is imported so it is eligible in Roleplay only, the index rebuild failed on the 14 notes that include this one, and the semantic lane is dead because the rebuild reported success after embedding nothing. Vault-wide state is <b>linked, not repeated</b>: it is drawn once in journey 6 under one verb. Today these three facts sit in separate components with no path between them, and a memory can save successfully and stay invisible to recall with nothing on screen saying so.',
    desk: '<div class="dev"><div class="dev-desk">' +
      '<div class="side"><div class="side-title">Chats</div>' +
      '<div class="chat-row on">Wren · harbour arc</div>' +
      '<div class="chat-row">Scene drafts</div>' +
      '<div class="chat-row">Worldbuilding</div>' +
      '<div class="chat-row">Notes to self</div></div>' +
      '<div class="main">' +
      '<div class="topbar"><span class="ico">&lt;</span>DIAGNOSTICS<span class="ico hot">M</span></div>' +
      '<div class="rail"><span class="rt">Vault</span><span class="rt">Review</span><span class="rt">Sources</span>' +
      '<span class="rt">Settings</span><span class="rt new on">Recall</span></div>' +
      '<div class="pane split">' +
      '<div class="facets">' +
      '<div class="fgroup">Turn</div>' +
      '<div class="fac on">t214<span class="c">14</span></div>' +
      '<div class="fac">t213<span class="c">6</span></div>' +
      '<div class="fac">t211<span class="c">6</span></div>' +
      '<div class="fgroup">Reason</div>' +
      '<div class="fac">Token budget<span class="c">2</span></div>' +
      '<div class="fac">Below threshold<span class="c">6</span></div>' +
      '<div class="fac on">Chat mode<span class="c">3</span></div>' +
      '</div>' +
      '<div class="listcol">' +
      '<div class="hdr"><span class="grow">Why this memory was not recalled</span><span class="sel">t214</span></div>' +
      '<div class="grp">Wren distrusts the dockmaster<span class="c">recalled 21 times, last 2 Mar</span></div>' +
      '<div class="row warnrow"><span class="t">Imported from a character card, so it is eligible in Roleplay only and this chat is not in Roleplay</span><span class="btn">Set modes</span></div>' +
      '<div class="row warnrow"><span class="t">Index rebuild failed on 14 notes, and this note is one of them</span><span class="btn">Open health</span></div>' +
      '<div class="row badrow"><span class="t">Semantic lane dead: 0 embedded chunks, so only the lexical lane ranked it</span><span class="btn">Open health</span></div>' +
      '<div class="row"><span class="t">Rejected candidates from the last run</span><span class="meta">304 of 1,142</span></div>' +
      '<div class="note-s">Vault-wide index and embedding state is rendered once, in journey 6, and linked from here.</div>' +
      '</div></div></div></div></div>',
    phone: '<div class="dev"><div class="dev-phone">' +
      '<div class="topbar"><span class="ico">&lt;</span>DIAGNOSTICS<span class="ico hot">M</span></div>' +
      '<div class="pane">' +
      '<div class="hdr"><span class="grow">Not recalled on t214</span><span class="sel">t214</span></div>' +
      '<div class="grp">Wren distrusts the dockmaster<span class="c">21 recalls</span></div>' +
      '<div class="row warnrow"><span class="t">Eligible in Roleplay only. This chat is not in Roleplay.</span><span class="btn">Set modes</span></div>' +
      '<div class="row warnrow"><span class="t">Index rebuild failed on 14 notes, including this one.</span><span class="btn">Health</span></div>' +
      '<div class="row badrow"><span class="t">Semantic lane dead: 0 embedded chunks.</span><span class="btn">Health</span></div>' +
      '<div class="row"><span class="t">Rejected candidates, last run</span><span class="meta">304 of 1,142</span></div>' +
      '<div class="note-s">Three causes that live in three separate components today.</div>' +
      '<div class="hdr"><span class="grow">Vault state is drawn once, in Settings</span><span class="btn">Open health</span></div>' +
      '</div>' +
      '<div class="inputbar"><span class="ico wide">Back to recall history</span></div>' +
      '</div></div>'
  },
  {
    num: "05",
    label: "A 403 that names the fix",
    feas: "package",
    fx: [63],
    caption: 'A permissions failure rendered as the remedy. This install requires an admin secret for memory routes, and the engine already ships copy naming both ways out, so nothing here needs writing. It is simply never reached: the four read views print <b>one generic loading string for every failure</b> without looking at the response status, so an authentication problem with a documented fix arrives as a vault that will not load. One failure per screen. A projection-limit error belongs with the note that overflowed and cannot co-occur with a 403 that stopped every read.',
    desk: '<div class="dev"><div class="dev-desk">' +
      '<div class="side"><div class="side-title">Chats</div>' +
      '<div class="chat-row on">Wren · harbour arc</div>' +
      '<div class="chat-row">Scene drafts</div>' +
      '<div class="chat-row">Worldbuilding</div>' +
      '<div class="chat-row">Notes to self</div></div>' +
      '<div class="main">' +
      '<div class="topbar"><span class="ico">&lt;</span>LONG-TERM MEMORY<span class="ico hot">M</span></div>' +
      '<div class="rail"><span class="rt">Vault</span><span class="rt">Review</span><span class="rt">Sources</span>' +
      '<span class="rt on">Settings</span><span class="rt new">Recall</span></div>' +
      '<div class="pane">' +
      '<div class="hdr"><span class="grow">Memory settings</span><span class="tag bad">403</span></div>' +
      '<div class="empty">This install requires an admin secret for memory routes.</div>' +
      '<div class="grp">Two ways to get in<span class="c">either works</span></div>' +
      '<div class="row"><span class="t">Set ADMIN_SECRET in the server environment, then reload</span></div>' +
      '<div class="row"><span class="t">Or open the workspace from the local machine, where privileged routes are allowed</span></div>' +
      '<div class="hdr"><span class="grow"></span><span class="sel">admin secret</span><span class="btn pri">Save secret</span><span class="btn">How to set it</span></div>' +
      '<div class="note-s">The engine already ships this copy. The read views never look at the status, so it is never shown.</div>' +
      '<div class="grp">Status<span class="c">every memory route returned 403</span></div>' +
      '<div class="row"><span class="t">Vault, Review, Sources and Settings all failed the same way and for the same reason</span></div>' +
      '</div></div></div></div>',
    phone: '<div class="dev"><div class="dev-phone">' +
      '<div class="topbar"><span class="ico">&lt;</span>MEMORY SETTINGS<span class="ico hot">M</span></div>' +
      '<div class="rail"><span class="rt">Vault</span><span class="rt">Review</span><span class="rt">Sources</span>' +
      '<span class="rt on">Settings</span><span class="rt new">Recall</span></div>' +
      '<div class="pane">' +
      '<div class="hdr"><span class="grow">Cannot read the vault</span><span class="tag bad">403</span></div>' +
      '<div class="empty">This install requires an admin secret for memory routes.</div>' +
      '<div class="row"><span class="t">Set ADMIN_SECRET in the server environment, then reload</span></div>' +
      '<div class="row"><span class="t">Or open from the local machine</span></div>' +
      '<div class="hdr"><span class="grow"></span><span class="sel">admin secret</span><span class="btn pri">Save</span></div>' +
      '<div class="note-s">Today this arrives as a generic loading error with no cause and no remedy.</div>' +
      '<div class="btn">How to set it</div>' +
      '</div>' +
      '<div class="inputbar"><span class="ico wide">Back to chat</span></div>' +
      '</div></div>'
  }
];

FLOWS.j5 = [
  { n: "01", t: "Check this turn", d: "open the memory drawer beside the message" },
  { n: "02", t: "See the discard", d: "selected, assembled, never sent" },
  { n: "03", t: "Scroll back", d: "receipts per turn, gaps named" },
  { n: "04", t: "Diagnose one memory", d: "turn, memory, reason" },
  { n: "05", t: "Act on the cause", d: "set modes, repair, or supply the secret", term: true }
];

TRADE.j5 = {
  win: [
    "The five outcomes that all look like silence today become five different readings.",
    "A turn where the preset threw the injection away stops looking like a turn with nothing to recall.",
    "A gap in the history is labelled, so absence of a receipt is never read as absence of a problem.",
    "A 403 arrives naming its own remedy instead of as a vault that will not load."
  ],
  cost: [
    "Per-turn receipts are storage that grows with the conversation and needs a retention rule.",
    "The Recall tab is a fifth destination in a rail that already holds four.",
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
