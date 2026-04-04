"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { register, verifyEmail, resendVerifyEmail } from "@/services/authService";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState<"register" | "verify">("register");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Form state
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [gender, setGender] = useState<"MALE" | "FEMALE" | "OTHER">("MALE");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [agreedTerms, setAgreedTerms] = useState(false);

    // OTP state
    const [otp, setOtp] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("=== REGISTER FORM SUBMITTED ===");
        setError("");
        setSuccess("");

        // Validation
        if (password !== confirmPassword) {
            console.error("Password mismatch");
            setError("Mật khẩu không khớp!");
            return;
        }

        if (password.length < 6) {
            console.error("Password too short");
            setError("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }

        if (!agreedTerms) {
            console.error("Terms not agreed");
            setError("Vui lòng đồng ý với điều khoản dịch vụ!");
            return;
        }

        if (!dateOfBirth) {
            setError("Vui lòng chọn ngày sinh!");
            return;
        }

        setLoading(true);
        console.log("Starting registration...");

        try {
            const payload = {
                email: email.trim(),
                password: password,
                passwordConfirm: confirmPassword,
                fullName: fullName.trim(),
                gender: gender,
                dateOfBirth: dateOfBirth.includes('/') ? dateOfBirth.split('/').reverse().join('-') : dateOfBirth,
                phone: phoneNumber.trim(),
                address: address.trim(),
            };

            console.log("Registration payload:", { ...payload, password: "***" });

            const response = await register(payload);

            console.log("Registration response:", response);
            setSuccess(response.message || "Đăng ký thành công!");

            // Store credentials temporarily for auto-fill
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('temp_login_email', email);
                sessionStorage.setItem('temp_login_password', password);
            }

            // Redirect to login after 1.5 seconds
            setTimeout(() => {
                router.push("/login");
            }, 1500);
        } catch (err: any) {
            console.error("Registration failed:", err);

            let displayError = "Đăng ký thất bại!";

            if (err.response?.data) {
                const data = err.response.data;
                // Handle Validation Errors
                if (data.errorsValidation && Array.isArray(data.errorsValidation) && data.errorsValidation.length > 0) {
                    // errorsValidation is like [{ email: 'Email invalid' }, { password: '...' }]
                    // Extract values and join them
                    const messages = data.errorsValidation.map((item: any) => Object.values(item)[0]).join(", ");
                    displayError = messages;
                } else if (data.errorMessage) {
                    displayError = data.errorMessage;
                } else if (data.message) { // Fallback if backend changes structure
                    displayError = data.message;
                }
            } else if (err.message) {
                displayError = err.message;
            }

            setError(displayError);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await verifyEmail(otp);
            setSuccess(response.message || "Xác thực thành công!");

            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Mã OTP không đúng!");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await resendVerifyEmail();
            setSuccess(response.message || "Đã gửi lại mã OTP!");
        } catch (err: any) {
            setError(err.response?.data?.message || "Gửi lại OTP thất bại!");
        } finally {
            setLoading(false);
        }
    };

    if (step === "verify") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
                <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                    <h2 className="mb-2 text-center text-2xl font-bold text-slate-900">Xác thực email</h2>
                    <p className="mb-6 text-center text-sm text-slate-600">
                        Nhập mã OTP đã được gửi đến email {email}
                    </p>

                    {error && (
                        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-600">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleVerifyOTP} className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Mã OTP (6 số)
                            </label>
                            <input
                                type="text"
                                required
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-center text-2xl font-bold tracking-widest focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                placeholder="000000"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || otp.length !== 6}
                            className="w-full rounded-lg bg-blue-500 py-3 font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? "Đang xác thực..." : "Xác thực"}
                        </button>

                        <button
                            type="button"
                            onClick={handleResendOTP}
                            disabled={loading}
                            className="w-full text-sm text-blue-500 hover:underline disabled:opacity-50"
                        >
                            Gửi lại mã OTP
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            {/* Left side - Branding/Hero */}
            {/* Left side - Branding/Hero */}
            {/* Left side - Branding/Hero */}
            <div className="hidden lg:flex lg:flex-col lg:w-1/2 h-screen sticky top-0 p-12 pl-24 pt-32 items-start justify-start relative overflow-hidden">
                {/* Background Image with Overlay */}
                <div 
                    className="absolute inset-0 bg-cover bg-[80%_center]"
                    style={{ backgroundImage: 'url("/auth_bg.png")' }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-dermcare/60 to-dermcare-dark/75" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.15),_transparent_60%)]" />

                <div className="relative z-10 text-white space-y-6 max-w-md">
                    <Link href="/" className="inline-block mb-8">
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

            {/* Right side - Form */}
            <div className="flex w-full items-center justify-center bg-slate-50 p-4 lg:w-1/2 pb-32">
                <div className="w-full max-w-md">
                    <div className="mb-4 text-center">
                        <h2 className="mb-1 text-2xl font-bold text-slate-900">Đăng ký tài khoản</h2>
                        <p className="text-sm text-slate-600">Tạo tài khoản để bắt đầu chăm sóc da liễu</p>
                    </div>

                    {error && (
                        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-600">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-2">
                        {/* Row 1: Name and Phone */}
                        <div className="flex gap-3">
                            <div className="w-2/3">
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Họ và tên
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-1.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                />
                            </div>
                            <div className="w-1/3">
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Số điện thoại
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-1.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* Row 2: Gender and DOB */}
                        <div className="flex gap-3">
                            <div className="w-1/3">
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Giới tính
                                </label>
                                <select
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value as "MALE" | "FEMALE" | "OTHER")}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-1.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                >
                                    <option value="MALE">Nam</option>
                                    <option value="FEMALE">Nữ</option>
                                    <option value="OTHER">Khác</option>
                                </select>
                            </div>
                            <div className="w-2/3">
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Ngày sinh
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="dd/mm/yyyy"
                                    value={dateOfBirth}
                                    onChange={(e) => {
                                        let value = e.target.value.replace(/\D/g, '');
                                        if (value.length > 8) value = value.slice(0, 8);
                                        if (value.length > 4) value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
                                        else if (value.length > 2) value = `${value.slice(0, 2)}/${value.slice(2)}`;
                                        setDateOfBirth(value);
                                    }}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-1.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* Review: Address - Full Width */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Địa chỉ
                            </label>
                            <input
                                type="text"
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 px-4 py-1.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 px-4 py-1.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                            />
                        </div>

                        {/* Password Fields */}
                        <div className="flex gap-3">
                            <div className="w-1/2">
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Mật khẩu
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-1.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Xác nhận
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 px-4 py-1.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-2 pt-1">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={agreedTerms}
                                onChange={(e) => setAgreedTerms(e.target.checked)}
                                className="mt-1 h-3 w-3 rounded border-slate-300 text-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            />
                            <label htmlFor="terms" className="text-xs text-slate-600">
                                Tôi đồng ý với{" "}
                                <Link href="/terms" className="text-blue-500 hover:underline">
                                    Điều khoản dịch vụ
                                </Link>{" "}
                                và{" "}
                                <Link href="/privacy" className="text-blue-500 hover:underline">
                                    Chính sách bảo mật
                                </Link>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-500 py-2.5 font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                        >
                            {loading ? "Đang xử lý..." : "Đăng ký"}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-4 text-center text-sm text-slate-600">
                        Đã có tài khoản?{" "}
                        <Link href="/login" className="font-medium text-blue-500 hover:underline">
                            Đăng nhập
                        </Link>
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

