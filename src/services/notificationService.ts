import apiClient from '@/lib/apiClient';

export const notificationService = {
    getNotifications: async () => {
        const { data } = await apiClient.get('/notifications');
        return data.data || data;
    },

    markAsRead: async (id: string) => {
        const { data } = await apiClient.patch(`/notifications/${id}/read`);
        return data.data || data;
    },

    markAllAsRead: async () => {
        const { data } = await apiClient.patch('/notifications/read-all');
        return data.data || data;
    },
};
