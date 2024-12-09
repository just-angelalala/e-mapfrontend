<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import axios from "@/api/axios";
const products = ref([]);

const toast = useToast(); // Initialize the toast
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
};

const calculateTotalCost = (date) => {
    const total = products.value
        .filter(product => product.date === date)
        .reduce((acc, item) => acc + parseFloat(item.cost), 0);

    // Return the total formatted to 2 decimal places
    return total.toFixed(2);
};

const filterValueYear = ref(null);
const filterValueMonth = ref('all');

const monthOptions = [
    { label: 'All', value: 'all' },
    { label: 'January', value: '01' },
    { label: 'February', value: '02' },
    { label: 'March', value: '03' },
    { label: 'April', value: '04' },
    { label: 'May', value: '05' },
    { label: 'June', value: '06' },
    { label: 'July', value: '07' },
    { label: 'August', value: '08' },
    { label: 'September', value: '09' },
    { label: 'October', value: '10' },
    { label: 'November', value: '11' },
    { label: 'December', value: '12' }
];


const yearOptions = computed(() => {
    const years = [...new Set(products.value.map(product => new Date(product.date).getFullYear()))];
    return years.map(year => ({ label: year.toString(), value: year.toString() }));
});

const filteredProducts = computed(() => {
    return products.value.filter(product => {
        const date = new Date(product.date);
        const yearMatches = !filterValueYear.value || date.getFullYear().toString() === filterValueYear.value;
        const monthMatches = filterValueMonth.value === 'all' || (date.getMonth() + 1).toString().padStart(2, '0') === filterValueMonth.value;
        return yearMatches && monthMatches;
    });
});

const sortedProducts = computed(() => {
    return [...filteredProducts.value].sort((a, b) => new Date(a.date) - new Date(b.date));
});

const clearFilter = () => {
    filterValueYear.value = null;
    filterValueMonth.value = 'all';
};

import ProductService from '@/service/ProductService';
const productService = new ProductService();

onMounted(async () => {
    try {
        const data = await productService.fetchProductDetailsForSalesReport();
        products.value = data;
    } catch (error) {
        console.error('Error fetching product details:', error);
    }
});

const generateReport = async () => {

    try {
        // Make sure responseType is a part of the Axios request options, not the data
        const response = await axios.post('/ecommerce/generateSalesReportLatest', {
            year: filterValueYear.value,
            month: filterValueMonth.value,
        }, {
            responseType: 'blob' // Correctly place responseType here
        });

        // Create a URL for the blob and trigger a download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'SalesReport.xlsx'); // Filename for the downloaded report
        document.body.appendChild(link);
        link.click();

        // Clean up the URL object and remove the link from the DOM
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url); // Revoke the object URL to free up memory

        // Show success toast notification
        toast.add({ severity: 'success', summary: 'Success', detail: 'Report generated successfully!', life: 3000 });
    } catch (error) {
        console.error('Error generating report:', error);

        // Show error toast notification
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to generate report.', life: 3000 });
    }
};


</script>

<template>
    <div class="flex justify-content-between">
        <div class="filter-container">
            <Dropdown v-model="filterValueYear" :options="yearOptions" optionValue="value" optionLabel="label" placeholder="Select Year" />
            <Dropdown v-model="filterValueMonth" :options="monthOptions" optionValue="value" optionLabel="label" placeholder="Select Month" />
            <Button @click="clearFilter" severity="danger" icon="pi pi-filter-slash" label="Clear Filter" outlined></Button>
        </div>
        <div class="">
            <Button label="Print" icon="pi pi-print " class="p-button-success ml-4" @click="printPage" />
            <Button label="Export" icon="pi pi-download " class="p-button-help ml-4" @click="generateReport" />
        </div>
    </div>

    <div v-if="sortedProducts.length === 0" class="empty-message">
        No products available for the selected filter.
    </div>

    <DataTable 
        v-else
        :value="sortedProducts" 
        rowGroupMode="subheader" 
        groupRowsBy="date" 
        sortMode="single" 
        sortField="date" 
        :sortOrder="1" 
        scrollable 
        scrollHeight="600px" 
        tableStyle="min-width: 50rem"
    >
        <Column field="date" header="Date"></Column>
    
        <Column field="product" header="Product Name" style="min-width: 200px"></Column>
        <Column field="quantity" header="Quantity" style="min-width: 200px"></Column>
        <Column field="cost" header="Cost" style="min-width: 200px"></Column>
    
        <template #groupheader="slotProps">
            <div class="flex justify-center font-bold">
                {{ formatDate(slotProps.data.date) }}
            </div>
        </template>
    
        <template #groupfooter="slotProps">
            <div class="flex justify-end w-full font-bold">
                Total Cost: ₱ {{ calculateTotalCost(slotProps.data.date) }}
            </div>
        </template>
    </DataTable>
</template>

<style scoped>
.filter-container {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
}

.empty-message {
    text-align: center;
    font-weight: bold;
    margin-top: 2rem;
    color: #888;
}

.mb-4 {
    margin-bottom: 1rem;
}

.flex {
    display: flex;
}

.items-center {
    align-items: center;
}

.gap-4 {
    gap: 1rem;
}

.p-inputtext {
    margin-right: 1rem;
}

.mt-4 {
    margin-top: 1rem;
}

.font-bold {
    font-weight: bold;
}

.justify-end {
    justify-content: flex-end;
}

.justify-center {
    justify-content: center;
}
</style>
