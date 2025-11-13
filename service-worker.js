// Nom du cache (change automatiquement si tu veux forcer une mise à jour globale)
const CACHE_NAME = '16a-cache-v3';

// Liste des fichiers à mettre en cache
const FILES = [
  '/16a/',
  '/16a/index.html',
  '/16a/manifest.json',
  '/16a/icon-192x192.png',
  '/16a/icon-512x512.png'
];

// Installation du service worker
self.addEventListener('install', event => {
  console.log('[Service Worker] Installation...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[Service Worker] Mise en cache initiale');
      return cache.addAll(FILES);
    })
  );
  self.skipWaiting(); // ⚡ Active immédiatement le nouveau SW
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activation...');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Suppression de l’ancien cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim(); // ⚡ Applique le nouveau SW immédiatement
});

// Interception des requêtes
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Vérifie en parallèle s’il existe une version plus récente sur le réseau
      const fetchPromise = fetch(event.request)
        .then(networkResponse => {
          // Si on reçoit une réponse valide, on met le cache à jour
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse); // Si hors ligne, on garde la version en cache

      // Retourne immédiatement la version en cache (rapide), ou celle du réseau si absente
      return cachedResponse || fetchPromise;
    })
  );
});
