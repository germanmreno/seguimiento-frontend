import { api } from './api';

export const memosService = {
  getMemo: async (id) => {
    const response = await api.get(`/memos/${id}`);
    return response.data;
  },

  getAllMemos: async (params = {}) => {
    const response = await api.get('/memos', { params });
    return response.data.map((memo) => ({
      ...memo,
      forum:
        Array.isArray(memo.forums) && memo.forums.length > 0
          ? { ...memo.forums[0], status: memo.forums[0].status || 'OPEN' }
          : null,
      forums: undefined,
    }));
  },

  createMemo: async (formData) => {
    try {
      const response = await api.post('/memos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating memo:', error);
      throw error;
    }
  },

  updateMemoStatus: async (id, status) => {
    const response = await api.patch(`/memos/${id}/status`, { status });
    return response.data;
  },

  assignInstruction: async (id, instruction) => {
    const response = await api.patch(`/memos/${id}/instruction`, {
      instruction,
    });
    return response.data;
  },

  getAllMemosWithFilters: async (userData, filters = {}) => {
    try {
      const response = await api.get('/memos', {
        params: {
          office_id: userData.office_id,
          role: userData.role,
          ...filters,
        },
      });

      return response.data.map((memo) => ({
        ...memo,
        forum:
          Array.isArray(memo.forums) && memo.forums.length > 0
            ? { ...memo.forums[0], status: memo.forums[0].status || 'OPEN' }
            : null,
        forums: undefined,
        status: memo.status || 'PENDING',
        instruction_status: memo.instruction_status || 'PENDING',
      }));
    } catch (error) {
      console.error('Error fetching memos:', error);
      throw error;
    }
  },

  filterMemos: (memos, { searchTerm, status }) => {
    let filteredResults = [...memos];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filteredResults = filteredResults.filter(
        (memo) =>
          memo.name.toLowerCase().includes(search) ||
          memo.id.toLowerCase().includes(search) ||
          memo.instruction?.toLowerCase().includes(search)
      );
    }

    if (status && status !== 'all') {
      filteredResults = filteredResults.filter(
        (memo) => memo.status === status
      );
    }

    return filteredResults;
  },
};
