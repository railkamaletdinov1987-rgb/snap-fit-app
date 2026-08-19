// Cache version: v2.0
const CACHE_NAME = 'snap-fit-cache-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Не кэшируем запросы к нашему ИИ-серверу
  if (event.request.url.includes('/api/analyze')) {
    return;
  }
  
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
