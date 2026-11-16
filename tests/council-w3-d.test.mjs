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
// spectral centroid (Hz) of the mono mix of a base64 16-bit stereo WAV between two times, by a plain FFT (as in council-w2-a)
function centroid(b64, from, rate = 22050) {
  const b = Buffer.from(b64, 'base64'), N = 4096, start = Math.floor(from * rate), re = new Float64Array(N), im = new Float64Array(N);
  for (let i = 0; i < N; i++) { const j = start + i; const v = j * 4 + 46 < b.length ? (b.readInt16LE(44 + j * 4) + b.readInt16LE(46 + j * 4)) / 65536 : 0; re[i] = v * (0.5 - 0.5 * Math.cos((2 * Math.PI * i) / N)); }
  for (let i = 1, j = 0; i < N; i++) { let bit = N >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit; if (i < j) { [re[i], re[j]] = [re[j], re[i]]; } }
  for (let len = 2; len <= N; len <<= 1) {
    const ang = (-2 * Math.PI) / len, wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < N; i += len) { let cr = 1, ci = 0; for (let k = 0; k < len / 2; k++) { const a = i + k, c = a + len / 2, xr = re[c] * cr - im[c] * ci, xi = re[c] * ci + im[c] * cr; re[c] = re[a] - xr; im[c] = im[a] - xi; re[a] += xr; im[a] += xi; const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t; } }
  }
  let num = 0, den = 0; for (let i = 1; i < N / 2; i++) { const m = Math.hypot(re[i], im[i]); num += m * ((i * rate) / N); den += m; }
  return num / (den || 1);
}
const render = (t, name, secs, wav, args) => t.page.evaluate(([n, s, w, a]) => window.__game.audioRender(n, s, w, a), [name, secs, !!wav, args || []]);
const unlock = async (t) => { await t.waitIdle(8000); await t.page.keyboard.press('Shift'); await t.page.waitForFunction(() => window.__game.getState().audio.ctx === 'running', null, { timeout: 5000 }); };
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
      const legend = await text(t, '.panel.results .clean-legend');
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
      // C4-09: a Space in the first half second of a new screen is held back, so each press waits for the screen to be that old
      const aged = () => t.page.waitForFunction(() => window.__game.getState().screenMs > 650, null, { timeout: 4000 });
      await freshProfile(t);
      await t.game('scene', 'title'); await t.waitFrames(3);
      await t.page.focus('[data-act="settings"]');
      await aged();
      await t.page.keyboard.press('Space');
      await t.page.waitForFunction(() => document.body.dataset.screen === 'settings', null, { timeout: 4000 });
      // a settings chip toggles with Space as it does with Enter
      const chip = await t.page.evaluate(() => { const c = document.querySelector('.panel.settings button.chip[aria-pressed="false"]'); c.focus(); return { act: c.dataset.act, k: c.dataset.k || '', v: c.dataset.v }; });
      await aged();
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
      await aged();
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
      const word = t.viewport === 'mobile' ? 'Press and hold Push' : 'Press and hold ↑';
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
  // ---------------------------------------------------------------- S5-09
  {
    name: 'council D S5-09: the countdown beeps on READY, SET and the blank, rising, and go sits an octave above the last',
    viewports: ['desktop'],
    async run(t) {
      await freshProfile(t);
      await unlock(t);
      await t.game('newGame', { track: 'bathhouse-row', team: 'engine-six', classId: 'soak', laps: 1, seed: 5, paused: true });
      const to = async (secs) => { const now = (await t.state()).race.time; await t.game('step', Math.max(1, Math.ceil((secs - now) * 60))); await t.waitFrames(1); };
      const beeps = async () => (await t.state()).audio.cues.filter((c) => /^(ready|go)/.test(c)).join(' ');
      await to(-3.1);
      t.equal(await beeps(), 'ready:0', 'READY has its beep as it comes up');
      await to(-2.0);
      t.equal(await beeps(), 'ready:0 ready:1', 'SET has the next');
      await to(-0.9);
      t.equal(await beeps(), 'ready:0 ready:1 ready:2', 'the blank before SCRUB! has the third');
      await to(0.05);
      t.equal(await beeps(), 'ready:0 ready:1 ready:2 go', 'then go');
      // the pitches climb: the brightness of each cue, rendered, rises through the three beeps and go is above the last
      const c = [];
      for (const [name, args] of [['cue:ready', [0]], ['cue:ready', [1]], ['cue:ready', [2]], ['cue:go', []]]) c.push(centroid((await render(t, name, 0.5, true, args)).wav, 0.06));
      t.expect(c[1] > c[0] * 1.05 && c[2] > c[1] * 1.05 && c[3] > c[2] * 1.05, 'centroids rise: ' + c.map(Math.round).join(', '));
    },
  },
  // ---------------------------------------------------------------- S4-22
  {
    name: 'council D S4-22: arrow keys tick, a pressed button chirps (Back falls), a locked card ticks, the trophy plays a fanfare, and Sound off silences all of it',
    viewports: ['desktop'],
    async run(t) {
      await freshProfile(t);
      await unlock(t);
      await t.game('scene', 'title'); await t.waitFrames(3);
      const cues = async () => (await t.state()).audio.cues;
      const since = async (n) => (await cues()).slice(n);
      let n = (await cues()).length;
      await t.page.keyboard.press('ArrowDown');
      await t.waitFrames(2);
      t.expect((await since(n)).includes('tick'), 'moving focus ticks: ' + (await since(n)));
      n = (await cues()).length;
      await t.page.keyboard.press('Enter');
      await t.page.waitForFunction(() => document.body.dataset.screen && document.body.dataset.screen !== 'title', null, { timeout: 4000 });
      t.expect((await since(n)).includes('confirm:false'), 'a pressed button chirps: ' + (await since(n)));
      n = (await cues()).length;
      await t.page.click('[data-act="back"], [data-back]');
      await t.waitFrames(2);
      t.expect((await since(n)).includes('confirm:true'), 'Back chirps downward: ' + (await since(n)));
      // a locked card
      await t.game('scene', 'title'); await t.waitFrames(2);
      await t.game('act', 'menu', 'gp'); await t.game('act', 'menu', 'teamOk'); await t.game('act', 'menu', 'cls', { id: 'soak' }); await t.waitFrames(3);
      n = (await cues()).length;
      await t.page.click('.ccard[data-act="locked"]', { force: true }); // aria-disabled, but it answers a press
      await t.waitFrames(2);
      t.expect((await since(n)).includes('tick') && !(await since(n)).some((c) => c.startsWith('confirm')), 'a locked card only ticks: ' + (await since(n)));
      // the trophy: gold gets the full fanfare
      await t.game('act', 'menu', 'cup', { id: 'bathhouse' });
      await t.waitIdle(15000);
      const field = await t.state();
      const teams = field.race.karts.map((k) => k.team), me = teams[field.race.player];
      const placeIt = (place) => t.page.evaluate(([p, ids, who]) => {
        const order = ids.filter((x) => x !== who);
        order.splice(p - 1, 0, who);
        window.TR_APP.App.gp.table = Object.fromEntries(order.map((id, i) => [id, { team: id, points: 90 - i * 10, clean: 0, human: id === who, bribes: 0 }]));
      }, [place, teams, me]);
      await placeIt(1);
      n = (await cues()).length;
      await t.game('act', 'menu', 'trophy');
      await t.waitFrames(3);
      t.expect((await since(n)).includes('trophy:1'), 'the trophy screen plays the gold fanfare: ' + (await since(n)));
      t.equal(await t.page.evaluate(() => document.body.dataset.screen), 'trophy', 'and the trophy is up');
      // Sound off: nothing at all
      await t.page.evaluate(() => { const k = 'hsg-tub-rally-v1', s = JSON.parse(localStorage.getItem(k)); s.settings.sound = false; localStorage.setItem(k, JSON.stringify(s)); });
      await t.reload(); await unlock(t);
      await t.game('scene', 'title'); await t.waitFrames(3);
      n = (await cues()).length;
      await t.page.keyboard.press('ArrowDown'); await t.page.keyboard.press('Enter');
      await t.page.waitForFunction(() => document.body.dataset.screen && document.body.dataset.screen !== 'title', null, { timeout: 4000 });
      t.equal((await since(n)).length, 0, 'with Sound off the menus are silent: ' + (await since(n)));
    },
  },
  {
    name: 'council D S4-22: the menu cues sit under the gameplay cues, the trophy is a ceremony cue, and nothing clips at the maximum volume',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      const peaks = async (name, args, vol) => {
        const out = [];
        for (let i = 0; i < 7; i++) out.push((await t.page.evaluate(([n, a, v]) => window.__game.audioRender(n, 2, false, a, v), [name, args, vol])).peak);
        return out.sort((a, b) => a - b);
      };
      // the median is judged; a single repeat may be 1.5 dB outside (the cues differ by 1 to 2 dB from repeat to repeat on purpose)
      const outside = (p, lo, hi) => p.filter((x) => x < lo / 1.19 || x > hi * 1.19).length;
      for (const [c, args, lo, hi] of [['tick', [], 0.12, 0.3], ['confirm', [false], 0.12, 0.3], ['confirm', [true], 0.12, 0.3], ['trophy', [1], 0.2, 0.45], ['trophy', [2], 0.2, 0.45], ['trophy', [4], 0.2, 0.45]]) {
        const p = await peaks('cue:' + c, args);
        const med = p[3];
        t.expect(med >= lo && med <= hi, c + ' ' + JSON.stringify(args) + ' median peak ' + med + ' (want ' + lo + ' to ' + hi + '): ' + p.join(', '));
        t.expect(outside(p, lo, hi) <= 1, c + ' ' + JSON.stringify(args) + ' has more than one repeat 1.5 dB outside: ' + p.join(', '));
      }
      // at the maximum volume (all controls up) the loudest of the new cues, 20 repeats, stays under 0.95
      for (const [c, args] of [['trophy', [1]], ['confirm', [false]]]) {
        const p = await peaks('cue:' + c, args, 1);
        let more = [];
        for (let i = 0; i < 13; i++) more.push((await t.page.evaluate(([n, a]) => window.__game.audioRender(n, 2, false, a, 1), ['cue:' + c, args])).peak);
        t.expect(Math.max(...p, ...more) < 0.95, c + ' at the maximum volume peaks ' + Math.max(...p, ...more));
      }
    },
  },
];
