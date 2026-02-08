"use client";

import { useState } from "react";
import Link from "next/link";

interface Appointment {
    id: string;
    doctorName: string;
    doctorAvatar: string;
    specialty: string;
    date: string;
    time: string;
    status: "upcoming" | "completed" | "cancelled";
    type: "online" | "offline";
    reason: string;
}

export default function AppointmentsPage() {
    const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

    // Mock data
    const appointments: Appointment[] = [
        {
            id: "1",
            doctorName: "BS. Đào Quang Dương",
            doctorAvatar: "/duong.jpg",
            specialty: "Da liễu tổng quát",
            date: "2026-02-15",
            time: "14:00",
            status: "upcoming",
            type: "online",
            reason: "Tư vấn về mụn trứng cá"
        },
        {
            id: "2",
            doctorName: "BS. Đào Quang Vệ",
            doctorAvatar: "/duongtro.jpg",
            specialty: "Mụn, Thẩm mỹ da",
            date: "2026-02-20",
            time: "10:30",
            status: "upcoming",
            type: "offline",
            reason: "Điều trị laser"
        },
        {
            id: "3",
            doctorName: "TS.BS. Đào Quang Dương",
            doctorAvatar: "/duong.jpg",
            specialty: "Da liễu tổng quát",
            date: "2026-01-10",
            time: "15:00",
            status: "completed",
            type: "online",
            reason: "Khám định kỳ"
        },
        {
            id: "4",
            doctorName: "PGS.TS. Phạm Tuấn Hiệp",
            doctorAvatar: "/hiepdan.jpg",
            specialty: "Ung thư da, Thẩm mỹ",
            date: "2025-12-28",
            time: "09:00",
            status: "completed",
            type: "offline",
            reason: "Kiểm tra nốt ruồi"
        },
        {
            id: "5",
            doctorName: "BS. Cù Thị Hải Nễ",
            doctorAvatar: "/khuebeo.jpg",
            specialty: "Viêm da, Da nhạy cảm",
            date: "2025-12-15",
            time: "16:30",
            status: "cancelled",
            type: "online",
            reason: "Tư vấn viêm da"
        }
    ];

    const upcomingAppointments = appointments.filter(apt => apt.status === "upcoming");
    const pastAppointments = appointments.filter(apt => apt.status !== "upcoming");

    const getStatusColor = (status: Appointment["status"]) => {
        switch (status) {
            case "upcoming":
                return "bg-blue-100 text-blue-700";
            case "completed":
                return "bg-green-100 text-green-700";
            case "cancelled":
                return "bg-red-100 text-red-700";
        }
    };

    const getStatusText = (status: Appointment["status"]) => {
        switch (status) {
            case "upcoming":
                return "Sắp tới";
            case "completed":
                return "Đã hoàn thành";
            case "cancelled":
                return "Đã hủy";
        }
    };

    const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft hover:border-dermcare transition">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                    <img
                        src={appointment.doctorAvatar}
                        alt={appointment.doctorName}
                        className="h-16 w-16 rounded-full object-cover"
                    />
                    <div>
                        <h3 className="font-semibold text-slate-900">{appointment.doctorName}</h3>
                        <p className="text-sm text-slate-600">{appointment.specialty}</p>
                    </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {getStatusText(appointment.status)}
                </span>
            </div>

            <div className="grid gap-3 md:grid-cols-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span>📅</span>
                    <span>{new Date(appointment.date).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span>🕐</span>
                    <span>{appointment.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span>{appointment.type === "online" ? "💻" : "🏥"}</span>
                    <span>{appointment.type === "online" ? "Khám trực tuyến" : "Khám tại phòng"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span>📝</span>
                    <span>{appointment.reason}</span>
                </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100">
                {appointment.status === "upcoming" && (
                    <>
                        <button className="flex-1 rounded-lg bg-dermcare px-4 py-2 text-sm font-semibold text-white hover:bg-dermcare-dark transition">
                            Xem chi tiết
                        </button>
                        <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
                            Hủy lịch
                        </button>
                    </>
                )}
                {appointment.status === "completed" && (
                    <>
                        <button className="flex-1 rounded-lg bg-dermcare px-4 py-2 text-sm font-semibold text-white hover:bg-dermcare-dark transition">
                            Xem kết quả
                        </button>
                        <button className="rounded-lg border border-dermcare px-4 py-2 text-sm font-medium text-dermcare hover:bg-dermcare/5 transition">
                            Đặt lại
                        </button>
                    </>
                )}
                {appointment.status === "cancelled" && (
                    <button className="flex-1 rounded-lg border border-dermcare px-4 py-2 text-sm font-medium text-dermcare hover:bg-dermcare/5 transition">
                        Đặt lại lịch
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="mx-auto max-w-6xl px-4">
                {/* Breadcrumb */}
                <div className="mb-6 flex items-center gap-2 text-sm text-slate-600">
                    <Link href="/" className="hover:text-dermcare">Trang chủ</Link>
                    <span>/</span>
                    <span className="text-slate-900 font-medium">Lịch hẹn</span>
                </div>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Lịch hẹn của tôi</h1>
                    <p className="text-slate-600">Quản lý và theo dõi các cuộc hẹn với bác sĩ</p>
                </div>

                {/* Stats */}
                <div className="grid gap-4 mb-8 md:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 mb-1">Sắp tới</p>
                                <p className="text-3xl font-bold text-blue-600">{upcomingAppointments.length}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
                                📅
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 mb-1">Đã hoàn thành</p>
                                <p className="text-3xl font-bold text-green-600">{pastAppointments.filter(a => a.status === "completed").length}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">
                                ✅
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 mb-1">Đã hủy</p>
                                <p className="text-3xl font-bold text-red-600">{pastAppointments.filter(a => a.status === "cancelled").length}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-2xl">
                                ❌
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6 flex gap-4 border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab("upcoming")}
                        className={`pb-3 text-sm font-medium transition relative ${activeTab === "upcoming"
                            ? "text-dermcare"
                            : "text-slate-600 hover:text-slate-900"
                            }`}
                    >
                        Sắp tới ({upcomingAppointments.length})
                        {activeTab === "upcoming" && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-dermcare" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("past")}
                        className={`pb-3 text-sm font-medium transition relative ${activeTab === "past"
                            ? "text-dermcare"
                            : "text-slate-600 hover:text-slate-900"
                            }`}
                    >
                        Lịch sử ({pastAppointments.length})
                        {activeTab === "past" && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-dermcare" />
                        )}
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    {activeTab === "upcoming" && (
                        <>
                            {upcomingAppointments.length === 0 ? (
                                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-soft">
                                    <div className="text-6xl mb-4">📅</div>
                                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Chưa có lịch hẹn</h3>
                                    <p className="text-slate-600 mb-6">Bạn chưa có lịch hẹn nào sắp tới</p>
                                    <Link
                                        href="/doctors"
                                        className="inline-flex rounded-full bg-dermcare px-6 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-dermcare-dark transition"
                                    >
                                        Đặt lịch ngay
                                    </Link>
                                </div>
                            ) : (
                                upcomingAppointments.map((appointment) => (
                                    <AppointmentCard key={appointment.id} appointment={appointment} />
                                ))
                            )}
                        </>
                    )}

                    {activeTab === "past" && (
                        <>
                            {pastAppointments.length === 0 ? (
                                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-soft">
                                    <div className="text-6xl mb-4">📋</div>
                                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Chưa có lịch sử</h3>
                                    <p className="text-slate-600">Bạn chưa có lịch hẹn nào trong quá khứ</p>
                                </div>
                            ) : (
                                pastAppointments.map((appointment) => (
                                    <AppointmentCard key={appointment.id} appointment={appointment} />
                                ))
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
