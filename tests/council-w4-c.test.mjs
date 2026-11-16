// Wave 4, batch C: records by class (C4-05), standings (S3-10), hooks (S6-09), focus (S2-13), HUD text (S2-15),
// item odds (S3-17), locked team (C4-12) and the silent sequencer (S5-16).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createSaveWriter, DEFAULT_SAVE, bestFor, bestEntries } from '../src/js/save.js';
import { TEAMS } from '../src/js/data/teams.js';
import { ODDS } from '../src/js/sim/items.js';

const SHOTS = '../_council/hsg-tub-rally/wave-4/shots';
const KEY = 'hsg-tub-rally-v1';
const shot = async (t, id, what) => { fs.mkdirSync(SHOTS, { recursive: true }); await t.page.screenshot({ path: `${SHOTS}/${id}-${what}-${t.viewport === 'mobile' ? 'mobile' : 'desktop'}.png` }); };
const setSave = (t, s) => t.page.evaluate(([k, v]) => localStorage.setItem(k, JSON.stringify(v)), [KEY, s]);
const IDS = TEAMS.map((x) => x.id);
const text = (t, sel) => t.page.evaluate((q) => Array.from(document.querySelectorAll(q)).map((e) => e.textContent.replace(/\s+/g, ' ').trim()).join(' | '), sel);
const mk = (initial) => {
  const box = { raw: JSON.stringify(initial) };
  const writer = createSaveWriter({ read: () => box.raw, write: (r) => { box.raw = r; } });
  const save = writer.load();
  return { box, save, stored: () => JSON.parse(box.raw), commit: (i) => writer.commit(save, i) };
};
const race = (cls, time, lap = null) => ({ race: { token: {}, won: true, record: { track: 'bathhouse-row', finishT: time, value: { race: time, lap, team: 'engine-six', cls }, ghost: null }, trial: null } });
// a save as wave 3 wrote it: one best per course, with the class it was set in (or none, from an older build)
const wave3 = () => {
  const s = DEFAULT_SAVE();
  s.best = { 'bathhouse-row': { race: 150.2, lap: 48, team: 'engine-six', cls: 'soak' }, 'park-avenue': { race: 151, lap: null, team: 'engine-six' }, 'hs-mountain': { race: 120.5, lap: 40, team: 'engine-six', cls: 'scald' } };
  delete s.bests;
  return s;
};

