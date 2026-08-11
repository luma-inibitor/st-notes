// Assembles the LTM review into one self-contained HTML file.
//
//   node report/build.mjs
//
// Sources of truth:
//   findings.json          the findings, edited through triage-app.cjs
//   report/sec-*.html      hand-written prose sections
//   wireframes/_shell-hifi.html   stylesheet, masthead, constraint cards, journey machinery
//   wireframes/data-j*.js  journey state data
//
// The findings section and the roll-up table are NOT baked into the html as
// static markup. findings.json travels inside the page as a JSON data island
// and the browser renders both regions from it at runtime, so the page and the
// JSON can never disagree. The page stays one file, which is what makes it work
// from file:// and from htmlpreview, where a fetch() of a sibling JSON would be
// blocked by CORS.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

const d = JSON.parse(read("findings.json"));
const allFindings = [...d.findings].sort((a, b) => a.order - b.order);

// cluster order follows the reading order, densest damage first
const CLUSTERS = [
  "Recall that silently does nothing",
  "Reviewing without seeing consequences",
  "The vault decaying with use",
  "Extraction that loses work quietly",
  "No account of what recall did",
  "Diagnosing it",
  "Organising the review queue",
  "Running extraction at scale",
  "Getting oriented",
  "Marinara Engine",
  "What the vault is fed",
  "Prototype workbench",
];

// ── the data island ──────────────────────────────────────────────────────────
// Only the fields the renderer reads survive this filter. `annotations` are the
// operator's private triage notes to themselves: they stay in findings.json,
// where the triage app shows them, and they must never reach the published
// page. Since the whole payload now ships inside the html, dropping them here
// is the only thing standing between those notes and the reader. The top-level
// `removed` and `notes` arrays are dropped for the same reason — nothing
// renders them.
const PUBLIC_FIELDS = [
  "order",
  "statement",
  "description",
  "fix",
  "severity",
  "effort",
  "grade",
  "cluster",
  "tags",
  "evidence",
];

const publicFinding = (f) => {
  const out = {};
  for (const k of PUBLIC_FIELDS) {
    if (f[k] === undefined || f[k] === null) continue;
    if (k === "evidence") {
      out.evidence = f.evidence.map((e) => ({ file: e.file, symbol: e.symbol }));
    } else if (k === "tags") {
      out.tags = [...f.tags];
    } else {
      out[k] = f[k];
    }
  }
  if (!out.tags) out.tags = [];
  return out;
};

const island = { clusters: CLUSTERS, findings: allFindings.map(publicFinding) };

// A <script> element ends at the first "</" in its text, and "<!--" opens a
// comment, so no raw angle bracket may survive inside the island. \u escapes are
// legal JSON and JSON.parse restores the original characters, unlike HTML
// entities, which are not decoded inside a script element.
const islandJson = JSON.stringify(island)
  .replace(/</g, "\\u003c")
  .replace(/>/g, "\\u003e")
  .replace(/&/g, "\\u0026");

// ── the client renderer ──────────────────────────────────────────────────────
// Emitted inline, in document order, immediately after the section it fills.
// Classic inline scripts run synchronously during parse, so both regions exist
// in the DOM before the shell's own scripts at the bottom of the page build the
// table of contents, the facet engine and the collapse control over them.
const commonJs = `
  var island = document.getElementById("findings-data");
  var DATA = JSON.parse(island.textContent);
  var findings = DATA.findings.slice().sort(function (a, b) { return a.order - b.order; });

  function esc(s) {
    return String(s).replace(/[&<>]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c];
    });
  }
  // attribute values additionally need their quotes neutralised
  function attr(s) { return esc(s).replace(/"/g, "&quot;"); }
  // backticked spans become <code>, so descriptions read as they were written
  function rich(s) {
    return esc(s).replace(/\`([^\`]+)\`/g, function (_, t) { return "<code>" + t + "</code>"; });
  }
  function count(list, field, value) {
    return list.filter(function (f) { return f[field] === value; }).length;
  }
`;

