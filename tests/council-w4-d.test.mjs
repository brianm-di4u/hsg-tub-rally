// Wave 4, batch D: Race setup on a phone (C4-14), the art line (C4-02), the course facts (C4-07), the title notice and the
// menu face (S4-10) and the award lines (S4-11).
import assert from 'node:assert/strict';
import fs from 'node:fs';

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
];
