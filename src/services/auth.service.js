import { api } from './api';

export const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post(
        '/auth/login',
        JSON.stringify({ username, password }),
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  setAuthHeader: (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  },

  // Optional: Add method to check if token is valid
  validateToken: async () => {
    try {
      const response = await api.get('/auth/validate');
      return response.data;
    } catch (error) {
      console.error('Token validation error:', error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  getOffices: async () => {
    try {
      const response = await api.get('/offices');
      return response.data;
    } catch (error) {
      console.error('Error fetching offices:', error);
      throw error;
    }
  },
};
