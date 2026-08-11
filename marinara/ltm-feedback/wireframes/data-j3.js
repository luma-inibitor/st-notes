/* Journey 3 — Curate. Figures are canonical: 838 kept of 1,142 candidates,
   facet counts 61/75/24/35/9/47, 24 decided, Wren trait 19,240 / 20,000. */

STATES.j3 = [

  {
    num:"01", label:"Facets by provenance", feas:"package", fx:[42],
    caption:"The rail splits into three bands: signals the package computes, values the model returned, and slices the reviewer saved. Every entry carries a live count against the <b>838 mutations</b> in the queue. The reworded-restatement lane names why it cannot count instead of returning a zero, which on this vault would read as a clean result. Today the queue offers no facets and no counts of any kind.",
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
          '<div class="topbar"><span class="ico hot">M</span>LONG-TERM MEMORY<span class="ico wide">vault-01</span><span class="ico">?</span></div>'+
          '<div class="rail">'+
            '<span class="rt">Memory Vault</span>'+
            '<span class="rt on">Review Queue<span class="b">838</span></span>'+
            '<span class="rt">Sources</span>'+
            '<span class="rt">Memory Settings</span>'+
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
              '<div class="fac">Rewrites a memory<span class="c">47</span></div>'+
              '<div class="fgroup">Yours</div>'+
              '<div class="fac">Wren, trait only<span class="c">saved</span></div>'+
              '<div class="fac">Decide today<span class="c">saved</span></div>'+
            '</div>'+
            '<div class="listcol">'+
              '<div class="hdr"><span class="grow">838 mutations &middot; 61 shown &middot; 24 decided</span><span class="sel">group: target memory</span><span class="sel">sort: risk</span></div>'+
              '<div class="grp">Wren <span class="tag">Character</span><span class="c">38</span></div>'+
              '<div class="row"><span class="cb on"></span><div class="t">Keeps a spare key by the clinic door<div class="meta">restates the vault &middot; trait</div></div><span class="tag">Merge into memory</span></div>'+
              '<div class="row"><span class="cb on"></span><div class="t">Works the night shift, not the morning one<div class="meta">restates the vault &middot; trait</div></div><span class="tag warn">Rewrite memory</span></div>'+
              '<div class="grp">Harbour district <span class="tag">World</span><span class="c">14</span></div>'+
              '<div class="row"><span class="cb on"></span><div class="t">The east pier floods at spring tide<div class="meta">restates the vault &middot; setting</div></div><span class="tag">Merge into memory</span></div>'+
              '<div class="row"><span class="cb"></span><div class="t">Two chandlers share the north quay<div class="meta">restates the vault &middot; setting</div></div><span class="tag">Merge into memory</span></div>'+
              '<div class="empty">9 more groups below</div>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div></div>',
    phone:
      '<div class="dev"><div class="dev-phone">'+
        '<div class="main">'+
          '<div class="topbar"><span class="ico hot">M</span>LONG-TERM MEMORY<span class="ico wide">review</span></div>'+
          '<div class="rail"><span class="rt">Memories</span><span class="rt on">Review<span class="b">838</span></span><span class="rt">Sources</span><span class="rt">Settings</span></div>'+
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
            '<div class="fac">Rewrites a memory<span class="c">47</span></div>'+
            '<div class="fgroup">Yours</div>'+
            '<div class="fac">Wren, trait only<span class="c">saved</span></div>'+
          '</div>'+
          '<div class="inputbar"><span class="btn pri">Show 61</span><span class="btn">Save this slice</span></div>'+
        '</div>'+
      '</div></div>'
  },

  {
    num:"02", label:"One list, two controls", feas:"package", fx:[31,32,33,34,36,29,43],
    caption:"Group-by and sort act on one list, and the facet set survives a pivot, so the reviewer composes a slice once and works it to exhaustion. One active facet means the shown count equals that facet count: <b>838 mutations, 61 shown</b>. The list marks a stale row where it sits rather than at apply time, and it names the band that reached the vault without review, so the queue never implies it holds the whole run. Today any change of chat, source or draft throws the selection away.",
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
          '<div class="topbar"><span class="ico hot">M</span>LONG-TERM MEMORY<span class="ico wide">vault-01</span></div>'+
          '<div class="rail"><span class="rt">Memory Vault</span><span class="rt on">Review Queue<span class="b">838</span></span><span class="rt">Sources</span><span class="rt">Memory Settings</span></div>'+
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
              '<div class="fac">Rewrites a memory<span class="c">47</span></div>'+
              '<div class="note-s">Facets survive a regroup</div>'+
            '</div>'+
            '<div class="listcol">'+
              '<div class="hdr"><span class="grow">838 mutations &middot; 61 shown &middot; 61 selected</span><span class="sel">group: target memory</span><span class="sel">sort: risk</span><span class="tag">24 decided</span></div>'+
              '<div class="grp">Wren <span class="tag">Character</span><span class="tag warn">trait 19,240 / 20,000</span><span class="c">38</span></div>'+
              '<div class="mtr warn"><i class="w96"></i></div>'+
              '<div class="row"><span class="cb on"></span><div class="t">Keeps a spare key by the clinic door<div class="meta">restates the vault</div></div><span class="tag">Merge into memory</span></div>'+
              '<div class="row warnrow"><span class="cb on"></span><div class="t">Works the night shift, not the morning one<div class="meta">a new value for an occupied field</div></div><span class="tag warn">Rewrite memory</span></div>'+
              '<div class="row badrow"><span class="cb"></span><div class="t">Trained at the inland hospital<div class="meta">The source or extraction context changed after this extraction.</div></div><span class="tag bad">Source stale</span></div>'+
              '<div class="grp">Harbour district <span class="tag">World</span><span class="c">14</span></div>'+
              '<div class="row"><span class="cb on"></span><div class="t">The east pier floods at spring tide<div class="meta">restates the vault</div></div><span class="tag">Merge into memory</span></div>'+
              '<div class="row"><span class="grow">Written without review, straight to the vault</span><span class="tag bad">not in this list</span></div>'+
              '<div class="note-s">Selection and edits hold across regroup and re-sort, not across a reload</div>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div></div>',
    phone:
      '<div class="dev"><div class="dev-phone">'+
        '<div class="main">'+
          '<div class="topbar"><span class="ico hot">M</span>LONG-TERM MEMORY<span class="ico wide">review</span></div>'+
          '<div class="rail"><span class="rt">Memories</span><span class="rt on">Review<span class="b">838</span></span><span class="rt">Sources</span><span class="rt">Settings</span></div>'+
          '<div class="pane">'+
            '<div class="hdr"><span class="grow">838 mutations &middot; 61 shown</span><span class="tag">1 facet</span></div>'+
            '<div class="hdr"><span class="sel">group: target memory</span><span class="sel">sort: risk</span><span class="grow"></span><span class="tag">24 decided</span></div>'+
            '<div class="grp">Wren<span class="c">38</span></div>'+
            '<div class="mtr warn"><i class="w96"></i></div>'+
            '<div class="row"><span class="cb on"></span><div class="t">Keeps a spare key by the clinic door<div class="meta">restates the vault</div></div></div>'+
            '<div class="row warnrow"><span class="cb on"></span><div class="t">Works the night shift, not the morning one<div class="meta">Rewrite memory</div></div></div>'+
            '<div class="row badrow"><span class="cb"></span><div class="t">Trained at the inland hospital<div class="meta">Source stale</div></div></div>'+
            '<div class="grp">Harbour district<span class="c">14</span></div>'+
            '<div class="row"><span class="cb on"></span><div class="t">The east pier floods at spring tide<div class="meta">restates the vault</div></div></div>'+
            '<div class="note-s">Written without review is a separate band, not in this list</div>'+
          '</div>'+
          '<div class="inputbar"><span class="btn pri">Accept eligible (61)</span><span class="btn">Facets</span></div>'+
        '</div>'+
      '</div></div>'
  },

  {
    num:"03", label:"Row opened for editing", feas:"package", fx:[44,45,46],
    caption:"The row opens into an editor on the row itself, and the facet rail steps aside because the reviewer is reading one claim, not filtering eight hundred. Two counters carry different labels, <b>412 characters in this contribution</b> and <b>19,240 of 20,000 in the projected section</b>, so one denominator never means two things; only the section total earns a meter. The editor resolves the link target's id to a title. Today the editor sits below the diagnostics, trims at the cap without a counter or a marker at the cut, and renders four of the seven mutation kinds as nothing.",
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
          '<div class="topbar"><span class="ico hot">M</span>LONG-TERM MEMORY<span class="ico wide">editing</span></div>'+
          '<div class="rail"><span class="rt">Memory Vault</span><span class="rt on">Review Queue<span class="b">838</span></span><span class="rt">Sources</span><span class="rt">Memory Settings</span></div>'+
          '<div class="pane">'+
            '<div class="hdr"><span class="grow">Wren &middot; Add to section &middot; trait</span><span class="tag">editing</span><span class="btn">Close</span></div>'+
            '<div class="row on"><div class="t"><div class="fld area">Keeps a spare key by the clinic door, on a length of blue cord, and tells nobody where.</div><div class="meta">editable in place &middot; caret at end</div></div></div>'+
            '<div class="hdr"><span class="grow">412 characters in this contribution</span></div>'+
            '<div class="hdr"><span class="grow">19,240 of 20,000 characters in the projected section</span><span class="tag warn">Save blocks at the cap</span></div>'+
            '<div class="mtr warn"><i class="w96"></i></div>'+
            '<div class="grp">Evidence <span class="tag">lorebook entry 12</span></div>'+
            '<div class="row"><div class="t">The quoted source line, shown as stored, with the matched span marked.</div></div>'+
            '<div class="row"><div class="t">Add link</div><span class="tag">Timeline event &middot; harbour arrival</span><span class="meta">resolved from id</span></div>'+
            '<div class="hdr"><span class="grow"></span><span class="btn pri">Save</span><span class="btn">Accept</span><span class="btn">Skip</span></div>'+
          '</div>'+
        '</div>'+
        '<div class="drawer">'+
          '<div class="drawer-head">Memory inspector</div>'+
          '<div class="drawer-body">'+
            '<div class="kv"><span class="k">Title</span><span class="v">Wren</span></div>'+
            '<div class="kv"><span class="k">Keywords</span><span class="v">28 / 30</span></div>'+
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
          '<div class="topbar"><span class="ico hot">M</span>LONG-TERM MEMORY<span class="ico wide">editing</span></div>'+
          '<div class="rail"><span class="rt">Memories</span><span class="rt on">Review<span class="b">838</span></span><span class="rt">Sources</span><span class="rt">Settings</span></div>'+
          '<div class="pane">'+
            '<div class="hdr"><span class="grow">Wren &middot; Add to section &middot; trait</span><span class="btn">Close</span></div>'+
            '<div class="row on"><div class="t"><div class="fld area">Keeps a spare key by the clinic door, on a length of blue cord, and tells nobody where.</div><div class="meta">editable in place</div></div></div>'+
            '<div class="hdr"><span class="grow">412 characters in this contribution</span></div>'+
            '<div class="hdr"><span class="grow">19,240 of 20,000 in the projected section</span></div>'+
            '<div class="mtr warn"><i class="w96"></i></div>'+
            '<div class="grp">Evidence<span class="c">lorebook 12</span></div>'+
            '<div class="row"><div class="t">The quoted source line, shown as stored.</div></div>'+
            '<div class="row"><div class="t">Add link</div><span class="tag">Timeline event &middot; harbour arrival</span></div>'+
            '<div class="hdr"><span class="grow"></span><span class="tag warn">Keywords 28 / 30</span><span class="tag">contributions 91 / 100</span></div>'+
          '</div>'+
          '<div class="inputbar"><span class="btn pri">Save</span><span class="btn">Accept</span><span class="btn">Skip</span></div>'+
        '</div>'+
      '</div></div>'
  },

  {
    num:"04", label:"Conflict, three ways out", feas:"package", fx:[35,47],
    caption:"Stored and proposed face each other, and the recall count sits on the text the proposal would overwrite, so the reviewer can weigh the loss before taking it. A third option files both in order, because most contradictions in a long story record the situation moving rather than a factual dispute. Today the queue never reads <b>mutation.note.conflicts</b>, and no route returns the per-chunk recall counts the package already writes to disk.",
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
          '<div class="topbar"><span class="ico hot">M</span>LONG-TERM MEMORY<span class="ico wide">conflict</span></div>'+
          '<div class="rail"><span class="rt">Memory Vault</span><span class="rt on">Review Queue<span class="b">838</span></span><span class="rt">Sources</span><span class="rt">Memory Settings</span></div>'+
          '<div class="pane split">'+
            '<div class="facets">'+
              '<div class="fgroup">Active</div>'+
              '<div class="fac on">Rewrites a memory<span class="c">47</span></div>'+
              '<div class="fgroup">Computed here</div>'+
              '<div class="fac">Restates the vault<span class="c">61</span></div>'+
              '<div class="fac">Section cap reached<span class="c">35</span></div>'+
              '<div class="fgroup">From the model</div>'+
              '<div class="fac">Weak subject match<span class="c">9</span></div>'+
              '<div class="note-s">47 of the 838 land on an occupied field</div>'+
            '</div>'+
            '<div class="listcol">'+
              '<div class="hdr"><span class="grow">838 mutations &middot; 47 shown &middot; conflict on trait</span><span class="tag bad">Conflicts</span></div>'+
              '<div class="grp">Stored <span class="tag">recalled 21 times, last 2 Mar</span></div>'+
              '<div class="row"><div class="t">Works the morning shift at the inland clinic and walks back along the pier.</div></div>'+
              '<div class="grp">Proposed <span class="tag">from a Chat Summary</span></div>'+
              '<div class="row warnrow"><div class="t">Works the night shift, not the morning one.</div><span class="tag warn">Rewrite memory</span></div>'+
              '<div class="hdr"><span class="grow"></span><span class="btn">Keep stored</span><span class="btn">Replace</span><span class="btn pri">Keep both, in order</span></div>'+
              '<div class="note-s">Keeping both files the stored line as earlier and the proposed line as later</div>'+
              '<div class="grp">Next conflicts in this slice<span class="c">46</span></div>'+
              '<div class="row"><span class="cb"></span><div class="t">Carries the harbour keys, not the clinic keys<div class="meta">stored recalled 4 times</div></div><span class="tag warn">Rewrite memory</span></div>'+
              '<div class="row"><span class="cb"></span><div class="t">The east pier was rebuilt after the flood<div class="meta">stored recalled 2 times</div></div><span class="tag warn">Rewrite memory</span></div>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div></div>',
    phone:
      '<div class="dev"><div class="dev-phone">'+
        '<div class="main">'+
          '<div class="topbar"><span class="ico hot">M</span>LONG-TERM MEMORY<span class="ico wide">conflict</span></div>'+
          '<div class="rail"><span class="rt">Memories</span><span class="rt on">Review<span class="b">838</span></span><span class="rt">Sources</span><span class="rt">Settings</span></div>'+
          '<div class="pane">'+
            '<div class="hdr"><span class="grow">Conflict on trait</span><span class="tag bad">Conflicts</span></div>'+
            '<div class="grp">Stored<span class="c">recalled 21 &times;</span></div>'+
            '<div class="row"><div class="t">Works the morning shift at the inland clinic and walks back along the pier.<div class="meta">last recalled 2 Mar</div></div></div>'+
            '<div class="grp">Proposed<span class="c">Chat Summary</span></div>'+
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
    num:"05", label:"Apply, previewed", feas:"restart", fx:[37,38,39,40,41],
    caption:"A preview route runs the same projection code the server applies, so the queue marks the <b>2 rows that would fail</b> before submit rather than surfacing one whole-draft error afterwards. Progress counts against the batch: <b>46 of 61 applied, 13 remaining, 2 skipped and marked</b>. The restore point reuses the backup export the package already ships, because nothing here can undo an accept. The preview needs a new route, so it lands at a release boundary.",
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
          '<div class="topbar"><span class="ico hot">M</span>LONG-TERM MEMORY<span class="ico wide">applying</span></div>'+
          '<div class="rail"><span class="rt">Memory Vault</span><span class="rt on">Review Queue<span class="b">838</span></span><span class="rt">Sources</span><span class="rt">Memory Settings</span></div>'+
          '<div class="pane split">'+
            '<div class="facets">'+
              '<div class="fgroup">Batch review actions</div>'+
              '<div class="fac on">Selected<span class="c">61</span></div>'+
              '<div class="fac">Would fail<span class="c">2</span></div>'+
              '<div class="fac">Applied<span class="c">46</span></div>'+
              '<div class="fac">Remaining<span class="c">13</span></div>'+
              '<div class="fgroup">Still in the queue</div>'+
              '<div class="fac">Duplicate incoming<span class="c">75</span></div>'+
              '<div class="fac">Rewrites a memory<span class="c">47</span></div>'+
              '<div class="note-s">Counts hold against 838</div>'+
            '</div>'+
            '<div class="listcol">'+
              '<div class="hdr"><span class="grow">Accept 61 selected</span><span class="tag warn">2 would fail</span><span class="sel">preview: 59 pass</span></div>'+
              '<div class="grp">Preview: would fail<span class="c">2</span></div>'+
              '<div class="row badrow"><span class="cb on"></span><div class="t">Works the night shift, not the morning one<div class="meta">section cap reached on the trait section</div></div><span class="btn">Details</span></div>'+
              '<div class="row badrow"><span class="cb on"></span><div class="t">Keeps a spare key by the clinic door<div class="meta">section cap reached on the trait section</div></div><span class="btn">Details</span></div>'+
              '<div class="row"><div class="t">Skipped rows stay available as dependencies</div><span class="tag good">included automatically</span></div>'+
              '<div class="row on"><span class="cb on"></span><div class="t">Take a restore point first<div class="meta">Export backup, because this cannot be undone.</div></div><span class="tag">default on</span></div>'+
              '<div class="mtr warn"><i class="w75"></i></div>'+
              '<div class="hdr"><span class="grow">46 of 61 applied &middot; 13 remaining &middot; 2 skipped and marked</span></div>'+
              '<div class="note-s">Applying flags a row in the draft rather than deleting it, so the denominator does not shrink</div>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div></div>',
    phone:
      '<div class="dev"><div class="dev-phone">'+
        '<div class="main">'+
          '<div class="topbar"><span class="ico hot">M</span>LONG-TERM MEMORY<span class="ico wide">applying</span></div>'+
          '<div class="rail"><span class="rt">Memories</span><span class="rt on">Review<span class="b">838</span></span><span class="rt">Sources</span><span class="rt">Settings</span></div>'+
          '<div class="pane">'+
            '<div class="hdr"><span class="grow">Accept 61 selected</span><span class="tag warn">2 would fail</span></div>'+
            '<div class="grp">Preview: would fail<span class="c">2</span></div>'+
            '<div class="row badrow"><span class="cb on"></span><div class="t">Works the night shift, not the morning one<div class="meta">section cap reached on trait</div></div></div>'+
            '<div class="row badrow"><span class="cb on"></span><div class="t">Keeps a spare key by the clinic door<div class="meta">section cap reached on trait</div></div></div>'+
            '<div class="row on"><span class="cb on"></span><div class="t">Take a restore point first<div class="meta">this cannot be undone</div></div></div>'+
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
    caption:"The same route and the same row component at the median size: <b>12 mutations from one character card</b>. The facet rail, the group-by and the sort all drop away, because six facets cost more surface than the work they filter. Scale decides the interface, not the loop. A queue built only for 838 makes the common case feel like the rare one.",
    desk:
      '<div class="dev"><div class="dev-desk">'+
        '<div class="side">'+
          '<div class="side-title">Chats</div>'+
          '<div class="chat-row">Harbour arrival</div>'+
          '<div class="chat-row">Lantern week</div>'+
          '<div class="side-title">Workspace panes</div>'+
          '<div class="chat-row on">Long-Term Memory</div>'+
        '</div>'+
        '<div class="main">'+
          '<div class="topbar"><span class="ico hot">M</span>LONG-TERM MEMORY<span class="ico wide">one card</span></div>'+
          '<div class="rail"><span class="rt">Memory Vault</span><span class="rt on">Review Queue<span class="b">12</span></span><span class="rt">Sources</span><span class="rt">Memory Settings</span></div>'+
          '<div class="pane">'+
            '<div class="hdr"><span class="grow">12 mutations from one character card</span><span class="tag">all shown</span></div>'+
            '<div class="row"><span class="cb on"></span><div class="t">Keeps a spare key by the clinic door</div><span class="tag">Merge into memory</span></div>'+
            '<div class="row"><span class="cb on"></span><div class="t">Walks home along the east pier</div><span class="tag">Merge into memory</span></div>'+
            '<div class="row warnrow"><span class="cb"></span><div class="t">Trained at the inland hospital<div class="meta">weak subject match</div></div><span class="tag warn">check</span></div>'+
            '<div class="row"><span class="cb on"></span><div class="t">Prefers the night shift</div><span class="tag">Merge into memory</span></div>'+
            '<div class="row"><span class="cb on"></span><div class="t">Keeps a tide table pinned by the door</div><span class="tag">Merge into memory</span></div>'+
            '<div class="row"><span class="cb on"></span><div class="t">Speaks two harbour dialects</div><span class="tag">Merge into memory</span></div>'+
            '<div class="empty">6 more rows, read end to end</div>'+
            '<div class="hdr"><span class="grow"></span><span class="btn pri">Accept eligible (12)</span><span class="btn">Select all</span><span class="btn">Show all</span></div>'+
          '</div>'+
        '</div>'+
      '</div></div>',
    phone:
      '<div class="dev"><div class="dev-phone">'+
        '<div class="main">'+
          '<div class="topbar"><span class="ico hot">M</span>LONG-TERM MEMORY<span class="ico wide">one card</span></div>'+
          '<div class="rail"><span class="rt">Memories</span><span class="rt on">Review<span class="b">12</span></span><span class="rt">Sources</span><span class="rt">Settings</span></div>'+
          '<div class="pane">'+
            '<div class="hdr"><span class="grow">12 mutations &middot; all shown</span></div>'+
            '<div class="row"><span class="cb on"></span><div class="t">Keeps a spare key by the clinic door</div></div>'+
            '<div class="row"><span class="cb on"></span><div class="t">Walks home along the east pier</div></div>'+
            '<div class="row warnrow"><span class="cb"></span><div class="t">Trained at the inland hospital<div class="meta">weak subject match</div></div></div>'+
            '<div class="row"><span class="cb on"></span><div class="t">Prefers the night shift</div></div>'+
            '<div class="row"><span class="cb on"></span><div class="t">Keeps a tide table pinned by the door</div></div>'+
            '<div class="empty">7 more rows</div>'+
            '<div class="note-s">No facet rail, no group-by, no sort</div>'+
          '</div>'+
          '<div class="inputbar"><span class="btn pri">Accept eligible (12)</span><span class="btn">Select all</span></div>'+
        '</div>'+
      '</div></div>'
  }

];

