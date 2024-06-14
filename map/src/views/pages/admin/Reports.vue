<script setup>
import { ref, watch, computed } from 'vue';
import OrderServices from '@/service/OrderServices';
import moment from 'moment';

const reportType = ref('sales');
const dateType = ref('weekly');
const dateRange = ref(null);
const month = ref(null);
const year = ref(null);
const fileName = ref('');
const previewData = ref([]);
const isPreviewVisible = ref(false);

const columns = ref([]);
const orderService = new OrderServices();

const handlePreview = () => {
    let formattedYear = null;
    if (dateType.value === 'yearly' && year.value) {
        formattedYear = parseInt(moment(year.value).format('YYYY'), 10);
    } else if (dateType.value === 'monthly' && month.value) {
        formattedYear = parseInt(moment(month.value).format('YYYY'), 10);
        const formattedMonth = moment(month.value).format('MM');
        month.value = formattedMonth; // format month value to 'MM'
    } else if (dateType.value === 'weekly' && dateRange.value) {
        const formattedDateRange = dateRange.value.map(date => moment(date).format('YYYY-MM-DD'));
        dateRange.value = formattedDateRange;
    }

    const reportData = {
        reportType: reportType.value,
        dateType: dateType.value,
        dateRange: dateRange.value,
        month: month.value,
        year: formattedYear,
        fileName: fileName.value
    };

    orderService.previewReport(reportData).then(response => {
        const responseData = response;

        console.log(response);

        if (reportType.value === 'Product') {
            columns.value = [
                { field: 'ProductName', header: 'Product Name' },
                { field: 'UnitsSold', header: 'Units Sold' },
                { field: 'TotalSales', header: 'Total Sales' }
            ];
        }

        previewData.value = responseData;
        console.log(previewData.value);
        isPreviewVisible.value = true;
    }).catch(err => {
        console.error('Error previewing report:', err);
    });
};

const transformedData = computed(() => {
  const data = [];
  for (const [categoryName, months] of Object.entries(previewData.value)) {
    const rowData = { category_name: categoryName, ...months };
    data.push(rowData);
  }
  return data;
});

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const handleCancel = () => {
    // Reset all inputs
    reportType.value = 'sales';
    dateType.value = 'weekly';
    dateRange.value = null;
    month.value = null;
    year.value = null;
    fileName.value = '';
    isPreviewVisible.value = false;
};

watch(reportType, (newVal) => {
    if (newVal === 'Sales') {
        columns.value = [
            { field: 'category_name', header: 'Category Name' },
            ...months.map(month => ({ field: month.toLowerCase(), header: month }))
        ];
    } else if (newVal === 'Product') {
        columns.value = [
            { field: 'ProductName', header: 'Product Name' },
            { field: 'UnitsSold', header: 'Units Sold' },
            { field: 'TotalSales', header: 'Total Sales' }
        ];
    } else {
        columns.value = []; // Default or clear the columns
    }
});


const handleDownload = () => {
    let formattedYear = null;
    if (dateType.value === 'yearly' && year.value) {
        formattedYear = parseInt(moment(year.value).format('YYYY'), 10);
    } else if (dateType.value === 'monthly' && month.value) {
        formattedYear = parseInt(moment(month.value).format('YYYY'), 10);
        const formattedMonth = moment(month.value).format('MM');
        month.value = formattedMonth; // format month value to 'MM'
    } else if (dateType.value === 'weekly' && dateRange.value) {
        const formattedDateRange = dateRange.value.map(date => moment(date).format('YYYY-MM-DD'));
        dateRange.value = formattedDateRange;
    }
    const reportData = {
        reportType: reportType.value,
        dateType: dateType.value,
        dateRange: dateRange.value,
        month: month.value,
        year: formattedYear,
        fileName: fileName.value,
        format: 'excel'  // Ensure the format is set to 'excel'
    };

    orderService.downloadReport(reportData).then(() => {
        console.log('Report downloaded successfully');
    }).catch(err => {
        console.error('Error downloading report:', err);
    });
};

const handlePrint = () => {
    let formattedYear = null;
    if (dateType.value === 'yearly' && year.value) {
        formattedYear = parseInt(moment(year.value).format('YYYY'), 10);
    } else if (dateType.value === 'monthly' && month.value) {
        formattedYear = parseInt(moment(month.value).format('YYYY'), 10);
        const formattedMonth = moment(month.value).format('MM');
        month.value = formattedMonth;
    } else if (dateType.value === 'weekly' && dateRange.value) {
        const formattedDateRange = dateRange.value.map(date => moment(date).format('YYYY-MM-DD'));
        dateRange.value = formattedDateRange;
    }
    const reportData = {
        reportType: reportType.value,
        dateType: dateType.value,
        dateRange: dateRange.value,
        month: month.value,
        year: formattedYear,
        fileName: fileName.value,
        format: 'pdf'  // Set format to 'pdf' for printing
    };

    orderService.downloadReport(reportData).then(() => {
        console.log('Report displayed successfully');
    }).catch(err => {
        console.error('Error displaying report:', err);
    });
};

