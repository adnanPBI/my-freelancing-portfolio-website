import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const load=(p)=>fs.readFileSync(path.join(root,p),'utf8');

test('both registered themes use one content dataset and real switcher',()=>{
  const manifest=JSON.parse(load('themes/manifest.json'));
  assert.equal(manifest.default,'industrial');
  assert.deepEqual(manifest.themes.map(t=>t.id),['industrial','studio']);
  assert.deepEqual(manifest.themes.map(t=>t.url),['/','/themes/studio/index.html']);
  for(const theme of manifest.themes){
    const page=theme.id==='industrial'?'index.html':theme.url.slice(1);
    const html=load(page);
    assert.match(html,new RegExp('data-portfolio-theme="'+theme.id+'"'));
    assert.match(html,/\/themes\/switcher\.js/);
    assert.match(html,/\/themes\/switcher\.css/);
  }
  assert.match(load('app.js'),/\/projects\.json/);
  assert.match(load('themes/studio/app.js'),/\/projects\.json/);
  assert.match(load('themes/switcher.js'),/\/themes\/manifest\.json/);
  assert.match(load('themes/switcher.js'),/localStorage\.setItem/);
});

test('no personal name or visual-reference marketing remains in tracked source',()=>{
  const ignored=new Set(['LICENSE']);
  function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(it=>{
    const abs=path.join(dir,it.name);
    if(it.isDirectory())return it.name==='data'||it.name==='node_modules'||it.name==='.git'?[]:walk(abs);
    return [abs];
  })}
  for(const file of walk(root)){
    if(ignored.has(path.basename(file)))continue;
    const rel=path.relative(root,file);
    assert.doesNotMatch(rel,new RegExp(['ad','nan'].join(''),'i'));
    if(!/\.(html|js|json|md|svg|css|txt|example|yml)$/.test(file))continue;
    const text=fs.readFileSync(file,'utf8');
    assert.doesNotMatch(text,new RegExp(['ad','nan'].join(''),'i'), rel);
    assert.doesNotMatch(text,/reservechain[-\s]*(?:inspired|style|themed)|inspired\s+by\s+reservechain/i,rel);
  }
});