FLOWS.j3 = [
  {n:"01", t:"Compose", d:"pick facets, read the counts"},
  {n:"02", t:"Pivot", d:"group and sort the same list"},
  {n:"03", t:"Edit", d:"fix the text on the row"},
  {n:"04", t:"Resolve", d:"stored beside proposed"},
  {n:"05", t:"Apply", d:"preview, then a restore point"},
  {n:"06", t:"Or skip all of it", d:"twelve rows need no rail", term:true}
];

TRADE.j3 = {
  win:[
    "Eight hundred claims become a handful of slices, each worked to exhaustion before the next.",
    "Failures land on the offending rows before submit instead of arriving as one atomic draft error.",
    "A conflict shows what it will overwrite, and how often the model has leaned on it.",
    "The small case stays small: twelve rows get a list, not a filter engine."
  ],
  cost:[
    "Six facets and two pivots add more control surface than the current queue has in total.",
    "Selection survives regroup and re-sort but not a reload, because the package has no client storage.",
    "The preview doubles the projection work for every apply, once to check and once to write.",
    "Two of the facet counts stay unavailable while the semantic lane is dead."
  ],
  build:[
    "targets[] is already on the wire and already consumed; giving it a header and a pivot is presentation, not a new query.",
    "match.basis is computed during subject resolution already and needs threading onto the mutation.",
    "The preview needs a new route, so it lands at a release boundary rather than at runtime.",
    "The restore point reuses the backup export; real undo would need commit journals retained past publish()."
  ]
};
