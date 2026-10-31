// Tub racers as brick toys: one draw per kart (plus its see-through water). The tub, wheels, flag, duck, captain
// and four attendants are rigid parts whose matrices are animated in code each frame (one matrix per part, no
// skinning: a toy's parts don't bend). Parts are moulded plastic: rounded boxes with bevels that catch the light,
// studs on hats, rim and chassis, printed faces and printed team uniforms (an atlas drawn in code). Figures are
// original brick figures: rounded-cube heads, box torsos, block arms with mitten hands, block legs (never the
// cylinder-head / C-hand / trapezoid-torso minifigure shape).
// Real rules shown on every tub: five-person team (captain rides and steers, four attendants push, rule 5), each
// attendant holds their item (rule 7), pushers wear a head covering and suspenders (rule 10), a flag on a pole of
// at least 3 ft (rule 16) and a rubber duck in the tub (rule 19). Source: 2026 official rules.
import { Geo, hex, mul, mix } from './geom.js';
import { partMat, MAX_PARTS, shadowsOn, PAL } from './brickmat.js';
import { partDepthMat } from './shadows.js';
import { crewReady, buildCrewGeo, crewAtlas, crewPivots } from './crew3d.js';
import { TEAM_BY_ID, TEAMS, DIVISIONS } from '../data/teams.js';

// part indices
const PLAYER_GOLD = '#FFC92E';
const BODY = 0, WHEEL = [1, 2, 3, 4], FLAG = 5, DUCK = 6, CAP_T = 7, CAP_H = 8, CAP_LA = 9, CAP_RA = 10, WATER = 23;
const ATT = [[11, 12, 13], [14, 15, 16], [17, 18, 19], [20, 21, 22]]; // [torso, left leg, right leg]
// attendant rest positions (x, z) in kart space: forward is +z, the kart's right is -x
const ATT_POS = [[0.62, -1.3], [-0.62, -1.3], [0.98, -0.72], [-0.98, -0.72]];
const ITEM_COL = { towel: '#F4F4F4', mat: '#36AEBF', soap: '#E4ADC8', loofah: '#D09168' };
const ITEM_ORDER = ['towel', 'mat', 'soap', 'loofah'];

// detail per tier: bevel steps for torsos and hats (seg), heads, limbs and hands, stud and cylinder segments;
// budgets per figure and tub in tools/perf-budgets.json (reviews/PERF.md)
export const CREW_DETAIL = {
  high: { seg: 3, head: 4, limb: 2, hand: 3, stud: 16, cyl: 20 },
  medium: { seg: 2, head: 3, limb: 1, hand: 2, stud: 12, cyl: 16 },
  low: { seg: 1, head: 1, limb: 0, hand: 0, stud: 0, cyl: 8 },
  far: { seg: 1, head: 1, limb: 0, hand: 0, stud: 0, cyl: 8 },
  lowFar: { seg: 0, head: 0, limb: 0, hand: 0, stud: 0, cyl: 6 },
};
let DETAIL = CREW_DETAIL.medium, FAR = CREW_DETAIL.far, FAR_AT = 32, lodCam = null, clearWater = true;
// Blender crews (crew3d.js), when their pack loaded: LOD per tier for near and far tubs
const CREW_LOD = { high: [1, 2], medium: [1, 2], low: [2, 3] };
let LOD = CREW_LOD.medium;
// set once at boot from the quality tier; the camera decides near/far per tub each frame
export function setCrewDetail(tier, camera) { DETAIL = CREW_DETAIL[tier] || CREW_DETAIL.medium; FAR = tier === 'low' ? CREW_DETAIL.lowFar : CREW_DETAIL.far; LOD = CREW_LOD[tier] || CREW_LOD.medium; clearWater = tier !== 'low'; FAR_AT = tier === 'low' ? 22 : tier === 'high' ? 40 : 24; lodCam = camera; }

// rest pivots the animation works from: the code-built crews' layout, or the Blender crews' (crewPivots(): part
// name → { p: position, r: YXZ Euler }), whose captain parts carry their own scale and whose side attendants are
// turned in by their rest yaw
const LEGACY_PIVOTS = { wheels: [[0.56, 0.3, 0.6], [-0.56, 0.3, 0.6], [0.56, 0.3, -0.6], [-0.56, 0.3, -0.6]], flag: [-0.3, 1.0, -0.72], duck: [0.3, 1.05, 0.72],
  capT: [0, 0.72, -0.1], capRx: 0.05, capS: 1.12, capH: [0, 1.22, -0.06], headS: 1.2, arms: [[0.27, 1.12, -0.02], [-0.27, 1.12, -0.02]], armRx: -0.15,
  att: ATT_POS.map(([x, z]) => [x, 0.66, z, 0]), water: 0.46 };
function packPivots() {
  const P = crewPivots(), p = (n) => P[n].p;
  return { wheels: [0, 1, 2, 3].map((i) => p('wheel_' + i)), flag: p('flag'), duck: p('duck'), capT: p('cap_torso'), capRx: P.cap_torso.r[0], capS: 1,
    capH: p('cap_head'), headS: 1, arms: [p('cap_arm_l'), p('cap_arm_r')], armRx: P.cap_arm_l.r[0],
    att: [0, 1, 2, 3].map((i) => [...p('att' + i + '_torso'), P['att' + i + '_torso'].r[1]]), water: 0.48 };
}

// ---------- print atlas: faces and team uniforms, drawn in code (512 px, 8×8 cells of 64; cell 0,0 transparent) ----------
const CELL = 64, ATLAS = 512;
let atlasTex = null;
const cellUV = (cx, cy, inset = 3) => [(cx * CELL + inset) / ATLAS, 1 - (cy * CELL + CELL - inset) / ATLAS, (cx * CELL + CELL - inset) / ATLAS, 1 - (cy * CELL + inset) / ATLAS];
const FACE_CELL = { smile: [1, 0], grit: [2, 0], shout: [3, 0], grin: [4, 0] };
const teamCell = (teamId) => { const i = Math.max(0, TEAMS.findIndex((t) => t.id === teamId)); return [i % 8, 1 + Math.floor(i / 8)]; };
const backCell = (teamId) => { const [cx, cy] = teamCell(teamId); return [cx, cy + 2]; };

