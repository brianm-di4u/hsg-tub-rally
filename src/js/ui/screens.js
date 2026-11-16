// Menu screens (DOM): title, pause, results, settings, how-to-play. Keyboard, gamepad and touch friendly:
// every action is a real <button>, arrow keys / d-pad move focus, Enter / A confirms, Esc / B goes back.
import { pixelText } from './pixelfont.js';
import { fmtTime, drawItemIcon } from './hud.js';
import { ITEMS } from '../sim/items.js';
import { MIN_FINISH_GAL } from '../sim/water.js';
import { POINTS } from '../sim/race.js';
import { TEAM_BY_ID, TEAMS, DIVISIONS, CLASSES, kartStats } from '../data/teams.js';
import { CUPS, CUP_BY_ID, TROPHY } from '../data/cups.js';
import { factFor } from '../data/facts.js';
import { MEDAL_NAMES, medalTimes } from '../sim/medals.js';
import { addDays } from '../daily.js';
import { bestFor, bestEntries } from '../save.js';
import { TRACK_BY_ID } from '../data/tracks.js';
import { I as INPUT } from './input.js';
import { sfx } from './audio.js';

// S4-22: what a pressed button sounds like: a chirp up, down for Back, and the dull tick of a locked card
function menuSound(b) {
  if (b.dataset.act === 'locked') sfx('tick');
  else sfx('confirm', b.dataset.act === 'back');
}

// C4-09: a Space still held as a screen appears (the Hop key through the finish, say) must not press the button the
// focus lands on when it is let go, and a Space pressed in the first half second is not meant for the screen either.
export const SPACE_GRACE = 500;

export class Screens {
  constructor(root, app) {
    this.root = root;
    this.app = app;
    this.cur = null;
    this.trans = 0;
    this.shownAt = 0; this.spaceDown = false; this.spaceCarry = false;
    // in the capture phase, before the focused button's own key handling
    window.addEventListener('keydown', (e) => { if (e.code === 'Space') { this.spaceDown = true; if (this.spaceBlocked()) e.preventDefault(); } }, true);
    window.addEventListener('blur', () => { this.spaceDown = false; this.spaceCarry = false; });
    window.addEventListener('keyup', (e) => { if (e.code === 'Space') { if (this.spaceBlocked()) e.preventDefault(); this.spaceDown = false; this.spaceCarry = false; } }, true);
  }
  spaceBlocked() { return !!this.cur && (this.spaceCarry || performance.now() - this.shownAt < SPACE_GRACE); }
  show(name, data = {}) {
    // a screen redrawing itself (a chip pressed in Settings) is not a new screen
    if (this.cur !== name) { this.shownAt = performance.now(); this.spaceCarry = this.spaceDown; }
    this.cur = name;
    const html = TEMPLATES[name] ? TEMPLATES[name](this.app, data) : '';
    this.root.innerHTML = html;
    this.root.className = 'screens ' + (html ? 'on scr-' + name : '');
    document.body.dataset.screen = name;
    this.root.querySelectorAll('canvas[data-pixel]').forEach((c) => pixelText(c.dataset.pixel, { scale: +c.dataset.scale || 6, canvas: c, fill: (c.dataset.fill || '#FFF6C8,#F2A541').split(',') }));
    this.root.querySelectorAll('[data-act]').forEach((b) => b.addEventListener('click', () => { menuSound(b); this.app.onMenu(b.dataset.act, b.dataset); }));
    // the screen's own choice of first button wins over the first one in the page (S2-13)
    const first = this.root.querySelector('[autofocus]') || this.root.querySelector('button');
    if (first) first.focus({ preventScroll: true });
    this.trans = 0.25;
  }
  hide() { this.cur = null; this.root.innerHTML = ''; this.root.className = 'screens'; delete document.body.dataset.screen; }
  // arrow-key / d-pad focus movement across visible buttons
  nav(m) {
    if (!this.cur) return false;
    // a button that is not on screen (the Touch layout row without touch controls) cannot take the focus
    const btns = [...this.root.querySelectorAll('button:not([disabled])')].filter((b) => b.getClientRects().length > 0);
    if (!btns.length) return false;
    let i = btns.indexOf(document.activeElement);
    if (m.down || m.right) i = (i + 1) % btns.length;
    else if (m.up || m.left) i = (i - 1 + btns.length) % btns.length;
    else if (m.ok && i >= 0) { btns[i].click(); return true; }
    else if (m.cancel) { const back = this.root.querySelector('[data-back]'); if (back) back.click(); return true; }
    else return false;
    btns[Math.max(0, i)].focus();
    // S4-22: focus moved by arrow key or d-pad
    sfx('tick');
    return true;
  }
}

// a medal as a coloured disc with its name, so it reads without colour
const medalChip = (m) => (m > 0 ? `<b class="medal m${m}">${MEDAL_NAMES[m]}</b>` : '');
// The Mirror switch under the course and cup cards: locked until a cup is won on Scald
const mirrorRow = (app) => {
  const ok = app.save.unlocked.mirror === true, on = ok && app.save.settings.mirror === true;
  const chip = (v, label, cur) => `<button type="button" class="chip ${cur ? 'sel' : ''}" data-act="mirror" data-v="${v}" aria-pressed="${cur}">${label}</button>`;
  return `<div class="set-row two mirror-row"><span>Mirror</span>${ok ? chip('false', 'Off', !on) + chip('true', 'On', on) + '<small>Same course, left for right. Signs read backwards.</small>' : '<button type="button" class="chip" data-act="locked" data-why="Win a cup on Scald to unlock Mirror." aria-disabled="true">Win a cup on Scald to unlock</button>'}</div>`;
};
const btn = (act, label, extra = '') => `<button type="button" class="mbtn" data-act="${act}" ${extra}>${label}</button>`;

