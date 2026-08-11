#!/usr/bin/env node
/*
 * triage-app.cjs — local single-file triage tool for research findings.
 *
 * Zero dependencies. Node stdlib only (http, fs, path, url).
 *
 *   node triage-app.cjs [--port 8787] [--data ./findings.json] [--host 127.0.0.1]
 *
 * Data safety: in-memory doc is authoritative during a run; every mutation is
 * validated against a deep clone before being accepted, disk writes are atomic
 * (temp file + rename), and the data file is backed up once per run before the
 * first write (last 10 backups retained).
 */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const urlmod = require('url');

// ---------------------------------------------------------------------------
// args
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const out = { port: 8787, host: '127.0.0.1', data: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--port' || a === '-p') out.port = parseInt(argv[++i], 10);
    else if (a === '--host' || a === '-H') out.host = argv[++i];
    else if (a === '--data' || a === '-d') out.data = argv[++i];
    else if (a === '--help' || a === '-h') {
      process.stdout.write('usage: node triage-app.cjs [--port 8787] [--data <path>] [--host 127.0.0.1]\n');
      process.exit(0);
    } else {
      process.stderr.write('unknown argument: ' + a + '\n');
      process.exit(2);
    }
  }
  if (!Number.isInteger(out.port) || out.port < 0 || out.port > 65535) {
    process.stderr.write('invalid --port\n');
    process.exit(2);
  }
  return out;
}

const ARGS = parseArgs(process.argv.slice(2));
const DATA_PATH = path.resolve(ARGS.data || path.join(__dirname, 'findings.json'));
const DATA_DIR = path.dirname(DATA_PATH);
const DATA_BASE = path.basename(DATA_PATH).replace(/\.json$/i, '');

// ---------------------------------------------------------------------------
// defaults / fixture
// ---------------------------------------------------------------------------

const DEFAULT_TAGS = ['UX', 'ARCH', 'SCALE', 'USER', 'ENV', 'MODEL', 'BUG', 'ENGINE', 'CORPUS', 'PROTO'];
const DEFAULT_SEVERITY = ['critical', 'high', 'medium', 'low'];
const DEFAULT_GRADE = ['source', 'observed', 'measured', 'reported'];
const DEFAULT_DECISION = ['keep', 'cut', 'rework', 'merge'];
const DEFAULT_EFFORT = ['small', 'medium', 'large'];

// What each severity level means, shown in the ? cheatsheet and as tooltips on
// severity chips and severity selectors. Edit here to reword.
// This may eventually move into meta.severityRubric in the data file; until then
// the app is the only place it lives.
const SEVERITY_RUBRIC = {
  critical: 'Really bad bugs and fundamental functionality issues.',
  high: 'Problems that feel like betrayal: the UI straight up lies to you, or constraints most people will hit.',
  medium: 'Workaroundable by hitting the API; misleading but not incorrect UI; constraints only a power user will hit; confusing UX.',
  low: 'Fixable with better prompting, possibly model-dependent, possibly user skill issue, or surmountable by poking around a clunky UI.',
};

// Shift+<letter> sets a decision on the cursor row. Values must exist in
// meta.decisionVocabulary or the key is ignored.
const DECISION_KEYS = { K: 'keep', C: 'cut', R: 'rework', M: 'merge' };

function fixtureDoc() {
  const now = new Date().toISOString();
  const mk = (id, order, statement, tags, severity, grade, group) => ({
    id: id,
    order: order,
    statement: statement,
    tags: tags,
    severity: severity,
    grade: grade,
    group: group,
    cluster: null,
    decision: null,
    mergeInto: null,
    annotations: [],
    edited: false,
  });
  return {
    meta: {
      schemaVersion: 1,
      title: 'LTM Findings (fixture)',
      ltmPackage: '1.1.6',
      engine: '2.4.1',
      updatedAt: now,
      tagVocabulary: DEFAULT_TAGS.slice(),
      severityVocabulary: DEFAULT_SEVERITY.slice(),
      gradeVocabulary: DEFAULT_GRADE.slice(),
      decisionVocabulary: DEFAULT_DECISION.slice(),
      effortVocabulary: DEFAULT_EFFORT.slice(),
    },
    findings: [
      mk('fixture-cold-start', 1, 'Cold start writes no memory at all, so the first session teaches the agent nothing. See finding 3 for the related recall gap.', ['UX', 'ARCH'], 'critical', 'source', 'Lifecycle'),
      mk('fixture-recall-latency', 2, 'Recall latency grows linearly with corpus size; at 10k entries a lookup takes over two seconds.', ['SCALE', 'ENGINE'], 'high', 'measured', 'Performance'),
      mk('fixture-silent-drop', 3, 'Writes past the token budget are silently dropped with no warning surfaced to the user.', ['BUG', 'UX'], 'high', 'observed', 'Lifecycle'),
      mk('fixture-tag-drift', 4, 'Tag vocabulary drifts between packages, so cross-package queries miss results.', ['CORPUS', 'PROTO'], 'medium', 'reported', 'Corpus'),
      mk('fixture-env-detect', 5, 'Environment detection assumes a POSIX shell and misreports on Windows hosts.', ['ENV'], 'low', 'observed', 'Environment'),
    ],
    removed: [],
    notes: ['This is a locally generated 5-entry fixture. Replace with the real findings.json.'],
  };
}

// ---------------------------------------------------------------------------
// state
// ---------------------------------------------------------------------------

let doc = null;
let baselineIds = [];
let dirty = false;
let lastError = null;
let lastSavedAt = null;
let backupDoneThisRun = false;
let backupPath = null;
let flushTimer = null;
const FLUSH_DEBOUNCE_MS = 600;

let idCounter = 0;
function genId(prefix) {
  idCounter += 1;
  return (
    prefix +
    '-' +
    Date.now().toString(36) +
    '-' +
    idCounter.toString(36) +
    Math.floor(Math.random() * 1e6).toString(36)
  );
}

function arr(v) {
  return Array.isArray(v) ? v : [];
}

function normalize(d) {
  if (!d || typeof d !== 'object') throw new Error('data file is not a JSON object');
  d.meta = d.meta && typeof d.meta === 'object' ? d.meta : {};
  const m = d.meta;
  if (typeof m.schemaVersion !== 'number') m.schemaVersion = 1;
  if (typeof m.title !== 'string') m.title = 'Findings';
  if (!Array.isArray(m.tagVocabulary) || !m.tagVocabulary.length) m.tagVocabulary = DEFAULT_TAGS.slice();
  if (!Array.isArray(m.severityVocabulary) || !m.severityVocabulary.length) m.severityVocabulary = DEFAULT_SEVERITY.slice();
  if (!Array.isArray(m.gradeVocabulary) || !m.gradeVocabulary.length) m.gradeVocabulary = DEFAULT_GRADE.slice();
  if (!Array.isArray(m.decisionVocabulary) || !m.decisionVocabulary.length) m.decisionVocabulary = DEFAULT_DECISION.slice();
  if (!Array.isArray(m.effortVocabulary) || !m.effortVocabulary.length) m.effortVocabulary = DEFAULT_EFFORT.slice();
  if (!Array.isArray(d.findings)) throw new Error('data file has no findings array');
  d.removed = arr(d.removed);
  d.notes = arr(d.notes);
  d.findings.forEach(function (f, i) {
    if (!f || typeof f !== 'object') throw new Error('findings[' + i + '] is not an object');
    if (typeof f.id !== 'string' || !f.id) f.id = 'finding-' + (i + 1);
    if (typeof f.order !== 'number') f.order = i + 1;
    if (typeof f.statement !== 'string') f.statement = '';
    // description and evidence are optional and supplied by a separate process:
    // absent stays absent so this tool never invents fields it does not own.
    if (f.description !== undefined && typeof f.description !== 'string') {
      f.description = f.description == null ? '' : String(f.description);
    }
    if (f.evidence !== undefined) {
      f.evidence = arr(f.evidence)
        .filter(function (e) { return e && typeof e === 'object'; })
        .map(function (e) {
          return {
            file: typeof e.file === 'string' ? e.file : '',
            symbol: typeof e.symbol === 'string' ? e.symbol : '',
          };
        });
    }
    // fix and effort are optional in the same way: absent stays absent.
    if (f.fix !== undefined && typeof f.fix !== 'string') {
      f.fix = f.fix == null ? '' : String(f.fix);
    }
    if (f.effort !== undefined && f.effort !== null && typeof f.effort !== 'string') {
      f.effort = String(f.effort);
    }
    f.tags = arr(f.tags).filter(function (t) { return typeof t === 'string' && t; });
    if (typeof f.severity !== 'string') f.severity = m.severityVocabulary[m.severityVocabulary.length - 1];
    if (typeof f.grade !== 'string') f.grade = m.gradeVocabulary[0];
    if (typeof f.group !== 'string') f.group = f.group == null ? null : String(f.group);
    if (f.cluster !== null && typeof f.cluster !== 'string') f.cluster = f.cluster == null ? null : String(f.cluster);
    if (f.decision !== null && typeof f.decision !== 'string') f.decision = null;
    if (f.mergeInto !== null && typeof f.mergeInto !== 'string') f.mergeInto = null;
    f.annotations = arr(f.annotations)
      .filter(function (a) { return a && typeof a === 'object'; })
      .map(function (a) {
        return {
          id: typeof a.id === 'string' && a.id ? a.id : genId('ann'),
          text: typeof a.text === 'string' ? a.text : '',
          createdAt: typeof a.createdAt === 'string' ? a.createdAt : new Date().toISOString(),
        };
      });
    f.edited = f.edited === true;
    // unknown tags in the file are legitimate custom tags: adopt them
    f.tags.forEach(function (t) {
      if (m.tagVocabulary.indexOf(t) === -1) m.tagVocabulary.push(t);
    });
  });
  return d;
}

function load() {
  if (!fs.existsSync(DATA_PATH)) {
    const fx = fixtureDoc();
    const tmp = DATA_PATH + '.tmp-init-' + process.pid;
    fs.writeFileSync(tmp, JSON.stringify(fx, null, 2));
    fs.renameSync(tmp, DATA_PATH);
    process.stdout.write('no data file found; wrote 5-entry fixture to ' + DATA_PATH + '\n');
  }
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    throw new Error('could not parse ' + DATA_PATH + ': ' + e.message);
  }
  doc = normalize(parsed);
  baselineIds = doc.findings.map(function (f) { return f.id; });
  dirty = false;
  lastError = null;
}

// ---------------------------------------------------------------------------
// validation
// ---------------------------------------------------------------------------

