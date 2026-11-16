// Wave 4, batch D: Race setup on a phone (C4-14), the art line (C4-02), the course facts (C4-07), the title notice and the
// menu face (S4-10) and the award lines (S4-11).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { FACTS } from '../src/js/data/facts.js';
import { TEAMS } from '../src/js/data/teams.js';

const SHOTS = '../_council/hsg-tub-rally/wave-4/shots';
const shot = async (t, id, what) => { fs.mkdirSync(SHOTS, { recursive: true }); await t.page.screenshot({ path: `${SHOTS}/${id}-${what}-${t.viewport === 'mobile' ? 'mobile' : 'desktop'}.png` }); };
const toCourses = async (t) => {
  await t.game('scene', 'title'); await t.waitFrames(3);
  await t.game('act', 'menu', 'quick'); await t.waitFrames(3);
  await t.game('act', 'menu', 'teamOk'); await t.waitFrames(3);
  await t.game('act', 'menu', 'cls', { id: 'soak' }); await t.waitFrames(3);
};

export const tests = [
  // ---------------------------------------------------------------- C4-14
  {
    name: 'council W4D C4-14: on a phone the Race setup chips fold behind one button and the first course card is on screen',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(8000);
      await toCourses(t);
      const q = () => t.page.evaluate(() => {
        const vis = (e) => { if (!e) return false; const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
        const card = document.querySelector('.courses .ccard'), tog = document.querySelector('.setup-toggle');
        return { chips: vis(document.querySelector('.race-opts .chip')), toggle: vis(tog), expanded: tog && tog.getAttribute('aria-expanded'), label: tog ? tog.textContent : '',
          cardTop: card ? card.getBoundingClientRect().top : 9999, cardBottom: card ? card.getBoundingClientRect().bottom : 0, vh: innerHeight };
      });
      const a = await q();
      if (t.viewport === 'mobile') {
        t.expect(!a.chips && a.toggle && a.expanded === 'false', 'folded on a phone: ' + JSON.stringify(a));
        t.expect(/^Race setup: 3 laps · Items on · 7 rivals$/.test(a.label), 'the button says what is chosen: ' + a.label);
        t.expect(a.cardTop < a.vh * 0.6, 'the first course card starts well above the fold: ' + a.cardTop + ' of ' + a.vh);
        await shot(t, 'C4-14', 'folded');
        await t.page.click('.setup-toggle'); await t.waitFrames(3);
        const b = await q();
        t.expect(b.chips && b.expanded === 'true', 'the button opens the chips: ' + JSON.stringify(b));
        await shot(t, 'C4-14', 'open');
        await t.page.click('.race-opts [data-k="raceLaps"][data-v="5"]'); await t.waitFrames(3);
        const c = await q();
        t.expect(c.chips && /5 laps/.test(c.label), 'a chip still works and the choice shows in the button: ' + c.label);
        t.equal(await t.page.evaluate(() => window.__game.getState().settings.raceLaps), 5, 'and is saved as before');
        await t.page.click('.setup-toggle'); await t.waitFrames(3);
        t.expect(!(await q()).chips, 'it folds again');
        // the chips are reachable from the keyboard through the button
        await t.page.click('.setup-toggle'); await t.waitFrames(3);
        t.expect(await t.page.evaluate(() => document.activeElement === document.querySelector('.setup-toggle')), 'the button keeps the focus when it opens');
      } else {
        t.expect(a.chips && !a.toggle, 'a wide window keeps the chips open as before and shows no button: ' + JSON.stringify(a));
        await shot(t, 'C4-14', 'open');
      }
      await t.checkLayout({ allowScrollY: true });
    },
  },
  // ---------------------------------------------------------------- C4-02
  {
    name: 'council W4D C4-02: Credits say in one plain line that the art was painted with AI image tools',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(8000);
      await t.game('scene', 'title'); await t.waitFrames(2);
      await t.game('act', 'menu', 'credits'); await t.waitFrames(3);
      const line = await t.page.evaluate(() => { const li = [...document.querySelectorAll('.panel li')].find((l) => /^Art:/.test(l.textContent)); if (!li) return null; li.scrollIntoView({ block: 'center' }); const r = li.getBoundingClientRect(), p = li.closest('.panel').getBoundingClientRect(); return { text: li.textContent, inside: r.left >= p.left && r.right <= p.right + 1 && r.top >= 0 && r.bottom <= innerHeight, wide: li.scrollWidth <= li.clientWidth + 1, n: [...document.querySelectorAll('.panel li')].filter((l) => /AI image/.test(l.textContent)).length }; });
      t.expect(!!line && line.text === 'Art: painted with AI image tools for this game.', 'the line: ' + JSON.stringify(line));
      t.expect(line && line.inside && line.wide, 'and it is on screen and not cut off: ' + JSON.stringify(line));
      t.equal(line && line.n, 1, 'it is said once');
      await t.waitFrames(2);
      await shot(t, 'C4-02', 'credits-art');
      await t.checkLayout({ allowScrollY: true });
    },
  },
  // ---------------------------------------------------------------- C4-07
  {
    name: 'council W4D C4-07: the six approved course lines and the changed Vapors line are in, each with a source key the research table holds',
    node: true,
    run() {
      const tc = fs.readFileSync(new URL('../research/town-content.md', import.meta.url), 'utf8');
      const keys = new Set([...tc.slice(tc.indexOf('## 9. Source keys')).matchAll(/^\| `([a-z0-9-]+)` \|/gm)].map((m) => m[1]));
      const want = {
        'park-avenue': [['The Vapors, a club that opened in 1960, stood at 315 Park Avenue.', 'vapors-eoa'], ['Tony Bennett wrote that he first sang "I Left My Heart in San Francisco" at the Vapors, during a rehearsal for a later Fairmont Hotel appearance.', 'vapors-eoa']],
        'bathhouse-row': [['A new jug fountain was installed on the sidewalk in front of the Administration building in 1966.', 'wiki-row'], ['The park provides spring water free of charge at all of its jug fountains.', 'nps-water']],
        'west-mountain': [["From West Mountain's summit the view looks south to the Trap Mountains and Lake Hamilton.", 'nps-overlooks'], ['Carpenter Dam, a concrete gravity dam, was completed in 1931, and Lake Hamilton was created in 1932.', 'wiki-lakeham']],
        event: [['NPS says the bathing industry led to Hot Springs becoming known as the "Great American Spa".', 'nps-history']],
      };
      for (const [id, rows] of Object.entries(want)) for (const [text, src] of rows) {
        const f = FACTS[id].find((x) => x.t === text);
        assert.ok(f, id + ' has: ' + text);
        assert.equal(f.src, src); assert.ok(keys.has(src), src + ' is in section 9 of research/town-content.md');
      }
      assert.ok(!Object.values(FACTS).flat().some((f) => /supper club/.test(f.t)), 'the Vapors is no longer a supper club');
      assert.equal(FACTS['west-mountain'].filter((f) => /summit/.test(f.t) && /Lake Hamilton/.test(f.t)).length, 1, 'one West Mountain summit-view line, not two');
      assert.ok(!Object.values(FACTS).flat().some((f) => /Oaklawn|Owney|Madden|1963|bomb/i.test(f.t)), 'no track, gangster or bombing is named');
    },
  },
  {
    name: 'council W4D C4-07: every course line fits on the pause screen and the first line on each course card',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(8000);
      await t.game('scene', 'title'); await t.waitFrames(2);
      const lines = [...FACTS['park-avenue'], ...FACTS['bathhouse-row'], ...FACTS['west-mountain'], FACTS.event[FACTS.event.length - 1]].map((f) => f.t);
      for (const text of lines) {
        await t.page.evaluate((x) => window.TR_APP.App.screens.show('pause', { fact: { t: x } }), text); await t.waitFrames(2);
        const r = await t.page.evaluate(() => { const p = document.querySelector('.panel.pause .fact-line'), q = document.querySelector('.panel.pause').getBoundingClientRect(), b = p.getBoundingClientRect(); return { text: p.textContent, ok: b.left >= q.left && b.right <= q.right + 1 && b.bottom <= innerHeight && p.scrollWidth <= p.clientWidth + 1 }; });
        t.expect(r.text === text && r.ok, 'on the pause screen: ' + text.slice(0, 40));
      }
      await t.page.evaluate((x) => window.TR_APP.App.screens.show('pause', { fact: { t: x } }), lines[1]); await t.waitFrames(2);
      await shot(t, 'C4-07', 'pause-longest-line');
      await t.checkLayout({ allowScrollY: true });
      await t.game('act', 'menu', 'quick'); await t.waitFrames(3);
      await t.game('act', 'menu', 'teamOk'); await t.waitFrames(3);
      await t.game('act', 'menu', 'cls', { id: 'soak' }); await t.waitFrames(3);
      const card = await t.page.evaluate(() => (document.querySelector('.courses [data-id="park-avenue"] .fact') || {}).textContent);
      t.equal(card, 'The Vapors, a club that opened in 1960, stood at 315 Park Avenue.', 'the Park Avenue card shows the changed Vapors line');
      await t.page.evaluate(() => document.querySelector('.courses [data-id="park-avenue"]').scrollIntoView({ block: 'center' })); await t.waitFrames(2);
      await shot(t, 'C4-07', 'park-avenue-card');
      await t.checkLayout({ allowScrollY: true });
    },
  },
  // ---------------------------------------------------------------- S4-10
  {
    name: 'council W4D S4-10: the title keeps one short line saying it is not affiliated, and Credits hold the full notice word for word',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(8000);
      await t.game('scene', 'title'); await t.waitFrames(3);
      const n = await t.page.evaluate(() => { const p = document.querySelector('.scr-title .title-note'); if (!p) return null; const r = p.getBoundingClientRect(); return { text: p.textContent, lines: Math.round(r.height / parseFloat(getComputedStyle(p).lineHeight)), inside: r.left >= 0 && r.right <= innerWidth && r.bottom <= innerHeight, boxed: getComputedStyle(p).backgroundColor !== 'rgba(0, 0, 0, 0)', fine: !!document.querySelector('.scr-title .fineprint') }; });
      t.expect(!!n && /not affiliated/i.test(n.text) && n.text.length < 100, 'a short line that says it is not affiliated: ' + JSON.stringify(n));
      t.expect(n && n.lines <= 2 && n.inside && !n.boxed && !n.fine, 'two lines at most, on screen, not in a grey box: ' + JSON.stringify(n));
      await shot(t, 'S4-10', 'title');
      await t.checkLayout({ allowScrollY: true });
      await t.game('act', 'menu', 'credits'); await t.waitFrames(3);
      const full = 'Inspired by the World Championship Running of the Tubs, held each June on Central Avenue. Fictional teams; not affiliated with the event or any business shown.';
      const c = await t.page.evaluate(() => [...document.querySelectorAll('.panel li')].map((l) => l.textContent));
      t.expect(c.includes(full), 'Credits hold the old notice word for word');
      t.expect(c.includes('Menu, race and results text: Jost SemiBold, SIL Open Font License.'), 'Credits name the face and its licence');
      await t.checkLayout({ allowScrollY: true });
    },
  },
  {
    name: 'council W4D S4-10: Jost SemiBold sets the menus, the race display and the results, and small print keeps the system stack',
    fileUrl: true,
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(8000);
      await t.game('scene', 'title'); await t.waitFrames(3);
      const fam = (sel) => t.page.evaluate((q) => { const e = document.querySelector(q); return e ? getComputedStyle(e).fontFamily + ' / ' + getComputedStyle(e).fontWeight : null; }, sel);
      t.expect(await t.page.evaluate(async () => { await document.fonts.ready; return document.fonts.check('600 16px Jost') && [...document.fonts].some((f) => f.family.replace(/"/g, '') === 'Jost' && f.status === 'loaded'); }), 'Jost is loaded from file://');
      t.expect(/^"?Jost"?, .*\/ 600$/.test(await fam('.scr-title .mbtn')), 'a menu button: ' + await fam('.scr-title .mbtn'));
      t.expect(/^"?Trebuchet MS"?/.test(await fam('.title-note')), 'the notice keeps the system stack: ' + await fam('.title-note'));
      await t.game('act', 'menu', 'quick'); await t.waitFrames(3);
      t.expect(/^"?Jost"?/.test(await fam('.tcard b')), 'a team card title: ' + await fam('.tcard b'));
      await t.checkLayout({ allowScrollY: true });
      await t.game('act', 'menu', 'teamOk'); await t.waitFrames(3);
      await t.game('act', 'menu', 'cls', { id: 'soak' }); await t.waitFrames(3);
      t.expect(/^"?Jost"?/.test(await fam('.ccard b')) && /^"?Trebuchet MS"?/.test(await fam('.ccard .fact')), 'course title in Jost, its fact line in the system stack');
      await t.checkLayout({ allowScrollY: true });
      await t.game('scene', 'title'); await t.waitFrames(2);
      await t.game('act', 'menu', 'settings'); await t.waitFrames(3);
      t.expect(/^"?Jost"?/.test(await fam('.settings .chip')), 'a Settings chip');
      await shot(t, 'S4-10', 'settings');
      await t.checkLayout({ allowScrollY: true });
      await t.game('scene', 'title'); await t.waitFrames(2);
      await t.game('act', 'menu', 'help'); await t.waitFrames(3);
      t.expect(/^"?Trebuchet MS"?/.test(await fam('.help-cols li, .panel.help li')), 'long paragraphs keep the system stack: ' + await fam('.panel.help li'));
      const ids = TEAMS.map((x) => x.id);
      await t.page.evaluate((x) => { const mk = (k) => ({ place: k + 1, team: x[k], human: k === 1, time: 90 + k, gal: 14, clean: k === 0, points: 10, tickets: 0, lost: [], dry: false }); window.TR_APP.App.screens.show('results', { results: [0, 1, 2, 3, 4, 5, 6, 7].map(mk), laps: 3, trackName: 'Hot Springs Mountain Drive', mode: 'quick' }); }, ids); await t.waitFrames(3);
      t.expect(/^"?Jost"?/.test(await fam('.rtable td')), 'the results table: ' + await fam('.rtable td'));
      await shot(t, 'S4-10', 'results');
      await t.checkLayout({ allowScrollY: true });
      await t.game('newGame', { track: 'bathhouse-row', team: 'engine-six', classId: 'soak', laps: 1, seed: 5, paused: true }); await t.game('act', 'skipCountdown'); await t.waitFrames(3);
      t.expect(/^"?Jost"?/.test(await fam('.hud-time')), 'the race clock: ' + await fam('.hud-time'));
      await shot(t, 'S4-10', 'race');
      await t.checkLayout({ allowScrollY: true });
    },
  },
];
