<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

// Adjusted computed properties to use a generalized UPDATE_FIELD mutation
const phoneNumber = computed({
    get: () => store.state.auth.registrationForm.phoneNumber,
    set: value => store.commit('auth/UPDATE_FIELD', { field: 'phoneNumber', value })
});

const gender = computed({
    get: () => store.state.auth.registrationForm.gender,
    set: value => store.commit('auth/UPDATE_FIELD', { field: 'gender', value })
});

const dob = computed({
    get: () => store.state.auth.registrationForm.dateOfBirth, // Make sure this matches the state property name
    set: value => store.commit('auth/UPDATE_FIELD', { field: 'dateOfBirth', value })
});

const genderOptions = [
    { label: 'Male', value: 'Male' }, // Adjust value to match what you expect in the backend or state
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
];

const goToPreviousStep = () => {
    store.commit('auth/DECREMENT_STEP');
};

const goToNextStep = () => {
    store.commit('auth/INCREMENT_STEP');
};
</script>




<template>
    <div>
        <div class="text-900 text-3xl font-medium mb-3">Personal Details</div>

        <label for="phoneNumber" class="block text-900 text-xl font-medium mb-2">Phone Number</label>
        <InputText id="phoneNumber" type="text" placeholder="Phone Number" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="phoneNumber" />

        <label for="gender" class="block text-900 text-xl font-medium mb-2">Gender</label>
        <Dropdown id="gender" v-model="gender" :options="genderOptions" optionLabel="label" optionValue="value" placeholder="Select your gender" class="w-full md:w-30rem mb-5" />

        <label for="dob" class="block text-900 text-xl font-medium mb-2">Date of Birth</label>
        <Calendar id="dob" v-model="dob" dateFormat="yy-mm-dd" class="w-full md:w-30rem mb-5" showIcon/>

        <div class="flex align-items-center justify-content-between mb-5 gap-5">
            <Button label="Back" class="w-full p-3 text-xl" @click="goToPreviousStep"></Button>
            <Button label="Next" class="w-full p-3 text-xl" @click="goToNextStep"></Button>
        </div>
    </div>
</template>