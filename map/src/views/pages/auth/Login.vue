<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import AuthenticationService from '@/service/AuthenticationService';
import { firebaseApp } from '@/config/firebaseConfig';
import { useStore } from 'vuex';
import { jwtDecode } from 'jwt-decode';

const { layoutConfig } = useLayout();

const logoUrl = computed(() => {
    return '/layout/images/logo-emap.jpg'
});

const auth = getAuth(firebaseApp);
const router = useRouter();
const store = useStore();

// Reactive properties for form inputs
const firebaseEmail = ref('');
const password = ref('');
const loginLoading = ref(false);
const fcmToken = store.state.auth.fcmToken;


async function loginUser() {
    try {
        loginLoading.value = true;
        // Sign in with Firebase
        const userCredential = await signInWithEmailAndPassword(auth, firebaseEmail.value, password.value);
        const idToken = await userCredential.user.getIdToken();

        // Send ID token to backend for verification and session management
        const authenticationService = new AuthenticationService();
        const response = await authenticationService.login(idToken, fcmToken);

        // Commit token to the store
        await store.commit('auth/SET_TOKEN', response.data.token);

        // Decode the JWT to get the user role
        const decodedToken = jwtDecode(response.data.token);
        const userRole = decodedToken.role;

        // Navigate based on the user role
        if (userRole === 'Customer') {
            router.push({ name: 'landing' });
        } else if (userRole === 'Owner' || userRole === 'Employee') {
            router.push({ name: 'dashboard' });
        } else {
            loginLoading.value = false;
            // Optionally handle unexpected roles or errors
            console.error('Unexpected user role:', userRole);
        }
    } catch ( error) {
        loginLoading.value = false;

        console.error('Login failed:', error);
        // Handle login failure (e.g., show an error message)
    }  
}

</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" />
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <div class="text-900 text-3xl font-medium mb-3">Welcome, User</div>

                        <span>Don't have an account?</span>
                        <router-link :to="{ name: 'register' }" class="ml-2 text-primary font-bold">
                            Signup
                        </router-link>
                    </div>

                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="firebaseEmail" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }" :feedback="false"></Password>

                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <div class="flex align-items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Remember me</label>
                            </div>
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Forgot password?</a>
                        </div>
                        <Button label="Sign In" class="w-full p-3 text-xl" @click="loginUser" :loading="loginLoading"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
