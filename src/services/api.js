import axios from 'axios';

// In development, use the full URL
const BASE_URL = 'http://localhost:3005';

export const api = axios.create({
  baseURL: `${BASE_URL}/api`, // Add /api prefix
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
