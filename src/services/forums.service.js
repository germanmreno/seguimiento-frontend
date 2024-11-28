import { api } from './api';
import { memosService } from './memos.service';

export const forumsService = {
  checkForumExistence: async (memoId) => {
    const response = await api.get(`/forums/check-existence/${memoId}`);
    return response.data;
  },

  getForum: async (id) => {
    const response = await api.get(`/forums/${id}`);
    return response.data;
  },

  getForumMessages: async (forumId) => {
    const response = await api.get(`/forums/${forumId}/messages`);
    return response.data;
  },

  getAllForumsWithMessages: async (userData) => {
    try {
      const hasFullAccess =
        userData.role === 'ADMIN' ||
        userData.office_id === '110' || // SEGUIMIENTO Y CONTROL
        userData.office_id === '101' || // VICEPRESIDENCIA
        userData.office_id === '100'; // PRESIDENCIA

      const params = hasFullAccess
        ? { role: userData.role }
        : {
            office_id: userData.office_id,
            role: userData.role,
          };

      const memosResponse = await api.get('/memos', { params });
      const memos = memosResponse.data;

      const forumsPromises = memos.map(async (memo) => {
        try {
          const forumExists = await forumsService.checkForumExistence(memo.id);

          if (forumExists.exists) {
            const forum = await forumsService.getForum(forumExists.id);
            const messages = await forumsService.getForumMessages(
              forumExists.id
            );

            return {
              ...forum,
              messageCount: messages.length,
              lastMessageAt:
                messages.length > 0
                  ? messages[messages.length - 1].createdAt
                  : null,
            };
          }
          return null;
        } catch (error) {
          console.error(`Error fetching forum for memo ${memo.id}:`, error);
          return null;
        }
      });

      const results = await Promise.all(forumsPromises);
      const validForums = results.filter((forum) => forum !== null);

      return validForums;
    } catch (error) {
      console.error('Error fetching forums:', error);
      throw error;
    }
  },

  filterForums: (forums, { searchTerm, status, urgency, date }) => {
    let filteredResults = [...forums];

    if (searchTerm) {
      filteredResults = filteredResults.filter(
        (forum) =>
          forum.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          forum.memo_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          forum.memoDetails?.instruction
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (status !== 'all') {
      filteredResults = filteredResults.filter(
        (forum) => forum.status === status
      );
    }

    if (urgency !== 'all') {
      filteredResults = filteredResults.filter(
        (forum) => forum.memoDetails?.urgencyLevel?.toUpperCase() === urgency
      );
    }

    if (date) {
      const selectedDateStr = date.toDateString();
      filteredResults = filteredResults.filter((forum) => {
        const forumDate = new Date(forum.createdAt).toDateString();
        return forumDate === selectedDateStr;
      });
    }

    return filteredResults;
  },

  getForumDetails: async (id) => {
    try {
      const response = await api.get(`/forums/${id}`);
      const forum = response.data;

      return {
        ...forum,
        messageCount: forum.messages?.length || 0,
        lastMessageAt:
          forum.messages?.length > 0
            ? forum.messages[forum.messages.length - 1].createdAt
            : null,
      };
    } catch (error) {
      console.error('Error fetching forum details:', error);
      throw error;
    }
  },

  deleteForumMessage: async (forumId, messageId, userId) => {
    try {
      const response = await api.delete(
        `/forums/${forumId}/messages/${messageId}`,
        {
          data: { user_id: userId },
        }
      );

      // Wait a moment before returning to ensure the deletion is complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      return { success: true, message: 'Mensaje eliminado correctamente' };
    } catch (error) {
      // Only throw if it's a real error, not a 404
      if (error.response?.status !== 404) {
        console.error('Error deleting message:', error);
        throw error.response?.data || { error: 'Error al eliminar el mensaje' };
      }
      // If it's a 404, still return success since the message is gone
      return { success: true, message: 'Mensaje eliminado correctamente' };
    }
  },

  createForum: async (forumData, user) => {
    try {
      // Validate input
      if (!forumData.title || !forumData.description || !forumData.memo_id) {
        throw new Error('Missing required fields');
      }

      const response = await api.post('/forums', {
        ...forumData,
        user_id: {
          id: user.id,
          role: user.role,
          office_id: user.office_id,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error creating forum:', error);
      if (error.response?.data?.details) {
        throw new Error(error.response.data.details);
      }
      throw new Error('Error al crear el foro. Por favor, intente nuevamente.');
    }
  },

  sendForumMessage: async (forumId, formData) => {
    try {
      const response = await api.post(`/forums/${forumId}/messages`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // If we got a response with data or success=true, consider it successful
      if (response.data && (response.data.id || response.data.success)) {
        return response.data;
      }

      throw new Error('Failed to send message');
    } catch (error) {
      console.error('Error sending message:', error);
      // Only throw if it's a real error
      if (!error.response?.data?.success) {
        throw error;
      }
      return { success: true };
    }
  },

  updateForumStatus: async (forumId, newStatus) => {
    try {
      const response = await api.patch(`/forums/${forumId}/status`, {
        status: newStatus,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating forum status:', error);
      throw error;
    }
  },
};
