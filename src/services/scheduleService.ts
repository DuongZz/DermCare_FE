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
export const getDoctorSchedule = async (date?: string): Promise<DoctorScheduleSlot[]> => {
    // If date is provided, append it as a query param
    const { data } = await apiClient.get('/doctors/schedule', { params: { date } });
    return data.data || data;
};

// Get public schedule for a specific doctor (User module feature)
export const getAvailableDoctorSchedule = async (doctorId: string): Promise<DoctorScheduleSlot[]> => {
    const { data } = await apiClient.get(`/users/doctor-schedule/${doctorId}`);
    return data.data || data;
};

export const createScheduleSlot = async (payload: CreateSchedulePayload): Promise<DoctorScheduleSlot> => {
    // Backend expects 'date', not 'availableDate'
    const requestPayload = {
        date: payload.availableDate,
        startTime: payload.startTime,
        endTime: payload.endTime,
        price: payload.price
    };
    const { data } = await apiClient.post('/doctors/schedule', requestPayload);
    return data.data || data;
};

// Auto generate schedule for a specific date based on templates
export const autoGenerateSchedule = async (date: string): Promise<any> => {
    const { data } = await apiClient.post('/doctors/schedule', { date });
    return data;
};

// Update schedule slot
export const updateScheduleSlot = async (
    id: string,
    payload: Partial<CreateSchedulePayload>
): Promise<DoctorScheduleSlot> => {
    const { data } = await apiClient.patch(`/doctors/schedule/${id}`, payload);
    return data.data || data;
};

// Delete schedule slot
export const deleteScheduleSlot = async (id: string): Promise<void> => {
    await apiClient.delete(`/doctors/schedule/${id}`);
};

export interface DayTemplateInput {
    dayOfWeek: string;
    isAvailable: boolean;
    morningStartTime: string;
    morningEndTime: string;
    afternoonStartTime: string;
    afternoonEndTime: string;
    slotDuration: number;
    price: number;
}

// Create work template
export const createWorkTemplate = async (payload: DayTemplateInput[]): Promise<any> => {
    const { data } = await apiClient.post('/doctors/work-template', payload);
    return data;
};