function validate(d) {
  const errs = [];
  if (!d || typeof d !== 'object') return ['document is not an object'];
  const m = d.meta;
  if (!m || typeof m !== 'object') return ['missing meta'];
  const sev = arr(m.severityVocabulary);
  const grd = arr(m.gradeVocabulary);
  const tgs = arr(m.tagVocabulary);
  const dec = arr(m.decisionVocabulary);
  const eff = arr(m.effortVocabulary);
  if (!sev.length) errs.push('meta.severityVocabulary is empty');
  if (!grd.length) errs.push('meta.gradeVocabulary is empty');
  if (!eff.length) errs.push('meta.effortVocabulary is empty');
  if (!Array.isArray(d.findings)) return ['findings is not an array'];

  const ids = Object.create(null);
  d.findings.forEach(function (f) {
    if (f && typeof f.id === 'string') ids[f.id] = true;
  });

  // never lose a finding that existed when this run started
  const missing = baselineIds.filter(function (id) { return !ids[id]; });
  if (missing.length) {
    errs.push('write would drop ' + missing.length + ' finding(s): ' + missing.slice(0, 5).join(', '));
  }

  d.findings.forEach(function (f, i) {
    const where = 'findings[' + i + '] (' + (f && f.id) + ')';
    if (!f || typeof f !== 'object') { errs.push(where + ' is not an object'); return; }
    if (typeof f.id !== 'string' || !f.id) errs.push(where + ' has no id');
    if (typeof f.statement !== 'string') errs.push(where + ' statement must be a string');
    // description / evidence are optional: absent is always fine
    if (f.description !== undefined && typeof f.description !== 'string') errs.push(where + ' description must be a string');
    if (f.evidence !== undefined) {
      if (!Array.isArray(f.evidence)) errs.push(where + ' evidence must be an array');
      else f.evidence.forEach(function (e, j) {
        if (!e || typeof e !== 'object') errs.push(where + ' evidence ' + j + ' is not an object');
        else {
          if (e.file !== undefined && typeof e.file !== 'string') errs.push(where + ' evidence ' + j + ' file must be a string');
          if (e.symbol !== undefined && typeof e.symbol !== 'string') errs.push(where + ' evidence ' + j + ' symbol must be a string');
        }
      });
    }
    // fix / effort are optional: absent is always fine
    if (f.fix !== undefined && typeof f.fix !== 'string') errs.push(where + ' fix must be a string');
    if (f.effort !== undefined && f.effort !== null && eff.indexOf(f.effort) === -1) errs.push(where + ' effort "' + f.effort + '" not in effortVocabulary');
    if (sev.indexOf(f.severity) === -1) errs.push(where + ' severity "' + f.severity + '" not in severityVocabulary');
    if (grd.indexOf(f.grade) === -1) errs.push(where + ' grade "' + f.grade + '" not in gradeVocabulary');
    if (!Array.isArray(f.tags)) errs.push(where + ' tags must be an array');
    else f.tags.forEach(function (t) {
      if (typeof t !== 'string' || !t) errs.push(where + ' has an empty tag');
      else if (tgs.indexOf(t) === -1) errs.push(where + ' tag "' + t + '" not in meta.tagVocabulary');
    });
    if (f.decision !== null && dec.indexOf(f.decision) === -1) errs.push(where + ' decision "' + f.decision + '" not in decisionVocabulary');
    if (f.mergeInto !== null) {
      if (typeof f.mergeInto !== 'string' || !ids[f.mergeInto]) errs.push(where + ' mergeInto "' + f.mergeInto + '" is not an existing finding id');
      else if (f.mergeInto === f.id) errs.push(where + ' cannot merge into itself');
    }
    if (f.cluster !== null && typeof f.cluster !== 'string') errs.push(where + ' cluster must be a string or null');
    if (!Array.isArray(f.annotations)) errs.push(where + ' annotations must be an array');
    else f.annotations.forEach(function (a, j) {
      if (!a || typeof a !== 'object') errs.push(where + ' annotation ' + j + ' is not an object');
      else {
        if (typeof a.id !== 'string' || !a.id) errs.push(where + ' annotation ' + j + ' has no id');
        if (typeof a.text !== 'string') errs.push(where + ' annotation ' + j + ' text must be a string');
      }
    });
  });

  if (!errs.length) {
    try {
      JSON.stringify(d);
    } catch (e) {
      errs.push('document is not serialisable: ' + e.message);
    }
  }
  return errs;
}

// ---------------------------------------------------------------------------
// persistence
// ---------------------------------------------------------------------------

function pruneBackups() {
  let entries;
  try {
    entries = fs.readdirSync(DATA_DIR);
  } catch (e) {
    return;
  }
  const re = new RegExp('^' + DATA_BASE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\.backup-.+\\.json$');
  const mine = entries.filter(function (n) { return re.test(n); }).sort();
  while (mine.length > 10) {
    const victim = mine.shift();
    try { fs.unlinkSync(path.join(DATA_DIR, victim)); } catch (e) { /* best effort */ }
  }
}

function ensureBackup() {
  if (backupDoneThisRun) return;
  if (fs.existsSync(DATA_PATH)) {
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const dest = path.join(DATA_DIR, DATA_BASE + '.backup-' + stamp + '.json');
    fs.copyFileSync(DATA_PATH, dest);
    backupPath = dest;
    process.stdout.write('backup: ' + dest + '\n');
  }
  backupDoneThisRun = true;
  pruneBackups();
}

function flushNow() {
  if (flushTimer) { clearTimeout(flushTimer); flushTimer = null; }
  if (!dirty && !lastError) return { ok: true, errors: [] };
  const errs = validate(doc);
  if (errs.length) {
    lastError = 'refused to write: ' + errs[0] + (errs.length > 1 ? ' (+' + (errs.length - 1) + ' more)' : '');
    return { ok: false, errors: errs };
  }
  let json;
  try {
    json = JSON.stringify(doc, null, 2) + '\n';
  } catch (e) {
    lastError = 'serialise failed: ' + e.message;
    return { ok: false, errors: [lastError] };
  }
  const tmp = path.join(DATA_DIR, '.' + DATA_BASE + '.tmp-' + process.pid + '-' + Date.now() + '.json');
  try {
    ensureBackup();
    fs.writeFileSync(tmp, json, 'utf8');
    // read the temp file back and re-parse before it becomes the real file
    const check = JSON.parse(fs.readFileSync(tmp, 'utf8'));
    if (!Array.isArray(check.findings) || check.findings.length !== doc.findings.length) {
      throw new Error('post-write verification failed (finding count mismatch)');
    }
    fs.renameSync(tmp, DATA_PATH);
    dirty = false;
    lastError = null;
    lastSavedAt = new Date().toISOString();
    return { ok: true, errors: [] };
  } catch (e) {
    try { if (fs.existsSync(tmp)) fs.unlinkSync(tmp); } catch (e2) { /* ignore */ }
    lastError = 'write failed: ' + e.message;
    return { ok: false, errors: [lastError] };
  }
}

function markDirty() {
  doc.meta.updatedAt = new Date().toISOString();
  dirty = true;
  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = setTimeout(function () {
    flushTimer = null;
    flushNow();
  }, FLUSH_DEBOUNCE_MS);
}

function saveState() {
  return {
    state: lastError ? 'error' : dirty ? 'unsaved' : 'saved',
    error: lastError,
    lastSavedAt: lastSavedAt,
    dataPath: DATA_PATH,
    backupPath: backupPath,
    findingCount: doc ? doc.findings.length : 0,
  };
}

// ---------------------------------------------------------------------------
// mutations
// ---------------------------------------------------------------------------

// evidence is deliberately absent: it is read-only in this tool.
const EDITABLE = ['statement', 'description', 'fix', 'effort', 'tags', 'severity', 'grade', 'cluster', 'decision', 'mergeInto'];

function findIn(d, id) {
  for (let i = 0; i < d.findings.length; i++) if (d.findings[i].id === id) return d.findings[i];
  return null;
}

function adoptTag(d, tag) {
  if (typeof tag !== 'string' || !tag.trim()) return null;
  const t = tag.trim();
  if (d.meta.tagVocabulary.indexOf(t) === -1) d.meta.tagVocabulary.push(t);
  return t;
}

function applyOp(d, op) {
  if (!op || typeof op !== 'object' || typeof op.type !== 'string') throw new Error('malformed op');
  const type = op.type;

  if (type === 'setField') {
    const f = findIn(d, op.id);
    if (!f) throw new Error('unknown finding id: ' + op.id);
    if (EDITABLE.indexOf(op.field) === -1) throw new Error('field not editable: ' + op.field);
    let v = op.value;
    if (op.field === 'tags') {
      if (!Array.isArray(v)) throw new Error('tags must be an array');
      const seen = Object.create(null);
      const out = [];
      v.forEach(function (t) {
        const tt = adoptTag(d, t);
        if (tt && !seen[tt]) { seen[tt] = true; out.push(tt); }
      });
      v = out;
    } else if (op.field === 'cluster' || op.field === 'mergeInto') {
      if (v === '' || v == null) v = null;
      else v = String(v).trim() || null;
    } else if (op.field === 'decision' || op.field === 'effort') {
      if (v === '' || v == null) v = null;
      else v = String(v);
    } else if (op.field === 'statement' || op.field === 'description' || op.field === 'fix') {
      v = String(v == null ? '' : v);
    } else {
      v = String(v);
    }
    f[op.field] = v;
    f.edited = true;
    return;
  }

  if (type === 'addAnnotation') {
    const f = findIn(d, op.id);
    if (!f) throw new Error('unknown finding id: ' + op.id);
    const text = String(op.text == null ? '' : op.text);
    if (!text.trim()) throw new Error('annotation text is empty');
    f.annotations.push({ id: genId('ann'), text: text, createdAt: new Date().toISOString() });
    f.edited = true;
    return;
  }

  if (type === 'editAnnotation') {
    const f = findIn(d, op.id);
    if (!f) throw new Error('unknown finding id: ' + op.id);
    const a = f.annotations.filter(function (x) { return x.id === op.annId; })[0];
    if (!a) throw new Error('unknown annotation id: ' + op.annId);
    a.text = String(op.text == null ? '' : op.text);
    f.edited = true;
    return;
  }

  if (type === 'deleteAnnotation') {
    const f = findIn(d, op.id);
    if (!f) throw new Error('unknown finding id: ' + op.id);
    const before = f.annotations.length;
    f.annotations = f.annotations.filter(function (x) { return x.id !== op.annId; });
    if (f.annotations.length === before) throw new Error('unknown annotation id: ' + op.annId);
    f.edited = true;
    return;
  }

  if (type === 'bulk') {
    const ids = arr(op.ids);
    if (!ids.length) throw new Error('bulk op has no ids');
    const kind = op.op;
    ids.forEach(function (id) {
      const f = findIn(d, id);
      if (!f) throw new Error('unknown finding id: ' + id);
      if (kind === 'severity') f.severity = String(op.value);
      else if (kind === 'grade') f.grade = String(op.value);
      else if (kind === 'addTag') {
        const t = adoptTag(d, op.value);
        if (!t) throw new Error('empty tag');
        if (f.tags.indexOf(t) === -1) f.tags.push(t);
      } else if (kind === 'removeTag') {
        f.tags = f.tags.filter(function (t) { return t !== String(op.value); });
      } else if (kind === 'cluster') {
        const c = op.value == null || op.value === '' ? null : String(op.value).trim() || null;
        f.cluster = c;
      } else if (kind === 'decision') {
        f.decision = op.value == null || op.value === '' ? null : String(op.value);
      } else if (kind === 'effort') {
        f.effort = op.value == null || op.value === '' ? null : String(op.value);
      } else {
        throw new Error('unknown bulk op: ' + kind);
      }
      f.edited = true;
    });
    return;
  }

  throw new Error('unknown op type: ' + type);
}

function mutate(ops) {
  const draft = JSON.parse(JSON.stringify(doc));
  try {
    arr(ops).forEach(function (op) { applyOp(draft, op); });
  } catch (e) {
    return { ok: false, errors: [e.message] };
  }
  const errs = validate(draft);
  if (errs.length) return { ok: false, errors: errs };
  doc = draft;
  markDirty();
  return { ok: true, errors: [] };
}

// ---------------------------------------------------------------------------
// http
// ---------------------------------------------------------------------------

function sendJson(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function readBody(req, cb) {
  let size = 0;
  const chunks = [];
  req.on('data', function (c) {
    size += c.length;
    if (size > 20 * 1024 * 1024) { req.destroy(); return; }
    chunks.push(c);
  });
  req.on('end', function () {
    const raw = Buffer.concat(chunks).toString('utf8');
    if (!raw) return cb(null, {});
    try { cb(null, JSON.parse(raw)); } catch (e) { cb(e); }
  });
  req.on('error', function (e) { cb(e); });
}

const server = http.createServer(function (req, res) {
  let pathname;
  try {
    pathname = new urlmod.URL(req.url, 'http://localhost').pathname;
  } catch (e) {
    return sendJson(res, 400, { ok: false, errors: ['bad request url'] });
  }

  if (pathname === '/' || pathname === '/index.html') {
    const html = renderPage();
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Length': Buffer.byteLength(html),
      'Cache-Control': 'no-store',
    });
    return res.end(html);
  }

  if (pathname === '/api/data' && req.method === 'GET') {
    return sendJson(res, 200, { ok: true, doc: doc, save: saveState() });
  }

  if (pathname === '/api/status' && req.method === 'GET') {
    return sendJson(res, 200, { ok: true, save: saveState() });
  }

  if (pathname === '/api/export' && req.method === 'GET') {
    // export reflects current in-memory state, flushed first so disk agrees
    flushNow();
    let body;
    try {
      body = JSON.stringify(doc, null, 2) + '\n';
    } catch (e) {
      return sendJson(res, 500, { ok: false, errors: [e.message] });
    }
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(body),
      'Content-Disposition': 'attachment; filename="' + DATA_BASE + '-export.json"',
      'Cache-Control': 'no-store',
    });
    return res.end(body);
  }

  if (pathname === '/api/save' && req.method === 'POST') {
    const r = flushNow();
    return sendJson(res, r.ok ? 200 : 500, { ok: r.ok, errors: r.errors, save: saveState() });
  }

  if (pathname === '/api/mutate' && req.method === 'POST') {
    return readBody(req, function (err, body) {
      if (err) return sendJson(res, 400, { ok: false, errors: ['bad JSON body: ' + err.message], save: saveState() });
      const ops = Array.isArray(body) ? body : arr(body.ops);
      if (!ops.length) return sendJson(res, 400, { ok: false, errors: ['no ops supplied'], save: saveState() });
      const r = mutate(ops);
      return sendJson(res, r.ok ? 200 : 400, { ok: r.ok, errors: r.errors, doc: doc, save: saveState() });
    });
  }

  if (pathname === '/api/reload' && req.method === 'POST') {
    try {
      const wasDirty = dirty;
      if (wasDirty) return sendJson(res, 409, { ok: false, errors: ['unsaved changes in memory; save first'], save: saveState() });
      load();
      return sendJson(res, 200, { ok: true, errors: [], doc: doc, save: saveState() });
    } catch (e) {
      return sendJson(res, 500, { ok: false, errors: [e.message], save: saveState() });
    }
  }

  sendJson(res, 404, { ok: false, errors: ['not found: ' + pathname] });
});

