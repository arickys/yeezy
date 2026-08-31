const CACHE_NAME = "unyzy-v4";

const STATIC_FILES = [
    "/",
    "/index.html",
    "/downloads.html",
    "/updates.html",
    "/404.html",
    "/assets/LOGO2.png",
    "/assets/logo.png",
    "/assets/err.png",
    "/assets/IAPW.png",
    "/assets/IAPWE.png",
    "/assets/NO_CIERTO_BESAME_MAMA.png",
    "/fonts/yeezy_tstar-bold.webfont.woff",
    "/fonts/yeezy_tstar-regular-webfont.woff"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async cache => {
            for (const file of STATIC_FILES) {
                try {
                    await cache.add(file);
                } catch {
                    console.warn("Could not cache:", file);
                }
            }
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") return;

    event.respondWith(
        fetch(event.request)
            .then(response => {
                if (response.ok) {
                    const copy = response.clone();

                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, copy);
                    });
                }

                return response;
            })
            .catch(() =>
                caches.match(event.request).then(cached => {
                    if (cached) return cached;

                    if (event.request.mode === "navigate") {
                        return caches.match("/offline.html");
                    }

                    return new Response("", {
                        status: 503,
                        statusText: "Offline"
                    });
                })
            )
    );
});