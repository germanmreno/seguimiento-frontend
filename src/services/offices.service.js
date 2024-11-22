import { api } from './api';

export const officesService = {
  getAllOffices: async () => {
    const response = await api.get('/offices');
    return response.data;
  },
};
