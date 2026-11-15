// Wave 3, batch B: saves and lifecycle (S3-03, S4-03, S5-07, S2-07) and controls, rules and play (S2-03, P-N05, S1-15).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Track } from '../src/js/sim/track.js';
import { stepRace, DT } from '../src/js/sim/race.js';
import { makeHeat, TASK_LIMIT } from '../src/js/sim/rules-real.js';
import { createSaveWriter, DEFAULT_SAVE } from '../src/js/save.js';
import { LANDMARK_NAMES, BATTLE_GOAL } from '../src/js/data/facts.js';
import { spillHint } from '../src/js/ui/hud.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = '../_council/hsg-tub-rally/wave-3/shots';
const KEY = 'hsg-tub-rally-v1';
const shot = async (t, id, what) => { await t.shot(`w3b-${id}-${what}`); fs.mkdirSync(SHOTS, { recursive: true }); await t.page.screenshot({ path: `${SHOTS}/${id}-${what}-${t.viewport === 'mobile' ? 'mobile' : 'desktop'}.png` }); };
const track = (id) => new Track(JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'tracks', id + '.json'), 'utf8')));
const mk = (initial) => {
  const box = { raw: initial === undefined ? null : JSON.stringify(initial) };
  const writer = createSaveWriter({ read: () => box.raw, write: (r) => { box.raw = r; } });
  const save = writer.load();
  return { box, save, stored: () => JSON.parse(box.raw), commit: (i) => writer.commit(save, i) };
};
const setSave = (t, s) => t.page.evaluate(([k, v]) => localStorage.setItem(k, JSON.stringify(v)), [KEY, s]);
const readSave = (t) => t.page.evaluate((k) => JSON.parse(localStorage.getItem(k)), KEY);
const startRace = async (t, o = {}) => {
  await t.waitIdle(8000);
  await t.game('newGame', { track: 'bathhouse-row', team: 'engine-six', classId: 'soak', laps: 1, seed: 5, ...o });
  await t.game('act', 'skipCountdown');
  await t.waitFrames(3);
};

