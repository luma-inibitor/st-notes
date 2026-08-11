/* Journey 4 — Browse and correct. Canonical figures: 118 memories, 43 source
   notes hidden, Wren 19,240 / 20,000, 28 / 30 keywords, recalled 21 times. */

STATES.j4 = [

  {
    num:"01", label:"Vault browser", feas:"package", fx:[5,55],
    caption:"The vault runs the same facet engine as review, over what it stores rather than what review proposes: type, subjects, status, available modes and limits. It holds source notes out of the default view, so the header reads <b>118 memories and 43 source notes hidden</b> and the count names what recall can actually reach. Today free-text search works well, but every total silently counts the 43 audit records, and they sort to the top.",
    desk:
      '<div class="dev"><div class="dev-desk">'+
        '<div class="side">'+
          '<div class="side-title">Chats</div>'+
          '<div class="chat-row">Harbour arrival</div>'+
          '<div class="chat-row">Lantern week</div>'+
          '<div class="chat-row">Salt road, part 2</div>'+
          '<div class="side-title">Workspace panes</div>'+
          '<div class="chat-row on">Long-Term Memory</div>'+
        '</div>'+
        '<div class="main">'+
          '<div class="topbar"><span class="ico hot">M</span>LONG-TERM MEMORY<span class="ico wide">Memory Vault</span><span class="ico">?</span></div>'+
          '<div class="rail"><span class="rt on">Memory Vault<span class="b">118</span></span><span class="rt">Review Queue<span class="b">838</span></span><span class="rt">Sources</span><span class="rt">Memory Settings</span></div>'+
          '<div class="pane split">'+
            '<div class="facets">'+
              '<div class="fgroup">Type</div>'+
              '<div class="fac on">Characters<span class="c">54</span></div>'+
              '<div class="fac">World<span class="c">31</span></div>'+
              '<div class="fac">Timeline Events<span class="c">18</span></div>'+
              '<div class="fac">Source notes<span class="c">43</span></div>'+
              '<div class="note-s">hidden by default</div>'+
              '<div class="fgroup">Status and modes</div>'+
              '<div class="fac">Unresolved conflict<span class="c">7</span></div>'+
              '<div class="fac">Roleplay only<span class="c">22</span></div>'+
              '<div class="fgroup">Limits</div>'+
              '<div class="fac">Over 90 per cent<span class="c">4</span></div>'+
              '<div class="fac">Never recalled<span class="c">63</span></div>'+
            '</div>'+
            '<div class="listcol">'+
              '<div class="hdr"><span class="grow">118 memories &middot; 43 source notes hidden</span><span class="sel">Search memories</span><span class="sel">sort: size</span></div>'+
              '<div class="grp">Wren <span class="tag">Character</span><span class="c">3 sections</span></div>'+
              '<div class="row warnrow"><div class="t">Wren &middot; identity<div class="meta">19,240 / 20,000 characters &middot; recalled 21 times</div></div><span class="tag warn">near limit</span></div>'+
              '<div class="row"><div class="t">Wren &middot; timeline<div class="meta">available in Roleplay only</div></div><span class="tag">Roleplay</span></div>'+
              '<div class="row"><div class="t">Wren &middot; relationships<div class="meta">4,910 / 20,000 characters</div></div><span class="tag bad">1 conflict</span></div>'+
              '<div class="grp">Harbour district <span class="tag">World</span><span class="c">2 sections</span></div>'+
              '<div class="row"><div class="t">Harbour district &middot; setting<div class="meta">6,180 / 20,000 characters</div></div></div>'+
              '<div class="mtr"><i class="w30"></i></div>'+
              '<div class="empty">112 more memories, 43 source notes hidden</div>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div></div>',
    phone:
      '<div class="dev"><div class="dev-phone">'+
        '<div class="main">'+
          '<div class="topbar"><span class="ico hot">M</span>LONG-TERM MEMORY<span class="ico wide">Memories</span></div>'+
          '<div class="rail"><span class="rt on">Memories<span class="b">118</span></span><span class="rt">Review<span class="b">838</span></span><span class="rt">Sources</span><span class="rt">Settings</span></div>'+
          '<div class="pane">'+
            '<div class="hdr"><span class="grow">118 memories</span><span class="tag">43 source notes hidden</span></div>'+
            '<div class="hdr"><span class="sel">Search memories</span><span class="sel">sort: size</span><span class="grow"></span><span class="btn">Facets</span></div>'+
            '<div class="grp">Wren<span class="c">3 sections</span></div>'+
            '<div class="row warnrow"><div class="t">Wren &middot; identity<div class="meta">19,240 / 20,000 &middot; recalled 21 times</div></div><span class="tag warn">near limit</span></div>'+
            '<div class="row"><div class="t">Wren &middot; timeline<div class="meta">Roleplay only</div></div></div>'+
            '<div class="row"><div class="t">Wren &middot; relationships<div class="meta">4,910 / 20,000</div></div><span class="tag bad">1 conflict</span></div>'+
            '<div class="grp">Harbour district<span class="c">2 sections</span></div>'+
            '<div class="row"><div class="t">Harbour district &middot; setting<div class="meta">6,180 / 20,000</div></div></div>'+
            '<div class="mtr"><i class="w30"></i></div>'+
            '<div class="empty">112 more memories</div>'+
          '</div>'+
          '<div class="inputbar"><span class="btn">Type</span><span class="btn">Status</span><span class="btn">Limits</span></div>'+
        '</div>'+
      '</div></div>'
  },

  {
    num:"02", label:"One memory, with use", feas:"package", fx:[47,58],
    caption:"The package already writes two facts to disk that no screen shows, so this frame puts them on the memory: which contribution each stored line came from, and how many times recall has injected that line. The line with <b>0 recalls</b> carries a caveat, because this vault's semantic lane is dead and the index rebuild failed on 14 notes, so zero means unreachable rather than unused. Today the editor gives you one free-form text area, links nothing back to the evidence unit, and no route returns a recall count.",
    desk:
      '<div class="dev"><div class="dev-desk drawer">'+
        '<div class="side">'+
          '<div class="side-title">Chats</div>'+
          '<div class="chat-row">Harbour arrival</div>'+
          '<div class="chat-row">Lantern week</div>'+
          '<div class="side-title">Workspace panes</div>'+
          '<div class="chat-row on">Long-Term Memory</div>'+
        '</div>'+
        '<div class="main">'+
          '<div class="topbar"><span class="ico hot">M</span>LONG-TERM MEMORY<span class="ico wide">Wren</span></div>'+
          '<div class="rail"><span class="rt on">Memory Vault<span class="b">118</span></span><span class="rt">Review Queue<span class="b">838</span></span><span class="rt">Sources</span><span class="rt">Memory Settings</span></div>'+
          '<div class="pane">'+
            '<div class="hdr"><span class="grow">Wren &middot; identity</span><span class="tag">Roleplay</span><span class="tag">Conversation</span><span class="btn">Memory editor</span></div>'+
            '<div class="grp">Contributions in this section<span class="c">91 of 100</span></div>'+
            '<div class="row"><div class="t">Works nights at a clinic<div class="meta">from the character source &middot; recalled 21 times, last 2 Mar</div></div><span class="tag good">in use</span></div>'+
            '<div class="row"><div class="t">Keeps a spare key by the clinic door<div class="meta">from lorebook entry 12 &middot; recalled 4 times, last 27 Feb</div></div><span class="tag good">in use</span></div>'+
            '<div class="row warnrow"><div class="t">Afraid of open water<div class="meta">from a chat summary &middot; recalled 0 times</div></div><span class="tag warn">unreachable</span></div>'+
            '<div class="note-s">0 recalls means unreachable here, not unused</div>'+
            '<div class="hdr"><span class="grow">The projected section &middot; 19,240 of 20,000 characters</span></div>'+
            '<div class="mtr warn"><i class="w96"></i></div>'+
          '</div>'+
        '</div>'+
        '<div class="drawer">'+
          '<div class="drawer-head">Memory details</div>'+
          '<div class="drawer-body">'+
            '<div class="kv"><span class="k">Type</span><span class="v">Character</span></div>'+
            '<div class="kv"><span class="k">Provenance</span><span class="v">Character</span></div>'+
            '<div class="kv"><span class="k">Keywords</span><span class="v">28 / 30</span></div>'+
            '<div class="mtr warn"><i class="w95"></i></div>'+
            '<div class="kv"><span class="k">Memory status</span><span class="v">Vault degraded</span></div>'+
            '<div class="kv"><span class="k">Index built</span><span class="v">2 Mar 09:14</span></div>'+
            '<div class="note-s">Rebuild failed on 14 notes</div>'+
          '</div>'+
        '</div>'+
      '</div></div>',
    phone:
      '<div class="dev"><div class="dev-phone">'+
        '<div class="main">'+
          '<div class="topbar"><span class="ico hot">M</span>LONG-TERM MEMORY<span class="ico wide">Wren</span></div>'+
          '<div class="rail"><span class="rt on">Memories<span class="b">118</span></span><span class="rt">Review<span class="b">838</span></span><span class="rt">Sources</span><span class="rt">Settings</span></div>'+
          '<div class="pane">'+
            '<div class="hdr"><span class="grow">Wren &middot; identity</span><span class="tag">Roleplay</span><span class="btn">Memory editor</span></div>'+
            '<div class="hdr"><span class="sel">identity 19,240</span><span class="sel">timeline 7,420</span><span class="sel">relationships 4,910</span></div>'+
            '<div class="grp">Contributions<span class="c">91 of 100</span></div>'+
            '<div class="row"><div class="t">Works nights at a clinic<div class="meta">character source &middot; recalled 21 times</div></div></div>'+
            '<div class="row"><div class="t">Keeps a spare key by the clinic door<div class="meta">lorebook 12 &middot; recalled 4 times</div></div></div>'+
            '<div class="row warnrow"><div class="t">Afraid of open water<div class="meta">chat summary &middot; recalled 0 times</div></div><span class="tag warn">unreachable</span></div>'+
            '<div class="note-s">0 recalls means unreachable here, not unused</div>'+
            '<div class="hdr"><span class="grow">The projected section &middot; 19,240 of 20,000</span></div>'+
            '<div class="mtr warn"><i class="w96"></i></div>'+
          '</div>'+
          '<div class="inputbar"><span class="btn pri">Memory editor</span><span class="btn">Remove from this chat</span><span class="btn">Delete permanently</span></div>'+
        '</div>'+
      '</div></div>'
  },

  {
    num:"03", label:"Correct it in place", feas:"package", fx:[45,57,58],
    caption:"Editing, scope removal and delete all ride the memory patch route the package already exposes. The frame labels the two figures against the twenty thousand cap apart, <b>412 characters in this contribution</b> against <b>19,240 of 20,000 in the projected section</b>, so the same denominator never means two things. Today the editor trims at 20,000 without a counter and without marking what it cut, and the only sanctioned fix for a wrong claim is to correct the corpus and run the source through extraction again.",
    desk:
      '<div class="dev"><div class="dev-desk">'+
        '<div class="side">'+
          '<div class="side-title">Chats</div>'+
          '<div class="chat-row">Harbour arrival</div>'+
          '<div class="chat-row">Lantern week</div>'+
          '<div class="chat-row">Salt road, part 2</div>'+
          '<div class="side-title">Workspace panes</div>'+
          '<div class="chat-row on">Long-Term Memory</div>'+
        '</div>'+
        '<div class="main">'+
          '<div class="topbar"><span class="ico hot">M</span>LONG-TERM MEMORY<span class="ico wide">Memory editor</span></div>'+
          '<div class="rail"><span class="rt on">Memory Vault<span class="b">118</span></span><span class="rt">Review Queue<span class="b">838</span></span><span class="rt">Sources</span><span class="rt">Memory Settings</span></div>'+
          '<div class="pane split">'+
            '<div class="facets">'+
              '<div class="fgroup">Memory sections</div>'+
              '<div class="fac on">identity<span class="c">19,240</span></div>'+
              '<div class="fac">timeline<span class="c">7,420</span></div>'+
              '<div class="fac">relationships<span class="c">4,910</span></div>'+
              '<div class="fgroup">Available modes</div>'+
              '<div class="fac on">Roleplay<span class="c">on</span></div>'+
              '<div class="fac on">Conversation<span class="c">on</span></div>'+
              '<div class="fac">Game<span class="c">off</span></div>'+
            '</div>'+
            '<div class="listcol">'+
              '<div class="hdr"><span class="grow">Editing one contribution &middot; Wren, identity</span><span class="tag">editing</span><span class="btn">Cancel</span></div>'+
              '<div class="fld area">Works nights at the harbour clinic.</div>'+
              '<div class="row"><div class="t">Keywords: clinic, nights, harbour<div class="meta">3 of the 28 keywords on this memory</div></div><span class="tag warn">28 / 30</span></div>'+
              '<div class="mtr warn"><i class="w95"></i></div>'+
              '<div class="hdr"><span class="grow">Add keyword</span></div>'+
              '<div class="fld ph">lowercase_tag</div>'+
              '<div class="hdr"><span class="grow">412 characters in this contribution</span></div>'+
              '<div class="hdr"><span class="grow">19,240 of 20,000 characters in the projected section</span><span class="tag warn">save blocks at the limit</span></div>'+
              '<div class="mtr warn"><i class="w96"></i></div>'+
              '<div class="hdr"><span class="grow"></span><span class="btn pri">Save</span><span class="btn">Remove from this chat</span><span class="btn">Delete permanently</span></div>'+
              '<div class="note-s">Remove from this chat clears one scope. Delete permanently removes the contribution and leaves the memory.</div>'+
              '<div class="note-s">Memory id derives from the subject name, so renaming the subject creates a second memory.</div>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div></div>',
    phone:
      '<div class="dev"><div class="dev-phone">'+
        '<div class="main">'+
          '<div class="topbar"><span class="ico hot">M</span>LONG-TERM MEMORY<span class="ico wide">Memory editor</span></div>'+
          '<div class="rail"><span class="rt on">Memories<span class="b">118</span></span><span class="rt">Review<span class="b">838</span></span><span class="rt">Sources</span><span class="rt">Settings</span></div>'+
          '<div class="pane">'+
            '<div class="hdr"><span class="grow">Editing one contribution</span><span class="btn">Cancel</span></div>'+
            '<div class="fld area">Works nights at the harbour clinic.</div>'+
            '<div class="row"><div class="t">Keywords: clinic, nights, harbour</div><span class="tag warn">28 / 30</span></div>'+
            '<div class="mtr warn"><i class="w95"></i></div>'+
            '<div class="hdr"><span class="grow">412 characters in this contribution</span></div>'+
            '<div class="hdr"><span class="grow">19,240 of 20,000 in the projected section</span></div>'+
            '<div class="mtr warn"><i class="w96"></i></div>'+
            '<div class="hdr"><span class="sel">Roleplay on</span><span class="sel">Conversation on</span><span class="sel">Game off</span></div>'+
            '<div class="note-s">Memory id derives from the subject name, so renaming creates a second memory</div>'+
          '</div>'+
          '<div class="inputbar"><span class="btn pri">Save</span><span class="btn">Remove from this chat</span><span class="btn">Delete permanently</span></div>'+
        '</div>'+
      '</div></div>'
  },

  {
    num:"04", label:"A stored conflict", feas:"package", fx:[35,56],
    caption:"The frame sets both values facing each other and puts the recall count on the one the proposal would overwrite, so you can weigh the loss before you take it. A third button keeps both in order, because most contradictions in a long story are the situation moving on. Review reads none of this run's <b>47 claims that rewrite a stored value</b> as conflicts, and the vault prints the proposed text without ever putting the existing text beside it.",
    desk:
      '<div class="dev"><div class="dev-desk">'+
        '<div class="side">'+
          '<div class="side-title">Chats</div>'+
          '<div class="chat-row">Harbour arrival</div>'+
          '<div class="chat-row">Lantern week</div>'+
          '<div class="chat-row">Salt road, part 2</div>'+
          '<div class="side-title">Workspace panes</div>'+
          '<div class="chat-row on">Long-Term Memory</div>'+
        '</div>'+
        '<div class="main">'+
          '<div class="topbar"><span class="ico hot">M</span>LONG-TERM MEMORY<span class="ico wide">Conflicts</span></div>'+
          '<div class="rail"><span class="rt on">Memory Vault<span class="b">118</span></span><span class="rt">Review Queue<span class="b">838</span></span><span class="rt">Sources</span><span class="rt">Memory Settings</span></div>'+
          '<div class="pane split">'+
            '<div class="facets">'+
              '<div class="fgroup">Status</div>'+
              '<div class="fac on">Unresolved conflict<span class="c">7</span></div>'+
              '<div class="fac">Near a limit<span class="c">4</span></div>'+
              '<div class="fac">Never recalled<span class="c">63</span></div>'+
              '<div class="fgroup">Incoming</div>'+
              '<div class="fac">Rewrite memory<span class="c">47</span></div>'+
              '<div class="note-s">review reads none of the 47 as conflicts today</div>'+
            '</div>'+
            '<div class="listcol">'+
              '<div class="hdr"><span class="grow">Wren &middot; conflict on identity</span><span class="tag bad">unresolved</span><span class="sel">1 of 7</span></div>'+
              '<div class="grp">Existing <span class="tag">recalled 21 times, last 2 Mar</span></div>'+
              '<div class="row"><div class="t">Works nights at a clinic.<div class="meta">from the character source</div></div></div>'+
              '<div class="grp">Proposed content <span class="tag">from turn t214</span></div>'+
              '<div class="row warnrow"><div class="t">Works days at the inland clinic and takes the late ferry home.<div class="meta">from a chat summary</div></div></div>'+
              '<div class="hdr"><span class="grow"></span><span class="btn">Keep existing</span><span class="btn">Take proposed</span><span class="btn pri">Keep both, in order</span></div>'+
              '<div class="note-s">Merge into memory is blocked for this subject: the keyword union is over the 30 cap.</div>'+
              '<div class="hdr"><span class="grow">Keywords after a merge &middot; 34 of 30</span><span class="tag bad">over the limit</span></div>'+
              '<div class="grp">Remaining conflicts on this vault<span class="c">6</span></div>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div></div>',
    phone:
      '<div class="dev"><div class="dev-phone">'+
        '<div class="main">'+
          '<div class="topbar"><span class="ico hot">M</span>LONG-TERM MEMORY<span class="ico wide">Conflicts</span></div>'+
          '<div class="rail"><span class="rt on">Memories<span class="b">118</span></span><span class="rt">Review<span class="b">838</span></span><span class="rt">Sources</span><span class="rt">Settings</span></div>'+
          '<div class="pane">'+
            '<div class="hdr"><span class="grow">Conflict on identity</span><span class="tag bad">unresolved</span></div>'+
            '<div class="grp">Existing<span class="c">recalled 21 &times;</span></div>'+
            '<div class="row"><div class="t">Works nights at a clinic.<div class="meta">character source &middot; last 2 Mar</div></div></div>'+
            '<div class="grp">Proposed content<span class="c">turn t214</span></div>'+
            '<div class="row warnrow"><div class="t">Works days at the inland clinic and takes the late ferry home.<div class="meta">chat summary</div></div></div>'+
            '<div class="note-s">Merge into memory is blocked for this subject: the keyword union is over the 30 cap</div>'+
            '<div class="hdr"><span class="grow">Keywords after a merge &middot; 34 of 30</span><span class="tag bad">over the limit</span></div>'+
            '<div class="empty">6 more unresolved conflicts</div>'+
          '</div>'+
          '<div class="inputbar"><span class="btn">Keep existing</span><span class="btn">Take proposed</span><span class="btn pri">Keep both</span></div>'+
        '</div>'+
      '</div></div>'
  }

];