// ---------------------------------------------------------------------------
// page
// ---------------------------------------------------------------------------

const CSS = `
*, *::before, *::after { box-sizing: border-box; }
:root {
  color-scheme: light dark;
  --bg: #f6f7f9;
  --panel: #ffffff;
  --panel-2: #eef0f4;
  --text: #14171c;
  --muted: #5b6472;
  --border: #d3d8e0;
  --border-strong: #b3bbc7;
  --accent: #1f5fd0;
  --accent-text: #ffffff;
  --shadow: 0 6px 20px rgba(15, 20, 30, 0.14);
  --sev-critical-bg: #fbdcdc; --sev-critical-fg: #7d1414; --sev-critical-bd: #e79a9a;
  --sev-high-bg: #fbe8d2;    --sev-high-fg: #7c4508;    --sev-high-bd: #e4b581;
  --sev-medium-bg: #fbf4cf;  --sev-medium-fg: #6b5504;  --sev-medium-bd: #ddc971;
  --sev-low-bg: #dcecfb;     --sev-low-fg: #1a4874;     --sev-low-bd: #97bede;
  --sev-other-bg: #e6e8ec;   --sev-other-fg: #3a3f48;   --sev-other-bd: #c3c8d0;
  --ok: #1a7a3f;
  --warn: #8a5a00;
  --err: #b3261e;
  --chip-bg: #e8ebf1;
  --chip-fg: #2b3340;
  /* effort sits next to severity on a row, so it gets its own hue (cool violet,
     square-ish) and can never be mistaken for a severity chip. */
  --eff-bg: #e9e2fb; --eff-fg: #46308c; --eff-bd: #bfb0e8;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #14171c;
    --panel: #1c2027;
    --panel-2: #23282f;
    --text: #e7eaef;
    --muted: #9aa4b2;
    --border: #333a44;
    --border-strong: #4a535f;
    --accent: #6c9dfb;
    --accent-text: #0d1117;
    --shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
    --sev-critical-bg: #3d1717; --sev-critical-fg: #ffb3b3; --sev-critical-bd: #6d2626;
    --sev-high-bg: #3b2610;     --sev-high-fg: #ffd0a1;    --sev-high-bd: #6b431c;
    --sev-medium-bg: #3a3410;   --sev-medium-fg: #f2e394;  --sev-medium-bd: #64591b;
    --sev-low-bg: #12283d;      --sev-low-fg: #a8cdf5;     --sev-low-bd: #234a6d;
    --sev-other-bg: #2a2f37;    --sev-other-fg: #c3cad4;   --sev-other-bd: #3d454f;
    --ok: #5fd48a;
    --warn: #e0b25e;
    --err: #ff8f86;
    --chip-bg: #2a3038;
    --chip-fg: #cfd6e0;
    --eff-bg: #251d3d; --eff-fg: #cbbcf5; --eff-bd: #43356b;
  }
}
html, body { margin: 0; padding: 0; }
body {
  background: var(--bg);
  color: var(--text);
  font: 14px/1.45 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  overflow-x: hidden;
}
button, input, select, textarea { font: inherit; color: var(--text); }
a { color: var(--accent); }

.btn {
  background: var(--panel);
  color: var(--text);
  border: 1px solid var(--border-strong);
  border-radius: 6px;
  padding: 5px 10px;
  cursor: pointer;
  line-height: 1.2;
}
.btn:hover { background: var(--panel-2); }
.btn[aria-pressed="true"], .btn.on { background: var(--accent); color: var(--accent-text); border-color: var(--accent); }
.btn.sm { padding: 3px 7px; font-size: 12px; }
.btn.danger { border-color: var(--err); color: var(--err); }
.btn:disabled { opacity: 0.5; cursor: default; }

input[type="text"], input[type="search"], textarea, select {
  background: var(--panel);
  border: 1px solid var(--border-strong);
  border-radius: 6px;
  padding: 5px 8px;
  max-width: 100%;
}
textarea { width: 100%; resize: vertical; font-family: inherit; }

header#top {
  position: sticky; top: 0; z-index: 40;
  background: var(--panel);
  border-bottom: 1px solid var(--border);
  padding: 8px 12px;
  display: flex; flex-wrap: wrap; gap: 8px; align-items: center;
}
header#top h1 { font-size: 15px; margin: 0; font-weight: 650; }
.sub { color: var(--muted); font-size: 12px; }
.spacer { flex: 1 1 auto; }
#saveind { font-size: 12px; padding: 3px 8px; border-radius: 999px; border: 1px solid var(--border-strong); white-space: nowrap; }
#saveind.s-saved { color: var(--ok); border-color: var(--ok); }
#saveind.s-unsaved { color: var(--warn); border-color: var(--warn); }
#saveind.s-error { color: var(--err); border-color: var(--err); font-weight: 650; }

#shell { display: grid; grid-template-columns: 260px minmax(0, 1fr); gap: 12px; padding: 12px; align-items: start; }
#facetwrap { min-width: 0; }
aside#facets {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px;
  position: sticky; top: 56px;
  max-height: calc(100vh - 72px);
  overflow-y: auto;
}
.fgroup { margin-bottom: 10px; }
.fgroup > h3 { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); margin: 0 0 4px; }
.fvals { display: flex; flex-wrap: wrap; gap: 4px; }
.fval {
  display: inline-flex; align-items: center; gap: 5px;
  border: 1px solid var(--border-strong); background: var(--panel-2); color: var(--text);
  border-radius: 999px; padding: 2px 8px; font-size: 12px; cursor: pointer; max-width: 100%;
}
.fval .lbl { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 150px; }
.fval .n { color: var(--muted); font-variant-numeric: tabular-nums; font-size: 11px; }
.fval[aria-pressed="true"] { background: var(--accent); color: var(--accent-text); border-color: var(--accent); }
.fval[aria-pressed="true"] .n { color: var(--accent-text); opacity: 0.85; }
.fval[data-empty="1"] { opacity: 0.5; }

main#main { min-width: 0; display: flex; flex-direction: column; gap: 10px; }
.bar {
  background: var(--panel); border: 1px solid var(--border); border-radius: 8px;
  padding: 8px 10px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center;
}
.bar label { font-size: 12px; color: var(--muted); display: inline-flex; gap: 4px; align-items: center; }
#progress { font-size: 12px; color: var(--muted); }
#progress b { color: var(--text); }

#bulkbar { border-color: var(--accent); }
#bulkbar .count { font-weight: 650; }

#list { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.grouphdr {
  display: flex; align-items: center; gap: 8px; padding: 6px 8px;
  background: var(--panel-2); border: 1px solid var(--border); border-radius: 6px;
  cursor: pointer; position: sticky; top: 48px; z-index: 5;
}
.grouphdr h2 { font-size: 13px; margin: 0; font-weight: 650; }
.grouphdr .gmeta { font-size: 12px; color: var(--muted); }
.caret { width: 12px; display: inline-block; color: var(--muted); }

.row { background: var(--panel); border: 1px solid var(--border); border-radius: 8px; min-width: 0; }
.row.cursor { outline: 2px solid var(--accent); outline-offset: 1px; }
.row.sel { border-color: var(--accent); }
.rowhead { display: flex; gap: 8px; padding: 8px; align-items: flex-start; cursor: pointer; min-width: 0; }
.rowhead input[type="checkbox"] { margin-top: 3px; flex: 0 0 auto; width: 16px; height: 16px; }
.rowmain { min-width: 0; flex: 1 1 auto; }
.rowmeta { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; margin-bottom: 3px; }
.stmt { overflow-wrap: anywhere; }
/* collapsed-row description: subordinate to the headline, clamped to two lines
   so row height stays scannable. Rendered only when there is text. */
.desc {
  margin-top: 2px; color: var(--muted); font-size: 12.5px; line-height: 1.4;
  overflow-wrap: anywhere;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.evlist { display: flex; flex-direction: column; gap: 3px; }
.ev {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px;
  color: var(--muted); overflow-wrap: anywhere;
}
.ev .evsym { color: var(--chip-fg); }
.chip {
  display: inline-flex; align-items: center; gap: 4px; border-radius: 999px;
  padding: 1px 7px; font-size: 11px; border: 1px solid var(--border-strong);
  background: var(--chip-bg); color: var(--chip-fg); cursor: pointer; white-space: nowrap;
}
.chip.sev-critical { background: var(--sev-critical-bg); color: var(--sev-critical-fg); border-color: var(--sev-critical-bd); font-weight: 650; }
.chip.sev-high { background: var(--sev-high-bg); color: var(--sev-high-fg); border-color: var(--sev-high-bd); font-weight: 650; }
.chip.sev-medium { background: var(--sev-medium-bg); color: var(--sev-medium-fg); border-color: var(--sev-medium-bd); }
.chip.sev-low { background: var(--sev-low-bg); color: var(--sev-low-fg); border-color: var(--sev-low-bd); }
.chip.sev-other { background: var(--sev-other-bg); color: var(--sev-other-fg); border-color: var(--sev-other-bd); }
/* squared corners and a prefix keep effort readable as "not a severity" */
.chip.eff { background: var(--eff-bg); color: var(--eff-fg); border-color: var(--eff-bd); border-radius: 4px; }
.chip.idchip { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; cursor: default; }
.chip.dec { border-style: dashed; }
.chip.flag { cursor: default; }

.editor { border-top: 1px solid var(--border); padding: 8px; display: flex; flex-direction: column; gap: 8px; }
.sect { border: 1px solid var(--border); border-radius: 6px; background: var(--panel-2); }
.secthdr { display: flex; align-items: center; gap: 6px; padding: 5px 8px; cursor: pointer; font-size: 12px; font-weight: 650; color: var(--muted); }
.sectbody { padding: 8px; border-top: 1px solid var(--border); background: var(--panel); display: flex; flex-direction: column; gap: 8px; }
.field { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.field > .flabel { font-size: 12px; color: var(--muted); min-width: 74px; }
.annlist { display: flex; flex-direction: column; gap: 6px; }
.ann { border: 1px solid var(--border); border-radius: 6px; padding: 6px; background: var(--panel-2); }
.ann .annmeta { font-size: 11px; color: var(--muted); display: flex; gap: 8px; align-items: center; justify-content: space-between; }
.scrollx { overflow-x: auto; max-width: 100%; }
.empty { color: var(--muted); padding: 20px; text-align: center; border: 1px dashed var(--border-strong); border-radius: 8px; }

.popover {
  position: absolute; z-index: 60; background: var(--panel); color: var(--text);
  border: 1px solid var(--border-strong); border-radius: 8px; box-shadow: var(--shadow);
  padding: 10px; max-width: min(92vw, 360px); max-height: 70vh; overflow: auto;
}
#scrim { position: fixed; inset: 0; z-index: 55; background: rgba(10, 12, 16, 0.35); }
.modal {
  position: fixed; z-index: 70; left: 50%; top: 8vh; transform: translateX(-50%);
  width: min(92vw, 560px); max-height: 84vh; overflow: auto;
  background: var(--panel); color: var(--text); border: 1px solid var(--border-strong);
  border-radius: 10px; box-shadow: var(--shadow); padding: 14px;
}
.modal h2 { margin: 0 0 8px; font-size: 15px; }
.modal .actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 12px; }
kbd {
  background: var(--panel-2); border: 1px solid var(--border-strong); border-bottom-width: 2px;
  border-radius: 4px; padding: 0 5px; font-family: ui-monospace, Menlo, monospace; font-size: 12px;
}
table.keys { width: 100%; border-collapse: collapse; }
table.keys td { padding: 3px 6px; vertical-align: top; border-bottom: 1px solid var(--border); }
table.keys td:first-child { width: 90px; white-space: nowrap; }

#toasts { position: fixed; right: 10px; bottom: 10px; z-index: 90; display: flex; flex-direction: column; gap: 6px; max-width: min(92vw, 420px); }
.toast { background: var(--panel); color: var(--text); border: 1px solid var(--border-strong); border-left: 4px solid var(--accent); border-radius: 6px; padding: 8px 10px; box-shadow: var(--shadow); font-size: 13px; overflow-wrap: anywhere; }
.toast.err { border-left-color: var(--err); }
.toast.ok { border-left-color: var(--ok); }

.narrowonly { display: none; }
@media (max-width: 880px) {
  #shell { grid-template-columns: minmax(0, 1fr); }
  aside#facets { position: static; max-height: none; }
  .narrowonly { display: inline-flex; }
  .wideonly { display: none !important; }
  #facetrow { display: flex; gap: 6px; overflow-x: auto; padding: 8px 10px; -webkit-overflow-scrolling: touch; }
  #facetrow > * { flex: 0 0 auto; }
  .grouphdr { position: static; }
  header#top { padding: 6px 8px; }
  header#top h1 { font-size: 14px; }
}
`;

