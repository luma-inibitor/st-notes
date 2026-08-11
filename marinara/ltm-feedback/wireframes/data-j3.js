/* Journey 3 — Curate. Figures are canonical: 838 kept of 1,142 candidates,
   facet counts 61/75/24/35/9/47, 24 decided, Wren trait 19,240 / 20,000. */

STATES.j3 = [

  {
    num:"01", label:"Facets by provenance", feas:"package", fx:[42],
    caption:"The rail splits into three bands: signals the package computes, values the model returned, and slices the reviewer saved. Every entry carries a live count against the <b>838 claims</b> in the queue. The reworded-restatement lane names why it is unavailable instead of returning a zero, which on this vault would read as a clean result. Today the queue has no facets and no counts of any kind.",
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
          '<div class="rail">'+
            '<span class="rt">Vault</span>'+
            '<span class="rt on">Review<span class="b">838</span></span>'+
            '<span class="rt">Sources</span>'+
            '<span class="rt">Settings</span>'+
          '</div>'+
          '<div class="pane split">'+
            '<div class="facets">'+
              '<div class="fgroup">Computed here</div>'+
              '<div class="fac on">Restates the vault<span class="c">61</span></div>'+
              '<div class="fac">Duplicate incoming<span class="c">75</span></div>'+
              '<div class="fac">Keyword cap reached<span class="c">24</span></div>'+
              '<div class="fac">Section cap reached<span class="c">35</span></div>'+
              '<div class="fac">Reworded restatement<span class="tag bad">off</span></div>'+
              '<div class="note-s">no count: semantic lane dead</div>'+
              '<div class="fgroup">From the model</div>'+
              '<div class="fac">Weak subject match<span class="c">9</span></div>'+
              '<div class="fac">Overwrites a value<span class="c">47</span></div>'+
              '<div class="fgroup">Yours</div>'+
              '<div class="fac">Wren, trait only<span class="c">saved</span></div>'+
              '<div class="fac">Decide today<span class="c">saved</span></div>'+
            '</div>'+
            '<div class="listcol">'+
              '<div class="hdr"><span class="grow">838 claims &middot; 61 shown &middot; 24 decided</span><span class="sel">group: target note</span><span class="sel">sort: risk</span></div>'+
              '<div class="grp">Wren <span class="tag">character note</span><span class="c">38</span></div>'+
              '<div class="row"><span class="cb on"></span><div class="t">Keeps a spare key by the clinic door<div class="meta">restates the vault &middot; trait</div></div><span class="tag">merges</span></div>'+
              '<div class="row"><span class="cb on"></span><div class="t">Works the night shift, not the morning one<div class="meta">restates the vault &middot; trait</div></div><span class="tag warn">overwrites</span></div>'+
              '<div class="grp">Harbour district <span class="tag">world note</span><span class="c">14</span></div>'+
              '<div class="row"><span class="cb on"></span><div class="t">The east pier floods at spring tide<div class="meta">restates the vault &middot; setting</div></div><span class="tag">merges</span></div>'+
              '<div class="row"><span class="cb"></span><div class="t">Two chandlers share the north quay<div class="meta">restates the vault &middot; setting</div></div><span class="tag">merges</span></div>'+
              '<div class="empty">9 more groups below</div>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div></div>',
    phone:
      '<div class="dev"><div class="dev-phone">'+
        '<div class="main">'+
          '<div class="topbar"><span class="ico hot">M</span>MEMORY<span class="ico wide">review</span></div>'+
          '<div class="rail"><span class="rt">Vault</span><span class="rt on">Review<span class="b">838</span></span><span class="rt">Sources</span><span class="rt">Settings</span></div>'+
          '<div class="pane">'+
            '<div class="hdr"><span class="grow">Facets &middot; 61 shown of 838</span><span class="btn">Clear</span></div>'+
            '<div class="fgroup">Computed here</div>'+
            '<div class="fac on">Restates the vault<span class="c">61</span></div>'+
            '<div class="fac">Duplicate incoming<span class="c">75</span></div>'+
            '<div class="fac">Keyword cap reached<span class="c">24</span></div>'+
            '<div class="fac">Section cap reached<span class="c">35</span></div>'+
            '<div class="fac">Reworded restatement<span class="tag bad">off</span></div>'+
            '<div class="note-s">no count: semantic lane dead</div>'+
            '<div class="fgroup">From the model</div>'+
            '<div class="fac">Weak subject match<span class="c">9</span></div>'+
            '<div class="fac">Overwrites a value<span class="c">47</span></div>'+
            '<div class="fgroup">Yours</div>'+
            '<div class="fac">Wren, trait only<span class="c">saved</span></div>'+
          '</div>'+
          '<div class="inputbar"><span class="btn pri">Show 61</span><span class="btn">Save this slice</span></div>'+
        '</div>'+
      '</div></div>'
  },

  {
    num:"02", label:"One list, two controls", feas:"package", fx:[31,32,33,34,36,29,43],
    caption:"Group-by and sort act on one list, and the facet set survives a pivot, so a slice is composed once and worked to exhaustion. One active facet means the shown count equals that facet count: <b>838 claims, 61 shown</b>. A stale row is marked in the list rather than at apply time, and the band written without review is named so the queue never implies it is the whole run. Today selection resets on any change of chat, source or draft.",
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
          '<div class="topbar"><span class="ico hot">M</span>LONG-TERM MEMORY<span class="ico wide">vault-01</span></div>'+
          '<div class="rail"><span class="rt">Vault</span><span class="rt on">Review<span class="b">838</span></span><span class="rt">Sources</span><span class="rt">Settings</span></div>'+
          '<div class="pane split">'+
            '<div class="facets">'+
              '<div class="fgroup">Active</div>'+
              '<div class="fac on">Restates the vault<span class="c">61</span></div>'+
              '<div class="fgroup">Computed here</div>'+
              '<div class="fac">Duplicate incoming<span class="c">75</span></div>'+
              '<div class="fac">Keyword cap reached<span class="c">24</span></div>'+
              '<div class="fac">Section cap reached<span class="c">35</span></div>'+
              '<div class="fgroup">From the model</div>'+
              '<div class="fac">Weak subject match<span class="c">9</span></div>'+
              '<div class="fac">Overwrites a value<span class="c">47</span></div>'+
              '<div class="note-s">Facets survive a regroup</div>'+
            '</div>'+
            '<div class="listcol">'+
              '<div class="hdr"><span class="grow">838 claims &middot; 61 shown &middot; 61 selected</span><span class="sel">group: target note</span><span class="sel">sort: risk</span><span class="tag">24 decided</span></div>'+
              '<div class="grp">Wren <span class="tag">character note</span><span class="tag warn">trait 19,240 / 20,000</span><span class="c">38</span></div>'+
              '<div class="mtr warn"><i class="w96"></i></div>'+
              '<div class="row"><span class="cb on"></span><div class="t">Keeps a spare key by the clinic door<div class="meta">restates the vault</div></div><span class="tag">merges</span></div>'+
              '<div class="row warnrow"><span class="cb on"></span><div class="t">Works the night shift, not the morning one<div class="meta">new value for an occupied field</div></div><span class="tag warn">overwrites</span></div>'+
              '<div class="row badrow"><span class="cb"></span><div class="t">Trained at the inland hospital<div class="meta">its source note changed since this draft was built</div></div><span class="tag bad">stale</span></div>'+
              '<div class="grp">Harbour district <span class="tag">world note</span><span class="c">14</span></div>'+
              '<div class="row"><span class="cb on"></span><div class="t">The east pier floods at spring tide<div class="meta">restates the vault</div></div><span class="tag">merges</span></div>'+
              '<div class="row"><span class="grow">Written without review, straight to the vault</span><span class="tag bad">not in this list</span></div>'+
              '<div class="note-s">Selection and edits held across regroup and re-sort, not across a reload</div>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div></div>',
    phone:
      '<div class="dev"><div class="dev-phone">'+
        '<div class="main">'+
          '<div class="topbar"><span class="ico hot">M</span>MEMORY<span class="ico wide">review</span></div>'+
          '<div class="rail"><span class="rt">Vault</span><span class="rt on">Review<span class="b">838</span></span><span class="rt">Sources</span><span class="rt">Settings</span></div>'+
          '<div class="pane">'+
            '<div class="hdr"><span class="grow">838 claims &middot; 61 shown</span><span class="tag acc">1 facet</span></div>'+
            '<div class="hdr"><span class="sel">group: target note</span><span class="sel">sort: risk</span><span class="grow"></span><span class="tag">24 decided</span></div>'+
            '<div class="grp">Wren<span class="c">38</span></div>'+
            '<div class="mtr warn"><i class="w96"></i></div>'+
            '<div class="row"><span class="cb on"></span><div class="t">Keeps a spare key by the clinic door<div class="meta">restates the vault</div></div></div>'+
            '<div class="row warnrow"><span class="cb on"></span><div class="t">Works the night shift, not the morning one<div class="meta">overwrites a stored value</div></div></div>'+
            '<div class="row badrow"><span class="cb"></span><div class="t">Trained at the inland hospital<div class="meta">source note changed since this draft</div></div></div>'+
            '<div class="grp">Harbour district<span class="c">14</span></div>'+
            '<div class="row"><span class="cb on"></span><div class="t">The east pier floods at spring tide<div class="meta">restates the vault</div></div></div>'+
            '<div class="note-s">Written without review is a separate band, not in this list</div>'+
          '</div>'+
          '<div class="inputbar"><span class="btn pri">Apply 61</span><span class="btn">Facets</span></div>'+
        '</div>'+
      '</div></div>'
  },

  {
    num:"03", label:"Row opened for editing", feas:"package", fx:[44,45,46],
    caption:"The row opens into an editor on the row itself. Two counters carry different labels, <b>412 characters in this contribution</b> and <b>19,240 of 20,000 in the projected section</b>, so one denominator never means two things. The link mutation resolves its target id to a title. Today the editor sits below the diagnostics, trims at the cap with no counter and no marker at the cut, and four of the seven mutation kinds render as nothing.",
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
          '<div class="topbar"><span class="ico hot">M</span>LONG-TERM MEMORY<span class="ico wide">editing</span></div>'+
          '<div class="rail"><span class="rt">Vault</span><span class="rt on">Review<span class="b">838</span></span><span class="rt">Sources</span><span class="rt">Settings</span></div>'+
          '<div class="pane split">'+
            '<div class="facets">'+
              '<div class="fgroup">Active</div>'+
              '<div class="fac on">Restates the vault<span class="c">61</span></div>'+
              '<div class="fgroup">Computed here</div>'+
              '<div class="fac">Section cap reached<span class="c">35</span></div>'+
              '<div class="fac">Keyword cap reached<span class="c">24</span></div>'+
              '<div class="fgroup">From the model</div>'+
              '<div class="fac">Overwrites a value<span class="c">47</span></div>'+
            '</div>'+
            '<div class="listcol">'+
              '<div class="hdr"><span class="grow">Wren &middot; merges into trait</span><span class="tag acc">editing</span><span class="btn">Close</span></div>'+
              '<div class="row on"><div class="t">Keeps a spare key by the clinic door, on a length of blue cord, and tells nobody where.<div class="meta">editable in place &middot; caret at end</div></div></div>'+
              '<div class="hdr"><span class="grow">412 characters in this contribution</span></div>'+
              '<div class="mtr warn"><i class="w96"></i></div>'+
              '<div class="hdr"><span class="grow">19,240 of 20,000 characters in the projected section</span><span class="tag warn">save blocks at the cap</span></div>'+
              '<div class="grp">Evidence <span class="tag">lorebook entry 12</span></div>'+
              '<div class="row"><div class="t">The quoted source line, shown as stored, with the matched span marked.</div></div>'+
              '<div class="row"><div class="t">Links to</div><span class="tag">Timeline: harbour arrival</span><span class="meta">resolved from id</span></div>'+
              '<div class="hdr"><span class="grow"></span><span class="btn pri">Save edit</span><span class="btn">Accept as written</span><span class="btn">Drop</span></div>'+
            '</div>'+
          '</div>'+
        '</div>'+
        '<div class="drawer">'+
          '<div class="drawer-head">Target note</div>'+
          '<div class="drawer-body">'+
            '<div class="kv"><span class="k">note</span><span class="v">Wren</span></div>'+
            '<div class="kv"><span class="k">keywords</span><span class="v">28 / 30</span></div>'+
            '<div class="mtr warn"><i class="w95"></i></div>'+
            '<div class="kv"><span class="k">contributions</span><span class="v">91 / 100</span></div>'+
            '<div class="mtr warn"><i class="w90"></i></div>'+
            '<div class="kv"><span class="k">trait section</span><span class="v">19,240</span></div>'+
            '<div class="mtr warn"><i class="w96"></i></div>'+
            '<div class="kv"><span class="k">recalled</span><span class="v">21 &times;</span></div>'+
            '<div class="note-s">Caps read as a gradient, not a wall</div>'+
          '</div>'+
        '</div>'+
      '</div></div>',
    phone:
      '<div class="dev"><div class="dev-phone">'+
        '<div class="main">'+
          '<div class="topbar"><span class="ico hot">M</span>MEMORY<span class="ico wide">editing</span></div>'+
          '<div class="rail"><span class="rt">Vault</span><span class="rt on">Review<span class="b">838</span></span><span class="rt">Sources</span><span class="rt">Settings</span></div>'+
          '<div class="pane">'+
            '<div class="hdr"><span class="grow">Wren &middot; merges into trait</span><span class="btn">Close</span></div>'+
            '<div class="row on"><div class="t">Keeps a spare key by the clinic door, on a length of blue cord, and tells nobody where.<div class="meta">editable in place</div></div></div>'+
            '<div class="hdr"><span class="grow">412 characters in this contribution</span></div>'+
            '<div class="mtr warn"><i class="w96"></i></div>'+
            '<div class="hdr"><span class="grow">19,240 of 20,000 in the projected section</span></div>'+
            '<div class="grp">Evidence<span class="c">lorebook 12</span></div>'+
            '<div class="row"><div class="t">The quoted source line, shown as stored.</div></div>'+
            '<div class="row"><div class="t">Links to</div><span class="tag">Timeline: harbour arrival</span></div>'+
            '<div class="hdr"><span class="grow"></span><span class="tag warn">keywords 28 / 30</span><span class="tag">contributions 91 / 100</span></div>'+
          '</div>'+
          '<div class="inputbar"><span class="btn pri">Save edit</span><span class="btn">Accept</span><span class="btn">Drop</span></div>'+
        '</div>'+
      '</div></div>'
  },

  {
    num:"04", label:"Conflict, three ways out", feas:"package", fx:[35,47],
    caption:"Stored and proposed face each other, and the recall count sits on the text about to be overwritten, so the cost of taking the proposal is legible before it is taken. A third option files both in order, because most contradictions in a long story are the situation moving rather than a factual dispute. Today the queue never reads <b>mutation.note.conflicts</b>, and the per-chunk recall counts are written to disk and returned by no route.",
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
          '<div class="rail"><span class="rt">Vault</span><span class="rt on">Review<span class="b">838</span></span><span class="rt">Sources</span><span class="rt">Settings</span></div>'+
          '<div class="pane split">'+
            '<div class="facets">'+
              '<div class="fgroup">Active</div>'+
              '<div class="fac on">Overwrites a value<span class="c">47</span></div>'+
              '<div class="fgroup">Computed here</div>'+
              '<div class="fac">Restates the vault<span class="c">61</span></div>'+
              '<div class="fac">Section cap reached<span class="c">35</span></div>'+
              '<div class="fgroup">From the model</div>'+
              '<div class="fac">Weak subject match<span class="c">9</span></div>'+
              '<div class="note-s">47 of the 838 land on an occupied field</div>'+
            '</div>'+
            '<div class="listcol">'+
              '<div class="hdr"><span class="grow">838 claims &middot; 47 shown &middot; conflict on trait</span><span class="tag bad">contradicts stored</span></div>'+
              '<div class="grp">Stored <span class="tag">recalled 21 times, last 2 Mar</span></div>'+
              '<div class="row"><div class="t">Works the morning shift at the inland clinic and walks back along the pier.</div></div>'+
              '<div class="grp">Proposed <span class="tag">from a chat summary</span></div>'+
              '<div class="row warnrow"><div class="t">Works the night shift, not the morning one.</div><span class="tag warn">overwrites</span></div>'+
              '<div class="hdr"><span class="grow"></span><span class="btn">Keep stored</span><span class="btn">Replace</span><span class="btn pri">Keep both, in order</span></div>'+
              '<div class="note-s">Keeping both files the stored line as earlier and the proposed line as later</div>'+
              '<div class="grp">Next conflicts in this slice<span class="c">46</span></div>'+
              '<div class="row"><span class="cb"></span><div class="t">Carries the harbour keys, not the clinic keys<div class="meta">stored recalled 4 times</div></div><span class="tag warn">overwrites</span></div>'+
              '<div class="row"><span class="cb"></span><div class="t">The east pier was rebuilt after the flood<div class="meta">stored recalled 0 times</div></div><span class="tag warn">overwrites</span></div>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div></div>',
    phone:
      '<div class="dev"><div class="dev-phone">'+
        '<div class="main">'+
          '<div class="topbar"><span class="ico hot">M</span>MEMORY<span class="ico wide">conflict</span></div>'+
          '<div class="rail"><span class="rt">Vault</span><span class="rt on">Review<span class="b">838</span></span><span class="rt">Sources</span><span class="rt">Settings</span></div>'+
          '<div class="pane">'+
            '<div class="hdr"><span class="grow">Conflict on trait</span><span class="tag bad">contradicts stored</span></div>'+
            '<div class="grp">Stored<span class="c">recalled 21 &times;</span></div>'+
            '<div class="row"><div class="t">Works the morning shift at the inland clinic and walks back along the pier.<div class="meta">last recalled 2 Mar</div></div></div>'+
            '<div class="grp">Proposed<span class="c">chat summary</span></div>'+
            '<div class="row warnrow"><div class="t">Works the night shift, not the morning one.</div></div>'+
            '<div class="note-s">Keeping both files the stored line as earlier and the proposed line as later</div>'+
            '<div class="grp">Next in this slice<span class="c">46</span></div>'+
            '<div class="row"><span class="cb"></span><div class="t">Carries the harbour keys, not the clinic keys</div></div>'+
          '</div>'+
          '<div class="inputbar"><span class="btn">Keep stored</span><span class="btn">Replace</span><span class="btn pri">Keep both</span></div>'+
        '</div>'+
      '</div></div>'
  },

  {
    num:"05", label:"Apply, preflighted", feas:"restart", fx:[37,38,39,40,41],
    caption:"A preflight route runs the same projection code the server applies, so the <b>2 rows that would fail</b> are marked before submit rather than arriving as one whole-draft error. Progress counts against the batch: <b>46 of 61 applied, 13 remaining, 2 skipped and marked</b>. The restore point is the backup export that already exists, because there is no undo. Preflight is a new route, so it ships at a release boundary.",
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
          '<div class="topbar"><span class="ico hot">M</span>LONG-TERM MEMORY<span class="ico wide">applying</span></div>'+
          '<div class="rail"><span class="rt">Vault</span><span class="rt on">Review<span class="b">838</span></span><span class="rt">Sources</span><span class="rt">Settings</span></div>'+
          '<div class="pane split">'+
            '<div class="facets">'+
              '<div class="fgroup">Batch</div>'+
              '<div class="fac on">Selected<span class="c">61</span></div>'+
              '<div class="fac">Would fail<span class="c">2</span></div>'+
              '<div class="fac">Applied<span class="c">46</span></div>'+
              '<div class="fac">Remaining<span class="c">13</span></div>'+
              '<div class="fgroup">Still in the queue</div>'+
              '<div class="fac">Duplicate incoming<span class="c">75</span></div>'+
              '<div class="fac">Overwrites a value<span class="c">47</span></div>'+
              '<div class="note-s">Counts hold against 838</div>'+
            '</div>'+
            '<div class="listcol">'+
              '<div class="hdr"><span class="grow">Apply 61 selected</span><span class="tag warn">2 would fail</span><span class="sel">preflight: passed 59</span></div>'+
              '<div class="grp">Preflight marks<span class="c">2</span></div>'+
              '<div class="row badrow"><span class="cb on"></span><div class="t">Works the night shift, not the morning one<div class="meta">section cap exceeded on the trait section</div></div><span class="btn">Show</span></div>'+
              '<div class="row badrow"><span class="cb on"></span><div class="t">Keeps a spare key by the clinic door<div class="meta">section cap exceeded on the trait section</div></div><span class="btn">Show</span></div>'+
              '<div class="row"><div class="t">Dropped rows still available as dependencies</div><span class="tag good">auto-included</span></div>'+
              '<div class="row on"><span class="cb on"></span><div class="t">Take a restore point first<div class="meta">a backup export, because there is no undo</div></div><span class="tag acc">recommended</span></div>'+
              '<div class="mtr warn"><i class="w75"></i></div>'+
              '<div class="hdr"><span class="grow">46 of 61 applied &middot; 13 remaining &middot; 2 skipped and marked</span></div>'+
              '<div class="note-s">Applied rows are flagged in the draft, not deleted from it, so the denominator does not shrink</div>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div></div>',
    phone:
      '<div class="dev"><div class="dev-phone">'+
        '<div class="main">'+
          '<div class="topbar"><span class="ico hot">M</span>MEMORY<span class="ico wide">applying</span></div>'+
          '<div class="rail"><span class="rt">Vault</span><span class="rt on">Review<span class="b">838</span></span><span class="rt">Sources</span><span class="rt">Settings</span></div>'+
          '<div class="pane">'+
            '<div class="hdr"><span class="grow">Apply 61 selected</span><span class="tag warn">2 would fail</span></div>'+
            '<div class="grp">Preflight marks<span class="c">2</span></div>'+
            '<div class="row badrow"><span class="cb on"></span><div class="t">Works the night shift, not the morning one<div class="meta">section cap exceeded on trait</div></div></div>'+
            '<div class="row badrow"><span class="cb on"></span><div class="t">Keeps a spare key by the clinic door<div class="meta">section cap exceeded on trait</div></div></div>'+
            '<div class="row on"><span class="cb on"></span><div class="t">Take a restore point first<div class="meta">there is no undo</div></div></div>'+
            '<div class="mtr warn"><i class="w75"></i></div>'+
            '<div class="hdr"><span class="grow">46 of 61 applied &middot; 13 remaining &middot; 2 skipped</span></div>'+
            '<div class="note-s">Progress counts against the batch, not a shrinking draft</div>'+
          '</div>'+
          '<div class="inputbar"><span class="btn pri">Continue</span><span class="btn">Stop after this row</span></div>'+
        '</div>'+
      '</div></div>'
  },

  {
    num:"06", label:"Twelve claims, no rail", feas:"package", fx:[31],
    caption:"The same route and the same row component at the median size: <b>12 claims from one character card</b>. The facet rail, the group-by and the sort are gone, because six facets are more surface than the work they filter. Scale decides the interface, not the loop. A queue built only for 838 makes the common case feel like the rare one.",
    desk:
      '<div class="dev"><div class="dev-desk">'+
        '<div class="side">'+
          '<div class="side-title">Chats</div>'+
          '<div class="chat-row">Harbour arrival</div>'+
          '<div class="chat-row">Lantern week</div>'+
          '<div class="side-title">Workspace</div>'+
          '<div class="chat-row on">Long-term memory</div>'+
        '</div>'+
        '<div class="main">'+
          '<div class="topbar"><span class="ico hot">M</span>LONG-TERM MEMORY<span class="ico wide">one card</span></div>'+
          '<div class="rail"><span class="rt">Vault</span><span class="rt on">Review<span class="b">12</span></span><span class="rt">Sources</span><span class="rt">Settings</span></div>'+
          '<div class="pane">'+
            '<div class="hdr"><span class="grow">12 claims from one character card</span><span class="tag">all shown</span></div>'+
            '<div class="row"><span class="cb on"></span><div class="t">Keeps a spare key by the clinic door</div><span class="tag">merges</span></div>'+
            '<div class="row"><span class="cb on"></span><div class="t">Walks home along the east pier</div><span class="tag">merges</span></div>'+
            '<div class="row warnrow"><span class="cb"></span><div class="t">Trained at the inland hospital<div class="meta">weak subject match</div></div><span class="tag warn">check</span></div>'+
            '<div class="row"><span class="cb on"></span><div class="t">Prefers the night shift</div><span class="tag">merges</span></div>'+
            '<div class="row"><span class="cb on"></span><div class="t">Keeps a tide table pinned by the door</div><span class="tag">merges</span></div>'+
            '<div class="row"><span class="cb on"></span><div class="t">Speaks two harbour dialects</div><span class="tag">merges</span></div>'+
            '<div class="empty">6 more rows, read end to end</div>'+
            '<div class="hdr"><span class="grow"></span><span class="btn pri">Accept selected</span><span class="btn">Accept all</span><span class="btn">Show facets</span></div>'+
          '</div>'+
        '</div>'+
      '</div></div>',
    phone:
      '<div class="dev"><div class="dev-phone">'+
        '<div class="main">'+
          '<div class="topbar"><span class="ico hot">M</span>MEMORY<span class="ico wide">one card</span></div>'+
          '<div class="rail"><span class="rt">Vault</span><span class="rt on">Review<span class="b">12</span></span><span class="rt">Sources</span><span class="rt">Settings</span></div>'+
          '<div class="pane">'+
            '<div class="hdr"><span class="grow">12 claims &middot; all shown</span></div>'+
            '<div class="row"><span class="cb on"></span><div class="t">Keeps a spare key by the clinic door</div></div>'+
            '<div class="row"><span class="cb on"></span><div class="t">Walks home along the east pier</div></div>'+
            '<div class="row warnrow"><span class="cb"></span><div class="t">Trained at the inland hospital<div class="meta">weak subject match</div></div></div>'+
            '<div class="row"><span class="cb on"></span><div class="t">Prefers the night shift</div></div>'+
            '<div class="row"><span class="cb on"></span><div class="t">Keeps a tide table pinned by the door</div></div>'+
            '<div class="empty">7 more rows</div>'+
            '<div class="note-s">No facet rail, no group-by, no sort</div>'+
          '</div>'+
          '<div class="inputbar"><span class="btn pri">Accept selected</span><span class="btn">Accept all</span></div>'+
        '</div>'+
      '</div></div>'
  }

];

