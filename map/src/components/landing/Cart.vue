<script setup>
import { ref, computed, watch } from "vue";
import { useStore } from 'vuex';
import { useToast } from "primevue/usetoast";
import OrderServices from '@/service/OrderServices';
import { useRouter } from 'vue-router';


const orderServices = new OrderServices();
const store = useStore();
const apiUrl = 'https://mindoroautoparts.online/index.php/api/ecommerce/getGcashReceipt';
const gcashReceipt = ref(null);
const termsAgreed = ref(false);  // To track the state of the checkbox
const loading = ref(false)
const router = useRouter();
const userId = computed(() => store.state.auth.userId);

const visible = computed({
    get: () => store.state.cartVisible,
    set: (value) => store.commit('setCartVisible', value)
});

const position = computed({
    get: () => store.state.cartPosition,
    set: (value) => store.commit('setCartPosition', value)
});

const cartItems = computed(() => store.state.cart);
const hasItems = computed(() => cartItems.value.length > 0);
const receiptUploaded = computed(() => gcashReceipt.value !== null);
const phoneNumber = ref('')

const canCheckout = computed(() => {
  return hasItems.value && receiptUploaded.value && termsAgreed.value && isValidPhoneNumber.value;
});

const isValidPhoneNumber = computed(() => {
  return phoneNumber.value.length === 11 && /^\d+$/.test(phoneNumber.value);
});

const checkout = async () => {
    const subtotal = formattedCartItems.value.reduce((sum, item) => sum + item.totalPrice, 0);
    console.log(userId.value);
    // Use the computed userId here
    if (!userId.value || userId.value === 0) {
        // Redirect to login if user is not logged in
        router.push({ name: 'login' }); // Use router.push for redirection
        return;
    }

    const orderData = {
        user_id: userId.value, // Access the computed userId
        details: formattedCartItems.value.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.totalPrice
        })),
        phoneNumber: phoneNumber.value,
        gcashReceipt: gcashReceipt.value,
        status: 'pending',
        subtotal: subtotal // Add the subtotal here
    };

    loading.value = true;
    try {
        console.log(orderData);
        const response = await orderServices.checkout(orderData);
        console.log('Checkout successful:', response);
        store.commit('CLEAR_CART');
        phoneNumber.value = '';
        termsAgreed.value = false;
        visible.value = false;
    } catch (error) {
        console.error('Checkout error:', error);
    } finally {
        loading.value = false;
    }
};


const onAdvancedUpload = (event) => {
    const responseData = JSON.parse(event.xhr.response);
    gcashReceipt.value = responseData.data.fileNames[0]; 
};

const removeItem = (item) => {
    store.commit('REMOVE_FROM_CART', item.id);
};

const updateQuantity = (product) => {
    store.dispatch('updateCartItemQuantity', { productId: product.id, newQuantity: product.quantity });
};

const formattedCartItems = computed(() => store.state.cart.map(item => ({
    ...item,
    unitPriceFormatted: new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(item.unitPrice),
    totalPriceFormatted: new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(item.totalPrice)
})));

watch(cartItems, (newCartItems) => {
    newCartItems.forEach(item => {
        const originalItem = store.state.cart.find(p => p.id === item.id);
        if (originalItem && originalItem.quantity !== item.quantity) {
            store.dispatch('updateCartItemQuantity', { productId: item.id, newQuantity: item.quantity });
        }
    });
}, { deep: true });
</script>



<template>
    <Dialog v-model:visible="visible" header="CHECK OUT NOW!" :style="{ width: '65rem' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" :position="position" modal draggable="false">
        <Splitter style="height: 300px; margin-bottom: 20px;">
            <!-- Cart items display panel -->
            <SplitterPanel class="justify-content-center" size="75" minSize="10">
                <DataTable :value="formattedCartItems" class="p-datatable-sm">
                    <Column selectionMode="multiple" headerStyle="width: 2rem"></Column>
                    <Column field="image" header="Image"></Column>
                    <Column field="name" header="Name"></Column>
                    <Column field="unitPriceFormatted" header="Unit Price"></Column>
                    <Column field="quantity" header="Quantity">
                        <template #body="slotProps">
                            <InputNumber v-model="slotProps.data.quantity" showButtons buttonLayout="horizontal" :min="0"
                                        :max="slotProps.data.remainingQuantity" @input="updateQuantity(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>
            </SplitterPanel>

            <!-- Total and remove item panel -->
            <SplitterPanel class="justify-content-center" size="25">
                <DataTable :value="formattedCartItems" class="p-datatable-sm">
                    <Column field="totalPriceFormatted" header="Total Price" style="font-size: larger;"></Column>
                    <Column>
                        <template #body="slotProps">
                            <Button icon="pi pi-times" @click="removeItem(slotProps.data)" class="p-button-rounded p-button-danger" />
                        </template>
                    </Column>
                </DataTable>
            </SplitterPanel>
        </Splitter>

        <!-- Upload receipt -->
        <h6 for="gcashReceipt">Upload your Payment receipt</h6>
        <div class="card flex justify-content-between mt-2">
            <div class="payment-details p-3" style="min-width: 250px;">
                <p><strong>JEFFREY C. CHENG</strong> </p>
                <p><strong>BPI BANK:</strong> 8963-0770-34</p>
                <p><strong>GCASH:</strong> 09190043801</p>
            </div>
            <div class="fileupload w-full" >
                <FileUpload name="gcashReceipt[]" :url="apiUrl" @upload="onAdvancedUpload($event)" multiple accept="image/*" :maxFileSize="1000000">
                    <template #empty>
                        <p>Drag and drop files here to upload.</p>
                    </template>
                </FileUpload>
            </div>
        </div>

        <div class="p-card mt-3">
            <div class="p-card-body">
                <p>Please enter your active phone number below. This information is crucial for several key reasons:</p>
                <ul>
                    <strong>Pick-Up Coordination:</strong> our phone number allows us to coordinate the pick-up of your purchase promptly. We will contact you to arrange the pick-up within the 5-day deadline set by our MAP team. <br>
                    <strong>Effective Communication:</strong> An accurate and reachable phone number is crucial to avoid delays and ensure timely updates about your order status. <br> <br>
                    <strong>Note:</strong> Once your order is approved, you will receive an automatic text confirmation.
                </ul>
                <h6 for="phoneNumber">Enter your mobile number:</h6>
                <InputText v-model="phoneNumber"
                            placeholder="Enter your mobile number" style="width: 35%;" :class="{ 'p-invalid': !isValidPhoneNumber }"/>
            </div>           
        </div>

        <!-- Terms and Conditions Section -->
        <div class="p-card p-mt-3">
            <div class="p-card-body">
                <div class="p-field-checkbox mb-4">
                    <Checkbox class="mr-2" v-model="termsAgreed" binary></Checkbox>
                    <label class="p-ml-2">I agree to the Terms and Conditions</label>
                </div>
                <div class="p-text-italic p-mt-2">
                    <strong>Terms and Conditions:</strong>
                    <ul>
                        <strong>Payment Responsibility:</strong> Customers are required to pay the full amount for their product upon purchase. <br>
                        <strong>Pick-Up Deadline:</strong> Customers must collect their purchased product within 5 days of approval by the MAP team. <br>
                        <strong>Refund Policy:</strong> There will be no refunds once the product has been approved for pick-up by the MAP management.
                    </ul>
                </div>
            </div>
        </div>

        <!-- Checkout button -->
        <Button label="Checkout" @click="checkout" :disabled="!canCheckout" class="p-button-success mt-3"  :loading="loading"/>
    </Dialog>
</template>


<style scoped>
/* Your scoped styles here */
</style>