#!/usr/bin/env node
// Blender crew exports (art-src/blender/export/crew, from art-src/blender/scripts/brickcrew.py) → assets/crew.js,
// the pack src/js/gfx/crew3d.js assembles each team's tub and crew from.
//
//   node tools/pack-crew.mjs [--lods=1,2,3]
//
// The export splits every LOD into one shared GLB (geometry that differs between teams only by colour: vertex
// colour is grey AO plus a _SLOT index into the team palette) and one small GLB per team (hats, trims, low-LOD
// torsos, coloured albedo × AO). Each mesh is stored once, quantised: positions Int16 (1/8192 m, node space),
// normals Int8, UVs Uint16, AO + slot or sRGB colour as bytes, Uint16 indices. All of it is deflated into one
// base64 string (DecompressionStream inflates it in the browser). Node placements are baked relative to the pivot
// of the rigid part they ride on (one of KartView's 24 parts) and deduplicated across teams.
// The print atlas (faces, uniform fronts and backs) is quantised to a 256-colour PNG with Python/PIL.
// File:// safe: classic scripts that set window.TR_CREW and (the atlas) window.TR_CREW_ATLAS.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'art-src', 'blender', 'export', 'crew');
const OUT = path.join(ROOT, 'assets', 'crew.js');
const arg = (k, d) => { const a = process.argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const LODS = arg('lods', '1,2,3').split(',').map(Number);
const POS_Q = 8192;

function readGlb(file) {
  const buf = fs.readFileSync(file);
  if (buf.readUInt32LE(0) !== 0x46546c67) throw new Error(`${file}: not a GLB`);
  let off = 12, json = null, bin = null;
  while (off < buf.length) {
    const len = buf.readUInt32LE(off), type = buf.readUInt32LE(off + 4), data = buf.subarray(off + 8, off + 8 + len);
    if (type === 0x4e4f534a) json = JSON.parse(data.toString('utf8')); else if (type === 0x004e4942) bin = data;
    off += 8 + len;
  }
  return { json, bin };
}
const COMP = { 5121: [1, 'readUInt8', 255], 5123: [2, 'readUInt16LE', 65535], 5125: [4, 'readUInt32LE', 0], 5126: [4, 'readFloatLE', 0] };
const NC = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 };
function accessor(g, i) {
  const a = g.json.accessors[i], bv = g.json.bufferViews[a.bufferView], [size, fn, norm] = COMP[a.componentType], nc = NC[a.type];
  const stride = bv.byteStride || size * nc, base = (bv.byteOffset || 0) + (a.byteOffset || 0), out = new Float64Array(a.count * nc);
  for (let k = 0; k < a.count; k++) for (let c = 0; c < nc; c++) {
    let x = g.bin[fn](base + k * stride + c * size);
    if (a.normalized && norm) x /= norm;
    out[k * nc + c] = x;
  }
  return out;
}

