import { api } from './api';

export const sentMemosService = {
  createSentMemo: async (formData) => {
    try {
      // First create the memo
      const response = await api.post('/sent-memos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Initial Response:', response.data);

      // If we don't get an ID, something went wrong
      if (!response.data.id) {
        throw new Error('Error al crear el memo');
      }

      // Wait a moment for the PDF to be generated
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Use the same endpoint that works in VerifyMemoPage
      const updatedResponse = await api.get(
        `/sent-memos/verify/${response.data.id}`
      );
      console.log('Updated Response:', updatedResponse.data);

      if (!updatedResponse.data.pdfWithQR) {
        // Maybe we need to wait a bit longer
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const finalResponse = await api.get(
          `/sent-memos/verify/${response.data.id}`
        );

        if (!finalResponse.data.pdfWithQR) {
          throw new Error('Error al generar el documento con QR');
        }

        return finalResponse.data;
      }

      return updatedResponse.data;
    } catch (error) {
      console.error('Error creating sent memo:', error);
      throw (
        error.response?.data?.error || error.message || 'Error al crear el memo'
      );
    }
  },

  getSentMemo: async (id) => {
    try {
      const response = await api.get(`/sent-memos/verify/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sent memo:', error);
      throw error;
    }
  },

  getSentMemos: async () => {
    try {
      const response = await api.get('/sent-memos/all');
      console.log('Fetched sent memos:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching sent memos:', error);
      throw error.response?.data?.message || 'Error al cargar los documentos';
    }
  },
};
