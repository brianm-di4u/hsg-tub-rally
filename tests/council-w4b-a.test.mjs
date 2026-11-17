// Wave 4b, batch A: the clean-up pass (K-02, K-03, K-04, K-06).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { DEFAULT_SAVE } from '../src/js/save.js';
import { TEAMS } from '../src/js/data/teams.js';

const KEY = 'hsg-tub-rally-v1', CUP = 'hsg-tub-rally-cup-v1';
const SHOTS = '../_council/hsg-tub-rally/wave-4b/shots';
const shot = async (t, id, what) => { fs.mkdirSync(SHOTS, { recursive: true }); await t.page.screenshot({ path: `${SHOTS}/${id}-${what}-${t.viewport === 'mobile' ? 'mobile' : 'desktop'}.png` }); };
const fam = (t, sel) => t.page.evaluate((q) => { const e = document.querySelector(q); return e ? getComputedStyle(e).fontFamily : null; }, sel);

export const tests = [
  // ---------------------------------------------------------------- K-02
  {
    name: 'council W4B K-02: sentence-length .sub lines keep the system stack, short ones keep Jost, and nothing overflows',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(8000);
      // the newer-save notice
      await t.page.evaluate(([k, v]) => localStorage.setItem(k, v), [KEY, JSON.stringify({ ...DEFAULT_SAVE(), v: 2 })]);
      await t.reload(); await t.waitIdle(8000);
      await t.page.waitForSelector('[data-save-status]', { timeout: 8000 });
      t.expect(/^"?Trebuchet MS"?/.test(await fam(t, '[data-save-status]')), 'the newer-save notice: ' + await fam(t, '[data-save-status]'));
      await t.checkLayout({ allowScrollY: true });
      await shot(t, 'K-02', 'notice');
      await t.page.evaluate((k) => localStorage.removeItem(k), KEY);
      // the cup question
      const cup = { v: 1, cup: 'bathhouse', name: 'Bathhouse Cup', tracks: ['bathhouse-row', 'park-avenue', 'whittington-valley', 'bridge-street'], round: 1,
        table: { 'engine-six': { team: 'engine-six', points: 20, clean: 1, human: true, bribes: 0 }, 'lather-linen': { team: 'lather-linen', points: 30, clean: 1, bribes: 0 } },
        rivals: ['lather-linen'], team: 'engine-six', classId: 'soak', seed: 5 };
      await t.page.evaluate(([k, v]) => localStorage.setItem(k, v), [CUP, JSON.stringify(cup)]);
      await t.reload(); await t.waitIdle(8000);
      await t.game('act', 'menu', 'gp'); await t.game('act', 'menu', 'teamOk'); await t.game('act', 'menu', 'cls', { id: 'soak' }); await t.waitFrames(3);
      await t.page.locator('[data-act="cup"][data-id="bathhouse"]').click(); await t.waitFrames(3);
      t.equal((await t.state()).screen, 'replaceCup', 'the cup question is shown');
      t.expect(/^"?Trebuchet MS"?/.test(await fam(t, '#rc-msg')), 'the cup question: ' + await fam(t, '#rc-msg'));
      await t.checkLayout({ allowScrollY: true });
      await shot(t, 'K-02', 'cup-question');
      // How to Play's goal line, and a short sub line that stays in Jost
      await t.game('scene', 'title'); await t.waitFrames(2);
      await t.game('act', 'menu', 'help'); await t.waitFrames(3);
      t.expect(/^"?Trebuchet MS"?/.test(await fam(t, '.panel.help .sub')), 'How to Play goal: ' + await fam(t, '.panel.help .sub'));
      await t.checkLayout({ allowScrollY: true });
      await t.game('scene', 'title'); await t.waitFrames(2);
      await t.game('act', 'menu', 'quick'); await t.waitFrames(3);
      await t.game('act', 'menu', 'teamOk'); await t.waitFrames(3);
      t.expect(/^"?Jost"?/.test(await fam(t, '.panel .sub:not(.long)')), 'a short sub line keeps Jost: ' + await fam(t, '.panel .sub:not(.long)'));
    },
  },
];

