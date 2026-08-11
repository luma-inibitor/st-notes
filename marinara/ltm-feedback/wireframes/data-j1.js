STATES.j1 = [
  {
    num: "01", label: "Enable, and what is readable", feas: "package", fx: [2, 3],
    caption: 'The drawer opens on <b>three rows and three different reasons for a zero</b>: one kind has material now, one will have material after a longer session, and one never will, because a transcript is not a source kind. The current build opens on the summaries tab, which is empty by construction on a new chat, and gives no way to tell the three apart.',
    desk: '<div class="dev"><div class="dev-desk drawer">' +
      '<div class="side">' +
        '<div class="side-title">Chats</div>' +
        '<div class="chat-row on">Wren · conversation</div>' +
        '<div class="chat-row">Wren · roleplay</div>' +
        '<div class="chat-row">Harbour district</div>' +
        '<div class="chat-row">Notes to self</div>' +
      '</div>' +
      '<div class="main">' +
        '<div class="topbar"><span class="ico hot">M</span><span>WREN · CONVERSATION</span></div>' +
        '<div class="msgs">' +
          '<div class="msg"><span class="av"></span><div class="bd"><span class="who">YOU</span>' +
            '<div class="tx">I want you to remember things about me.</div></div></div>' +
          '<div class="msg"><span class="av"></span><div class="bd"><span class="who">WREN</span>' +
            '<div class="tx"><div class="bar-line"></div></div></div></div>' +
        '</div>' +
        '<div class="inputbar"><span class="ico">+</span><span class="fld ph">Message Wren</span></div>' +
      '</div>' +
      '<div class="drawer">' +
        '<div class="drawer-head"><span class="ico hot">M</span>Long-Term Memory</div>' +
        '<div class="drawer-body">' +
          '<div class="kv"><span class="k">Active in</span><span class="v">this chat</span></div>' +
          '<div class="kv"><span class="k">Memory Vault</span><span class="v">0 memories</span></div>' +
          '<div class="grp">Ready to import<span class="c">1</span></div>' +
          '<div class="row"><span class="t">Character<div class="meta">1 on this chat</div></span><span class="btn pri">Import</span></div>' +
          '<div class="row"><span class="t">Chat Summaries<div class="meta">0 written so far</div></span><span class="tag">later</span></div>' +
          '<div class="row badrow"><span class="t">This conversation<div class="meta">not a source kind</div></span><span class="tag bad">n/a</span></div>' +
          '<div class="note-s">Three zeros, three reasons.</div>' +
        '</div>' +
      '</div>' +
    '</div></div>',
    phone: '<div class="dev"><div class="dev-phone">' +
      '<div class="main">' +
        '<div class="topbar"><span class="ico">&lt;</span><span class="ico hot">M</span><span>LONG-TERM MEMORY</span></div>' +
        '<div class="pane">' +
          '<div class="hdr"><span class="grow">Long-Term Memory</span><span class="sel">Active in this chat</span></div>' +
          '<div class="kv"><span class="k">Memory Vault</span><span class="v">0 memories</span></div>' +
          '<div class="grp">Ready to import<span class="c">1</span></div>' +
          '<div class="row"><span class="t">Character<div class="meta">1 on this chat</div></span><span class="btn pri">Import</span></div>' +
          '<div class="row"><span class="t">Chat Summaries<div class="meta">0 written so far</div></span><span class="tag">later</span></div>' +
          '<div class="row badrow"><span class="t">This conversation<div class="meta">not a source kind</div></span><span class="tag bad">n/a</span></div>' +
          '<div class="note-s">Three zeros, three reasons.</div>' +
        '</div>' +
        '<div class="inputbar"><span class="ico">+</span><span class="fld ph">Message Wren</span></div>' +
      '</div>' +
    '</div></div>'
  },
  {
    num: "02", label: "The read, and what it spends", feas: "package", fx: [23, 24],
    caption: 'A first run costs <b>a model call</b>, and the drawer says so instead of presenting memories as though they simply appeared. The row names the extraction connection and marks whether it can hold the structured-output schema, so the reader learns that at the point of use. Today they find out by paying for a whole run and reading the rejection breakdown afterwards.',
    desk: '<div class="dev"><div class="dev-desk drawer">' +
      '<div class="side">' +
        '<div class="side-title">Chats</div>' +
        '<div class="chat-row on">Wren · conversation</div>' +
        '<div class="chat-row">Wren · roleplay</div>' +
        '<div class="chat-row">Harbour district</div>' +
        '<div class="chat-row">Notes to self</div>' +
      '</div>' +
      '<div class="main">' +
        '<div class="topbar"><span class="ico hot">M</span><span>WREN · CONVERSATION</span></div>' +
        '<div class="msgs">' +
          '<div class="msg"><span class="av"></span><div class="bd"><span class="who">YOU</span>' +
            '<div class="tx">I want you to remember things about me.</div></div></div>' +
          '<div class="msg"><span class="av"></span><div class="bd"><span class="who">WREN</span>' +
            '<div class="tx"><div class="bar-line"></div></div></div></div>' +
        '</div>' +
        '<div class="inputbar"><span class="ico">+</span><span class="fld ph">Message Wren</span></div>' +
      '</div>' +
      '<div class="drawer">' +
        '<div class="drawer-head"><span class="ico hot">M</span>Extraction</div>' +
        '<div class="drawer-body">' +
          '<div class="hdr"><span class="grow">Extracting</span><span class="tag warn">Running</span></div>' +
          '<div class="mtr acc"><i class="w75"></i></div>' +
          '<div class="kv"><span class="k">Source parts</span><span class="v">3 of 4</span></div>' +
          '<div class="kv"><span class="k">Sources</span><span class="v">1</span></div>' +
          '<div class="kv"><span class="k">Elapsed</span><span class="v">about 30s</span></div>' +
          '<div class="grp">Model calls<span class="c">1</span></div>' +
          '<div class="row"><span class="t">Extraction connection<div class="meta">chat default</div></span><span class="tag good">schema ok</span></div>' +
          '<div class="note-s">Structured output required.</div>' +
        '</div>' +
      '</div>' +
    '</div></div>',
    phone: '<div class="dev"><div class="dev-phone">' +
      '<div class="main">' +
        '<div class="topbar"><span class="ico">&lt;</span><span class="ico hot">M</span><span>EXTRACTING</span></div>' +
        '<div class="pane">' +
          '<div class="hdr"><span class="grow">Extracting</span><span class="tag warn">Running</span></div>' +
          '<div class="mtr acc"><i class="w75"></i></div>' +
          '<div class="kv"><span class="k">Source parts</span><span class="v">3 of 4</span></div>' +
          '<div class="kv"><span class="k">Sources</span><span class="v">1</span></div>' +
          '<div class="kv"><span class="k">Elapsed</span><span class="v">about 30s</span></div>' +
          '<div class="grp">Model calls<span class="c">1</span></div>' +
          '<div class="row"><span class="t">Extraction connection<div class="meta">chat default</div></span><span class="tag good">schema ok</span></div>' +
          '<div class="note-s">Structured output required.</div>' +
        '</div>' +
        '<div class="inputbar"><span class="ico">+</span><span class="fld ph">Message Wren</span></div>' +
      '</div>' +
    '</div></div>'
  },
  {
    num: "03", label: "What the build does today", feas: "today", fx: [8, 9],
    caption: 'This draws <b>present behaviour, not a proposal</b>. The import stamps a character card Roleplay only, so following every documented step in a conversation chat leaves four saved memories and nothing injected. Nothing shows Available modes while you accept; only the Memory editor, in another part of the workspace, lets you change it afterwards.',
    desk: '<div class="dev"><div class="dev-desk drawer">' +
      '<div class="side">' +
        '<div class="side-title">Chats</div>' +
        '<div class="chat-row on">Wren · conversation</div>' +
        '<div class="chat-row">Wren · roleplay</div>' +
        '<div class="chat-row">Harbour district</div>' +
        '<div class="chat-row">Notes to self</div>' +
      '</div>' +
      '<div class="main">' +
        '<div class="topbar"><span class="ico hot">M</span><span>WREN · CONVERSATION</span></div>' +
        '<div class="msgs">' +
          '<div class="msg"><span class="av"></span><div class="bd"><span class="who">YOU</span>' +
            '<div class="tx">So what do you know about me now?</div></div></div>' +
          '<div class="msg"><span class="av"></span><div class="bd"><span class="who">WREN</span>' +
            '<div class="tx"><div class="bar-line"></div></div>' +
            '<span class="who">No memories injected yet</span></div></div>' +
        '</div>' +
        '<div class="inputbar"><span class="ico">+</span><span class="fld ph">Message Wren</span></div>' +
      '</div>' +
      '<div class="drawer">' +
        '<div class="drawer-head"><span class="ico">M</span>Long-Term Memory</div>' +
        '<div class="drawer-body">' +
          '<div class="hdr"><span class="grow">Import complete</span><span class="tag good">Succeeded</span></div>' +
          '<div class="kv"><span class="k">Memories saved</span><span class="v">4</span></div>' +
          '<div class="kv"><span class="k">Available modes</span><span class="v">Roleplay</span></div>' +
          '<div class="kv"><span class="k">This chat is</span><span class="v">Conversation</span></div>' +
          '<div class="row badrow"><span class="t">Eligible here<div class="meta">none of the 4 are</div></span><span class="tag bad">0</span></div>' +
          '<div class="grp">Last turn<span class="c">t2</span></div>' +
          '<div class="row badrow"><span class="t">Last injection<div class="meta">nothing reached the reply</div></span><span class="tag bad">0 injected</span></div>' +
          '<div class="note-s">Set in the Memory editor, not here.</div>' +
        '</div>' +
      '</div>' +
    '</div></div>',
    phone: '<div class="dev"><div class="dev-phone">' +
      '<div class="main">' +
        '<div class="topbar"><span class="ico">&lt;</span><span class="ico">M</span><span>WREN · CONVERSATION</span></div>' +
        '<div class="msgs">' +
          '<div class="msg"><span class="av"></span><div class="bd"><span class="who">YOU</span>' +
            '<div class="tx">So what do you know about me now?</div></div></div>' +
          '<div class="msg"><span class="av"></span><div class="bd"><span class="who">WREN</span>' +
            '<div class="tx"><div class="bar-line"></div></div></div></div>' +
        '</div>' +
        '<div class="pane">' +
          '<div class="hdr"><span class="grow">Long-Term Memory</span><span class="tag good">4 saved</span></div>' +
          '<div class="kv"><span class="k">Available modes</span><span class="v">Roleplay</span></div>' +
          '<div class="kv"><span class="k">This chat is</span><span class="v">Conversation</span></div>' +
          '<div class="row badrow"><span class="t">Last injection at t2<div class="meta">none of the 4 are eligible here</div></span><span class="tag bad">0 injected</span></div>' +
        '</div>' +
        '<div class="inputbar"><span class="ico">+</span><span class="fld ph">Message Wren</span></div>' +
      '</div>' +
    '</div></div>'
  },
  {
    num: "04", label: "Eligibility decided at acceptance", feas: "package", fx: [1, 9],
    caption: 'The eligibility default <b>follows the chat the material came from</b>, so this screen preselects Conversation and shows it at the moment of the decision rather than three screens away. The rows name things a reader already understands, so the seven pipeline nouns stop being a prerequisite for the first screen anyone sees.',
    desk: '<div class="dev"><div class="dev-desk drawer">' +
      '<div class="side">' +
        '<div class="side-title">Chats</div>' +
        '<div class="chat-row on">Wren · conversation</div>' +
        '<div class="chat-row">Wren · roleplay</div>' +
        '<div class="chat-row">Harbour district</div>' +
        '<div class="chat-row">Notes to self</div>' +
      '</div>' +
      '<div class="main">' +
        '<div class="topbar"><span class="ico hot">M</span><span>WREN · CONVERSATION</span></div>' +
        '<div class="msgs">' +
          '<div class="msg"><span class="av"></span><div class="bd"><span class="who">YOU</span>' +
            '<div class="tx">I want you to remember things about me.</div></div></div>' +
          '<div class="msg"><span class="av"></span><div class="bd"><span class="who">WREN</span>' +
            '<div class="tx"><div class="bar-line"></div></div></div></div>' +
        '</div>' +
        '<div class="inputbar"><span class="ico">+</span><span class="fld ph">Message Wren</span></div>' +
      '</div>' +
      '<div class="drawer">' +
        '<div class="drawer-head"><span class="ico hot">M</span>Review proposed memories</div>' +
        '<div class="drawer-body">' +
          '<div class="grp">From this source<span class="c">4</span></div>' +
          '<div class="row on"><span class="cb on"></span><span class="t">Works nights at a clinic</span></div>' +
          '<div class="row on"><span class="cb on"></span><span class="t">Afraid of open water</span></div>' +
          '<div class="row"><span class="cb"></span><span class="t">Lives in the harbour district<div class="meta">World</div></span></div>' +
          '<div class="note-s">1 more below the fold.</div>' +
          '<div class="hdr"><span class="grow">Available modes</span></div>' +
          '<div class="row"><span class="tag acc">Conversation</span><span class="tag">Roleplay</span><span class="tag">Game</span></div>' +
          '<div class="row"><span class="btn pri">Accept</span><span class="btn">Skip</span></div>' +
        '</div>' +
      '</div>' +
    '</div></div>',
    phone: '<div class="dev"><div class="dev-phone">' +
      '<div class="main">' +
        '<div class="topbar"><span class="ico">&lt;</span><span class="ico hot">M</span><span>REVIEW PROPOSED MEMORIES</span></div>' +
        '<div class="pane">' +
          '<div class="grp">From this source<span class="c">4</span></div>' +
          '<div class="row on"><span class="cb on"></span><span class="t">Works nights at a clinic</span></div>' +
          '<div class="row on"><span class="cb on"></span><span class="t">Afraid of open water</span></div>' +
          '<div class="row"><span class="cb"></span><span class="t">Lives in the harbour district<div class="meta">World</div></span></div>' +
          '<div class="note-s">1 more below the fold.</div>' +
          '<div class="hdr"><span class="grow">Available modes</span></div>' +
          '<div class="row"><span class="tag acc">Conversation</span><span class="tag">Roleplay</span><span class="tag">Game</span></div>' +
          '<div class="row"><span class="btn pri">Accept</span><span class="btn">Skip</span></div>' +
        '</div>' +
      '</div>' +
    '</div></div>'
  },
  {
    num: "05", label: "Proof, two turns later", feas: "package", fx: [7],
    caption: 'A count, <b>a timestamp and a turn reference</b>, so the figure reads as this turn rather than as the last time anything worked. The present readout carries neither, and holds its last successful count indefinitely once injection stops.',
    desk: '<div class="dev"><div class="dev-desk drawer">' +
      '<div class="side">' +
        '<div class="side-title">Chats</div>' +
        '<div class="chat-row on">Wren · conversation</div>' +
        '<div class="chat-row">Wren · roleplay</div>' +
        '<div class="chat-row">Harbour district</div>' +
        '<div class="chat-row">Notes to self</div>' +
      '</div>' +
      '<div class="main">' +
        '<div class="topbar"><span class="ico hot">M</span><span>WREN · CONVERSATION</span></div>' +
        '<div class="msgs">' +
          '<div class="msg"><span class="av"></span><div class="bd"><span class="who">YOU</span>' +
            '<div class="tx">Can you cover my shift tonight?</div></div></div>' +
          '<div class="msg"><span class="av"></span><div class="bd"><span class="who">WREN</span>' +
            '<div class="tx">Nights at the clinic again.</div>' +
            '<div class="tx"><div class="bar-line"></div></div></div></div>' +
        '</div>' +
        '<div class="inputbar"><span class="ico">+</span><span class="fld ph">Message Wren</span></div>' +
      '</div>' +
      '<div class="drawer">' +
        '<div class="drawer-head"><span class="ico hot">M</span>Long-Term Memory</div>' +
        '<div class="drawer-body">' +
          '<div class="hdr"><span class="grow">2 memories injected</span><span class="tag acc">t6</span></div>' +
          '<div class="kv"><span class="k">tokens</span><span class="v">112</span></div>' +
          '<div class="kv"><span class="k">At</span><span class="v">14:22</span></div>' +
          '<div class="kv"><span class="k">Turn</span><span class="v">t6</span></div>' +
          '<div class="row on"><span class="t">Works nights at a clinic</span><span class="tag acc">injected</span></div>' +
          '<div class="row on"><span class="t">Afraid of open water</span><span class="tag acc">injected</span></div>' +
          '<div class="grp">Rejected candidates<span class="c">0</span></div>' +
          '<div class="empty">None this turn</div>' +
        '</div>' +
      '</div>' +
    '</div></div>',
    phone: '<div class="dev"><div class="dev-phone">' +
      '<div class="main">' +
        '<div class="topbar"><span class="ico">&lt;</span><span class="ico hot">M</span><span>WREN · CONVERSATION</span></div>' +
        '<div class="msgs">' +
          '<div class="msg"><span class="av"></span><div class="bd"><span class="who">YOU</span>' +
            '<div class="tx">Can you cover my shift tonight?</div></div></div>' +
          '<div class="msg"><span class="av"></span><div class="bd"><span class="who">WREN</span>' +
            '<div class="tx">Nights at the clinic again.</div></div></div>' +
        '</div>' +
        '<div class="pane">' +
          '<div class="hdr"><span class="grow">2 memories injected</span><span class="tag acc">t6</span></div>' +
          '<div class="kv"><span class="k">tokens</span><span class="v">112</span></div>' +
          '<div class="kv"><span class="k">At</span><span class="v">14:22</span></div>' +
          '<div class="row on"><span class="t">Works nights at a clinic</span><span class="tag acc">injected</span></div>' +
          '<div class="row on"><span class="t">Afraid of open water</span><span class="tag acc">injected</span></div>' +
          '<div class="note-s">No rejected candidates this turn.</div>' +
        '</div>' +
        '<div class="inputbar"><span class="ico">+</span><span class="fld ph">Message Wren</span></div>' +
      '</div>' +
    '</div></div>'
  }
];

