const CACHE_NAME = "unyzy-v10";

const STATIC_FILES = [
    "/",
    "/index.html",
    "/downloads.html",
    "/updates.html",
    "/offline.html",
    "/404.html",
    "/theme.css",
    "/footer.js",
    "/transitions.js",

    "/assets/graduation-bg.png",
    "/assets/mountains.png",
    "/assets/mountainsSky.jpg",
    "/assets/LOGO2.png",
    "/assets/logo.png",
    "/assets/err.png",
    "/assets/IAPW.png",
    "/assets/IAPWE.png",
    "/assets/NO_CIERTO_BESAME_MAMA.png",

    "/fonts/yeezy_tstar-bold-webfont.woff",
    "/fonts/yeezy_tstar-regular-webfont.woff",
    "/assets/AwesomeBi_polar-Regular.otf"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async cache => {
            for (const file of STATIC_FILES) {
                try {
                    const response = await fetch(file, { cache: "no-store" });

                    if (response.ok) {
                        await cache.put(file, response);
                    }
                } catch (error) {
                    console.warn("Could not cache:", file);
                }
            }

            await self.skipWaiting();
        })
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

    const url = new URL(event.request.url);

    if (url.origin !== self.location.origin) return;

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
                    if (cached) {
                        return cached;
                    }

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