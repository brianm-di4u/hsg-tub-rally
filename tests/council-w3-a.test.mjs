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

// ---------------------------------------------------------------- S2-25
import { FACTS, factAt } from '../src/js/data/facts.js';
const allFacts = new Set(Object.values(FACTS).flat().map((f) => f.t));
tests.push(
  {
    name: 'council A S2-25: the fact rotation reaches every course fact and every event fact before it repeats',
    node: true,
    async run(t) {
      for (const id of Object.keys(FACTS)) {
        const len = (id === 'event' ? 0 : FACTS[id].length) + FACTS.event.length;
        const seen = Array.from({ length: len }, (_, n) => factAt(id, n).t);
        t.equal(new Set(seen).size, len, id + ': ' + len + ' different facts before a repeat');
        t.expect(FACTS.event.every((e) => seen.includes(e.t)), id + ': the event facts are in the rotation');
        t.equal(factAt(id, len).t, seen[0], id + ': then it starts again');
      }
      t.expect(factAt('no-such-course', 0).t === FACTS.event[0].t, 'an unknown course gets the event facts');
    },
  },
  {
    name: 'council A S2-25: a local fact shows under the countdown, a different one in the pause menu, another on the results',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(8000);
      await t.game('setState', { settings: { seenIntro: true } });
      await t.game('newGame', { track: 'bathhouse-row', team: 'engine-six', classId: 'soak', laps: 1, seed: 5, paused: true });
      await t.waitFrames(4);
      const fact = () => t.page.evaluate(() => { const e = document.querySelector('.hud-fact'); return { on: e.classList.contains('show'), text: e.textContent, shown: getComputedStyle(e).display !== 'none' }; });
      const f0 = await fact();
      t.expect(f0.on && f0.shown && allFacts.has(f0.text), 'the countdown shows one of the repo\'s sourced facts: ' + f0.text);
      await shot(t, 'S2-25', 'countdown-fact');
      await t.game('act', 'skipCountdown');
      await t.game('resume');
      await t.waitFrames(130);
      t.expect(!(await fact()).on, 'and it is gone once the race is running');
      await t.page.keyboard.press('Escape');
      await t.waitFrames(3);
      const p = await t.page.evaluate(() => document.querySelector('.panel.pause .fact-line')?.textContent || '');
      t.expect(allFacts.has(p) && p !== f0.text, 'the pause menu shows a different sourced fact: ' + p);
      await shot(t, 'S2-25', 'pause-fact');
      await t.page.keyboard.press('Escape');
      await t.page.waitForFunction(() => window.__game.getState().resumeHold === 0, null, { timeout: 5000 });
      await t.game('newGame', { track: 'bathhouse-row', team: 'engine-six', classId: 'soak', laps: 1, seed: 5, autoplay: true, paused: true });
      await t.stepUntil((s) => s.race && s.race.phase === 'done', { max: 60 * 300, chunk: 300, label: 'race done' });
      await t.page.waitForSelector('.panel.results', { timeout: 5000 });
      const r = await t.page.evaluate(() => document.querySelector('.panel.results .fact-line')?.textContent || '');
      t.expect(allFacts.has(r), 'the results screen shows a sourced fact: ' + r);
      await shot(t, 'S2-25', 'results-fact');
      await t.checkLayout({ allowScrollY: true });
    },
  },
);

// ---------------------------------------------------------------- S2-29
tests.push(
  {
    name: 'council A S2-29: Esc goes back from the results to the title, as Backspace does',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      await t.game('newGame', { track: 'bathhouse-row', team: 'engine-six', classId: 'soak', laps: 1, seed: 5, autoplay: true, paused: true });
      await t.stepUntil((s) => s.race && s.race.phase === 'done', { max: 60 * 300, chunk: 300, label: 'race done' });
      await t.page.waitForSelector('.panel.results', { timeout: 5000 });
      await t.page.keyboard.press('Escape');
      await t.page.waitForFunction(() => window.__game.getState().screen === 'title', null, { timeout: 5000 });
      t.equal((await t.state()).scene, 'title', 'Esc on the results screen leaves for the title');
    },
  },
  {
    name: 'council A S2-29: Esc in Settings opened from the pause menu goes back to the pause menu, not into the race',
    viewports: ['desktop'],
    async run(t) {
      await startRace(t);
      await t.page.keyboard.press('Escape');
      await t.waitFrames(3);
      await t.page.locator('.panel.pause [data-act="settings"]').click();
      await t.waitFrames(3);
      t.equal((await t.state()).screen, 'settings', 'in Settings');
      await t.page.keyboard.press('Escape');
      await t.waitFrames(4);
      const s = await t.state();
      t.expect(s.screen === 'pause' && s.paused, 'Esc went back to the pause menu, race still paused (' + s.screen + ')');
      await t.page.keyboard.press('Escape');
      await t.waitFrames(3);
      t.expect(!(await t.state()).paused, 'and Esc on the pause menu still resumes');
    },
  },
);

