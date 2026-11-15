// Wave 3, batch F: the course postcards (S4-05), idle rendering (S6-07), the mirrored touch layout (S2-17), the camera at the back of the grid (S1-22),
// what each speed class changes (S2-19), team voices (S4-04), the Goat Rock road (S4-06), the Vapors (S4-07) and local hooks (S4-08).
import fs from 'node:fs';
import { DEFAULT_SAVE } from '../src/js/save.js';

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
];
