// Wave 4, batch A: saves, lifecycle and robustness (C4-01, C4-03, C4-04, C4-09, C4-10, C4-11, C4-13, C4-15).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createSaveWriter, DEFAULT_SAVE } from '../src/js/save.js';
import { Governor, CLIMB } from '../src/js/gfx/tiers.js';

const KEY = 'hsg-tub-rally-v1', CUP = 'hsg-tub-rally-cup-v1';
const SHOTS = '../_council/hsg-tub-rally/wave-4/shots';
const shot = async (t, id, what) => { fs.mkdirSync(SHOTS, { recursive: true }); await t.page.screenshot({ path: `${SHOTS}/${id}-${what}-${t.viewport === 'mobile' ? 'mobile' : 'desktop'}.png` }); };
// a valid v1 save, written as a newer build would: a higher version and a field this build has never seen
const newerSave = (v = 2) => JSON.stringify({ ...DEFAULT_SAVE(), v, future: { thing: [1, 2, 3] }, stats: { races: 41, wins: 9, gallonsSpilled: 12.5, bestStreak: 3 } });

export const tests = [
  // ---------------------------------------------------------------- C4-01
  {
    name: 'council W4A C4-01: a save from a newer version is never written, backed up or reset; a damaged one still is',
    node: true,
    run() {
      for (const bad of [newerSave(2), newerSave(7), '{"v":2}', '{"v":3,"best":[]}', '{"v":99.5}']) {
        const box = { raw: bad, copy: null, writes: 0 };
        const w = createSaveWriter({ read: () => box.raw, write: (r) => { box.writes++; box.raw = r; }, backup: (r) => { box.copy = r; } });
        const save = w.load();
        assert.equal(w.problem(), 'newer', bad.slice(0, 20));
        assert.deepEqual(save.settings, DEFAULT_SAVE().settings, 'the visit starts from defaults in memory');
        const a = w.commit(save, { settings: { sound: false }, lastTeam: 'gator-gang' });
        assert.equal(a.stored, false); assert.equal(a.problem, 'newer');
        assert.equal(save.settings.sound, false, 'the change still holds in memory');
        const tok = {};
        w.commit(save, { race: { token: tok, won: true, record: { track: 'bathhouse-row', finishT: 90, value: { race: 90, lap: 30, team: 'engine-six', cls: 'splash' }, ghost: null } } });
        const r = w.reset(save);
        assert.equal(r.stored, false, 'reset does not replace it'); assert.equal(r.problem, 'newer');
        assert.equal(box.raw, bad, 'byte for byte the same'); assert.equal(box.writes, 0); assert.equal(box.copy, null, 'no copy set aside');
      }
      // damaged, wrong-shaped and wrong-typed versions are still repaired by the player's reset, as before
      for (const bad of ['{bad', 'null', '{"v":"2"}', '{"v":0}', '{"v":1,"best":[]}', '[]']) {
        const box = { raw: bad, copy: null };
        const w = createSaveWriter({ read: () => box.raw, write: (r) => { box.raw = r; }, backup: (r) => { box.copy = r; } });
        const save = w.load();
        assert.equal(w.problem(), 'damaged', bad);
        assert.equal(w.reset(save).stored, true, bad); assert.equal(box.copy, bad);
      }
    },
  },
  {
    name: 'council W4A C4-01: a visit on a newer save is told once, offers no reset, and leaves every stored byte alone',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(8000);
      const cup = JSON.stringify({ v: 1, cup: 'bathhouse', name: 'Bathhouse Cup', tracks: ['bathhouse-row', 'park-avenue'], round: 1, table: { 'engine-six': { team: 'engine-six', points: 10, clean: 1, human: true, bribes: 0 } }, rivals: ['lather-linen'], team: 'engine-six', classId: 'soak', seed: 5 });
      const saved = newerSave();
      await t.page.evaluate(([k, v, c, cv]) => { localStorage.setItem(k, v); localStorage.setItem(c, cv); }, [KEY, saved, CUP, cup]);
      await t.reload();
      await t.waitIdle(8000);
      await t.page.waitForSelector('[data-save-status]', { timeout: 8000 });
      const text = await t.page.evaluate(() => document.querySelector('[data-save-status]').textContent);
      t.expect(/not being saved/.test(text) && /newer version of the game/.test(text), 'the notice says why: ' + text);
      t.expect(!/damaged/i.test(text), 'it does not call the save damaged');
      t.equal(await t.page.locator('[data-save-status] button').count(), 0, 'no Reset saved data button');
      t.equal(await t.page.locator('[data-act="continueCup"]').count(), 0, 'the newer build\'s cup in progress is not offered');
      await t.checkLayout();
      await shot(t, 'C4-01', 'notice');
      // a visit that would normally save: settings changed, a race finished
      await t.page.locator('[data-act="settings"]').click(); await t.waitFrames(3);
      t.equal(await t.page.locator('[data-save-status]').count(), 0, 'told once: not repeated on the next screen');
      await t.page.locator('[data-act="set"][data-k="sound"][data-v="false"]').click(); await t.waitFrames(3);
      await t.page.locator('[data-act="set"][data-k="music"][data-v="false"]').click(); await t.waitFrames(3);
      t.equal((await t.state()).settings.sound, false, 'the choice holds for this visit');
      await t.game('newGame', { track: 'bathhouse-row', team: 'engine-six', mode: 'gp', count: 1, laps: 1, paused: true, autoplay: true, seed: 4 });
      await t.stepUntil((s) => s.race.phase === 'done', { max: 60 * 240, chunk: 600, label: 'race done' });
      await t.waitFrames(3);
      await t.game('scene', 'title'); await t.waitFrames(3);
      t.equal(await t.page.locator('[data-save-status]').count(), 0, 'and not again on the title');
      const after = await t.page.evaluate(([k, c]) => [localStorage.getItem(k), localStorage.getItem(c), localStorage.getItem(k + '-corrupt')], [KEY, CUP]);
      t.equal(after[0], saved, 'the newer save is byte for byte the same after the visit');
      t.equal(after[1], cup, 'so is the cup key');
      t.equal(after[2], null, 'and nothing was set aside');
    },
  },
  {
    name: 'council W4A C4-01: a damaged save is still reported as damaged, with its reset button',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      await t.page.evaluate((k) => localStorage.setItem(k, '{"v":"2","settings":{'), KEY);
      await t.reload();
      await t.waitIdle(8000);
      await t.page.waitForSelector('[data-save-status]', { timeout: 8000 });
      t.expect(/damaged/i.test(await t.page.locator('[data-save-status]').textContent()), 'damaged wording');
      t.equal(await t.page.locator('[data-save-status] button').count(), 1, 'reset offered');
    },
  },
  // ---------------------------------------------------------------- C4-03
  {
    name: 'council W4A C4-03: the governor climbs one step between races, and only when the whole race had room to spare',
    node: true,
    run() {
      const good = { windows: CLIMB.windows, worst: CLIMB.slowest, cpu: CLIMB.cpuMs };
      const at = (start, now, last, auto = true) => { const g = new Governor(start, true); g.tier = now; g.last = last ? { ...last } : null; return [g, g.climb(auto)]; };
      assert.equal(at('medium', 'low', good)[1], 'medium', 'room to spare: one step up');
      assert.equal(at('medium', 'low', { ...good, windows: CLIMB.windows - 1 })[1], null, 'a short race proves nothing');
      assert.equal(at('medium', 'low', { ...good, worst: CLIMB.slowest + 0.001 })[1], null, 'one slow stretch in the race');
      assert.equal(at('medium', 'low', { ...good, cpu: CLIMB.cpuMs + 0.1 })[1], null, 'heavy drawing work');
      assert.equal(at('medium', 'low', null)[1], null, 'a race that did not finish measured nothing');
      assert.equal(at('medium', 'low', good, false)[1], null, 'a quality the player chose is left alone');
      assert.equal(at('low', 'low', good)[1], null, 'never above the tier the visit started at');
      assert.equal(at('medium', 'medium', good)[1], null, 'already there');
      // from High a visit climbs at most back to Medium: the High parts are not built mid-visit
      assert.equal(at('high', 'low', good)[1], 'medium');
      const [g] = at('high', 'medium', good); assert.equal(g.climb(true), null, 'the reading is used once');
      const pinned = new Governor('medium', false); pinned.tier = 'low'; pinned.last = { ...good };
      assert.equal(pinned.climb(true), null, 'a governor that was off at the start stays off');
    },
  },
  {
    name: 'council W4A C4-03: a drop right after a climb is final for the visit, and a race is measured from its own frames',
    node: true,
    run() {
      const g = new Governor('medium', true);
      const race = (dt, secs, cpu = 1) => { g.beginRace(); let drop = null; for (let i = 0; i < Math.round(secs / dt); i++) drop = g.frame(dt, true, cpu) || drop; g.endRace(); return drop; };
      assert.equal(race(1 / 30, 2.2), null, 'two slow windows are needed to drop: one is not enough'); assert.equal(g.tier, 'medium');
      g.tier = 'low'; g.slow = 0; g.last = null;
      assert.equal(race(1 / 60, 20), null);
      assert.ok(g.last.windows >= 9 && g.last.worst < CLIMB.slowest, 'twenty smooth seconds are on record: ' + JSON.stringify(g.last));
      assert.equal(g.climb(true), 'medium');
      race(1 / 30, 8); race(1 / 30, 8);
      assert.equal(g.tier, 'low', 'slow again at Medium: down again');
      assert.equal(g.locked, true);
      race(1 / 60, 20);
      assert.equal(g.climb(true), null, 'and it does not go back and forth');
      // paused or very long frames are not racing
      const h = new Governor('medium', true); h.beginRace();
      for (let i = 0; i < 400; i++) { h.frame(1 / 60, false); h.frame(0.5, true); }
      assert.equal(h.windows, 0);
    },
  },
  {
    name: 'council W4A C4-03: the next scene is built one tier higher after a smooth race, never during one',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(8000);
      const good = { windows: 12, worst: 0.0167, cpu: 2 };
      const start = (await t.state()).render.tier;
      t.equal(start, t.viewport === 'desktop' ? 'medium' : 'low', 'the visit starts at the tier the game picks');
      const race = (o = {}) => t.game('newGame', { track: 'bathhouse-row', team: 'engine-six', laps: 1, seed: 4, paused: true, ...o });
      await race();
      const tris = async () => (await t.state()).world.tris;
      const atMedium = await tris();
      if (t.viewport === 'mobile') {
        await t.game('act', 'lastRace', good); await race();
        t.equal((await t.state()).render.tier, 'low', 'a phone that starts on Low is never taken above it');
        return;
      }
      await t.game('act', 'governorDown', 'low');
      let s = await t.state();
      t.equal(s.render.tier, 'low', 'the governor stepped down');
      await race();
      t.equal((await t.state()).render.builtTier, 'low', 'the next scene is built at Low');
      t.expect((await tris()) < atMedium, 'and is lighter: ' + (await tris()) + ' < ' + atMedium + ' triangles');
      await t.game('act', 'lastRace', good);
      s = await t.state();
      t.equal(s.render.tier, 'low', 'not during the race: the reading alone changes nothing');
      await race();
      s = await t.state();
      t.equal(s.render.tier, 'medium', 'the next race is built one tier up'); t.equal(s.render.builtTier, 'medium', 'and the scene was built there');
      t.equal(await tris(), atMedium, 'with the Medium scene back, not the Low one kept');
      await shot(t, 'C4-03', 'climbed');
      // a slow race, a race that was left, and a quality the player chose all stay where they are
      for (const [what, last] of [['a slow stretch', { ...good, worst: 0.03 }], ['a race that never finished', null]]) {
        await t.game('act', 'governorDown', 'low'); await t.game('act', 'lastRace', last); await race();
        t.equal((await t.state()).render.tier, 'low', what + ' keeps Low');
      }
      await t.game('setState', { settings: { quality: 'low' } });
      await t.game('act', 'lastRace', good); await race();
      t.equal((await t.state()).render.tier, 'low', 'a pinned quality is left alone');
    },
  },
  // ---------------------------------------------------------------- C4-04
  {
    name: 'council W4A C4-04: a new Grand Prix asks before it replaces a cup that can be continued, with Keep focused',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(8000);
      const cup = { v: 1, cup: 'bathhouse', name: 'Bathhouse Cup', tracks: ['bathhouse-row', 'park-avenue', 'whittington-valley', 'bridge-street'], round: 1,
        table: { 'engine-six': { team: 'engine-six', points: 20, clean: 1, human: true, bribes: 0 }, 'lather-linen': { team: 'lather-linen', points: 30, clean: 1, bribes: 0 } },
        rivals: ['lather-linen'], team: 'engine-six', classId: 'soak', seed: 5 };
      const stored = JSON.stringify(cup);
      const toCups = async () => {
        await t.game('scene', 'title'); await t.waitFrames(2);
        await t.game('act', 'menu', 'gp'); await t.game('act', 'menu', 'teamOk'); await t.game('act', 'menu', 'cls', { id: 'soak' });
        await t.waitFrames(3);
        t.equal((await t.state()).screen, 'cups', 'on the cups screen');
      };
      // no cup to continue: nothing is asked
      await toCups();
      await t.page.locator('[data-act="cup"][data-id="bathhouse"]').click();
      await t.page.waitForFunction(() => window.__game.getState().race?.mode === 'gp', null, { timeout: 20000 });
      // a cup to continue
      await t.page.evaluate(([k, v]) => localStorage.setItem(k, v), [CUP, stored]);
      await t.reload(); await t.waitIdle(8000);
      await toCups();
      await t.page.locator('[data-act="cup"][data-id="bathhouse"]').click();
      await t.waitFrames(3);
      let s = await t.state();
      t.equal(s.screen, 'replaceCup', 'the question is shown'); t.expect(!s.race, 'and no race has started');
      const text = await t.page.locator('.panel.replace').innerText();
      t.expect(/Bathhouse Cup/.test(text) && /race 2 of 4/.test(text) && /replaces it/.test(text), 'it names the cup and the race reached: ' + text.replace(/\n+/g, ' | '));
      t.equal(await t.page.evaluate(() => document.activeElement.dataset.act), 'back', 'the focus is on keeping the cup');
      t.equal(await t.page.locator('.panel.replace button').count(), 2, 'two choices');
      await t.checkLayout();
      await shot(t, 'C4-04', 'ask');
      // Esc keeps it, and the title offers it again
      await t.page.keyboard.press('Escape'); await t.waitFrames(3);
      t.equal((await t.state()).screen, 'title', 'Esc keeps the cup');
      t.equal(await t.page.locator('[data-act="continueCup"]').count(), 1, 'Continue cup is still offered');
      t.equal(await t.page.evaluate((k) => localStorage.getItem(k), CUP), stored, 'the stored cup is untouched');
      // Enter on the default does the same; the other button starts the new cup
      await toCups();
      await t.page.locator('[data-act="cup"][data-id="bathhouse"]').click(); await t.waitFrames(3);
      await t.page.keyboard.press('Enter'); await t.waitFrames(3);
      t.equal((await t.state()).screen, 'title', 'Enter on the focused choice keeps the cup');
      await toCups();
      await t.page.locator('[data-act="cup"][data-id="bathhouse"]').click(); await t.waitFrames(3);
      await t.page.locator('[data-act="cupNew"]').click();
      await t.page.waitForFunction(() => window.__game.getState().race?.mode === 'gp', null, { timeout: 20000 });
      t.equal((await t.state()).race.mode, 'gp', 'Start new cup begins the cup');
    },
  },
  // ---------------------------------------------------------------- C4-09
  {
    name: 'council W4A C4-09: a Space held across the finish does not press a button on the results when it is let go',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      await t.game('newGame', { track: 'bathhouse-row', team: 'engine-six', mode: 'quick', count: 2, laps: 1, paused: true, autoplay: true, seed: 4 });
      await t.page.keyboard.down('Space');
      await t.stepUntil((s) => s.race.phase === 'done', { max: 60 * 300, chunk: 600, label: 'race done' });
      await t.page.waitForFunction(() => window.__game.getState().screen === 'results', null, { timeout: 8000 });
      const before = await t.state();
      // the key repeats on the results (the first press after the screen came up is a repeat of the held one), then is let go
      for (let i = 0; i < 3; i++) await t.page.keyboard.down('Space');
      await t.page.keyboard.up('Space');
      await t.waitFrames(5);
      let s = await t.state();
      t.equal(s.screen, 'results', 'still on the results');
      t.equal(s.race.seed, before.race.seed, 'and no race was started again');
      // once the screen has been up a while, a fresh press and release works as it always did
      await t.page.waitForFunction(() => { window.__t0 ||= performance.now(); return performance.now() - window.__t0 > 800; }, null, { timeout: 8000 });
      await t.page.keyboard.down('Space'); await t.page.keyboard.up('Space');
      await t.page.waitForFunction(() => window.__game.getState().screen !== 'results', null, { timeout: 8000 });
      t.expect((await t.state()).screen !== 'results', 'a later single press and release presses the focused button');
    },
  },
  {
    name: 'council W4A C4-09: a Space pressed in the first half second of a screen is held back, and one after it is not',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      await t.game('scene', 'settings'); await t.waitFrames(2);
      // In one page call, so the half second cannot pass between the screen and the key: whether the browser's own
      // key handling is stopped (a cancelled Space key does not press the focused button).
      const early = await t.page.evaluate(() => {
        window.__game.act('menu', 'back');
        const down = new KeyboardEvent('keydown', { code: 'Space', key: ' ', cancelable: true, bubbles: true });
        const up = new KeyboardEvent('keyup', { code: 'Space', key: ' ', cancelable: true, bubbles: true });
        document.activeElement.dispatchEvent(down); document.activeElement.dispatchEvent(up);
        return { screen: document.body.dataset.screen, down: down.defaultPrevented, up: up.defaultPrevented };
      });
      t.equal(early.screen, 'title', 'the title is up');
      t.expect(early.down && early.up, 'Space keys straight after it appears are cancelled: ' + JSON.stringify(early));
      await t.page.waitForFunction(() => { window.__t1 ||= performance.now(); return performance.now() - window.__t1 > 800; }, null, { timeout: 8000 });
      const late = await t.page.evaluate(() => {
        const down = new KeyboardEvent('keydown', { code: 'Space', key: ' ', cancelable: true, bubbles: true });
        const up = new KeyboardEvent('keyup', { code: 'Space', key: ' ', cancelable: true, bubbles: true });
        document.activeElement.dispatchEvent(down); document.activeElement.dispatchEvent(up);
        return { down: down.defaultPrevented, up: up.defaultPrevented };
      });
      t.expect(!late.down && !late.up, 'and Space keys after the first half second are left to the focused button: ' + JSON.stringify(late));
      // a screen that redraws itself (a chip pressed in Settings) does not start the half second again
      await t.game('scene', 'settings'); await t.waitFrames(2);
      await t.page.waitForFunction(() => { window.__t2 ||= performance.now(); return performance.now() - window.__t2 > 800; }, null, { timeout: 8000 });
      const redraw = await t.page.evaluate(() => {
        window.__game.act('menu', 'set', { k: 'hudScale', v: '1' });
        const down = new KeyboardEvent('keydown', { code: 'Space', key: ' ', cancelable: true, bubbles: true });
        document.activeElement.dispatchEvent(down);
        return down.defaultPrevented;
      });
      t.equal(redraw, false, 'a redraw of the same screen is not a new screen');
    },
  },
];