function drawFace(x, kind) {
  const ink = '#1E1B18';
  x.fillStyle = ink;
  // eyes: tall ovals with a white glint
  for (const ex of [22, 42]) { x.beginPath(); x.ellipse(ex, 27, 4.2, 6, 0, 0, Math.PI * 2); x.fill(); }
  x.fillStyle = '#FFFFFF';
  for (const ex of [23.5, 43.5]) { x.beginPath(); x.arc(ex, 24.5, 1.6, 0, Math.PI * 2); x.fill(); }
  // brows
  x.strokeStyle = ink; x.lineWidth = 2.6; x.lineCap = 'round';
  const brow = (x0, y0, x1, y1) => { x.beginPath(); x.moveTo(x0, y0); x.lineTo(x1, y1); x.stroke(); };
  if (kind === 'grit') { brow(16, 15, 27, 19); brow(48, 15, 37, 19); } else if (kind === 'shout') { brow(16, 14, 27, 13); brow(48, 14, 37, 13); } else { brow(17, 16, 27, 15); brow(47, 16, 37, 15); }
  // cheeks
  x.fillStyle = 'rgba(228,110,110,0.35)';
  for (const cx of [14, 50]) { x.beginPath(); x.arc(cx, 38, 4.5, 0, Math.PI * 2); x.fill(); }
  // mouth
  x.fillStyle = ink; x.strokeStyle = ink; x.lineWidth = 3;
  if (kind === 'smile') { x.beginPath(); x.arc(32, 36, 10, 0.2 * Math.PI, 0.8 * Math.PI); x.stroke(); }
  else if (kind === 'grit') { x.beginPath(); x.moveTo(23, 45); x.quadraticCurveTo(32, 42, 41, 45); x.stroke(); }
  else if (kind === 'shout') { x.beginPath(); x.ellipse(32, 46, 7, 6, 0, 0, Math.PI * 2); x.fill(); x.fillStyle = '#C64B4B'; x.beginPath(); x.ellipse(32, 49, 4, 2.5, 0, 0, Math.PI * 2); x.fill(); }
  else { x.beginPath(); x.moveTo(20, 41); x.quadraticCurveTo(32, 54, 44, 41); x.closePath(); x.fill(); x.fillStyle = '#FFFFFF'; x.fillRect(23, 41, 18, 3.5); }
}
// a team uniform front: collar, suspenders (rule 10), belt and a badge in the team's flag colour
function drawUniform(x, team) {
  const C = team.colors;
  x.fillStyle = C.skin; x.beginPath(); x.moveTo(24, 0); x.lineTo(40, 0); x.lineTo(32, 13); x.closePath(); x.fill();
  x.fillStyle = 'rgba(0,0,0,0.25)'; x.fillRect(31, 13, 2, 44);
  x.fillStyle = C.trim; x.fillRect(13, 0, 7, 64); x.fillRect(44, 0, 7, 64);
  x.fillStyle = 'rgba(0,0,0,0.35)'; x.fillRect(13, 0, 1.5, 64); x.fillRect(49.5, 0, 1.5, 64);
  x.fillStyle = '#2B2E33'; x.fillRect(0, 54, 64, 10); x.fillStyle = C.trim; x.fillRect(28, 54, 8, 10);
  // badge with a simple emblem shape per team (no lettering)
  x.fillStyle = C.flag; x.strokeStyle = '#1E1B18'; x.lineWidth = 1.5;
  x.beginPath(); x.arc(38, 26, 7, 0, Math.PI * 2); x.fill(); x.stroke();
  x.fillStyle = '#FFFFFF';
  const e = team.emblem || '';
  x.beginPath();
  if (/star|badge/.test(e)) { for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 2 : 4.6; x.lineTo(38 + Math.cos(a) * r, 26 + Math.sin(a) * r); } }
  else if (/card|horseshoe|moon/.test(e)) { x.moveTo(38, 21); x.lineTo(42, 26); x.lineTo(38, 31); x.lineTo(34, 26); }
  else x.arc(38, 26, 3, 0, Math.PI * 2);
  x.fill();
}
// the uniform's back: crossed suspenders and a team-colour yoke, what the chase camera sees most
function drawBack(x, team) {
  const C = team.colors;
  x.fillStyle = C.flag; x.fillRect(0, 0, 64, 9);
  x.strokeStyle = C.trim; x.lineWidth = 7; x.lineCap = 'butt';
  x.beginPath(); x.moveTo(12, 0); x.lineTo(50, 54); x.moveTo(52, 0); x.lineTo(14, 54); x.stroke();
  x.strokeStyle = 'rgba(0,0,0,0.3)'; x.lineWidth = 1.2;
  x.beginPath(); x.moveTo(9, 0); x.lineTo(47, 54); x.moveTo(55, 0); x.lineTo(17, 54); x.stroke();
  x.fillStyle = '#2B2E33'; x.fillRect(0, 54, 64, 10);
}
export function printAtlas(THREE) {
  if (atlasTex) return atlasTex;
  const c = document.createElement('canvas'); c.width = c.height = ATLAS;
  const x = c.getContext('2d');
  for (const [k, [cx, cy]] of Object.entries(FACE_CELL)) { x.save(); x.translate(cx * CELL, cy * CELL); drawFace(x, k); x.restore(); }
  TEAMS.forEach((t) => {
    for (const [cell, draw] of [[teamCell(t.id), drawUniform], [backCell(t.id), drawBack]]) { const [cx, cy] = cell; x.save(); x.beginPath(); x.rect(cx * CELL, cy * CELL, CELL, CELL); x.clip(); x.translate(cx * CELL, cy * CELL); draw(x, t); x.restore(); }
  });
  atlasTex = new THREE.CanvasTexture(c);
  atlasTex.colorSpace = THREE.NoColorSpace;
  atlasTex.anisotropy = 4;
  return atlasTex;
}

