// Wave 2, batch E: S2-01 (first-run teaching), S2-06 (settings: keys, HUD size, steer assist, volume), S1-03 (touch auto-push).
// Save and wording tests run in Node against the real code; the race, the Settings and Controls screens run in the browser.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Track } from '../src/js/sim/track.js';
import { makeRace, stepRace, DT } from '../src/js/sim/race.js';
import { assistSteer, ASSIST } from '../src/js/sim/ai.js';
import { TRACKS } from '../src/js/data/tracks.js';
import { createSaveWriter, DEFAULT_SAVE } from '../src/js/save.js';
import { DEFAULT_KEYS } from '../src/js/ui/input.js';
import '../assets/teach.js';

const TEACH = globalThis.TR_TEACH;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = '../_council/hsg-tub-rally/wave-2/shots';
const KEY = 'hsg-tub-rally-v1';
const shot = async (t, name) => { await t.shot(name); fs.mkdirSync(SHOTS, { recursive: true }); await t.page.screenshot({ path: `${SHOTS}/${name}-${t.viewport}.png` }); };
const COURSES = TRACKS.filter((x) => !x.arena && fs.existsSync(path.join(ROOT, 'data', 'tracks', x.id + '.json'))).map((x) => x.id);

const mk = (initial) => {
  const box = { raw: initial === undefined ? null : JSON.stringify(initial) };
  const writer = createSaveWriter({ read: () => box.raw, write: (r) => { box.raw = r; } });
  const save = writer.load();
  return { box, writer, save, stored: () => JSON.parse(box.raw), commit: (i) => writer.commit(save, i), reopen: () => createSaveWriter({ read: () => box.raw, write: (r) => { box.raw = r; } }).load() };
};
// a save written before the first-run tips, the touch default and the new settings existed
const OLD = (over = {}) => ({ v: 1, settings: { sound: true, music: true, ambience: true, volume: 0.6, res: 'native', quality: 'auto', autoPush: false, steerAssist: false, reducedMotion: null, hudScale: 1, keys: null, brick: true, ...over },
  unlocked: { teams: [], cups: ['bathhouse'], classes: ['splash', 'soak'], mirror: false }, best: {}, ghosts: {}, cups: {}, stats: { races: 2, wins: 0, gallonsSpilled: 0 }, lastTeam: 'engine-six', lastClass: 'soak' });
const withTouch = (on, fn) => { const had = 'window' in globalThis; const was = globalThis.window; globalThis.window = { matchMedia: () => ({ matches: on }) }; try { return fn(); } finally { if (had) globalThis.window = was; else delete globalThis.window; } };
const words = (s) => s.trim().split(/\s+/).length;

const setSave = (t, s) => t.page.evaluate(([k, v]) => localStorage.setItem(k, JSON.stringify(v)), [KEY, s]);
const clearSave = (t) => t.page.evaluate((k) => localStorage.removeItem(k), KEY);
const readSave = (t) => t.page.evaluate((k) => { const r = localStorage.getItem(k); return r && JSON.parse(r); }, KEY);
const fresh = async (t, s) => {
  await t.waitIdle(8000);
  if (s) await setSave(t, s); else await clearSave(t);
  await t.reload(); await t.waitIdle(8000);
};
const startHuman = async (t, extra = {}) => { await t.game('newGame', { mode: 'quick', track: 'bathhouse-row', count: 8, paused: true, ...extra }); await t.waitFrames(2); return t.state(); };
const me = async (t) => { const st = await t.state(); return st.race.karts[st.race.player]; };
const tipOf = (t) => t.page.evaluate(() => { const e = document.querySelector('.hud-tip'); return e && !e.hidden ? { text: e.firstChild.textContent, skip: e.lastChild.textContent, r: e.getBoundingClientRect().toJSON() } : null; });
// the tip against every HUD block and control: no overlap
const overlaps = (t) => t.page.evaluate(() => {
  const tip = document.querySelector('.hud-tip');
  if (!tip || tip.hidden) return ['no tip'];
  const a = tip.getBoundingClientRect(), out = [];
  for (const sel of ['.hud-tl', '.hud-tr:not(.empty)', '.hud-item', '.hud-bl', '.hud-map', '.hud-count', '.hud-call.show', '.t-btns', '.t-pause']) {
    const e = document.querySelector(sel);
    if (!e || getComputedStyle(e).display === 'none') continue;
    const r = e.getBoundingClientRect();
    if (r.width && r.height && a.left < r.right && a.right > r.left && a.top < r.bottom && a.bottom > r.top) out.push(sel);
  }
  return out;
});

