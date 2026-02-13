import apiClient from '@/lib/apiClient';
import { setToken, getToken, removeToken, clearTokens } from '@/utils/storage';
import { setAccessToken } from '@/lib/tokenStore';

export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface RegisterData {
    email: string;
    password: string;
    passwordConfirm: string;
    fullName: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    dateOfBirth: string; // ISO date string
    phone?: string;
    address?: string;
}

export interface AuthResponse {
    success: boolean;
    data: {
        accessToken: string;
        refreshToken: string | null;
        clientId: string | null;
        isPreAccess: boolean;
        preAccessType: string | null;
    };
    message: string;
}

export interface User {
    id: number;
    email: string;
    fullName: string;
    avatar?: string;
    gender: string;
    dateOfBirth: string;
    phone?: string;
    address?: string;
    roles: string[];
}

// Login
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/login', {
        email: credentials.email,
        password: credentials.password,
        rememberMe: credentials.rememberMe
    });

    const remember = credentials.rememberMe ?? false;

    // Handle successful login (not pre-access)
    if (data.data && !data.data.isPreAccess) {
        // Set Access Token in Memory
        setAccessToken(data.data.accessToken);

        // Clear legacy tokens from storage if they exist
        removeToken('accessToken');
        removeToken('refreshToken');

        // We don't store refreshToken in localStorage/sessionStorage anymore because it is HttpOnly Cookie
        // But we might want to store "isLoggedIn" flag or clientId
        if (data.data.clientId) {
            setToken('clientId', data.data.clientId, remember);
        }
    } else if (data.data && data.data.isPreAccess) {
        setToken('preAccessToken', data.data.accessToken, false);
        setToken('preAccessType', data.data.preAccessType || '', false);
    }

    return data;
};

// Register
export const register = async (userData: RegisterData): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/register', userData);

    if (data.data && data.data.accessToken) {
        setToken('preAccessToken', data.data.accessToken, false);
        setToken('preAccessType', data.data.preAccessType || '', false);
    }

    return data;
};

// Verify email with OTP
export const verifyEmail = async (otp: string): Promise<{ success: boolean; message: string }> => {
    const preAccessToken = getToken('preAccessToken');

    const { data } = await apiClient.post('/auth/verify-email', { otp }, {
        headers: {
            Authorization: `Bearer ${preAccessToken}`,
        },
    });

    removeToken('preAccessToken');
    removeToken('preAccessType');

    return data;
};

// Resend verify email
export const resendVerifyEmail = async (): Promise<AuthResponse> => {
    const preAccessToken = getToken('preAccessToken');

    const { data } = await apiClient.post('/auth/resend-ve', {}, {
        headers: {
            Authorization: `Bearer ${preAccessToken}`,
        },
    });

    return data;
};

// Wash Token (Refresh)
export const washToken = async (): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/wash');
    return data;
};

// Verify 2FA
export const verify2FA = async (otp: string): Promise<AuthResponse> => {
    const preAccessToken = getToken('preAccessToken');

    const { data } = await apiClient.post('/auth/verify-2fa', { otp }, {
        headers: {
            Authorization: `Bearer ${preAccessToken}`,
        },
    });

    if (data.data && !data.data.isPreAcesss) {
        setAccessToken(data.data.accessToken);

        if (data.data.clientId) {
            setToken('clientId', data.data.clientId, false);
        }

        removeToken('preAccessToken');
        removeToken('preAccessType');
    }

    return data;
};

// Logout
export const logout = async (): Promise<void> => {
    try {
        const fcmToken = getToken('fcmToken');
        await apiClient.post('/auth/logout', { fcmToken });
    } finally {
        clearTokens();
        setAccessToken(null);
    }
};

// Get current user
export const getCurrentUser = async (): Promise<User> => {
    const { data } = await apiClient.get('/users/me');
    return data.data;
};

// Google OAuth
export const loginWithGoogle = async (token: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/google', { token });

    // Save tokens to localStorage (default true or false? usually social login implies remember me)
    if (data.data && !data.data.isPreAcesss) {
        setToken('accessToken', data.data.accessToken, true);

        if (data.data.refreshToken) {
            setToken('refreshToken', data.data.refreshToken, true);
        }

        if (data.data.clientId) {
            setToken('clientId', data.data.clientId, true);
        }
    }

    return data;
};

// Forgot password
export const forgotPassword = async (email: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/forgot-password', { email });

    if (data.data && data.data.accessToken) {
        setToken('preAccessToken', data.data.accessToken, false);
        setToken('preAccessType', data.data.preAccessType || '', false);
    }

    return data;
};

// Reset password
export const resetPassword = async (otp: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    const preAccessToken = getToken('preAccessToken');

    const { data } = await apiClient.post('/auth/reset-password', { otp, newPassword }, {
        headers: {
            Authorization: `Bearer ${preAccessToken}`,
        },
    });

    removeToken('preAccessToken');
    removeToken('preAccessType');

    return data;
};