// ---------- geometry ----------
// smooth lofted bowl: rings of [rx, rz, y], normals from finite differences
function loft(g, rings, seg, col, outward = true) {
  const P = (r, i) => { const a = (i / seg) * Math.PI * 2, R = rings[r]; return [Math.sin(a) * R[0], R[2], Math.cos(a) * R[1]]; };
  const N = (r, i) => {
    const a = P(r, (i + 1) % seg), b = P(r, (i - 1 + seg) % seg), c = P(Math.min(rings.length - 1, r + 1), i), d = P(Math.max(0, r - 1), i);
    const u = [a[0] - b[0], a[1] - b[1], a[2] - b[2]], v = [c[0] - d[0], c[1] - d[1], c[2] - d[2]];
    let n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    const l = Math.hypot(...n) || 1; n = n.map((q) => q / l);
    return outward ? n : n.map((q) => -q);
  };
  for (let r = 0; r < rings.length - 1; r++) for (let i = 0; i < seg; i++) {
    const j = (i + 1) % seg;
    const [a, b, c, d] = [P(r, i), P(r, j), P(r + 1, j), P(r + 1, i)];
    const [na, nb, nc, nd] = [N(r, i), N(r, j), N(r + 1, j), N(r + 1, i)];
    if (outward) { g.triN(a, b, c, na, nb, nc, col); g.triN(a, c, d, na, nc, nd, col); }
    else { g.triN(a, c, b, na, nc, nb, col); g.triN(a, d, c, na, nd, nc, col); }
  }
}

function hatGeo(g, style, col, trim, y, D) {
  const C = hex(col), Tm = hex(trim), s = D.seg, s1 = D.head > D.seg ? s + 1 : s, cy = D.cyl, st = D.stud, black = hex(PAL.black), white = hex(PAL.white);
  const stud = (yy, c = C) => { if (st) g.stud([0, yy, 0], 0.07, 0.035, st, c); };
  switch (style) {
    case 'helmet': // firefighter: dome, long back brim, front shield
      g.rbox([-0.18, y - 0.02, -0.17], [0.18, y + 0.16, 0.17], C, 0.09, s1);
      g.rbox([-0.2, y - 0.03, -0.32], [0.2, y + 0.01, -0.1], C, 0.015, s);
      g.rbox([-0.06, y + 0.0, 0.15], [0.06, y + 0.13, 0.19], Tm, 0.015, s);
      stud(y + 0.16); break;
    case 'turban':
      g.rbox([-0.17, y - 0.04, -0.16], [0.17, y + 0.14, 0.16], C, 0.08, s1);
      g.rbox([-0.05, y + 0.1, 0.08], [0.05, y + 0.2, 0.17], Tm, 0.03, s); break;
    case 'fedora':
      g.scyl([0, y - 0.01, 0], 0.27, 0.03, cy, C);
      g.rbox([-0.15, y + 0.02, -0.14], [0.15, y + 0.19, 0.14], C, 0.05, s);
      g.rbox([-0.155, y + 0.02, -0.145], [0.155, y + 0.06, 0.145], Tm, 0.015, s); break;
    case 'snout': // gator: cap with a long snout and teeth
      g.rbox([-0.17, y - 0.03, -0.16], [0.17, y + 0.12, 0.16], C, 0.07, s1);
      g.rbox([-0.09, y - 0.06, 0.1], [0.09, y + 0.03, 0.44], C, 0.035, s);
      for (const x of [-0.07, 0.07]) g.rbox([x - 0.02, y - 0.09, 0.3], [x + 0.02, y - 0.05, 0.4], white, 0.01, Math.min(1, s));
      for (const x of [-0.05, 0.05]) g.rbox([x - 0.025, y + 0.1, 0.06], [x + 0.025, y + 0.15, 0.11], black, 0.02, Math.min(1, s)); break;
    case 'peaked': // police cap: crown, black visor, badge
      g.scyl([0, y - 0.02, 0], 0.17, 0.13, cy, C, { r1: 0.19 });
      g.rbox([-0.15, y - 0.01, 0.08], [0.15, y + 0.02, 0.28], black, 0.015, s);
      g.rbox([-0.03, y + 0.04, 0.17], [0.03, y + 0.09, 0.2], hex(PAL.yellow), 0.01, Math.min(1, s));
      stud(y + 0.11); break;
    case 'bike-helmet':
      g.rbox([-0.19, y - 0.02, -0.22], [0.19, y + 0.15, 0.2], C, 0.09, s1);
      g.rbox([-0.03, y + 0.12, -0.2], [0.03, y + 0.19, 0.18], Tm, 0.02, s); break;
    case 'antenna':
      g.scyl([0, y - 0.03, 0], 0.17, 0.07, cy, C);
      for (const sx of [-1, 1]) { g.scyl([0.08 * sx, y + 0.04, 0], 0.015, 0.3, Math.max(6, cy >> 1), C); g.rbox([0.08 * sx - 0.06, y + 0.32, -0.06], [0.08 * sx + 0.06, y + 0.44, 0.06], Tm, 0.05, s); } break;
    case 'jockey':
      g.rbox([-0.17, y - 0.03, -0.16], [0.17, y + 0.13, 0.16], C, 0.08, s1);
      g.rbox([-0.14, y - 0.01, 0.1], [0.14, y + 0.02, 0.28], C, 0.015, s);
      stud(y + 0.13, Tm); break;
    case 'flat-brim': // ranger campaign hat: wide flat brim, pinched crown
      g.scyl([0, y - 0.01, 0], 0.31, 0.025, cy, C);
      g.scyl([0, y + 0.01, 0], 0.15, 0.19, cy, C, { r1: 0.07 });
      g.scyl([0, y + 0.01, 0], 0.152, 0.035, cy, Tm, { noTop: true }); break;
    case 'cowboy': // wide brim curling up, creased crown
      g.scyl([0, y - 0.01, 0], 0.32, 0.03, cy, C);
      for (const sx of [-1, 1]) g.rbox([0.24 * sx - 0.07, y + 0.01, -0.12], [0.24 * sx + 0.07, y + 0.08, 0.12], C, 0.03, s);
      g.rbox([-0.14, y + 0.01, -0.13], [0.14, y + 0.21, 0.13], C, 0.06, s);
      g.rbox([-0.03, y + 0.17, -0.13], [0.03, y + 0.22, 0.13], mul(C, 0.8), 0.02, Math.min(1, s)); break;
    case 'beak': // flamingo: cap with a dark hooked beak
      g.rbox([-0.17, y - 0.03, -0.16], [0.17, y + 0.13, 0.16], C, 0.08, s1);
      g.rbox([-0.05, y - 0.04, 0.12], [0.05, y + 0.04, 0.34], hex(PAL.black), 0.025, s);
      g.rbox([-0.04, y - 0.1, 0.28], [0.04, y - 0.02, 0.36], hex(PAL.black), 0.02, Math.min(1, s)); break;
    case 'headband': // ninja: band round the head, knot tails behind
      g.scyl([0, y - 0.1, 0], 0.168, 0.07, cy, C, { noTop: true });
      g.rbox([-0.03, y - 0.1, -0.3], [0.03, y - 0.03, -0.16], C, 0.015, s);
      g.rbox([0.02, y - 0.16, -0.32], [0.07, y - 0.09, -0.2], C, 0.015, s); break;
    default:
      g.rbox([-0.17, y - 0.03, -0.16], [0.17, y + 0.1, 0.16], C, 0.06, s);
  }
}

