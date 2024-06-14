<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

import AuthenticationService from "@/service/AuthenticationService";

const authenticationService = new AuthenticationService();

const router = useRouter();
const store = useStore();

// Initialize refs for additional user details
const firstName = ref('');
const lastName = ref('');
const role = ref(null);

// Retrieve email and Firebase ID from Vuex state
const email = computed(() => store.state.auth.registrationForm.email);
const firebaseId = computed(() => store.state.auth.registrationForm.firebaseId);

// Role options for the dropdown
const roleOptions = [
    { label: 'Customer', value: 'Customer' },
    { label: 'Employee', value: 'Employee' },
    { label: 'Owner', value: 'Owner' }
];

const completeRegistration = async () => {
    try {
        // Create an object with all registration details
        const registrationDetails = {
            email: email.value,
            firebaseId: firebaseId.value,
            firstName: firstName.value,
            lastName: lastName.value,
            role: role.value
        };

        
        // Log the complete registration details object
        const response = await authenticationService.registerByAdmin(registrationDetails);

        // Here you could update your database with the registration details
        // After successful update, redirect to another route
        await router.push({ name: 'Add Account' }); // Redirect to the home or dashboard page
    } catch (error) {
        console.error("Error in completing registration:", error);
        // Handle errors here
    }
};

</script>

<template>
  <div class="card">
    <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
        <div class="text-900 text-3xl font-medium mb-3">Complete Your Profile</div>

        <label for="firstName" class="block text-900 text-xl font-medium mb-2">First Name</label>
        <InputText id="firstName" type="text" placeholder="First Name" class="w-full mb-3" v-model="firstName" />

        <label for="lastName" class="block text-900 text-xl font-medium mb-2">Last Name</label>
        <InputText id="lastName" type="text" placeholder="Last Name" class="w-full mb-3" v-model="lastName" />

        <label for="role" class="block text-900 text-xl font-medium mb-2">Role</label>
        <Dropdown id="role" :options="roleOptions" optionLabel="label" optionValue="value" placeholder="Select Role" v-model="role" class="w-full mb-5"/>

        <Button label="Complete Registration" class="w-full p-3 text-xl" @click="completeRegistration"></Button>
    </div>
  </div>
</template>

<style scoped>
.pi-eye, .pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}

.field {
  margin-bottom: 10px;
}

.field label {
  display: block;
  margin-bottom: 5px;
}
</style>
