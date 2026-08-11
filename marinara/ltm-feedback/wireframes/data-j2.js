STATES.j2 = [
  {
    num: "01", label: "Narrow, then choose", feas: "package", fx: [3, 28, 30],
    caption: 'The filter <b>finds, and nothing else</b>: it narrows 60 chats and 41 characters until the material is reachable, and it decides nothing about the run. Every kind carries a count, including the kind the package can never ingest, so the screen states the ceiling on what a chat can teach up front.',
    desk: '<div class="dev"><div class="dev-desk">' +
      '<div class="side">' +
        '<div class="side-title">Sources</div>' +
        '<div class="chat-row">All chats · 60</div>' +
        '<div class="chat-row">All characters · 41</div>' +
        '<div class="chat-row on">Search: harbour</div>' +
      '</div>' +
      '<div class="main">' +
        '<div class="topbar"><span class="ico hot">M</span><span>LONG-TERM MEMORY</span></div>' +
        '<div class="rail"><span class="rt">Memory Vault</span><span class="rt">Review Queue</span>' +
          '<span class="rt on">Sources</span><span class="rt">Memory Settings</span></div>' +
        '<div class="pane split">' +
          '<div class="facets">' +
            '<div class="fgroup">Source types</div>' +
            '<div class="fac on">Chats<span class="c">6</span></div>' +
            '<div class="fac on">Characters<span class="c">2</span></div>' +
            '<div class="fac">Lorebooks<span class="c">33</span></div>' +
            '<div class="fgroup">Not filtered</div>' +
            '<div class="fac">All chats<span class="c">60</span></div>' +
            '<div class="fac">All characters<span class="c">41</span></div>' +
            '<div class="note-s">Narrows the list. Sets no import scope.</div>' +
          '</div>' +
          '<div class="listcol">' +
            '<div class="hdr"><span class="fld">harbour</span><span class="grow"></span><span class="btn">Clear</span></div>' +
            '<div class="grp">Ready to import<span class="c">97 sources</span></div>' +
            '<div class="row on"><span class="cb on"></span><span class="t">Characters<div class="meta">41</div></span><span class="tag good">New</span></div>' +
            '<div class="row on"><span class="cb on"></span><span class="t">Lorebooks<div class="meta">33</div></span><span class="tag good">New</span></div>' +
            '<div class="row warnrow"><span class="cb"></span><span class="t">Chat Summaries<div class="meta">23 of 60 chats</div></span><span class="tag warn">37 unsummarised</span></div>' +
            '<div class="row badrow"><span class="cb"></span><span class="t">Raw transcripts<div class="meta">not a source kind</div></span><span class="tag bad">n/a</span></div>' +
            '<div class="hdr"><span class="grow">Selected 74 · one run · concurrency 4</span><span class="btn pri">Next</span></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div></div>',
    phone: '<div class="dev"><div class="dev-phone">' +
      '<div class="main">' +
        '<div class="topbar"><span class="ico hot">M</span><span>SOURCES</span></div>' +
        '<div class="rail"><span class="rt">Memories</span><span class="rt">Review</span>' +
          '<span class="rt on">Sources</span><span class="rt">Settings</span></div>' +
        '<div class="pane">' +
          '<div class="hdr"><span class="fld">harbour</span><span class="grow"></span><span class="sel">Filter · 3</span></div>' +
          '<div class="row"><span class="tag">6 chats</span><span class="tag">2 characters</span><span class="tag">Clear</span></div>' +
          '<div class="grp">Ready to import<span class="c">97</span></div>' +
          '<div class="row on"><span class="cb on"></span><span class="t">Characters<div class="meta">41</div></span><span class="tag good">New</span></div>' +
          '<div class="row on"><span class="cb on"></span><span class="t">Lorebooks<div class="meta">33</div></span><span class="tag good">New</span></div>' +
          '<div class="row warnrow"><span class="cb"></span><span class="t">Chat Summaries<div class="meta">23 of 60 chats</div></span><span class="tag warn">37</span></div>' +
          '<div class="row badrow"><span class="cb"></span><span class="t">Raw transcripts<div class="meta">not a source kind</div></span><span class="tag bad">n/a</span></div>' +
          '<div class="note-s">Selected 74 · one run · concurrency 4</div>' +
          '<div class="row"><span class="btn pri">Next</span></div>' +
        '</div>' +
      '</div>' +
    '</div></div>'
  },
  {
    num: "02", label: "Scope derived from the selection", feas: "package", fx: [17, 18],
    caption: 'The package <b>derives the trusted-subject roster from the 74 selected sources and counts it before any model call</b>. Today the import target both narrows the list and builds the scope, so the widest target passes no scope, produces an empty roster, and rejects every candidate as untrusted only after you have paid for the call. Here a zero blocks the run instead of starting it, and this screen lets you edit the persona.',
    desk: '<div class="dev"><div class="dev-desk">' +
      '<div class="side">' +
        '<div class="side-title">Sources</div>' +
        '<div class="chat-row">All chats · 60</div>' +
        '<div class="chat-row">All characters · 41</div>' +
        '<div class="chat-row on">Search: harbour</div>' +
      '</div>' +
      '<div class="main">' +
        '<div class="topbar"><span class="ico hot">M</span><span>LONG-TERM MEMORY</span></div>' +
        '<div class="rail"><span class="rt">Memory Vault</span><span class="rt">Review Queue</span>' +
          '<span class="rt on">Sources</span><span class="rt">Memory Settings</span></div>' +
        '<div class="pane">' +
          '<div class="hdr"><span class="grow">Import scope · who this run may write about</span><span class="tag">derived</span></div>' +
          '<div class="grp">From your selection<span class="c">74 sources</span></div>' +
          '<div class="row"><span class="t">Chat<div class="meta">6 in scope</div></span><span class="btn">Choose scope</span></div>' +
          '<div class="row"><span class="t">Character<div class="meta">2 in scope</div></span><span class="btn">Choose scope</span></div>' +
          '<div class="row"><span class="t">Persona<div class="meta">1 in scope, editable here</div></span><span class="btn">Choose scope</span></div>' +
          '<div class="grp">Trusted subjects<span class="c">9 in roster</span></div>' +
          '<div class="row"><span class="t">Roster counted before the model call<div class="meta">an empty roster blocks the run, it does not start it</div></span><span class="tag good">9</span></div>' +
          '<div class="hdr"><span class="grow">74 sources · 1 run</span><span class="btn">Back</span><span class="btn pri">Extract to review</span></div>' +
        '</div>' +
      '</div>' +
    '</div></div>',
    phone: '<div class="dev"><div class="dev-phone">' +
      '<div class="main">' +
        '<div class="topbar"><span class="ico hot">M</span><span>IMPORT SCOPE</span></div>' +
        '<div class="rail"><span class="rt">Memories</span><span class="rt">Review</span>' +
          '<span class="rt on">Sources</span><span class="rt">Settings</span></div>' +
        '<div class="pane">' +
          '<div class="hdr"><span class="grow">Who this run may write about</span><span class="tag">derived</span></div>' +
          '<div class="grp">From your selection<span class="c">74</span></div>' +
          '<div class="row"><span class="t">Chat<div class="meta">6 in scope</div></span><span class="btn">Edit</span></div>' +
          '<div class="row"><span class="t">Character<div class="meta">2 in scope</div></span><span class="btn">Edit</span></div>' +
          '<div class="row"><span class="t">Persona<div class="meta">1 in scope</div></span><span class="btn">Edit</span></div>' +
          '<div class="grp">Trusted subjects<span class="c">9</span></div>' +
          '<div class="note-s">Counted before the model call. An empty roster blocks the run.</div>' +
          '<div class="row"><span class="btn pri">Extract to review</span><span class="btn">Back</span></div>' +
        '</div>' +
      '</div>' +
    '</div></div>'
  },
  {
    num: "03", label: "A long run, reporting itself", feas: "restart", fx: [26, 23, 24],
    caption: 'The package writes per-source completion to its own store as the run proceeds, and the panel <b>polls a status route</b> for it, because nothing can push to the client. It names truncation on the source that hit it and retries, instead of throwing the response away. Today one synchronous request returns a single terminal report, so a run of tens of minutes looks exactly like a hang.',
    desk: '<div class="dev"><div class="dev-desk">' +
      '<div class="side">' +
        '<div class="side-title">Sources</div>' +
        '<div class="chat-row">All chats · 60</div>' +
        '<div class="chat-row">All characters · 41</div>' +
        '<div class="chat-row on">Search: harbour</div>' +
      '</div>' +
      '<div class="main">' +
        '<div class="topbar"><span class="ico hot">M</span><span>EXTRACTING</span><span class="ico wide">t+12m</span></div>' +
        '<div class="rail"><span class="rt">Memory Vault</span><span class="rt">Review Queue</span>' +
          '<span class="rt on">Sources</span><span class="rt">Memory Settings</span></div>' +
        '<div class="pane">' +
          '<div class="hdr"><span class="grow">Extracting</span><span class="tag warn">Running</span><span class="btn">Cancel</span></div>' +
          '<div class="mtr acc"><i class="w50"></i></div>' +
          '<div class="kv"><span class="k">Sources done</span><span class="v">37 of 74</span></div>' +
          '<div class="kv"><span class="k">Elapsed</span><span class="v">12m 04s</span></div>' +
          '<div class="kv"><span class="k">Status polled</span><span class="v">every 3s</span></div>' +
          '<div class="grp">Last completed<span class="c">18 kept</span></div>' +
          '<div class="row"><span class="t">Harbour district lorebook<div class="meta">finished 14s ago · 18 kept, 5 rejected</div></span><span class="tag good">Succeeded</span></div>' +
          '<div class="row warnrow"><span class="t">2 sources returned truncated output<div class="meta">retried at a lower unit count, not discarded</div></span><span class="tag warn">retried</span></div>' +
          '<div class="note-s">Progress comes from a status route, so it ships at a release boundary.</div>' +
        '</div>' +
      '</div>' +
    '</div></div>',
    phone: '<div class="dev"><div class="dev-phone">' +
      '<div class="main">' +
        '<div class="topbar"><span class="ico hot">M</span><span>EXTRACTING</span><span class="ico wide">t+12m</span></div>' +
        '<div class="rail"><span class="rt">Memories</span><span class="rt">Review</span>' +
          '<span class="rt on">Sources</span><span class="rt">Settings</span></div>' +
        '<div class="pane">' +
          '<div class="hdr"><span class="grow">Extracting</span><span class="tag warn">Running</span><span class="btn">Cancel</span></div>' +
          '<div class="mtr acc"><i class="w50"></i></div>' +
          '<div class="kv"><span class="k">Sources done</span><span class="v">37 of 74</span></div>' +
          '<div class="kv"><span class="k">Elapsed</span><span class="v">12m 04s</span></div>' +
          '<div class="kv"><span class="k">Polled</span><span class="v">every 3s</span></div>' +
          '<div class="grp">Last completed<span class="c">18 kept</span></div>' +
          '<div class="row"><span class="t">Harbour district lorebook<div class="meta">14s ago</div></span><span class="tag good">Succeeded</span></div>' +
          '<div class="row warnrow"><span class="t">2 truncated<div class="meta">retried at a lower unit count</div></span><span class="tag warn">retried</span></div>' +
        '</div>' +
      '</div>' +
    '</div></div>'
  },
  {
    num: "04", label: "What was kept, what was lost", feas: "package", fx: [21, 19, 20, 22],
    caption: 'Totals first, then <b>one row per cause summing to 304</b>, so the reader takes ninety-six instances of one problem in once and starts recovery here. The largest single cause is a schema defect rather than a judgement: the schema declares optional fields optional and never nullable, so an explicit null throws the whole claim away. Review opens on the 838 that survived; this screen recovers the rejected candidates rather than queueing them.',
    desk: '<div class="dev"><div class="dev-desk">' +
      '<div class="side">' +
        '<div class="side-title">Sources</div>' +
        '<div class="chat-row">All chats · 60</div>' +
        '<div class="chat-row">All characters · 41</div>' +
        '<div class="chat-row on">Search: harbour</div>' +
      '</div>' +
      '<div class="main">' +
        '<div class="topbar"><span class="ico hot">M</span><span>SOURCE IMPORT COMPLETE</span><span class="ico wide">24m</span></div>' +
        '<div class="rail"><span class="rt">Memory Vault</span><span class="rt new">Review Queue<span class="b">838</span></span>' +
          '<span class="rt on">Sources</span><span class="rt">Memory Settings</span></div>' +
        '<div class="pane">' +
          '<div class="hdr"><span class="grow">1,142 candidates · 838 kept · 304 rejected</span><span class="tag warn">Partial success</span></div>' +
          '<div class="grp">Suggestions that weren\'t saved<span class="c">304</span></div>' +
          '<div class="row badrow"><span class="t">The candidate\'s subject could not be trusted.<div class="meta">141 · no roster entry for the named subject</div></span><span class="btn">Recover manually</span></div>' +
          '<div class="row badrow"><span class="t">The extracted candidate had an invalid format.<div class="meta">96 · optional field returned null, whole claim discarded</div></span><span class="btn">Recover manually</span></div>' +
          '<div class="row warnrow"><span class="t">The candidate did not include enough source evidence.<div class="meta">44</div></span><span class="btn">Recover manually</span></div>' +
          '<div class="row warnrow"><span class="t">The candidate used an unsupported memory category.<div class="meta">23</div></span><span class="btn">Recover manually</span></div>' +
          '<div class="hdr"><span class="grow">Every row is recoverable</span><span class="btn">Export</span><span class="btn pri">Review proposed memories</span></div>' +
        '</div>' +
      '</div>' +
    '</div></div>',
    phone: '<div class="dev"><div class="dev-phone">' +
      '<div class="main">' +
        '<div class="topbar"><span class="ico hot">M</span><span>IMPORT COMPLETE</span><span class="ico wide">24m</span></div>' +
        '<div class="rail"><span class="rt">Memories</span><span class="rt new">Review<span class="b">838</span></span>' +
          '<span class="rt on">Sources</span><span class="rt">Settings</span></div>' +
        '<div class="pane">' +
          '<div class="hdr"><span class="grow">1,142 · 838 kept · 304 rejected</span><span class="tag warn">Partial</span></div>' +
          '<div class="grp">Suggestions that weren\'t saved<span class="c">304</span></div>' +
          '<div class="row badrow"><span class="t">Subject could not be trusted<div class="meta">141</div></span><span class="btn">Recover</span></div>' +
          '<div class="row badrow"><span class="t">Invalid format<div class="meta">96 · null in an optional field</div></span><span class="btn">Recover</span></div>' +
          '<div class="row warnrow"><span class="t">Not enough source evidence<div class="meta">44</div></span><span class="btn">Recover</span></div>' +
          '<div class="row warnrow"><span class="t">Unsupported memory category<div class="meta">23</div></span><span class="btn">Recover</span></div>' +
          '<div class="row"><span class="btn pri">Review Queue</span></div>' +
        '</div>' +
      '</div>' +
    '</div></div>'
  }
];