// one brick figure in part space: torso part (hip, torso with uniform print, head with face print, hat, arms,
// mitten hands, held item) and two legs (pivot at the hip)
function figureGeo(g, D, team, parts, item, face) {
  const C = team.colors, skin = hex(C.skin), shirt = hex(C.shirt), pants = hex(PAL.black), shoe = hex('#2B2E33');
  const s = D.seg, l = D.limb, uni = cellUV(...teamCell(team.id)), fc = cellUV(...FACE_CELL[face]);
  g.setPart(parts[0]);
  g.rbox([-0.19, -0.04, -0.11], [0.19, 0.07, 0.11], pants, 0.02, l);
  g.rbox([-0.2, 0.07, -0.12], [0.2, 0.55, 0.12], shirt, 0.03, s, { print: uni, printBack: cellUV(...backCell(team.id)) });
  g.scyl([0, 0.55, 0], 0.07, 0.06, Math.max(6, D.cyl >> 1), skin);
  g.rbox([-0.155, 0.6, -0.14], [0.155, 0.9, 0.14], skin, 0.07, D.head, { print: fc });
  hatGeo(g, team.hat, C.hat, C.trim, 0.9, D);
  for (const sx of [-1, 1]) {
    const x0 = sx > 0 ? 0.2 : -0.29, x1 = sx > 0 ? 0.29 : -0.2;
    g.rbox([x0, 0.31, -0.06], [x1, 0.44, 0.4], shirt, 0.025, l);
    g.rbox([x0 - 0.008, 0.29, 0.38], [x1 + 0.008, 0.45, 0.51], skin, 0.035, D.hand);
  }
  if (item) {
    const ic = hex(ITEM_COL[item]);
    if (item === 'towel') { g.rbox([0.27, 0.06, 0.4], [0.33, 0.44, 0.52], ic, 0.02, l); g.rbox([0.275, 0.12, 0.395], [0.325, 0.16, 0.525], hex(PAL.red), 0.01, 0); }
    else if (item === 'mat') g.rbox([0.28, 0.12, 0.3], [0.32, 0.46, 0.62], ic, 0.015, l);
    else if (item === 'soap') g.rbox([0.24, 0.44, 0.41], [0.37, 0.52, 0.53], ic, 0.03, D.hand);
    else g.rbox([0.23, 0.32, 0.4], [0.37, 0.46, 0.55], ic, 0.06, D.hand);
  }
  for (let k = 0; k < 2; k++) {
    g.setPart(parts[1 + k]);
    const x0 = k === 0 ? 0.015 : -0.175;
    g.rbox([x0, -0.55, -0.085], [x0 + 0.16, -0.02, 0.085], pants, 0.025, l);
    g.rbox([x0 - 0.01, -0.63, -0.07], [x0 + 0.17, -0.55, 0.17], shoe, 0.025, l);
  }
}

