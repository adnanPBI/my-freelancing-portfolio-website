import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const load=(p)=>fs.readFileSync(path.join(root,p),'utf8');

test('entire categorized portfolio and artwork are present',()=>{
  const projects=JSON.parse(load('projects.json'));
  assert.equal(projects.length,59);
  assert.equal(new Set(projects.map(p=>p.id)).size,59);
  assert.equal(new Set(projects.map(p=>p.category)).size,8);
  for(const p of projects){
    assert.ok(p.title && p.summary && p.approach && p.challenge && p.stage, p.id);
    const cover=path.join(root,'assets',`cover-${p.id}.svg`);
    assert.ok(fs.existsSync(cover),`Missing project artwork for ${p.id}`);
    assert.match(fs.readFileSync(cover,'utf8'),/<svg\b/);
  }
});

test('the industrial hero, OG artwork, public application and admin UI exist',()=>{
  const homepage=load('index.html');
  assert.match(homepage,/ENGINEERED/);
  assert.match(homepage,/\/assets\/hero-forge\.svg/);
  assert.match(homepage,/id="project-grid"/);
  assert.match(homepage,/id="category-controls"/);
  assert.match(homepage,/id="search-input"/);
  assert.ok(fs.existsSync(path.join(root,'assets','og-card.jpg')));
  assert.ok(fs.existsSync(path.join(root,'admin.html')));
  assert.ok(fs.existsSync(path.join(root,'admin.js')));
  assert.ok(fs.existsSync(path.join(root,'server.js')));
});

test('local secrets and persistent inquiry databases are excluded from Git',()=>{
  const ignore=load('.gitignore');
  assert.match(ignore,/^\.env$/m);
  assert.match(ignore,/^data\/$/m);
  assert.match(ignore,/\*\.sqlite/m);
  assert.ok(!fs.existsSync(path.join(root,'.env')));
});

test('GazeSpace Studio has a unique, evidence-backed case file in both themes',()=>{
  const catalog=JSON.parse(load('projects.json'));
  const matches=catalog.filter(p=>p.id==='eye-gaze-calibration-system');
  assert.equal(matches.length,1,'Keep existing case bookmarks; do not duplicate');
  const p=matches[0];
  assert.match(p.title,/GazeSpace Studio/);
  assert.equal(p.category,'AI & Computer Vision');
  assert.equal(p.featured,true);
  assert.equal(p.stage,'In progress');
  assert.equal(p.repositoryAccess,'private');
  assert.equal(p.link,'https://github.com/'+['ad','nanPBI'].join('')+'/gazespace-studio');
  assert.ok(p.caseStudy.deliverables.length>=7);
  assert.ok(p.caseStudy.evidence.length>=6);
  assert.ok(p.caseStudy.pending.length>=3);
  assert.equal(p.caseStudy.facts[0].value,'225 / 225');
  assert.match(p.caseStudy.status,/physical camera/i);
  assert.match(p.caseStudy.pending.join(' '),/human.*accuracy/i);
  assert.match(load('assets/cover-eye-gaze-calibration-system.svg'),/GAZESPACE/);
  assert.match(load('app.js'),/renderCaseStudy\(p,sanitize\)/);
  assert.match(load('themes/studio/app.js'),/renderCaseStudy\(p,escapeHTML\)/);
  for(const style of ['styles.css','themes/studio/styles.css'])assert.match(load(style),/\.case-expanded/);
});
