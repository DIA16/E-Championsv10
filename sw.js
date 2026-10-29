const C='ec-v33';
self.addEventListener('install',e=>{self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(r.method!=='GET')return;
const same=u.origin===location.origin,lib=/gstatic\.com|cdnjs\.cloudflare\.com/.test(u.host);if(!same&&!lib)return;
e.respondWith(caches.open(C).then(c=>c.match(r).then(hit=>{
const net=fetch(r).then(res=>{if(res&&res.ok){c.put(r,res.clone());
if(hit&&same&&/(\/|index\.html)$/.test(u.pathname)&&res.headers.get('etag')!==hit.headers.get('etag'))self.clients.matchAll().then(l=>l.forEach(x=>x.postMessage('updated')));}
return res;}).catch(()=>hit);
return hit||net;})));});