export function buildKartGeo(THREE, teamId, D = DETAIL) {
  const team = TEAM_BY_ID[teamId];
  const C = team.colors, div = DIVISIONS[team.div];
  const g = new Geo(), wg = new Geo();
  const tub = hex(C.tub), trim = hex(C.trim), inner = mix(hex(C.tub), [1, 1, 1], 0.7), iron = hex(PAL.darkGrey), seg = Math.max(12, D.cyl);
  // --- body: a studded chassis plate, the tub bowl (one moulded part), its rim and feet
  g.setPart(BODY);
  g.rbox([-0.5, 0.26, -0.8], [0.5, 0.38, 0.8], iron, 0.02, D.limb);
  if (D.stud) for (const z of [-0.7, 0.7]) for (const x of [-0.4, -0.2, 0, 0.2, 0.4]) g.stud([x, 0.38, z], 0.05, 0.03, Math.max(6, D.stud >> 1), iron);
  for (const z of [-0.6, 0.6]) g.rbox([-0.6, 0.27, z - 0.045], [0.6, 0.33, z + 0.045], hex(PAL.lightGrey), 0.02, D.limb);
  const L = 0.86, W = 0.42, y0 = 0.42, y1 = 1.0;
  loft(g, [[W * 0.62, L * 0.7, y0 - 0.02], [W * 0.8, L * 0.84, y0 + 0.06], [W * 0.93, L * 0.95, y0 + 0.28], [W, L, y1]], seg, tub, true);
  loft(g, [[W * 0.84, L * 0.88, y1 - 0.02], [W * 0.8, L * 0.84, y0 + 0.5], [W * 0.66, L * 0.74, y0 + 0.14]], seg, inner, false);
  // rim: a flat ring with studs on top
  const ring = (rx, rz) => Array.from({ length: seg }, (_, i) => { const a = (i / seg) * Math.PI * 2; return [Math.sin(a) * rx, Math.cos(a) * rz]; });
  const o = ring(W * 1.07, L * 1.05), n = ring(W * 0.84, L * 0.88), yr = y1 + 0.05;
  for (let i = 0; i < seg; i++) {
    const j = (i + 1) % seg;
    g.triN([o[i][0], yr, o[i][1]], [o[j][0], yr, o[j][1]], [n[j][0], yr, n[j][1]], [0, 1, 0], [0, 1, 0], [0, 1, 0], trim);
    g.triN([o[i][0], yr, o[i][1]], [n[j][0], yr, n[j][1]], [n[i][0], yr, n[i][1]], [0, 1, 0], [0, 1, 0], [0, 1, 0], trim);
    const mx = (n[i][0] + n[j][0]) / 2, mz = (n[i][1] + n[j][1]) / 2, ml = Math.hypot(mx, mz) || 1, IN = [-mx / ml, 0, -mz / ml];
    g.triN([n[i][0], y1 - 0.03, n[i][1]], [n[i][0], yr, n[i][1]], [n[j][0], yr, n[j][1]], IN, IN, IN, trim);
    g.triN([n[i][0], y1 - 0.03, n[i][1]], [n[j][0], yr, n[j][1]], [n[j][0], y1 - 0.03, n[j][1]], IN, IN, IN, trim);
    const nx = (o[i][0] + o[j][0]) / 2, nz = (o[i][1] + o[j][1]) / 2, nl = Math.hypot(nx, nz) || 1, N = [nx / nl, 0, nz / nl];
    g.triN([o[i][0], y1 - 0.02, o[i][1]], [o[j][0], y1 - 0.02, o[j][1]], [o[j][0], yr, o[j][1]], N, N, N, trim);
    g.triN([o[i][0], y1 - 0.02, o[i][1]], [o[j][0], yr, o[j][1]], [o[i][0], yr, o[i][1]], N, N, N, trim);
  }
  if (D.stud) for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2 + 0.11;
    g.stud([Math.sin(a) * W * 0.955, yr, Math.cos(a) * L * 0.965], 0.045, 0.03, Math.max(6, D.stud >> 1), trim);
  }
  // claw feet (Traditional) or a moulded skirt
  if (div.id === 'traditional') for (const [x, z] of [[0.3, 0.6], [-0.3, 0.6], [0.3, -0.6], [-0.3, -0.6]]) g.rbox([x - 0.07, 0.36, z - 0.07], [x + 0.07, 0.5, z + 0.07], trim, 0.04, D.hand);
  else g.rbox([-0.36, 0.36, -0.7], [0.36, 0.47, 0.7], mul(tub, 0.85), 0.04, D.limb);
  // push bars at the crew's hand height: one across the back, one along each side (what the attendants hold)
  const bar = hex(PAL.lightGrey);
  g.rbox([-0.78, 0.98, -0.92], [0.78, 1.05, -0.86], bar, 0.02, D.limb);
  for (const sx of [-1, 1]) {
    g.rbox([sx * 0.72 - 0.03, 0.98, -0.52], [sx * 0.72 + 0.03, 1.05, 0.12], bar, 0.02, D.limb);
    for (const z of [-0.45, 0.05]) g.rbox([sx * 0.72 - 0.025, 0.36, z - 0.025], [sx * 0.72 + 0.025, 0.99, z + 0.025], bar, 0.01, 0);
    g.rbox([sx * 0.5 - 0.025, 0.36, -0.9], [sx * 0.5 + 0.025, 0.99, -0.85], bar, 0.01, 0);
    g.rbox([Math.min(sx * 0.45, sx * 0.72), 0.36, -0.47], [Math.max(sx * 0.45, sx * 0.72), 0.41, -0.43], bar, 0.01, 0);
    g.rbox([Math.min(sx * 0.45, sx * 0.72), 0.36, 0.03], [Math.max(sx * 0.45, sx * 0.72), 0.41, 0.07], bar, 0.01, 0);
  }
  // team colour band down each side
  for (const sx of [-1, 1]) g.rbox([sx * (W + 0.015) - 0.025, 0.7, -0.38], [sx * (W + 0.015) + 0.025, 0.8, 0.38], hex(C.flag), 0.015, D.limb);
  // --- wheels: tyre and hub (pivot at the hub)
  WHEEL.forEach((p) => {
    g.setPart(p);
    g.xcyl([0, 0, 0], 0.3, 0.075, seg, hex('#26262C'));
    g.xcyl([0, 0, 0], 0.18, 0.085, seg, hex(PAL.lightGrey), trim);
  });
  // --- flag on a pole (pivot at the pole base on the rim)
  g.setPart(FLAG);
  g.scyl([0, 0, 0], 0.025, 1.25, Math.max(6, D.cyl >> 1), hex(PAL.lightGrey));
  g.rbox([-0.012, 0.85, -0.56], [0.012, 1.2, 0], hex(C.flag), 0.008, Math.min(1, D.limb));
  // --- rubber duck on the rim
  g.setPart(DUCK);
  const yel = hex(PAL.yellow);
  g.rbox([-0.08, 0, -0.1], [0.08, 0.13, 0.09], yel, 0.06, D.hand);
  g.rbox([-0.055, 0.12, -0.01], [0.055, 0.23, 0.1], yel, 0.05, D.hand);
  g.rbox([-0.03, 0.16, 0.09], [0.03, 0.19, 0.15], hex(PAL.orange), 0.012, Math.min(1, D.limb));
  // --- captain (sits in the tub; torso pivot at the seat)
  g.setPart(CAP_T);
  g.rbox([-0.2, 0, -0.13], [0.2, 0.45, 0.13], hex(C.cap), 0.03, D.seg, { print: cellUV(...teamCell(team.id)), printBack: cellUV(...backCell(team.id)) });
  g.setPart(CAP_H);
  g.rbox([-0.15, 0.02, -0.14], [0.15, 0.31, 0.14], hex(C.skin), 0.07, D.head, { print: cellUV(...FACE_CELL.grit) });
  hatGeo(g, team.hat, C.hat, C.trim, 0.31, D);
  for (const part of [CAP_LA, CAP_RA]) {
    g.setPart(part);
    g.rbox([-0.045, -0.05, 0], [0.045, 0.06, 0.37], hex(C.cap), 0.02, D.limb);
    g.rbox([-0.055, -0.06, 0.35], [0.055, 0.07, 0.47], hex(C.skin), 0.035, D.hand);
  }
  // --- attendants
  const faces = ['smile', 'shout', 'grin', 'smile'];
  ATT.forEach((parts, i) => figureGeo(g, D, team, parts, ITEM_ORDER[i], faces[i]));
  // --- water surface (its own see-through mesh, same part palette)
  wg.setPart(WATER);
  const wcol = hex(PAL.transLightBlue);
  for (let i = 0; i < seg; i++) {
    const a0 = (i / seg) * Math.PI * 2, a1 = ((i + 1) / seg) * Math.PI * 2;
    wg.triN([Math.sin(a0) * W * 0.84, 0, Math.cos(a0) * L * 0.88], [Math.sin(a1) * W * 0.84, 0, Math.cos(a1) * L * 0.88], [0, 0, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], wcol);
  }
  return { geo: g.build(THREE, { parts: true }), water: wg.build(THREE, { parts: true }) };
}

