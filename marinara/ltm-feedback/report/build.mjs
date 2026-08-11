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
// The findings section is generated, never hand-edited: edit the JSON.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

const esc = (s) =>
  String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

// backticked spans become <code>, so descriptions read as they were written
const rich = (s) =>
  esc(s).replace(/`([^`]+)`/g, (_, t) => `<code>${t}</code>`);

const d = JSON.parse(read("findings.json"));
const findings = [...d.findings].sort((a, b) => a.order - b.order);

const SEV = ["critical", "high", "medium", "low"];
const EFF = ["small", "medium", "large"];

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

const byCluster = new Map(CLUSTERS.map((c) => [c, []]));
for (const f of findings) {
  if (!byCluster.has(f.cluster)) byCluster.set(f.cluster, []);
  byCluster.get(f.cluster).push(f);
}

const count = (list, field, value) => list.filter((f) => f[field] === value).length;

function chipRow(f) {
  const out = [`<span class="fchip sev-${f.severity}">${f.severity}</span>`];
  if (f.effort) out.push(`<span class="fchip eff">${f.effort} fix</span>`);
  out.push(`<span class="fchip grade">${f.grade}</span>`);
  for (const t of f.tags) out.push(`<span class="fchip tag-${t.toLowerCase()}">${t}</span>`);
  return out.join("");
}

function evidence(f) {
  if (!f.evidence || !f.evidence.length) return "";
  const items = f.evidence
    .map((e) => `<span class="ev"><b>${esc(e.file)}</b> ${esc(e.symbol)}</span>`)
    .join("");
  return `<div class="evrow">${items}</div>`;
}

// Annotations are the operator's triage notes to themselves. They stay in the
// JSON, where the triage app shows them, and never reach the report. Anything a
// maintainer needs to read belongs in the description or the fix.
function annotations() {
  return "";
}

function findingHtml(f) {
  return `
      <article class="finding" id="f${f.order}" data-sev="${f.severity}" data-eff="${f.effort || ""}" data-grade="${f.grade}" data-cluster="${esc(f.cluster)}" data-tags="${f.tags.join(" ")}" data-text="${esc((f.statement+" "+f.description+" "+f.fix).toLowerCase().replace(/[`"]/g," "))}">
        <header class="fhead">
          <button class="ftoggle" type="button" aria-expanded="true" aria-controls="b${f.order}" aria-label="Collapse this finding"><span class="caret"></span></button>
          <span class="fnum">F${f.order}</span>
          <h4>${rich(f.statement)}</h4>
        </header>
        <div class="fchips">${chipRow(f)}</div>
        <div class="fbody" id="b${f.order}">
          <p class="fdesc">${rich(f.description)}</p>
          ${evidence(f)}
          <p class="ffix"><span class="fixlabel">Smallest fix</span>${rich(f.fix)}</p>
          ${annotations(f)}
        </div>
      </article>`;
}

const clusterSections = CLUSTERS.map((name) => {
  const list = byCluster.get(name) || [];
  if (!list.length) return "";
  const crit = count(list, "severity", "critical");
  const high = count(list, "severity", "high");
  const badge = [
    `${list.length} findings`,
    crit ? `${crit} critical` : "",
    high ? `${high} high` : "",
  ]
    .filter(Boolean)
    .join(" · ");
  return `
    <div class="cluster" data-cluster="${esc(name)}">
      <div class="chead">
        <h3>${esc(name)}</h3>
        <span class="cmeta">${badge}</span>
      </div>
      ${list.map(findingHtml).join("")}
    </div>`;
}).join("");

const sevCounts = SEV.map((s) => `${count(findings, "severity", s)} ${s}`).join(" · ");
const effCounts = EFF.map((e) => `${count(findings, "effort", e)} ${e}`).join(" · ");
const bugCount = findings.filter((f) => f.tags.includes("BUG")).length;

const findingsSection = `
  <section id="findings">
    <div class="sec-head">
      <p class="eyebrow">The catalogue</p>
      <h2>${findings.length} findings</h2>
      <p class="prose">
        Grouped so that each cluster is a coherent piece of work rather than a module boundary.
        Severity reads ${sevCounts}. Effort reads ${effCounts}, and that distribution is the
        argument: more than half of these are cheap, because the product already computes the
        thing and discards it. ${bugCount} carry a bug tag, separating unintended behaviour from
        a design tradeoff.
      </p>
    </div>
    <div class="findings-layout">
      <aside class="facetpanel" id="facetpanel" aria-label="Filter findings"></aside>
      <div class="findings-body">${clusterSections}</div>
    </div>
  </section>`;

// ── the roll-up of every fix, ordered cheap first ────────────────────────────
const rank = { small: 0, medium: 1, large: 2 };
const sevRank = { critical: 0, high: 1, medium: 2, low: 3 };
const rollup = [...findings]
  .filter((f) => !f.tags.includes("PROTO"))
  .sort(
    (a, b) =>
      rank[a.effort] - rank[b.effort] ||
      sevRank[a.severity] - sevRank[b.severity] ||
      a.order - b.order,
  );

const owner = (f) =>
  f.tags.includes("ENGINE") ? "engine" : f.tags.includes("CORPUS") ? "upstream" : "package";

const rollupRows = rollup
  .map(
    (f) => `<tr>
        <td><a href="#f${f.order}">F${f.order}</a></td>
        <td>${rich(f.statement)}</td>
        <td>${rich(f.fix)}</td>
        <td>${f.effort}</td>
        <td>${f.severity}</td>
        <td>${owner(f)}</td>
      </tr>`,
  )
  .join("");

const smalls = rollup.filter((f) => f.effort === "small").length;
const recSection = `
  <section id="recommendations">
    <div class="sec-head">
      <p class="eyebrow">What to change</p>
      <h2>Every fix, cheapest first</h2>
      <p class="prose">
        One row per finding, ordered by effort and then by severity, so the top of this table is
        where the value per unit of work is highest. ${smalls} of ${rollup.length} are small, and
        they are small for one reason: the engine already computes the thing and throws it away.
        The owner column separates what the package controls from what the engine owns and what
        arrives from upstream of both. Prototype findings sit outside this table, since they
        describe the operator's own tool.
      </p>
    </div>
    <div class="tablewrap"><table class="dev-table rollup">
      <tr><th>#</th><th>Finding</th><th>Smallest fix</th><th>Effort</th><th>Severity</th><th>Owner</th></tr>
      ${rollupRows}
    </table></div>
  </section>`;

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

for (const id of ["orientation","what-happened","goods","ground","findings","journeys","recommendations","deviations","appendix"]) {
  if (!out.includes(`id="${id}"`)) { console.error("MISSING SECTION:", id); process.exit(1); }
}

fs.writeFileSync(path.join(root, "ltm-review.html"), out);

const c = (re) => (out.match(re) || []).length;
console.log("findings rendered:", c(/class="finding"/g), "of", findings.length);
console.log("rollup rows:", rollup.length, "| clusters:", CLUSTERS.length);
console.log("sections:", c(/<section /g), "| bytes:", out.length);
