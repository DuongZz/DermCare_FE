import apiClient from '@/lib/apiClient';

export interface DoctorScheduleSlot {
    id: string;
    doctorId: string;
    availableDate: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
    price?: number;
    created_at: string;
    updated_at: string;
}

export interface CreateSchedulePayload {
    availableDate: string;
    startTime: string;
    endTime: string;
    price?: number;
}

// Get my schedule slots
export const getDoctorSchedule = async (): Promise<DoctorScheduleSlot[]> => {
    const { data } = await apiClient.get('/doctor/schedule');
    return data.data || data;
};

// Create new schedule slot
export const createScheduleSlot = async (payload: CreateSchedulePayload): Promise<DoctorScheduleSlot> => {
    const { data } = await apiClient.post('/doctor/schedule', payload);
    return data.data || data;
};

// Update schedule slot
export const updateScheduleSlot = async (
    id: string,
    payload: Partial<CreateSchedulePayload>
): Promise<DoctorScheduleSlot> => {
    const { data } = await apiClient.patch(`/doctor/schedule/${id}`, payload);
    return data.data || data;
};

// Delete schedule slot
export const deleteScheduleSlot = async (id: string): Promise<void> => {
    await apiClient.delete(`/doctor/schedule/${id}`);
};