export const tests = [
  // ---------------------------------------------------------------- S3-03
  {
    name: 'council B S3-03: the ghost you race follows your Time Trial best, even when a Quick Race set a faster time',
    node: true,
    async run(t) {
      const f = mk(DEFAULT_SAVE());
      const G = (n) => ({ team: 'engine-six', total: n, n: 12, tag: 'g' + n });
      const quick = f.commit({ race: { token: {}, won: true, record: { track: 'bathhouse-row', finishT: 140, value: { race: 140, lap: 46, team: 'engine-six', cls: 'soak' }, ghost: null }, trial: null } });
      t.expect(quick.recordAccepted, 'the Quick Race sets the course best');
      const tt = (race, ghost) => f.commit({ race: { token: {}, won: true,
        record: { track: 'bathhouse-row', finishT: race, value: { race, lap: 47, team: 'engine-six', cls: 'scald' }, ghost },
        trial: { track: 'bathhouse-row', race, lap: 47, medal: 1, ghost } } });
      tt(145, G(145));
      t.equal(f.stored().ghosts['bathhouse-row'].tag, 'g145', 'a first Time Trial run is the ghost although the Quick Race time is faster');
      tt(150, G(150));
      t.equal(f.stored().ghosts['bathhouse-row'].tag, 'g145', 'a slower run leaves it alone');
      tt(144, G(144));
      t.equal(f.stored().ghosts['bathhouse-row'].tag, 'g144', 'a faster Time Trial run replaces it');
      t.equal(f.stored().best['bathhouse-row'].race, 140, 'and the course best is still the Quick Race time');
    },
  },
  {
    name: 'council B S3-03: a course card names the class its best time was set in, and Time Trial says it runs at Scald speed',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(8000);
      const s = DEFAULT_SAVE();
      s.best = { 'bathhouse-row': { race: 150.2, lap: 48, team: 'engine-six', cls: 'soak' }, 'park-avenue': { race: 151, lap: null, team: 'engine-six' } };
      await setSave(t, s);
      await t.reload(); await t.waitIdle(8000);
      await t.game('act', 'menu', 'quick'); await t.waitFrames(3);
      await t.game('act', 'menu', 'teamOk'); await t.waitFrames(3);
      await t.game('act', 'menu', 'cls', { id: 'soak' }); await t.waitFrames(3);
      const card = (id) => t.page.evaluate((i) => (document.querySelector(`.courses [data-id="${i}"] em`) || {}).textContent || '', id);
      t.expect(/best 2:30\.20 · lap 0:48\.00 \(Soak\)/.test(await card('bathhouse-row')), 'class named: ' + await card('bathhouse-row'));
      t.expect(/best 2:31\.00$/.test((await card('park-avenue')).trim()), 'a time with no class stored (an older save) shows no class: ' + await card('park-avenue'));
      t.equal(await t.page.evaluate(() => !!document.querySelector('.courses .trial-note')), false, 'no Time Trial note on a Quick Race');
      await t.game('act', 'menu', 'back'); await t.waitFrames(2);
      await t.game('scene', 'title'); await t.waitFrames(3);
      await t.game('act', 'menu', 'timetrial'); await t.waitFrames(3);
      await t.game('act', 'menu', 'teamOk'); await t.waitFrames(3);
      await t.page.waitForSelector('.courses .trial-note', { timeout: 5000 });
      const note = await t.page.evaluate(() => document.querySelector('.courses .trial-note').textContent);
      t.equal(note, 'Time Trial runs at Scald speed with no items.', 'the note');
      await shot(t, 'S3-03', 'time-trial-note');
      await t.checkLayout({ allowScrollY: true });
    },
  },

  // ---------------------------------------------------------------- S4-03
  {
    name: 'council B S4-03: every landmark on every course has a name for its caption, and the names are in the repo',
    node: true,
    async run(t) {
      const research = fs.readFileSync(path.join(ROOT, 'research', 'town-content.md'), 'utf8') + fs.readFileSync(path.join(ROOT, 'src', 'js', 'data', 'facts.js'), 'utf8');
      const ids = new Set();
      for (const f of fs.readdirSync(path.join(ROOT, 'data', 'tracks'))) for (const l of JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'tracks', f), 'utf8')).landmarks || []) ids.add(l.id);
      const unnamed = [...ids].filter((i) => !LANDMARK_NAMES[i]);
      t.expect(unnamed.every((i) => i === 'medical-arts'), 'only an id the repo has no name for is left out: ' + unnamed);
      for (const [id, name] of Object.entries(LANDMARK_NAMES)) {
        t.expect(ids.has(id), id + ' is a real landmark id');
        const word = name.replace(/ · Bathhouse Row/, '').replace(/^(The|Former) /, '').split(' ')[0];
        t.expect(research.includes(word), id + ': "' + word + '" appears in the repo\'s own text');
      }
    },
  },
  {
    name: 'council B S4-03: passing a landmark names it once, in a caption that fades',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(8000);
      await t.game('setState', { settings: { seenIntro: true } });
      await startRace(t, { laps: 3 });
      // the race is paused, so only the steps taken here move the tub: the answer does not depend on speed or on real time
      await t.game('pause');
      const cap = () => t.page.evaluate(() => { const e = document.querySelector('.hud-lm'); return { on: e.classList.contains('show'), text: e.textContent, shown: getComputedStyle(e).display !== 'none' }; });
      const lm = track('bathhouse-row').json.landmarks.find((l) => l.id === 'buckstaff');
      // step one step at a time until the tub is just past the Buckstaff, and read the caption in the same breath,
      // before any other landmark could replace it
      const passIt = () => t.page.evaluate((target) => {
        const g = window.__game; g.act('input', { steer: 0, push: 1, brake: false, hop: false });
        const me = () => { const r = g.getState().race; return r.karts[r.player]; };
        for (let i = 0; i < 600 && me().s <= target; i++) g.step(1);
        const e = document.querySelector('.hud-lm');
        return { s: me().s, on: e.classList.contains('show'), text: e.textContent };
      }, lm.s);
      await t.game('setState', { kart: { s: lm.s - 5 } });
      let c = await passIt();
      t.expect(c.s > lm.s, 'the tub passed the Buckstaff: ' + JSON.stringify(c));
      t.expect(c.on && c.text === LANDMARK_NAMES.buckstaff, 'the caption names the landmark just passed: ' + JSON.stringify(c));
      await t.waitFrames(3);
      c = await cap();
      if (c.on) {
        t.expect(c.shown && c.text === LANDMARK_NAMES.buckstaff, 'the caption is on screen: ' + JSON.stringify(c));
        await shot(t, 'S4-03', 'landmark-caption');
        await t.checkLayout({ allowScrollY: true });
      }
      // it fades after a few seconds
      await t.page.waitForFunction(() => !document.querySelector('.hud-lm').classList.contains('show'), null, { timeout: 15000 });
      // going round again does not repeat it
      await t.game('setState', { kart: { s: lm.s - 5 } });
      c = await passIt();
      t.expect(c.s > lm.s && !c.on, 'a second pass in the same race does not name it again: ' + JSON.stringify(c));
    },
  },

  // ---------------------------------------------------------------- S5-07
  {
    name: 'council B S5-07: Music level scales the music bus, defaults to the shipped mix, and survives a reload',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(8000);
      const rows = () => t.page.evaluate(() => [...document.querySelectorAll('.settings .set-row > span')].map((e) => e.textContent));
      await t.game('scene', 'settings'); await t.waitFrames(4);
      t.expect((await rows()).includes('Music level'), 'the row is there');
      let sv = await readSave(t);
      t.expect(sv === null || sv.settings.musicVol === undefined || sv.settings.musicVol === 1, 'a profile that has not touched it plays the shipped mix');
      t.equal((await t.page.evaluate(() => window.__game.getState().settings.musicVol)), 1, 'the default is 1 (today\'s level)');
      await t.page.click('.settings [data-k="musicVol"][data-v="0.4"]');
      await t.waitFrames(4);
      sv = await readSave(t);
      t.equal(sv.settings.musicVol, 0.4, 'Low is saved');
      t.equal(await t.page.evaluate(() => document.querySelector('.settings [data-k="musicVol"][data-v="0.4"]').getAttribute('aria-pressed')), 'true', 'and shows as chosen');
      await t.page.keyboard.press('ArrowUp'); // a gesture, so the audio graph exists
      await t.waitFrames(3);
      // the level the game set for the music bus (the audio state), not the live gain, which moves with the audio thread
      const level = () => t.page.evaluate(() => window.__game.getState().audio.musicVol);
      t.equal(await level(), 0.4, 'the audio state has Low');
      await t.page.click('.settings [data-k="musicVol"][data-v="1"]');
      await t.page.waitForFunction(() => window.__game.getState().audio.musicVol === 1, null, { timeout: 8000 });
      t.equal(await level(), 1, 'and Normal, which is the shipped mix');
      await t.page.click('.settings [data-k="musicVol"][data-v="0.7"]');
      await t.waitFrames(3);
      await t.reload(); await t.waitIdle(8000);
      t.equal(await t.page.evaluate(() => window.__game.getState().settings.musicVol), 0.7, 'Medium is there after a reload');
      // a damaged value falls back to the shipped mix
      const bad = await readSave(t); bad.settings.musicVol = 'loud';
      await setSave(t, bad);
      await t.reload(); await t.waitIdle(8000);
      t.equal(await t.page.evaluate(() => window.__game.getState().settings.musicVol), 1, 'a damaged value falls back to 1');
    },
  },
  {
    name: 'council B S5-07: Settings says so when Sound is Off and Music or Ambience would be silent too',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(8000);
      const note = () => t.page.evaluate(() => (document.querySelector('.settings .set-note') || {}).textContent || '');
      await t.game('scene', 'settings'); await t.waitFrames(4);
      t.equal(await note(), '', 'no note while Sound is On');
      await t.page.click('.settings [data-k="sound"][data-v="false"]');
      await t.waitFrames(4);
      t.equal(await note(), 'Sound is Off, so Music and Ambience are silent too.', 'the note appears');
      await t.page.evaluate(() => document.querySelector('.settings [data-k="musicVol"]').scrollIntoView({ block: 'center' }));
      await t.waitFrames(3);
      await shot(t, 'S5-07', 'settings-note');
      await t.checkLayout({ allowScrollY: true });
      const small = await t.page.evaluate(() => [...document.querySelectorAll('.settings button')].map((b) => { const r = b.getBoundingClientRect(); return { h: r.height, w: r.width, t: b.textContent }; }).filter((b) => b.h < 40 || b.w < 40));
      t.expect(small.length === 0, 'touch targets stay large: ' + JSON.stringify(small));
      await t.page.click('.settings [data-k="music"][data-v="false"]');
      await t.page.click('.settings [data-k="ambience"][data-v="false"]');
      await t.waitFrames(4);
      t.equal(await note(), '', 'with Music and Ambience also Off there is nothing to explain');
      await t.page.click('.settings [data-k="sound"][data-v="true"]');
    },
  },

  // ---------------------------------------------------------------- S2-03
  {
    name: 'council B S2-03: Water Fight states its goal under the countdown, in the pause menu and in How to Play',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(8000);
      await t.game('newGame', { mode: 'battle', track: 'hill-wheatley', team: 'engine-six', classId: 'soak', seed: 4, paused: true });
      await t.waitFrames(4);
      const fact = () => t.page.evaluate(() => { const e = document.querySelector('.hud-fact'); return { on: e.classList.contains('show'), text: e.textContent, shown: getComputedStyle(e).display !== 'none' }; });
      let f = await fact();
      t.expect(f.on && f.shown && f.text === BATTLE_GOAL.t, 'the countdown states the goal: ' + JSON.stringify(f));
      t.expect(BATTLE_GOAL.t.split(/\s+/).length <= 14, 'in a sentence short enough to read at a glance');
      await shot(t, 'S2-03', 'countdown-goal');
      await t.game('act', 'skipCountdown');
      await t.game('resume');
      await t.waitFrames(30);
      f = await fact();
      t.expect(f.on, 'it is still up a second into the match (' + f.text + ')');
      await t.game('step', 60 * 8);
      await t.waitFrames(3);
      t.expect(!(await fact()).on, 'and gone once the match is under way');
      await t.page.keyboard.press('Escape'); await t.waitFrames(3);
      const p = await t.page.evaluate(() => document.querySelector('.panel.pause .fact-line')?.textContent || '');
      t.equal(p, BATTLE_GOAL.t, 'the pause menu repeats it');
      await t.page.keyboard.press('Escape');
      await t.page.waitForFunction(() => window.__game.getState().resumeHold === 0, null, { timeout: 5000 });
      await t.game('scene', 'title'); await t.waitFrames(3);
      await t.game('scene', 'help'); await t.waitFrames(4);
      const h = await t.page.evaluate(() => [...document.querySelectorAll('.panel.help h3')].map((e) => e.textContent));
      t.expect(h.includes('Water Fight'), 'How to Play has a Water Fight section: ' + h);
      const text = await t.page.evaluate(() => document.querySelector('.panel.help').innerText);
      t.expect(/last tub with water wins/i.test(text) && /fountain/.test(text), 'and it says how it is won');
      await t.checkLayout({ allowScrollY: true });
    },
  },
  {
    name: 'council B S2-03: an ordinary race still shows a local fact, not the Water Fight goal',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      await t.game('setState', { settings: { seenIntro: true } });
      await t.game('newGame', { track: 'bathhouse-row', team: 'engine-six', classId: 'soak', laps: 1, seed: 5, paused: true });
      await t.waitFrames(4);
      const text = await t.page.evaluate(() => document.querySelector('.hud-fact').textContent);
      t.expect(text && text !== BATTLE_GOAL.t, 'a fact: ' + text);
    },
  },

  // ---------------------------------------------------------------- S2-07
  {
    name: 'council B S2-07: the page can be pinch-zoomed in menus and still not in the race',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(8000);
      const meta = await t.page.evaluate(() => document.querySelector('meta[name="viewport"]').content);
      t.expect(!/user-scalable\s*=\s*(no|0)/i.test(meta) && !/maximum-scale/i.test(meta), 'the viewport allows zoom: ' + meta);
      await t.game('scene', 'help'); await t.waitFrames(4);
      const menu = await t.page.evaluate(() => getComputedStyle(document.getElementById('screens')).touchAction);
      t.expect(/pinch-zoom/.test(menu) && /pan-y/.test(menu), 'menus allow scrolling and pinch-zoom: ' + menu);
      await startRace(t);
      const race = await t.page.evaluate(() => ({ gl: getComputedStyle(document.getElementById('gl')).touchAction, body: getComputedStyle(document.body).touchAction, steer: getComputedStyle(document.querySelector('.t-steer')).touchAction, tb: getComputedStyle(document.querySelector('.tb')).touchAction }));
      t.expect(race.gl === 'none' && race.body === 'none' && race.steer === 'none' && race.tb === 'none', 'the race and its controls stay touch-action none: ' + JSON.stringify(race));
    },
  },

  // ---------------------------------------------------------------- P-N05
  {
    name: 'council B P-N05: a player who does nothing at a judge stop fails it and drops an item, instead of being passed',
    node: true,
    async run(t) {
      const tr = track('bathhouse-row');
      for (const task of ['toss', 'jacks', 'pushups', 'yodel']) {
        const h = makeHeat(tr, { teams: ['engine-six', 'lather-linen'], human: 'engine-six', seed: 2, tasks: [task, task, task] });
        const k = h.karts[h.player];
        for (let i = 0; i < 200; i++) stepRace(h, tr, [], DT);
        const st = h.row.stops[0], p = tr.point(st.s, 0);
        k.x = p.x; k.z = p.z; k.s = st.s; k.vf = 0;
        let failed = null, secs = 0;
        for (let i = 0; i < 60 * 14 && !failed; i++) {
          stepRace(h, tr, [], DT);
          for (const e of k.events) if (e.type === 'taskFail') failed = e;
          if (k.stopDone[0] && !failed) break;
          if (k.task) secs = k.task.t;
        }
        t.expect(!!failed, task + ': doing nothing fails the stop');
        t.expect(secs <= TASK_LIMIT[{ toss: 'timing', jacks: 'mash', pushups: 'alt', yodel: 'hold' }[task]] + 0.1, `${task}: and the judges only wait ${secs.toFixed(1)} s (it was 12)`);
        t.expect(k.state === 'circle' && !!failed.item && k.dropped === failed.item, task + ': the team drops ' + failed.item + ' and circles the tub (rule 7)');
        t.equal(h.row.fails, 1, task + ': counted');
        for (let i = 0; i < 60 * 4; i++) stepRace(h, tr, [], DT);
        t.expect(Object.values(k.items).every(Boolean), task + ': the item is back after the circle, so it is a delay and a spill, not a disqualification');
      }
    },
  },
  {
    name: 'council B P-N05: doing the task still passes it, and Ring Around the Tub cannot be failed',
    node: true,
    async run(t) {
      const tr = track('bathhouse-row');
      for (const [task, inputs] of [['jacks', (i) => ({ push: i % 10 < 5 ? 1 : 0 })], ['pushups', (i) => ({ steer: i % 20 < 10 ? -1 : 1 })], ['yodel', () => ({ hop: true })], ['ring', () => ({})]]) {
        const h = makeHeat(tr, { teams: ['engine-six', 'lather-linen'], human: 'engine-six', seed: 2, tasks: [task, task, task] });
        const k = h.karts[h.player];
        for (let i = 0; i < 200; i++) stepRace(h, tr, [], DT);
        const st = h.row.stops[0], p = tr.point(st.s, 0);
        k.x = p.x; k.z = p.z; k.s = st.s; k.vf = 0;
        let done = false;
        for (let i = 0; i < 60 * 8 && !done; i++) {
          const inp = []; inp[h.player] = { steer: 0, push: 0, brake: false, hop: false, ...inputs(i) };
          stepRace(h, tr, inp, DT);
          done = !!k.stopDone[0];
        }
        t.expect(done && !h.row.fails, task + ': done in time, no failure');
      }
      // Ring Around the Tub is automatic: even with no input and a long wait it passes
      const h = makeHeat(tr, { teams: ['engine-six', 'lather-linen'], human: 'engine-six', seed: 2, tasks: ['ring', 'ring', 'ring'] });
      for (let i = 0; i < 60 * 40; i++) stepRace(h, tr, [], DT);
      t.expect(!h.row.fails, 'ring never fails');
    },
  },
  {
    name: 'council B P-N05: rival teams flub stops at a rate set by the class, and a flub costs time but never a disqualification',
    node: true,
    async run(t) {
      // 30 seeded heats per class, two rival-driven tubs each. A flub is a drawn event with a stated chance, so the count is
      // tested against a wide band (at 25% x 120 stops the mean is 30, sd 4.7, and at 4% it is 4.8, sd 2.2; the bands below are about 5 sd wide), and the
      // ordering by class is tested between the two ends, which are far apart (25% against 4%).
      const tr = track('bathhouse-row');
      const run = (cls) => {
        let fails = 0, dq = 0, stops = 0;
        for (let seed = 1; seed <= 30; seed++) {
          const h = makeHeat(tr, { teams: ['engine-six', 'lather-linen'], human: 'engine-six', seed, classId: cls, autoplay: true });
          for (let i = 0; i < 60 * 130 && h.phase !== 'done'; i++) stepRace(h, tr, [], DT);
          fails += h.row.fails || 0; stops += 2 * 2; // two flub-able stops (toss, jacks) for each of two tubs
          dq += h.results.filter((r) => r.dq).length;
        }
        return { fails, dq, stops: stops * 1 };
      };
      const splash = run('splash'), boil = run('boil');
      t.equal(splash.dq + boil.dq, 0, 'nobody is disqualified by a flub (the dropped item comes back)');
      t.expect(splash.fails >= 10 && splash.fails <= 55, 'Splash: flubs in a plausible band (' + splash.fails + ' of 120 stops)');
      t.expect(boil.fails <= 16, 'Boil: few flubs (' + boil.fails + ' of 120 stops)');
      t.expect(splash.fails > boil.fails, 'Splash teams flub more than Boil teams: ' + splash.fails + ' against ' + boil.fails);
      const again = run('splash');
      t.equal(again.fails, splash.fails, 'the same seeds give the same flubs');
    },
  },
  {
    name: 'council B P-N05: the Row rules card says a slow stop costs an item and a circle',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(8000);
      await t.game('act', 'menu', 'row'); await t.waitFrames(3);
      await t.game('act', 'menu', 'teamOk'); await t.waitFrames(8);
      const text = await t.page.evaluate(() => (document.querySelector('.panel.rowintro') || {}).innerText || '');
      t.expect(/Take too long and you drop an item and circle the tub/.test(text), 'rules card: ' + text.slice(0, 200));
      await shot(t, 'P-N05', 'row-rules');
      await t.checkLayout({ allowScrollY: true });
    },
  },

  // ---------------------------------------------------------------- S1-15
  {
    name: 'council B S1-15: the spill call-out names the cause',
    node: true,
    async run(t) {
      t.expect(/Slides/.test(spillHint({ drift: 1, air: false })), 'a slide');
      t.expect(/jumps/.test(spillHint({ drift: 0, air: true })), 'a jump');
      t.expect(/turns/.test(spillHint({ drift: 0, air: false })), 'everything else');
      t.expect(/Slides/.test(spillHint({ drift: 1, air: true })), 'a slide in the air is still the slide');
    },
  },
  {
    name: 'council B S1-15: the water gauge leans with the slosh and says SPILLING, and a spill gets one named call-out',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(8000);
      await t.game('setState', { settings: { seenIntro: true } });
      await startRace(t);
      // the gauge canvas: the water's top edge on the left and right sides of the tub
      const edge = () => t.page.evaluate(() => {
        const c = document.querySelector('.hud-water'), g = c.getContext('2d'), W = c.width;
        const top = (x) => { for (let y = 20; y < 70; y++) { const d = g.getImageData(x, y, 1, 1).data; if (d[2] > 150 && d[2] - d[0] > 50) return y; } return -1; };
        return { l: top(40), r: top(W - 40) };
      });
      await t.game('pause');
      await t.game('setState', { kart: { gal: 30, tilt: 0 } });
      await t.waitFrames(3);
      const flat = await edge();
      t.expect(flat.l > 0 && Math.abs(flat.l - flat.r) <= 2, 'level water is flat: ' + JSON.stringify(flat));
      await t.game('setState', { kart: { tilt: -0.2 } });
      await t.waitFrames(4);
      const back = await edge();
      t.expect(back.l > 0 && back.r - back.l >= 8, 'water banked up behind the tub when it accelerates (left higher): ' + JSON.stringify(back));
      await t.game('setState', { kart: { tilt: 0.2 } });
      await t.waitFrames(4);
      const fwd = await edge();
      t.expect(fwd.l > 0 && fwd.l - fwd.r >= 8, 'and forward when it brakes: ' + JSON.stringify(fwd));
      await t.game('setState', { kart: { tilt: 0 } });
      await t.waitFrames(3);
      // spill: the label, then one call-out
      await t.page.waitForFunction(() => !document.querySelector('.hud-call').classList.contains('show'), null, { timeout: 8000 }); // a start call-out has gone
      await t.game('setState', { kart: { spill: 0.8 } });
      await t.waitFrames(4);
      const call = await t.page.evaluate(() => ({ text: document.querySelector('.hud-call').textContent, on: document.querySelector('.hud-call').classList.contains('show') }));
      t.expect(call.on && /spill water/.test(call.text), 'a call-out names the cause: ' + JSON.stringify(call));
      await shot(t, 'S1-15', 'spill');
      await t.checkLayout({ allowScrollY: true });
    },
  },
];