let blobTex = null;
function blob(THREE) {
  if (blobTex) return blobTex;
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const x = c.getContext('2d'), gr = x.createRadialGradient(32, 32, 2, 32, 32, 32);
  gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(0.55, 'rgba(0,0,0,0.75)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = gr; x.fillRect(0, 0, 64, 64);
  blobTex = new THREE.CanvasTexture(c); blobTex.colorSpace = THREE.NoColorSpace;
  return blobTex;
}

// soft contact shadows under every pusher, for all tubs in one instanced draw: the sun shadow alone barely darkens
// the road at their toes, and Low has no sun shadow
export class FootBlobs {
  constructor(THREE, max = 64) {
    const g = new THREE.PlaneGeometry(0.66, 0.66); g.rotateX(-Math.PI / 2);
    this.mesh = new THREE.InstancedMesh(g, new THREE.MeshBasicMaterial({ map: blob(THREE), color: 0x000000, transparent: true, opacity: 0.36, depthWrite: false }), max);
    this.mesh.renderOrder = 1; this.mesh.frustumCulled = false; this.mesh.count = 0;
    this.m = new THREE.Matrix4(); this.max = max;
  }
  // views: KartViews whose feet were placed this frame
  set(views) {
    let n = 0;
    for (const v of views) for (let i = 0; i < 4 && n < this.max; i++) { this.m.makeTranslation(v.feet[i * 3], v.feet[i * 3 + 1], v.feet[i * 3 + 2]); this.mesh.setMatrixAt(n++, this.m); }
    this.mesh.count = n; this.mesh.instanceMatrix.needsUpdate = true;
  }
}

export class KartView {
  constructor(THREE, teamId, opts = {}) {
    this.THREE = THREE;
    // the Blender crews when their pack is loaded, else the crews built in code
    // the player's own tub (opts.hero) gets the detailed LOD on every tier: it fills the chase view
    const pk = crewReady() && buildCrewGeo(THREE, teamId, opts.hero ? Math.min(1, LOD[0]) : LOD[0]), pf = pk && buildCrewGeo(THREE, teamId, LOD[1]), packed = !!(pk && pf);
    const near = packed ? pk : buildKartGeo(THREE, teamId, DETAIL), far = packed ? pf : buildKartGeo(THREE, teamId, FAR);
    this.near = near.geo; this.farGeo = far.geo; far.water.dispose();
    this.pv = packed ? packPivots() : LEGACY_PIVOTS;
    const ghost = opts.ghost ? { transparent: true, alpha: 0.42, depthWrite: false } : {};
    this.mat = partMat({ map: packed ? crewAtlas() : printAtlas(THREE), decal: true, ...ghost });
    this.mesh = new THREE.Mesh(this.near, this.mat);
    this.mesh.frustumCulled = false;
    this.mesh.matrixAutoUpdate = false;
    // see-through water on the same part palette
    // (opaque on Low: blending costs more than it shows at that size)
    // (a moderate gloss: at 0.95 the sheet mirrored the sky at chase angles and read as an empty white tub)
    // double-sided: the exported sheet faces down, so one-sided it was culled from above and every tub looked empty
    const wm = partMat({ side: THREE.DoubleSide, ...(clearWater || opts.ghost ? { transparent: true, alpha: opts.ghost ? 0.3 : 0.86, depthWrite: false, gloss: 0.55, water: !opts.ghost } : { gloss: 0.55 }) });
    wm.uniforms.uParts = this.mat.uniforms.uParts; wm.uniforms.uFade = this.mat.uniforms.uFade; // the water steps aside with its tub
    this.water = new THREE.Mesh(near.water, wm);
    this.water.frustumCulled = false;
    this.water.renderOrder = 3;
    this.mesh.add(this.water);
    // callers dispose `geo` when the tub leaves the scene
    this.geo = { dispose: () => { this.near.dispose(); this.farGeo.dispose(); this.water.geometry.dispose(); } };
    if (!opts.ghost) { this.mesh.userData.caster = true; this.mesh.userData.depthMat = partDepthMat(THREE, this.mat.uniforms.uParts, MAX_PARTS); this.mesh.userData.depthGeo = this.farGeo; }
    this.wheelA = 0; this.roll = 0; this.pitch = 0; this.flash = 0; this.circleA = 0;
    this.vPrev = null; this.acc = 0; this.slosh = [0, 0, 0, 0]; // smoothed acceleration; water spring [x, vx, z, vz]
    this.feet = new Float32Array(12); // world position under each pusher, for FootBlobs
    this.tmp = { m: new THREE.Matrix4(), q: new THREE.Quaternion(), e: new THREE.Euler(), v: new THREE.Vector3(), s: new THREE.Vector3(1, 1, 1), body: new THREE.Quaternion(), spin: new THREE.Quaternion(), up: new THREE.Vector3(0, 1, 0) };
    // soft contact shadow under the tub and its crew
    const sg = new THREE.PlaneGeometry(2, 2);
    sg.rotateX(-Math.PI / 2);
    this.shadow = new THREE.Mesh(sg, new THREE.MeshBasicMaterial({ map: blob(THREE), color: 0x000000, transparent: true, opacity: 0.4, depthWrite: false }));
    this.shadow.scale.set(1.3, 1, 1.9);
    this.shadow.renderOrder = 1;
  }
  // the player's tub in a pack: a team-colour ring on the road around it (outlined in black), and a small marker
  // just over the captain's hat (a marker any higher lands on the rival ahead in the chase view)
  showMarker(teamId) {
    const THREE = this.THREE, C = TEAM_BY_ID[teamId].colors;
    const g = new THREE.ConeGeometry(0.17, 0.28, 4); g.rotateX(Math.PI); g.rotateY(Math.PI / 4);
    // the player's arrow and ring are one fixed gold whatever the team, so no rival's ring can outshine them
    this.marker = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: new THREE.Color(PLAYER_GOLD), fog: false }));
    const edge = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.36, 4).rotateX(Math.PI).rotateY(Math.PI / 4), new THREE.MeshBasicMaterial({ color: 0x1e1b18, side: THREE.BackSide, fog: false }));
    this.marker.add(edge);
    this.marker.position.set(0, 2.2, 0);
    this.mesh.add(this.marker);
    this.showRing(teamId);
  }
  // a team-colour ring on the contact-shadow plane (an ellipse through its 1.3 × 1.9 m scale): bold and outlined for
  // the player; rivals get a slim, fainter one so their tubs read through the crews ahead in a pack
  showRing(teamId, rival = false, bright = false) {
    const THREE = this.THREE, C = TEAM_BY_ID[teamId].colors;
    const ringMat = (color, opacity) => new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false, fog: false, polygonOffset: true, polygonOffsetFactor: -2 });
    // (a rival's ring is its flag colour washed 40% toward grey, so no rival ring outshines the player's)
    const rc = new THREE.Color(rival ? C.flag : PLAYER_GOLD); if (rival) rc.lerp(new THREE.Color(0x8a8f96), 0.4);
    const ring = new THREE.Mesh(new THREE.RingGeometry(rival ? (bright ? 0.85 : 0.87) : 0.82, rival ? (bright ? 0.91 : 0.9) : 0.96, 48).rotateX(-Math.PI / 2), ringMat(rc, rival ? (bright ? 0.85 : 0.55) : 0.97));
    ring.position.y = 0.01; ring.renderOrder = 3;
    if (!rival) { const outline = new THREE.Mesh(new THREE.RingGeometry(0.8, 0.98, 48).rotateX(-Math.PI / 2), ringMat(0x1e1b18, 0.55)); outline.position.y = 0.01; outline.renderOrder = 2; this.shadow.add(outline); }
    this.shadow.add(ring);
    // the player's slide charge: an arc outside the ring that fills from the tail toward the nose on both sides as
    // the charge builds, water blue warming to white steam (warm tier) and hot orange (hot tier)
    if (!rival) {
      const cm = new THREE.ShaderMaterial({ uniforms: { uFill: { value: 0 }, uCol: { value: new THREE.Color() }, uA: { value: 0 } },
        vertexShader: 'varying vec2 vP; void main() { vP = position.xz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
        fragmentShader: 'uniform float uFill; uniform vec3 uCol; uniform float uA; varying vec2 vP; void main() { if (abs(atan(vP.x, -vP.y)) / 3.14159265 > uFill) discard; gl_FragColor = vec4(uCol, uA); }',
        transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
      this.charge = new THREE.Mesh(new THREE.RingGeometry(1.0, 1.14, 48).rotateX(-Math.PI / 2), cm);
      this.charge.position.y = 0.012; this.charge.renderOrder = 3; this.charge.visible = false;
      this.shadow.add(this.charge);
    }
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
    // acceleration from the change in speed, smoothed (the sim steps at its own rate, so frame to frame it jumps)
    if (dt > 0) { const a = this.vPrev === null ? 0 : (v - this.vPrev) / dt; this.vPrev = v; this.acc += (Math.max(-40, Math.min(40, a)) - this.acc) * Math.min(1, dt * 5); }
    // near or far geometry by distance to the camera
    if (lodCam) { const d = Math.hypot(lodCam.position.x - x, lodCam.position.z - z); const gg = d > FAR_AT ? this.farGeo : this.near; if (this.mesh.geometry !== gg) this.mesh.geometry = gg; }
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
    this.tmp.body.copy(this.tmp.q);
    this.mesh.matrixWorldNeedsUpdate = true;
    this.shadow.position.set(x, pose.groundY + 0.05, z);
    // the contact shadow (and the player's ring on it) lies on the road's slope, so it doesn't sink into a crowned
    // or banked road
    if (pose.gn) { this.tmp.q.setFromUnitVectors(this.tmp.up, this.tmp.v.set(pose.gn[0], pose.gn[1], pose.gn[2])); this.tmp.spin.setFromAxisAngle(this.tmp.up, yaw); this.shadow.quaternion.multiplyQuaternions(this.tmp.q, this.tmp.spin); }
    else this.shadow.rotation.y = yaw;
    // with sun shadows on, the blob is only a soft contact shadow under the tub
    this.shadow.material.opacity = (k.air ? 0.2 : 0.42) * (shadowsOn() ? 0.6 : 1);
    // parts
    const P = this.pv;
    this.setPart(BODY, 0, 0, 0);
    this.wheelA += (v / 0.3) * dt;
    const steerA = -k.steer * 0.35;
    WHEEL.forEach((p, i) => { const w = P.wheels[i]; this.setPart(p, w[0], w[1], w[2], this.wheelA, i < 2 ? steerA : 0, 0); });
    const sway = Math.sin(time * 6 + k.id) * 0.15 + Math.min(0.5, Math.abs(v) * 0.02);
    this.setPart(FLAG, P.flag[0], P.flag[1], P.flag[2], 0, sway * 0.6, 0);
    this.setPart(DUCK, P.duck[0], P.duck[1] + Math.abs(Math.sin(time * 5 + k.id)) * 0.04, P.duck[2], 0, 0.4, Math.sin(time * 3) * 0.1);
    // judge stops (Rules of the Row): the crew act out the task from its own clock (deterministic)
    const task = k.state === 'judge' && k.task ? k.task : null, tt = task ? task.t : 0;
    const fl = k.state === 'circle' || k.state === 'rescue' || (task && task.id === 'yodel');
    // captain: steering arms and a lean
    const lean = -k.steer * 0.2;
    const ct = P.capT, ch = P.capH, cs = P.capS, hs = P.headS;
    this.setPart(CAP_T, ct[0], ct[1], ct[2], P.capRx, 0, lean, cs, cs, cs);
    this.setPart(CAP_H, ch[0] + Math.sin(lean) * -(ch[1] - ct[1]), ch[1], ch[2], 0, -k.steer * 0.3, lean * 0.5, hs, hs, hs);
    // arm swing relative to the rest pose (the code-built arms rest at -0.15 rad, the Blender arms reach forward)
    const armUp = fl ? -1.05 + Math.sin(time * 14) * 0.6 : 0, armDn = fl ? -1.05 - Math.sin(time * 14) * 0.6 : 0, [al, ar] = P.arms;
    this.setPart(CAP_LA, al[0], al[1], al[2], P.armRx + armUp - k.steer * 0.25, 0, 0);
    this.setPart(CAP_RA, ar[0], ar[1], ar[2], P.armRx + armDn + k.steer * 0.25, 0, 0);
    // attendants: push-run behind the tub, or circle it after a fumble (real rule 7)
    const ph = k.runPhase;
    const ring = task && task.id === 'ring';
    const circling = k.state === 'circle' || ring;
    if (ring) this.circleA = tt * (Math.PI * 2 / 1.8);
    else if (circling) this.circleA += dt * (Math.PI * 2 / 1.4); else this.circleA = 0;
    const jacks = task && task.id === 'jacks', pushups = task && task.id === 'pushups';
    ATT.forEach((parts, i) => {
      let [ax, hip, az, face] = P.att[i];
      // pushers dig in on a push-off or a boost and straighten up as the tub slows
      let leanF = Math.min(0.5, 0.15 + Math.abs(v) * 0.02) + Math.max(-0.15, Math.min(0.3, this.acc * 0.035)) + (k.boostT > 0 ? 0.12 : 0);
      if (circling) {
        const a = this.circleA + (i * Math.PI) / 2; // evenly spaced, so no two crew share a spot
        ax = Math.sin(a) * 1.5; az = Math.cos(a) * 1.7;
        face = a + Math.PI / 2; leanF = 0.2;
      }
      const dropped = k.items && !k.items[ITEM_ORDER[i]];
      const rp = ring ? tt * 9 : ph;
      let swing = Math.sin(rp * 2 + i * 1.7) * (Math.abs(v) > 0.5 || circling ? 0.75 : 0.05);
      let hop = Math.abs(Math.sin(rp * 2 + i * 1.7)) * (Math.abs(v) > 0.5 || circling ? 0.07 : 0);
      let splay = 0;
      if (jacks) { const j = Math.abs(Math.sin(tt * 6 + i * 0.5)); hop = j * 0.28; splay = j * 0.35; swing = 0; leanF = 0; }
      if (pushups) { leanF = 1.25; hop = -0.32 + Math.abs(Math.sin(tt * 4 + i * 0.6)) * 0.12; swing = 0.5; }
      this.setPart(parts[0], ax, hip + hop, az, leanF, face, 0, 1, 1, dropped ? 0.96 : 1);
      this.setPart(parts[1], ax, hip + hop, az, swing, face, -splay);
      this.setPart(parts[2], ax, hip + hop, az, -swing, face, splay);
      const e = M.elements;
      this.feet[i * 3] = e[0] * ax + e[8] * az + e[12]; this.feet[i * 3 + 1] = pose.groundY + 0.06; this.feet[i * 3 + 2] = e[2] * ax + e[10] * az + e[14];
    });
    // water surface: height from fill, tilt from the slosh state
    const w = k.water, fill = w.cap ? w.gal / w.cap : 0;
    const wy = 0.5 + P.water * fill;
    // the water sheet tilts with the slosh state (exaggerated: at play size a true-to-sim tilt doesn't read)
    // (narrowed a little so the tilted sheet stays inside the rim; flattened to nothing when empty)
    const ws = fill > 0.02 ? 0.92 : 0.0001;
    // and keeps moving after a push, a stop or a turn: a damped spring driven by the tub's acceleration and turn
    const sl = this.slosh, tX = Math.max(-0.3, Math.min(0.3, this.acc * 0.03)), tZ = Math.max(-0.3, Math.min(0.3, -k.yawRate * Math.abs(v) * 0.03));
    if (k.state === 'circle' && this.prevState !== 'circle') { sl[1] += 4.5; sl[3] -= 3.5; }
    this.prevState = k.state;
    if (dt > 0) {
      const h = Math.min(dt, 1 / 30);
      sl[1] += ((tX - sl[0]) * 70 - sl[1] * 4.5) * h; sl[0] += sl[1] * h;
      sl[3] += ((tZ - sl[2]) * 70 - sl[3] * 4.5) * h; sl[2] += sl[3] * h;
    }
    const wx = Math.max(-0.34, Math.min(0.34, -w.tf * 1.8 + sl[0])), wz = Math.max(-0.34, Math.min(0.34, w.tr * 1.8 + sl[2]));
    this.setPart(WATER, 0, wy + Math.sin(time * 9 + k.id) * Math.min(0.03, (Math.abs(sl[1]) + Math.abs(sl[3])) * 0.02), 0, wx, 0, wz, ws, 1, ws);
    if (this.charge) {
      const ch = k.drift ? k.charge || 0 : 0, w = Math.min(1, ch / 0.85), h = Math.max(0, Math.min(1, (ch - 0.85) / 1.05)), u = this.charge.material.uniforms;
      u.uFill.value = Math.min(1, ch / 1.9);
      u.uCol.value.setRGB(0.3 + 0.67 * w + 0.03 * h, 0.7 + 0.28 * w - 0.43 * h, 1 - 0.58 * h);
      u.uA.value = k.drift ? 0.92 : Math.max(0, u.uA.value - dt * 4);
      this.charge.visible = u.uA.value > 0.01 && u.uFill.value > 0.01;
    }
    // the marker stays upright whatever the tub's lean and drift: undo the body rotation, then spin about the vertical
    if (this.marker) { this.marker.position.y = 2.2 + Math.sin(time * 3) * 0.08; this.marker.quaternion.copy(this.tmp.body).invert().multiply(this.tmp.spin.setFromAxisAngle(this.tmp.up, time * 1.5)); }
    // hit flash
    this.flash = Math.max(0, this.flash - dt * 3);
    this.mat.uniforms.uFlash.value.setScalar(this.flash * 0.6);
  }
}
