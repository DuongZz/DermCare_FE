'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState<'PHONE' | 'OTP' | 'PASSWORD'>('PHONE');
    const [confirmationResult, setConfirmationResult] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Initialize Recaptcha
        // Mock implementation for build
        if (typeof window !== 'undefined' && !(window as any).recaptchaVerifier) {
            (window as any).recaptchaVerifier = {
                render: () => Promise.resolve(),
                clear: () => { },
            };
        }
    }, []);

    const handleSendOtp = async () => {
        setLoading(true);
        setMessage('');
        try {
            console.log('Sending OTP to', phone);
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setStep('OTP');
            setMessage('OTP sent! (Mock Mode)');
        } catch (error: any) {
            console.error(error);
            setMessage('Error sending OTP: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setLoading(true);
        try {
            console.log('Verifying OTP', otp);
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setMessage('OTP Verified! Enter new password.');
            setStep('PASSWORD');
        } catch (error: any) {
            console.error(error);
            setMessage('Invalid OTP.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        setLoading(true);
        try {
            console.log('Resetting password', newPassword);
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            setMessage('Password reset successfully! Redirecting to login...');
            setTimeout(() => {
                router.push('/login');
            }, 2000);

        } catch (error: any) {
            console.error(error);
            setMessage('Error resetting password: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded shadow">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Forgot Password
                    </h2>
                </div>

                {message && (
                    <div className={`p-4 rounded ${message.includes('Error') || message.includes('Invalid') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}

                {step === 'PHONE' && (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="phone" className="sr-only">Phone Number</label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Phone Number (e.g. 0912345678)"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <div id="recaptcha-container"></div>
                        <button
                            onClick={handleSendOtp}
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
                        >
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </div>
                )}

                {step === 'OTP' && (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="otp" className="sr-only">OTP</label>
                            <input
                                id="otp"
                                name="otp"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={handleVerifyOtp}
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </div>
                )}

                {step === 'PASSWORD' && (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="new-password" className="sr-only">New Password</label>
                            <input
                                id="new-password"
                                name="new-password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={handleResetPassword}
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// Add types for window.recaptchaVerifier
declare global {
    interface Window {
        recaptchaVerifier: any;
    }
}
