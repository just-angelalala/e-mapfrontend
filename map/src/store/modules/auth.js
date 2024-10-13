import AuthenticationService from '@/service/AuthenticationService';
import { jwtDecode } from "jwt-decode";

const authenticationService = new AuthenticationService();

const state = {
    currentStep: 1,
    registrationForm: {
        email: '',
        lastName: '',
        firstName: '',
        middleName: '',
        dateOfBirth: '',
        gender: '',
        sitio: '',
        barangay: '',
        city: '',
        province: 'Oriental Mindoro',
        detailedAddress: '',
        latitude: '',
        longitude: '',
        phoneNumber: '',
        userImage: '',
        firebaseId: '',
        fcmToken: '',
    },
    registrationStatus: '',
    registrationError: null,
    selectedCity: null,
    selectedBarangay: null,
    fcmToken: null,
    accountType: "",
    token: "",
    userId: "",
};

const mutations = {
    UPDATE_FIELD(state, { field, value }) {
        state.registrationForm[field] = value;
    },
    REGISTRATION_REQUEST(state) {
        state.registrationStatus = 'loading';
    },
    REGISTRATION_SUCCESS(state) {
        state.registrationStatus = 'success';
        state.registrationForm = {};
    },
    REGISTRATION_FAILURE(state, error) {
        state.registrationStatus = 'error';
        state.registrationError = error;
    },
    RESET_STATE(state) {
        // Resetting each top-level property of the state manually
        state.currentStep = 1;
        state.registrationForm = {
            email: '',
            lastName: '',
            firstName: '',
            middleName: '',
            dateOfBirth: '',
            gender: '',
            sitio: '',
            barangay: '',
            city: '',
            province: 'Oriental Mindoro',
            detailedAddress: '',
            latitude: '',
            longitude: '',
            phoneNumber: '',
            firebaseId: '',
        };
        state.registrationStatus = '';
        state.registrationError = null;
        state.selectedCity = null;
        state.selectedBarangay = null;
    },
    // Mutations for step handling
    SET_STEP(state, step) {
        state.currentStep = step;
    },
    INCREMENT_STEP(state) {
        state.currentStep++;
    },
    DECREMENT_STEP(state) {
        if (state.currentStep > 1) {
            state.currentStep--;
        }
    },
    setAddressField(state, { field, value }) {
        if (field in state.addressInfo) {
            state.addressInfo[field] = value;
        }
    },
    setSelectedCity(state, city) {
        state.selectedCity = city;
        // Reset related address fields to ensure consistency
        state.registrationForm.city = city ? city.name : '';
        state.selectedBarangay = null; // Reset selected barangay when city changes
    },
    setSelectedBarangay(state, barangay) {
        state.selectedBarangay = barangay;
        state.registrationForm.barangay = barangay ? barangay.name : '';
        // Update latitude and longitude if available
        state.registrationForm.latitude = barangay && barangay.latitude ? barangay.latitude : '';
        state.registrationForm.longitude = barangay && barangay.longitude ? barangay.longitude : '';
    },
    UPDATE_FCM_TOKEN(state, newToken) {
        state.fcmToken = newToken;
    },
    SET_TOKEN(state, token) {
        state.token = token;
    },
    SET_ACCOUNT_TYPE(state, accountType) {
        state.accountType = accountType;
    },
    SET_TOKEN(state, token) {
        state.token = token;
    },
    SET_USER_ID(state, userId) {
        state.userId = userId;
    },
    RESET_AUTH(state) {
        state.accountType = "";
        state.token = "";
        state.userId = "";
    },
};

const actions = {
    async register({ commit, state }) {
        commit('REGISTRATION_REQUEST');
        try {
        const response = await authenticationService.registerCustomer(state.registrationForm);
        commit('REGISTRATION_SUCCESS');
        return response;
        } catch (error) {
        commit('REGISTRATION_FAILURE', error);
        throw error;
        }
    },
    updateField({ commit }, payload) {
        commit('UPDATE_FIELD', payload);
    },
    goToStep({ commit }, step) {
        commit('SET_STEP', step);
    },
    initializeAuth({ commit }) {
        // Try to read the stored data from 'my-app-store' in localStorage or sessionStorage
        const storedData = localStorage.getItem("my-app-store")
            ? JSON.parse(localStorage.getItem("my-app-store"))
            : sessionStorage.getItem("my-app-store")
            ? JSON.parse(sessionStorage.getItem("my-app-store"))
            : null;
        
            // Extract the token from the 'auth' module within the stored data
            const token = storedData?.auth?.token ?? null;
        
            if (token) {
            try {
                // Decode the JWT token to extract user details
                const decodedToken = jwtDecode(token);
                // Commit the account type, token, and user ID to the Vuex store
                console.log(decodedToken.role)
                commit("SET_ACCOUNT_TYPE", decodedToken.role);
                commit("SET_TOKEN", token);
                commit("SET_USER_ID", decodedToken.user_id);
            } catch (error) {
                console.error("Error decoding the token:", error);
                // Optionally handle the invalid token case, e.g., by clearing stored data or redirecting to login
            }
        }
    },
    async logout({ commit }) {
        commit("RESET_AUTH");
        localStorage.removeItem("my-app-store");
        sessionStorage.removeItem("my-app-store");
    },
};

const getters = {
    isAuthenticated: state => {
        return state.token !== null && state.token !== undefined;
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};