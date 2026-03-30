// ── Almanach Pána Starožitníka – Service Worker ──────────
const CACHE_NAME = 'almanach-v1';
const CACHE_FILES = [
  './artfinder.html',
  './manifest.json',
];

// Inštalácia – uložíme súbory do cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CACHE_FILES);
    })
  );
  self.skipWaiting();
});

// Aktivácia – vymažeme staré cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch – sieť preferujeme, cache ako záloha
self.addEventListener('fetch', event => {
  // Externé požiadavky (soga, cloudflare...) idú vždy cez sieť
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Uložíme čerstvú odpoveď do cache
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => {
        // Offline záloha z cache
        return caches.match(event.request);
      })
  );
});
