const CACHE_NAME = 'sanjeevini-v1';

// We must at least have a fetch listener for Chrome to allow installation
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  self.skipWaiting();
});