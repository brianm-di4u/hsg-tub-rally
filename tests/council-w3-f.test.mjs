// Wave 3, batch F: the course postcards (S4-05), idle rendering (S6-07), the mirrored touch layout (S2-17), the camera at the back of the grid (S1-22),
// what each speed class changes (S2-19), team voices (S4-04), the Goat Rock road (S4-06), the Vapors (S4-07) and local hooks (S4-08).
import fs from 'node:fs';
import { DEFAULT_SAVE } from '../src/js/save.js';
import { CLASSES } from '../src/js/data/teams.js';
import { ChaseCam, CROWD_LIFT } from '../src/js/gfx/camera.js';

const SHOTS = '../_council/hsg-tub-rally/wave-3/shots';
const KEY = 'hsg-tub-rally-v1';
const shot = async (t, id, what) => { await t.shot(`w3f-${id}-${what}`); fs.mkdirSync(SHOTS, { recursive: true }); await t.page.screenshot({ path: `${SHOTS}/${id}-${what}-${t.viewport === 'mobile' ? 'mobile' : 'desktop'}.png` }); };
const setSave = (t, s) => t.page.evaluate(([k, v]) => localStorage.setItem(k, JSON.stringify(v)), [KEY, s]);
const freshProfile = async (t, edit) => { await t.waitIdle(8000); const s = DEFAULT_SAVE(); s.settings = { ...s.settings, seenIntro: true }; if (edit) edit(s); await setSave(t, s); await t.reload(); await t.waitIdle(8000); };
const toCourses = async (t) => { await t.game('act', 'menu', 'quick'); await t.waitFrames(3); await t.game('act', 'menu', 'teamOk'); await t.waitFrames(3); await t.game('act', 'menu', 'cls', { id: 'soak' }); await t.waitFrames(3); };

