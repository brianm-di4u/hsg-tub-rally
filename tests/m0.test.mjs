// M0: boot, title, gray-box race view at 240 lines, offline (file://) load, and a headless AI race in Node.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const tests = [
  {
    name: 'm0 boot to title',
    async run(t) {
      await t.waitIdle(8000);
      const s = await t.state();
      t.equal(s.scene, 'title', 'title scene');
      t.equal(s.screen, 'title', 'title menu shown');
      t.equal(s.render.mode, 'native', 'the brick look renders at native resolution by default');
      t.expect(Math.min(s.render.w, s.render.h) > 240, `native resolution (got ${s.render.w}x${s.render.h})`);
      await t.game('setState', { res: 'authentic' });
      const r = (await t.state()).render;
      t.expect(r.h === 240 || r.w === 240, `the Retro setting renders 240 lines (got ${r.w}x${r.h})`);
      await t.game('setState', { res: 'native' });
      await t.shot('m0-title');
      await t.checkLayout();
      t.log('load ms', t.loadMs);
    },
  },
  {
    name: 'm0 graybox race view',
    async run(t) {
      await t.waitIdle(8000);
      await t.game('newGame', { track: 'graybox', team: 'engine-six', classId: 'soak', paused: true, seed: 7 });
      await t.game('act', 'input', { steer: 0, push: 1, brake: false, hop: false });
      await t.game('step', 200); // countdown (3.2 s) then a moment of pushing
      let s = await t.state();
      t.equal(s.race.phase, 'race', 'race started after the countdown');
      await t.game('step', 240);
      s = await t.state();
      const me = s.race.karts[s.race.player];
      t.expect(me.vf > 8, `the tub is moving (vf ${me.vf})`);
      t.expect(me.lap >= 1 && me.s > 1 && me.s < 200, `crossed the start line and moved down the straight (lap ${me.lap}, s ${me.s})`);
      await t.waitFrames(3);
      await t.shot('m0-graybox');
      s = await t.state();
      t.log('render', JSON.stringify(s.render), 'world', JSON.stringify(s.world));
      const budget = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools', 'perf-budgets.json'), 'utf8')).tiers[s.render.builtTier || s.render.tier].draws; // reviews/PERF.md
      t.expect(s.render.draws <= budget, `draw calls within budget (${s.render.draws} ≤ ${budget}, ${s.render.tier})`);
      // a power slide into the hairpin region for a mid-action frame
      await t.game('act', 'teleport', 400, 0);
      await t.game('act', 'input', { steer: 0, push: 1, brake: false, hop: false });
      await t.game('step', 90);
      await t.game('act', 'input', { steer: 1, push: 1, brake: false, hop: true });
      await t.game('step', 40);
      s = await t.state();
      t.log('drift', s.race.karts[s.race.player].drift, 'stage', s.race.karts[s.race.player].stage);
      await t.waitFrames(3);
      await t.shot('m0-slide');
      const fc = await t.frameCost(1500);
      t.log('frameCost', JSON.stringify(fc));
      t.expect(fc.taskMs < 4, `frame task time under 4 ms (${fc.taskMs})`);
    },
  },
  {
    name: 'm0 fordyce pilot in the world',
    async run(t) {
      await t.waitIdle(8000);
      await t.game('newGame', { track: 'graybox', team: 'lather-linen', paused: true, seed: 3 });
      const s0 = await t.state();
      const L = s0.track.length;
      await t.game('act', 'teleport', 0.127 * L - 40, 3);
      await t.game('step', 1);
      await t.waitIdle(8000);
      await t.waitFrames(4);
      await t.shot('m0-fordyce-chase');
      const lm = await t.game('act', 'landmark', 'fordyce');
      t.expect(!!lm, 'the Fordyce model is placed');
      if (lm) {
        // a 3/4 street view from across the road, 1.6 m eye height
        const fx = Math.sin(lm.yaw), fz = Math.cos(lm.yaw), rx = Math.cos(lm.yaw), rz = -Math.sin(lm.yaw);
        await t.game('act', 'camAt', [lm.x + fx * 21 - rx * 17, lm.y + 1.6, lm.z + fz * 21 - rz * 17], [lm.x, lm.y + 9, lm.z]);
        await t.waitFrames(4);
        await t.shot('m0-fordyce-pilot');
        await t.game('act', 'camAt', null);
      }
    },
  },
  {
    name: 'm0 offline file:// boot',
    fileUrl: true,
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      const s = await t.state();
      t.equal(s.scene, 'title', 'title from file://');
      await t.game('newGame', { track: 'graybox', paused: true });
      await t.game('step', 260);
      await t.waitFrames(2);
      await t.shot('m0-fileurl-race');
    },
  },
  {
    name: 'm0 headless AI race finishes',
    node: true,
    async run(t) {
      const { Track } = await import('../src/js/sim/track.js');
      const { makeRace, stepRace, DT } = await import('../src/js/sim/race.js');
      const tr = new Track(JSON.parse(fs.readFileSync(path.join(ROOT, 'data/tracks/graybox.json'), 'utf8')));
      const race = makeRace(tr, { laps: 3, classId: 'soak', player: null, seed: 7, noItems: true });
      for (let i = 0; i < 60 * 400 && race.phase !== 'done'; i++) stepRace(race, tr, [], DT);
      t.equal(race.phase, 'done', 'race completes');
      const fin = race.karts.filter((k) => k.finished).length;
      t.expect(fin === 8, `all 8 AI finish (${fin})`);
      const laps = race.karts.flatMap((k) => k.lapTimes);
      t.log('lap times', Math.min(...laps).toFixed(1), '-', Math.max(...laps).toFixed(1));
    },
  },
];