FLOWS.j4 = [
  {n:"01", t:"Filter", d:"same facets, over what is stored"},
  {n:"02", t:"Open", d:"sections, provenance, recall"},
  {n:"03", t:"Correct", d:"edit, remove from this chat, delete permanently"},
  {n:"04", t:"Resolve", d:"existing beside proposed", term:true}
];

TRADE.j4 = {
  win:[
    "The header count is the number recall can reach, because the 43 source notes are held out of the default view.",
    "Each stored line names the contribution it came from and how often it has been injected.",
    "A zero recall count is qualified by index health, so it is never read as unimportant.",
    "Correcting a wrong claim is an edit on the memory rather than a corpus fix and a re-ingest."
  ],
  cost:[
    "Recall counts invite pruning by popularity, which on a dead semantic lane prunes the unreachable instead of the unused.",
    "Delete permanently removes a contribution with no undo behind it, only the backup export.",
    "The vault now carries two counting systems, characters and contributions, and both must stay labelled apart.",
    "Memory ids derive from the subject name, so a rename still forks the memory rather than moving it."
  ],
  build:[
    "The memory patch route already exists and already carries edit, scope and delete.",
    "Per-chunk recall counts are written to disk today and returned by no route, so one read is needed.",
    "The facet engine is shared with review, run against stored memories instead of pending mutations.",
    "Index health is already reported, so the caveat on a zero count is a join, not a new signal."
  ]
};
