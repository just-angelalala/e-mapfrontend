<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, computed, watch } from 'vue';
import ProductService from '@/service/ProductService';
import { useToast } from 'primevue/usetoast';
import { useStore } from 'vuex';

const toast = useToast();
const store = useStore();

const products = computed(() => store.state.products.products);
const lowStockProducts = computed(() => store.state.products.lowStockProducts);
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const restoreProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref([]);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const isLoading = ref(false)

const productService = new ProductService();

const BASE_URL = import.meta.env.VITE_APP_BASE_URL_PHOTO;

const items = [
    {
        label: 'Export as Excel',
        icon: 'pi pi-file-excel',
        command: () => {
            exportCSV('xlsx');
        }
    },
    {
        label: 'Export as PDF',
        icon: 'pi pi-file-pdf',
        command: () => {
            exportCSV('pdf');
        }
    }
];

onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    store.dispatch('products/fetchProducts')
    store.dispatch('products/fetchLowStockProducts')
});
const formatCurrency = (value) => {
    // Check for null or undefined values first
    if (value === null || value === undefined || value === '') return 'N/A';

    // Attempt to convert the string to a number
    const numberValue = parseFloat(value);

    // Check if the conversion was successful
    if (isNaN(numberValue)) return 'Invalid Price';

    // Format the number as Philippine Peso currency
    return numberValue.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' });
};



const openNew = () => {
    store.commit('CLEAR_PRODUCT');
    submitted.value = false;
    store.dispatch('toggleProductDialog', true)
};

const openUpdateQuantity = () => {
    store.dispatch('toggleUpdateQuantityDialog', true)
};


const editProduct = (editProduct) => {
    store.commit('UPDATE_PRODUCT', editProduct);
    store.commit('TOGGLE_EDITING', true);
    store.commit('SET_EDITING_PRODUCT_ID', editProduct.id);
    store.dispatch('toggleProductDialog', true);
};

console.log(lowStockProducts.value);


const exportCSV = async (format) => {
    isLoading.value = true;
    toast.add({
        severity: "success",
        summary: "Exporting inventory...",
        detail: "Your excel report is being processed. Please wait",
        life: 3000,
    });
    try {
        // Assuming productService has a method that accepts format
        await productService.downloadReport(format);
    } catch (err) {
        console.error('Error downloading report:', err);
    } finally {
        isLoading.value = false;
    }
};


const confirmDeleteSelected = () => {
    deleteProductsDialog.value = true;
};
const deleteSelectedProducts = async () => {
    // Extract the IDs from the selected products
    const productIds = selectedProducts.value.map(product => product.id);

    try {
        // Make an API call to delete the products by their IDs
        // Assuming you have a method in your service to handle the deletion
        await productService.deleteProductsByIds(productIds);

        // Dispatch the action to refresh the products list
        await store.dispatch('products/fetchProducts');
        await store.dispatch('products/fetchLowStockProducts');

        // Close the delete products dialog
        deleteProductsDialog.value = false;

        // Show success message
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });

        // Refresh your product list or perform other UI updates as needed
    } catch (error) {
        // Handle any errors, such as showing an error message to the user
        console.error('Error deleting products:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete products', life: 3000 });
    }
};


const restoreSelected = () => {
    restoreProductsDialog.value = true;
};

const restoreSelectedProducts = async () => {
    // Extract IDs from selected products
    const productIds = selectedProducts.value.map(product => product.id);

    try {
        await productService.restoreProductsByIds(productIds);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Restored', life: 3000 });
        await store.dispatch('products/fetchProducts');
        await store.dispatch('products/fetchLowStockProducts');
        restoreProductsDialog.value = false; // Assuming this is intended to close a dialog
    } catch (error) {
        console.error('Error restoring products:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error restoring products', life: 3000 });
    }
};





const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        stockStatus: { value: null, matchMode: FilterMatchMode.EQUALS }
    };
};

const getStockSeverity = (product) => {
    const quantity = parseInt(product.quantity, 10);
    const idealCount = parseInt(product.ideal_count, 10);
    if (quantity === 0) {
        return 'danger'; // No stock
    } else if (quantity < idealCount) {
        return 'warning'; // Low stock
    } else {
        return 'success'; // Sufficient stock
    }
};

const getStockStatusText = (product) => {
    const quantity = parseInt(product.quantity, 10);
    const idealCount = parseInt(product.ideal_count, 10);
    if (quantity === 0) {
        return 'No Stock';
    } else if (quantity < idealCount) {
        return 'Low';
    } else {
        return 'Normal';
    }
};

// Initial dropdown options
const dropdownOptions = [
    { name: 'All', value: 'all' },
    { name: 'Active', value: 'active' },
    { name: 'Archived', value: 'archived' }
];

// Defaulting the dropdown to 'All'
const selectedOption = ref(dropdownOptions[0]);

// Computed property to filter products based on the dropdown selection
const filteredData = computed(() => {
    switch (selectedOption.value.value) {
        case 'active':
            return products.value.filter(product => product.deleted_at === null);
        case 'archived':
            return products.value.filter(product => product.deleted_at !== null);
        default:
            return products.value;
    }
});

const anyArchived = computed(() => {
    const result = selectedProducts.value.some(product => product.deleted_at !== null);
    console.log('Any Archived:', result);
    return result;
});

const anyActive = computed(() => {
    const result = selectedProducts.value.some(product => product.deleted_at === null);
    return result;
});

const deleteButtonDisabled = computed(() => {
    // Disable if no products are selected or if any selected product is active
    return !selectedProducts.value.length || anyArchived.value;
});

