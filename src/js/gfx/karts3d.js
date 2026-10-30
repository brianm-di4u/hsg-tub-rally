// Tub racers: one draw per kart. The tub, wheels, flag, duck, captain and four attendants are rigid parts whose
// matrices are animated in code each frame (the N64 way: one matrix per body segment, no skinning).
// Real rules shown on every tub: five-person team (captain rides and steers, four attendants push, rule 5),
// each attendant holds their item (rule 7), pushers wear a head covering and suspenders (rule 10), a flag on a
// pole of at least 3 ft (rule 16) and a rubber duck in the tub (rule 19). Source: 2026 official rules.
import { Geo, hex, mul, mix } from './geom.js';
import { partMat } from './n64mat.js';
import { TEAM_BY_ID, DIVISIONS } from '../data/teams.js';

// part indices
const BODY = 0, WHEEL = [1, 2, 3, 4], FLAG = 5, DUCK = 6, CAP_T = 7, CAP_H = 8, CAP_LA = 9, CAP_RA = 10, WATER = 23;
const ATT = [[11, 12, 13], [14, 15, 16], [17, 18, 19], [20, 21, 22]]; // [torso, left leg, right leg]
// attendant rest positions (x, z) in kart space: forward is +z, the kart's right is -x
const ATT_POS = [[0.34, -1.32], [-0.34, -1.32], [0.92, -0.95], [-0.92, -0.95]];
const ITEM_COL = { towel: '#F4F1EA', mat: '#3FA8C0', soap: '#F7B6CE', loofah: '#D9B77A' };
const ITEM_ORDER = ['towel', 'mat', 'soap', 'loofah'];

function hatGeo(g, style, col, trim, y) {
  const C = hex(col), Tm = hex(trim);
  switch (style) {
    case 'helmet': g.ball([0, y + 0.05, 0], 0.19, C, 6, 3, 0.8); g.box([-0.2, y - 0.02, -0.26], [0.2, y + 0.02, -0.12], C); break;
    case 'turban': g.ball([0, y + 0.08, 0], 0.18, C, 6, 3, 0.9); g.ball([0, y + 0.2, 0], 0.1, C, 5, 2); break;
    case 'fedora': g.cyl([0, y, 0], 0.27, 0.27, 0.03, 8, C); g.cyl([0, y, 0], 0.15, 0.13, 0.17, 6, C, { top: C }); g.cyl([0, y + 0.02, 0], 0.152, 0.152, 0.04, 6, Tm); break;
    case 'snout': g.ball([0, y + 0.03, 0], 0.19, C, 6, 3, 0.8); g.box([-0.09, y - 0.08, 0.1], [0.09, y + 0.0, 0.42], C); g.box([-0.1, y - 0.01, 0.3], [-0.05, y + 0.04, 0.35], hex('#F4F1EA')); g.box([0.05, y - 0.01, 0.3], [0.1, y + 0.04, 0.35], hex('#F4F1EA')); break;
    case 'peaked': g.cyl([0, y, 0], 0.17, 0.18, 0.12, 6, C); g.box([-0.15, y, 0.08], [0.15, y + 0.03, 0.26], hex('#1D1D22')); break;
    case 'bike-helmet': g.ball([0, y + 0.04, 0], 0.2, C, 6, 3, 0.75); g.box([-0.03, y + 0.12, -0.2], [0.03, y + 0.2, 0.2], Tm); break;
    case 'antenna': g.cyl([0, y, 0], 0.17, 0.17, 0.06, 6, C); for (const s of [-1, 1]) { g.cyl([0.08 * s, y + 0.05, 0], 0.015, 0.015, 0.3, 3, C); g.ball([0.08 * s, y + 0.38, 0], 0.06, Tm, 4, 2); } break;
    case 'jockey': g.ball([0, y + 0.03, 0], 0.19, C, 6, 3, 0.85); g.box([-0.15, y - 0.01, 0.1], [0.15, y + 0.02, 0.27], C); g.ball([0, y + 0.2, 0], 0.04, Tm, 4, 2); break;
    case 'flat-brim': g.cyl([0, y, 0], 0.3, 0.3, 0.03, 8, C); g.cyl([0, y, 0], 0.15, 0.12, 0.17, 6, C); break;
    case 'cowboy': g.cyl([0, y, 0], 0.3, 0.32, 0.04, 8, C); g.cyl([0, y, 0], 0.15, 0.13, 0.19, 6, C); break;
    case 'beak': g.ball([0, y + 0.04, 0], 0.18, C, 6, 3, 0.85); g.box([-0.05, y - 0.05, 0.12], [0.05, y + 0.02, 0.36], hex('#2B2B33')); break;
    case 'headband': g.cyl([0, y - 0.06, 0], 0.172, 0.172, 0.06, 6, C); g.box([-0.03, y - 0.06, -0.26], [0.03, y - 0.0, -0.17], C); break;
    default: g.cyl([0, y, 0], 0.17, 0.17, 0.1, 6, C);
  }
}

