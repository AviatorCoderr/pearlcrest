importScripts('https://www.gstatic.com/firebasejs/9.21.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.21.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyC9KWykEPu7LKzwoG836efHK7aO0kdUioU",
  authDomain: "pearl-crest.firebaseapp.com",
  projectId: "pearl-crest",
  storageBucket: "pearl-crest.appspot.com",
  messagingSenderId: "568971789490",
  appId: "1:568971789490:web:1c723d1d59b933f1ed75ab",
  measurementId: "G-9JVDBCNXYL"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
