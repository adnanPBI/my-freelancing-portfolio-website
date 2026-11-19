import test,{after,before} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const site=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const data=mkdtempSync(path.join(tmpdir(),'engineering-portfolio-'));
const token='a-long-testing-token-strong-enough';
let server,base;
before(async()=>{server=spawn(process.execPath,['server.js'],{cwd:site,env:{...process.env,HOST:'127.0.0.1',PORT:'0',DATA_DIR:data,ADMIN_TOKEN:token},stdio:['ignore','pipe','pipe']});base=await new Promise((resolve,reject)=>{let stdout='';const t=setTimeout(()=>reject(new Error('Server timeout '+stdout)),10000);server.on('exit',code=>reject(new Error('Server quit '+code)));server.stdout.on('data',c=>{stdout+=String(c);const m=stdout.match(/http:\/\/127\.0\.0\.1:(\d+)/);if(m){clearTimeout(t);resolve('http://127.0.0.1:'+m[1])}})})});
after(()=>{server?.kill('SIGTERM');rmSync(data,{recursive:true,force:true})});
const inquiry={name:'Portfolio Test',email:'qa@example.org',category:'AI & Computer Vision',message:'I am testing a real portfolio inquiry submission.',consent:true};
test('serves rendered site and project library',async()=>{const r=await fetch(base);assert.equal(r.status,200);assert.match(await r.text(),/ENGINEERED/);const p=await(await fetch(base+'/projects.json')).json();assert.equal(p.length,59);assert.equal(new Set(p.map(x=>x.category)).size,9);assert.equal(new Set(p.map(x=>x.id)).size,59);for(const item of p){const img=await fetch(base+'/assets/cover-'+item.id+'.svg',{method:'HEAD'});assert.equal(img.status,200,item.id)}});
test('blocks path traversal and private files',async()=>{for(const url of ['/data/inquiries.sqlite','/.env.example','/server.js','/tests/server.test.js']){const r=await fetch(base+url);assert.equal(r.status,404,url)}});
test('validates consent and records authorized submissions',async()=>{let r=await fetch(base+'/api/inquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...inquiry,consent:false})});assert.equal(r.status,422);r=await fetch(base+'/api/inquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(inquiry)});assert.equal(r.status,201);const noAuth=await fetch(base+'/api/admin/inquiries');assert.equal(noAuth.status,401);const auth=await fetch(base+'/api/admin/inquiries',{headers:{Authorization:'Bearer '+token}});const list=(await auth.json()).inquiries;assert.equal(list.length,1);assert.equal(list[0].name,'Portfolio Test');const csv=await fetch(base+'/api/admin/inquiries.csv',{headers:{Authorization:'Bearer '+token}});assert.equal(csv.status,200);assert.match(await csv.text(),/Portfolio Test/);const deleted=await fetch(base+'/api/admin/inquiries/'+list[0].id,{method:'DELETE',headers:{Authorization:'Bearer '+token}});assert.equal(deleted.status,200);const afterDel=await(await fetch(base+'/api/admin/inquiries',{headers:{Authorization:'Bearer '+token}})).json();assert.equal(afterDel.inquiries.length,0)});
test('honeypot ignored and unknown routes rejected',async()=>{const bot=await fetch(base+'/api/inquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...inquiry,website:'test-spam'})});assert.equal(bot.status,200);const r=await fetch(base+'/api/not-a-route');assert.equal(r.status,404)});

test('both presentations and theme registry are served from the same application',async()=>{
 for(const url of ['/themes/studio/','/themes/studio/index.html','/themes/studio/styles.css','/themes/studio/app.js','/themes/switcher.css','/themes/switcher.js','/themes/preference.js','/themes/manifest.json']){
   const response=await fetch(base+url);assert.equal(response.status,200,url);
 }
 const a=await(await fetch(base+'/themes/manifest.json')).json();assert.equal(a.themes.length,2);
 const studio=await(await fetch(base+'/themes/studio/index.html')).text();assert.match(studio,/data-portfolio-theme="studio"/);
 const industrial=await(await fetch(base)).text();assert.match(industrial,/data-portfolio-theme="industrial"/);
 const jpg=await fetch(base+'/assets/og-card.jpg');assert.equal(jpg.status,200);assert.match(jpg.headers.get('content-type'),/image\/jpeg/);
});
