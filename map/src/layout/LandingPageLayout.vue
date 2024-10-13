<script setup>
import { computed } from 'vue'
import { useLayout } from '@/layout/composables/layout';
const { layoutConfig } = useLayout();
const logoUrl = computed(() => {
    return '/layout/images/logo-emap.jpg'
});
</script>

<template>
<div class="surface-0 flex justify-content-center">
        <div id="home" class="landing-wrapper overflow-hidden">
            <!-- wrapper starts here-->
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
                            <router-link to="/" @click="smoothScroll('#hero')"
                                class="flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3 p-ripple" v-ripple>
                                <span>Home</span>
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/orderTracker" @click="smoothScroll('#hero')"
                                class="flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3 p-ripple" v-ripple>
                                <span>Order Tracker</span>
                            </router-link>
                        </li>
                    </ul>
                    
                </div>
            </div>
    <router-view></router-view>

        </div>
    </div>
</template>

<style scoped>
    /* Your scoped styles here */
</style>