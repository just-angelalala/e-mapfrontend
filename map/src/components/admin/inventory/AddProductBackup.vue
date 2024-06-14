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

const categories = ref([]);


const hideDialog = () => {
    store.dispatch('toggleProductDialog', false);
    store.dispatch('resetProduct');
};

const onAdvancedUpload = (event) => {
    // Assuming the response contains the filenames in 'files'
    if (event.files && event.files.length > 0) {
        const uploadedFileName = event.files[0].name; // Taking the first file's name
        store.commit('SET_PRODUCT_PHOTO', uploadedFileName); // Update the photo property with the filename
        toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
    } else {
        // Handle the case where no files are returned or an error occurred
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to upload file', life: 3000 });
    }
};


const saveProduct = async () => {
    try {
        const response = await axios.post('/inventory/addProduct', product.value);
        toast.add({severity: 'success', summary: 'Success', detail: response.data, life: 3000});
        hideDialog();
    } catch (error) {
        toast.add({severity: 'error', summary: 'Error', detail: error.response.data, life: 3000});
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
        <div class="my-2" style="display: flex; align-items: center;">
            <Button label="Category" icon="pi pi-plus" class="p-button-success mr-2" @click="addCategory" style="width: 200px;" />
            <InputText id="name" v-model="product.name" required autofocus style="width: 100%;" />
        </div>
        <div class="formgrid grid">
            <div class="field col">
                <label for="name">Product/INVTY.CODE</label>
                <InputText id="name" v-model="product.name" required autofocus />
            </div>
            <div class="field col">
                <label for="code">Unit of Measurement</label>
                <InputText id="code" v-model="product.code" required autofocus  />
            </div>
        </div>
        <div class="field">
            <label for="description">Item Description</label>
            <Textarea id="description" v-model="product.description" required rows="3" cols="20" />
        </div>
    
        <div class="formgrid grid">
            <div class="field col">
                <label for="inventorycategories" class="mb-3">Category</label>
                <Dropdown id="inventorycategories" v-model="product.category" :options="categories" placeholder="Select a Category" />
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
                <label for="quantity">Total Cost</label>
                <InputNumber id="quantity" v-model="product.quantity" integeronly />
            </div>
            <div class="field col">
                <label for="quantity">Total Inventory</label>
                <InputNumber id="quantity" v-model="product.quantity" integeronly />
            </div>
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
            <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveProduct" />
        </template>
    </Dialog>
</template>

<style scoped>
    /* Your scoped styles here */
</style>