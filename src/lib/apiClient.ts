import axios from 'axios';
import { getToken, removeToken } from '@/utils/storage';
import { getAccessToken, setAccessToken } from '@/lib/tokenStore';

// Get API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888/api/v1';

// Create axios instance
const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'x-platform': 'WEB',
    },
    withCredentials: true, // Enable credentials (cookies, authorization headers, etc.)
});

// Request interceptor - Add auth token if available
apiClient.interceptors.request.use(
    (config) => {
        // Get token from memory store
        const token = getAccessToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log(`[API Request] Attached Token: ${token.substring(0, 10)}...`);
        } else {
            console.log(`[API Request] No Token attached`);
        }

        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// State for managing concurrent refresh requests
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback);
};

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If 401 and we haven't retried yet, try to refresh token
        // Skip refresh for logout requests AND wash requests to prevent loops
        if (error.response?.status === 401 && !originalRequest._retry &&
            !originalRequest.url?.includes('/auth/logout') &&
            !originalRequest.url?.includes('/auth/wash')) {

            if (isRefreshing) {
                // Wait for the first request to finish refreshing and retry with new token
                return new Promise((resolve) => {
                    addRefreshSubscriber((token: string) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(apiClient(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Call wash endpoint (uses cookie automatically)
                const { data } = await axios.post(`${API_URL}/auth/wash`, {}, {
                    withCredentials: true // Important to send cookies
                });

                if (data.data && data.data.accessToken) {
                    const newAccessToken = data.data.accessToken;
                    setAccessToken(newAccessToken);

                    // Notify subscibers waiting for new token
                    isRefreshing = false;
                    onRefreshed(newAccessToken);

                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed, logout user
                isRefreshing = false;
                refreshSubscribers = [];
                setAccessToken(null);

                // Also clear storage if anything remains
                removeToken('accessToken'); // Just in case
                removeToken('refreshToken');

                if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
