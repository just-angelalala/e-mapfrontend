import axios from '@/api/axios';

export default class OrderServices {
    // Method to process checkout
    checkout(orderData) {
        return axios.post('/ecommerce/checkout', orderData)
            .then(res => res.data)
            .catch(err => {
                // Handle errors here if needed
                throw err;
            });
    }

    getOrdersWithDetails() {
        return axios.get('/ecommerce/getOrdersWithDetails')
            .then(res => res.data)
            .catch(err => {
                // Handle errors here if needed
                throw err;
            });
    }

    getFeedbacks() {
        return axios.get('/ecommerce/getFeedbacks')
            .then(res => res.data)
            .catch(err => {
                // Handle errors here if needed
                throw err;
            });
    }
    
    getOrdersWithDetailsForCustomer(id) {
        return axios.get(`/ecommerce/getOrdersWithDetailsForCustomer/${id}`)
            .then(res => res.data)
            .catch(err => {
                // Handle errors here if needed
                throw err;
            });
    }

    setOrderForPickup(orderData) {
        return axios.post('/ecommerce/setOrderForPickup', orderData)
            .then(res => res.data)
            .catch(err => {
                // Handle errors here if needed
                throw err;
            });
    }

    markOrderAsFinished(orderData) {
        return axios.post('/ecommerce/markOrderAsFinished', orderData)
            .then(res => res.data)
            .catch(err => {
                // Handle errors here if needed
                throw err;
            });
    }

    submitFeedback(orderData) {
        return axios.post('/ecommerce/submitFeedback', orderData)
            .then(res => res.data)
            .catch(err => {
                // Handle errors here if needed
                throw err;
            });
    }

    downloadReport(reportData) {
        return axios.post('/ecommerce/generateProductReport', reportData, {
            responseType: 'blob' // Ensures that the response is handled as a Blob
        }).then(response => {
            const contentType = response.headers['content-type'];
            
            if (contentType && contentType.includes('application/pdf')) {
                // Handle PDF content
                const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
                window.open(url, '_blank'); // Open PDF in a new tab
            } else {
                // Assume response is an Excel file
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${reportData.fileName}.xlsx`);
                document.body.appendChild(link);
                link.click();
                link.remove();
            }
        }).catch(err => {
            console.error('Error downloading report:', err);
            throw err;
        });
    }
    
    

    previewReport(reportData) {
        return axios.post('/ecommerce/previewReport', reportData)
            .then(res => res.data)
            .catch(err => {
                // Handle errors here if needed
                console.error('Error previewing report:', err);
                throw err;
            });
    }

    updateOrderStatusIfNotPickedUp() {
        return axios.post('/ecommerce/updateOrderStatusIfNotPickedUp')
            .then(res => res.data)
            .catch(err => {
                console.error('Error updating order status:', err);
                throw err;
            });
    }
    
    
}