const CACHE_NAME = '16a-v2';
const FILES = ['/16a/','/16a/index.html','/16a/manifest.json','/16a/icon-192x192.png','/16a/icon-512x512.png'];

self.addEventListener('install', (evt) => {
  evt.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(clients.claim());
});

self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches.match(evt.request).then(res => res || fetch(evt.request))
  );
});
