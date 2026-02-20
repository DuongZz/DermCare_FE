"use client";

import DoctorAppointments from "@/components/DoctorAppointments";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DoctorAppointmentsPage() {
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
            <div className="mx-auto max-w-6xl px-4">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-900">Quản lý lịch hẹn</h1>
                    <p className="text-sm text-slate-500 mt-1">Xem và quản lý các ca khám của bạn</p>
                </div>
                <DoctorAppointments />
            </div>
        </div>
    );
}