function personGeo(g, colors, hatStyle, part, item) {
  // torso part: body (with suspenders), head, hat and arms reaching forward to the tub, with the held item
  const skin = hex(colors.skin), shirt = hex(colors.shirt), pants = hex('#3A3F4A'), sus = hex(colors.trim);
  g.setPart(part[0]);
  g.box([-0.2, 0.0, -0.12], [0.2, 0.55, 0.12], shirt, { front: shirt });
  g.box([-0.15, 0.0, 0.121], [-0.1, 0.55, 0.135], sus); g.box([0.1, 0.0, 0.121], [0.15, 0.55, 0.135], sus);
  g.box([-0.15, 0.0, -0.135], [-0.1, 0.55, -0.121], sus); g.box([0.1, 0.0, -0.135], [0.15, 0.55, -0.121], sus);
  g.ball([0, 0.72, 0], 0.15, skin, 6, 4);
  hatGeo(g, hatStyle, colors.hat, colors.trim, 0.82);
  // arms reaching forward (+z) and down toward the tub rim
  g.box([-0.28, 0.32, -0.05], [-0.2, 0.42, 0.42], shirt); g.box([0.2, 0.32, -0.05], [0.28, 0.42, 0.42], shirt);
  g.box([-0.28, 0.3, 0.42], [-0.19, 0.4, 0.5], skin); g.box([0.19, 0.3, 0.42], [0.28, 0.4, 0.5], skin);
  if (item) {
    const ic = hex(ITEM_COL[item]);
    if (item === 'towel') g.box([0.26, 0.05, 0.38], [0.32, 0.42, 0.52], ic);
    else if (item === 'mat') g.box([0.27, 0.12, 0.3], [0.31, 0.46, 0.6], ic);
    else if (item === 'soap') g.box([0.24, 0.42, 0.42], [0.36, 0.49, 0.52], ic);
    else g.ball([0.3, 0.38, 0.47], 0.08, ic, 4, 2);
  }
  // legs (pivot at the hip, y = 0 in leg space)
  for (let s = 0; s < 2; s++) {
    g.setPart(part[1 + s]);
    const x0 = s === 0 ? 0.02 : -0.18;
    g.box([x0, -0.55, -0.08], [x0 + 0.16, 0, 0.08], pants);
    g.box([x0 - 0.01, -0.62, -0.06], [x0 + 0.17, -0.55, 0.16], hex('#2A2A30'));
  }
}

