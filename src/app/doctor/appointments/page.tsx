"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import DoctorScheduleSlots from "@/components/DoctorScheduleSlots";

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
                </div>
                <DoctorScheduleSlots />
            </div>
        </div>
    );
}
