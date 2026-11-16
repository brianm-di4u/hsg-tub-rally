// Wave 4, batch B: controls, rules and play (C4-16, S1-11, S1-09, S1-10, S6-11) and the small ones (S2-14, S2-30, S4-28, S3-24).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { Track } from '../src/js/sim/track.js';
import { makeRace, stepRace, DT } from '../src/js/sim/race.js';
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

// ---------------------------------------------------------------- S1-09
const bathhouse = () => new Track(JSON.parse(fs.readFileSync(new URL('../data/tracks/bathhouse-row.json', import.meta.url), 'utf8')));
// push straight until the player is past `speed` m/s, then press Hop on the tick the steer is first asked for (`lead` ticks late: the steer comes first)
const hopAt = (speed, steer, lead) => {
  const tr = bathhouse(), r = makeRace(tr, { seed: 5, classId: 'soak', player: 'engine-six', laps: 1, noItems: true });
  const me = r.karts[r.player], mk = (o) => { const i = []; i[r.player] = { steer: 0, push: 1, brake: false, hop: false, back: false, item: false, ...o }; return i; };
  for (let n = 0; n < 4000 && !(r.phase === 'race' && me.vf > speed); n++) stepRace(r, tr, mk({}), DT);
  assert.ok(me.vf > speed, 'got up to speed');
  for (let n = 0; n < lead; n++) stepRace(r, tr, mk({ steer }), DT);
  stepRace(r, tr, mk({ steer, hop: true }), DT);
  return { drift: me.drift, air: me.air, steerNow: me.steer, vf: me.vf };
};
tests.push({
  name: 'council W4B S1-09: Hop and steer pressed on the same tick start the slide; a half-hearted steer or a slow tub still do not',
  node: true,
  run() {
    const same = hopAt(10, 1, 0);
    assert.ok(Math.abs(same.steerNow) < 0.25, 'the smoothed steer has not reached 0.25 on this tick (' + same.steerNow.toFixed(2) + '): this is the case the finding names');
    assert.equal(same.drift, 1, 'Hop and a full right steer on one tick slide to the right');
    assert.equal(hopAt(10, -1, 0).drift, -1, 'and to the left');
    assert.equal(hopAt(10, 1, 3).drift, 1, 'steer first, Hop three ticks later still slides, as before');
    assert.equal(hopAt(10, 0.2, 0).drift, 0, 'a steer under 0.25 is a plain hop');
    assert.equal(hopAt(10, 0, 5).drift, 0, 'no steer is a plain hop');
    const slow = hopAt(5, 1, 0);
    assert.equal(slow.drift, 0, 'below 8 m/s it is a plain hop'); assert.equal(slow.air, true, 'which still hops');
  },
});

// ---------------------------------------------------------------- S1-10
tests.push({
  name: 'council W4B S1-10: a tub holding an item drives through a bubble and leaves it for the next tub',
  node: true,
  run() {
    const tr = bathhouse(), r = makeRace(tr, { seed: 5, classId: 'soak', player: 'engine-six', laps: 1 });
    const me = r.karts[r.player], other = r.karts[0], b = r.items.bubbles[0];
    while (r.phase !== 'race') stepRace(r, tr, [], DT);
    const park = (k, at) => { k.x = at.x; k.y = at.y; k.z = at.z; k.vf = 0; };
    // every other tub is parked well away from every bubble
    for (const k of r.karts) if (k !== me && k !== other) { k.x = 1e5; k.z = 1e5; }
    other.x = 1e5; other.z = 1e5;
    me.held = 'duck'; me.heldN = 1;
    park(me, b);
    stepRace(r, tr, [], DT);
    assert.equal(me.held, 'duck', 'the held item is unchanged');
    assert.equal(b.on, true, 'and the bubble is still there');
    assert.equal(me.events.some((e) => e.type === 'pickup'), false, 'with no pickup call-out');
    // the next tub, with empty hands, takes it
    me.x = 1e5; me.z = 1e5; other.held = null;
    park(other, b);
    stepRace(r, tr, [], DT);
    assert.ok(other.held, 'a tub with empty hands takes it');
    assert.equal(b.on, false, 'and the bubble goes off to respawn');
    // and the player, once the item is used, takes the next one as before
    other.x = 1e5; other.z = 1e5; b.on = true; me.held = null; park(me, b);
    stepRace(r, tr, [], DT);
    assert.ok(me.held && !b.on, 'empty hands pick up as before');
  },
});

// ---------------------------------------------------------------- S6-11
tests.push({
  name: 'council W4B S6-11: backing over the start line and crossing it again counts no extra lap time and no second lap event',
  node: true,
  run() {
    const tr = bathhouse(), L = tr.length;
    const r = makeRace(tr, { seed: 5, classId: 'soak', player: 'engine-six', laps: 3, noItems: true });
    const me = r.karts[r.player];
    while (r.phase !== 'race') stepRace(r, tr, [], DT);
    const lapEvents = [];
    // put the tub at arc length s on the line, facing along the road (or against it) and let one tick carry it across
    const cross = (from, backwards) => {
      const c = tr.at(from), p = tr.point(from, 0);
      me.x = p.x; me.z = p.z; me.y = p.y; me.s = from; me.safeS = from; me.vl = 0; me.vf = 10; me.state = 'run'; me.stateT = 0;
      me.yaw = Math.atan2(c.tx, c.tz) + (backwards ? Math.PI : 0);
      const inp = []; inp[r.player] = { steer: 0, push: 0, brake: false, hop: false, back: false, item: false };
      for (let n = 0; n < 90 && !(backwards ? me.s > L - 40 : me.s < 40); n++) {
        stepRace(r, tr, inp, DT);
        for (const e of r.events) if (e.type === 'lap' && e.kart === me.id) lapEvents.push(e.lap);
      }
    };
    const throughAll = () => { me.cpNext = tr.cps.length; };
    cross(L - 2, false);
    assert.equal(me.lap, 1, 'the first crossing starts lap 1'); assert.equal(me.lapTimes.length, 0);
    r.time += 40; throughAll();
    cross(L - 2, false);
    assert.equal(me.lap, 2, 'a full lap, then lap 2'); assert.equal(me.lapTimes.length, 1, 'one lap time'); assert.deepEqual(lapEvents, [2], 'and one lap event');
    const t1 = me.lapTimes[0];
    cross(2, true);
    assert.equal(me.lap, 1, 'backing over the line goes back a lap');
    r.time += 3;
    cross(L - 2, false);
    assert.equal(me.lap, 2, 'crossing forward again is lap 2 once more');
    assert.equal(me.lapTimes.length, 1, 'no extra lap time'); assert.equal(me.lapTimes[0], t1, 'and the one lap time is the same');
    assert.deepEqual(lapEvents, [2], 'no second lap event, so no second lap cue');
    // the next real lap still counts
    r.time += 40; throughAll();
    cross(L - 2, false);
    assert.equal(me.lap, 3); assert.equal(me.lapTimes.length, 2, 'the next lap is timed as usual'); assert.deepEqual(lapEvents, [2, 3]);
    // reversing twice and coming back twice counts nothing either
    cross(2, true); cross(L - 2, false);
    assert.deepEqual(lapEvents, [2, 3]); assert.equal(me.lapTimes.length, 2);
  },
});
