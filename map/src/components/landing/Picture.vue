<script setup>
import { ref } from "vue";
const responsiveOptions = ref([

    {
        breakpoint: '1400px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1
    },
    {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1
    }
]);

</script>

<template>
<div id="hero" class="flex flex-column pt-4 px-4 lg:px-8 overflow-hidden"
                style="background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(238, 239, 175) 0%, rgb(195, 227, 250) 100%); clip-path: ellipse(150% 87% at 93% 13%)">
    <div class="mx-4 md:mx-8 mt-0 md:mt-4">
        <Galleria :value="images" :responsiveOptions="responsiveOptions" :numVisible="5"
            containerStyle="max-width: 640px" :circular="true" :autoPlay="true" :transitionInterval="2000">
            <template #item="slotProps">
                <img :src="'https://global.toyota/pages/news/images/2021/08/02/1330/20210802_01_kv_w1920.jpg'" :alt="slotProps.item.alt"
                    style="width: 100%; display: block" />
            </template>
            <template #thumbnail="slotProps">
                <img :src="'https://global.toyota/pages/news/images/2021/08/02/1330/20210802_01_kv_w1920.jpg'" :alt="slotProps.item.alt"
                    style="display: block" />
            </template>
            
        </Galleria>
    </div>
    <div class="flex justify-content-center md:justify-content-end">
        <img src="/demo/images/landing/screen-4.png" alt="Hero Image" class="w-9 md:w-auto" />
    </div>
</div>
</template>

<style scoped>
    /* Your scoped styles here */
</style>