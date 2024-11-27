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

import OrderServices from '@/service/OrderServices';

const orderServices = new OrderServices();

const orders = ref([])

onMounted( async () => {
    bindOutsideClickListener();
    fetchUserInfo()
    await store.dispatch('products/fetchLowStockProducts');
    const response = await orderServices.getOrdersWithDetails();
    orders.value = response.data;

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

const isVisible = ref(false)

const lowStockProducts = computed(() => store.state.products.lowStockProducts);

const lowStockMessages = computed(() =>
  lowStockProducts.value
    .filter(product => Number(product.quantity) < Number(product.ideal_count))
    .map(product => ({
      type: 'lowStock',
      message: `${product.name} stock is running low.`,
      details: `Available: ${product.quantity} ${product.unit_of_measurement} (Ideal: ${product.ideal_count})`,
    }))
);

// Computed: Pending Orders Notifications
const pendingOrderMessages = computed(() =>
  orders.value
    .filter(order => order.status === 'Pending')
    .map(order => ({
      type: 'pendingOrder',
      message: `Order #${order.order_id} is pending.`,
      details: `Customer: ${order.customer.first_name} ${order.customer.last_name}\nOrder Date: ${new Date(order.order_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}`,
    }))
);



// Combine Notifications
const combinedNotifications = computed(() => [
  ...lowStockMessages.value,
  ...pendingOrderMessages.value,
]);

const openNotification = () => {
    isVisible.value = true

    console.log(lowStockProducts.value);
}

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
            <button @click="openNotification()" class="p-link layout-topbar-button">
                <i class="pi pi-bell"></i>
                <span>Notifications</span>
                <span v-if="combinedNotifications.length" class="badge">
                {{ combinedNotifications.length }}
                </span>
            </button>
            <Avatar 
        :image="userInfo.photo ? `${BASE_URL}${userInfo.photo}` : 'https://img.icons8.com/?size=100&id=13042&format=png&color=000000'" 
        class="mr-2 ml-5 cursor-pointer" 
        shape="circle" 
        @click="toggle" 
        aria-haspopup="true" 
        aria-controls="overlay_menu" 
        size="large"
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

    <Dialog v-model:visible="isVisible" maximizable header="Notifications" :style="{ width: '30rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" position="topright" :modal="false" :draggable="false">
        <div v-if="combinedNotifications.length" class="notification-container">
      <div
        v-for="(notification, index) in combinedNotifications"
        :key="index"
        class="notification-item"
      >
        <i
          :class="notification.type === 'lowStock' ? 'pi pi-exclamation-circle' : 'pi pi-clock'"
          class="notification-icon"
        ></i>
        <div class="notification-text">
          <strong>{{ notification.message }}</strong>
          <p class="notification-details">{{ notification.details }}</p>
        </div>
      </div>
    </div>
    <!-- No Notifications (Empty State) -->
    <div v-else class="notification-empty">
      <i class="pi pi-check-circle notification-empty-icon"></i>
      <p>No notifications at the moment.</p>
    </div>

    </Dialog>
</template>

<style lang="scss" scoped>
/* Notification Container */
.notification-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Individual Notification */
.notification-item {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.notification-icon {
  font-size: 1.5rem;
  color: #f39c12; /* Warning Color */
  margin-right: 1rem;
}

.notification-text {
  flex-grow: 1;
}

.notification-details {
  color: #666;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* Empty State */
.notification-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.5rem;
  text-align: center;
  color: #6c757d;
}

.notification-empty-icon {
  font-size: 2rem;
  color: #28a745; /* Success Color */
}

/* Button Styling */
.btn-primary {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.layout-topbar-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem;
}

.layout-topbar-button i {
  font-size: 1.5rem;
}

.layout-topbar-button .badge {
  position: absolute;
  top: 4px; /* Adjust closer to the bell icon */
  right: 4px; /* Adjust closer horizontally */
  background-color: #f39c12; /* Warning Color */
  color: #fff;
  font-size: 0.75rem;
  font-weight: bold;
  border-radius: 50%;
  width: 1.25rem; /* Slightly smaller badge */
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Subtle shadow for depth */
}
.layout-topbar-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem;
}

.layout-topbar-button i {
  font-size: 1.5rem;
}

.layout-topbar-button .badge {
  position: absolute;
  top: 2px; /* Adjust closer to the bell icon */
  right: 2px; /* Adjust closer horizontally */
  background-color: #f39c12; /* Warning Color */
  color: #fff;
  font-size: 0.75rem;
  font-weight: bold;
  border-radius: 50%;
  width: 1.25rem; /* Slightly smaller badge */
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Subtle shadow for depth */
}




</style>
