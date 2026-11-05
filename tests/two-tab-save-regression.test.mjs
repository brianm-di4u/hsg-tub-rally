// Arranged storage/GP/finish regression fixtures. Hooks/steps here are not earned play.
// Runtime preference checks inspect existing closure objects read-only via Chromium CDP;
// no game hook, production export or runtime mutation is added for observation.
const KEY = 'hsg-tub-rally-v1', TRACK = 'bathhouse-row';
function installFixture() {
  const base = { v: 1, settings: { sound: true, music: true, volume: .6, res: 'native', quality: 'auto', autoPush: false, reducedMotion: false, brick: true },
    unlocked: { teams: [], cups: ['bathhouse'], classes: ['splash', 'soak'], mirror: false },
    best: {}, ghosts: {}, cups: {}, stats: { races: 0, wins: 0, gallonsSpilled: 0 }, lastTeam: 'engine-six', lastClass: 'soak' };
  const get = Storage.prototype.getItem, set = Storage.prototype.setItem;
  if (!sessionStorage.getItem('save-regression-fixture-installed')) {
    set.call(localStorage, 'hsg-tub-rally-v1', JSON.stringify(base));
    sessionStorage.setItem('save-regression-fixture-installed', 'true');
  }
  const f = window.__saveFixture = { readFails: false, writeFails: false,
    raw: () => get.call(localStorage, 'hsg-tub-rally-v1'),
    replace: (value) => value === null ? localStorage.removeItem('hsg-tub-rally-v1') : set.call(localStorage, 'hsg-tub-rally-v1', typeof value === 'string' ? value : JSON.stringify(value)) };
  Storage.prototype.getItem = function (key) { if (key === 'hsg-tub-rally-v1' && f.readFails) throw Error('fixture blocked read'); return get.call(this, key); };
  Storage.prototype.setItem = function (key, value) { if (key === 'hsg-tub-rally-v1' && f.writeFails) throw Error('fixture failed write'); return set.call(this, key, value); };
}
const parsed = (t) => t.page.evaluate(() => JSON.parse(window.__saveFixture.raw()));
const raw = (t) => t.page.evaluate(() => window.__saveFixture.raw());
const replace = (t, value) => t.page.evaluate((value) => window.__saveFixture.replace(value), value);
const faults = (t, value) => t.page.evaluate((value) => Object.assign(window.__saveFixture, value), value);
const same = (t, a, b, text) => t.equal(JSON.stringify(a), JSON.stringify(b), text);
async function scopeValue(cdp, fn, name) {
  const props = await cdp.send('Runtime.getProperties', { objectId: fn, ownProperties: false });
  const scopes = props.internalProperties?.find((p) => p.name === '[[Scopes]]')?.value?.objectId;
  if (!scopes) throw Error('Fixture observation unavailable: no function scopes');
  const list = await cdp.send('Runtime.getProperties', { objectId: scopes, ownProperties: true });
  for (const p of list.result.filter((p) => /^\d+$/.test(p.name)).slice(0,16)) {
    if (!p.value?.objectId) continue;
    const scope = await cdp.send('Runtime.getProperties', { objectId: p.value.objectId, ownProperties: true });
    const found = scope.result.find((v) => v.name === name);
    if (found?.value?.objectId) return found.value.objectId;
  }
  throw Error('Fixture observation unavailable: missing scope ' + name);
}
async function property(cdp, objectId, name) {
  const p = await cdp.send('Runtime.getProperties', { objectId, ownProperties: true });
  const id = p.result.find((v) => v.name === name)?.value?.objectId;
  if (!id) throw Error('Fixture observation unavailable: missing ' + name);
  return id;
}
async function readObject(cdp, objectId, functionDeclaration) {
  const r = await cdp.send('Runtime.callFunctionOn', { objectId, functionDeclaration, returnByValue: true });
  if (r.exceptionDetails) throw Error('Fixture read failed: ' + r.exceptionDetails.text);
  return r.result.value;
}
async function runtime(t) {
  const cdp = await t.page.context().newCDPSession(t.page);
  try {
    const fn = (await cdp.send('Runtime.evaluate', { expression: 'window.__game.getState' })).result.objectId;
    const app = await scopeValue(cdp, fn, 'App'), api = await scopeValue(cdp, fn, 'api');
    const menu = await property(cdp, api, 'onMenu'), input = await scopeValue(cdp, menu, 'INPUT');
    const audioFn = await property(cdp, app, 'audioState'), audio = await scopeValue(cdp, audioFn, 'state');
    return { ...await readObject(cdp, app, 'function(){return {reducedMotion:this.reducedMotion,res:this.renderer.mode,tier:this.tier,quality:this.save.settings.quality,alias:this.screens.app.save===this.save,unlocked:JSON.parse(JSON.stringify(this.save.unlocked)),saveError:this.saveError||""}}'),
      input: await readObject(cdp, input, 'function(){return {autoPush:this.autoPush}}'),
      audio: await readObject(cdp, audio, 'function(){return {on:this.on,music:this.music,vol:this.vol,started:this.started}}') };
  } finally { await cdp.detach(); }
}
async function settings(t) {
  await t.game('scene', 'title');
  await t.page.locator('[data-act="settings"]').click(); await t.waitFrames(2);
}
async function finish(t, options = {}) {
  await t.game('newGame', { track: TRACK, team: 'engine-six', mode: 'timetrial', count: 1, laps: 1, paused: true, autoplay: true, seed: 4, ...options });
  const s = await t.stepUntil((s) => s.race.phase === 'done', { max: 60 * 240, chunk: 600, label: 'fixture completed race' });
  t.expect(s.race.karts[s.race.player].finished, 'fixture simulation actually finishes');
  return s;
}
async function gpPrefix(t) {
  // Existing hook arranges a cup prefix. Trophy route is intentionally invoked
  // after one completed one-player GP race, not claimed as a naturally won cup.
  await t.game('scene', 'title');
  await t.page.locator('[data-act="gp"]').click();
  await t.page.locator('[data-act="teamOk"]').click();
  await t.page.locator('[data-act="cls"][data-id="soak"]').click();
  await t.game('act', 'menu', 'cup', { id: 'bathhouse' });
  await t.waitIdle(15000);
  return finish(t, { mode: 'gp', classId: 'soak' });
}
const test = (name, run) => ({ name: 'save regression: ' + name, viewports: ['desktop'], initScript: installFixture, run });
export const tests = [
  test('stale settings and selections preserve fresh progress and adopt actual runtime preferences', async (t) => {
    await t.waitIdle(15000);
    const before = await runtime(t), fresh = await parsed(t);
    fresh.best[TRACK] = { race: 190.45, lap: 61.383, team: 'engine-six', cls: 'splash' };
    fresh.stats = { races: 8, wins: 3, gallonsSpilled: 17 }; fresh.cups['bathhouse:soak'] = 1;
    fresh.unlocked.teams.push('gator-gang'); fresh.lastClass = 'splash';
    Object.assign(fresh.settings, { sound: false, music: false, volume: .2, res: 'crisp', quality: 'low', autoPush: true, reducedMotion: true });
    await replace(t, fresh);
    await t.page.locator('[data-act="quick"]').click();
    await t.page.locator('[data-act="teamOk"]').click(); await t.waitFrames(3);
    let s = await parsed(t), rt = await runtime(t); t.log('actual runtime after selection', JSON.stringify(rt));
    for (const k of ['best','stats','cups','unlocked']) same(t, s[k], fresh[k], 'selection keeps current ' + k);
    t.equal(s.lastClass, 'splash', 'team confirmation does not replay stale lastClass');
    t.equal(rt.res, 'crisp', 'actual renderer adopts fresh resolution');
    t.expect(rt.input.autoPush && rt.reducedMotion, 'actual input and reduced-motion flags adopt fresh values');
    t.expect(!rt.audio.on && !rt.audio.music, 'actual audio flags adopt fresh values');
    t.equal(rt.audio.vol, .2, 'actual audio state adopts volume'); t.expect(rt.alias, 'Screens retains exact save alias');
    t.equal(rt.quality, 'low', 'quality preference adopted'); t.equal(rt.tier, before.tier, 'existing quality reload semantics retained');
    await t.page.locator('[data-act="cls"][data-id="splash"]').click();
    await settings(t);
    await t.page.locator('[data-act="set"][data-k="sound"][data-v="true"]').click();
    s = await parsed(t); rt = await runtime(t);
    t.expect(rt.audio.on && !rt.audio.music, 'changed sound applies without replaying cached music');
    for (const k of ['best','stats','cups','unlocked']) same(t, s[k], fresh[k], 'setting keeps current ' + k);
    await t.shot('save-fresh-preferences-runtime');
    await replace(t, null);
    await t.page.locator('[data-act="set"][data-k="sound"][data-v="false"]').click();
    s = await parsed(t); same(t, s.best, {}, 'ordinary stale write does not resurrect externally cleared best');
    t.equal(s.stats.races, 0, 'ordinary stale write does not resurrect cleared stats');
    same(t, s.unlocked.teams, [], 'ordinary stale write does not resurrect cleared unlocks');
  }),
  test('failed completed-race writes survive replacement and retry without duplicating stats or attaching a losing ghost', async (t) => {
    await t.waitIdle(15000); await faults(t, { writeFails: true });
    await finish(t); await finish(t, { seed: 5 });
    const current = await parsed(t); t.equal(current.stats.races, 0, 'failed fixture writes did not change storage');
    current.stats.races = 7; current.stats.wins = 2;
    current.best[TRACK] = { race: 1, lap: .3, team: 'remote', cls: 'splash' };
    current.ghosts[TRACK] = { v: 1, team: 'remote', total: 1, n: 0, t:'',x:'',z:'',y:'',yaw:'' };
    Object.assign(current.settings, { sound: false, music: false, volume: .3, res: 'crisp', autoPush: true, reducedMotion: true });
    await replace(t, current); await faults(t, { writeFails: false });
    await settings(t); await t.page.locator('[data-act="set"][data-k="quality"][data-v="low"]').click();
    let s = await parsed(t); t.equal(s.stats.races, 9, 'two new completed races added to fresh remote count');
    t.equal(s.stats.wins, 4, 'two one-player wins added once');
    same(t, s.best[TRACK], current.best[TRACK], 'slower pending records do not replace faster remote record');
    same(t, s.ghosts[TRACK], current.ghosts[TRACK], 'losing recordings do not attach to remote record');
    await t.page.locator('[data-act="set"][data-k="sound"][data-v="false"]').click();
    s = await parsed(t); t.equal(s.stats.races, 9, 'later ordinary write does not count retries again');
    const rt = await runtime(t); t.expect(rt.alias && rt.reducedMotion && rt.input.autoPush, 'actual preference state and alias updated on retry');
    t.log('actual runtime after race retry', JSON.stringify(rt)); await t.shot('save-race-retry');
    const next = await parsed(t);
    Object.assign(next.settings, { sound: true, music: true, volume: .4, res: 'authentic', autoPush: false, reducedMotion: false });
    await replace(t, next); await finish(t, { seed: 6 });
    const afterResult = await runtime(t);
    t.expect(!afterResult.input.autoPush && !afterResult.reducedMotion && afterResult.audio.on && afterResult.audio.music, 'ordinary successful result write adopts actual remote runtime flags');
    t.equal(afterResult.audio.vol, .4, 'ordinary result adopts actual audio volume');
    t.equal(afterResult.res, 'authentic', 'ordinary result adopts actual renderer resolution');
    t.equal((await parsed(t)).stats.races, 10, 'new replacement completion is counted once');
    t.log('actual runtime after successful result write', JSON.stringify(afterResult));

  }),
  test('blocked-read first-place cup and failed-write exact award survive a replacement GP', async (t) => {
    await t.waitIdle(15000); await gpPrefix(t);
    const before = await raw(t); await faults(t, { readFails: true });
    await t.game('act', 'menu', 'trophy'); await t.waitFrames(3);
    t.equal(await raw(t), before, 'blocked fresh read cannot publish cup save');
    t.expect(await t.page.locator('[data-save-status]').isVisible(), 'unsaved cup is visibly labelled');
    await t.shot('save-cup-unsaved');
    await t.game('act', 'menu', 'quit');
    await t.game('act', 'menu', 'gp');
    await t.game('act', 'menu', 'teamOk');
    await t.game('act', 'menu', 'cls', { id: 'soak' });
    await t.game('act', 'menu', 'cup', { id: 'bathhouse' }); await t.waitIdle(15000);
    await faults(t, { readFails: false, writeFails: true });
    await t.game('act', 'menu', 'set', { k: 'sound', v: 'false' });
    let rt = await runtime(t);
    same(t, rt.unlocked.teams, ['gator-gang'], 'old GP intent resolves exact first unlock after fresh read');
    t.expect(rt.unlocked.classes.includes('scald'), 'old GP Soak win resolves Scald');
    const fresh = await parsed(t);
    Object.assign(fresh.settings, { music: false, volume: .25, res: 'crisp', autoPush: true, reducedMotion: true });
    await replace(t, fresh); await faults(t, { writeFails: false });
    await t.game('act', 'menu', 'set', { k: 'sound', v: 'false' }); await t.waitFrames(3);
    const saved = await parsed(t); rt = await runtime(t);
    t.equal(saved.cups['bathhouse:soak'], 1, 'completed old cup retained after GP replacement');
    same(t, saved.unlocked.teams, ['gator-gang'], 'retry grants the same award once, not next team');
    t.expect(rt.reducedMotion && rt.input.autoPush && !rt.audio.music, 'actual adopted preference flags after award retry');
    t.equal(rt.audio.vol, .25, 'actual adopted volume after award retry');
    t.equal(rt.res, 'crisp', 'actual renderer adopts resolution after award retry');
    t.expect(!rt.saveError, 'successful durable retry clears unsaved warning');
    t.expect((await t.page.locator('.hud-call').innerText()) !== 'Changes not saved · kept in this tab', 'successful durable retry retires the stale save-warning HUD message');
    await t.shot('save-cup-retried');
    await finish(t, { mode: 'gp', classId: 'soak', seed: 6 });
    const next = await parsed(t);
    Object.assign(next.settings, { sound: true, music: true, volume: .35, res: 'authentic', autoPush: false, reducedMotion: false });
    await replace(t, next); await t.game('act', 'menu', 'trophy'); await t.waitFrames(3);
    const afterAward = await runtime(t);
    same(t, (await parsed(t)).unlocked.teams, ['gator-gang', 'silks-stirrups'], 'a distinct new cup grants exactly its own next team');
    t.expect(!afterAward.input.autoPush && !afterAward.reducedMotion && afterAward.audio.on && afterAward.audio.music, 'ordinary successful cup write adopts actual remote runtime flags');
    t.equal(afterAward.audio.vol, .35, 'ordinary cup adopts actual audio volume');
    t.equal(afterAward.res, 'authentic', 'ordinary cup adopts actual renderer resolution');
    t.log('actual runtime after successful cup write', JSON.stringify(afterAward));

  }),
  test('malformed latest storage remains untouched and recovered read flushes only explicit changes', async (t) => {
    await t.waitIdle(15000); await settings(t);
    await replace(t, '{preserve-this-invalid-save');
    await t.page.locator('[data-act="set"][data-k="sound"][data-v="false"]').click(); await t.waitFrames(3);
    t.equal(await raw(t), '{preserve-this-invalid-save', 'malformed bytes preserved');
    t.expect(await t.page.locator('[data-save-status]').isVisible(), 'actual unreadable save warning visible');
    const fresh = { v:1,settings:{sound:true,music:false,brick:true},best:{[TRACK]:{race:100,lap:30,team:'engine-six',cls:'splash'}},stats:{races:4,wins:1,gallonsSpilled:0} };
    await replace(t, fresh);
    await t.page.locator('[data-act="set"][data-k="autoPush"][data-v="true"]').click();
    const s = await parsed(t); t.equal(s.stats.races, 4, 'recovered current progress retained');
    same(t, s.best, fresh.best, 'recovered current record retained');
    t.expect(!s.settings.sound && !s.settings.music && s.settings.autoPush, 'only explicit pending/current preference changes merged');
    const rt = await runtime(t); t.expect(rt.input.autoPush && !rt.audio.on && !rt.audio.music, 'stored preference merge reaches runtime');
    t.expect(!await t.page.locator('[data-save-status]').count(), 'successful retry removes failure status');
  }),
  test('legacy migration happens before an explicit resolution and stays loadable on reload', async (t) => {
    await t.waitIdle(15000); await settings(t);
    await replace(t, {v:1,settings:{res:'authentic',sound:true},best:{},stats:{races:2,wins:0,gallonsSpilled:0}});
    await t.page.locator('[data-act="set"][data-k="res"][data-v="authentic"]').click();
    let s = await parsed(t); t.equal(s.settings.res, 'authentic', 'explicit choice wins over conditional old-save migration');
    t.equal(s.settings.brick, true, 'existing one-time migration marker retained');
    t.equal(s.stats.races, 2, 'migration does not replay old cached stats');
    // The fixture is installed once per fresh context; this reload uses the actual written bytes.
    await t.reload(); await t.waitIdle(15000); s = await parsed(t);
    t.equal(s.settings.res, 'authentic', 'written v1 preference reloads as selected');
    t.equal(s.stats.races, 2, 'written v1 progress reloads intact');
    t.equal((await runtime(t)).res, 'authentic', 'actual reloaded renderer uses selected mode');
  }),
];
