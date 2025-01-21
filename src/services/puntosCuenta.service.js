import { api } from './api';

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
      console.error('Error fetching puntos:', error);
      throw new Error(
        error.response?.data?.error || 'Error al obtener los puntos de cuenta'
      );
    }
  },

  createPunto: async (data) => {
    try {
      const response = await api.post('/puntos-cuenta', data);
      return response.data;
    } catch (error) {
      console.error('Error creating punto:', error);
      throw new Error(
        error.response?.data?.error || 'Error al crear el punto de cuenta'
      );
    }
  },

  getOffices: async () => {
    try {
      const response = await api.get('/offices');
      return response.data;
    } catch (error) {
      console.error('Error fetching offices:', error);
      throw new Error(
        error.response?.data?.error || 'Error al obtener las oficinas'
      );
    }
  },
};
