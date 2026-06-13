importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyBhhmH-lYN7a4BWVGTN77oRSyBF1WI70kg",
  authDomain: "cars-24-bc932.firebaseapp.com",
  projectId: "cars-24-bc932",
  storageBucket: "cars-24-bc932.firebasestorage.app",
  messagingSenderId: "389353770711",
  appId: "1:389353770711:web:e84b7e2153ebc188802a92",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title =
    payload.notification?.title ||
    "Cars24 Notification";

  const options = {
    body:
      payload.notification?.body || "",
  };

  self.registration.showNotification(
    title,
    options
  );
});

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    self.clients.claim()
  );
});