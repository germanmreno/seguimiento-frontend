import { api } from './api';

export const oficiosPresidenciaService = {
  getOficio: async (id) => {
    try {
      const response = await api.get(`/oficios-presidencia/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching oficio:', error);
      throw new Error(
        error.response?.data?.error || 'Error al obtener el oficio'
      );
    }
  },

  getAllOficios: async () => {
    try {
      const response = await api.get('/oficios-presidencia');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching oficios:', error);
      throw new Error(
        error.response?.data?.error || 'Error al obtener los oficios'
      );
    }
  },

  createOficio: async (formData) => {
    try {
      console.log('Creating oficio with data:', formData);

      // If elaboradoPor is an array, stringify it
      if (formData.elaboradoPor && Array.isArray(formData.elaboradoPor)) {
        formData.elaboradoPor = JSON.stringify(formData.elaboradoPor);
      }

      const response = await api.post('/oficios-presidencia', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Create oficio response:', response);
      return response.data;
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        request: error.request,
      });
      throw new Error(
        error.response?.data?.error || 'Error al crear el oficio'
      );
    }
  },

  updateOficio: async (id, data) => {
    try {
      const response = await api.put(`/oficios-presidencia/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating oficio:', error);
      throw new Error(
        error.response?.data?.error || 'Error al actualizar el oficio'
      );
    }
  },

  getOffices: async () => {
    try {
      const response = await api.get('/offices');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching offices:', error);
      throw new Error(
        error.response?.data?.error || 'Error al obtener las oficinas'
      );
    }
  },
};
