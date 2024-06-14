import axios from '@/api/axios';
const apiBaseUrl = `${import.meta.env.VITE_API_BASE_URL}/session`;


export default class NodeService {

    constructor() {
        this.apiClient = axios.create({
            baseURL: apiBaseUrl,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async getSessionDetails(sessionId, token) {
        const headers = {
            'Authorization': `Bearer ${token}`
        };

        try {
            const response = await this.apiClient.get(`/getSessionDetails/${sessionId}`, { headers });
            return response.data;
        } catch (error) {
            console.error("Error fetching session details: ", error);
            throw error;
        }
    }

    getTreeNodes() {
        return fetch('demo/data/treenodes.json')
            .then((res) => res.json())
            .then((d) => d.root);
    }
}
