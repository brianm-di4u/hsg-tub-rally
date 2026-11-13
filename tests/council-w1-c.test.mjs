// Wave 1, batch C regressions: S2-05 (Back must not quit a cup), S2-10 (HUD labels), S2-28 (small title screen), P-N04 (Row text and awards).
import assert from 'node:assert/strict';
import { awards } from '../src/js/sim/rules-real.js';

async function toGpResults(t) {
  await t.waitIdle(8000);
  await t.game('act', 'menu', 'gp');
  await t.game('act', 'menu', 'cup', { id: 'bathhouse' });
  await t.waitIdle(8000);
  await t.game('newGame', { mode: 'gp', track: 'bathhouse-row', team: 'engine-six', classId: 'soak', laps: 1, seed: 12, autoplay: true, paused: true });
  await t.stepUntil((st) => st.race.phase === 'done', { max: 60 * 300, chunk: 600, label: 'race done' });
  await t.waitFrames(5);
}

export const tests = [
  {
    name: 'council C S2-05: Esc, Backspace and pad B do not quit a Grand Prix; Quit cup asks twice',
    viewports: ['desktop'],
    async run(t) {
      await toGpResults(t);
      t.equal((await t.state()).screen, 'results', 'results shown');
      await t.page.keyboard.press('Escape');
      await t.page.keyboard.press('Backspace');
      await t.waitFrames(3);
      t.equal((await t.state()).screen, 'results', 'Esc and Backspace leave the results screen alone');
      await t.page.locator('[data-act="standingsGo"]').click();
      await t.waitFrames(3);
      t.equal((await t.state()).screen, 'standings', 'standings shown');
      await t.page.keyboard.press('Escape');
      await t.page.keyboard.press('Backspace');
      await t.waitFrames(3);
      t.equal((await t.state()).screen, 'standings', 'Esc and Backspace leave the standings alone');
      await t.page.locator('[data-act="quitCup"]').click();
      await t.waitFrames(3);
      t.equal((await t.state()).screen, 'standings', 'one press of Quit cup does not quit');
      t.expect(/again/i.test(await t.page.locator('[data-act="quitCup"]').textContent()), 'the button asks for a second press');
      await t.page.locator('[data-act="quitCup"]').click();
      await t.waitFrames(3);
      t.equal((await t.state()).screen, 'title', 'second press quits to the title');
    },
  },
  {
    name: 'council C S2-10: HUD labels are whole words, an empty orb says ITEM, dead orb and tickets are hidden in Row',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(8000);
      await t.game('newGame', {});
      await t.game('act', 'skipCountdown');
      await t.waitFrames(5);
      const labels = await t.page.evaluate(() => [...document.querySelectorAll('.hud-pips .pip em')].map((e) => e.textContent));
      t.equal(labels.join(','), 'Towel,Mat,Soap,Loofah', 'pip labels');
      const orb = await t.page.evaluate(() => {
        const b = document.querySelector('.hud-item .bubble'), cs = getComputedStyle(b, '::after');
        return { content: cs.content, borderStyle: getComputedStyle(b).borderTopStyle, shown: getComputedStyle(document.querySelector('.hud-item')).display !== 'none' };
      });
      t.expect(orb.shown, 'item orb shown in a normal race');
      t.expect(/ITEM/.test(orb.content), 'empty orb reads ITEM: ' + orb.content);
      t.equal(orb.borderStyle, 'dashed', 'empty orb has a dashed outline');
      await t.shot('hud-empty-orb');
      await t.game('newGame', { mode: 'row', track: 'bathhouse-row', team: 'engine-six', heatTeams: ['engine-six', 'lather-linen'], label: 'Semifinal' });
      await t.waitFrames(5);
      t.equal(await t.page.evaluate(() => getComputedStyle(document.querySelector('.hud-item')).display), 'none', 'no item orb or ticket counter in a Row heat');
    },
  },
  {
    name: 'council C S2-28: at 320x568 the title logo and every button can be reached',
    viewports: ['desktop'],
    async run(t) {
      await t.page.setViewportSize({ width: 320, height: 568 });
      await t.reload();
      await t.waitIdle(8000);
      await t.waitFrames(3);
      const r = await t.page.evaluate(async () => {
        const s = document.querySelector('.screens'), top = (sel) => document.querySelector(sel).getBoundingClientRect();
        s.scrollTop = 0; await new Promise((f) => requestAnimationFrame(f));
        const logoTop = top('.logo canvas').top;
        const scrolls = s.scrollHeight > s.clientHeight + 1;
        s.scrollTop = s.scrollHeight; await new Promise((f) => requestAnimationFrame(f));
        const credits = top('[data-act="credits"]');
        return { logoTop, scrolls, creditsBottom: credits.bottom, vh: innerHeight, overflowY: getComputedStyle(s).overflowY };
      });
      t.expect(r.logoTop >= 0, 'logo starts inside the viewport: ' + r.logoTop);
      t.expect(r.creditsBottom <= r.vh, 'Credits reachable by scrolling: bottom ' + r.creditsBottom + ' of ' + r.vh);
      t.expect(r.scrolls || r.creditsBottom <= r.vh, 'panel scrolls');
      await t.shot('title-320x568');
    },
  },
  {
    name: 'council C P-N04: Row intro no longer promises bribes, the HUD hides tickets, Most Spirit is its own award',
    node: true,
    run() {
      const heats = [
        { results: [
          { team: 'a', human: true, time: 100, dq: null, tickets: 0, refilled: 2, gal: 11, items: 4 },
          { team: 'b', time: 101, dq: null, tickets: 0, refilled: 1, gal: 18, items: 4 },
        ] },
        { results: [
          { team: 'a', human: true, time: 99, dq: null, tickets: 0, refilled: 2, gal: 12, items: 4 },
          { team: 'c', time: 120, dq: null, tickets: 0, refilled: 5, gal: 10, items: 4 },
        ] },
      ];
      const a = awards(heats, { int: () => 0 });
      assert.equal(a.bestOverall, 'a');
      assert.equal(a.mostSpirit, 'b', 'Most Spirit goes to the tub that kept the most water, not the fastest');
      assert.equal(a.fanAward, 'c');
    },
  },
  {
    name: 'council C P-N04: Rules of the Row text has no bribe or ticket line',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      await t.game('act', 'menu', 'row');
      await t.game('act', 'menu', 'teamOk');
      await t.page.waitForSelector('.rowintro', { timeout: 15000 });
      const txt = await t.page.locator('.rowintro').innerText();
      t.expect(!/bribe|ticket/i.test(txt), 'no bribe or ticket mention: ' + txt.match(/.*(bribe|ticket).*/i));
      t.expect(/head start/i.test(txt), 'head start whim still described');
    },
  },
];