// 3×4 affine matrices (column-major 3×3 plus translation), enough for T·R
const fromTR = (t, q) => {
  const [x, y, z, w] = q;
  return [1 - 2 * (y * y + z * z), 2 * (x * y + z * w), 2 * (x * z - y * w),
    2 * (x * y - z * w), 1 - 2 * (x * x + z * z), 2 * (y * z + x * w),
    2 * (x * z + y * w), 2 * (y * z - x * w), 1 - 2 * (x * x + y * y), t[0], t[1], t[2]];
};
const mul = (a, b) => {
  const o = new Array(12);
  for (let c = 0; c < 3; c++) for (let r = 0; r < 3; r++) o[c * 3 + r] = a[r] * b[c * 3] + a[3 + r] * b[c * 3 + 1] + a[6 + r] * b[c * 3 + 2];
  for (let r = 0; r < 3; r++) o[9 + r] = a[r] * b[9] + a[3 + r] * b[10] + a[6 + r] * b[11] + a[9 + r];
  return o;
};
const inv = (m) => { // rigid (rotation + translation) inverse
  const o = [m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8], 0, 0, 0];
  for (let r = 0; r < 3; r++) o[9 + r] = -(o[r] * m[9] + o[3 + r] * m[10] + o[6 + r] * m[11]);
  return o;
};
const nodeMat = (n) => fromTR(n.translation || [0, 0, 0], n.rotation || [0, 0, 0, 1]);
const lin2srgb = (c) => (c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

// binary out: every array 4-byte aligned
const chunks = []; let size = 0;
const put = (typed) => {
  const b = Buffer.from(typed.buffer, typed.byteOffset, typed.byteLength), at = size;
  chunks.push(b); size += b.length;
  const pad = (4 - (size % 4)) % 4;
  if (pad) { chunks.push(Buffer.alloc(pad)); size += pad; }
  return at;
};

// one mesh → [offset, vertices, indices, kind]; kind 0 = shared (AO, slot bytes), 1 = team (sRGB bytes)
function packMesh(g, mi, kind) {
  const p = g.json.meshes[mi].primitives;
  if (p.length !== 1) throw new Error(`mesh ${mi}: ${p.length} primitives`);
  const A = p[0].attributes, pos = accessor(g, A.POSITION), nrm = accessor(g, A.NORMAL), uv = accessor(g, A.TEXCOORD_0);
  const col = accessor(g, A.COLOR_0), idx = accessor(g, p[0].indices), nv = pos.length / 3;
  const P = new Int16Array(nv * 3), N = new Int8Array(nv * 3), U = new Uint16Array(nv * 2), C = new Uint8Array(nv * (kind ? 3 : 2));
  for (let i = 0; i < nv * 3; i++) {
    if (Math.abs(pos[i]) * POS_Q > 32767) throw new Error(`mesh ${mi}: position ${pos[i]} out of range`);
    P[i] = Math.round(pos[i] * POS_Q); N[i] = Math.round(nrm[i] * 127);
  }
  for (let i = 0; i < nv * 2; i++) U[i] = Math.round(Math.min(1, Math.max(0, uv[i])) * 65535);
  if (kind) for (let i = 0; i < nv; i++) for (let c = 0; c < 3; c++) C[i * 3 + c] = Math.round(lin2srgb(col[i * 4 + c]) * 255);
  else {
    const slot = accessor(g, A._SLOT);
    for (let i = 0; i < nv; i++) { C[i * 2] = Math.round(col[i * 4] * 255); C[i * 2 + 1] = Math.round(slot[i]); }
  }
  const at = put(P); put(N); put(U); put(C); put(Uint16Array.from(idx));
  return [at, nv, idx.length, kind];
}

const round = (a, d = 5) => a.map((x) => +x.toFixed(d));
const out = { v: 1, slots: null, empty: null, teams: {}, pivots: null, lods: {} };
const printsMeta = JSON.parse(fs.readFileSync(path.join(SRC, 'prints.json'), 'utf8'));
const teamIds = fs.readdirSync(SRC).filter((f) => /-lod1\.json$/.test(f) && !f.startsWith('shared')).map((f) => f.replace('-lod1.json', '')).sort();

for (const lod of LODS) {
  const sharedMeta = JSON.parse(fs.readFileSync(path.join(SRC, `shared-lod${lod}.json`), 'utf8'));
  const sg = readGlb(path.join(SRC, sharedMeta.glb));
  out.slots ||= sharedMeta.slots;
  const L = { meshes: {}, places: [], teams: {} }, placeKey = new Map();
  const sharedByName = Object.fromEntries(sg.json.nodes.map((n) => [n.name, n]));
  const meshKey = (g, tag, mi, kind) => { const k = `${tag}${mi}`; if (!L.meshes[k]) L.meshes[k] = packMesh(g, mi, kind); return k; };
  for (const team of teamIds) {
    const meta = JSON.parse(fs.readFileSync(path.join(SRC, `${team}-lod${lod}.json`), 'utf8'));
    const tg = readGlb(path.join(SRC, meta.files.team)), teamByName = Object.fromEntries(tg.json.nodes.map((n) => [n.name, n]));
    const glbNode = (name, src) => (src === 'team' ? teamByName : sharedByName)[name];
    // each part's pivot is the node of the same name (always in the shared file)
    const pivot = (part) => { const n = sharedByName[part] || teamByName[part]; if (!n) throw new Error(`${team} lod${lod}: no pivot node ${part}`); return nodeMat(n); };
    const list = [];
    for (const [name, nd] of Object.entries(meta.nodes)) {
      const n = glbNode(name, nd.src);
      if (!n || n.mesh == null) throw new Error(`${team} lod${lod}: node ${name} (${nd.src}) missing`);
      const local = round(mul(inv(pivot(nd.part)), nodeMat(n)));
      // owner (att0..att3, cap) picks the face offset and item colour; torso/head get print offsets
      const owner = (name.match(/^(att\d|cap)_/) || [])[1] || '', role = name.endsWith('_torso') ? 't' : name.endsWith('_head') ? 'h' : '';
      const key = JSON.stringify([nd.part, owner, role, local]);
      if (!placeKey.has(key)) { placeKey.set(key, L.places.length); L.places.push([nd.part, owner, role, local]); }
      const mk = nd.src === 'team' ? meshKey(tg, `t:${team}:`, n.mesh, 1) : meshKey(sg, 's:', n.mesh, 0);
      list.push([placeKey.get(key), mk]);
    }
    L.teams[team] = list;
    if (!out.teams[team]) {
      out.teams[team] = { palette: meta.palette, items: Object.fromEntries(Object.entries(meta.items).map(([k, v]) => [k, v.colour])),
        faces: Object.fromEntries(Object.entries(meta.faces).map(([k, v]) => [k, round(v.uvOffset, 6)])), print: round(meta.printOffset, 6),
        variant: meta.body_variant, water: meta.water.restFill };
    }
    if (!out.pivots) {
      out.pivots = {};
      for (const n of sg.json.nodes) {
        const nd = meta.nodes[n.name];
        if (nd && nd.part === n.name) out.pivots[n.name] = { p: round(nd.pos, 4), r: round(nd.rot, 5) };
      }
    }
  }
  out.lods[lod] = L;
  console.log(`lod${lod}: ${Object.keys(L.meshes).length} meshes, ${L.places.length} placements, ${(size / 1024).toFixed(0)} KB raw so far`);
}

// the print atlas: Python/PIL quantises it to 256 colours (keyed alpha survives); UVs are glTF (origin top left)
const atlasTmp = path.join(ROOT, 'tools', 'out', 'crew-prints-q.png');
fs.mkdirSync(path.dirname(atlasTmp), { recursive: true });
execFileSync('python', ['-I', '-c', 'import sys\nfrom PIL import Image\nim = Image.open(sys.argv[1]).convert("RGBA")\nim.quantize(colors=256, method=Image.Quantize.FASTOCTREE).save(sys.argv[2], "PNG", optimize=True)', path.join(SRC, 'prints.png'), atlasTmp]);
const empty = printsMeta.empty, AW = 1024;
out.empty = [empty[2] / AW, empty[3] / AW];
const atlasUri = 'data:image/png;base64,' + fs.readFileSync(atlasTmp).toString('base64');
const raw = Buffer.concat(chunks), z = zlib.deflateRawSync(raw, { level: 9 });
out.bin = z.toString('base64');
out.rawBytes = raw.length;
const src = `// Generated by tools/pack-crew.mjs from art-src/blender/export/crew — do not edit.\nwindow.TR_CREW = ${JSON.stringify(out)};\n`;
fs.writeFileSync(OUT, src);
// the print atlas travels in its own pack (each pack stays under the 400 KB pack budget)
const atlasOut = path.join(ROOT, 'assets', 'crew-prints.js');
fs.writeFileSync(atlasOut, `// Generated by tools/pack-crew.mjs from art-src/blender/export/crew/prints.png — do not edit.\nwindow.TR_CREW_ATLAS = ${JSON.stringify(atlasUri)};\n`);
console.log(`${path.relative(ROOT, OUT)}: ${(src.length / 1024).toFixed(0)} KB (geometry ${(raw.length / 1024).toFixed(0)} KB raw → ${(z.length / 1024).toFixed(0)} KB deflated); assets/crew-prints.js: ${(atlasUri.length / 1024).toFixed(0)} KB`);
