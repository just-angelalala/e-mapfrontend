<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import addressData from '@/assets/json/address.json';

const router = useRouter();
const store = useStore();

const isSubmitting = ref(false);

// Assuming Vuex is set up to store the selected city and barangay
const selectedCity = computed({
    get: () => store.state.auth.selectedCity,
    set: city => store.commit('auth/setSelectedCity', city)
});

const selectedBarangay = computed({
    get: () => store.state.auth.selectedBarangay,
    set: barangay => store.commit('auth/setSelectedBarangay', barangay)
});

// Directly set cities from the JSON data, assuming province data is loaded similarly
const cities = computed(() => addressData.municipalities_and_cities.map(city => ({
    name: city.name,
    ...city
})));

const barangays = computed(() => {
    const city = selectedCity.value;
    return city ? (Array.isArray(city.barangays) ? city.barangays.map(barangay => (typeof barangay === 'object' ? barangay : { name: barangay })) : []) : [];
});

// Latitude and Longitude are dynamically updated based on selectedBarangay
const latitude = computed(() => selectedBarangay.value?.latitude || '');
const longitude = computed(() => selectedBarangay.value?.longitude || '');

// Province is static in this setup
const province = computed(() => addressData.province);

const sitio = computed({
    get: () => store.state.auth.registrationForm.sitio,
    set: value => store.commit('auth/UPDATE_FIELD', { field: 'sitio', value })
});

const detailedAddress = computed({
    get: () => store.state.auth.registrationForm.detailedAddress,
    set: value => store.commit('auth/UPDATE_FIELD', { field: 'detailedAddress', value })
});


const goToPreviousStep = () => {
    store.commit('auth/DECREMENT_STEP');
};

async function handleSubmit() {
    if (isSubmitting.value) return; // Prevent further execution if already submitting
    isSubmitting.value = true; // Indicate submission start
    
    try {
        const response = await store.dispatch('auth/register');
        console.log("Registration successful. Response:", response);
        await store.commit('SET_TOKEN', response.data.token);
        router.push({ name: 'landing' });
    } catch (error) {
        console.error("Registration failed:", error);
    } finally {
        isSubmitting.value = false; // Reset submission status on completion
    }
}

</script>

<template>
    <div style="margin-bottom: 4px;">
        <label>Province:</label>
        <InputText type="text" v-model="province" disabled />
    </div>
    <div style="margin-bottom: 4px;">
        <label>City/Municipality:</label>
        <Dropdown v-model="selectedCity" :options="cities" optionLabel="name" placeholder="Select City/Municipality" />
    </div>
    <div style="margin-bottom: 4px;">
        <label>Barangay:</label>
        <Dropdown v-model="selectedBarangay" :options="barangays" optionLabel="name" placeholder="Select Barangay" />
    </div>
    <div style="margin-bottom: 4px;">
        <label>Sitio:</label>
        <InputText type="text" v-model="sitio" placeholder="Enter Sitio (if applicable)" />
    </div>
    <div style="margin-bottom: 4px;">
        <label>Detailed Address:</label>
        <InputText type="text" v-model="detailedAddress" placeholder="Enter Detailed Address" />
    </div>
    <div style="margin-bottom: 4px;">
        <label>Latitude:</label>
        <InputText type="text" v-model="latitude" readonly />
    </div>
    <div style="margin-bottom: 4px;">
        <label>Longitude:</label>
        <InputText type="text" v-model="longitude" readonly />
    </div>
    <div class="flex align-items-center justify-content-between mb-5 gap-5">
        <Button label="Back" class="w-full p-3 text-xl" @click="goToPreviousStep"></Button>
        <Button label="Submit" class="w-full p-3 text-xl" :disabled="isSubmitting" @click="handleSubmit"></Button>
    </div>
</template>
