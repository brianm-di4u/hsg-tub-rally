// Blender-built tubs and crews (assets/crew.js, written by tools/pack-crew.mjs from art-src/blender/export/crew).
// The pack holds every mesh once, quantised and deflated; this module inflates it once at boot and assembles one
// geometry per team and LOD on KartView's 24-part palette (karts3d.js): each node is placed relative to the pivot of
// the part it rides on, shared meshes take the team's palette colour × baked AO, and torso and head UVs are offset
// to the team's prints and each figure's face. KartView animates the parts from the pivots the pack carries.
// Without the pack (or DecompressionStream) the game falls back to the crews built in code.

// part names in the export → KartView part indices
const PART = { body: 0, wheel_0: 1, wheel_1: 2, wheel_2: 3, wheel_3: 4, flag: 5, duck: 6, cap_torso: 7, cap_head: 8, cap_arm_l: 9, cap_arm_r: 10, water: 23 };
for (let i = 0; i < 4; i++) Object.assign(PART, { [`att${i}_torso`]: 11 + i * 3, [`att${i}_leg_l`]: 12 + i * 3, [`att${i}_leg_r`]: 13 + i * 3 });

let pack = null, buf = null, atlas = null, loading = null;
const views = new Map();

export function crewAvailable() { return !!(window.TR_CREW && window.TR_CREW_ATLAS && typeof DecompressionStream === 'function'); }
export const crewReady = () => !!buf;
export const crewAtlas = () => atlas;
export const crewPivots = () => pack.pivots;

// inflate the geometry and decode the print atlas (once); resolves false when the pack can't be used
export function loadCrew(THREE) {
  if (loading) return loading;
  if (!crewAvailable()) return (loading = Promise.resolve(false));
  loading = (async () => {
    const C = window.TR_CREW, bin = atob(C.bin), bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const out = await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer();
    const img = new Image();
    img.src = window.TR_CREW_ATLAS;
    await img.decode();
    // glTF UVs: origin at the top left, so no flip
    atlas = new THREE.Texture(img);
    atlas.flipY = false; atlas.colorSpace = THREE.NoColorSpace; atlas.anisotropy = 4; atlas.needsUpdate = true;
    pack = C; buf = out;
    return true;
  })().catch((e) => { console.warn('crew pack unavailable; using the built-in crews', e); return false; });
  return loading;
}

// typed views of one packed mesh (layout and alignment as tools/pack-crew.mjs writes it)
function meshView(lod, key) {
  const id = lod + key;
  if (views.has(id)) return views.get(id);
  const [off, nv, ni, kind] = pack.lods[lod].meshes[key], al = (n) => (n + 3) & ~3, nc = kind ? 3 : 2;
  let o = off;
  const P = new Int16Array(buf, o, nv * 3); o += al(nv * 6);
  const N = new Int8Array(buf, o, nv * 3); o += al(nv * 3);
  const U = new Uint16Array(buf, o, nv * 2); o += al(nv * 4);
  const C = new Uint8Array(buf, o, nv * nc); o += al(nv * nc);
  const v = { nv, ni, kind, P, N, U, C, I: new Uint16Array(buf, o, ni) };
  views.set(id, v);
  return v;
}

const s2l = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const l2s = (c) => (c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);
const hexLin = (h) => [1, 3, 5].map((i) => s2l(parseInt(h.slice(i, i + 2), 16) / 255));

// one team at one LOD → { geo, water } (BufferGeometries with aPart), or null if the pack lacks it
export function buildCrewGeo(THREE, teamId, lod) {
  const L = pack && pack.lods[lod], T = pack && pack.teams[teamId], list = L && L.teams[teamId];
  if (!list || !T) return null;
  const slots = pack.slots.map((s) => (T.palette[s] ? hexLin(T.palette[s]) : null)), items = {};
  for (const [k, h] of Object.entries(T.items)) items[k] = hexLin(h);
  const [ex, ey] = pack.empty, grey = hexLin('#9A9A9A');
  const nodes = list.map(([pi, mk]) => ({ place: L.places[pi], m: meshView(lod, mk) }));
  const build = (sel) => {
    const ns = nodes.filter(sel);
    let nv = 0, ni = 0;
    for (const n of ns) { nv += n.m.nv; ni += n.m.ni; }
    const pos = new Float32Array(nv * 3), nrm = new Float32Array(nv * 3), col = new Float32Array(nv * 3), uv = new Float32Array(nv * 2), part = new Float32Array(nv);
    const idx = nv > 65535 ? new Uint32Array(ni) : new Uint16Array(ni);
    let v0 = 0, i0 = 0;
    for (const { place: [pname, owner, role, M], m } of ns) {
      const pi = PART[pname], du = role === 't' ? T.print : role === 'h' ? T.faces[owner] || [0, 0] : null;
      for (let i = 0; i < m.nv; i++) {
        const x = m.P[i * 3] / 8192, y = m.P[i * 3 + 1] / 8192, z = m.P[i * 3 + 2] / 8192, o = (v0 + i) * 3;
        pos[o] = M[0] * x + M[3] * y + M[6] * z + M[9];
        pos[o + 1] = M[1] * x + M[4] * y + M[7] * z + M[10];
        pos[o + 2] = M[2] * x + M[5] * y + M[8] * z + M[11];
        const a = m.N[i * 3] / 127, b = m.N[i * 3 + 1] / 127, c = m.N[i * 3 + 2] / 127;
        const nx = M[0] * a + M[3] * b + M[6] * c, ny = M[1] * a + M[4] * b + M[7] * c, nz = M[2] * a + M[5] * b + M[8] * c, nl = Math.hypot(nx, ny, nz) || 1;
        nrm[o] = nx / nl; nrm[o + 1] = ny / nl; nrm[o + 2] = nz / nl;
        if (m.kind) for (let k = 0; k < 3; k++) col[o + k] = m.C[i * 3 + k] / 255;
        else {
          const ao = m.C[i * 2] / 255, sn = pack.slots[m.C[i * 2 + 1]], base = (sn === 'item' ? items[owner] : slots[m.C[i * 2 + 1]]) || grey;
          for (let k = 0; k < 3; k++) col[o + k] = l2s(base[k] * ao);
        }
        let u = m.U[i * 2] / 65535, w = m.U[i * 2 + 1] / 65535;
        if (du && !(u < ex && w < ey)) { u += du[0]; w += du[1]; }
        uv[(v0 + i) * 2] = u; uv[(v0 + i) * 2 + 1] = w;
        part[v0 + i] = pi;
      }
      for (let i = 0; i < m.ni; i++) idx[i0 + i] = m.I[i] + v0;
      v0 += m.nv; i0 += m.ni;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.BufferAttribute(nrm, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    g.setAttribute('aPart', new THREE.BufferAttribute(part, 1));
    g.setIndex(new THREE.BufferAttribute(idx, 1));
    g.computeBoundingSphere();
    return g;
  };
  return { geo: build((n) => n.place[0] !== 'water'), water: build((n) => n.place[0] === 'water'), tris: nodes.reduce((s, n) => s + n.m.ni / 3, 0) };
}
