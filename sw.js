const CACHE='dos-v1';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET') return;                 // API-POSTs nie anfassen
  if(u.origin!==location.origin && !u.host.includes('fonts.')) return;
  // Netzwerk zuerst (Updates landen sofort), Cache als Offline-Fallback
  e.respondWith(
    fetch(e.request).then(r=>{ const cp=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,cp)); return r; })
    .catch(()=>caches.match(e.request))
  );
});
