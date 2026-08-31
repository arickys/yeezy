const CACHE_NAME = "unyzy-cache-v2";

const OFFLINE_PAGE = "/offline.html";

const PRECACHE = [
  "/",
  "/index.html",
  "/downloads.html",
  "/updates.html",
  "/offline.html",
  "/assets/LOGO2.png",
  "/assets/logo.png",
  "/assets/err.png",
  "/assets/NO_CIERTO_BESAME_MAMA.png",
  "/assets/IAPW.png",
  "/assets/IAPWE.png",
  "/fonts/yeezy_tstar-regular-webfont.woff",
  "/fonts/yeezy_tstar-bold.webfont.woff"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );

  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const request = event.request;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(response => response)
        .catch(() => caches.match(OFFLINE_PAGE))
    );

    return;
  }

  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok) {
          const copy = response.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, copy);
          });
        }

        return response;
      })
      .catch(() => caches.match(request))
  );
});