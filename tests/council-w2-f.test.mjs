// Wave 2, batch F: S4-01 (finish ceremony, podium, banner by place).
// assets/finale.js does both; main.js hands it the game in window.TR_APP. The simulation is untouched, so these
// tests drive the browser: a paused autoplay race, stepped to the line, with the review clock moved by hand.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = '../_council/hsg-tub-rally/wave-2/shots';
const KEY = 'hsg-tub-rally-v1';
const shot = async (t, name, opt) => { await t.shot(name, opt); fs.mkdirSync(SHOTS, { recursive: true }); await t.page.screenshot({ path: `${SHOTS}/${name}-${t.viewport}.png` }); };
const FIN = () => window.TR_FINALE.state();
const fin = (t) => t.page.evaluate(FIN);
const me = (st) => st.race.karts[st.race.player];
const humanDone = (st) => !!(st.race && st.race.player >= 0 && st.race.karts[st.race.player].finished);
const raceDone = (st) => !!(st.race && st.race.phase === 'done');
const tierOf = (t) => t.page.evaluate(() => TR_APP.App.tier);
const start = async (t, o = {}) => {
  await t.waitIdle(8000);
  await t.game('newGame', { track: 'bathhouse-row', team: 'engine-six', classId: 'soak', laps: 1, seed: 4, autoplay: true, paused: true, ...o });
  await t.game('act', 'clock', 0);
};
const toLine = (t) => t.stepUntil(humanDone, { max: 60 * 240, chunk: 10, label: 'player over the line' });
const toDone = (t) => t.stepUntil(raceDone, { max: 60 * 300, chunk: 300, label: 'race done' });
// move the frozen review clock forward by ms in 50 ms frames (the ceremony and the podium run on it)
const advance = async (t, ms) => { for (let i = 0; i < ms / 50; i++) { await t.game('act', 'clock', (await t.page.evaluate(() => TR_APP.App.clock * 1000)) + 50); await t.waitFrames(1); } };
const cam = (t) => t.page.evaluate(() => { const c = TR_APP.App.renderer.camera, r = TR_APP.App.race, k = r.karts[r.player]; return { x: c.position.x, y: c.position.y, z: c.position.z, kx: k.x, kz: k.z, yaw: k.yaw }; });
// how far round the tub the camera is: +1 straight ahead of it, -1 straight behind
const ahead = (c) => { const dx = c.x - c.kx, dz = c.z - c.kz, l = Math.hypot(dx, dz) || 1; return (dx * Math.sin(c.yaw) + dz * Math.cos(c.yaw)) / l; };

