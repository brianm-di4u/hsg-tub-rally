// Effects and item visuals: soap-bubble pickups, bath tickets, judge stands with blue feather flags, thrown
// items (rubber duck, bar of soap, bath bomb and its slick, flung loofahs), loofah shields, the Bubble Bath
// globe, and a pooled particle system for splashes, steam sparks (Warm/Hot slides), boosts and sprays.
import { Geo, hex, mul } from './geom.js';
import { billboardMat, setTime } from './n64mat.js';
import { worldMat, litMat } from './brickmat.js';
import { tex, PROC } from './textures.js';
import { texFromCanvas } from './n64mat.js';
import { buildProp } from './props.js';
import { makeRng } from '../rng.js';

const MAXP = 600;

function ticketCanvas() {
  const c = document.createElement('canvas'); c.width = 32; c.height = 20;
  const g = c.getContext('2d');
  g.fillStyle = '#F2C230'; g.fillRect(1, 1, 30, 18);
  g.fillStyle = '#E8E0CC'; g.fillRect(22, 1, 9, 18);
  g.strokeStyle = '#2A1A10'; g.lineWidth = 2; g.strokeRect(1, 1, 30, 18);
  g.fillStyle = '#7E2F1F'; g.fillRect(5, 6, 13, 3); g.fillRect(5, 11, 9, 3);
  return c;
}

