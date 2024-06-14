<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'primevue/usetoast';
import axios from '@/api/axios';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const fullUrl = `${baseUrl}/inventory/uploadProductImage`;

const toast = useToast();
const store = useStore();
const product = computed(() => store.state.product);
const productDialog = computed({
    get: () => store.state.productDialog,
    set: (value) => store.dispatch('toggleProductDialog', value)
});

const isEditing = computed({
    get: () => store.state.isEditing,
    set: (value) => store.commit('TOGGLE_EDITING', value)
});

const categories = ref([]);

const filteredCategories = ref([]);

const searchCategory = (event) => {
    if (event.query.trim().length === 0) {
        filteredCategories.value = categories.value;
    } else {
        filteredCategories.value = categories.value.filter((category) => category.toLowerCase().includes(event.query.toLowerCase()));
    }
};




const hideDialog = () => {
    store.dispatch('toggleProductDialog', false);
    store.dispatch('resetProduct');
};

const onAdvancedUpload = (event) => {
    if (event.files && event.files.length > 0) {
        const uploadedFileName = event.files[0].name;
        store.commit('SET_PRODUCT_PHOTO', uploadedFileName);
        toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to upload file', life: 3000 });
    }
};


const saveProduct = async () => {
    try {
        const response = await axios.post('/inventory/addProduct', product.value);
        await store.dispatch('products/fetchProducts')
        await store.dispatch('products/fetchLowStockProducts');
        toast.add({severity: 'success', summary: 'Success', detail: response.data.message, life: 3000});
        hideDialog();
    } catch (error) {
        toast.add({severity: 'error', summary: 'Error', detail: error.response.data, life: 3000});
    }
};


const updateProduct = async () => {
    try {
        const url = `/inventory/updateProduct/${store.state.editingProductId}`;
        const response = await axios.put(url, product.value);
        await store.dispatch('products/fetchProducts')
        await store.dispatch('products/fetchLowStockProducts');
        toast.add({severity: 'success', summary: 'Success', detail: response.data.message, life: 3000});
        hideDialog();
    } catch (error) {
        toast.add({severity: 'error', summary: 'Error', detail: error.response.data.message, life: 3000});
    }
};

onMounted(async () => {
    await getAllCategories();
});

const getAllCategories = async () => {
    try {
        const response = await axios.get('/inventory/getAllCategories');
        categories.value = response.data.categories.map(category => category.name);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
};
</script>

<template>
    <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Product Details" :modal="true" class="p-fluid">
        <div class="formgrid grid">
            <div class="field col">
                <label for="name">Product Code</label>
                <InputText id="name" v-model="product.code" required autofocus />
            </div>
            <div class="field col">
                <label for="code">Product Name</label>
                <InputText id="code" v-model="product.name" required autofocus  />
            </div>
        </div>
        <div class="field">
            <label for="description">Item Description</label>
            <Textarea id="description" v-model="product.description" required rows="3" cols="20" />
        </div>
    
        <div class="formgrid grid">
            <div class="field col">
                <label for="inventorycategories" class="mb-3">Category</label>
                <AutoComplete id="inventorycategories" v-model="product.category" dropdown :suggestions="filteredCategories" @complete="searchCategory" placeholder="Select a Category" />
            </div>

        </div>
    
        <div class="formgrid grid">
            <div class="field col">
                <label for="price">Unit Cost</label>
                <InputNumber id="price" v-model="product.price" mode="currency" currency="Php" locale="en-PH" :required="true" />
            </div>
            <div class="field col">
                <label for="quantity">Quantity in Stock</label>
                <InputNumber id="quantity" v-model="product.quantity" integeronly />
            </div>
        </div>
        <div class="formgrid grid">
            <div class="field col">
                <label for="unit_of_measurement">Unit of Measurement</label>
            <InputText id="unit_of_measurement" v-model="product.unit_of_measurement"  />
            </div>
            <div class="field col">
                <label for="quantity">Ideal Count</label>
                <InputNumber id="quantity" v-model="product.ideal_count" integeronly />
            </div>
        </div>

        <div class="field">
            <label for="remarks">Remarks</label>
            <Textarea id="remarks" v-model="product.remarks" required rows="3" cols="20" />
        </div>
    
        <div class="field">
            <label for="photo">Photo</label>
            <Toast />
            <FileUpload name="demo[]" :url="fullUrl" @upload="onAdvancedUpload($event)" :multiple="true" accept="image/*" :maxFileSize="1000000">
                <template #empty>
                    <p>Drag and drop files to here to upload.</p>
                </template>
            </FileUpload>
        </div>
        
        
        <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
            <Button v-show="isEditing === false" label="Save" icon="pi pi-check" class="p-button-text" @click="saveProduct" />

            <!-- Update button (visible when editing) -->
            <Button v-show="isEditing === true" label="Update" icon="pi pi-check" class="p-button-text" @click="updateProduct" />
        </template>
    </Dialog>
</template>

<style scoped>
    /* Your scoped styles here */
</style>