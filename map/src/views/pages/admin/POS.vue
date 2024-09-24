<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from "vue";
import ProductService from "@/service/ProductService";
import POSService from "@/service/POSService";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import moment from "moment";
import NodeService from "@/service/NodeService";
import SessionService from "@/service/SessionService";
import UserServices from '@/service/UserServices';
const toast = useToast();
const confirm = useConfirm();

const userService = new UserServices();
const nodeService = new NodeService();
const sessionService = new SessionService();
const posService = new POSService();
const store = useStore();
const printReceipt = () => {
  const receiptElement = document.getElementById("printReceipt");
  receiptElement.style.display = "block"; // Make the receipt visible
  window.print(); // Trigger the print dialog
  receiptElement.style.display = "none"; // Hide the receipt after printing
};

const router = useRouter();
const userID = computed(() => store.state.auth.userId);
const selectedKey = ref();
const paymentDialog = ref(false);
const redirectToPayment = () => {
  // Replace '/payment' with the actual route path
  paymentDialog.value = true;
};
const productService = new ProductService();
const BASE_URL = import.meta.env.VITE_APP_BASE_URL_PHOTO;

const products = ref(null);
const searchText = ref("");
const selectedCategories = ref([]); // To store selected categories
const categoryOptions = ref([]); // To store options for the MultiSelect component

const filteredProducts = ref([]);
const viewMode = ref("grid"); // Default view mode
const toggleView = (mode) => {
  viewMode.value = mode; // Update the view mode
};
const customerDialog = ref(false);
const position = ref("center");
const nodes = ref();

const openPosition = (pos) => {
  position.value = pos;
  ordersDialog.value = true;
};
const ordersDialog = ref(false);

const searchProducts = () => {
  // TODO: can search code
  // Filter products based on search text and selected categories
  if (!searchText.value.trim() && selectedCategories.value.length === 0) {
    // If both search text and categories are empty, show all products
    filteredProducts.value = products.value;
    console.log(filteredProducts.value)
    return;
  }

  let filtered = products.value;

  // Filter by search text
  if (searchText.value.trim()) {
    filtered = filtered.filter((product) => {
      return product.name.toLowerCase().includes(searchText.value.trim().toLowerCase());
    });
  }

  // Filter by selected categories
  if (selectedCategories.value.length > 0) {
    const selectedCategoryIds = selectedCategories.value.map((category) => category.id);
    filtered = filtered.filter((product) => {
      return selectedCategoryIds.includes(product.category_id);
    });
  }

  filteredProducts.value = filtered;
};

const filterProductsByCategory = () => {
  console.log("Selected categories:", selectedCategories.value); // Add console log statement here for testing
  if (selectedCategories.value.length === 0) {
    // If no categories are selected, show all products
    filteredProducts.value = products.value;
    return;
  }
  // Extract only the ids of the selected categories
  const selectedCategoryIds = selectedCategories.value.map((category) => category.id);
  // Filter products based on selected category ids
  filteredProducts.value = products.value.filter((product) => {
    return selectedCategoryIds.includes(product.category_id);
  });

  console.log("Selected category ids:", selectedCategoryIds);
  console.log("Filtered products:", filteredProducts.value);
};

const getSessionDetails = async (sessionId) => {
  try {
    const sessionId = router.currentRoute.value.params.sessionId;

    await store.dispatch("pos/getSessionDetails", sessionId);
    sessionDetails.value = store.getters["pos/sessionDetails"];
    console.log(sessionDetails.value);
  } catch (error) {
    console.error("Error fetching session details:", error);
  }
};

const goToOrder = async () => { };

const succesDialog = ref(false);

