<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import UserServices from '@/service/UserServices';
import { useRouter } from 'vue-router';

// Get the router instance
const router = useRouter();

// Initialize user profile with default fallback values
const defaultProfile = {
    firstName: 'Unavailable',
    lastName: 'Unavailable',
    phoneNumber: 'Unavailable',
    gender: 'Unavailable',
    birthDate: 'Unavailable',
    address: {
        province: 'Unavailable',
        city: 'Unavailable',
        barangay: 'Unavailable',
        street: 'Unavailable',
        zipCode: 'Unavailable',
        detailedAddress: 'Unavailable',
        latitude: 'Unavailable',
        longitude: 'Unavailable'
    }
};

const userProfile = ref(defaultProfile);

// Create instance of UserServices
const userService = new UserServices();
const store = useStore();

const userID = computed(() => store.state.auth.userId);

// Function to fetch user profile data
const fetchUserInfo = async () => {
    if (!userID.value) {
        console.log("User ID not available");
        return;
    }
    try {
        const data = await userService.viewProfile(userID.value);
        if (data) {
            userProfile.value = data;
        } else {
            console.log("No data returned for the user.");
            userProfile.value = defaultProfile;
        }
    } catch (error) {
        console.error('Error fetching user info:', error);
        userProfile.value = defaultProfile;
    }
};

async function editProfile()
{
    router.push({ name: 'Edit Profile' });
}

// Fetch user profile data when the component is mounted
onMounted(() => {
    fetchUserInfo();
});
</script>

<template>
    <h3>View User Profile</h3>
    <Card style="width: 80rem; overflow: hidden">
        <template #header>
            <!-- Default image if userProfile.user_image is null or undefined -->
        </template>
        <template #title>Personal Information</template>
        <template #content>
            <div class="flex gap-3 p-fluid">
                <div class="flex-auto">
                    <label class="font-bold block mb-2"> First Name </label>
                    <div class="output">{{ userProfile.first_name || 'Not Available' }}</div>
                </div>
                <div class="flex-auto">
                    <label class="font-bold block mb-2"> Last Name </label>
                    <div class="output">{{ userProfile.last_name || 'Not Available' }}</div>
                </div>
            </div>

            <div class="flex flex-wrap gap-3 p-fluid">
                <div class="flex-auto">
                    <label class="font-bold block mb-2"> Phone Number </label>
                    <div class="output">{{ userProfile.phone_number || 'Not Available' }}</div>
                </div>
                <div class="flex-auto">
                    <label class="font-bold block mb-2"> Gender</label>
                    <div class="output">{{ userProfile.gender || 'Not Available' }}</div>
                </div>
                <div class="flex-auto">
                    <label class="font-bold block mb-2"> Date of Birth </label>
                    <div class="output">{{ userProfile.date_of_birth || 'Not Available' }}</div>
                </div>
            </div>
        </template>
    </Card>

    <Card style="width: 80rem; overflow: hidden">
        <template #title>Address Detail</template>
        <template #content>
            <div class="flex gap-3 p-fluid">
                <div class="flex-auto">
                    <label class="font-bold block mb-2"> Province </label>
                    <div class="output">{{ userProfile.province || 'Not Available' }}</div>
                </div>
                <div class="flex-auto">
                    <label class="font-bold block mb-2"> City/Municipality </label>
                    <div class="output">{{ userProfile.city || 'Not Available' }}</div>
                </div>
            </div>

            <div class="flex flex-wrap gap-3 p-fluid">
                <div class="flex-auto">
                    <label class="font-bold block mb-2"> Barangay </label>
                    <div class="output">{{ userProfile.barangay || 'Not Available' }}</div>
                </div>
                <div class="flex-auto">
                    <label class="font-bold block mb-2"> Sitio </label>
                    <div class="output">{{ userProfile.sitio || 'Not Available' }}</div>
                </div>
            </div>

            <div class="flex flex-wrap gap-3 p-fluid">
                <div class="flex-auto">
                    <label class="font-bold block mb-2"> Detailed Address </label>
                    <div class="output">{{ userProfile.detailed_address || 'Not Available' }}</div>
                </div>
                <div class="flex-auto">
                    <label class="font-bold block mb-2"> Latitude </label>
                    <div class="output">{{ userProfile.latitude || 'Not Available' }}</div>
                </div>
                <div class="flex-auto">
                    <label class="font-bold block mb-2"> Longitude </label>
                    <div class="output">{{ userProfile.longitude || 'Not Available' }}</div>
                </div>
            </div>
        </template>

        <template #footer>
            <div class="flex gap-3 mt-1">
                <Button @click="editProfile" label="Edit Profile" class="w-full" />
            </div>
        </template>
    </Card>
</template>

<style scoped>
.output {
    padding: 0.5rem 1rem;
    background-color: #f0f0f0;
    border-radius: 4px;
    margin-bottom: 5px;
}
</style>
