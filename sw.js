const CACHE_NAME = "ask-union-v9";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];


self.addEventListener("install", function(event) {

  event.waitUntil(

    caches.open(CACHE_NAME).then(function(cache) {

      return cache.addAll(FILES_TO_CACHE);

    })

  );

  self.skipWaiting();

});


self.addEventListener("activate", function(event) {

  event.waitUntil(

    caches.keys().then(function(keys) {

      return Promise.all(

        keys
          .filter(function(key) {

            return key !== CACHE_NAME;

          })

          .map(function(key) {

            return caches.delete(key);

          })

      );

    })

  );

  self.clients.claim();

});


self.addEventListener("fetch", function(event) {

  /*
    Firebase / Firestore requests should
    always go directly to the network.
  */

  if (
    event.request.url.includes("firestore.googleapis.com")
  ) {

    event.respondWith(
      fetch(event.request)
    );

    return;

  }


  /*
    app.js is no longer used by index.html.
    Other requests use normal cache-first behaviour.
  */

  event.respondWith(

    caches.match(event.request).then(
      function(response) {

        return response || fetch(event.request);

      }
    )

  );

});
