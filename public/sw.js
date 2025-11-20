const STATIC_CACHE = "static-cache-v1";
const SCHOOL_PAGE_CACHE = "school-page-cache-v1";
const SCHOOL_API_CACHE = "school-api-cache-v1";

// Which files to precache
const PRECACHE_ASSETS = [
  "/school",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
];

// Install event (precache)
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
});

// Activate event (cleanup old caches)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
});

// Fetch handler
self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // Cache School Page
  if (url.includes("/school")) {
    event.respondWith(
      caches.open(SCHOOL_PAGE_CACHE).then((cache) =>
        fetch(event.request)
          .then((response) => {
            cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => caches.match(event.request))
      )
    );
    return;
  }

  // Cache API Calls
  if (url.includes("/api/school")) {
    event.respondWith(
      caches.open(SCHOOL_API_CACHE).then((cache) =>
        fetch(event.request)
          .then((response) => {
            cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => caches.match(event.request))
      )
    );
    return;
  }

  // Default fallback for static assets
  event.respondWith(
    caches.match(event.request).then(
      (cached) =>
        cached ||
        fetch(event.request).catch(() =>
          caches.match("/") // fallback to homepage offline
        )
    )
  );
});