const findingsJs = `<script>
(function () {${commonJs}
  var SEV = ["critical", "high", "medium", "low"];
  var EFF = ["small", "medium", "large"];

  function chipRow(f) {
    var out = ['<span class="fchip sev-' + f.severity + '">' + f.severity + "</span>"];
    if (f.effort) out.push('<span class="fchip eff">' + f.effort + " fix</span>");
    out.push('<span class="fchip grade">' + f.grade + "</span>");
    f.tags.forEach(function (t) {
      out.push('<span class="fchip tag-' + t.toLowerCase() + '">' + t + "</span>");
    });
    return out.join("");
  }

  function evidence(f) {
    if (!f.evidence || !f.evidence.length) return "";
    var items = f.evidence.map(function (e) {
      return '<span class="ev"><b>' + esc(e.file) + "</b> " + esc(e.symbol) + "</span>";
    }).join("");
    return '<div class="evrow">' + items + "</div>";
  }

  function findingHtml(f) {
    var text = (f.statement + " " + f.description + " " + f.fix).toLowerCase().replace(/[\`"]/g, " ");
    return "\\n      " +
      '<article class="finding" id="f' + f.order + '" data-sev="' + attr(f.severity) +
        '" data-eff="' + attr(f.effort || "") + '" data-grade="' + attr(f.grade) +
        '" data-cluster="' + attr(f.cluster) + '" data-tags="' + attr(f.tags.join(" ")) +
        '" data-text="' + attr(text) + '">' +
      "\\n        " + '<header class="fhead">' +
      "\\n          " + '<button class="ftoggle" type="button" aria-expanded="true" aria-controls="b' + f.order + '" aria-label="Collapse this finding"><span class="caret"></span></button>' +
      "\\n          " + '<span class="fnum">F' + f.order + "</span>" +
      "\\n          " + "<h4>" + rich(f.statement) + "</h4>" +
      "\\n        " + "</header>" +
      "\\n        " + '<div class="fchips">' + chipRow(f) + "</div>" +
      "\\n        " + '<div class="fbody" id="b' + f.order + '">' +
      "\\n          " + '<p class="fdesc">' + rich(f.description) + "</p>" +
      "\\n          " + evidence(f) +
      "\\n          " + '<p class="ffix"><span class="fixlabel">Smallest fix</span>' + rich(f.fix) + "</p>" +
      "\\n          " +
      "\\n        " + "</div>" +
      "\\n      " + "</article>";
  }

  var byCluster = {};
  var order = DATA.clusters.slice();
  findings.forEach(function (f) {
    if (!byCluster[f.cluster]) { byCluster[f.cluster] = []; if (order.indexOf(f.cluster) < 0) order.push(f.cluster); }
    byCluster[f.cluster].push(f);
  });

  var clusterSections = order.map(function (name) {
    var list = byCluster[name] || [];
    if (!list.length) return "";
    var crit = count(list, "severity", "critical");
    var high = count(list, "severity", "high");
    var badge = [list.length + " findings", crit ? crit + " critical" : "", high ? high + " high" : ""]
      .filter(Boolean).join(" \\u00b7 ");
    return "\\n    " +
      '<div class="cluster" data-cluster="' + attr(name) + '">' +
      "\\n      " + '<div class="chead">' +
      "\\n        " + "<h3>" + esc(name) + "</h3>" +
      "\\n        " + '<span class="cmeta">' + badge + "</span>" +
      "\\n      " + "</div>" +
      "\\n      " + list.map(findingHtml).join("") +
      "\\n    " + "</div>";
  }).join("");

  var sevCounts = SEV.map(function (s) { return count(findings, "severity", s) + " " + s; }).join(" \\u00b7 ");
  var effCounts = EFF.map(function (e) { return count(findings, "effort", e) + " " + e; }).join(" \\u00b7 ");
  var bugCount = findings.filter(function (f) { return f.tags.indexOf("BUG") >= 0; }).length;

  var html =
    "\\n    " + '<div class="sec-head">' +
    "\\n      " + '<p class="eyebrow">The catalogue</p>' +
    "\\n      " + "<h2>" + findings.length + " findings</h2>" +
    "\\n      " + '<p class="prose">' +
    "\\n        Grouped so that each cluster is a coherent piece of work rather than a module boundary." +
    "\\n        Severity reads " + sevCounts + ". Effort reads " + effCounts + ", and that distribution is the" +
    "\\n        argument: more than half of these are cheap, because the product already computes the" +
    "\\n        thing and discards it. " + bugCount + " carry a bug tag, separating unintended behaviour from" +
    "\\n        a design tradeoff." +
    "\\n      " + "</p>" +
    "\\n    " + "</div>" +
    "\\n    " + '<div class="findings-layout">' +
    "\\n      " + '<aside class="facetpanel" id="facetpanel" aria-label="Filter findings"></aside>' +
    "\\n      " + '<div class="findings-body">' + clusterSections + "</div>" +
    "\\n    " + "</div>" +
    "\\n  ";

  var sec = document.getElementById("findings");
  if (sec) sec.insertAdjacentHTML("beforeend", html);
})();
</script>`;

