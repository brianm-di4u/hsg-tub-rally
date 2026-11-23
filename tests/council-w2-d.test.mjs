// Wave 2, batch D: S3-04 (par ghosts and medals), S3-02 (records, daily race), S3-05 (locked cup, mirror).
// Sim and save tests run in Node against the real code; the screens and the race are driven in the browser.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Track } from '../src/js/sim/track.js';
import { makeRace, stepRace } from '../src/js/sim/race.js';
import '../assets/par-ghosts.js';
import { TRACKS } from '../src/js/data/tracks.js';
import { unpackPar, ghostPose, PAR_STEP_MS } from '../src/js/sim/ghost.js';
import { medalTimes, medalFor, MEDAL_SCALE, PAR_LAPS } from '../src/js/sim/medals.js';
import { TEAMS } from '../src/js/data/teams.js';
import { createSaveWriter, DEFAULT_SAVE } from '../src/js/save.js';
import { dateKey, dailyPlan, nextStreak, liveStreak, betterDaily, addDays, DAILY_KEEP, DAILY_LAPS } from '../src/js/daily.js';

const PAR = globalThis.TR_PAR;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = 'screenshots/council/wave-2/shots';
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
      // setPar() shows the GOLD label at once, but the tile drops its 'empty' look on the HUD's next draw (ui/hud.js update), so wait
      // for that frame rather than reading straight after newGame (it failed now and then, more often on mobile).
      await t.page.waitForFunction(() => { const tr = document.querySelector('.hud-tr'); return tr && !tr.classList.contains('empty'); }, null, { polling: 'raf', timeout: 3000 }).catch(() => {});
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

  // ---------------------------------------------------------------- S3-02
  {
    name: 'council D S3-02: the daily deal is fixed by the date, and the streak counts consecutive days',
    node: true,
    async run(t) {
      t.expect(/^\d{4}-\d{2}-\d{2}$/.test(dateKey(new Date(2026, 10, 14))) && dateKey(new Date(2026, 10, 14)) === '2026-11-14', 'dateKey is the local yyyy-mm-dd');
      const a = dailyPlan('2026-11-14', COURSES), b = dailyPlan('2026-11-14', COURSES);
      t.equal(JSON.stringify(a), JSON.stringify(b), 'the same date gives the same deal');
      t.expect(COURSES.includes(a.track) && TEAMS.some((x) => x.id === a.team) && a.classId === 'soak' && a.laps === DAILY_LAPS && a.seed > 0, 'a built course, a real team, Soak, ' + DAILY_LAPS + ' laps and a seed: ' + JSON.stringify(a));
      const plans = new Set(), tracks = new Set(), teams = new Set();
      for (let i = 0; i < 60; i++) { const p = dailyPlan(addDays('2026-11-01', i), COURSES); plans.add(p.seed); tracks.add(p.track); teams.add(p.team); }
      t.expect(plans.size >= 58, `${plans.size} different seeds over 60 days`);
      t.expect(tracks.size >= 6 && teams.size >= 8, `${tracks.size} courses and ${teams.size} tubs come up over 60 days`);
      t.equal(addDays('2026-02-28', 1), '2026-03-01', 'a day after 28 February is 1 March');
      t.equal(addDays('2026-12-31', 1), '2027-01-01', 'and the new year rolls over');
      t.equal(addDays('2026-03-08', 1), '2026-03-09', 'a daylight-saving change does not split a day');
      let s = { n: 0, last: '' };
      s = nextStreak(s, '2026-11-10'); t.equal(s.n, 1, 'first day: 1');
      s = nextStreak(s, '2026-11-10'); t.equal(s.n, 1, 'the same day again: still 1');
      s = nextStreak(s, '2026-11-11'); t.equal(s.n, 2, 'the next day: 2');
      s = nextStreak(s, '2026-11-12'); t.equal(s.n, 3, 'and 3');
      s = nextStreak(s, '2026-11-09'); t.equal(s.n, 3, 'an earlier date never rewrites the streak');
      t.equal(liveStreak(s, '2026-11-12'), 3, 'alive on the day it was played');
      t.equal(liveStreak(s, '2026-11-13'), 3, 'alive the next day, before today is played');
      t.equal(liveStreak(s, '2026-11-14'), 0, 'gone after a missed day');
      s = nextStreak(s, '2026-11-15'); t.equal(s.n, 1, 'a gap restarts it at 1');
      t.equal(liveStreak({ n: 'x', last: 'y' }, '2026-11-15'), 0, 'a damaged streak reads as none');
      const better = betterDaily({ place: 3, time: 100 }, { place: 2, time: 120 });
      t.equal(better.place, 2, 'a higher place is the better result');
      t.equal(betterDaily({ place: 2, time: 100 }, { place: 2, time: 99 }).time, 99, 'the same place, the faster time');
      t.equal(betterDaily({ place: 2, time: 100 }, { place: 3, time: 90 }).time, 100, 'a worse place never replaces it');
    },
  },
  {
    name: 'council D S3-02: Daily results, the streak and gallons spilled are saved once, kept to 60 days, and old saves load',
    node: true,
    async run(t) {
      const f = mk(DEFAULT_SAVE());
      t.equal(JSON.stringify(f.save.daily), '{}', 'a fresh profile has no daily results');
      t.equal(f.save.stats.bestStreak, 0, 'and no streak');
      const run = (date, place, time = 100, spilled = 0, token = {}) => f.commit({ race: { token, won: place === 1, record: null, daily: { date, track: 'bathhouse-row', team: 'engine-six', place, time }, spilled } });
      let r = run('2026-11-10', 4, 110, 12.5);
      t.expect(r.dailyFirst && r.streak === 1, 'the first day starts a streak of 1');
      r = run('2026-11-11', 3, 108, 7.25);
      t.expect(r.dailyFirst && r.streak === 2 && r.streakBest, 'the next day makes 2, the longest yet');
      r = run('2026-11-11', 2, 105);
      t.expect(!r.dailyFirst && r.dailyBest && r.streak === 2, 'a better replay the same day replaces the day\'s result and keeps the streak');
      run('2026-11-11', 5, 90);
      t.equal(f.stored().daily['2026-11-11'].place, 2, 'a worse replay never replaces it');
      t.equal(f.stored().stats.races, 4, 'every race still counts as a race');
      t.equal(f.stored().stats.gallonsSpilled, 19.8, 'gallons spilled add up across races');
      t.equal(f.stored().dailyStreak.n, 2, 'the streak is 2');
      run('2026-11-14', 1, 99);
      t.equal(f.stored().dailyStreak.n, 1, 'a missed day restarts the streak');
      t.equal(f.stored().stats.bestStreak, 2, 'the longest streak is kept');
      t.expect(!f.stored().best['bathhouse-row'], 'a daily race never becomes a course record');
      t.equal(f.reopen().daily['2026-11-14'].place, 1, 'the results are there after a reload');
      // 70 days: only the latest 60 are kept, the streak is not truncated
      const g = mk(DEFAULT_SAVE());
      for (let i = 0; i < 70; i++) g.commit({ race: { token: {}, won: false, record: null, daily: { date: addDays('2026-01-01', i), track: 'bathhouse-row', team: 'engine-six', place: 5, time: 100 } } });
      t.equal(Object.keys(g.stored().daily).length, DAILY_KEEP, `only ${DAILY_KEEP} days are kept`);
      t.equal(g.stored().dailyStreak.n, 70, 'a 70 day streak is still counted');
      t.equal(Object.keys(g.stored().daily).sort()[0], addDays('2026-01-01', 70 - DAILY_KEEP), 'the oldest days are the ones dropped');
      // a failed write keeps the day pending and counts it once on the retry
      const box = { raw: JSON.stringify(DEFAULT_SAVE()), fail: true };
      const w = createSaveWriter({ read: () => box.raw, write: (raw) => { if (box.fail) throw new Error('blocked'); box.raw = raw; } });
      const sv = w.load(), token = {};
      const intent = { race: { token, won: false, record: null, daily: { date: '2026-11-10', track: 'bathhouse-row', team: 'engine-six', place: 3, time: 120 }, spilled: 5 } };
      w.commit(sv, intent);
      t.equal(sv.dailyStreak.n, 1, 'the day shows in the tab while it is not stored');
      box.fail = false; w.commit(sv, intent);
      const st = JSON.parse(box.raw);
      t.expect(st.dailyStreak.n === 1 && st.stats.gallonsSpilled === 5 && st.stats.races === 1, 'the retry counts the race, the streak and the water once');
      // a pre-wave save: nothing lost, new sections empty
      const o = mk(OLD());
      t.expect(JSON.stringify(o.save.daily) === '{}' && o.save.dailyStreak.n === 0 && o.save.stats.bestStreak === 0, 'a pre-wave save has an empty daily section');
      t.expect(o.save.stats.races === 12 && o.save.stats.gallonsSpilled === 40 && o.save.cups['bathhouse:soak'] === 1, 'and keeps its stats and cups');
      // damaged sections are dropped, not an error
      const bad = OLD(); bad.daily = { '2026-11-10': { place: 2, time: 90, track: 'x', team: 'y' }, 'nope': { place: 1, time: 1 }, '2026-11-11': { place: 0, time: 5 }, '2026-11-12': 4 }; bad.dailyStreak = { n: 'x' }; bad.stats.bestStreak = -4;
      const b = mk(bad);
      t.equal(Object.keys(b.save.daily).join(','), '2026-11-10', 'only the valid daily entry is kept');
      t.expect(b.save.dailyStreak.n === 0 && b.save.stats.bestStreak === 0, 'a damaged streak and best streak read as zero');
    },
  },
  {
    name: 'council D S3-02: the title has Daily Race and Records, the Daily Race plays the day\'s deal and counts a streak',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await fresh(t);
      await t.game('act', 'date', '2026-11-14');
      await t.game('scene', 'title'); await t.waitFrames(3);
      const buttons = await t.page.evaluate(() => [...document.querySelectorAll('.scr-title .menu .mbtn')].map((b) => b.textContent.trim()));
      t.expect(buttons.includes('Daily Race') && buttons.includes('Records'), 'the title lists them: ' + buttons.join(', '));
      await shot(t, 'S3-02-title');
      await t.checkLayout({ allowScrollY: true });
      const plan = dailyPlan('2026-11-14', COURSES);
      await t.game('act', 'menu', 'daily'); await t.waitFrames(3);
      t.equal((await t.state()).screen, 'daily', 'the Daily Race screen is up');
      const card = await t.page.evaluate(() => document.querySelector('.daily-card').textContent.replace(/\s+/g, ' '));
      const names = { 'bathhouse-row': 'Bathhouse Row', 'park-avenue': 'Park Avenue Nights', 'whittington-valley': 'Whittington Valley', 'bridge-street': 'Bridge Street Bash', 'hs-mountain': 'Hot Springs Mountain Drive', 'goat-rock-gulpha': 'Goat Rock & Gulpha Gorge', 'west-mountain': 'West Mountain Summit', 'sunset-ridge': 'Sunset Ridge' };
      t.expect(card.includes(names[plan.track]) && /not raced yet/.test(card) && /0 days/.test(card), 'it names today\'s course and says it is not raced yet: ' + card);
      await shot(t, 'S3-02-daily');
      await t.checkLayout({ allowScrollY: true });
      // the same date after a reload is the same deal; another date is another
      await t.reload(); await t.waitIdle(8000);
      await t.game('act', 'date', '2026-11-14'); await t.game('act', 'menu', 'daily'); await t.waitFrames(3);
      t.equal(await t.page.evaluate(() => document.querySelector('.daily-card').textContent.replace(/\s+/g, ' ')), card, 'the same day after a reload shows the same deal');
      await t.game('act', 'menu', 'dailyGo');
      await t.waitIdle(15000);
      let st = await t.state();
      t.expect(st.race && st.race.mode === 'quick' && st.track.id === plan.track && st.race.classId === 'soak' && st.race.laps === DAILY_LAPS && st.race.seed === plan.seed && st.race.karts[st.race.player].team === plan.team, `Race starts the deal: ${st.track.id}, ${st.race.karts[st.race.player].team}, ${st.race.laps} laps, seed ${st.race.seed}`);
      t.equal(st.race.karts.length, 8, 'with seven rivals');
      const rivals = st.race.karts.map((k) => k.team).join(',');
      // finish it as the autoplay driver would (the real route starts a human race: drive the same deal from the hook)
      const race = (date) => t.game('newGame', { mode: 'quick', count: 8, track: dailyPlan(date, COURSES).track, team: dailyPlan(date, COURSES).team, classId: 'soak', laps: DAILY_LAPS, seed: dailyPlan(date, COURSES).seed, daily: date, autoplay: true, paused: true });
      await race('2026-11-14');
      st = await t.state();
      t.equal(st.race.karts.map((k) => k.team).join(','), rivals, 'the same seven rivals line up again');
      st = await finishRace(t, 60 * 400);
      t.expect(st.daily && st.daily.date === '2026-11-14' && st.daily.streak === 1 && st.daily.first, 'the finish records day 1 of a streak: ' + JSON.stringify(st.daily));
      let sv = await readSave(t);
      t.expect(sv.daily['2026-11-14'] && sv.daily['2026-11-14'].place === st.daily.place && sv.dailyStreak.n === 1, 'it is in the save');
      t.expect(sv.stats.gallonsSpilled > 0, 'gallons spilled were counted: ' + sv.stats.gallonsSpilled);
      t.expect(!sv.best[plan.track], 'a daily race does not become the course record');
      await t.waitFrames(3);
      const lines = await t.page.evaluate(() => ((document.querySelector('.trial-lines') || {}).textContent || '').replace(/\s+/g, ' '));
      t.expect(/Daily Race, .*Streak: 1 day/.test(lines || ''), 'the results show the day and the streak: ' + lines);
      await shot(t, 'S3-02-daily-results');
      // the next day makes 2; a replay the same day does not
      await t.game('act', 'date', '2026-11-15');
      await race('2026-11-15'); st = await finishRace(t, 60 * 400);
      t.equal(st.daily.streak, 2, 'the next day: a streak of 2');
      await race('2026-11-15'); st = await finishRace(t, 60 * 400);
      t.expect(!st.daily.first && st.daily.streak === 2, 'a replay the same day leaves the streak at 2');
      sv = await readSave(t);
      t.expect(sv.stats.bestStreak === 2 && Object.keys(sv.daily).length === 2, 'two days saved, longest streak 2');
      await t.reload(); await t.waitIdle(8000);
      await t.game('act', 'date', '2026-11-16'); await t.game('act', 'menu', 'daily'); await t.waitFrames(3);
      t.expect(/Streak\s*2 days/.test(await t.page.evaluate(() => document.querySelector('.daily-card').textContent.replace(/\s+/g, ' '))), 'the day after, the streak is still alive');
      await t.game('act', 'date', '2026-11-18'); await t.game('act', 'menu', 'daily'); await t.waitFrames(3);
      t.expect(/Streak\s*0 days · longest 2 days/.test(await t.page.evaluate(() => document.querySelector('.daily-card').textContent.replace(/\s+/g, ' '))), 'two days later it has lapsed, and the longest is remembered');
    },
  },
  {
    name: 'council D S3-02: the Records screen shows what the save knows, empty and full',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await fresh(t);
      await t.game('act', 'date', '2026-11-14');
      await t.game('act', 'menu', 'records'); await t.waitFrames(3);
      t.equal((await t.state()).screen, 'records', 'the Records screen is up');
      const txt = () => t.page.evaluate(() => document.querySelector('.records').textContent.replace(/\s+/g, ' '));
      let x = await txt();
      t.expect(/0\s*races/.test(x) && /0\s*wins/.test(x) && /0%\s*win rate/.test(x), 'a fresh profile reads zeros: ' + x.slice(0, 120));
      t.expect(/Splash/.test(x) && /Boil/.test(x) && /Bathhouse Cup/.test(x) && /Ouachita Cup/.test(x), 'the cup grid lists both cups and every class');
      await shot(t, 'S3-02-records-fresh');
      // a played profile
      const sv = OLD();
      sv.unlocked.classes = ['splash', 'soak', 'scald', 'boil'];
      sv.cups = { 'bathhouse:soak': 1, 'bathhouse:scald': 3, 'ouachita:soak': 5 };
      sv.best = { 'bathhouse-row': { race: 150.2, lap: 48, team: 'engine-six', cls: 'scald' }, 'hs-mountain': { race: 171.5, lap: null, team: 'engine-six', cls: 'soak' } };
      sv.trial = { 'bathhouse-row': { race: 142.1, lap: 46.9, medal: 3 }, 'park-avenue': { race: 155, lap: 51.2, medal: 1 } };
      sv.daily = { '2026-11-13': { place: 1, time: 90, track: 'park-avenue', team: 'engine-six' }, '2026-11-14': { place: 4, time: 99, track: 'bridge-street', team: 'engine-six' }, '2026-11-10': { place: 8, time: 120, track: 'bridge-street', team: 'engine-six' } };
      sv.dailyStreak = { n: 2, last: '2026-11-14' };
      sv.stats = { races: 40, wins: 11, gallonsSpilled: 321.5, bestStreak: 5 };
      await fresh(t, sv);
      await t.game('act', 'date', '2026-11-14');
      await t.game('act', 'menu', 'records'); await t.waitFrames(3);
      x = await txt();
      t.expect(/40\s*races/.test(x) && /11\s*wins/.test(x) && /28%\s*win rate/.test(x) && /322\s*gallons spilled/.test(x), 'totals: ' + x.slice(0, 160));
      t.expect(/2 days\s*daily streak/.test(x) && /5 days\s*longest streak/.test(x), 'streaks read 2 and 5 days');
      t.expect(/1st/.test(x) && /3rd/.test(x) && /5th/.test(x), 'the cup grid shows the places');
      t.expect(/2:30\.20/.test(x) && /2:22\.10/.test(x) && /Gold/.test(x) && /Bronze/.test(x), 'the course table shows race bests, Time Trial bests and medals');
      const cal = await t.page.evaluate(() => [...document.querySelectorAll('.cal li')].map((l) => ({ done: l.classList.contains('done'), today: l.classList.contains('today'), text: l.textContent })));
      t.equal(cal.length, 14, 'a 14 day calendar');
      t.expect(cal[13].today && cal[13].done && cal[12].done && !cal[11].done && cal[9].done, 'it marks the days raced and today');
      await shot(t, 'S3-02-records');
      await t.checkLayout({ allowScrollY: true });
      await t.page.evaluate(() => document.querySelector('.records').scrollTo(0, 9999));
      await t.waitFrames(2);
      await shot(t, 'S3-02-records-bottom');
      // keyboard: Back is the focused control and Escape-style back returns to the title
      await t.game('act', 'menu', 'back');
      t.equal((await t.state()).screen, 'title', 'Back returns to the title');
    },
  },

  // ---------------------------------------------------------------- S3-05
  {
    name: 'council D S3-05: a fresh save locks the Ouachita Cup and Mirror, a pre-wave save keeps what it had, and the record is written once',
    node: true,
    async run(t) {
      const fresh = mk(undefined);
      t.equal(fresh.save.unlocked.cups.join(','), 'bathhouse', 'a fresh profile has only the Bathhouse Cup');
      t.expect(fresh.save.unlocked.mirror === false && fresh.save.unlocked.rec === 2 && fresh.save.settings.mirror === false, 'Mirror is locked and off, and the unlock record is current');
      t.expect(!fresh.writer.grandfathered(), 'a fresh profile is not a pre-wave save');
      // a pre-wave save (the fixture the earlier tests use): both cups, nothing lost, then the record is written
      const old = OLD(); old.unlocked.classes = ['splash', 'soak', 'scald']; old.unlocked.teams = ['gator-gang', 'tub-ninjas'];
      old.settings.music = false; old.settings.sound = false;
      const o = mk(old);
      t.expect(o.writer.grandfathered(), 'the save is seen as one written before the unlock record');
      t.equal(o.save.unlocked.cups.join(','), 'bathhouse,ouachita', 'an older save keeps both cups open');
      t.equal(o.save.unlocked.mirror, false, 'Mirror did not exist before, so it starts locked');
      t.equal(o.save.unlocked.classes.join(','), 'splash,soak,scald', 'its classes are kept');
      t.equal(o.save.unlocked.teams.join(','), 'gator-gang,tub-ninjas', 'its teams are kept');
      t.expect(o.box.raw === JSON.stringify(old), 'loading alone does not write');
      o.commit({});
      const st = o.stored();
      t.expect(st.unlocked.rec === 2 && st.unlocked.cups.includes('ouachita') && !('grandfathered' in st.unlocked), 'the first write records the unlock: ' + JSON.stringify(st.unlocked));
      for (const k of ['best', 'cups', 'ghosts', 'lastTeam', 'lastClass']) t.equal(JSON.stringify(st[k]), JSON.stringify(old[k]), `${k} is untouched`);
      t.expect(st.stats.races === 12 && st.stats.wins === 5 && st.stats.gallonsSpilled === 40, 'its stats are untouched (new fields start at zero)');
      t.expect(st.settings.sound === false && st.settings.music === false, 'a save that had sound off stays silent');
      const again = o.reopen();
      t.equal(again.unlocked.cups.join(','), 'bathhouse,ouachita', 'both cups are open after a reload');
      const w2 = createSaveWriter({ read: () => o.box.raw, write: (r) => { o.box.raw = r; } }); w2.load();
      t.expect(!w2.grandfathered(), 'and it is not treated as pre-wave again');
      // a save that never had an unlocked section, and a damaged one
      const bare = mk({ v: 1, best: { 'park-avenue': { race: 140, lap: 46, team: 'engine-six', cls: 'soak' } } });
      t.expect(bare.save.unlocked.cups.includes('ouachita') && bare.save.best['park-avenue'].race === 140, 'a bare older save keeps both cups and its time');
      const edited = mk({ ...OLD(), unlocked: { ...OLD().unlocked, rec: 2, mirror: 'yes' } });
      t.equal(edited.save.unlocked.cups.join(','), 'bathhouse', 'a save with the record and one cup keeps one cup (no free unlock)');
      t.equal(edited.save.unlocked.mirror, false, 'a mirror flag that is not true reads as locked');
    },
  },
  {
    name: 'council D S3-05: a Bathhouse podium opens the Ouachita Cup and a Scald win opens Mirror, each announced once and kept',
    node: true,
    async run(t) {
      const teamOrder = ['gator-gang', 'silks-stirrups', 'flamingo-flock', 'tub-ninjas'];
      const cup = (f, key, place, cls) => f.commit({ cup: { token: {}, key, place, soak: cls === 'soak', scald: cls === 'scald', teamOrder } });
      const f = mk(undefined);
      let r = cup(f, 'bathhouse:soak', 4, 'soak');
      t.expect(!r.unlockedCup && f.stored().unlocked.cups.join(',') === 'bathhouse', 'fourth in the Bathhouse Cup opens nothing');
      r = cup(f, 'ouachita:soak', 1, 'soak');
      t.expect(!r.unlockedCup && f.stored().unlocked.cups.join(',') === 'bathhouse', 'a win in a cup that is not open does not open it by itself');
      r = cup(f, 'bathhouse:soak', 3, 'soak');
      t.equal(r.unlockedCup, 'ouachita', 'third place in the Bathhouse Cup opens the Ouachita Cup, and says so');
      t.expect(f.stored().unlocked.cups.join(',') === 'bathhouse,ouachita' && !f.stored().unlocked.mirror, 'it is saved, and Mirror is still locked');
      r = cup(f, 'bathhouse:soak', 1, 'soak');
      t.expect(!r.unlockedCup && !r.unlockedMirror, 'a second podium announces nothing new');
      r = cup(f, 'bathhouse:scald', 2, 'scald');
      t.expect(!r.unlockedMirror && !f.stored().unlocked.mirror, 'second on Scald does not open Mirror');
      r = cup(f, 'ouachita:scald', 1, 'scald');
      t.expect(r.unlockedMirror && f.stored().unlocked.mirror === true && r.unlockedClass === 'boil', 'a cup won on Scald opens Mirror (and Boil)');
      t.equal(f.reopen().unlocked.mirror, true, 'Mirror is open after a reload');
      r = cup(f, 'ouachita:scald', 1, 'scald');
      t.expect(!r.unlockedMirror, 'and is not announced twice');
      // a failed write keeps the unlock pending and announced on the retry
      const box = { raw: JSON.stringify(DEFAULT_SAVE()), fail: true };
      const w = createSaveWriter({ read: () => box.raw, write: (raw) => { if (box.fail) throw new Error('blocked'); box.raw = raw; } });
      const sv = w.load(), token = {};
      const intent = { cup: { token, key: 'bathhouse:soak', place: 2, soak: true, scald: false, teamOrder } };
      w.commit(sv, intent);
      t.equal(sv.unlocked.cups.join(','), 'bathhouse,ouachita', 'the unlock shows in the tab while the write fails');
      box.fail = false;
      const again = w.commit(sv, intent);
      t.expect(JSON.parse(box.raw).unlocked.cups.includes('ouachita') && again.unlockedCup === 'ouachita', 'the retry stores it and still announces it');
    },
  },
  {
    name: 'council D S3-05: the cup screen shows the Ouachita Cup locked with its condition, and a locked cup is never raced',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await fresh(t);
      await t.game('act', 'menu', 'gp'); await t.waitFrames(3);
      await t.game('act', 'menu', 'teamOk'); await t.waitFrames(3);
      await t.game('act', 'menu', 'cls', { id: 'soak' }); await t.waitFrames(3);
      t.equal((await t.state()).screen, 'cups', 'the cup screen is up');
      const read = () => t.page.evaluate(() => [...document.querySelectorAll('.cups .ccard')].map((b) => ({ id: b.dataset.id, act: b.dataset.act, disabled: b.getAttribute('aria-disabled'), text: b.textContent.replace(/\s+/g, ' ').trim() })));
      let rows = await read();
      t.equal(rows.map((r) => r.act).join(','), 'cup,locked', 'Bathhouse is open and Ouachita is locked on a fresh profile');
      t.expect(/Locked: Finish on the podium in the Bathhouse Cup/.test(rows[1].text) && rows[1].disabled === 'true', 'the lock names its condition: ' + rows[1].text);
      const mirror = await t.page.evaluate(() => document.querySelector('.cups .mirror-row').textContent.replace(/\s+/g, ' ').trim());
      t.expect(/Win a cup on Scald to unlock/.test(mirror), 'Mirror says what opens it: ' + mirror);
      await shot(t, 'S3-05-cups-fresh');
      await t.checkLayout({ allowScrollY: true });
      await t.game('act', 'menu', 'cup', { id: 'ouachita' }); await t.waitFrames(3);
      t.equal((await t.state()).scene, 'title', 'asking for the locked cup does not start a race (still on the menus)');
      // an older save: both open, the record is written on load
      const old = OLD(); old.unlocked.classes = ['splash', 'soak', 'scald'];
      await fresh(t, old);
      const raw = await readSave(t);
      t.expect(raw.unlocked.rec === 2 && raw.unlocked.cups.includes('ouachita'), 'the unlock record was written when the game loaded: ' + JSON.stringify(raw.unlocked));
      t.equal(raw.stats.races, 12, 'and nothing else changed');
      await t.game('act', 'menu', 'gp'); await t.waitFrames(3);
      await t.game('act', 'menu', 'teamOk'); await t.waitFrames(3);
      await t.game('act', 'menu', 'cls', { id: 'soak' }); await t.waitFrames(3);
      rows = await read();
      t.equal(rows.map((r) => r.act).join(','), 'cup,cup', 'an older save has both cups open');
      await shot(t, 'S3-05-cups-older-save');
      await t.reload(); await t.waitIdle(8000);
      t.equal((await readSave(t)).unlocked.cups.join(','), 'bathhouse,ouachita', 'both are still open after a reload');
    },
  },
  {
    name: 'council D S3-05: finishing a cup on the podium unlocks and announces the Ouachita Cup; a Scald win unlocks Mirror',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      const rivals = ['gator-gang', 'silks-stirrups', 'flamingo-flock', 'tub-ninjas', 'lather-linen', 'suds-posse', 'velvet-mob'];
      const finishedCup = (humanPoints, classId, cupId = 'bathhouse') => {
        const table = { 'engine-six': { team: 'engine-six', points: humanPoints, clean: 0, human: true, bribes: 0 } };
        rivals.forEach((r, i) => { table[r] = { team: r, points: 40 - i * 4 + (r === 'gator-gang' ? 1 : 0), clean: 0, human: false, bribes: 0 }; });
        return { v: 1, cup: cupId, name: cupId === 'bathhouse' ? 'Bathhouse Cup' : 'Ouachita Cup', tracks: cupId === 'bathhouse' ? ['bathhouse-row', 'park-avenue', 'whittington-valley', 'bridge-street'] : ['hs-mountain', 'goat-rock-gulpha', 'west-mountain', 'sunset-ridge'], round: 3, table, rivals, team: 'engine-six', classId, seed: 5 };
      };
      const trophy = async (cupState) => {
        await t.page.evaluate((c) => localStorage.setItem('hsg-tub-rally-cup-v1', JSON.stringify(c)), cupState);
        await t.reload(); await t.waitIdle(8000);
        await t.game('act', 'menu', 'continueCup'); await t.waitFrames(3);
        t.equal((await t.state()).screen, 'standings', 'the saved cup opens on its final standings');
        await t.game('act', 'menu', 'trophy'); await t.waitFrames(3);
        t.equal((await t.state()).screen, 'trophy', 'the trophy screen is up');
        return t.page.evaluate(() => document.querySelector('.trophy').textContent.replace(/\s+/g, ' ').trim());
      };
      await fresh(t);
      let x = await trophy(finishedCup(33, 'soak')); // third: above the 32 points of the best rival below
      const place = x.match(/finished (\d)/);
      t.expect(place && +place[1] <= 3, 'the human finished on the podium: ' + x);
      t.expect(/New cup unlocked: Ouachita Cup/.test(x) && !/Mirror unlocked/.test(x), 'the trophy screen announces the Ouachita Cup and not Mirror: ' + x);
      await shot(t, 'S3-05-trophy-ouachita');
      await t.checkLayout({ allowScrollY: true });
      let sv = await readSave(t);
      t.expect(sv.unlocked.cups.includes('ouachita') && !sv.unlocked.mirror && sv.cups['bathhouse:soak'] <= 3, 'it is saved with the place');
      // a cup won on Scald
      await fresh(t, { ...OLD(), unlocked: { ...OLD().unlocked, cups: ['bathhouse', 'ouachita'], classes: ['splash', 'soak', 'scald'], rec: 2 }, cups: {} });
      x = await trophy(finishedCup(99, 'scald', 'ouachita'));
      t.expect(/finished 1st/.test(x) && /Mirror unlocked/.test(x) && /Boil/.test(x), 'a win on Scald announces Boil and Mirror: ' + x);
      await shot(t, 'S3-05-trophy-mirror');
      sv = await readSave(t);
      t.expect(sv.unlocked.mirror === true && sv.unlocked.classes.includes('boil'), 'both are saved');
      // the course screen now offers the switch, and it persists
      await t.reload(); await t.waitIdle(8000);
      await t.game('act', 'menu', 'quick'); await t.waitFrames(3);
      await t.game('act', 'menu', 'teamOk'); await t.waitFrames(3);
      await t.game('act', 'menu', 'cls', { id: 'soak' }); await t.waitFrames(3);
      const chips = () => t.page.evaluate(() => [...document.querySelectorAll('.courses .mirror-row .chip')].map((c) => ({ v: c.dataset.v, on: c.getAttribute('aria-pressed') })));
      let c = await chips();
      t.expect(c.length === 2 && c[0].on === 'true' && c[1].on === 'false', 'Mirror is Off by default once unlocked: ' + JSON.stringify(c));
      await t.game('act', 'menu', 'mirror', { v: 'true' }); await t.waitFrames(3);
      c = await chips();
      t.expect(c[1].on === 'true', 'turning it On shows On');
      await shot(t, 'S3-05-courses-mirror-on');
      await t.checkLayout({ allowScrollY: true });
      await t.reload(); await t.waitIdle(8000);
      t.equal((await readSave(t)).settings.mirror, true, 'the choice is saved');
    },
  },
  {
    name: 'council D S3-05: a mirrored race flips the picture, the steering and the minimap; the sim and its times are unchanged',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      const open = (mirror) => ({ ...OLD(), unlocked: { ...OLD().unlocked, cups: ['bathhouse', 'ouachita'], mirror: true, rec: 2 }, settings: { ...OLD().settings, mirror } });
      const flip = () => t.page.evaluate(() => getComputedStyle(document.getElementById('gl')).transform);
      const drive = async (mirror) => {
        await fresh(t, open(mirror));
        await t.game('newGame', { track: 'bathhouse-row', team: 'engine-six', seed: 4, paused: true });
        await t.game('act', 'skipCountdown');
        const k = t.page.keyboard;
        await k.down('ArrowUp'); await k.down('ArrowRight');
        const y0 = (await t.state()).race.karts[0].yaw;
        await t.game('step', 90);
        const st = await t.state();
        await k.up('ArrowRight'); await k.up('ArrowUp');
        return { yaw: st.race.karts[st.race.player].yaw - y0, flip: await flip(), st };
      };
      const plain = await drive(false);
      t.equal(plain.flip, 'none', 'Mirror off: the picture is not flipped');
      const mir = await drive(true);
      t.expect(/^matrix\(-1, 0, 0, 1,/.test(mir.flip), 'Mirror on: the picture is flipped left for right: ' + mir.flip);
      t.expect(plain.yaw * mir.yaw < 0 && Math.abs(Math.abs(plain.yaw) - Math.abs(mir.yaw)) < 0.05, `the right key turns the tub the other way in the mirror (yaw ${plain.yaw.toFixed(2)} against ${mir.yaw.toFixed(2)}): on screen it is still right`);
      await t.waitFrames(3);
      await shot(t, 'S3-05-mirror-race');
      await t.game('scene', 'title'); await t.waitFrames(3);
      t.equal(await flip(), 'none', 'the title screen is never flipped');
      // the daily race and the hooks' own held input are not mirrored
      await t.game('newGame', { mode: 'quick', track: 'bathhouse-row', team: 'engine-six', seed: 4, paused: true, daily: '2026-11-14' });
      t.equal(await flip(), 'none', 'the Daily Race is never mirrored');
      // the sim is the same: an autoplay lap finishes at the same time with and without it
      const lap = async (mirror) => {
        await fresh(t, open(mirror));
        await t.game('newGame', { track: 'park-avenue', team: 'engine-six', mode: 'timetrial', classId: 'scald', count: 1, laps: 1, paused: true, autoplay: true, seed: 4 });
        const st = await finishRace(t, 60 * 200);
        return { t: st.race.karts[0].finishT, mirror: st.race.karts.length };
      };
      const a = await lap(false), b = await lap(true);
      t.expect(Math.abs(a.t - b.t) < 1e-6, `a mirrored lap takes exactly as long: ${a.t.toFixed(3)} s and ${b.t.toFixed(3)} s`);
      // a hand-edited save that asks for Mirror without owning it is not flipped
      await fresh(t, { ...OLD(), settings: { ...OLD().settings, mirror: true } });
      await t.game('newGame', { track: 'bathhouse-row', team: 'engine-six', seed: 4, paused: true });
      t.equal(await flip(), 'none', 'Mirror asked for but locked: the picture is not flipped');
    },
  },
];
