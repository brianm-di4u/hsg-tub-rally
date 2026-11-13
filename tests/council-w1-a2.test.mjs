// Wave 1, batch A2 regressions: frame guard and context loss (S6-03, S6-08), audio unlock (S5-30), setting values (S6-04).

export const tests = [
  {
    name: 'council A2 S6-03: an exception in one frame does not stop the race or the picture',
    viewports: ['desktop'],
    allowConsoleErrors: true,
    async run(t) {
      await t.waitIdle(8000);
      await t.game('newGame', {});
      await t.game('act', 'skipCountdown');
      await t.waitFrames(5);
      const errors = [];
      t.page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
      await t.page.evaluate(() => {
        window.__draws = 0;
        for (const P of [window.WebGL2RenderingContext, window.WebGLRenderingContext]) {
          if (!P) continue;
          for (const fn of ['drawElements', 'drawArrays', 'drawElementsInstanced']) {
            const orig = P.prototype[fn]; if (!orig) continue;
            P.prototype[fn] = function (...a) { window.__draws++; return orig.apply(this, a); };
          }
        }
        navigator.getGamepads = () => { throw new Error('boom'); };
      });
      await t.waitFrames(30);
      const draws = await t.page.evaluate(() => { delete navigator.getGamepads; return window.__draws; });
      t.expect(draws > 0, 'the picture kept being drawn through the failing frames (' + draws + ' draw calls)');
      t.expect(errors.length >= 1 && errors.length <= 3, 'the error is reported, but not once per frame (' + errors.length + ')');
    },
  },
  {
    name: 'council A2 S6-03 S6-08: losing and restoring the WebGL context shows a notice, then recovers',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(8000);
      await t.game('newGame', {});
      await t.game('act', 'skipCountdown');
      await t.waitFrames(5);
      await t.page.evaluate(() => {
        const gl = document.querySelector('#gl').getContext('webgl2') || document.querySelector('#gl').getContext('webgl');
        window.__lose = gl.getExtension('WEBGL_lose_context');
        window.__lose.loseContext();
      });
      await t.page.waitForFunction(() => { const e = document.querySelector('#boot-error'); return e && !e.hidden && /graphics/i.test(e.textContent); }, null, { timeout: 5000 });
      t.expect(true, 'notice shown while the context is lost');
      const steps = (await t.state()).steps;
      await t.waitFrames(10);
      t.expect((await t.state()).steps > steps, 'the simulation is not stalled by the lost context');
      await t.page.evaluate(() => window.__lose.restoreContext());
      await t.page.waitForFunction(() => document.querySelector('#boot-error').hidden, null, { timeout: 5000 });
      await t.waitFrames(5);
      const s = await t.state();
      t.expect(s.render.draws > 0, 'drawing again after restore (' + s.render.draws + ' draws)');
      await t.shot('after-context-restore');
    },
  },

];
