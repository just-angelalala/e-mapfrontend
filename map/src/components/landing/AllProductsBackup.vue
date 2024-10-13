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

onMounted( async () => {
   await updateProducts(activeTab.value.filter);
});

async function updateProducts(categoryName) {
    loading.value = true;  
    try {
        const productsPromise = productService.getAllProductsByCategory(categoryName);
        const topProductPromise = productService.getTopProductByCategoryEcommerce(categoryName);

        const responses = await Promise.all([productsPromise, topProductPromise]);
        products.value = responses[0]; 
        topProduct.value = responses[1];

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

const addProductToCart = (product) => {
    const cartItem = {
        id: product.id,
        name: product.name,
        photo: product.photo,
        price: product.price,
        quantity: 1,
        remainingQuantity: product.quantity 
    };
    store.dispatch('updateCart', [cartItem]); 
};

const cancelSelection = () => {
    selectedProducts.value = [];
};

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
    const removedProduct = oldSelectedProducts.find(oldProduct => 
        !newSelectedProducts.some(newProduct => newProduct.id === oldProduct.id)
    );

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

{
            "title": "All",
            "filter": "All"
        },
        {
            "title": "2T LUBRIGOLD",
            "filter": "2T LUBRIGOLD"
        },
        {
            "title": "ADBLUE",
            "filter": "ADBLUE"
        },
        {
            "title": "AEROPAK",
            "filter": "AEROPAK"
        },
        {
            "title": "AEROPAK SPRAY PAINT",
            "filter": "AEROPAK SPRAY PAINT"
        },
        {
            "title": "AISIN COOLANT",
            "filter": "AISIN COOLANT"
        },
        {
            "title": "AISIN REAR WIPER BLADE",
            "filter": "AISIN REAR WIPER BLADE"
        },
        {
            "title": "AMARON GO",
            "filter": "AMARON GO"
        },
        {
            "title": "AMARON HI-LIFE",
            "filter": "AMARON HI-LIFE"
        },
        {
            "title": "AMARON HI-WAY",
            "filter": "AMARON HI-WAY"
        },
        {
            "title": "AMARON PRO",
            "filter": "AMARON PRO"
        },
        {
            "title": "AMARON PRO BIKE",
            "filter": "AMARON PRO BIKE"
        },
        {
            "title": "AMARON PRO DIN SERIES",
            "filter": "AMARON PRO DIN SERIES"
        },
        {
            "title": "ARMOR ALL PROTECTANT",
            "filter": "ARMOR ALL PROTECTANT"
        },
        {
            "title": "BENDIX BRAKE FLUID DOT 4",
            "filter": "BENDIX BRAKE FLUID DOT 4"
        },
        {
            "title": "BESTDRIVE",
            "filter": "BESTDRIVE"
        },
        {
            "title": "BICYCLE TIRE",
            "filter": "BICYCLE TIRE"
        },
        {
            "title": "BICYCLE TUBE",
            "filter": "BICYCLE TUBE"
        },
        {
            "title": "BLAUPUNKT WIPER PREMIUM",
            "filter": "BLAUPUNKT WIPER PREMIUM"
        },
        {
            "title": "BLAUPUNKT WIPER VELOCITY",
            "filter": "BLAUPUNKT WIPER VELOCITY"
        },
        {
            "title": "BOOST COOLANT ",
            "filter": "BOOST COOLANT "
        },
        {
            "title": "BOSNY PAINT",
            "filter": "BOSNY PAINT"
        },
        {
            "title": "CALIFORNIA SCENTS",
            "filter": "CALIFORNIA SCENTS"
        },
        {
            "title": "CALTEX",
            "filter": "CALTEX"
        },
        {
            "title": "CASTROL",
            "filter": "CASTROL"
        },
        {
            "title": "CIRCUIT WIPER BLADE",
            "filter": "CIRCUIT WIPER BLADE"
        },
        {
            "title": "CIRCUIT WIPER BLADE AERO DYNAMIC",
            "filter": "CIRCUIT WIPER BLADE AERO DYNAMIC"
        },
        {
            "title": "CIRCUIT WIPER BLADE NEW MODEL 08-UP",
            "filter": "CIRCUIT WIPER BLADE NEW MODEL 08-UP"
        },
        {
            "title": "CORD CHEMICALS ",
            "filter": "CORD CHEMICALS "
        },
        {
            "title": "D822 TUBELESS",
            "filter": "D822 TUBELESS"
        },
        {
            "title": "D825 HEAVY DUTY TUBELESS",
            "filter": "D825 HEAVY DUTY TUBELESS"
        },
        {
            "title": "D829 HEAVY DUTY 6PR",
            "filter": "D829 HEAVY DUTY 6PR"
        },
        {
            "title": "D911 EDITION TUBELESS",
            "filter": "D911 EDITION TUBELESS"
        },
        {
            "title": "D971/D805 TUBELESS",
            "filter": "D971/D805 TUBELESS"
        },
        {
            "title": "D977 TUBE TYPE",
            "filter": "D977 TUBE TYPE"
        },
        {
            "title": "DEESTONE BANANA TYPE 6PLY",
            "filter": "DEESTONE BANANA TYPE 6PLY"
        },
        {
            "title": "DEESTONE D792/D781",
            "filter": "DEESTONE D792/D781"
        },
        {
            "title": "DEESTONE DRAGON TYPE 6PLY",
            "filter": "DEESTONE DRAGON TYPE 6PLY"
        },
        {
            "title": "DEESTONE FRONT",
            "filter": "DEESTONE FRONT"
        },
        {
            "title": "DEESTONE HI-PERFORMANCE",
            "filter": "DEESTONE HI-PERFORMANCE"
        },
        {
            "title": "DEESTONE LOW-PROFILE",
            "filter": "DEESTONE LOW-PROFILE"
        },
        {
            "title": "DEESTONE MEGA TYPE  6PLY",
            "filter": "DEESTONE MEGA TYPE  6PLY"
        },
        {
            "title": "DEESTONE MOTOCROSS",
            "filter": "DEESTONE MOTOCROSS"
        },
        {
            "title": "DEESTONE TUBE",
            "filter": "DEESTONE TUBE"
        },
        {
            "title": "DENSO/AISIN WIPER BLADE",
            "filter": "DENSO/AISIN WIPER BLADE"
        },
        {
            "title": "DEVCON EPOXY",
            "filter": "DEVCON EPOXY"
        },
        {
            "title": "ECO DRIVE DIESEL #40",
            "filter": "ECO DRIVE DIESEL #40"
        },
        {
            "title": "ENEOS MOTORCYCLE OIL",
            "filter": "ENEOS MOTORCYCLE OIL"
        },
        {
            "title": "ENEOS SCOOTER OIL",
            "filter": "ENEOS SCOOTER OIL"
        },
        {
            "title": "FLAMINGO CAR PARTS CARE",
            "filter": "FLAMINGO CAR PARTS CARE"
        },
        {
            "title": "FLAMINGO EXTERIOR CARE",
            "filter": "FLAMINGO EXTERIOR CARE"
        },
        {
            "title": "FLAMINGO INTERIOR CARE",
            "filter": "FLAMINGO INTERIOR CARE"
        },
        {
            "title": "FLAMINGO WHEELS AND TIRE CARE",
            "filter": "FLAMINGO WHEELS AND TIRE CARE"
        },
        {
            "title": "FLAP DONG-AH",
            "filter": "FLAP DONG-AH"
        },
        {
            "title": "FLAP R-STONE(KOREA)",
            "filter": "FLAP R-STONE(KOREA)"
        },
        {
            "title": "HARDEX GREY SILICON",
            "filter": "HARDEX GREY SILICON"
        },
        {
            "title": "HONDA IMPORTED",
            "filter": "HONDA IMPORTED"
        },
        {
            "title": "HONDA OIL",
            "filter": "HONDA OIL"
        },
        {
            "title": "HONDA OILS",
            "filter": "HONDA OILS"
        },
        {
            "title": "HUNTER TIIRES",
            "filter": "HUNTER TIIRES"
        },
        {
            "title": "HYUNDAI OILS",
            "filter": "HYUNDAI OILS"
        },
        {
            "title": "INCOE LOW MAINTENANCE",
            "filter": "INCOE LOW MAINTENANCE"
        },
        {
            "title": "INCOE MAINTENANCE FREE CAR SERIES VOLT",
            "filter": "INCOE MAINTENANCE FREE CAR SERIES VOLT"
        },
        {
            "title": "INCOE MAINTENANCE FREE DIN SERIES",
            "filter": "INCOE MAINTENANCE FREE DIN SERIES"
        },
        {
            "title": "INCOE MAINTENANCE FREE SUV SERIES SPARQ",
            "filter": "INCOE MAINTENANCE FREE SUV SERIES SPARQ"
        },
        {
            "title": "INCOE MAINTENANCE FREE TRUCK SERIES",
            "filter": "INCOE MAINTENANCE FREE TRUCK SERIES"
        },
        {
            "title": "ISUZU OILS",
            "filter": "ISUZU OILS"
        },
        {
            "title": "KAWASAKI OIL",
            "filter": "KAWASAKI OIL"
        },
        {
            "title": "LUBRIGOLD",
            "filter": "LUBRIGOLD"
        },
        {
            "title": "LUBRIGOLD GEAR OIL",
            "filter": "LUBRIGOLD GEAR OIL"
        },
        {
            "title": "LUBRIGOLD GREASE",
            "filter": "LUBRIGOLD GREASE"
        },
        {
            "title": "LUBRIGOLD POWER DRIVE 4T",
            "filter": "LUBRIGOLD POWER DRIVE 4T"
        },
        {
            "title": "LUBRIGOLD SYN. BRAKE COMPOUND",
            "filter": "LUBRIGOLD SYN. BRAKE COMPOUND"
        },
        {
            "title": "LUBRIGOLD SYNTHETIC GREASE",
            "filter": "LUBRIGOLD SYNTHETIC GREASE"
        },
        {
            "title": "MIGHTY BOND",
            "filter": "MIGHTY BOND"
        },
        {
            "title": "MITSUBISHI MOTOR OIL",
            "filter": "MITSUBISHI MOTOR OIL"
        },
        {
            "title": "MOBIL",
            "filter": "MOBIL"
        },
        {
            "title": "MOTOCRAFT FORD",
            "filter": "MOTOCRAFT FORD"
        },
        {
            "title": "MOTOTEK PEN.OIL",
            "filter": "MOTOTEK PEN.OIL"
        },
        {
            "title": "NIKKO",
            "filter": "NIKKO"
        },
        {
            "title": "NISSAN",
            "filter": "NISSAN"
        },
        {
            "title": "OUTSHIINE VIPER PROTECTANT",
            "filter": "OUTSHIINE VIPER PROTECTANT"
        },
        {
            "title": "PERTUA",
            "filter": "PERTUA"
        },
        {
            "title": "PETRON",
            "filter": "PETRON"
        },
        {
            "title": "PRESTONE FLUID",
            "filter": "PRESTONE FLUID"
        },
        {
            "title": "REPSOL",
            "filter": "REPSOL"
        },
        {
            "title": "SHELL",
            "filter": "SHELL"
        },
        {
            "title": "SILICON SILOCK",
            "filter": "SILICON SILOCK"
        },
        {
            "title": "SILICON SPARKO",
            "filter": "SILICON SPARKO"
        },
        {
            "title": "SILOCK SL 341 GASKET/LIQUID GASKET",
            "filter": "SILOCK SL 341 GASKET/LIQUID GASKET"
        },
        {
            "title": "STP",
            "filter": "STP"
        },
        {
            "title": "SUZUKI GENUINE OIL",
            "filter": "SUZUKI GENUINE OIL"
        },
        {
            "title": "SUZUKI OILS",
            "filter": "SUZUKI OILS"
        },
        {
            "title": "SYNGARD CVT FLUID ",
            "filter": "SYNGARD CVT FLUID "
        },
        {
            "title": "TOP 1 GREASE",
            "filter": "TOP 1 GREASE"
        },
        {
            "title": "TOYOTA COOLANT",
            "filter": "TOYOTA COOLANT"
        },
        {
            "title": "TOYOTA MOTOR OIL",
            "filter": "TOYOTA MOTOR OIL"
        },
        {
            "title": "TUBE MASTER",
            "filter": "TUBE MASTER"
        },
        {
            "title": "VESLEE",
            "filter": "VESLEE"
        },
        {
            "title": "VS1 PREOTECTOR",
            "filter": "VS1 PREOTECTOR"
        },
        {
            "title": "VS1 TIRE BLACK",
            "filter": "VS1 TIRE BLACK"
        },
        {
            "title": "WD-40",
            "filter": "WD-40"
        },
        {
            "title": "WEBBER",
            "filter": "WEBBER"
        },
        {
            "title": "WHIZ ATF DEXRON III",
            "filter": "WHIZ ATF DEXRON III"
        },
        {
            "title": "WHIZ BRAKE FLUID DOT 3",
            "filter": "WHIZ BRAKE FLUID DOT 3"
        },
        {
            "title": "WHIZ ECOMAX",
            "filter": "WHIZ ECOMAX"
        },
        {
            "title": "WHIZ OIL TREATMENT ",
            "filter": "WHIZ OIL TREATMENT "
        },
        {
            "title": "WHIZ PRO 100",
            "filter": "WHIZ PRO 100"
        },
        {
            "title": "WHIZ SYNTHETIC GREASE",
            "filter": "WHIZ SYNTHETIC GREASE"
        },
        {
            "title": "WUERTH BRAKE CLEANER",
            "filter": "WUERTH BRAKE CLEANER"
        },
        {
            "title": "YAMALUBE IMPORTED",
            "filter": "YAMALUBE IMPORTED"
        },
        {
            "title": "YUMALUBE",
            "filter": "YUMALUBE"
        }
]);

    const handleTabChange = (event) => {
        activeTab.value = tabs.value[event.index];
        updateProducts(activeTab.value.filter);
};

</script>
<template>
    <div class="px-8">

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
                    <Carousel :value="filteredProducts" :numVisible="4" :numScroll="1" :responsiveOptions="responsiveOptions" :showIndicators="false" >
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
    
