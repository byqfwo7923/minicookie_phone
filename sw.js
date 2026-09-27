const CACHE_NAME = 'mini-phone-v1.0.2';
const HOME = '/minicookie_phone/index.html';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll([
        '/minicookie_phone/',
        '/minicookie_phone/index.html',
        '/minicookie_phone/manifest.json'
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.map(function(name) {
          if (name !== CACHE_NAME) return caches.delete(name);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  // 只处理导航请求（打开页面）
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(function() {
        return caches.match(HOME);
      })
    );
    return;
  }
  // 其他资源：缓存优先，没有就走网络
  event.respondWith(
    caches.match(event.request).then(function(res) {
      return res || fetch(event.request);
    })
  );
});
