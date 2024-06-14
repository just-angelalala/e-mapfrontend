<script setup>
import { onMounted, reactive, ref, watch, computed } from 'vue';
import ProductService from '@/service/ProductService';
import { useLayout } from '@/layout/composables/layout';
import defaultProductImage from '@/assets/default/images.png'; 

const { isDarkTheme } = useLayout();

const BASE_URL = import.meta.env.VITE_APP_BASE_URL_PHOTO;

const products = ref(null);
const descriptiveAnalytics = ref([]);
const topProducts = ref([]); 
const lineData = reactive({
    labels: [],
    datasets: [
        {
            label: 'Online Sales',
            data: [],
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: 0.4
        },
        {
            label: 'Shop Sales',
            data: [],
            fill: false,
            backgroundColor: '#00bb7e',
            borderColor: '#00bb7e',
            tension: 0.4
        }
    ]
});

async function getMonthlySalesData() {
    try {
        const response = await productService.getMonthlySalesData();
        updateLineChartData(response);
    } catch (error) {
        console.error("Failed to fetch monthly sales data:", error);
    }
}

function updateLineChartData(salesData) {
    lineData.labels = salesData.map(item => new Date(item.day).toLocaleDateString());
    lineData.datasets[0].data = salesData.map(item => parseFloat(item.online_sales));
    lineData.datasets[1].data = salesData.map(item => parseFloat(item.shop_sales));
}

const items = ref([
    { label: 'By Quantity', icon: 'pi pi-sort-amount-down', command: () => { basis.value = 'quantity'; menuVisible.value = !menuVisible.value; }},
    { label: 'By Revenue', icon: 'pi pi-sort-amount-up-alt', command: () => { basis.value = 'revenue'; menuVisible.value = !menuVisible.value; }}
]);
const lineOptions = ref(null);
const productService = new ProductService();

const totalCustomers = computed(() => {
    return descriptiveAnalytics.value.reduce((sum, item) => sum + item.count, 0);
});

const barChartData = ref({
    labels: descriptiveAnalytics.value.map(item => item.province),
    datasets: [
        {
            label: 'Number of Customers',
            backgroundColor: '#42A5F5',
            data: [totalCustomers.value]
        }
    ]
});

const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                stepSize: 1 // Ensures that the scale increments in whole numbers
            }
        }
    },
    plugins: {
        legend: {
            display: true
        }
    }
};

const topBarChartData = computed(() => {
    let datasetLabel;
    let datasetData;

    if (basis.value === 'quantity') {
        datasetLabel = 'Total Quantity Sold';
        datasetData = topProducts.value.map(product => parseInt(product.total_quantity));
    } else if (basis.value === 'revenue') {
        datasetLabel = 'Total Revenue Generated';
        datasetData = topProducts.value.map(product => parseFloat(product.total_revenue));
    } else {
        // Handle other cases or default case
        datasetLabel = 'Data';
        datasetData = [];
    }

    return {
        labels: topProducts.value.map(product => product.name),
        datasets: [
            {
                label: datasetLabel,
                backgroundColor: '#42A5F5',
                data: datasetData
            }
        ]
    };
});




const topBarChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    indexAxis: 'y', // 'x' for vertical bars (default), 'y' for horizontal bars
    scales: {
        x: {
            beginAtZero: true,
            ticks: {
                stepSize: 1 // Adjust as needed for your data
            }
        },
        y: {
            // Adjust this section as needed; it might be empty if labels are not numerical
        }
    },
    plugins: {
        legend: {
            display: false
        }
    }
};



const orderCount = ref({
    totalOnlineOrders: 0,
    monthlyOnlineOrders: 0,
    totalShopOrders: 0,
    monthlyShopOrders: 0,
    averageSalesPerDay: 0,
    newAccountsThisMonth: 0
});

const basis = ref('quantity');  // Default basis

const fetchTopProducts = () => {
    productService.getTopProductByCategory(basis.value)
        .then(data => {
            topProducts.value = data;
        })
        .catch(error => {
            console.error('Failed to fetch top products:', error);
            topProducts.value = [];  // Handle error by resetting or providing fallback data
        });
};

watch(basis, () => {
    fetchTopProducts();
}, { immediate: true });  // Fetch immediately on basis change



onMounted(() => {
    fetchTopProducts();  
    getMonthlySalesData();
    productService.getProductsSmall().then((data) => (products.value = data));
    productService.getCustomerCountByProvince().then((data) => (descriptiveAnalytics.value = data));
    productService.getOrderCounts().then((data) => (orderCount.value = data));
    watch(descriptiveAnalytics, (newVal) => {
        barChartData.value.labels = newVal.map(item => item.city);
        barChartData.value.datasets[0].data = newVal.map(item => item.count);
    }, { deep: true });
});

