import apiClient from '@/lib/apiClient';

export interface Appointment {
    id: string;
    doctorId?: string;
    patientId?: string;
    date: string;
    time: string;
    status: 'upcoming' | 'pending' | 'confirmed' | 'completed' | 'cancelled';
    symptoms?: string;
    notes?: string;
    doctorName: string;
    doctorAvatar: string;
    specialty: string;
    type: "online" | "offline";
    reason: string;
}

export interface CreateAppointmentData {
    doctorId: string;
    date: string;
    time: string;
    symptoms?: string;
}

// Get appointments for current user
export const getMyAppointments = async (): Promise<Appointment[]> => {
    const { data } = await apiClient.get('/users/me/appointments');
    return data.data || data;
};

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
export const bookAppointment = async (doctorId: string, payload: { appointmentDate: string; appointmentTime: string }): Promise<Appointment> => {
    const { data } = await apiClient.post(`/users/booking/${doctorId}`, payload);
    return data;
};
