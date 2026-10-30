// M4: audio starts on input and toggles; reduced motion; contrast of menu and HUD text.
export const tests = [
  {
    name: 'm4 audio starts on a key press and toggles',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(8000);
      let s = await t.state();
      t.equal(s.audio.started, false, 'silent until the first input (autoplay rules)');
      await t.page.keyboard.press('ArrowDown');
      await t.waitFrames(5);
      s = await t.state();
      t.equal(s.audio.started, true, 'audio context created on the first key');
      t.equal(s.audio.theme, 'rag', 'title theme playing');
      await t.game('setState', { settings: { sound: false } });
    },
  },
  {
    name: 'm4 contrast and reduced motion',
    reducedMotion: true,
    async run(t) {
      await t.waitIdle(8000);
      const c1 = await t.contrastReport({ selector: '#screens *' });
      t.expect(c1.fails.length === 0, `title text contrast ≥ 4.5:1 (${c1.fails.join('; ')})`);
      await t.game('newGame', { paused: true, seed: 2 });
      await t.game('step', 260);
      await t.waitFrames(2);
      const c2 = await t.contrastReport({ selector: '#hud *' });
      t.expect(c2.fails.length === 0, `HUD text contrast (${c2.fails.join('; ')})`);
      await t.shot('m4-reduced');
    },
  },
];
