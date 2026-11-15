// Wave 3, batch E: sound and feel (S5-19 haptics, S5-28 audio regression tests, S5-29 gamepad unlock, S1-14 and S5-21
// incoming-hit warnings, S5-06 results and menu cues, S5-18 tub voices).
import fs from 'node:fs';
import { DEFAULT_SAVE } from '../src/js/save.js';

const SHOTS = '../_council/hsg-tub-rally/wave-3/shots';
const KEY = 'hsg-tub-rally-v1';
const shot = async (t, id, what) => { await t.shot(`w3e-${id}-${what}`); fs.mkdirSync(SHOTS, { recursive: true }); await t.page.screenshot({ path: `${SHOTS}/${id}-${what}-${t.viewport === 'mobile' ? 'mobile' : 'desktop'}.png` }); };
const setSave = (t, s) => t.page.evaluate(([k, v]) => localStorage.setItem(k, JSON.stringify(v)), [KEY, s]);
const readSave = (t) => t.page.evaluate((k) => JSON.parse(localStorage.getItem(k) || 'null'), KEY);
const profile = async (t, settings = {}) => { await t.waitIdle(8000); await setSave(t, { ...DEFAULT_SAVE(), settings: { ...DEFAULT_SAVE().settings, seenIntro: true, ...settings } }); await t.reload(); await t.waitIdle(8000); };
const render = (t, name, secs, wav, args, vol) => t.page.evaluate(([n, s, w, a, v]) => window.__game.audioRender(n, s, w, a, v), [name, secs, !!wav, args || [], vol]);
const unlock = async (t) => { await t.waitIdle(8000); await t.page.keyboard.press('Shift'); await t.page.waitForFunction(() => window.__game.getState().audio.ctx === 'running', null, { timeout: 5000 }); };
// every call to navigator.vibrate lands in window.__vib; a pad with a rumble motor lands its effects in window.__rumble
const stubHaptics = (t) => t.page.evaluate(() => {
  window.__vib = []; window.__rumble = [];
  Object.defineProperty(navigator, 'vibrate', { value: (p) => { window.__vib.push(p); return true; }, configurable: true });
  const pad = { connected: true, index: 0, buttons: Array.from({ length: 16 }, () => ({ pressed: false, value: 0 })), axes: [0, 0, 0, 0], vibrationActuator: { playEffect: (type, o) => { window.__rumble.push([type, o]); return Promise.resolve('complete'); } } };
  navigator.getGamepads = () => [pad];
});
const median = (a) => a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)];

