/* Journey 4 — Browse and correct. Canonical figures: 118 memories, 43 source
   notes hidden, Wren 19,240 / 20,000, 28 / 30 keywords, recalled 21 times. */

STATES.j4 = [

  {
    num:"01", label:"Vault browser", feas:"package", fx:[5,55],
    caption:"The same facet engine as review, run over what is stored rather than what is proposed: type, subject, status, mode eligibility and cap pressure. Source notes are excluded by default, so the header reads <b>118 memories and 43 source notes hidden</b> and the count is the number recall can actually reach. Today free-text search works well, every total silently includes the 43 audit records, and they sort to the top.",
    desk:
      '<div class="dev"><div class="dev-desk">'+
        '<div class="side">'+
          '<div class="side-title">Chats</div>'+
          '<div class="chat-row">Harbour arrival</div>'+
          '<div class="chat-row">Lantern week</div>'+
          '<div class="chat-row">Salt road, part 2</div>'+
          '<div class="side-title">Workspace</div>'+
          '<div class="chat-row on">Long-term memory</div>'+
        '</div>'+
        '<div class="main">'+
          '<div class="topbar"><span class="ico hot">M</span>LONG-TERM MEMORY<span class="ico wide">vault-01</span><span class="ico">?</span></div>'+
          '<div class="rail"><span class="rt on">Vault<span class="b">118</span></span><span class="rt">Review<span class="b">838</span></span><span class="rt">Sources</span><span class="rt">Settings</span></div>'+
          '<div class="pane split">'+
            '<div class="facets">'+
              '<div class="fgroup">Type</div>'+
              '<div class="fac on">Character<span class="c">54</span></div>'+
              '<div class="fac">World<span class="c">31</span></div>'+
              '<div class="fac">Timeline<span class="c">18</span></div>'+
              '<div class="fac">Source notes<span class="c">43</span></div>'+
              '<div class="note-s">hidden by default</div>'+
              '<div class="fgroup">Status and mode</div>'+
              '<div class="fac">Unresolved conflict<span class="c">7</span></div>'+
              '<div class="fac">Roleplay only<span class="c">22</span></div>'+
              '<div class="fgroup">Cap pressure</div>'+
              '<div class="fac">Over 90 per cent<span class="c">4</span></div>'+
              '<div class="fac">Never recalled<span class="c">63</span></div>'+
            '</div>'+
            '<div class="listcol">'+
              '<div class="hdr"><span class="grow">118 memories &middot; 43 source notes hidden</span><span class="sel">search memories</span><span class="sel">sort: size</span></div>'+
              '<div class="grp">Wren <span class="tag">character note</span><span class="c">3 sections</span></div>'+
              '<div class="row warnrow"><div class="t">Wren &middot; identity<div class="meta">19,240 / 20,000 characters &middot; recalled 21 times</div></div><span class="tag warn">near cap</span></div>'+
              '<div class="row"><div class="t">Wren &middot; timeline<div class="meta">eligible in roleplay only</div></div><span class="tag">roleplay</span></div>'+
              '<div class="row"><div class="t">Wren &middot; relationships<div class="meta">4,910 / 20,000 characters</div></div><span class="tag bad">1 conflict</span></div>'+
              '<div class="grp">Harbour district <span class="tag">world note</span><span class="c">2 sections</span></div>'+
              '<div class="row"><div class="t">Harbour district &middot; setting<div class="meta">6,180 / 20,000 characters</div></div></div>'+
              '<div class="mtr"><i class="w30"></i></div>'+
              '<div class="empty">112 more memories, 43 source notes held back</div>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div></div>',
    phone:
      '<div class="dev"><div class="dev-phone">'+
        '<div class="main">'+
          '<div class="topbar"><span class="ico hot">M</span>MEMORY<span class="ico wide">vault</span></div>'+
          '<div class="rail"><span class="rt on">Vault<span class="b">118</span></span><span class="rt">Review<span class="b">838</span></span><span class="rt">Sources</span><span class="rt">Settings</span></div>'+
          '<div class="pane">'+
            '<div class="hdr"><span class="grow">118 memories</span><span class="tag">43 source notes hidden</span></div>'+
            '<div class="hdr"><span class="sel">search memories</span><span class="sel">sort: size</span><span class="grow"></span><span class="btn">Facets</span></div>'+
            '<div class="grp">Wren<span class="c">3 sections</span></div>'+
            '<div class="row warnrow"><div class="t">Wren &middot; identity<div class="meta">19,240 / 20,000 &middot; recalled 21 times</div></div><span class="tag warn">near cap</span></div>'+
            '<div class="row"><div class="t">Wren &middot; timeline<div class="meta">roleplay only</div></div></div>'+
            '<div class="row"><div class="t">Wren &middot; relationships<div class="meta">4,910 / 20,000</div></div><span class="tag bad">1 conflict</span></div>'+
            '<div class="grp">Harbour district<span class="c">2 sections</span></div>'+
            '<div class="row"><div class="t">Harbour district &middot; setting<div class="meta">6,180 / 20,000</div></div></div>'+
            '<div class="mtr"><i class="w30"></i></div>'+
            '<div class="empty">112 more memories</div>'+
          '</div>'+
          '<div class="inputbar"><span class="btn">Type</span><span class="btn">Status</span><span class="btn">Cap pressure</span></div>'+
        '</div>'+
      '</div></div>'
  },

  {
    num:"02", label:"One memory, with use", feas:"package", fx:[47,58],
    caption:"Two facts already written to disk, surfaced on the note: which contribution each stored line came from, and how many times that line has been injected. The line with <b>0 recalls</b> carries the caveat, because on this vault the semantic lane is dead and the index rebuild failed on 14 notes, so zero means unreachable rather than unused. Today the editor is one free-form text area, with no link back to the evidence unit and no recall count on any route.",
    desk:
      '<div class="dev"><div class="dev-desk drawer">'+
        '<div class="side">'+
          '<div class="side-title">Chats</div>'+
          '<div class="chat-row">Harbour arrival</div>'+
          '<div class="chat-row">Lantern week</div>'+
          '<div class="side-title">Workspace</div>'+
          '<div class="chat-row on">Long-term memory</div>'+
        '</div>'+
        '<div class="main">'+
          '<div class="topbar"><span class="ico hot">M</span>LONG-TERM MEMORY<span class="ico wide">Wren</span></div>'+
          '<div class="rail"><span class="rt on">Vault<span class="b">118</span></span><span class="rt">Review<span class="b">838</span></span><span class="rt">Sources</span><span class="rt">Settings</span></div>'+
          '<div class="pane split">'+
            '<div class="facets">'+
              '<div class="fgroup">Sections</div>'+
              '<div class="fac on">identity<span class="c">19,240</span></div>'+
              '<div class="fac">timeline<span class="c">7,420</span></div>'+
              '<div class="fac">relationships<span class="c">4,910</span></div>'+
              '<div class="fgroup">Where it came from</div>'+
              '<div class="fac">Character card<span class="c">46</span></div>'+
              '<div class="fac">Chat summaries<span class="c">39</span></div>'+
              '<div class="fac">Lorebook<span class="c">6</span></div>'+
              '<div class="fgroup">Use</div>'+
              '<div class="fac">Not recalled on this note<span class="c">28</span></div>'+
            '</div>'+
            '<div class="listcol">'+
              '<div class="hdr"><span class="grow">Wren &middot; identity</span><span class="tag">roleplay</span><span class="tag">chat</span><span class="btn">Edit</span></div>'+
              '<div class="grp">Contributions in this section<span class="c">91 of 100</span></div>'+
              '<div class="row"><div class="t">Works nights at a clinic<div class="meta">from the character card &middot; recalled 21 times, last 2 Mar</div></div><span class="tag good">in use</span></div>'+
              '<div class="row"><div class="t">Keeps a spare key by the clinic door<div class="meta">from lorebook entry 12 &middot; recalled 4 times, last 27 Feb</div></div><span class="tag good">in use</span></div>'+
              '<div class="row warnrow"><div class="t">Afraid of open water<div class="meta">from a chat summary &middot; recalled 0 times</div></div><span class="tag warn">unreachable</span></div>'+
              '<div class="note-s">Semantic lane dead and the index rebuild failed on 14 notes, so 0 means unreachable, not unused</div>'+
              '<div class="hdr"><span class="grow">The projected section &middot; 19,240 of 20,000 characters</span></div>'+
              '<div class="mtr warn"><i class="w96"></i></div>'+
            '</div>'+
          '</div>'+
        '</div>'+
        '<div class="drawer">'+
          '<div class="drawer-head">This note</div>'+
          '<div class="drawer-body">'+
            '<div class="kv"><span class="k">type</span><span class="v">character</span></div>'+
            '<div class="kv"><span class="k">keywords</span><span class="v">28 / 30</span></div>'+
            '<div class="mtr warn"><i class="w95"></i></div>'+
            '<div class="kv"><span class="k">contributions</span><span class="v">91 / 100</span></div>'+
            '<div class="mtr warn"><i class="w90"></i></div>'+
            '<div class="kv"><span class="k">recalled</span><span class="v">21 &times;</span></div>'+
            '<div class="kv"><span class="k">last</span><span class="v">2 Mar</span></div>'+
            '<div class="kv"><span class="k">index</span><span class="v">dirty</span></div>'+
            '<div class="note-s">Built 2 Mar 09:14, rebuild failed on 14 notes</div>'+
          '</div>'+
        '</div>'+
      '</div></div>',
    phone:
      '<div class="dev"><div class="dev-phone">'+
        '<div class="main">'+
          '<div class="topbar"><span class="ico hot">M</span>MEMORY<span class="ico wide">Wren</span></div>'+
          '<div class="rail"><span class="rt on">Vault<span class="b">118</span></span><span class="rt">Review<span class="b">838</span></span><span class="rt">Sources</span><span class="rt">Settings</span></div>'+
          '<div class="pane">'+
            '<div class="hdr"><span class="grow">Wren &middot; identity</span><span class="tag">roleplay</span><span class="btn">Edit</span></div>'+
            '<div class="hdr"><span class="sel">identity 19,240</span><span class="sel">timeline 7,420</span><span class="sel">relationships 4,910</span></div>'+
            '<div class="grp">Contributions<span class="c">91 of 100</span></div>'+
            '<div class="row"><div class="t">Works nights at a clinic<div class="meta">character card &middot; recalled 21 times</div></div></div>'+
            '<div class="row"><div class="t">Keeps a spare key by the clinic door<div class="meta">lorebook 12 &middot; recalled 4 times</div></div></div>'+
            '<div class="row warnrow"><div class="t">Afraid of open water<div class="meta">chat summary &middot; recalled 0 times</div></div><span class="tag warn">unreachable</span></div>'+
            '<div class="note-s">Semantic lane dead, index rebuild failed, so 0 means unreachable</div>'+
            '<div class="hdr"><span class="grow">The projected section &middot; 19,240 of 20,000</span></div>'+
            '<div class="mtr warn"><i class="w96"></i></div>'+
          '</div>'+
          '<div class="inputbar"><span class="btn pri">Edit</span><span class="btn">Stop using here</span><span class="btn">Forget</span></div>'+
        '</div>'+
      '</div></div>'
  },

  {
    num:"03", label:"Correct it in place", feas:"package", fx:[45,57,58],
    caption:"Editing, scope removal and delete all ride the note patch route that already exists. The two figures against the twenty thousand cap are labelled apart, <b>412 characters in this contribution</b> against <b>19,240 of 20,000 in the projected section</b>, so the same denominator never means two things. Today the editor trims at 20,000 with no counter and no marker of what it cut, and the sanctioned fix for a wrong claim is to correct the corpus and ingest the source again.",
    desk:
      '<div class="dev"><div class="dev-desk">'+
        '<div class="side">'+
          '<div class="side-title">Chats</div>'+
          '<div class="chat-row">Harbour arrival</div>'+
          '<div class="chat-row">Lantern week</div>'+
          '<div class="chat-row">Salt road, part 2</div>'+
          '<div class="side-title">Workspace</div>'+
          '<div class="chat-row on">Long-term memory</div>'+
        '</div>'+
        '<div class="main">'+
          '<div class="topbar"><span class="ico hot">M</span>LONG-TERM MEMORY<span class="ico wide">editing</span></div>'+
          '<div class="rail"><span class="rt on">Vault<span class="b">118</span></span><span class="rt">Review<span class="b">838</span></span><span class="rt">Sources</span><span class="rt">Settings</span></div>'+
          '<div class="pane split">'+
            '<div class="facets">'+
              '<div class="fgroup">Sections</div>'+
              '<div class="fac on">identity<span class="c">19,240</span></div>'+
              '<div class="fac">timeline<span class="c">7,420</span></div>'+
              '<div class="fac">relationships<span class="c">4,910</span></div>'+
              '<div class="fgroup">Scope</div>'+
              '<div class="fac on">roleplay<span class="c">on</span></div>'+
              '<div class="fac on">chat<span class="c">on</span></div>'+
              '<div class="fac">assistant<span class="c">off</span></div>'+
            '</div>'+
            '<div class="listcol">'+
              '<div class="hdr"><span class="grow">Editing one contribution &middot; Wren, identity</span><span class="tag">editing</span><span class="btn">Cancel</span></div>'+
              '<div class="row on"><div class="t">Works nights at the harbour clinic.<div class="meta">editable in place &middot; caret at end</div></div></div>'+
              '<div class="row"><div class="t">keywords: clinic, nights, harbour<div class="meta">3 of the 28 keywords on this note</div></div><span class="tag warn">28 / 30</span></div>'+
              '<div class="mtr warn"><i class="w95"></i></div>'+
              '<div class="hdr"><span class="grow">412 characters in this contribution</span></div>'+
              '<div class="hdr"><span class="grow">19,240 of 20,000 characters in the projected section</span><span class="tag warn">save blocks at the cap</span></div>'+
              '<div class="mtr warn"><i class="w96"></i></div>'+
              '<div class="hdr"><span class="grow"></span><span class="btn pri">Save</span><span class="btn">Stop using here</span><span class="btn">Forget</span></div>'+
              '<div class="note-s">Stop using here removes one mode. Forget deletes the contribution and leaves the note.</div>'+
              '<div class="note-s">Note id derives from the subject name, so renaming the subject creates a second note.</div>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div></div>',
    phone:
      '<div class="dev"><div class="dev-phone">'+
        '<div class="main">'+
          '<div class="topbar"><span class="ico hot">M</span>MEMORY<span class="ico wide">editing</span></div>'+
          '<div class="rail"><span class="rt on">Vault<span class="b">118</span></span><span class="rt">Review<span class="b">838</span></span><span class="rt">Sources</span><span class="rt">Settings</span></div>'+
          '<div class="pane">'+
            '<div class="hdr"><span class="grow">Editing one contribution</span><span class="btn">Cancel</span></div>'+
            '<div class="row on"><div class="t">Works nights at the harbour clinic.<div class="meta">editable in place</div></div></div>'+
            '<div class="row"><div class="t">keywords: clinic, nights, harbour</div><span class="tag warn">28 / 30</span></div>'+
            '<div class="mtr warn"><i class="w95"></i></div>'+
            '<div class="hdr"><span class="grow">412 characters in this contribution</span></div>'+
            '<div class="hdr"><span class="grow">19,240 of 20,000 in the projected section</span></div>'+
            '<div class="mtr warn"><i class="w96"></i></div>'+
            '<div class="hdr"><span class="sel">roleplay on</span><span class="sel">chat on</span><span class="sel">assistant off</span></div>'+
            '<div class="note-s">Note id derives from the subject name, so renaming creates a second note</div>'+
          '</div>'+
          '<div class="inputbar"><span class="btn pri">Save</span><span class="btn">Stop using here</span><span class="btn">Forget</span></div>'+
        '</div>'+
      '</div></div>'
  },

  {
    num:"04", label:"A stored conflict", feas:"package", fx:[35,56],
    caption:"Both values face each other and the recall count sits on the one about to be overwritten, so the loss in taking the proposal is legible before it is taken. A third option keeps both in order, because most contradictions in a long story are the situation moving on. Of the <b>47 claims in this run that overwrite a stored value</b>, review reads none of them as conflicts, and the vault prints the proposed text without ever putting the existing text beside it.",
    desk:
      '<div class="dev"><div class="dev-desk">'+
        '<div class="side">'+
          '<div class="side-title">Chats</div>'+
          '<div class="chat-row">Harbour arrival</div>'+
          '<div class="chat-row">Lantern week</div>'+
          '<div class="chat-row">Salt road, part 2</div>'+
          '<div class="side-title">Workspace</div>'+
          '<div class="chat-row on">Long-term memory</div>'+
        '</div>'+
        '<div class="main">'+
          '<div class="topbar"><span class="ico hot">M</span>LONG-TERM MEMORY<span class="ico wide">conflict</span></div>'+
          '<div class="rail"><span class="rt on">Vault<span class="b">118</span></span><span class="rt">Review<span class="b">838</span></span><span class="rt">Sources</span><span class="rt">Settings</span></div>'+
          '<div class="pane split">'+
            '<div class="facets">'+
              '<div class="fgroup">Status</div>'+
              '<div class="fac on">Unresolved conflict<span class="c">7</span></div>'+
              '<div class="fac">Near a cap<span class="c">4</span></div>'+
              '<div class="fac">Never recalled<span class="c">63</span></div>'+
              '<div class="fgroup">Incoming</div>'+
              '<div class="fac">Overwrites a value<span class="c">47</span></div>'+
              '<div class="note-s">review reads none of the 47 as conflicts today</div>'+
            '</div>'+
            '<div class="listcol">'+
              '<div class="hdr"><span class="grow">Wren &middot; conflict on identity</span><span class="tag bad">unresolved</span><span class="sel">1 of 7</span></div>'+
              '<div class="grp">Existing <span class="tag">recalled 21 times, last 2 Mar</span></div>'+
              '<div class="row"><div class="t">Works nights at a clinic.<div class="meta">from the character card</div></div></div>'+
              '<div class="grp">Proposed <span class="tag">from turn t214</span></div>'+
              '<div class="row warnrow"><div class="t">Works days at the inland clinic and takes the late ferry home.<div class="meta">from a chat summary</div></div></div>'+
              '<div class="hdr"><span class="grow"></span><span class="btn">Keep existing</span><span class="btn">Take proposed</span><span class="btn pri">Keep both, in order</span></div>'+
              '<div class="note-s">Merging the two notes for this subject is blocked: the keyword union is over the 30 cap.</div>'+
              '<div class="hdr"><span class="grow">Keywords after a merge &middot; 34 of 30</span></div>'+
              '<div class="mtr warn"><i class="w95"></i></div>'+
              '<div class="grp">Remaining conflicts on this vault<span class="c">6</span></div>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div></div>',
    phone:
      '<div class="dev"><div class="dev-phone">'+
        '<div class="main">'+
          '<div class="topbar"><span class="ico hot">M</span>MEMORY<span class="ico wide">conflict</span></div>'+
          '<div class="rail"><span class="rt on">Vault<span class="b">118</span></span><span class="rt">Review<span class="b">838</span></span><span class="rt">Sources</span><span class="rt">Settings</span></div>'+
          '<div class="pane">'+
            '<div class="hdr"><span class="grow">Conflict on identity</span><span class="tag bad">unresolved</span></div>'+
            '<div class="grp">Existing<span class="c">recalled 21 &times;</span></div>'+
            '<div class="row"><div class="t">Works nights at a clinic.<div class="meta">character card &middot; last 2 Mar</div></div></div>'+
            '<div class="grp">Proposed<span class="c">turn t214</span></div>'+
            '<div class="row warnrow"><div class="t">Works days at the inland clinic and takes the late ferry home.<div class="meta">chat summary</div></div></div>'+
            '<div class="note-s">Merging the two notes for this subject is blocked: the keyword union is over the 30 cap</div>'+
            '<div class="hdr"><span class="grow">Keywords after a merge &middot; 34 of 30</span></div>'+
            '<div class="mtr warn"><i class="w95"></i></div>'+
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
  {n:"03", t:"Correct", d:"edit, stop using here, forget"},
  {n:"04", t:"Resolve", d:"existing beside proposed", term:true}
];

TRADE.j4 = {
  win:[
    "The header count is the number recall can reach, because the 43 source notes are held out of the default view.",
    "Each stored line names the contribution it came from and how often it has been injected.",
    "A zero recall count is qualified by index health, so it is never read as unimportant.",
    "Correcting a wrong claim is an edit on the note rather than a corpus fix and a re-ingest."
  ],
  cost:[
    "Recall counts invite pruning by popularity, which on a dead semantic lane prunes the unreachable instead of the unused.",
    "Forget deletes a contribution with no undo behind it, only the backup export.",
    "The vault now carries two counting systems, characters and contributions, and both must stay labelled apart.",
    "Note ids derive from the subject name, so a rename still forks the note rather than moving it."
  ],
  build:[
    "The note patch route already exists and already carries edit, scope and delete.",
    "Per-chunk recall counts are written to disk today and returned by no route, so one read is needed.",
    "The facet engine is shared with review, run against stored notes instead of pending mutations.",
    "Index health is already reported, so the caveat on a zero count is a join, not a new signal."
  ]
};
