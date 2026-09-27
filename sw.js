const CACHE = "my-first-language-book-v6";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./data/vocabulary.json",
  "./icons/icon.svg",
  "./images/cover_image.png",
  "./images/001.jpg",
  "./images/002.jpg",
  "./images/003.jpg",
  "./images/004.jpg",
  "./images/005.jpg",
  "./images/006.jpg",
  "./images/007.jpg",
  "./images/008.jpg",
  "./images/009.jpg",
  "./images/010.jpg"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy));
        return response;
      });
    })
  );
});