FLOWS.j3 = [
  {n:"01", t:"Compose", d:"pick facets, read the counts"},
  {n:"02", t:"Pivot", d:"group and sort the same list"},
  {n:"03", t:"Edit", d:"fix the text on the row"},
  {n:"04", t:"Resolve", d:"stored beside proposed"},
  {n:"05", t:"Apply", d:"preflight, then a restore point"},
  {n:"06", t:"Or skip all of it", d:"twelve rows need no rail", term:true}
];

TRADE.j3 = {
  win:[
    "Eight hundred claims become a handful of slices, each worked to exhaustion before the next is composed.",
    "Failures land on the offending rows before submit instead of arriving as one atomic draft error.",
    "A conflict shows what it is about to overwrite, and how often the model has leaned on it.",
    "The small case stays small: twelve rows get a list, not a filter engine."
  ],
  cost:[
    "Six facets and two pivots is more control surface than the current queue has in total.",
    "Selection survives regroup and re-sort but not a reload, because the package has no client storage.",
    "Preflight doubles the projection work for every apply, once to check and once to write.",
    "Two of the facet counts stay unavailable while the semantic lane is dead."
  ],
  build:[
    "targets[] is already on the wire and already consumed; giving it a header and a pivot is presentation, not a new query.",
    "match.basis is computed during subject resolution already and needs threading onto the mutation.",
    "Preflight is a new route, so it ships at a release boundary rather than at runtime.",
    "The restore point reuses the backup export; real undo would need commit journals retained past publish()."
  ]
};
