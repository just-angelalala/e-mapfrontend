<script setup>
import PickList from 'primevue/picklist';
import { ref, onMounted } from 'vue';
import ProductService from '@/service/ProductService';

const productService = new ProductService();
const BASE_URL = import.meta.env.VITE_APP_BASE_URL_PHOTO;

const products = ref(null);
const isCheckoutEnabled = ref(false);

onMounted(async () => {
    try {
        const data = await productService.getProducts();
        products.value = [data, []];
    } catch (error) {
        console.error('Error fetching products:', error);
    }
});

const checkout = () => {
    // Add your checkout logic here
    console.log('Checkout button clicked!');
};
</script>

<template>
    <div class="card">
        <PickList v-model="products" listStyle="height:342px" dataKey="id" breakpoint="1400px">
            <template #sourceheader> Available </template>
            <template #targetheader> Selected </template>
            <template #item="slotProps">
                <div class="flex flex-wrap p-2 align-items-center gap-3">
                    <img class="w-4rem flex-shrink-0 border-round" :src="`${BASE_URL}/${slotProps.item.photo}`" :alt="slotProps.item.name" />
                    <div class="flex-1 flex flex-column gap-2">
                        <span class="font-bold">{{ slotProps.item.name }}</span>
                        <div class="flex align-items-center gap-2">
                            <i class="pi pi-tag text-sm"></i>
                            <span>{{ slotProps.item.category }}</span>
                        </div>
                    </div>
                    <span class="font-bold">$ {{ slotProps.item.price }}</span>
                </div>
            </template>
        </PickList>

        <!-- Checkout button -->
        <button @click="checkout" v-if="isCheckoutEnabled">Checkout</button>
    </div>
</template>

<style scoped>
/* Add your styles here if needed */
</style>