function CLIENT() {
  'use strict';

  // ------------------------------------------------------------------ state
  var state = {
    doc: null,
    save: { state: 'saved' },
    f: {
      severity: [], grade: [], group: [], cluster: [], decision: [], effort: [], tag: [],
      ann: 'any', edited: 'any', clus: 'any', desc: 'any', q: ''
    },
    sort: 'order',
    groupBy: 'none',
    expanded: {},
    selected: {},
    collapsedGroups: {},
    collapsedSections: {},
    cursor: null,
    visible: [],
    narrow: false,
    openPopover: null,
    modal: null,
    pendingFocus: null
  };

  var SECTIONS = [
    { key: 'stmt', title: 'Statement' },
    { key: 'desc', title: 'Description' },
    { key: 'fix', title: 'Proposed fix' },
    { key: 'class', title: 'Classification' },
    { key: 'triage', title: 'Triage' },
    { key: 'ann', title: 'Annotations' }
  ];

  var UNSET = '—none—';

  // ------------------------------------------------------------------ utils
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function has(obj, k) { return Object.prototype.hasOwnProperty.call(obj, k); }
  function keys(obj) { return Object.keys(obj); }
  function inArr(a, v) { return a.indexOf(v) !== -1; }
  function toggleIn(a, v) {
    var i = a.indexOf(v);
    if (i === -1) a.push(v); else a.splice(i, 1);
    return a;
  }
  function meta() { return state.doc.meta; }
  function findings() { return state.doc.findings; }
  function byId(id) {
    var fs = findings();
    for (var i = 0; i < fs.length; i++) if (fs[i].id === id) return fs[i];
    return null;
  }
  // description and evidence are optional in the data file; read through helpers
  // so every call site treats "absent" and "empty" the same way.
  function descOf(f) { return typeof f.description === 'string' ? f.description : ''; }
  function hasDesc(f) { return descOf(f).trim() !== ''; }
  function evidenceOf(f) { return Array.isArray(f.evidence) ? f.evidence : []; }
  function fixOf(f) { return typeof f.fix === 'string' ? f.fix : ''; }
  function hasFix(f) { return fixOf(f).trim() !== ''; }
  function effortOf(f) { return typeof f.effort === 'string' && f.effort ? f.effort : null; }
  function sevClass(s) {
    var known = ['critical', 'high', 'medium', 'low'];
    return inArr(known, s) ? 'sev-' + s : 'sev-other';
  }
  function sevRubric(s) {
    return has(SEVERITY_RUBRIC, s) ? SEVERITY_RUBRIC[s] : '';
  }
  // tooltip text for anything that names a severity
  function sevTitle(s, suffix) {
    var r = sevRubric(s);
    if (!r) return suffix || '';
    return s + ' — ' + r + (suffix ? '\n\n' + suffix : '');
  }
  function toast(msg, kind, ms) {
    var box = $('#toasts');
    var el = document.createElement('div');
    el.className = 'toast' + (kind ? ' ' + kind : '');
    el.textContent = msg;
    box.appendChild(el);
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, ms || (kind === 'err' ? 9000 : 3500));
  }

  // ------------------------------------------------------------------ server
  function setSave(s) {
    if (s) state.save = s;
    var el = $('#saveind');
    if (!el) return;
    var st = state.save.state;
    el.className = 's-' + st;
    if (st === 'error') {
      el.textContent = 'SAVE ERROR';
      el.title = state.save.error || '';
    } else if (st === 'unsaved') {
      el.textContent = 'unsaved…';
      el.title = 'autosaving';
    } else {
      el.textContent = 'saved';
      el.title = state.save.lastSavedAt ? 'last saved ' + state.save.lastSavedAt : 'in sync with disk';
    }
    var sn = $('#savenow');
    if (sn) sn.disabled = false;
  }

  function commit(ops, opts) {
    opts = opts || {};
    return fetch('/api/mutate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ops: ops })
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (j.doc) state.doc = j.doc;
      setSave(j.save);
      if (!j.ok) {
        toast('Change rejected: ' + (j.errors && j.errors[0] ? j.errors[0] : 'unknown error'), 'err');
        renderAll();
        return j;
      }
      if (opts.soft) renderChrome(); else renderAll();
      return j;
    }).catch(function (e) {
      state.save = { state: 'error', error: String(e) };
      setSave();
      toast('Could not reach the server: ' + e, 'err');
      return { ok: false, errors: [String(e)] };
    });
  }

  var debouncers = {};
  function debounced(key, fn, ms) {
    if (debouncers[key]) clearTimeout(debouncers[key].t);
    var t = setTimeout(function () { delete debouncers[key]; fn(); }, ms == null ? 400 : ms);
    debouncers[key] = { t: t, fn: fn };
  }
  // run (do not discard) anything still waiting, so an explicit save cannot lose an edit
  function flushDebouncers() {
    var pending = debouncers;
    debouncers = {};
    var work = [];
    keys(pending).forEach(function (k) {
      clearTimeout(pending[k].t);
      work.push(pending[k].fn);
    });
    return Promise.all(work.map(function (fn) { return fn(); }));
  }

  function saveNow() {
    return fetch('/api/save', { method: 'POST' })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        setSave(j.save);
        if (!j.ok) toast('Save failed: ' + (j.errors && j.errors[0]), 'err');
        else toast('Saved to disk', 'ok', 2000);
      })
      .catch(function (e) { toast('Save failed: ' + e, 'err'); });
  }

  function pollStatus() {
    fetch('/api/status').then(function (r) { return r.json(); }).then(function (j) {
      setSave(j.save);
    }).catch(function () { /* transient */ });
  }

  // ------------------------------------------------------------------ facets
  var FACET_DEFS = [
    { key: 'severity', title: 'Severity', values: function () { return meta().severityVocabulary.slice(); }, of: function (f) { return [f.severity]; } },
    { key: 'grade', title: 'Grade', values: function () { return meta().gradeVocabulary.slice(); }, of: function (f) { return [f.grade]; } },
    { key: 'tag', title: 'Tag', values: function () { return usedValues(function (f) { return f.tags; }, meta().tagVocabulary); }, of: function (f) { return f.tags.slice(); } },
    { key: 'group', title: 'Group', values: function () { return usedValues(function (f) { return [f.group == null ? UNSET : f.group]; }, []); }, of: function (f) { return [f.group == null ? UNSET : f.group]; } },
    { key: 'cluster', title: 'Cluster', values: function () { return usedValues(function (f) { return [f.cluster == null ? UNSET : f.cluster]; }, []); }, of: function (f) { return [f.cluster == null ? UNSET : f.cluster]; } },
    { key: 'decision', title: 'Decision', values: function () { return meta().decisionVocabulary.concat([UNSET]); }, of: function (f) { return [f.decision == null ? UNSET : f.decision]; } },
    { key: 'effort', title: 'Effort', values: function () { return meta().effortVocabulary.concat([UNSET]); }, of: function (f) { return [effortOf(f) == null ? UNSET : effortOf(f)]; } }
  ];

  function usedValues(get, seed) {
    var seen = {};
    var out = [];
    (seed || []).forEach(function (v) { if (!has(seen, v)) { seen[v] = 1; out.push(v); } });
    findings().forEach(function (f) {
      get(f).forEach(function (v) { if (v != null && !has(seen, v)) { seen[v] = 1; out.push(v); } });
    });
    var unsetIdx = out.indexOf(UNSET);
    if (unsetIdx !== -1) { out.splice(unsetIdx, 1); out.push(UNSET); }
    return out;
  }

  function clusterValues() {
    var seen = {};
    var out = [];
    findings().forEach(function (f) { if (f.cluster && !has(seen, f.cluster)) { seen[f.cluster] = 1; out.push(f.cluster); } });
    return out.sort();
  }

  function passFacet(f, key) {
    var def = null;
    for (var i = 0; i < FACET_DEFS.length; i++) if (FACET_DEFS[i].key === key) def = FACET_DEFS[i];
    if (def) {
      var sel = state.f[key];
      if (!sel.length) return true;
      var mine = def.of(f);
      for (var j = 0; j < mine.length; j++) if (inArr(sel, mine[j])) return true;
      return false;
    }
    if (key === 'ann') {
      if (state.f.ann === 'has') return f.annotations.length > 0;
      if (state.f.ann === 'none') return f.annotations.length === 0;
      return true;
    }
    if (key === 'edited') {
      if (state.f.edited === 'edited') return f.edited === true;
      if (state.f.edited === 'untouched') return f.edited !== true;
      return true;
    }
    if (key === 'clus') {
      if (state.f.clus === 'has') return f.cluster != null && f.cluster !== '';
      if (state.f.clus === 'none') return f.cluster == null || f.cluster === '';
      return true;
    }
    if (key === 'desc') {
      if (state.f.desc === 'has') return hasDesc(f);
      if (state.f.desc === 'none') return !hasDesc(f);
      return true;
    }
    if (key === 'q') {
      var q = state.f.q.trim().toLowerCase();
      if (!q) return true;
      var hay = (f.id + ' ' + f.statement + ' ' + descOf(f) + ' ' + fixOf(f) + ' ' + f.annotations.map(function (a) { return a.text; }).join(' ')).toLowerCase();
      return q.split(/\s+/).every(function (t) { return hay.indexOf(t) !== -1; });
    }
    return true;
  }

  var ALL_FACET_KEYS = ['severity', 'grade', 'tag', 'group', 'cluster', 'decision', 'effort', 'ann', 'edited', 'clus', 'desc', 'q'];

  function matchesAll(f, exceptKey) {
    for (var i = 0; i < ALL_FACET_KEYS.length; i++) {
      var k = ALL_FACET_KEYS[i];
      if (k === exceptKey) continue;
      if (!passFacet(f, k)) return false;
    }
    return true;
  }

  function filtered() {
    return findings().filter(function (f) { return matchesAll(f, null); });
  }

  function countFor(facetKey, value) {
    var def = null;
    for (var i = 0; i < FACET_DEFS.length; i++) if (FACET_DEFS[i].key === facetKey) def = FACET_DEFS[i];
    var n = 0;
    findings().forEach(function (f) {
      if (!matchesAll(f, facetKey)) return;
      if (def) { if (inArr(def.of(f), value)) n++; return; }
      if (facetKey === 'ann') { if ((value === 'has') === (f.annotations.length > 0)) n++; return; }
      if (facetKey === 'edited') { if ((value === 'edited') === (f.edited === true)) n++; return; }
      if (facetKey === 'clus') {
        var hasC = f.cluster != null && f.cluster !== '';
        if ((value === 'has') === hasC) n++;
        return;
      }
      if (facetKey === 'desc') { if ((value === 'has') === hasDesc(f)) n++; }
    });
    return n;
  }

  function activeFilterCount() {
    var n = 0;
    FACET_DEFS.forEach(function (d) { n += state.f[d.key].length; });
    if (state.f.ann !== 'any') n++;
    if (state.f.edited !== 'any') n++;
    if (state.f.clus !== 'any') n++;
    if (state.f.desc !== 'any') n++;
    if (state.f.q.trim()) n++;
    return n;
  }

  function clearFilters() {
    FACET_DEFS.forEach(function (d) { state.f[d.key] = []; });
    state.f.ann = 'any'; state.f.edited = 'any'; state.f.clus = 'any'; state.f.desc = 'any'; state.f.q = '';
    renderAll();
  }

  // ------------------------------------------------------------------ sorting / grouping
  function sevRank(s) {
    var i = meta().severityVocabulary.indexOf(s);
    return i === -1 ? 999 : i;
  }
  function cmp(a, b) { return a < b ? -1 : a > b ? 1 : 0; }

  function sortList(list) {
    var s = state.sort;
    var out = list.slice();
    out.sort(function (a, b) {
      if (s === 'order') return cmp(a.order, b.order) || cmp(a.id, b.id);
      if (s === 'severity') return cmp(sevRank(a.severity), sevRank(b.severity)) || cmp(a.order, b.order);
      if (s === 'id') return a.id.localeCompare(b.id);
      if (s === 'group') return cmp(a.group == null ? '￿' : a.group, b.group == null ? '￿' : b.group) || cmp(a.order, b.order);
      if (s === 'cluster') return cmp(a.cluster == null ? '￿' : a.cluster, b.cluster == null ? '￿' : b.cluster) || cmp(a.order, b.order);
      return 0;
    });
    return out;
  }

  function groupsOf(f) {
    var g = state.groupBy;
    if (g === 'none') return ['All findings'];
    if (g === 'severity') return [f.severity];
    if (g === 'grade') return [f.grade];
    if (g === 'group') return [f.group == null ? UNSET : f.group];
    if (g === 'cluster') return [f.cluster == null ? UNSET : f.cluster];
    if (g === 'decision') return [f.decision == null ? UNSET : f.decision];
    if (g === 'tag') return f.tags.length ? f.tags.slice() : [UNSET];
    return ['All findings'];
  }

  function groupOrder(names) {
    var g = state.groupBy;
    var vocab = null;
    if (g === 'severity') vocab = meta().severityVocabulary;
    else if (g === 'grade') vocab = meta().gradeVocabulary;
    else if (g === 'decision') vocab = meta().decisionVocabulary;
    var out = names.slice();
    out.sort(function (a, b) {
      if (a === UNSET) return 1;
      if (b === UNSET) return -1;
      if (vocab) {
        var ia = vocab.indexOf(a), ib = vocab.indexOf(b);
        if (ia === -1) ia = 998; if (ib === -1) ib = 998;
        if (ia !== ib) return ia - ib;
      }
      return a.localeCompare(b);
    });
    return out;
  }

  function buildGroups() {
    var list = sortList(filtered());
    if (state.groupBy === 'none') {
      return [{ name: 'All findings', items: list }];
    }
    var map = {};
    var names = [];
    list.forEach(function (f) {
      groupsOf(f).forEach(function (n) {
        if (!has(map, n)) { map[n] = []; names.push(n); }
        map[n].push(f);
      });
    });
    return groupOrder(names).map(function (n) { return { name: n, items: map[n] }; });
  }

  function allGroupNames() { return buildGroups().map(function (g) { return g.name; }); }

  // ------------------------------------------------------------------ overlays
  function closeScrim() {
    var s = $('#scrim');
    if (s) s.parentNode.removeChild(s);
  }
  function closePopover() {
    state.openPopover = null;
    var p = $('.popover');
    if (p) p.parentNode.removeChild(p);
    if (!state.modal) closeScrim();
    $$('[data-pop]').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
  }
  function closeModal() {
    state.modal = null;
    var m = $('.modal');
    if (m) m.parentNode.removeChild(m);
    if (!state.openPopover) closeScrim();
  }
  function ensureScrim() {
    if ($('#scrim')) return;
    var s = document.createElement('div');
    s.id = 'scrim';
    s.addEventListener('mousedown', function (e) {
      e.preventDefault();
      if (state.modal) closeModal();
      else closePopover();
    });
    document.body.appendChild(s);
  }

  function openPopoverFor(btn, key, html) {
    if (state.openPopover === key) { closePopover(); return; }
    closePopover();
    state.openPopover = key;
    ensureScrim();
    var p = document.createElement('div');
    p.className = 'popover';
    p.setAttribute('role', 'dialog');
    p.innerHTML = html;
    document.body.appendChild(p);
    var r = btn.getBoundingClientRect();
    var top = r.bottom + window.scrollY + 4;
    var left = Math.min(r.left + window.scrollX, window.scrollX + document.documentElement.clientWidth - p.offsetWidth - 8);
    p.style.top = top + 'px';
    p.style.left = Math.max(window.scrollX + 4, left) + 'px';
    btn.setAttribute('aria-pressed', 'true');
    var first = p.querySelector('input,button,select,textarea');
    if (first) first.focus();
  }

  function openModal(title, bodyHtml, opts) {
    opts = opts || {};
    closeModal();
    state.modal = opts.key || 'modal';
    ensureScrim();
    var m = document.createElement('div');
    m.className = 'modal';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-modal', 'true');
    m.innerHTML = '<h2>' + esc(title) + '</h2>' + bodyHtml;
    document.body.appendChild(m);
    var first = m.querySelector('[data-autofocus]') || m.querySelector('button,input,textarea,select');
    if (first) first.focus();
    return m;
  }

  function confirmAction(title, message, count, onYes, danger) {
    var m = openModal(title,
      '<p>' + esc(message) + '</p>' +
      '<p><b>' + count + '</b> finding' + (count === 1 ? '' : 's') + ' will be changed. This cannot be undone from the UI.</p>' +
      '<div class="actions">' +
      '<button class="btn" data-act="no">Cancel</button>' +
      '<button class="btn ' + (danger ? 'danger' : 'on') + '" data-act="yes" data-autofocus>Do it</button>' +
      '</div>', { key: 'confirm' });
    m.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]');
      if (!b) return;
      if (b.getAttribute('data-act') === 'yes') { closeModal(); onYes(); }
      else closeModal();
    });
  }

  function showCheatsheet() {
    var rows = [
      ['j / k', 'Move the cursor down / up'],
      ['Enter or e', 'Expand the cursor row and focus the statement editor'],
      ['a', 'Expand and focus the add-annotation box'],
      ['x', 'Toggle selection of the cursor row'],
      ['1 – 4', 'Set severity: critical, high, medium, low'],
      ['Shift+K', 'Decision: keep — then move to the next row'],
      ['Shift+C', 'Decision: cut — then move to the next row'],
      ['Shift+R', 'Decision: rework — then move to the next row'],
      ['Shift+M', 'Decision: merge — then move to the next row'],
      ['0', 'Clear the decision (back to none); the cursor stays put'],
      ['/', 'Focus the search box'],
      ['?', 'This cheatsheet'],
      ['Escape', 'Close the topmost thing (modal, popover, editor, selection)']
    ];
    var vocab = meta().severityVocabulary.filter(function (v) { return sevRubric(v); });
    var rubric = vocab.length
      ? '<h2 style="margin:14px 0 8px;font-size:15px">What the severities mean</h2>' +
        '<table class="keys">' + vocab.map(function (v) {
          return '<tr><td><span class="chip ' + sevClass(v) + '">' + esc(v) + '</span></td><td>' + esc(sevRubric(v)) + '</td></tr>';
        }).join('') + '</table>'
      : '';
    openModal('Keyboard shortcuts',
      '<table class="keys">' + rows.map(function (r) {
        return '<tr><td><kbd>' + esc(r[0]) + '</kbd></td><td>' + esc(r[1]) + '</td></tr>';
      }).join('') + '</table>' +
      '<p class="sub">Severity and decision keys act on the cursor row. Shortcuts never fire while you are typing in a text box, and never when Cmd, Ctrl or Alt is held — copy, paste and select-all work normally.</p>' +
      rubric +
      '<div class="actions"><button class="btn" data-close data-autofocus>Close</button></div>',
      { key: 'cheatsheet' });
  }

  function handleEscape() {
    if (state.modal) { closeModal(); return true; }
    if (state.openPopover) { closePopover(); return true; }
    var ae = document.activeElement;
    if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.tagName === 'SELECT')) { ae.blur(); return true; }
    if (state.cursor && has(state.expanded, state.cursor)) { delete state.expanded[state.cursor]; renderList(); return true; }
    if (keys(state.selected).length) { state.selected = {}; renderAll(); return true; }
    return false;
  }

  // ------------------------------------------------------------------ render: chrome
  function renderHeader() {
    var m = meta();
    var el = $('#hdrinfo');
    el.innerHTML =
      '<h1>' + esc(m.title || 'Findings') + '</h1>' +
      '<span class="sub">' + findings().length + ' findings' +
      (m.ltmPackage ? ' · pkg ' + esc(m.ltmPackage) : '') +
      (m.engine ? ' · engine ' + esc(m.engine) : '') +
      '</span>';
  }

  function facetGroupHtml(def) {
    var vals = def.values();
    var sel = state.f[def.key];
    return '<div class="fvals">' + vals.map(function (v) {
      var n = countFor(def.key, v);
      return '<button type="button" class="fval" data-facet="' + esc(def.key) + '" data-val="' + esc(v) + '"' +
        ' aria-pressed="' + (inArr(sel, v) ? 'true' : 'false') + '" data-empty="' + (n === 0 && !inArr(sel, v) ? '1' : '0') + '">' +
        '<span class="lbl">' + esc(v) + '</span><span class="n">' + n + '</span></button>';
    }).join('') + '</div>';
  }

  function triGroupHtml(key, title, aLabel, bLabel) {
    var cur = state.f[key];
    var opts = [['any', 'any'], ['has', aLabel], ['none', bLabel]];
    if (key === 'edited') opts = [['any', 'any'], ['edited', aLabel], ['untouched', bLabel]];
    return '<div class="fvals">' + opts.map(function (o) {
      var n = o[0] === 'any' ? null : countFor(key, o[0]);
      return '<button type="button" class="fval" data-tri="' + key + '" data-val="' + o[0] + '" aria-pressed="' + (cur === o[0] ? 'true' : 'false') + '">' +
        '<span class="lbl">' + esc(o[1]) + '</span>' + (n === null ? '' : '<span class="n">' + n + '</span>') + '</button>';
    }).join('') + '</div>';
  }

  function clearBtnHtml() {
    var n = activeFilterCount();
    return '<button type="button" class="btn' + (n ? ' danger' : '') + '" id="clearfilters"' + (n ? '' : ' disabled') + '>' +
      'Clear filters' + (n ? ' (' + n + ')' : '') + '</button>';
  }

  function searchHtml() {
    return '<input type="search" id="q" placeholder="Search statements, descriptions, fixes, ids, annotations" value="' + esc(state.f.q) + '" style="width:100%">';
  }

  function renderFacets() {
    var wrap = $('#facetwrap');
    if (state.narrow) {
      // top facet row: Clear filters FIRST, then search, then one dropdown per group
      var btns = FACET_DEFS.map(function (d) {
        var n = state.f[d.key].length;
        return '<button type="button" class="btn" data-pop="' + d.key + '" aria-pressed="false">' + esc(d.title) + (n ? ' (' + n + ')' : '') + '</button>';
      }).join('');
      var tri = [['ann', 'Annotations'], ['edited', 'Edited'], ['clus', 'Cluster set'], ['desc', 'Description']].map(function (t) {
        var on = state.f[t[0]] !== 'any';
        return '<button type="button" class="btn" data-pop="' + t[0] + '" aria-pressed="false"' + (on ? ' style="border-color:var(--accent)"' : '') + '>' + esc(t[1]) + (on ? ': ' + esc(state.f[t[0]]) : '') + '</button>';
      }).join('');
      wrap.innerHTML =
        '<div class="bar" id="facetrow">' +
        clearBtnHtml() +
        '<span style="min-width:180px">' + searchHtml() + '</span>' +
        btns + tri +
        '</div>';
    } else {
      wrap.innerHTML =
        '<aside id="facets">' +
        '<div class="fgroup">' + clearBtnHtml() + '</div>' +
        '<div class="fgroup"><h3>Search</h3>' + searchHtml() + '</div>' +
        FACET_DEFS.map(function (d) {
          return '<div class="fgroup"><h3>' + esc(d.title) + '</h3>' + facetGroupHtml(d) + '</div>';
        }).join('') +
        '<div class="fgroup"><h3>Annotations</h3>' + triGroupHtml('ann', 'Annotations', 'has', 'none') + '</div>' +
        '<div class="fgroup"><h3>Edited</h3>' + triGroupHtml('edited', 'Edited', 'edited', 'untouched') + '</div>' +
        '<div class="fgroup"><h3>Cluster</h3>' + triGroupHtml('clus', 'Cluster', 'has', 'unclustered') + '</div>' +
        '<div class="fgroup"><h3>Description</h3>' + triGroupHtml('desc', 'Description', 'has description', 'missing description') + '</div>' +
        '</aside>';
    }
    // keep an open popover's content fresh
    if (state.openPopover) {
      var p = $('.popover');
      if (p) p.innerHTML = popoverHtml(state.openPopover);
    }
  }

  function popoverHtml(key) {
    for (var i = 0; i < FACET_DEFS.length; i++) {
      if (FACET_DEFS[i].key === key) {
        return '<h3 style="margin:0 0 6px;font-size:12px;color:var(--muted)">' + esc(FACET_DEFS[i].title) + '</h3>' + facetGroupHtml(FACET_DEFS[i]);
      }
    }
    if (key === 'ann') return triGroupHtml('ann', 'Annotations', 'has', 'none');
    if (key === 'edited') return triGroupHtml('edited', 'Edited', 'edited', 'untouched');
    if (key === 'clus') return triGroupHtml('clus', 'Cluster', 'has', 'unclustered');
    if (key === 'desc') return triGroupHtml('desc', 'Description', 'has description', 'missing description');
    return '';
  }

  function renderViewBar() {
    var fl = filtered();
    var decidedF = fl.filter(function (f) { return f.decision != null; }).length;
    var decidedT = findings().filter(function (f) { return f.decision != null; }).length;
    var describedF = fl.filter(hasDesc).length;
    var fixedF = fl.filter(hasFix).length;
    var sorts = [['order', 'order'], ['severity', 'severity'], ['id', 'id'], ['group', 'group'], ['cluster', 'cluster']];
    var groups = [['none', 'none'], ['severity', 'severity'], ['tag', 'tag'], ['group', 'group'], ['cluster', 'cluster'], ['decision', 'decision'], ['grade', 'grade']];
    $('#viewbar').innerHTML =
      '<label>Sort by <select id="sortsel">' + sorts.map(function (s) {
        return '<option value="' + s[0] + '"' + (state.sort === s[0] ? ' selected' : '') + '>' + s[1] + '</option>';
      }).join('') + '</select></label>' +
      '<label>Group by <select id="groupsel">' + groups.map(function (s) {
        return '<option value="' + s[0] + '"' + (state.groupBy === s[0] ? ' selected' : '') + '>' + s[1] + '</option>';
      }).join('') + '</select></label>' +
      '<button type="button" class="btn sm" id="collapseall">Collapse all</button>' +
      '<button type="button" class="btn sm" id="expandall">Expand all</button>' +
      '<span class="spacer"></span>' +
      '<span id="progress">showing <b>' + fl.length + '</b>/' + findings().length +
      ' · decided <b>' + decidedF + '</b>/' + fl.length + ' shown, <b>' + decidedT + '</b>/' + findings().length + ' total' +
      ' · described <b>' + describedF + '</b>/' + fl.length + ' shown' +
      ' · with fix <b>' + fixedF + '</b>/' + fl.length + ' shown</span>';
  }

  function renderBulkBar() {
    var ids = keys(state.selected);
    var bar = $('#bulkbar');
    if (!ids.length) { bar.hidden = true; bar.innerHTML = ''; return; }
    bar.hidden = false;
    var m = meta();
    bar.innerHTML =
      '<span class="count">' + ids.length + ' selected</span>' +
      '<button type="button" class="btn sm" data-bulk="selectfiltered">Select all shown (' + filtered().length + ')</button>' +
      '<button type="button" class="btn sm" data-bulk="clearsel">Clear selection</button>' +
      '<span style="border-left:1px solid var(--border);height:20px"></span>' +
      '<label>severity <select data-bulkval="severity"><option value="">…</option>' +
      m.severityVocabulary.map(function (v) { return '<option value="' + esc(v) + '" title="' + esc(sevRubric(v)) + '">' + esc(v) + '</option>'; }).join('') +
      '</select></label>' +
      '<label>decision <select data-bulkval="decision"><option value="">…</option>' +
      m.decisionVocabulary.map(function (v) { return '<option value="' + esc(v) + '">' + esc(v) + '</option>'; }).join('') +
      '<option value="__clear__">(clear)</option></select></label>' +
      '<label>effort <select data-bulkval="effort"><option value="">…</option>' +
      m.effortVocabulary.map(function (v) { return '<option value="' + esc(v) + '">' + esc(v) + '</option>'; }).join('') +
      '<option value="__clear__">(clear)</option></select></label>' +
      '<label>add tag <input type="text" data-bulkin="addTag" list="dl-tags" size="9"></label>' +
      '<button type="button" class="btn sm" data-bulk="addTag">Add</button>' +
      '<label>remove tag <input type="text" data-bulkin="removeTag" list="dl-tags" size="9"></label>' +
      '<button type="button" class="btn sm danger" data-bulk="removeTag">Remove</button>' +
      '<label>cluster <input type="text" data-bulkin="cluster" list="dl-clusters" size="12"></label>' +
      '<button type="button" class="btn sm" data-bulk="cluster">Set</button>';
  }

  function renderDatalists() {
    $('#dl-clusters').innerHTML = clusterValues().map(function (c) { return '<option value="' + esc(c) + '">'; }).join('');
    $('#dl-tags').innerHTML = meta().tagVocabulary.map(function (t) { return '<option value="' + esc(t) + '">'; }).join('');
    $('#dl-ids').innerHTML = findings().map(function (f) {
      return '<option value="' + esc(f.id) + '">' + esc(String(f.order) + ' · ' + f.statement.slice(0, 70)) + '</option>';
    }).join('');
  }

  function renderChrome() {
    renderHeader();
    renderFacets();
    renderViewBar();
    renderBulkBar();
    renderDatalists();
    setSave();
  }

  // ------------------------------------------------------------------ render: list
  function byOrder(num) {
    var n = parseInt(num, 10);
    var target = null;
    findings().forEach(function (f) { if (f.order === n) target = f; });
    return target;
  }

  // "finding 12", "findings #12" and a bare "#12" become links to that finding
  function linkify(statement) {
    var out = esc(statement);
    out = out.replace(/\b(findings?)(\s+#?)(\d+)/gi, function (all, word, sp, num) {
      var target = byOrder(num);
      if (!target) return all;
      return word + sp + '<a href="#f-' + esc(target.id) + '" class="fref" data-ref="' + esc(target.id) + '">' + num + '</a>';
    });
    out = out.replace(/(^|[\s(\[])#(\d+)\b/g, function (all, pre, num) {
      var target = byOrder(num);
      if (!target) return all;
      return pre + '<a href="#f-' + esc(target.id) + '" class="fref" data-ref="' + esc(target.id) + '">#' + num + '</a>';
    });
    return out;
  }

  function chipsHtml(f) {
    var out = '';
    out += '<button type="button" class="chip ' + sevClass(f.severity) + '" data-chip="severity" data-val="' + esc(f.severity) + '" title="' + esc(sevTitle(f.severity, 'Filter by severity')) + '">' + esc(f.severity) + '</button>';
    var eff = effortOf(f);
    if (eff) out += '<button type="button" class="chip eff" data-chip="effort" data-val="' + esc(eff) + '" title="Estimated effort — filter by effort">⚒ ' + esc(eff) + '</button>';
    out += '<button type="button" class="chip" data-chip="grade" data-val="' + esc(f.grade) + '" title="Filter by grade">' + esc(f.grade) + '</button>';
    f.tags.forEach(function (t) {
      out += '<button type="button" class="chip" data-chip="tag" data-val="' + esc(t) + '" title="Filter by tag">' + esc(t) + '</button>';
    });
    if (f.cluster) out += '<button type="button" class="chip" data-chip="cluster" data-val="' + esc(f.cluster) + '" title="Filter by cluster">◇ ' + esc(f.cluster) + '</button>';
    if (f.decision) out += '<button type="button" class="chip dec" data-chip="decision" data-val="' + esc(f.decision) + '" title="Filter by decision">' + esc(f.decision) + '</button>';
    if (f.mergeInto) out += '<span class="chip flag" title="merge target">→ ' + esc(f.mergeInto) + '</span>';
    if (f.annotations.length) out += '<span class="chip flag" title="annotations">✎ ' + f.annotations.length + '</span>';
    if (f.edited) out += '<span class="chip flag" title="edited this session or earlier">edited</span>';
    out += '<span class="chip idchip" title="finding id">#' + f.order + ' ' + esc(f.id) + '</span>';
    return out;
  }

  function sectOpen(id, key) { return !has(state.collapsedSections, id + ':' + key); }

  function sectHtml(id, key, title, body) {
    var open = sectOpen(id, key);
    return '<div class="sect" data-sect="' + key + '">' +
      '<div class="secthdr" data-sectoggle="' + esc(id) + ':' + key + '"><span class="caret">' + (open ? '▾' : '▸') + '</span>' + esc(title) + '</div>' +
      (open ? '<div class="sectbody">' + body + '</div>' : '') +
      '</div>';
  }

  function editorHtml(f) {
    var m = meta();
    var stmt = sectHtml(f.id, 'stmt', 'Statement',
      '<textarea data-edit="statement" data-id="' + esc(f.id) + '" rows="4">' + esc(f.statement) + '</textarea>');

    // description is the body under the one-line statement; evidence sits with it
    // and is read-only here — it is produced elsewhere.
    var ev = evidenceOf(f);
    var evBody = ev.length
      ? '<div class="field"><span class="flabel">evidence</span></div>' +
        '<div class="evlist scrollx">' + ev.map(function (e) {
          var file = typeof e.file === 'string' ? e.file : '';
          var sym = typeof e.symbol === 'string' ? e.symbol : '';
          return '<div class="ev">' + esc(file) + (sym ? ' · <span class="evsym">' + esc(sym) + '</span>' : '') + '</div>';
        }).join('') + '</div>'
      : '';
    var desc = sectHtml(f.id, 'desc', 'Description' + (hasDesc(f) ? '' : ' (empty)'),
      '<textarea data-edit="description" data-id="' + esc(f.id) + '" rows="6" placeholder="Two to four sentences of body text, beneath the one-line statement above.">' + esc(descOf(f)) + '</textarea>' +
      evBody);

    // proposed fix: the one-sentence change being proposed, plus how big it is.
    var effCur = effortOf(f);
    var fixBody =
      '<textarea data-edit="fix" data-id="' + esc(f.id) + '" rows="3" placeholder="One sentence: the change being proposed.">' + esc(fixOf(f)) + '</textarea>' +
      '<div class="field"><span class="flabel">effort</span>' +
      '<select data-edit="effort" data-id="' + esc(f.id) + '">' +
      '<option value=""' + (effCur == null ? ' selected' : '') + '>' + esc(UNSET) + '</option>' +
      m.effortVocabulary.map(function (v) { return '<option value="' + esc(v) + '"' + (effCur === v ? ' selected' : '') + '>' + esc(v) + '</option>'; }).join('') +
      '</select></div>';
    var fix = sectHtml(f.id, 'fix', 'Proposed fix' + (hasFix(f) ? '' : ' (empty)'), fixBody);

    var tagChips = f.tags.map(function (t) {
      return '<span class="chip">' + esc(t) + ' <button type="button" class="btn sm" data-untag="' + esc(t) + '" data-id="' + esc(f.id) + '" title="remove tag" style="padding:0 4px;border:0;background:none">×</button></span>';
    }).join(' ');
    var cls =
      '<div class="field"><span class="flabel">tags</span><span class="scrollx">' + (tagChips || '<span class="sub">none</span>') + '</span></div>' +
      '<div class="field"><span class="flabel"></span>' +
      '<input type="text" data-tagin="' + esc(f.id) + '" list="dl-tags" placeholder="add tag (new tags allowed)" size="18">' +
      '<button type="button" class="btn sm" data-addtag="' + esc(f.id) + '">Add tag</button></div>' +
      '<div class="field"><span class="flabel">severity</span><select data-edit="severity" data-id="' + esc(f.id) + '" title="' + esc(sevTitle(f.severity)) + '">' +
      m.severityVocabulary.map(function (v) { return '<option value="' + esc(v) + '"' + (f.severity === v ? ' selected' : '') + ' title="' + esc(sevRubric(v)) + '">' + esc(v) + '</option>'; }).join('') +
      '</select>' +
      '<span class="flabel">grade</span><select data-edit="grade" data-id="' + esc(f.id) + '">' +
      m.gradeVocabulary.map(function (v) { return '<option value="' + esc(v) + '"' + (f.grade === v ? ' selected' : '') + '>' + esc(v) + '</option>'; }).join('') +
      '</select></div>';

    var decBtns = m.decisionVocabulary.map(function (v) {
      return '<button type="button" class="btn sm' + (f.decision === v ? ' on' : '') + '" data-dec="' + esc(v) + '" data-id="' + esc(f.id) + '">' + esc(v) + '</button>';
    }).join(' ') + ' <button type="button" class="btn sm" data-dec="" data-id="' + esc(f.id) + '">clear</button>';
    var triage =
      '<div class="field"><span class="flabel">cluster</span>' +
      '<input type="text" data-edit="cluster" data-id="' + esc(f.id) + '" list="dl-clusters" value="' + esc(f.cluster == null ? '' : f.cluster) + '" placeholder="cluster name" size="22"></div>' +
      '<div class="field"><span class="flabel">decision</span>' + decBtns + '</div>' +
      '<div class="field"><span class="flabel">mergeInto</span>' +
      '<input type="text" data-edit="mergeInto" data-id="' + esc(f.id) + '" list="dl-ids" value="' + esc(f.mergeInto == null ? '' : f.mergeInto) + '" placeholder="finding id" size="26">' +
      (f.mergeInto ? ' <a href="#f-' + esc(f.mergeInto) + '" class="fref" data-ref="' + esc(f.mergeInto) + '">jump</a>' : '') +
      '</div>' +
      '<div class="field"><span class="flabel">group</span><span class="sub">' + esc(f.group == null ? UNSET : f.group) + ' (read-only)</span></div>';

    var anns = f.annotations.map(function (a) {
      return '<div class="ann">' +
        '<textarea data-annedit="' + esc(a.id) + '" data-id="' + esc(f.id) + '" rows="2">' + esc(a.text) + '</textarea>' +
        '<div class="annmeta"><span>' + esc(a.createdAt) + '</span>' +
        '<button type="button" class="btn sm danger" data-anndel="' + esc(a.id) + '" data-id="' + esc(f.id) + '">Delete</button></div>' +
        '</div>';
    }).join('');
    var annBody =
      '<div class="annlist">' + (anns || '<span class="sub">No annotations yet.</span>') + '</div>' +
      '<div><textarea data-annnew="' + esc(f.id) + '" rows="2" placeholder="Add an annotation (kept separate from the statement)"></textarea>' +
      '<button type="button" class="btn sm" data-annadd="' + esc(f.id) + '">Add annotation</button></div>';

    return '<div class="editor">' + stmt + desc + fix +
      sectHtml(f.id, 'class', 'Classification', cls) +
      sectHtml(f.id, 'triage', 'Triage', triage) +
      sectHtml(f.id, 'ann', 'Annotations (' + f.annotations.length + ')', annBody) +
      '</div>';
  }

  function rowHtml(f) {
    var open = has(state.expanded, f.id);
    var sel = has(state.selected, f.id);
    return '<div class="row' + (sel ? ' sel' : '') + (state.cursor === f.id ? ' cursor' : '') + '" id="f-' + esc(f.id) + '" data-row="' + esc(f.id) + '">' +
      '<div class="rowhead" data-head="' + esc(f.id) + '">' +
      '<input type="checkbox" data-sel="' + esc(f.id) + '"' + (sel ? ' checked' : '') + ' aria-label="select finding">' +
      '<div class="rowmain">' +
      '<div class="rowmeta scrollx">' + chipsHtml(f) + '</div>' +
      '<div class="stmt">' + linkify(f.statement) + '</div>' +
      (!open && hasDesc(f) ? '<div class="desc">' + linkify(descOf(f)) + '</div>' : '') +
      '</div>' +
      '<span class="caret">' + (open ? '▾' : '▸') + '</span>' +
      '</div>' +
      (open ? editorHtml(f) : '') +
      '</div>';
  }

  function renderList() {
    var groups = buildGroups();
    var html = '';
    state.visible = [];
    if (!groups.length || !groups.some(function (g) { return g.items.length; })) {
      $('#list').innerHTML = '<div class="empty">No findings match the current filters.</div>';
      return;
    }
    groups.forEach(function (g) {
      var collapsed = has(state.collapsedGroups, g.name);
      var decided = g.items.filter(function (f) { return f.decision != null; }).length;
      { // always render a group header so a collapsed group is never unreachable
        html += '<div class="grouphdr" data-group="' + esc(g.name) + '">' +
          '<span class="caret">' + (collapsed ? '▸' : '▾') + '</span>' +
          '<h2>' + esc(g.name) + '</h2>' +
          '<span class="gmeta">' + g.items.length + ' · ' + decided + ' decided</span>' +
          '<span class="spacer"></span>' +
          '<button type="button" class="btn sm" data-gsel="' + esc(g.name) + '">select</button>' +
          '</div>';
      }
      if (collapsed) return;
      g.items.forEach(function (f) {
        state.visible.push(f.id);
        html += rowHtml(f);
      });
    });
    $('#list').innerHTML = html;
  }

  function renderAll() {
    renderChrome();
    renderList();
  }

  // ------------------------------------------------------------------ actions
  function setField(id, field, value, soft) {
    var f = byId(id);
    if (f) f[field] = value; // optimistic, keeps the DOM stable while typing
    return commit([{ type: 'setField', id: id, field: field, value: value }], { soft: soft });
  }

  function expandRow(id, focusSel) {
    state.expanded[id] = 1;
    state.cursor = id;
    renderList();
    var row = document.getElementById('f-' + id);
    if (row) {
      row.scrollIntoView({ block: 'nearest' });
      if (focusSel) {
        var t = row.querySelector(focusSel);
        if (t) { t.focus(); if (t.setSelectionRange && t.value) t.setSelectionRange(t.value.length, t.value.length); }
      }
    }
  }

  function jumpTo(id) {
    var f = byId(id);
    if (!f) { toast('No finding with id ' + id, 'err'); return; }
    if (!matchesAll(f, null)) {
      clearFilters();
      toast('Filters cleared so finding #' + f.order + ' could be shown');
    }
    groupsOf(f).forEach(function (n) { delete state.collapsedGroups[n]; });
    SECTIONS.forEach(function (s) { delete state.collapsedSections[f.id + ':' + s.key]; });
    expandRow(id, null);
  }

  function bulkIds() { return keys(state.selected); }

  function doBulk(kind, value, needConfirm, label) {
    var ids = bulkIds();
    if (!ids.length) { toast('Nothing selected', 'err'); return; }
    var run = function () {
      commit([{ type: 'bulk', ids: ids, op: kind, value: value }]).then(function (j) {
        if (j.ok) toast(label + ' applied to ' + ids.length + ' finding' + (ids.length === 1 ? '' : 's'), 'ok');
      });
    };
    if (needConfirm) confirmAction(label, label + ' on the selected findings.', ids.length, run, kind === 'removeTag');
    else run();
  }

  // ------------------------------------------------------------------ events
  function isTyping(el) {
    if (!el) return false;
    var t = el.tagName;
    return t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT' || el.isContentEditable;
  }

  function moveCursor(delta) {
    var v = state.visible;
    if (!v.length) return;
    var i = state.cursor ? v.indexOf(state.cursor) : -1;
    var next = i === -1 ? (delta > 0 ? 0 : v.length - 1) : Math.max(0, Math.min(v.length - 1, i + delta));
    state.cursor = v[next];
    renderList();
    var row = document.getElementById('f-' + state.cursor);
    if (row) row.scrollIntoView({ block: 'nearest' });
  }

  // Decision keys act on the cursor row only — the same scope as the 1–4
  // severity keys, which never look at the selection. Setting a decision then
  // advances so a triage pass keeps moving; clearing one stays put.
  function setDecisionFromKey(dec) {
    var id = state.cursor;
    if (!id) return;
    setField(id, 'decision', dec);
    if (dec != null) moveCursor(1);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (handleEscape()) { e.preventDefault(); e.stopPropagation(); }
      return;
    }
    // never hijack OS / browser shortcuts
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (isTyping(e.target)) return;
    if (state.modal) return;

    var k = e.key;
    if (k === 'j') { e.preventDefault(); moveCursor(1); return; }
    if (k === 'k') { e.preventDefault(); moveCursor(-1); return; }
    if (k === '/') { e.preventDefault(); var q = $('#q'); if (q) { q.focus(); q.select(); } return; }
    if (k === '?') { e.preventDefault(); showCheatsheet(); return; }
    if (!state.cursor) return;
    if (k === 'Enter' || k === 'e') { e.preventDefault(); expandRow(state.cursor, '[data-edit="statement"]'); return; }
    if (k === 'a') {
      e.preventDefault();
      state.expanded[state.cursor] = 1;
      delete state.collapsedSections[state.cursor + ':ann'];
      expandRow(state.cursor, '[data-annnew]');
      return;
    }
    if (k === 'x') {
      e.preventDefault();
      if (has(state.selected, state.cursor)) delete state.selected[state.cursor];
      else state.selected[state.cursor] = 1;
      renderAll();
      return;
    }
    if (k >= '1' && k <= '4') {
      var sev = meta().severityVocabulary[parseInt(k, 10) - 1];
      if (sev) { e.preventDefault(); setField(state.cursor, 'severity', sev); }
      return;
    }
    if (k === '0') { e.preventDefault(); setDecisionFromKey(null); return; }
    if (e.shiftKey && has(DECISION_KEYS, k)) {
      var dec = DECISION_KEYS[k];
      if (inArr(meta().decisionVocabulary, dec)) { e.preventDefault(); setDecisionFromKey(dec); }
      return;
    }
  }, true);

  document.addEventListener('click', function (e) {
    var t = e.target;

    var closeBtn = t.closest && t.closest('[data-close]');
    if (closeBtn) { closeModal(); return; }

    var ref = t.closest && t.closest('.fref');
    if (ref) { e.preventDefault(); jumpTo(ref.getAttribute('data-ref')); return; }

    var pop = t.closest && t.closest('[data-pop]');
    if (pop) { e.preventDefault(); openPopoverFor(pop, pop.getAttribute('data-pop'), popoverHtml(pop.getAttribute('data-pop'))); return; }

    if (t.id === 'clearfilters') { clearFilters(); return; }
    if (t.id === 'collapseall') {
      allGroupNames().forEach(function (n) { state.collapsedGroups[n] = 1; });
      state.expanded = {};
      findings().forEach(function (f) { SECTIONS.forEach(function (s) { state.collapsedSections[f.id + ':' + s.key] = 1; }); });
      renderList();
      return;
    }
    if (t.id === 'expandall') {
      state.collapsedGroups = {};
      state.collapsedSections = {};
      filtered().forEach(function (f) { state.expanded[f.id] = 1; });
      renderList();
      return;
    }
    if (t.id === 'savenow') { flushDebouncers().then(saveNow); return; }
    if (t.id === 'helpbtn') { showCheatsheet(); return; }

    var fv = t.closest && t.closest('[data-facet]');
    if (fv) {
      toggleIn(state.f[fv.getAttribute('data-facet')], fv.getAttribute('data-val'));
      renderAll();
      return;
    }
    var tri = t.closest && t.closest('[data-tri]');
    if (tri) {
      var key = tri.getAttribute('data-tri');
      var val = tri.getAttribute('data-val');
      state.f[key] = state.f[key] === val ? 'any' : val;
      renderAll();
      return;
    }
    var chip = t.closest && t.closest('[data-chip]');
    if (chip) {
      e.stopPropagation();
      var ck = chip.getAttribute('data-chip');
      toggleIn(state.f[ck], chip.getAttribute('data-val'));
      renderAll();
      return;
    }

    var gh = t.closest && t.closest('[data-gsel]');
    if (gh) {
      e.stopPropagation();
      var gname = gh.getAttribute('data-gsel');
      buildGroups().forEach(function (g) {
        if (g.name !== gname) return;
        var allSel = g.items.every(function (f) { return has(state.selected, f.id); });
        g.items.forEach(function (f) { if (allSel) delete state.selected[f.id]; else state.selected[f.id] = 1; });
      });
      renderAll();
      return;
    }
    var grp = t.closest && t.closest('[data-group]');
    if (grp) {
      var gn = grp.getAttribute('data-group');
      if (has(state.collapsedGroups, gn)) delete state.collapsedGroups[gn]; else state.collapsedGroups[gn] = 1;
      renderList();
      return;
    }

    var sel = t.closest && t.closest('[data-sel]');
    if (sel) {
      e.stopPropagation();
      var sid = sel.getAttribute('data-sel');
      if (sel.checked) state.selected[sid] = 1; else delete state.selected[sid];
      renderAll();
      return;
    }

    var st = t.closest && t.closest('[data-sectoggle]');
    if (st) {
      e.stopPropagation();
      var sk = st.getAttribute('data-sectoggle');
      if (has(state.collapsedSections, sk)) delete state.collapsedSections[sk]; else state.collapsedSections[sk] = 1;
      renderList();
      return;
    }

    var dec = t.closest && t.closest('[data-dec]');
    if (dec) {
      e.stopPropagation();
      var dv = dec.getAttribute('data-dec');
      setField(dec.getAttribute('data-id'), 'decision', dv === '' ? null : dv);
      return;
    }

    var untag = t.closest && t.closest('[data-untag]');
    if (untag) {
      e.stopPropagation();
      var uid = untag.getAttribute('data-id');
      var uf = byId(uid);
      setField(uid, 'tags', uf.tags.filter(function (x) { return x !== untag.getAttribute('data-untag'); }));
      return;
    }

    var addtag = t.closest && t.closest('[data-addtag]');
    if (addtag) {
      e.stopPropagation();
      var aid = addtag.getAttribute('data-addtag');
      var inp = document.querySelector('[data-tagin="' + aid + '"]');
      var val2 = inp.value.trim();
      if (!val2) return;
      var af = byId(aid);
      if (inArr(af.tags, val2)) { toast('Tag already present'); inp.value = ''; return; }
      setField(aid, 'tags', af.tags.concat([val2]));
      return;
    }

    var annadd = t.closest && t.closest('[data-annadd]');
    if (annadd) {
      e.stopPropagation();
      var nid = annadd.getAttribute('data-annadd');
      var box = document.querySelector('[data-annnew="' + nid + '"]');
      var txt = box.value.trim();
      if (!txt) { toast('Annotation is empty', 'err'); return; }
      commit([{ type: 'addAnnotation', id: nid, text: txt }]).then(function (j) {
        if (j.ok) expandRow(nid, '[data-annnew]');
      });
      return;
    }

    var anndel = t.closest && t.closest('[data-anndel]');
    if (anndel) {
      e.stopPropagation();
      var did = anndel.getAttribute('data-id');
      var aidx = anndel.getAttribute('data-anndel');
      confirmAction('Delete annotation', 'The annotation text will be removed.', 1, function () {
        commit([{ type: 'deleteAnnotation', id: did, annId: aidx }]);
      }, true);
      return;
    }

    var bulk = t.closest && t.closest('[data-bulk]');
    if (bulk) {
      var bk = bulk.getAttribute('data-bulk');
      if (bk === 'clearsel') { state.selected = {}; renderAll(); return; }
      if (bk === 'selectfiltered') { filtered().forEach(function (f) { state.selected[f.id] = 1; }); renderAll(); return; }
      var bin = document.querySelector('[data-bulkin="' + bk + '"]');
      var bv = bin ? bin.value.trim() : '';
      if (bk === 'addTag') { if (!bv) { toast('Type a tag first', 'err'); return; } doBulk('addTag', bv, false, 'Add tag "' + bv + '"'); return; }
      if (bk === 'removeTag') { if (!bv) { toast('Type a tag first', 'err'); return; } doBulk('removeTag', bv, true, 'Remove tag "' + bv + '"'); return; }
      if (bk === 'cluster') { doBulk('cluster', bv, true, bv ? 'Set cluster "' + bv + '"' : 'Clear cluster'); return; }
      return;
    }

    var head = t.closest && t.closest('[data-head]');
    if (head) {
      var hid = head.getAttribute('data-head');
      state.cursor = hid;
      if (has(state.expanded, hid)) delete state.expanded[hid]; else state.expanded[hid] = 1;
      renderList();
      return;
    }
  });

  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.id === 'sortsel') { state.sort = t.value; renderList(); return; }
    if (t.id === 'groupsel') { state.groupBy = t.value; state.collapsedGroups = {}; renderList(); return; }
    var bv = t.closest && t.closest('[data-bulkval]');
    if (bv) {
      var kind = bv.getAttribute('data-bulkval');
      var val = bv.value;
      bv.value = '';
      if (!val) return;
      if (kind === 'severity') doBulk('severity', val, true, 'Set severity "' + val + '"');
      else if (kind === 'decision') doBulk('decision', val === '__clear__' ? '' : val, true, val === '__clear__' ? 'Clear decision' : 'Set decision "' + val + '"');
      else if (kind === 'effort') doBulk('effort', val === '__clear__' ? '' : val, true, val === '__clear__' ? 'Clear effort' : 'Set effort "' + val + '"');
      return;
    }
    var ed = t.closest && t.closest('[data-edit]');
    if (ed && (ed.tagName === 'SELECT')) {
      setField(ed.getAttribute('data-id'), ed.getAttribute('data-edit'), ed.value);
      return;
    }
  });

  document.addEventListener('input', function (e) {
    var t = e.target;
    if (t.id === 'q') {
      state.f.q = t.value;
      debounced('q', function () {
        renderList();
        renderViewBar();
        renderFacets();
        var q = $('#q');
        if (q && document.activeElement !== q) { /* facet re-render replaced it */ }
      }, 200);
      return;
    }
    var ed = t.closest && t.closest('[data-edit]');
    if (ed && ed.tagName !== 'SELECT') {
      var id = ed.getAttribute('data-id');
      var field = ed.getAttribute('data-edit');
      var v = ed.value;
      debounced('edit:' + id + ':' + field, function () {
        var freeText = field === 'statement' || field === 'description' || field === 'fix';
        setField(id, field, freeText ? v : (v.trim() === '' ? null : v.trim()), true);
      });
      return;
    }
    var ae = t.closest && t.closest('[data-annedit]');
    if (ae) {
      var aid = ae.getAttribute('data-annedit');
      var fid = ae.getAttribute('data-id');
      var txt = ae.value;
      debounced('ann:' + aid, function () {
        commit([{ type: 'editAnnotation', id: fid, annId: aid, text: txt }], { soft: true });
      });
    }
  });

  // search box lives inside the facet panel, which re-renders; keep focus/caret
  var searchGuard = false;
  document.addEventListener('focusin', function (e) {
    if (e.target.id === 'q') searchGuard = true;
  });
  document.addEventListener('focusout', function (e) {
    if (e.target.id === 'q') searchGuard = false;
  });
  var origRenderFacets = renderFacets;
  renderFacets = function () {
    var q = $('#q');
    var keep = searchGuard && q ? { v: q.value, s: q.selectionStart, e: q.selectionEnd } : null;
    origRenderFacets();
    if (keep) {
      var q2 = $('#q');
      if (q2) { q2.value = keep.v; q2.focus(); try { q2.setSelectionRange(keep.s, keep.e); } catch (err) { /* ignore */ } }
    }
  };

  // ------------------------------------------------------------------ boot
  function applyNarrow() {
    var n = window.matchMedia('(max-width: 880px)').matches;
    if (n !== state.narrow) { state.narrow = n; closePopover(); renderChrome(); }
  }
  window.addEventListener('resize', applyNarrow);

  window.addEventListener('beforeunload', function (e) {
    if (state.save.state !== 'saved') {
      e.preventDefault();
      e.returnValue = '';
      return '';
    }
  });

  fetch('/api/data').then(function (r) { return r.json(); }).then(function (j) {
    state.doc = j.doc;
    state.save = j.save;
    state.narrow = window.matchMedia('(max-width: 880px)').matches;
    renderAll();
    setInterval(pollStatus, 2000);
  }).catch(function (e) {
    document.getElementById('list').innerHTML = '<div class="empty">Could not load data: ' + String(e) + '</div>';
  });
}

