<script setup>
import { ref, onMounted, computed } from 'vue';
import OrderServices from '@/service/OrderServices';
import PrimeVue from 'primevue/config';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const visible = ref(false);
const actionVisible = ref(false);
const customerInfoVisible = ref(false);
const editingOrder = ref({});  // Initialized to an empty object for safe property access
const orders = ref([]);
const feedbackVisible = ref(false);

const orderServices = new OrderServices();


const BASE_URL = import.meta.env.VITE_APP_BASE_URL_RECEIPT;

const fetchOrders = async () => {
  try {
    await orderServices.updateOrderStatusIfNotPickedUp();
    const response = await orderServices.getOrdersWithDetails();
    orders.value = response.data;
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    toast.error('Failed to fetch orders.');
  }
};

onMounted(fetchOrders);

const viewOrderDetails = (order) => {
  if (order) {
    editingOrder.value = { ...order };
    console.log("pohto", editingOrder.value)
    visible.value = true;
  } else {
    console.error('Attempted to edit an undefined order.');
    toast.error('Error: Order data is missing.');
  }
};

const toggleCustomerInfoVisible = (order) => {
  console.log(order.customer)
  if (order && order.customer) {
    editingOrder.value = {
      ...order,
      customer: {
        ...order.customer
      }
    };
    customerInfoVisible.value = true;
  } else {
    console.error('Attempted to show customer info for an undefined order or missing customer data.');
    toast.error('Error: No customer data available.');
  }
};

const toggleActionVisible = (order) => {
  if (order) {
    editingOrder.value = { ...order };
    actionVisible.value = true;
    console.log(editingOrder.value)
  } else {
    console.error('Attempted to initiate an action for an undefined order.');
    toast.error('Error: No action data available.');
  }
};

const acceptOrder = async () => {
  const orderData = {
    order_id: editingOrder.value.order_id,
    details: editingOrder.value.order_details
  };

  try {
    await orderServices.setOrderForPickup(orderData);
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Order status updated to for pickup and quantities deducted.', life: 3000 });
    actionVisible.value = false;
    fetchOrders();
  } catch (error) {
    console.error('Failed to set order for pickup:', error);
    toast.error('Failed to set order for pickup.');
  }
};

const markOrderAsFinished = async () => {
  const orderData = {
    order_id: editingOrder.value.order_id,
    details: editingOrder.value.order_details
  };

  try {
    await orderServices.markOrderAsFinished(orderData);
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Order status updated to finished', life: 3000 });
    actionVisible.value = false;
    fetchOrders();
  } catch (error) {
    console.error('Failed to set order for pickup:', error);
    toast.error('Failed to set order for pickup.');
  }
};

const formattedStatus = computed(() => {
  if (editingOrder.value.status === 'pending_approval') {
    return 'Pending';
  }
  return editingOrder.value.status || 'No status available';
});

const statusColor = computed(() => {
  if (editingOrder.value.status === 'pending_approval') {
    return 'red';
  }
  return 'black';
});

const viewFeedback = (order) => {
  editingOrder.value = order;
  console.log(editingOrder.value);
  feedbackVisible.value = true;
};
</script>

