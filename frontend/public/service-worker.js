// Basic service worker: caches the app shell so the site loads instantly on repeat visits
// and shows something even on a poor/no connection, instead of a blank white screen.
// This does NOT cache API responses (courses, chat, etc.) - those always need a fresh network
// request, since course access and payment status must never be shown stale.

const CACHE_NAME = "tk-english-academy-v1";
const urlsToCache = ["/", "/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Clean up old cache versions if this file's CACHE_NAME is ever bumped later
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Never intercept API calls - always go to network for anything under /api/
  if (event.request.url.includes("/api/")) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => cachedResponse || fetch(event.request))
  );
});
