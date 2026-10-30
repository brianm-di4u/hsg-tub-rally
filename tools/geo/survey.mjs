// Surveys the raw OSM + DEM data for race-loop planning.   node tools/geo/survey.mjs
//
// Reads  art-src/geo/raw/{osm-roads,osm-pois,osm-buildings,gnis}.json and the DEM TIFFs (tools/geo/fetch.mjs).
// Writes research/geo/road-survey.md      per-road stats, connectivity matrix, loop checks, named mountain ways
//        research/geo/road-survey.json    the same numbers plus OSM way ids per road (for later track tools)
//        research/geo/anchors.json        landmark anchors {id, name, lon, lat, elevM, source, ...}
//        art-src/geo/previews/<area>.svg  plain SVG maps (roads by class, labels, POIs, anchors, 10 m contours)
// OSM data (c) OpenStreetMap contributors, ODbL 1.0. Elevation: USGS 3DEP (public domain).
import fs from 'node:fs';
import path from 'node:path';
import { RAW, ROOT, loadDefaultDem, project, unproject, haversine, ft, ORIGIN } from './geo-lib.mjs';

const OUT_RESEARCH = path.join(ROOT, 'research', 'geo');
const OUT_PREVIEWS = path.join(ROOT, 'art-src', 'geo', 'previews');
fs.mkdirSync(OUT_RESEARCH, { recursive: true });
fs.mkdirSync(OUT_PREVIEWS, { recursive: true });

const load = (f, optional) => {
  const p = path.join(RAW, f);
  if (!fs.existsSync(p)) { if (optional) return null; throw new Error('missing ' + p + ' (run node tools/geo/fetch.mjs)'); }
  return JSON.parse(fs.readFileSync(p, 'utf8'));
};
const roadsJ = load('osm-roads.json'), poisJ = load('osm-pois.json'), bldJ = load('osm-buildings.json'), gnisJ = load('gnis.json', true);
const manifest = load('manifest.json', true) || {};
const dem = loadDefaultDem();

const r1 = (v) => Math.round(v * 10) / 10;
const r0 = (v) => Math.round(v);
const fmtM = (m) => (Number.isFinite(m) ? r0(m).toLocaleString('en-US') : '–');
const ll = (lat, lon) => `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
const osmUrl = (type, id) => `https://www.openstreetmap.org/${type}/${id}`;

// ------------------------------------------------------------------------------------------------- ways + graph
const NAME_KEYS = ['name', 'name_1', 'name_2', 'alt_name', 'old_name', 'official_name', 'short_name', 'loc_name'];
const namesOf = (t) => NAME_KEYS.map((k) => t[k]).filter(Boolean).flatMap((v) => v.split(';').map((s) => s.trim()));
const MOTOR = new Set(['motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'unclassified', 'residential', 'living_street', 'service', 'track', 'road', 'busway',
  'motorway_link', 'trunk_link', 'primary_link', 'secondary_link', 'tertiary_link', 'raceway']);
const FOOT = new Set(['footway', 'pedestrian', 'path', 'steps', 'cycleway', 'bridleway', 'corridor']);
const CLASS_RANK = { motorway: 10, trunk: 9, primary: 8, secondary: 7, tertiary: 6, unclassified: 5, residential: 5, living_street: 4, road: 4, service: 3, track: 2, pedestrian: 2, footway: 1, path: 1, cycleway: 1, steps: 1, bridleway: 1 };
const baseClass = (h) => (h || '').replace(/_link$/, '');
function onewayDir(t) {
  const o = t.oneway;
  if (o === 'yes' || o === 'true' || o === '1') return 1;
  if (o === '-1' || o === 'reverse') return -1;
  if (o === 'no') return 0;
  if (t.junction === 'roundabout' || t.junction === 'circular' || t.highway === 'motorway') return 1;
  return 0;
}

const allWays = roadsJ.elements.filter((e) => e.type === 'way' && e.geometry && e.geometry.length > 1)
  .map((e) => ({ id: e.id, tags: e.tags || {}, nodes: e.nodes, geom: e.geometry.map((p) => (p ? { lon: p.lon, lat: p.lat } : null)) }))
  .filter((w) => w.geom.every(Boolean));
const ways = allWays.filter((w) => w.tags.highway);
const waterWays = allWays.filter((w) => !w.tags.highway && (w.tags.waterway || w.tags.tunnel === 'culvert'));
for (const w of ways) {
  w.names = namesOf(w.tags);
  w.name = w.tags.name || w.names[0] || '';
  w.cls = baseClass(w.tags.highway);
  w.motor = MOTOR.has(w.tags.highway);
  w.ow = onewayDir(w.tags);
  w.len = 0; w.seg = [];
  for (let i = 1; i < w.geom.length; i++) { const d = haversine(w.geom[i - 1].lon, w.geom[i - 1].lat, w.geom[i].lon, w.geom[i].lat); w.seg.push(d); w.len += d; }
}
const wayById = new Map(ways.map((w) => [w.id, w]));
const nodePos = new Map(), nodeWays = new Map(), adj = new Map(), edges = [];
for (const w of ways) {
  w.nodes.forEach((n, i) => {
    nodePos.set(n, w.geom[i]);
    if (!nodeWays.has(n)) nodeWays.set(n, new Set());
    nodeWays.get(n).add(w.id);
  });
  for (let i = 1; i < w.nodes.length; i++) {
    const e = { a: w.nodes[i - 1], b: w.nodes[i], len: w.seg[i - 1], w };
    const k = edges.push(e) - 1;
    for (const n of [e.a, e.b]) { if (!adj.has(n)) adj.set(n, []); adj.get(n).push(k); }
  }
}

// Routing profiles. 'road' = motor classes, oneway ignored; 'road1' = motor classes, oneway respected; 'any' = every highway.
const PROFILES = {
  road: { label: 'roads (motor classes incl. service/track), oneway ignored', ok: (w) => w.motor, oneway: false },
  road1: { label: 'roads, oneway respected', ok: (w) => w.motor, oneway: true },
  any: { label: 'any highway incl. footway/path/steps, oneway ignored', ok: () => true, oneway: false },
};
class Heap {
  constructor() { this.a = []; }
  push(d, n) { const a = this.a; a.push([d, n]); let i = a.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (a[p][0] <= a[i][0]) break; [a[p], a[i]] = [a[i], a[p]]; i = p; } }
  pop() {
    const a = this.a, top = a[0], last = a.pop();
    if (a.length) { a[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < a.length && a[l][0] < a[m][0]) m = l; if (r < a.length && a[r][0] < a[m][0]) m = r; if (m === i) break; [a[m], a[i]] = [a[i], a[m]]; i = m; } }
    return top;
  }
  get size() { return this.a.length; }
}
/** Multi-source Dijkstra. Stops when `stopAt(node)` returns true (that node is returned) or the heap drains.
 *  opts.only: Set of way ids allowed; opts.cost(k, e): edge cost (default its length). */
function dijkstra(sources, profile, stopAt, maxDist = Infinity, opts = {}) {
  const P = PROFILES[profile], dist = new Map(), prev = new Map(), h = new Heap();
  for (const s of sources) { dist.set(s, 0); h.push(0, s); }
  while (h.size) {
    const [d, u] = h.pop();
    if (d > dist.get(u)) continue;
    if (stopAt && stopAt(u)) return { end: u, dist, prev };
    if (d > maxDist) break;
    for (const k of adj.get(u) || []) {
      const e = edges[k];
      if (!P.ok(e.w)) continue;
      if (opts.only && !opts.only.has(e.w.id)) continue;
      if (opts.exclude && opts.exclude.has(e.w.id)) continue;
      const fwd = e.a === u, v = fwd ? e.b : e.a;
      if (P.oneway && e.w.ow && ((e.w.ow === 1 && !fwd) || (e.w.ow === -1 && fwd))) continue;
      const nd = d + (opts.cost ? opts.cost(k, e) : e.len);
      if (nd < (dist.has(v) ? dist.get(v) : Infinity)) { dist.set(v, nd); prev.set(v, k); h.push(nd, v); }
    }
  }
  return { end: null, dist, prev };
}
function tracePath(res, end) {
  const out = []; let u = end;
  while (res.prev.has(u)) { const k = res.prev.get(u), e = edges[k]; const from = e.a === u ? e.b : e.a; out.push({ k, from, to: u }); u = from; }
  return out.reverse();
}
/** opts.only (Set of way ids), opts.prefer (Set of way ids: others cost 3x), opts.used (Map edge->count: reused edges cost 8x). */
function route(fromNode, toNode, profile, opts = {}) {
  if (fromNode === toNode) return { ok: true, steps: [], len: 0 };
  const cost = opts.prefer || opts.used ? (k, e) => e.len * (opts.prefer && !opts.prefer.has(e.w.id) ? 3 : 1) * (opts.used && opts.used.has(k) ? 8 : 1) : null;
  const res = dijkstra([fromNode], profile, (u) => u === toNode, Infinity, { only: opts.only, cost });
  if (!res.end) return { ok: false, steps: [], len: Infinity };
  const steps = tracePath(res, res.end);
  return { ok: true, steps, len: steps.reduce((a, s) => a + edges[s.k].len, 0) };
}
const wayLabel = (w) => w.name || `(unnamed ${w.tags.highway})`;
function summarizeSteps(steps) {
  const seq = [], byClass = {}; let against = 0, stepsM = 0, privateM = 0, len = 0;
  for (const s of steps) {
    const e = edges[s.k], w = e.w, lab = wayLabel(w);
    len += e.len;
    byClass[w.tags.highway] = (byClass[w.tags.highway] || 0) + e.len;
    if (w.ow && ((w.ow === 1 && e.a !== s.from) || (w.ow === -1 && e.a === s.from))) against += e.len;
    if (w.tags.highway === 'steps') stepsM += e.len;
    if (/^(private|no)$/.test(w.tags.access || '')) privateM += e.len;
    if (seq.length && seq[seq.length - 1].label === lab) seq[seq.length - 1].m += e.len; else seq.push({ label: lab, m: e.len });
  }
  return { len, seq, byClass, against, stepsM, privateM };
}
const seqText = (seq, minM = 15) => seq.filter((s) => s.m >= minM || seq.length <= 3).map((s) => `${s.label} ${fmtM(s.m)} m`).join(' → ') || '(none)';

function nearestNode(lon, lat, wayFilter) {
  let best = null, bd = Infinity;
  for (const [n, p] of nodePos) {
    if (wayFilter) { let ok = false; for (const wid of nodeWays.get(n)) if (wayFilter(wayById.get(wid))) { ok = true; break; } if (!ok) continue; }
    const d = haversine(lon, lat, p.lon, p.lat);
    if (d < bd) { bd = d; best = n; }
  }
  return { node: best, d: bd };
}
function nearestWay(lon, lat, filter) {
  let best = null, bd = Infinity;
  const P = project(lon, lat);
  for (const w of ways) {
    if (filter && !filter(w)) continue;
    for (let i = 1; i < w.geom.length; i++) {
      const a = project(w.geom[i - 1].lon, w.geom[i - 1].lat), b = project(w.geom[i].lon, w.geom[i].lat);
      const dx = b.x - a.x, dz = b.z - a.z, L2 = dx * dx + dz * dz;
      const t = L2 ? Math.max(0, Math.min(1, ((P.x - a.x) * dx + (P.z - a.z) * dz) / L2)) : 0;
      const d = Math.hypot(a.x + t * dx - P.x, a.z + t * dz - P.z);
      if (d < bd) { bd = d; best = w; }
    }
  }
  return { way: best, d: bd };
}

// ------------------------------------------------------------------------------------------------- elevation helpers
function densify(geom, step) {
  const out = [{ ...geom[0], s: 0 }]; let s = 0;
  for (let i = 1; i < geom.length; i++) {
    const a = geom[i - 1], b = geom[i], d = haversine(a.lon, a.lat, b.lon, b.lat), n = Math.max(1, Math.ceil(d / step));
    for (let k = 1; k <= n; k++) out.push({ lon: a.lon + ((b.lon - a.lon) * k) / n, lat: a.lat + ((b.lat - a.lat) * k) / n, s: s + (d * k) / n });
    s += d;
  }
  return out;
}
function profileOf(geom, step = 5, base = 25) {
  const pts = densify(geom, step);
  const tiles = {};
  for (const p of pts) { const i = dem.sampleInfo(p.lon, p.lat); p.z = i.z; tiles[i.tile] = (tiles[i.tile] || 0) + 1; }
  let mn = Infinity, mx = -Infinity, maxGrade = 0, ascent = 0, descent = 0, lastZ = null; const grades = [];
  for (const p of pts) if (Number.isFinite(p.z)) { mn = Math.min(mn, p.z); mx = Math.max(mx, p.z); }
  const k = Math.max(1, Math.round(base / step));
  for (let i = 0; i + k < pts.length; i++) { const dz = pts[i + k].z - pts[i].z, ds = pts[i + k].s - pts[i].s; if (ds > 0 && Number.isFinite(dz)) { const g = Math.abs(dz / ds); grades.push(g); maxGrade = Math.max(maxGrade, g); } }
  for (const p of pts) { if (!Number.isFinite(p.z)) continue; if (lastZ === null) { lastZ = p.z; continue; } const dz = p.z - lastZ; if (Math.abs(dz) >= 1) { if (dz > 0) ascent += dz; else descent -= dz; lastZ = p.z; } }
  return { min: mn, max: mx, maxGrade, grades, ascent, descent, tiles, len: pts[pts.length - 1].s, pts };
}
const pct = (arr, q) => { if (!arr.length) return NaN; const s = [...arr].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(s.length * q))]; };
// Survey bbox (the Overpass query box). Ways are returned whole, so stats are clipped to it.
const BBOX = { south: 34.49, west: -93.135, north: 34.55, east: -92.985 };
const inBbox = (p) => p.lat >= BBOX.south && p.lat <= BBOX.north && p.lon >= BBOX.west && p.lon <= BBOX.east;
function clipRuns(w) {
  const runs = []; let cur = [];
  w.geom.forEach((p, i) => { if (inBbox(p)) cur.push(i); else { if (cur.length > 1) runs.push(cur); cur = []; } });
  if (cur.length > 1) runs.push(cur);
  return runs;
}
function stepsGeom(steps) {
  const g = [];
  for (const s of steps) { const a = nodePos.get(s.from), b = nodePos.get(s.to); if (!g.length) g.push(a); g.push(b); }
  return g;
}

