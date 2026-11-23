// Wave 2, batch C: S1-01 (wall contact), S1-04 (acceleration), S3-01 (difficulty classes).
// Sim tests run in Node against the real sim; numbers are also measured by _council/hsg-tub-rally/wave-2/measure/c-*.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Track } from '../src/js/sim/track.js';
import { makeKart, stepKart } from '../src/js/sim/kart.js';
import { makeRace, stepRace } from '../src/js/sim/race.js';
import { CLASSES } from '../src/js/data/teams.js';
import { createSaveWriter, DEFAULT_SAVE } from '../src/js/save.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DT = 1 / 60;
const SHOTS = 'screenshots/council/wave-2/shots';
const shot = async (t, name) => { await t.shot(name); fs.mkdirSync(SHOTS, { recursive: true }); await t.page.screenshot({ path: `${SHOTS}/${name}-${t.viewport}.png` }); };
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
  {
    name: 'council C S3-01: the classes differ in how the rivals race, Soak stays as it was, and Boil is a fourth class',
    node: true,
    async run(t) {
      const ids = Object.keys(CLASSES);
      t.equal(ids.join(','), 'splash,soak,scald,boil', 'four classes, coolest first');
      const ai = ids.map((id) => CLASSES[id].ai), top = ids.map((id) => CLASSES[id].vTop);
      t.expect(ai.every((v, i) => i === 0 || v > ai[i - 1]), 'rival pace rises with the class: ' + ai.join(', '));
      t.expect(top.every((v, i) => i === 0 || v > top[i - 1]), 'top speed still rises with the class: ' + top.join(', '));
      t.expect(ai[3] - ai[0] >= 0.16, `the pace band is wide (${(ai[3] - ai[0]).toFixed(2)}; it was 0.08 from Splash to Scald)`);
      const soak = CLASSES.soak;
      t.expect(soak.vTop === 19.5 && soak.ai === 0.97 && soak.rubber === 0.04 && soak.noise === 0.55 && soak.aggro === 0.6 && soak.spill === 1 && soak.wall === 1 && !soak.hunt, 'Soak keeps every value it had');
      t.expect(CLASSES.splash.wall < 1 && CLASSES.splash.spill < 1, 'Splash forgives walls and spills');
      t.expect(CLASSES.scald.hunt > 0 && CLASSES.boil.hunt > CLASSES.scald.hunt, 'Scald and Boil rivals aim items at the player');
      t.expect(!CLASSES.splash.unlock && !CLASSES.soak.unlock && /Scald/.test(CLASSES.boil.unlock), 'Boil says what opens it');
    },
  },
  {
    name: 'council C S3-01: an equal-skill bot does worse in each harder class, by the clock and by place',
    node: true,
    async run(t) {
      const tr = track('bathhouse-row');
      const gap = {}, place = {};
      for (const cls of Object.keys(CLASSES)) {
        const gs = [], ps = [];
        for (let seed = 700; seed < 708; seed++) {
          const race = makeRace(tr, { laps: 2, classId: cls, player: 'engine-six', autoplay: true, seed });
          race.drivers[race.player].cls = { ...race.drivers[race.player].cls, ai: 0.97 }; // the bot's pace is the same in every class
          for (let i = 0; i < 60 * 200 && race.phase !== 'done'; i++) stepRace(race, tr, [], 1 / 60);
          const me = race.results.find((r) => r.human), rivals = race.results.filter((r) => !r.human).map((r) => r.time).sort((a, b) => a - b);
          gs.push(me.time - rivals[3]); ps.push(me.place);
        }
        gap[cls] = gs.reduce((a, b) => a + b) / gs.length; place[cls] = ps.reduce((a, b) => a + b) / ps.length;
      }
      t.log('seconds behind the median rival', JSON.stringify(gap), 'mean place', JSON.stringify(place));
      const ids = Object.keys(CLASSES);
      for (let i = 1; i < ids.length; i++) t.expect(gap[ids[i]] > gap[ids[i - 1]], `${ids[i]} is harder than ${ids[i - 1]} by the clock (${gap[ids[i]].toFixed(2)} s against ${gap[ids[i - 1]].toFixed(2)} s)`);
      t.expect(place.boil - place.splash >= 2, `from Splash to Boil the bot loses at least two places (${place.splash.toFixed(2)} to ${place.boil.toFixed(2)})`);
      t.expect(place.splash < place.soak && place.soak < place.scald, `places climb Splash ${place.splash.toFixed(2)}, Soak ${place.soak.toFixed(2)}, Scald ${place.scald.toFixed(2)}`);
    },
  },
  {
    name: 'council C S3-01: the rivals finish their turn inside the frame budget in every class',
    node: true,
    async run(t) {
      const tr = track('bathhouse-row');
      for (const cls of Object.keys(CLASSES)) {
        const race = makeRace(tr, { laps: 2, classId: cls, player: 'engine-six', autoplay: true, seed: 3 });
        let n = 0; const t0 = performance.now();
        for (; n < 60 * 40; n++) stepRace(race, tr, [], 1 / 60);
        const ms = (performance.now() - t0) / n;
        t.expect(ms < 2, `${cls}: ${ms.toFixed(2)} ms per tick for eight tubs and their drivers (a 60 fps frame is 16.7 ms)`);
      }
    },
  },
  {
    name: 'council C S3-01: a cup won on Scald opens Boil for good; older saves keep Scald and lose nothing',
    node: true,
    async run(t) {
      const mk = (initial) => {
        const box = { raw: JSON.stringify(initial) };
        const writer = createSaveWriter({ read: () => box.raw, write: (r) => { box.raw = r; } });
        const save = writer.load();
        return { box, writer, save, stored: () => JSON.parse(box.raw), commit: (i) => writer.commit(save, i) };
      };
      const teamOrder = ['gator-gang', 'silks-stirrups', 'flamingo-flock', 'tub-ninjas'];
      const fresh = mk(DEFAULT_SAVE());
      t.equal(fresh.save.unlocked.classes.join(','), 'splash,soak', 'a fresh profile starts with two classes');
      const a = fresh.commit({ cup: { token: {}, key: 'bathhouse:soak', place: 1, soak: true, scald: false, teamOrder } });
      t.expect(fresh.stored().unlocked.classes.includes('scald') && !fresh.stored().unlocked.classes.includes('boil'), 'a cup won on Soak opens Scald only');
      t.equal(a.unlockedClass, 'scald', 'the new class announced is Scald (S3-06), not Boil');
      fresh.commit({ cup: { token: {}, key: 'bathhouse:scald', place: 2, soak: false, scald: true, teamOrder } });
      t.expect(!fresh.stored().unlocked.classes.includes('boil'), 'second place on Scald does not open Boil');
      const w = fresh.commit({ cup: { token: {}, key: 'bathhouse:scald', place: 1, soak: false, scald: true, teamOrder } });
      t.expect(fresh.stored().unlocked.classes.includes('boil'), 'a cup won on Scald opens Boil');
      t.equal(w.unlockedClass, 'boil', 'the trophy screen is told Boil is new');
      fresh.commit({ cup: { token: {}, key: 'ouachita:scald', place: 1, soak: false, scald: true, teamOrder } });
      t.equal(fresh.stored().unlocked.classes.filter((c) => c === 'boil').length, 1, 'Boil is listed once');
      const again = createSaveWriter({ read: () => fresh.box.raw, write: (r) => { fresh.box.raw = r; } });
      t.expect(again.load().unlocked.classes.includes('boil'), 'Boil is still open after a reload');
      // a save written before this wave: Scald stays open, Boil is locked, everything else is kept
      const old = { v: 1, settings: { sound: true, music: false, volume: 0.6, res: 'native', quality: 'auto', autoPush: false, steerAssist: false, reducedMotion: null, hudScale: 1, keys: null, brick: true },
        unlocked: { teams: ['gator-gang'], cups: ['bathhouse'], classes: ['splash', 'soak', 'scald'], mirror: false },
        best: { 'bathhouse-row': { race: 150.2, lap: 48, team: 'engine-six', cls: 'scald' } }, ghosts: {}, cups: { 'bathhouse:soak': 1 }, stats: { races: 12, wins: 5, gallonsSpilled: 40 }, lastTeam: 'engine-six', lastClass: 'scald' };
      const o = mk(old);
      t.equal(o.save.unlocked.classes.join(','), 'splash,soak,scald', 'an older save keeps Scald and has no Boil');
      t.equal(o.save.best['bathhouse-row'].race, 150.2, 'its best time is untouched');
      t.equal(o.save.stats.races, 12, 'its stats are untouched');
      t.equal(o.save.lastClass, 'scald', 'its chosen class is untouched');
    },
  },
  {
    name: 'council C S3-01: the class screen shows what is locked and why, and a locked class is never raced',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      const key = 'hsg-tub-rally-v1';
      await t.waitIdle(8000);
      await t.page.evaluate((k) => localStorage.removeItem(k), key);
      await t.reload();
      await t.waitIdle(8000);
      const toClasses = async () => {
        await t.game('act', 'menu', 'gp');
        await t.waitFrames(3);
        await t.game('act', 'menu', 'teamOk');
        await t.waitFrames(3);
        t.equal((await t.state()).screen, 'classes', 'the class screen is up');
      };
      await toClasses();
      const read = () => t.page.evaluate(() => [...document.querySelectorAll('.classes [data-act="cls"], .classes [data-act="locked"]')].map((b) => ({ id: b.dataset.id, act: b.dataset.act, disabled: b.getAttribute('aria-disabled'), text: b.textContent.trim() })));
      let rows = await read();
      t.equal(rows.map((r) => r.id).join(','), 'splash,soak,scald,boil', 'four classes are listed');
      t.expect(rows.filter((r) => r.act === 'locked').map((r) => r.id).join(',') === 'scald,boil', 'a fresh profile has Scald and Boil locked');
      t.expect(/Win a cup on Soak/.test(rows[2].text) && /Win a cup on Scald/.test(rows[3].text), 'each locked class says what opens it: ' + rows.map((r) => r.text).join(' | '));
      t.expect(rows[2].disabled === 'true' && rows[3].disabled === 'true', 'the locked buttons are marked disabled for screen readers');
      await shot(t, 'S3-01-classes-fresh');
      await t.checkLayout();
      // an older save: Scald is open, Boil is not
      const old = { v: 1, settings: { sound: true, music: true, ambience: true, volume: 0.6, res: 'native', quality: 'auto', autoPush: false, steerAssist: false, reducedMotion: null, hudScale: 1, keys: null, brick: true },
        unlocked: { teams: [], cups: ['bathhouse'], classes: ['splash', 'soak', 'scald'], mirror: false }, best: {}, ghosts: {}, cups: {}, stats: { races: 2, wins: 1, gallonsSpilled: 0 }, lastTeam: 'engine-six', lastClass: 'soak' };
      await t.page.evaluate(([k, s]) => localStorage.setItem(k, JSON.stringify(s)), [key, old]);
      await t.reload();
      await t.waitIdle(8000);
      await toClasses();
      rows = await read();
      t.expect(rows.filter((r) => r.act === 'locked').map((r) => r.id).join(',') === 'boil', 'an older save has Scald open and Boil locked');
      await shot(t, 'S3-01-classes-older-save');
      // a hand-edited save that points at Boil without owning it races Soak
      old.lastClass = 'boil';
      await t.page.evaluate(([k, s]) => localStorage.setItem(k, JSON.stringify(s)), [key, old]);
      await t.reload();
      await t.waitIdle(8000);
      await t.game('newGame', { track: 'bathhouse-row', team: 'engine-six', seed: 4, paused: true });
      t.equal((await t.state()).race.classId, 'soak', 'a locked class in the save falls back to Soak');
      // once Boil is owned it is raced
      old.unlocked.classes.push('boil');
      await t.page.evaluate(([k, s]) => localStorage.setItem(k, JSON.stringify(s)), [key, old]);
      await t.reload();
      await t.waitIdle(8000);
      await t.game('newGame', { track: 'bathhouse-row', team: 'engine-six', seed: 4, paused: true });
      t.equal((await t.state()).race.classId, 'boil', 'an owned Boil is raced');
      await t.page.evaluate((k) => localStorage.removeItem(k), key);
    },
  },
];
