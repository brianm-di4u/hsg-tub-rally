// Menu screens (DOM): title, pause, results, settings, how-to-play. Keyboard, gamepad and touch friendly:
// every action is a real <button>, arrow keys / d-pad move focus, Enter / A confirms, Esc / B goes back.
import { pixelText } from './pixelfont.js';
import { fmtTime } from './hud.js';
import { TEAM_BY_ID, TEAMS, DIVISIONS, CLASSES, kartStats } from '../data/teams.js';
import { CUPS, TROPHY } from '../data/cups.js';

export class Screens {
  constructor(root, app) {
    this.root = root;
    this.app = app;
    this.cur = null;
    this.trans = 0;
  }
  show(name, data = {}) {
    this.cur = name;
    const html = TEMPLATES[name] ? TEMPLATES[name](this.app, data) : '';
    this.root.innerHTML = html;
    this.root.className = 'screens ' + (html ? 'on scr-' + name : '');
    this.root.querySelectorAll('canvas[data-pixel]').forEach((c) => pixelText(c.dataset.pixel, { scale: +c.dataset.scale || 6, canvas: c, fill: (c.dataset.fill || '#FFF6C8,#F2A541').split(',') }));
    this.root.querySelectorAll('[data-act]').forEach((b) => b.addEventListener('click', () => this.app.onMenu(b.dataset.act, b.dataset)));
    const first = this.root.querySelector('[autofocus], button');
    if (first) first.focus({ preventScroll: true });
    this.trans = 0.25;
  }
  hide() { this.cur = null; this.root.innerHTML = ''; this.root.className = 'screens'; }
  // arrow-key / d-pad focus movement across visible buttons
  nav(m) {
    if (!this.cur) return false;
    const btns = [...this.root.querySelectorAll('button:not([disabled])')];
    if (!btns.length) return false;
    let i = btns.indexOf(document.activeElement);
    if (m.down || m.right) i = (i + 1) % btns.length;
    else if (m.up || m.left) i = (i - 1 + btns.length) % btns.length;
    else if (m.ok && i >= 0) { btns[i].click(); return true; }
    else if (m.cancel) { const back = this.root.querySelector('[data-back]'); if (back) back.click(); return true; }
    else return false;
    btns[Math.max(0, i)].focus({ preventScroll: true });
    return true;
  }
}

const btn = (act, label, extra = '') => `<button type="button" class="mbtn" data-act="${act}" ${extra}>${label}</button>`;