// ------------------------------------------------------------------------------------------------- target roads
const TARGETS = [
  { id: 'central', label: 'Central Avenue', re: /^(North |South |N |S )?Central Avenue$/i },
  { id: 'park', label: 'Park Avenue', re: /^Park Avenue$/i },
  { id: 'whittington', label: 'Whittington Avenue', re: /^Whittington Avenue$/i },
  { id: 'fountain', label: 'Fountain Street', re: /^Fountain Street$/i },
  { id: 'reserve', label: 'Reserve Street', re: /^Reserve Street$/i },
  { id: 'bridge', label: 'Bridge Street', re: /^Bridge Street$/i },
  { id: 'malvern', label: 'Malvern Avenue', re: /^Malvern Avenue$/i },
  { id: 'exchange', label: 'Exchange Street', re: /^Exchange Street$/i },
  { id: 'prospect', label: 'Prospect Avenue', re: /^Prospect Avenue$/i },
  { id: 'ouachita', label: 'Ouachita Avenue', re: /^Ouachita Avenue$/i },
  { id: 'hsmtn', label: 'Hot Springs Mountain Drive', re: /^Hot Springs Mountain Drive$/i },
  // The climb from Fountain St behind the Row and up the switchbacks to the tower is two UNNAMED oneway TIGER ways
  // (found by routing; the tower's address is 401 Hot Springs Mountain Drive and NPS says the drive "starts at the end of
  // Fountain Street"). Listed by id; the survey warns if they disappear or gain a name.
  { id: 'hsmtnLower', label: 'Hot Springs Mountain Drive, lower climb (unnamed in OSM)', ids: [250875470, 12800909] },
  { id: 'northmtn', label: 'North Mountain Drive / Loop', re: /^(North|N\.?) Mountain (Drive|Loop|Road|Dr\.?)$/i },
  { id: 'westmtn', label: 'West Mountain Drive', re: /^West Mountain Drive$/i },
  { id: 'westsummit', label: 'West Mountain Summit Drive', re: /West Mountain Summit/i },
  { id: 'music', label: 'Music Mountain Road', re: /^Music Mountain Road$/i },
  { id: 'blacksnake', label: 'Black Snake Road', re: /^Black ?snake (Road|Rd)$/i },
  { id: 'cedarglades', label: 'Cedar Glades Road', re: /^Cedar ?glades? (Road|Rd)$/i },
  { id: 'gorge', label: 'Gorge Road / Gulpha Gorge roads', re: /Gorge/i, motorOnly: true },
  { id: 'promenade', label: 'Grand Promenade (footway)', re: /^Grand Promenade$/i },
];
const WARN = [];
for (const T of TARGETS) {
  T.ways = T.ids ? T.ids.map((id) => wayById.get(id)).filter(Boolean) : ways.filter((w) => w.names.some((n) => T.re.test(n)) && (!T.motorOnly || w.motor));
  if (T.ids && T.ways.length !== T.ids.length) WARN.push(`${T.label}: only ${T.ways.length} of ways ${T.ids.join(', ')} still exist in OSM`);
  if (T.ids) for (const w of T.ways) if (w.name) WARN.push(`${T.label}: way ${w.id} is now named "${w.name}"`);
  T.wayIds = new Set(T.ways.map((w) => w.id));
  T.nodeSet = new Set(T.ways.flatMap((w) => w.nodes));
}
const T = Object.fromEntries(TARGETS.map((t) => [t.id, t]));
const onTarget = (id) => (w) => T[id].wayIds.has(w.id);

function components(wayList) {
  const parent = new Map(wayList.map((w) => [w.id, w.id]));
  const find = (x) => { while (parent.get(x) !== x) { parent.set(x, parent.get(parent.get(x))); x = parent.get(x); } return x; };
  const byNode = new Map();
  for (const w of wayList) for (const n of w.nodes) { if (byNode.has(n)) parent.set(find(w.id), find(byNode.get(n))); else byNode.set(n, w.id); }
  const groups = new Map();
  for (const w of wayList) { const r = find(w.id); if (!groups.has(r)) groups.set(r, []); groups.get(r).push(w); }
  return [...groups.values()].sort((a, b) => b.reduce((s, w) => s + w.len, 0) - a.reduce((s, w) => s + w.len, 0));
}
function compGap(A, B) {
  let best = { d: Infinity };
  for (const a of A) for (const pa of a.geom) for (const b of B) for (const pb of b.geom) {
    const d = haversine(pa.lon, pa.lat, pb.lon, pb.lat);
    if (d < best.d) best = { d, pa, pb };
  }
  return best;
}
/** Cyclomatic number of the way set: edges - vertices + components (on the junction/vertex graph). > 0 means a cycle exists. */
function cyclomatic(wayList) {
  const V = new Set(), E = new Set();
  for (const w of wayList) for (let i = 1; i < w.nodes.length; i++) { const a = w.nodes[i - 1], b = w.nodes[i]; V.add(a); V.add(b); E.add(a < b ? a + '-' + b : b + '-' + a); }
  return E.size - V.size + components(wayList).length;
}
const countTag = (wayList, key) => {
  const c = {};
  for (const w of wayList) { const v = w.tags[key] === undefined ? '–' : w.tags[key]; c[v] = (c[v] || 0) + 1; }
  return Object.entries(c).sort((a, b) => b[1] - a[1]).map(([v, n]) => `${v}×${n}`).join(', ');
};

const survey = {};
for (const t of TARGETS) {
  const s = { label: t.label, wayIds: [...t.wayIds], names: [...new Set(t.ways.map((w) => w.name))] };
  survey[t.id] = s;
  if (!t.ways.length) { s.missing = true; continue; }
  s.ways = t.ways.length;
  s.lengthFull = t.ways.reduce((a, w) => a + w.len, 0);
  // statistics are clipped to the survey bbox (Overpass returns whole ways, e.g. Park Ave runs on to 34.58 N)
  const runs = t.ways.flatMap((w) => clipRuns(w).map((r) => ({ w, idx: r })));
  const segs = runs.flatMap(({ w, idx }) => idx.slice(1).map((i) => w.seg[i - 1]));
  s.length = segs.reduce((a, b) => a + b, 0);
  s.vertices = runs.reduce((a, r) => a + r.idx.length, 0);
  s.spacingMean = s.length / segs.length;
  s.spacingMax = Math.max(...segs);
  s.spacingP90 = pct(segs, 0.9);
  for (const k of ['highway', 'oneway', 'lanes', 'surface', 'maxspeed', 'bridge', 'access']) s['tag_' + k] = countTag(t.ways, k);
  // elevation (bridges and tunnels excluded from the grade: the DEM is bare earth)
  let mn = Infinity, mx = -Infinity, maxGrade = 0, gradeWay = null; const tiles = {}, grades = [];
  for (const { w, idx } of runs) {
    const p = profileOf(idx.map((i) => w.geom[i]));
    mn = Math.min(mn, p.min); mx = Math.max(mx, p.max);
    if (!w.tags.bridge && !w.tags.tunnel) { grades.push(...p.grades); if (p.maxGrade > maxGrade) { maxGrade = p.maxGrade; gradeWay = w.id; } }
    for (const [k, v] of Object.entries(p.tiles)) tiles[k] = (tiles[k] || 0) + v;
  }
  Object.assign(s, { elevMin: mn, elevMax: mx, maxGrade, p95Grade: pct(grades, 0.95), maxGradeWay: gradeWay, demTiles: tiles });
  // internal connectivity
  const comps = components(t.ways);
  s.components = comps.length;
  s.cyclomatic = cyclomatic(t.ways);
  s.componentInfo = comps.map((c) => ({ ways: c.map((w) => w.id), length: c.reduce((a, w) => a + w.len, 0) }));
  s.gaps = [];
  if (comps.length > 1) for (let i = 1; i < comps.length; i++) {
    const g = compGap(comps[0], comps[i]);
    const a = nearestNode(g.pa.lon, g.pa.lat, (w) => comps[0].includes(w)).node, b = nearestNode(g.pb.lon, g.pb.lat, (w) => comps[i].includes(w)).node;
    const rr = route(a, b, 'road'), ra = route(a, b, 'any');
    s.gaps.push({ toComponent: i, straight: g.d, at: [g.pa.lat, g.pa.lon], to: [g.pb.lat, g.pb.lon], viaRoad: rr.ok ? rr.len : null, viaRoadSeq: rr.ok ? seqText(summarizeSteps(rr.steps).seq) : '', viaAny: ra.ok ? ra.len : null });
  }
  // junctions with other targets and with other named streets
  s.joins = {};
  for (const o of TARGETS) {
    if (o === t || !o.ways.length) continue;
    const shared = [...t.nodeSet].filter((n) => o.nodeSet.has(n));
    if (!shared.length) continue;
    const sharesWays = t.ways.some((w) => o.wayIds.has(w.id));
    s.joins[o.id] = { label: o.label, nodes: shared.length, at: shared.slice(0, 3).map((n) => [nodePos.get(n).lat, nodePos.get(n).lon]), sharesWays };
  }
  const other = {};
  for (const n of t.nodeSet) for (const wid of nodeWays.get(n)) {
    const w = wayById.get(wid); if (t.wayIds.has(wid) || !w.name) continue;
    if (TARGETS.some((o) => o.wayIds.has(wid))) continue;
    other[w.name] = other[w.name] || new Set(); other[w.name].add(n);
  }
  s.otherStreets = Object.keys(other).sort();
  // ends of each component that touch nothing at all (dead ends in OSM topology)
  s.deadEnds = [];
  for (const w of t.ways) for (const n of [w.nodes[0], w.nodes[w.nodes.length - 1]]) {
    if (nodeWays.get(n).size === 1 && !(w.nodes[0] === w.nodes[w.nodes.length - 1])) s.deadEnds.push({ way: w.id, at: [nodePos.get(n).lat, nodePos.get(n).lon] });
    if (w.nodes[0] === w.nodes[w.nodes.length - 1] && n === w.nodes[0]) {
      const touches = w.nodes.some((m) => nodeWays.get(m).size > 1);
      if (!touches) s.deadEnds.push({ way: w.id, at: [nodePos.get(n).lat, nodePos.get(n).lon], isolatedRing: true });
    }
  }
}

// connectivity matrix (shortest road distance between any node of A and any node of B; 0 = shared junction)
const matrix = {};
for (const a of TARGETS) {
  if (!a.ways.length) continue;
  matrix[a.id] = {};
  const res = dijkstra([...a.nodeSet].filter((n) => a.ways.some((w) => w.motor) ? [...nodeWays.get(n)].some((wid) => wayById.get(wid).motor) : true), a.id === 'promenade' ? 'any' : 'road', null, 6000);
  for (const b of TARGETS) {
    if (b === a || !b.ways.length) continue;
    let best = Infinity, bn = null;
    for (const n of b.nodeSet) { const d = res.dist.get(n); if (d !== undefined && d < best) { best = d; bn = n; } }
    matrix[a.id][b.id] = { d: best, via: bn !== null && best > 0 && best < 6000 ? seqText(summarizeSteps(tracePath(res, bn)).seq, 30) : '' };
  }
}

