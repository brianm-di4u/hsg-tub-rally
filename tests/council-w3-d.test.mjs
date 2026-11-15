// Wave 3, batch D: feedback, teaching and help (S3-08, S3-15, S6-20, P-N03, S2-04) and sound (S3-12, S4-22, S5-09, S5-13),
// and the dusk shadows (S4-09).
import fs from 'node:fs';
import { CLASSES, TEAMS } from '../src/js/data/teams.js';
import { DEFAULT_SAVE } from '../src/js/save.js';

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
];