function renderPage() {
  // CLIENT is stringified, so it cannot close over server constants: hand them
  // over as globals the client function reads.
  const js =
    'var SEVERITY_RUBRIC = ' + JSON.stringify(SEVERITY_RUBRIC) + ';\n' +
    'var DECISION_KEYS = ' + JSON.stringify(DECISION_KEYS) + ';\n' +
    '(' + CLIENT.toString() + ')();';
  return (
    '<!doctype html>\n<html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<title>Findings triage</title><style>' + CSS + '</style></head><body>' +
    '<header id="top">' +
    '<div id="hdrinfo"><h1>Findings triage</h1></div>' +
    '<span class="spacer"></span>' +
    '<span id="saveind" class="s-saved">…</span>' +
    '<button type="button" class="btn sm" id="savenow">Save now</button>' +
    '<a class="btn sm" href="/api/export" download>Export</a>' +
    '<button type="button" class="btn sm" id="helpbtn" title="Keyboard shortcuts">?</button>' +
    '</header>' +
    '<div id="shell"><div id="facetwrap"></div>' +
    '<main id="main">' +
    '<div class="bar" id="viewbar"></div>' +
    '<div class="bar" id="bulkbar" hidden></div>' +
    '<div id="list"></div>' +
    '</main></div>' +
    '<div id="toasts"></div>' +
    '<datalist id="dl-clusters"></datalist><datalist id="dl-tags"></datalist><datalist id="dl-ids"></datalist>' +
    '<script>' + js + '</' + 'script></body></html>'
  );
}

