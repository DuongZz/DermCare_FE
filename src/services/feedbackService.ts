import apiClient from '@/lib/apiClient';

export interface PublicFeedback {
    id: string;
    rate: number;
    comment: string;
    patientName: string;
    doctorName: string;
    created_at: string;
}

export const getPublicFeedbacks = async (): Promise<PublicFeedback[]> => {
    try {
        const { data } = await apiClient.get('/feedbacks/public');
        return data.data || data;
    } catch (error) {
        console.error('Failed to fetch public feedbacks:', error);
        return [];
    }
};
