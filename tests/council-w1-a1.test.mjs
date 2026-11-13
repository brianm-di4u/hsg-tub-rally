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
];
