// Blender models from compact packs (window.TR_MODELS2, written by tools/pack-models.mjs): per material slot,
// non-indexed triangles with Int16 centimetre positions, Int16 UVs and sRGB byte colours; flat normals rebuilt
// here. Re-skinned with the N64 materials: Gouraud-lit vertex colours, and the `wall` slot takes a painted facade
// texture when one exists. Conventions (art-src/blender/README.md): metres, Y-up, origin at the front-centre at
// grade, facade faces +Z.
import { litMat } from './brickmat.js';
import { tex, hasArt } from './textures.js';

const built = {};

function dec(b64, T) {
  const s = atob(b64), u = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
  return new T(u.buffer);
}

export function hasModel(name) { return !!(window.TR_MODELS2 && window.TR_MODELS2[name]); }

// Resolves to a template Group; cloneModel() places copies (geometry is shared).
export function loadModel(name, opts = {}) {
  if (built[name]) return Promise.resolve(built[name]);
  const THREE = window.THREE;
  if (!hasModel(name)) return Promise.reject(new Error('model not packed: ' + name));
  const M = window.TR_MODELS2[name], root = new THREE.Group();
  for (const [slot, d] of Object.entries(M)) {
    const P = dec(d.p, Int16Array), UV = dec(d.uv, Int16Array), C = dec(d.c, Uint8Array), n = d.n;
    const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), uv = new Float32Array(n * 2), col = new Float32Array(n * 3);
    for (let i = 0; i < n * 3; i++) { pos[i] = P[i] / 100; col[i] = C[i] / 255; }
    for (let i = 0; i < n * 2; i++) uv[i] = UV[i] / 1024;
    for (let t = 0; t < n; t += 3) { // flat normal per triangle
      const a = t * 3, b = a + 3, c = a + 6;
      const ux = pos[b] - pos[a], uy = pos[b + 1] - pos[a + 1], uz = pos[b + 2] - pos[a + 2];
      const vx = pos[c] - pos[a], vy = pos[c + 1] - pos[a + 1], vz = pos[c + 2] - pos[a + 2];
      let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx; const l = Math.hypot(nx, ny, nz) || 1;
      nx /= l; ny /= l; nz /= l;
      for (let k = 0; k < 3; k++) { nor[a + k * 3] = nx; nor[a + k * 3 + 1] = ny; nor[a + k * 3 + 2] = nz; }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    // a building whose facade art paints its windows keeps only its sloped glass (lanterns, skylights): the
    // modelled upright panes stood proud of the painted openings, half a bay out of register
    if (slot === 'glass' && opts.facades && Object.values(opts.facades).some((f) => f && hasArt(f))) {
      const keep = [];
      for (let t = 0; t < n; t += 3) if (Math.abs(nor[t * 3 + 1]) > 0.3) keep.push(t, t + 1, t + 2);
      if (!keep.length) continue;
      g.setIndex(keep);
    }
    g.computeBoundingSphere();
    const facade = opts.facades && opts.facades[slot];
    // brick courses on walls (1 uv unit = 4 m), studs on flat roofs and ledges
    const pat = name === 'goat-rock' ? { pattern: ['bricks', 'studs'], uvScale: 4, tile: 4.48, patAmt: 0.6 } : slot === 'wall' ? { pattern: 'bricks', uvScale: 4, tile: 1.12, patAmt: 0.8 } : slot === 'roof' || slot === 'trim' ? { pattern: ['bricks', 'studs'], uvScale: 4, tile: 1.12, patAmt: 0.7, roof: slot === 'roof' } : {};
    const mat = facade && hasArt(facade) ? litMat({ map: tex(facade), flatTint: true, tint: opts.wallTint || '#ffffff', ...pat, patAmt: 0.55, footAO: true }) : litMat({ ...pat, gloss: slot === 'glass' ? 0.9 : 0.5, footAO: true, glass: slot === 'glass' });
    const mesh = new THREE.Mesh(g, mat);
    mesh.name = slot; mesh.matrixAutoUpdate = false; mesh.updateMatrix();
    mesh.userData.caster = true;
    root.add(mesh);
  }
  built[name] = root;
  return Promise.resolve(root);
}

export function cloneModel(template, x, y, z, yaw, scale = 1) {
  const g = template.clone(true);
  g.position.set(x, y, z);
  g.rotation.y = yaw;
  g.scale.setScalar(scale);
  g.updateMatrix();
  g.matrixAutoUpdate = false;
  return g;
}
