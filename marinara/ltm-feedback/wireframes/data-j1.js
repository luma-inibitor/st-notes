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
        '<div class="chat-row">Scratch thread</div>' +
      '</div>' +
      '<div class="main">' +
        '<div class="topbar"><span class="ico hot">M</span><span>WREN · CONVERSATION</span></div>' +
        '<div class="msgs">' +
          '<div class="msg"><span class="av"></span><div class="bd"><span class="who">YOU</span>' +
            '<div class="tx">I want you to remember things about me.</div></div></div>' +
          '<div class="msg"><span class="av"></span><div class="bd"><span class="who">WREN</span>' +
            '<div class="tx"><div class="bar-line"></div><div class="bar-line"></div></div></div></div>' +
        '</div>' +
        '<div class="inputbar"><span class="ico">+</span><span class="tag">Message Wren</span></div>' +
      '</div>' +
      '<div class="drawer">' +
        '<div class="drawer-head"><span class="ico hot">M</span>Long-Term Memory</div>' +
        '<div class="drawer-body">' +
          '<div class="kv"><span class="k">Status</span><span class="v">on</span></div>' +
          '<div class="kv"><span class="k">Vault</span><span class="v">0 memories</span></div>' +
          '<div class="grp">Readable now<span class="c">1</span></div>' +
          '<div class="row"><span class="t">Character card<div class="meta">1 attached to this chat</div></span><span class="btn pri">Read it</span></div>' +
          '<div class="row"><span class="t">Chat summaries<div class="meta">0 · written after longer sessions</div></span><span class="tag">later</span></div>' +
          '<div class="row badrow"><span class="t">This conversation<div class="meta">transcripts are never read directly</div></span><span class="tag bad">n/a</span></div>' +
          '<div class="note-s">Three zeros, three reasons.</div>' +
        '</div>' +
      '</div>' +
    '</div></div>',
    phone: '<div class="dev"><div class="dev-phone">' +
      '<div class="main">' +
        '<div class="topbar"><span class="ico">&lt;</span><span class="ico hot">M</span><span>MEMORY</span></div>' +
        '<div class="pane">' +
          '<div class="hdr"><span class="grow">LONG-TERM MEMORY</span><span class="sel">on</span></div>' +
          '<div class="kv"><span class="k">Vault</span><span class="v">0 memories</span></div>' +
          '<div class="grp">Readable now<span class="c">1</span></div>' +
          '<div class="row"><span class="t">Character card<div class="meta">1 attached to this chat</div></span><span class="btn pri">Read it</span></div>' +
          '<div class="row"><span class="t">Chat summaries<div class="meta">0 · written after longer sessions</div></span><span class="tag">later</span></div>' +
          '<div class="row badrow"><span class="t">This conversation<div class="meta">transcripts are never read directly</div></span><span class="tag bad">n/a</span></div>' +
          '<div class="note-s">Sheet over the chat. Drag down to go back.</div>' +
        '</div>' +
        '<div class="inputbar"><span class="ico">+</span><span class="tag">Message Wren</span></div>' +
      '</div>' +
    '</div></div>'
  },
  {
    num: "02", label: "The read, and what it costs", feas: "package", fx: [23, 24],
    caption: 'A first run is <b>a model call</b>, and the drawer says so instead of presenting memories as though they appeared. The structured-output requirement is stated at the point of use, where today it is discovered by paying for a whole run and reading the rejection breakdown afterwards.',
    desk: '<div class="dev"><div class="dev-desk drawer">' +
      '<div class="side">' +
        '<div class="side-title">Chats</div>' +
        '<div class="chat-row on">Wren · conversation</div>' +
        '<div class="chat-row">Wren · roleplay</div>' +
        '<div class="chat-row">Harbour district</div>' +
        '<div class="chat-row">Notes to self</div>' +
        '<div class="chat-row">Scratch thread</div>' +
      '</div>' +
      '<div class="main">' +
        '<div class="topbar"><span class="ico hot">M</span><span>WREN · CONVERSATION</span></div>' +
        '<div class="msgs">' +
          '<div class="msg"><span class="av"></span><div class="bd"><span class="who">YOU</span>' +
            '<div class="tx">I want you to remember things about me.</div></div></div>' +
          '<div class="msg"><span class="av"></span><div class="bd"><span class="who">WREN</span>' +
            '<div class="tx"><div class="bar-line"></div><div class="bar-line"></div></div></div></div>' +
        '</div>' +
        '<div class="inputbar"><span class="ico">+</span><span class="tag">Message Wren</span></div>' +
      '</div>' +
      '<div class="drawer">' +
        '<div class="drawer-head"><span class="ico hot">M</span>Reading the card</div>' +
        '<div class="drawer-body">' +
          '<div class="hdr"><span class="grow">READING</span><span class="tag warn">running</span></div>' +
          '<div class="mtr acc"><i class="w75"></i></div>' +
          '<div class="kv"><span class="k">Sections read</span><span class="v">3 of 4</span></div>' +
          '<div class="kv"><span class="k">Sources</span><span class="v">1</span></div>' +
          '<div class="kv"><span class="k">Time</span><span class="v">about 30s</span></div>' +
          '<div class="grp">This costs a model call<span class="c">1</span></div>' +
          '<div class="row"><span class="t">Model<div class="meta">chat default</div></span><span class="btn">Change</span></div>' +
          '<div class="note-s">Structured output required. A model that cannot hold the schema is named here, not after the bill.</div>' +
        '</div>' +
      '</div>' +
    '</div></div>',
    phone: '<div class="dev"><div class="dev-phone">' +
      '<div class="main">' +
        '<div class="topbar"><span class="ico">&lt;</span><span class="ico hot">M</span><span>READING THE CARD</span></div>' +
        '<div class="pane">' +
          '<div class="hdr"><span class="grow">READING</span><span class="tag warn">running</span></div>' +
          '<div class="mtr acc"><i class="w75"></i></div>' +
          '<div class="kv"><span class="k">Sections read</span><span class="v">3 of 4</span></div>' +
          '<div class="kv"><span class="k">Sources</span><span class="v">1</span></div>' +
          '<div class="kv"><span class="k">Time</span><span class="v">about 30s</span></div>' +
          '<div class="grp">This costs a model call<span class="c">1</span></div>' +
          '<div class="row"><span class="t">Model<div class="meta">chat default</div></span><span class="btn">Change</span></div>' +
          '<div class="note-s">Structured output required. A model that cannot hold the schema is named here, not after the bill.</div>' +
        '</div>' +
        '<div class="inputbar"><span class="ico">+</span><span class="tag">Message Wren</span></div>' +
      '</div>' +
    '</div></div>'
  },
  {
    num: "03", label: "What the build does today", feas: "today", fx: [8, 9],
    caption: 'This is <b>present behaviour, not a proposal</b>. A character card import is stamped roleplay only, so following every documented step in a conversation chat ends with four saved memories and nothing recalled. The mode set is never shown while accepting, and is editable only later, in the vault editor, in another part of the workspace.',
    desk: '<div class="dev"><div class="dev-desk drawer">' +
      '<div class="side">' +
        '<div class="side-title">Chats</div>' +
        '<div class="chat-row on">Wren · conversation</div>' +
        '<div class="chat-row">Wren · roleplay</div>' +
        '<div class="chat-row">Harbour district</div>' +
        '<div class="chat-row">Notes to self</div>' +
        '<div class="chat-row">Scratch thread</div>' +
      '</div>' +
      '<div class="main">' +
        '<div class="topbar"><span class="ico hot">M</span><span>WREN · CONVERSATION</span></div>' +
        '<div class="msgs">' +
          '<div class="msg"><span class="av"></span><div class="bd"><span class="who">YOU</span>' +
            '<div class="tx">So what do you know about me now?</div></div></div>' +
          '<div class="msg"><span class="av"></span><div class="bd"><span class="who">WREN</span>' +
            '<div class="tx"><div class="bar-line"></div><div class="bar-line"></div></div>' +
            '<span class="who">0 memories used this turn</span></div></div>' +
        '</div>' +
        '<div class="inputbar"><span class="ico">+</span><span class="tag">Message Wren</span></div>' +
      '</div>' +
      '<div class="drawer">' +
        '<div class="drawer-head"><span class="ico">M</span>Long-Term Memory</div>' +
        '<div class="drawer-body">' +
          '<div class="hdr"><span class="grow">IMPORT DONE</span><span class="tag good">saved</span></div>' +
          '<div class="kv"><span class="k">Memories saved</span><span class="v">4</span></div>' +
          '<div class="kv"><span class="k">Available in</span><span class="v">roleplay</span></div>' +
          '<div class="kv"><span class="k">This chat is</span><span class="v">conversation</span></div>' +
          '<div class="row badrow"><span class="t">Eligible here<div class="meta">none of the 4 are</div></span><span class="tag bad">0</span></div>' +
          '<div class="grp">Last turn<span class="c">t2</span></div>' +
          '<div class="row badrow"><span class="t">Recalled<div class="meta">no memory reached the reply</div></span><span class="tag bad">0 used</span></div>' +
          '<div class="note-s">Mode is changed in the vault editor, not here.</div>' +
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
            '<div class="tx"><div class="bar-line"></div><div class="bar-line"></div></div></div></div>' +
        '</div>' +
        '<div class="pane">' +
          '<div class="hdr"><span class="grow">MEMORY</span><span class="tag good">4 saved</span></div>' +
          '<div class="kv"><span class="k">Available in</span><span class="v">roleplay</span></div>' +
          '<div class="kv"><span class="k">This chat is</span><span class="v">conversation</span></div>' +
          '<div class="row badrow"><span class="t">Recalled at t2<div class="meta">none of the 4 are eligible here</div></span><span class="tag bad">0 used</span></div>' +
        '</div>' +
        '<div class="inputbar"><span class="ico">+</span><span class="tag">Message Wren</span></div>' +
      '</div>' +
    '</div></div>'
  },
  {
    num: "04", label: "Eligibility decided at acceptance", feas: "package", fx: [1, 9],
    caption: 'The eligibility default <b>follows the chat the material was read in</b>, and it is visible at the moment of the decision rather than three screens away. The rows name things a reader already understands, so the seven pipeline nouns are not a prerequisite for the first screen anyone sees.',
    desk: '<div class="dev"><div class="dev-desk drawer">' +
      '<div class="side">' +
        '<div class="side-title">Chats</div>' +
        '<div class="chat-row on">Wren · conversation</div>' +
        '<div class="chat-row">Wren · roleplay</div>' +
        '<div class="chat-row">Harbour district</div>' +
        '<div class="chat-row">Notes to self</div>' +
        '<div class="chat-row">Scratch thread</div>' +
      '</div>' +
      '<div class="main">' +
        '<div class="topbar"><span class="ico hot">M</span><span>WREN · CONVERSATION</span></div>' +
        '<div class="msgs">' +
          '<div class="msg"><span class="av"></span><div class="bd"><span class="who">YOU</span>' +
            '<div class="tx">I want you to remember things about me.</div></div></div>' +
          '<div class="msg"><span class="av"></span><div class="bd"><span class="who">WREN</span>' +
            '<div class="tx"><div class="bar-line"></div><div class="bar-line"></div></div></div></div>' +
        '</div>' +
        '<div class="inputbar"><span class="ico">+</span><span class="tag">Message Wren</span></div>' +
      '</div>' +
      '<div class="drawer">' +
        '<div class="drawer-head"><span class="ico hot">M</span>Keep these?</div>' +
        '<div class="drawer-body">' +
          '<div class="grp">Read from the card<span class="c">4</span></div>' +
          '<div class="row on"><span class="cb on"></span><span class="t">Works nights at a clinic</span></div>' +
          '<div class="row on"><span class="cb on"></span><span class="t">Afraid of open water</span></div>' +
          '<div class="row"><span class="cb"></span><span class="t">Lives in the harbour district<div class="meta">about the world</div></span></div>' +
          '<div class="note-s">1 more below the fold.</div>' +
          '<div class="hdr"><span class="grow">USE THESE IN</span></div>' +
          '<div class="row"><span class="tag acc">this chat</span><span class="tag">roleplay</span><span class="tag">game</span></div>' +
          '<div class="row"><span class="btn pri">Remember these</span><span class="btn">Not now</span></div>' +
        '</div>' +
      '</div>' +
    '</div></div>',
    phone: '<div class="dev"><div class="dev-phone">' +
      '<div class="main">' +
        '<div class="topbar"><span class="ico">&lt;</span><span class="ico hot">M</span><span>KEEP THESE?</span></div>' +
        '<div class="pane">' +
          '<div class="grp">Read from the card<span class="c">4</span></div>' +
          '<div class="row on"><span class="cb on"></span><span class="t">Works nights at a clinic</span></div>' +
          '<div class="row on"><span class="cb on"></span><span class="t">Afraid of open water</span></div>' +
          '<div class="row"><span class="cb"></span><span class="t">Lives in the harbour district<div class="meta">about the world</div></span></div>' +
          '<div class="note-s">1 more below the fold.</div>' +
          '<div class="hdr"><span class="grow">USE THESE IN</span></div>' +
          '<div class="row"><span class="tag acc">this chat</span><span class="tag">roleplay</span><span class="tag">game</span></div>' +
          '<div class="row"><span class="btn pri">Remember these</span><span class="btn">Not now</span></div>' +
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
        '<div class="chat-row">Scratch thread</div>' +
      '</div>' +
      '<div class="main">' +
        '<div class="topbar"><span class="ico hot">M</span><span>WREN · CONVERSATION</span></div>' +
        '<div class="msgs">' +
          '<div class="msg"><span class="av"></span><div class="bd"><span class="who">YOU</span>' +
            '<div class="tx">Can you cover my shift tonight?</div></div></div>' +
          '<div class="msg"><span class="av"></span><div class="bd"><span class="who">WREN</span>' +
            '<div class="tx">Nights at the clinic again.</div>' +
            '<div class="tx"><div class="bar-line"></div><div class="bar-line"></div></div></div></div>' +
        '</div>' +
        '<div class="inputbar"><span class="ico">+</span><span class="tag">Message Wren</span></div>' +
      '</div>' +
      '<div class="drawer">' +
        '<div class="drawer-head"><span class="ico hot">M</span>Memory · this turn</div>' +
        '<div class="drawer-body">' +
          '<div class="hdr"><span class="grow">USED IN THE REPLY</span><span class="tag acc">2 used</span></div>' +
          '<div class="kv"><span class="k">Tokens</span><span class="v">112</span></div>' +
          '<div class="kv"><span class="k">At</span><span class="v">14:22</span></div>' +
          '<div class="kv"><span class="k">Turn</span><span class="v">t6</span></div>' +
          '<div class="row on"><span class="t">Works nights at a clinic</span><span class="tag acc">used</span></div>' +
          '<div class="row on"><span class="t">Afraid of open water</span><span class="tag acc">used</span></div>' +
          '<div class="grp">Dropped<span class="c">0</span></div>' +
          '<div class="empty">Nothing dropped this turn</div>' +
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
          '<div class="hdr"><span class="grow">MEMORY · THIS TURN</span><span class="tag acc">2 used</span></div>' +
          '<div class="kv"><span class="k">Tokens</span><span class="v">112</span></div>' +
          '<div class="kv"><span class="k">At</span><span class="v">14:22 · turn t6</span></div>' +
          '<div class="row on"><span class="t">Works nights at a clinic</span><span class="tag acc">used</span></div>' +
          '<div class="row on"><span class="t">Afraid of open water</span><span class="tag acc">used</span></div>' +
          '<div class="note-s">Nothing dropped this turn.</div>' +
        '</div>' +
        '<div class="inputbar"><span class="ico">+</span><span class="tag">Message Wren</span></div>' +
      '</div>' +
    '</div></div>'
  }
];

FLOWS.j1 = [
  { n: "01", t: "Enable", d: "see what is readable, and why a zero is a zero" },
  { n: "02", t: "Read", d: "one source, one model call, cost stated first" },
  { n: "03", t: "Today", d: "4 saved, roleplay only, nothing recalled here" },
  { n: "04", t: "Accept", d: "eligibility set where the decision is made" },
  { n: "05", t: "Observe", d: "2 used, 112 tokens, 14:22, turn t6", term: true }
];

TRADE.j1 = {
  win: [
    "A first run ends in visible proof instead of a silent zero.",
    "Three kinds of empty are told apart before any money is spent.",
    "The mode stamp is chosen where it is understood, not found later in the vault editor.",
    "The recall count carries a time and a turn, so a stale figure cannot pass for a fresh one."
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
