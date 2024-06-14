<script setup>
import { ref, onMounted, computed } from 'vue';
import OrderServices from '@/service/OrderServices';
import PrimeVue from 'primevue/config';
import { useToast } from 'primevue/usetoast';
import { useStore } from 'vuex';

import noRefundImage from '@/assets/default/pngtree-no-cash-refunds-grungy-refundment-stamp-vector-png-image_23052142.png'

const store = useStore();
const toast = useToast();
const visible = ref(false);
const actionVisible = ref(false);
const customerInfoVisible = ref(false);
const editingOrder = ref({});  // Initialized to an empty object for safe property access
const orders = ref([]);
const customer = ref({});

const orderServices = new OrderServices();


const BASE_URL = import.meta.env.VITE_APP_BASE_URL_RECEIPT;


const baseUrl = import.meta.env.VITE_API_BASE_URL;

const fetchOrders = async () => {
  try {
    await orderServices.updateOrderStatusIfNotPickedUp();
    const userId = store.state.auth.userId;
    const response = await orderServices.getOrdersWithDetailsForCustomer(userId);
    if (response.status === 200) {
      const data = response.data;
      customer.value = {
        customer_id: data.customer_id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
      };
      orders.value = data.orders;
    }
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    toast.error('Failed to fetch orders.');
  }
};

onMounted(fetchOrders);

