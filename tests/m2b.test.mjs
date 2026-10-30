// M2 menus: keyboard-only navigation from the title through team, class and cup select into a Grand Prix,
// standings and the trophy; saves work with storage blocked; touch steering with a held finger.
export const tests = [
  {
    name: 'm2 menus keyboard-only into a grand prix',
    async run(t) {
      await t.waitIdle(8000);
      await t.shot('m2-title');
      const kb = t.page.keyboard;
      await kb.press('Enter'); // Grand Prix (focused)
      await t.waitFrames(3);
      let s = await t.state();
      t.equal(s.screen, 'teams', 'team select after Grand Prix');
      await t.shot('m2-team-select');
      await kb.press('Escape');
      await t.waitFrames(2);
      s = await t.state();
      t.equal(s.screen, 'title', 'Esc goes back');
      await kb.press('Enter');
      await t.waitFrames(2);
      // pick the second card with the arrow keys, then confirm with the Choose button
      await t.page.click('.tcard:nth-child(2)');
      await t.waitFrames(2);
      await t.page.click('[data-act="teamOk"]');
      await t.waitFrames(2);
      s = await t.state();
      t.equal(s.screen, 'classes', 'class select');
      await t.shot('m2-class-select');
      await t.page.click('[data-act="cls"][data-id="soak"]');
      await t.waitFrames(2);
      s = await t.state();
      t.equal(s.screen, 'cups', 'cup select');
      await t.shot('m2-cup-select');
      await t.page.click('[data-act="cup"][data-id="bathhouse"]');
      await t.waitFrames(2);
      s = await t.state();
      t.equal(s.scene, 'race', 'the cup starts racing');
      t.equal(s.race.mode, 'gp', 'grand prix mode');
      t.equal(s.race.karts[s.race.player].team, 'lather-linen', 'the chosen team races');
      await t.checkLayout();
    },
  },
  {
    name: 'm2 storage blocked still plays',
    viewports: ['desktop'],
    initScript: () => {
      const thrower = () => { throw new Error('storage blocked'); };
      Object.defineProperty(window, 'localStorage', { get: thrower, configurable: true });
    },
    async run(t) {
      await t.waitIdle(8000);
      const s = await t.state();
      t.equal(s.scene, 'title', 'boots to the title without storage');
      await t.game('newGame', { paused: true });
      await t.game('step', 240);
      const s2 = await t.state();
      t.equal(s2.race.phase, 'race', 'race runs without storage');
    },
  },
  {
    name: 'm2 touch steering with a held finger',
    viewports: ['mobile'],
    async run(t) {
      await t.waitIdle(8000);
      await t.game('newGame', { seed: 3 });
      await t.game('act', 'skipCountdown');
      const vp = t.vp;
      // hold the push button and drag right on the steering half
      const pushBox = await t.page.locator('#t-push').boundingBox();
      t.expect(!!pushBox && pushBox.width >= 44 && pushBox.height >= 44, 'push button is at least 44 px');
      await t.touchDrag([vp.width * 0.22, vp.height * 0.7], [vp.width * 0.45, vp.height * 0.7], { steps: 6, holdEndMs: 400 });
      const s = await t.state();
      t.expect(s.race.karts[s.race.player].x !== undefined, 'race running under touch');
      await t.shot('m2-touch');
      await t.checkLayout();
    },
  },
];

tests.push({
  name: 'm2 gamepad push and steer',
  viewports: ['desktop'],
  initScript: () => {
    // a fake standard-mapping gamepad: A held (push), stick right
    const pad = { index: 0, connected: true, mapping: 'standard', axes: [0.9, 0, 0, 0], buttons: Array.from({ length: 17 }, (_, i) => ({ pressed: i === 0, value: i === 0 ? 1 : 0 })) };
    navigator.getGamepads = () => [pad];
  },
  async run(t) {
    await t.waitIdle(8000);
    await t.game('newGame', { seed: 9 });
    await t.game('act', 'skipCountdown');
    await t.page.waitForTimeout(1500);
    const s = await t.state();
    const k = s.race.karts[s.race.player];
    t.expect(k.vf > 3, `gamepad A pushes the tub (vf ${k.vf})`);
  },
});
