<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useStore } from 'vuex';
import { FilterMatchMode } from 'primevue/api';
import ProductService from '@/service/ProductService';

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


</script>

<template>
    <h2>Top Products</h2>
    <div class="card position-relative">
    <Carousel :value="products" :numVisible="4" :numScroll="1" :responsiveOptions="responsiveOptions" >
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
    <Carousel :value="products" :numVisible="4" :numScroll="1" :responsiveOptions="responsiveOptions" >
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
<h3>Feedback</h3>
<div class="card">
      <Fieldset style="margin-bottom: 15px;">
          <template #legend>
              <div class="flex align-items-center pl-2">
                  <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle" />
                  <span class="font-bold">Amy Elsner</span>
              </div>
          </template>
          <p class="m-0">
            "Thrilled with my recent purchase of [specific automotive product]! Easy installation, top-notch quality, and it's transformed my driving experience. Highly recommend!"
          </p>
          <div class="= flex justify-content-center" style="margin-top: 15px;">
        <Rating v-model="value" readonly :cancel="false" />
    </div>
      </Fieldset>

      <Fieldset style="margin-bottom: 15px;">
          <template #legend>
              <div class="flex align-items-center pl-2">
                  <Avatar image="https://primefaces.org/cdn/primevue/images/organization/walter.jpg" shape="circle" />
                  <span class="font-bold">Walter</span>
              </div>
          </template>
          <p class="m-0">
            "Good product overall, but clearer installation instructions would be appreciated. Still, [specific automotive product] adds a valuable feature to my vehicle."
          </p>
          <div class="= flex justify-content-center" style="margin-top: 15px;">
        <Rating v-model="value" readonly :cancel="false" />
    </div>
      </Fieldset>
  </div>
  <div>
        <!-- footer starts here-->
        <div class="py-4 px-4 mx-0 mt-8 lg:mx-8">
                <div class="grid justify-content-between">
                    <div class="col-12 md:col-2" style="margin-top: -1.5rem">
                        <a @click="smoothScroll('#home')"
                            class="flex flex-wrap align-items-center justify-content-center md:justify-content-start md:mb-0 mb-3 cursor-pointer">
                            <img :src="logoUrl" alt="footer sections" width="50" height="50" class="mr-2" />
                            <h4 class="font-medium text-3xl text-900">MINDORO AUTO PARTS</h4>
                        </a>
                    </div>

                    <div class="col-12 md:col-10 lg:col-7">
                        <div class="grid text-center md:text-left">
                            <div class="col-12 md:col-3">
                                <h4 class="font-medium text-2xl line-height-3 mb-3 text-900">Company</h4>
                                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">About Us</a>
                                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">News</a>
                                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Investor Relations</a>
                                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Careers</a>
                                <a class="line-height-3 text-xl block cursor-pointer text-700">Media Kit</a>
                            </div>

                            <div class="col-12 md:col-3 mt-4 md:mt-0">
                                <h4 class="font-medium text-2xl line-height-3 mb-3 text-900">Resources</h4>
                                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Get Started</a>
                                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Learn</a>
                                <a class="line-height-3 text-xl block cursor-pointer text-700">Case Studies</a>
                            </div>

                            <div class="col-12 md:col-3 mt-4 md:mt-0">
                                <h4 class="font-medium text-2xl line-height-3 mb-3 text-900">Community</h4>
                                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Discord</a>
                                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Events<img
                                        src="/demo/images/landing/new-badge.svg" class="ml-2" /></a>
                                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">FAQ</a>
                                <a class="line-height-3 text-xl block cursor-pointer text-700">Blog</a>
                            </div>

                            <div class="col-12 md:col-3 mt-4 md:mt-0">
                                <h4 class="font-medium text-2xl line-height-3 mb-3 text-900">Legal</h4>
                                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Brand Policy</a>
                                <a class="line-height-3 text-xl block cursor-pointer mb-2 text-700">Privacy Policy</a>
                                <a class="line-height-3 text-xl block cursor-pointer text-700">Terms of Service</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
<!-- footer ends here-->
    </div>
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