export const tests = [
  // ---------------------------------------------------------------- saves
  {
    name: 'council E: a new player has tips and (on a touch device) auto-push; a save from before keeps its own settings',
    node: true,
    async run(t) {
      const d = withTouch(false, () => DEFAULT_SAVE().settings);
      t.expect(d.seenIntro === false && d.autoPush === false && d.hudScale === 1 && d.steerAssist === false && d.keys === null, 'desktop defaults: tips not seen, auto-push off');
      t.expect(withTouch(true, () => DEFAULT_SAVE().settings.autoPush) === true, 'a touch device starts with auto-push on');
      // no save at all
      let a = withTouch(true, () => mk());
      t.expect(a.save.settings.autoPush === true && a.save.settings.seenIntro === false, 'a new touch player: auto-push on, tips to show');
      a = withTouch(false, () => mk());
      t.expect(a.save.settings.autoPush === false && a.save.settings.seenIntro === false, 'a new desktop player: tips to show, auto-push off');
      // a save from before: never changed, and counted as seen
      const o = withTouch(true, () => mk(OLD()));
      t.expect(o.save.settings.autoPush === false && o.save.settings.seenIntro === true, 'an older save on a touch device keeps auto-push off and gets no first-run tips');
      const o2 = withTouch(true, () => mk(OLD({ autoPush: true, hudScale: 1.2, steerAssist: true })));
      t.expect(o2.save.settings.autoPush === true && o2.save.settings.hudScale === 1.2 && o2.save.settings.steerAssist === true, 'its other settings stay as they were');
      // a save that says it has not seen the tips yet still has not
      const o3 = mk(OLD({ seenIntro: false }));
      t.expect(o3.save.settings.seenIntro === false, 'an explicit false is kept');
      // round trip
      const r = mk();
      r.commit({ settings: { seenIntro: true, hudScale: 1.15, steerAssist: true, keys: { hop: ['KeyZ'], push: ['KeyW'] }, volume: 1 } });
      const back = r.reopen();
      t.expect(back.settings.seenIntro === true && back.settings.hudScale === 1.15 && back.settings.steerAssist === true && back.settings.volume === 1, 'seen, HUD size, assist and volume survive a reload');
      t.expect(JSON.stringify(back.settings.keys) === JSON.stringify({ push: ['KeyW'], hop: ['KeyZ'] }), 'remapped keys survive a reload: ' + JSON.stringify(back.settings.keys));
      // damaged values fall back, never an error
      const bad = mk(OLD({ hudScale: 'big', steerAssist: 'yes', keys: { hop: 'KeyZ', push: [3], left: ['KeyQ'], jump: ['KeyJ'] }, seenIntro: 'no' }));
      t.expect(bad.save.settings.hudScale === 1 && bad.save.settings.steerAssist === false && bad.save.settings.seenIntro === false, 'bad HUD size, assist and seen values fall back');
      t.expect(JSON.stringify(bad.save.settings.keys) === JSON.stringify({ left: ['KeyQ'] }), 'bad key entries are dropped, good ones kept: ' + JSON.stringify(bad.save.settings.keys));
      const huge = mk(OLD({ hudScale: 9 }));
      t.expect(huge.save.settings.hudScale === 1, 'a HUD size outside its range falls back');
    },
  },
  // ---------------------------------------------------------------- words
  {
    name: 'council E S2-01: every tip is twelve words or fewer and names the input in use; rebound keys are rebound in the words',
    node: true,
    async run(t) {
      const kb = JSON.parse(JSON.stringify(DEFAULT_KEYS));
      for (const id of ['goal', 'auto', 'slide', 'item', 'water']) {
        for (const [dev, auto] of [['keyboard', false], ['gamepad', false], ['touch', false], ['touch', true]]) {
          const s = TEACH.say(id, dev, auto, kb);
          t.expect(words(s) <= 12 && /^[A-Z]/.test(s) && /[.]$/.test(s) && !/undefined|  /.test(s), `${id} / ${dev}${auto ? ' + auto' : ''}: ${words(s)} words: ${s}`);
        }
      }
      t.expect(TEACH.say('goal', 'keyboard', false, kb) === 'Goal: finish first. Hold ↑ to push, ← → to steer.', 'keyboard goal names the arrow keys');
      t.expect(TEACH.say('slide', 'keyboard', false, kb) === 'Hold Shift and steer to slide; let go for a boost.', 'keyboard slide names Shift');
      t.expect(/Hop/.test(TEACH.say('slide', 'touch', true, kb)) && /Item/.test(TEACH.say('item', 'touch', true, kb)) && /Push/.test(TEACH.say('goal', 'touch', false, kb)), 'touch tips name the on-screen buttons');
      t.expect(!/Push/.test(TEACH.say('goal', 'touch', true, kb)) && /Auto-push is on/.test(TEACH.say('auto', 'touch', true, kb)), 'with auto-push on, the touch goal does not ask for Push');
      t.expect(/Hold A to push/.test(TEACH.say('goal', 'gamepad', false, kb)) && /RB/.test(TEACH.say('slide', 'gamepad', false, kb)), 'gamepad tips name face buttons');
      const mine = { ...kb, hop: ['KeyZ'], item: ['KeyQ'], push: ['KeyI'] };
      t.expect(/Hold Z and steer/.test(TEACH.say('slide', 'keyboard', false, mine)) && /Press Q to use/.test(TEACH.say('item', 'keyboard', false, mine)) && /Hold I to push/.test(TEACH.say('goal', 'keyboard', false, mine)), 'the words follow the keys the player chose');
    },
  },
  {
    name: 'council E S2-06: rebinding a key swaps with the key in use and keeps Pause and the menu keys safe',
    node: true,
    async run(t) {
      let binds = JSON.parse(JSON.stringify(DEFAULT_KEYS)), saved = null, shown = null;
      TEACH.api = { get: () => binds, set: (b) => { binds = b; }, save: (b) => { saved = b; } };
      const press = (code, action) => TEACH.capture({ code, repeat: false }, action, (d) => { shown = d; });
      t.expect(press('KeyZ', 'hop') === true && JSON.stringify(binds.hop) === '["KeyZ"]' && JSON.stringify(saved.hop) === '["KeyZ"]', 'a free key becomes the control');
      t.expect(/Hop and slide is now Z/.test(shown.msg), 'it says what changed: ' + shown.msg);
      // a key already used by another control: the two swap, nothing is left without a key
      const pushWas = binds.push.slice();
      press('KeyX', 'push');
      t.expect(JSON.stringify(binds.push) === '["KeyX"]' && JSON.stringify(binds.item) === JSON.stringify(pushWas), 'X moved to Push; Item took Push\'s old keys');
      const all = Object.values(binds).flat();
      t.expect(new Set(all).size === all.length, 'no key does two things');
      for (const a of Object.keys(binds)) t.expect(binds[a].length > 0, a + ' still has a key');
      // reserved keys and the pause key are refused, and the screen keeps waiting
      const before = JSON.stringify(binds);
      for (const code of ['Enter', 'Tab', 'Backspace', 'KeyP']) { press(code, 'brake'); t.expect(shown.capture === 'brake' && /kept for menus and Pause/.test(shown.msg), code + ' is refused'); }
      t.expect(JSON.stringify(binds) === before, 'refused keys change nothing');
      press('Escape', 'brake'); t.expect(!shown.capture && JSON.stringify(binds) === before, 'Esc cancels');
      t.expect(TEACH.capture({ code: 'KeyM', repeat: true }, 'brake', () => {}) === true && JSON.stringify(binds) === before, 'a held key does not rebind');
      t.expect(TEACH.keyName('ArrowLeft') === '←' && TEACH.keyName('KeyZ') === 'Z' && TEACH.keyName('Digit4') === '4' && TEACH.keyName('Space') === 'Space', 'key names read plainly');
    },
  },
  // ---------------------------------------------------------------- steering assist
  {
    name: 'council E S2-06: steer assist keeps a hands-off tub on the road, and never fights real steering',
    node: true,
    async run(t) {
      const run = (id, on, nudge = 0) => {
        const track = new Track(JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'tracks', id + '.json'), 'utf8')));
        const r = makeRace(track, { laps: 3, classId: 'soak', player: 'engine-six', seed: 7, mode: 'quick', noItems: true, count: 1 });
        const k = r.karts[r.player];
        for (let i = 0; i < 60 * 23.3; i++) stepRace(r, track, [assistSteer(track, k, { steer: nudge, push: 1, brake: false, hop: false, item: false, back: false }, on)], DT);
        return { walls: k.stats_.walls, m: k.s + (k.lap - 1) * track.length };
      };
      let off = 0, on = 0, wOff = 0, wOn = 0;
      for (const id of COURSES) { const a = run(id, false), b = run(id, true); off += a.m; on += b.m; wOff += a.walls; wOn += b.walls; t.expect(b.m > a.m, `${id}: ${a.m.toFixed(0)} m without, ${b.m.toFixed(0)} m with assist`); }
      t.log(`20 s holding Push, hands off, ${COURSES.length} courses: ${off.toFixed(0)} m without assist, ${on.toFixed(0)} m with; wall hits ${wOff} without, ${wOn} with`);
      t.expect(on > off * 1.5 && wOn <= wOff, 'with assist the tub covers far more road and hits no more walls');
      // real steering is left alone
      const track = new Track(JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'tracks', 'bathhouse-row.json'), 'utf8')));
      const r = makeRace(track, { laps: 3, classId: 'soak', player: 'engine-six', seed: 7, mode: 'quick', noItems: true, count: 1 });
      const k = r.karts[r.player];
      for (let i = 0; i < 300; i++) stepRace(r, track, [{ steer: 0, push: 1, brake: false, hop: false, item: false, back: false }], DT);
      const hard = { steer: -0.8 }, light = { steer: 0.2 };
      t.expect(assistSteer(track, k, hard, true).steer === -0.8, 'a firm steer is passed through unchanged');
      t.expect(Math.abs(assistSteer(track, k, light, true).steer - 0.2) <= ASSIST.max + 1e-9, 'a light steer is nudged by at most ' + ASSIST.max);
      t.expect(assistSteer(track, k, { steer: 0 }, false).steer === 0, 'off is off');
    },
  },
  // ---------------------------------------------------------------- tips in play
  {
    name: 'council E S2-01: a new player is taught in play, one line at a time, and the tips stop when skipped or after the first race',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await fresh(t);
      const touch = t.viewport === 'mobile';
      let st = await t.state();
      t.expect(st.settings.seenIntro === false, 'a new profile has not seen the tips');
      t.expect(st.settings.autoPush === touch, `auto-push on a ${t.viewport} first run: ${st.settings.autoPush}`);
      st = await startHuman(t);
      t.expect(st.race.phase === 'countdown', 'the race opens on the countdown');
      await t.game('step', 20);
      let tip = await tipOf(t);
      t.expect(!!tip, 'a tip shows during the countdown');
      t.expect(touch ? /^Goal: finish first\. Drag the left side to steer\.$/.test(tip.text) : /^Goal: finish first\. Hold ↑ to push, ← → to steer\.$/.test(tip.text), 'the goal comes first, in words for this input: ' + (tip && tip.text));
      t.expect(/^Skip tips/.test(tip.skip) && tip.r.height >= 44 - 8, 'a Skip tips control is visible: ' + tip.skip);
      t.expect((await t.page.evaluate(() => document.getElementById('hud-sr').textContent)) === tip.text, 'a screen reader is told the tip');
      const clash = await overlaps(t);
      t.expect(clash.length === 0, 'the tip covers no HUD number or control: ' + clash.join(', '));
      t.expect(tip.r.left >= 0 && tip.r.right <= t.vp.width, 'it fits the screen width');
      await shot(t, 'S2-01-tip-goal');
      if (touch) { // a phone held sideways
        await t.page.setViewportSize({ width: 844, height: 390 }); await t.waitFrames(6);
        const land = await overlaps(t), lt = await tipOf(t);
        t.expect(land.length === 0 && lt && lt.r.left >= 0 && lt.r.right <= 844, 'sideways, the tip covers nothing: ' + land.join(', '));
        await t.page.screenshot({ path: `${SHOTS}/S2-01-tip-goal-landscape.png` });
        await t.page.setViewportSize({ width: 390, height: 844 }); await t.waitFrames(6);
      }
      // doing the thing dismisses it: hold the push key (a phone has auto-push) and the tub gets moving
      if (!touch) await t.page.keyboard.down('ArrowUp');
      await t.game('step', 60 * 3.3 + 60 * 2.5);
      if (!touch) await t.page.keyboard.up('ArrowUp');
      t.expect(!(await tipOf(t)) || !/Goal/.test((await tipOf(t)).text), 'once the tub is moving the goal tip is gone');
      // the first pickup (on a phone the auto-push note has its turn first)
      if (touch) await t.game('step', 60 * 6);
      await t.game('setState', { kart: { held: 'duck' } });
      await t.game('step', 90);
      tip = await tipOf(t);
      t.expect(tip && (touch ? /Tap Item/.test(tip.text) : /Press X to use your item\./.test(tip.text)), 'holding an item shows how to use it: ' + (tip && tip.text));
      t.expect((await overlaps(t)).length === 0, 'the item tip covers nothing: ' + (await overlaps(t)).join(', '));
      await shot(t, 'S2-01-tip-item');
      await t.game('setState', { kart: { held: null } }); await t.game('step', 5);
      t.expect(!(await tipOf(t)), 'using or losing the item dismisses it');
      // low water
      await t.game('act', 'water', 6);
      await t.game('step', 120);
      tip = await tipOf(t);
      t.expect(tip && /Keep 10 gallons or more for a Clean Finish\./.test(tip.text), 'under ten gallons the Clean Finish rule is named: ' + (tip && tip.text));
      await shot(t, 'S2-01-tip-water');
      // a tip goes by itself after a few seconds
      await t.game('step', 60 * 6);
      t.expect(!(await tipOf(t)), 'it goes by itself');
      // Skip tips: tips stop and the flag is saved
      await t.game('act', 'water', 3); await t.game('step', 60 * 6);
      st = await t.state();
      t.expect(st.tips && st.tips.on, 'tips are still on mid-race');
      await t.game('act', 'menu', 'quit'); await t.waitFrames(3);
      t.expect((await t.state()).tips.on === false, 'leaving the race stops the tips');
      t.expect((await readSave(t)) === null || (await readSave(t)).settings.seenIntro === false, 'quitting early does not mark them seen');
    },
  },
  {
    name: 'council E S2-01: Skip tips ends them and saves it; a finished first race and an older save both leave no tips; Settings brings them back',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await fresh(t);
      await startHuman(t);
      await t.game('step', 30);
      t.expect(!!(await tipOf(t)), 'tip showing');
      await t.page.locator('.hud-tip button').click();
      t.expect(!(await tipOf(t)), 'Skip tips hides the tip');
      let sv = await readSave(t);
      t.expect(sv && sv.settings.seenIntro === true, 'and saves that the tips were seen');
      await t.game('step', 60 * 8); await t.game('act', 'water', 2); await t.game('step', 60 * 8);
      t.expect(!(await tipOf(t)), 'no later tip appears after skipping');
      // a new race: none
      await t.game('act', 'menu', 'quit'); await t.reload(); await t.waitIdle(8000);
      await startHuman(t); await t.game('step', 60 * 2);
      t.expect(!(await tipOf(t)), 'after a reload the next race shows no tips');
      // Settings > Race tips > Show brings them back
      await t.game('act', 'menu', 'quit'); await t.game('scene', 'settings'); await t.waitFrames(3);
      await t.page.locator('button[data-k="seenIntro"][data-v="false"]').click(); await t.waitFrames(3);
      sv = await readSave(t);
      t.expect(sv.settings.seenIntro === false, 'Show tips again clears the flag');
      await shot(t, 'S2-01-settings-tips');
      await t.game('act', 'menu', 'quit');
      await startHuman(t); await t.game('step', 30);
      t.expect(!!(await tipOf(t)), 'the tips are back for the next race');
      // an older save: no tips unless asked
      await t.game('act', 'menu', 'quit');
      await fresh(t, OLD());
      await startHuman(t); await t.game('step', 60 * 3);
      t.expect(!(await tipOf(t)), 'an older save is not treated as a newcomer');
      t.expect((await t.state()).settings.seenIntro === true, 'it counts as having seen them');
    },
  },
  {
    name: 'council E S2-01: finishing the first race marks the tips seen',
    viewports: ['desktop'],
    async run(t) {
      await fresh(t);
      await t.game('newGame', { mode: 'quick', track: 'bathhouse-row', count: 8, laps: 1, paused: true, seed: 7 });
      await t.game('step', 30);
      t.expect(!!(await tipOf(t)), 'the first race teaches');
      // let the autoplay driver (same sim) run the human tub to the line
      let done = false;
      for (let i = 0; i < 60 && !done; i++) {
        const hint = await t.game('act', 'aiHint');
        if (hint) await t.game('act', 'input', hint);
        const s = await t.game('step', 300);
        done = s.race.phase === 'done';
      }
      t.expect(done, 'the race finished');
      await t.game('act', 'input', null);
      t.expect((await readSave(t)).settings.seenIntro === true, 'the finish saved that the tips were seen');
      t.expect(!(await tipOf(t)), 'and the tip is gone');
    },
  },
  // ---------------------------------------------------------------- settings
  {
    name: 'council E S2-06: Settings has HUD size, Steer assist, Volume, Race tips and Controls, all saved and applied',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await fresh(t);
      await t.game('scene', 'settings'); await t.waitFrames(3);
      const rows = await t.page.evaluate(() => [...document.querySelectorAll('.settings .set-row > span')].map((s) => s.textContent));
      for (const r of ['Auto-push', 'Steer assist', 'HUD size', 'Sound', 'Volume', 'Music', 'Ambience', 'Race tips', 'Controls']) t.expect(rows.includes(r), 'row ' + r);
      await shot(t, 'S2-06-settings');
      await t.checkLayout({ allowScrollY: true });
      // touch targets
      const small = await t.page.evaluate(() => [...document.querySelectorAll('.settings .chip, .settings .mbtn')].filter((b) => b.getClientRects().length > 0 /* C4-15: the Touch layout row is not on screen without touch controls */ && b.getBoundingClientRect().height < 40).map((b) => b.textContent));
      t.expect(small.length === 0, 'every chip is at least 40 px tall: ' + small.join(', '));
      // HUD size
      const sel = (k, v) => t.page.locator(`button[data-k="${k}"][data-v="${v}"]`);
      await sel('hudScale', '1.15').click(); await t.waitFrames(2);
      t.expect((await t.page.evaluate(() => document.documentElement.style.getPropertyValue('--hud-user'))) === '1.15', 'Large sets the HUD scale');
      t.expect((await readSave(t)).settings.hudScale === 1.15, 'and it is saved');
      t.expect((await t.page.evaluate(() => document.querySelector('button[data-k="hudScale"][data-v="1.15"]').getAttribute('aria-pressed'))) === 'true', 'the chip shows it is chosen');
      await sel('hudScale', '0.85').click(); await t.waitFrames(2);
      t.expect((await readSave(t)).settings.hudScale === 0.85, 'Small is saved');
      // steer assist, volume
      await sel('steerAssist', 'true').click(); await t.waitFrames(2);
      await sel('volume', '1').click(); await t.waitFrames(2);
      let sv = await readSave(t);
      t.expect(sv.settings.steerAssist === true && sv.settings.volume === 1, 'steer assist and volume are saved');
      await t.reload(); await t.waitIdle(8000);
      const st = await t.state();
      t.expect(st.settings.hudScale === 0.85 && st.settings.steerAssist === true && st.settings.volume === 1, 'all of it survives a reload');
      t.expect((await t.page.evaluate(() => document.documentElement.style.getPropertyValue('--hud-user'))) === '0.85', 'the HUD size is applied at boot');
      // the HUD really changes size
      await startHuman(t); await t.game('step', 10);
      const w = () => t.page.evaluate(() => document.querySelector('.hud-bl').getBoundingClientRect().width);
      const hudSmall = await w();
      await t.game('act', 'menu', 'quit'); await t.game('scene', 'settings'); await t.waitFrames(2);
      await t.page.locator('button[data-k="hudScale"][data-v="1.15"]').click(); await t.waitFrames(2);
      await t.game('act', 'menu', 'quit'); await startHuman(t); await t.game('step', 10);
      const large = await w();
      t.expect(large > hudSmall * 1.3, `the HUD is larger at Large (${hudSmall.toFixed(0)} px to ${large.toFixed(0)} px)`);
      await shot(t, 'S2-06-hud-large');
      await t.game('act', 'menu', 'quit');
    },
  },
  // ---------------------------------------------------------------- controls
  {
    name: 'council E S2-06: the Controls screen rebinds a key, the new key drives the tub, and it survives a reload',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await fresh(t);
      await t.game('scene', 'settings'); await t.waitFrames(3);
      await t.page.locator('button[data-act="controls"]').click();
      await t.waitIdle(8000); await t.waitFrames(3);
      t.equal((await t.state()).screen, 'controls', 'the Controls screen opens');
      const list = await t.page.evaluate(() => [...document.querySelectorAll('.controls .set-row')].map((r) => r.textContent.replace(/\s+/g, ' ').trim()));
      t.expect(list.length === 7 && /Pushs*↑ or W/.test(list.join('|')) && /Hop and slides*Shift or Space/.test(list.join('|')), 'it lists every control with its keys: ' + list.join(' | '));
      await shot(t, 'S2-06-controls');
      await t.checkLayout({ allowScrollY: true });
      // rebind Hop to Z with the keyboard
      await t.page.locator('button[data-a="hop"]').click(); await t.waitFrames(2);
      t.expect(/Press a key/.test(await t.page.locator('button[data-a="hop"]').textContent()), 'it waits for a key');
      await shot(t, 'S2-06-controls-waiting');
      await t.page.keyboard.press('Enter'); await t.waitFrames(2);
      t.expect(/Press a key/.test(await t.page.locator('button[data-a="hop"]').textContent()), 'Enter is kept for menus and does not rebind');
      await t.page.keyboard.press('KeyZ'); await t.waitFrames(3);
      t.expect(/Z/.test(await t.page.locator('button[data-a="hop"]').textContent()) && /Hop and slide is now Z/.test(await t.page.locator('.controls .sub').textContent()), 'Hop is now Z, and the screen says so');
      let sv = await readSave(t);
      t.expect(JSON.stringify(sv.settings.keys.hop) === '["KeyZ"]', 'it is saved: ' + JSON.stringify(sv.settings.keys));
      await shot(t, 'S2-06-controls-done');
      // Done goes back to Settings
      await t.page.locator('button[data-act="settings"]').click(); await t.waitFrames(3);
      t.equal((await t.state()).screen, 'settings', 'Done returns to Settings');
      // after a reload the new key still works in a race: hold push, then steer with Z held, and the tub slides
      await t.reload(); await t.waitIdle(8000);
      t.expect(JSON.stringify((await t.state()).bindings.hop) === '["KeyZ"]', 'the binding is there after a reload');
      await startHuman(t, { classId: 'soak' });
      await t.page.keyboard.down('ArrowUp');
      await t.game('step', 60 * 3.3 + 60 * 5);
      await t.page.keyboard.down('ArrowRight'); await t.page.keyboard.down('Shift');
      await t.game('step', 20);
      let k = await me(t);
      t.expect(k.drift === 0, 'the old key (Shift) no longer slides: drift ' + k.drift);
      await t.page.keyboard.up('Shift'); await t.page.keyboard.down('KeyZ');
      await t.game('step', 20);
      k = await me(t);
      t.expect(k.drift !== 0, 'the new key (Z) starts a power slide: drift ' + k.drift);
      await t.page.keyboard.up('KeyZ'); await t.page.keyboard.up('ArrowRight'); await t.page.keyboard.up('ArrowUp');
      await t.game('act', 'menu', 'quit');
      // Reset keys
      await t.game('scene', 'settings'); await t.page.locator('button[data-act="controls"]').click(); await t.waitIdle(8000); await t.waitFrames(3);
      await t.page.locator('button[data-act="rebindReset"]').click(); await t.waitFrames(3);
      sv = await readSave(t);
      t.expect(sv.settings.keys === null && /Shift or Space/.test(await t.page.locator('button[data-a="hop"]').textContent()), 'Reset keys restores the defaults');
    },
  },
  {
    name: 'council E S2-06: a tip names the key the player chose',
    viewports: ['desktop'],
    async run(t) {
      await fresh(t, { ...OLD({ seenIntro: false, keys: { hop: ['KeyZ'], push: ['KeyI'] } }) });
      await startHuman(t); await t.game('step', 30);
      const tip = await tipOf(t);
      t.expect(tip && /Hold I to push/.test(tip.text), 'the goal tip uses the rebound push key: ' + (tip && tip.text));
    },
  },
  // ---------------------------------------------------------------- touch
  {
    name: 'council E S1-03: a new touch player starts with auto-push on and is told once; an older save is left alone',
    viewports: ['mobile'],
    async run(t) {
      await fresh(t);
      let st = await t.state();
      t.expect(st.settings.autoPush === true, 'a new phone player starts with auto-push on');
      st = await startHuman(t);
      const seen = [];
      for (let i = 0; i < 60; i++) {
        const tip = await tipOf(t);
        if (tip) { if (/Auto-push/.test(tip.text) && !seen.some((x) => /Auto-push/.test(x))) { t.expect((await overlaps(t)).length === 0, 'the auto-push note covers nothing'); await shot(t, 'S1-03-autopush-tip'); } seen.push(tip.text); }
        await t.game('step', 20);
      }
      t.expect(seen.some((s) => /Auto-push is on\. Hold Brake to stop; change it in Settings\./.test(s)), 'the player is told auto-push is on, and how to change it: ' + [...new Set(seen)].join(' | '));
      t.expect((await me(t)).vf > 5, 'and the tub drives itself with no button held');
      await t.game('act', 'menu', 'quit');
      // Settings shows it, and Off is a real choice
      await t.game('scene', 'settings'); await t.waitFrames(3);
      t.expect((await t.page.evaluate(() => document.querySelector('button[data-k="autoPush"][data-v="true"]').getAttribute('aria-pressed'))) === 'true', 'Settings shows auto-push On');
      await t.page.locator('button[data-k="autoPush"][data-v="false"]').click(); await t.waitFrames(2);
      t.expect((await readSave(t)).settings.autoPush === false, 'turning it off is saved');
      await t.reload(); await t.waitIdle(8000);
      t.expect((await t.state()).settings.autoPush === false, 'and stays off after a reload (a saved choice is never overridden)');
      // an older save with auto-push off is not switched on
      await fresh(t, OLD());
      t.expect((await t.state()).settings.autoPush === false, 'an older save keeps auto-push off on a phone');
    },
  },
];
