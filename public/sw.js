/* ExamOS 1.4 PWA — offline shell with safe resource fallbacks. */
const CACHE='examos-shell-v1.4.0';
const SHELL=['/','/index.html','/src/app.js','/src/db.js','/src/vault.js','/src/style.css','/src/logic.js','/manifest.webmanifest','/icon.svg','/icon-192.png','/icon-512.png','/vendor/jszip.min.js','/vendor/pdfjs/pdf.mjs','/vendor/pdfjs/pdf.worker.mjs','/zip-worker.js','/vendor/MathJax/MathJax.js','/vendor/MathJax/config/TeX-AMS-MML_HTMLorMML-full.js'];
self.addEventListener('install',e=>{
 e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
 e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('examos-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const url=new URL(e.request.url);
 if(url.origin!==self.location.origin)return;
 if(e.request.mode==='navigate'){
  e.respondWith(fetch(e.request).then(response=>{
   if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put('/index.html',copy)).catch(()=>{});}
   return response;
  }).catch(async()=>await caches.match('/index.html')||Response.error()));
  return;
 }
 e.respondWith(caches.match(e.request).then(async hit=>{
  if(hit)return hit;
  try{
   const response=await fetch(e.request);
   if(response.ok&&url.pathname.startsWith('/vendor/')){
    const cache=await caches.open(CACHE);cache.put(e.request,response.clone()).catch(()=>{});
   }
   return response;
  }catch{return Response.error()}
 }));
});