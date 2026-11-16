// Wave 3, batch C: difficulty, progression and records (S1-19, S3-13, P-N06, S3-07, S3-09) and
// feedback, teaching and help (S2-24, S1-07, S2-02, S2-08, S2-09).
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { Track } from '../src/js/sim/track.js';
import { makeRace, stepRace, finishRace, gridPoses, DT } from '../src/js/sim/race.js';
import { stepItems, ITEMS } from '../src/js/sim/items.js';
import { makeKart, stepKart, collideKarts } from '../src/js/sim/kart.js';
import { TEAMS, kartStats } from '../src/js/data/teams.js';
import { DEFAULT_SAVE } from '../src/js/save.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = '../_council/hsg-tub-rally/wave-3/shots';
const KEY = 'hsg-tub-rally-v1';
const shot = async (t, id, what) => { await t.shot(`w3c-${id}-${what}`); fs.mkdirSync(SHOTS, { recursive: true }); await t.page.screenshot({ path: `${SHOTS}/${id}-${what}-${t.viewport === 'mobile' ? 'mobile' : 'desktop'}.png` }); };
const track = (id) => new Track(JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'tracks', id + '.json'), 'utf8')));
const ALL = TEAMS.map((t) => t.id);
const setSave = (t, s) => t.page.evaluate(([k, v]) => localStorage.setItem(k, JSON.stringify(v)), [KEY, s]);
const readSave = (t) => t.page.evaluate((k) => JSON.parse(localStorage.getItem(k)), KEY);
const freshProfile = async (t) => { await t.waitIdle(8000); await setSave(t, { ...DEFAULT_SAVE(), settings: { ...DEFAULT_SAVE().settings, seenIntro: true } }); await t.reload(); await t.waitIdle(8000); };
const startRace = async (t, o = {}) => {
  await t.waitIdle(8000);
  await t.game('newGame', { track: 'bathhouse-row', team: 'engine-six', classId: 'soak', laps: 1, seed: 5, paused: true, ...o });
  await t.game('act', 'skipCountdown');
  await t.waitFrames(3);
};
const goToCourses = async (t) => {
  await t.game('scene', 'title'); await t.waitFrames(3);
  await t.game('act', 'menu', 'quick'); await t.waitFrames(2);
  await t.game('act', 'menu', 'teamOk'); await t.waitFrames(2);
  await t.game('act', 'menu', 'cls', { id: 'soak' }); await t.waitFrames(3);
};

// put a kart on the road at s, facing along it
function place(tr, k, s, d = 0) {
  const p = tr.point(s, d), c = tr.at(s);
  k.x = p.x; k.z = p.z; k.y = p.y; k.yaw = Math.atan2(c.tx, c.tz); k.s = tr.wrapS(s); k.vf = 0; k.vl = 0;
}

