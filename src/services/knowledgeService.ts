import apiClient from '@/lib/apiClient';

export interface KnowledgeResponse {
    answer: string;
    sources: string[];
}

/**
 * Truy vấn kiến thức từ hệ thống RAG thông qua Backend Proxy
 */
export const queryKnowledgeBase = async (question: string): Promise<KnowledgeResponse> => {
    const response = await apiClient.post<{ success: boolean; data: KnowledgeResponse }>(
        '/conversations/knowledge',
        { question },
        { timeout: 60000 }
    );
    return response.data.data;
};