export function buildKartGeo(THREE, teamId) {
  const team = TEAM_BY_ID[teamId];
  const C = team.colors, div = DIVISIONS[team.div];
  const g = new Geo();
  const tub = hex(C.tub), trim = hex(C.trim), inner = mix(hex(C.tub), [1, 1, 1], 0.65), iron = hex('#3B3B42');
  // --- body: frame, axles, tub shell (a rounded 8-sided bowl), rim, feet
  g.setPart(BODY);
  g.box([-0.5, 0.28, -0.75], [0.5, 0.36, 0.75], iron);
  for (const z of [-0.6, 0.6]) g.box([-0.58, 0.26, z - 0.04], [0.58, 0.32, z + 0.04], iron);
  const L = 0.86, W = 0.42, y0 = 0.42, y1 = 1.02, seg = 10;
  const ring = (rx, rz, y) => Array.from({ length: seg }, (_, i) => { const a = (i / seg) * Math.PI * 2; return [Math.sin(a) * rx, y, Math.cos(a) * rz]; });
  const bot = ring(W * 0.78, L * 0.82, y0), top = ring(W, L, y1), lip = ring(W * 1.08, L * 1.05, y1 + 0.03), inn = ring(W * 0.86, L * 0.9, y1 - 0.02), innBot = ring(W * 0.7, L * 0.78, y0 + 0.12);
  for (let i = 0; i < seg; i++) {
    const j = (i + 1) % seg;
    g.quad(bot[j], bot[i], top[i], top[j], tub);
    g.quad(top[j], top[i], lip[i], lip[j], trim);
    g.quad(lip[j], lip[i], inn[i], inn[j], mul(trim, 0.9));
    g.quad(inn[j], inn[i], innBot[i], innBot[j], inner);
    g.tri(bot[i], bot[j], [0, y0, 0], mul(tub, 0.6));
  }
  // claw feet (Traditional) or a moulded skirt
  if (div.id === 'traditional') for (const [x, z] of [[0.3, 0.6], [-0.3, 0.6], [0.3, -0.6], [-0.3, -0.6]]) g.box([x - 0.06, 0.34, z - 0.06], [x + 0.06, 0.48, z + 0.06], trim);
  else g.box([-0.36, 0.36, -0.7], [0.36, 0.46, 0.7], mul(tub, 0.8));
  // team pennant colour band down the side
  g.box([-W - 0.005, 0.7, -0.4], [-W + 0.02, 0.8, 0.4], hex(C.flag));
  g.box([W - 0.02, 0.7, -0.4], [W + 0.005, 0.8, 0.4], hex(C.flag));
  // --- wheels (pivot at the hub)
  WHEEL.forEach((p) => {
    g.setPart(p);
    const r = 0.3, seg2 = 8;
    for (let i = 0; i < seg2; i++) {
      const a0 = (i / seg2) * Math.PI * 2, a1 = ((i + 1) / seg2) * Math.PI * 2;
      const P = (a, x) => [x, Math.sin(a) * r, Math.cos(a) * r];
      g.quad(P(a0, -0.07), P(a0, 0.07), P(a1, 0.07), P(a1, -0.07), hex('#26262C'));
      g.tri(P(a1, 0.071), P(a0, 0.071), [0.071, 0, 0], i % 2 ? trim : hex('#D8D8D0'));
      g.tri(P(a0, -0.071), P(a1, -0.071), [-0.071, 0, 0], i % 2 ? trim : hex('#D8D8D0'));
    }
  });
  // --- flag on a pole (pivot at the pole base on the rim)
  g.setPart(FLAG);
  g.cyl([0, 0, 0], 0.025, 0.02, 1.25, 4, hex('#D8D8D0'));
  const fc = hex(C.flag);
  g.quad([0, 0.85, 0], [0, 0.85, -0.55], [0, 1.2, -0.55], [0, 1.2, 0], fc);
  g.quad([0, 1.2, 0], [0, 1.2, -0.55], [0, 0.85, -0.55], [0, 0.85, 0], mul(fc, 0.85));
  // --- rubber duck on the rim
  g.setPart(DUCK);
  const yel = hex('#F5D547');
  g.ball([0, 0.08, 0], 0.09, yel, 6, 3); g.ball([0, 0.2, 0.05], 0.06, yel, 5, 3); g.box([-0.025, 0.18, 0.1], [0.025, 0.21, 0.16], hex('#F07F22'));
  // --- captain (sits in the tub; torso pivot at the seat)
  g.setPart(CAP_T);
  g.box([-0.2, 0, -0.13], [0.2, 0.45, 0.13], hex(C.cap));
  g.setPart(CAP_H);
  g.ball([0, 0.12, 0], 0.16, hex(C.skin), 6, 4);
  hatGeo(g, team.hat, C.hat, C.trim, 0.22);
  for (const [part, s] of [[CAP_LA, 1], [CAP_RA, -1]]) {
    g.setPart(part);
    g.box([-0.045, -0.04, 0], [0.045, 0.05, 0.38], hex(C.cap));
    g.box([-0.05, -0.05, 0.36], [0.05, 0.06, 0.45], hex(C.skin));
  }
  // --- attendants
  ATT.forEach((parts, i) => personGeo(g, C, team.hat, parts, ITEM_ORDER[i]));
  // --- water surface (unit disc, scaled per frame)
  g.setPart(WATER);
  const wcol = hex('#5FB8D8');
  for (let i = 0; i < seg; i++) {
    const a0 = (i / seg) * Math.PI * 2, a1 = ((i + 1) / seg) * Math.PI * 2;
    g.tri([Math.sin(a0) * W * 0.86, 0, Math.cos(a0) * L * 0.9], [Math.sin(a1) * W * 0.86, 0, Math.cos(a1) * L * 0.9], [0, 0, 0], i % 2 ? wcol : mul(wcol, 1.12));
  }
  return g.build(THREE, { parts: true });
}