const ord = (n) => n + (['th', 'st', 'nd', 'rd'][n % 100 >= 11 && n % 100 <= 13 ? 0 : n % 10] || 'th');
const days = (n) => `${n} ${n === 1 ? 'day' : 'days'}`;
const dateLabel = (key) => { const [y, m, d] = key.split('-').map(Number); return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }); };

// Daily Race results: the day's board and the streak
function dailyLines(d) {
  return `<div class="trial-lines" role="status">
        <p>Daily Race, ${dateLabel(d.date)}: ${ord(d.place)}${d.better ? ' <b class="clean">NEW BEST</b>' : ''}</p>
        <p>${d.first ? `Streak: ${days(d.streak)}${d.streakBest && d.streak > 1 ? ' <b class="clean">LONGEST</b>' : ''}` : 'Raced already today: your best of the day is kept.'}</p></div>`;
}

// Time Trial results: the medal, the best lap and the staff ghost's time to beat
function trialLines(t) {
  const m = t.times;
  const next = t.medal >= 3 ? 'You beat the staff ghost.' : `Next medal: ${MEDAL_NAMES[t.medal + 1]} at ${fmtTime(t.medal === 2 ? m.gold : t.medal === 1 ? m.silver : m.bronze)}.`;
  return `<div class="trial-lines" role="status">
        <p>${t.medal ? `${medalChip(t.medal)} medal${t.medalNew ? ' <b class="clean">NEW</b>' : ''}` : 'No medal this run.'} ${next}</p>
        <p>Fastest lap ${fmtTime(t.lap)}${t.lapBest ? ' <b class="clean">NEW</b>' : ''} · staff ghost ${fmtTime(m.gold)}, best lap ${fmtTime(t.parLap)}</p></div>`;
}

// How to Play (S2-11): the controls of the device the player is using come first, the others fold away
const CONTROLS = {
  keyboard: { name: 'Keyboard', lines: [
    '<kbd>↑</kbd>/<kbd>W</kbd> push · <kbd>↓</kbd>/<kbd>S</kbd> brake · <kbd>←</kbd><kbd>→</kbd> steer',
    '<kbd>Shift</kbd>/<kbd>Space</kbd> hop. Hold it while steering into a turn to <b>power slide</b>; let go for a steam boost (Warm, then Hot).',
    '<kbd>X</kbd>/<kbd>J</kbd> use item (hold <kbd>↓</kbd> to aim back) · <kbd>C</kbd> look back · <kbd>Esc</kbd> pause'] },
  touch: { name: 'Touch', lines: [
    'Drag anywhere on the {side} half of the screen to steer.',
    'Hold <b>Push</b> to run (Auto-push in Settings does it for you). Hold <b>Brake</b> to slow down.',
    'Hold <b>Hop</b> while steering into a turn to <b>power slide</b>; let go for a steam boost (Warm, then Hot).',
    'Tap <b>Item</b> to use your item. Hold <b>Brake</b> while you tap it to throw it backwards. <b>Pause</b> is at the top right.'] },
  gamepad: { name: 'Gamepad', lines: [
    'Stick or D-pad steer · A or RT push · B or LT brake',
    'RB hop. Hold it while steering into a turn to <b>power slide</b>; let go for a steam boost (Warm, then Hot).',
    'LB or X use item (hold B or LT to throw it backwards) · Y look back · Start pause'] },
};
function driveHelp(open, lefty) {
  const first = CONTROLS[INPUT.last] ? INPUT.last : 'keyboard';
  const list = (k) => `<ul>${CONTROLS[k].lines.map((l) => `<li>${l.replace('{side}', lefty ? 'right' : 'left')}</li>`).join('')}</ul>`;
  const others = Object.keys(CONTROLS).filter((k) => k !== first), label = others.map((k) => CONTROLS[k].name).join(' and ') + ' controls';
  return `<section><h3>Drive: ${CONTROLS[first].name}</h3>${list(first)}
          <button type="button" class="chip help-more" data-act="helpAll" aria-expanded="${!!open}">${open ? 'Hide' : 'Show'} ${label}</button>
          ${open ? others.map((k) => `<h4>${CONTROLS[k].name}</h4>${list(k)}`).join('') : ''}</section>`;
}

// S2-09: the player's Clean Finish, or what cost it. Visible text, not a tooltip, so it reads on touch too.
const ITEM_WORDS = { towel: 'towel', mat: 'bath mat', soap: 'soap', loofah: 'loofah mitt' };
function cleanLine(r) {
  if (!r || r.estimated) return '';
  if (r.clean) return `<p class="clean-note" role="status"><b class="clean">CLEAN</b> Clean Finish: ${MIN_FINISH_GAL} gallons or more and all four items, for a bonus point.</p>`;
  const why = [];
  if (r.lost && r.lost.length) why.push('lost the ' + r.lost.map((i) => ITEM_WORDS[i] || i).join(' and the '));
  if (r.dry) why.push(r.gal >= MIN_FINISH_GAL ? `finished just under ${MIN_FINISH_GAL} gal` : `finished with ${r.gal.toFixed(1)} gal, under the ${MIN_FINISH_GAL} needed`);
  return `<p class="clean-note" role="status">No Clean Finish: ${why.join(' and ') || 'something was missing'}.</p>`;
}

// S2-02: the items list in How to Play is made from ITEMS, so it cannot drift from the game
const iconCache = {};
function itemIconUrl(id) {
  if (iconCache[id] == null) {
    try { const c = document.createElement('canvas'); c.width = c.height = 40; drawItemIcon(c.getContext('2d'), id, 20, 20, 15); iconCache[id] = c.toDataURL(); } catch (e) { iconCache[id] = ''; }
  }
  return iconCache[id];
}
const itemsHelp = () => `<section><h3>Items and tickets</h3>
          <p class="help-lead">Drive through a soap bubble to pick up an item, then press the item button to use it. The further back you are, the stronger the item a bubble gives.</p>
          <ul class="item-list">${Object.entries(ITEMS).map(([id, it]) => `<li><img alt="" width="28" height="28" src="${itemIconUrl(id)}"><span><b>${it.name}</b> ${it.tip}</span></li>`).join('')}</ul>
          <p class="help-lead">Collect bath tickets. Drive through a judge's lane with three for a head start.</p></section>`;

