// Wave 4, batch A: saves, lifecycle and robustness (C4-01, C4-03, C4-04, C4-09, C4-10, C4-11, C4-13, C4-15).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createSaveWriter, DEFAULT_SAVE } from '../src/js/save.js';
import { Governor, CLIMB } from '../src/js/gfx/tiers.js';
import { CLASSES } from '../src/js/data/teams.js';
import { Track } from '../src/js/sim/track.js';
import { makeRace, stepRace, DT } from '../src/js/sim/race.js';

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
      await t.page.waitForFunction(() => window.__game.getState().screenMs > 800, null, { timeout: 8000 });
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
      await t.page.waitForFunction(() => window.__game.getState().screenMs > 800, null, { timeout: 8000 });
      const late = await t.page.evaluate(() => {
        const down = new KeyboardEvent('keydown', { code: 'Space', key: ' ', cancelable: true, bubbles: true });
        const up = new KeyboardEvent('keyup', { code: 'Space', key: ' ', cancelable: true, bubbles: true });
        document.activeElement.dispatchEvent(down); document.activeElement.dispatchEvent(up);
        return { down: down.defaultPrevented, up: up.defaultPrevented };
      });
      t.expect(!late.down && !late.up, 'and Space keys after the first half second are left to the focused button: ' + JSON.stringify(late));
      // a screen that redraws itself (a chip pressed in Settings) does not start the half second again
      await t.game('scene', 'settings'); await t.waitFrames(2);
      await t.page.waitForFunction(() => window.__game.getState().screenMs > 800, null, { timeout: 8000 });
      const redraw = await t.page.evaluate(() => {
        window.__game.act('menu', 'set', { k: 'hudScale', v: '1' });
        const down = new KeyboardEvent('keydown', { code: 'Space', key: ' ', cancelable: true, bubbles: true });
        document.activeElement.dispatchEvent(down);
        return down.defaultPrevented;
      });
      t.equal(redraw, false, 'a redraw of the same screen is not a new screen');
    },
  },
  // ---------------------------------------------------------------- C4-10
  {
    name: 'council W4A C4-10: a tap let go before SCRUB! earns no start boost, so the hint says to hold',
    node: true,
    run() {
      const tr = new Track(JSON.parse(fs.readFileSync(new URL('../data/tracks/bathhouse-row.json', import.meta.url), 'utf8')));
      // Push goes down at `from` seconds (relative to SCRUB!) and comes up at `until` (null: held through the line)
      const go = (from, until) => {
        const r = makeRace(tr, { seed: 5, classId: 'soak', player: 'engine-six', laps: 1 });
        const me = r.karts[r.player];
        for (let i = 0; i < 400; i++) {
          const inp = [];
          inp[r.player] = { steer: 0, push: r.time >= from && (until == null || r.time < until) ? 1 : 0, brake: false, hop: false, back: false, item: false };
          stepRace(r, tr, inp, DT);
          if (r.phase === 'race') return me.events.map((e) => e.type + (e.kind ? ':' + e.kind : ''));
        }
        return null;
      };
      assert.ok(go(-0.3, null).includes('boost:start'), 'pressed just before SCRUB! and held: the boost');
      assert.ok(!go(-0.3, -0.1).some((e) => e.startsWith('boost')), 'pressed and let go before SCRUB!: nothing');
    },
  },
  {
    name: 'council W4A C4-10: the start hint and How to Play say "Press and hold", for the key and for touch',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(8000);
      await t.game('act', 'menu', 'set', { k: 'autoPush', v: 'false' }); await t.game('act', 'menu', 'set', { k: 'seenIntro', v: 'true' });
      await t.game('newGame', { track: 'bathhouse-row', team: 'engine-six', classId: 'soak', laps: 1, seed: 5, paused: true });
      await t.waitFrames(3);
      const now = (await t.state()).race.time;
      await t.game('step', Math.ceil((-1.8 - now) * 60)); await t.waitFrames(3);
      const h = await t.page.evaluate(() => { const e = document.querySelector('.hud-start'), r = e.getBoundingClientRect(); return { text: e.textContent, shown: e.classList.contains('show'), l: r.left, r: r.right, w: innerWidth }; });
      t.equal(h.text, (t.viewport === 'mobile' ? 'Press and hold Push' : 'Press and hold ↑') + ' just before SCRUB! for a GREAT START', 'the hint');
      t.expect(h.shown && h.l >= 0 && h.r <= h.w, 'it is on screen and inside the width: ' + JSON.stringify(h));
      t.expect(!/\bTap\b/.test(h.text), 'and does not say Tap');
      await shot(t, 'C4-10', 'hint');
      await t.game('scene', 'help'); await t.waitFrames(3);
      if (t.viewport === 'desktop' && (await t.page.locator('[data-act="helpAll"]').getAttribute('aria-expanded')) !== 'true') { await t.page.locator('[data-act="helpAll"]').click(); await t.waitFrames(2); }
      t.expect(/Press and hold Push in the last half second before SCRUB!/.test(await t.page.evaluate(() => document.querySelector('.panel.help').textContent)), 'How to Play says it too');
    },
  },
  // ---------------------------------------------------------------- C4-11
  {
    name: 'council W4A C4-11: the cue total keeps counting after the 24-entry log is full, and the still-menu throttle reports the frames it held back',
    viewports: ['desktop'],
    reducedMotion: true,
    async run(t) {
      await t.waitIdle(8000);
      await t.page.keyboard.press('Shift');
      await t.page.waitForFunction(() => window.__game.getState().audio.ctx === 'running', null, { timeout: 5000 });
      await t.game('newGame', { seed: 12, paused: true }); await t.game('act', 'skipCountdown');
      const audio = async () => (await t.state()).audio;
      // fill the log with more than it keeps
      for (let i = 0; i < 30; i++) await t.game('act', 'event', { type: 'wall', v: 8 });
      const full = await audio();
      t.equal(full.cues.length, 24, 'the log holds its last 24');
      t.expect(full.cueN >= 30, 'the running total went past it: ' + full.cueN);
      const n = full.cueN;
      await t.game('act', 'event', { type: 'pickup', item: 'duck' });
      const after = await audio(), k = after.cueN - n;
      t.expect(k >= 1, 'one more event adds to the total even with the log full: ' + k);
      t.expect(after.cues.slice(-k).some((c) => c.startsWith('pickup')), 'and the newest log entries are the ones it played: ' + after.cues.slice(-k));
      // under Reduced motion a menu is held back by state the game reports
      await t.game('scene', 'title'); await t.waitFrames(3);
      const h0 = (await t.state()).render.throttled;
      await t.page.waitForFunction((h) => window.__game.getState().render.throttled > h + 3, h0, { timeout: 8000 });
      t.expect((await t.state()).render.throttled > h0, 'the throttle counts the frames it held back');
    },
  },
  // ---------------------------------------------------------------- C4-13
  {
    name: 'council W4A C4-13: the Boil line no longer says rivals aim every item at you, and says what its hunt setting does',
    node: true,
    run() {
      assert.equal(CLASSES.boil.hunt, 1, 'Boil rivals hunt fully');
      assert.ok(!/every item|aim every/.test(CLASSES.boil.how), CLASSES.boil.how);
      assert.ok(/save their items for a sure hit/.test(CLASSES.boil.how), 'it says what they do: ' + CLASSES.boil.how);
      assert.ok(/aim some items at you/.test(CLASSES.scald.how), 'the Scald line is as it was');
    },
  },
  {
    name: 'council W4A C4-13: the speed class card shows the Boil line without clipping',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(8000);
      await t.game('act', 'menu', 'quick'); await t.game('act', 'menu', 'teamOk'); await t.waitFrames(3);
      const how = await t.page.evaluate(() => document.querySelector('.classes .mbtn[data-id="boil"]').textContent.replace(/\s+/g, ' '));
      t.expect(how.includes(CLASSES.boil.how), 'the card carries the line: ' + how);
      await t.checkLayout({ allowScrollY: true });
      await shot(t, 'C4-13', 'classes');
    },
  },
  // ---------------------------------------------------------------- C4-15
  {
    name: 'council W4A C4-15: Settings lists Touch layout only where the touch controls can show, keeps a saved value, and the keys skip the hidden row',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(8000);
      const row = () => t.page.evaluate(() => { const r = document.querySelector('.set-row.touch-only'); return r ? { shown: r.getClientRects().length > 0, text: r.textContent.replace(/\s+/g, ' ').trim() } : null; });
      const saved = { ...DEFAULT_SAVE(), settings: { ...DEFAULT_SAVE().settings, seenIntro: true, lefty: true } };
      await t.page.evaluate(([k, v]) => localStorage.setItem(k, JSON.stringify(v)), [KEY, saved]);
      await t.reload(); await t.waitIdle(8000);
      await t.game('scene', 'settings'); await t.waitFrames(3);
      let r = await row();
      if (t.viewport === 'desktop') {
        t.expect(r && !r.shown, 'no Touch layout row for a mouse and keyboard: ' + JSON.stringify(r));
        t.equal(await t.page.evaluate(() => window.__game.getState().settings.lefty), true, 'the saved Mirrored layout is kept');
        // the arrow keys never land on the hidden chips: walk the whole screen
        const seen = new Set();
        await t.page.evaluate(() => document.querySelector('.panel.settings button').focus());
        for (let i = 0; i < 60; i++) { await t.page.keyboard.press('ArrowDown'); seen.add(await t.page.evaluate(() => { const a = document.activeElement; return a.dataset.k ? a.dataset.k + '=' + a.dataset.v : a.dataset.act || a.textContent; })); }
        t.expect(seen.size > 10 && ![...seen].some((k) => k.startsWith('lefty')), 'the arrow keys visit every visible button and skip the hidden row: ' + seen.size);
        await t.checkLayout({ allowScrollY: true });
        await shot(t, 'C4-15', 'settings-no-touch');
        // the first touch brings the touch controls up, and the row with them
        await t.page.evaluate(() => document.querySelector('#gl').dispatchEvent(new PointerEvent('pointerdown', { pointerType: 'touch', bubbles: true, pointerId: 41, clientX: 200, clientY: 300 })));
        await t.waitFrames(2);
        r = await row();
        t.expect(r && r.shown && /Touch layout/.test(r.text), 'after a touch the row is there: ' + JSON.stringify(r));
        t.equal(await t.page.locator('.settings [data-k="lefty"][data-v="true"]').getAttribute('aria-pressed'), 'true', 'showing the saved Mirrored choice');
      } else {
        t.expect(r && r.shown && /Touch layout/.test(r.text), 'a phone has the row: ' + JSON.stringify(r));
        await t.checkLayout({ allowScrollY: true });
        await shot(t, 'C4-15', 'settings-touch');
      }
    },
  },
];
