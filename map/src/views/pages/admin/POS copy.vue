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
    <Toolbar style="margin-bottom: 10px;">
            <template #start>
                <Button label="All Products"  class="mr-2"  />
                <Button label="Car Parts"  class="mr-2"  />
                <Button label="Motor Parts"  class="mr-2"  />
                <Button label="Accessories"   />
                
            </template>

            <template #center>
                <IconField iconPosition="left" >
                    <InputIcon>
                        <i class="pi pi-search" />
                    </InputIcon>
                    <InputText placeholder="Search" />
                </IconField>
            </template>
        </Toolbar>

    <Splitter style="height: 410px">
        <SplitterPanel class="justify-content-center" :size="65" :minSize="10">
            
                <PickList v-model="products" listStyle="height:340px" dataKey="id" breakpoint="1400px" style="margin-top: 10px;">
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
          
        </SplitterPanel>

            <SplitterPanel class="justify-content-center" :size="35">

                    <DataTable :value="formattedCartItems">
                        <Column field="image" header="Image"></Column>
                        <Column field="name" header="Name"></Column>

                        <Column field="unitPriceFormatted" header="Unit Price"></Column>
                        <Column field="quantity" header="Quantity">
                            <template #body="slotProps">
                                <InputNumber v-model="slotProps.data.quantity" showButtons buttonLayout="horizontal" :min="0"
                                        :max="slotProps.data.remainingQuantity" @input="updateQuantity(slotProps.data)" />
                            </template>
                        </Column>
                        <Column field="totalPriceFormatted" header="Total Price"></Column>
                </DataTable>
                    <button @click="placedOrder" v-if="isCheckoutEnabled">Placed Order</button>
                
            </SplitterPanel>
        
    </Splitter>

</template>

<style scoped>
/* Add your styles here if needed */
</style>