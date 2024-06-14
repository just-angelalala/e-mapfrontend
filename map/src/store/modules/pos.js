import SessionService from "@/service/SessionService";
import POSService from "@/service/POSService";

const sessionService = new SessionService();
const posService = new POSService();

const state = {
  isLoading: false,
  successMessage: "",
  startSessionData: {
    initial_cash: "",
    notes: "",
  },
  errorMessage: "",
  currentSessionId: "",
  currentOrderId: "",
  sessions: [],
  sessionDetails: null, // Add sessionDetails state to store fetched session details
};

const mutations = {
  SET_START_SESSION_FIELD(state, { field, value }) {
    if (field in state.startSessionData) {
      state.startSessionData[field] = value;
    }
  },
  START_LOADING(state) {
    state.isLoading = true;
    state.errorMessage = "";
    state.successMessage = "";
  },
  STOP_LOADING(state) {
    state.isLoading = false;
  },
  SET_SUCCESS_MESSAGE(state, message) {
    state.successMessage = message;
  },
  SET_ERROR_MESSAGE(state, message) {
    state.errorMessage = message;
  },
  SET_CURRENT_SESSION_ID(state, currentSessionId) {
    state.currentSessionId = currentSessionId;
  },
  SET_CURRENT_ORDER_ID(state, currentOrderId) {
    state.currentOrderId = currentOrderId;
  },
  CLEAR_SESSION_DATA(state) {
    state.startSessionData = {
      initial_cash: "",
      notes: "",
    };
  },
  setSessions(state, sessions) {
    state.sessions = sessions;
  },
  setSessionDetails(state, sessionDetails) {
    state.sessionDetails = sessionDetails;
  },
};

const actions = {
  async startSession({ commit, rootState, state }) {
    commit("START_LOADING");
    const token = rootState.auth.token;
    const startSessionData = state.startSessionData;

    try {
      const response = await sessionService.startSession(
        startSessionData,
        token
      );

      if (response.status === "success") {
        await commit(
          "SET_SUCCESS_MESSAGE",
          response.message || "User created successfully."
        );
        await commit("SET_CURRENT_SESSION_ID", response.data.session_id);
        await commit("SET_CURRENT_ORDER_ID", response.data.order_id);
        await commit("CLEAR_SESSION_DATA");
      } else {
        commit(
          "SET_ERROR_MESSAGE",
          response.message || "Failed to create user due to an unknown error."
        );
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const { message } = error.response.data;
        commit("SET_ERROR_MESSAGE", message || "Failed to create user.");
      } else {
        commit(
          "SET_ERROR_MESSAGE",
          "Failed to create user due to a network or server issue."
        );
      }
    } finally {
      commit("STOP_LOADING");
    }
  },
  async fetchSessions({ commit, rootState }) {
    try {
      const token = rootState.auth.token; // Assuming you have auth module in your Vuex store
      const sessions = await sessionService.fetchSessions(token); // Pass the token here

      // Commit mutation to update sessions state with fetched data
      commit("setSessions", sessions.data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      throw error; // Optionally rethrow error to handle it in the component
    }
  },
  async getSessionDetails({ commit, rootState }, sessionId) {
    try {
      const token = rootState.auth.token; // Get token from rootState
      const sessionDetails = await sessionService.getSessionDetails(
        sessionId,
        token
      );

      // Commit mutation to update sessionDetails state with fetched data
      commit("setSessionDetails", sessionDetails.data);
    } catch (error) {
      console.error("Error fetching session details:", error);
      throw error; // Optionally rethrow error to handle it in the component
    }
  },
  async addOrder({ commit, rootState }, orderData) {
    try {
      const orderDatas = { id: orderData }; // Construct the orderData object with the session ID
      const orderResponse = await posService.addOrder(orderDatas);

      await commit("SET_CURRENT_ORDER_ID", orderResponse.data.order_id);
    } catch (error) {
      // Handle any errors that occur during the request
      console.error("Error adding order:", error);
      throw error; // Rethrow the error to handle it in the component or catch it in the component
    }
  },

  async updateOrder({ commit, rootState }, { orderId, orderDetails }) {
    try {
      const response = await posService.updateOrder(orderId, orderDetails);
      return response;
    } catch (error) {
      console.error("Error adding order details and updating total:", error);
      throw error;
    }
  },
};

const getters = {
  isLoading: (state) => state.isLoading,
  successMessage: (state) => state.successMessage,
  errorMessage: (state) => state.errorMessage,
  initial_cash: (state) => state.initial_cash,
  notes: (state) => state.startSessionData.notes,
  sessions: (state) => state.sessions,
  sessionDetails: (state) => state.sessionDetails,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