const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const formatCurrencyOther = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};
const formatNumber = (value) => {
        return new Intl.NumberFormat().format(value);
}

const applyLightTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };
};

const applyDarkTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#ebedef'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            },
            y: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            }
        }
    };
};

watch(
    isDarkTheme,
    (val) => {
        if (val) {
            applyDarkTheme();
        } else {
            applyLightTheme();
        }
    },
    { immediate: true }
);

const menuVisible = ref(false);

const toggleMenu = () => {
    menuVisible.value = !menuVisible.value;
};

</script>

<template>
    <div class="grid">
        <div class="col-12 lg:col-6 xl:col-4">
        <div class="card mb-0">
            <div class="flex justify-content-between mb-3">
                <div>
                    <span class="block text-500 font-medium mb-3">Online Orders</span>
                    <div class="text-900 font-medium text-xl">{{ orderCount.totalOnlineOrders ? orderCount.totalOnlineOrders : 0 }}</div>
                </div>
                <div class="flex align-items-center justify-content-center bg-blue-100 border-round"
                    style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-shopping-cart text-blue-500 text-xl"></i>
                </div>
            </div>
            <!-- Corrected ternary expression: -->
            <span class="text-green-500 font-medium">{{ orderCount.monthlyOnlineOrders ? orderCount.monthlyOnlineOrders : 0 }} new </span>
            <span class="text-500">since last month</span>
        </div>
    </div>

        <div class="col-12 lg:col-6 xl:col-4">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Shop Orders</span>
                        <div class="text-900 font-medium text-xl">{{ orderCount.totalShopOrders ? orderCount.totalShopOrders : 0 }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-orange-100 border-round"
                        style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-map-marker text-orange-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">{{ orderCount.monthlyShopOrders ? orderCount.monthlyShopOrders : 0 }} new </span>
                <span class="text-500">since last month</span>
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-4">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Average Sales Per Day</span>
                        <div class="text-900 font-medium text-xl">{{ orderCount.averageSalesPerDay ? parseInt(orderCount.averageSalesPerDay) : 0 }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-cyan-100 border-round"
                        style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-inbox text-cyan-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">{{ orderCount.newAccountsThisMonth ? orderCount.newAccountsThisMonth : 0 }} </span>
                <span class="text-500"> newly registered</span>
            </div>
        </div>


        <div class="col-12 xl:col-6">
            <div class="card">
                <h5>Recent Sales</h5>
                <DataTable :value="products" :rows="5" :paginator="true" responsiveLayout="scroll">
                    <Column style="width: 15%">
                        <template #header> Image </template>
                        <template #body="slotProps">
                            <img :src="slotProps.data.photo ? `${BASE_URL}/${slotProps.data.photo}` : defaultProductImage" :alt="slotProps.data.image"
                                width="50" class="shadow-2" />
                        </template>
                    </Column>
                    <Column field="name" header="Name" :sortable="true" style="width: 35%"></Column>
                    <Column field="price" header="Price" :sortable="true" style="width: 35%">
                        <template #body="slotProps">
                            {{ formatCurrency(slotProps.data.price) }}
                        </template>
                    </Column>
                    <Column field="sold_quantity" header="Sold Quantity" :sortable="true" style="width: 35%"></Column>
                    <!-- <Column style="width: 15%">
                        <template #header> View </template>
                        <template #body>
                            <Button icon="pi pi-search" type="button" class="p-button-text"></Button>
                        </template>
                    </Column> -->
                </DataTable>
            </div>
            <div class="card">
                <div class="flex justify-content-between align-items-center mb-5">
                    <h5>Best Selling Products</h5>
                    <div>
                        <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded"
                            @click="$refs.menu2.toggle($event)"></Button>
                            <Menu :visible="menuVisible" @hide="menuVisible = false" ref="menu2" :model="items" :popup="true"></Menu>
                    </div>
                </div>
                <Chart type="bar" :data="topBarChartData" :options="topBarChartOptions" />
            </div>
        </div>
        <div class="col-12 xl:col-6">
            <div class="card">
                <h5>Sales Overview</h5>
                <Chart type="line" :data="lineData" :options="lineOptions" />
            </div>
            <div class="card">
                <div class="flex align-items-center justify-content-between mb-4">
                    <h5>Descriptive Analytics</h5>
                </div>
                    <Chart type="bar" :data="barChartData" :options="barChartOptions" />
            </div>
        </div>
    </div>
</template>
