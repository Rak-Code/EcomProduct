importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCZimwUJHGqO4EQv-TwhmoSTZKY8dWbBF4",
  authDomain: "sports-39a54.firebaseapp.com",
  projectId: "sports-39a54",
  storageBucket: "sports-39a54.firebasestorage.app",
  messagingSenderId: "1073900038402",
  appId: "1:1073900038402:web:adf71b43112bf3e9b9fa1b",
  measurementId: "G-WZGB934696"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/icon-192x192.png', // Optional: your app icon
  });
}); 