"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/services/authService";
import { useAuth } from "@/contexts/AuthContext";
import apiClient from '@/lib/apiClient';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost/v1';

type AuthMode = "login" | "forgot-password";
type ForgotStep = "EMAIL" | "OTP";

export default function LoginPage() {
    const [mode, setMode] = useState<AuthMode>("login");
    const [rememberMe, setRememberMe] = useState(false);

    // Auto-fill from registration
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Forgot Password State
    const [forgotEmail, setForgotEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [forgotStep, setForgotStep] = useState<ForgotStep>("EMAIL");
    const [otpSent, setOtpSent] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const tempEmail = sessionStorage.getItem('temp_login_email');
            const tempPassword = sessionStorage.getItem('temp_login_password');

            if (tempEmail) {
                setEmail(tempEmail);
                sessionStorage.removeItem('temp_login_email');
            }
            if (tempPassword) {
                setPassword(tempPassword);
                sessionStorage.removeItem('temp_login_password');
            }
        }
    }, []);

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const { login: authLogin, isLoggedIn } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login({ email, password, rememberMe });
            authLogin();
            router.push("/");
        } catch (err: any) {
            console.error("Login failed:", err);
            setError(err.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!");
        } finally {
            setLoading(false);
        }
    };

    const handleSendOtp = async () => {
        if (!forgotEmail) {
            setError("Vui lòng nhập email.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            await apiClient.post('/auth/send-otp', { email: forgotEmail });
            setForgotStep("OTP");
            setOtpSent(true);
            setSuccessMessage("Mã OTP đã được gửi đến email của bạn.");
        } catch (error: any) {
            console.error(error);
            setError(error.response?.data?.message || 'Lỗi gửi OTP. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!otp || !newPassword) {
            setError("Vui lòng nhập đầy đủ mã OTP và mật khẩu mới.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            await apiClient.post('/auth/reset-password', {
                email: forgotEmail,
                otp,
                newPassword
            });
            setSuccessMessage('Đổi mật khẩu thành công! Đang chuyển hướng...');
            setTimeout(() => {
                setMode("login");
                resetForgotState();
            }, 2000);
        } catch (error: any) {
            console.error(error);
            setError(error.response?.data?.message || 'Lỗi đặt lại mật khẩu. Mã OTP có thể không đúng hoặc đã hết hạn.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            router.push("/");
        }
    }, [isLoggedIn, router]);

    const resetForgotState = () => {
        setForgotEmail("");
        setOtp("");
        setNewPassword("");
        setForgotStep("EMAIL");
        setError("");
        setSuccessMessage("");
        setOtpSent(false);
    };

    return (
        <div className="flex min-h-screen">
            {/* Left side - Branding/Hero */}
            <div className="hidden lg:flex lg:w-1/2 h-screen sticky top-0 bg-gradient-to-br from-dermcare to-dermcare-dark p-12 pl-20 items-center justify-center relative overflow-hidden pb-60">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.15),_transparent_60%)]" />
                <div className="relative z-10 text-white space-y-6 max-w-md">
                    <Link href="/" className="inline-block">
                        <Image
                            src="/kma_logo.jpg"
                            alt="KMA - Academy of Cryptography Techniques"
                            width={200}
                            height={200}
                            className="h-32 w-32 rounded-full"
                        />
                    </Link>
                    <h1 className="text-4xl font-bold">
                        Chăm sóc da liễu <br />
                        chuyên nghiệp trực tuyến
                    </h1>
                    <p className="text-dermcare-light text-lg">
                        Kết nối với bác sĩ da liễu hàng đầu, theo dõi liệu trình điều trị và
                        quản lý hồ sơ sức khỏe da liễu của bạn.
                    </p>
                </div>
            </div>

            {/* Right side - Auth Forms */}
            <div className="flex-1 flex items-center justify-center p-4 bg-slate-50 pb-20">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-8 text-center">
                        <Link href="/" className="inline-block">
                            <Image
                                src="/logo_dermcare.jpg"
                                alt="Dermcare"
                                width={650}
                                height={180}
                                className="h-16 w-auto mx-auto"
                            />
                        </Link>
                    </div>

                    <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6">
                        {/* Login Form */}
                        {mode === "login" && (
                            <form onSubmit={handleLogin} className="space-y-6">
                                <div className="space-y-1 text-center">
                                    <h2 className="text-2xl font-bold text-slate-900">
                                        Đăng nhập
                                    </h2>
                                    <p className="text-sm text-slate-600">
                                        Chào mừng bạn quay trở lại với Dermcare
                                    </p>
                                </div>

                                {error && (
                                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                                        {error}
                                    </div>
                                )}
                                {successMessage && (
                                    <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-600">
                                        {successMessage}
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-medium text-slate-700 mb-1.5"
                                        >
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-dermcare focus:ring-2 focus:ring-dermcare/20 outline-none transition"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="block text-sm font-medium text-slate-700 mb-1.5"
                                        >
                                            Mật khẩu
                                        </label>
                                        <input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-dermcare focus:ring-2 focus:ring-dermcare/20 outline-none transition"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={rememberMe}
                                                onChange={(e) => setRememberMe(e.target.checked)}
                                                className="w-4 h-4 rounded border-slate-300 text-dermcare focus:ring-dermcare"
                                            />
                                            <span className="text-sm text-slate-600">
                                                Nhớ mật khẩu
                                            </span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setMode("forgot-password");
                                                resetForgotState();
                                            }}
                                            className="text-sm text-dermcare hover:text-dermcare-dark font-medium"
                                        >
                                            Quên mật khẩu?
                                        </button>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-dermcare hover:bg-dermcare-dark text-white font-semibold py-2.5 rounded-lg transition shadow-soft disabled:opacity-50"
                                    >
                                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                                    </button>
                                </div>


                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-200" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-white text-slate-500">hoặc</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => window.location.href = `${API_BASE_URL}/auth/facebook`}
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path
                                                fill="#1877F2"
                                                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                                            />
                                        </svg>
                                        <span className="text-sm font-medium text-slate-700">
                                            Facebook
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => window.location.href = `${API_BASE_URL}/auth/google`}
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path
                                                fill="#4285F4"
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            />
                                            <path
                                                fill="#34A853"
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            />
                                            <path
                                                fill="#FBBC05"
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            />
                                            <path
                                                fill="#EA4335"
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            />
                                        </svg>
                                        <span className="text-sm font-medium text-slate-700">
                                            Google
                                        </span>
                                    </button>
                                </div>

                                <p className="text-center text-sm text-slate-600">
                                    Chưa có tài khoản?{" "}
                                    <Link
                                        href="/register"
                                        className="text-dermcare hover:text-dermcare-dark font-medium"
                                    >
                                        Đăng ký ngay
                                    </Link>
                                </p>
                            </form>
                        )}

                        {/* Forgot Password Flow */}
                        {mode === "forgot-password" && (
                            <div className="space-y-6">
                                <div className="space-y-2 text-center">
                                    <h2 className="text-2xl font-bold text-slate-900">
                                        Quên mật khẩu?
                                    </h2>
                                    <p className="text-sm text-slate-600">
                                        Nhập email của bạn để nhận mã OTP khôi phục mật khẩu
                                    </p>
                                </div>

                                {error && (
                                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                                        {error}
                                    </div>
                                )}
                                {successMessage && (
                                    <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-600">
                                        {successMessage}
                                    </div>
                                )}

                                {/* Step 1: Email Input */}
                                {forgotStep === "EMAIL" && (
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="forgot-email" className="block text-sm font-medium text-slate-700 mb-1.5">
                                                Email
                                            </label>
                                            <input
                                                id="forgot-email"
                                                type="email"
                                                value={forgotEmail}
                                                onChange={(e) => setForgotEmail(e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-dermcare focus:ring-2 focus:ring-dermcare/20 outline-none transition"
                                                placeholder="Nhập email của bạn"
                                            />
                                        </div>
                                        <button
                                            onClick={handleSendOtp}
                                            disabled={loading}
                                            className="w-full bg-dermcare hover:bg-dermcare-dark text-white font-semibold py-2.5 rounded-lg transition shadow-soft disabled:opacity-50"
                                        >
                                            {loading ? "Đang gửi..." : "Gửi mã OTP"}
                                        </button>
                                    </div>
                                )}

                                {/* Step 2: OTP & New Password */}
                                {forgotStep === "OTP" && (
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="otp" className="block text-sm font-medium text-slate-700 mb-1.5">
                                                Mã OTP
                                            </label>
                                            <input
                                                id="otp"
                                                type="text"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-dermcare focus:ring-2 focus:ring-dermcare/20 outline-none transition text-center tracking-widest text-lg"
                                                placeholder="Nhập mã OTP"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="new-password" className="block text-sm font-medium text-slate-700 mb-1.5">
                                                Mật khẩu mới
                                            </label>
                                            <input
                                                id="new-password"
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-dermcare focus:ring-2 focus:ring-dermcare/20 outline-none transition"
                                                placeholder="Nhập mật khẩu mới"
                                            />
                                        </div>
                                        <button
                                            onClick={handleResetPassword}
                                            disabled={loading}
                                            className="w-full bg-dermcare hover:bg-dermcare-dark text-white font-semibold py-2.5 rounded-lg transition shadow-soft disabled:opacity-50"
                                        >
                                            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                                        </button>
                                        <button
                                            onClick={handleSendOtp}
                                            disabled={loading}
                                            className="w-full mt-2 text-sm text-dermcare hover:underline"
                                        >
                                            Gửi lại mã OTP
                                        </button>
                                    </div>
                                )}

                                <p className="text-center text-sm text-slate-600">
                                    <button
                                        onClick={() => {
                                            setMode("login");
                                            resetForgotState();
                                        }}
                                        className="text-dermcare hover:text-dermcare-dark font-medium"
                                    >
                                        ← Quay lại đăng nhập
                                    </button>
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="text-center text-xs text-slate-500 mt-4">
                        © {new Date().getFullYear()} Dermcare. Bảo mật thông tin bệnh nhân
                        tuyệt đối.
                    </p>
                </div>
            </div>
        </div>
    );
}