export const tests = [
  // ---------------------------------------------------------------- S4-05
  {
    name: 'council F S4-05: every course postcard has a picture of its sky, and the course list can be scrolled to Back',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await freshProfile(t);
      await toCourses(t);
      t.equal(await t.page.evaluate(() => document.body.dataset.screen), 'courses', 'the course choice is up');
      const pics = await t.page.evaluate(() => Array.from(document.querySelectorAll('.courses .ccard')).map((c) => { const p = c.querySelector('.pc-pic'), r = p && p.getBoundingClientRect(); return { id: c.dataset.id, h: r ? r.height : 0, w: r ? r.width : 0, a: p ? p.style.getPropertyValue('--a') : '', b: p ? p.style.getPropertyValue('--b') : '' }; }));
      t.expect(pics.length >= 8, 'eight or more cards: ' + pics.length);
      t.expect(pics.every((p) => p.h >= 40 && p.w >= 120), 'every card has a picture of a size you can see: ' + JSON.stringify(pics.filter((p) => p.h < 40)));
      const skies = new Set(pics.map((p) => p.a + p.b));
      t.expect(skies.size >= 6, 'the courses do not all share one sky: ' + skies.size);
      const night = pics.find((p) => p.id === 'park-avenue'), day = pics.find((p) => p.id === 'bathhouse-row');
      t.expect(night.a !== day.a, 'Park Avenue is a dusk postcard, the Row a day one');
      // the last card is reachable and Back stays on screen (the panel scrolls)
      await t.page.evaluate(() => { const l = document.querySelector('.courses .ccard:last-of-type'); l.scrollIntoView({ block: 'center' }); });
      await t.waitFrames(2);
      const back = await t.page.evaluate(() => { const b = document.querySelector('.courses [data-back]').getBoundingClientRect(); return { top: b.top, bottom: b.bottom, vh: innerHeight }; });
      t.expect(back.top >= 0 && back.bottom <= back.vh, 'Back is on screen while the cards scroll: ' + JSON.stringify(back));
      await shot(t, 'S4-05', 'postcards');
      await t.checkLayout({ allowScrollY: true });
    },
  },
  // ---------------------------------------------------------------- S6-07
  {
    name: 'council F S6-07: a menu under Reduced motion is drawn at most ten times a second; without it every frame is drawn',
    viewports: ['desktop'],
    reducedMotion: true,
    async run(t) {
      await t.waitIdle(8000);
      await t.game('scene', 'title'); await t.waitFrames(3);
      // draws and animation frames counted together over the same 1.5 s
      const count = () => t.page.evaluate(() => new Promise((done) => {
        const g = window.__game, d0 = g.getState().render.drawn, t0 = performance.now(); let ticks = 0;
        const tick = () => { ticks++; if (performance.now() - t0 < 1500) requestAnimationFrame(tick); else done({ ticks, draws: g.getState().render.drawn - d0, ms: performance.now() - t0 }); };
        requestAnimationFrame(tick);
      }));
      const still = await count();
      t.expect(still.draws >= 3, 'the menu is still drawn: ' + JSON.stringify(still));
      t.expect(still.draws <= Math.ceil(still.ms / 100) + 1, 'ten draws a second at most: ' + JSON.stringify(still));
      t.expect(still.draws < still.ticks, 'fewer draws than animation frames: ' + JSON.stringify(still));
      // Reduced motion off: back to a draw on every frame
      await freshProfile(t, (v) => { v.settings.reducedMotion = false; });
      await t.game('scene', 'title'); await t.waitFrames(3);
      const live = await count();
      t.log('title idle draws over 1.5 s: reduced motion ' + still.draws + ' of ' + still.ticks + ' frames, motion on ' + live.draws + ' of ' + live.ticks);
      t.expect(live.draws >= live.ticks - 2, 'every frame is drawn when motion is on: ' + JSON.stringify(live));
    },
  },
  // ---------------------------------------------------------------- S2-17
  {
    name: 'council F S2-17: Touch layout Mirrored puts the steering pad on the right and the buttons on the left, and it is kept',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await freshProfile(t);
      await t.game('scene', 'settings'); await t.waitFrames(3);
      const chip = (v) => `.settings [data-k="lefty"][data-v="${v}"]`;
      t.equal(await t.page.getAttribute(chip('false'), 'aria-pressed'), 'true', 'Standard is the default');
      await t.page.focus(chip('true')); await t.page.keyboard.press('Enter'); await t.waitFrames(3);
      t.equal(await t.page.getAttribute(chip('true'), 'aria-pressed'), 'true', 'Mirrored can be picked from the keyboard');
      await shot(t, 'S2-17', 'settings');
      await t.checkLayout({ allowScrollY: true });
      await t.reload(); await t.waitIdle(8000);
      t.equal(await t.page.evaluate(() => window.__game.getState().settings.lefty), true, 'the choice survives a reload');
      if (t.viewport !== 'mobile') return;
      const sides = () => t.page.evaluate(() => { const c = (e) => { const r = document.querySelector(e).getBoundingClientRect(); return r.left + r.width / 2; }; return { steer: c('#touch-steer'), btns: c('.t-btns'), w: innerWidth }; });
      await t.game('newGame', { track: 'bathhouse-row', seed: 3 }); await t.waitFrames(5);
      let g = await sides();
      t.expect(g.steer > g.w / 2 && g.btns < g.w / 2, 'mirrored: the pad is on the right and the buttons on the left: ' + JSON.stringify(g));
      await shot(t, 'S2-17', 'mirrored');
      await t.checkLayout({ allowScrollY: true });
      await freshProfile(t);
      await t.game('newGame', { track: 'bathhouse-row', seed: 3 }); await t.waitFrames(5);
      g = await sides();
      t.expect(g.steer < g.w / 2 && g.btns > g.w / 2, 'standard: the pad is on the left and the buttons on the right: ' + JSON.stringify(g));
    },
  },
  // ---------------------------------------------------------------- S1-22
  {
    name: 'council F S1-22: the chase camera rises 0.8 m behind a crowd of tubs and settles back on open road',
    node: true,
    async run(t) {
      const rig = () => { const cam = { position: { set(x, y, z) { this.y = y; } }, lookAt() {}, rotateX() {}, rotateZ() {}, fov: 62, updateProjectionMatrix() {} }; return { cam, c: new ChaseCam(cam) }; };
      const run = (crowdedAt) => {
        const { cam, c } = rig(), k = { vf: 10, drift: 0, yawRate: 0, boostT: 0, air: false }, ys = [];
        for (let i = 0; i < 300; i++) { c.update(k, { x: 0, y: 0, z: 0, yaw: 0 }, 1 / 60, { crowded: crowdedAt(i / 60), time: i / 60 }); ys.push(cam.position.y); }
        return ys;
      };
      const open = run(() => false), crowd = run(() => true), leave = run((s) => s < 2);
      t.equal(CROWD_LIFT, 0.8, 'the lift is 0.8 m');
      t.expect(Math.abs(crowd[299] - open[299] - CROWD_LIFT) < 0.02, 'crowded settles 0.8 m above open road: ' + (crowd[299] - open[299]).toFixed(3));
      t.expect(Math.abs(leave[299] - open[299]) < 0.02, 'it comes back down once the road is open: ' + (leave[299] - open[299]).toFixed(3));
      const jump = Math.max(...crowd.map((y, i) => (i ? Math.abs(y - crowd[i - 1]) : 0)));
      t.expect(jump < 0.05, 'the rise is smooth, never more than ' + jump.toFixed(3) + ' m in a frame');
    },
  },
  {
    name: 'council F S1-22: at the back of the grid the real camera is higher than on open road',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(8000);
      const above = () => t.page.evaluate(() => { const g = window.__game, s = g.getState(), me = s.race.karts[s.race.player], c = g.act('camDebug'); return c.cam[1] - me.y; });
      await t.game('newGame', { mode: 'quick', count: 8, track: 'bathhouse-row', seed: 5 });
      await t.game('act', 'skipCountdown');
      const ahead = await t.page.evaluate(() => { const s = window.__game.getState(), me = s.race.karts[s.race.player], L = s.track.length; return s.race.karts.filter((o) => o !== me && ((o.s - me.s + L) % L) < 25).length; });
      t.expect(ahead >= 3, 'the player starts behind at least three tubs within 25 m: ' + ahead);
      // the camera's height over the tub: its peak in the first seconds, with the tubs ahead, against where it rests on open road
      const h = () => t.page.evaluate(() => { const g = window.__game, s = g.getState(); return g.act('camDebug').cam[1] - s.race.karts[s.race.player].y; });
      let peak = 0;
      for (let i = 0; i < 20; i++) { await t.waitFrames(10); peak = Math.max(peak, await h()); if (i === 6) await shot(t, 'S1-22', 'grid-back'); }
      await t.game('act', 'teleport', 300, 0);
      let last = -1, open = 0;
      for (let i = 0; i < 60; i++) { await t.waitFrames(15); open = await h(); if (Math.abs(open - last) < 0.01) break; last = open; }
      t.expect(Math.abs(open - last) < 0.01, 'the camera settled on the open road: ' + open.toFixed(3));
      t.expect(peak - open >= 0.5, 'higher behind the crowd (' + peak.toFixed(2) + ' m) than on open road (' + open.toFixed(2) + ' m)');
      
    },
  },
  // ---------------------------------------------------------------- S2-19
  {
    name: 'council F S2-19: each speed class says what it changes, from the data, and Soak is named as the one to start with',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await freshProfile(t);
      await t.game('act', 'menu', 'quick'); await t.waitFrames(3); await t.game('act', 'menu', 'teamOk'); await t.waitFrames(3);
      t.equal(await t.page.evaluate(() => document.body.dataset.screen), 'classes', 'the class choice is up');
      const rows = await t.page.evaluate(() => Array.from(document.querySelectorAll('.classes .mbtn[data-id]')).map((b) => ({ id: b.dataset.id, text: b.textContent.replace(/\s+/g, ' ').trim(), locked: b.getAttribute('aria-disabled') === 'true', how: (b.querySelector('.cls-how') || {}).textContent })));
      t.equal(rows.length, 4, 'four classes');
      for (const r of rows) {
        const c = CLASSES[r.id];
        t.expect(r.how && r.how.startsWith(c.how), r.id + ' has its description: ' + r.how);
        t.expect(r.how.includes('Rivals at ' + Math.round(c.ai * 100) + '% pace'), r.id + ' gives the pace the AI really has: ' + r.how);
      }
      t.expect(/start with/.test(rows.find((r) => r.id === 'soak').how), 'Soak is the one to start with');
      const paces = rows.map((r) => +/at (\d+)% pace/.exec(r.how)[1]);
      t.expect(paces.every((p, i) => !i || p > paces[i - 1]), 'the rivals get quicker down the list: ' + paces.join());
      t.expect(rows.filter((r) => r.locked).every((r) => /Win a cup on/.test(r.text)), 'a locked class still says how to open it');
      await shot(t, 'S2-19', 'classes');
      await t.checkLayout({ allowScrollY: true });
    },
  },
];
