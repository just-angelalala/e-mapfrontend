<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import UserServices from '@/service/UserServices';

const { layoutConfig, onMenuToggle } = useLayout();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();
const store = useStore();
const userService = new UserServices();

const userID = computed(() => store.state.auth.userId);
const accountType = computed(() => store.state.auth.accountType);
const token = computed(() => store.state.auth.token);

onMounted(() => {
    bindOutsideClickListener();
    fetchUserInfo()
});

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const logoUrl = computed(() => {
    return '/layout/images/logo-emap.jpg'
});

const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};
const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};
const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
};
const isOutsideClicked = (event) => {
    if (!topbarMenuActive.value) return;

    const sidebarEl = document.querySelector('.layout-topbar-menu');
    const topbarEl = document.querySelector('.layout-topbar-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};

const handleLogout = async () => {
    await store.dispatch('auth/logout');
    router.push({ name: 'login' });
    // Additional post-logout logic here, if necessary
};

const userInfo = ref({ name: '', photo: '' });

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


const items = ref([
    {
        separator: true
    },
    {
        label: 'Profile',
        items: [
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

const menu = ref();

const toggle = (event) => {
    menu.value.toggle(event);
};

const viewProfile = () => {
    router.push({ name: 'View Profile' });
};

</script>

<template>
    <div class="layout-topbar">
        <router-link to="/" class="layout-topbar-logo">
            <img :src="logoUrl" alt="logo" />
            <span>MINDORO AUTO PARTS</span>
        </router-link>

        <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
            <i class="pi pi-bars"></i>
        </button>

        <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
            <i class="pi pi-ellipsis-v"></i>
        </button>

        <div class="layout-topbar-menu" :class="topbarMenuClasses">
            <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
                <i class="pi pi-calendar"></i>
                <span>Calendar</span>
            </button>
            <Avatar 
                :image="`${BASE_URL}${userInfo.photo}` || 'https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png'"
                class="mr-2 ml-5 cursor-pointer" 
                shape="circle" 
                @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" size="large"
            />
            <Menu ref="menu" :model="items" class="w-full md:w-15rem" :popup="true">
                <template #start>
                <span class="inline-flex align-items-center gap-1 px-2 py-2">
                </span>
            </template>
            <template #item="{ item, props }">
                <a v-ripple class="flex align-items-center" v-bind="props.action" @click="item.label === 'Logout' ? handleLogout() : null">
                    <span :class="item.icon" />
                    <span class="ml-2">{{ item.label }}</span>
                    <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
                    <span v-if="item.shortcut" class="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{{ item.shortcut }}</span>
                </a>
            </template>
            <template #end>
                <button @click="viewProfile" v-ripple class="relative overflow-hidden w-full p-link flex align-items-center p-2 pl-3 text-color hover:surface-200 border-noround">
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
</template>

<style lang="scss" scoped></style>
