const CACHE_NAME='16a-cache-v1';
const FILES=['/16a/','/16a/index.html','/16a/manifest.json','/16a/icon-192x192.png','/16a/icon-512x512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(FILES)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(clients.claim());});
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));});