export const tests = [
  // ---------------------------------------------------------------- C4-05
  {
    name: 'council W4C C4-05: a time set in a faster class is not the record for a slower one, and every old time is kept',
    node: true,
    run() {
      const f = mk(wave3());
      const before = JSON.stringify(f.stored().best);
      // a Scald time on a course whose old best is a Soak time: a first Scald time, not a record, and Soak is untouched
      const first = f.commit(race('scald', 140.1, 46));
      assert.equal(first.recordAccepted, true); assert.equal(first.hadBest, false, 'a first time in a class is not "a new record"');
      assert.equal(bestFor(f.stored(), 'bathhouse-row', 'soak').race, 150.2, 'the Soak time stands');
      assert.equal(bestFor(f.stored(), 'bathhouse-row', 'scald').race, 140.1);
      // a Soak time slower than 150.2 is not a record; one faster is, and beats the Soak time, not the Scald one
      assert.equal(f.commit(race('soak', 151)).recordAccepted, false);
      const faster = f.commit(race('soak', 145));
      assert.equal(faster.recordAccepted, true); assert.equal(faster.hadBest, true);
      assert.equal(bestFor(f.stored(), 'bathhouse-row', 'soak').race, 145); assert.equal(bestFor(f.stored(), 'bathhouse-row', 'scald').race, 140.1);
      assert.equal(bestFor(f.stored(), 'bathhouse-row', 'splash'), null);
      // nothing that was saved is moved or rewritten: the old entries are exactly as they were
      assert.equal(JSON.stringify(f.stored().best), before, 'the old `best` entries are untouched');
      // and each old time is still read under the class it names (an unclassed one is shown without a class)
      assert.equal(bestFor(f.stored(), 'hs-mountain', 'scald').race, 120.5); assert.equal(bestFor(f.stored(), 'hs-mountain', 'soak'), null);
      assert.deepEqual(bestEntries(f.stored(), 'park-avenue').map((e) => [e.cls, e.rec.race]), [[null, 151]]);
      assert.equal(bestFor(f.stored(), 'park-avenue', 'splash').race, 151);
    },
  },
  {
    name: 'council W4C C4-05: a bad per-class entry is dropped on load and a pending run survives a failed write',
    node: true,
    run() {
      const s = wave3();
      s.bests = { 'bathhouse-row': { soak: { race: 'x' }, scald: { race: 139, lap: 45, team: 'engine-six', cls: 'scald' } }, 'park-avenue': 7 };
      const f = mk(s);
      assert.equal(bestFor(f.save, 'bathhouse-row', 'soak').race, 150.2, 'a bad entry is dropped, the old time stands');
      assert.equal(bestFor(f.save, 'bathhouse-row', 'scald').race, 139);
      const box = { raw: JSON.stringify(s), fail: true };
      const w = createSaveWriter({ read: () => box.raw, write: (r) => { if (box.fail) throw new Error('quota'); box.raw = r; } });
      const live = w.load();
      assert.equal(w.commit(live, race('splash', 160)).stored, false);
      box.fail = false; w.commit(live, {});
      assert.equal(bestFor(JSON.parse(box.raw), 'bathhouse-row', 'splash').race, 160, 'the pending Splash time is written when storage works again');
    },
  },
  {
    name: 'council W4C C4-05: the course card and Records show the best for the class chosen, and name it',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(8000);
      const s = wave3();
      s.unlocked.classes = ['splash', 'soak', 'scald'];
      s.bests = { 'bathhouse-row': { scald: { race: 140.1, lap: 46, team: 'engine-six', cls: 'scald' } } };
      await setSave(t, s);
      await t.reload(); await t.waitIdle(8000);
      const card = (id) => t.page.evaluate((i) => (document.querySelector(`.courses [data-id="${i}"] em`) || {}).textContent || '', id);
      const toCourses = async (cls) => {
        await t.game('scene', 'title'); await t.waitFrames(3);
        await t.game('act', 'menu', 'quick'); await t.waitFrames(3);
        await t.game('act', 'menu', 'teamOk'); await t.waitFrames(3);
        await t.game('act', 'menu', 'cls', { id: cls }); await t.waitFrames(3);
      };
      await toCourses('soak');
      t.expect(/best 2:30\.20 · lap 0:48\.00 \(Soak\)/.test(await card('bathhouse-row')), 'Soak shows the Soak time: ' + await card('bathhouse-row'));
      await toCourses('scald');
      t.expect(/best 2:20\.10 · lap 0:46\.00 \(Scald\)/.test(await card('bathhouse-row')), 'Scald shows the Scald time: ' + await card('bathhouse-row'));
      t.expect(/best 2:31\.00/.test(await card('park-avenue')), 'an older time with no class is still shown: ' + await card('park-avenue'));
      await toCourses('soak');
      t.expect(/no Soak time yet/.test(await card('hs-mountain')), 'a course with only a Scald time says there is no Soak time: ' + await card('hs-mountain'));
      await shot(t, 'C4-05', 'course-cards');
      await t.checkLayout({ allowScrollY: true });
      await t.game('scene', 'title'); await t.waitFrames(3);
      await t.game('act', 'menu', 'records'); await t.waitFrames(3);
      const row = (name) => t.page.evaluate((n) => { const tr = [...document.querySelectorAll('.records table[aria-label="Best times by course"] tbody tr')].find((r) => r.cells[0].textContent === n); return tr ? tr.cells[1].textContent.replace(/\s+/g, ' ').trim() : ''; }, name);
      const bath = await row('Bathhouse Row');
      t.expect(/Soak 2:30\.20/.test(bath) && /Scald 2:20\.10/.test(bath), 'Records lists each class with a time: ' + bath);
      t.expect(/Scald 2:00\.50/.test(await row('Hot Springs Mountain Drive')), 'an old Scald time is under Scald: ' + await row('Hot Springs Mountain Drive'));
      await shot(t, 'C4-05', 'records');
      await t.checkLayout({ allowScrollY: true });
    },
  },

  // ---------------------------------------------------------------- S3-10
  {
    name: 'council W4C S3-10: the standings show the gap to the leader and what winning the cup takes',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(8000);
      const rows = IDS.slice(0, 5).map((id, i) => ({ team: id, points: 30 - i * 4, clean: i === 1 ? 1 : 0, human: i === 3, bribes: 0 }));
      const show = (r, round, rounds) => t.page.evaluate(([rr, a, b]) => window.TR_APP.App.screens.show('standings', { rows: rr, round: a, rounds: b, cupName: 'Bathhouse Cup', final: false }), [r, round, rounds]);
      await show(rows, 2, 4); await t.waitFrames(2);
      const gaps = await t.page.evaluate(() => [...document.querySelectorAll('.panel.standings tbody tr')].map((r) => r.cells[3].textContent));
      t.equal(gaps.join(), '–,−4,−8,−12,−16', 'a Gap column: the leader has none, the rest show the points behind');
      t.expect((await text(t, '.panel.standings thead th')).includes('Gap'), 'the column is named');
      const body = await text(t, '.panel.standings p');
      const leader = TEAMS.find((x) => x.id === IDS[0]).name;
      t.expect(body.includes('To win the cup, outscore ' + leader + ' by more than 12 points over the last 2 races.'), 'the line for the cup: ' + body);
      await shot(t, 'S3-10', 'standings');
      await t.checkLayout({ allowScrollY: true });
      await show(rows.map((r, i) => ({ ...r, human: i === 1 })), 3, 4); await t.waitFrames(2);
      t.expect(/outscore .* by more than 4 points over the last race./.test(await text(t, '.panel.standings p')), 'one race to go: "the last race"');
      await show(rows.map((r, i) => ({ ...r, human: i === 0 })), 2, 4); await t.waitFrames(2);
      t.expect(!/outscore/.test(await text(t, '.panel.standings p')), 'the leader is not told to outscore anyone');
    },
  },

  // ---------------------------------------------------------------- S6-09
  {
    name: 'council W4C S6-09: a page that is not under test has the reading hooks but not the ones that change state',
    viewports: ['desktop'],
    // as a player's browser: no harness flag, and not driven by automation
    initScript: () => { window.__TEST__ = false; Object.defineProperty(navigator, 'webdriver', { get: () => false }); },
    async run(t) {
      await t.waitIdle(8000);
      const r = await t.page.evaluate(() => ({ keys: Object.keys(window.__game), state: typeof window.__game.getState === 'function' && !!window.__game.getState().settings }));
      t.expect(r.state, 'getState still reads the game');
      t.expect(r.keys.includes('getState') && r.keys.includes('audioList') && r.keys.includes('isIdle'), 'the reading hooks stay: ' + r.keys);
      t.expect(!r.keys.includes('setState') && !r.keys.includes('act'), 'setState and act (teleport, clearSave) are not there: ' + r.keys);
    },
  },
  {
    name: 'council W4C S6-09: ?debug brings the state-changing hooks back',
    url: 'index.html?debug',
    initScript: () => { window.__TEST__ = false; Object.defineProperty(navigator, 'webdriver', { get: () => false }); },
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      t.expect(await t.page.evaluate(() => typeof window.__game.setState === 'function' && typeof window.__game.act === 'function'), '?debug keeps them');
    },
  },
  {
    name: 'council W4C S6-09: under the test harness every hook is there',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      t.expect(await t.page.evaluate(() => typeof window.__game.setState === 'function' && typeof window.__game.act === 'function' && window.__game.act('date', '2026-01-02') === true), 'the harness page has setState and act');
    },
  },

  // ---------------------------------------------------------------- S2-13
  {
    name: 'council W4C S2-13: a screen puts the focus on the button it marks, not on the first button in the page',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(8000);
      const sv = DEFAULT_SAVE();
      sv.settings.seenIntro = true; sv.lastTeam = 'lather-linen'; sv.unlocked.teams = ['lather-linen'];
      await setSave(t, sv);
      await t.reload(); await t.waitIdle(8000);
      const focus = () => t.page.evaluate(() => { const a = document.activeElement; return a && a.dataset ? `${a.dataset.act}${a.dataset.id ? ':' + a.dataset.id : ''}` : ''; });
      await t.game('scene', 'title'); await t.waitFrames(3);
      t.equal(await focus(), 'gp', 'the title: Grand Prix when there is no cup to continue');
      await t.game('act', 'menu', 'quick'); await t.waitFrames(3);
      t.equal(await t.page.evaluate(() => document.body.dataset.screen), 'teams', 'team choice');
      t.equal(await focus(), 'teamOk', 'the team screen: the choose button of the saved team, not the first card');
      t.expect(/Lather/.test(await t.page.evaluate(() => document.querySelector('[data-act="teamOk"]').textContent)), 'and it is the saved team');
      await t.game('act', 'menu', 'teamOk'); await t.waitFrames(3);
      t.equal(await t.page.evaluate(() => document.body.dataset.screen), 'classes', 'class choice');
      t.equal(await focus(), 'cls:soak', 'the class screen lands on Soak, not Splash');
      await shot(t, 'S2-13', 'class-focus');
      await t.game('act', 'menu', 'cls', { id: 'soak' }); await t.waitFrames(3);
      t.equal(await focus(), 'course:' + await t.page.evaluate(() => document.querySelector('.courses [data-act="course"]').dataset.id), 'the course screen lands on the first course, not on the Mirror row or a chip');
      await t.game('scene', 'title'); await t.waitFrames(2);
      await t.game('act', 'menu', 'settings'); await t.waitFrames(3);
      t.expect(await t.page.evaluate(() => !document.activeElement.matches('[data-back]')), 'Settings still opens on its first control, not on Done');
    },
  },
  {
    name: 'council W4C S2-13: with a cup to continue the title still opens on Continue cup',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      const cup = { v: 1, cup: 'bathhouse', name: 'Bathhouse Cup', tracks: ['bathhouse-row', 'park-avenue', 'whittington-valley', 'bridge-street'], round: 1,
        table: { 'engine-six': { team: 'engine-six', points: 20, clean: 1, human: true, bribes: 0 }, 'lather-linen': { team: 'lather-linen', points: 30, clean: 1, bribes: 0 } },
        rivals: ['lather-linen'], team: 'engine-six', classId: 'soak', seed: 5 };
      await t.page.evaluate(([k, v]) => localStorage.setItem(k, v), ['hsg-tub-rally-cup-v1', JSON.stringify(cup)]);
      await t.reload(); await t.waitIdle(8000);
      await t.game('scene', 'title'); await t.waitFrames(3);
      t.equal(await t.page.evaluate(() => document.activeElement.dataset.act), 'continueCup', 'Continue cup has the focus');
    },
  },

  // ---------------------------------------------------------------- S2-15
  {
    name: 'council W4C S2-15: on a phone in portrait the pip labels and the ticket label are drawn at 14 px or more, and follow the HUD size',
    viewports: ['mobile', 'desktop'],
    async run(t) {
      await t.waitIdle(8000);
      const sv = DEFAULT_SAVE(); sv.settings.seenIntro = true;
      await setSave(t, sv);
      await t.reload(); await t.waitIdle(8000);
      await t.game('newGame', { mode: 'quick', track: 'bathhouse-row', count: 8, paused: true, team: 'engine-six', classId: 'soak', seed: 5 });
      await t.waitFrames(3);
      await t.game('setState', { kart: { tickets: 3 } }); await t.waitFrames(3);
      // the size a label is painted at: its own font size times the scale its HUD block is drawn with
      const painted = (sel, block) => t.page.evaluate(([s, b]) => { const e = document.querySelector(s), box = document.querySelector(b); const k = box.getBoundingClientRect().width / box.offsetWidth; return +(parseFloat(getComputedStyle(e).fontSize) * k).toFixed(2); }, [sel, block]);
      const pip = await painted('.hud-pips .pip em', '.hud-bl'), tk = await painted('.hud-item .tk-l', '.hud-item');
      if (t.viewport === 'mobile') {
        t.expect(pip >= 14, 'pip label painted at ' + pip + ' px');
        t.expect(tk >= 14, 'ticket label painted at ' + tk + ' px');
        // the HUD size setting still scales them
        await t.page.evaluate(() => document.documentElement.style.setProperty('--hud-user', '1.2')); await t.waitFrames(2);
        t.expect(await painted('.hud-pips .pip em', '.hud-bl') > pip, 'a larger HUD size makes the pip labels larger');
        await t.page.evaluate(() => document.documentElement.style.setProperty('--hud-user', '1'));
        await t.waitFrames(2);
        // the bigger labels do not grow the row into the READY / GO banner below it, nor into the item tray beside it
        const clash = await t.page.evaluate(() => { const p = document.querySelector('.hud-pips').getBoundingClientRect(), c = document.querySelector('.hud-center').getBoundingClientRect(), i = document.querySelector('.hud-item').getBoundingClientRect(); return { inside: p.left >= 0 && p.right <= innerWidth, belowClear: p.bottom <= c.top, trayClear: p.right <= i.left || p.bottom <= i.top }; });
        t.expect(clash.inside && clash.belowClear && clash.trayClear, 'the pip row is inside the screen and clear of the banner and the tray: ' + JSON.stringify(clash));
        await shot(t, 'S2-15', 'hud');
      } else {
        t.expect(pip >= 13 && tk >= 12, 'desktop keeps its sizes: ' + pip + ', ' + tk);
      }
    },
  },

  // ---------------------------------------------------------------- S3-17
  {
    name: 'council W4C S3-17: How to Play says that trailing tubs draw stronger items, and the odds really do shift that way',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(8000);
      await t.game('scene', 'help'); await t.waitFrames(3);
      const lead = await t.page.evaluate(() => [...document.querySelectorAll('.item-list')].map((l) => l.previousElementSibling.textContent).join(' '));
      t.expect(/The further back you are, the stronger the item a bubble gives./.test(lead), 'the help lead: ' + lead);
      await t.page.evaluate(() => document.querySelector('.item-list').scrollIntoView({ block: 'center' })); await t.waitFrames(2);
      await shot(t, 'S3-17', 'help-items');
      await t.checkLayout({ allowScrollY: true });
      // the sentence is true: the share of catch-up items grows from first place to last, and the leader draws none of them
      const catchUp = ODDS.map((row) => { const tot = Object.values(row).reduce((a, b) => a + b, 0); return ['jet3', 'hose', 'bubble'].reduce((a, k) => a + (row[k] || 0), 0) / tot; });
      t.expect(catchUp[0] === 0 && catchUp.every((v, i) => i === 0 || v >= catchUp[i - 1]) && catchUp[7] > 0.5, 'catch-up share by place: ' + catchUp.map((v) => v.toFixed(2)));
    },
  },
];
