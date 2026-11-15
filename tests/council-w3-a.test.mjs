// Wave 3, batch A: saves, lifecycle and robustness (S1-08, S2-11, S2-12, S2-25, S2-29, S3-06, S5-15, S6-16, P-N02, S1-05).
import fs from 'node:fs';

const SHOTS = '../_council/hsg-tub-rally/wave-3/shots';
const KEY = 'hsg-tub-rally-v1';
const shot = async (t, id, what) => { await t.shot(`w3a-${id}-${what}`); fs.mkdirSync(SHOTS, { recursive: true }); await t.page.screenshot({ path: `${SHOTS}/${id}-${what}-${t.viewport === 'mobile' ? 'mobile' : 'desktop'}.png` }); };
const startRace = async (t, o = {}) => {
  await t.waitIdle(8000);
  await t.game('newGame', { track: 'bathhouse-row', team: 'engine-six', classId: 'soak', laps: 1, seed: 5, ...o });
  await t.game('act', 'skipCountdown');
  await t.waitFrames(3);
};

export const tests = [
  // ---------------------------------------------------------------- S1-08
  {
    name: 'council A S1-08: Resume holds the race for a 3-2-1 with the camera live, then the tub is live again',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await startRace(t);
      await t.page.keyboard.press('Escape');
      await t.waitFrames(3);
      let s = await t.state();
      t.expect(s.paused && s.screen === 'pause', 'paused');
      await t.page.keyboard.down('ArrowUp'); // a key held through the resume
      await t.page.keyboard.press('Escape');
      await t.waitFrames(1);
      s = await t.state();
      const steps0 = s.steps;
      t.expect(!s.paused && s.resumeHold > 0, 'resumed into a hold, not into the race (hold ' + s.resumeHold + ')');
      await t.waitFrames(4);
      s = await t.state();
      if (s.resumeHold > 0) t.equal(s.steps, steps0, 'the simulation stands still during the hold');
      const call = await t.page.evaluate(() => document.querySelector('.hud-call').textContent);
      t.expect(/^RESUMING [123]$/.test(call), 'the HUD counts it down: ' + call);
      await shot(t, 'S1-08', 'resume-count');
      await t.page.waitForFunction(() => window.__game.getState().resumeHold === 0, null, { timeout: 5000 });
      await t.page.waitForFunction((n) => window.__game.getState().steps > n, steps0, { timeout: 5000 });
      await t.page.keyboard.up('ArrowUp');
      s = await t.state();
      t.expect(s.steps > steps0, 'and the race runs again once it ends');
    },
  },
  {
    name: 'council A S1-08: pausing again during the hold starts a fresh hold on the next Resume',
    viewports: ['desktop'],
    async run(t) {
      await startRace(t);
      await t.page.keyboard.press('Escape'); await t.waitFrames(2);
      await t.page.keyboard.press('Escape'); await t.waitFrames(2);
      let s = await t.state();
      t.expect(s.resumeHold > 0, 'in the hold');
      await t.page.keyboard.press('Escape'); await t.waitFrames(2);
      s = await t.state();
      t.expect(s.paused && s.screen === 'pause' && s.resumeHold === 0, 'Esc during the hold pauses again');
      await t.page.keyboard.press('Escape'); await t.waitFrames(1);
      s = await t.state();
      t.expect(!s.paused && s.resumeHold > 0.8, 'the next Resume gets the whole hold (' + s.resumeHold + ')');
    },
  },
];
