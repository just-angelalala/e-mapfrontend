import axios from "@/api/axios";
const apiBaseUrl = `${import.meta.env.VITE_API_BASE_URL}/pointOfSale`;

export default class POSService {
  // Method to process checkout
  constructor() {
    this.apiClient = axios.create({
      baseURL: apiBaseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async addOrder(orderData) {
    try {
      // Make a POST request to the backend API endpoint for adding orders
      const response = await this.apiClient.post("/createNewOrder", orderData);

      // Check if the request was successful
      if (response.status === 201) {
        // Return the response data if needed
        return response.data;
      } else {
        // Handle error response
        throw new Error("Failed to add order");
      }
    } catch (error) {
      // Handle any errors that occur during the request
      console.error("Error adding order:", error);
      throw error; // Rethrow the error to handle it in the component
    }
  }

  async updateOrder(orderId, orderDetails) {
    try {
      const response = await this.apiClient.patch(
        `/updateOrder/${orderId}`,
        orderDetails
      );

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Failed to add order details and update total");
      }
    } catch (error) {
      console.error("Error adding order details and updating total:", error);
      throw error;
    }
  }

  async updateOrderDetails(orderId, orderDetails) {
    try {
      const response = await this.apiClient.post(
        `/updateOrderDetails/${orderId}`,
        orderDetails
      );

      console.log(response);

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Failed to add order details and update total");
      }
    } catch (error) {
      console.error("Error adding order details and updating total:", error);
      throw error;
    }
  }

  async deleteOrderDetailAndUpdateQuantity(orderDetails) {
    try {
      console.log(orderDetails);
      const response = await this.apiClient.delete(
        `/deleteOrderDetailAndUpdateQuantity/${orderDetails}`
      );

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Failed to add order details and update total");
      }
    } catch (error) {
      console.error("Error adding order details and updating total:", error);
      throw error;
    }
  }

  async clearAllOrderDetails(orderDetails) {
    try {
      console.log(orderDetails);
      const response = await this.apiClient.delete(
        `/clearAllOrderDetails/${orderDetails}`
      );

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Failed to add order details and update total");
      }
    } catch (error) {
      console.error("Error adding order details and updating total:", error);
      throw error;
    }
  }

  async getOrderDetails(orderId) {
    try {
      const response = await this.apiClient.get(`/orderDetails/${orderId}`);
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Failed to fetch order details");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      throw error;
    }
  }

  async addOrderPayment(orderId, paymentDetails) {
    try {
        const response = await this.apiClient.post(`/addOrderPayment/${orderId}`, paymentDetails);
        if (response.status === 200) {
            return response.data;  // Assuming the API returns some data on success
        } else {
            throw new Error("Failed to process payment");
        }
    } catch (error) {
        console.error("Error processing payment:", error);
        throw error;  // Rethrow the error to handle it in the component
    }
}

}