const _m = () => new window.THREE.Matrix4();

export class KartView {
  constructor(THREE, teamId, opts = {}) {
    this.THREE = THREE;
    this.geo = buildKartGeo(THREE, teamId);
    this.mat = partMat(opts.ghost ? { transparent: true, alpha: 0.42, depthWrite: false } : {});
    this.mesh = new THREE.Mesh(this.geo, this.mat);
    this.mesh.frustumCulled = false;
    this.mesh.matrixAutoUpdate = false;
    this.wheelA = 0; this.roll = 0; this.pitch = 0; this.flash = 0; this.circleA = 0;
    this.tmp = { m: new THREE.Matrix4(), q: new THREE.Quaternion(), e: new THREE.Euler(), v: new THREE.Vector3(), s: new THREE.Vector3(1, 1, 1) };
    // shadow blob
    const sg = new THREE.CircleGeometry(1, 10);
    sg.rotateX(-Math.PI / 2);
    this.shadow = new THREE.Mesh(sg, new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.32, depthWrite: false }));
    this.shadow.scale.set(0.9, 1, 1.5);
    this.shadow.renderOrder = 1;
  }
  setPart(i, x, y, z, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) {
    const t = this.tmp;
    t.e.set(rx, ry, rz, 'YXZ');
    t.q.setFromEuler(t.e);
    t.v.set(x, y, z); t.s.set(sx, sy, sz);
    this.mat.uniforms.uParts.value[i].compose(t.v, t.q, t.s);
  }
  // k: kart sim state (interpolated pose passed separately), dt: frame time
  update(k, pose, dt, time) {
    const { x, y, z, yaw } = pose;
    const v = k.vf;
    // body attitude: lean out in turns/slides, pitch with acceleration, bounce with speed
    const rollT = Math.max(-0.22, Math.min(0.22, -k.yawRate * Math.abs(v) * 0.012 + (k.drift ? k.drift * 0.12 : 0)));
    this.roll += (rollT - this.roll) * Math.min(1, dt * 8);
    const pitchT = k.boostT > 0 ? -0.06 : 0;
    this.pitch += (pitchT - this.pitch) * Math.min(1, dt * 6);
    const bounce = Math.abs(v) > 1 ? Math.sin(time * 18 + k.id) * 0.012 * Math.min(1, Math.abs(v) / 10) : 0;
    const driftYaw = k.drift ? k.drift * -0.32 : 0;
    const M = this.mesh.matrix;
    this.tmp.e.set(this.pitch, yaw + driftYaw * 0.6, this.roll, 'YXZ');
    this.tmp.q.setFromEuler(this.tmp.e);
    this.tmp.v.set(x, y + bounce, z);
    M.compose(this.tmp.v, this.tmp.q, this.tmp.s.set(1, 1, 1));
    this.mesh.matrixWorldNeedsUpdate = true;
    this.shadow.position.set(x, pose.groundY + 0.05, z);
    this.shadow.rotation.y = yaw;
    this.shadow.material.opacity = k.air ? 0.18 : 0.32;
    // parts
    this.setPart(BODY, 0, 0, 0);
    this.wheelA += (v / 0.3) * dt;
    const wp = [[0.55, 0.3, 0.6], [-0.55, 0.3, 0.6], [0.55, 0.3, -0.6], [-0.55, 0.3, -0.6]];
    const steerA = -k.steer * 0.35;
    WHEEL.forEach((p, i) => this.setPart(p, wp[i][0], wp[i][1], wp[i][2], this.wheelA, i < 2 ? steerA : 0, 0));
    const sway = Math.sin(time * 6 + k.id) * 0.15 + Math.min(0.5, Math.abs(v) * 0.02);
    this.setPart(FLAG, -0.3, 1.0, -0.72, 0, sway * 0.6, 0);
    this.setPart(DUCK, 0.3, 1.03 + Math.abs(Math.sin(time * 5 + k.id)) * 0.04, 0.72, 0, 0.4, Math.sin(time * 3) * 0.1);
    // captain: steering arms and a lean
    const lean = -k.steer * 0.2;
    const fl = k.state === 'circle' || k.state === 'rescue';
    this.setPart(CAP_T, 0, 0.62, -0.1, 0.05, 0, lean);
    this.setPart(CAP_H, Math.sin(lean) * -0.45, 1.12, -0.06 + 0.02, 0, -k.steer * 0.3, lean * 0.5);
    const armUp = fl ? -1.2 + Math.sin(time * 14) * 0.6 : -0.15;
    this.setPart(CAP_LA, 0.24, 0.98, -0.02, armUp - k.steer * 0.25, 0, 0);
    this.setPart(CAP_RA, -0.24, 0.98, -0.02, (fl ? -1.2 - Math.sin(time * 14) * 0.6 : -0.15) + k.steer * 0.25, 0, 0);
    // attendants: push-run behind the tub, or circle it after a fumble (real rule 7)
    const ph = k.runPhase;
    const circling = k.state === 'circle';
    if (circling) this.circleA += dt * (Math.PI * 2 / 1.4); else this.circleA = 0;
    ATT.forEach((parts, i) => {
      let [ax, az] = ATT_POS[i];
      let face = 0, leanF = Math.min(0.5, 0.15 + Math.abs(v) * 0.02);
      if (circling) {
        const a = this.circleA + (i * Math.PI) / 2 + Math.atan2(ax, az);
        ax = Math.sin(a) * 1.45; az = Math.cos(a) * 1.6;
        face = a + Math.PI / 2; leanF = 0.2;
      }
      const dropped = k.items && !k.items[ITEM_ORDER[i]];
      const swing = Math.sin(ph * 2 + i * 1.7) * (Math.abs(v) > 0.5 || circling ? 0.75 : 0.05);
      const hop = Math.abs(Math.sin(ph * 2 + i * 1.7)) * (Math.abs(v) > 0.5 || circling ? 0.07 : 0);
      this.setPart(parts[0], ax, 0.64 + hop, az, leanF, face, 0, 1, 1, dropped ? 0.96 : 1);
      // legs follow the torso position and facing
      const lx = (s) => ax + Math.cos(face) * (s === 0 ? 0.1 : -0.1) * 0, lz = az;
      this.setPart(parts[1], lx(0), 0.64 + hop, lz, swing, face, 0);
      this.setPart(parts[2], lx(1), 0.64 + hop, lz, -swing, face, 0);
    });
    // water surface: height from fill, tilt from the slosh state
    const w = k.water, fill = w.cap ? w.gal / w.cap : 0;
    const wy = 0.5 + 0.48 * fill;
    this.setPart(WATER, 0, wy, 0, -w.tf * 0.8, 0, w.tr * 0.8, 1, 1, fill > 0.02 ? 0.95 : 0.0001);
    // hit flash
    this.flash = Math.max(0, this.flash - dt * 3);
    this.mat.uniforms.uFlash.value.setScalar(this.flash * 0.6);
  }
}