const viewOrderDetails = (order) => {
  if (order) {

    console.log(order);
    editingOrder.value = { ...order };
    rating.value = order.rating;
    feedbackText.value = order.feedback;
    console.log(editingOrder.value);
    visible.value = true;
  } else {
    console.error('Attempted to view details of an undefined order.');
    toast.error('Error: Order data is missing.');
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

const events = computed(() => {
  if (!editingOrder.value.order_details) {
    return [];
  }

  // Base events list, always show initial states
  const eventList = [
    { val: 'pending_approval', status: 'Pending', date: '15/10/2020 10:30', icon: 'pi pi-shopping-cart', color: '#9C27B0' },
    // This will handle 'For Pickup' and 'Not Picked Up'
    { val: editingOrder.value.status === 'Not Picked Up' ? 'Not Picked Up' : 'For Pickup', 
      status: editingOrder.value.status === 'Not Picked Up' ? 'Overdue' : 'For Pickup', 
      date: '20/10/2020 14:00', 
      icon: editingOrder.value.status === 'Not Picked Up' ? 'pi pi-exclamation-circle' : 'pi pi-cog', 
      color: editingOrder.value.status === 'Not Picked Up' ? 'red' : '#673AB7' },
    { val: 'Finished', status: 'Received', date: '20/10/2020 16:15', icon: 'pi pi-check', color: '#FF9800' },
    { val: 'Reviewed', status: 'Reviewed', date: '20/10/2020 16:15', icon: 'pi pi-check', color: '#FF9800' },
  ];

  // Apply green color to the current status
  eventList.forEach(event => {
    if (editingOrder.value.status === event.val) {
      event.color = 'green';
    }
  });

  return eventList;
});



const feedbackText = ref('');
const feedbackPhoto = ref([]);
const rating = ref([]);

const fullUrl = `${baseUrl}/ecommerce/uploadFeedbackImage`;

const onAdvancedUpload = (event) => {
  if (event.files && event.files.length > 0) {
    const uploadedFileName = event.files[0].name;
    feedbackPhoto.value = uploadedFileName
    toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
  } else {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to upload file', life: 3000 });
  }
};

const submitFeedback = async (orderId) => {
  const orderData = {
    order_id: orderId,
    feedback: feedbackText.value,
    feedback_photo: feedbackPhoto.value,
    rating: rating.value
  };

  try {
    await orderServices.submitFeedback(orderData);
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Order status updated to for pickup and quantities deducted.', life: 3000 });
    visible.value = false;
    fetchOrders();
  } catch (error) {
    console.error('Failed to set order for pickup:', error);
    toast.error('Failed to set order for pickup.');
  }
};

const dialogStyle = computed(() => {
  if (editingOrder.value.status === 'Not Picked Up') {
    return {
      width: '100rem',
    };
  }
  return { width: '100rem' };
});

document.documentElement.style.setProperty('--no-refund-image', `url(${noRefundImage})`);
</script>

<template>
  <div class="card">
    <DataTable :value="orders">
      <Column field="order_id" header="Order ID"></Column>
      <Column field="order_details" header="Order Details">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" @click="viewOrderDetails(slotProps.data)" />
        </template>
      </Column>
      <Column field="order_date" header="Order Date"></Column>
      <Column field="status" header="Status">
        <template #body="slotProps">
          <Tag class="" :value="slotProps.data.status" />
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="customerInfoVisible" modal header="Customer Details" :style="{ width: '25rem' }">
      <template v-if="customer.first_name || customer.last_name || customer.email">
        <p v-if="customer.first_name && customer.last_name">
          {{ customer.first_name }} {{ customer.last_name }}
        </p>
        <p v-if="customer.email">
          {{ customer.email }}
        </p>
      </template>
      <p v-else>No customer data available.</p>
    </Dialog>

    <Dialog v-model:visible="visible" modal header="Order Details" :style="dialogStyle">
      <!-- Check if there are any order details -->
      <div class="grid p-fluid">
        <!-- First row: two columns for order status and e-receipt -->
        <div class="col-3 mt-3">
          <div class="flex h-full flex-column justify-content-between align-items-center">
              <Timeline :value="events" align="alternate" class="w-full md:w-20rem">
              <template #content="slotProps">
                <span :class="{ 'active-text': slotProps.item.val === editingOrder.status }">
                  {{ slotProps.item.status }}
                </span>
              </template>
            </Timeline>

            <Image v-if="editingOrder.status === 'Not Picked Up'" :src="noRefundImage" alt="Image" width="250" />
          </div>
          
        </div>
        <div class="col-9">
          <div class="flex flex-column">
            <p>Order Details</p>
            <div class="e-receipt">
              <p class="e-receipt-header">MINDORO AUTO PARTS</p>
              <div style="text-align: center; color: gray; font-size: 15px; font-style: italic;">
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
                  <strong>Pick-Up Deadline:</strong> Customers must collect their purchased product within 5 days of
                  approval by the MAP team. <br>
                  <strong>Refund Policy:</strong> There will be no refunds once the product has been approved for
                  pick-up by
                  the MAP management. <br> <br>
                  <p>For pickup date and time valid for 5 days:</p>
                  <p>{{ editingOrder.valid_date }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Second row: full row for feedback -->
        <div class="col-12">
          <div class="flex flex-column" v-if="editingOrder.status !== 'pending_approval' && editingOrder.status !== 'Not Picked Up'">
            <p>Feedback</p>
            <div class="flex flex-column gap-3">
              <Textarea v-model="feedbackText" rows="5" cols="30" placeholder="Enter your feedback here"
                :readonly="editingOrder.status === 'Reviewed'"></Textarea>
              <FileUpload name="demo[]" :url="fullUrl" @upload="onAdvancedUpload" :multiple="true" accept="image/*"
                :maxFileSize="1000000" v-if="editingOrder.status !== 'Reviewed'">
                <template #empty>
                  <p>Drag and drop files here to upload.</p>
                </template>
              </FileUpload>
              <div class="flex gap-4">
                <label for="">Rating:</label>
                <Rating v-model="rating" :readonly="editingOrder.status === 'Reviewed'" />
              </div>
            </div>

            <div class="col-12" style="text-align: right; margin-top: 1rem;">
          <div>
            <Button v-if="editingOrder.status !== 'pending_approval' && editingOrder.status !== 'Reviewed'" 
              label="Submit Feedback" @click="submitFeedback(editingOrder.order_id)" :disabled="!feedbackText" />
          </div>
        </div>



          </div>
        </div>

        <!-- Submit Feedback Button -->
        
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

.active-text {
  color: white !important;
  background-color: green !important;
  padding: 0.2rem 0.5rem;
  border-radius: 0.3rem;
  font-weight: bold;
  font-size: 1.1rem;
}

.bg-image {
  background-image: var(--no-refund-image);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
}
</style>