// ------------------------------------------------------------------------------------------------- POIs + anchors
function centroidOf(e) {
  if (e.type === 'node') return { lon: e.lon, lat: e.lat };
  let rings = [];
  if (e.type === 'way' && e.geometry) rings = [e.geometry];
  if (e.type === 'relation' && e.members) rings = e.members.filter((m) => m.geometry && (m.role === 'outer' || !m.role)).map((m) => m.geometry);
  rings = rings.map((r) => r.filter(Boolean));
  let A = 0, cx = 0, cz = 0, n = 0, sx = 0, sz = 0;
  for (const r of rings) {
    const P = r.map((p) => project(p.lon, p.lat));
    for (const p of P) { sx += p.x; sz += p.z; n++; }
    const closed = r.length > 3 && r[0].lon === r[r.length - 1].lon && r[0].lat === r[r.length - 1].lat;
    if (!closed) continue;
    for (let i = 0; i < P.length - 1; i++) { const f = P[i].x * P[i + 1].z - P[i + 1].x * P[i].z; A += f; cx += (P[i].x + P[i + 1].x) * f; cz += (P[i].z + P[i + 1].z) * f; }
  }
  if (Math.abs(A) > 1) return unproject(cx / (3 * A), cz / (3 * A));
  if (n) return unproject(sx / n, sz / n);
  if (e.bounds) return { lon: (e.bounds.minlon + e.bounds.maxlon) / 2, lat: (e.bounds.minlat + e.bounds.maxlat) / 2 };
  return null;
}
const osmEls = [...poisJ.elements, ...bldJ.elements];
const findOsm = (pred) => osmEls.find((e) => e.tags && pred(e.tags, e));
const byId = (type, id) => osmEls.find((e) => e.type === type && e.id === id);
const gnisFeatures = gnisJ ? Object.values(gnisJ.layers).flatMap((l) => l.features) : [];
const gnis = (name, cls) => gnisFeatures.find((f) => f.gaz_name === name && (!cls || f.gaz_featureclass === cls));
const GNIS_URL = 'https://carto.nationalmap.gov/arcgis/rest/services/geonames/MapServer';

/** DEM maximum within radius r (metres) of a point, on a 4 m search grid then refined. */
function demPeak(lon, lat, r) {
  const c = project(lon, lat); let best = { z: -Infinity };
  for (let dx = -r; dx <= r; dx += 4) for (let dz = -r; dz <= r; dz += 4) {
    if (dx * dx + dz * dz > r * r) continue;
    const p = unproject(c.x + dx, c.z + dz), z = dem.sample(p.lon, p.lat);
    if (z > best.z) best = { z, ...p };
  }
  return best;
}

// Corpus coordinates to cross-check against (research/bathhouse-row-layout.md table; games/trivia/research/geo-anchors.json)
const CORPUS = {
  superior: [34.514877, -93.053314], hale: [34.51458, -93.053426], maurice: [34.514131, -93.053401], fordyce: [34.513746, -93.05352],
  quapaw: [34.513261, -93.053512], ozark: [34.512784, -93.053604], buckstaff: [34.512469, -93.05354], lamar: [34.512158, -93.053655],
  arlington: [34.516667, -93.053056], tower: [34.517228, -93.046106], displaySpring: [34.514086, -93.053074], goatRock: [34.527262, -93.039179],
};
const anchors = [];
function addAnchor(a) {
  if (!a || !Number.isFinite(a.lat)) return;
  const i = dem.sampleInfo(a.lon, a.lat), P = project(a.lon, a.lat);
  const out = { id: a.id, name: a.name, lon: +a.lon.toFixed(6), lat: +a.lat.toFixed(6), elevM: r1(i.z), source: a.source,
    elevFt: r0(ft(i.z)), x: r1(P.x), z: r1(P.z), confidence: a.confidence, demTile: i.tile };
  if (a.check) { const d = haversine(a.lon, a.lat, a.check[1], a.check[0]); out.crossCheck = `${r0(d)} m from ${a.checkName} (${a.check[0]}, ${a.check[1]})`; }
  if (a.note) out.note = a.note;
  const nr = nearestWay(a.lon, a.lat, (w) => w.motor);
  out.nearestRoad = nr.way ? `${wayLabel(nr.way)} (way ${nr.way.id}), ${r0(nr.d)} m` : null;
  anchors.push(out);
}
function osmAnchor(id, name, el, extra = {}) {
  if (!el) { anchors.push({ id, name, lon: null, lat: null, elevM: null, source: 'not found in OSM', confidence: 'missing', ...extra }); return; }
  const c = centroidOf(el);
  addAnchor({ id, name, ...c, source: osmUrl(el.type, el.id) + (el.tags.name ? ` ("${el.tags.name}")` : ''), confidence: el.type === 'node' ? 'osm-node' : 'osm-footprint-centroid', ...extra });
}

osmAnchor('gulpha-gorge-campground', 'Gulpha Gorge Campground (305 Gorge Rd)', findOsm((t) => t.tourism === 'camp_site' && /Gulpha Gorge/i.test(t.name || '')),
  { note: 'Footprint centroid of the campground area. NPS Public POIs (Campground) is at 34.524357, -93.036041.' });
{ // Music Mountain: GNIS has it only as a Ridge (two points); take the DEM high point near either point.
  const g = gnis('Music Mountain');
  if (g) {
    const peaks = g.points.map(([lon, lat]) => demPeak(lon, lat, 700)).sort((a, b) => b.z - a.z);
    const p = peaks[0], wm = gnis('West Mountain', 'Summit');
    const dWm = wm ? haversine(p.lon, p.lat, wm.points[0][0], wm.points[0][1]) : NaN;
    addAnchor({ id: 'music-mountain-summit', name: 'Music Mountain summit (high point of the GNIS Music Mountain ridge)', lon: p.lon, lat: p.lat,
      source: `${GNIS_URL}/5 (GNIS ${g.gaz_id} "Music Mountain", class Ridge, points ${g.points.map(([x, y]) => y.toFixed(5) + ', ' + x.toFixed(5)).join(' / ')}) + USGS 3DEP DEM high point within 700 m`,
      confidence: 'derived', note: `GNIS lists Music Mountain only as a ridge (no summit) and OSM has no Music Mountain peak. The ridge rises NE from the GNIS points (DEM about 283 m and 408 m there) to a single summit, ${r1(p.z)} m (${r0(ft(p.z))} ft)${wm ? `, ${r0(dWm)} m from the point GNIS ${wm.gaz_id} names "West Mountain" summit (OSM natural=peak "West Mountain", ele 433)` : ''}. No other DEM summit above 380 m lies within 200 m windows on the ridge. SummitPost's 1,418 ft (432 m) for Music Mountain matches this summit; NPS gives 1,405 ft. So "Music Mountain summit" and GNIS "West Mountain summit" are the same hilltop, not the park's West Mountain Drive summit (about 335 m, 3 km east).` });
  }
}
osmAnchor('balanced-rock', 'Balanced Rock (Sugarloaf Mountain ridge)', findOsm((t) => /Balanced Rock/i.test(t.name || '')),
  { note: 'NPS: Balanced Rock Overlook is "along the ridge of Sugarloaf Mountain", reached by the Sunset Trail (no road).' });
osmAnchor('goat-rock-overlook', 'Goat Rock overlook (North Mountain)', findOsm((t) => t.tourism === 'viewpoint' && /Goat Rock/i.test(t.name || '')), { check: CORPUS.goatRock, checkName: 'corpus' });
osmAnchor('hot-springs-mountain-tower', 'Hot Springs Mountain Tower (216 ft)', findOsm((t) => t.man_made === 'tower' && /Hot Springs Mountain Tower/i.test(t.name || '')),
  { check: CORPUS.tower, checkName: 'Wikipedia/corpus point' });
{ const el = findOsm((t) => /pagoda/i.test(t.name || ''));
  if (el) osmAnchor('pagoda', 'The Pagoda (Hot Springs Mountain lookout, 1911)', el);
  else {
    const v = byId('node', 9754933743);
    if (v) addAnchor({ id: 'pagoda', name: 'The Pagoda (Hot Springs Mountain lookout point, J.G. Horn 1911) — approximate', lon: v.lon, lat: v.lat,
      source: `${osmUrl('node', v.id)} (unnamed tourism=viewpoint, direction=S) + https://home.nps.gov/hosp/planyourvisit/scenic-overlooks.htm`, confidence: 'approx',
      note: 'OSM has no Pagoda. NPS: the drive climbs "to a picnic area, the Pagoda overlook, and the Hot Springs Mountain Tower"; the Hot Springs Mountain Trail "begins at the Pagoda shelter just below the tower". This unnamed viewpoint sits between the picnic area (NPS POI 34.51578, -93.04797) and the tower. Verify on the ground/imagery.' });
  }
}
{ // West Mountain overlooks. NPS names three on the Summit Loop: Lower, Picnic, Loop (summit, looking south).
  const named = osmEls.filter((e) => e.tags && e.tags.tourism === 'viewpoint' && /West Mountain/i.test(e.tags.name || ''));
  for (const el of named) osmAnchor('westmtn-' + el.id, el.tags.name, el);
  const wv = osmEls.filter((e) => e.tags && e.tags.tourism === 'viewpoint' && !e.tags.name && e.type === 'node' && e.lon < -93.055 && e.lon > -93.075 && e.lat < 34.518 && e.lat > 34.503);
  wv.sort((a, b) => dem.sample(a.lon, a.lat) - dem.sample(b.lon, b.lat));
  wv.forEach((v, i) => {
    const nr = nearestWay(v.lon, v.lat, (w) => w.motor), onWmd = nr.way && T.westmtn.wayIds.has(nr.way.id) && nr.d < 40;
    const role = i === 0 ? 'lowest of the east-face viewpoints: best candidate for the NPS "West Mountain Lower Overlook" (aerial view of Bathhouse Row, Army-Navy Hospital below)'
      : 'higher east-face viewpoint: candidate for the NPS "Picnic Overlook" (1924 shelter) or a second lower overlook; OSM has no shelter here';
    addAnchor({ id: `westmtn-viewpoint-${i + 1}`, name: `West Mountain east-face overlook ${i + 1} (unnamed in OSM)`, lon: v.lon, lat: v.lat,
      source: osmUrl('node', v.id) + ' (unnamed tourism=viewpoint, with an amenity=parking node beside it)', confidence: 'osm-node',
      note: `${onWmd ? `On a West Mountain Drive hairpin (way ${nr.way.id}, ${r0(nr.d)} m), about ${r0(haversine(v.lon, v.lat, -93.0539, v.lat))} m west of Central Ave, facing the Row.` : `Nearest road ${nr.way ? wayLabel(nr.way) : '?'} at ${r0(nr.d)} m.`} The ${role}. Name match not confirmed.` });
  });
  // The summit-loop overlook: the highest point of the West Mountain Summit Drive ways.
  if (T.westsummit.ways.length) {
    let best = { z: -Infinity };
    for (const w of T.westsummit.ways) for (const p of densify(w.geom, 5)) { const z = dem.sample(p.lon, p.lat); if (z > best.z) best = { z, ...p }; }
    addAnchor({ id: 'westmtn-loop-overlook', name: 'West Mountain Loop Overlook (summit of the Summit Loop; looks south) — approximate', lon: best.lon, lat: best.lat,
      source: `highest DEM point on OSM ways ${[...T.westsummit.wayIds].join(', ')} (name_1=West Mountain Summit Drive) + https://home.nps.gov/hosp/planyourvisit/scenic-overlooks.htm`, confidence: 'approx',
      note: 'NPS lists, in order up the Summit Loop: Lower Overlook (aerial view of Bathhouse Row, Army-Navy Hospital below), Picnic Overlook (1924 shelter), Loop Overlook (summit, view south to the Trap Mountains / Lake Hamilton). OSM names none of them. The two unnamed OSM viewpoints on the same way (westmtn-viewpoint-1/2, east-face hairpins above the Row) are the candidates for the Lower and Picnic overlooks; this anchor is the drive\'s DEM high point on the summit ring.' });
  }
}
{ const vc = findOsm((t) => /Hot Springs Visitor Center/i.test(t.name || ''));
  const el = findOsm((t) => /Wheatley/i.test(t.name || ''));
  if (el) osmAnchor('hill-wheatley-plaza', 'Hill Wheatley Plaza', el);
  else if (vc) {
    const c = centroidOf(vc);
    addAnchor({ id: 'hill-wheatley-plaza', name: 'Hill Wheatley Plaza (city visitor center, 629 Central Ave) — approximate', ...c,
      source: `${osmUrl(vc.type, vc.id)} ("Hot Springs Visitor Center", addr 629 Central Avenue) + https://www.hotspringsguides.com/hot-springs/hill-wheatley-plaza-jug-fountain-hot-arkansas`, confidence: 'approx',
      note: 'OSM has no plaza feature. The guide gives 629 Central Ave and says the jug fountain is "directly in front of the city visitor center"; its own GPS (34.5014, -93.0551) is about 1 km south and disagrees with the address, so it is not used. Unnamed OSM fountains at 34.511484, -93.053822 and 34.511266, -93.053788 (just north, by Reserve St) may be the plaza/Reserve St jug fountains.' });
  }
}
osmAnchor('exchange-street-parking-plaza', 'Exchange Street Parking Plaza (128 Exchange St, multi-storey)', findOsm((t) => t['addr:housenumber'] === '128' && /Exchange/i.test(t['addr:street'] || '') && (t.amenity === 'parking' || /parking/.test(t.building || ''))));
osmAnchor('display-spring', 'Display Spring (behind the Maurice)', byId('node', 11247323174) || findOsm((t) => t.natural === 'spring'), { check: CORPUS.displaySpring, checkName: 'corpus' });
osmAnchor('arlington', 'Arlington Resort Hotel & Spa (239 Central Ave)', findOsm((t) => /Arlington Resort/i.test(t.name || '') && t.building), { check: CORPUS.arlington, checkName: 'Wikipedia point' });
for (const [id, re, label] of [['superior', /Superior/, 'Superior Bathhouse (329 Central)'], ['hale', /Hale/, 'Hale Bathhouse / Hotel Hale (341 Central)'], ['maurice', /Maurice/, 'Maurice Bathhouse (359 Central)'],
  ['fordyce', /Fordyce/, 'Fordyce Bathhouse, NPS visitor center (369 Central)'], ['quapaw', /Quapaw/, 'Quapaw Bathhouse (413 Central)'], ['ozark', /Ozark Bath/, 'Ozark Bathhouse (425 Central)'],
  ['buckstaff', /Buckstaff/, 'Buckstaff Bathhouse (509 Central)'], ['lamar', /Lamar/, 'Lamar Bathhouse (515 Central)']]) {
  osmAnchor('bathhouse-' + id, label, findOsm((t) => t.building && re.test(t.name || '')), { check: CORPUS[id], checkName: 'research/bathhouse-row-layout.md centroid' });
}
// extras that are handy for loop planning
for (const [id, name, cls] of [['hot-springs-mountain-summit', 'Hot Springs Mountain', 'Summit'], ['north-mountain-summit', 'North Mountain', 'Summit'], ['west-mountain-summit', 'West Mountain', 'Summit'], ['sugarloaf-summit', 'Sugarloaf Mountain', 'Summit']]) {
  const g = gnis(name, cls); if (!g) continue;
  addAnchor({ id, name: name + ' summit (GNIS)', lon: g.points[0][0], lat: g.points[0][1], source: `${GNIS_URL}/5 (GNIS ${g.gaz_id})`, confidence: 'gnis' });
}
{ const p = T.central.ways.length ? nearestNode(-93.05375, 34.51373, onTarget('central')) : null;
  if (p) { const q = nodePos.get(p.node); addAnchor({ id: 'central-at-fordyce', name: 'Central Ave centreline in front of the Fordyce (DEM check point)', lon: q.lon, lat: q.lat, source: 'OSM Central Avenue vertex nearest 34.51373, -93.05375', confidence: 'derived' }); } }
{ const pr = T.promenade.ways;
  if (pr.length) {
    const pts = pr.flatMap((w) => [w.geom[0], w.geom[w.geom.length - 1]]);
    const n = pts.reduce((a, b) => (b.lat > a.lat ? b : a)), s = pts.reduce((a, b) => (b.lat < a.lat ? b : a));
    addAnchor({ id: 'grand-promenade-north', name: 'Grand Promenade, north end (Fountain St side)', ...n, source: 'OSM Grand Promenade ways ' + pr.map((w) => w.id).join(', '), confidence: 'derived' });
    addAnchor({ id: 'grand-promenade-south', name: 'Grand Promenade, south end (Reserve St stairs)', ...s, source: 'OSM Grand Promenade ways ' + pr.map((w) => w.id).join(', '), confidence: 'derived' });
  }
}
const A = Object.fromEntries(anchors.map((a) => [a.id, a]));
fs.writeFileSync(path.join(OUT_RESEARCH, 'anchors.json'), JSON.stringify({
  _meta: {
    description: 'Landmark anchors for Tub Rally. WGS84 lon/lat; elevM = USGS 3DEP DEM (bilinear, finest tile) at the point, NAVD88 metres; x/z = tools/geo/geo-lib.mjs project() metres (x east, z south) about the Bathhouse Row reference point.',
    origin: ORIGIN, generated: new Date().toISOString().slice(0, 10), generator: 'tools/geo/survey.mjs',
    confidence: { 'osm-node': 'OSM node position', 'osm-footprint-centroid': 'area centroid of the OSM footprint', gnis: 'USGS GNIS point', derived: 'computed by us from OSM/DEM', approx: 'best guess; verify', missing: 'not found' },
    license: 'OSM-derived points (c) OpenStreetMap contributors, ODbL 1.0; GNIS and 3DEP are public domain.',
  },
  anchors,
}, null, 1) + '\n');

