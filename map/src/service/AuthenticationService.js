import axios from 'axios';

const apiBaseUrl = `${import.meta.env.VITE_API_BASE_URL}/auth`;

export default class AuthenticationService {
    constructor() {
        this.apiClient = axios.create({
            baseURL: apiBaseUrl,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async registerCustomer(customerData) {
        try {
            const response = await this.apiClient.post('/registerCustomer', customerData);
            return response.data;
        } catch (error) {
            console.error('Registration failed:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    async registerByAdmin(customerData) {
        try {
            const response = await this.apiClient.post('/registerByAdmin', customerData);
            return response.data;
        } catch (error) {
            console.error('Registration failed:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    async login(idToken, fcmToken = '') {
        try {
            const response = await this.apiClient.post('/login', {
                idToken,
                fcmToken,
            });
            return response.data;
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    // Implement additional authentication or user management methods here
}