const processPayment = async () => {
  if (parseFloat(payment.value) >= parseFloat(orderTotal.value)) {
    try {
      const paymentDetails = {
        payment: payment.value,
        change: change.value,
      };
      const response = await posService.addOrderPayment(
        orderNumber.value,
        paymentDetails
      );
      toast.add({
        severity: "success",
        summary: "Payment Processed",
        detail: "Payment has been processed successfully.",
        life: 3000,
      });
      paymentDialog.value = false;
      succesDialog.value = true;
      // Handle further actions after successful payment
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Payment Error",
        detail: "Failed to process payment.",
        life: 3000,
      });
    }
  } else {
    toast.add({
      severity: "error",
      summary: "Payment Error",
      detail: "Invalid payment details.",
      life: 3000,
    });
  }
};
// watch(selectedCategories, filterProductsByCategory);
onMounted(async () => {
  window.addEventListener('keyup', handleKeyup);
  try {
    // Fetch products from the backend
    const data = await productService.getProductsPos();
    products.value = data;
    fetchOrderDetails();

    // Extract unique category names from products and populate the categoryOptions array
    const uniqueCategories = Array.from(
      new Set(data.map((product) => product.category_id))
    );
    categoryOptions.value = uniqueCategories.map((categoryId) => {
      const category = data.find((product) => product.category_id === categoryId);
      return { name: category.category_name, id: categoryId };
    });

    searchProducts();
    fetchUserInfo()
    console.log(userInfo.value);
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  const sessionId = router.currentRoute.value.params.sessionId;
  sessionService
    .getSessionDetails(sessionId)
    .then((data) => {
      nodes.value = data.data; // Update nodes with the new data
    })
    .catch((error) => {
      console.error("Error fetching session details:", error);
    });
});

const orderDetails = ref([]); // This will hold the order details

// Function to fetch and store order details
const fetchOrderDetails = async (orderId) => {
  try {
    orderId = orderNumber.value;
    const response = await posService.getOrderDetails(orderId);
    orderDetails.value = response.data.details; // Assuming response is the array of order details
    console.log("Order Details:", orderDetails.value);
    if (orderDetails.value.length === 0) {
      orderTotal.value = 0;
    } else {
      orderTotal.value = response.data.total_price || 0;
    }
  } catch (error) {
    console.error("Error fetching order details:", error);
    toast.add({
      severity: "error",
      summary: "Fetch Error",
      detail: "Failed to fetch order details.",
      life: 3000,
    });
  }
};

// Example usage: Call this function when needed, e.g., when a user selects an order to view details
// You might call this function when a particular order is selected or on component mount for a specific order view

const orderNumber = ref(store.state.pos.currentOrderId);
console.log(orderNumber);

const updateOrder = async (orderId, orderDetails) => {
  try {
    const response = await posService.updateOrder(orderId, orderDetails);
    return response;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error; // Rethrow the error to handle it in the component or catch it in the component
  }
};
const confirm1 = () => {
  confirm.require({
    message: "Are you sure you want to proceed?",
    header: "Confirmation",
    icon: "pi pi-exclamation-triangle",
    rejectClass: "p-button-secondary p-button-outlined",
    rejectLabel: "Cancel",
    acceptLabel: "Save",
    accept: () => {
      newOrder();
      toast.add({
        severity: "info",
        summary: "Confirmed",
        detail: "You have accepted",
        life: 3000,
      });
    },
    reject: () => {
      toast.add({
        severity: "error",
        summary: "Rejected",
        detail: "You have rejected",
        life: 3000,
      });
    },
  });
};

const orderTotal = ref(0);

const lastScannedCode = ref('');
const barcodeInput = ref('');
let inputActiveTime = ref(Date.now());

const handleKeyup = (e) => {
  if (e.keyCode === 13) { // Check for Enter key
    lastScannedCode.value = barcodeInput.value;
    console.log('Barcode processed:', lastScannedCode.value);
    processScannedCode(lastScannedCode.value);
    barcodeInput.value = ''; // Reset after processing
    inputActiveTime.value = Date.now(); // Reset the timer
  } else {
    if (Date.now() - inputActiveTime.value < 50) { // Only add to input if within a short time frame
      barcodeInput.value += String.fromCharCode(e.keyCode);
    } else {
      barcodeInput.value = String.fromCharCode(e.keyCode);
    }
    inputActiveTime.value = Date.now();
  }
};

const processScannedCode = async (scannedCode) => {
  const product = products.value.find(p => p.code === scannedCode);
  if (product) {
    await addToOrder(product);
  } else {
    toast.add({
      severity: "error",
      summary: "Product Not Found",
      detail: "No product matches the scanned barcode.",
      life: 3000,
    });
  }
};

const addToOrder = async (product) => {
     console.log(product);
     try {
       const orderId = orderNumber.value;
       const orderDetails = {
         order_id: orderId,
         product_id: product.id,
         quantity: 1,
       };

       const response = await posService.updateOrder(orderId, orderDetails);
       console.log("response", response.data);
       toast.add({
         severity: "success",
         summary: "Product Added",
         detail: `${product.name} added to the order.`,
         life: 3000,
       });
       await fetchOrderDetails();
       await fetchProducts(); // Fetch updated products list
     } catch (error) {
       console.error("Error adding product to order:", error);
       toast.add({
         severity: "error",
         summary: "Error",
         detail: "Failed to add product to order.",
         life: 3000,
       });
     }
   };

const onNodeSelect = (node) => {
  toast.add({
    severity: "success",
    summary: "Node Selected",
    detail: node.data.name,
    life: 3000,
  });
};
const onNodeUnselect = (node) => {
  toast.add({
    severity: "warn",
    summary: "Node Unselected",
    detail: node.data.name,
    life: 3000,
  });
};
const productsForOrder = ref([]);

const newOrder = async () => {
  try {
    const sessionId = router.currentRoute.value.params.sessionId;
    await store.dispatch("pos/addOrder", sessionId);

    orderNumber.value = store.state.pos.currentOrderId;

    const data = await sessionService.getSessionDetails(sessionId);
    nodes.value = data.data; // Update nodes with the new data

    // Optionally, you can also log the updated orderNumber for verification
    console.log("Updated orderNumber:", orderNumber.value);
    fetchOrderDetails();
  
    succesDialog.value = false;
  } catch (error) {
    console.error("Error adding new order:", error);
    throw error;
  }
};
const payment = ref(0);
const change = computed(() => {
  return payment.value - orderTotal.value;
});

onBeforeUnmount(() => {
  window.removeEventListener('keyup', handleKeyup);
});

const updateTotalPrice = async (item) => {
     console.log(item);
     try {
       const orderId = orderNumber.value;
       const orderDeets = item;

       const response = await posService.updateOrderDetails(orderId, orderDeets);
       console.log("response", response.data);
       toast.add({
         severity: "success",
         summary: "Quantity Updated",
         detail: `item quantity updated`,
         life: 3000,
       });
       await fetchOrderDetails();
       await fetchProducts(); // Fetch updated products list
     } catch (error) {
       console.error("Error updating product in order:", error);
       toast.add({
         severity: "error",
         summary: "Error",
         detail: "Insufficient quantity",
         life: 3000,
       });
     }
   };

   const fetchProducts = async () => {
     try {
       const data = await productService.getProductsPos();
       products.value = data;
       searchProducts(); // This will update filteredProducts based on the latest products and search/filter criteria
     } catch (error) {
       console.error("Error fetching products:", error);
     }
   };


const deleteRow = async (item) => {
  try {
    const orderId = orderNumber.value; 

    const response = await posService.deleteOrderDetailAndUpdateQuantity(item.id);
    console.log("response", response.data);
    toast.add({
      severity: "success",
      summary: "Quantity Updated",
      detail: `Item removed from orders`,
      life: 3000,
    });
    await fetchOrderDetails();
    await fetchProducts(); 

    console.log(orderDetails.value)
  } catch (error) {
    console.error("Error adding product to order:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to add product to order.",
      life: 3000,
    });
  }
};