// ------------------------------------------------------------------------------------------------- loop checks
// Waypoint specs: {j:[a,b], near:[lat,lon]} shared node of targets a and b (nearest to `near`);
//                 {on:target, near:[lat,lon]} nearest node on a target; {near:[lat,lon]} nearest node on any way the profile allows.
function resolveWp(wp, profile) {
  const P = PROFILES[profile];
  const [lat, lon] = wp.near || [ORIGIN.lat, ORIGIN.lon];
  if (wp.anchor) { const a = A[wp.anchor]; if (!a || a.lat == null) return null; return resolveWp({ ...wp, anchor: undefined, near: [a.lat, a.lon] }, profile); }
  if (wp.j) {
    const [a, b] = wp.j.map((k) => T[k]);
    const shared = [...a.nodeSet].filter((n) => b.nodeSet.has(n));
    if (!shared.length) return { missing: `no junction ${a.label} / ${b.label}` };
    shared.sort((m, n) => haversine(lon, lat, nodePos.get(m).lon, nodePos.get(m).lat) - haversine(lon, lat, nodePos.get(n).lon, nodePos.get(n).lat));
    return { node: shared[0], d: 0 };
  }
  if (wp.on && wp.extreme) { // furthest node of a target in a compass direction, inside the bbox
    const key = { south: (p) => p.lat, north: (p) => -p.lat, west: (p) => p.lon, east: (p) => -p.lon }[wp.extreme];
    let best = null; for (const n of T[wp.on].nodeSet) { const p = nodePos.get(n); if (!inBbox(p)) continue; if (best === null || key(p) < key(nodePos.get(best))) best = n; }
    return { node: best, d: 0 };
  }
  if (wp.on) return nearestNode(lon, lat, (w) => T[wp.on].wayIds.has(w.id) && P.ok(w));
  return nearestNode(lon, lat, P.ok);
}
// Each loop: profile, the target roads it is about (`names`), waypoints. Routing prefers the named roads (others cost 3x)
// and avoids re-driving earlier legs (8x), so a true loop is found when one exists; `only: true` forbids leaving the named roads.
const Y = { j: ['central', 'park'] }; // the Park/Whittington "Y" where Central Ave ends
const LOOPS = [
  { id: 'row-promenade', label: 'Central Ave (Bathhouse Row) + Grand Promenade (footways allowed)', profile: 'any', names: ['central', 'promenade', 'reserve', 'fountain'],
    via: [{ j: ['central', 'fountain'] }, { anchor: 'grand-promenade-north' }, { on: 'promenade', near: [34.5143, -93.0529] }, { anchor: 'grand-promenade-south' }, { j: ['central', 'reserve'] }, { on: 'central', near: [34.51373, -93.05375] }, { j: ['central', 'fountain'] }] },
  { id: 'park-only', label: 'Park Ave only: the Y → Gorge Road junction → back (oneway respected, Park Ave ways only)', profile: 'road1', names: ['park'], only: true,
    via: [Y, { j: ['park', 'gorge'] }, Y] },
  { id: 'park-gorge-grand', label: 'Park Ave → Gorge Road → East Grand Ave → Central Ave → the Y', profile: 'road1', names: ['park', 'gorge', 'central'],
    via: [Y, { j: ['park', 'gorge'] }, { on: 'gorge', extreme: 'south' }, { on: 'central', near: [34.5030, -93.0558] }, Y] },
  { id: 'park-northmtn', label: 'Park Ave north → North Mountain → Fountain St → Central → the Y (the trivia board loop)', profile: 'road1', names: ['park', 'northmtn', 'fountain', 'central', 'hsmtn', 'hsmtnLower'],
    via: [Y, { on: 'park', near: [34.5300, -93.0440] }, { on: 'northmtn', near: [34.5235, -93.0416] }, { on: 'fountain', near: [34.5188, -93.0489] }, { j: ['central', 'fountain'] }, Y] },
  { id: 'whittington', label: 'Whittington Ave: the Y → Black Snake Rd junction → back (oneway respected; the divided section uses each carriageway once)', profile: 'road1', names: ['whittington'], allowReuse: true,
    via: [Y, { j: ['whittington', 'blacksnake'] }, Y] },
  { id: 'bridge-malvern-exchange', label: 'Central/Bridge → Bridge St → Malvern Ave → … → Exchange St → Central (oneway respected)', profile: 'road1', names: ['central', 'exchange', 'bridge', 'malvern', 'reserve', 'prospect'],
    via: [{ j: ['central', 'bridge'] }, { j: ['bridge', 'malvern'] }, { on: 'malvern', near: [34.5070, -93.0505] }, { on: 'exchange', near: [34.5119, -93.0549] }, { j: ['central', 'bridge'] }] },
  { id: 'hsmtn-outer', label: 'Hot Springs Mountain scenic loop: Fountain St → lower drive → tower → North Mountain Dr → North Mountain Loop → Fountain St (oneway respected)', profile: 'road1', names: ['hsmtn', 'hsmtnLower', 'northmtn', 'fountain'],
    via: [{ on: 'fountain', near: [34.5188, -93.0489] }, { anchor: 'hot-springs-mountain-tower' }, { on: 'northmtn', near: [34.5235, -93.0416] }, { on: 'northmtn', near: [34.5249, -93.0439] }, { on: 'fountain', near: [34.5188, -93.0489] }] },
  { id: 'hsmtn-summit', label: 'Summit circuit: tower → North Mountain Dr → Hot Springs Mountain Drive (named) → picnic area → tower (oneway respected)', profile: 'road1', names: ['hsmtn', 'hsmtnLower', 'northmtn'],
    via: [{ anchor: 'hot-springs-mountain-tower' }, { on: 'northmtn', near: [34.5195, -93.0429] }, { on: 'hsmtn', near: [34.5190, -93.0455] }, { anchor: 'hot-springs-mountain-tower' }] },
  { id: 'goatrock-gulpha-road', label: 'Goat Rock overlook → Gulpha Gorge Campground by road (oneway respected)', profile: 'road1', names: ['northmtn', 'gorge', 'park'],
    via: [{ anchor: 'goat-rock-overlook' }, { anchor: 'gulpha-gorge-campground' }] },
  { id: 'goatrock-gulpha-any', label: 'Goat Rock overlook → Gulpha Gorge Campground on any way (trails allowed)', profile: 'any', names: ['northmtn', 'gorge'],
    via: [{ anchor: 'goat-rock-overlook' }, { anchor: 'gulpha-gorge-campground' }] },
  { id: 'westmtn-loop', label: 'West Mountain Drive loop: Prospect entrance → Whittington entrance → Whittington Ave → the Y → Central → Prospect Ave (oneway respected)', profile: 'road1', names: ['westmtn', 'prospect', 'whittington', 'central'],
    via: [{ j: ['westmtn', 'prospect'] }, { j: ['westmtn', 'whittington'] }, Y, { j: ['central', 'prospect'] }, { j: ['westmtn', 'prospect'] }] },
  { id: 'westmtn-summit', label: 'West Mountain Summit Loop spur: Prospect entrance → Summit Loop overlook → Whittington entrance', profile: 'road1', names: ['westmtn', 'westsummit'],
    via: [{ j: ['westmtn', 'prospect'] }, { anchor: 'westmtn-loop-overlook' }, { j: ['westmtn', 'whittington'] }] },
  { id: 'westside-loop', label: 'Whittington Ave → Black Snake Rd → Cedar Glades Rd → back east to the Y (oneway respected)', profile: 'road1', names: ['whittington', 'blacksnake', 'cedarglades', 'park', 'central'],
    via: [Y, { j: ['whittington', 'blacksnake'] }, { on: 'cedarglades', near: [34.5290, -93.0941] }, { on: 'cedarglades', near: [34.5262, -93.0700] }, Y] },
  { id: 'music-link', label: 'Black Snake Rd ↔ Music Mountain Rd round trip (no reuse if possible)', profile: 'road1', names: ['blacksnake', 'music'],
    via: [{ j: ['whittington', 'blacksnake'] }, { on: 'music', near: [34.5040, -93.1145] }, { j: ['whittington', 'blacksnake'] }] },
];
const loopResults = [];
for (const L of LOOPS) {
  const res = { id: L.id, label: L.label, profile: L.profile, legs: [], ok: true };
  const wps = L.via.map((w) => resolveWp(w, L.profile));
  const allSteps = [], used = new Map();
  const namedSet = new Set(L.names.flatMap((n) => [...T[n].wayIds]));
  for (let i = 0; i + 1 < wps.length; i++) {
    const a = wps[i], b = wps[i + 1];
    if (!a || !b || a.missing || b.missing) { res.ok = false; res.legs.push({ error: (a && a.missing) || (b && b.missing) || 'unresolved waypoint' }); continue; }
    const r = route(a.node, b.node, L.profile, L.only ? { only: namedSet } : { prefer: namedSet, used: L.allowReuse ? null : used });
    for (const st of r.steps) used.set(st.k, (used.get(st.k) || 0) + 1);
    if (!r.ok) { res.ok = false; res.legs.push({ error: `no ${L.profile} route`, from: nodePos.get(a.node), to: nodePos.get(b.node) }); continue; }
    const s = summarizeSteps(r.steps);
    res.legs.push({ len: s.len, seq: seqText(s.seq), against: s.against, stepsM: s.stepsM, privateM: s.privateM, snap: [a.d, b.d] });
    allSteps.push(...r.steps);
  }
  const s = summarizeSteps(allSteps);
  let reuse = 0; for (const [k, c] of used) if (c > 1) reuse += edges[k].len * (c - 1);
  let onNamed = 0; for (const st of allSteps) if (namedSet.has(edges[st.k].w.id)) onNamed += edges[st.k].len;
  const prof = allSteps.length ? profileOf(stepsGeom(allSteps), 5, 25) : null;
  Object.assign(res, { only: !!L.only, len: s.len, reuse, onNamed, byClass: s.byClass, against: s.against, stepsM: s.stepsM, privateM: s.privateM,
    elev: prof && { min: prof.min, max: prof.max, ascent: prof.ascent, maxGrade: prof.maxGrade }, wayIds: [...new Set(allSteps.map((st) => edges[st.k].w.id))] });
  loopResults.push(res);
}

