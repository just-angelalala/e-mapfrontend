<script setup>
import { ref, onMounted, computed } from 'vue';
import { useToast } from "primevue/usetoast";
import { useStore } from 'vuex';
import UserServices from '@/service/UserServices';
import { useRouter } from 'vue-router';
import addressData from '@/assets/json/address.json';

// Get the router instance
const router = useRouter();
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';

const auth = getAuth();
const visible = ref(false);
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const toast = useToast();

const closeDialog = () => {
  visible.value = false;
};

const changePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    alert('New passwords do not match.');
    return;
  }

  try {
    const user = auth.currentUser;
    console.log(user.email);
    const credential = EmailAuthProvider.credential(user.email, currentPassword.value);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword.value);
    alert('Password updated successfully.');
    closeDialog();
  } catch (error) {
    alert('Failed to update password: ' + error.message);
  }
};

const cities = computed(() => addressData.municipalities_and_cities.map(city => ({
    name: city.name,
    ...city
})));

const barangays = computed(() => {
    const cityName = userProfile.value.city;
    if (!cityName) return [];
    const city = addressData.municipalities_and_cities.find(c => c.name === cityName);
    return city ? city.barangays.map(barangay => (typeof barangay === 'object' ? barangay : { name: barangay })) : [];
});


const userProfile = ref({});

// Create instance of UserServices
const userService = new UserServices();
const store = useStore();

const userID = computed(() => store.state.auth.userId);

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

const gender = [
    { name: 'Male', value: 'Male' },
    { name: 'Female', value: 'Female' },
    { name: 'Other', value: 'Other' }
];

// Fetch user profile data when the component is mounted
onMounted(() => {
    fetchUserInfo();
});

async function updateProfile() {
  try {
    const res = await userService.editProfile(userProfile.value);
    toast.add({ severity: 'success', summary: 'Success', detail: 'Profile updated successfully' });
    router.push({ name: 'View Profile' });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update profile' });
  }
}

async function cancel()
{
    router.push({ name: 'View Profile' });
}
</script>

<template>
    <Toast/>
    <h3>Edit User Profile</h3>
    <Card style="width: 80rem; overflow: hidden">
        <template #header>
            <img alt="user header" src="https://primefaces.org/cdn/primevue/images/usercard.png" />
        </template>
        <template #title>Personal Information</template>
        <template #content >
            <div class="flex gap-3 p-fluid">
                <div class="flex-auto">
                    <label class="font-bold block mb-2"> First Name </label>
                    <InputText v-model="userProfile.first_name" id="FullName" type="text" placeholder="Full Name" class="w-full md:w-50rem mb-5"></InputText>
                </div>
                <div class="flex-auto">
                    <label class="font-bold block mb-2"> Last Name </label>
                    <InputText v-model="userProfile.last_name" type="text" placeholder="Last Name" class="w-full md:w-50rem mb-5"></InputText>
                </div>
            </div>

            <div class=" flex flex-wrap gap-3 p-fluid">
                <div class="flex-auto">
                    <label for="buttondisplay" class="font-bold block mb-2"> Phone Number </label>
                    <InputText v-model="userProfile.phone_number" type="text" placeholder="Phone Number"></InputText>
                </div>
                <div class="flex-auto">
                    <label for="icondisplay" class="font-bold block mb-2"> Gender</label>
                    <Dropdown v-model="userProfile.gender" :options="gender" optionLabel="name" optionValue="value" placeholder="Select Gender"></Dropdown>
                </div>
                <div class="flex-auto">
                    <label for="icondisplay" class="font-bold block mb-2"> Date of Birth </label>
                    <Calendar v-model="userProfile.date_of_birth" showIcon iconDisplay="input" inputId="icondisplay" class=" md:w-50rem mb-5" />
                </div>
            </div>

            <div class=" flex-justify">
                <Button label="Create New Password" @click="visible = true" />
                    <Dialog v-model:visible="visible" modal header="Update Password" :style="{ width: '20rem' }">
                            <div class="flex-auto gap-3 mb-5">
                                <label for="buttondisplay" class="font-bold block mb-2"> Current Password </label>
                                <Password toggleMask id="currentPassword" v-model="currentPassword" placeholder="Enter Current Password" />
                            </div>

                            <div class="flex-auto gap-3 mb-5">
                                <label for="buttondisplay" class="font-bold block mb-2"> New Password </label>
                                <Password toggleMask id="newPassword" v-model="newPassword" placeholder="Enter New Password"/>
                            </div>

                            <div class="flex-auto gap-3 mb-5">
                                <label for="buttondisplay" class="font-bold block mb-2"> Confirm New Password </label>
                                <Password toggleMask id="confirmPassword" v-model="confirmPassword" placeholder="Confirm New Password"/>
                            </div>
                            
                            <div class="flex justify-content-end gap-2">
                            <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                            <Button type="button" label="Save" @click="changePassword"></Button>
                            </div>
                    </Dialog>
                </div>
        </template>
    </Card>



    <Card style="width: 80rem; overflow: hidden">
        <template #title>Address Detail</template>
        <template #content >
            <div class="flex gap-3 p-fluid">
                <div class="flex-auto">
                    <label class="font-bold block mb-2"> Province </label>
                    <InputText v-model="userProfile.province" type="text" placeholder="Province" class="w-full md:w-50rem mb-5"></InputText>
                </div>
                <div class="flex-auto">
                    <label class="font-bold block mb-2"> City/Municipality </label>
                    <Dropdown v-model="userProfile.city" :options="cities" optionLabel="name" optionValue="name" placeholder="Select City/Municipality" />
                </div>
            </div>

            <div class=" flex flex-wrap gap-3 p-fluid">
                <div class="flex-auto">
                    <label  class="font-bold block mb-2"> Barangay </label>
                    <Dropdown v-model="userProfile.barangay" :options="barangays" optionLabel="name" optionValue="name" placeholder="Select Barangay" />
                </div>
                <div class="flex-auto">
                    <label  class="font-bold block mb-2"> Sitio </label>
                    <InputText v-model="userProfile.sitio" type="text" placeholder="Sitio"></InputText>
                </div>
            </div>

            <div class=" flex flex-wrap gap-3 p-fluid">
                <div class="flex-auto">
                    <label  class="font-bold block mb-2"> Detailed Address </label>
                    <InputText v-model="userProfile.detailed_address" type="text" placeholder="Detailed Address"></InputText>
                </div>
                <div class="flex-auto">
                    <label  class="font-bold block mb-2"> Latitude </label>
                    <InputText v-model="userProfile.latitude " type="text" placeholder="Latitude"></InputText>
                </div>
                <div class="flex-auto">
                    <label  class="font-bold block mb-2"> Longitude </label>
                    <InputText v-model="userProfile.longitude" type="text" placeholder="Longitude"></InputText>
                </div>
            </div>
        </template>

        <template #footer>
            <div class="flex gap-3 mt-1">
                <Button @click="cancel()" label="Cancel" severity="secondary" outlined class="w-full" />
                <Button @click="updateProfile()" label="Save" class="w-full" />
            </div>
        </template>
    </Card>


</template>
<style scoped>
    /* Your scoped styles here */
</style>