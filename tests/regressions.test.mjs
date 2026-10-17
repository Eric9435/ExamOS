import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {STORES,SEED_SUBJECTS} from '../src/db.js';
import {localDate,percent,grade,nextCard,chapterPercent,humanSec,clean,mistakeTypes} from '../src/logic.js';

const file=p=>readFileSync(new URL(p,import.meta.url),'utf8');
test('backup schema v4 preserves draft store and supports prior backups',()=>{
 const src=file('../src/db.js');
 assert.ok(STORES.includes('drafts'));
 assert.match(src,/indexedDB\.open\(dbName,4\)/);
 assert.match(src,/version:4/);
 assert.match(src,/\[3,4\]\.includes\(json.version\)/);
});
test('instructor records are not marked current exam rules',()=>{
 assert.equal(SEED_SUBJECTS.length,5);
 assert.ok(SEED_SUBJECTS.every(s=>s.verified===false));
 assert.equal(SEED_SUBJECTS.find(s=>s.id==='micro').examMin,0);
});
test('grader rejects empty, nonnumeric and off-tolerance answers',()=>{
 const q={type:'numeric',answer:'-12.5',tolerance:.02};
 assert.equal(grade(q,'-12.51'),true);
 assert.equal(grade(q,'-12.49'),true);
 assert.equal(grade(q,'-12.47'),false);
 assert.equal(grade(q,''),false);
 assert.equal(grade(q,'not a number'),false);
 assert.equal(grade({type:'tf',answer:'True'},' true '),true);
 assert.equal(grade({type:'multiselect',answer:'A|C'},'A|B'),false);
 assert.equal(grade({type:'long',answer:'anything'},'anything'),null);
});
test('progress never fabricates achievement without checklist items',()=>{
 assert.equal(percent(0,0),0);
 assert.equal(chapterPercent({subtopics:[],completed:[]}),0);
 assert.equal(chapterPercent({subtopics:['a','b','c'],completed:['a']}),33);
});
test('escaped user text does not become HTML',()=>{
 assert.equal(clean('<img src=x onerror="alert(1)">'),'&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
});
test('spaced review is deterministic for all four buttons',()=>{
 for(const rating of ['Again','Hard','Good','Easy']){
  const d=new Date('2026-10-17T10:00:00Z');
  const card=nextCard({interval:3,ease:2.4,reps:2},rating,d);
  assert.ok(card.interval>=1&&card.interval<=20);
  assert.ok(card.ease>=1.3);
  assert.equal(card.lastRating,rating);
  assert.ok(card.due>'2026-10-17');
 }
});
test('dates/times are locally formatted',()=>{
 assert.equal(localDate(new Date('2026-10-17T12:00:00Z')),'2026-10-17');
 assert.equal(humanSec(125),'02:05');
});
test('mistake taxonomy contains all requested categories',()=>{
 assert.equal(mistakeTypes.length,7);
 for(const name of ['Formula error','Unit conversion error','Incomplete explanation','Time management'])assert.ok(mistakeTypes.includes(name));
});
test('all navigation actions have handlers',()=>{
 const src=file('../src/app.js');
 const actions=[...src.matchAll(/btn\('([a-z-]+)'/g),...src.matchAll(/data-action="([a-z-]+)"/g)].map(m=>m[1]);
 const handled=new Set([...src.matchAll(/case '([a-z-]+)'/g)].map(m=>m[1]));
 for(const action of actions)assert.ok(handled.has(action),`${action} missing click handler`);
});
test('no AI APIs or providers are used',()=>{
 const src=file('../src/app.js')+file('../src/db.js')+file('../public/sw.js');
 assert.doesNotMatch(src,/(openai\.com|generativelanguage\.googleapis|openrouter\.ai|api\.anthropic\.com|chat-completions)/i);
});
test('PWA files are present and cache is revisioned',()=>{
 const root=new URL('../',import.meta.url);
 for(const name of ['index.html','public/sw.js','public/manifest.webmanifest','public/icon.svg','public/zip-worker.js','render.yaml'])assert.ok(existsSync(new URL(name,root)));
 const sw=file('../public/sw.js');assert.match(sw,/examos-shell-v1\.5\.0/);
});

test('private PDF import is always encrypted before IndexedDB storage and decrypted for reading',()=>{
 const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
 assert.match(app,/sealPDF\(blob,vaultKey,id\)/);
 assert.match(app,/unsealPDF\(doc,vaultKey\)/);
 assert.match(app,/root\.addEventListener\('submit'/);
 assert.match(app,/vault-unlock/);
 assert.match(app,/vault-setup/);
 assert.match(app,/lock-vault/);
 const sw=readFileSync(new URL('../public/sw.js',import.meta.url),'utf8');
 assert.ok(sw.includes("'/src/vault.js'"));
});