// S3-08: the rubber band, in words. Its strength is each class's `rubber` (teams.js); a test keeps the order below true to it.
const rivalsHelp = () => `<section><h3>Rival tubs</h3><ul>
          <li>A rival far ahead of you eases off a little, and one far behind speeds up, so the race stays close. It fades away over the last third.</li>
          <li>${CLASSES.splash.name} does this most, ${CLASSES.soak.name} a bit less, ${CLASSES.scald.name} hardly at all and ${CLASSES.boil.name} not at all.</li></ul></section>`;

// S3-15: how a cup is scored, where the choices are made (cup card, standings) and not only in a tooltip
const CLEAN_RULE = `10+ gallons and all four items`;
const cupPoints = () => `<p class="cup-rules"><b>Points each race:</b> ${POINTS.map((p, i) => `${ord(i + 1)} ${p}`).join(', ')}. A <b class="clean">CLEAN</b> finish (${MIN_FINISH_GAL}+ gallons and all four items) is one more. Tickets break a tie. Win a cup to unlock new teams and speed classes.</p>`;
// where the player stands after a cup race: a Faucet trophy goes to the top three after the last race
const pts = (n) => `${n} ${n === 1 ? 'point' : 'points'}`;
function cupStanding(rows, round, rounds) {
  const me = rows.findIndex((r) => r.human), left = rounds - round;
  if (me < 0 || !left) return '';
  const state = me === 0 ? (rows[1] ? `You lead by ${pts(rows[0].points - rows[1].points)}.` : 'You lead.') : `You are ${pts(rows[0].points - rows[me].points)} behind the leader.`;
  const podium = me > 2 && rows[2] ? ` Third place has ${rows[2].points}.` : '';
  // S3-10: what winning the cup takes from here (a tie on points goes to the tickets, so it has to be more than the gap)
  const win = me > 0 ? ` To win the cup, outscore ${TEAM_BY_ID[rows[0].team].name} by more than ${pts(rows[0].points - rows[me].points)} over the last ${left === 1 ? 'race' : left + ' races'}.` : '';
  return `<p class="clean-note" role="status">${state}${podium}${win} ${left} ${left === 1 ? 'race' : 'races'} to go: the top three win a Faucet trophy.</p>`;
}

// the CLEAN badge in a rival's row, explained in text (it was a tooltip, which touch never shows)
const cleanLegend = (results) => (results || []).some((r) => r.clean && !r.human) && !(results || []).some((r) => r.clean && r.human) ? `<p class="clean-legend"><b class="clean">CLEAN</b> = ${CLEAN_RULE}, one more point.</p>` : '';

// P-N06: Quick Race setup under the course list: laps, items, rivals
const RACE_LAPS = [1, 3, 5], RACE_RIVALS = [3, 7];
function raceOptsRow(app) {
  const s = app.save.settings;
  const chip = (k, v, label, cur) => `<button type="button" class="chip ${cur ? 'sel' : ''}" data-act="raceOpt" data-k="${k}" data-v="${v}" aria-pressed="${cur}">${label}</button>`;
  const grp = (name, chips) => `<div class="opt-grp" role="group" aria-label="${name}"><b>${name}</b>${chips}</div>`;
  return `<div class="set-row race-opts">${grp('Laps', RACE_LAPS.map((n) => chip('raceLaps', n, n, s.raceLaps === n)).join(''))}${grp('Items', chip('raceItems', 'true', 'On', s.raceItems !== false) + chip('raceItems', 'false', 'Off', s.raceItems === false))}${grp('Rivals', RACE_RIVALS.map((n) => chip('raceRivals', n, n, s.raceRivals === n)).join(''))}</div>`;
}

// S4-05: a postcard's picture is its course's own sky (the colours the race uses), a ridge and a postmark, drawn in CSS
const SKY = { 'bathhouse-row': ['#79B3E2', '#DCEEF6'], 'park-avenue': ['#2B2350', '#E8875A'], 'whittington-valley': ['#86B8DE', '#E2EEE8'], 'bridge-street': ['#6FA9DC', '#E4EEF2'], 'hs-mountain': ['#6FA8DC', '#DDEFF5'], 'goat-rock-gulpha': ['#6FA8DC', '#DDEFF5'], 'west-mountain': ['#6AA6D8', '#E3F0F4'], 'hill-wheatley': ['#79B3E2', '#DCEEF6'], 'sunset-ridge': ['#5B4A8A', '#F7B267'] };

// S4-04: the winning captain's line on the results
const voice = (rs) => { const w = rs && rs.length > 1 && rs.find((r) => r.place === 1), tm = w && TEAM_BY_ID[w.team]; return tm ? `<p class="voice">${tm.captain}${w.human ? ' (you)' : ''}: “${tm.say}”</p>` : ''; };

