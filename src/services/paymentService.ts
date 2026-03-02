import apiClient from '@/lib/apiClient';

interface CreatePaymentResponse {
    payUrl: string;
    orderId?: string;
    appTransId?: string;
}

export const createMomoPayment = async (appointmentId: string): Promise<CreatePaymentResponse> => {
    const { data } = await apiClient.post('/payments/momo/create', { appointmentId });
    return data.data;
};

export const createZaloPayment = async (appointmentId: string): Promise<CreatePaymentResponse> => {
    const { data } = await apiClient.post('/payments/zalopay/create', { appointmentId });
    return data.data;
};

export const checkPaymentTimeout = async (appointmentId: string): Promise<any> => {
    const { data } = await apiClient.post('/payments/check-timeout', { appointmentId });
    return data;
};

