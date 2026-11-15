// Wave 3, batch D: feedback, teaching and help (S3-08, S3-15, S6-20, P-N03, S2-04) and sound (S3-12, S4-22, S5-09, S5-13),
// and the dusk shadows (S4-09).
import fs from 'node:fs';
import { CLASSES, TEAMS } from '../src/js/data/teams.js';
import { DEFAULT_SAVE } from '../src/js/save.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Track } from '../src/js/sim/track.js';
import { makeRace, stepRace, DT } from '../src/js/sim/race.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const track = (id) => new Track(JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'tracks', id + '.json'), 'utf8')));

const SHOTS = '../_council/hsg-tub-rally/wave-3/shots';
const KEY = 'hsg-tub-rally-v1';
const shot = async (t, id, what) => { await t.shot(`w3d-${id}-${what}`); fs.mkdirSync(SHOTS, { recursive: true }); await t.page.screenshot({ path: `${SHOTS}/${id}-${what}-${t.viewport === 'mobile' ? 'mobile' : 'desktop'}.png` }); };
const setSave = (t, s) => t.page.evaluate(([k, v]) => localStorage.setItem(k, JSON.stringify(v)), [KEY, s]);
const freshProfile = async (t) => { await t.waitIdle(8000); await setSave(t, { ...DEFAULT_SAVE(), settings: { ...DEFAULT_SAVE().settings, seenIntro: true } }); await t.reload(); await t.waitIdle(8000); };
const IDS = TEAMS.map((x) => x.id);
const text = (t, sel) => t.page.evaluate((s) => Array.from(document.querySelectorAll(s)).map((e) => e.textContent.replace(/\s+/g, ' ').trim()).join(' | '), sel);

