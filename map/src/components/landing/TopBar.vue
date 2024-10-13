<script setup>
import { ref, computed, onMounted, watch} from "vue";
import { useLayout } from '@/layout/composables/layout';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

import UserServices from '@/service/UserServices';
import InputText from 'primevue/inputtext';
const BASE_URL = import.meta.env.VITE_APP_BASE_URL_USER_PHOTO;


// Inside your setup function
const router = useRouter();


const products = ref([
  { id: 1, name: 'Product A', category: 'Electronics' },
  { id: 2, name: 'Product B', category: 'Clothing' },
  { id: 3, name: 'Product C', category: 'Books' },
  // Add more products as needed
]);

const searchQuery = ref('');
const filteredProducts = ref([]);

const handleSearch = () => {
  const query = searchQuery.value.toLowerCase();
  filteredProducts.value = products.value.filter((product) =>
    product.name.toLowerCase().includes(query) ||
    product.category.toLowerCase().includes(query)
  );
};

watch(searchQuery, handleSearch);

const store = useStore();
const userService = new UserServices();

const { layoutConfig } = useLayout();

const userID = computed(() => store.state.auth.userId);
const accountType = computed(() => store.state.auth.accountType);
const token = computed(() => store.state.auth.token);


const userInfo = ref({ name: '', photo: '' });

const logoUrl = computed(() => {
    return '/layout/images/logo-emap.jpg'
});

const menu = ref();
const toggle = (event) => {
    menu.value.toggle(event);
};

const openCartDialog = () => {
    store.commit('setCartVisible', true);
    store.commit('setCartPosition', 'topright');
};

const handleLogout = async () => {
    await store.dispatch('auth/logout');
    // Additional post-logout logic here, if necessary
};

const handleProfile = async () => {
    router.push({ name: 'View Profile' });
};

const items = ref([
    {
        separator: true
    },
    {
        label: 'Profile',
        items: [
            {
                label: 'Profile',
                icon: 'pi pi-cog',
                shortcut: '⌘+O',
                command: handleProfile 
            },
            {
                label: 'Logout',
                icon: 'pi pi-sign-out',
                shortcut: '⌘+Q'
            }
        ]
    },
    {
        separator: true
    }
]);

const fetchUserInfo = async () => {
    if (userID.value) {
        try {
            const data = await userService.getNameAndPhoto(userID.value);
            userInfo.value = {
                name: data.username,
                photo: data.photo
            };
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    }
};


onMounted(fetchUserInfo);
</script>

<template>
<div
    class="py-4 px-4 mx-0 md:mx-6 lg:mx-8 lg:px-8 flex align-items-center justify-content-between relative lg:static mb-3">
    <a class="flex align-items-center" href="#"> <img :src="logoUrl" alt="Sakai Logo" height="50"
            class="mr-0 lg:mr-2" /><span class="text-900 font-medium text-2xl line-height-3 mr-8">MINDORO AUTO
            PARTS</span> </a>
    <a class="cursor-pointer block lg:hidden text-700 p-ripple" v-ripple
        v-styleclass="{ selector: '@next', enterClass: 'hidden', leaveToClass: 'hidden', hideOnOutsideClick: true }">
        <i class="pi pi-bars text-4xl"></i>
    </a>
    <div class="align-items-center surface-0 flex-grow-1 justify-content-between hidden lg:flex absolute lg:static w-full left-0 px-6 lg:px-0 z-2"
        style="top: 120px">
        <ul
            class="list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row cursor-pointer">
            <li>
                <router-link to="/orderTracker" @click="smoothScroll('#hero')"
                    class="flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3 p-ripple" v-ripple>
                    <span>Order Tracker</span>
                </router-link>
            </li>
        </ul>

        <div>
    <!-- <InputText v-model="searchQuery" placeholder="Search..." @input="handleSearch" />
     -->
    <div v-if="showResults">
      <h3>Search Results:</h3>
      <ul>
        <li v-for="product in filteredProducts" :key="product.id">
          {{ product.name }} - {{ product.category }}
        </li>
      </ul>
    </div>
    <div v-else>
      <p v-if="searchQuery.trim() !== ''">No matching items found.</p>
    </div>
  </div>

        <div
            class="flex justify-content-between lg:block border-top-1 lg:border-top-none surface-border py-3 lg:py-0 mt-3 lg:mt-0">
            <div v-if="!token"> 
            <Button icon="pi pi-shopping-cart" @click="openCartDialog" />
            <router-link :to="{ name: 'login' }">
                <Button label="Login"
                    class="p-button-text p-button-rounded border-none font-light line-height-2 text-blue-500"></Button>
            </router-link>
            <router-link :to="{ name: 'register' }">
                <Button label="Register"
                    class="p-button-rounded border-none ml-5 font-light text-white line-height-2 bg-blue-500"></Button>
            </router-link>
            </div>
            <div v-if="token"> 
            <Button icon="pi pi-shopping-cart" @click="openCartDialog" />
            <Avatar 
                :image="`${BASE_URL}${userInfo.photo}` || 'https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png'"
                class="mr-2 ml-5 cursor-pointer" 
                shape="circle" 
                @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" size="large"
            />
            <Menu ref="menu" :model="items" class="w-full md:w-15rem" :popup="true">
                
            <template #item="{ item, props }">
                <a v-ripple class="flex align-items-center" v-bind="props.action" @click="item.label === 'Logout' ? handleLogout() : null">
                    <span :class="item.icon" />
                    <span class="ml-2">{{ item.label }}</span>
                    <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
                    <span v-if="item.shortcut" class="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{{ item.shortcut }}</span>
                </a>
            </template>
            <template #end>
                <button v-ripple class="relative overflow-hidden w-full p-link flex align-items-center p-2 pl-3 text-color hover:surface-200 border-noround">
                    <Avatar :image="`${BASE_URL}${userInfo.photo}` || 'https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png'" class="mr-2" shape="circle" />
                    <span class="inline-flex flex-column">
                        <span class="font-bold">{{ userInfo.name || 'Undefined user' }}</span>
                        <span class="text-sm">{{ accountType }}</span>
                    </span>
                </button>
            </template>
        </Menu>
        </div>
        </div>
    </div>
</div>

</template>

<style scoped>
    /* Your scoped styles here */
</style>