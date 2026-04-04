"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { setAccessToken } from "@/lib/tokenStore";

export default function SocialCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();
    const [error, setError] = useState("");

    useEffect(() => {
        const token = searchParams.get("token");
        const errorParam = searchParams.get("error");

        if (errorParam) {
            setError("Đăng nhập thất bại. Vui lòng thử lại.");
            setTimeout(() => router.push("/login"), 3000);
            return;
        }

        if (token) {
            // Store token in memory
            setAccessToken(token);
            // Trigger auth context login
            login();
            // Redirect to home
            router.push("/");
        } else {
            setError("Không tìm thấy token. Đang chuyển hướng...");
            setTimeout(() => router.push("/login"), 3000);
        }
    }, [searchParams, login, router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
            <div className="text-center space-y-4">
                {error ? (
                    <div className="space-y-2">
                        <div className="text-red-500 text-lg font-semibold">{error}</div>
                        <p className="text-slate-500 text-sm">Đang chuyển hướng về trang đăng nhập...</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <div className="animate-spin mx-auto h-8 w-8 border-4 border-dermcare border-t-transparent rounded-full" />
                        <p className="text-slate-600 font-medium">Đang xác thực...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
