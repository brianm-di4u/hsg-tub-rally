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

// ---------------------------------------------------------------- S2-11, S2-12
const helpText = (t) => t.page.evaluate(() => ({ h: document.querySelector('.panel.help h3')?.textContent, text: document.querySelector('.panel.help')?.innerText || '', more: document.querySelector('[data-act="helpAll"]')?.getAttribute('aria-expanded') }));
tests.push(
  {
    name: 'council A S2-11: How to Play leads with the controls of the device in use and folds the others away',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(8000);
      await t.game('scene', 'help');
      await t.waitFrames(2);
      let h = await helpText(t);
      const mine = t.viewport === 'mobile' ? 'Touch' : 'Keyboard';
      t.equal(h.h, 'Drive: ' + mine, 'the first section is for this device');
      t.equal(h.more, 'false', 'the other controls start folded');
      if (t.viewport === 'mobile') {
        t.expect(/Hold Brake while you tap it to throw it backwards/.test(h.text), 'touch players are told how to throw backwards');
        t.expect(/Hold Push/.test(h.text) && /Pause is at the top right/.test(h.text), 'and that Push is a hold and where Pause is');
        t.expect(!/Esc pause/.test(h.text), 'the keyboard line is folded away');
      } else t.expect(/hold ↓ to aim back/.test(h.text) && !/Hold Push/.test(h.text), 'keyboard lines shown, touch lines folded');
      await shot(t, 'S2-11', 'help-folded');
      await t.page.locator('[data-act="helpAll"]').click();
      await t.waitFrames(2);
      h = await helpText(t);
      t.equal(h.more, 'true', 'the other controls open on request');
      t.expect(/Hold Push/.test(h.text) && /Esc pause/.test(h.text) && /Start pause/.test(h.text), 'all three devices are described once opened');
      await shot(t, 'S2-11', 'help-open');
      await t.checkLayout({ allowScrollY: true });
    },
  },
  {
    name: 'council A S2-11: a gamepad in use puts the gamepad controls first',
    viewports: ['desktop'],
    initScript: () => {
      const pad = { index: 0, connected: true, mapping: 'standard', axes: [0, 0, 0, 0], buttons: Array.from({ length: 17 }, (_, i) => ({ pressed: i === 5, value: i === 5 ? 1 : 0 })) };
      navigator.getGamepads = () => [pad];
    },
    async run(t) {
      await t.waitIdle(8000);
      await t.waitFrames(5);
      await t.game('scene', 'help');
      await t.waitFrames(2);
      const h = await helpText(t);
      t.equal(h.h, 'Drive: Gamepad', 'gamepad first');
      t.expect(/hold B to throw it backwards/.test(h.text), 'and it says how to throw backwards');
    },
  },
  {
    name: 'council A S2-12: the pause menu opens How to Play and Back returns to the pause menu with the race still paused',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await startRace(t);
      await t.page.keyboard.press('Escape');
      await t.waitFrames(3);
      t.expect(await t.page.locator('.panel.pause [data-act="help"]').count() === 1, 'the pause menu has a How to play button');
      await shot(t, 'S2-12', 'pause-menu');
      const steps0 = (await t.state()).steps;
      await t.page.locator('.panel.pause [data-act="help"]').click();
      await t.waitFrames(3);
      let s = await t.state();
      t.expect(s.screen === 'help' && s.paused, 'the help panel opens over the paused race');
      await t.page.locator('.panel.help [data-act="back"]').click();
      await t.waitFrames(3);
      s = await t.state();
      t.expect(s.screen === 'pause' && s.paused && s.steps === steps0, 'Back returns to the pause menu, race still frozen');
    },
  },
);
