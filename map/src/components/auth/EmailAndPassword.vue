<script setup>
import { ref } from 'vue';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { firebaseApp } from '@/config/firebaseConfig'; 

const auth = getAuth(firebaseApp);
const router = useRouter();
const store = useStore();

// Initialize refs
const email = ref('');
const password = ref('');

const registerAccount = async () => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;

        await sendEmailVerification(user);

        await store.commit('auth/UPDATE_FIELD', {
            field: 'email',
            value: user.email,
        });
        await store.commit('auth/UPDATE_FIELD', {
            field: 'firebaseId',
            value: user.uid
        });

        await router.push({ name: 'verifyEmail' });
    } catch (error) {
        console.error("Error in account registration:", error);
    }
};

</script>

<template>
    <div>
        <div class="text-900 text-3xl font-medium mb-3">Account Details</div>

        <div class="mb-5">
            <span>Already have an account?</span>
            <router-link :to="{ name: 'login' }" class="ml-2 text-primary font-bold">
                Login
            </router-link>
        </div>

        <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
        <InputText 
            id="email1" 
            type="text" 
            placeholder="Email address" 
            class="w-full md:w-30rem mb-5" 
            style="padding: 1rem" 
            v-model="email" 
        />

        <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
        <Password 
            id="password1" 
            v-model="password" 
            placeholder="Password" 
            :toggleMask="true" 
            class="w-full mb-3" 
            inputClass="w-full" 
            :inputStyle="{ padding: '1rem' }"
        />

        <div class="flex align-items-center justify-content-between mb-5 gap-5">
            <Button label="Register" class="w-full p-3 text-xl" @click="registerAccount"></Button>
        </div>
    </div>
</template>
