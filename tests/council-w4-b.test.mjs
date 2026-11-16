// Wave 4, batch B: controls, rules and play (C4-16, S1-11, S1-09, S1-10, S6-11) and the small ones (S2-14, S2-30, S4-28, S3-24).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { pollGamepads, readIntent } from '../src/js/ui/input.js';

// a simulated standard pad (nobody here has a controller): `down` lists the pressed button indexes
const withPad = (down = []) => {
  const buttons = Array.from({ length: 17 }, (_, i) => ({ pressed: down.includes(i), value: down.includes(i) ? 1 : 0 }));
  Object.defineProperty(globalThis, 'navigator', { value: { getGamepads: () => [{ index: 0, connected: true, mapping: 'standard', axes: [0, 0, 0, 0], buttons }] }, configurable: true });
  pollGamepads();
  return readIntent();
};
const SHOTS = '../_council/hsg-tub-rally/wave-4/shots';
const shot = async (t, id, what) => { fs.mkdirSync(SHOTS, { recursive: true }); await t.page.screenshot({ path: `${SHOTS}/${id}-${what}-${t.viewport === 'mobile' ? 'mobile' : 'desktop'}.png` }); };
const LB = 4, LT = 6, RT = 7, X = 2, B = 1;

export const tests = [
  // ---------------------------------------------------------------- C4-16
  {
    name: 'council W4B C4-16: the left trigger brakes; LB and X still use an item and RT still pushes',
    node: true,
    run() {
      withPad();
      let i = withPad([LT]);
      assert.equal(i.brake, true, 'LT brakes');
      assert.equal(i.item, false, 'and no longer uses an item');
      i = withPad([]);
      assert.equal(i.brake, false, 'letting go stops braking');
      assert.equal(withPad([B]).brake, true, 'B still brakes');
      withPad([]);
      assert.equal(withPad([LB]).item, true, 'LB still uses an item');
      withPad([]);
      assert.equal(withPad([X]).item, true, 'X still uses an item');
      withPad([]);
      i = withPad([RT]);
      assert.equal(i.push, 1, 'RT still pushes'); assert.equal(i.brake, false);
      withPad([]);
      i = withPad([LT, LB]);
      assert.equal(i.item, true, 'LB while LT is held uses the item (the throw-back combination)');
      assert.equal(i.brake, true);
    },
  },
  {
    name: 'council W4B C4-16: How to Play says LT brakes, and a held LT slows the tub in a race',
    viewports: ['desktop'],
    initScript: () => {
      const buttons = Array.from({ length: 17 }, () => ({ pressed: false, value: 0 }));
      window.__padButtons = buttons;
      const pad = { index: 0, connected: true, mapping: 'standard', axes: [0, 0, 0, 0], buttons };
      navigator.getGamepads = () => [pad];
    },
    async run(t) {
      await t.waitIdle(8000);
      await t.page.evaluate(() => { window.__padButtons[5] = { pressed: true, value: 1 }; });
      await t.waitFrames(5);
      await t.game('scene', 'help');
      await t.waitFrames(2);
      const text = await t.page.evaluate(() => document.querySelector('.panel.help')?.innerText || '');
      t.expect(/B or LT brake/.test(text), 'the gamepad line names LT as a brake');
      await shot(t, 'C4-16', 'gamepad-help');
      t.expect(/LB or X use item \(hold B or LT to throw it backwards\)/.test(text), 'and LT is gone from the item line');
      await t.page.evaluate(() => { window.__padButtons[5] = { pressed: false, value: 0 }; });
      await t.game('newGame', { seed: 9 });
      await t.game('act', 'skipCountdown');
      await t.game('pause');
      const press = (i, on) => t.page.evaluate(([n, v]) => { window.__padButtons[n] = { pressed: v, value: v ? 1 : 0 }; }, [i, on]);
      const speed = async () => { const s = await t.state(); return s.race.karts[s.race.player].vf; };
      // paused, the pad is still read each frame and the fixed steps are driven by hand, so the numbers are exact
      await press(RT, true); await t.waitFrames(3);
      await t.game('step', 240);
      await press(RT, false); await t.waitFrames(3);
      const top = await speed();
      t.expect(top > 8, 'the tub is up to speed (' + top.toFixed(1) + ' m/s)');
      await t.game('step', 60);
      const coast = await speed();
      await press(LT, true); await t.waitFrames(3);
      await t.game('step', 60);
      const braked = await speed();
      t.expect(coast - braked > 8, 'a held LT slows the tub much more than coasting does (coast ' + coast.toFixed(1) + ', braked ' + braked.toFixed(1) + ')');
    },
  },
];