const TEMPLATES = {
  title: (app) => `
    <div class="title-wrap">
      <div class="logo"><canvas data-pixel="SPA CITY" data-scale="7" data-fill="#E9FBFF,#3FA8C0"></canvas><canvas data-pixel="TUB RALLY" data-scale="11"></canvas>
        <p class="tagline">Bathtub racing on the streets and mountain roads of Hot Springs, Arkansas</p></div>
      <nav class="menu" aria-label="Main menu">
        ${btn('gp', 'Grand Prix', 'autofocus')}
        ${btn('quick', 'Quick Race')}
        ${btn('timetrial', 'Time Trial')}
        ${btn('help', 'How to Play')}
        ${btn('settings', 'Settings')}
      </nav>
      <p class="fineprint">Inspired by the World Championship Running of the Tubs, held each June on Central Avenue. Fictional teams; not affiliated with the event or any business shown.</p>
    </div>`,
  pause: () => `
    <div class="panel pause" role="dialog" aria-label="Paused">
      <canvas data-pixel="PAUSED" data-scale="6"></canvas>
      <nav class="menu">${btn('resume', 'Resume', 'autofocus data-back')}${btn('restart', 'Restart race')}${btn('settings', 'Settings')}${btn('quit', 'Quit to title')}</nav>
    </div>`,
  results: (app, { results, laps, trackName, gp, newRecord, mode }) => `
    <div class="panel results" role="dialog" aria-label="Race results">
      <canvas data-pixel="RESULTS" data-scale="6"></canvas>
      <p class="sub">${trackName || ''} · ${laps} laps${newRecord ? ' · <b class="clean">NEW RECORD</b>' : ''}</p>
      <table class="rtable"><thead><tr><th>#</th><th>Team</th><th>Time</th><th>Water</th><th>Pts</th></tr></thead><tbody>
      ${(results || []).map((r) => `<tr class="${r.human ? 'me' : ''}"><td>${r.place}</td><td><span class="sw" style="background:${TEAM_BY_ID[r.team].colors.tub}"></span>${TEAM_BY_ID[r.team].name}${r.human ? ' (you)' : ''}</td><td>${r.estimated ? '~' : ''}${fmtTime(r.time)}</td><td>${r.gal.toFixed(0)} gal${r.clean ? ' <b class="clean" title="Clean Finish: 10+ gallons and all four items">CLEAN</b>' : ''}</td><td>${r.points}</td></tr>`).join('')}
      </tbody></table>
      <nav class="menu row">${gp ? btn('standingsGo', 'Standings', 'autofocus') : btn('restart', mode === 'timetrial' ? 'Try again' : 'Race again', 'autofocus')}${btn('quit', gp ? 'Quit cup' : 'Title', 'data-back')}</nav>
    </div>`,
  help: () => `
    <div class="panel help" role="dialog" aria-label="How to play">
      <canvas data-pixel="HOW TO PLAY" data-scale="5"></canvas>
      <div class="help-cols">
        <section><h3>Drive</h3><ul>
          <li><kbd>↑</kbd>/<kbd>W</kbd> push · <kbd>↓</kbd>/<kbd>S</kbd> brake · <kbd>←</kbd><kbd>→</kbd> steer</li>
          <li><kbd>Shift</kbd>/<kbd>Space</kbd> hop. Hold it while steering into a turn to <b>power slide</b>; let go for a steam boost (Warm, then Hot).</li>
          <li><kbd>X</kbd>/<kbd>J</kbd> use item (hold <kbd>↓</kbd> to aim back) · <kbd>C</kbd> look back · <kbd>Esc</kbd> pause</li>
          <li>Gamepad: A push, B brake, R hop, Z/LB item, Y look back. Touch: drag on the left half to steer.</li></ul></section>
        <section><h3>Keep your water</h3><ul>
          <li>Your tub starts full. Hard turns, slides, landings and hits slosh water out. Crowds' water blasters, refill buckets, fountains and creek fords top you up.</li>
          <li>More water is heavier: steadier, but slower to get going.</li>
          <li>Cross the line with <b>10 gallons or more</b> and all four attendant items for a <b>Clean Finish</b> bonus point.</li></ul></section>
        <section><h3>The real rules</h3><ul>
          <li>Inspired by Hot Springs' World Championship Running of the Tubs (since 2006): a captain rides and steers, four bath attendants push, each carrying a towel, bath mat, soap or loofah mitt.</li>
          <li>Get hit and an attendant drops their item: everyone stops and runs once around the tub, just like rule 7.</li></ul></section>
      </div>
      <nav class="menu row">${btn('back', 'Back', 'autofocus data-back')}</nav>
    </div>`,
  teams: (app, { sel }) => {
    const unlocked = (t) => t.unlocked || app.save.unlocked.teams.includes(t.id);
    const cur = TEAM_BY_ID[sel] || TEAMS[0];
    const st = kartStats(cur.id, app.save.lastClass || 'soak'), d = DIVISIONS[cur.div];
    const bar = (label, v) => `<div class="stat"><span>${label}</span><i><b style="width:${Math.round(Math.max(0.08, Math.min(1, v)) * 100)}%"></b></i></div>`;
    return `
    <div class="panel teams" role="dialog" aria-label="Choose your team">
      <canvas data-pixel="CHOOSE YOUR TEAM" data-scale="4"></canvas>
      <div class="team-grid">${TEAMS.map((t) => `<button type="button" class="tcard ${t.id === cur.id ? 'sel' : ''}" data-act="${unlocked(t) ? 'team' : 'locked'}" data-id="${t.id}" ${unlocked(t) ? '' : 'aria-disabled="true"'} aria-pressed="${t.id === cur.id}">
        <span class="tsw" style="background:${t.colors.tub};border-color:${t.colors.trim}"></span><b>${t.name}</b><small>${DIVISIONS[t.div].name}${unlocked(t) ? '' : ' · locked'}</small></button>`).join('')}</div>
      <div class="team-info">
        <h3>${cur.name}</h3>
        <p><b>Captain:</b> ${cur.captain} · <b>Inspired by:</b> ${cur.archetype} (fictional team)</p>
        <p><b>${d.name} division</b>: ${d.tub}. ${d.blurb}</p>
        <div class="stats">${bar('Top speed', (st.vTop / 19.5 - 0.9) / 0.15)}${bar('Push', (st.push - 0.8) / 0.35)}${bar('Handling', (st.turn - 0.8) / 0.4)}${bar('Water', (st.capGal / 44) * (1.15 - (st.slosh - 0.8)))}</div>
      </div>
      <nav class="menu row">${btn('teamOk', 'Choose ' + cur.name.replace(/^The /, ''), 'autofocus')}${btn('back', 'Back', 'data-back')}</nav>
    </div>`;
  },
  classes: (app) => {
    const ok = (id) => app.save.unlocked.classes.includes(id);
    return `
    <div class="panel classes" role="dialog" aria-label="Choose a speed class">
      <canvas data-pixel="WATER TEMPERATURE" data-scale="4"></canvas>
      <p class="sub">Speed class: game difficulty, named for bath temperatures</p>
      <nav class="menu">${Object.values(CLASSES).map((c, i) => `<button type="button" class="mbtn" data-act="${ok(c.id) ? 'cls' : 'locked'}" data-id="${c.id}" ${i === 1 ? 'autofocus' : ''} ${ok(c.id) ? '' : 'aria-disabled="true"'}>${c.name}${ok(c.id) ? '' : ' (win a cup on Soak)'}</button>`).join('')}${btn('back', 'Back', 'data-back')}</nav>
    </div>`;
  },
  cups: (app, { built }) => `
    <div class="panel cups" role="dialog" aria-label="Choose a cup">
      <canvas data-pixel="CHOOSE A CUP" data-scale="4"></canvas>
      <div class="card-row">${CUPS.map((c, i) => { const n = c.tracks.filter((id) => built.includes(id)).length; return `<button type="button" class="ccard" data-act="${n ? 'cup' : 'locked'}" data-id="${c.id}" ${i === 0 ? 'autofocus' : ''}><b>${c.name}</b><small>${c.blurb}</small><em>${n ? `${n} of 4 courses ready` : 'courses coming soon'}</em></button>`; }).join('')}</div>
      <nav class="menu row">${btn('back', 'Back', 'data-back')}</nav>
    </div>`,
  courses: (app, { list }) => `
    <div class="panel courses" role="dialog" aria-label="Choose a course">
      <canvas data-pixel="CHOOSE A COURSE" data-scale="4"></canvas>
      <div class="card-row">${list.map((t, i) => { const best = app.save.best[t.id]; return `<button type="button" class="ccard postcard" data-act="course" data-id="${t.id}" ${i === 0 ? 'autofocus' : ''}><b>${t.name}</b><small>${t.blurb || ''}</small><em>${Math.round(t.length || 0)} m lap${best ? ` · best ${fmtTime(best.race)}` : ''}</em></button>`; }).join('')}</div>
      <nav class="menu row">${btn('back', 'Back', 'data-back')}</nav>
    </div>`,
  standings: (app, { rows, round, rounds, cupName, final }) => `
    <div class="panel results standings" role="dialog" aria-label="Cup standings">
      <canvas data-pixel="${final ? 'FINAL STANDINGS' : 'STANDINGS'}" data-scale="5"></canvas>
      <p class="sub">${cupName} · after race ${round} of ${rounds}</p>
      <table class="rtable"><thead><tr><th>#</th><th>Team</th><th>Pts</th><th>Clean</th></tr></thead><tbody>
      ${rows.map((r, i) => `<tr class="${r.human ? 'me' : ''}"><td>${i + 1}</td><td><span class="sw" style="background:${TEAM_BY_ID[r.team].colors.tub}"></span>${TEAM_BY_ID[r.team].name}${r.human ? ' (you)' : ''}</td><td>${r.points}</td><td>${r.clean}</td></tr>`).join('')}
      </tbody></table>
      <nav class="menu row">${final ? btn('trophy', 'Trophy ceremony', 'autofocus') : btn('nextRace', 'Next race', 'autofocus')}${btn('quit', 'Quit cup', 'data-back')}</nav>
    </div>`,
  trophy: (app, { place, cupName, unlockedTeam }) => `
    <div class="panel trophy" role="dialog" aria-label="Trophy">
      <canvas data-pixel="${place <= 3 ? TROPHY[place - 1].toUpperCase() : 'GOOD EFFORT'}" data-scale="5" data-fill="${place === 1 ? '#FFF6C8,#F2C230' : place === 2 ? '#F4F6FA,#A9B4C2' : '#FFE1C4,#C8783C'}"></canvas>
      <p class="sub">${cupName}: you finished ${place}${['st', 'nd', 'rd'][place - 1] || 'th'} overall.</p>
      ${unlockedTeam ? `<p class="unlock">New team unlocked: <b>${TEAM_BY_ID[unlockedTeam].name}</b></p>` : ''}
      <nav class="menu row">${btn('quit', 'Back to title', 'autofocus data-back')}</nav>
    </div>`,
  settings: (app) => {
    const s = app.save.settings;
    const opt = (name, val, label, cur) => `<button type="button" class="chip ${cur === val ? 'sel' : ''}" data-act="set" data-k="${name}" data-v="${val}" aria-pressed="${cur === val}">${label}</button>`;
    return `
    <div class="panel settings" role="dialog" aria-label="Settings">
      <canvas data-pixel="SETTINGS" data-scale="5"></canvas>
      <div class="set-row"><span>Picture</span>${opt('res', 'authentic', 'Authentic 240p', s.res)}${opt('res', 'crisp', 'Crisp 480p', s.res)}${opt('res', 'native', 'Native', s.res)}</div>
      <div class="set-row"><span>Detail</span>${opt('quality', 'auto', 'Auto', s.quality)}${opt('quality', 'low', 'Low', s.quality)}${opt('quality', 'medium', 'Medium', s.quality)}${opt('quality', 'high', 'High', s.quality)}</div>
      <div class="set-row"><span>Auto-push</span>${opt('autoPush', 'true', 'On', String(s.autoPush))}${opt('autoPush', 'false', 'Off', String(s.autoPush))}</div>
      <div class="set-row"><span>Sound</span>${opt('sound', 'true', 'On', String(s.sound))}${opt('sound', 'false', 'Off', String(s.sound))}</div>
      <div class="set-row"><span>Motion</span>${opt('reducedMotion', 'false', 'Full', String(s.reducedMotion))}${opt('reducedMotion', 'true', 'Reduced', String(s.reducedMotion))}</div>
      <nav class="menu row">${btn('back', 'Done', 'autofocus data-back')}</nav>
    </div>`;
  },
};
