// Wave 1, batch A1 regressions: hit immunity (S1-02) and the pieces added by the later A1 fixes.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { Track } from '../src/js/sim/track.js';
import { createSaveWriter, DEFAULT_SAVE } from '../src/js/save.js';
import { makeKart, stepKart, fumble } from '../src/js/sim/kart.js';

const DT = 1 / 60;
const track = () => new Track(JSON.parse(fs.readFileSync(new URL('../data/tracks/bathhouse-row.json', import.meta.url), 'utf8')));
function mk(tr) {
  const c = tr.at(100), p = tr.point(100, 0);
  const k = makeKart(0, 'engine-six', 'soak', { x: p.x, z: p.z, y: p.y, yaw: Math.atan2(c.tx, c.tz), s: 100 }, { human: true });
  k.vf = 15; return k;
}
const run = (k, tr, n) => { for (let i = 0; i < n; i++) stepKart(k, { steer: 0, push: 1 }, tr, DT); };
const rng = { int: () => 0 };

export const tests = [
  {
    name: 'council A1 S1-02: a hit while circling does not re-stun or lose the dropped item',
    node: true,
    run() {
      const tr = track(), k = mk(tr);
      assert.equal(fumble(k, rng, 3), true);
      const first = k.dropped;
      assert.ok(first);
      run(k, tr, 30);
      assert.equal(fumble(k, rng, 3), false, 'second hit while circling is ignored');
      assert.equal(k.dropped, first, 'dropped item is not overwritten');
      run(k, tr, 200);
      assert.equal(k.state, 'run');
      assert.deepEqual(Object.values(k.items), [true, true, true, true], 'every attendant item is back');
    },
  },
  {
    name: 'council A1 S1-02: a short protected window follows the circle, then hits land again',
    node: true,
    run() {
      const tr = track(), k = mk(tr);
      fumble(k, rng, 3);
      run(k, tr, 90); // 1.5 s: circle (1.4 s) just ended
      assert.equal(k.state, 'run');
      assert.equal(fumble(k, rng, 3), false, 'immune right after recovery');
      assert.equal(k.state, 'run');
      run(k, tr, 70); // past 1.0 s of protection
      assert.equal(fumble(k, rng, 3), true, 'hittable again after the window');
    },
  },
  {
    name: 'council A1 S1-28: hiding the page, pagehide or blur pauses a live race',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(8000);
      await t.game('newGame', {});
      await t.game('act', 'skipCountdown');
      for (const how of ['visibility', 'pagehide', 'blur']) {
        await t.game('resume');
        let s = await t.state();
        if (s.paused) await t.page.evaluate(() => document.querySelector('[data-act="resume"]')?.click());
        await t.waitFrames(3);
        s = await t.state();
        t.expect(!s.paused && s.scene === 'race', how + ': racing before the event');
        await t.page.evaluate((h) => {
          if (h === 'visibility') {
            Object.defineProperty(document, 'hidden', { value: true, configurable: true });
            document.dispatchEvent(new Event('visibilitychange'));
          } else window.dispatchEvent(new Event(h));
        }, how);
        s = await t.state();
        t.expect(s.paused && s.screen === 'pause', how + ': race paused with the pause screen open');
        const steps = s.steps;
        await t.waitFrames(5);
        t.equal((await t.state()).steps, steps, how + ': simulation frozen');
        await t.page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); });
      }
    },
  },
  {
    name: 'council A1 S5-27: audio is suspended while the page is hidden and resumes on return',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      await t.page.keyboard.press('Shift');
      await t.page.waitForFunction(() => window.__game.getState().audio?.ctx === 'running', null, { timeout: 5000 });
      await t.page.evaluate(() => {
        Object.defineProperty(document, 'hidden', { value: true, configurable: true });
        document.dispatchEvent(new Event('visibilitychange'));
      });
      await t.page.waitForFunction(() => window.__game.getState().audio.ctx === 'suspended', null, { timeout: 3000 }).catch(() => {});
      t.equal((await t.state()).audio.ctx, 'suspended', 'AudioContext suspended while hidden');
      await t.page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); });
      await t.page.waitForFunction(() => window.__game.getState().audio.ctx === 'running', null, { timeout: 3000 }).catch(() => {});
      t.equal((await t.state()).audio.ctx, 'running', 'AudioContext running again when visible');
    },
  },
  {
    name: 'council A1 S5-14: the music is muffled under the pause menu and restored on resume',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      await t.page.keyboard.press('Shift');
      await t.game('newGame', {});
      await t.game('act', 'skipCountdown');
      await t.waitFrames(3);
      t.equal((await t.state()).audio.muffled, false, 'not muffled while racing');
      await t.page.keyboard.press('Escape');
      await t.waitFrames(3);
      let s = await t.state();
      t.expect(s.paused, 'paused');
      t.equal(s.audio.muffled, true, 'music muffled under the pause menu');
      await t.page.keyboard.press('Escape');
      await t.waitFrames(3);
      s = await t.state();
      t.expect(!s.paused, 'resumed');
      t.equal(s.audio.muffled, false, 'music back to normal after resume');
    },
  },
  {
    name: 'council A1 S6-06: a phone on the Low tier renders at least one pixel per CSS pixel',
    viewports: ['mobile'],
    async run(t) {
      await t.waitIdle(8000);
      const s = await t.state();
      const css = await t.page.evaluate(() => ({ w: document.querySelector('#gl').clientWidth, h: document.querySelector('#gl').clientHeight }));
      t.equal(s.render.tier, 'low', 'phone starts on the Low tier');
      t.equal(s.render.mode, 'native', 'native resolution');
      t.expect(s.render.w >= css.w && s.render.h >= css.h, 'backing store ' + s.render.w + 'x' + s.render.h + ' covers the ' + css.w + 'x' + css.h + ' CSS canvas');
    },
  },
  {
    name: 'council A1 S6-01: reset keeps a copy of the unreadable save and lets saving resume',
    node: true,
    run() {
      for (const bad of ['{bad', 'null', '{"v":2}', '{"v":1,"best":[]}']) {
        const box = { raw: bad, copy: null };
        const w = createSaveWriter({ read: () => box.raw, write: (r) => { box.raw = r; }, backup: (r) => { box.copy = r; } });
        const save = w.load();
        const before = w.commit(save, { settings: { sound: false } });
        assert.equal(before.stored, false, bad + ': unreadable save is not overwritten by ordinary commits');
        assert.equal(before.problem, 'damaged');
        assert.equal(box.raw, bad);
        const r = w.reset(save);
        assert.equal(r.stored, true, bad + ': reset stores a fresh save');
        assert.equal(box.copy, bad, 'the damaged bytes are kept');
        const stored = JSON.parse(box.raw);
        assert.equal(stored.v, 1);
        assert.equal(stored.settings.sound, false, 'the pending change is kept');
        assert.equal(w.commit(save, { settings: { music: false } }).stored, true, 'later changes save');
        assert.deepEqual(Object.keys(stored.unlocked), Object.keys(DEFAULT_SAVE().unlocked));
      }
    },
  },
  {
    name: 'council A1 S6-01: blocked storage reports its cause and reset does not touch it',
    node: true,
    run() {
      let blocked = true, writes = 0;
      const w = createSaveWriter({ read: () => { if (blocked) throw Error('blocked'); return null; }, write: () => { writes++; }, backup: () => { writes++; } });
      const save = w.load();
      const r = w.reset(save);
      assert.equal(r.stored, false); assert.equal(r.problem, 'blocked'); assert.equal(writes, 0);
    },
  },
  {
    name: 'council A1 S6-01: a damaged save can be reset from the warning in the game',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      await t.page.evaluate(() => localStorage.setItem('hsg-tub-rally-v1', '{"v":1,"settings":{'));
      await t.reload();
      await t.waitIdle(8000);
      await t.game('scene', 'settings');
      await t.page.locator('[data-act="set"][data-k="sound"][data-v="false"]').click();
      await t.waitFrames(3);
      t.equal(await t.page.evaluate(() => localStorage.getItem('hsg-tub-rally-v1')), '{"v":1,"settings":{', 'damaged value untouched by ordinary changes');
      await t.page.locator('[data-save-status] button').click();
      await t.waitFrames(3);
      const stored = await t.page.evaluate(() => JSON.parse(localStorage.getItem('hsg-tub-rally-v1')));
      t.equal(stored.v, 1, 'fresh save written');
      t.equal(stored.settings.sound, false, 'the change made in this session is kept');
      t.equal(await t.page.evaluate(() => localStorage.getItem('hsg-tub-rally-v1-corrupt')), '{"v":1,"settings":{', 'damaged copy kept');
      t.equal(await t.page.locator('[data-save-status]').count(), 0, 'warning gone');
    },
  },
  {
    name: 'council A1 S6-14: a damaged save is reported at boot, with its own wording and the reset action',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      await t.page.evaluate(() => localStorage.setItem('hsg-tub-rally-v1', 'null'));
      await t.reload();
      await t.waitIdle(8000);
      await t.waitFrames(3);
      const text = await t.page.evaluate(() => document.querySelector('[data-save-status]')?.textContent || null);
      t.expect(text && /damaged/i.test(text), 'warning on the title before any change: ' + text);
      t.expect(await t.page.locator('[data-save-status] button').count() === 1, 'reset action offered');
    },
  },
  {
    name: 'council A1 S6-14: blocked storage is reported at boot, with its own wording and no reset action',
    viewports: ['desktop'],
    initScript: () => {
      const get = Storage.prototype.getItem;
      Storage.prototype.getItem = function (k) { if (k === 'hsg-tub-rally-v1') throw new Error('blocked'); return get.call(this, k); };
    },
    async run(t) {
      await t.waitIdle(8000);
      await t.waitFrames(3);
      const text = await t.page.evaluate(() => document.querySelector('[data-save-status]')?.textContent || null);
      t.expect(text && /blocked/i.test(text), 'blocked wording on the title: ' + text);
      t.expect(await t.page.locator('[data-save-status] button').count() === 0, 'no reset action for blocked storage');
    },
  },
  {
    name: 'council A1 S2-23: a Grand Prix survives a reload and can be continued',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      await t.game('act', 'menu', 'gp');
      await t.game('act', 'menu', 'cup', { id: 'bathhouse' });
      await t.waitIdle(8000);
      await t.game('newGame', { mode: 'gp', track: 'bathhouse-row', team: 'engine-six', classId: 'soak', laps: 1, seed: 12, autoplay: true, paused: true });
      await t.stepUntil((st) => st.race.phase === 'done', { max: 60 * 300, chunk: 600, label: 'race done' });
      await t.waitFrames(3);
      const stored = await t.page.evaluate(() => JSON.parse(localStorage.getItem('hsg-tub-rally-cup-v1')));
      t.expect(stored && stored.round === 0 && stored.tracks.length === 4, 'cup written after the first recorded race');
      t.expect(stored && Object.keys(stored.table).length === 8, 'standings table kept');
      await t.reload();
      await t.waitIdle(8000);
      t.expect(await t.page.locator('[data-act="continueCup"]').count() === 1, 'title offers Continue cup after the reload');
      await t.page.locator('[data-act="continueCup"]').click();
      await t.waitFrames(3);
      t.equal((await t.state()).screen, 'standings', 'standings shown');
      t.expect((await t.page.locator('.standings tbody tr').count()) === 8, 'eight rows restored');
      await t.page.locator('[data-act="nextRace"]').click();
      await t.page.waitForFunction(() => window.__game.getState().race?.mode === 'gp', null, { timeout: 15000 });
      const s = await t.state();
      t.equal(s.track.id, stored.tracks[1], 'the next race of the cup starts');
      t.equal(s.race.classId, 'soak', 'same speed class');
    },
  },
  {
    name: 'council A1 S2-23: finishing the cup clears it, and a bad stored cup is ignored',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      await t.page.evaluate(() => localStorage.setItem('hsg-tub-rally-cup-v1', '{"v":1,"cup":"nope"}'));
      await t.reload();
      await t.waitIdle(8000);
      t.equal(await t.page.locator('[data-act="continueCup"]').count(), 0, 'invalid cup gives no Continue button');
      const cup = {
        v: 1, cup: 'bathhouse', name: 'Bathhouse Cup', tracks: ['bathhouse-row', 'park-avenue', 'whittington-valley', 'bridge-street'], round: 3,
        table: { 'engine-six': { team: 'engine-six', points: 40, clean: 2, human: true, bribes: 0 }, 'lather-linen': { team: 'lather-linen', points: 30, clean: 1, bribes: 0 } },
        rivals: ['lather-linen'], team: 'engine-six', classId: 'soak', seed: 5,
      };
      await t.page.evaluate((c) => localStorage.setItem('hsg-tub-rally-cup-v1', JSON.stringify(c)), cup);
      await t.reload();
      await t.waitIdle(8000);
      await t.page.locator('[data-act="continueCup"]').click();
      await t.waitFrames(3);
      await t.page.locator('[data-act="trophy"]').click();
      await t.waitFrames(3);
      t.equal(await t.page.evaluate(() => localStorage.getItem('hsg-tub-rally-cup-v1')), null, 'finished cup removed from storage');
      t.equal((await t.state()).screen, 'trophy', 'trophy shown');
    },
  },
];
