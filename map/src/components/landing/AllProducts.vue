<script setup>
import { ref, onMounted, computed, watch, nextTick } from "vue";
import { useStore } from 'vuex';
import { FilterMatchMode } from 'primevue/api';
import ProductService from '@/service/ProductService';
import defaultProductImage from '@/assets/default/images.png'; 

import Footer from './Footer.vue'

const productService = new ProductService();
const BASE_URL = import.meta.env.VITE_APP_BASE_URL_PHOTO;

const store = useStore();
const products = ref([]);
const topProduct = ref([]);
const loading = ref(true);
const visible = ref(false);
const selectedProducts = ref([]);
const categoryFilter = ref('All');
const searchQuery = ref("");
const activeTab = ref({ title: 'All', filter: 'All' });

onMounted(() => {
    updateProducts(activeTab.value.filter);
});

async function updateProducts(categoryName) {
    loading.value = true;  // Set loading to true when the operation begins
    try {
        const productsPromise = productService.getAllProductsByCategory(categoryName);
        const topProductPromise = productService.getTopProductByCategoryEcommerce(categoryName);

        const responses = await Promise.all([productsPromise, topProductPromise]);
        products.value = responses[0]; // Assuming the response is directly the list of products
        topProduct.value = responses[1]; // Assuming the response is directly the top product object

        console.log('Products and Top Product loaded successfully');
    } catch (error) {
        console.error("Failed to fetch products:", error);
    } finally {
        loading.value = false;
    }
}


const responsiveOptions = ref([
    {
        breakpoint: '1400px',
        numVisible: 4,
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

const addToCart = () => {
    const cartItems = selectedProducts.value.map(p => {
        return {
            id: p.id,
            name: p.name,
            photo: p.photo,
            price: p.price,
            quantity: 1,
            remainingQuantity: p.quantity 
        };
    });
    store.dispatch('updateCart', cartItems);
    visible.value = false;
};


// TODO: disable cart to quantity with 0 (akin to)
const addProductToCart = (product) => {
    const cartItem = {
        id: product.id,
        name: product.name,
        photo: product.photo,
        price: product.price,
        quantity: 1, // Default quantity for the product added to the cart
        remainingQuantity: product.quantity // Remaining quantity of the product
    };
    store.dispatch('updateCart', [cartItem]); // Dispatching as an array of one item
};

const cancelSelection = () => {
    selectedProducts.value = [];
};

// Watch for changes in cart and update selected products
watch(() => store.state.cart, () => {
    updateSelectedProducts();
}, { deep: true });

const updateSelectedProducts = () => {
    const cartProductIds = store.state.cart.map(item => item.id);
    selectedProducts.value = products.value.filter(p => cartProductIds.includes(p.id));
};

const isProductInCart = (productId) => {
    return store.state.cart.some(item => item.id === productId);
};

watch(selectedProducts, (newSelectedProducts, oldSelectedProducts) => {
    // Determine which product was removed based on the difference between new and old selections
    const removedProduct = oldSelectedProducts.find(oldProduct => 
        !newSelectedProducts.some(newProduct => newProduct.id === oldProduct.id)
    );

    // If a product was removed, commit the mutation to remove it from the cart
    if (removedProduct) {
        store.commit('REMOVE_FROM_CART', removedProduct.id);
    }
}, { deep: true });

const filteredProducts = computed(() => {
    return products.value.filter(product => 
        product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});
const tabs = ref([
    { title: 'All', filter: 'All' },
    { title: 'Replacement Parts', filter: 'Replacement Parts' },
    { title: 'Tires and Wheels', filter: 'Tires and Wheels' },
    { title: 'Maintenance Supplies', filter: 'Maintenance Supplies' },
    { title: 'Lighting', filter: 'Lighting' },
    { title: 'Adhesives and Sealants', filter: 'Adhesives and Sealants' },
    { title: 'Parts and Accessories', filter: 'Parts and Accessories' },
    { title: 'Electrical Components', filter: 'Electrical Components' },
    { title: 'Tools and Equipment', filter: 'Tools and Equipment' },
    { title: 'Car Care Products', filter: 'Car Care Products' }
]);


const handleTabChange = (event) => {
    activeTab.value = tabs.value[event.index];
    updateProducts(activeTab.value.filter);
};

</script>
<template>
    <TabView :scrollable="true" @tab-change="handleTabChange">
        <TabPanel v-for="tab in tabs" :key="tab.title" :header="tab.title">
            <div v-if="loading">
                <Skeleton width="full" height="20rem" />
            </div>
            <div v-else>
                <h2>Top Products</h2>
                <div class="card position-relative">
                    <Carousel :value="topProduct" :numVisible="4" :numScroll="1" :responsiveOptions="responsiveOptions">
                        <template #item="slotProps">
                            <div class="border-1 surface-border border-round m-2 p-3">
                                <div class="mb-3">
                                    <div class="relative mx-auto">
                                        <img :src="slotProps.data.photo ? `${BASE_URL}/${slotProps.data.photo}` : defaultProductImage"
                                             :alt="slotProps.data.name || 'Default Product Image'"
                                             class="w-full border-round product-image" />
                                    </div>
                                </div>
                                <div class="mb-3 font-medium">{{ slotProps.data.name }}</div>
                                <div class="flex justify-content-between align-items-center">
                                    <div class="mt-0 font-semibold text-xl">Php {{ slotProps.data.price }}</div>
                                    <Button 
                                        icon="pi pi-shopping-cart" 
                                        class="ml-2" 
                                        @click="addProductToCart(slotProps.data)"
                                        :disabled="isProductInCart(slotProps.data.id)" />
                                </div>
                                <div class="mt-2">
                    <span class="font-semibold">Quantity Sold:</span> {{ slotProps.data.quantity_sold }}
                </div>
                            </div>
                        </template>
                    </Carousel>
                </div>
                <div class="flex justify-content-between">
                    <h2>All Products</h2>
                    <div>
                        <InputText v-model="searchQuery" placeholder="Search products..." />
                    </div>
                </div>
                <div class="card position-relative">
                    <Carousel :value="filteredProducts" :numVisible="4" :numScroll="1" :responsiveOptions="responsiveOptions">
                        <template #item="slotProps">
                            <div class="border-1 surface-border border-round m-2 p-3">
                                <div class="mb-3">
                                    <div class="relative mx-auto">
                                        <img :src="slotProps.data.photo ? `${BASE_URL}/${slotProps.data.photo}` : defaultProductImage"
                                             :alt="slotProps.data.name || 'Default Product Image'"
                                             class="w-full border-round product-image" />
                                    </div>
                                </div>
                                <div class="mb-3 font-medium">{{ slotProps.data.name }}</div>
                                <div class="flex justify-content-between align-items-center">
                                    <div class="mt-0 font-semibold text-xl">Php {{ slotProps.data.price }}</div>
                                    <Button 
                                        icon="pi pi-shopping-cart" 
                                        class="ml-2" 
                                        @click="addProductToCart(slotProps.data)"
                                        :disabled="isProductInCart(slotProps.data.id)" />
                                </div>
                            </div>
                        </template>
                    </Carousel>
                </div>
            </div>
        </TabPanel>
    </TabView>
    <Footer/>
    </template>

<style scoped>
.product-image {
    object-fit: cover; 
    height: 200px; 
}
.position-relative {
    position: relative;
}
</style>
    