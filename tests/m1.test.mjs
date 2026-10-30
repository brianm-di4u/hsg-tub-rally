// M1: the real Bathhouse Row course: start grid, the Row in order, a driven lap, slides, walls, determinism.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TRACK = 'bathhouse-row';

export const tests = [
  {
    name: 'm1 row grid and landmarks',
    async run(t) {
      await t.waitIdle(8000);
      await t.game('newGame', { track: TRACK, team: 'engine-six', paused: true, seed: 7 });
      await t.game('step', 30);
      await t.waitIdle(8000); await t.waitFrames(3);
      await t.shot('m1-grid');
      const s = await t.state();
      t.equal(s.track.id, TRACK, 'Bathhouse Row loaded');
      t.log('render', JSON.stringify(s.render), 'world', JSON.stringify(s.world));
      t.expect(s.render.draws <= 120, `draws within budget (${s.render.draws})`);
      // walk the camera down the Row: a shot in front of the Fordyce
      const lm = await t.game('act', 'landmark', 'fordyce');
      t.expect(!!lm, 'Fordyce placed');
      if (lm) {
        const fx = Math.sin(lm.yaw), fz = Math.cos(lm.yaw), rx = Math.cos(lm.yaw), rz = -Math.sin(lm.yaw);
        await t.game('act', 'camAt', [lm.x + fx * 36 + rx * 26, lm.y + 3, lm.z + fz * 36 + rz * 26], [lm.x - rx * 10, lm.y + 7, lm.z - rz * 10]);
        await t.waitFrames(3);
        await t.shot('m1-row');
        await t.game('act', 'camAt', null);
      }
    },
  },
  {
    name: 'm1 row order matches the research',
    node: true,
    async run(t) {
      const j = JSON.parse(fs.readFileSync(path.join(ROOT, `data/tracks/${TRACK}.json`), 'utf8'));
      const order = ['bathhouse-superior', 'bathhouse-hale', 'bathhouse-maurice', 'bathhouse-fordyce', 'bathhouse-quapaw', 'bathhouse-ozark', 'bathhouse-buckstaff', 'bathhouse-lamar'];
      let got = j.rowOrder.slice().sort((a, b) => a.s - b.s).map((r) => r.id);
      const k = got.indexOf('bathhouse-superior');
      got = [...got.slice(k), ...got.slice(0, k)]; // the start line sits mid-Row, so read the order cyclically
      t.equal(got.join(','), order.join(','), 'north→south order along the course (race direction is south)');
      t.expect(j.rowOrder.every((r) => r.d < 0), 'all eight bathhouses on the left (east) side going south');
    },
  },
  {
    name: 'm1 a driven lap with slides',
    slow: false,
    async run(t) {
      await t.waitIdle(8000);
      await t.game('newGame', { track: TRACK, team: 'trail-shredders', paused: true, seed: 11, count: 1, mode: 'timetrial', autoplay: true });
      // the time-trial tub drives itself here (autoplay) so the test exercises a full lap of the real course
      const s = await t.stepUntil((st) => st.race.karts[0].lap >= 2, { max: 60 * 120, chunk: 120, label: 'one lap' });
      const k = s.race.karts[0];
      t.expect(k.lapTimes.length >= 1, 'a lap completed');
      t.log('lap time', k.lapTimes[0], 'gal', k.gal);
      t.expect(k.lapTimes[0] > 35 && k.lapTimes[0] < 70, `lap time in range (${k.lapTimes[0]})`);
      await t.waitFrames(3);
      await t.shot('m1-lap');
    },
  },
];

export const tests2 = [];
tests.push(
  {
    name: 'm1 determinism: browser and Node agree',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      const opts = { track: TRACK, team: 'engine-six', classId: 'soak', laps: 3, seed: 21, count: 8, paused: true, autoplay: true, noItems: false };
      await t.game('newGame', opts);
      await t.game('step', 900);
      const hb = await t.game('act', 'hash');
      const { Track } = await import('../src/js/sim/track.js');
      const { makeRace, stepRace, DT } = await import('../src/js/sim/race.js');
      const { hashRace } = await import('../src/js/hooks.js');
      const tr = new Track(JSON.parse(fs.readFileSync(path.join(ROOT, `data/tracks/${TRACK}.json`), 'utf8')));
      const race = makeRace(tr, { laps: 3, classId: 'soak', player: 'engine-six', seed: 21, mode: 'quick', noItems: false, count: 8, autoplay: true });
      for (let i = 0; i < 900; i++) stepRace(race, tr, [], DT);
      const hn = hashRace(race);
      t.equal(hb, hn, 'same seed and inputs → same state hash');
    },
  },
  {
    name: 'm1 time trial saves a ghost and races it',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      await t.game('act', 'clearSave');
      await t.game('newGame', { track: TRACK, team: 'steam-rangers', mode: 'timetrial', count: 1, paused: true, autoplay: true, seed: 4 });
      const s = await t.stepUntil((st) => st.race.phase === 'done', { max: 60 * 240, chunk: 600, label: 'time trial finished' });
      t.expect(s.best && s.best.race > 0, `best time saved (${s.best && s.best.race})`);
      await t.reload();
      await t.waitIdle(8000);
      await t.game('newGame', { track: TRACK, team: 'bubble-patrol', mode: 'timetrial', count: 1, paused: true, seed: 5 });
      const s2 = await t.state();
      t.expect(!!s2.ghost, 'ghost loaded after a reload');
      await t.game('act', 'input', { steer: 0, push: 1, brake: false, hop: false });
      await t.game('step', 230);
      await t.game('act', 'input', { steer: 0, push: 0, brake: false, hop: false });
      await t.game('step', 140);
      await t.waitFrames(3);
      await t.shot('m1-ghost');
    },
  },
  {
    name: 'm1 real keyboard lap',
    viewports: ['desktop'],
    slow: true,
    async run(t) {
      await t.waitIdle(8000);
      await t.game('newGame', { track: TRACK, team: 'engine-six', mode: 'timetrial', count: 1, seed: 8 });
      const kb = t.page.keyboard;
      await kb.down('ArrowUp');
      const held = { left: false, right: false, hop: false };
      const set = async (key, on, flag) => { if (held[flag] !== on) { held[flag] = on; on ? await kb.down(key) : await kb.up(key); } };
      const t0 = Date.now();
      let st;
      while (Date.now() - t0 < 110000) {
        const hint = await t.game('act', 'aiHint');
        if (hint) {
          await set('ArrowLeft', hint.steer < -0.25, 'left');
          await set('ArrowRight', hint.steer > 0.25, 'right');
        }
        st = await t.state();
        if (st.race && st.race.karts[0].lap >= 2) break;
        await t.page.waitForTimeout(40);
      }
      await kb.up('ArrowUp'); await set('ArrowLeft', false, 'left'); await set('ArrowRight', false, 'right');
      const k = st.race.karts[0];
      t.expect(k.lap >= 2, `completed a lap with real key presses (lap ${k.lap}, s ${k.s})`);
      t.log('lap times', JSON.stringify(k.lapTimes), 'walls', k.surf);
      await t.shot('m1-keyboard');
    },
  },
);