export const tests = [
  // ---------------------------------------------------------------- S3-08
  {
    name: 'council D S3-08: How to Play explains the rubber band, in the order the classes really have it',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(8000);
      const r = CLASSES;
      t.expect(r.splash.rubber > r.soak.rubber && r.soak.rubber > r.scald.rubber && r.scald.rubber > r.boil.rubber && r.boil.rubber === 0, 'the strengths the help describes are in the data: ' + Object.values(r).map((c) => c.rubber).join());
      await t.game('scene', 'help'); await t.waitFrames(3);
      const body = await text(t, '.panel.help section');
      t.expect(/Rival tubs/.test(body), 'a Rival tubs section is there');
      t.expect(/far ahead of you eases off/.test(body) && /far behind speeds up/.test(body), 'it says both directions');
      t.expect(/Splash does this most, Soak a bit less, Scald hardly at all and Boil not at all/.test(body), 'it names the classes in order');
      await t.page.evaluate(() => { const h = Array.from(document.querySelectorAll('.panel.help h3')).find((e) => /Rival tubs/.test(e.textContent)); h.scrollIntoView({ block: 'center' }); });
      await t.waitFrames(2);
      await shot(t, 'S3-08', 'help-rivals');
      await t.checkLayout({ allowScrollY: true });
    },
  },
  // ---------------------------------------------------------------- S3-15
  {
    name: 'council D S3-15: the cup card and the standings say how points work, the tie-break, the reward and where you stand',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await freshProfile(t);
      await t.game('scene', 'title'); await t.waitFrames(2);
      await t.game('act', 'menu', 'gp'); await t.game('act', 'menu', 'teamOk'); await t.game('act', 'menu', 'cls', { id: 'soak' });
      await t.waitFrames(3);
      t.equal(await t.page.evaluate(() => document.body.dataset.screen), 'cups', 'the cup choice is up');
      const rules = await text(t, '.panel.cups .cup-rules');
      t.expect(/1st 10, 2nd 8, 3rd 6, 4th 5, 5th 4, 6th 3, 7th 2, 8th 1/.test(rules), 'the points table: ' + rules);
      t.expect(/10\+ gallons and all four items/.test(rules) && /Tickets break a tie/.test(rules) && /Win a cup to unlock new teams and speed classes/.test(rules), 'clean rule, tie-break and reward: ' + rules);
      await shot(t, 'S3-15', 'cup-points');
      await t.checkLayout({ allowScrollY: true });
      // standings after race 2 of 4: the player is fourth
      const rows = IDS.slice(0, 5).map((id, i) => ({ team: id, points: 30 - i * 4, clean: i === 1 ? 1 : 0, human: i === 3, bribes: 0 }));
      const show = (extra) => t.page.evaluate(([r, e]) => window.TR_APP.App.screens.show('standings', { rows: r, round: 2, rounds: 4, cupName: 'Bathhouse Cup', final: false, ...e }), [rows, extra]);
      await show({}); await t.waitFrames(2);
      let body = await text(t, '.panel.standings p');
      t.expect(/You are 12 points behind the leader\./.test(body) && /Third place has 22\./.test(body) && /2 races to go: the top three win a Faucet trophy\./.test(body), 'where the player stands: ' + body);
      t.expect(/CLEAN = 10\+ gallons and all four items: one more point\. Tickets break a tie\./.test(body), 'the legend is text: ' + body);
      await shot(t, 'S3-15', 'standings');
      await t.checkLayout({ allowScrollY: true });
      await t.page.evaluate((r) => window.TR_APP.App.screens.show('standings', { rows: r, round: 3, rounds: 4, cupName: 'x', final: false }), [{ team: IDS[0], points: 9, clean: 0, human: true }, { team: IDS[1], points: 8, clean: 0, human: false }]);
      body = await text(t, '.panel.standings p');
      t.expect(/You lead by 1 point\. 1 race to go/.test(body), 'a lead of one point, one race to go: ' + body);
      await t.page.evaluate((id) => window.TR_APP.App.screens.show('standings', { rows: [{ team: id, points: 9, clean: 0, human: true }], round: 4, rounds: 4, cupName: 'x', final: true }), IDS[0]);
      body = await text(t, '.panel.standings p');
      t.expect(!/to go/.test(body), 'after the last race there is no race to go: ' + body);
    },
  },
  {
    name: 'council D S3-15: the CLEAN badge is explained in text on the results, not in a tooltip',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await freshProfile(t);
      const open = (humanClean) => t.page.evaluate(([c, ids]) => { const mk = (h) => [0, 1].map((i) => ({ place: i + 1, team: ids[i], human: i === 1, time: 90 + i, gal: 14, clean: i === 0 || (i === 1 && h), points: 10, tickets: 0, lost: [], dry: false })); window.TR_APP.App.screens.show('results', { results: mk(c), laps: 3, trackName: 'Bathhouse Row' }); }, [humanClean, IDS]);
      await open(false); await t.waitFrames(2);
      t.equal(await t.page.evaluate(() => document.querySelectorAll('.rtable [title]').length), 0, 'no tooltip on the badge');
      const legend = await text(t, '.panel.results .clean-note');
      t.expect(/CLEAN = 10\+ gallons and all four items, one more point\./.test(legend), 'the legend is under the table when a rival is clean: ' + legend);
      await shot(t, 'S3-15', 'results-legend');
      await open(true); await t.waitFrames(2);
      t.equal(await t.page.evaluate(() => document.querySelectorAll('.panel.results .clean-note').length), 1, 'when you are clean the one line already says the rule');
    },
  },
  // ---------------------------------------------------------------- S6-20
  {
    name: 'council D S6-20: a start that fails shows a card with plain words and a Reload that works',
    viewports: ['desktop', 'mobile'],
    allowConsoleErrors: true, // a start that fails reports its error to the console, on purpose
    async run(t) {
      await t.waitIdle(8000);
      let blocked = true;
      await t.page.route('**/assets/tracks.js', (r) => (blocked ? r.abort() : r.continue()));
      await t.page.reload();
      await t.page.waitForFunction(() => { const c = document.querySelector('#boot-fail'); return c && !c.hidden; }, null, { timeout: 15000 });
      const card = await t.page.evaluate(() => { const c = document.querySelector('#boot-fail'); const b = c.querySelector('#boot-reload').getBoundingClientRect(); return { text: c.innerText.split(/\s+/).join(' '), role: c.getAttribute('role'), btn: [b.width, b.height], focus: document.activeElement && document.activeElement.id, bare: document.querySelector('#boot-error').hidden }; });
      t.expect(/The tubs could not leave the garage/.test(card.text) && /Reload the page to try again/.test(card.text), 'plain words: ' + card.text);
      t.expect(/Could not start/.test(card.text), 'the technical line is kept, small, for anyone who needs it: ' + card.text);
      t.equal(card.role, 'alert', 'announced to screen readers');
      t.equal(card.bare, true, 'the bare error line is not shown');
      t.expect(card.btn[0] >= 44 && card.btn[1] >= 44, 'the Reload button is a touch target: ' + card.btn);
      t.equal(card.focus, 'boot-reload', 'the button has focus, so Enter reloads');
      await shot(t, 'S6-20', 'boot-failure');
      await t.checkLayout();
      blocked = false;
      await t.page.click('#boot-reload');
      await t.page.waitForFunction(() => window.__game, null, { timeout: 20000 });
      await t.waitIdle(8000);
      t.equal(await t.page.evaluate(() => document.querySelector('#boot-fail').hidden), true, 'after Reload the game starts and the card is gone');
    },
  },
  // ---------------------------------------------------------------- P-N03
  {
    name: 'council D P-N03: Space presses the focused button in menus, and is still Hop in a race',
    viewports: ['desktop'],
    async run(t) {
      await freshProfile(t);
      await t.game('scene', 'title'); await t.waitFrames(3);
      await t.page.focus('[data-act="settings"]');
      await t.page.keyboard.press('Space');
      await t.page.waitForFunction(() => document.body.dataset.screen === 'settings', null, { timeout: 4000 });
      // a settings chip toggles with Space as it does with Enter
      const chip = await t.page.evaluate(() => { const c = document.querySelector('.panel.settings button.chip[aria-pressed="false"]'); c.focus(); return { act: c.dataset.act, k: c.dataset.k || '', v: c.dataset.v }; });
      await t.page.keyboard.press('Space');
      await t.page.waitForFunction((c) => { const e = Array.from(document.querySelectorAll('.panel.settings button.chip')).find((x) => x.dataset.act === c.act && (x.dataset.k || '') === c.k && x.dataset.v === c.v); return e && e.getAttribute('aria-pressed') === 'true'; }, chip, { timeout: 4000 }).catch(() => t.fail('Space did not press the focused chip ' + JSON.stringify(chip)));
      // the event is left alone with a menu open, and taken as Hop in a race
      const pressed = () => t.page.evaluate(() => { const e = new KeyboardEvent('keydown', { code: 'Space', key: ' ', cancelable: true, bubbles: true }); window.dispatchEvent(e); return e.defaultPrevented; });
      t.equal(await pressed(), false, 'a menu leaves Space to the button');
      await t.game('act', 'menu', 'back');
      await t.waitIdle(8000);
      await t.game('newGame', { track: 'bathhouse-row', team: 'engine-six', classId: 'soak', laps: 1, seed: 5, paused: true });
      await t.game('act', 'skipCountdown'); await t.waitFrames(3);
      t.equal(await t.page.evaluate(() => document.body.dataset.screen || null), null, 'the race has no menu up');
      t.equal(await pressed(), true, 'in a race Space is Hop');
      await t.page.keyboard.up('Space');
      // the pause menu: Space presses Resume
      await t.page.keyboard.press('Escape');
      await t.page.waitForFunction(() => document.body.dataset.screen === 'pause', null, { timeout: 4000 });
      await t.page.keyboard.press('Space');
      await t.page.waitForFunction(() => !document.body.dataset.screen, null, { timeout: 4000 });
    },
  },
  // ---------------------------------------------------------------- S2-04
  {
    name: 'council D S2-04: pushing from READY is a false start the player is told about; a press just before SCRUB! is the start boost',
    node: true,
    async run(t) {
      const tr = track('bathhouse-row');
      // the human presses Push at `from` seconds (relative to SCRUB!) and holds it; returns the human's events on the step the race begins
      const go = (from) => {
        const r = makeRace(tr, { seed: 5, classId: 'soak', player: 'engine-six', laps: 1 });
        const me = r.karts[r.player];
        let begin = null;
        for (let i = 0; i < 400 && !begin; i++) {
          const inp = [];
          inp[r.player] = { steer: 0, push: from != null && r.time >= from ? 1 : 0, brake: false, hop: false, back: false, item: false };
          stepRace(r, tr, inp, DT);
          if (r.phase === 'race') begin = { events: me.events.map((e) => e.type + (e.kind ? ':' + e.kind : '')), state: me.state };
        }
        return begin;
      };
      const held = go(-3.2), early = go(-1.4), none = go(null), late = go(-0.3);
      t.expect(held.events.includes('falsestart') && held.state === 'swap', 'holding Push from READY is a false start: ' + JSON.stringify(held));
      t.expect(!held.events.some((e) => e.startsWith('boost')), 'and gives no boost');
      t.expect(!early.events.includes('falsestart') && !early.events.some((e) => e.startsWith('boost')), 'a press after the early window is neither: ' + JSON.stringify(early));
      t.expect(none.events.length === 0, 'no press, no event: ' + JSON.stringify(none));
      t.expect(late.events.includes('boost:start') && !late.events.includes('falsestart'), 'a press in the last half second is the start boost: ' + JSON.stringify(late));
    },
  },
  {
    name: 'council D S2-04: the countdown teaches the GREAT START from SET, a false start flashes, and Auto-push does not false-start',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await freshProfile(t);
      const begin = async (o = {}) => { await t.waitIdle(8000); await t.game('newGame', { track: 'bathhouse-row', team: 'engine-six', classId: 'soak', laps: 1, seed: 5, paused: true, ...o }); await t.waitFrames(3); };
      const hint = () => t.page.evaluate(() => { const e = document.querySelector('.hud-start'); return { text: e.textContent, shown: e.classList.contains('show') && getComputedStyle(e).display !== 'none' }; });
      const at = async (secs) => { const now = (await t.state()).race.time; await t.game('step', Math.max(1, Math.ceil((secs - now) * 60))); await t.waitFrames(2); };
      await begin();
      let h = await hint();
      t.expect(!h.shown, 'under READY the hint is not up yet');
      await at(-1.8);
      h = await hint();
      const word = t.viewport === 'mobile' ? 'Tap Push' : 'Tap ↑';
      t.expect(h.shown && h.text === word + ' just before SCRUB! for a GREAT START', 'from SET it says how, in the words of the device: ' + JSON.stringify(h));
      await shot(t, 'S2-04', 'start-hint');
      await t.checkLayout();
      await t.game('act', 'skipCountdown'); await t.waitFrames(3);
      t.expect(!(await hint()).shown, 'it is gone once the race runs');
      // a false start flashes the call-out and plays the bump cue
      await begin();
      await t.game('act', 'input', { steer: 0, push: 1, brake: false, hop: false, back: false, item: false });
      await at(0.05);
      const call = await t.page.evaluate(() => document.querySelector('.hud-call').textContent);
      t.expect(/FALSE START/.test(call), 'a false start is called out: ' + call);
      await shot(t, 'S2-04', 'false-start');
      await t.game('act', 'input', null);
      // Auto-push does not push through the countdown, so it is never a false start, and its hint says so
      await setSave(t, { ...DEFAULT_SAVE(), settings: { ...DEFAULT_SAVE().settings, seenIntro: true, autoPush: true } });
      await t.reload(); await begin();
      await at(-1.8);
      t.equal((await hint()).text, 'Auto-push takes over at SCRUB!', 'the hint for Auto-push');
      await at(0.05);
      const auto = await t.page.evaluate(() => ({ call: document.querySelector('.hud-call').textContent }));
      t.expect(!/FALSE START/.test(auto.call), 'Auto-push is not a false start: ' + auto.call);
    },
  },
  // ---------------------------------------------------------------- S4-09
  {
    name: 'council D S4-09: the sun-shadow filter widens for the low sun of Park Avenue Nights and Sunset Ridge, and nowhere else',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await freshProfile(t);
      const soft = {};
      for (const id of ['bathhouse-row', 'bridge-street', 'park-avenue', 'sunset-ridge']) {
        await t.game('newGame', { track: id, team: 'engine-six', classId: 'soak', laps: 1, seed: 5, paused: true });
        await t.game('act', 'skipCountdown'); await t.waitFrames(3);
        const s = await t.state();
        soft[id] = s.render.shadowSoft;
        if (id === 'park-avenue' || id === 'sunset-ridge') { await t.game('step', 240); await t.waitFrames(4); await shot(t, 'S4-09', id); }
      }
      t.equal(soft['bathhouse-row'], 1, 'a daylight course keeps the filter it had: ' + JSON.stringify(soft));
      t.equal(soft['bridge-street'], 1, 'so does another: ' + JSON.stringify(soft));
      t.expect(soft['park-avenue'] > 1.5 && soft['park-avenue'] < soft['sunset-ridge'], 'dusk is widened, sunset more: ' + JSON.stringify(soft));
      t.expect(soft['sunset-ridge'] <= 2.5 + 1e-9, 'and never past the stated top: ' + JSON.stringify(soft));
    },
  },
];