const rollupJs = `<script>
(function () {${commonJs}
  // cheap first: effort, then severity, then the reading order
  var rank = { small: 0, medium: 1, large: 2 };
  var sevRank = { critical: 0, high: 1, medium: 2, low: 3 };
  var rollup = findings
    .filter(function (f) { return f.tags.indexOf("PROTO") < 0; })
    .sort(function (a, b) {
      return rank[a.effort] - rank[b.effort] ||
        sevRank[a.severity] - sevRank[b.severity] ||
        a.order - b.order;
    });

  function owner(f) {
    return f.tags.indexOf("ENGINE") >= 0 ? "engine"
      : f.tags.indexOf("CORPUS") >= 0 ? "upstream" : "package";
  }

  var rows = rollup.map(function (f) {
    return "<tr>" +
      "\\n        " + '<td><a href="#f' + f.order + '">F' + f.order + "</a></td>" +
      "\\n        " + "<td>" + rich(f.statement) + "</td>" +
      "\\n        " + "<td>" + rich(f.fix) + "</td>" +
      "\\n        " + "<td>" + esc(f.effort) + "</td>" +
      "\\n        " + "<td>" + esc(f.severity) + "</td>" +
      "\\n        " + "<td>" + owner(f) + "</td>" +
      "\\n      " + "</tr>";
  }).join("");

  var smalls = rollup.filter(function (f) { return f.effort === "small"; }).length;

  var html =
    "\\n    " + '<div class="sec-head">' +
    "\\n      " + '<p class="eyebrow">What to change</p>' +
    "\\n      " + "<h2>Every fix, cheapest first</h2>" +
    "\\n      " + '<p class="prose">' +
    "\\n        One row per finding, ordered by effort and then by severity, so the top of this table is" +
    "\\n        where the value per unit of work is highest. " + smalls + " of " + rollup.length + " are small, and" +
    "\\n        they are small for one reason: the engine already computes the thing and throws it away." +
    "\\n        The owner column separates what the package controls from what the engine owns and what" +
    "\\n        arrives from upstream of both. Prototype findings sit outside this table, since they" +
    "\\n        describe the operator's own tool." +
    "\\n      " + "</p>" +
    "\\n    " + "</div>" +
    "\\n    " + '<div class="tablewrap"><table class="dev-table rollup">' +
    "\\n      " + "<tr><th>#</th><th>Finding</th><th>Smallest fix</th><th>Effort</th><th>Severity</th><th>Owner</th></tr>" +
    "\\n      " + rows +
    "\\n    " + "</table></div>" +
    "\\n  ";

  var sec = document.getElementById("recommendations");
  if (sec) sec.insertAdjacentHTML("beforeend", html);
})();
</script>`;

// No whitespace inside the section: the island is its only child until the
// renderer appends, so the live DOM matches what the old baked markup produced.
const findingsSection = `
  <section id="findings"><script type="application/json" id="findings-data">${islandJson}</script></section>
  ${findingsJs}`;

const recSection = `
  <section id="recommendations"></section>
  ${rollupJs}`;

// ── assemble ─────────────────────────────────────────────────────────────────
const shell = read("wireframes/_shell-hifi.html");
const journeyData = ["j1", "j2", "j3", "j4", "j5", "j6"]
  .map((n) => read(`wireframes/data-${n}.js`).trim())
  .join("\n\n");

const sections = ["sec-orientation", "sec-story", "sec-goods"]
  .map((n) => {
    const p = path.join(root, "report", n + ".html");
    return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : `<!-- missing ${n} -->`;
  })
  .join("\n");

const appendix = (() => {
  const p = path.join(root, "report", "sec-appendix.html");
  return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "<!-- missing appendix -->";
})();

let out = shell
  .replace("/*JOURNEY_DATA*/", "const STATES={},FLOWS={},TRADE={};\n\n" + journeyData)
  // prose and findings land before the journeys; recommendations and appendix after
  .replace('<section id="ground">', sections + '\n  <section id="ground">')
  .replace('<section id="journeys">', findingsSection + '\n  <section id="journeys">')
  .replace('<section id="deviations">', recSection + '\n  <section id="deviations">')
  .replace("</section>\n\n</div>\n<nav", "</section>\n" + appendix + "\n</div>\n<nav");

const fail = (msg) => { console.error(msg); process.exit(1); };

for (const id of ["orientation","what-happened","goods","ground","findings","journeys","recommendations","deviations","appendix"]) {
  if (!out.includes(`id="${id}"`)) fail("MISSING SECTION: " + id);
}

// ── the island is the page's source of truth, so verify it in the output ─────
const islandMatch = out.match(
  /<script type="application\/json" id="findings-data">([\s\S]*?)<\/script>/,
);
if (!islandMatch) fail("MISSING DATA ISLAND: findings-data");
const islandText = islandMatch[1];
if (/<\//.test(islandText)) fail("DATA ISLAND contains a raw '</' and would terminate early");
let parsed;
try {
  parsed = JSON.parse(islandText);
} catch (e) {
  fail("DATA ISLAND does not parse: " + e.message);
}
if (parsed.findings.length !== d.findings.length) {
  fail(`DATA ISLAND has ${parsed.findings.length} findings, findings.json has ${d.findings.length}`);
}
if (islandText.includes("annotations")) fail("DATA ISLAND leaks private annotations");
if (out.includes("annotations")) fail("OUTPUT mentions annotations");

fs.writeFileSync(path.join(root, "ltm-review.html"), out);

const clustersUsed = new Set(parsed.findings.map((f) => f.cluster)).size;
const rollupRows = parsed.findings.filter((f) => !f.tags.includes("PROTO")).length;
console.log("findings embedded:", parsed.findings.length, "| clusters:", clustersUsed);
console.log("roll-up rows:", rollupRows, "| island bytes:", islandText.length);
console.log("sections:", (out.match(/<section /g) || []).length, "| bytes:", out.length);
