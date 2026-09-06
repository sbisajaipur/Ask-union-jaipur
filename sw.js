const CACHE_NAME = "ask-union-v10";

const STATIC_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./udaipur-bg.png"
];


self.addEventListener("install", event => {

  event.waitUntil(

    caches
      .open(CACHE_NAME)
      .then(cache =>
        cache.addAll(STATIC_FILES)
      )

  );

  self.skipWaiting();

});


self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys().then(keys =>

      Promise.all(

        keys
          .filter(
            key => key !== CACHE_NAME
          )
          .map(
            key => caches.delete(key)
          )

      )

    )

  );

  self.clients.claim();

});


self.addEventListener("fetch", event => {

  const url =
    new URL(event.request.url);


  // HTML, JavaScript और Firestore
  // हमेशा network से आएंगे.

  if (

    event.request.mode === "navigate" ||

    url.pathname.endsWith(
      "/index.html"
    ) ||

    url.pathname.endsWith(
      "/app.js"
    ) ||

    url.hostname ===
      "firestore.googleapis.com"

  ) {

    event.respondWith(

      fetch(event.request)
        .catch(() =>
          caches.match(event.request)
        )

    );

    return;

  }


  event.respondWith(

    caches
      .match(event.request)
      .then(
        cached =>
          cached ||
          fetch(event.request)
      )

  );

});
