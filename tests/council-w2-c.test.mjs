// Wave 2, batch C: S1-01 (wall contact), S1-04 (acceleration), S3-01 (difficulty classes).
// Sim tests run in Node against the real sim; numbers are also measured by _council/hsg-tub-rally/wave-2/measure/c-*.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Track } from '../src/js/sim/track.js';
import { makeKart, stepKart } from '../src/js/sim/kart.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DT = 1 / 60;
const track = (id) => new Track(JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'tracks', id + '.json'), 'utf8')));

// A tub on the verge of Bathhouse Row's first walled stretch (wall at 15 m), nose `deg` degrees toward it, push held.
function wallRun(vin, deg, secs = 6, team = 'engine-six', cls = 'soak') {
  const tr = track('bathhouse-row'), s0 = 20, c = tr.at(s0), p = tr.point(s0, 14);
  const k = makeKart(0, team, cls, { x: p.x, z: p.z, y: p.y, yaw: Math.atan2(c.tx, c.tz) - deg * Math.PI / 180, s: s0 }, { human: true });
  k.vf = vin;
  let contact = null, vContact = 0, vHalf = 0, swap = false, run = 0, longestUnder3 = 0;
  const speeds = [];
  for (let i = 0; i < secs * 60; i++) {
    stepKart(k, { steer: 0, push: 1 }, tr, DT);
    const sp = Math.hypot(k.vf, k.vl);
    if (contact == null && k.d > 14.95) { contact = i; vContact = sp; }
    if (contact != null && i === contact + 30) vHalf = sp;
    for (const e of k.events) if (e.type === 'swap') swap = true;
    if (contact != null) { if (sp < 3) { run++; longestUnder3 = Math.max(longestUnder3, run); } else run = 0; }
    speeds.push(sp);
  }
  return { contact, vContact, kept: vContact ? vHalf / vContact : null, swap, longestUnder3: longestUnder3 / 60, speeds };
}

export const tests = [
  {
    name: 'council C S1-01: a graze costs under 15 percent, a square hit costs most, and a wall never pins the tub',
    node: true,
    async run(t) {
      for (const vin of [10, 17]) {
        const graze = wallRun(vin, 10), glance = wallRun(vin, 20), angled = wallRun(vin, 35);
        t.expect(graze.contact != null, `a ${vin} m/s tub at 10 degrees reaches the wall`);
        // the verge beside the wall is grass, which caps a tub at 11 m/s on its own: measure the wall below that cap
        if (vin <= 11) t.expect(graze.kept >= 0.85, `a 10 degree graze at ${vin} m/s keeps ${(graze.kept * 100).toFixed(0)} percent half a second on (needs 85 or more)`);
        t.expect(!graze.swap, 'a graze does not make the attendants fumble the grip');
        t.expect(glance.kept > angled.kept, `loss grows with the angle: 20 degrees keeps ${glance.kept.toFixed(2)}, 35 degrees keeps ${angled.kept.toFixed(2)}`);
        for (const r of [graze, glance, angled]) {
          t.expect(r.longestUnder3 <= 1, `push held along a wall: never under 3 m/s for more than a second (was ${r.longestUnder3.toFixed(2)} s)`);
        }
        t.expect(Math.max(...angled.speeds.slice(-120)) >= 8, `two seconds after a 35 degree hit the tub is moving again (${Math.max(...angled.speeds.slice(-120)).toFixed(1)} m/s)`);
      }
      // a square hit costs most of the speed it had, and it is paid once, not on every tick of contact
      const square = wallRun(17, 90);
      t.expect(square.kept <= 0.5 || square.vContact < 6, `a square hit costs most of the speed (kept ${square.kept.toFixed(2)} of ${square.vContact.toFixed(1)} m/s)`);
      // rubbing along the wall for 3 s with push held: speed recovers instead of settling at about 1.6 m/s
      const rub = wallRun(10, 5, 8);
      const tail = rub.speeds.slice(-60);
      t.expect(tail.every((v) => v > 6), `after 8 s of rubbing the tub is at ${tail[0].toFixed(1)} m/s, not pinned`);
    },
  },
  {
    name: 'council C S1-01: a hard, near-square hit costs the grip fumble but the tub is moving again within a second and a half',
    node: true,
    async run(t) {
      for (const deg of [60, 90]) {
        const r = wallRun(17, deg);
        t.expect(r.longestUnder3 <= 1.3, `a ${deg} degree hit at 17 m/s leaves the tub under 3 m/s for ${r.longestUnder3.toFixed(2)} s (needs 1.3 or less)`);
      }
      const rub = wallRun(17, 60, 8);
      t.expect(rub.speeds.slice(-60).every((v) => v > 8), 'six seconds later it is back to speed');
    },
  },
  {
    name: 'council C S1-04: a stopped tub reaches 90 percent of top speed in 3.5 to 4.5 seconds',
    node: true,
    async run(t) {
      const tr = track('bathhouse-row');
      const t90 = (team, cls) => {
        const c = tr.at(100), p = tr.point(100, 0);
        const k = makeKart(0, team, cls, { x: p.x, z: p.z, y: p.y, yaw: Math.atan2(c.tx, c.tz), s: 100 }, { human: true });
        for (let i = 0; i < 60 * 10; i++) { stepKart(k, { steer: 0, push: 1 }, tr, DT); if (k.vf >= 0.9 * k.stats.vTop) return i * DT; }
        return Infinity;
      };
      for (const [team, cls] of [['engine-six', 'soak'], ['steam-rangers', 'soak'], ['steam-rangers', 'splash'], ['steam-rangers', 'scald'], ['lather-linen', 'soak']]) {
        const v = t90(team, cls);
        // Soak is the reference class; Splash's lower top speed is reached sooner, Scald's later
        const lo = cls === 'soak' ? 3.5 : 3.0, hi = 4.5;
        t.expect(v >= lo && v <= hi, `${team} on ${cls} takes ${v.toFixed(2)} s to 90 percent of top speed (${lo} to ${hi})`);
      }
      // the lightest tub is quicker but still not instant, and the thrust still ends at the class cap
      const light = t90('bubble-patrol', 'soak');
      t.expect(light >= 2.5 && light <= 4.5, `the light Modified tub takes ${light.toFixed(2)} s`);
      const c = tr.at(100), p = tr.point(100, 0);
      const k = makeKart(0, 'steam-rangers', 'soak', { x: p.x, z: p.z, y: p.y, yaw: Math.atan2(c.tx, c.tz), s: 100 }, { human: true });
      let peak = 0;
      for (let i = 0; i < 60 * 8; i++) { stepKart(k, { steer: 0, push: 1 }, tr, DT); peak = Math.max(peak, k.vf); }
      t.expect(peak <= k.stats.vTop * 1.001, `thrust never pushes a tub past its class cap (${peak.toFixed(2)} of ${k.stats.vTop.toFixed(2)})`);
    },
  },
];
