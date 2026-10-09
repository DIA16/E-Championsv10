const C='ec-v18';
self.addEventListener('install',e=>{self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(r.method!=='GET')return;
const same=u.origin===location.origin,lib=/gstatic\.com|cdnjs\.cloudflare\.com/.test(u.host);if(!same&&!lib)return;
const put=res=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp)).catch(()=>{});return res;};
if(lib)e.respondWith(caches.match(r).then(h=>h||fetch(r).then(put)));
else e.respondWith(fetch(r).then(put).catch(()=>caches.match(r)));});