const TEMPLATES = {
  title: (app) => `
    <div class="title-wrap">
      <div class="logo"><canvas data-pixel="SPA CITY" data-scale="7" data-fill="#E9FBFF,#3FA8C0"></canvas><canvas data-pixel="TUB RALLY" data-scale="11"></canvas>
        <p class="tagline">Bathtub racing on the streets and mountain roads of Hot Springs, Arkansas</p></div>
      <nav class="menu" aria-label="Main menu">
        ${app.cup ? btn('continueCup', 'Continue cup', 'autofocus') : ''}
        ${btn('gp', 'Grand Prix', app.cup ? '' : 'autofocus')}
        ${btn('quick', 'Quick Race')}
        ${btn('timetrial', 'Time Trial')}
        ${btn('daily', 'Daily Race')}
        ${btn('row', 'Rules of the Row')}
        ${btn('battle', 'Water Fight')}
        ${btn('records', 'Records')}
        ${btn('help', 'How to Play')}
        ${btn('settings', 'Settings')}
        ${btn('credits', 'Credits')}
      </nav>
      <p class="fineprint">Inspired by the World Championship Running of the Tubs, held each June on Central Avenue. Fictional teams; not affiliated with the event or any business shown.</p>
    </div>`,
  pause: (app, { fact } = {}) => `
    <div class="panel pause" role="dialog" aria-label="Paused">
      <canvas data-pixel="PAUSED" data-scale="6"></canvas>
      <p class="sub">Goal: finish first, with 10 gallons or more.</p>
      ${fact ? `<p class="fact-line">${fact.t}</p>` : ''}
      <nav class="menu">${btn('resume', 'Resume', 'autofocus data-back')}${btn('restart', 'Restart race')}${btn('help', 'How to play')}${btn('settings', 'Settings')}${btn('quit', 'Quit to title')}</nav>
    </div>`,
  results: (app, { results, laps, trackName, gp, newRecord, mode, trial, daily, fact, custom }) => `
    <div class="panel results" role="dialog" aria-label="Race results">
      <canvas data-pixel="${app.banner || 'RESULTS'}" data-scale="6"></canvas>
      <p class="sub">${mode === 'battle' ? `${trackName} · Water Fight: last tub with water wins` : `${trackName || ''} · ${laps} ${laps === 1 ? 'lap' : 'laps'}`}${newRecord ? ' · <b class="clean">NEW RECORD</b>' : ''}${custom ? ' · custom setup, not kept as a record' : ''}</p>
      <table class="rtable"><thead><tr><th>#</th><th>Team</th><th>Time</th><th>Water</th><th>Pts</th></tr></thead><tbody>
      ${(results || []).map((r) => `<tr class="${r.human ? 'me' : ''}"><td>${r.place}</td><td><span class="sw" style="background:${TEAM_BY_ID[r.team].colors.tub}"></span>${TEAM_BY_ID[r.team].name}${r.human ? ' (you)' : ''}</td><td>${r.estimated ? '~' : ''}${fmtTime(r.time)}</td><td>${r.gal.toFixed(0)} gal${r.clean ? ' <b class="clean">CLEAN</b>' : ''}</td><td>${r.points}</td></tr>`).join('')}
      </tbody></table>
      ${mode === 'battle' ? '' : cleanLine((results || []).find((r) => r.human))}${cleanLegend(results)}
      ${trial ? trialLines(trial) : ''}${daily ? dailyLines(daily) : ''}
      ${voice(results)}${fact ? `<p class="fact-line">${fact.t}</p>` : ''}
      <nav class="menu row">${gp ? btn('standingsGo', 'Standings', 'autofocus') : btn('restart', mode === 'timetrial' ? 'Try again' : 'Race again', 'autofocus')}${gp ? btn('quitCup', 'Quit cup') : btn('quit', 'Title', 'data-back')}</nav>
    </div>`,
  daily: (app, { plan, done, streak, best }) => `
    <div class="panel daily" role="dialog" aria-label="Daily race">
      <canvas data-pixel="DAILY RACE" data-scale="5"></canvas>
      <p class="sub">${dateLabel(plan.date)}</p>
      <ul class="daily-card">
        <li><b>Course</b>${TRACK_BY_ID[plan.track].name}</li>
        <li><b>Tub</b>${TEAM_BY_ID[plan.team].name}</li>
        <li><b>Class</b>${CLASSES[plan.classId].name} · ${plan.laps} laps</li>
        <li><b>Rivals</b>the same seven for everyone today</li>
        <li><b>Today</b>${done ? `best ${ord(done.place)}, ${fmtTime(done.time)}` : 'not raced yet'}</li>
        <li><b>Streak</b>${days(streak)}${best > streak ? ` · longest ${days(best)}` : ''}</li>
      </ul>
      <nav class="menu row">${btn('dailyGo', done ? 'Race again' : 'Race', 'autofocus')}${btn('back', 'Back', 'data-back')}</nav>
    </div>`,
  records: (app, { courses, today, streak }) => {
    const sv = app.save, st = sv.stats, rate = st.races ? Math.round((st.wins / st.races) * 100) : 0;
    const tile = (label, v) => `<div class="rtile"><b>${v}</b><span>${label}</span></div>`;
    const cupCell = (place) => (place ? (place <= 3 ? `<b class="medal m${4 - place}" title="${TROPHY[place - 1]}">${ord(place)}</b>` : ord(place)) : '–');
    const cal = Array.from({ length: 14 }, (_, i) => addDays(today, i - 13));
    // a race time is a record of its own class (C4-05): one line for each class that has a time, slowest class first
    const raceCell = (id) => {
      const order = Object.keys(CLASSES), rank = (cls) => (cls === null ? -1 : order.indexOf(cls));
      const rows = bestEntries(sv, id).filter((e) => e.cls === null || CLASSES[e.cls]).sort((a, b) => rank(a.cls) - rank(b.cls));
      return rows.length ? rows.map((e) => `<span class="bc">${e.cls ? `<small>${CLASSES[e.cls].name}</small> ` : ''}${timeCell(e.rec)}</span>`).join('') : '–';
    };
    const timeCell = (r) => (r ? fmtTime(r.race) + (r.lap ? `<small> lap ${fmtTime(r.lap)}</small>` : '') : '–');
    return `
    <div class="panel records" role="dialog" aria-label="Records">
      <canvas data-pixel="RECORDS" data-scale="5"></canvas>
      <div class="rtiles">${tile('races', st.races)}${tile('wins', st.wins)}${tile('win rate', rate + '%')}${tile('gallons spilled', Math.round(st.gallonsSpilled))}${tile('daily streak', days(streak))}${tile('longest streak', days(st.bestStreak))}</div>
      <h3>Cups</h3>
      <table class="rtable" aria-label="Best cup finish by class"><thead><tr><th>Cup</th>${Object.values(CLASSES).map((c) => `<th>${c.name}</th>`).join('')}</tr></thead><tbody>
      ${CUPS.map((cp) => `<tr><td>${cp.name}</td>${Object.values(CLASSES).map((c) => `<td>${sv.unlocked.classes.includes(c.id) || sv.cups[cp.id + ':' + c.id] ? cupCell(sv.cups[cp.id + ':' + c.id]) : '<i class="lk">locked</i>'}</td>`).join('')}</tr>`).join('')}
      </tbody></table>
      <h3>Courses</h3>
      <table class="rtable" aria-label="Best times by course"><thead><tr><th>Course</th><th>Race best</th><th>Time Trial</th><th>Medal</th></tr></thead><tbody>
      ${courses.map((c) => { const t = (sv.trial || {})[c.id]; return `<tr><td>${c.name}</td><td>${raceCell(c.id)}</td><td>${timeCell(t)}</td><td>${t && t.medal ? medalChip(t.medal) : '–'}</td></tr>`; }).join('')}
      </tbody></table>
      <h3>Daily Races, last 14 days</h3>
      <ol class="cal" aria-label="Daily Races played in the last 14 days">${cal.map((k) => { const d = sv.daily[k]; return `<li class="${d ? 'done' : ''} ${k === today ? 'today' : ''}" title="${dateLabel(k)}${d ? ': ' + ord(d.place) : ''}"><b>${+k.slice(8)}</b><i>${d ? ord(d.place) : ''}</i></li>`; }).join('')}</ol>
      <nav class="menu row">${btn('back', 'Back', 'autofocus data-back')}</nav>
    </div>`;
  },
  help: (app) => `
<div class="panel help" role="dialog" aria-label="How to play">
<canvas data-pixel="HOW TO PLAY" data-scale="5"></canvas>
<p class="sub">Goal: cross the line first, with 10 gallons or more. Slide through turns for steam boosts.</p>
<div class="help-cols">
${driveHelp(app.helpAll, app.save.settings.lefty)}
<section><h3>The start</h3><ul>
<li>Press and hold <b>Push</b> in the last half second before <b>SCRUB!</b> for a GREAT START boost.</li>
<li>Push too early, from <b>READY</b>, and it is a false start: you stumble for a moment.</li></ul></section>
<section><h3>Keep your water</h3><ul>
<li>Your tub starts full. Hard turns, slides, landings and hits slosh water out. Crowds' water blasters, refill buckets, fountains and creek fords top you up.</li>
<li>More water is heavier: steadier, but slower to get going.</li>
<li>Cross the line with <b>10 gallons or more</b> and all four attendant items for a <b>Clean Finish</b> bonus point.</li></ul></section>
${itemsHelp()}
${rivalsHelp()}
<section><h3>Water Fight</h3><ul>
<li>Eight tubs circle the plaza fountain. Item hits spill more water here, and a dry tub is out.</li>
<li>Refill only at the fountain. The last tub with water wins, or the fullest when the 150 second clock ends.</li></ul></section>
<section><h3>The real rules</h3><ul>
<li>Inspired by Hot Springs' World Championship Running of the Tubs (since 2006): a captain rides and steers, four bath attendants push, each carrying a towel, bath mat, soap or loofah mitt.</li>
<li>Get hit and an attendant drops their item: everyone stops and runs once around the tub, just like rule 7.</li></ul></section>
</div>
<nav class="menu row">${btn('back', 'Back', 'autofocus data-back')}</nav>
    </div>`,
  controls: (app, d) => (window.TR_TEACH && window.TR_TEACH.api ? window.TR_TEACH.controlsHtml(app, d || {}) : ''),
  teams: (app, { sel }) => {
    const unlocked = (t) => t.unlocked || app.save.unlocked.teams.includes(t.id);
    const cur = TEAM_BY_ID[sel] || TEAMS[0];
    // C4-12: a cup win opens the first team still locked, in the order of the list (the same one the trophy uses)
    const next = TEAMS.filter((x) => !x.unlocked).find((x) => !app.save.unlocked.teams.includes(x.id));
    const st = kartStats(cur.id, app.save.lastClass || 'soak'), d = DIVISIONS[cur.div];
    // S2-14: each bar says its value as text for a screen reader and a hover, and a caption says what a full Water bar means
    const bar = (label, v) => { const pct = Math.round(Math.max(0.08, Math.min(1, v)) * 100); return `<div class="stat" role="img" aria-label="${label}: ${pct} out of 100" title="${label}: ${pct} out of 100"><span>${label}</span><i><b style="width:${pct}%"></b></i></div>`; };
    return `
    <div class="panel teams" role="dialog" aria-label="Choose your team">
      <canvas data-pixel="CHOOSE YOUR TEAM" data-scale="4"></canvas>
      <div class="team-grid">${TEAMS.map((t) => `<button type="button" class="tcard ${t.id === cur.id ? 'sel' : ''}" data-act="${unlocked(t) ? 'team' : 'locked'}" data-id="${t.id}" ${unlocked(t) ? '' : `data-why="${t.sig ? t.name + ': ' + t.sig + ' ' : ''}Win a Grand Prix cup to unlock ${t === next ? 'this team: it is next' : 'the next team'}." aria-disabled="true"`} aria-pressed="${t.id === cur.id}">
        <span class="tsw" style="background:${t.colors.tub};border-color:${t.colors.flag}"></span><b>${t.name.replace(/-/g, '‑')}</b><small>${DIVISIONS[t.div].name}${unlocked(t) ? '' : '<i class="lk">locked</i>'}</small></button>`).join('')}</div>
      <div class="team-info">
        <h3>${cur.name}</h3>
        <p><b>Captain:</b> ${cur.captain} · <b>Inspired by:</b> ${cur.archetype} (fictional team)</p>
        <p><b>${d.name} division</b>: ${d.tub}. ${d.blurb}</p>
        ${cur.sig ? `<p class="sig"><b>Signature:</b> ${cur.sig}</p>` : ''}
        <div class="stats">${bar('Top speed', (st.vTop / 19.5 - 0.9) / 0.15)}${bar('Push', (st.push - 0.8) / 0.35)}${bar('Handling', (st.turn - 0.8) / 0.4)}${bar('Water', (st.capGal / 44) * (1.15 - (st.slosh - 0.8)))}</div>
        <p class="stat-note">Water: a bigger tub holds more, but is heavier and slower to get going.</p>
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
      <nav class="menu">${Object.values(CLASSES).map((c, i) => `<button type="button" class="mbtn" data-act="${ok(c.id) ? 'cls' : 'locked'}" data-id="${c.id}" ${i === 1 ? 'autofocus' : ''} ${ok(c.id) ? '' : `data-why="${c.unlock || 'Win a cup'} to unlock ${c.name}." aria-disabled="true"`}>${c.name}${ok(c.id) ? '' : ` (${c.unlock || 'Win a cup'})`}<small class="cls-how">${c.how} Rivals at ${Math.round(c.ai * 100)}% pace.</small></button>`).join('')}${btn('back', 'Back', 'data-back')}</nav>
    </div>`;
  },
  cups: (app, { built }) => `
    <div class="panel cups" role="dialog" aria-label="Choose a cup">
      <canvas data-pixel="CHOOSE A CUP" data-scale="4"></canvas>
      ${mirrorRow(app)}
      <div class="card-row">${CUPS.map((c, i) => { const n = c.tracks.filter((id) => built.includes(id)).length, open = app.save.unlocked.cups.includes(c.id); return `<button type="button" class="ccard" data-act="${n && open ? 'cup' : 'locked'}" data-id="${c.id}" ${i === 0 ? 'autofocus' : ''} ${open ? (n ? '' : 'data-why="Its courses are coming soon."') : `data-why="${c.unlock || 'Win a cup'} to unlock the ${c.name}." aria-disabled="true"`}><b>${c.name}</b><small>${c.blurb}</small><em>${!open ? `Locked: ${c.unlock || 'win a cup'}` : n ? `${n} of 4 courses ready` : 'courses coming soon'}</em></button>`; }).join('')}</div>
      ${cupPoints()}
      <nav class="menu row">${btn('back', 'Back', 'data-back')}</nav>
    </div>`,
  // C4-04: a cup that can be continued is not replaced without asking; Keep is where the focus starts
  replaceCup: (app, { id, keptName, done, of, newName }) => `
    <div class="panel replace" role="alertdialog" aria-label="Start a new cup?" aria-describedby="rc-msg">
      <canvas data-pixel="NEW CUP?" data-scale="5"></canvas>
      <p class="sub" id="rc-msg">Your ${keptName} is waiting after race ${done} of ${of}. Starting ${keptName === newName ? 'it again' : 'the ' + newName} replaces it.</p>
      <nav class="menu row">${btn('back', 'Keep my cup', 'autofocus data-back')}${btn('cupNew', 'Start new cup', `data-id="${id}"`)}</nav>
    </div>`,
  courses: (app, { list, trial }) => { const cid = CLASSES[app.flow && app.flow.classId] ? app.flow.classId : CLASSES[app.save.lastClass] ? app.save.lastClass : 'soak'; return `
    <div class="panel courses" role="dialog" aria-label="Choose a course">
      <canvas data-pixel="CHOOSE A COURSE" data-scale="4"></canvas>
      ${trial ? `<p class="sub trial-note">Time Trial runs at ${CLASSES.scald.name} speed with no items.</p>` : ''}
      ${mirrorRow(app)}
      ${trial ? '' : raceOptsRow(app)}
      <div class="card-row">${list.map((t, i) => { const best = bestFor(app.save, t.id, cid), tt = (app.save.trial || {})[t.id], mt = medalTimes(t.id); return `<button type="button" class="ccard postcard" data-act="course" data-id="${t.id}" ${i === 0 ? 'autofocus' : ''}><span class="pc-pic" aria-hidden="true" style="--a:${(SKY[t.id] || SKY['hill-wheatley'])[0]};--b:${(SKY[t.id] || SKY['hill-wheatley'])[1]}"></span><b>${t.name}</b><small>${t.blurb || ''}</small><i class="fact">${factFor(t.id).t}</i><em>${Math.round(t.length || 0)} m lap${(window.TR_INFO || {})[t.id] && window.TR_INFO[t.id].real ? ` · real streets ${(window.TR_INFO[t.id].real / 1000).toFixed(1)} km, compressed` : ''}${trial ? '' : best ? ` · best ${fmtTime(best.race)}${best.lap ? ` · lap ${fmtTime(best.lap)}` : ''}${CLASSES[best.cls] ? ` (${CLASSES[best.cls].name})` : ''}` : ` · no ${CLASSES[cid].name} time yet`}</em>${trial ? `<span class="tt">${tt ? `${medalChip(tt.medal)} <span>Best ${fmtTime(tt.race)}${tt.lap ? ` · lap ${fmtTime(tt.lap)}` : ''}</span>` : '<span>No time set yet</span>'}${mt ? `<span class="tgt">Gold ${fmtTime(mt.gold)} · Silver ${fmtTime(mt.silver)} · Bronze ${fmtTime(mt.bronze)}</span>` : ''}</span>` : ''}</button>`; }).join('')}</div>
      <nav class="menu row">${btn('back', 'Back', 'data-back')}</nav>
    </div>`; },
  standings: (app, { rows, round, rounds, cupName, final }) => `
    <div class="panel results standings" role="dialog" aria-label="Cup standings">
      <canvas data-pixel="${final ? 'FINAL STANDINGS' : 'STANDINGS'}" data-scale="5"></canvas>
      <p class="sub">${cupName} · after race ${round} of ${rounds}</p>
      <table class="rtable"><thead><tr><th>#</th><th>Team</th><th>Pts</th><th title="Points behind the leader">Gap</th><th>Clean</th></tr></thead><tbody>
      ${rows.map((r, i) => `<tr class="${r.human ? 'me' : ''}"><td>${i + 1}</td><td><span class="sw" style="background:${TEAM_BY_ID[r.team].colors.tub}"></span>${TEAM_BY_ID[r.team].name}${r.human ? ' (you)' : ''}</td><td>${r.points}</td><td>${i ? '−' + (rows[0].points - r.points) : '–'}</td><td>${r.clean}</td></tr>`).join('')}
      </tbody></table>
      ${cupStanding(rows, round, rounds)}
      <p class="cup-rules"><b class="clean">CLEAN</b> = ${CLEAN_RULE}: one more point. Tickets break a tie.</p>
      <nav class="menu row">${final ? btn('trophy', 'Trophy ceremony', 'autofocus') : btn('nextRace', 'Next race', 'autofocus')}${btn('quitCup', 'Quit cup')}</nav>
    </div>`,
  trophy: (app, { place, cupName, unlockedTeam, unlockedClass, unlockedCup, unlockedMirror }) => `
    <div class="panel trophy" role="dialog" aria-label="Trophy">
      <canvas data-pixel="${place <= 3 ? TROPHY[place - 1].toUpperCase() : 'GOOD EFFORT'}" data-scale="5" data-fill="${place === 1 ? '#FFF6C8,#F2C230' : place === 2 ? '#F4F6FA,#A9B4C2' : '#FFE1C4,#C8783C'}"></canvas>
      <p class="sub">${cupName}: you finished ${place}${['st', 'nd', 'rd'][place - 1] || 'th'} overall.</p>
      ${unlockedTeam ? `<p class="unlock">New team unlocked: <b>${TEAM_BY_ID[unlockedTeam].name}</b></p>` : ''}
      ${unlockedClass && CLASSES[unlockedClass] ? `<p class="unlock">New speed class unlocked: <b>${CLASSES[unlockedClass].name}</b></p>` : ''}
      ${unlockedCup && CUP_BY_ID[unlockedCup] ? `<p class="unlock">New cup unlocked: <b>${CUP_BY_ID[unlockedCup].name}</b></p>` : ''}
      ${unlockedMirror ? '<p class="unlock">Mirror unlocked: <b>race any course left for right</b></p>' : ''}
      <nav class="menu row">${btn('quit', 'Back to title', 'autofocus data-back')}</nav>
    </div>`,
  rowIntro: (app, { team, bracket }) => `
    <div class="panel rowintro" role="dialog" aria-label="Rules of the Row">
      <canvas data-pixel="RULES OF THE ROW" data-scale="4"></canvas>
      <p class="sub">The real race's format: head-to-head heats down Central Avenue in front of Bathhouse Row</p>
      <div class="help-cols">
        <section><h3>The rules (from the real event)</h3><ul>
          <li>Captain rides and steers; four bath attendants push, each holding a towel, bath mat, soap or loofah mitt.</li>
          <li>Stop at every <b>blue feather flag</b> and do the judges' task. Take too long and you drop an item and circle the tub.</li>
          <li>Cross the line with <b>10 gallons or more</b> and all four items, or you are <b>disqualified</b>.</li>
          <li>The judges may give one team a head start on a whim.</li></ul></section>
        <section><h3>${DIVISIONS[TEAM_BY_ID[team].div].name} division bracket</h3><ul class="bracket">
          ${bracket.semis.map((p, i) => `<li><b>Semifinal ${i + 1}:</b> ${p.map((t) => TEAM_BY_ID[t].name + (t === team ? ' (you)' : '')).join(' vs ')}</li>`).join('')}
          <li><b>Final:</b> the two heat winners</li></ul>
          <p class="fineprint">Inspired by the World Championship Running of the Tubs (since 2006). Game rules; fictional teams.</p></section>
      </div>
      <nav class="menu row">${btn('rowStart', 'Start my heat', 'autofocus')}${btn('badge', 'Battle of the Badge')}${btn('quit', 'Back', 'data-back')}</nav>
    </div>`,
  rowResult: (app, { results, title, msg, next }) => `
    <div class="panel results" role="dialog" aria-label="Heat result">
      <canvas data-pixel="${title}" data-scale="5"></canvas>
      <p class="sub">${msg}</p>
      <table class="rtable"><thead><tr><th>#</th><th>Team</th><th>Time</th><th>Water</th><th>Items</th><th></th></tr></thead><tbody>
      ${results.map((r) => `<tr class="${r.human ? 'me' : ''}"><td>${r.dq ? '–' : r.place}</td><td><span class="sw" style="background:${TEAM_BY_ID[r.team].colors.tub}"></span>${TEAM_BY_ID[r.team].name}${r.human ? ' (you)' : ''}</td><td>${r.time != null ? fmtTime(r.time) : '–'}</td><td>${r.gal.toFixed(0)} gal</td><td>${r.items}/4</td><td>${r.dq ? `<b class="dq">DQ: ${r.dq}</b>` : ''}</td></tr>`).join('')}
      </tbody></table>
      <nav class="menu row">${btn(next.act, next.label, 'autofocus')}${btn('quit', 'Title', 'data-back')}</nav>
    </div>`,
  awards: (app, { a, champion, division }) => `
    <div class="panel trophy awards" role="dialog" aria-label="Awards ceremony">
      <canvas data-pixel="AWARDS CEREMONY" data-scale="4"></canvas>
      <p class="sub">${DIVISIONS[division].name} Division Cup: <b>${champion ? TEAM_BY_ID[champion].name : 'no finisher'}</b></p>
      <ul class="award-list">
        <li><b>Best Overall Tub</b>${TEAM_BY_ID[a.bestOverall]?.name || '–'}</li>
        <li><b>Most Spirit</b>${TEAM_BY_ID[a.mostSpirit]?.name || '–'}</li>
        <li><b>Most Original</b>${TEAM_BY_ID[a.mostOriginal]?.name || '–'}</li>
        <li><b>Fan Favorite</b>${TEAM_BY_ID[a.fanAward]?.name || '–'}</li>
      </ul>
      <p class="fineprint">Award categories follow coverage of the real event; winners here are decided by game rules (and the judges' whims).</p>
      <nav class="menu row">${btn('quit', 'Back to title', 'autofocus data-back')}</nav>
    </div>`,
  credits: () => `
    <div class="panel help" role="dialog" aria-label="Credits">
      <canvas data-pixel="CREDITS" data-scale="5"></canvas>
      <div class="help-cols">
        <section><h3>The real race</h3><ul>
          <li>Inspired by the World Championship Running of the Tubs, held each June on Central Avenue in Hot Springs, Arkansas, since 2006 and organized by Visit Hot Springs. Named for downtown businessman Stueart Pennington.</li>
          <li>This is an independent fan-made game. It is not affiliated with or endorsed by the event, Visit Hot Springs, the National Park Service or any business shown. Every team in the game is fictional.</li></ul></section>
        <section><h3>Maps and facts</h3><ul>
          <li>Streets and buildings: © OpenStreetMap contributors (ODbL 1.0). Elevation: USGS 3D Elevation Program (public domain).</li>
          <li>Facts: the event's 2026 official rules and website, NPS Hot Springs National Park pages, and the Hot Springs Games research corpus (sources listed in the game's research/town-content.md).</li>
          <li>Courses are compressed real streets; game-only links (racing on the Grand Promenade and the like) are game courses, not real roads.</li></ul></section>
        <section><h3>Made with</h3><ul>
          <li>three.js (MIT). Textures painted for this game with Codex; landmark models built with scripted Blender; music and sound synthesized live with WebAudio.</li>
          <li>Part of the open-source (MIT) Hot Springs Games collection.</li></ul></section>
      </div>
      <nav class="menu row">${btn('back', 'Back', 'autofocus data-back')}</nav>
    </div>`,
  settings: (app) => {
    const s = app.save.settings;
    const opt = (name, val, label, cur) => `<button type="button" class="chip ${cur === val ? 'sel' : ''}" data-act="set" data-k="${name}" data-v="${val}" aria-pressed="${cur === val}">${label}</button>`;
    return `
    <div class="panel settings" role="dialog" aria-label="Settings">
      <canvas data-pixel="SETTINGS" data-scale="5"></canvas>
      <div class="set-row"><span>Picture</span>${opt('res', 'native', 'Sharp', s.res)}${opt('res', 'crisp', '480p', s.res)}${opt('res', 'authentic', 'Retro 240p', s.res)}</div>
      <div class="set-row"><span>Detail</span>${opt('quality', 'auto', 'Auto', s.quality)}${opt('quality', 'low', 'Low', s.quality)}${opt('quality', 'medium', 'Medium', s.quality)}${opt('quality', 'high', 'High', s.quality)}</div>
      <div class="set-row two"><span>Auto-push</span>${opt('autoPush', 'true', 'On', String(s.autoPush))}${opt('autoPush', 'false', 'Off', String(s.autoPush))}</div>
      <div class="set-row two touch-only"><span>Touch layout</span>${opt('lefty', 'false', 'Standard', String(s.lefty))}${opt('lefty', 'true', 'Mirrored', String(s.lefty))}</div>
      <div class="set-row two"><span>Steer assist</span>${opt('steerAssist', 'true', 'On', String(s.steerAssist))}${opt('steerAssist', 'false', 'Off', String(s.steerAssist))}</div>
      <div class="set-row two"><span>HUD size</span>${[['0.85', 'Small'], ['1', 'Medium'], ['1.15', 'Large']].map(([v, l]) => opt('hudScale', v, l, String(s.hudScale))).join('')}</div>
      <div class="set-row two"><span>Sound</span>${opt('sound', 'true', 'On', String(s.sound))}${opt('sound', 'false', 'Off', String(s.sound))}</div>
      <div class="set-row two"><span>Volume</span>${[['0.3', 'Quiet'], ['0.6', 'Normal'], ['1', 'Loud']].map(([v, l]) => opt('volume', v, l, s.volume < 0.45 ? '0.3' : s.volume < 0.8 ? '0.6' : '1')).join('')}</div>
      <div class="set-row two"><span>Music</span>${opt('music', 'true', 'On', String(s.music))}${opt('music', 'false', 'Off', String(s.music))}</div>
      <div class="set-row two"><span>Music level</span>${[['0.4', 'Low'], ['0.7', 'Medium'], ['1', 'Normal']].map(([v, l]) => opt('musicVol', v, l, s.musicVol < 0.55 ? '0.4' : s.musicVol < 0.85 ? '0.7' : '1')).join('')}</div>
      <div class="set-row two"><span>Ambience</span>${opt('ambience', 'true', 'On', String(s.ambience))}${opt('ambience', 'false', 'Off', String(s.ambience))}</div>
      ${s.sound === false && (s.music !== false || s.ambience !== false) ? '<p class="set-note" role="status">Sound is Off, so Music and Ambience are silent too.</p>' : ''}
      <div class="set-row two"><span>Vibration</span>${opt('vibration', 'true', 'On', String(s.vibration))}${opt('vibration', 'false', 'Off', String(s.vibration))}</div>
      ${s.vibration !== false && (s.reducedMotion ?? !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) ? '<p class="set-note" role="status">Motion is Reduced, so Vibration is off too.</p>' : ''}
      <div class="set-row two"><span>Motion</span>${opt('reducedMotion', 'false', 'Full', String(s.reducedMotion))}${opt('reducedMotion', 'true', 'Reduced', String(s.reducedMotion))}</div>
      <div class="set-row two"><span>Race tips</span>${opt('seenIntro', 'false', 'Show', String(s.seenIntro))}${opt('seenIntro', 'true', 'Hide', String(s.seenIntro))}</div>
      <div class="set-row two"><span>Controls</span><button type="button" class="chip" data-act="controls">Change keys</button></div>
      <nav class="menu row">${btn('back', 'Done', 'data-back')}</nav>
    </div>`;
  },
};