// Link checks: is there a way from A to B without using the excluded roads? (multi-source shortest path)
// from/to: {t: target} = any node of a target; {t, extreme}; {anchor}; {near:[lat,lon]}.
const LINKS = [
  { id: 'behind-row-road', label: 'Behind the Row by road: lower Hot Springs Mtn Dr (south end, behind the Maurice) → Reserve St, not using Central Ave', profile: 'road',
    from: { t: 'hsmtnLower', extreme: 'south' }, to: { t: 'reserve' }, exclude: ['central'] },
  { id: 'behind-row-any', label: 'Same, any way (footways/steps allowed)', profile: 'any', from: { t: 'hsmtnLower', extreme: 'south' }, to: { t: 'reserve' }, exclude: ['central'] },
  { id: 'promenade-south', label: 'Grand Promenade south end → Reserve St (any way)', profile: 'any', from: { anchor: 'grand-promenade-south' }, to: { t: 'reserve' } },
  { id: 'promenade-north', label: 'Grand Promenade north end → Fountain St (any way)', profile: 'any', from: { anchor: 'grand-promenade-north' }, to: { t: 'fountain' } },
  { id: 'park-northmtn', label: 'Park Ave → North Mountain Dr/Loop by road without Fountain St, the lower drive or Central Ave', profile: 'road', from: { t: 'park' }, to: { t: 'northmtn' }, exclude: ['fountain', 'hsmtnLower', 'central'] },
  { id: 'gorge-northmtn', label: 'Gorge Road / Gulpha Gorge → North Mountain Dr/Loop by road without Fountain St / the lower drive', profile: 'road', from: { t: 'gorge' }, to: { t: 'northmtn' }, exclude: ['fountain', 'hsmtnLower'] },
  { id: 'goatrock-to-road', label: 'Goat Rock overlook → nearest drivable road node', profile: 'any', from: { anchor: 'goat-rock-overlook' }, to: { motor: true } },
  { id: 'campground-to-gorge', label: 'Gulpha Gorge Campground → Gorge Road', profile: 'road', from: { anchor: 'gulpha-gorge-campground' }, to: { t: 'gorge' } },
  { id: 'westsummit-whittington', label: 'West Mountain Summit Loop → Whittington Ave without the Whittington leg of West Mountain Dr (way 12808467)', profile: 'road', from: { t: 'westsummit' }, to: { t: 'whittington' }, excludeWays: [12808467] },
  { id: 'blacksnake-cedarglades', label: 'Black Snake Rd → Cedar Glades Rd by road', profile: 'road', from: { t: 'blacksnake' }, to: { t: 'cedarglades' } },
  { id: 'blacksnake-music', label: 'Black Snake Rd → Music Mountain Rd by road', profile: 'road', from: { t: 'blacksnake' }, to: { t: 'music' } },
  { id: 'cedarglades-music', label: 'Cedar Glades Rd → Music Mountain Rd by road', profile: 'road', from: { t: 'cedarglades' }, to: { t: 'music' } },
  { id: 'music-westsummit', label: 'Music Mountain Rd → West Mountain Summit Drive by road', profile: 'road', from: { t: 'music' }, to: { t: 'westsummit' } },
  { id: 'music-summit-road', label: 'Music Mountain summit → nearest drivable road node', profile: 'any', from: { anchor: 'music-mountain-summit' }, to: { motor: true } },
];
function linkNodes(spec, profile) {
  if (spec.anchor) { const a = A[spec.anchor]; if (!a || a.lat == null) return []; const n = nearestNode(a.lon, a.lat, PROFILES[profile].ok); return n.node ? [n.node] : []; }
  if (spec.t && spec.extreme) { const r = resolveWp({ on: spec.t, extreme: spec.extreme }, profile); return r && r.node ? [r.node] : []; }
  if (spec.t) return [...T[spec.t].nodeSet];
  if (spec.near) return [nearestNode(spec.near[1], spec.near[0], PROFILES[profile].ok).node];
  return [];
}
const linkResults = LINKS.map((L) => {
  const exclude = new Set([...(L.exclude || []).flatMap((t) => [...T[t].wayIds]), ...(L.excludeWays || [])]);
  const src = linkNodes(L.from, L.profile);
  const goal = L.to.motor ? null : new Set(linkNodes(L.to, L.profile));
  const isGoal = L.to.motor ? (u) => [...nodeWays.get(u)].some((wid) => wayById.get(wid).motor) : (u) => goal.has(u);
  const res = dijkstra(src, L.profile, isGoal, 20000, { exclude: exclude.size ? exclude : null });
  if (!res.end) return { id: L.id, label: L.label, ok: false };
  const steps = tracePath(res, res.end), s = summarizeSteps(steps), end = nodePos.get(res.end);
  const prof = steps.length ? profileOf(stepsGeom(steps), 5, 25) : null;
  return { id: L.id, label: L.label, ok: true, len: s.len, seq: seqText(s.seq, 5), byClass: s.byClass, stepsM: s.stepsM, against: s.against, end: [end.lat, end.lon], maxGrade: prof ? prof.maxGrade : 0 };
});

// isolated pieces of the road network (components) touching target roads
const roadComps = components(ways.filter((w) => w.motor));
const mainComp = new Set(roadComps[0].map((w) => w.id));
const islands = roadComps.slice(1).filter((c) => c.some((w) => TARGETS.some((t) => t.wayIds.has(w.id))))
  .map((c) => ({ ways: c.map((w) => w.id), names: [...new Set(c.map(wayLabel))], length: c.reduce((a, w) => a + w.len, 0) }));

// named ways containing Mountain / Gorge / Promenade
const namedList = {};
for (const w of ways) for (const n of new Set(w.names)) {
  if (!/Mountain|Gorge|Promenade/i.test(n)) continue;
  const e = namedList[n] = namedList[n] || { ways: [], len: 0, cls: {}, oneway: {}, surface: {} };
  e.ways.push(w.id); e.len += w.len; e.cls[w.tags.highway] = (e.cls[w.tags.highway] || 0) + 1;
  e.oneway[w.tags.oneway || '–'] = (e.oneway[w.tags.oneway || '–'] || 0) + 1; e.surface[w.tags.surface || '–'] = (e.surface[w.tags.surface || '–'] || 0) + 1;
  e.geoms = (e.geoms || []).concat([w.geom]);
}
for (const e of Object.values(namedList)) {
  let mn = Infinity, mx = -Infinity; for (const g of e.geoms) { const p = profileOf(g, 10); mn = Math.min(mn, p.min); mx = Math.max(mx, p.max); }
  e.elevMin = mn; e.elevMax = mx; delete e.geoms;
}

// culverts
const culverts = [...waterWays, ...ways].filter((w) => w.tags.tunnel === 'culvert').map((w) => {
  let len = 0; for (let i = 1; i < w.geom.length; i++) len += haversine(w.geom[i - 1].lon, w.geom[i - 1].lat, w.geom[i].lon, w.geom[i].lat);
  return { id: w.id, name: w.tags.name || '', waterway: w.tags.waterway || '', len, from: w.geom[0], to: w.geom[w.geom.length - 1], tags: w.tags };
}).sort((a, b) => b.len - a.len);
const hsCulvert = culverts.filter((c) => /Hot Springs Creek/i.test(c.name));

// POIs and their nearest road (handy for loop planning)
const POI_KIND = (t) => t.amenity === 'fountain' ? 'fountain' : t.natural === 'spring' ? 'spring' : t.tourism === 'viewpoint' ? 'viewpoint' : t.man_made === 'tower' ? 'tower'
  : t.natural === 'peak' ? 'peak' : t.tourism === 'camp_site' ? 'campground' : /^(rock|stone|cliff)$/.test(t.natural || '') ? 'rock' : t.amenity === 'shelter' ? 'shelter' : t.tourism === 'attraction' ? 'attraction' : null;
const pois = poisJ.elements.filter((e) => e.tags && POI_KIND(e.tags)).map((e) => {
  const c = centroidOf(e); const kind = POI_KIND(e.tags);
  const nr = nearestWay(c.lon, c.lat, (w) => w.motor);
  return { type: e.type, id: e.id, kind, name: e.tags.name || '', ...c, elev: dem.sample(c.lon, c.lat), road: nr.way ? wayLabel(nr.way) : '', roadD: nr.d };
}).sort((a, b) => a.kind.localeCompare(b.kind) || a.lat - b.lat);

// ------------------------------------------------------------------------------------------------- write road-survey.md / .json
const md = [];
const osmBase = manifest['osm-roads.json'] && manifest['osm-roads.json'].osmBase;
md.push('# Road survey: Hot Springs race roads (OSM + USGS 3DEP)', '');
md.push(`Generated by \`tools/geo/survey.mjs\` on ${new Date().toISOString().slice(0, 10)} from \`art-src/geo/raw/osm-roads.json\` (Overpass, OSM data as of ${osmBase || '?'}) and the DEM tiles listed in \`research/geo/SOURCES.md\`. `
  + 'OSM data © OpenStreetMap contributors, ODbL 1.0. Elevations are USGS 3DEP bare-earth (public domain), sampled bilinearly every 5 m along each way from the finest tile that covers it.', '');
md.push('**How to read it.** *Length* is the sum of the OSM way lengths (a dual carriageway counts twice). *Spacing* is the distance between consecutive OSM vertices: '
  + 'small mean/max means the curve is well sampled; a large max means a long straight chord (or a coarse TIGER import) that needs smoothing or extra control points before it becomes a race spline. '
  + '*Max grade* is over a 25 m baseline from the DEM, bridges and tunnels excluded (the DEM is bare earth, so a bridge reads as a dip). *Components* counts pieces of the road that do not share an OSM node; *cycles* is the cyclomatic number of the road\'s own ways (>0 means the road alone contains a loop).', '');
md.push(`**Map origin** for x/z: lon ${ORIGIN.lon}, lat ${ORIGIN.lat} (Bathhouse Row reference point); x east, z south (metres).`, '');

md.push('## Summary', '');
if (WARN.length) md.push('**Warnings:** ' + WARN.join('; '), '');
md.push(`Lengths, spacing and elevations are clipped to the survey bbox (${BBOX.south},${BBOX.west} – ${BBOX.north},${BBOX.east}); “full” is the whole OSM ways, which Overpass returns uncut.`, '');
md.push('| Road | OSM ways | Length m in bbox (full) | Vertex spacing mean / p90 / max m | highway | oneway | lanes | surface | Elev min–max m (ft) | Grade p95 / max | Components / cycles | Joins (targets) |');
md.push('|---|---|---|---|---|---|---|---|---|---|---|---|');
for (const t of TARGETS) {
  const s = survey[t.id];
  if (s.missing) { md.push(`| ${t.label} | **not in OSM** | | | | | | | | | | |`); continue; }
  const joins = Object.values(s.joins).map((j) => j.label.replace(/ \(.*\)/, '') + (j.sharesWays ? ' (same ways)' : '')).join('; ');
  md.push(`| ${t.label} | ${s.ways} | ${fmtM(s.length)}${Math.abs(s.lengthFull - s.length) > 5 ? ` (${fmtM(s.lengthFull)})` : ''} | ${r1(s.spacingMean)} / ${r1(s.spacingP90)} / ${r1(s.spacingMax)} | ${s.tag_highway} | ${s.tag_oneway} | ${s.tag_lanes} | ${s.tag_surface} | ${r0(s.elevMin)}–${r0(s.elevMax)} (${r0(ft(s.elevMin))}–${r0(ft(s.elevMax))}) | ${(s.p95Grade * 100).toFixed(1)}% / ${(s.maxGrade * 100).toFixed(1)}% | ${s.components} / ${s.cyclomatic} | ${joins || '—'} |`);
}
md.push('', 'Grades come from a 2 m bare-earth DEM sampled on OSM/TIGER centrelines; a centreline a few metres off the real road cut reads the bank beside it, so treat isolated max grades above ~15% with suspicion and prefer p95.', '');

