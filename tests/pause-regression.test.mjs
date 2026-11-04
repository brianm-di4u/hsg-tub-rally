// Regression for TUB-BASE-ESC-PAUSE-20261104. Real keyboard/menu input only;
// getState observes the app. No newGame/setState/step/act setup or mutation.
async function samples(page,n=30){return page.evaluate(async n=>{const rows=[];for(let i=0;i<n;i++){await new Promise(requestAnimationFrame);const s=window.__game.getState();rows.push({paused:s.paused,steps:s.steps,screen:s.screen,phase:s.race?.phase});}return rows;},n);}
const frozen=rows=>rows.length===30&&rows.every(s=>s.paused&&s.screen==='pause')&&rows.every(s=>s.steps===rows[0].steps);
export const tests=[{name:'pause keys remain latched across real animation frames',viewports:['desktop'],async run(t){
 await t.waitIdle(8000);const page=t.page,kb=page.keyboard;
 await page.locator('[data-act="gp"]').click();await t.waitFrames(3);await kb.press('Escape');await t.waitFrames(3);t.equal((await t.state()).screen,'title','Escape still backs out of title menus');
 await page.locator('[data-act="gp"]').click();await page.locator('.tcard:nth-child(2)').click();await page.locator('[data-act="teamOk"]').click();await page.locator('[data-act="cls"][data-id="soak"]').click();await page.locator('[data-act="cup"][data-id="bathhouse"]').click();
 await page.waitForFunction(()=>window.__game?.getState()?.race?.phase==='race',null,{timeout:15000});await kb.down('ArrowUp');await page.waitForTimeout(700);await kb.up('ArrowUp');
 await kb.press('Escape');const escape=await samples(page);t.log('Escape frame samples',JSON.stringify(escape));t.expect(frozen(escape),'Escape must keep pause visible and simulation frozen for30realframes');await t.shot('escape-pause-frames');
 // If the red baseline failed, P establishes pause through real input solely
 // to collect the independent resume comparator; the failed assertion remains.
 if(!(await t.state()).paused)await kb.press('KeyP');await t.waitFrames(3);await kb.press('Escape');const resumed=await samples(page);t.expect(resumed.every(s=>!s.paused)&&resumed.at(-1).steps>resumed[0].steps,'Escape resumes and real simulation advances');
 await kb.down('Escape');await t.waitFrames(2);await kb.down('Escape');const held=await samples(page);t.log('held/repeated Escape frame samples',JSON.stringify(held));t.expect(frozen(held),'Held/repeated Escape must not leak a cancel that resumes pause');await kb.up('Escape');const released=await samples(page);t.expect(frozen(released),'Releasing held Escape must preserve pause');await t.shot('held-escape-pause-frames');if(!(await t.state()).paused)await kb.press('KeyP');await t.waitFrames(3);await kb.press('Escape');const heldResume=await samples(page);t.expect(heldResume.every(s=>!s.paused)&&heldResume.at(-1).steps>heldResume[0].steps,'Fresh Escape resumes after held-key release');
 await kb.press('KeyP');const p=await samples(page);t.log('P frame samples',JSON.stringify(p));t.expect(frozen(p),'P must still pause across30realframes');await t.shot('p-pause-frames');await kb.press('KeyP');const pResume=await samples(page);t.expect(pResume.every(s=>!s.paused)&&pResume.at(-1).steps>pResume[0].steps,'P still resumes');
}}];