</script>

<template>
    <div class="card">
        <Splitter style="height: 35rem" class="mb-5">
            <SplitterPanel>
                <div class="p-fluid" style="padding: 2rem;">
                    <h3>Report Settings</h3>
                    <div class="field">
                        <label for="reportType">Report Type</label>
                        <Dropdown v-model="reportType" :options="[{ label: 'Sales' }, { label: 'Product' }]" optionLabel="label" optionValue="label" />
                    </div>
                    <div class="field">
                        <label>Date Type</label>
                        <div class="formgrid grid">
                            <div class="field-radiobutton col-12 md:col-4">
                                <RadioButton v-model="dateType" inputId="weekly" value="weekly" />
                                <label for="weekly">Weekly</label>
                            </div>
                            <div class="field-radiobutton col-12 md:col-4">
                                <RadioButton v-model="dateType" inputId="monthly" value="monthly" />
                                <label for="monthly">Monthly</label>
                            </div>
                            <div class="field-radiobutton col-12 md:col-4">
                                <RadioButton v-model="dateType" inputId="yearly" value="yearly" />
                                <label for="yearly">Yearly</label>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <label>Date Selection</label>
                        <div v-if="dateType === 'weekly'">
                            <Calendar v-model="dateRange" selectionMode="range" placeholder="Select Date Range" />
                        </div>
                        <div v-if="dateType === 'monthly'">
                            <Calendar v-model="month" view="month" dateFormat="mm/yy" placeholder="Select Month" />
                        </div>
                        <div v-if="dateType === 'yearly'">
                            <Calendar v-model="year" view="year" dateFormat="yy" placeholder="Select Year" />
                        </div>
                    </div>
                    <div class="field">
                        <label for="fileName">File Name</label>
                        <InputText v-model="fileName" placeholder="Enter File Name" />
                    </div>
                    <div class="field-buttons">
                        <Button label="Preview" icon="pi pi-search" class="mr-2" @click="handlePreview" />
                        <Button label="Cancel" icon="pi pi-times" class="p-button-secondary" @click="handleCancel" />
                    </div>
                </div>
            </SplitterPanel>

            <SplitterPanel>
                <div v-if="isPreviewVisible" class="p-fluid" style="padding: 2rem;">
                    <div class="header-buttons" style="display: flex; justify-content: space-between; align-items: center;">
                        <h3>Preview</h3>
                        <div class="flex">
                            <Button  icon="pi pi-print" class="p-button-secondary mr-2" @click="handlePrint" />
                            <Button icon="pi pi-download" class="p-button-secondary mr-2" @click="handleDownload" />
                        </div>
                    </div>
                    <div class="scrollable-table-container">
                        <DataTable v-show="reportType =='Product'" :value="previewData" scrollable scrollHeight="200px" class="p-datatable-striped">
                            <Column field="ProductName" header="Product Name"></Column>
                            <Column field="UnitsSold" header="Units Sold"></Column>
                            <Column field="TotalSales" header="Total Sales"></Column>
                        </DataTable>
                        <DataTable v-show="reportType === 'Sales'" :value="transformedData" scrollable scrollHeight="380px" class="p-datatable-striped">
                            <Column field="category_name" header="Category Name"></Column>
                            <Column v-for="month in months" :key="month" :field="month" :header="month"></Column>
                        </DataTable>
                    </div>
                </div>
                <div v-else class="p-fluid" style="padding: 2rem;">
                    <p>Select settings and click preview to view the report.</p>
                </div>
            </SplitterPanel>
        </Splitter>
    </div>
</template>


<style scoped>
.card {
    margin: 1rem;
}

.field {
    margin-bottom: 1.5rem;
}

.field-buttons {
    display: flex;
    justify-content: flex-start;
    gap: 1rem;
}

.header-buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.scrollable-table-container {
    max-width: 600px;
    overflow-y: auto;
}

.p-datatable-striped .p-datatable-tbody > tr:nth-child(odd) {
    background-color: #f9f9f9;
}

.p-fluid {
    padding: 2rem;
}
</style>
