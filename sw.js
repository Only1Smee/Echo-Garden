const CACHE='echo-garden-56890476';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable.png'];
// install: cache the new version and take over at once (the page then offers a restart)
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting())); });
self.addEventListener('message',e=>{ if(e.data==='skipWaiting') self.skipWaiting(); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{ const q=e.request; if(q.method!=='GET') return;
  const page=q.mode==='navigate'||/\/(index\.html)?$/.test(new URL(q.url).pathname);
  if(page){ // network first: a fresh upload shows up straight away, the cached copy keeps it working offline
    e.respondWith(fetch(q,{cache:'no-store'}).then(res=>{ if(res&&res.ok){ const copy=res.clone(); caches.open(CACHE).then(c=>c.put('./index.html',copy)).catch(()=>{}); } return res; }).catch(()=>caches.match('./index.html',{ignoreSearch:true}).then(r=>r||caches.match('./'))));
    return; }
  e.respondWith(caches.match(q,{ignoreSearch:true}).then(r=>r||fetch(q).then(res=>{ const copy=res.clone(); caches.open(CACHE).then(c=>c.put(q,copy)).catch(()=>{}); return res; }).catch(()=>caches.match('./index.html')))); });
