<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useLayout } from '@/layout/composables/layout';
import AppConfig from '@/layout/AppConfig.vue';
import { getAuth, onAuthStateChanged, sendEmailVerification } from 'firebase/auth';
import { firebaseApp } from '@/config/firebaseConfig'; 

const auth = getAuth(firebaseApp);
const router = useRouter();
const store = useStore();
const { layoutConfig } = useLayout();

const logoUrl = ref(`layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`);

// Method to check email verification status
const checkVerificationStatus = () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            if (user.emailVerified) {
                router.push({ name: 'Add Account Info' });
            } else {
                // Handle unverified email case
                console.log("Email is not verified.");
            }
        } else {
            // No user is signed in
            console.log("No user is signed in.");
        }
    });
};

// Check email verification status on component mount
onMounted(() => {
    checkVerificationStatus();
});
</script>

<template>
        <div class="flex flex-column align-items-center justify-content-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" />
                        <div class="text-900 text-3xl font-medium mb-3">Verify your Email Address</div>
                        <Button @click="checkVerificationStatus">Check Verification Status</Button>
                    </div>

                    <div>
                        
                    </div>
                </div>
            </div>
        </div>
</template>

<style scoped>
</style>
