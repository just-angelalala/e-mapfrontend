import { createStore } from "vuex";
import VuexPersist from "vuex-persist";
import { jwtDecode } from "jwt-decode";
import auth from "./modules/auth";
import pos from "./modules/pos";
import products from "./modules/products";
import editProfile from "./modules/editProfile";

const vuexPersist = new VuexPersist({
  key: "my-app-store",
  storage: window.localStorage,
  modules: ["auth", "pos", "products", "editProfile"],
});

export default createStore({
  plugins: [vuexPersist.plugin],
  state: {
    // Manage Inventory
    productDialog: false,
    updateQuantityDialog: false,
    isEditing: false,
    editingProductId: null,
    product: {
      name: "",
      code: "",
      description: "",
      price: 0,
      quantity: 0,
      category: "",
      photo: "",
    },

    cart: [],
    cartVisible: false,
    cartPosition: "center",
  },
  mutations: {
    // Landing
    UPDATE_CART(state, newProducts) {
      newProducts.forEach((newProduct) => {
        const existingProduct = state.cart.find((p) => p.id === newProduct.id);

        if (existingProduct) {
          existingProduct.quantity += newProduct.quantity;
          existingProduct.totalPrice =
            existingProduct.quantity * existingProduct.unitPrice;
        } else {
          state.cart.push({
            ...newProduct,
            unitPrice: newProduct.price,
            totalPrice: newProduct.price * newProduct.quantity,
          });
        }
      });
    },

    // Updates the quantity of a specific product in the cart
    UPDATE_CART_ITEM_QUANTITY(state, { productId, newQuantity }) {
      const product = state.cart.find((p) => p.id === productId);
      if (product) {
        product.quantity = newQuantity;
        product.totalPrice = product.unitPrice * newQuantity;
      }
    },
    setCartPosition(state, newPosition) {
      state.cartPosition = newPosition;
    },
    setCartVisible(state, visibility) {
      state.cartVisible = visibility;
    },

    SET_EDITING_PRODUCT_ID(state, productId) {
      state.editingProductId = productId;
  },
  

    // Manage Inventory
    SET_PRODUCT_DIALOG(state, value) {
      state.productDialog = value;
    },
    SET_UPDATE_QUANTITY_DIALOG(state, value) {
      state.updateQuantityDialog = value;
    },

    TOGGLE_EDITING(state, newState) {
      // newState is expected to be a boolean indicating the desired editing state
      state.isEditing = newState;
  },
  
  
    

    UPDATE_PRODUCT(state, editedProduct) {
      const price = parseFloat(editedProduct.price);
      const quantity = parseInt(editedProduct.quantity, 10);
      state.product.name = editedProduct.name ?? "";
      state.product.code = editedProduct.code ?? "";
      state.product.description = editedProduct.description ?? "";
      state.product.price = isNaN(price) ? 0 : price; // Use 0 if NaN
      state.product.quantity = isNaN(quantity) ? 0 : quantity; // Use 0 if NaN
      state.product.category = editedProduct.category ?? editedProduct.category_name ?? "";
      state.product.photo = editedProduct.photo ?? "";
      state.product.ideal_count = editedProduct.ideal_count ?? "";
      state.product.unit_of_measurement = editedProduct.unit_of_measurement ?? "";
      state.product.remarks = editedProduct.remarks ?? "";
    },

    CLEAR_PRODUCT(state) {
      // Define default values for the product
      const defaultProduct = {
          name: "",
          code: "",
          description: "",
          price: 0,
          quantity: 0,
          category: "",
          photo: "",
          ideal_count: 0, // Assuming you want the default to be 0, adjust as necessary
          unit_of_measurement: "",
          remarks: "",
      };
  
      // Reset the product state to the default values
      state.product = { ...defaultProduct };
  },
  
    
    SET_PRODUCT(state, product) {
      state.product = product;
    },
    SET_PRODUCT_PHOTO(state, photoFileName) {
      state.product.photo = photoFileName;
    },
    RESET_STATE(state) {
      state.currentStep = 1;
      state.firebaseID = "";
      state.username = "";
      state.email = "";
      state.surname = "";
      state.firstName = "";
      state.middleName = "";
      state.gender = "";
      state.dob = "";
      state.phoneNumber = "";
    },

    RESET_AUTH(state) {
      state.accountType = "";
      state.token = "";
      state.userID = "";
    },

    updateCurrentStep(state, step) {
      state.currentStep = step;
    },

    incrementStep(state) {
      state.currentStep++;
    },
    decrementStep(state) {
      if (state.currentStep > 1) {
        state.currentStep--;
      }
    },

    REMOVE_FROM_CART(state, itemId) {
      state.cart = state.cart.filter((item) => item.id !== itemId);
    },
    CLEAR_CART(state) {
      state.cart = []; // Set the cart to an empty array
    },
  },
  actions: {

    updateCart({ commit }, products) {
      // Ensure products is always an array
      const productsArray = Array.isArray(products) ? products : [products];
      commit("UPDATE_CART", productsArray);
    },

    updateCartItemQuantity({ commit }, { productId, newQuantity }) {
      commit("UPDATE_CART_ITEM_QUANTITY", { productId, newQuantity });
    },

    // Manage Inventory
    toggleProductDialog({ commit }, value) {
      commit("SET_PRODUCT_DIALOG", value);
    },
    toggleUpdateQuantityDialog({ commit }, value) {
      commit("SET_UPDATE_QUANTITY_DIALOG", value);
    },
    setProduct({ commit }, product) {
      commit("SET_PRODUCT", product);
    },
    resetProduct({ commit }) {
      commit("CLEAR_PRODUCT");
    },
  },
  modules: {
    auth, pos, products
  },
});
