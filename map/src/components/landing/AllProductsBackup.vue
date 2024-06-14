<script setup>
import { ref, onMounted, computed, watch, nextTick } from "vue";
import { useStore } from 'vuex';
import { FilterMatchMode } from 'primevue/api';
import ProductService from '@/service/ProductService';

import Footer from './Footer.vue'

const productService = new ProductService();
const BASE_URL = import.meta.env.VITE_APP_BASE_URL_PHOTO;

const store = useStore();
const products = ref([]);
const loading = ref(true);
const visible = ref(false);
const selectedProducts = ref([]);
const categoryFilter = ref('All');
const searchQuery = ref("");

onMounted(() => {
    productService.getProducts().then(data => {
        products.value = data;
        loading.value = false;
        updateSelectedProducts();
    });
});


// Compute unique categories for filtering
const uniqueCategories = computed(() => ['All', ...new Set(products.value.map(p => p.category_name))]);

const filteredProducts = computed(() => {
    return products.value.filter(p => {
        return (categoryFilter.value === 'All' || p.category_name === categoryFilter.value) &&
                p.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    });
});

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



const tabs = ref([
    { title: 'All', filter: 'All' },
    { title: 'Tires and Wheels', filter: 'Tires and Wheels' },
    { title: 'Accessories', filter: 'Accessories' },
    { title: 'Tools and Equipment', filter: 'Tools and Equipment' },
    { title: 'Fluids and Chemicals', filter: 'Fluids and Chemicals' },
    { title: 'Electronics and Audio', filter: 'Electronics and Audio' },
    { title: 'Safety and Security', filter: 'Safety and Security' },
    { title: 'Body and Exterior', filter: 'Body and Exterior' },
    { title: 'Interior and Upholstery', filter: 'Interior and Upholstery' },
    { title: 'Lighting', filter: 'Lighting' },
    { title: 'Maintenance Supplies', filter: 'Maintenance Supplies' }
]);

const activeTab = ref(tabs.value[0]);  // Defaults to the first tab, 'All'

// TODO: mabagal time complexity
const filteredProductsMain = computed(() => {
    console.log('Starting filter operation...');
    return products.value.filter(product => {
        return (activeTab.value.filter === 'All' || product.category_name === activeTab.value.filter);
    });
});

watch([activeTab, filteredProductsMain], () => {
    loading.value = true;
    nextTick().then(() => {
        loading.value = false;
        console.log('Filter operation completed.');
    });
}, { immediate: true });

const handleTabChange = (event) => {
    activeTab.value = tabs.value[event.index];
    console.log('Tab changed to:', activeTab.value.title);
};

</script>

<template>
    
<TabView :scrollable="true" @tab-change="handleTabChange">
    <TabPanel v-for="tab in tabs" :key="tab.title" :header="tab.title">
        <div v-if="loading">
            <Skeleton width="full" height="20rem">
            </Skeleton>
        </div>
        <div v-else>
            <div>
            <h2>Top Products</h2>
                <div class="card position-relative">
                <Carousel :value="filteredProductsMain" :numVisible="4" :numScroll="1" :responsiveOptions="responsiveOptions" >
                    <template #item="slotProps">
                        <div class="border-1 surface-border border-round m-2 p-3">
                            <div class="mb-3">
                                <div class="relative mx-auto">
                                    <img :src="`${BASE_URL}/${slotProps.data.photo}`" :alt="slotProps.data.photo"
                                        class="w-full border-round product-image" />
                                </div>
                            </div>
                            <div class="mb-3 font-medium">{{ slotProps.data.name }}</div>
                            <div class="flex justify-content-between align-items-center">
                                <div class="mt-0 font-semibold text-xl">Php {{ slotProps.data.price }}</div>
                                <span>
                                    <Button icon="pi pi-heart" severity="secondary" outlined />
                                    <Button 
                                        icon="pi pi-shopping-cart" 
                                        class="ml-2" 
                                        @click="addProductToCart(slotProps.data)"
                                        :disabled="isProductInCart(slotProps.data.id)" />
                                </span>
                            </div>
                        </div>
                    </template>
                </Carousel>
                </div>
            <h2>All Products</h2>
            <div class="card position-relative">
                <Carousel :value="filteredProductsMain" :numVisible="4" :numScroll="1" :responsiveOptions="responsiveOptions" >
                    <template #item="slotProps">
                        <div class="border-1 surface-border border-round m-2 p-3">
                            <div class="mb-3">
                                <div class="relative mx-auto">
                                    <img :src="`${BASE_URL}/${slotProps.data.photo}`" :alt="slotProps.data.photo"
                                        class="w-full border-round product-image" />
                                </div>
                            </div>
                            <div class="mb-3 font-medium">{{ slotProps.data.name }}</div>
                            <div class="flex justify-content-between align-items-center">
                                <div class="mt-0 font-semibold text-xl">Php {{ slotProps.data.price }}</div>
                                <span>
                                    <Button icon="pi pi-heart" severity="secondary" outlined />
                                    <Button 
                                        icon="pi pi-shopping-cart" 
                                        class="ml-2" 
                                        @click="addProductToCart(slotProps.data)"
                                        :disabled="isProductInCart(slotProps.data.id)" />
                                </span>
                            </div>
                        </div>
                    </template>
                </Carousel>
                <!-- Button at the lower bottom right -->
                <Button icon="pi pi-info-circle" class="p-button-rounded p-button-success p-button-outlined"
                        style="position: absolute; bottom: 0; right: 0; margin: 1rem;"
                        @click="visible = true" />

                <!-- Dialog component -->
                <Dialog v-model:visible="visible" modal header="Product Information" :style="{ width: '50rem' }">
                    <InputText v-model="searchQuery" placeholder="Search..." class="mb-3" />
                    <Dropdown v-model="categoryFilter" :options="uniqueCategories" placeholder="Select a Category" />
                    <DataTable :value="filteredProducts" selectionMode="multiple" dataKey="id" v-model:selection="selectedProducts" :loading="loading">
                        <Column selectionMode="multiple"></Column>
                        <Column field="name" header="Name"></Column>
                        <Column field="price" header="Price"></Column>
                        <Column field="quantity" header="Quantity"></Column>
                        <Column field="category_name" header="Category"></Column>
                        <!-- Additional columns -->
                    </DataTable>
                    <Button label="Add to Cart" @click="addToCart" class="p-button-success" />
                    <Button label="Cancel" @click="cancelSelection" class="p-button-secondary" />
                </Dialog>
            </div>
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

.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.8);
    font-size: 20px;
    font-weight: bold;
}
</style>
