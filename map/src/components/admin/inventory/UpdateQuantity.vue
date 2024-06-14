<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'primevue/usetoast';
import axios from '@/api/axios';

const toast = useToast();
const store = useStore();
const product = reactive({
    quantity: 0,
});
const productQuantityDialog = computed({
    get: () => store.state.updateQuantityDialog,
    set: (value) => store.dispatch('toggleUpdateQuantityDialog', value)
});

const BASE_URL = import.meta.env.VITE_APP_BASE_URL_PHOTO;

const hideDialog = () => {
    store.dispatch('toggleUpdateQuantityDialog', false);
};

const updateQuantity = async () => {
    try {
        const { quantity } = product;

        const response = await axios.patch('/inventory/updateProductQuantity', {
            product_id: selectedProduct.value.id,
            quantity,
        });

        console.log(response.data.message);
        await store.dispatch('products/fetchProducts')
        await store.dispatch('products/fetchLowStockProducts');
        hideDialog();
        toast.add({ severity: 'success', summary: 'Success', detail: 'Quantity updated successfully', life: 3000 });
    } catch (error) {
        handleUpdateQuantityError(error);
    }
};

const handleUpdateQuantityError = (error) => {
    if (error.response) {
        console.error('Failed to update quantity:', error.response.data.message);
    } else {
        console.error('Failed to update quantity:', error.message);
    }

    toast.add({ severity: 'danger', summary: 'Error', detail: 'Failed to update quantity', life: 3000 });
};


onMounted(async () => {
    await getAutoCompleteSuggestions();
});

const autoCompleteSuggestions = ref([]);

const getAutoCompleteSuggestions = async () => {
    try {
        const response = await axios.get("/inventory/getAutoCompleteSuggestions");
        autoCompleteSuggestions.value = response.data.productName;
    } catch (error) {
        console.error("Error fetching product suggestions:", error);
    }
};

const selectedProduct = ref();
const filteredProducts = ref([]);

const search = (event) => {
    setTimeout(() => {
        if (!event.query.trim().length) {
        filteredProducts.value = [...autoCompleteSuggestions.value];
        } else {
        filteredProducts.value = autoCompleteSuggestions.value.filter((product) => {
            return product.name.toLowerCase().startsWith(event.query.toLowerCase());
        });
        }
    }, 250);
};

</script>

<template>
    <Dialog v-model:visible="productQuantityDialog" :style="{ width: '450px' }" header="Product Details" :modal="true" class="p-fluid">
        <div class="formgrid grid">
            <div class="field col">
                <label for="code">PRODUCT/INVTY.CODE</label> 
                <AutoComplete v-model="selectedProduct" optionLabel="name" optionValue="id" dropdown :suggestions="filteredProducts" @complete="search">
                    <template #option="slotProps">
                        <div class="flex align-options-center">
                        <img v-if="slotProps.option.photo"
                            :alt="slotProps.option.name"
                            :src="`${BASE_URL}/${slotProps.option.photo}`"
                            :class="`product-image mr-2`"
                            style="width: 18px"
                        />
                        <div>{{ slotProps.option.name }}</div>
                        </div>
                    </template>
                </AutoComplete>
            </div>
        </div>
    
        <div class="formgrid grid">
            <div class="field col">
                <label for="quantity">QUANTITY</label>
                <InputNumber id="quantity" v-model="product.quantity" integeronly />
            </div>
        </div>
    
        <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
            <Button label="Restock" icon="pi pi-check" class="p-button-text" @click="updateQuantity" />
        </template>
    </Dialog>
</template>

<style scoped>
    /* Your scoped styles here */
</style>