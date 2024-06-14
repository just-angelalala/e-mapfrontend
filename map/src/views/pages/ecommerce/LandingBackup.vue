<script setup>
import { ref, onMounted, computed } from "vue";
import AppConfig from '@/layout/AppConfig.vue';
import ProductService from '@/service/ProductService';


const productService = new ProductService();
const BASE_URL = import.meta.env.VITE_APP_BASE_URL_PHOTO;

const products = ref();
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

const getSeverity = (status) => {
    switch (status) {
        case 'INSTOCK':
            return 'success';

        case 'LOWSTOCK':
            return 'warning';

        case 'OUTOFSTOCK':
            return 'danger';

        default:
            return null;
    }
};

const smoothScroll = (id) => {
    document.querySelector(id).scrollIntoView({
        behavior: 'smooth'
    });
};

const position = ref('center');
const visible = ref(false);

const openPosition = (pos) => {
    position.value = pos;
    visible.value = true;
}

onMounted(() => {
    productService.getProducts().then((data) => (products.value = data));
})

</script>

<template>
    <div class="surface-0 flex justify-content-center">
        <div id="home" class="landing-wrapper overflow-hidden">
            <!-- wrapper starts here-->
            <div
                class="py-4 px-4 mx-0 md:mx-6 lg:mx-8 lg:px-8 flex align-items-center justify-content-between relative lg:static mb-3">
                <a class="flex align-items-center" href="#"> <img src="" alt="Sakai Logo" height="50"
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
                            <router-link to="/feedback" @click="smoothScroll('#hero')"
                                class="flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3 p-ripple" v-ripple>
                                <span>Feedback</span>
                            </router-link>
                        </li>
                    </ul>
                    <!--TODO: cart-->
                    <div
                        class="flex justify-content-between lg:block border-top-1 lg:border-top-none surface-border py-3 lg:py-0 mt-3 lg:mt-0">
                        <Button icon="pi pi-shopping-cart" @click="openPosition('topright')" />
                        <router-link :to="{ name: 'login' }">
                            <Button label="Login"
                                class="p-button-text p-button-rounded border-none font-light line-height-2 text-blue-500"></Button>
                        </router-link>
                        <router-link :to="{ name: 'register' }">
                            <Button label="Register"
                                class="p-button-rounded border-none ml-5 font-light text-white line-height-2 bg-blue-500"></Button>
                        </router-link>
                    </div>
                </div>
            </div>

            <Dialog v-model:visible="visible" header="CHECK OUT NOW!" :style="{ width: '50rem' }"
                :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" :position="position" :modal="true" :draggable="false">
                <template>
                    <DataTable :value="cartItems">
                        <Column field="name" header="Name"></Column>
                        <Column field="price" header="Price"></Column>
                        <Column field="quantity" header="Quantity">
                            <template #body="slotProps">
                                <InputText v-model="slotProps.data.quantity" />
                            </template>
                        </Column>
                        <Column>
                            <template #body="slotProps">
                                <Button icon="pi pi-times" @click="removeFromCart(slotProps.data.id)" />
                            </template>
                        </Column>
                    </DataTable>
                    <Button label="Checkout" @click="checkout" />
                </template>

                <template #footer>
                    <Button label="Checkout" icon="pi pi-check-square" @click="visible = false" text />

                </template>
            </Dialog>

            <!-- wrapper ends here-->

            <!-- video or image here-->
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
            <!-- video or image ends here-->


            <!-- products here -->

            <div class="card">
                <Carousel :value="products" :numVisible="3" :numScroll="1" :responsiveOptions="responsiveOptions" circular
                    :autoplayInterval="1000000">
                    <template #item="slotProps">
                        <div class="border-1 surface-border border-round m-2  p-3">
                            <div class="mb-3">
                                <div class="relative mx-auto">
                                    <img :src="`${BASE_URL}/${slotProps.data.photo}`" :alt="slotProps.data.photo"
                                        class="w-full border-round" />
                                    <Tag :value="slotProps.data.inventoryStatus"
                                        :severity="getSeverity(slotProps.data.inventoryStatus)" class="absolute"
                                        style="left:5px; top: 5px" />
                                </div>
                            </div>
                            <div class="mb-3 font-medium">{{ slotProps.data.name }}</div>
                            <div class="flex justify-content-between align-items-center">
                                <div class="mt-0 font-semibold text-xl">Php {{ slotProps.data.price }}</div>
                                <span>
                                    <Button icon="pi pi-heart" severity="secondary" outlined />
                                    <Button icon="pi pi-shopping-cart" class="ml-2" />
                                </span>
                            </div>
                        </div>
                    </template>
                </Carousel>
            </div>


            <div class="card">
                <Carousel :value="products" :numVisible="3" :numScroll="1" :responsiveOptions="responsiveOptions" circular
                    :autoplayInterval="1000000">
                    <template #item="slotProps">
                        <div class="border-1 surface-border border-round m-2  p-3">
                            <div class="mb-3">
                                <div class="relative mx-auto">
                                    <img :src="`${BASE_URL}/${slotProps.data.photo}`" :alt="slotProps.data.photo"
                                        class="w-full border-round" />
                                    <Tag :value="slotProps.data.inventoryStatus"
                                        :severity="getSeverity(slotProps.data.inventoryStatus)" class="absolute"
                                        style="left:5px; top: 5px" />
                                </div>
                            </div>
                            <div class="mb-3 font-medium">{{ slotProps.data.name }}</div>
                            <div class="flex justify-content-between align-items-center">
                                <div class="mt-0 font-semibold text-xl">Php {{ slotProps.data.price }}</div>
                                <span>
                                    <Button icon="pi pi-heart" severity="secondary" outlined />
                                    <Button icon="pi pi-shopping-cart" class="ml-2" />
                                </span>
                            </div>
                        </div>
                    </template>
                </Carousel>
            </div>

            <div class="card">
                <Carousel :value="products" :numVisible="3" :numScroll="1" :responsiveOptions="responsiveOptions" circular
                    :autoplayInterval="1000000">
                    <template #item="slotProps">
                        <div class="border-1 surface-border border-round m-2  p-3">
                            <div class="mb-3">
                                <div class="relative mx-auto">
                                    <img :src="`${BASE_URL}/${slotProps.data.photo}`" :alt="slotProps.data.photo"
                                        class="w-full border-round" />
                                    <Tag :value="slotProps.data.inventoryStatus"
                                        :severity="getSeverity(slotProps.data.inventoryStatus)" class="absolute"
                                        style="left:5px; top: 5px" />
                                </div>
                            </div>
                            <div class="mb-3 font-medium">{{ slotProps.data.name }}</div>
                            <div class="flex justify-content-between align-items-center">
                                <div class="mt-0 font-semibold text-xl">Php {{ slotProps.data.price }}</div>
                                <span>
                                    <Button icon="pi pi-heart" severity="secondary" outlined />
                                    <Button icon="pi pi-shopping-cart" class="ml-2" />
                                </span>
                            </div>
                        </div>
                    </template>
                </Carousel>
            </div>


            <!-- products ends here -->

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
    </div>
    <AppConfig simple />
</template>
