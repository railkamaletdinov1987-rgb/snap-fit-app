// Cache version: v4.0
const CACHE_NAME = 'snap-fit-cache-v4';

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

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  // 1. Игнорируем запрос к ИИ-серверу
  if (event.request.url.includes('/api/analyze')) {
    return;
  }

  // 2. Для HTML и скриптов отключаем дисковый HTTP-кэш браузера (cache: 'reload')
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request, { cache: 'reload' }).catch(() => caches.match(event.request))
    );
    return;
  }

  // 3. Для остальных ресурсов
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
