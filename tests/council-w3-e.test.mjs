// Wave 3, batch E: sound and feel (S5-19 haptics, S5-28 audio regression tests, S5-29 gamepad unlock, S1-14 and S5-21
// incoming-hit warnings, S5-06 results and menu cues, S5-18 tub voices).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_SAVE } from '../src/js/save.js';
import { Track } from '../src/js/sim/track.js';
import { makeRace, stepRace, DT } from '../src/js/sim/race.js';
import { incoming, INCOMING_RANGE } from '../src/js/sim/items.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const track = (id) => new Track(JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'tracks', id + '.json'), 'utf8')));

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
  // ---------------------------------------------------------------- S1-14, S5-21
  {
    name: 'council E S1-14: the sim warns the player once about a duck homing on them or a soap on its way, and not about anything else',
    node: true,
    async run(t) {
      const tr = track('bathhouse-row');
      const r = makeRace(tr, { seed: 5, classId: 'soak', player: 'engine-six', laps: 1 });
      const me = r.karts[r.player], rival = r.karts.find((k) => k !== me);
      for (let i = 0; i < 400 && r.phase !== 'race'; i++) stepRace(r, tr, [], DT);
      const fx = Math.sin(me.yaw), fz = Math.cos(me.yaw), rx = -fz, rz = fx; // forward and right on the ground
      const at = (along, side) => ({ x: me.x + fx * along + rx * side, z: me.z + fz * along + rz * side, y: me.y });
      let id = 900;
      const duck = (along, side, target) => ({ id: id++, type: 'duck', owner: rival.id, target, ...at(along, side), t: 5, ttl: 9, s: me.s - along, d: me.d, v: 30 });
      const soap = (along, side, toward, v = 28) => { const p = at(along, side), dx = me.x - p.x + (toward === 'miss' ? rx * 8 : 0), dz = me.z - p.z + (toward === 'miss' ? rz * 8 : 0), l = Math.hypot(dx, dz); return { id: id++, type: 'soap', owner: rival.id, ...p, vx: (dx / l) * v, vz: (dz / l) * v, t: 5, ttl: 9, s: me.s, bounces: 0 }; };
      const warn = (objs) => { r.items.live = objs; return incoming(r, me).map((x) => x.type + '@' + Math.round(x.dist)); };
      t.equal(JSON.stringify(warn([duck(-15, 0, me.id)])), '["duck@15"]', 'a duck homing on the player, 15 m behind');
      t.equal(JSON.stringify(warn([duck(-15, 0, rival.id)])), '[]', 'a duck homing on someone else is not a warning');
      t.equal(JSON.stringify(warn([duck(-(INCOMING_RANGE + 3), 0, me.id)])), '[]', 'nor is a duck still beyond ' + INCOMING_RANGE + ' m');
      t.equal(JSON.stringify(warn([soap(-12, 0, 'at')])), '["soap@12"]', 'a soap sliding at the player');
      t.equal(JSON.stringify(warn([soap(-12, 0, 'miss')])), '[]', 'a soap that will pass 8 m to one side is not');
      t.equal(JSON.stringify(warn([{ ...soap(-12, 0, 'at'), owner: me.id }])), '[]', "the player's own soap is not");
      t.equal(JSON.stringify(warn([soap(-12, 0, 'at', 2)])), '[]', 'a soap lying still is not (it is on the road to be seen)');
      t.equal(JSON.stringify(warn([soap(-8, 0, 'at'), duck(-20, 0, me.id)])), '["soap@8","duck@20"]', 'the nearest comes first');
      // as a step runs: one event for the object, none for the same object on the next step, and the side it comes from
      r.items.live = [duck(-18, 0, me.id)]; me.events.length = 0;
      stepRace(r, tr, [], DT);
      const ev = me.events.filter((e) => e.type === 'incoming');
      t.expect(ev.length === 1 && ev[0].by === 'duck' && Math.abs(ev[0].side) < 0.3, 'one warning, from behind: ' + JSON.stringify(ev));
      stepRace(r, tr, [], DT);
      t.equal(me.events.filter((e) => e.type === 'incoming').length, 0, 'the same duck does not warn twice');
      r.items.live = [soap(-12, 6, 'at')]; me.warnT = -9; me.events.length = 0;
      stepRace(r, tr, [], DT);
      const side = me.events.filter((e) => e.type === 'incoming');
      t.expect(side.length === 1 && side[0].side > 0.3, 'a soap from the right says so: ' + JSON.stringify(side));
      // two objects in the same moment are one warning
      r.items.live = [soap(-12, 0, 'at'), duck(-20, 0, me.id)]; me.warnT = -9; me.events.length = 0;
      stepRace(r, tr, [], DT);
      t.equal(me.events.filter((e) => e.type === 'incoming').length, 1, 'two at once are one warning');
    },
  },
  {
    name: 'council E S1-14: a chevron shows on the edge a threat comes from (flipped when the picture is mirrored) and goes when it is gone',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await profile(t);
      await t.game('newGame', { seed: 12, paused: true });
      await t.game('act', 'skipCountdown');
      const put = (along, side, kind) => t.page.evaluate(([al, sd, kd]) => {
        const A = window.TR_APP.App, r = A.race, me = r.karts[r.player], fx = Math.sin(me.yaw), fz = Math.cos(me.yaw), rx = -fz, rz = fx;
        const x = me.x + fx * al + rx * sd, z = me.z + fz * al + rz * sd, dx = me.x - x, dz = me.z - z, l = Math.hypot(dx, dz) || 1;
        r.items.live = kd === 'duck' ? [{ id: 700, type: 'duck', owner: 3, target: me.id, x, z, y: me.y, t: 5, ttl: 9, s: me.s - al, d: me.d, v: 30 }]
          : kd === 'none' ? [] : [{ id: 700, type: 'soap', owner: 3, x, z, y: me.y, vx: (dx / l) * 20, vz: (dz / l) * 20, t: 5, ttl: 9, s: me.s, bounces: 0 }];
      }, [along, side, kind]);
      const edge = async () => { await t.waitFrames(3); return t.page.evaluate(() => { const e = document.querySelector('.hud-warn'); const r = e.getBoundingClientRect(); return { hidden: e.hidden, edge: e.dataset.edge, x: r.x, y: r.y, w: r.width, h: r.height, vw: innerWidth, vh: innerHeight }; }); };
      let e = await edge();
      t.expect(e.hidden && e.edge === '', 'no warning when nothing is coming');
      await put(-15, 0, 'duck'); e = await edge();
      t.expect(!e.hidden && e.edge === 'behind' && e.y > e.vh * 0.7, 'a duck behind: the bottom edge ' + JSON.stringify(e));
      await shot(t, 'S1-14', 'behind');
      t.expect(/INCOMING/.test(await t.page.locator('.hud-warn').innerText()), 'it says INCOMING');
      await put(-3, 12, 'soap'); e = await edge();
      t.expect(e.edge === 'right' && e.x > e.vw * 0.5, 'a soap from the right: the right edge ' + JSON.stringify(e));
      await shot(t, 'S1-14', 'right');
      await put(-3, -12, 'soap'); e = await edge();
      t.expect(e.edge === 'left' && e.x < e.vw * 0.5, 'from the left: the left edge');
      await put(14, 0, 'soap'); e = await edge();
      t.expect(e.edge === 'ahead' && e.y < e.vh * 0.3, 'a soap coming back at the player from ahead: the top edge ' + JSON.stringify(e));
      await shot(t, 'S1-14', 'ahead');
      await t.page.evaluate(() => window.TR_APP.App.hud.setMirror(true));
      await put(-3, 12, 'soap'); e = await edge();
      t.equal(e.edge, 'left', 'a mirrored race flips the sides');
      await t.page.evaluate(() => window.TR_APP.App.hud.setMirror(false));
      await t.checkLayout();
      await put(0, 0, 'none'); e = await edge();
      t.expect(e.hidden, 'the chevron goes when nothing is coming');
    },
  },
  {
    name: 'council E S1-14: with Reduced motion the chevrons hold still',
    viewports: ['desktop'],
    async run(t) {
      await profile(t, { reducedMotion: true });
      await t.game('newGame', { seed: 12, paused: true });
      await t.game('act', 'skipCountdown');
      await t.page.evaluate(() => { const r = window.TR_APP.App.race, me = r.karts[r.player]; r.items.live = [{ id: 700, type: 'duck', owner: 3, target: me.id, x: me.x - Math.sin(me.yaw) * 15, z: me.z - Math.cos(me.yaw) * 15, y: me.y, t: 5, ttl: 9, s: me.s - 15, d: me.d, v: 30 }]; });
      await t.waitFrames(4);
      t.equal(await t.page.evaluate(() => getComputedStyle(document.querySelector('.hud-warn i')).animationName), 'none', 'no pulsing');
    },
  },
  {
    name: 'council E S5-21: the incoming alert is a panned cue, 5 gallons ticks twice once, an empty tub thunks, a fall whistles',
    viewports: ['desktop'],
    async run(t) {
      await profile(t);
      await unlock(t);
      await t.game('newGame', { seed: 12, paused: true });
      await t.game('act', 'skipCountdown');
      const cues = async () => (await t.state()).audio.cues;
      let n = (await cues()).length;
      await t.game('act', 'event', { type: 'incoming', by: 'duck', side: -0.8, dist: 20 });
      let c = (await cues()).slice(n);
      t.expect(c.length === 1 && /^alert@-0\.56/.test(c[0]), 'the alert comes from the left: ' + c);
      n = (await cues()).length;
      await t.game('act', 'event', { type: 'incoming', by: 'soap', side: 0.5, dist: 12 });
      c = (await cues()).slice(n);
      t.expect(c.length === 1 && /^alert@0\.35/.test(c[0]), 'and from the right: ' + c);
      n = (await cues()).length;
      await t.game('act', 'water', 6.5); await t.game('step', 2);
      t.equal((await cues()).slice(n).filter((x) => x === 'low').length, 0, 'above 5 gallons: no tick');
      await t.game('act', 'water', 4.9); await t.game('step', 2);
      await t.game('step', 2);
      t.equal((await cues()).slice(n).filter((x) => x === 'low').length, 1, 'at 5 gallons: the double tick, once');
      n = (await cues()).length;
      await t.game('act', 'water', 0); await t.game('step', 2);
      c = (await cues()).slice(n);
      t.expect(c.includes('dry'), 'bone dry thunks: ' + c);
      n = (await cues()).length;
      await t.game('act', 'event', { type: 'fall' });
      t.expect((await cues()).slice(n).includes('fall'), 'a fall has its own cue');
    },
  },
  {
    name: 'council E S5-21: the new cues sit in the cue range (median of 9, one repeat may be 1.5 dB out) and stay under 0.95 at the maximum volume',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      for (const c of ['alert', 'low', 'dry', 'fall']) {
        const p = [];
        for (let i = 0; i < 9; i++) p.push((await render(t, 'cue:' + c, 2)).peak);
        const med = median(p);
        t.expect(med >= 0.2 && med <= 0.45, c + ' median peak ' + med + ': ' + p.join(', '));
        t.expect(p.filter((x) => x < 0.2 / 1.19 || x > 0.45 * 1.19).length <= 1, c + ' has more than one repeat 1.5 dB outside: ' + p.join(', '));
        const loud = [];
        for (let i = 0; i < 20; i++) loud.push((await render(t, 'cue:' + c, 2, false, [], 1)).peak);
        t.expect(Math.max(...loud) < 0.95, c + ' at the maximum volume peaks ' + Math.max(...loud));
      }
    },
  },
  // ---------------------------------------------------------------- S5-06
  {
    name: 'council E S5-06: a new record on the results card plays the record jingle, and a run that sets none does not',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      await t.page.evaluate((k) => localStorage.removeItem(k), KEY);
      await t.reload(); await unlock(t);
      const run = async () => {
        await t.game('newGame', { track: 'bathhouse-row', team: 'steam-rangers', mode: 'timetrial', classId: 'scald', count: 1, paused: true, autoplay: true, seed: 4 });
        await t.game('act', 'skipCountdown');
        const n = (await t.state()).audio.cues.length;
        await t.stepUntil((st) => st.race && st.race.phase === 'done', { max: 60 * 400, chunk: 600, label: 'race finished' });
        await t.page.waitForFunction(() => document.body.dataset.screen === 'results', null, { timeout: 8000 });
        await t.waitFrames(3);
        return { cues: (await t.state()).audio.cues, n };
      };
      let r = await run();
      t.expect(r.cues.slice(r.n).includes('record'), 'the first run is a new best and plays the jingle: ' + r.cues.slice(r.n));
      await t.game('scene', 'title'); await t.waitFrames(3);
      r = await run();
      t.expect(!r.cues.slice(r.n).includes('record'), 'the same run again beats nothing and stays quiet: ' + r.cues.slice(r.n));
    },
  },
  {
    name: 'council E S5-06: the trophy chimes when the cup opens something new, and not when it opens nothing',
    viewports: ['desktop'],
    async run(t) {
      const trophy = async (place) => {
        await t.waitIdle(8000);
        await setSave(t, { ...DEFAULT_SAVE(), settings: { ...DEFAULT_SAVE().settings, seenIntro: true } });
        await t.reload(); await unlock(t);
        await t.game('scene', 'title'); await t.waitFrames(3);
        await t.game('act', 'menu', 'gp'); await t.game('act', 'menu', 'teamOk'); await t.game('act', 'menu', 'cls', { id: 'soak' }); await t.waitFrames(3);
        await t.game('act', 'menu', 'cup', { id: 'bathhouse' });
        await t.waitIdle(15000);
        const field = await t.state();
        const teams = field.race.karts.map((k) => k.team), me = teams[field.race.player];
        await t.page.evaluate(([p, ids, who]) => {
          const order = ids.filter((x) => x !== who);
          order.splice(p - 1, 0, who);
          window.TR_APP.App.gp.table = Object.fromEntries(order.map((id, i) => [id, { team: id, points: 90 - i * 10, clean: 0, human: id === who, bribes: 0 }]));
        }, [place, teams, me]);
        const n = (await t.state()).audio.cues.length;
        await t.game('act', 'menu', 'trophy');
        await t.page.waitForFunction(() => document.body.dataset.screen === 'trophy', null, { timeout: 5000 });
        await t.waitFrames(3);
        return { cues: (await t.state()).audio.cues.slice(n), notes: await t.page.locator('.panel .unlock').count() };
      };
      let r = await trophy(1);
      t.expect(r.notes >= 1, 'a gold cup on a new profile opens something: ' + r.notes);
      t.expect(r.cues.includes('trophy:1') && r.cues.includes('unlock'), 'the fanfare and then the chime: ' + r.cues);
      t.expect(r.cues.indexOf('trophy:1') < r.cues.indexOf('unlock'), 'in that order');
      await shot(t, 'S5-06', 'trophy-unlock');
      await t.checkLayout({ allowScrollY: true });
      r = await trophy(8);
      t.equal(r.notes, 0, 'last place opens nothing');
      t.expect(r.cues.includes('trophy:8') && !r.cues.includes('unlock'), 'so there is no chime: ' + r.cues);
    },
  },
  {
    name: 'council E S5-06: the record jingle and the unlock chime sit in the cue range (median of 9) and stay under 0.95 at the maximum volume',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      for (const c of ['record', 'unlock']) {
        const p = [];
        for (let i = 0; i < 9; i++) p.push((await render(t, 'cue:' + c, 3)).peak);
        const med = median(p);
        t.expect(med >= 0.2 && med <= 0.45, c + ' median peak ' + med + ': ' + p.join(', '));
        t.expect(p.filter((x) => x < 0.2 / 1.19 || x > 0.45 * 1.19).length <= 1, c + ' has more than one repeat 1.5 dB outside: ' + p.join(', '));
        const loud = [];
        for (let i = 0; i < 20; i++) loud.push((await render(t, 'cue:' + c, 3, false, [], 1)).peak);
        t.expect(Math.max(...loud) < 0.95, c + ' at the maximum volume peaks ' + Math.max(...loud));
      }
    },
  },
  // ---------------------------------------------------------------- S5-18
  {
    name: 'council E S5-18: the boost whoosh and the water wash are continuous voices that follow the boost, the spill and how full the tub is, and are silent in the air',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      const level = async (a, vol) => { const r = await render(t, 'loop:tub', 6, false, [a], vol); return { peak: r.peak, rms: r.secs[5] }; }; // steady state: the last second
      const cruise = await level({}), boost = await level({ boostT: 1 }), slosh = await level({ spillFx: 1 }), calm = await level({ spillFx: 0.3 });
      const empty = await level({ gal: 2, spillFx: 0.3 }), air = await level({ air: true, boostT: 0, spillFx: 1 }), both = await level({ boostT: 1, spillFx: 1 });
      t.expect(boost.rms > cruise.rms * 6, 'a boost is clearly louder than cruising: ' + boost.rms + ' against ' + cruise.rms);
      t.expect(slosh.rms > calm.rms * 1.5 && calm.rms > cruise.rms * 3, 'the wash grows with the spill: ' + [cruise.rms, calm.rms, slosh.rms]);
      t.expect(empty.rms < calm.rms / 5, 'a nearly empty tub has almost no wash: ' + empty.rms + ' against ' + calm.rms);
      t.expect(air.peak === 0, 'nothing in the air: ' + air.peak);
      t.expect(boost.peak < 0.13 && slosh.peak < 0.13 && both.peak < 0.2, 'both voices sit under the cues: ' + [boost.peak, slosh.peak, both.peak]);
      t.expect((await level({ boostT: 1, spillFx: 1 }, 1)).peak < 0.95, 'and do not clip at the maximum volume');
    },
  },
  {
    name: 'council E S5-18: in a race the voices follow the tub: a boost, a jump, an empty tub',
    viewports: ['desktop'],
    async run(t) {
      await profile(t);
      await unlock(t);
      await t.game('newGame', { seed: 12, paused: true });
      await t.game('act', 'skipCountdown');
      const frame = async (patch) => {
        // one evaluate: the game's own frame also runs the voices (paused, so silent) and would overwrite what we read
        return t.page.evaluate((p) => { const g = window.__game, r = window.TR_APP.App.race, k = r.karts[r.player]; Object.assign(k, p.k); Object.assign(k.water, p.w); g.act('audioFrame', 1 / 60); return g.getState().audio.tub; }, patch);
      };
      let a = await frame({ k: { vf: 14, air: false, boostT: 0 }, w: { gal: 30, spillFx: 0.2 } });
      t.expect(!a.air && a.boost === 0 && a.slosh > 0.1, 'cruising with water: wash only ' + JSON.stringify(a));
      a = await frame({ k: { boostT: 0.8 }, w: {} });
      t.expect(a.boost === 1, 'a boost: the whoosh is on ' + JSON.stringify(a));
      a = await frame({ k: { boostT: 0.1, air: true }, w: { spillFx: 1 } });
      t.expect(a.air && a.slosh === 0 && a.boost > 0 && a.boost < 0.5, 'in the air the wash stops and the whoosh is dying away ' + JSON.stringify(a));
      a = await frame({ k: { boostT: 0, air: false }, w: { gal: 0.5 } });
      t.expect(!a.air && a.boost === 0 && a.slosh < 0.05, 'an empty tub hardly washes ' + JSON.stringify(a));
    },
  },
];