// ---------------------------------------------------------------- S3-06
import { createSaveWriter, DEFAULT_SAVE } from '../src/js/save.js';
tests.push(
  {
    name: 'council A S3-06: the first cup won on Soak announces Scald once, and only once',
    node: true,
    async run(t) {
      const box = { raw: JSON.stringify(DEFAULT_SAVE()) };
      const writer = createSaveWriter({ read: () => box.raw, write: (r) => { box.raw = r; } });
      const save = writer.load();
      const teamOrder = ['gator-gang', 'silks-stirrups', 'flamingo-flock', 'tub-ninjas'];
      const third = writer.commit(save, { cup: { token: {}, key: 'bathhouse:soak', place: 3, soak: true, scald: false, teamOrder } });
      t.expect(!third.unlockedClass && !JSON.parse(box.raw).unlocked.classes.includes('scald'), 'third place opens nothing and announces nothing');
      const won = writer.commit(save, { cup: { token: {}, key: 'bathhouse:soak', place: 1, soak: true, scald: false, teamOrder } });
      t.equal(won.unlockedClass, 'scald', 'winning the cup on Soak announces Scald');
      t.expect(JSON.parse(box.raw).unlocked.classes.includes('scald'), 'and Scald is saved as open');
      const again = writer.commit(save, { cup: { token: {}, key: 'ouachita:soak', place: 1, soak: true, scald: false, teamOrder } });
      t.expect(!again.unlockedClass, 'a second win on Soak does not announce Scald again');
    },
  },
  {
    name: 'council A S3-06: the trophy screen prints the Scald unlock under the team line',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(8000);
      await t.page.evaluate(() => { const a = window.TR_APP.App; a.screens.show('trophy', { place: 1, cupName: 'Bathhouse Cup', unlockedTeam: 'gator-gang', unlockedClass: 'scald', unlockedCup: null, unlockedMirror: false }); });
      await t.waitFrames(3);
      const lines = await t.page.evaluate(() => [...document.querySelectorAll('.panel.trophy .unlock')].map((p) => p.textContent));
      t.equal(lines.join(' | '), 'New team unlocked: Gator Gang | New speed class unlocked: Scald', 'team line, then the Scald line');
      await shot(t, 'S3-06', 'trophy-scald');
    },
  },
);

// ---------------------------------------------------------------- P-N02
// A laptop whose main pointer is a mouse reports no coarse pointer: the desktop viewport is one. The first touch on it brings the controls up.
const touchUi = (t) => t.page.evaluate(() => ({ on: document.body.classList.contains('touch-on'), touch: getComputedStyle(document.querySelector('#touch')).display, pause: getComputedStyle(document.querySelector('#t-pause')).display, last: window.TR_APP.App && document.body.className }));
const fakeTouch = (t, type = 'touch') => t.page.evaluate((pt) => { document.querySelector('#gl').dispatchEvent(new PointerEvent('pointerdown', { pointerType: pt, bubbles: true, pointerId: 41, clientX: 200, clientY: 300 })); document.querySelector('#gl').dispatchEvent(new PointerEvent('pointerup', { pointerType: pt, bubbles: true, pointerId: 41 })); }, type);
tests.push(
  {
    name: 'council A P-N02: a mouse-and-keyboard laptop shows no touch controls until the first touch, and a key puts them away',
    viewports: ['desktop'],
    async run(t) {
      await startRace(t);
      let u = await touchUi(t);
      t.expect(!u.on && u.touch === 'none' && u.pause === 'none', 'no touch controls for mouse and keyboard: ' + JSON.stringify(u));
      await fakeTouch(t, 'mouse');
      t.expect(!(await touchUi(t)).on, 'a mouse click does not bring them up');
      await fakeTouch(t, 'touch');
      await t.waitFrames(2);
      u = await touchUi(t);
      t.expect(u.on && u.touch === 'block' && u.pause === 'block', 'the first touch shows the steer pad and Pause: ' + JSON.stringify(u));
      const box = await t.page.locator('#t-push').boundingBox();
      t.expect(box && box.width >= 44 && box.height >= 44, 'the Push button is at least 44 px');
      await shot(t, 'P-N02', 'touch-on-laptop');
      await t.page.keyboard.press('ArrowUp');
      await t.waitFrames(2);
      u = await touchUi(t);
      t.expect(!u.on && u.touch === 'none', 'a key press puts them away again');
      await fakeTouch(t, 'pen');
      t.expect((await touchUi(t)).on, 'a pen brings them back');
    },
  },
  {
    name: 'council A P-N02: a phone shows its touch controls from the start and keeps them under key presses',
    viewports: ['mobile'],
    async run(t) {
      await startRace(t);
      let u = await touchUi(t);
      t.expect(u.on && u.touch === 'block' && u.pause === 'block', 'controls up on a coarse-pointer device: ' + JSON.stringify(u));
      await t.page.keyboard.press('ArrowUp');
      await t.waitFrames(2);
      u = await touchUi(t);
      t.expect(u.on && u.touch === 'block', 'a keyboard on a tablet does not hide them');
      await t.checkLayout();
    },
  },
);