export const tests = [
  // ---------------------------------------------------------------- S4-01
  {
    name: 'council F S4-01: crossing the line swings the camera round the tub through a confetti burst, then hands back to the chase view',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await start(t);
      let st = await toLine(t);
      await t.waitFrames(3);
      let f = await fin(t);
      t.expect(f.ceremony && f.ceremony.place >= 1, 'the ceremony starts the moment the player finishes (place ' + (f.ceremony && f.ceremony.place) + ')');
      t.equal(f.ceremony.place, st.race.karts.length && (await t.game('getState')).race.karts.filter((k) => k.finished && k.finishT <= me(st).finishT).length, 'it knows the place the player took');
      t.expect(f.ceremony.beads >= (f.ceremony.place <= 3 ? 8 : 2), `a burst of confetti goes up (${f.ceremony.beads} beads for place ${f.ceremony.place})`);
      t.expect(await t.game('act', 'fxCount') > 0, 'and is in the air');
      t.expect(!f.dead, 'the finale code is running');
      const c0 = await cam(t);
      t.expect(ahead(c0) < 0.2, `at the line the camera is still behind the tub (${ahead(c0).toFixed(2)})`);
      await advance(t, 1900);
      const c1 = await cam(t);
      t.expect(Math.hypot(c1.x - c1.kx, c1.z - c1.kz) < 11, 'mid-orbit the camera is close round the tub');
      t.expect(ahead(c1) > ahead(c0) + 0.5, `and has swung round toward its front (${ahead(c0).toFixed(2)} to ${ahead(c1).toFixed(2)})`);
      await shot(t, 'S4-01-orbit');
      await advance(t, 2600);
      const c2 = await cam(t);
      t.expect(ahead(c2) < 0.2, `after the orbit it is back behind the tub (${ahead(c2).toFixed(2)})`);
    },
  },
  {
    name: 'council F S4-01: with reduced motion the camera does not orbit and the burst is small',
    reducedMotion: true,
    viewports: ['desktop'],
    async run(t) {
      await start(t);
      await toLine(t);
      await t.waitFrames(3);
      const n = (await fin(t)).ceremony.beads;
      t.expect(n > 0 && n <= 8, `a small, brief burst (${n} beads)`);
      await advance(t, 1900);
      const c = await cam(t);
      t.expect(ahead(c) < 0.2, 'the camera stays behind the tub');
      t.expect((await fin(t)).ceremony.place >= 1, 'the ceremony state is still kept');
    },
  },
  {
    name: 'council F S4-01: the results banner follows the place, and the dialog says it for screen readers',
    viewports: ['desktop'],
    async run(t) {
      await start(t);
      await toDone(t);
      await t.waitFrames(3);
      const teams = (await t.state()).race.results.map((r) => r.team);
      const rows = (place) => [1, 2, 3, 4, 5, 6, 7, 8].map((p) => ({ place: p, kart: p, team: teams[p - 1], human: p === place, time: 100 + p, gal: 20, clean: false, points: 0 }));
      const show = (place, mode) => t.page.evaluate(([r, m]) => { TR_APP.App.screens.show('results', { results: r, laps: 1, trackName: 'Bathhouse Row', mode: m }); const c = document.querySelector('.panel.results canvas'); return { pixel: c.dataset.pixel, aria: document.querySelector('.panel.results').getAttribute('aria-label') }; }, [rows(place), mode]);
      let o = await show(1, 'quick'); t.equal(o.pixel, 'WINNER!', 'first place is WINNER!'); t.expect(/You won/.test(o.aria), 'announced: ' + o.aria);
      o = await show(2, 'quick'); t.equal(o.pixel, 'PODIUM FINISH', 'second is a podium finish');
      o = await show(3, 'gp'); t.equal(o.pixel, 'PODIUM FINISH', 'third is a podium finish');
      o = await show(4, 'quick'); t.equal(o.pixel, 'GOOD EFFORT', 'fourth is GOOD EFFORT'); t.expect(/good effort/.test(o.aria), 'announced: ' + o.aria);
      o = await show(8, 'quick'); t.equal(o.pixel, 'GOOD EFFORT', 'eighth is GOOD EFFORT');
      o = await show(0, 'quick'); t.equal(o.pixel, 'RESULTS', 'no player in the results: plain RESULTS');
      o = await show(1, 'timetrial'); t.equal(o.pixel, 'RESULTS', 'Time Trial keeps its own results heading');
    },
  },
  {
    name: 'council F S4-01: the results open over a podium of the top three tubs, clear of the panel, and it goes when the screen does',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await start(t);
      await toDone(t);
      await advance(t, 1600);
      let st = await t.state();
      t.equal(st.screen, 'results', 'the results screen is up');
      const f = await fin(t);
      t.expect(f.podium, 'a podium is built');
      t.equal(JSON.stringify(f.podium.teams), JSON.stringify(st.race.results.slice(0, 3).map((r) => r.team)), 'it holds the top three tubs in finishing order');
      t.equal(await t.page.evaluate(() => document.body.dataset.podium), '1', 'the page knows (the panel steps aside)');
      const hidden = await t.page.evaluate(() => TR_APP.App.views.every((v) => !v.mesh.visible));
      t.expect(hidden, 'the race\'s own tubs are out of the picture');
      // where the three tubs land on screen, against the panel
      const hit = await t.page.evaluate(() => { const P = document.querySelector('.panel.results').getBoundingClientRect(); return { P: { l: P.left, t: P.top, r: P.right, b: P.bottom }, W: innerWidth, H: innerHeight, kids: TR_APP.App.renderer.scene.children.find((o) => o.name === 'podium').children.length }; });
      t.expect(hit.kids >= 12, `the podium group has its blocks, numbers and tubs (${hit.kids} parts)`);
      const pts = await t.page.evaluate(() => {
        const A = TR_APP.App, cam = A.renderer.camera, g = A.renderer.scene.children.find((o) => o.name === 'podium'), out = [];
        cam.updateMatrixWorld(); cam.updateProjectionMatrix();
        const V = cam.position.constructor;
        for (const m of g.children) {
          if (!m.isMesh || m.userData.caster !== true) continue; // the tubs
          const mt = m.matrix.elements, v = new V(mt[12], mt[13] + 1.4, mt[14]).project(cam);
          out.push({ x: (v.x * 0.5 + 0.5) * innerWidth, y: (0.5 - v.y * 0.5) * innerHeight });
        }
        return out;
      });
      t.expect(pts.length === 3, 'three tubs are placed (' + pts.length + ')');
      for (const p of pts) {
        t.expect(p.x > 0 && p.x < hit.W && p.y > 0 && p.y < hit.H, `a tub is inside the picture (${p.x.toFixed(0)}, ${p.y.toFixed(0)})`);
        const under = p.x > hit.P.l && p.x < hit.P.r && p.y > hit.P.t && p.y < hit.P.b;
        t.expect(!under, 'and not behind the results panel');
      }
      await shot(t, 'S4-01-podium');
      await t.game('act', 'menu', 'quit'); await t.waitFrames(3);
      t.equal((await fin(t)).podium, null, 'leaving the screen takes the podium away');
      t.equal(await t.page.evaluate(() => document.body.dataset.podium || ''), '', 'and the panel goes back to the middle');
    },
  },
  {
    name: 'council F S4-01: a one-tub Time Trial gets no podium, and the podium goes when another screen opens',
    viewports: ['desktop'],
    async run(t) {
      await start(t, { mode: 'timetrial', count: 1, classId: 'scald' });
      await toDone(t); await advance(t, 600);
      t.equal((await fin(t)).podium, null, 'Time Trial has one tub: no podium');
      await start(t);
      await toDone(t); await advance(t, 600);
      t.expect((await fin(t)).podium, 'a race with eight tubs has one');
      await t.game('act', 'menu', 'settings'); await t.waitFrames(3);
      t.equal((await t.state()).screen, 'settings', 'Settings opens from the results');
      t.equal((await fin(t)).podium, null, 'the podium is gone once another screen is up');
    },
  },
];
