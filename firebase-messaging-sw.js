// ASK UNION - Firebase Cloud Messaging Service Worker

importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAzMEREwPKnifSIrB5Cva8D-CFbVIa5zF0",
  authDomain: "ask-union-jaipur-circle.firebaseapp.com",
  projectId: "ask-union-jaipur-circle",
  storageBucket: "ask-union-jaipur-circle.firebasestorage.app",
  messagingSenderId: "584327754977",
  appId: "1:584327754977:web:7164a85c007165743ef3a"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log("[ASK UNION] Background message:", payload);

  const notification = payload.notification || {};
  const data = payload.data || {};

  const title = notification.title || data.title || "ASK UNION";
  const body = notification.body || data.body || "New union update available.";

  const options = {
    body: body,
    icon: "./ask-union-icon-192.png",
    badge: "./ask-union-icon-192.png",
    data: {
      url: data.url || "./"
    }
  };

  return self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", function(event) {
  event.notification.close();

  const url =
    (event.notification.data && event.notification.data.url) || "./";

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then(function(clientList) {

      for (const client of clientList) {
        if ("focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