const clearAll = async () => {
  try {
    const orderId = orderNumber.value; 

    const response = await posService.clearAllOrderDetails(orderId);
    console.log("response", response.data);
    toast.add({
      severity: "success",
      summary: "Quantity Updated",
      detail: `Items removed from orders`,
      life: 3000,
    });
    await fetchOrderDetails();
    await fetchProducts(); 

    console.log(orderDetails.value)
  } catch (error) {
    console.error("Error adding product to order:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Error",
      life: 3000,
    });
  }
};

const userInfo = ref();

const fetchUserInfo = async () => {
    if (userID.value) {
        try {
            const data = await userService.getNameAndPhoto(userID.value);
            userInfo.value = data.username
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    }
};
</script>

<template>
  <Toast />
  <ConfirmDialog></ConfirmDialog>

  <div class="flex flex-row gap-2 relative">
    <!-- Second Panel Content -->
    <div class="flex-grow-0">
      <div class="mb-3 gap-2 flex">
        <Button icon="pi pi-caret-left" class="p-button-secondary" label="" @click="redirectToPayment" />
        <div class="p-d-flex p-jc-center p-ai-center" style="flex-grow: 1"></div>
        <!-- Spacer -->
        <!-- <Button icon="pi pi-user-plus" class="p-button-info" label="Customer" /> -->
        <Button icon="pi pi-trash" class="p-button-info" label="Clear Orders" @click="clearAll()" />
      </div>
      <Fieldset class="flex-grow-0 relative" style="height: 82vh; background-color: white" unstyled>
        <template #legend>
          <div class="flex align-items-center pl-2">
            <span class="font-bold">Receipt</span>
          </div>
        </template>
        Order no: {{ orderNumber }}
        <!-- Display dynamic order number -->
        <DataTable :value="orderDetails" stripedRows>
          <Column field="product_name" header="Product Name"></Column>
          <Column field="price" header="Unit Price"></Column>
          <Column field="total_price" header="Total Price"></Column>
          <Column field="quantity" header="Quantity">
            <template #body="slotProps">
              
            <InputNumber v-model="slotProps.data.quantity" @input="updateTotalPrice(slotProps.data)" showButtons buttonLayout="vertical" style="width: 3rem" :min="0" :max="99">
                <template #incrementbuttonicon>
                    <span class="pi pi-plus" />
                </template>
                <template #decrementbuttonicon>
                    <span class="pi pi-minus" />
                </template>
            </InputNumber>
            </template>
          </Column>
          <Column header="Delete">
            <template #body="slotProps">
              <Button icon="pi pi-trash" @click="deleteRow(slotProps.data)" />
            </template>
          </Column>
        </DataTable>

        <!-- Static button at the bottom right -->

        <div class="absolute bottom-0 right-0 p-2 gap-1 flex justify-content-around"></div>
        <div class="absolute bottom-0 right-0 p-2 gap-1 flex flex-wrap w-full">
          <!-- <InputText>
                    </InputText> -->
          <div class="flex w-full justify-content-between text-2xl">
            <div class="font-bold w-full">Total</div>
            <div>
              {{ orderTotal }}
            </div>
          </div>
          <br />
          <Button label="Payment" class="p-button-success w-full" icon="pi pi-angle-right" @click="redirectToPayment" />
        </div>
      </Fieldset>
    </div>
    <Fieldset class="flex-auto flex-row" unstyled style="background-color: white">
      <template #legend>
        <div class="flex align-items-center pl-2">
          <!-- <Avatar image="@/sampleimages/gate.jpg" shape="circle" /> -->
          <span class="font-bold">Products</span>
        </div>
      </template>
      <div class="flex gap-2 justify-content-end mb-4">
        <MultiSelect v-model="selectedCategories" :options="categoryOptions" filter optionLabel="name"
          placeholder="Category" :maxSelectedLabels="3" class="w-full md:w-15rem" @change="filterProductsByCategory" />
        <InputText v-model="searchText" @input="searchProducts" placeholder="Search ID or Name" class="p-button-info" />
        <Button icon="pi pi-list" @click="toggleView('list')" :class="{ 'p-button-outlined': viewMode === 'grid' }"
          class="p-button-info" />
        <Button icon="pi pi-table" @click="toggleView('grid')" :class="{ 'p-button-outlined': viewMode === 'list' }"
          class="p-button-info" />
        <Button label="New Order" class="p-button-info" @click="newOrder()" />
      </div>
      <!-- <div class="flex gap-2 justify-content-center mb-4">
                    <i class="mdi mdi-motorcycle"></i>
                    <Button label="All Products" icon="mdi mdi-motorcycle" outlined />
                    <Button label="Car Parts" outlined />
                    <Button label="Motor Parts" outlined />
                    <Button label="Accessories" outlined />
                </div> -->
      <div class="flex gap-2 justify-content-center mb-4"></div>

      <div class="justify-content-center flex gap-2 flex-wrap overflow-y-scroll align-self-start"
        style="max-height: 70vh">
        <template v-if="viewMode === 'grid'">
          <Card v-for="product in filteredProducts" :key="product.id" style="
              width: 13rem;
              max-width: 25rem;
              background-color: #f9fafb;
              box-shadow: none;
              border: 1px solid #ccc;
            ">
            <template #title>
              <div class="flex justify-content-between items-center">
                <div>
                  <span style="font-size: 1.25rem">{{ product.name }}</span>
                  <br /><span style="font-size: 0.875rem">Quantity: {{ product.quantity }}</span>
                </div>
                <div>
                  <img src="@/sampleimages/wheel.jpg" alt="Product Image" style="height: 45px" />
                </div>
              </div>
            </template>

            <template #content>
              <div class="flex">
                <Button label="Add" icon="pi pi-plus" class="w-full" @click="addToOrder(product)" />
              </div>
            </template>
          </Card>
        </template>

        <template v-else>
          <DataTable :value="filteredProducts" tableStyle="width: 100%;" class="w-full">
            <Column field="name" header="Name"></Column>
            <!-- <Column field="code" header="Code"></Column> -->
            <Column header="Image">
              <template #body="{ rowData }">
                <img src="@/sampleimages/wheel.jpg" alt="Product Image" style="height: 45px" />
              </template>
            </Column>
            <Column header="Action">
              <template #body="{ rowData }">
                <Button label="Add" icon="pi pi-plus" class="w-full" />
              </template>
            </Column>
          </DataTable>
        </template>
      </div>
    </Fieldset>
  </div>

  <Dialog v-model:visible="customerDialog" modal header="Select Customer" :style="{ width: '25rem' }">
    <!-- <span class="p-text-secondary block mb-5">Update your information.</span> -->
    <div class="flex align-items-center gap-3 mb-3">
      <label for="username" class="font-semibold w-6rem">Username</label>
      <InputText id="username" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex align-items-center gap-3 mb-5">
      <label for="email" class="font-semibold w-6rem">Email</label>
      <InputText id="email" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex justify-content-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
      <Button type="button" label="Save" @click="visible = false"></Button>
    </div>
  </Dialog>
  <Dialog v-model:visible="ordersDialog" modal header="Select Order" :style="{ width: '60rem' }">
    <!-- <span class="p-text-secondary block mb-5">Update your information.</span> -->
    <div class="flex align-items-center gap-3 mb-3">
      <TreeTable v-model:selectionKeys="selectedKey" :value="nodes" selectionMode="single" :resizableColumns="true"
        showGridlines :metaKeySelection="false" @nodeSelect="onNodeSelect" @nodeUnselect="onNodeUnselect">
        <Column field="name" header="ID" expander style="width: 320px"></Column>
        <Column field="size" header="Price"></Column>
        <Column field="type" header="Time" style="width: 150px"></Column>
        <Column field="customer" header="Customer" style="width: 150px"></Column>
      </TreeTable>
    </div>

    <div class="absolute top-0 right-0 p-4">
      <Button icon="pi pi-cart-plus" class="p-button-success" :label="`Go to Order`" @click="goToOrder" />
    </div>
  </Dialog>
  <Dialog v-model:visible="paymentDialog" modal header="Add Payment" :style="{ width: '30rem' }">
    <span class="p-text-secondary block mb-5 text-xl font-bold">Total: {{ orderTotal }}</span>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="username" class="font-semibold w-6rem">Tendered</label>
      <InputText id="username" class="flex-auto" autocomplete="off" v-model="payment" />
    </div>
    <div class="flex align-items-center gap-3 mb-5">
      <label for="email" class="font-semibold w-6rem">Change</label>
      <InputText id="email" class="flex-auto" autocomplete="off" disabled v-model="change" />
    </div>
    <div class="flex justify-content-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
      <Button label="Process Payment" @click="processPayment" />
    </div>
  </Dialog>

  <Dialog v-model:visible="succesDialog" modal header="Payment Successful" :style="{ width: '30rem' }">
    <span class="p-text-secondary block mb-5 text-xl font-bold">Order: {{ orderNumber }}</span>
    <span class="p-text-secondary block mb-5 text-xl font-bold">Total: {{ orderTotal }}</span>
    <span class="p-text-secondary block mb-5 text-xl font-bold">
      Tendered: {{ payment }}
    </span>
    <span class="p-text-secondary block mb-5 text-xl font-bold">Change: {{ change }}</span>
    <div class="flex justify-content-end gap-2 w-full">
      <Button class="w-full" label="New Order" @click="newOrder" severity="success" />
      <Button class="w-full" label="Print" @click="printReceipt" severity="primary" />
    </div>
  </Dialog>

  <div id="printReceipt" style="
      font-family: 'Arial', sans-serif;
      border: 1px solid;
      color: black;
      font-size: 16px;
      padding: 20px;
    ">
    <h3 style="text-align: center; color: black; font-size: 20px; font-style: bold;"><b>MINDORO AUTO PARTS</b></h3>
    <div style="text-align: center; color: gray; font-size: 10px; font-style: italic;">
      Leynes Building Leuterio St., San Vicente West, Calapan City, Oriental Mindoro <br>
      JEFFREY C. CHENG - Prop <br>
      VAT Reg. TIN 944-325-121007-000</div> <br>

    <p style="margin-bottom: 10px; border-bottom: 1px dashed;"><strong>Served by:</strong> {{ userInfo }}</p>
    <h4 style=" padding-bottom: 5px; font-size: 18px">
      Order Items:
    </h4>
    <ul style="list-style: none; padding: 0; margin: 0">
      <li v-for="item in orderDetails" :key="item.id" style="margin: 5px 0; padding: 5px; font-size: 16px; ">
        <div style="">
          <span>{{ item.product_name }}</span> x
          <span>{{ item.quantity }}</span> =
          <span>{{ item.price | currency }}</span>
        </div>
      </li>
    </ul>
    <p style="border-top: 1px dashed;"><strong>Order Number:</strong> {{ orderNumber }} <br>

      <strong>Total Amount:</strong> {{ orderTotal | currency }} <br>
      <strong>Tendered:</strong> {{ payment | currency }} <br>
      <strong>Change:</strong> {{ change | currency }}
    </p>
    <div>

    </div>
    <p style="text-align: center; margin-top: 20px; font-size: 16px">
      Thank you for your purchase!
    </p>
  </div>
</template>
<style>
@media print {
  body * {
    visibility: hidden;
  }

  #printReceipt,
  #printReceipt * {
    visibility: visible;
  }

  #printReceipt {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}

.small-input .p-inputtext {
  width: 70px; /* Adjust width as needed */
  padding: 0.25rem;
}
</style>
