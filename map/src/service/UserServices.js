import axios from '@/api/axios';

export default class UserServices {
    getNameAndPhoto(userId) {
        return axios.get(`/auth/getNameAndPhoto/${userId}`)
                .then((res) => res.data)
                .then((d) => d.data);
    }
    viewProfile(userId) {
        return axios.get(`/auth/viewProfile/${userId}`)
                .then((res) => res.data)
                .then((d) => d.data);
    }

    async editProfile(data) {
        try {
            const response = await axios.post('/auth/editProfile', data);
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
