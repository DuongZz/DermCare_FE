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

// Get all doctors
export const getDoctors = async (): Promise<Doctor[]> => {
    const { data } = await apiClient.get('/doctors');
    return data;
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
