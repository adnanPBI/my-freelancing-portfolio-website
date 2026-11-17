import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { timingSafeEqual } from 'node:crypto';

const root=path.dirname(fileURLToPath(import.meta.url));
const host=process.env.HOST||'127.0.0.1';
const port=Number(process.env.PORT??3000);
const dataDir=path.resolve(process.env.DATA_DIR||path.join(root,'data'));
const adminToken=process.env.ADMIN_TOKEN||'';
fs.mkdirSync(dataDir,{recursive:true,mode:0o700});
const db=new DatabaseSync(path.join(dataDir,'inquiries.sqlite'));
db.exec(`PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS inquiries (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL, category TEXT NOT NULL, message TEXT NOT NULL, consent INTEGER NOT NULL);`);
const add=db.prepare('INSERT INTO inquiries(created_at,name,email,category,message,consent) VALUES(?,?,?,?,?,1)');
const select=db.prepare('SELECT id,created_at,name,email,category,message,consent FROM inquiries ORDER BY id DESC LIMIT 1000');
const del=db.prepare('DELETE FROM inquiries WHERE id=?');
const recent=new Map();
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.ico':'image/x-icon','.txt':'text/plain; charset=utf-8'};
const security={
 'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','X-Frame-Options':'DENY',
 'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; form-action 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
 'Permissions-Policy':'camera=(), microphone=(), geolocation=()',
};
function json(res,code,obj){res.writeHead(code,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...security});res.end(JSON.stringify(obj));}
function readJSON(req){return new Promise((resolve,reject)=>{let buf='';let size=0;req.on('data',c=>{size+=c.length;if(size>16000){reject(Object.assign(new Error('Request is too large.'),{status:413}));req.destroy();return}buf+=c});req.on('end',()=>{try{resolve(JSON.parse(buf))}catch{reject(Object.assign(new Error('Invalid JSON.'),{status:400}))}});req.on('error',reject)})}
function validEmail(email){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
function clean(value,max){return typeof value==='string'?value.trim().slice(0,max+1):''}
function authorized(req){if(!adminToken||adminToken.length<16)return false;const got=req.headers.authorization?.replace(/^Bearer\s+/i,'')||'';const a=Buffer.from(got),b=Buffer.from(adminToken);return a.length===b.length&&timingSafeEqual(a,b)}
function csvEscape(value){const str=String(value??'');return /[",\r\n]/.test(str)?'"'+str.replaceAll('"','""')+'"':str}
async function handler(req,res){
 try{
  const url=new URL(req.url,'http://localhost');const pathname=url.pathname;
  if(pathname.startsWith('/api/admin/')){
   if(!authorized(req)){json(res,401,{error:'Admin authorization required or not configured.'});return}
   if(pathname==='/api/admin/inquiries'&&req.method==='GET'){json(res,200,{inquiries:select.all()});return}
   if(pathname==='/api/admin/inquiries.csv'&&req.method==='GET'){
    const rows=select.all();const headers=['id','created_at','name','email','category','message','consent'];const csv=[headers.join(','),...rows.map(r=>headers.map(h=>csvEscape(r[h])).join(','))].join('\r\n');res.writeHead(200,{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="portfolio-inquiries.csv"','Cache-Control':'no-store',...security});res.end('\ufeff'+csv);return}
   const match=pathname.match(/^\/api\/admin\/inquiries\/(\d+)$/);if(match&&req.method==='DELETE'){const result=del.run(Number(match[1]));json(res,result.changes?200:404,{deleted:!!result.changes});return}
   json(res,404,{error:'Unknown admin route'});return
  }
  if(pathname==='/api/inquiries'&&req.method==='POST'){
   const contentType=req.headers['content-type']||'';if(!contentType.startsWith('application/json')){json(res,415,{error:'Use application/json.'});return}
   let payload;try{payload=await readJSON(req)}catch(e){if(!res.writableEnded)json(res,e.status||400,{error:e.message});return}
   if(!payload||typeof payload!=='object'||Array.isArray(payload)){json(res,400,{error:'Invalid form submission.'});return}
   const name=clean(payload.name,100),email=clean(payload.email,200),category=clean(payload.category,100),message=clean(payload.message,3000);
   if(payload.website){json(res,200,{ok:true});return} // honeypot: silently ignore bots
   if(name.length<2||name.length>100||!validEmail(email)||email.length>200||!category||category.length>100||message.length<20||message.length>3000||payload.consent!==true){json(res,422,{error:'Please enter a valid name, email, project area, message (20–3000 characters) and consent.'});return}
   const ip=String(req.socket.remoteAddress||'unknown');const now=Date.now();const seen=(recent.get(ip)||[]).filter(t=>now-t<600000);if(seen.length>=5){json(res,429,{error:'Too many requests. Please try again later.'});return}seen.push(now);recent.set(ip,seen);
   add.run(new Date().toISOString(),name,email,category,message);
   json(res,201,{ok:true});return
  }
  if(pathname.startsWith('/api/')){json(res,404,{error:'Unknown API route.'});return}
  if(req.method!=='GET'&&req.method!=='HEAD'){json(res,405,{error:'Method not allowed.'});return}
  let file=pathname==='/'?'/index.html':pathname; if(file.endsWith('/')) file+='index.html';const abs=path.resolve(root,'.'+decodeURIComponent(file));const rel=path.relative(root,abs);
  if(rel.startsWith('..')||path.isAbsolute(rel)||rel.split(path.sep).some(t=>t.startsWith('.')||t==='data')||['server.js','package.json','package-lock.json','README.md','DEPLOYMENT.md'].includes(path.basename(abs))||abs.includes(`${path.sep}tests${path.sep}`)){json(res,404,{error:'Not found.'});return}
  let stats;try{stats=fs.statSync(abs)}catch{json(res,404,{error:'Not found.'});return}if(!stats.isFile()){json(res,404,{error:'Not found.'});return}
  const ext=path.extname(abs),type=types[ext];if(!type){json(res,404,{error:'Not found.'});return}
  res.writeHead(200,{'Content-Type':type,'Cache-Control':ext==='.svg'?'public,max-age=86400':'no-cache',...security});if(req.method==='HEAD'){res.end();return}fs.createReadStream(abs).pipe(res)
 }catch(err){console.error('request error',err.message);if(!res.headersSent)json(res,500,{error:'Internal server error.'});else res.destroy()}
}
const server=http.createServer(handler);
server.listen(port,host,()=>console.log(`Portfolio listening at http://${host}:${server.address().port}`));
process.on('SIGTERM',()=>server.close(()=>{db.close();process.exit(0)}));
process.on('SIGINT',()=>server.close(()=>{db.close();process.exit(0)}));
export {server};
