import apiClient from '@/lib/apiClient';

interface CreatePaymentResponse {
    payUrl: string;
    orderId: string;
}

export const createMomoPayment = async (appointmentId: string): Promise<CreatePaymentResponse> => {
    const { data } = await apiClient.post('/payments/momo/create', { appointmentId });
    return data.data; // trả về cục data chứa payUrl
};

export const checkPaymentTimeout = async (appointmentId: string): Promise<any> => {
    const { data } = await apiClient.post('/payments/check-timeout', { appointmentId });
    return data;
};
