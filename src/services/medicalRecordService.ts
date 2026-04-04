import apiClient from '@/lib/apiClient';

export const medicalRecordService = {
  getMedicalRecords: async () => {
    const response = await apiClient.get('/medical-records');
    return response.data.data;
  },
};
