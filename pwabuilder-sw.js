// Cache version: v8.0 - Force Reset
const CACHE_NAME = 'snap-fit-cache-v9'; // Измените с v8 на v9

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => caches.delete(cache)) // Удаляем все старые кэши
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
  // Игнорируем API-запросы и не-GET методы, отдавая их стандартному сетевому стеку браузера
  if (event.request.url.includes('/api/') || event.request.method !== 'GET') {
    return; // Не вызываем event.respondWith — браузер сам выполнит сетевой запрос
  }

  // Для остальных статических ресурсов запрашиваем свежую версию с сервера
  event.respondWith(
    fetch(event.request, { cache: 'no-store' }).catch(() => {
      return caches.match(event.request);
    })
  );
});
