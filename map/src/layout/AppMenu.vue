<script setup>
import { ref, computed } from 'vue';
import { useStore } from "vuex";

const store = useStore();

const accountType = computed(() => store.state.auth.accountType)

// Owner or EMployee

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
{
    items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-chart-line', to: '/admin/dashboard' }],
},
{
    items: [{ label: 'Inventory Management', icon: 'pi pi-fw pi-truck', to: '/admin/inventory' }]
},
{
    items: [{ label: 'POS', icon: ' pi pi-fw pi-money-bill', to: '/admin/session' }]
},
{
    items: [{ label: 'Add Account', icon: 'pi pi-fw pi-user-plus', to: '/admin/addAccount' }]
},
{
    items: [{ label: 'Sales Report', icon: 'pi pi-fw pi-user-plus', to: '/admin/reports' }]
},
{
    items: [{ label: 'Online Customer', icon: 'pi pi-fw pi-users', to: '/admin/onlineCustomer' }]
}
]);

</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
