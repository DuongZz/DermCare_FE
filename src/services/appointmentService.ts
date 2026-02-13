import apiClient from '@/lib/apiClient';

export interface Appointment {
    id: string;
    doctorId: string;
    patientId: string;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    symptoms?: string;
    notes?: string;
}

export interface CreateAppointmentData {
    doctorId: string;
    date: string;
    time: string;
    symptoms?: string;
}

// Get appointments for current user
export const getMyAppointments = async (): Promise<Appointment[]> => {
    const { data } = await apiClient.get('/appointments/my');
    return data;
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
