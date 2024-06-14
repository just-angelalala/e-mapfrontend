import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDLlUo8YmckAhEo9ezGKa4MqjmzKP0-_dY",
    authDomain: "mindoro-auto-parts.firebaseapp.com",
    projectId: "mindoro-auto-parts",
    storageBucket: "mindoro-auto-parts.appspot.com",
    messagingSenderId: "701676277655",
    appId: "1:701676277655:web:43b9114785504ee5493ed2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = getMessaging(app);

export { messaging };
