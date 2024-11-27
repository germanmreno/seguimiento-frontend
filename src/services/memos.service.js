import { api } from './api';
import { forumsService } from './forums.service';

export const memosService = {
  getMemo: async (id) => {
    const response = await api.get(`/memos/${id}`);
    return response.data;
  },

  getAllMemos: async (params = {}) => {
    const response = await api.get('/memos', { params });

    // Process each memo to properly check forum existence
    const memosWithForums = await Promise.all(
      response.data.map(async (memo) => {
        try {
          // Check if forum exists using the same method as ForumPage
          const forumExistence = await forumsService.checkForumExistence(
            memo.id
          );

          if (forumExistence.exists) {
            // Get forum details if it exists
            const forumDetails = await forumsService.getForum(
              forumExistence.id
            );
            return {
              ...memo,
              forum: {
                id: forumDetails.id,
                status: forumDetails.status || 'CLOSED',
                title: forumDetails.title,
                description: forumDetails.description,
                createdAt: forumDetails.createdAt,
                updatedAt: forumDetails.updatedAt,
                canAccess: true, // This will be filtered at component level if needed
              },
              forums: undefined,
            };
          }

          return {
            ...memo,
            forum: null,
            forums: undefined,
          };
        } catch (error) {
          console.error(`Error checking forum for memo ${memo.id}:`, error);
          return {
            ...memo,
            forum: null,
            forums: undefined,
          };
        }
      })
    );

    return memosWithForums;
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

  updateMemoStatus: async (id, status, user) => {
    try {
      const response = await api.patch(`/memos/${id}/status`, {
        status,
        user: {
          role: user.role,
          office_id: user.office_id,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating memo status:', error);
      throw error;
    }
  },

  assignInstruction: async (id, instruction, officeIds, user) => {
    const response = await api.patch(`/memos/${id}/instruction`, {
      instruction,
      officeIds,
      user,
    });
    return response.data;
  },

  getAllMemosWithFilters: async (userData, params = {}) => {
    try {
      const response = await api.get('/memos', { params });

      // Process memos based on user role and instruction status
      let filteredMemos = await Promise.all(
        response.data.map(async (memo) => {
          try {
            const forumExistence = await forumsService.checkForumExistence(
              memo.id
            );
            const forumDetails = forumExistence.exists
              ? await forumsService.getForum(forumExistence.id)
              : null;

            const memoWithForum = {
              ...memo,
              forum: forumDetails
                ? {
                    id: forumDetails.id,
                    status: forumDetails.status,
                    title: forumDetails.title,
                    description: forumDetails.description,
                    createdAt: forumDetails.createdAt,
                    updatedAt: forumDetails.updatedAt,
                    canAccess:
                      userData.role === 'ADMIN' ||
                      memo.offices.some(
                        (office) => office.office_id === userData.office_id
                      ),
                  }
                : null,
            };

            // Return null for memos that should be filtered out
            if (
              memo.instruction_status === 'PENDING' &&
              !['ADMIN', 'VICEPRESIDENCIA', 'PRESIDENCIA'].includes(
                userData.role
              ) &&
              userData.office_id !== '101' && // VICEPRESIDENCIA
              userData.office_id !== '100'
            ) {
              // PRESIDENCIA
              return null;
            }

            return memoWithForum;
          } catch (error) {
            console.error(`Error processing memo ${memo.id}:`, error);
            return null;
          }
        })
      );

      // Filter out null values and return
      return filteredMemos.filter((memo) => memo !== null);
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

  getOffices: async () => {
    try {
      const response = await api.get('/offices');
      return response.data;
    } catch (error) {
      console.error('Error fetching offices:', error);
      throw error;
    }
  },

  getOffice: async (id) => {
    try {
      const response = await api.get(`/offices/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching office:', error);
      throw error;
    }
  },
};
