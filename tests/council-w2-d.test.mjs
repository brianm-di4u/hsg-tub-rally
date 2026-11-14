// Wave 2, batch D: S3-04 (par ghosts and medals), S3-02 (records, daily race), S3-05 (locked cup, mirror).
// Sim and save tests run in Node against the real code; the screens and the race are driven in the browser.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Track } from '../src/js/sim/track.js';
import { makeRace, stepRace } from '../src/js/sim/race.js';
import { PAR } from '../src/js/data/par.js';
import { TRACKS } from '../src/js/data/tracks.js';
import { unpackPar, ghostPose, PAR_STEP_MS } from '../src/js/sim/ghost.js';
import { medalTimes, medalFor, MEDAL_SCALE, PAR_LAPS } from '../src/js/sim/medals.js';
import { createSaveWriter, DEFAULT_SAVE } from '../src/js/save.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = '../_council/hsg-tub-rally/wave-2/shots';
const KEY = 'hsg-tub-rally-v1';
const shot = async (t, name) => { await t.shot(name); fs.mkdirSync(SHOTS, { recursive: true }); await t.page.screenshot({ path: `${SHOTS}/${name}-${t.viewport}.png` }); };
const track = (id) => new Track(JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'tracks', id + '.json'), 'utf8')));
const COURSES = TRACKS.filter((x) => !x.arena && fs.existsSync(path.join(ROOT, 'data', 'tracks', x.id + '.json'))).map((x) => x.id);

// an in-memory save store behind the real writer
const mk = (initial) => {
  const box = { raw: initial === undefined ? null : JSON.stringify(initial) };
  const writer = createSaveWriter({ read: () => box.raw, write: (r) => { box.raw = r; } });
  const save = writer.load();
  return { box, writer, save, stored: () => JSON.parse(box.raw), commit: (i) => writer.commit(save, i), reopen: () => { const w = createSaveWriter({ read: () => box.raw, write: (r) => { box.raw = r; } }); return w.load(); } };
};
const OLD = () => ({ v: 1, settings: { sound: true, music: true, ambience: true, volume: 0.6, res: 'native', quality: 'auto', autoPush: false, steerAssist: false, reducedMotion: null, hudScale: 1, keys: null, brick: true },
  unlocked: { teams: ['gator-gang'], cups: ['bathhouse'], classes: ['splash', 'soak', 'scald'], mirror: false },
  best: { 'bathhouse-row': { race: 150.2, lap: 48, team: 'engine-six', cls: 'scald' } }, ghosts: {}, cups: { 'bathhouse:soak': 1 }, stats: { races: 12, wins: 5, gallonsSpilled: 40 }, lastTeam: 'engine-six', lastClass: 'scald' });
const setSave = (t, s) => t.page.evaluate(([k, v]) => localStorage.setItem(k, JSON.stringify(v)), [KEY, s]);
const clearSave = (t) => t.page.evaluate((k) => localStorage.removeItem(k), KEY);
const readSave = (t) => t.page.evaluate((k) => JSON.parse(localStorage.getItem(k)), KEY);
const fresh = async (t, s) => {
  await t.waitIdle(8000);
  if (s) await setSave(t, s); else await clearSave(t);
  await t.reload(); await t.waitIdle(8000);
};
const finishRace = (t, max = 60 * 300) => t.stepUntil((st) => st.race && st.race.phase === 'done', { max, chunk: 600, label: 'race finished' });

