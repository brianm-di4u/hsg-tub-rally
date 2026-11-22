// Wave 3 follow-ups: S2-17 (touch lines name the right side when Touch layout is Mirrored) and S4-08 (two more local facts).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FACTS } from '../src/js/data/facts.js';
import { DEFAULT_KEYS } from '../src/js/ui/input.js';
import '../assets/teach.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TEACH = globalThis.TR_TEACH;
const KEY = 'hsg-tub-rally-v1';
const SHOTS = 'screenshots/council/wave-3/shots';
const shot = async (t, id, what) => { await t.shot(`w3fu-${id}-${what}`); fs.mkdirSync(SHOTS, { recursive: true }); await t.page.screenshot({ path: `${SHOTS}/${id}-${what}-${t.viewport === 'mobile' ? 'mobile' : 'desktop'}.png` }); };
const helpText = (t) => t.page.evaluate(() => document.querySelector('.panel.help')?.innerText || '');

export const tests = [
  // ---------------------------------------------------------------- S2-17
  {
    name: 'council FU S2-17: the touch tips say which side steers, by the Touch layout',
    node: true,
    async run(t) {
      const kb = JSON.parse(JSON.stringify(DEFAULT_KEYS));
      t.expect(/Drag the left side to steer/.test(TEACH.say('goal', 'touch', true, kb, false)), 'Standard: the left side');
      t.expect(/Drag the right side to steer/.test(TEACH.say('goal', 'touch', true, kb, true)), 'Mirrored: the right side');
      t.expect(/Hold Push; drag the right side to steer/.test(TEACH.say('goal', 'touch', false, kb, true)), 'Mirrored, no auto-push: the right side');
      t.expect(/Drag the left side/.test(TEACH.say('goal', 'touch', true, kb)), 'an unspecified layout is Standard');
      t.expect(TEACH.say('goal', 'touch', true, kb, true).split(/\s+/).length <= 12, 'still twelve words or fewer');
    },
  },
  {
    name: 'council FU S2-17: How to Play and the first-run tip name the steering side for a Mirrored layout',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(8000);
      for (const lefty of [false, true]) {
        await t.game('setState', { settings: { lefty } });
        await t.game('scene', 'help');
        await t.waitFrames(2);
        if (t.viewport === 'desktop' && (await t.page.locator('[data-act="helpAll"]').getAttribute('aria-expanded')) !== 'true') { await t.page.locator('[data-act="helpAll"]').click(); await t.waitFrames(2); }
        const text = await helpText(t);
        const want = lefty ? 'right' : 'left', other = lefty ? 'left' : 'right';
        t.expect(text.includes(`Drag anywhere on the ${want} half of the screen to steer.`), `${lefty ? 'Mirrored' : 'Standard'}: How to Play names the ${want} half`);
        t.expect(!text.includes(`on the ${other} half`), 'and not the other one');
        if (lefty) { await shot(t, 'S2-17', 'help-mirrored'); await t.checkLayout({ allowScrollY: true }); }
      }
      if (t.viewport === 'mobile') {
        await t.page.evaluate((k) => localStorage.removeItem(k), KEY);
        await t.reload(); await t.waitIdle(8000);
        await t.game('setState', { settings: { lefty: true } });
        await t.game('newGame', { mode: 'quick', track: 'bathhouse-row', count: 8, paused: true });
        await t.waitFrames(2);
        await t.game('step', 20);
        const tip = await t.page.evaluate(() => { const e = document.querySelector('.hud-tip'); return e && !e.hidden ? e.firstChild.textContent : null; });
        t.expect(/^Goal: finish first\. Drag the right side to steer\.$/.test(tip || ''), 'the first-run tip on a Mirrored layout: ' + tip);
      }
    },
  },

  // ---------------------------------------------------------------- S4-08
  {
    name: 'council FU S4-08: the West Mountain Lake Hamilton view and the Hill Wheatley jug fountain are facts with source keys from the repo',
    node: true,
    async run(t) {
      const tc = fs.readFileSync(path.join(ROOT, 'research', 'town-content.md'), 'utf8');
      const west = FACTS['west-mountain'].find((f) => /Lake Hamilton/.test(f.t));
      const jug = FACTS['hill-wheatley'].find((f) => /jug/.test(f.t));
      t.expect(!!west && west.src === 'nps-overlooks', 'a West Mountain fact about the Lake Hamilton view, from nps-overlooks');
      t.expect(!!jug && jug.src === 'hsguides', 'a Hill Wheatley fact about the thermal-water jug fountain, from the town-content listing: ' + (jug && jug.src));
      t.expect(/`hsguides`/.test(tc), 'that source key is in the §9 table');
      t.expect(/summit view south to the Trap Mountains and Lake Hamilton/.test(tc) && /thermal-water jug fountain/.test(tc), 'both claims are in research/town-content.md');
    },
  },
];
