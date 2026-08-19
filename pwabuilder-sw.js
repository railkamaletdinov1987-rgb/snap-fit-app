// Cache version: v8.0 - Force Reset
const CACHE_NAME = 'snap-fit-cache-v8';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          return caches.delete(cache); // Удаляем абсолютно все прошлые кэши
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/analyze')) {
    return;
  }
  // Заставляем браузер брать только свежую версию с сервера
  event.respondWith(
    fetch(event.request, { cache: 'no-store' }).catch(() => caches.match(event.request))
  );
});
