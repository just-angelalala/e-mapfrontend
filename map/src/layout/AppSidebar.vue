<script setup>
import { ref, computed } from 'vue';
import { useStore } from "vuex";

const store = useStore();

const accountType = computed(() => store.state.auth.accountType)

import AppMenu from './AppMenu.vue';
import AppMenuEmployee from './AppMenuEmployee.vue';
</script>

<template>
    <app-menu v-if="accountType == 'Owner'"></app-menu>
    <app-menu-employee v-else></app-menu-employee>
</template>

<style lang="scss" scoped></style>
