<script setup>
import {  getToken, onMessage } from "firebase/messaging";
import { messaging } from "@/firebase/init"; 
import { useToast } from 'primevue/usetoast';
import { useStore } from 'vuex';

const store = useStore();
const toast = useToast();

onMessage(messaging, async (payload) => {
    await console.log('Message received. ', payload);
    await store.dispatch('notification/fetchNotifications')
    // ...
    await toast.add({
        severity: 'info', // or 'success', 'error', 'warn'
        summary: 'Notification', // or any other title
        detail: payload.notification?.body || 'You have a new message!',
        life: 3000 // duration of the toast in milliseconds
    });

});

getToken(messaging, { vapidKey: 'BNrYLjGNdxhoaXRRshEh4zdfMwQffejnFQXnrkGf2WNna_rxHYtTz6YdjDS_k-EmsEr9uJ4MwjTS3xJVkSHNFAY' }).then((currentToken) => {
    if (currentToken) {
        store.commit('auth/UPDATE_FCM_TOKEN', currentToken);
    } else {
        console.log('No registration token available. Request permission to generate one.');
    }
}).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
});
</script>

<template>
</template>

<style scoped>
    /* Your scoped styles here */
</style>