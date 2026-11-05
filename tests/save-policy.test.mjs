// Portable fixture tests. These exercise storage policy, not earned gameplay.
import assert from 'node:assert/strict';
import { createSaveWriter, DEFAULT_SAVE } from '../src/js/save.js';
const clone = (v) => JSON.parse(JSON.stringify(v));
const record = (time, team = 'engine-six') => ({ race: +time.toFixed(3), lap: 30, team, cls: 'splash' });
const ghost = (tag) => ({ v: 1, team: tag, total: 90, n: 2, t: 'AAAAAA==', x: 'AAAAAA==', z: 'AAAAAA==', y: 'AAAAAA==', yaw: 'AAAAAA==' });
function fixture(initial = DEFAULT_SAVE()) {
  const box = { raw: initial === null ? null : JSON.stringify(initial), readFails: false, writeFails: false, writes: 0 };
  const writer = createSaveWriter({ read() { if (box.readFails) throw Error('blocked read'); return box.raw; },
    write(raw) { box.writes++; if (box.writeFails) throw Error('quota'); box.raw = raw; } });
  const save = writer.load();
  return { box, writer, save, commit: (intent = {}) => writer.commit(save, intent), stored: () => JSON.parse(box.raw) };
}
function earned(f, time, { token = {}, won = false, recorded = null, team = 'engine-six' } = {}) {
  return f.commit({ race: { token, won, record: { track: 'bathhouse-row', finishT: time, value: record(time, team), ghost: recorded } } });
}
const award = (token = {}, key = 'bathhouse:soak', place = 1) => ({ cup: { token, key, place, soak: key.endsWith(':soak'), teamOrder: ['gator-gang', 'silks-stirrups', 'ducky-lucky', 'steam-seekers'] } });
const test = (name, run) => ({ name: 'save policy: ' + name, node: true, run });
export const tests = [
  test('changed preference and selection retain fresh progress and unrelated fields', () => {
    const f = fixture(), fresh = DEFAULT_SAVE();
    fresh.best['bathhouse-row'] = record(190.45); fresh.ghosts.x = ghost('remote');
    fresh.cups['bathhouse:soak'] = 1; fresh.unlocked.teams.push('gator-gang');
    fresh.stats = { races: 8, wins: 2, gallonsSpilled: 19 }; fresh.lastClass = 'splash';
    fresh.settings.music = false; fresh.extra = { legacy: 7 };
    f.box.raw = JSON.stringify(fresh);
    f.commit({ settings: { sound: false } }); f.commit({ lastTeam: 'lather-linen' });
    const s = f.stored();
    for (const k of ['best', 'ghosts', 'cups', 'unlocked', 'stats', 'extra']) assert.deepEqual(s[k], fresh[k], k);
    assert.equal(s.lastClass, 'splash'); assert.equal(s.lastTeam, 'lather-linen');
    assert.equal(s.settings.sound, false); assert.equal(s.settings.music, false);
  }),
  test('ordinary writes do not resurrect an externally cleared cached save', () => {
    const old = DEFAULT_SAVE(); old.best.x = record(80); old.stats.races = 12; old.unlocked.teams.push('gator-gang');
    const f = fixture(old); f.box.raw = null;
    f.commit({ settings: { sound: false }, lastClass: 'splash' });
    assert.deepEqual(f.stored().best, {}); assert.equal(f.stored().stats.races, 0);
    assert.deepEqual(f.stored().unlocked.teams, []); assert.equal(f.stored().settings.sound, false);
  }),
  test('new completions add once across failed writes, a replacement race and retry', () => {
    const f = fixture(), first = {}, second = {};
    f.box.writeFails = true; earned(f, 90, { token: first, won: true }); earned(f, 80, { token: second });
    earned(f, 90, { token: first, won: true });
    assert.equal(f.save.stats.races, 2); assert.equal(f.save.stats.wins, 1);
    const remote = DEFAULT_SAVE(); remote.stats.races = 7; remote.stats.wins = 3;
    f.box.raw = JSON.stringify(remote); f.box.writeFails = false;
    f.commit({ settings: { sound: false } });
    assert.equal(f.stored().stats.races, 9); assert.equal(f.stored().stats.wins, 4);
    f.commit(); assert.equal(f.stored().stats.races, 9);
  }),
  test('raw finish time is compared before rounding and complete lap record stays together', () => {
    const s = DEFAULT_SAVE(); s.best['bathhouse-row'] = record(90, 'old'); s.ghosts['bathhouse-row'] = ghost('old');
    const f = fixture(s); const no = earned(f, 90.0004, { recorded: ghost('slow') });
    assert.equal(no.recordAccepted, false); assert.equal(f.stored().best['bathhouse-row'].team, 'old');
    const yes = earned(f, 89.9996, { recorded: ghost('new'), team: 'new' });
    assert.equal(yes.recordAccepted, true); assert.deepEqual(f.stored().best['bathhouse-row'], record(89.9996, 'new'));
    assert.equal(f.stored().ghosts['bathhouse-row'].team, 'new');
  }),
  test('pending recorded90 then unrecorded80 does not admit later recorded85', () => {
    for (const remoteBest of [95, 85]) {
      const f = fixture(); f.box.writeFails = true;
      earned(f, 90, { recorded: ghost('recorded90') }); earned(f, 80);
      earned(f, 85, { recorded: ghost('nonimproving85') });
      const remote = DEFAULT_SAVE(); remote.best['bathhouse-row'] = record(remoteBest); remote.ghosts['bathhouse-row'] = ghost('remote');
      f.box.raw = JSON.stringify(remote); f.box.writeFails = false; f.commit({ settings: { sound: false } });
      assert.equal(f.stored().best['bathhouse-row'].race, 80);
      assert.equal(f.stored().ghosts['bathhouse-row'].team, remoteBest === 95 ? 'recorded90' : 'remote');
    }
  }),
  test('rounding-boundary pending transitions preserve conditional ghost eligibility', () => {
    for (const remoteBest of [100, 90.0003]) {
      const f = fixture(); f.box.writeFails = true;
      earned(f, 90.0004, { recorded: ghost('first') }); earned(f, 90.0002, { recorded: ghost('second') });
      const remote = DEFAULT_SAVE(); remote.best['bathhouse-row'] = record(100);
      remote.best['bathhouse-row'].race = remoteBest; remote.ghosts['bathhouse-row'] = ghost('remote');
      f.box.raw = JSON.stringify(remote); f.box.writeFails = false; f.commit();
      assert.equal(f.stored().best['bathhouse-row'].race, 90);
      assert.equal(f.stored().ghosts['bathhouse-row'].team, remoteBest === 100 ? 'first' : 'second');
    }
  }),
  test('blocked first-read cup survives GP replacement and resolves unlock IDs once', () => {
    const f = fixture(), first = {}, second = {};
    f.box.readFails = true; const blocked = f.commit(award(first));
    assert.equal(blocked.resolved, false); assert.equal(blocked.unlockedTeam, null);
    earned(f, 100, { won: true }); f.commit(award(second, 'ouachita:soak'));
    assert.equal(f.save.stats.races, 1);
    f.box.readFails = false; f.box.writeFails = true;
    const resolved = f.commit({ settings: { sound: false } }); assert.equal(resolved.stored, false);
    assert.deepEqual(f.save.unlocked.teams, ['gator-gang', 'silks-stirrups']);
    f.box.writeFails = false; f.commit(); f.commit(award(first)); f.commit(award(second, 'ouachita:soak'));
    assert.deepEqual(f.stored().unlocked.teams, ['gator-gang', 'silks-stirrups']);
    assert.ok(f.stored().unlocked.classes.includes('scald')); assert.equal(f.stored().stats.races, 1);
    assert.deepEqual(f.stored().cups, { 'bathhouse:soak': 1, 'ouachita:soak': 1 });
  }),
  test('write-failed exact cup award persists through new cup and changed current unlocks', () => {
    const f = fixture(), first = {};
    f.box.writeFails = true; f.commit(award(first));
    assert.equal(f.save.unlocked.teams[0], 'gator-gang');
    const remote = DEFAULT_SAVE(); remote.unlocked.teams.push('gator-gang');
    f.box.raw = JSON.stringify(remote); f.commit(award({}, 'ouachita:splash', 2));
    f.box.writeFails = false; f.commit({ lastClass: 'splash' });
    assert.deepEqual(f.stored().unlocked.teams, ['gator-gang']);
    assert.equal(f.stored().cups['ouachita:splash'], 2);
    assert.equal(f.stored().cups['bathhouse:soak'], 1);
  }),
  test('unreadable malformed and unsupported latest values never authorize replacement', () => {
    for (const raw of ['{bad', 'null', '{"v":2}', '{"v":1,"best":[]}', '{"v":1,"stats":{"races":-1}}']) {
      const f = fixture(); f.box.raw = raw; const before = f.box.writes;
      const r = f.commit({ settings: { sound: false } });
      assert.equal(r.stored, false); assert.equal(r.readable, false);
      assert.equal(f.box.raw, raw); assert.equal(f.box.writes, before);
      const remote = DEFAULT_SAVE(); remote.stats.races = 9; f.box.raw = JSON.stringify(remote);
      f.commit(); assert.equal(f.stored().stats.races, 9); assert.equal(f.stored().settings.sound, false);
    }
  }),
  test('failed-read previews do not add pending stats repeatedly', () => {
    const f = fixture(); f.box.readFails = true;
    earned(f, 90, { won: true }); f.commit({ settings: { sound: false } }); f.commit();
    assert.equal(f.save.stats.races, 1); assert.equal(f.save.stats.wins, 1);
    f.box.readFails = false; f.commit(); assert.equal(f.stored().stats.races, 1);
  }),
  test('migration precedes explicit resolution choice and preserves unrelated current settings', () => {
    const legacy = { v: 1, settings: { res: 'authentic', music: false }, best: {}, extra: 4 };
    const f = fixture(legacy); assert.equal(f.save.settings.res, 'native');
    f.commit({ settings: { res: 'authentic' } });
    assert.equal(f.stored().settings.res, 'authentic'); assert.equal(f.stored().settings.brick, true);
    assert.equal(f.writer.load().settings.res, 'authentic'); assert.equal(f.stored().settings.music, false);
    const fresh = fixture(null); fresh.commit({ settings: { res: 'authentic' } });
    assert.equal(fresh.writer.load().settings.res, 'authentic');
  }),
  test('outer alias stays stable while loaded copies and missing-key progress stay isolated', () => {
    const f = fixture(), alias = f.save;
    const detached = f.writer.load(); detached.stats.races = 999;
    f.commit({ lastTeam: 'lather-linen' });
    assert.equal(f.save, alias); assert.equal(alias.stats.races, 0);
    f.box.readFails = true; earned(f, 90);
    f.box.readFails = false; f.box.raw = null; f.commit({ settings: { sound: false } });
    assert.equal(f.stored().stats.races, 1); assert.equal(f.stored().best['bathhouse-row'].race, 90);
  }),
  test('cup place and explicit additions preserve newer remote awards', () => {
    const remote = DEFAULT_SAVE(); remote.cups['bathhouse:soak'] = 1;
    remote.unlocked.teams.push('gator-gang'); remote.unlocked.mirror = true;
    const f = fixture(); f.box.raw = JSON.stringify(remote);
    f.commit(award({}, 'bathhouse:soak', 3)); const s = f.stored();
    assert.equal(s.cups['bathhouse:soak'], 1); assert.deepEqual(s.unlocked.teams, ['gator-gang']);
    assert.equal(s.unlocked.mirror, true); assert.equal(s.stats.gallonsSpilled, 0);
  }),
];
