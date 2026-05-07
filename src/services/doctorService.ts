import apiClient from '@/lib/apiClient';

export interface Doctor {
    id: string;
    name: string;
    specialty: string;
    experience: number;
    rating: number;
    avatar?: string;
    bio?: string;
    price: number;
}

export interface DoctorAppointment {
    id: string;
    patientId: string;
    doctorId: string;
    appointmentDate: string;
    appointmentTime: string;
    appointmentStatus: string;
    note: string;
    price: number;
    paymentStatus: string;
    conversationId?: string;
    created_at: string;
    updated_at: string;
    patient?: {
        id: string;
        fullName: string;
        email: string;
        phone?: string;
        gender?: string;
        address?: string;
        dateOfBirth?: string;
    };
}

export interface PublicDoctor {
    user_id: string;
    avatar: string | null;
    specialization: string | null;
    qualifications: string | null;
    workPlace: string | null;
    rating: number;
    user: {
        fullName: string;
        email: string;
    };
}

// Get all doctors
export const getDoctors = async (): Promise<Doctor[]> => {
    const { data } = await apiClient.get('/doctors');
    return data;
};

// Get public doctors catalog
export const getPublicDoctors = async (): Promise<PublicDoctor[]> => {
    try {
        const { data } = await apiClient.get('/doctors');
        return data?.data || [];
    } catch (error) {
        console.error('Failed to fetch public doctors:', error);
        return [];
    }
};

// Get ALL doctors (public)
export const getAllDoctors = async (): Promise<PublicDoctor[]> => {
    try {
        const { data } = await apiClient.get('/doctors');
        return data?.data || [];
    } catch (error) {
        console.error('Failed to fetch all doctors:', error);
        return [];
    }
};

// Get doctor by ID
export const getDoctorById = async (id: string): Promise<Doctor> => {
    const { data } = await apiClient.get(`/doctors/${id}`);
    return data;
};

// Search doctors
export const searchDoctors = async (query: string): Promise<Doctor[]> => {
    const { data } = await apiClient.get('/doctors/search', {
        params: { q: query },
    });
    return data;
};

// === Doctor Role: Appointment Management ===

// Get my appointments as a doctor
export const getDoctorAppointments = async (): Promise<DoctorAppointment[]> => {
    const { data } = await apiClient.get('/appointments/me');
    return data.appointments || data.data || data;
};

// Update appointment status (confirm, cancel, complete)
export const updateAppointmentStatus = async (
    appointmentId: string,
    status: string
): Promise<DoctorAppointment> => {
    const { data } = await apiClient.patch(`/doctor/appointments/${appointmentId}/status`, { status });
    return data.data || data;
};

// Update appointment details (date, time, price)
export const updateAppointmentDetails = async (
    appointmentId: string,
    details: { appointmentDate?: string; appointmentTime?: string; price?: number }
): Promise<DoctorAppointment> => {
    const { data } = await apiClient.patch(`/doctor/appointments/${appointmentId}`, details);
    return data.data || data;
};
