// Wave 4, batch C: records by class (C4-05), standings (S3-10), hooks (S6-09), focus (S2-13), HUD text (S2-15),
// item odds (S3-17), locked team (C4-12) and the silent sequencer (S5-16).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createSaveWriter, DEFAULT_SAVE, bestFor, bestEntries } from '../src/js/save.js';

const SHOTS = '../_council/hsg-tub-rally/wave-4/shots';
const KEY = 'hsg-tub-rally-v1';
const shot = async (t, id, what) => { fs.mkdirSync(SHOTS, { recursive: true }); await t.page.screenshot({ path: `${SHOTS}/${id}-${what}-${t.viewport === 'mobile' ? 'mobile' : 'desktop'}.png` }); };
const setSave = (t, s) => t.page.evaluate(([k, v]) => localStorage.setItem(k, JSON.stringify(v)), [KEY, s]);
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
];
