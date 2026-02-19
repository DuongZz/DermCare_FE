import apiClient from '@/lib/apiClient';

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    image?: string;
    timestamp: string;
}

export interface ChatRequest {
    message: string;
    image?: File;
    sessionId?: string;
}

export interface ChatResponse {
    message: string;
    sessionId: string;
    suggestions?: string[];
}

// Send chat message to AI
export const sendChatMessage = async (chatRequest: ChatRequest): Promise<ChatResponse> => {
    const formData = new FormData();
    formData.append('message', chatRequest.message);

    if (chatRequest.image) {
        formData.append('image', chatRequest.image);
    }

    if (chatRequest.sessionId) {
        formData.append('sessionId', chatRequest.sessionId);
    }

    const { data } = await apiClient.post('/ai/chat', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return data;
};

// Get chat history
export const getChatHistory = async (sessionId: string): Promise<Message[]> => {
    const { data } = await apiClient.get(`/ai/chat/${sessionId}`);
    return data;
};

// Get all chat sessions
export const getChatSessions = async (): Promise<any[]> => {
    const { data } = await apiClient.get('/ai/sessions');
    return data;
};