md.push('## Connectivity matrix', '');
md.push('Shortest **road** distance (m) between the nearest nodes of two roads (oneway ignored; the Grand Promenade row uses any way). **J** = they share a junction node. Searches stop at 6 km (—).', '');
const ids = TARGETS.filter((t) => t.ways.length).map((t) => t.id);
const short = { central: 'Cen', park: 'Park', whittington: 'Whit', fountain: 'Fnt', reserve: 'Res', bridge: 'Brg', malvern: 'Malv', exchange: 'Exch', prospect: 'Pros', ouachita: 'Oua', hsmtn: 'HSMD', hsmtnLower: 'HSlo', northmtn: 'NMtn', westmtn: 'WMD', westsummit: 'WMSD', music: 'Mus', blacksnake: 'BSn', cedarglades: 'CGl', gorge: 'Gorge', promenade: 'Prom' };
md.push('| from \\ to | ' + ids.map((i) => short[i]).join(' | ') + ' |');
md.push('|---|' + ids.map(() => '---').join('|') + '|');
for (const a of ids) md.push(`| **${short[a]}** ${T[a].label} | ` + ids.map((b) => (a === b ? '·' : !matrix[a][b] ? '' : matrix[a][b].d === 0 ? 'J' : matrix[a][b].d < 6000 ? fmtM(matrix[a][b].d) : '—')).join(' | ') + ' |');
md.push('');

md.push('## Loop checks', '');
md.push('Each check routes through waypoints on the OSM graph (shortest path per leg) and reports whether a closed loop exists. *Reuse* is distance driven twice (an out-and-back shows up as reuse ≈ half the length). '
  + '*On named roads* is the share of the route on the roads the loop is about. *Against oneway* is only non-zero for profiles that ignore oneway.', '');
for (const L of loopResults) {
  md.push(`### ${L.label}`, '');
  md.push(`Profile: ${PROFILES[L.profile].label}${L.only ? '; restricted to the named roads' : ''}. ${L.ok ? '' : '**Some legs failed.** '}Total ${fmtM(L.len)} m; reuse ${fmtM(L.reuse)} m; on named roads ${fmtM(L.onNamed)} m (${L.len ? r0((100 * L.onNamed) / L.len) : 0}%); against oneway ${fmtM(L.against)} m; steps ${fmtM(L.stepsM)} m; private ${fmtM(L.privateM)} m.`
    + (L.elev ? ` Elevation ${r0(L.elev.min)}–${r0(L.elev.max)} m, ascent ${r0(L.elev.ascent)} m, max grade ${(L.elev.maxGrade * 100).toFixed(1)}%.` : ''), '');
  L.legs.forEach((g, i) => md.push(g.error ? `${i + 1}. **${g.error}**` : `${i + 1}. ${fmtM(g.len)} m: ${g.seq}${g.against ? ` (against oneway ${fmtM(g.against)} m)` : ''}${g.stepsM ? ` (steps ${fmtM(g.stepsM)} m)` : ''}${Math.max(...g.snap) > 25 ? ` (waypoint snapped ${r0(Math.max(...g.snap))} m)` : ''}`));
  md.push('', 'Classes: ' + Object.entries(L.byClass).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${fmtM(v)} m`).join(', '), '');
}
md.push('## Link checks', '');
md.push('Shortest connection from A to B with some roads excluded (answers “is there another way in?”). 0 m = they touch.', '');
md.push('| Check | Result | Route | Max grade |', '|---|---|---|---|');
for (const L of linkResults) md.push(L.ok ? `| ${L.label} | ${fmtM(L.len)} m${L.stepsM ? ` (steps ${fmtM(L.stepsM)} m)` : ''} | ${L.seq} | ${(L.maxGrade * 100).toFixed(0)}% |` : `| ${L.label} | **no connection** (within 20 km) | | |`);
md.push('');
if (islands.length) {
  md.push('### Disconnected pieces of the road network that carry target roads', '');
  for (const c of islands) md.push(`- ${c.names.join(', ')}: ${fmtM(c.length)} m, ways ${c.ways.join(', ')} — not connected to the main road network in OSM.`);
  md.push('');
}

md.push('## Per-road detail', '');
for (const t of TARGETS) {
  const s = survey[t.id];
  md.push(`### ${t.label}`, '');
  if (s.missing) { md.push(`No OSM way matches \`${t.re}\` in the bbox.`, ''); continue; }
  md.push(`- OSM names matched: ${s.names.map((n) => '“' + n + '”').join(', ')}${t.id === 'westsummit' ? ' (matched on `name_1`)' : ''}`);
  md.push(`- ${s.ways} ways, ${fmtM(s.length)} m in the bbox (${fmtM(s.lengthFull)} m whole ways), ${s.vertices} vertices; spacing mean ${r1(s.spacingMean)} m, p90 ${r1(s.spacingP90)} m, max ${r1(s.spacingMax)} m`);
  md.push(`- Tags: highway ${s.tag_highway}; oneway ${s.tag_oneway}; lanes ${s.tag_lanes}; surface ${s.tag_surface}; maxspeed ${s.tag_maxspeed}; bridge ${s.tag_bridge}; access ${s.tag_access}`);
  md.push(`- Elevation ${r1(s.elevMin)}–${r1(s.elevMax)} m (${r0(ft(s.elevMin))}–${r0(ft(s.elevMax))} ft), relief ${r0(s.elevMax - s.elevMin)} m; 25 m grade p95 ${(s.p95Grade * 100).toFixed(1)}%, max ${(s.maxGrade * 100).toFixed(1)}% (way ${s.maxGradeWay}); DEM samples per tile: ${Object.entries(s.demTiles).map(([k, v]) => `${k} ${v}`).join(', ')}`);
  md.push(`- Internal connectivity: ${s.components} component(s), cyclomatic ${s.cyclomatic}` + (s.gaps.length ? '; gaps:' : ''));
  for (const g of s.gaps) md.push(`  - piece ${g.toComponent + 1} (${s.componentInfo[g.toComponent].ways.join(', ')}, ${fmtM(s.componentInfo[g.toComponent].length)} m): nearest ${fmtM(g.straight)} m straight from ${ll(...g.at)}; by road ${g.viaRoad === null ? 'no route' : fmtM(g.viaRoad) + ' m (' + g.viaRoadSeq + ')'}`);
  if (s.deadEnds.length) md.push(`- Dead ends / isolated: ${s.deadEnds.map((d) => `${d.isolatedRing ? '**isolated closed ring** ' : ''}way ${d.way} at ${ll(...d.at)}`).join('; ')}`);
  const joins = Object.entries(s.joins);
  md.push(`- Joins target roads: ${joins.length ? joins.map(([, j]) => `${j.label}${j.sharesWays ? ' (shares ways)' : ''} at ${j.at.map((p) => ll(...p)).join(' / ')}${j.nodes > 3 ? ` (+${j.nodes - 3})` : ''}`).join('; ') : 'none'}`);
  md.push(`- Other named streets touching it: ${s.otherStreets.length ? s.otherStreets.join(', ') : 'none'}`);
  md.push(`- OSM ways: ${s.wayIds.map((id) => `[${id}](${osmUrl('way', id)})`).join(', ')}`, '');
}

md.push('## Every named way containing “Mountain”, “Gorge” or “Promenade”', '');
md.push('| Name | highway (ways) | Length m | oneway | surface | Elev m | OSM ways |', '|---|---|---|---|---|---|---|');
for (const [n, e] of Object.entries(namedList).sort((a, b) => a[0].localeCompare(b[0]))) {
  const tf = (o) => Object.entries(o).map(([k, v]) => `${k}×${v}`).join(', ');
  md.push(`| ${n} | ${tf(e.cls)} | ${fmtM(e.len)} | ${tf(e.oneway)} | ${tf(e.surface)} | ${r0(e.elevMin)}–${r0(e.elevMax)} | ${e.ways.join(', ')} |`);
}
md.push('');

md.push('## Hot Springs Creek culvert (tunnel=culvert)', '');
if (hsCulvert.length) {
  const tot = hsCulvert.reduce((a, c) => a + c.len, 0);
  const main = hsCulvert[0];
  md.push(`Hot Springs Creek culvert ways: ${hsCulvert.length}, total ${fmtM(tot)} m (${fmtM(ft(tot))} ft). The main one, [way ${main.id}](${osmUrl('way', main.id)}), is ${fmtM(main.len)} m (${fmtM(ft(main.len))} ft) from ${ll(main.from.lat, main.from.lon)} under Park Ave to the outfall at ${ll(main.to.lat, main.to.lon)}, where the creek daylights; `
    + 'research/bathhouse-row-layout.md §6 gives 6,118 ft for the same way and places it under the Y and the east edge of Central Ave. The shorter named pieces are separate upstream culverts under Park Ave. For the game it is set dressing only (a buried creek line, grates, the outfall).', '');
}
md.push('| OSM way | name | waterway | length m | from (lat, lon) | to (lat, lon) |', '|---|---|---|---|---|---|');
for (const c of culverts) md.push(`| [${c.id}](${osmUrl('way', c.id)}) | ${c.name || '–'} | ${c.waterway || '–'} | ${fmtM(c.len)} | ${ll(c.from.lat, c.from.lon)} | ${ll(c.to.lat, c.to.lon)} |`);
md.push('');

md.push('## POIs (fountain, spring, viewpoint, tower, peak, campground, rock, shelter, attraction) and the nearest road', '');
md.push('| Kind | Name | OSM | lat, lon | Elev m | Nearest motor road (m) |', '|---|---|---|---|---|---|');
for (const p of pois) md.push(`| ${p.kind} | ${p.name || '(unnamed)'} | [${p.type}/${p.id}](${osmUrl(p.type, p.id)}) | ${ll(p.lat, p.lon)} | ${r0(p.elev)} | ${p.road} (${r0(p.roadD)}) |`);
md.push('');

md.push('## Anchors', '');
md.push('Full records in `research/geo/anchors.json`.', '');
md.push('| id | lat, lon | Elev m (ft) | x, z m | Confidence | Cross-check | Nearest road |', '|---|---|---|---|---|---|---|');
for (const a of anchors) md.push(a.lat == null ? `| ${a.id} | **missing** | | | ${a.confidence} | | |` : `| ${a.id} | ${ll(a.lat, a.lon)} | ${a.elevM} (${a.elevFt}) | ${a.x}, ${a.z} | ${a.confidence} | ${a.crossCheck || ''} | ${a.nearestRoad || ''} |`);
md.push('');
fs.writeFileSync(path.join(OUT_RESEARCH, 'road-survey.md'), md.join('\n'));
fs.writeFileSync(path.join(OUT_RESEARCH, 'road-survey.json'), JSON.stringify({ generated: new Date().toISOString(), osmBase, origin: ORIGIN, roads: survey, matrix, loops: loopResults, links: linkResults, islands, culverts: culverts.map(({ tags, ...c }) => c) }, (k, v) => (typeof v === 'number' ? +v.toFixed(6) : v), 1) + '\n');

// ------------------------------------------------------------------------------------------------- SVG previews
const AREAS = [
  { id: 'downtown', title: 'Downtown: Bathhouse Row, Central / Park / Whittington, Bridge–Malvern–Exchange, Grand Promenade', west: -93.068, east: -93.040, south: 34.500, north: 34.527, mpp: 1.2, grid: 250, cstep: 5, scale: 500 },
  { id: 'hsmtn-east', title: 'Hot Springs Mountain, North Mountain, Goat Rock, Gulpha Gorge', west: -93.058, east: -92.985, south: 34.503, north: 34.548, mpp: 2.8, grid: 500, cstep: 10, scale: 1000 },
  { id: 'westmtn', title: 'West Mountain, Sugarloaf, Music Mountain, Black Snake and Cedar Glades roads', west: -93.135, east: -93.050, south: 34.488, north: 34.546, mpp: 3.2, grid: 500, cstep: 12, scale: 1000 },
];
const STYLE = {
  motorway: ['#b03a2e', 7], trunk: ['#c0392b', 6.5], primary: ['#e67e22', 6], secondary: ['#d4a017', 5.5], tertiary: ['#8a9a2b', 5], unclassified: ['#6e6e6e', 4],
  residential: ['#6e6e6e', 3.6], living_street: ['#6e6e6e', 3.2], road: ['#6e6e6e', 3.2], service: ['#9a9a9a', 2.2], track: ['#8b5a2b', 2.4], raceway: ['#d35400', 3],
  pedestrian: ['#a0522d', 2.6], footway: ['#a0522d', 1.6], path: ['#a0522d', 1.6], steps: ['#c0392b', 2.6], cycleway: ['#2e86c1', 1.8], bridleway: ['#a0522d', 1.6],
};
const DASH = { track: [6, 3], footway: [4, 3], path: [4, 3], pedestrian: [7, 3], steps: [1.5, 1.5], cycleway: [5, 3], bridleway: [4, 3] };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function simplify(pts, tol) { // Douglas-Peucker on [x,z]
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [i, j] = stack.pop(); let md2 = 0, mk = -1;
    const [ax, az] = pts[i], [bx, bz] = pts[j], dx = bx - ax, dz = bz - az, L2 = dx * dx + dz * dz;
    for (let k = i + 1; k < j; k++) {
      const [px, pz] = pts[k]; let t = L2 ? ((px - ax) * dx + (pz - az) * dz) / L2 : 0; t = Math.max(0, Math.min(1, t));
      const d2 = (ax + t * dx - px) ** 2 + (az + t * dz - pz) ** 2; if (d2 > md2) { md2 = d2; mk = k; }
    }
    if (md2 > tol * tol) { keep[mk] = 1; stack.push([i, mk], [mk, j]); }
  }
  return pts.filter((_, k) => keep[k]);
}
function contourLines(grid, nx, nz, x0, z0, step, level) {
  const pt = new Map(), segs = [];
  const key = (kind, i, j) => kind + i + '_' + j;
  const cross = (k, ax, az, va, bx, bz, vb) => { if (!pt.has(k)) { const t = (level - va) / (vb - va); pt.set(k, [ax + t * (bx - ax), az + t * (bz - az)]); } return k; };
  for (let j = 0; j < nz - 1; j++) for (let i = 0; i < nx - 1; i++) {
    const v0 = grid[j * nx + i], v1 = grid[j * nx + i + 1], v2 = grid[(j + 1) * nx + i + 1], v3 = grid[(j + 1) * nx + i];
    if (!(Number.isFinite(v0) && Number.isFinite(v1) && Number.isFinite(v2) && Number.isFinite(v3))) continue;
    const b0 = v0 >= level, b1 = v1 >= level, b2 = v2 >= level, b3 = v3 >= level;
    if (b0 === b1 && b1 === b2 && b2 === b3) continue;
    const X = x0 + i * step, Z = z0 + j * step, S = step;
    const c = [];
    if (b0 !== b1) c.push(['t', cross(key('h', i, j), X, Z, v0, X + S, Z, v1)]);
    if (b1 !== b2) c.push(['r', cross(key('v', i + 1, j), X + S, Z, v1, X + S, Z + S, v2)]);
    if (b2 !== b3) c.push(['b', cross(key('h', i, j + 1), X, Z + S, v3, X + S, Z + S, v2)]);
    if (b0 !== b3) c.push(['l', cross(key('v', i, j), X, Z, v0, X, Z + S, v3)]);
    if (c.length === 2) segs.push([c[0][1], c[1][1]]);
    else if (c.length === 4) {
      const [t, r, b, l] = c.map((q) => q[1]); const centre = (v0 + v1 + v2 + v3) / 4 >= level;
      if (b0) { if (centre) segs.push([t, r], [b, l]); else segs.push([t, l], [r, b]); }
      else { if (centre) segs.push([t, l], [r, b]); else segs.push([t, r], [b, l]); }
    }
  }
  const byKey = new Map();
  segs.forEach((s, i) => { for (const k of s) { if (!byKey.has(k)) byKey.set(k, []); byKey.get(k).push(i); } });
  const used = new Uint8Array(segs.length), lines = [];
  for (let i = 0; i < segs.length; i++) {
    if (used[i]) continue; used[i] = 1;
    const line = [segs[i][0], segs[i][1]];
    for (const dir of [1, -1]) {
      for (;;) {
        const endK = dir === 1 ? line[line.length - 1] : line[0];
        const nxt = (byKey.get(endK) || []).find((s) => !used[s]);
        if (nxt === undefined) break;
        used[nxt] = 1; const s = segs[nxt], other = s[0] === endK ? s[1] : s[0];
        if (dir === 1) line.push(other); else line.unshift(other);
      }
    }
    lines.push(line.map((k) => pt.get(k)));
  }
  return lines;
}

