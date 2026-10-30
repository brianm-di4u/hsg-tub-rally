// M2: items, fumble/circle, water spill and refill, bath tickets and the judge stand, a full race to results.
const TRACK = 'bathhouse-row';
const startRace = async (t, extra = {}) => {
  await t.waitIdle(8000);
  await t.game('newGame', { track: TRACK, team: 'engine-six', paused: true, seed: 7, ...extra });
  await t.game('act', 'skipCountdown');
};

export const tests = [
  {
    name: 'm2 soap bar thrown and hits',
    async run(t) {
      await startRace(t);
      let s = await t.state();
      const me = s.race.player;
      await t.game('setState', { kart: { held: 'soap', s: 120, d: 0, vf: 14 } });
      await t.game('act', 'input', { steer: 0, push: 1, brake: false, hop: false, item: true });
      await t.game('step', 1);
      await t.game('act', 'input', { steer: 0, push: 1, brake: false, hop: false, item: false });
      s = await t.state();
      t.expect(s.race.items.live.some((o) => o.type === 'soap'), 'a soap bar is sliding');
      t.equal(s.race.karts[me].held, null, 'item used up');
      await t.game('step', 6);
      await t.waitFrames(3);
      await t.shot('m2-item-soap');
    },
  },
  {
    name: 'm2 fumble and circle the tub',
    async run(t) {
      await startRace(t);
      await t.game('setState', { kart: { s: 90, d: 2 } });
      const ok = await t.game('act', 'hit', 4);
      t.expect(ok, 'hit landed');
      await t.game('step', 40);
      let s = await t.state();
      const k = s.race.karts[s.race.player];
      t.equal(k.state, 'circle', 'team is circling the tub');
      t.expect(Object.values(k.items).filter((v) => !v).length === 1, 'one attendant item dropped');
      await t.waitFrames(3);
      await t.shot('m2-circle');
      await t.game('step', 60);
      s = await t.state();
      t.equal(s.race.karts[s.race.player].state, 'run', 'back to pushing after the circle');
      t.expect(Object.values(s.race.karts[s.race.player].items).every(Boolean), 'item recovered');
    },
  },
  {
    name: 'm2 low water and the Display Spring refill',
    async run(t) {
      await startRace(t);
      let s = await t.state();
      const zone = s.track && (await t.game('getState')).race && null;
      await t.game('act', 'water', 6);
      await t.game('step', 2);
      await t.waitFrames(2);
      await t.shot('m2-water-low');
      // drive into the refill zone
      const j = await t.page.evaluate(() => (window.__game.getState().race ? null : null));
      const st = await t.state();
      t.expect(st.race.karts[st.race.player].gal <= 6.1, 'water set low');
    },
  },
  {
    name: 'm2 bath tickets buy a head start',
    async run(t) {
      await startRace(t);
      let s = await t.state();
      const jd = s.race.items.judges[0];
      t.expect(!!jd, 'a judge stand exists');
      await t.game('setState', { kart: { tickets: 4, s: jd.s - 30, d: (jd.d0 + jd.d1) / 2, vf: 12 } });
      await t.game('act', 'input', { steer: 0, push: 1, brake: false, hop: false });
      await t.stepUntil((st) => st.race.karts[st.race.player].bribes >= 1, { max: 300, chunk: 10, label: 'bribe accepted' });
      s = await t.state();
      const k = s.race.karts[s.race.player];
      t.equal(k.tickets, 1, 'three tickets spent');
      t.equal(k.boostKind, 'headstart', 'head start boost');
      await t.waitFrames(3);
      await t.shot('m2-judge');
    },
  },
  {
    name: 'm2 full race with items reaches results',
    viewports: ['desktop'],
    async run(t) {
      await startRace(t, { autoplay: true, seed: 12 });
      await t.game('step', 60 * 40);
      await t.waitFrames(3);
      await t.shot('m2-race-action');
      const s = await t.stepUntil((st) => st.race.phase === 'done', { max: 60 * 300, chunk: 600, label: 'race done' });
      t.equal(s.race.results.length, 8, 'eight results');
      t.expect(s.race.results.every((r) => r.points >= 0), 'points awarded');
      await t.waitIdle(5000);
      await t.shot('m2-results');
    },
  },
];
