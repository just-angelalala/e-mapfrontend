// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyDLlUo8YmckAhEo9ezGKa4MqjmzKP0-_dY",
    authDomain: "mindoro-auto-parts.firebaseapp.com",
    projectId: "mindoro-auto-parts",
    storageBucket: "mindoro-auto-parts.appspot.com",
    messagingSenderId: "701676277655",
    appId: "1:701676277655:web:43b9114785504ee5493ed2"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
        '[firebase-messaging-sw.js] Received background message ',
        payload
    );
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        // icon: '/img/icons/android-chrome-512x512.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});