export const tests = [
  // ---------------------------------------------------------------- S3-04
  {
    name: 'council D S3-04: every course has a par ghost that unpacks to a clean run, and the medal times derive from it',
    node: true,
    async run(t) {
      t.expect(COURSES.length >= 8, `${COURSES.length} courses to cover`);
      let bytes = 0;
      for (const id of COURSES) {
        const p = PAR[id];
        t.expect(!!p, id + ' has a par ghost');
        if (!p) continue;
        bytes += JSON.stringify(p).length;
        const tr = track(id);
        const G = unpackPar(p, (x, z, h) => tr.surface(x, z, h));
        t.expect(G.n >= 300, `${id}: ${G.n} samples`);
        t.expect(Math.abs(G.T[G.n - 1] / 1000 - p.total) < 0.002, `${id}: the last sample is at the finish time`);
        let mono = true; for (let i = 1; i < G.n; i++) if (G.T[i] <= G.T[i - 1]) mono = false;
        t.expect(mono, `${id}: sample times rise`);
        t.expect(Math.abs(G.T[1] - G.T[0] - PAR_STEP_MS) < 1, `${id}: samples are ${PAR_STEP_MS} ms apart`);
        // the ghost stays on the road and moves at a believable speed
        let off = 0, vmax = 0, hint = 0;
        for (let i = 0; i < G.n; i++) {
          const x = G.X[i] / 20, z = G.Z[i] / 20, s = tr.surface(x, z, hint);
          hint = s.s;
          if (s.ad > s.w + 6) off++;
          if (i) vmax = Math.max(vmax, Math.hypot(x - G.X[i - 1] / 20, z - G.Z[i - 1] / 20) / ((G.T[i] - G.T[i - 1]) / 1000));
        }
        t.expect(off <= 5, `${id}: ${off} of ${G.n} samples more than 6 m past the road edge (the driver cuts verges up to 5 m)`);
        t.expect(vmax < 40, `${id}: top ghost speed ${vmax.toFixed(1)} m/s`);
        const mid = ghostPose(G, p.total / 2);
        t.expect(mid && Number.isFinite(mid.x) && Number.isFinite(mid.y), `${id}: the pose at half time reads back`);
        t.expect(ghostPose(G, p.total + 1) === null && ghostPose(G, -1) === null, `${id}: no pose before the start or after the finish`);
        // a lap's worth of distance in a third of the run
        const L = tr.length;
        t.expect(p.lap > 30 && p.lap * PAR_LAPS < p.total + 5 && p.total / PAR_LAPS < 70, `${id}: par ${p.total}s over ${PAR_LAPS} laps of ${L.toFixed(0)} m, best lap ${p.lap}s`);
        const m = medalTimes(id);
        t.expect(Math.abs(m.gold - p.total * MEDAL_SCALE.gold) < 1e-9 && m.gold < m.silver && m.silver < m.bronze, `${id}: gold ${m.gold.toFixed(1)} < silver ${m.silver.toFixed(1)} < bronze ${m.bronze.toFixed(1)}`);
        t.equal(medalFor(id, m.gold), 3, id + ': the gold time is gold');
        t.equal(medalFor(id, m.gold + 0.01), 2, id + ': just over gold is silver');
        t.equal(medalFor(id, m.silver), 2, id + ': the silver time is silver');
        t.equal(medalFor(id, m.silver + 0.01), 1, id + ': just over silver is bronze');
        t.equal(medalFor(id, m.bronze), 1, id + ': the bronze time is bronze');
        t.equal(medalFor(id, m.bronze + 0.01), 0, id + ': just over bronze is no medal');
      }
      t.expect(bytes < 70000, `par data is ${(bytes / 1024).toFixed(0)} KB of text (the page budget is 700 KB in all)`);
      t.equal(medalFor('no-such-course', 100), 0, 'an unknown course gives no medal');
    },
  },
  {
    name: 'council D S3-04: the stored par times still match the autoplay driver on the current physics',
    node: true,
    async run(t) {
      // tools/par-ghosts.mjs picks the fastest of eight seeds (100..107) at skill 1.04; two courses are re-run here
      for (const id of ['bathhouse-row', 'hs-mountain']) {
        const tr = track(id);
        let best = Infinity;
        for (let s = 0; s < 8; s++) {
          const race = makeRace(tr, { laps: PAR_LAPS, classId: 'scald', player: 'engine-six', seed: 100 + s, mode: 'timetrial', noItems: true, count: 1, autoplay: true });
          race.drivers[race.player].skill = 1.04;
          for (let i = 0; i < 60 * 400 && race.phase !== 'done'; i++) stepRace(race, tr, [], 1 / 60);
          const k = race.karts[race.player];
          if (k.finished) best = Math.min(best, k.finishT);
        }
        t.expect(Math.abs(best - PAR[id].total) < 0.05, `${id}: stored par ${PAR[id].total} s, the driver now makes ${best.toFixed(2)} s (run tools/par-ghosts.mjs if the physics changed)`);
      }
    },
  },
  {
    name: 'council D S3-04: Time Trial bests keep the best time, the best lap and the best medal, and survive a failed write',
    node: true,
    async run(t) {
      const f = mk(DEFAULT_SAVE());
      t.equal(JSON.stringify(f.save.trial), '{}', 'a fresh profile has no Time Trial bests');
      const run = (race, lap, medal, track = 'bathhouse-row') => f.commit({ race: { token: {}, won: false, record: null, trial: { track, race, lap, medal } } });
      let r = run(150, 49, 1);
      t.expect(r.trialBest && r.lapBest && r.medalNew && r.medal === 1, 'a first run is a best time, a best lap and a new medal');
      r = run(148, 50, 2);
      t.expect(r.trialBest && !r.lapBest && r.medalNew, 'a faster run with a slower lap improves time and medal, not the lap');
      r = run(160, 47.5, 1);
      t.expect(!r.trialBest && r.lapBest && !r.medalNew, 'a slower run with a faster lap improves only the lap');
      const s = f.stored().trial['bathhouse-row'];
      t.expect(s.race === 148 && s.lap === 47.5 && s.medal === 2, `stored ${JSON.stringify(s)}: best time, best lap and best medal kept apart`);
      run(140, 46, 3, 'park-avenue');
      t.equal(f.stored().trial['park-avenue'].medal, 3, 'another course keeps its own record');
      t.equal(f.stored().stats.races, 4, 'each run still counts as a race');
      t.equal(f.reopen().trial['bathhouse-row'].medal, 2, 'the bests are there after a reload');
      // a failed write keeps the run pending and does not double-count it on the retry
      const box = { raw: JSON.stringify(DEFAULT_SAVE()), fail: true };
      const w = createSaveWriter({ read: () => box.raw, write: (raw) => { if (box.fail) throw new Error('blocked'); box.raw = raw; } });
      const sv = w.load();
      const token = {};
      const a = w.commit(sv, { race: { token, won: false, record: null, trial: { track: 'bathhouse-row', race: 150, lap: 49, medal: 1 } } });
      t.expect(!a.stored, 'the write failed');
      t.equal(sv.trial['bathhouse-row'].race, 150, 'the run shows in the tab while it is not stored');
      box.fail = false;
      w.commit(sv, { race: { token, won: false, record: null, trial: { track: 'bathhouse-row', race: 150, lap: 49, medal: 1 } } });
      const st = JSON.parse(box.raw);
      t.equal(st.stats.races, 1, 'the retried run is counted once');
      t.equal(st.trial['bathhouse-row'].medal, 1, 'and stored');
      // a pre-wave save has no Time Trial section and loads without losing anything; broken entries are dropped
      const o = mk(OLD());
      t.equal(JSON.stringify(o.save.trial), '{}', 'a pre-wave save gets an empty Time Trial section');
      t.equal(o.save.best['bathhouse-row'].race, 150.2, 'its best time is untouched');
      const bad = OLD(); bad.trial = { a: { race: 'x' }, b: { race: 120, lap: -3, medal: 9 }, c: 4 };
      const b = mk(bad);
      t.equal(JSON.stringify(b.save.trial), JSON.stringify({ b: { race: 120, lap: null, medal: 0 } }), 'damaged Time Trial entries are dropped or repaired, not an error');
      const notObj = OLD(); notObj.trial = 'x';
      t.equal(JSON.stringify(mk(notObj).save.trial), '{}', 'a Time Trial section that is not an object is ignored');
    },
  },
  {
    name: 'council D S3-04: Time Trial races the staff ghost, shows its target, and the finish scores a medal',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await fresh(t);
      // the course card shows the targets and, once there is a run, the medal and best lap
      await t.game('act', 'menu', 'timetrial'); await t.waitFrames(3);
      await t.game('act', 'menu', 'teamOk'); await t.waitFrames(3);
      t.equal((await t.state()).screen, 'courses', 'the course screen is up');
      const card = () => t.page.evaluate(() => { const c = document.querySelector('.courses [data-id="bathhouse-row"]'); return c ? c.textContent.replace(/\s+/g, ' ').trim() : ''; });
      let txt = await card();
      const m = medalTimes('bathhouse-row');
      t.expect(/Gold \d:\d\d\.\d\d · Silver \d:\d\d\.\d\d · Bronze \d:\d\d\.\d\d/.test(txt), 'the card lists the medal times: ' + txt);
      t.expect(/No time set yet/.test(txt), 'and says no time is set yet');
      await shot(t, 'S3-04-courses-fresh');
      await t.checkLayout({ allowScrollY: true });
      // race: the par ghost is loaded and shown, the HUD names the gold time
      await t.game('newGame', { track: 'bathhouse-row', team: 'steam-rangers', mode: 'timetrial', classId: 'scald', count: 1, paused: true, autoplay: true, seed: 4 });
      let st = await t.state();
      t.expect(st.par && st.par.total === PAR['bathhouse-row'].total && st.par.n > 300, 'the par ghost is loaded');
      t.expect(!st.ghost, 'a new profile has no ghost of its own yet');
      const hud = await t.page.evaluate(() => { const e = document.querySelector('.hud-par'); return { hidden: e.hidden, text: e.textContent, tile: document.querySelector('.hud-tr').className }; });
      t.expect(!hud.hidden && hud.text === 'GOLD' && /par/.test(hud.tile) && !/empty/.test(hud.tile), 'the top-right tile names the gold target in place of the position: ' + JSON.stringify(hud));
      await t.game('act', 'skipCountdown');
      await t.game('step', 60 * 20);
      const par = await t.page.evaluate(() => window.__game.getState().par);
      t.expect(!!par, 'still racing it');
      await t.waitFrames(3);
      await shot(t, 'S3-04-race-par-ghost');
      // finish: the run is scored
      st = await finishRace(t);
      t.expect(st.trial && st.trial.medal >= 1 && st.trial.medal <= 3, 'the finish scored a medal: ' + JSON.stringify(st.trial && { medal: st.trial.medal, race: st.trial.race }));
      t.equal(st.trial.medal, medalFor('bathhouse-row', st.trial.race), 'the medal matches the time against the par');
      t.expect(st.trial.medalNew && st.trial.trialBest && st.trial.lapBest, 'a first run is new on every count');
      const saved = await readSave(t);
      t.expect(saved.trial['bathhouse-row'] && saved.trial['bathhouse-row'].medal === st.trial.medal, 'the medal is in the save');
      t.expect(saved.trial['bathhouse-row'].lap > 30, 'with its best lap: ' + saved.trial['bathhouse-row'].lap);
      await t.waitFrames(3);
      const lines = await t.page.evaluate(() => (document.querySelector('.trial-lines') || {}).textContent);
      t.expect(/medal/.test(lines || '') && /Fastest lap \d:\d\d\.\d\d/.test(lines) && /staff ghost/.test(lines), 'the results screen shows the medal, the lap and the staff time: ' + lines);
      await shot(t, 'S3-04-results');
      await t.checkLayout({ allowScrollY: true });
      // after a reload the card shows the medal and best lap, and the race has both ghosts
      await t.reload(); await t.waitIdle(8000);
      await t.game('act', 'menu', 'timetrial'); await t.waitFrames(3);
      await t.game('act', 'menu', 'teamOk'); await t.waitFrames(3);
      txt = await card();
      t.expect(/(Bronze|Silver|Gold)\s*Best \d:\d\d\.\d\d · lap \d:\d\d\.\d\d/.test(txt), 'the card shows the medal and best lap after a reload: ' + txt);
      await shot(t, 'S3-04-courses-played');
      await t.game('newGame', { track: 'bathhouse-row', team: 'steam-rangers', mode: 'timetrial', classId: 'scald', count: 1, paused: true, seed: 5 });
      st = await t.state();
      t.expect(!!st.par && !!st.ghost, 'the next run races the staff ghost and the player\'s own');
    },
  },
];