export const tests = [
  // ---------------------------------------------------------------- S1-19
  {
    name: 'council C S1-19: a field can be seated by the standings, and without them the player still starts last',
    node: true,
    async run(t) {
      const tr = track('bathhouse-row');
      const o = { seed: 11, classId: 'soak', player: 'engine-six', rivals: ALL };
      const base = makeRace(tr, o);
      const ids = base.karts.map((k) => k.team);
      t.equal(ids[7], 'engine-six', 'the default is the back of the grid');
      const order = [ids[3], 'engine-six', ids[0], ids[5], ids[1], ids[2], ids[4], ids[6]];
      const r = makeRace(tr, { ...o, order });
      t.equal(r.karts.map((k) => k.team).join(), order.join(), 'the grid follows the standings, leader on pole');
      t.equal(r.player, 1, 'the player is in their true slot');
      t.expect(r.karts[0].s > r.karts[7].s, 'the first slot is nearer the line than the last');
      const ghosts = makeRace(tr, { ...o, order: ['not-a-team', ids[4], 'engine-six'] });
      t.equal(ghosts.karts.map((k) => k.team).slice(0, 2).join(), [ids[4], 'engine-six'].join(), 'a team that is not racing is ignored, and the rest follow');
      t.equal([...ghosts.karts.map((k) => k.team)].sort().join(), [...ids].sort().join(), 'the same eight tubs race');
      const slot = makeRace(tr, { ...o, slot: 2 });
      t.equal(slot.player, 2, 'the balance tool can seat its bot in a chosen slot');
    },
  },
  {
    name: 'council C S1-19: a Grand Prix round after the first lines up by the cup standings',
    viewports: ['desktop'],
    async run(t) {
      await freshProfile(t);
      await t.game('scene', 'title'); await t.waitFrames(2);
      await t.game('act', 'menu', 'gp'); await t.game('act', 'menu', 'teamOk'); await t.game('act', 'menu', 'cls', { id: 'soak' });
      await t.game('act', 'menu', 'cup', { id: 'bathhouse' });
      await t.waitIdle(15000);
      const first = await t.state();
      t.equal(first.race.player, 7, 'round one starts the player last, as before');
      const teams = first.race.karts.map((k) => k.team), me = teams[first.race.player];
      // the player is third in the cup; the rest by points
      const standing = [teams[2], teams[5], me, teams[0], teams[1], teams[3], teams[4], teams[6]];
      await t.page.evaluate(([std, who]) => {
        const g = window.TR_APP.App.gp;
        g.rivals = std.filter((x) => x !== who);
        g.table = Object.fromEntries(std.map((id, i) => [id, { team: id, points: 40 - i * 4, clean: 0, human: id === who, bribes: 0 }]));
        g.recorded = 0;
      }, [standing, me]);
      await t.game('act', 'menu', 'nextRace');
      await t.waitIdle(15000);
      const second = await t.state();
      t.equal(second.race.karts.map((k) => k.team).join(), standing.join(), 'round two seats the field in cup order');
      t.equal(second.race.player, 2, 'the player starts third because they are third');
    },
  },

  // ---------------------------------------------------------------- S3-13
  {
    name: 'council C S3-13: rivals in the harder classes hold a duck for a target in reach and a hose for a straight',
    node: true,
    async run(t) {
      const tr = track('bathhouse-row');
      const vm = tr.a.vmax;
      const L = tr.length;
      let straight = null, corner = null;
      for (let s = 40; s < L - 80; s += 5) {
        const v = vm[tr.at(s + 25).i];
        if (straight === null && v > 18) straight = s;
        if (corner === null && v <= 18) corner = s;
      }
      t.expect(straight !== null && corner !== null, 'the course has a straight and a corner to test on');
      // one rival holding `item` at s, the tub it would aim at gap metres ahead of it
      const setup = (classId, item, s, gap) => {
        const race = makeRace(tr, { seed: 3, classId, player: null, rivals: ALL, count: 3 });
        race.phase = 'race';
        const [me, ahead, other] = race.karts;
        place(tr, me, s); place(tr, ahead, s + gap); place(tr, other, s - 150);
        me.place = 2; ahead.place = 1; other.place = 3;
        me.held = item; me.heldN = 1;
        race.drivers[me.id].itemDelay = 0;
        return race;
      };
      const fires = (race, secs = 0.2) => {
        for (let i = 0; i < Math.round(secs / DT) && race.items.live.length === 0; i++) stepItems(race, tr, [], DT);
        return race.items.live.length > 0 || race.karts[0].held === null;
      };
      t.expect(fires(setup('soak', 'duck', 300, 90)), 'Soak throws the duck at once, as before');
      t.expect(!fires(setup('scald', 'duck', 300, 90)), 'Scald keeps it while the tub ahead is 90 m away');
      t.expect(fires(setup('scald', 'duck', 300, 30)), 'Scald throws it when that tub is 30 m ahead');
      t.expect(fires(setup('boil', 'duck', 300, 30)), 'and so does Boil');
      t.expect(fires(setup('scald', 'duck', 300, 90), 8.6), 'Scald still throws it after waiting eight seconds');
      t.expect(fires(setup('soak', 'hose', corner, 20)), 'Soak opens the hose in a corner');
      t.expect(!fires(setup('scald', 'hose', corner, 20)), 'Scald keeps it for a straight');
      t.expect(fires(setup('scald', 'hose', straight, 20)), 'and opens it on one');
    },
  },

  // ---------------------------------------------------------------- S3-07
  {
    name: 'council C S3-07: the balance tool seats a bot and holds placement bands for every class, rising with the class',
    node: true,
    async run(t) {
      const T = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools', 'balance-targets.json'), 'utf8'));
      const b = T.botPlace;
      t.expect(b && ['splash', 'soak', 'scald', 'boil'].every((c) => Array.isArray(b[c]) && b[c][0] < b[c][1]), 'a band for every class');
      t.expect(b.splash[1] < b.soak[1] && b.soak[1] < b.scald[1] && b.scald[1] <= b.boil[1], 'the worst allowed placing rises with the class');
      t.expect(b.splash[0] < b.soak[0] && b.soak[0] < b.scald[0], 'and so does the best');
      const run = spawnSync(process.execPath, ['tools/balance.mjs', '--track', 'bathhouse-row', '--class', 'splash', '--races', '1', '--bot'], { cwd: ROOT, encoding: 'utf8', timeout: 1200000 });
      const line = (run.stdout || '').split('\n').find((l) => l.includes('bot mean place')) || '';
      t.expect(/bot mean place\s+\d\.\d{3}\s+target \d(\.\d)?–\d(\.\d)?\s+· placings (\d\/){7}\d/.test(line), 'the tool prints the bot\'s place and the placing counts: ' + line);
      t.expect(/target 2\.3/.test(line) || line.includes(String(b.splash[0])), 'against the committed band');
    },
  },

  // ---------------------------------------------------------------- S3-09
  {
    name: 'council C S3-09: each team that is won carries one signature, and no other team does',
    node: true,
    async run(t) {
      const locked = TEAMS.filter((x) => !x.unlocked).map((x) => x.id);
      t.equal(locked.join(), 'gator-gang,silks-stirrups,flamingo-flock,tub-ninjas', 'the four locked teams');
      for (const x of TEAMS) t.expect(!!x.sig === !x.unlocked, x.id + (x.unlocked ? ' has no signature' : ' has a signature line: ' + x.sig));
      const gator = kartStats('gator-gang', 'soak'), plain = kartStats('engine-six', 'soak');
      t.equal(plain.wall, 1, 'a normal tub loses its usual speed to a wall');
      t.expect(Math.abs(gator.wall - 0.6) < 1e-9, 'Gator Gang lose 40% less: ' + gator.wall);
      t.expect(Math.abs(kartStats('gator-gang', 'splash').wall - 0.7 * 0.6) < 1e-9, 'on top of the class\'s own wall rule');
      t.equal(plain.startBoost + plain.charge + plain.bump, 3, 'a normal tub has all three at 1');
    },
  },
  {
    name: 'council C S3-09: Silks & Stirrups get a longer start boost, Flamingos charge a slide sooner, Ninjas lose no water to a bump',
    node: true,
    async run(t) {
      const tr = track('bathhouse-row');
      // the timed press just before SCRUB!
      const boost = (team) => {
        const race = makeRace(tr, { seed: 2, classId: 'soak', player: team, rivals: ALL, count: 2 });
        race.time = -DT / 2; race.pushAtGo[race.player] = -0.1;
        stepRace(race, tr, race.karts.map((k) => (k.human ? { push: 1, steer: 0 } : {})), DT);
        return race.karts[race.player].boostT;
      };
      const plain = boost('engine-six'), silks = boost('silks-stirrups');
      t.expect(Math.abs(plain - 0.9) < 0.05, 'a normal start boost lasts about 0.9 s: ' + plain);
      t.expect(Math.abs(silks / plain - 1.5) < 0.05, 'Silks & Stirrups: 50% longer: ' + silks);
      // a power slide held for the same time
      const charge = (team) => {
        const k = makeKart(0, team, 'soak', gridPoses(tr, 1)[0], { human: true });
        k.vf = 13;
        for (let i = 0; i < 12; i++) stepKart(k, { steer: 0.8, push: 1, brake: false, hop: false }, tr, DT); // the steering builds up first
        for (let i = 0; i < 50; i++) { k.vf = Math.max(k.vf, 13); stepKart(k, { steer: 0.8, push: 1, brake: false, hop: true }, tr, DT); }
        return k.charge;
      };
      const c0 = charge('engine-six'), c1 = charge('flamingo-flock');
      t.expect(c0 > 0.3, 'the slide charged: ' + c0);
      t.expect(c1 / c0 > 1.1 && c1 / c0 < 1.3, 'Flamingo Flock charge about 20% faster: ' + (c1 / c0).toFixed(3));
      // a head-on bump
      const bump = (team) => {
        const a = makeKart(0, team, 'soak', gridPoses(tr, 2)[0]), b = makeKart(1, 'engine-six', 'soak', gridPoses(tr, 2)[0]);
        place(tr, a, 200); place(tr, b, 201.5);
        a.vf = 12; b.vf = 2;
        const before = a.water.gal;
        collideKarts([a, b], DT);
        return before - a.water.gal;
      };
      t.expect(bump('engine-six') > 0.1, 'a normal tub spills water in a bump: ' + bump('engine-six'));
      t.equal(bump('tub-ninjas'), 0, 'Tub Ninjas spill none');
    },
  },
  {
    name: 'council C S3-09: the team card names the signature, and a tap on a locked team says what it is and how to win it',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await freshProfile(t);
      await t.game('scene', 'title'); await t.waitFrames(2);
      await t.game('act', 'menu', 'quick'); await t.waitFrames(3);
      await t.page.click('.tcard[data-id="gator-gang"]', { force: true });
      await t.waitFrames(2);
      const note = await t.page.evaluate(() => (document.querySelector('[data-menu-note]') || {}).textContent || '');
      t.equal(note, 'Gator Gang: Thick hide: wall hits cost 40% less speed. Win a Grand Prix cup to unlock this team: it is next.', 'the locked card answers');
      // open it, and the card carries the line
      const s = await readSave(t); s.unlocked.teams = ['gator-gang']; await setSave(t, s);
      await t.reload(); await t.waitIdle(8000);
      await t.game('act', 'menu', 'quick'); await t.waitFrames(3);
      await t.page.click('.tcard[data-id="gator-gang"]');
      await t.waitFrames(3);
      const sig = await t.page.evaluate(() => (document.querySelector('.team-info .sig') || {}).textContent || '');
      t.equal(sig, 'Signature: Thick hide: wall hits cost 40% less speed.', 'the signature is on the team card');
      await shot(t, 'S3-09', 'team-signature');
      await t.checkLayout({ allowScrollY: true });
    },
  },

  // ---------------------------------------------------------------- S2-24
  {
    name: 'council C S2-24: the title shows a turning tub, and keeps one when you come back from a menu',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await freshProfile(t);
      await t.game('scene', 'title'); await t.waitFrames(6);
      const tub = () => t.page.evaluate(() => { const A = window.TR_APP.App; return A.preview ? { team: A.preview.team, title: A.titleTeam, scene: A.scene, screen: A.screens.cur, visible: A.preview.view.mesh.visible } : null; });
      let p = await tub();
      t.expect(p && p.scene === 'title' && p.screen === 'title', 'on the title');
      t.expect(p && p.team === p.title && p.visible, 'a tub is on the road behind the menu: ' + JSON.stringify(p));
      t.expect(['engine-six', 'lather-linen', 'velvet-mob', 'bubble-patrol', 'trail-shredders', 'out-of-towners', 'steam-rangers', 'suds-posse'].includes(p.team), 'a team the player has open, not a locked one: ' + p.team);
      await t.waitFrames(3);
      await shot(t, 'S2-24', 'title-tub');
      await t.checkLayout({ allowScrollY: true });
      await t.game('act', 'menu', 'quick'); await t.waitFrames(3);
      await t.game('act', 'menu', 'team', { id: 'suds-posse' }); await t.waitFrames(3);
      t.equal((await tub()).team, 'suds-posse', 'the team menu shows the team you are looking at');
      await t.game('act', 'menu', 'back'); await t.waitFrames(4);
      p = await tub();
      t.expect(p && p.screen === 'title' && p.team === p.title, 'back on the title the tub is the title\'s again: ' + JSON.stringify(p));
    },
  },

  // ---------------------------------------------------------------- P-N06
  {
    name: 'council C P-N06: Quick Race offers laps, items and rivals, remembers them, and races them',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await freshProfile(t);
      await goToCourses(t);
      const chips = () => t.page.evaluate(() => [...document.querySelectorAll('.race-opts .chip')].map((c) => `${c.dataset.k}=${c.dataset.v}${c.getAttribute('aria-pressed') === 'true' ? '*' : ''}`).join(' '));
      t.equal(await chips(), 'raceLaps=1 raceLaps=3* raceLaps=5 raceItems=true* raceItems=false raceRivals=3 raceRivals=7*', 'today\'s race is the default: 3 laps, items on, 7 rivals');
      await t.page.click('.race-opts [data-k="raceLaps"][data-v="5"]'); await t.waitFrames(2);
      const focus = await t.page.evaluate(() => { const a = document.activeElement; return a ? `${a.dataset.k}=${a.dataset.v}` : ''; });
      t.equal(focus, 'raceLaps=5', 'the chip you pressed keeps the focus');
      await t.page.click('.race-opts [data-k="raceItems"][data-v="false"]'); await t.waitFrames(2);
      await t.page.click('.race-opts [data-k="raceRivals"][data-v="3"]'); await t.waitFrames(2);
      t.equal(await chips(), 'raceLaps=1 raceLaps=3 raceLaps=5* raceItems=true raceItems=false* raceRivals=3* raceRivals=7', 'the choices show');
      await shot(t, 'P-N06', 'race-setup');
      await t.checkLayout({ allowScrollY: true });
      const small = await t.page.evaluate(() => [...document.querySelectorAll('.race-opts .chip')].map((c) => { const r = c.getBoundingClientRect(); return { w: r.width, h: r.height }; }).filter((r) => r.w < 40 || r.h < 40));
      t.expect(small.length === 0, 'touch targets stay large: ' + JSON.stringify(small));
      const sv = await readSave(t);
      t.expect(sv.settings.raceLaps === 5 && sv.settings.raceItems === false && sv.settings.raceRivals === 3, 'saved: ' + JSON.stringify([sv.settings.raceLaps, sv.settings.raceItems, sv.settings.raceRivals]));
      await t.reload(); await t.waitIdle(8000);
      t.equal(await t.page.evaluate(() => { const s = window.__game.getState().settings; return [s.raceLaps, s.raceItems, s.raceRivals].join(); }), '5,false,3', 'and still there after a reload');
      await goToCourses(t);
      await t.game('act', 'menu', 'course', { id: 'bathhouse-row' });
      await t.waitIdle(15000);
      const s = await t.state();
      t.equal(s.race.laps, 5, 'the race is five laps');
      t.equal(s.race.karts.length, 4, 'with the player and three rivals');
      t.equal(s.race.items.bubbles, 0, 'and no item bubbles');
      // a damaged value is today's race
      const bad = await readSave(t); bad.settings.raceLaps = 99; bad.settings.raceRivals = 'many'; bad.settings.raceItems = 'maybe';
      await setSave(t, bad);
      await t.reload(); await t.waitIdle(8000);
      t.equal(await t.page.evaluate(() => { const s = window.__game.getState().settings; return [s.raceLaps, s.raceItems, s.raceRivals].join(); }), '3,true,7', 'damaged values fall back to the usual race');
    },
  },
  {
    name: 'council C P-N06: a race with a custom setup is not kept as a course record, and says so; a usual race still is',
    viewports: ['desktop'],
    async run(t) {
      await freshProfile(t);
      await t.game('act', 'clearSave');
      await startRace(t, { laps: 1, autoplay: true });
      await t.stepUntil((s) => s.race.phase === 'done', { max: 60 * 400, chunk: 600, label: 'the one-lap race ends' });
      await t.page.waitForSelector('.panel.results', { timeout: 8000 });
      const sub = await t.page.evaluate(() => document.querySelector('.panel.results .sub').textContent);
      t.expect(/custom setup, not kept as a record/.test(sub), 'the results say so: ' + sub);
      t.equal(await t.page.evaluate(() => window.__game.getState().best), null, 'no course best was written');
      t.expect(!/NEW RECORD/.test(sub), 'and it is not called a record');
      await startRace(t, { laps: 3, autoplay: true });
      await t.stepUntil((s) => s.race.phase === 'done', { max: 60 * 600, chunk: 600, label: 'the three-lap race ends' });
      await t.page.waitForSelector('.panel.results', { timeout: 8000 });
      t.expect((await t.page.evaluate(() => window.__game.getState().best)) !== null, 'a usual three-lap race still sets the course best');
      t.expect(!/custom/.test(await t.page.evaluate(() => document.querySelector('.panel.results .sub').textContent)), 'and carries no custom note');
    },
  },

  // ---------------------------------------------------------------- S1-07
  {
    name: 'council C S1-07: once you are over the line, Enter or a tap on the prompt goes to the results',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await freshProfile(t);
      await startRace(t, { laps: 1, autoplay: true, seed: 5 });
      // a driven tub, with the player's prompt; and a rival that is stuck, so the field takes its time
      await t.page.evaluate(() => { const A = window.TR_APP.App; A.raceOpts.autoplay = false; const k = A.race.karts[0]; k.state = 'rescue'; k.stateT = 1e9; });
      await t.stepUntil((s) => s.race.karts[s.race.player].finished, { max: 60 * 300, chunk: 30, label: 'the player finishes' });
      let s = await t.state();
      t.equal(s.race.phase, 'race', 'the rest of the field is still racing');
      const prompt = () => t.page.evaluate(() => { const b = document.querySelector('.hud-skip'); return { hidden: b.hidden, text: b.textContent, shown: getComputedStyle(b).display !== 'none' }; });
      await t.waitFrames(3);
      t.equal((await prompt()).hidden, true, 'no prompt in the first moments after the line');
      await t.page.keyboard.press('Enter');
      t.equal((await t.state()).race.phase, 'race', 'a key pressed as the tub crosses does not skip the finish');
      await t.game('step', 130); await t.waitFrames(3);
      s = await t.state();
      t.equal(s.race.phase, 'race', 'still waiting for the field');
      const p = await prompt();
      t.expect(!p.hidden && p.shown && /results/.test(p.text), 'the prompt is up: ' + JSON.stringify(p));
      await shot(t, 'S1-07', 'skip-prompt');
      await t.checkLayout({ allowScrollY: true });
      if (t.viewport === 'mobile') await t.page.click('.hud-skip'); else await t.page.keyboard.press('Enter');
      t.equal((await t.state()).race.phase, 'done', 'the race is over at once');
      await t.game('step', 2);
      await t.page.waitForSelector('.panel.results', { timeout: 8000 });
      const rows = await t.page.evaluate(() => document.querySelectorAll('.panel.results tbody tr').length);
      t.equal(rows, 8, 'the results list everyone, the rest estimated');
      t.equal((await prompt()).hidden, true, 'and the prompt is put away');
    },
  },

  // ---------------------------------------------------------------- S2-02
  {
    name: 'council C S2-02: a pickup is named in a call-out and under the item tile, and How to Play lists every item',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await freshProfile(t);
      await startRace(t);
      const call = () => t.page.evaluate(() => document.querySelector('.hud-call').textContent);
      await t.game('act', 'event', { type: 'pickup', item: 'duck' });
      await t.waitFrames(2);
      t.equal(await call(), `${ITEMS.duck.name}: ${ITEMS.duck.tip}`, 'the pickup says what it is');
      await t.game('setState', { kart: { held: 'duck' } }); await t.waitFrames(3);
      t.equal(await t.page.evaluate(() => document.querySelector('.item-name').textContent), 'Rubber Duck', 'the name sits under the tile');
      await shot(t, 'S2-02', 'pickup-callout');
      await t.checkLayout({ allowScrollY: true });
      await t.game('setState', { kart: { held: 'jet3' } }); await t.waitFrames(3);
      t.equal(await t.page.evaluate(() => document.querySelector('.item-name').textContent), 'Triple Thermal Jet', 'and follows the item');
      await t.game('setState', { kart: { held: null } }); await t.waitFrames(3);
      t.equal(await t.page.evaluate(() => document.querySelector('.item-name').textContent), '', 'nothing is named when nothing is held');
      // a more important call-out is not covered
      await t.game('act', 'event', { type: 'bribe' }); await t.waitFrames(2);
      await t.game('act', 'event', { type: 'pickup', item: 'hose' }); await t.waitFrames(2);
      t.equal(await call(), 'Bribe accepted: HEAD START!', 'a call-out that is up stays up');
      // How to Play
      await t.game('scene', 'help'); await t.waitFrames(4);
      const li = await t.page.evaluate(() => [...document.querySelectorAll('.help .item-list li')].map((e) => e.textContent.replace(/\s+/g, ' ').trim()));
      t.equal(li.length, Object.keys(ITEMS).length, 'one line per item');
      for (const it of Object.values(ITEMS)) t.expect(li.some((l) => l === `${it.name} ${it.tip}`), 'listed: ' + it.name);
      const lead = await t.page.evaluate(() => document.querySelector('.help').textContent);
      t.expect(/Collect bath tickets\. Drive through a judge's lane with three for a head start\./.test(lead), 'and the tickets are explained');
      t.equal(await t.page.evaluate(() => [...document.querySelectorAll('.help .item-list img')].every((i) => i.src.startsWith('data:image/png') && i.src.length > 200)), true, 'each with its icon');
      await t.page.evaluate(() => document.querySelector('.help .item-list').scrollIntoView({ block: 'start' }));
      await t.waitFrames(3);
      await shot(t, 'S2-02', 'help-items');
      await t.checkLayout({ allowScrollY: true });
    },
  },

  // ---------------------------------------------------------------- S2-08
  {
    name: 'council C S2-08: a tap on a locked team, class, cup or Mirror answers in the panel and is announced',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await freshProfile(t);
      await t.game('scene', 'title'); await t.waitFrames(2);
      const note = () => t.page.evaluate(() => { const n = document.querySelectorAll('[data-menu-note]'); const e = n[0]; if (!e) return null; const r = e.getBoundingClientRect(); return { n: n.length, text: e.textContent, role: e.getAttribute('role'), inView: r.top >= 0 && r.bottom <= innerHeight, wide: r.width > 40 }; });
      // classes
      await t.game('act', 'menu', 'quick'); await t.game('act', 'menu', 'teamOk'); await t.waitFrames(3);
      await t.page.click('[data-act="locked"][data-id="scald"]', { force: true }); await t.waitFrames(2);
      let n = await note();
      t.expect(n && n.text === 'Win a cup on Soak to unlock Scald.' && n.role === 'status' && n.inView && n.wide, 'Scald: ' + JSON.stringify(n));
      await shot(t, 'S2-08', 'locked-class');
      await t.page.click('[data-act="locked"][data-id="boil"]', { force: true }); await t.waitFrames(2);
      n = await note();
      t.expect(n && n.n === 1 && n.text === 'Win a cup on Scald to unlock Boil.', 'a second tap replaces the note: ' + JSON.stringify(n));
      await t.checkLayout({ allowScrollY: true });
      // cups
      await t.game('act', 'menu', 'back'); await t.game('act', 'menu', 'back'); await t.waitFrames(2);
      await t.game('act', 'menu', 'gp'); await t.game('act', 'menu', 'teamOk'); await t.game('act', 'menu', 'cls', { id: 'soak' }); await t.waitFrames(3);
      await t.page.click('.ccard[data-id="ouachita"]', { force: true }); await t.waitFrames(2);
      n = await note();
      t.expect(n && n.text === 'Finish on the podium in the Bathhouse Cup to unlock the Ouachita Cup.' && n.inView, 'the cup: ' + JSON.stringify(n));
      await t.page.click('.mirror-row [data-act="locked"]', { force: true }); await t.waitFrames(2);
      n = await note();
      t.expect(n && n.text === 'Win a cup on Scald to unlock Mirror.', 'Mirror: ' + JSON.stringify(n));
      await shot(t, 'S2-08', 'locked-cup');
      // the old HUD call-out is gone
      t.equal(await t.page.evaluate(() => document.querySelector('.hud-call').textContent), '', 'nothing is flashed on the hidden HUD');
    },
  },

  // ---------------------------------------------------------------- S2-09
  {
    name: 'council C S2-09: a finished race records which items were lost and whether the water was short',
    node: true,
    async run(t) {
      const tr = track('bathhouse-row');
      const mk = (items, gal) => {
        const race = makeRace(tr, { seed: 4, classId: 'soak', player: 'engine-six', rivals: ALL });
        const me = race.karts[race.player];
        Object.assign(me.items, items); me.water.gal = gal; me.finished = true; me.finishT = 100;
        me.clean = gal >= 10 && Object.values(me.items).every(Boolean);
        finishRace(race, tr);
        return race.results.find((r) => r.human);
      };
      let r = mk({ towel: false, soap: false }, 8.3);
      t.equal(r.lost.join(), 'towel,soap', 'lost items'); t.equal(r.dry, true, 'water short');
      r = mk({}, 30);
      t.equal(r.lost.length, 0, 'nothing lost'); t.equal(r.dry, false, 'water fine'); t.equal(r.clean, true, 'and it is a Clean Finish');
    },
  },
  {
    name: 'council C S2-09: the results say in words why a Clean Finish was or was not earned',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await freshProfile(t);
      await t.game('scene', 'title'); await t.waitFrames(2);
      const show = (me, extra = {}) => t.page.evaluate(([m, x]) => {
        const rows = ['engine-six', 'lather-linen', 'velvet-mob', 'bubble-patrol', 'trail-shredders', 'out-of-towners', 'steam-rangers', 'suds-posse'];
        const results = rows.map((team, i) => ({ place: i + 1, kart: i, team, human: i === 5, time: 160 + i * 3.1, estimated: false, gal: 14, items: 4, lost: [], dry: false, clean: i % 2 === 0, points: [10, 8, 6, 5, 4, 3, 2, 1][i], tickets: 0, bestLap: 50 }));
        Object.assign(results[5], m);
        window.TR_APP.App.screens.show('results', { results, laps: 3, trackName: 'Bathhouse Row', gp: false, newRecord: false, mode: 'quick', fact: null, ...x });
      }, [me, extra]);
      const line = () => t.page.evaluate(() => { const e = document.querySelector('.panel.results .clean-note'); return e ? e.textContent.replace(/\s+/g, ' ').trim() : null; });
      await show({ clean: false, lost: ['towel'], dry: true, gal: 8.3 });
      t.equal(await line(), 'No Clean Finish: lost the towel and finished with 8.3 gal, under the 10 needed.', 'items and water');
      await t.page.evaluate(() => document.querySelector('.panel.results').scrollTo(0, 0));
      await shot(t, 'S2-09', 'no-clean-finish');
      await t.checkLayout({ allowScrollY: true });
      await show({ clean: false, lost: ['soap', 'loofah'], dry: false, gal: 22 });
      t.equal(await line(), 'No Clean Finish: lost the soap and the loofah mitt.', 'two items');
      await show({ clean: false, lost: [], dry: true, gal: 10 });
      t.equal(await line(), 'No Clean Finish: finished just under 10 gal.', 'a rounding edge reads sensibly');
      await show({ clean: true });
      t.equal(await line(), 'CLEAN Clean Finish: 10 gallons or more and all four items, for a bonus point.', 'earned');
      await show({ clean: false, estimated: true, lost: ['towel'] });
      t.equal(await line(), null, 'a tub that did not finish has no Clean Finish to explain');
      await show({ clean: false, lost: ['towel'], dry: true, gal: 3 }, { mode: 'battle' });
      t.equal(await line(), null, 'and Water Fight has none');
    },
  },
];
