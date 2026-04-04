"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import DoctorWorkTemplate from "@/components/DoctorWorkTemplate";

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
        <div className="min-h-screen bg-slate-50 pt-4 pb-6">
            <div className="mx-auto max-w-5xl px-4">
                <div className="mb-4">
                    <h1 className="text-3xl font-bold text-slate-900">Lịch làm việc</h1>
                </div>
                <DoctorWorkTemplate />
            </div>
        </div>
    );
}
