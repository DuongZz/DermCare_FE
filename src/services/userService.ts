import apiClient from '@/lib/apiClient';

export interface MedicalInfo {
    id: string;
    userId: string;
    skinType: string | null;
    bloodGroup: string | null;
    allergies: string | null;
    emergencyContact: string | null;
    currentMedications: string | null;
    chronicConditions: string | null;
    created_at: string;
    updated_at: string;
}

export interface UpdateMedicalInfoPayload {
    skinType?: string;
    bloodGroup?: string;
    allergies?: string;
    emergencyContact?: string;
    currentMedications?: string;
    chronicConditions?: string;
}

const userService = {
    getMedicalInfo: async () => {
        const response = await apiClient.get<{ success: boolean; data: MedicalInfo }>('/users/me/medical-info');
        return response.data;
    },

    updateMedicalInfo: async (data: UpdateMedicalInfoPayload) => {
        const response = await apiClient.patch<{ success: boolean; data: MedicalInfo }>('/users/me/medical-info', data);
        return response.data;
    },

    updateProfile: async (data: {
        fullName?: string;
        phone?: string;
        gender?: string;
        dateOfBirth?: string;
        address?: string;
    }) => {
        const response = await apiClient.patch<{ success: boolean; message: string }>('/users/me', data);
        return response.data;
    },

    getSpecializations: async (): Promise<{ specialization: string; doctorCount: number }[]> => {
        const response = await apiClient.get<{ success: boolean; data: { specialization: string; doctorCount: number }[] }>('/users/public-specialization');
        return response.data.data;
    },

    getUserStatistics: async () => {
        const response = await apiClient.get<{ success: boolean; data: { appointmentsCount: number; medicalRecordsCount: number; doctorsCount: number } }>('/users/me/statistics');
        return response.data;
    },
};



export default userService;