// Computed property to determine if the Restore button should be disabled
const restoreButtonDisabled = computed(() => {
    // Disable if no products are selected or if any selected product is active
    return !selectedProducts.value.length || anyActive.value;
});


watch(lowStockProducts, (newVal, oldVal) => {
    if (newVal.length > 0 && newVal !== oldVal) {
        toast.add({
            severity: 'warn',
            summary: 'Low Stock Alert',
            detail: 'Some products are running low on stock.',
            life: 3000
        });
    }
});

</script>

<template>
    <Toolbar class="mb-4">
        <template v-slot:start>
            <div class="my-2">
                <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                <Button label="Delete" icon="pi pi-trash" class="p-button-danger mr-2" @click="confirmDeleteSelected"
                    :disabled="deleteButtonDisabled" />
                <Button label="Restore" icon="pi pi-refresh" class="p-button-info mr-2" @click="restoreSelected"
                    :disabled="restoreButtonDisabled" />
                <Button label="Restock" icon="pi pi-plus" class="p-button-success mr-2" @click="openUpdateQuantity" />
                <Dropdown :options="dropdownOptions" v-model="selectedOption" optionLabel="name"
                    placeholder="Select Status" @change="onDropdownChange" />
            </div>
            
        </template>

        <template v-slot:end>
            <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import"
                class="mr-2 inline-block" />
                <SplitButton 
                    :model="items" 
                    :loading="isLoading" 
                    label="Export" 
                    icon="pi pi-upload" 
                    class="p-button-help"
                />
        </template>
    </Toolbar>

    <DataTable ref="lowStockProducts" :value="lowStockProducts">
        <h5> Low Stock</h5>
        <Column field="name" header="Name" :sortable="true">
            <template #body="slotProps">
                <span class="p-column-title">Name</span>
                {{ slotProps.data.name }}
            </template>
        </Column>

        <Column field="description" header="Description" :sortable="true">
            <template #body="slotProps">
                <span class="p-column-title">Description</span>
                {{ slotProps.data.description }}
            </template>
        </Column>

        <Column header="Stock Details" :sortable="false">
            <template #body="slotProps">
                <span class="p-column-title">Stock Details</span>
                {{ slotProps.data.quantity }} {{ slotProps.data.unit_of_measurement }}
            </template>
        </Column>

    </DataTable>

    <DataTable ref="dt" :value="filteredData" v-model:selection="selectedProducts" dataKey="id" :paginator="true"
        :rows="10" :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" responsiveLayout="scroll">
        <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                <h5 class="m-0">Manage Products</h5>
                <span class="block mt-2 md:mt-0 p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText v-model="filters['global'].value" placeholder="Search..." />
                </span>
            </div>
        </template>

        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
        <Column header="Image">
            <template #body="slotProps">
                <span class="p-column-title">Image</span>
                <img v-if="slotProps.data.photo" :src="`${BASE_URL}/${slotProps.data.photo}`" :alt="slotProps.data.name"
                    class="shadow-2" width="100" />
                <div v-else class="placeholder-image">No Image</div>
            </template>
        </Column>
        <Column field="code" header="Code" :sortable="true">
            <template #body="slotProps">
                <span class="p-column-title">Code</span>
                {{ slotProps.data.code ?? 'No code provided' }}
            </template>
        </Column>
        <Column field="name" header="Name" :sortable="true">
            <template #body="slotProps">
                <span class="p-column-title">Name</span>
                {{ slotProps.data.name }}
            </template>
        </Column>
        <Column field="description" header="Description" :sortable="true">
            <template #body="slotProps">
                <span class="p-column-title">Description</span>
                {{ slotProps.data.description }}
            </template>
        </Column>
        <Column field="price" header="Unit Cost" :sortable="true" headerStyle="width:14%; min-width:8rem;">
            <template #body="slotProps">
                <span class="p-column-title">Unit Cost</span>
                {{ formatCurrency(slotProps.data.price) }}
            </template>
        </Column>

        <Column field="quantity" header="Stock Details" :sortable="true" >
            <template #body="slotProps">
                <span class="p-column-title">Stock Details</span>
                {{ slotProps.data.quantity }} {{ slotProps.data.unit_of_measurement }}
            </template>
        </Column>


        <Column field="remarks" header="Remarks" :sortable="true">
            <template #body="slotProps">
                <span class="p-column-title">Total Inventory</span>
                {{ slotProps.data.remarks ?? 'No remarks provided' }}
            </template>
        </Column>

        <Column header="Stock Status">
            <template #body="slotProps">
                <Tag :value="getStockStatusText(slotProps.data)" :severity="getStockSeverity(slotProps.data)" />
            </template>
            <template #filter>
                <Dropdown v-model="filters.value.stockStatus" :options="stockStatusOptions" optionLabel="name"
                    placeholder="Select Status" class="p-column-filter" showClear />
            </template>
        </Column>

        <Column headerStyle="min-width:10rem;" header="Action">
            <template #body="slotProps">
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
                    @click="editProduct(slotProps.data)" />

            </template>
        </Column>


    </DataTable>


    <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="product">Are you sure you want to delete the selected products?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="deleteProductsDialog = false" />
            <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedProducts" />
        </template>
    </Dialog>

    <Dialog v-model:visible="restoreProductsDialog" :style="{ width: '450px' }" header="Confirm Restoration"
        :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-question-circle mr-3" style="font-size: 2rem"></i>
            <span>Are you sure you want to restore the selected products?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="restoreProductsDialog = false" />
            <Button label="Yes" icon="pi pi-check" text @click="restoreSelectedProducts" />
        </template>
    </Dialog>

</template>

<style scoped>
/* Your scoped styles here */
</style>