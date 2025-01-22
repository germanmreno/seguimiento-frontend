import { api } from './api';
import { toast } from 'sonner';

export const puntosCuentaService = {
  getPunto: async (id) => {
    try {
      const response = await api.get(`/puntos-cuenta/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching punto:', error);
      throw new Error(
        error.response?.data?.error || 'Error al obtener el punto de cuenta'
      );
    }
  },

  getAllPuntos: async () => {
    try {
      const response = await api.get('/puntos-cuenta');
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        'Error al obtener los puntos de cuenta';
      toast.error(errorMessage);
      throw error;
    }
  },

  createPunto: async (formData) => {
    try {
      // Debug log all form data
      console.log('=== Form Data Being Sent ===');
      for (let [key, value] of formData.entries()) {
        console.log(
          `${key}:`,
          value instanceof File ? 'File: ' + value.name : value
        );
      }

      const response = await api.post('/puntos-cuenta', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Service error:', error.response?.data || error);
      throw new Error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          'Error al crear el punto de cuenta'
      );
    }
  },

  getOffices: async () => {
    try {
      const response = await api.get('/offices');
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Error al obtener las oficinas';
      toast.error(errorMessage);
      throw error;
    }
  },

  getDocumentUrl: (path) => {
    if (!path) return null;
    return `${api.defaults.baseURL}${path}`;
  },
};