// ---------------------------------------------------------------- K-03
tests.push({
  name: 'council W4B K-03: no two Credits lines open with the same words, the owner\'s notice is untouched, and the older facts are kept',
  viewports: ['desktop', 'mobile'],
  async run(t) {
    await t.waitIdle(8000);
    await t.game('scene', 'title'); await t.waitFrames(2);
    await t.game('act', 'menu', 'credits'); await t.waitFrames(3);
    const lis = await t.page.evaluate(() => [...document.querySelectorAll('.panel.help li')].map((l) => l.textContent));
    const opens = lis.map((l) => l.split(/\s+/).slice(0, 4).join(' ').toLowerCase());
    t.equal(new Set(opens).size, opens.length, 'every line opens differently: ' + JSON.stringify(opens));
    t.expect(lis.includes('Inspired by the World Championship Running of the Tubs, held each June on Central Avenue. Fictional teams; not affiliated with the event or any business shown.'), 'the owner\'s notice, word for word');
    const facts = lis.find((l) => /Visit Hot Springs/.test(l) && /Stueart Pennington/.test(l) && /Hot Springs, Arkansas/.test(l) && /2006/.test(l));
    t.expect(!!facts, 'the line with Visit Hot Springs, Stueart Pennington, the town and 2006 is still there');
    await t.checkLayout({ allowScrollY: true });
    await shot(t, 'K-03', 'credits');
  },
});

// ---------------------------------------------------------------- K-04
// the room between the last line of the team text and the top of the studs on the pinned buttons, with the panel scrolled to the end
const clearance = (t, id) => t.page.evaluate(async (tid) => {
  document.querySelector('.tcard[data-id="' + tid + '"]').click();
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  const p = document.querySelector('.panel.teams'), info = p.querySelector('.team-info'), btn = p.querySelector(':scope > .menu.row .mbtn');
  p.scrollTop = p.scrollHeight;
  const last = [...info.querySelectorAll('p, h3, .stat-note')].reduce((m, e) => Math.max(m, e.getBoundingClientRect().bottom), 0);
  const stud = parseFloat(getComputedStyle(btn, '::before').height) || 0;
  return { gap: Math.round((btn.getBoundingClientRect().top - stud - last) * 10) / 10, scrolls: p.scrollHeight > p.clientHeight + 1, locked: /unlock/i.test(info.textContent) };
}, id);
const MIN_GAP = 8; // px of clear space between the caption's last line and the top of the studs
tests.push({
  name: 'council W4B K-04: the last line of the team text clears the studs of the pinned buttons by 8 px, for an open and a locked team, on a phone and a desktop',
  viewports: ['desktop', 'mobile'],
  async run(t) {
    await t.waitIdle(8000);
    const sv = DEFAULT_SAVE(); sv.settings.seenIntro = true;
    await t.page.evaluate(([k, v]) => localStorage.setItem(k, JSON.stringify(v)), [KEY, sv]);
    await t.reload(); await t.waitIdle(8000);
    await t.game('scene', 'title'); await t.waitFrames(2);
    await t.game('act', 'menu', 'quick'); await t.waitFrames(3);
    const open = TEAMS.find((x) => x.unlocked).id, lock = TEAMS.find((x) => !x.unlocked).id;
    const sizes = t.viewport === 'mobile' ? [[390, 844], [360, 640], [844, 390], [667, 375]] : [[1280, 800]];
    for (const [w, h] of sizes) {
      await t.page.setViewportSize({ width: w, height: h }); await t.waitFrames(3);
      for (const [what, id] of [['open', open], ['locked', lock]]) {
        const c = await clearance(t, id);
        t.expect(c.gap >= MIN_GAP, w + 'x' + h + ' ' + what + ': ' + c.gap + ' px clear of the studs');
        if (w === 390 || w === 844 || w === 1280) await shot(t, 'K-04', what + '-' + w);
      }
      await t.checkLayout({ allowScrollY: true });
    }
  },
});
