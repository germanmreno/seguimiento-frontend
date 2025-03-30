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

  refreshToken: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await api.post('/auth/refresh-token', { token });
      return response.data;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  },

  // Add interceptor to handle token refresh
  setupInterceptors: (logout) => {
    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Check if error is due to network connectivity
        if (!navigator.onLine) {
          // If offline, check if token exists and hasn't expired
          const token = localStorage.getItem('token');
          const user = JSON.parse(localStorage.getItem('user'));

          if (token && user) {
            // Allow the request to proceed with existing token
            return Promise.resolve({ data: { token, user } });
          }
        }

        // If error is 401 and we haven't tried to refresh token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const { token, user } = await authService.refreshToken();

            // Update token in localStorage and headers
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            authService.setAuthHeader(token);

            // Retry original request with new token
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          } catch (refreshError) {
            // Only logout if we're online and the refresh truly failed
            if (navigator.onLine) {
              logout();
            }
            throw refreshError;
          }
        }

        return Promise.reject(error);
      }
    );
  },

  // Add method to validate token expiration locally
  isTokenValid: () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      // Get the payload part of the JWT
      const payload = JSON.parse(atob(token.split('.')[1]));

      // Check if token has expired
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      return Date.now() < expirationTime;
    } catch (error) {
      return false;
    }
  },

  getUsers: async () => {
    try {
      const response = await api.get('/auth/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await api.patch(`/auth/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },
};