export class Fx {
  constructor(THREE, scene) {
    this.T = THREE; this.scene = scene;
    this.group = new THREE.Group(); this.group.name = 'fx';
    scene.add(this.group);
    // particles
    const g = new THREE.BufferGeometry();
    this.pp = new Float32Array(MAXP * 3); this.pc = new Float32Array(MAXP * 3); this.ps = new Float32Array(MAXP);
    this.pv = new Float32Array(MAXP * 3); this.life = new Float32Array(MAXP); this.maxLife = new Float32Array(MAXP); this.grav = new Float32Array(MAXP);
    g.setAttribute('position', new THREE.BufferAttribute(this.pp, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('color', new THREE.BufferAttribute(this.pc, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('aSize', new THREE.BufferAttribute(this.ps, 1).setUsage(THREE.DynamicDrawUsage));
    const pm = new THREE.ShaderMaterial({
      uniforms: { uScale: { value: 300 } },
      vertexShader: `attribute vec3 color; attribute float aSize; varying vec3 vC; uniform float uScale;
        void main(){ vC = color; vec4 mv = modelViewMatrix * vec4(position,1.0); gl_PointSize = min(aSize * uScale / max(1.0, -mv.z), uScale * 0.026) * smoothstep(1.5, 3.5, -mv.z); gl_Position = projectionMatrix * mv; }`,
      // (point size shrinks to nothing within ~3 m of the camera, so no bead balloons at the lens)
      // each particle is a glossy plastic bead: a sphere normal from the point coordinate, soft key light, a
      // specular highlight and a darker rim, so spray and steam read as toy droplets rather than flat discs
      fragmentShader: `varying vec3 vC; void main(){
        vec2 d = (gl_PointCoord - 0.5) * 2.0; float r2 = dot(d, d); if (r2 > 1.0) discard;
        vec3 n = vec3(d.x, -d.y, sqrt(1.0 - r2));
        float diff = 0.6 + 0.4 * max(dot(n, vec3(-0.42, 0.56, 0.71)), 0.0);
        float spec = pow(max(dot(n, vec3(-0.33, 0.5, 0.8)), 0.0), 28.0);
        vec3 c = vC * diff * (1.0 - 0.3 * smoothstep(0.7, 1.0, r2)) + vec3(0.85 * spec);
        gl_FragColor = vec4(c, 1.0); }`,
      transparent: false, depthWrite: true,
    });
    this.points = new THREE.Points(g, pm); this.points.frustumCulled = false;
    this.group.add(this.points);
    this.next = 0;
    // shared meshes
    this.bubbleTex = texFromCanvas(PROC.bubble(), { repeat: false, mips: false });
    this.ticketTex = texFromCanvas(ticketCanvas(), { repeat: false, mips: false });
    this.pool = {};
    this.mats = {
      lit: litMat({}),
      bubble: billboardMat({ map: this.bubbleTex, alphaTest: 0.2, side: THREE.DoubleSide }),
      ticket: billboardMat({ map: this.ticketTex, alphaTest: 0.5, side: THREE.DoubleSide }),
      globe: new THREE.MeshBasicMaterial({ color: 0xbfefff, transparent: true, opacity: 0.35, depthWrite: false }),
      slick: new THREE.MeshBasicMaterial({ color: 0x9b4dca, transparent: true, opacity: 0.75, depthWrite: false }),
    };
    this.geos = this.buildGeos();
    this.pickupMesh = null; this.ticketMesh = null; this.static = null;
  }
  buildGeos() {
    const T = this.T, G = (fn) => { const g = new Geo(); fn(g); return g.build(T); };
    return {
      duck: G((g) => { const y = hex('#F5D547'); g.ball([0, 0.22, 0], 0.26, y, 6, 4); g.ball([0, 0.5, 0.14], 0.17, y, 6, 3); g.box([-0.06, 0.45, 0.28], [0.06, 0.52, 0.42], hex('#F07F22')); g.box([-0.1, 0.56, 0.24], [-0.06, 0.6, 0.28], hex('#111')); g.box([0.06, 0.56, 0.24], [0.1, 0.6, 0.28], hex('#111')); }),
      soap: G((g) => g.box([-0.28, 0, -0.18], [0.28, 0.16, 0.18], hex('#F7B6CE'), { top: hex('#FBD3E2') })),
      loofah: G((g) => g.ball([0, 0.2, 0], 0.22, hex('#D9B77A'), 6, 4)),
      bomb: G((g) => g.ball([0, 0.25, 0], 0.26, hex('#9B4DCA'), 6, 4)),
      slick: (() => { const g = new T.CircleGeometry(1.9, 12); g.rotateX(-Math.PI / 2); return g; })(),
      globe: new T.SphereGeometry(1.8, 10, 8),
    };
  }
  mesh(kind, i) {
    const list = (this.pool[kind] ||= []);
    if (!list[i]) {
      const m = kind === 'slick' ? new this.T.Mesh(this.geos.slick, this.mats.slick) : kind === 'globe' ? new this.T.Mesh(this.geos.globe, this.mats.globe) : new this.T.Mesh(this.geos[kind], this.mats.lit);
      m.frustumCulled = false; this.group.add(m); list[i] = m;
    }
    return list[i];
  }
  // instanced billboards for pickups and tickets (positions fixed; visibility per frame via size)
  setRace(race, track) {
    // seeded spray so review captures repeat exactly (a fresh sequence per race)
    this.rand = makeRng(race ? race.seed || 1 : 1).next;
    const T = this.T;
    for (const m of [this.pickupMesh, this.ticketMesh, this.static]) if (m) { this.group.remove(m); m.geometry.dispose(); }
    const mk = (list, mat, w, h) => {
      const q = new T.InstancedBufferGeometry();
      q.setAttribute('position', new T.Float32BufferAttribute([-0.5, 0, 0, 0.5, 0, 0, 0.5, 1, 0, -0.5, 1, 0], 3));
      q.setAttribute('uv', new T.Float32BufferAttribute([0, 0, 1, 0, 1, 1, 0, 1], 2));
      q.setIndex([0, 1, 2, 0, 2, 3]);
      const pos = new Float32Array(list.length * 3), size = new Float32Array(list.length * 2), fr = new Float32Array(list.length * 4), tint = new Float32Array(list.length * 3);
      list.forEach((b, i) => { pos.set([b.x, b.y - h / 2, b.z], i * 3); size.set([w, h], i * 2); fr.set([0, 0, 1, 1], i * 4); tint.set([1, 1, 1], i * 3); });
      q.setAttribute('iPos', new T.InstancedBufferAttribute(pos, 3).setUsage(T.DynamicDrawUsage));
      q.setAttribute('iSize', new T.InstancedBufferAttribute(size, 2).setUsage(T.DynamicDrawUsage));
      q.setAttribute('iFrame', new T.InstancedBufferAttribute(fr, 4));
      q.setAttribute('iTint', new T.InstancedBufferAttribute(tint, 3));
      q.instanceCount = list.length;
      const m = new T.Mesh(q, mat); m.frustumCulled = false; this.group.add(m);
      return m;
    };
    const S = race.items;
    this.pickupMesh = S.bubbles.length ? mk(S.bubbles, this.mats.bubble, 1.6, 1.6) : null;
    this.ticketMesh = S.tickets.length ? mk(S.tickets, this.mats.ticket, 1.1, 0.7) : null;
    // judge stands and their blue feather flags
    const g = new Geo();
    for (const j of S.judges) {
      const c = track.at(j.s), side = j.side, w = side > 0 ? c.wr : c.wl;
      const yaw = Math.atan2(c.tx, c.tz);
      const p = track.point(j.s, side * (w + 3.2));
      buildProp('judge', g, [p.x, track.heightAt(c, side * (w + 3.2)), p.z], yaw + (side > 0 ? Math.PI / 2 : -Math.PI / 2), 1); // booth front (and its judges) toward the road
      // the flag before the booth would stand between the chase camera and the judges: only the one after it
      for (const ds of [j.len / 2]) {
        const q = track.point(j.s + ds, side * (w + 0.4)), cc = track.at(j.s + ds);
        buildProp('flag', g, [q.x, track.heightAt(cc, side * w), q.z], yaw, 1);
      }
    }
    // Rules of the Row: blue feather flags on both sides of every judge stop, a judge booth on the left
    for (const st of (race.row && race.row.stops) || []) {
      const c = track.at(st.s), yaw = Math.atan2(c.tx, c.tz);
      for (const side of [-1, 1]) for (const ds of [-st.len / 2, st.len / 2]) {
        if (side < 0 && ds < 0) continue; // the booth side: no flag between the camera and the judges
        const cc = track.at(st.s + ds), w = side > 0 ? cc.wr : cc.wl, q = track.point(st.s + ds, side * (w + 0.4));
        buildProp('flag', g, [q.x, track.heightAt(cc, side * w), q.z], yaw, 1);
      }
      const paint = hex('#F4F1EA');
      for (const ds of [-st.len / 2, st.len / 2]) {
        const ca = track.at(st.s + ds), cb = track.at(st.s + ds + 0.6);
        const P = (cc, d) => { const p = track.point(cc === ca ? st.s + ds : st.s + ds + 0.6, d); return [p.x, track.heightAt(cc, d) + 0.04, p.z]; };
        g.quad(P(ca, -ca.wl), P(ca, ca.wr), P(cb, cb.wr), P(cb, -cb.wl), paint);
      }
      const pj = track.point(st.s, -(c.wl + 3.4));
      buildProp('judge', g, [pj.x, track.heightAt(c, -(c.wl + 3.4)), pj.z], yaw - Math.PI / 2, 1);
    }
    if (race.row) { // finish line cones across Central at the Exchange Street crosswalk
      const c = track.at(race.row.s1), yaw = Math.atan2(c.tx, c.tz);
      for (let d = -c.wl + 1; d <= c.wr - 1; d += 2.4) { const q = track.point(race.row.s1, d); buildProp('cone', g, [q.x, track.heightAt(c, d), q.z], yaw, 1); }
    }
    if (g.count) { this.static = new T.Mesh(g.build(T), worldMat({ pattern: 'studs', gloss: 0.6 })); this.static.userData.caster = true; this.group.add(this.static); }
    this.bobT = 0;
  }
  burst(x, y, z, n, col, opts = {}) {
    const spd = opts.speed ?? 3, up = opts.up ?? 3, size = opts.size ?? 0.18, life = opts.life ?? 0.7, grav = opts.grav ?? 14;
    const r = opts.rng || this.rand || Math.random;
    for (let i = 0; i < n; i++) {
      const k = this.next; this.next = (this.next + 1) % MAXP;
      this.pp[k * 3] = x + (r() - 0.5) * (opts.spread ?? 0.4); this.pp[k * 3 + 1] = y; this.pp[k * 3 + 2] = z + (r() - 0.5) * (opts.spread ?? 0.4);
      const a = r() * Math.PI * 2, s = spd * (0.4 + r() * 0.6);
      this.pv[k * 3] = Math.cos(a) * s + (opts.vx || 0); this.pv[k * 3 + 1] = up * (0.5 + r() * 0.7); this.pv[k * 3 + 2] = Math.sin(a) * s + (opts.vz || 0);
      this.pc[k * 3] = col[0]; this.pc[k * 3 + 1] = col[1]; this.pc[k * 3 + 2] = col[2];
      this.ps[k] = size * (0.7 + r() * 0.6); this.life[k] = life * (0.6 + r() * 0.5); this.maxLife[k] = this.life[k]; this.grav[k] = grav;
    }
  }
  update(race, track, dt, time, reduced, events = []) {
    if (!race) return;
    this.bobT += dt;
    // continuous emitters only run while time moves (paused or frozen frames stay identical)
    const live = dt > 0;
    // emitters fire once per 60 Hz tick of elapsed time, so a long frame (or a motion-strip step) emits as much
    const reps = live ? Math.max(1, Math.min(10, Math.round(dt * 60))) : 0;
    // pickups: hidden ones shrink to zero size
    const S = race.items;
    if (this.pickupMesh) {
      const a = this.pickupMesh.geometry.getAttribute('iSize'), p = this.pickupMesh.geometry.getAttribute('iPos');
      S.bubbles.forEach((b, i) => { const s = b.on ? 1.6 : 0; a.setXY(i, s, s); p.setY(i, b.y - 0.8 + Math.sin(this.bobT * 3 + i) * 0.15); });
      a.needsUpdate = true; p.needsUpdate = true;
    }
    if (this.ticketMesh) {
      const a = this.ticketMesh.geometry.getAttribute('iSize');
      S.tickets.forEach((t, i) => { const w = t.on ? 1.1 * Math.abs(Math.cos(this.bobT * 3 + i)) + 0.15 : 0; a.setXY(i, w, t.on ? 0.7 : 0); });
      a.needsUpdate = true;
    }
    // thrown items
    const used = { duck: 0, soap: 0, loofah: 0, bomb: 0, slick: 0, globe: 0 };
    for (const o of S.live) {
      let kind = o.type === 'soap' ? (o.loofah ? 'loofah' : 'soap') : o.type === 'bombArc' ? 'bomb' : o.type;
      if (!(kind in used)) continue;
      const m = this.mesh(kind, used[kind]++);
      m.visible = true;
      m.position.set(o.x, o.y + (kind === 'slick' ? 0.04 : 0), o.z);
      if (kind === 'duck') { const c = track.at(o.s); m.rotation.y = Math.atan2(c.tx, c.tz); m.position.y += Math.abs(Math.sin(o.t * 12)) * 0.12; }
      if (kind === 'soap' || kind === 'loofah') m.rotation.y = Math.atan2(o.vx, o.vz);
      if (kind === 'slick') { m.scale.setScalar(Math.min(1, 0.4 + o.t * 2)); if (live && !reduced && this.rand() < 0.3) this.burst(o.x, o.y + 0.1, o.z, 1, [0.85, 0.65, 1], { speed: 0.6, up: 1.5, size: 0.14, life: 0.5, spread: 2.6 }); }
    }
    // shields and globes around tubs
    for (const k of race.karts) {
      if (k.shield > 0) for (let s = 0; s < k.shield; s++) {
        const m = this.mesh('loofah', used.loofah++); m.visible = true;
        const a = time * 4 + (s * Math.PI * 2) / 3;
        m.position.set(k.x + Math.sin(a) * 1.5, k.y + 0.6, k.z + Math.cos(a) * 1.5);
      }
      if (k.bubbleT > 0) { const m = this.mesh('globe', used.globe++); m.visible = true; m.position.set(k.x, k.y + 0.9, k.z); }
      // particles from the tub
      const fx = Math.sin(k.yaw), fz = Math.cos(k.yaw);
      for (let rr = 0; rr < reps; rr++) {
      if (k.water.spillFx > 0.05 && !reduced) this.burst(k.x, k.y + 1.0, k.z, Math.ceil(k.water.spillFx * 3), [0.55, 0.82, 0.95], { speed: 2.5, up: 3, size: 0.2, life: 0.6 });
      // power slide: wheel spray while charging, then steam that grows and warms with each stage
      if (k.drift) {
        // stage 0 throws water spray, stage 1 white steam, stage 2 hot steam; all of it trails behind the tub
        const st = k.stage || 0, col = st === 2 ? [1, 0.55, 0.42] : st === 1 ? [0.97, 0.98, 1] : [0.72, 0.87, 0.98];
        for (const sgn of [-1, 1]) this.burst(k.x - fx * 0.7 + fz * 0.55 * sgn, k.y + 0.15, k.z - fz * 0.7 - fx * 0.55 * sgn, 2 + st, col, { speed: 0.7 + st * 0.4, up: 0.9 + st * 0.8, size: 0.24 + st * 0.12, life: 0.3 + st * 0.12, grav: st ? -0.5 : 6, vx: fz * sgn * 1.8 - fx * 0.4, vz: -fx * sgn * 1.8 - fz * 0.4, spread: 0.15 });
      }
      if ((k.boostT > 0 || k.hoseT > 0) && !reduced) this.burst(k.x - fx * 1.6, k.y + 0.6, k.z - fz * 1.6, 2, k.hoseT > 0 ? [0.6, 0.85, 1] : [0.96, 0.96, 0.98], { speed: 0.6, up: 1, size: 0.22, life: 0.4, grav: -1, vx: -fx * 1.5, vz: -fz * 1.5 });
      if (k.sprayT > 0) this.burst(k.x + fx * 1.4, k.y + 1.0, k.z + fz * 1.4, 3, [0.5, 0.8, 1], { speed: 0.5, up: 1.2, size: 0.16, life: 0.5, grav: 9, vx: fx * 16 + Math.sin(k.yaw) * 0, vz: fz * 16, spread: 0.2 });
      }
    }
    for (const { k, e } of events) {
      if (e.type === 'hit' || e.type === 'fumble') this.burst(k.x, k.y + 1.1, k.z, reduced ? 6 : 12, [0.55, 0.82, 0.95], { speed: 4, up: 5, size: 0.17, life: 0.8 }); // small enough to keep the crew in view
      if (e.type === 'pickup') this.burst(k.x, k.y + 1.6, k.z, 10, [0.9, 0.8, 1], { speed: 2, up: 2, size: 0.18, life: 0.5, grav: 0 });
      if (e.type === 'ticket') this.burst(k.x, k.y + 1.4, k.z, 5, [0.95, 0.76, 0.19], { speed: 1.5, up: 2, size: 0.15, life: 0.4, grav: 2 });
      if (e.type === 'bribe') this.burst(k.x, k.y + 1.6, k.z, 14, [0.95, 0.76, 0.19], { speed: 3, up: 4, size: 0.2, life: 0.8 });
      if (e.type === 'land') this.burst(k.x, k.y + 0.2, k.z, 8, [0.75, 0.72, 0.66], { speed: 3, up: 1.5, size: 0.22, life: 0.5 });
      if (e.type === 'wall') this.burst(k.x, k.y + 0.6, k.z, 6, [0.9, 0.9, 0.85], { speed: 2.5, up: 2, size: 0.15, life: 0.4 });
    }
    for (const kind of Object.keys(this.pool)) this.pool[kind].forEach((m, i) => { if (i >= used[kind]) m.visible = false; });
    // integrate particles
    for (let k = 0; k < MAXP; k++) {
      if (this.life[k] <= 0) { this.ps[k] = 0; continue; }
      this.life[k] -= dt;
      this.pv[k * 3 + 1] -= this.grav[k] * dt;
      this.pp[k * 3] += this.pv[k * 3] * dt; this.pp[k * 3 + 1] += this.pv[k * 3 + 1] * dt; this.pp[k * 3 + 2] += this.pv[k * 3 + 2] * dt;
      if (this.life[k] <= 0) this.ps[k] = 0;
    }
    const geo = this.points.geometry;
    geo.attributes.position.needsUpdate = true; geo.attributes.color.needsUpdate = true; geo.attributes.aSize.needsUpdate = true;
  }
  setScale(h) { this.points.material.uniforms.uScale.value = h * 1.2; }
  clear() { this.life.fill(0); this.ps.fill(0); }
}
