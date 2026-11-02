// OSM road graph and routing for the track tools. Graph build, oneway handling, routing profiles and Dijkstra are
// adapted from tools/geo/survey.mjs (this repo). Data: osm-roads.json in geo-lib's RAW
// (© OpenStreetMap contributors, ODbL 1.0; see research/geo/SOURCES.md).
import fs from 'node:fs';
import path from 'node:path';
import { RAW, haversine, project } from '../geo/geo-lib.mjs';

const MOTOR = new Set(['motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'unclassified', 'residential', 'living_street', 'service', 'track', 'road',
  'motorway_link', 'trunk_link', 'primary_link', 'secondary_link', 'tertiary_link']);
function onewayDir(t) {
  const o = t.oneway;
  if (o === 'yes' || o === 'true' || o === '1') return 1;
  if (o === '-1' || o === 'reverse') return -1;
  if (o === 'no') return 0;
  if (t.junction === 'roundabout' || t.highway === 'motorway') return 1;
  return 0;
}

export const PROFILES = {
  road: { ok: (w) => w.motor, oneway: false },
  road1: { ok: (w) => w.motor, oneway: true },
  any: { ok: (w) => w.tags.highway !== 'steps' || true, oneway: false },
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

let G = null;
export function graph() {
  if (G) return G;
  const j = JSON.parse(fs.readFileSync(path.join(RAW, 'osm-roads.json'), 'utf8'));
  const ways = j.elements.filter((e) => e.type === 'way' && e.tags && e.tags.highway && e.geometry && e.geometry.every(Boolean))
    .map((e) => ({ id: e.id, tags: e.tags, nodes: e.nodes, geom: e.geometry.map((p) => ({ lon: p.lon, lat: p.lat })) }));
  const nodePos = new Map(), nodeWays = new Map(), adj = new Map(), edges = [];
  for (const w of ways) {
    w.name = w.tags.name || '';
    w.motor = MOTOR.has(w.tags.highway);
    w.ow = onewayDir(w.tags);
    w.nodes.forEach((n, i) => { nodePos.set(n, w.geom[i]); if (!nodeWays.has(n)) nodeWays.set(n, new Set()); nodeWays.get(n).add(w); });
    for (let i = 1; i < w.nodes.length; i++) {
      const len = haversine(w.geom[i - 1].lon, w.geom[i - 1].lat, w.geom[i].lon, w.geom[i].lat);
      const k = edges.push({ a: w.nodes[i - 1], b: w.nodes[i], len, w }) - 1;
      for (const n of [w.nodes[i - 1], w.nodes[i]]) { if (!adj.has(n)) adj.set(n, []); adj.get(n).push(k); }
    }
  }
  G = { ways, nodePos, nodeWays, adj, edges };
  return G;
}

// nearest graph node to (lat, lon); `on` restricts to ways whose name matches (string or RegExp)
export function nearestNode(lat, lon, { on, profile = 'any' } = {}) {
  const { nodePos, nodeWays } = graph();
  const P = PROFILES[profile];
  const match = (w) => (!on || (on instanceof RegExp ? on.test(w.name) : w.name === on)) && P.ok(w);
  let best = null, bd = Infinity;
  for (const [n, p] of nodePos) {
    let ok = false;
    for (const w of nodeWays.get(n)) if (match(w)) { ok = true; break; }
    if (!ok) continue;
    const d = haversine(lon, lat, p.lon, p.lat);
    if (d < bd) { bd = d; best = n; }
  }
  return { node: best, d: bd };
}

// shortest path; opts.prefer: RegExp of way names (others cost `penalty`×); opts.used: Set of edge ids (cost 8×)
export function route(from, to, profile = 'road1', opts = {}) {
  const { adj, edges } = graph();
  const P = PROFILES[profile];
  const dist = new Map([[from, 0]]), prev = new Map(), h = new Heap();
  h.push(0, from);
  while (h.size) {
    const [d, u] = h.pop();
    if (d > dist.get(u)) continue;
    if (u === to) break;
    for (const k of adj.get(u) || []) {
      const e = edges[k];
      if (!P.ok(e.w)) continue;
      if (opts.avoid && opts.avoid.test(e.w.tags.highway)) continue;
      const fwd = e.a === u, v = fwd ? e.b : e.a;
      if (P.oneway && e.w.ow && ((e.w.ow === 1 && !fwd) || (e.w.ow === -1 && fwd))) continue;
      let c = e.len;
      if (opts.prefer && !opts.prefer.test(e.w.name)) c *= opts.penalty || 3;
      if (opts.used && opts.used.has(k)) c *= 8;
      const nd = d + c;
      if (nd < (dist.has(v) ? dist.get(v) : Infinity)) { dist.set(v, nd); prev.set(v, k); h.push(nd, v); }
    }
  }
  if (!dist.has(to)) return null;
  const steps = [];
  let u = to;
  while (prev.has(u)) { const k = prev.get(u), e = edges[k]; const f = e.a === u ? e.b : e.a; steps.push({ k, from: f, to: u, way: e.w }); u = f; }
  steps.reverse();
  return steps;
}

// route through a list of waypoints → [{lon, lat, way}] polyline (closed if the last waypoint equals the first)
export function routeVia(via, profile = 'road1', opts = {}) {
  const { nodePos } = graph();
  const nodes = via.map((wp) => {
    if (wp.node) return { node: wp.node, d: 0 };
    const r = nearestNode(wp.near[0], wp.near[1], { on: wp.on ? (wp.on.startsWith('/') ? new RegExp(wp.on.slice(1, -1)) : wp.on) : null, profile: wp.profile || profile });
    if (!r.node) throw new Error('no node near ' + JSON.stringify(wp));
    if (r.d > (wp.tol ?? 60)) console.warn(`waypoint snapped ${r.d.toFixed(0)} m: ${JSON.stringify(wp)}`);
    return r;
  });
  const used = new Set(), pts = [], legs = [];
  for (let i = 1; i < nodes.length; i++) {
    const leg = route(nodes[i - 1].node, nodes[i].node, via[i].profile || profile, { ...opts, used });
    if (!leg) throw new Error(`no route for leg ${i}: ${JSON.stringify(via[i - 1])} → ${JSON.stringify(via[i])}`);
    let len = 0;
    const names = new Map();
    for (const s of leg) {
      used.add(s.k);
      const p = nodePos.get(s.from), q = nodePos.get(s.to);
      if (!pts.length) pts.push({ ...p, way: s.way.id, name: s.way.name, hw: s.way.tags.highway });
      pts.push({ ...q, way: s.way.id, name: s.way.name, hw: s.way.tags.highway });
      const L = haversine(p.lon, p.lat, q.lon, q.lat); len += L;
      names.set(s.way.name || '(' + s.way.tags.highway + ')', (names.get(s.way.name || '(' + s.way.tags.highway + ')') || 0) + L);
    }
    legs.push({ len, names: [...names.entries()].map(([n, m]) => `${n} ${m.toFixed(0)} m`).join(', ') });
  }
  return { pts, legs };
}

export { project, haversine };
