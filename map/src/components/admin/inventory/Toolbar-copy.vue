<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import ProductService from '@/service/ProductService';
import { useToast } from 'primevue/usetoast';
import { useStore } from 'vuex';

const toast = useToast();
const store = useStore();

const products = ref(null);
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);

const productService = new ProductService();

const BASE_URL = import.meta.env.VITE_APP_BASE_URL_PHOTO;

onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    productService.getProducts().then((data) => (products.value = data));
});
const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const openNew = () => {
    product.value = {};
    submitted.value = false;
    store.dispatch('toggleProductDialog', true)
};

const openUpdateQuantity = () => {
    store.dispatch('toggleUpdateQuantityDialog', true)
};


const editProduct = (editProduct) => {
    store.commit('UPDATE_PRODUCT', editProduct);
    store.dispatch('toggleProductDialog', true);
};


const confirmDeleteProduct = (editProduct) => {
    product.value = editProduct;
    deleteProductDialog.value = true;
};

const deleteProduct = () => {
    products.value = products.value.filter((val) => val.id !== product.value.id);
    deleteProductDialog.value = false;
    product.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
};


const exportCSV = () => {
    dt.value.exportCSV();
};

const confirmDeleteSelected = () => {
    deleteProductsDialog.value = true;
};
const deleteSelectedProducts = () => {
    products.value = products.value.filter((val) => !selectedProducts.value.includes(val));
    deleteProductsDialog.value = false;
    selectedProducts.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};
</script>

<template>
<Toolbar class="mb-4">
    <template v-slot:start>
        <div class="my-2">
            <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
            <Button label="Delete" icon="pi pi-trash" class="p-button-danger mr-2" @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" />
            <Button label="Restock" icon="pi pi-plus" class="p-button-success" @click="openUpdateQuantity" />
        </div>
    </template>

    <template v-slot:end>
        <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
        <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
    </template>
</Toolbar>


<DataTable
    ref="dt"
    :value="products"
    v-model:selection="selectedProducts"
    dataKey="id"
    :paginator="true"
    :rows="10"
    :filters="filters"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    :rowsPerPageOptions="[5, 10, 25]"
    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
    responsiveLayout="scroll"
>
    <template #header>
        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 class="m-0">sdkvbsjhbdchj</h5>
            <span class="block mt-2 md:mt-0 p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="filters['global'].value" placeholder="Search..." />
            </span>
        </div>
    </template>

    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
    <Column field="code" header="Product ID" :sortable="true">
        <template #body="slotProps">
            <span class="p-column-title">Product ID</span>
            {{ slotProps.data.code }}
        </template>
    </Column>
    <Column field="name" header="Item Description" :sortable="true">
        <template #body="slotProps">
            <span class="p-column-title">Item Description</span>
            {{ slotProps.data.name }}
        </template>
    </Column>
    <Column field="name" header="Category" :sortable="true">
        <template #body="slotProps">
            <span class="p-column-title">Category</span>
            {{ slotProps.data.name }}
        </template>
    </Column>
    <Column header="Image">
        <template #body="slotProps">
            <span class="p-column-title">Image</span>
            <img 
            :src="`${BASE_URL}/${slotProps.data.photo}`"
            :alt="slotProps.data.photo" class="shadow-2" width="100" />
        </template>
    </Column>
    <Column field="price" header="Unit Cost" :sortable="true" headerStyle="width:14%; min-width:8rem;">
        <template #body="slotProps">
            <span class="p-column-title">Unit Cost</span>
            {{ formatCurrency(slotProps.data.price) }}
        </template>
    </Column>

    <Column field="rating" header="Quantity in Stock" :sortable="true">
        <template #body="slotProps">
            <span class="p-column-title">Quantity in Stock</span>
            {{ slotProps.data.quantity }}
        </template>
    </Column>

    <Column field="rating" header="Total Cost" :sortable="true">
        <template #body="slotProps">
            <span class="p-column-title">Total Cost</span>
            {{ slotProps.data.quantity }}
        </template>
    </Column>

    <Column field="rating" header="Total Inventory" :sortable="true">
        <template #body="slotProps">
            <span class="p-column-title">Total Inventory</span>
            {{ slotProps.data.quantity }}
        </template>
    </Column>
   
    <Column headerStyle="min-width:10rem;" header="Action">
        <template #body="slotProps">
            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editProduct(slotProps.data)" />
   
        </template>
    </Column>
</DataTable>




</template>

<style scoped>
    /* Your scoped styles here */
</style>