<template>
  <div class="card">
    <DataTable :value="orders">
      <Column field="order_id" header="Order ID"></Column>
      <Column field="customer" header="Customer">
        <template #body="slotProps">
          <Button icon="pi pi-user" @click="toggleCustomerInfoVisible(slotProps.data)" />
        </template>
      </Column>
      <Column field="order_details" header="Order Details">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" @click="viewOrderDetails(slotProps.data)" />
        </template>
      </Column>
      <Column field="order_date" header="Order Date"></Column>
      <Column field="status" header="Status">
        <template #body="slotProps">
          <Tag :value="slotProps.data.status" />
        </template>
      </Column>
      <Column header="Actions">
        <template #body="slotProps">
          <Button icon="pi pi-check" @click="toggleActionVisible(slotProps.data)" v-if="slotProps.data.status === 'pending_approval' || slotProps.data.status === 'For Pickup'" />
          <Button icon="pi pi-eye" @click="viewFeedback(slotProps.data)" v-else-if="slotProps.data.status === 'Reviewed' || slotProps.data.status === 'Finished'" />
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="customerInfoVisible" modal header="Customer Details" :style="{ width: '25rem' }">
      <template v-if="editingOrder.customer && (editingOrder.customer.first_name || editingOrder.customer.last_name || editingOrder.customer.email)">
        <!-- Check and display each customer property only if it exists -->
        <p v-if="editingOrder.customer.first_name && editingOrder.customer.last_name">
          {{ editingOrder.customer.first_name }} {{ editingOrder.customer.last_name }}
        </p>
        <p v-if="editingOrder.customer.email">
          {{ editingOrder.customer.email }}
        </p>
      </template>
      <p v-else>No customer data available.</p>
    </Dialog>


    <Dialog v-model:visible="visible" modal header="Order Details" :style="{ width: 'full' }">
    <!-- Check if there are any order details -->
    <div class="grid p-fluid">
      <div class="col-12">
        <div class="flex flex-column">
          <div class="e-receipt">
            <p class="e-receipt-header">MINDORO AUTO PARTS</p>
            <div style="text-align: center; color: gray; font-size: 10px; font-style: italic;">
              Leynes Building Leuterio St., San Vicente West,
              Calapan City, Oriental Mindoro <br>
              JEFFREY C. CHENG - Prop <br>
              VAT Reg. TIN 944-325-121007-000 <br>
            </div>
            <div class="e-receipt-details">
              <Divider></Divider>
              <p>Order Items:</p>
              <ul>
                <li v-for="detail in editingOrder.order_details" :key="detail.id">
                  {{ detail.product_name }} x {{ detail.quantity }} = ₱{{ detail.total_price }}
                </li>
              </ul>
              <Divider></Divider>
              <p>Order Number: {{ editingOrder.order_id }}</p>
              <p>Total Amount: ₱{{ editingOrder.total_price }}</p>
            </div>
            <div class="e-receipt-dates grid">
              <div class="col-6">
                <p>Order Date and Time:</p>
                <p>{{ editingOrder.order_date }}</p>
              </div>
              <div class="col-6">
                <p>For pickup date and time valid for 5 days:</p>
                <p>{{ editingOrder.valid_date }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </Dialog>


    <Dialog v-model:visible="actionVisible" modal header="Actions" :style="{ width: '25rem' }">
      Gcash Receipt
      <Image :src="`${BASE_URL}/receipts/` + editingOrder.gcash_receipt_photo" alt="Image" width="250" preview />
      <Button v-if="editingOrder.status === 'pending_approval'" label="Accept Order" @click="acceptOrder"></Button>
      <Button v-if="editingOrder.status === 'For Pickup'" label="Order Picked up" @click="markOrderAsFinished"></Button>
    </Dialog>

    <Dialog v-model:visible="feedbackVisible" modal header="Feedback Details" :style="{ width: '80rem' }">
  <!-- Feedback Section -->
  <div v-if="editingOrder.status === 'Reviewed'" class="feedback-section">
    <p><strong>Feedback:</strong> {{ editingOrder.feedback || 'No feedback provided.' }}</p>
    
    <div class="flex flex-column">
      <strong>Feedback Photo:</strong>
      <Image v-if="editingOrder.feedback_photo"
             :src="`${BASE_URL}/feedback/` + editingOrder.feedback_photo"
             alt="Feedback Photo"
             width="50" preview />
      <p v-else>No feedback photo available.</p>
    </div>
  </div>

  <!-- GCash Receipt Section -->
  <div class="flex flex-column" style="margin-top: 20px;">
    <strong>Gcash Receipt:</strong>
    <Image :src="`${BASE_URL}/receipts/` + editingOrder.gcash_receipt_photo"
           alt="GCash Receipt Image" width="50"
           preview  />
  </div>
</Dialog>


  </div>
</template>

<style>
.e-receipt {
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #ddd;
}

.e-receipt-header {
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
}

.e-receipt-details {
  margin-bottom: 1rem;
}

.e-receipt-dates {
  display: flex;
  justify-content: space-between;
}

.feedback {
  background-color: green;
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
}
</style>
