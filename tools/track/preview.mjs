#!/usr/bin/env node
// Top-down review image of a routed course: the real street line (grey, with street names coloured) and the
// compressed game line (red), start marker and anchors. Writes tools/out/<id>-route.png via the harness Chromium.
//   node tools/track/preview.mjs <id>
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const require = createRequire(path.join(ROOT, 'shared', 'test-harness', 'run.mjs'));
const { chromium } = require('playwright');
const id = process.argv[2];
const r = JSON.parse(fs.readFileSync(path.join(ROOT, 'tracks', id + '.route.json'), 'utf8'));
const baked = fs.existsSync(path.join(ROOT, 'data', 'tracks', id + '.json')) ? JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'tracks', id + '.json'), 'utf8')) : null;
const anchors = JSON.parse(fs.readFileSync(path.join(ROOT, 'research', 'geo', 'anchors.json'), 'utf8'));
fs.mkdirSync(path.join(ROOT, 'tools', 'out'), { recursive: true });
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1100, height: 1100 } });
await p.setContent('<canvas id=c width=1100 height=1100></canvas>');
await p.evaluate(({ r, anchors, baked }) => {
  const c = document.getElementById('c'), g = c.getContext('2d');
  g.fillStyle = '#f6f2e8'; g.fillRect(0, 0, 1100, 1100);
  const pts = [...r.map.map((m) => [m.x, m.z]), ...r.points.map((q) => [q[0], q[1]])];
  let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
  for (const [x, z] of pts) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); z0 = Math.min(z0, z); z1 = Math.max(z1, z); }
  const k = Math.min(1000 / (x1 - x0), 1000 / (z1 - z0)), T = (x, z) => [50 + (x - x0) * k, 50 + (z - z0) * k];
  const cols = {}, pal = ['#3070c0', '#c07030', '#30a050', '#a03090', '#909020', '#20a0a0'];
  g.lineWidth = 6; g.lineCap = 'round';
  for (let i = 1; i < r.map.length; i++) {
    const a = r.map[i - 1], bb = r.map[i];
    cols[a.name] = cols[a.name] || pal[Object.keys(cols).length % pal.length];
    g.strokeStyle = cols[a.name]; g.globalAlpha = 0.5; g.beginPath(); g.moveTo(...T(a.x, a.z)); g.lineTo(...T(bb.x, bb.z)); g.stroke();
  }
  g.globalAlpha = 1; g.strokeStyle = '#d02020'; g.lineWidth = 2.5; g.beginPath();
  r.points.forEach((q, i) => (i ? g.lineTo(...T(q[0], q[1])) : g.moveTo(...T(q[0], q[1])))); g.closePath(); g.stroke();
  if (baked) { // baked road edges
    const dec = (e) => { const s = atob(e.b64), u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return new Float32Array(u.buffer); };
    const X = dec(baked.arr.x), Z = dec(baked.arr.z), WL = dec(baked.arr.wl), WR = dec(baked.arr.wr);
    g.strokeStyle = '#222'; g.lineWidth = 1;
    for (const side of [-1, 1]) { g.beginPath(); for (let i = 0; i <= X.length; i++) { const j = i % X.length, q = (j + 1) % X.length; let tx = X[q] - X[j], tz = Z[q] - Z[j]; const l = Math.hypot(tx, tz) || 1; tx /= l; tz /= l; const w = side > 0 ? WR[j] : WL[j]; const P = T(X[j] - tz * w * side, Z[j] + tx * w * side); i ? g.lineTo(...P) : g.moveTo(...P); } g.stroke(); }
    for (const bl of baked.buildings || []) { g.fillStyle = bl.style === 'bathhouse' ? 'rgba(200,120,60,0.6)' : 'rgba(80,80,80,0.35)'; g.beginPath(); bl.fp.forEach((q, i) => (i ? g.lineTo(...T(q[0], q[1])) : g.moveTo(...T(q[0], q[1])))); g.fill(); }
  }
  const s0 = r.points[0]; g.fillStyle = '#000'; g.fillRect(...T(s0[0], s0[1]).map((v) => v - 5), 10, 10);
  g.font = '13px sans-serif'; let y = 20;
  for (const [n, col] of Object.entries(cols)) { g.fillStyle = col; g.fillText(n || '(unnamed)', 900, y); y += 16; }
  g.fillStyle = '#d02020'; g.fillText(`game ${r.meta.length} m (ks ${r.meta.ks}, kt ${r.meta.kt}, kv ${r.meta.kv})`, 20, 1085);
  g.fillStyle = '#555'; g.fillText(`real ${r.meta.realLength} m`, 20, 1065);
}, { r, anchors, baked });
await p.screenshot({ path: path.join(ROOT, 'tools', 'out', id + '-route.png') }); await b.close();
console.log('tools/out/' + id + '-route.png');
