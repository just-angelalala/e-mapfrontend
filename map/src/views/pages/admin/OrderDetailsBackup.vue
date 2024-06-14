<Dialog v-model:visible="visible" modal header="Order Details" :style="{ width: 'full' }">
    <!-- Check if there are any order details -->
    <div class="grid p-fluid">
      <!-- First row: two columns for order status and e-receipt -->
      <div class="col-6">
        <div class="flex flex-column">
          <p>Order Status:</p>
          <p :style="{ color: statusColor }">{{ formattedStatus }}</p>
        </div>
      </div>
      <div class="col-6">
        <div class="flex flex-column">
          <p>Order Details</p>
          <div class="e-receipt">
            <p class="e-receipt-header">MINDORO AUTO PARTS</p>
            <div style="text-align: center; color: gray; font-size: 15px; font-style: italic;">
              Leynes Building Leuterio St., San Vicente West,
              Calapan City, Oriental Mindoro
              JEFFREY C. CHENG - Prop
              VAT Reg. TIN 944-325-121007-000
            </div>
            <div class="e-receipt-details">
              <Divider></Divider>
              <p>Order Items:</p>
              <ul>
                <li v-for="detail in editingOrder.order_details" :key="detail.id">
                  {{ detail.product_name }} x {{ detail.quantity }} = ${{ detail.total_price }}
                </li>
              </ul>
              <Divider></Divider>
              <p>Order Number: {{ editingOrder.order_id }}</p>
              <p>Total Amount: ${{ totalAmount }}</p>
            </div>
            <div class="e-receipt-dates grid">
              <div class="col-6">
                <p>Order Date and Time:</p>
                <p>{{ editingOrder.order_date }}</p>
              </div>
              <div class="col-6">
                <p>For pickup date and time valid for 5 days:</p>
                <p>{{ editingOrder.order_date }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Second row: full row for feedback -->
      <div class="col-12">
        <div class="flex flex-column">
          <p>Feedback</p>
          <div class="feedback">
            <p>Add a little bit of body text</p>
          </div>
        </div>
      </div>
    </div>
  </Dialog>