FLOWS.j1 = [
  { n: "01", t: "Enable", d: "see what is readable, and why a zero is a zero" },
  { n: "02", t: "Read", d: "one source, one model call, cost stated first" },
  { n: "03", t: "Today", d: "4 saved, Roleplay only, nothing injected here" },
  { n: "04", t: "Accept", d: "eligibility set where the decision is made" },
  { n: "05", t: "Observe", d: "2 injected, 112 tokens, 14:22, turn t6", term: true }
];

TRADE.j1 = {
  win: [
    "A first run ends in visible proof instead of a silent zero.",
    "Three kinds of empty are told apart before any money is spent.",
    "The mode stamp is chosen where it is understood, not found later in the Memory editor.",
    "The injection count carries a time and a turn, so a stale figure cannot pass for a fresh one."
  ],
  cost: [
    "The drawer competes with the chat for width on desktop and covers it on a phone.",
    "Stating the model call up front makes the feature look expensive at the moment of adoption.",
    "A per-turn receipt is one more thing to keep truthful on every turn.",
    "Showing today's failure alongside the fix invites reading the fix as shipped."
  ],
  build: [
    "The drawer, the accept step and the per-turn readout are all package-side surfaces.",
    "Eligibility defaults read the current chat mode at accept time, no engine change.",
    "The receipt needs a stored per-turn record keyed by turn id, polled like the debug log.",
    "State 03 is drawn from present behaviour and needs no build at all."
  ]
};
