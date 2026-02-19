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
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Initialize Recaptcha
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'normal',
                'callback': (response: any) => {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                },
                'expired-callback': () => {
                    // Response expired. Ask user to solve reCAPTCHA again.
                }
            });
        }
    }, []);

    const handleSendOtp = async () => {
        setLoading(true);
        setMessage('');
        try {
            // Ensure phone number format is +[country code][number]
            // Start assuming VN (+84) if not provided
            let formattedPhone = phone;
            if (!phone.startsWith('+')) {
                formattedPhone = '+84' + (phone.startsWith('0') ? phone.slice(1) : phone);
            }

            const appVerifier = window.recaptchaVerifier;
            const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
            setConfirmationResult(confirmation);
            setStep('OTP');
            setMessage('OTP sent! Check your phone.');
        } catch (error: any) {
            console.error(error);
            setMessage('Error sending OTP: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!confirmationResult) return;
        setLoading(true);
        try {
            const result = await confirmationResult.confirm(otp);
            // User signed in successfully.
            // visual feedback
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
        if (!auth.currentUser) {
            setMessage('Session expired. Please verify OTP again.');
            return;
        }

        setLoading(true);
        try {
            // Get ID token
            const idToken = await auth.currentUser.getIdToken();

            // Call backend API
            await apiClient.post('/auth/forgot-password', {
                idToken,
                newPassword
            });

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
