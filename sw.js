const CACHE = 'tm-v3';
const SHELL = [
  '/torneria-mijares/torneria_mijares_sync.html',
  '/torneria-mijares/manifest.json',
  '/torneria-mijares/icon-192.png',
  '/torneria-mijares/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Para llamadas a la API de Google siempre ir a la red
  if (e.request.url.includes('script.google.com')) return;
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
