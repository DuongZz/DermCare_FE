import apiClient from '@/lib/apiClient';

export interface AppointmentDoctor {
    id: string;
    fullName: string;
    avatar: string | null;
    specialization: string | null;
    qualifications: string | null;
}


export interface Appointment {
    id: string;
    appointmentDate: string;
    appointmentTime: string;
    appointmentEndTime: string | null;
    appointmentStatus: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    price: number;
    note?: string;
    doctor: AppointmentDoctor | null;
    paymentStatus: 'PENDING' | 'PAID' | 'CANCELLED' | null;
    paymentMethod: 'MOMO' | 'ZALOPAY' | null;
    conversationId: string | null;
    // Legacy fields (giữ lại để không bị lỗi components cũ)
    status?: string;
    doctorName?: string;
    doctorAvatar?: string;
    specialty?: string;
    date?: string;
    time?: string;
    type?: string;
    reason?: string;
}

// Get appointments for current user with pagination and tab filtering
export const getMyAppointments = async (tab: 'upcoming' | 'past' = 'upcoming', page: number = 1, limit: number = 10): Promise<{ items: Appointment[], total: number, hasMore: boolean }> => {
    const { data } = await apiClient.get('/users/me/appointments', {
        params: { tab, page, limit }
    });
    return data.data || data;
};

export interface CreateAppointmentData {
    doctorId: string;
    date: string;
    time: string;
    symptoms?: string;
}

// Create appointment
export const createAppointment = async (appointmentData: CreateAppointmentData): Promise<Appointment> => {
    const { data } = await apiClient.post('/appointments', appointmentData);
    return data;
};

// Cancel appointment
export const cancelAppointment = async (appointmentId: string): Promise<void> => {
    await apiClient.patch(`/appointments/${appointmentId}/cancel`);
};

// Get appointment by ID
export const getAppointmentById = async (id: string): Promise<Appointment> => {
    const { data } = await apiClient.get(`/appointments/${id}`);
    return data;
};

// Book an appointment (Patient books a doctor)
export const bookAppointment = async (doctorId: string, payload: { appointmentDate: string; appointmentTime: string; conversationId?: string }): Promise<Appointment> => {
    const { data } = await apiClient.post(`/users/booking/${doctorId}`, payload);
    return data;
};

// Get or create conversation for appointment
export const getOrCreateConversation = async (appointmentId: string): Promise<{ id: string }> => {
    const { data } = await apiClient.get(`/conversations/appointments/${appointmentId}`);
    return data.data;
};
