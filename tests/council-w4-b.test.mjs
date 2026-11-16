// Wave 4, batch B: controls, rules and play (C4-16, S1-11, S1-09, S1-10, S6-11) and the small ones (S2-14, S2-30, S4-28, S3-24).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as input from '../src/js/ui/input.js';
const { pollGamepads, readIntent } = input;

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

// ---------------------------------------------------------------- S1-11
// a stand-in page for the input module: it records the handlers it registers
const fakeEvents = () => {
  const on = {};
  const el = (extra = {}) => ({ addEventListener: (n, f) => { (on[n] = on[n] || []).push(f); }, classList: { add() {}, remove() {} }, setPointerCapture() {}, style: { setProperty() {} }, clientWidth: 400, ...extra });
  return { on, el };
};
tests.push(
  {
    name: 'council W4B S1-11: a Hop pressed and released between two ticks still hops once (key, touch button, pad)',
    node: true,
    async run() {
      const { on, el } = fakeEvents();
      const had = { window: 'window' in globalThis, document: 'document' in globalThis };
      assert.ok(!had.window && !had.document, 'a node test has no page');
      try {
      Object.defineProperty(globalThis, 'window', { value: { addEventListener: (n, f) => { (on[n] = on[n] || []).push(f); } }, configurable: true });
      Object.defineProperty(globalThis, 'document', { value: { body: { dataset: {} } }, configurable: true });
      input.initInput(null);
      const fire = (name, e) => (on[name] || []).forEach((f) => f({ preventDefault() {}, repeat: false, ...e }));
      input.readIntent();
      fire('keydown', { code: 'ShiftLeft' }); fire('keyup', { code: 'ShiftLeft' });
      assert.equal(input.readIntent().hop, true, 'a key pressed and released inside one tick still counts');
      assert.equal(input.readIntent().hop, false, 'and counts once');
      fire('keydown', { code: 'ShiftLeft' });
      assert.equal(input.readIntent().hop, true); assert.equal(input.readIntent().hop, true, 'a held key is still held');
      fire('keyup', { code: 'ShiftLeft' });
      assert.equal(input.readIntent().hop, false);
      // a Shift pressed while a menu is open is not a hop for the race that follows
      document.body.dataset.screen = 'title';
      fire('keydown', { code: 'ShiftLeft' }); fire('keyup', { code: 'ShiftLeft' });
      delete document.body.dataset.screen;
      assert.equal(input.readIntent().hop, false, 'a menu key press is forgotten');
      // the touch button
      const hop = el();
      const ev = {};
      hop.addEventListener = (n, f) => { ev[n] = f; };
      input.initTouch(el(), { push: null, brake: null, hop, item: null });
      ev.pointerdown({ preventDefault() {}, pointerId: 1 }); ev.pointerup({ pointerId: 1 });
      assert.equal(input.readIntent().hop, true, 'a tap on the Hop button inside one tick counts');
      assert.equal(input.readIntent().hop, false);
      // the pad: pressed on one poll, let go on the next, before the tick reads it
      const buttons = (down) => Array.from({ length: 17 }, (_, i) => ({ pressed: down.includes(i), value: down.includes(i) ? 1 : 0 }));
      const pads = { now: buttons([5]) };
      Object.defineProperty(globalThis, 'navigator', { value: { getGamepads: () => [{ index: 3, connected: true, axes: [0, 0, 0, 0], buttons: pads.now }] }, configurable: true });
      input.pollGamepads(); pads.now = buttons([]); input.pollGamepads();
      assert.equal(input.readIntent().hop, true, 'RB pressed and let go between ticks still counts');
      } finally { delete globalThis.window; delete globalThis.document; }
    },
  },
  {
    name: 'council W4B S1-11: in the game, a real Shift tap between two ticks makes the tub hop',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      await t.game('newGame', { seed: 9 });
      await t.game('act', 'skipCountdown');
      await t.game('pause');
      const air = async () => { const s = await t.state(); return s.race.karts[s.race.player].air; };
      t.equal(await air(), false, 'on the ground to start');
      await t.page.keyboard.down('ShiftLeft'); await t.page.keyboard.up('ShiftLeft');
      await t.waitFrames(2);
      await t.game('step', 3);
      t.equal(await air(), true, 'the tap was kept until the next tick and hopped');
    },
  },
);
