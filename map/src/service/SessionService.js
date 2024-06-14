import axios from "axios";

const apiBaseUrl = `${import.meta.env.VITE_API_BASE_URL}/session`;

export default class SessionService {
  constructor() {
    this.apiClient = axios.create({
      baseURL: apiBaseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async startSession(userData, token) {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await this.apiClient.post("/startSession", userData, {
        headers,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating starting session: ", error);
      throw error;
    }
  }

  async fetchSessions(token) {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await this.apiClient.get("/fetchSessions", { headers });
      return response.data;
    } catch (error) {
      console.error("Error fetching sessions: ", error);
      throw error;
    }
  }
  async getSessionDetails(sessionId, token) {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await this.apiClient.get(
        `/getSessionDetails/${sessionId}`,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching session details: ", error);
      throw error;
    }
  }
}
