// Sky: a vertex-coloured gradient dome plus a painted ring of ridges (the Ouachita horizon) that follows the
// camera position, so it always sits at the horizon. Drawn first with depth writes off.
import { horizonCanvas, tex, hasArt } from './textures.js';
import { texFromCanvas } from './n64mat.js';
import { hex } from './geom.js';

export function buildSky(THREE, env = {}) {
  const group = new THREE.Group();
  group.name = 'sky';
  const [top, bot] = env.sky || ['#7FB6E0', '#D9ECF5'];
  const T = hex(top), B = hex(bot), F = hex(env.fogColor || bot);
  // dome
  const R = 400, seg = 16, rings = 6;
  const pos = [], col = [];
  for (let j = 0; j < rings; j++) {
    const a0 = (j / rings) * (Math.PI / 2), a1 = ((j + 1) / rings) * (Math.PI / 2);
    for (let i = 0; i < seg; i++) {
      const b0 = (i / seg) * Math.PI * 2, b1 = ((i + 1) / seg) * Math.PI * 2;
      const P = (a, b) => [Math.cos(a) * Math.sin(b) * R, Math.sin(a) * R * 0.6 - 20, Math.cos(a) * Math.cos(b) * R];
      const C = (a) => { const t = Math.pow(a / (Math.PI / 2), 0.7); return [B[0] + (T[0] - B[0]) * t, B[1] + (T[1] - B[1]) * t, B[2] + (T[2] - B[2]) * t]; };
      const q = [P(a0, b0), P(a1, b1), P(a1, b0), P(a0, b0), P(a0, b1), P(a1, b1)];
      const qc = [C(a0), C(a1), C(a1), C(a0), C(a0), C(a1)];
      q.forEach((p) => pos.push(...p)); qc.forEach((c) => col.push(...c));
    }
  }
  const dg = new THREE.BufferGeometry();
  dg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  dg.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  const dome = new THREE.Mesh(dg, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, depthWrite: false, fog: false }));
  dome.renderOrder = -10;
  group.add(dome);
  // horizon ring: a cylinder with the ridge painting, fading into the fog colour at its base
  const ringCols = env.ridges || ['#7F9AB0', '#5F7F6E', '#40604A'];
  // a painted panorama of the real ridges when the art pack has one, else ridges drawn in code
  const painted = env.skyTex && hasArt(env.skyTex);
  const ringTex = painted ? tex(env.skyTex, { mips: false }) : texFromCanvas(horizonCanvas(ringCols, env.ridgeSeed || 3), { repeat: true, mips: false });
  ringTex.repeat.set(painted ? 3 : 2, 1);
  // painted panoramas: stretch the ring down (top edge unchanged) so their pale lower haze sits below the horizon
  const rg = new THREE.CylinderGeometry(330, 330, painted ? 134 : 110, 24, 1, true);
  // painted panoramas fade out over their top band so their sky meets the dome without a seam
  const rm = painted
    ? new THREE.ShaderMaterial({ uniforms: { map: { value: ringTex }, uRep: { value: ringTex.repeat } }, side: THREE.BackSide, transparent: true, depthWrite: false,
      vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: 'uniform sampler2D map; uniform vec2 uRep; varying vec2 vUv; void main() { vec4 c = texture2D(map, vec2(vUv.x * uRep.x, vUv.y)); gl_FragColor = vec4(c.rgb, c.a * (1.0 - smoothstep(0.72, 0.97, vUv.y))); }' })
    : new THREE.MeshBasicMaterial({ map: ringTex, transparent: true, side: THREE.BackSide, depthWrite: false, fog: false, alphaTest: 0.05 });
  const ring = new THREE.Mesh(rg, rm);
  ring.position.y = painted ? -2 : 10;
  ring.renderOrder = -9;
  group.add(ring);
  // a low fog band to blend the ring into the ground
  const bg = new THREE.CylinderGeometry(320, 320, 24, 24, 1, true);
  const bcol = [];
  const bp = bg.getAttribute('position');
  const R3 = hex((env.ridges || ['#7F9AB0', '#5F7F6E', '#40604A'])[2]);
  const H = [F[0] * 0.45 + R3[0] * 0.55, F[1] * 0.45 + R3[1] * 0.55, F[2] * 0.45 + R3[2] * 0.55];
  for (let i = 0; i < bp.count; i++) { const up = bp.getY(i) > 0; const c = up ? F : H; bcol.push(c[0], c[1], c[2]); }
  bg.setAttribute('color', new THREE.Float32BufferAttribute(bcol, 3));
  const band = new THREE.Mesh(bg, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, depthWrite: false, fog: false, transparent: true, opacity: 0.85 }));
  band.position.y = -18;
  band.renderOrder = -8;
  group.add(band);
  group.userData.follow = true;
  return group;
}
