// Wave 4, batch A: saves, lifecycle and robustness (C4-01, C4-03, C4-04, C4-09, C4-10, C4-11, C4-13, C4-15).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createSaveWriter, DEFAULT_SAVE } from '../src/js/save.js';

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
];