function buildSvg(area) {
  const p0 = project(area.west, area.north), p1 = project(area.east, area.south);
  const X0 = p0.x, Z0 = p0.z, Wm = p1.x - p0.x, Hm = p1.z - p0.z, u = area.mpp; // u = metres per output pixel
  const Wpx = Math.round(Wm / u), Hpx = Math.round(Hm / u);
  const inArea = (lon, lat, pad = 0.002) => lon > area.west - pad && lon < area.east + pad && lat > area.south - pad && lat < area.north + pad;
  const P = (p) => { const q = project(p.lon, p.lat); return [q.x, q.z]; };
  const f = (v) => r1(v);
  const pathD = (pts) => 'M' + pts.map(([x, z]) => f(x) + ' ' + f(z)).join('L');
  const out = [];
  out.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${Wpx}" height="${Hpx}" viewBox="${f(X0)} ${f(Z0)} ${f(Wm)} ${f(Hm)}" font-family="Segoe UI, Helvetica, Arial, sans-serif">`);
  out.push(`<title>${esc(area.title)}</title>`);
  out.push(`<desc>Tub Rally road preview (${area.id}). Coordinates are metres, x east and y (= z) south of lon ${ORIGIN.lon}, lat ${ORIGIN.lat}. OSM data (c) OpenStreetMap contributors, ODbL 1.0; elevation USGS 3DEP. Generated by tools/geo/survey.mjs.</desc>`);
  out.push(`<style>.h{paint-order:stroke;stroke:#fff;stroke-linejoin:round}.c{fill:none;stroke-linecap:round;stroke-linejoin:round}</style>`);
  out.push(`<rect x="${f(X0)}" y="${f(Z0)}" width="${f(Wm)}" height="${f(Hm)}" fill="#f7f4ec"/>`);

  // contours
  const g = area.cstep, nx = Math.floor(Wm / g) + 1, nz = Math.floor(Hm / g) + 1, grid = new Float32Array(nx * nz);
  let zmin = Infinity, zmax = -Infinity;
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
    const q = unproject(X0 + i * g, Z0 + j * g), z = dem.sample(q.lon, q.lat); grid[j * nx + i] = z;
    if (Number.isFinite(z)) { zmin = Math.min(zmin, z); zmax = Math.max(zmax, z); }
  }
  const minor = [], major = [], clabels = [];
  for (let L = Math.ceil(zmin / 10) * 10; L <= zmax; L += 10) {
    const lines = contourLines(grid, nx, nz, X0, Z0, g, L).map((l) => simplify(l, 0.7 * u)).filter((l) => l.length > 1);
    const isMajor = L % 50 === 0;
    for (const l of lines) {
      (isMajor ? major : minor).push(pathD(l));
      if (isMajor && l.length > 6) {
        let len = 0; for (let k = 1; k < l.length; k++) len += Math.hypot(l[k][0] - l[k - 1][0], l[k][1] - l[k - 1][1]);
        if (len > 500 * u) { const m = l[Math.floor(l.length / 2)], n2 = l[Math.min(l.length - 1, Math.floor(l.length / 2) + 1)]; let ang = (Math.atan2(n2[1] - m[1], n2[0] - m[0]) * 180) / Math.PI; if (ang > 90) ang -= 180; if (ang < -90) ang += 180; clabels.push(`<text class="h" x="${f(m[0])}" y="${f(m[1])}" transform="rotate(${ang.toFixed(0)} ${f(m[0])} ${f(m[1])})" font-size="${f(9 * u)}" fill="#9a7f55" stroke-width="${f(2.5 * u)}" text-anchor="middle" dominant-baseline="middle">${L} m</text>`); }
      }
    }
  }
  out.push(`<g id="contours"><path class="c" stroke="#d9cdb4" stroke-width="${f(0.7 * u)}" d="${minor.join('')}"/><path class="c" stroke="#b9a37c" stroke-width="${f(1.3 * u)}" d="${major.join('')}"/>${clabels.join('')}</g>`);

  // metric grid
  const gl = [], gt = [];
  for (let x = Math.ceil(X0 / area.grid) * area.grid; x < X0 + Wm; x += area.grid) { gl.push(`M${f(x)} ${f(Z0)}V${f(Z0 + Hm)}`); gt.push(`<text x="${f(x + 3 * u)}" y="${f(Z0 + 11 * u)}" font-size="${f(9 * u)}" fill="#8aa">x ${x >= 0 ? '+' : ''}${x}</text>`); }
  for (let z = Math.ceil(Z0 / area.grid) * area.grid; z < Z0 + Hm; z += area.grid) { gl.push(`M${f(X0)} ${f(z)}H${f(X0 + Wm)}`); gt.push(`<text x="${f(X0 + 3 * u)}" y="${f(z - 3 * u)}" font-size="${f(9 * u)}" fill="#8aa">z ${z >= 0 ? '+' : ''}${z}</text>`); }
  out.push(`<g id="grid"><path d="${gl.join('')}" stroke="#bfd6d6" stroke-width="${f(0.6 * u)}" fill="none"/>${gt.join('')}</g>`);

  // buildings (downtown file only covers downtown)
  const bl = [], bh = [];
  for (const e of bldJ.elements) {
    if (e.type !== 'way' || !e.geometry || !e.tags || !e.tags.building) continue;
    const pts = e.geometry.filter(Boolean); if (!inArea(pts[0].lon, pts[0].lat, 0)) continue;
    const d = pathD(pts.map(P)) + 'Z';
    (/Bathhouse|Hotel Hale|Quapaw Baths|Fordyce|Superior/i.test(e.tags.name || '') ? bh : bl).push(d);
  }
  out.push(`<g id="buildings"><path d="${bl.join('')}" fill="#e2ddd3" stroke="#c9c2b5" stroke-width="${f(0.5 * u)}"/><path d="${bh.join('')}" fill="#f0c98e" stroke="#b9853f" stroke-width="${f(0.8 * u)}"/></g>`);

  // water
  const wl = [], wc = [];
  for (const w of waterWays) { if (!w.geom.some((p) => inArea(p.lon, p.lat))) continue; (w.tags.tunnel === 'culvert' ? wc : wl).push(pathD(w.geom.map(P))); }
  out.push(`<g id="water"><path class="c" d="${wl.join('')}" stroke="#4a90d9" stroke-width="${f(2 * u)}"/><path class="c" d="${wc.join('')}" stroke="#4a90d9" stroke-width="${f(2 * u)}" stroke-dasharray="${f(3 * u)} ${f(3 * u)}" opacity="0.8"/></g>`);

  // roads
  const vis = ways.filter((w) => w.geom.some((p) => inArea(p.lon, p.lat)));
  const targetIds = new Set(TARGETS.flatMap((t) => [...t.wayIds]));
  out.push(`<path id="race-roads-halo" class="c" stroke="#ff2d95" stroke-opacity="0.22" stroke-width="${f(15 * u)}" d="${vis.filter((w) => targetIds.has(w.id)).map((w) => pathD(w.geom.map(P))).join('')}"/>`);
  const byCls = {};
  for (const w of vis) { const c = STYLE[w.cls] ? w.cls : 'road'; (byCls[c] = byCls[c] || []).push(w); }
  const order = Object.keys(byCls).sort((a, b) => (CLASS_RANK[a] || 0) - (CLASS_RANK[b] || 0));
  out.push('<g id="roads">');
  for (const c of order) {
    const [col, wpx] = STYLE[c], foot = FOOT.has(c);
    const d = byCls[c].map((w) => pathD(w.geom.map(P))).join('');
    if (!foot) out.push(`<path class="c" stroke="#ffffff" stroke-width="${f((wpx + 2) * u)}" d="${d}"/>`);
    out.push(`<path class="c" stroke="${col}" stroke-width="${f(wpx * u)}"${DASH[c] ? ` stroke-dasharray="${DASH[c].map((v) => f(v * u)).join(' ')}"` : ''} d="${d}"/>`);
  }
  out.push('</g>');
  // oneway arrows on motor roads
  const arrows = [];
  for (const w of vis) {
    if (!w.motor || !w.ow || w.cls === 'service') continue;
    const pts = w.geom.map(P); let acc = 0; const every = 140 * u;
    for (let k = 1; k < pts.length; k++) {
      const [ax, az] = pts[k - 1], [bx, bz] = pts[k], d = Math.hypot(bx - ax, bz - az); if (!d) continue;
      let s = every / 2 - acc;
      while (s < d) {
        const t = s / d, x = ax + t * (bx - ax), z = az + t * (bz - az); let dx = (bx - ax) / d, dz = (bz - az) / d; if (w.ow === -1) { dx = -dx; dz = -dz; }
        const a = 4 * u; arrows.push(`M${f(x + dx * a)} ${f(z + dz * a)}L${f(x - dx * a - dz * a * 0.7)} ${f(z - dz * a + dx * a * 0.7)}L${f(x - dx * a + dz * a * 0.7)} ${f(z - dz * a - dx * a * 0.7)}Z`);
        s += every;
      }
      acc = (acc + d) % every;
    }
  }
  out.push(`<path id="oneway" d="${arrows.join('')}" fill="#1b4f72" opacity="0.85"/>`);

  // labels: collision-checked, upright, along the local chord
  const placed = [];
  const hits = (bb) => placed.some((q) => !(bb[2] < q[0] || bb[0] > q[2] || bb[3] < q[1] || bb[1] > q[3]));
  const labels = [];
  function tryLabel(text, x, z, ang, size, extra) {
    const w = text.length * size * 0.56, h = size * 1.1, c = Math.abs(Math.cos((ang * Math.PI) / 180)), s = Math.abs(Math.sin((ang * Math.PI) / 180));
    const hw = (w * c + h * s) / 2, hh = (w * s + h * c) / 2, bb = [x - hw, z - hh, x + hw, z + hh];
    if (bb[0] < X0 || bb[2] > X0 + Wm || bb[1] < Z0 || bb[3] > Z0 + Hm || hits(bb)) return false;
    placed.push(bb); labels.push(`<text class="h" x="${f(x)}" y="${f(z)}"${ang ? ` transform="rotate(${ang.toFixed(1)} ${f(x)} ${f(z)})"` : ''} font-size="${f(size)}" text-anchor="middle" dominant-baseline="middle" ${extra}>${esc(text)}</text>`);
    return true;
  }
  // reserve the legend / scale-bar corners
  placed.push([X0, Z0, X0 + 300 * u, Z0 + 250 * u], [X0, Z0 + Hm - 70 * u, X0 + 420 * u, Z0 + Hm]);
  // POIs + anchors first (markers and names)
  const marks = [];
  const KIND_STYLE = { fountain: '#1f77d0', spring: '#16a5a5', viewpoint: '#2e8b2e', tower: '#d62728', peak: '#333', campground: '#7b3fa0', rock: '#7f5f3f', shelter: '#999', attraction: '#c06' };
  for (const p of pois) {
    if (!inArea(p.lon, p.lat, 0) || !KIND_STYLE[p.kind] || p.kind === 'shelter' || p.kind === 'attraction') continue;
    const [x, z] = P(p), col = KIND_STYLE[p.kind];
    marks.push(p.kind === 'peak' ? `<path d="M${f(x)} ${f(z - 6 * u)}L${f(x + 5 * u)} ${f(z + 3 * u)}L${f(x - 5 * u)} ${f(z + 3 * u)}Z" fill="${col}"/>` : `<circle cx="${f(x)}" cy="${f(z)}" r="${f(4 * u)}" fill="${col}" stroke="#fff" stroke-width="${f(1.2 * u)}"/>`);
    placed.push([x - 5 * u, z - 5 * u, x + 5 * u, z + 5 * u]);
    p._xz = [x, z];
  }
  for (const a of anchors) {
    if (a.lat == null || !inArea(a.lon, a.lat, 0)) continue;
    const [x, z] = P(a);
    marks.push(`<circle cx="${f(x)}" cy="${f(z)}" r="${f(6.5 * u)}" fill="none" stroke="#6a1b9a" stroke-width="${f(1.8 * u)}"/>`);
    a._xz = [x, z];
  }
  out.push(`<g id="markers">${marks.join('')}</g>`);
  for (const a of anchors) {
    if (!a._xz) continue; const [x, z] = a._xz, txt = a.name.replace(/ \(.*$/, '').replace(/ — approximate$/, '') + (a.confidence === 'approx' ? ' (approx.)' : '') + ` ${r0(a.elevM)} m`;
    for (const [dx, dz] of [[0, -13], [0, 13], [txt.length * 3.2 + 10, 0], [-(txt.length * 3.2 + 10), 0]]) if (tryLabel(txt, x + dx * u, z + dz * u, 0, 11 * u, `fill="#4a148c" font-weight="600" stroke-width="${f(3 * u)}"`)) break;
    delete a._xz;
  }
  for (const p of pois) {
    if (!p._xz) continue; const [x, z] = p._xz, txt = (p.name || p.kind) + (p.kind === 'peak' ? ` ${r0(p.elev)} m` : '');
    for (const [dx, dz] of [[0, -11], [0, 11], [txt.length * 2.9 + 9, 0], [-(txt.length * 2.9 + 9), 0]]) if (tryLabel(txt, x + dx * u, z + dz * u, 0, 10 * u, `fill="${KIND_STYLE[p.kind]}"${p.name ? '' : ' font-style="italic"'} stroke-width="${f(2.6 * u)}"`)) break;
    delete p._xz;
  }
  // road names: target roads first, then by class and length
  const labelOf = (w) => w.name || (T.hsmtnLower.wayIds.has(w.id) ? 'Hot Springs Mtn Dr (unnamed in OSM)' : '');
  for (const w of vis) w.label = labelOf(w);
  const named = vis.filter((w) => w.label && (w.motor || /Promenade|Trail/i.test(w.label) || w.cls === 'pedestrian'))
    .sort((a, b) => (targetIds.has(b.id) - targetIds.has(a.id)) || (CLASS_RANK[b.cls] || 0) - (CLASS_RANK[a.cls] || 0) || b.len - a.len);
  const lastByName = new Map();
  for (const w of named) {
    const tgt = targetIds.has(w.id), size = (tgt ? 12.5 : FOOT.has(w.cls) ? 9 : 10) * u;
    const pts = w.geom.map(P); const cum = [0]; for (let k = 1; k < pts.length; k++) cum.push(cum[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]));
    const L = cum[cum.length - 1], tw = w.label.length * size * 0.56; if (L < tw * 1.05) continue;
    const at = (s) => { let k = 1; while (k < cum.length - 1 && cum[k] < s) k++; const t = (s - cum[k - 1]) / (cum[k] - cum[k - 1] || 1); return [pts[k - 1][0] + t * (pts[k][0] - pts[k - 1][0]), pts[k - 1][1] + t * (pts[k][1] - pts[k - 1][1])]; };
    const repeat = (tgt ? 650 : 900) * u, starts = [L / 2]; for (let s = L / 2 + repeat; s < L - tw / 2; s += repeat) starts.push(s); for (let s = L / 2 - repeat; s > tw / 2; s -= repeat) starts.push(s);
    if (tgt) for (const q of [0.35, 0.65, 0.25, 0.75, 0.15, 0.85]) { const s = q * L; if (s > tw / 2 && s < L - tw / 2) starts.push(s); } // fallbacks when crowded
    for (const s of starts) {
      const a = at(Math.max(0, s - tw / 2)), b = at(Math.min(L, s + tw / 2)), m = at(s);
      let ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI; if (ang > 90) ang -= 180; if (ang < -90) ang += 180;
      const prev = lastByName.get(w.label) || [];
      if (prev.some(([px, pz]) => Math.hypot(px - m[0], pz - m[1]) < repeat * 0.8)) continue;
      if (tryLabel(w.label, m[0], m[1], ang, size, `fill="${tgt ? '#880e4f' : FOOT.has(w.cls) ? '#7a3e1d' : '#333'}"${tgt ? ' font-weight="700"' : ''} stroke-width="${f(3.2 * u)}"`)) { prev.push(m); lastByName.set(w.label, prev); }
    }
  }
  out.push(`<g id="labels">${labels.join('')}</g>`);

  // legend, scale bar, north arrow
  const lx = X0 + 12 * u, ly = Z0 + 12 * u, lg = [];
  lg.push(`<rect x="${f(X0 + 4 * u)}" y="${f(Z0 + 4 * u)}" width="${f(290 * u)}" height="${f(240 * u)}" fill="#fff" fill-opacity="0.9" stroke="#999" stroke-width="${f(0.8 * u)}"/>`);
  lg.push(`<text x="${f(lx)}" y="${f(ly + 10 * u)}" font-size="${f(12 * u)}" font-weight="700">${esc(area.id)}</text>`);
  const rows = [['primary', 'primary'], ['secondary', 'secondary'], ['tertiary', 'tertiary'], ['residential', 'residential / unclassified'], ['service', 'service'], ['track', 'track'], ['pedestrian', 'pedestrian'], ['footway', 'footway / path'], ['steps', 'steps'], ['cycleway', 'cycleway']];
  rows.forEach(([c, t], i) => { const y = ly + (28 + i * 14) * u, [col, wpx] = STYLE[c]; lg.push(`<path class="c" d="M${f(lx)} ${f(y)}h${f(34 * u)}" stroke="${col}" stroke-width="${f(wpx * u)}"${DASH[c] ? ` stroke-dasharray="${DASH[c].map((v) => f(v * u)).join(' ')}"` : ''}/><text x="${f(lx + 42 * u)}" y="${f(y + 3.5 * u)}" font-size="${f(10 * u)}">${t}</text>`); });
  let y2 = ly + (28 + rows.length * 14) * u;
  lg.push(`<path class="c" d="M${f(lx)} ${f(y2)}h${f(34 * u)}" stroke="#ff2d95" stroke-opacity="0.3" stroke-width="${f(12 * u)}"/><text x="${f(lx + 42 * u)}" y="${f(y2 + 3.5 * u)}" font-size="${f(10 * u)}">surveyed race road (halo); ▸ = oneway</text>`);
  y2 += 16 * u;
  lg.push(`<circle cx="${f(lx + 6 * u)}" cy="${f(y2)}" r="${f(4 * u)}" fill="#1f77d0"/><circle cx="${f(lx + 18 * u)}" cy="${f(y2)}" r="${f(4 * u)}" fill="#16a5a5"/><circle cx="${f(lx + 30 * u)}" cy="${f(y2)}" r="${f(4 * u)}" fill="#2e8b2e"/><circle cx="${f(lx + 42 * u)}" cy="${f(y2)}" r="${f(4 * u)}" fill="#d62728"/><text x="${f(lx + 52 * u)}" y="${f(y2 + 3.5 * u)}" font-size="${f(10 * u)}">fountain, spring, viewpoint, tower</text>`);
  y2 += 16 * u;
  lg.push(`<circle cx="${f(lx + 6 * u)}" cy="${f(y2)}" r="${f(6 * u)}" fill="none" stroke="#6a1b9a" stroke-width="${f(1.8 * u)}"/><text x="${f(lx + 18 * u)}" y="${f(y2 + 3.5 * u)}" font-size="${f(10 * u)}">anchor (research/geo/anchors.json), DEM elev.</text>`);
  y2 += 16 * u;
  lg.push(`<text x="${f(lx)}" y="${f(y2 + 3 * u)}" font-size="${f(9 * u)}" fill="#555">Contours 10 m (50 m bold), USGS 3DEP. Grid ${area.grid} m, x east / z south of the Row origin.</text>`);
  out.push(`<g id="legend">${lg.join('')}</g>`);
  const sb = area.scale, sx = X0 + 16 * u, sy = Z0 + Hm - 26 * u, seg = sb / 4, sbar = [];
  sbar.push(`<rect x="${f(sx - 8 * u)}" y="${f(sy - 22 * u)}" width="${f(sb + 70 * u)}" height="${f(42 * u)}" fill="#fff" fill-opacity="0.9"/>`);
  for (let k = 0; k < 4; k++) sbar.push(`<rect x="${f(sx + k * seg)}" y="${f(sy)}" width="${f(seg)}" height="${f(6 * u)}" fill="${k % 2 ? '#fff' : '#222'}" stroke="#222" stroke-width="${f(0.8 * u)}"/>`);
  for (const k of [0, 2, 4]) sbar.push(`<text x="${f(sx + k * seg)}" y="${f(sy - 5 * u)}" font-size="${f(10 * u)}" text-anchor="middle">${(k * seg).toFixed(0)}</text>`);
  sbar.push(`<text x="${f(sx + sb + 8 * u)}" y="${f(sy + 6 * u)}" font-size="${f(10 * u)}">m</text>`);
  sbar.push(`<text x="${f(sx)}" y="${f(sy + 17 * u)}" font-size="${f(8.5 * u)}" fill="#555">© OpenStreetMap contributors (ODbL) · USGS 3DEP</text>`);
  const nxp = X0 + Wm - 30 * u, nzp = Z0 + 40 * u;
  sbar.push(`<path d="M${f(nxp)} ${f(nzp - 22 * u)}L${f(nxp + 9 * u)} ${f(nzp + 8 * u)}L${f(nxp)} ${f(nzp + 2 * u)}L${f(nxp - 9 * u)} ${f(nzp + 8 * u)}Z" fill="#222"/><text x="${f(nxp)}" y="${f(nzp + 22 * u)}" font-size="${f(12 * u)}" text-anchor="middle" font-weight="700">N</text>`);
  out.push(`<g id="scale">${sbar.join('')}</g>`);
  out.push('</svg>');
  const file = path.join(OUT_PREVIEWS, area.id + '.svg');
  fs.writeFileSync(file, out.join('\n'));
  return { file, bytes: fs.statSync(file).size, px: [Wpx, Hpx] };
}
const svgInfo = AREAS.map((a) => ({ id: a.id, ...buildSvg(a) }));