// ---------------------------------------------------------------------------
// boot
// ---------------------------------------------------------------------------

try {
  load();
} catch (e) {
  process.stderr.write('fatal: ' + e.message + '\n');
  process.exit(1);
}

function shutdown(sig) {
  process.stdout.write('\n' + sig + ': flushing before exit\n');
  const r = flushNow();
  if (!r.ok) process.stderr.write('WARNING: final save failed: ' + r.errors.join('; ') + '\n');
  server.close(function () { process.exit(r.ok ? 0 : 1); });
  setTimeout(function () { process.exit(r.ok ? 0 : 1); }, 500);
}
process.on('SIGINT', function () { shutdown('SIGINT'); });
process.on('SIGTERM', function () { shutdown('SIGTERM'); });

server.on('error', function (err) {
  if (err && err.code === 'EADDRINUSE') {
    process.stderr.write('fatal: port ' + ARGS.port + ' on ' + ARGS.host + ' is already in use.\n' +
      'Another copy of triage-app may already be running — open it, or pass a different --port.\n');
  } else if (err && err.code === 'EACCES') {
    process.stderr.write('fatal: not allowed to bind ' + ARGS.host + ':' + ARGS.port + '\n');
  } else {
    process.stderr.write('fatal: server error: ' + (err && err.message) + '\n');
  }
  process.exit(1);
});

server.listen(ARGS.port, ARGS.host, function () {
  const a = server.address();
  const shown = ARGS.host === '0.0.0.0' ? 'http://<this-machine-lan-ip>:' + a.port + '/' : 'http://' + ARGS.host + ':' + a.port + '/';
  process.stdout.write('triage-app  data: ' + DATA_PATH + '  (' + doc.findings.length + ' findings)\n');
  process.stdout.write('listening on ' + shown + '\n');
  if (ARGS.host !== '0.0.0.0') process.stdout.write('for phone access on the LAN: --host 0.0.0.0\n');
});
