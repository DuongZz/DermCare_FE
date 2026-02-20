"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import DoctorScheduleManager from "@/components/DoctorScheduleManager";

export default function DoctorSchedulePage() {
    const { isLoggedIn, isDoctor } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn || !isDoctor) {
            router.push("/");
        }
    }, [isLoggedIn, isDoctor, router]);

    if (!isLoggedIn || !isDoctor) return null;

    return (
        <div className="min-h-screen bg-slate-50 py-6">
            <div className="mx-auto max-w-5xl px-4">
                <div className="mb-1">
                    <h1 className="text-3xl font-bold text-slate-900">Quản lý lịch làm việc</h1>
                    <p className="text-sm text-slate-500 mt-1">Thêm, chỉnh sửa ca khám để bệnh nhân có thể đặt lịch</p>
                </div>
                <DoctorScheduleManager />
            </div>
        </div>
    );
}
