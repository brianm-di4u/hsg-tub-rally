// M3: Rules of the Row (bracket heat with judge stops and disqualification), the awards ceremony, and each
// built course's start and a landmark-ish frame.
export const tests = [
  {
    name: 'm3 rules of the row heat with judge stops',
    async run(t) {
      await t.waitIdle(8000);
      await t.game('newGame', { mode: 'row', track: 'bathhouse-row', team: 'engine-six', heatTeams: ['engine-six', 'lather-linen'], label: 'Semifinal', paused: true, seed: 5, autoplay: true });
      let s = await t.state();
      t.equal(s.race.mode, 'row', 'rules of the row heat');
      await t.game('step', 200);
      // drive until the first judge stop
      s = await t.stepUntil((st) => st.race.karts[st.race.player].state === 'judge', { max: 60 * 30, chunk: 10, label: 'first judge stop' });
      await t.waitFrames(3);
      await t.shot('m3-row-judge');
      // Ring Around the Tub is automatic: wait it out, then keep pushing to the finish with the AI hint steering
      s = await t.stepUntil((st) => st.race.phase === 'done', { max: 60 * 120, chunk: 60, label: 'heat done' });
      t.expect(s.race.results.length === 2, 'two results');
      await t.waitIdle(5000);
      await t.shot('m3-row-result');
    },
  },
  {
    name: 'm3 judge tasks respond to the right inputs',
    node: true,
    async run(t) {
      const fs = await import('node:fs');
      const { Track } = await import('../src/js/sim/track.js');
      const { stepRace, DT } = await import('../src/js/sim/race.js');
      const { makeHeat } = await import('../src/js/sim/rules-real.js');
      const tr = new Track(JSON.parse(fs.readFileSync(new URL('../data/tracks/bathhouse-row.json', import.meta.url), 'utf8')));
      for (const [task, inputs] of [
        ['jacks', (i) => ({ push: i % 10 < 5 ? 1 : 0 })],
        ['pushups', (i) => ({ steer: i % 20 < 10 ? -1 : 1 })],
        ['yodel', () => ({ hop: true })],
        ['ring', () => ({})],
      ]) {
        const h = makeHeat(tr, { teams: ['engine-six', 'lather-linen'], human: 'engine-six', seed: 2, tasks: [task, task, task] });
        const k = h.karts[h.player];
        // put the human in the first stop zone right after the countdown
        for (let i = 0; i < 200; i++) stepRace(h, tr, [], DT);
        const st = h.row.stops[0], p = tr.point(st.s, 0);
        k.x = p.x; k.z = p.z; k.s = st.s; k.vf = 0;
        let done = false;
        for (let i = 0; i < 60 * 8 && !done; i++) {
          const inp = []; inp[h.player] = { steer: 0, push: 0, brake: false, hop: false, ...inputs(i) };
          stepRace(h, tr, inp, DT);
          done = !!k.stopDone[0];
        }
        t.expect(done, `task ${task} completes with its input`);
      }
    },
  },
];

tests.push({
  name: 'm3 water fight arena',
  async run(t) {
    await t.waitIdle(8000);
    await t.game('newGame', { mode: 'battle', track: 'hill-wheatley', team: 'gator-gang', paused: true, seed: 4, autoplay: true });
    await t.game('step', 60 * 20);
    await t.waitFrames(3);
    await t.shot('m3-battle');
    const s = await t.stepUntil((st) => st.race.phase === 'done', { max: 60 * 200, chunk: 600, label: 'battle over' });
    t.equal(s.race.results.length, 8, 'eight results');
    await t.waitIdle(5000);
    await t.shot('m3-battle-result');
  },
});

// a review frame for every landmark placed on each built course (facade view from the street)
export const landmarkTour = (track) => ({
  name: `m3 landmark tour ${track}`,
  viewports: ['desktop'],
  async run(t) {
    await t.waitIdle(8000);
    await t.game('newGame', { track, team: 'steam-rangers', paused: true, seed: 2, count: 1, mode: 'timetrial' });
    await t.game('step', 1);
    await t.waitIdle(8000);
    const ids = await t.game('act', 'landmarks');
    t.log('landmarks', ids.join(', '));
    for (const id of ids) {
      const lm = await t.game('act', 'landmark', id);
      const fx = Math.sin(lm.yaw), fz = Math.cos(lm.yaw), rx = Math.cos(lm.yaw), rz = -Math.sin(lm.yaw);
      const big = /arlington|army|medical|tower/.test(id) ? 2.4 : 1;
      await t.game('act', 'camAt', [lm.x + fx * 30 * big + rx * 18 * big, lm.y + 4 * big, lm.z + fz * 30 * big + rz * 18 * big], [lm.x, lm.y + 8 * big, lm.z]);
      await t.waitFrames(3);
      await t.shot(`m3-${track}-lm-${id}`);
    }
    await t.game('act', 'camAt', null);
  },
});
tests.push(landmarkTour('bathhouse-row'));

// every built course: a start frame and a mid-race frame; landmark tours where models stand
const COURSES = ['bathhouse-row', 'park-avenue', 'whittington-valley', 'bridge-street', 'hs-mountain', 'goat-rock-gulpha', 'west-mountain', 'sunset-ridge'];
const fsm = await import('node:fs');
for (const id of COURSES) {
  if (!fsm.existsSync(new URL(`../assets/track-${id}.js`, import.meta.url))) continue;
  tests.push({
    name: `m3 course ${id}`,
    async run(t) {
      await t.waitIdle(8000);
      await t.game('newGame', { track: id, team: 'trail-shredders', paused: true, seed: 6 });
      await t.game('step', 200);
      await t.waitIdle(8000); await t.waitFrames(3);
      await t.shot(`m3-${id}-start`);
      const s0 = await t.state();
      t.log('render', JSON.stringify(s0.render));
      await t.game('act', 'input', { steer: 0, push: 1, brake: false, hop: false });
      // hand the player tub to the AI for a stretch so the mid-race frame is on the racing line
      await t.game('newGame', { track: id, team: 'trail-shredders', paused: true, seed: 6, autoplay: true });
      await t.game('step', 60 * 18);
      await t.waitFrames(3);
      await t.shot(`m3-${id}-race`);
    },
  });
  if (id !== 'bathhouse-row') tests.push(landmarkTour(id));
}
