const C='work-trips-v5';
self.addEventListener('install',e=>{self.skipWaiting(); e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'])))});
self.addEventListener('activate',e=>{e.waitUntil(clients.claim(), caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))))});
self.addEventListener('fetch',e=>{
  const isPage = e.request.mode==='navigate' || e.request.url.includes('index.html') || e.request.url.endsWith('/');
  if(isPage){
    // Network first so updates arrive, cache fallback so it works offline
    e.respondWith(fetch(e.request).then(res=>{let copy=res.clone(); caches.open(C).then(c=>c.put('./index.html',copy)); return res;}).catch(()=>caches.match('./index.html')));
  } else {
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
  }
});
