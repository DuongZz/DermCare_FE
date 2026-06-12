import apiClient from '@/lib/apiClient';

// ============================
// Types cũ (AI Bot)
// ============================
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

// ============================
// Types mới (Hybrid Conversation)
// ============================
export interface ConversationSender {
    id: string;
    fullName: string;
    role: string;
    avatar?: string;
    qualifications?: string;
}

export interface ConversationMessage {
    id: string;
    clientId?: string;
    content: string;
    type: string;
    timestamp: number;
    created_at: string;
    isAiMessage: boolean;
    conversationId: string;
    sender: ConversationSender;
}

export interface Conversation {
    id: string;
    type: string;
    status: string;
    lastMessage?: string;
    title?: string;
    unread?: boolean;
    diagnosisInfo?: any;
    created_at: string;
    updated_at: string;
    patient?: ConversationSender;
    doctor?: ConversationSender;
    appointment?: {
        id: string;
        appointmentDate?: string;
        appointmentTime?: string;
        medicalRecord?: any;
        feedback?: {
            id: string;
            rate: number;
            comment: string;
        };
    };
}

// ============================
// API REST cho Conversations
// ============================

/** Tạo hoặc lấy lại conversation AI đang chờ xử lý của bệnh nhân */
export const createAiConversation = async (): Promise<Conversation> => {
    const response = await apiClient.post<{ success: boolean; data: Conversation }>('/conversations/ai');
    return response.data.data;
};

/** Lấy danh sách conversations của user hiện tại với phân trang và lọc */
export const getConversations = async (status?: string, page: number = 1): Promise<{ conversations: Conversation[]; total: number }> => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('page', page.toString());

    const response = await apiClient.get<{ success: boolean; data: { conversations: Conversation[]; total: number } }>(
        `/conversations?${params.toString()}`
    );
    return response.data.data;
};

/** Lấy thông tin chi tiết của 1 conversation */
export const getConversationById = async (conversationId: string): Promise<Conversation> => {
    const response = await apiClient.get<{ success: boolean; data: Conversation }>(
        `/conversations/${conversationId}`
    );
    return response.data.data;
};

/** Lấy lich sử tin nhắn của 1 conversation */
export const getConversationMessages = async (conversationId: string): Promise<ConversationMessage[]> => {
    const response = await apiClient.get<{ success: boolean; data: ConversationMessage[] }>(
        `/conversations/${conversationId}/messages`
    );
    return response.data.data;
};

/** Xóa cuộc hội thoại (Chỉ áp dụng cho AI) */
export const deleteConversation = async (conversationId: string): Promise<void> => {
    await apiClient.delete(`/conversations/${conversationId}`);
};

// ============================
// Endpoint Phân Tích Hình Ảnh (AI)
// ============================
export interface AnalyzeAiResponse {
    diagnosisId: string;
    messageId: string;
    imageUrl: string;
    aiResult: {
        disease_name: string;
        disease_code: string;
        specialization: string;
        severity: string;
        description: string;
        recommendations: string[];
        should_see_doctor: boolean;
        confidence: number;
    }
}

/** Tải hình ảnh lên và/hoặc gửi mô tả bệnh cho AI phân tích */
export const analyzeAiCondition = async (conversationId: string, imageFile: File | null, description: string): Promise<AnalyzeAiResponse> => {
    const formData = new FormData();
    if (imageFile) {
        formData.append('file', imageFile);
    }
    if (description.trim()) {
        formData.append('description', description);
    }

    const response = await apiClient.post<{ success: boolean; data: AnalyzeAiResponse }>(
        `/conversations/${conversationId}/analyze`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 60000,
        }
    );
    return response.data.data;
};

// ============================
// Gợi ý bác sĩ theo chuyên khoa
// ============================
export interface DoctorResult {
    userId: string;
    fullName: string;
    email: string;
    avatar: string | null;
    specialization: string;
    qualifications: string | null;
    workPlace: string | null;
    rating: number;
}

export interface DoctorSchedule {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    availableDate: string;
    doctorId: string;
    isBooked: boolean;
    price?: number;
}

/** Lấy danh sách bác sĩ theo chuyên khoa (sau khi AI chẩn đoán) */
export const getDoctorsBySpecialization = async (specialization: string): Promise<DoctorResult[]> => {
    const response = await apiClient.get<{ success: boolean; data: DoctorResult[] }>(
        `/conversations/doctors?specialization=${encodeURIComponent(specialization)}`
    );
    return response.data.data;
};

/** Lấy lịch khám công khai của một bác sĩ */
export const getPublicDoctorSchedule = async (doctorId: string): Promise<DoctorSchedule[]> => {
    const response = await apiClient.get<{ success: boolean; data: any[] }>(
        `/users/doctors/${doctorId}/schedule`
    );
    // Map dữ liệu trả về từ backend (DoctorSchedule entity) sang DoctorSchedule interface FE
    const data = response.data.data || response.data;
    return data.map((slot: any) => ({
        id: slot.id,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        availableDate: slot.date, // Backend dùng 'date', FE mong đợi 'availableDate' ở một số chỗ
        isBooked: slot.isBooked,
        price: slot.price,
        doctorId: doctorId
    }));
};

/** Hoàn thành ca khám (Bác sĩ thực hiện) */
export const completeConversation = async (conversationId: string): Promise<Conversation> => {
    const response = await apiClient.post<{ success: boolean; data: Conversation }>(
        `/conversations/${conversationId}/complete`
    );
    return response.data.data;
};

/** Gửi đánh giá cho buổi tư vấn */
export const submitFeedback = async (conversationId: string, rating: number, comment: string): Promise<any> => {
    const response = await apiClient.post<{ success: boolean; data: any }>(
        `/conversations/${conversationId}/feedback`,
        { rate: rating, comment }
    );
    return response.data.data;
};

/** Lấy tất cả ảnh trong 1 cuộc hội thoại */
export const getConversationImages = async (conversationId: string): Promise<string[]> => {
    const response = await apiClient.get<{ success: boolean; data: string[] }>(
        `/conversations/${conversationId}/images`
    );
    return response.data.data;
};

/** Tạo hồ sơ bệnh án mới (Bác sĩ thực hiện) */
export const createMedicalRecord = async (data: {
    appointmentId: string;
    treatment: string;
    note: string;
    images: string[];
    patientInfo: any;
    doctorInfo: any;
}): Promise<any> => {
    const response = await apiClient.post<{ success: boolean; data: any }>(
        '/medical-records',
        data
    );
    return response.data.data;
};

/** Gửi tin nhắn mới (Văn bản hoặc Ảnh) trong cuộc hội thoại (Doctor/Patient) */
export const sendConversationMessage = async (
    conversationId: string,
    content: string,
    file?: File
): Promise<any> => {
    const formData = new FormData();
    if (content) formData.append('content', content);
    if (file) formData.append('file', file);

    const response = await apiClient.post<{ success: boolean; data: any }>(
        `/conversations/${conversationId}/messages`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return response.data.data;
};
