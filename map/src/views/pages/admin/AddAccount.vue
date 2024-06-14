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

        // Committing the mutation to update Vuex state
        await store.commit('auth/UPDATE_FIELD', {
            field: 'email',
            value: user.email,
        });
        await store.commit('auth/UPDATE_FIELD', {
            field: 'firebaseId',
            value: user.uid
        });

        // Redirect to email verification route
        await router.push({ name: 'Add Account Verify' });
    } catch (error) {
        console.error("Error in account registration:", error);
        // Handle registration errors here
    }
};

</script>

<template>
  <div class="card flex justify-content-center">
    <div class="card flex justify-content-center">
      <div>
        <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
    <div>
        <div class="text-900 text-3xl font-medium mb-3">Account Details</div>

        <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="email" />

        <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>

        <div class="flex align-items-center justify-content-between mb-5 gap-5">
            <Button label="Register" class="w-full p-3 text-xl" @click="registerAccount"></Button>
        </div>
    </div>
        </div>
    </div>
    </div>
    </div>
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

<style scoped>
.section-header h2 {
  margin-bottom: 20px;
}

.field {
  margin-bottom: 10px;
}

.field label {
  display: block;
  margin-bottom: 5px;
}
</style> 