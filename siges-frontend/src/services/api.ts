import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api', // Base URL of your Django API
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // Or retrieved from state/context
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
