// Blender models from base64 packs (window.TR_MODELS), parsed with GLTFLoader and re-skinned with the N64
// materials: Gouraud-lit vertex colours; the `wall` slot takes a facade texture when one is painted.
// Conventions (art-src/blender/README.md): metres, Y-up, origin at the front-centre at grade, facade faces +Z.
import { litMat } from './n64mat.js';
import { tex, hasArt } from './textures.js';

const parsed = {};

function b64ToBuffer(b64) {
  const s = atob(b64), out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out.buffer;
}

export function hasModel(name) { return !!(window.TR_MODELS && window.TR_MODELS[name]); }

// Resolves to a template Group; use cloneModel() to place copies (geometry is shared).
export function loadModel(name, opts = {}) {
  if (parsed[name]) return parsed[name];
  const THREE = window.THREE;
  parsed[name] = new Promise((resolve, reject) => {
    if (!hasModel(name)) { reject(new Error('model not packed: ' + name)); return; }
    new THREE.GLTFLoader().parse(b64ToBuffer(window.TR_MODELS[name]), '', (gltf) => {
      const root = gltf.scene;
      const mats = {};
      root.traverse((o) => {
        if (!o.isMesh) return;
        const slot = (o.material && o.material.name) || 'trim';
        const facade = opts.facades && opts.facades[slot];
        if (!mats[slot]) {
          mats[slot] = facade && hasArt(facade) ? litMat({ map: tex(facade), flatTint: true, tint: opts.wallTint || '#ffffff' }) : litMat({});
        }
        o.material = mats[slot];
        const ca = o.geometry.getAttribute('color');
        const n = o.geometry.getAttribute('position').count;
        const out = new Float32Array(n * 3).fill(1);
        if (ca) {
          // glTF COLOR_0 is linear; this renderer works in gamma space, so encode back to sRGB-ish values
          for (let i = 0; i < n; i++) { out[i * 3] = Math.pow(ca.getX(i), 1 / 2.2); out[i * 3 + 1] = Math.pow(ca.getY(i), 1 / 2.2); out[i * 3 + 2] = Math.pow(ca.getZ(i), 1 / 2.2); }
        }
        o.geometry.setAttribute('color', new THREE.Float32BufferAttribute(out, 3));
        o.matrixAutoUpdate = false;
        o.updateMatrix();
      });
      resolve(root);
    }, (err) => reject(err));
  });
  return parsed[name];
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
