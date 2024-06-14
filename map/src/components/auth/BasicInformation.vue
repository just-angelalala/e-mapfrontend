<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

// Define computed properties for each piece of state
const surname = computed({
    get: () => store.state.auth.registrationForm.lastName,
    set: (value) => store.commit('auth/UPDATE_FIELD', { field: 'lastName', value })
});

const firstName = computed({
    get: () => store.state.auth.registrationForm.firstName,
    set: (value) => store.commit('auth/UPDATE_FIELD', { field: 'firstName', value })
});

const middleName = computed({
    get: () => store.state.auth.registrationForm.middleName,
    set: (value) => store.commit('auth/UPDATE_FIELD', { field: 'middleName', value })
});


const resetState = () => {
    store.commit('auth/RESET_STATE');
}

const goToNextStep = () => {
    store.commit('auth/INCREMENT_STEP');
};
</script>



<template>
<div>
    <div class="text-900 text-3xl font-medium mb-3">Basic Information</div>

    <label for="surname" class="block text-900 text-xl font-medium mb-2">Surname</label>
    <InputText id="surname" type="text" placeholder="Surname" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="surname" />

    <label for="FirstName" class="block text-900 text-xl font-medium mb-2">First Name</label>
    <InputText id="FirstName" type="text" placeholder="First Name" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="firstName" />
    
    <label for="middleName" class="block text-900 text-xl font-medium mb-2">Middle Name</label>
    <InputText id="middleName" type="text" placeholder="Middle Name" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="middleName" />
    <div class="flex align-items-center justify-content-between mb-5 gap-5">
        <Button label="Reset Registration" class="w-full p-3 text-xl" @click="resetState" style="background-color: red; color: white;"></Button>
    <Button label="Next" class="w-full p-3 text-xl" @click="goToNextStep"></Button>
    </div>
</div>
</template>

<style scoped>
</style>