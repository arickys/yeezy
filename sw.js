const CACHE_NAME = "unyzy-v1";

const OFFLINE_PAGE = "/offline.html";

const ASSETS = [
    "/",
    "/downloads",
    "/updates",
    "/offline.html",
    "/assets/LOGO2.png",
    "/assets/NO_CIERTO_BESAME_MAMA.png",
    "/fonts/yeezy_tstar-bold.webfont.woff",
    "/fonts/yeezy_tstar-regular-webfont.woff"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS);
        })
    );

    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );

    self.clients.claim();
});

self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") {
        return;
    }

    const request = event.request;

    event.respondWith(
        fetch(request)
            .then(response => {
                if (
                    response.ok &&
                    new URL(request.url).origin === location.origin
                ) {
                    const copy = response.clone();

                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(request, copy);
                    });
                }

                return response;
            })
            .catch(() => {
                return caches.match(request).then(cached => {
                    return cached || caches.match(OFFLINE_PAGE);
                });
            })
    );
});