FLOWS.j2 = [
  { n: "01", t: "Narrow", d: "60 chats and 41 characters down to 97 sources" },
  { n: "02", t: "Confirm scope", d: "9 trusted subjects, counted before the call" },
  { n: "03", t: "Run", d: "37 of 74 done, 12m elapsed, polled every 3s" },
  { n: "04", t: "Read the outcome", d: "838 kept, 304 rejected, every cause recoverable", term: true }
];

TRADE.j2 = {
  win: [
    "The size of the loss is stated on the finish screen, not discovered inside the Review Queue.",
    "An empty trusted roster blocks a run before the model is paid rather than after.",
    "A twenty-four minute run is legible while it runs, so a slow run is not read as a hang.",
    "Ninety-six instances of one schema defect are read once, as one row."
  ],
  cost: [
    "Polling adds a request every three seconds for the whole run.",
    "Separating the finder from the import scope means two screens where the build has one.",
    "Naming four rejection causes on the outcome screen makes a working run look damaged.",
    "Recovery from this screen is a second queue to keep consistent with review."
  ],
  build: [
    "The filter, the derived scope and the outcome screen are all package-side.",
    "Per-source progress needs a status route, so state 03 lands at a release boundary.",
    "Causes are already enumerated by the extraction drop-reason enum and already have shipped strings.",
    "Recovery needs the rejected candidates persisted, not discarded at the end of the run."
  ]
};
