// Wave 1, batch A1 regressions: hit immunity (S1-02) and the pieces added by the later A1 fixes.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { Track } from '../src/js/sim/track.js';
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
];
