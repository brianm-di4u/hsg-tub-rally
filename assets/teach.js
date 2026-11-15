// Spa City Tub Rally: first-run race tips (S2-01) and the key-binding screen (S2-06).
// Hand-written classic script (not a generated pack): it loads on demand, for a new player's first race and when
// Settings > Controls opens, so the first-race download stays inside its budget. main.js hands it an API in TR_TEACH.api.
(function (G) {
  'use strict';
  const NAMES = { ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→', ShiftLeft: 'Shift', ShiftRight: 'Shift', ControlLeft: 'Ctrl', ControlRight: 'Ctrl', AltLeft: 'Alt', AltRight: 'Alt', Space: 'Space', Enter: 'Enter', Backspace: 'Backspace', Tab: 'Tab' };
  const keyName = (c) => NAMES[c] || String(c).replace(/^(Key|Digit)/, '').replace(/^Numpad/, 'Num ');
  const first = (b, a) => keyName((b[a] || [])[0] || '');
  const ACTIONS = [['left', 'Steer left'], ['right', 'Steer right'], ['push', 'Push'], ['brake', 'Brake'], ['hop', 'Hop and slide'], ['item', 'Use item'], ['back', 'Look back']];
  const RESERVED = new Set(['Escape', 'Tab', 'Enter', 'Backspace']);

  // ---- the wording of each tip, by the input in use (twelve words or fewer)
  function say(id, dev, auto, b, lefty) {
    const t = dev === 'touch', p = dev === 'gamepad', side = lefty ? 'right' : 'left';
    if (id === 'goal') return t ? (auto ? `Goal: finish first. Drag the ${side} side to steer.` : `Goal: finish first. Hold Push; drag the ${side} side to steer.`)
      : p ? 'Goal: finish first. Hold A to push, stick to steer.' : `Goal: finish first. Hold ${first(b, 'push')} to push, ${first(b, 'left')} ${first(b, 'right')} to steer.`;
    if (id === 'auto') return 'Auto-push is on. Hold Brake to stop; change it in Settings.';
    if (id === 'slide') return `Hold ${t ? 'Hop' : p ? 'RB' : first(b, 'hop')} and steer to slide; let go for a boost.`;
    if (id === 'item') return t ? 'Tap Item to use your item.' : p ? 'Press LB to use your item.' : `Press ${first(b, 'item')} to use your item.`;
    return 'Keep 10 gallons or more for a Clean Finish.';
  }
  // Each tip: when it may appear, when doing the thing dismisses it, and the longest it stays (seconds).
  const SEQ = [
    { id: 'goal', go: () => true, end: (c) => c.race.time > 0.3 && c.me.vf > 5, max: 7 },
    { id: 'auto', go: (c) => c.auto && c.dev === 'touch', end: (c) => c.brake, max: 5 },
    { id: 'slide', go: (c, T) => T.steerT > 0.5 && c.race.time > 2 && c.me.vf > 8 && !c.me.drift, end: (c) => !!c.me.drift || c.hop, max: 7 },
    { id: 'item', go: (c) => !!c.me.held, end: (c) => !c.me.held, max: 6 },
    { id: 'water', go: (c) => c.race.time > 4 && c.me.water.gal < 10, end: () => false, max: 5 },
  ];
  const T = { on: false, cur: null, said: null, shown: null, done: {}, age: 0, gap: 0, steerT: 0, el: null, txt: null, h: null, onSeen: null };
  // the tip sits low on a wide screen, and across the middle of a tall one; clear of the HUD numbers and the controls
  const css = '.hud-tip{position:absolute;left:50%;transform:translateX(-50%);bottom:14px;z-index:3;display:flex;align-items:center;gap:10px;max-width:min(620px,92vw);padding:8px 8px 8px 16px;border-radius:12px;border:3px solid var(--ink);background:rgba(16,20,34,0.86);color:#fff;font:800 17px/1.25 var(--font-ui);pointer-events:auto}'
    + '.hud-tip[hidden]{display:none}.hud-tip button{flex:none;min-width:44px;min-height:44px;padding:6px 12px;border-radius:10px;border:2px solid var(--ink);background:rgba(30,78,121,0.95);color:#fff;font:800 14px var(--font-ui)}'
    + '@media (max-aspect-ratio:4/5){.hud-tip{bottom:auto;top:40%;font-size:15px;width:calc(100vw - 24px);max-width:440px}}'
    + '@media (pointer:coarse) and (min-aspect-ratio:4/5){.hud-tip{left:58%;max-width:min(400px,38vw);font-size:15px}}'
    + '.controls .set-row .chip{min-width:9em}.controls .sub{margin:0}';
  function dom(h) {
    if (T.el && T.el.isConnected) return;
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    T.el = document.createElement('div'); T.el.className = 'hud-tip'; T.el.hidden = true;
    T.el.innerHTML = '<span></span><button type="button" tabindex="-1">Skip tips</button>';
    h.root.appendChild(T.el);
    T.txt = T.el.firstChild;
    T.el.lastChild.addEventListener('click', () => G.TR_TEACH.tipSkip());
    T.el.firstChild.addEventListener('click', () => { if (T.cur) finish(T.cur); });
  }
  function show(id, c) {
    const text = say(id, c.dev, c.auto, c.binds, c.lefty);
    if (T.shown !== text) {
      T.shown = text; T.txt.textContent = text;
      T.el.lastChild.textContent = c.dev === 'keyboard' ? 'Skip tips (T)' : 'Skip tips';
      if (T.said !== id) { T.said = id; T.h.el.sr.textContent = text; }
    }
    T.el.hidden = false;
  }
  function finish(id) { T.done[id] = true; T.cur = null; T.age = 0; T.gap = 0.8; T.shown = null; if (T.el) T.el.hidden = true; }
  function end() { T.on = false; T.cur = null; if (T.el) T.el.hidden = true; }

  G.TR_TEACH = {
    api: null,
    keyName,
    say,
    // tips run until the first race ends or the player skips them; onSeen writes the saved flag
    tipStart(h, onSeen) { Object.assign(T, { on: true, h, onSeen, cur: null, said: null, shown: null, done: {}, age: 0, gap: 0, steerT: 0 }); dom(h); T.el.hidden = true; },
    // once per sim step: c = { race, me, steer, hop, brake, dev, auto, binds, lefty }
    tipStep(c) {
      if (!T.on) return;
      T.steerT = Math.abs(c.steer) > 0.6 ? T.steerT + 1 / 60 : 0;
      if (T.gap > 0) T.gap -= 1 / 60;
      if (!T.cur && T.gap <= 0) { const n = SEQ.find((s) => !T.done[s.id] && s.go(c, T)); if (n) { T.cur = n.id; T.age = 0; } }
      if (!T.cur) return;
      const s = SEQ.find((x) => x.id === T.cur);
      T.age += 1 / 60;
      if (T.age > s.max || s.end(c)) finish(T.cur); else show(T.cur, c);
    },
    tipStop() { end(); },
    tipSkip() { if (!T.on) return false; end(); if (T.onSeen) T.onSeen(); return true; },
    tipFinish() { if (!T.on) return; end(); if (T.onSeen) T.onSeen(); },
    tipState() { return { on: T.on, tip: T.cur, text: T.cur && T.el && !T.el.hidden ? T.txt.textContent : '', done: Object.keys(T.done) }; },
    // ---- the Controls screen
    controlsHtml(app, d) {
      const b = G.TR_TEACH.api.get();
      const rows = ACTIONS.map(([a, label]) => {
        const keys = [...new Set((b[a] || []).map(keyName))].join(' or ');
        return `<div class="set-row two"><span>${label}</span><button type="button" class="chip ${d.capture === a ? 'sel' : ''}" data-act="rebind" data-a="${a}">${d.capture === a ? 'Press a key...' : keys}</button></div>`;
      }).join('');
      return `<div class="panel settings controls" role="dialog" aria-label="Controls">
      <canvas data-pixel="CONTROLS" data-scale="5"></canvas>
      <p class="sub" role="status">${d.msg || 'Choose a control, then press the key you want. Esc cancels.'}</p>${rows}
      <p class="fineprint">Pause stays on Esc and P. Gamepad and touch controls are fixed.</p>
      <nav class="menu row"><button type="button" class="mbtn" data-act="rebindReset">Reset keys</button><button type="button" class="mbtn" data-act="settings" autofocus data-back>Done</button></nav>
    </div>`;
    },
    // a key press while a control waits to be rebound; always consumed. show(data) redraws the Controls screen.
    capture(e, a, show) {
      if (e.repeat) return true;
      const A = G.TR_TEACH.api;
      if (e.code === 'Escape') { show({}); return true; }
      const b = JSON.parse(JSON.stringify(A.get()));
      if (RESERVED.has(e.code) || (b.pause || []).includes(e.code)) { show({ capture: a, msg: 'That key is kept for menus and Pause. Try another.' }); return true; }
      const old = b[a];
      for (const o of ACTIONS.map((x) => x[0])) if (o !== a && b[o].includes(e.code)) b[o] = old.slice(); // a key already in use swaps places
      b[a] = [e.code];
      A.set(b); A.save(b);
      show({ msg: `${ACTIONS.find((x) => x[0] === a)[1]} is now ${keyName(e.code)}.` });
      return true;
    },
  };
})(globalThis);
