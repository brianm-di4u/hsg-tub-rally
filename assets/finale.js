// Spa City Tub Rally: the finish ceremony (S4-01) and the town's ambient motion (S4-02).
// Hand-written classic script (not a generated pack): it loads once at boot, after the game's own code, so the
// first-race download stays inside its budget. main.js hands it the game in window.TR_APP = { App, KartView }.
//  - Ceremony: when the player crosses the line the camera swings round the tub through a confetti burst; the
//    results then open over a podium of the top three tubs (the game's own KartView) with a banner for the place.
//  - Ambient: steam plumes on the bathhouse roofs and along the verge, mist over the fountain, a slow cloud layer,
//    a few birds, and spectators who raise their arms as the player's tub goes by.
// Nothing here touches the simulation. Reduced motion and the Low tier switch the moving parts off.
(function (G) {
  'use strict';
  const A = G.TR_APP, App = A.App, T = G.THREE;
  const S = { world: null, kids: 0, clock: 0, last: 0, emit: [], plume: null, clouds: null, birds: null, crowd: null, cere: null, pod: null, dead: false, scan: 0, near: 0, refresh: 0 };
  const rng = (seed) => { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  const hashStr = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return h >>> 0; };
  const ease = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const motionOn = () => !App.reducedMotion && App.tier !== 'low';
  const ROOFS = /fordyce|quapaw|buckstaff|maurice|hale|superior|lamar|ozark|vapors/;

  // ------------------------------------------------------------------ steam
  const NP = 320;
  function makePlume() {
    const g = new T.BufferGeometry();
    const pos = new Float32Array(NP * 3), size = new Float32Array(NP), alpha = new Float32Array(NP);
    g.setAttribute('position', new T.BufferAttribute(pos, 3).setUsage(T.DynamicDrawUsage));
    g.setAttribute('aSize', new T.BufferAttribute(size, 1).setUsage(T.DynamicDrawUsage));
    g.setAttribute('aAlpha', new T.BufferAttribute(alpha, 1).setUsage(T.DynamicDrawUsage));
    const m = new T.ShaderMaterial({
      uniforms: { uScale: { value: 700 }, uCol: { value: new T.Color(1, 1, 1) } },
      vertexShader: `attribute float aSize; attribute float aAlpha; varying float vA; uniform float uScale;
        void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); float d = -mv.z;
          gl_PointSize = min(aSize * uScale / max(1.0, d), uScale * 0.3);
          vA = aAlpha * smoothstep(2.0, 7.0, d) * (1.0 - smoothstep(70.0, 115.0, d)); gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `uniform vec3 uCol; varying float vA; void main(){ vec2 c = gl_PointCoord - 0.5; float r = length(c) * 2.0;
        float a = smoothstep(1.0, 0.15, r) * vA; if (a < 0.004) discard; gl_FragColor = vec4(uCol, a); }`,
      transparent: true, depthWrite: false,
    });
    const pts = new T.Points(g, m); pts.frustumCulled = false; pts.name = 'ambient-steam'; pts.renderOrder = 4;
    App.renderer.scene.add(pts);
    return { pts, pos, size, alpha, mat: m, age: new Float32Array(NP).fill(1), life: new Float32Array(NP).fill(1), v: new Float32Array(NP * 3), s0: new Float32Array(NP), grow: new Float32Array(NP), peak: new Float32Array(NP), next: 0, live: 0 };
  }

  function addEmitter(x, y, z, kind, spread) { S.emit.push({ x, y, z, kind, spread: spread || 0.8, acc: Math.random(), on: false }); }

  function findEmitters() {
    S.emit = [];
    const tr = App.track; if (!tr) return;
    const r = rng(hashStr(tr.id));
    // thermal vents along the verge (the long courses only; the arena has its fountain)
    if (tr.length > 400) {
      for (let i = 0; i < 7; i++) {
        const s = ((i + 0.3 + r() * 0.4) / 7) * tr.length, side = i % 2 ? 1 : -1, c = tr.at(s);
        const d = side * ((side > 0 ? c.wr : c.wl) + 2.4 + r() * 1.4), p = tr.point(s, d);
        addEmitter(p.x, tr.heightAt(c, d) + 0.1, p.z, 'vent', 0.35);
      }
    }
    for (const p of (tr.json.props || [])) if (p.type === 'jug') addEmitter(p.x, tr.surface(p.x, p.z, p.s).h + 0.9 * (p.sc || 1), p.z, 'mist', 3 * (p.sc || 1));
  }
  function scanRoofs() {
    const w = S.world; if (!w || w.children.length === S.kids) return;
    S.kids = w.children.length;
    for (const o of w.children) {
      if (!o.name || !o.name.startsWith('landmark:') || o.userData.steamed || !ROOFS.test(o.name)) continue;
      o.userData.steamed = true;
      o.updateMatrixWorld(true);
      const b = new T.Box3().setFromObject(o), sz = b.getSize(new T.Vector3()), c = b.getCenter(new T.Vector3());
      const long = sz.x > sz.z ? 'x' : 'z', n = Math.max(sz.x, sz.z) > 16 ? 2 : 1;
      for (let i = 0; i < n; i++) {
        const q = c.clone(); q[long] += n === 1 ? 0 : (i ? 0.25 : -0.25) * sz[long];
        addEmitter(q.x, b.max.y - 0.3, q.z, 'roof', 1.0);
      }
    }
  }
  function spawn(P, e) {
    const k = P.next; P.next = (P.next + 1) % NP;
    if (P.age[k] < P.life[k]) return; // the slot is still in use: skip this puff
    const roof = e.kind === 'roof', mist = e.kind === 'mist', rr = Math.random;
    P.pos[k * 3] = e.x + (rr() - 0.5) * e.spread; P.pos[k * 3 + 1] = e.y; P.pos[k * 3 + 2] = e.z + (rr() - 0.5) * e.spread;
    P.v[k * 3] = (rr() - 0.5) * 0.25; P.v[k * 3 + 1] = roof ? 1.3 + rr() * 0.9 : mist ? 0.5 + rr() * 0.4 : 0.9 + rr() * 0.7; P.v[k * 3 + 2] = (rr() - 0.5) * 0.25;
    P.age[k] = 0; P.life[k] = roof ? 5 + rr() * 2 : mist ? 3 + rr() * 1.5 : 3.5 + rr() * 1.5;
    P.s0[k] = roof ? 1.9 + rr() * 0.6 : mist ? 1.6 : 0.8 + rr() * 0.3; P.grow[k] = roof ? 1.8 : 2.2; P.peak[k] = roof ? 0.55 : mist ? 0.3 : 0.42;
  }
  function stepSteam(dt) {
    const P = S.plume, cam = App.renderer.camera.position, on = motionOn();
    P.pts.visible = on;
    if (!on) { for (let k = 0; k < NP; k++) P.age[k] = P.life[k]; return; }
    S.near -= dt;
    if (S.near <= 0) { S.near = 0.5; for (const e of S.emit) e.on = (e.x - cam.x) ** 2 + (e.z - cam.z) ** 2 < 95 * 95; }
    for (const e of S.emit) {
      if (!e.on || dt <= 0) continue;
      e.acc += dt * (e.kind === 'roof' ? 2.2 : e.kind === 'mist' ? 4 : 3);
      while (e.acc >= 1) { e.acc -= 1; spawn(P, e); }
    }
    const wx = 0.7 + 0.4 * Math.sin(S.clock * 0.05), wz = 0.3 * Math.cos(S.clock * 0.043);
    let live = 0;
    for (let k = 0; k < NP; k++) {
      if (P.age[k] >= P.life[k]) { P.size[k] = 0; P.alpha[k] = 0; continue; }
      P.age[k] += dt; live++;
      const u = Math.min(1, P.age[k] / P.life[k]);
      P.pos[k * 3] += (P.v[k * 3] + wx * u) * dt; P.pos[k * 3 + 1] += P.v[k * 3 + 1] * (1 - 0.5 * u) * dt; P.pos[k * 3 + 2] += (P.v[k * 3 + 2] + wz * u) * dt;
      P.size[k] = P.s0[k] * (1 + P.grow[k] * u);
      P.alpha[k] = P.peak[k] * ease(0, 0.15, u) * (1 - ease(0.5, 1, u));
    }
    P.live = live;
    const g = P.pts.geometry; g.attributes.position.needsUpdate = true; g.attributes.aSize.needsUpdate = true; g.attributes.aAlpha.needsUpdate = true;
    P.mat.uniforms.uScale.value = App.renderer.size.h * 0.9;
  }

  // ------------------------------------------------------------------ clouds
  function cloudTexture() {
    const c = document.createElement('canvas'); c.width = 256; c.height = 112;
    const x = c.getContext('2d'), r = rng(5);
    for (let i = 0; i < 16; i++) {
      const px = 40 + r() * 176, py = 70 - Math.sin((px - 40) / 176 * Math.PI) * 18 + (r() - 0.5) * 12, rad = 18 + r() * 26;
      const gr = x.createRadialGradient(px, py, 0, px, py, rad);
      gr.addColorStop(0, 'rgba(255,255,255,0.8)'); gr.addColorStop(0.6, 'rgba(255,255,255,0.36)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = gr; x.fillRect(px - rad, py - rad, rad * 2, rad * 2);
    }
    const t = new T.CanvasTexture(c); t.colorSpace = T.NoColorSpace; return t;
  }
  function buildClouds() {
    if (S.clouds) { App.renderer.scene.remove(S.clouds.group); S.clouds.mesh.geometry.dispose(); S.clouds.mat.dispose(); }
    const env = (App.track && App.track.json.env) || {}, warm = env.time === 'dusk' || env.time === 'sunset';
    const far = App.renderer.camera.far, R = far * 0.55, N = 8, r = rng(hashStr((App.track ? App.track.id : 'x')) ^ 77);
    const pos = [], uv = [];
    for (let i = 0; i < N; i++) {
      const az = (i / N) * Math.PI * 2 + (r() - 0.5) * 0.4, el = (9 + r() * 17) * Math.PI / 180, w = R * (0.5 + r() * 0.35), h = w * 0.44;
      const dir = new T.Vector3(Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az)), z = dir.clone().negate();
      const xa = new T.Vector3(0, 1, 0).cross(z).normalize(), ya = z.clone().cross(xa), c = dir.clone().multiplyScalar(R), flip = r() < 0.5;
      const q = [[-1, -1, 0, 0], [1, -1, 1, 0], [1, 1, 1, 1], [-1, 1, 0, 1]];
      for (const k of [0, 1, 2, 0, 2, 3]) {
        const v = c.clone().addScaledVector(xa, q[k][0] * w / 2).addScaledVector(ya, q[k][1] * h / 2);
        pos.push(v.x, v.y, v.z); uv.push(flip ? 1 - q[k][2] : q[k][2], q[k][3]);
      }
    }
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
    const mat = new T.MeshBasicMaterial({ map: S.cloudTex || (S.cloudTex = cloudTexture()), transparent: true, depthWrite: false, fog: false, side: T.DoubleSide, color: warm ? 0xFFD8C0 : 0xFFFFFF, opacity: warm ? 0.8 : 0.9 });
    const mesh = new T.Mesh(g, mat); mesh.frustumCulled = false; mesh.renderOrder = -5;
    const group = new T.Group(); group.name = 'ambient-clouds'; group.add(mesh);
    App.renderer.scene.add(group);
    S.clouds = { group, mesh, mat, far, spin: S.clouds ? S.clouds.spin : 0 };
  }

  // ------------------------------------------------------------------ birds
  const NB = 4, FLOCKS = 3;
  function buildBirds() {
    if (S.birds) { App.renderer.scene.remove(S.birds.mesh); S.birds.mesh.geometry.dispose(); S.birds.mesh.material.dispose(); }
    const tr = App.track, r = rng(hashStr(tr ? tr.id : 'x') ^ 991), flocks = [];
    for (let f = 0; f < FLOCKS; f++) {
      const s = ((f + 0.2 + r() * 0.5) / FLOCKS) * tr.length, c = tr.at(s), side = r() < 0.5 ? -1 : 1, p = tr.point(s, side * (22 + r() * 16));
      flocks.push({ x: p.x, y: tr.heightAt(c, 0) + 34 + r() * 10, z: p.z, rad: 18 + r() * 14, w: (0.22 + r() * 0.12) * (f % 2 ? 1 : -1), ph: r() * 6.28 });
    }
    const g = new T.BufferGeometry(), pos = new Float32Array(FLOCKS * NB * 2 * 9);
    g.setAttribute('position', new T.BufferAttribute(pos, 3).setUsage(T.DynamicDrawUsage));
    const env = tr.json.env || {}, dusk = env.time === 'dusk' || env.time === 'sunset';
    const mesh = new T.Mesh(g, new T.MeshBasicMaterial({ color: dusk ? 0x1c1a24 : 0x2c3340, side: T.DoubleSide, fog: false }));
    mesh.frustumCulled = false; mesh.name = 'ambient-birds';
    App.renderer.scene.add(mesh);
    S.birds = { mesh, pos, flocks };
  }
  function stepBirds() {
    const B = S.birds, cam = App.renderer.camera.position, on = motionOn();
    B.mesh.visible = on; if (!on) return;
    const p = B.pos, t = S.clock; let o = 0;
    B.flocks.forEach((f) => {
      const near = (f.x - cam.x) ** 2 + (f.z - cam.z) ** 2 < 190 * 190;
      for (let i = 0; i < NB; i++) {
        const th = f.ph + t * f.w + i * 1.3, rr = f.rad * (0.8 + 0.25 * Math.sin(i * 2.1)), sgn = f.w > 0 ? 1 : -1;
        const cx = f.x + Math.cos(th) * rr, cz = f.z + Math.sin(th) * rr, cy = f.y + Math.sin(t * 0.6 + i * 1.7) * 1.6 + i * 0.7;
        const hx = -Math.sin(th) * sgn, hz = Math.cos(th) * sgn, lx = -hz, lz = hx; // heading and its left
        const flap = Math.sin(t * 8 + i * 2.3 + f.ph) * (Math.sin(t * 0.7 + i) > -0.2 ? 0.6 : 0.05); // now and then a glide
        const v = near ? [
          [cx + hx * 0.5, cy, cz + hz * 0.5], [cx - hx * 0.4, cy, cz - hz * 0.4], [cx + lx * 1.6 - hx * 0.2, cy + flap, cz + lz * 1.6 - hz * 0.2],
          [cx + hx * 0.5, cy, cz + hz * 0.5], [cx - hx * 0.4, cy, cz - hz * 0.4], [cx - lx * 1.6 - hx * 0.2, cy + flap, cz - lz * 1.6 - hz * 0.2],
        ] : null;
        for (let k = 0; k < 6; k++) { const q = v ? v[k] : [0, -999, 0]; p[o++] = q[0]; p[o++] = q[1]; p[o++] = q[2]; }
      }
    });
    B.mesh.geometry.attributes.position.needsUpdate = true;
  }

  // ------------------------------------------------------------------ the crowd
  function bindCrowd() {
    S.crowd = null;
    const w = S.world; if (!w) return;
    const m = w.children.find((o) => o.isInstancedMesh && o.name === 'crowd');
    if (!m) return;
    const a = m.instanceMatrix.array, n = m.count, pos = new Float32Array(n * 2), boost = new Float32Array(n);
    for (let i = 0; i < n; i++) { pos[i * 2] = a[i * 16 + 12]; pos[i * 2 + 1] = a[i * 16 + 14]; }
    const attr = new T.InstancedBufferAttribute(boost, 1).setUsage(T.DynamicDrawUsage);
    m.geometry.setAttribute('iBoost', attr);
    S.crowd = { mesh: m, n, pos, boost, attr, up: 0 };
  }
  // fans within `reach` of the player's tub raise their arms (all of them, when `all`), and lower them again once it is gone
  function stepCrowd(dt, reach, all) {
    const C = S.crowd; if (!C) return;
    const me = App.race && App.race.player >= 0 ? App.race.karts[App.race.player] : null;
    const on = motionOn() && me && App.scene === 'race';
    let ch = false, up = 0;
    for (let i = 0; i < C.n; i++) {
      const dx = C.pos[i * 2] - (me ? me.x : 0), dz = C.pos[i * 2 + 1] - (me ? me.z : 0);
      const tgt = on ? (all ? (dx * dx + dz * dz < reach * reach * 4 ? 1 : 0) : Math.max(0, 1 - Math.sqrt(dx * dx + dz * dz) / reach)) : 0;
      const cur = C.boost[i], nv = cur + (tgt - cur) * Math.min(1, dt * (tgt > cur ? 5 : 1.2));
      if (Math.abs(nv - cur) > 0.002) { C.boost[i] = nv; ch = true; }
      if (nv > 0.3) up++;
    }
    C.up = up;
    if (ch) C.attr.needsUpdate = true;
  }

  // ------------------------------------------------------------------ the finish ceremony
  const CONFETTI = [[1, 0.84, 0.28], [0.95, 0.35, 0.3], [0.35, 0.7, 1], [1, 1, 1], [1, 0.55, 0.8], [0.45, 0.9, 0.5]];
  const CERE = 3.4; // seconds of camera orbit
  function confetti(x, y, z, n, spread, up) {
    const r = Math.random, f = App.tier === 'low' ? 0.4 : 1, m = Math.max(1, Math.round(n * f));
    if (S.cere) S.cere.beads += m;
    for (let i = 0; i < m; i++) App.fx.burst(x, y, z, 1, CONFETTI[(r() * CONFETTI.length) | 0], { speed: 3.2, up: up || 4.5, size: 0.12, life: 1.9, grav: 4.2, spread: spread || 2.2 });
  }
  function stepCeremony(dt) {
    const r = App.race, me = r && r.player >= 0 ? r.karts[r.player] : null;
    if (S.cere && S.cere.race !== r) S.cere = null;
    if (!S.cere && me && me.finished && App.scene === 'race' && r.mode !== 'row') {
      const place = r.finishOrder.indexOf(me.id) + 1 || me.place, cam = App.renderer.camera.position;
      const start = Math.atan2(cam.x - me.x, cam.z - me.z);
      S.cere = { race: r, t: 0, place, start, rad0: Math.min(9, Math.hypot(cam.x - me.x, cam.z - me.z)), acc: 0, beads: 0 };
      if (motionOn()) confetti(me.x, me.y + 2.6, me.z, place <= 3 ? 28 : 8, 1.6);
      else if (!App.reducedMotion) confetti(me.x, me.y + 2.6, me.z, 6, 1.4);
      else confetti(me.x, me.y + 2.6, me.z, 4, 1.2);
    }
    const C = S.cere; if (!C || !me) return;
    C.t += dt;
    if (C.t < 2.4 && C.place <= 3 && motionOn()) { C.acc += dt; while (C.acc > 0.12) { C.acc -= 0.12; confetti(me.x, me.y + 3.2, me.z, 6, 3.4, 2.5); } }
    if (App.camOverride || App.reducedMotion || C.t > CERE) return;
    const cam = App.renderer.camera, w = ease(0, 0.5, C.t) * (1 - ease(CERE - 0.9, CERE, C.t));
    const chaseP = cam.position.clone(), chaseQ = cam.quaternion.clone();
    const a = C.start + C.t * 0.85, rad = C.rad0 + (7.5 - C.rad0) * ease(0, 0.8, C.t);
    const px = me.x + Math.sin(a) * rad, pz = me.z + Math.cos(a) * rad;
    let py = me.y + 2.5 + 0.7 * Math.sin(C.t * 1.1);
    const g = App.track.surface(px, pz, me.s).h; if (py < g + 1.4) py = g + 1.4;
    cam.position.set(px, py, pz); cam.lookAt(me.x, me.y + 1.2, me.z);
    const orbitP = cam.position.clone(), orbitQ = cam.quaternion.clone();
    cam.position.lerpVectors(chaseP, orbitP, w); cam.quaternion.copy(chaseQ).slerp(orbitQ, w);
  }

  // ------------------------------------------------------------------ the podium
  const STEP = [{ h: 1.5, top: 0xF2C230, side: 0xC99A1C }, { h: 1.0, top: 0xCFD8DE, side: 0x9AA6AE }, { h: 0.62, top: 0xC98A4B, side: 0x9A6532 }];
  function numberTexture(n) {
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const x = c.getContext('2d'); x.font = '900 52px Georgia, serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.lineWidth = 8; x.strokeStyle = '#1E1B18'; x.strokeText(String(n), 32, 36); x.fillStyle = '#FFF6C8'; x.fillText(String(n), 32, 36);
    const t = new T.CanvasTexture(c); t.colorSpace = T.NoColorSpace; return t;
  }
  function blockGeo(w, d, h, base, topC, sideC) {
    const g = new T.BoxGeometry(w, h, d), col = new Float32Array(g.attributes.position.count * 3), C = new T.Color();
    for (let i = 0; i < col.length / 3; i++) {
      const ny = g.attributes.normal.getY(i), nz = Math.abs(g.attributes.normal.getZ(i));
      C.set(ny > 0.5 ? topC : sideC).multiplyScalar(ny > 0.5 ? 1 : nz > 0.5 ? 0.92 : 0.78);
      col.set([C.r, C.g, C.b], i * 3);
    }
    g.setAttribute('color', new T.BufferAttribute(col, 3));
    g.translate(0, base + h / 2, 0);
    return g;
  }
  function buildPodium(data) {
    const r = App.race, tr = App.track;
    if (!r || !tr || r.phase !== 'done' || data.mode === 'timetrial' || !data.results || data.results.length < 3) return;
    const top = data.results.slice(0, 3), s0 = Math.min(tr.length - 40, 16), c = tr.at(s0);
    const road = c.wl + c.wr, W = Math.max(3, Math.min(3.8, road / 3.3)), D = 3.6;
    const group = new T.Group(); group.name = 'podium';
    const fwd = Math.atan2(c.tx, c.tz), views = [], mats = [], geos = [], tex = [];
    const slots = [{ place: 0, u: 0 }, { place: 1, u: -1 }, { place: 2, u: 1 }];
    const bm = new T.MeshBasicMaterial({ vertexColors: true, fog: false }); mats.push(bm);
    const ctr = tr.point(s0, 0), gy = tr.heightAt(c, 0);
    for (const sl of slots) {
      const d = sl.u * (W + 0.25), p = tr.point(s0, d), base = tr.heightAt(c, d), st = STEP[sl.place];
      const geo = blockGeo(W, D, st.h, Math.min(0, gy - base) - 0.4, st.top, st.side); geos.push(geo);
      const m = new T.Mesh(geo, bm); m.position.set(p.x, base, p.z); m.rotation.y = fwd; m.frustumCulled = false; group.add(m);
      const nt = numberTexture(sl.place + 1); tex.push(nt);
      const nm = new T.MeshBasicMaterial({ map: nt, transparent: true, fog: false }); mats.push(nm);
      const np = new T.Mesh(new T.PlaneGeometry(0.9, 0.9), nm); geos.push(np.geometry);
      np.position.set(p.x + Math.sin(fwd) * (D / 2 + 0.02), base + st.h * 0.5, p.z + Math.cos(fwd) * (D / 2 + 0.02)); np.rotation.y = fwd; group.add(np);
      const t = top[sl.place], view = new A.KartView(T, t.team, { hero: true });
      group.add(view.mesh); group.add(view.shadow);
      views.push({ view, x: p.x, z: p.z, y: base + st.h, place: sl.place, team: t.team, human: !!t.human, k: { id: 0, vf: 0, yawRate: 0, drift: 0, steer: 0, boostT: 0, air: false, state: 'run', items: { towel: true, mat: true, soap: true, loofah: true }, runPhase: 0, water: { gal: 38, cap: 38, tf: 0, tr: 0 } } });
    }
    App.renderer.scene.add(group);
    document.body.dataset.podium = '1';
    S.pod = { race: r, group, views, mats, geos, tex, t: 0, ctr, gy, fwd, c, W, acc: 0, rectT: 0, rect: null, places: top.map((x) => x.place), done: false };
    for (const v of views) v.view.shadow.visible = true;
    const first = views[0];
    if (motionOn() || !App.reducedMotion) confetti(first.x, first.y + 3.4, first.z, App.reducedMotion ? 5 : 30, 3.6, 3);
  }
  function endPodium() {
    const P = S.pod; if (!P) return;
    App.renderer.scene.remove(P.group);
    for (const v of P.views) v.view.geo.dispose();
    P.geos.forEach((g) => g.dispose()); P.mats.forEach((m) => m.dispose()); P.tex.forEach((t) => t.dispose());
    for (const v of App.views) { v.mesh.visible = true; v.shadow.visible = true; }
    delete document.body.dataset.podium;
    S.pod = null;
  }
  function stepPodium(dt) {
    const P = S.pod; if (!P) return;
    if (App.scene !== 'race' || App.race !== P.race || App.screens.cur !== 'results') { endPodium(); return; }
    P.t += dt;
    const reduced = App.reducedMotion;
    // the race's own tubs step out of the picture; the podium's tubs take the contact blobs
    for (const v of App.views) { v.mesh.visible = false; v.shadow.visible = false; }
    for (const g of [App.ghostView, App.parView]) if (g) g.mesh.visible = false;
    for (const v of P.views) {
      const hop = reduced ? 0 : v.place === 0 ? Math.abs(Math.sin(P.t * 4.2)) * 0.14 : Math.sin(P.t * 2.4 + v.place) * 0.03 + 0.03;
      v.view.update(v.k, { x: v.x, y: v.y + hop, z: v.z, yaw: P.fwd + Math.PI + (reduced ? 0 : Math.sin(P.t * 0.6 + v.place) * 0.12), groundY: v.y }, dt, App.time);
    }
    App.footBlobs.set(P.views.map((v) => v.view));
    if (!reduced && P.t < 3.5 && motionOn()) { P.acc += dt; while (P.acc > 0.2) { P.acc -= 0.2; const f = P.views[0]; confetti(f.x, f.y + 3.4, f.z, 4, 3.6, 2.5); } }
    if (App.camOverride) return;
    // camera: in front of the podium, a slow sway, the podium pushed toward the side the panel leaves free
    const cam = App.renderer.camera, W = innerWidth, H = innerHeight, ar = W / H, wide = ar > 1.3, tall = ar < 0.8;
    const chaseP = cam.position.clone(), chaseQ = cam.quaternion.clone();
    // the free part of the picture is what the panel leaves: right of it on a wide screen, above it on a tall one
    P.rectT -= dt; if (P.rectT <= 0 || !P.rect) { P.rectT = 0.5; const el = document.querySelector('.panel.results'), b = el && el.getBoundingClientRect(); P.rect = b ? { r: b.right, t: b.top } : { r: 0, t: H }; }
    const vt = Math.tan(App.renderer.baseFov * Math.PI / 360), ht = vt * ar;
    const freeW = wide ? Math.max(0.3, (W - P.rect.r) / W - 0.07) : 1, freeH = tall ? Math.max(0.25, P.rect.t / H - 0.03) : 1;
    const podHalf = (3 * P.W + 0.5) / 2 + 2.6, rad = Math.max(10, podHalf / (ht * freeW), 4.2 / (vt * freeH));
    const sway = reduced ? 0 : Math.sin(P.t * 0.35) * 0.32;
    const f = [Math.sin(P.fwd), Math.cos(P.fwd)], n = [-f[1], f[0]];
    const ca = Math.cos(sway) * rad, cb = Math.sin(sway) * rad;
    const cx = P.ctr.x + f[0] * ca + n[0] * cb, cz = P.ctr.z + f[1] * ca + n[1] * cb;
    let cy = P.gy + (tall ? 4.4 : 3.4);
    const gh = App.track.surface(cx, cz, P.c.s).h; if (cy < gh + 1.5) cy = gh + 1.5;
    cam.position.set(cx, cy, cz);
    // right-hand side of the view = the camera's right: with the camera ahead of the podium looking back, that is -n
    const shift = wide ? rad * ht * (P.rect.r / W) : 0, drop = tall ? rad * vt * (1 - P.rect.t / H) : 0;
    cam.lookAt(P.ctr.x + n[0] * shift, P.gy + 2.2 - drop, P.ctr.z + n[1] * shift);
    const podP = cam.position.clone(), podQ = cam.quaternion.clone(), w = reduced ? 1 : ease(0, 1.3, P.t);
    cam.position.lerpVectors(chaseP, podP, w); cam.quaternion.copy(chaseQ).slerp(podQ, w);
    if (Math.abs(cam.fov - App.renderer.baseFov) > 0.05) { cam.fov = App.renderer.baseFov; cam.updateProjectionMatrix(); }
  }

  // ------------------------------------------------------------------ results banner
  const BANNERS = ['WINNER!', 'PODIUM FINISH', 'GOOD EFFORT'], PHRASE = ['You won', 'You finished on the podium', 'You finished, good effort'];
  function placeOf(data) { const h = (data.results || []).find((x) => x.human); return h ? h.place : 0; }
  function bannerIndex(data) { const p = placeOf(data); return !p || data.mode === 'timetrial' ? -1 : p === 1 ? 0 : p <= 3 ? 1 : 2; }

  // ------------------------------------------------------------------ the frame hook
  function tick() {
    if (S.dead) return;
    const now = App.time, frozen = App.paused || (App.testPaused && App.clock == null);
    const dt = frozen ? 0 : Math.min(0.25, Math.max(0, now - S.last)); S.last = now; S.clock += dt;
    if (App.world !== S.world) {
      S.world = App.world; S.kids = 0; S.near = 0;
      findEmitters(); bindCrowd(); buildBirds(); buildClouds();
    }
    if (!S.world) return;
    if (S.clouds.far !== App.renderer.camera.far) buildClouds();
    scanRoofs();
    stepSteam(dt); stepBirds();
    const cl = S.clouds, cam = App.renderer.camera.position;
    cl.group.position.copy(cam); if (motionOn()) cl.spin += dt * 0.012; cl.group.rotation.y = cl.spin;
    const C = S.cere && S.cere.race === App.race ? S.cere : null, big = S.pod || (C && C.place <= 3);
    stepCrowd(dt, big ? 70 : C ? 28 : 22, !!big);
    stepCeremony(dt);
    stepPodium(dt);
  }

  function install() {
    S.plume = makePlume();
    const R = App.renderer, orig = R.render.bind(R);
    R.render = function (t) {
      try { tick(); } catch (e) { S.dead = true; console.warn('finale off: ' + e.message); }
      return orig(t);
    };
    const sc = App.screens, show = sc.show.bind(sc);
    sc.show = function (name, data) {
      const ix = name === 'results' ? bannerIndex(data || {}) : -1;
      if (name === 'results') sc.app.banner = ix >= 0 ? BANNERS[ix] : null;
      const out = show(name, data);
      if (name === 'results') {
        const dlg = sc.root.querySelector('[role="dialog"]');
        if (dlg && ix >= 0) dlg.setAttribute('aria-label', 'Race results. ' + PHRASE[ix] + '.');
        if (!S.dead) { try { endPodium(); buildPodium(data || {}); } catch (e) { S.dead = true; console.warn('finale off: ' + e.message); } }
      }
      return out;
    };
    const st = document.createElement('style');
    st.textContent = 'body[data-podium] .scr-results{justify-content:flex-start;background:linear-gradient(90deg,rgba(10,16,26,.8) 0,rgba(10,16,26,.4) 50%,rgba(10,16,26,0) 100%)}'
      + '@media (max-aspect-ratio:4/5){body[data-podium] .scr-results .panel{margin-block:auto 0}body[data-podium] .scr-results{justify-content:center;align-items:flex-end;padding-bottom:max(10px,env(safe-area-inset-bottom));background:linear-gradient(180deg,rgba(10,16,26,0) 0,rgba(10,16,26,0) 34%,rgba(10,16,26,.78) 48%)}body[data-podium] .scr-results .panel{max-height:62dvh;overflow:auto}}';
    document.head.appendChild(st);
  }

  G.TR_FINALE = {
    state() {
      return {
        dead: S.dead, emitters: S.emit.map((e) => e.kind), live: S.plume ? S.plume.live : 0, steamOn: !!(S.plume && S.plume.pts.visible),
        cloudsOn: !!S.clouds, cloudSpin: S.clouds ? S.clouds.spin : 0, birdsOn: !!(S.birds && S.birds.mesh.visible),
        crowd: S.crowd ? { n: S.crowd.n, up: S.crowd.up } : null,
        ceremony: S.cere ? { t: S.cere.t, place: S.cere.place, beads: S.cere.beads } : null,
        podium: S.pod ? { places: S.pod.places, teams: S.pod.views.map((v) => v.team), t: S.pod.t } : null,
      };
    },
    banners: BANNERS,
  };
  install();
})(window);
