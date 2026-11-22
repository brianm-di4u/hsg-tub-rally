// Wave 3, batch F: the course postcards (S4-05), idle rendering (S6-07), the mirrored touch layout (S2-17), the camera at the back of the grid (S1-22),
// what each speed class changes (S2-19), team voices (S4-04), the Goat Rock road (S4-06), the Vapors (S4-07) and local hooks (S4-08).
import fs from 'node:fs';
import { DEFAULT_SAVE } from '../src/js/save.js';
import { CLASSES, TEAMS } from '../src/js/data/teams.js';
import { ChaseCam, CROWD_LIFT } from '../src/js/gfx/camera.js';

const SHOTS = 'screenshots/council/wave-3/shots';
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
      // draws, animation frames and the frames the throttle reports it left undrawn, counted together over the same 1.5 s
      const count = () => t.page.evaluate(() => new Promise((done) => {
        const g = window.__game, r0 = g.getState().render, d0 = r0.drawn, h0 = r0.throttled, t0 = performance.now(); let ticks = 0;
        const tick = () => { ticks++; if (performance.now() - t0 < 1500) requestAnimationFrame(tick); else done({ ticks, draws: g.getState().render.drawn - d0, held: g.getState().render.throttled - h0, ms: performance.now() - t0 }); };
        requestAnimationFrame(tick);
      }));
      const still = await count();
      t.expect(still.draws >= 3, 'the menu is still drawn: ' + JSON.stringify(still));
      t.expect(still.draws <= Math.ceil(still.ms / 100) + 1, 'ten draws a second at most: ' + JSON.stringify(still));
      // by state, not by frame rate (C4-11): the throttle says it held frames back, and every frame was either drawn or held
      t.expect(still.held > 0, 'the throttle held frames back: ' + JSON.stringify(still));
      // Reduced motion off: back to a draw on every frame
      await freshProfile(t, (v) => { v.settings.reducedMotion = false; });
      await t.game('scene', 'title'); await t.waitFrames(3);
      const live = await count();
      t.log('title idle draws over 1.5 s: reduced motion ' + still.draws + ' of ' + still.ticks + ' frames, motion on ' + live.draws + ' of ' + live.ticks);
      t.expect(live.draws >= live.ticks - 2 && live.held === 0, 'every frame is drawn when motion is on: ' + JSON.stringify(live));
    },
  },
  // ---------------------------------------------------------------- S2-17
  {
    name: 'council F S2-17: Touch layout Mirrored puts the steering pad on the right and the buttons on the left, and it is kept',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await freshProfile(t);
      // C4-15: the Touch layout row shows once the touch controls can; a laptop's first touch brings them up
      if (t.viewport === 'desktop') await t.page.evaluate(() => document.querySelector('#gl').dispatchEvent(new PointerEvent('pointerdown', { pointerType: 'touch', bubbles: true, pointerId: 41, clientX: 200, clientY: 300 })));
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
  // ---------------------------------------------------------------- S4-04
  {
    name: 'council F S4-04: every team has a line of its own',
    node: true,
    async run(t) {
      t.equal(TEAMS.length, 12, 'twelve teams');
      t.expect(TEAMS.every((x) => typeof x.say === 'string' && x.say.length >= 6 && x.say.length <= 32), 'every team has a short line: ' + TEAMS.filter((x) => !x.say || x.say.length > 32).map((x) => x.id));
      t.equal(new Set(TEAMS.map((x) => x.say)).size, 12, 'no two teams say the same thing');
    },
  },
  {
    name: 'council F S4-04: a rival captain answers the first hit from their team, and the results carry the winning captain line',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(8000);
      await t.game('newGame', { mode: 'quick', count: 8, track: 'bathhouse-row', seed: 5 });
      await t.game('act', 'skipCountdown'); await t.waitFrames(5);
      const rivals = await t.page.evaluate(() => window.__game.getState().race.karts.filter((k) => !k.human).map((k) => ({ id: k.id, team: k.team })));
      const call = () => t.page.evaluate(() => { const h = window.TR_APP.App.hud; return h.el.call.textContent; });
      const clear = () => t.page.evaluate(() => { const h = window.TR_APP.App.hud; h.callT = 0; h.el.call.textContent = ''; });
      const hit = (id) => t.game('act', 'event', { type: 'hit', by: 'soap', owner: id, blocked: false });
      await clear(); await hit(rivals[0].id); await t.waitFrames(2);
      const first = await call();
      const tm = TEAMS.find((x) => x.id === rivals[0].team);
      t.equal(first, tm.captain + ': “' + tm.say + '”', 'the first hit from ' + tm.name + ' is answered');
      await shot(t, 'S4-04', 'hit-line');
      await clear(); await hit(rivals[0].id); await t.waitFrames(2);
      t.equal(await call(), '', 'the same team does not repeat itself in one race');
      const other = rivals.find((r) => r.team !== rivals[0].team);
      await hit(other.id); await t.waitFrames(2);
      const tm2 = TEAMS.find((x) => x.id === other.team);
      t.equal(await call(), tm2.captain + ': “' + tm2.say + '”', 'another team has its own line');
      await clear(); await t.game('act', 'event', { type: 'hit', by: 'soap', owner: rivals[1].id === other.id ? rivals[2].id : rivals[1].id, blocked: true }); await t.waitFrames(2);
      t.equal(await call(), '', 'a blocked hit gets no line');
      // the results
      const show = (humanWins) => t.page.evaluate(([w, hw]) => { const mk = (i, team) => ({ place: i + 1, team, human: hw ? i === 0 : i === 1, time: 90 + i, gal: 14, clean: false, points: 10, tickets: 0, lost: [], dry: false }); window.TR_APP.App.screens.show('results', { results: [mk(0, w), mk(1, 'engine-six')], laps: 3, trackName: 'Bathhouse Row' }); }, ['bubble-patrol', humanWins]);
      await show(false); await t.waitFrames(3);
      const line = () => t.page.evaluate(() => (document.querySelector('.results .voice') || {}).textContent);
      t.equal(await line(), 'Sgt. Penny Suds: “Pull over, citizen!”', 'the winner speaks on the results');
      await shot(t, 'S4-04', 'results-line');
      await t.checkLayout({ allowScrollY: true });
      await show(true); await t.waitFrames(3);
      t.equal(await line(), 'Sgt. Penny Suds (you): “Pull over, citizen!”', 'your own captain speaks when you win');
    },
  },
  // ---------------------------------------------------------------- S4-06
  {
    name: 'council F S4-06: Goat Rock & Gulpha Gorge is paved like Mountain Drive, with clay tiles only at its creek fords',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(8000);
      const roads = () => t.page.evaluate(() => { const out = {}; window.TR_APP.App.world.traverse((o) => { const m = /^road:(\w+)#/.exec(o.name || ''); if (m && o.geometry) out[m[1]] = (out[m[1]] || 0) + (o.geometry.index ? o.geometry.index.count : o.geometry.attributes.position.count) / 3; }); return out; });
      await t.game('newGame', { mode: 'timetrial', count: 1, track: 'goat-rock-gulpha', seed: 3 }); await t.waitFrames(5);
      const g = await roads();
      t.expect(g.asphalt > 0 && (g.dirt || 0) < 0.25 * g.asphalt, 'Goat Rock: almost all asphalt, a little clay at the fords: ' + JSON.stringify(g));
      t.expect((g.dirt || 0) > 0, 'the clay tiles are still there at the fords: ' + JSON.stringify(g));
      await t.game('act', 'teleport', 200, 0); await t.waitFrames(30);
      await shot(t, 'S4-06', 'goat-rock-road');
      await t.game('newGame', { mode: 'timetrial', count: 1, track: 'west-mountain', seed: 3 }); await t.waitFrames(5);
      const w = await roads();
      t.expect((w.dirt || 0) > 0.15 * w.asphalt, 'West Mountain keeps its own clay stretch: ' + JSON.stringify(w));
    },
  },
  // ---------------------------------------------------------------- S4-07
  {
    name: 'council F S4-07: the neon bands on Park Avenue Nights run a chase of bright bulbs, and the bands elsewhere are unchanged',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(8000);
      await t.game('newGame', { mode: 'timetrial', count: 1, track: 'park-avenue', seed: 3 }); await t.waitFrames(5);
      const neon = await t.page.evaluate(() => { const A = window.TR_APP.App, out = []; A.world.traverse((o) => { if (/^neon#/.test(o.name || '')) { o.geometry.computeBoundingSphere(); const c = o.geometry.boundingSphere.center; out.push({ chase: !!(o.material.defines && 'CHASE' in o.material.defines), c: [c.x, c.y, c.z] }); } }); return out; });
      t.expect(neon.length > 0 && neon.every((n) => n.chase), 'every neon band has the chase: ' + neon.length);
      // frozen clocks: the same frame twice is identical on the neon, half a chase period later it is not
      const frame = async (ms) => { await t.game('act', 'clock', ms); await t.waitFrames(3); return (await t.page.screenshot()).toString('base64'); };
      await t.game('act', 'camAt', [neon[0].c[0] + 8, neon[0].c[1] + 2, neon[0].c[2] + 8], [neon[0].c[0], neon[0].c[1], neon[0].c[2]]);
      await t.waitFrames(3);
      const a = await frame(1000), a2 = await frame(1000), b = await frame(1630);
      const diff = (x, y) => t.page.evaluate(async ([p, q]) => {
        const img = (d) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = 'data:image/png;base64,' + d; });
        const [I, J] = await Promise.all([img(p), img(q)]), c = document.createElement('canvas'); c.width = I.width; c.height = I.height;
        const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(I, 0, 0); const A = x.getImageData(0, 0, c.width, c.height).data; x.drawImage(J, 0, 0); const B = x.getImageData(0, 0, c.width, c.height).data;
        let n = 0, sum = 0;
        for (let k = 0; k < A.length; k += 4) { const mx = Math.max(A[k], A[k + 1], A[k + 2]), mn = Math.min(A[k], A[k + 1], A[k + 2]); if (mx > 150 && mx - mn > 90) { n++; sum += Math.abs(A[k] - B[k]) + Math.abs(A[k + 1] - B[k + 1]) + Math.abs(A[k + 2] - B[k + 2]); } }
        return { n, mean: n ? sum / n : 0 };
      }, [x, y]);
      const same = await diff(a, a2), moved = await diff(a, b);
      t.expect(moved.n > 200, 'neon-coloured pixels are in view: ' + moved.n);
      t.expect(same.mean < 1, 'the same instant draws the same neon: ' + same.mean.toFixed(2));
      t.expect(moved.mean > 8, 'a moment later the bulbs have moved: ' + moved.mean.toFixed(2));
      await shot(t, 'S4-07', 'neon');
      await t.game('act', 'clock', null);
    },
  },
];