// ------------------------------------------------------------------------------------------------- console summary
console.log('DEM tiles:', dem.describe().map((t) => `${t.name} ${t.w}x${t.h} ${t.pixelM.join('x')} m`).join(' | '));
for (const t of TARGETS) { const s = survey[t.id]; console.log(t.label.padEnd(34), s.missing ? 'MISSING' : `${String(s.ways).padStart(3)} ways ${fmtM(s.length).padStart(7)} m  spacing ${r1(s.spacingMean)}/${r1(s.spacingMax)}  elev ${r0(s.elevMin)}-${r0(s.elevMax)}  comps ${s.components}`); }
for (const L of loopResults) console.log('loop', L.id.padEnd(24), L.ok ? 'ok ' : 'FAIL', fmtM(L.len), 'm reuse', fmtM(L.reuse), 'onNamed', L.len ? r0((100 * L.onNamed) / L.len) + '%' : '-');
for (const L of linkResults) console.log('link', L.id.padEnd(24), L.ok ? fmtM(L.len) + ' m ' + L.seq.slice(0, 140) : 'NO CONNECTION');
for (const w of WARN) console.warn('WARN', w);
for (const a of anchors) console.log('anchor', a.id.padEnd(32), a.lat == null ? 'MISSING' : `${ll(a.lat, a.lon)} ${a.elevM} m ${a.crossCheck || ''}`);
for (const s of svgInfo) console.log('svg', s.id, s.px.join('x'), (s.bytes / 1024).toFixed(0) + ' KB');