export const tests = [
  // ---------------------------------------------------------------- S5-19
  {
    name: 'council E S5-19: the events a player should feel buzz the phone and rumble a pad, behind a Vibration switch that Reduced motion also respects',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await profile(t, { vibration: true, reducedMotion: false });
      await stubHaptics(t);
      await t.game('newGame', { seed: 12, paused: true });
      await t.game('act', 'skipCountdown');
      const felt = async (ev) => { await t.page.evaluate(() => { window.__vib.length = 0; window.__rumble.length = 0; }); await t.game('act', 'event', ev); return t.page.evaluate(() => ({ vib: window.__vib.slice(), rumble: window.__rumble.slice() })); };
      let r = await felt({ type: 'wall', v: 8 });
      t.equal(JSON.stringify(r.vib), '[15]', 'a wall is one 15 ms buzz');
      r = await felt({ type: 'boost', kind: 'hot' });
      t.equal(JSON.stringify(r.vib), '[[20,30,20]]', 'a boost is three short buzzes');
      t.expect(r.rumble.length === 1 && r.rumble[0][0] === 'dual-rumble' && r.rumble[0][1].duration >= 40 && r.rumble[0][1].strongMagnitude > 0, 'the pad rumbles on the same event: ' + JSON.stringify(r.rumble));
      r = await felt({ type: 'fumble', item: 'soap' });
      t.equal(JSON.stringify(r.vib), '[40]', 'a dropped item is 40 ms');
      r = await felt({ type: 'charge', stage: 1 });
      t.equal(JSON.stringify(r.vib), '[10]', 'the Warm tick is 10 ms');
      r = await felt({ type: 'charge', stage: 2 });
      t.equal(JSON.stringify(r.vib), '[10]', 'the Hot tick is 10 ms');
      r = await felt({ type: 'land', v: 9 });
      t.equal(JSON.stringify(r.vib), '[20]', 'a landing is 20 ms');
      r = await felt({ type: 'wall', v: 1.5 });
      t.equal(r.vib.length, 0, 'a graze of the wall is not felt');
      // the switch, from the Settings screen, saved and kept over a reload
      await t.game('scene', 'settings'); await t.waitFrames(3);
      t.expect(await t.page.locator('.chip[data-k="vibration"][data-v="true"][aria-pressed="true"]').count() === 1, 'Vibration shows On');
      await t.page.evaluate(() => document.querySelector('.chip[data-k="vibration"]').scrollIntoView({ block: 'center' }));
      await t.waitFrames(2);
      await shot(t, 'S5-19', 'settings');
      await t.checkLayout({ allowScrollY: true });
      await t.page.click('.chip[data-k="vibration"][data-v="false"]');
      await t.waitFrames(3);
      t.equal((await readSave(t)).settings.vibration, false, 'Off is saved');
      await t.reload(); await t.waitIdle(8000); await stubHaptics(t);
      await t.game('newGame', { seed: 12, paused: true }); await t.game('act', 'skipCountdown');
      r = await felt({ type: 'boost', kind: 'warm' });
      t.expect(r.vib.length === 0 && r.rumble.length === 0, 'with Vibration off nothing is felt, and it stays off after a reload');
      // Reduced motion silences it too, and the settings say so
      await setSave(t, { ...DEFAULT_SAVE(), settings: { ...DEFAULT_SAVE().settings, seenIntro: true, vibration: true, reducedMotion: true } });
      await t.reload(); await t.waitIdle(8000); await stubHaptics(t);
      await t.game('newGame', { seed: 12, paused: true }); await t.game('act', 'skipCountdown');
      r = await felt({ type: 'boost', kind: 'warm' });
      t.expect(r.vib.length === 0, 'Reduced motion keeps it off');
      await t.game('scene', 'settings'); await t.waitFrames(3);
      t.expect(/Motion is Reduced, so Vibration is off too/.test(await t.page.locator('.panel.settings').innerText()), 'the settings say why');
    },
  },
  {
    name: 'council E S5-19: a fresh profile starts with Vibration on for a touch device and off otherwise, and a damaged value falls back',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(8000);
      await t.page.evaluate((k) => localStorage.removeItem(k), KEY);
      await t.reload(); await t.waitIdle(8000);
      const coarse = await t.page.evaluate(() => matchMedia('(pointer: coarse)').matches);
      await t.game('scene', 'settings'); await t.waitFrames(3);
      const on = await t.page.locator('.chip[data-k="vibration"][data-v="true"][aria-pressed="true"]').count();
      t.equal(on === 1, coarse, 'on exactly when the main pointer is coarse (' + coarse + ')');
      await setSave(t, { ...DEFAULT_SAVE(), settings: { ...DEFAULT_SAVE().settings, vibration: 'yes' } });
      await t.reload(); await t.waitIdle(8000);
      await t.game('scene', 'settings'); await t.waitFrames(3);
      t.equal(await t.page.locator('.chip[data-k="vibration"][aria-pressed="true"]').count(), 1, 'a damaged value falls back to a valid choice');
    },
  },
  // ---------------------------------------------------------------- S5-29
  {
    name: 'council E S5-29: a gamepad button press starts the sound; an idle pad does not',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      await t.page.evaluate(() => {
        window.__pad = { connected: true, index: 0, buttons: Array.from({ length: 16 }, () => ({ pressed: false, value: 0 })), axes: [0, 0, 0, 0] };
        navigator.getGamepads = () => [window.__pad];
      });
      await t.waitFrames(8);
      t.equal((await t.state()).audio.started, false, 'a connected pad that nobody presses starts nothing');
      // RB, not the menu's A: A clicks the focused button, and that click would start the sound by itself
      await t.page.evaluate(() => { window.__pad.buttons[5] = { pressed: true, value: 1 }; });
      await t.page.waitForFunction(() => window.__game.getState().audio.started === true, null, { timeout: 5000 });
      t.expect((await t.state()).audio.ctx !== 'none', 'the sound is built by the pad press alone');
    },
  },
];
