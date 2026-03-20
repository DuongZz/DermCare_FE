"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getMyAppointments, Appointment, getOrCreateConversation } from "@/services/appointmentService";
import LoadingOverlay from "@/components/LoadingOverlay";

export default function AppointmentsPage() {
    const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
    const [upcomingData, setUpcomingData] = useState<{ items: Appointment[], total: number, hasMore: boolean }>({ items: [], total: 0, hasMore: true });
    const [pastData, setPastData] = useState<{ items: Appointment[], total: number, hasMore: boolean }>({ items: [], total: 0, hasMore: true });
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const LIMIT = 10;

    const fetchInitialData = async () => {
        setIsLoading(true);
        try {
            const [upcoming, past] = await Promise.all([
                getMyAppointments("upcoming", 1, LIMIT),
                getMyAppointments("past", 1, LIMIT)
            ]);
            setUpcomingData(upcoming);
            setPastData(past);
        } catch (error) {
            console.error("Failed to fetch initial appointments:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    const loadMore = async () => {
        if (isLoadingMore) return;
        
        const currentData = activeTab === "upcoming" ? upcomingData : pastData;
        if (!currentData.hasMore) return;

        setIsLoadingMore(true);
        try {
            const nextPage = Math.floor(currentData.items.length / LIMIT) + 1;
            const newData = await getMyAppointments(activeTab, nextPage, LIMIT);
            
            if (activeTab === "upcoming") {
                setUpcomingData(prev => ({
                    ...newData,
                    items: [...prev.items, ...newData.items]
                }));
            } else {
                setPastData(prev => ({
                    ...newData,
                    items: [...prev.items, ...newData.items]
                }));
            }
        } catch (error) {
            console.error("Failed to load more appointments:", error);
        } finally {
            setIsLoadingMore(false);
        }
    };

    const getStatusStyle = (status: Appointment["appointmentStatus"]) => {
        switch (status) {
            case "PENDING": return "bg-yellow-100 text-yellow-700";
            case "CONFIRMED": return "bg-blue-100 text-blue-700";
            case "COMPLETED": return "bg-green-100 text-green-700";
            case "CANCELLED": return "bg-red-100 text-red-700";
        }
    };

    const getStatusText = (status: Appointment["appointmentStatus"]) => {
        switch (status) {
            case "PENDING": return "Chờ xác nhận";
            case "CONFIRMED": return "Đã xác nhận";
            case "COMPLETED": return "Hoàn thành";
            case "CANCELLED": return "Đã hủy";
        }
    };

    const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft hover:border-dermcare transition">
            <div className="flex items-start justify-between mb-4">
                {/* Thông tin bác sĩ */}
                <div className="flex items-center gap-4">
                    {appointment.doctor?.avatar ? (
                        <img
                            src={appointment.doctor.avatar}
                            alt={appointment.doctor.fullName}
                            className="h-16 w-16 rounded-full object-cover"
                        />
                    ) : (
                        <div className="h-16 w-16 rounded-full bg-dermcare/10 flex items-center justify-center text-2xl">
                            👨‍⚕️
                        </div>
                    )}
                    <div>
                        <h3 className="font-semibold text-slate-900">
                            {appointment.doctor?.fullName || "Bác sĩ DermCare"}
                        </h3>
                        <p className="text-sm text-slate-500">
                            {appointment.doctor?.specialization || "Chuyên khoa Da liễu"}
                        </p>
                        {appointment.doctor?.qualifications && (
                            <p className="text-xs text-slate-400">{appointment.doctor.qualifications}</p>
                        )}
                    </div>
                </div>
                {/* Badge trạng thái */}
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(appointment.appointmentStatus)}`}>
                    {getStatusText(appointment.appointmentStatus)}
                </span>
            </div>

            {/* Chi tiết lịch hẹn */}
            <div className="grid gap-3 md:grid-cols-2">
                <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Ngày khám</span>
                    <span className="text-sm text-slate-600">
                        {new Date(appointment.appointmentDate).toLocaleDateString('vi-VN', {
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                        })}
                    </span>
                </div>
                <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Giờ khám</span>
                    <span className="text-sm text-slate-600">
                        {appointment.appointmentTime}
                        {appointment.appointmentEndTime ? ` - ${appointment.appointmentEndTime}` : ''}
                    </span>
                </div>
                <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Chi phí</span>
                    <span className="text-sm text-slate-600">{appointment.price?.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Ghi chú</span>
                    <span className="text-sm text-slate-600">{appointment.note || 'Không có'}</span>
                </div>
            </div>

            {/* Nút hành động */}
            <div className="mt-6 flex justify-end">
                {appointment.appointmentStatus === 'COMPLETED' ? (
                    <button
                        onClick={async () => {
                            if (appointment.conversationId) {
                                window.location.href = `/chat?id=${appointment.conversationId}`;
                            } else {
                                try {
                                    setIsLoading(true);
                                    const convo = await getOrCreateConversation(appointment.id);
                                    window.location.href = `/chat?id=${convo.id}`;
                                } catch (error) {
                                    console.error("Failed to get/create conversation:", error);
                                    setIsLoading(false);
                                }
                            }
                        }}
                        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition bg-slate-100 text-slate-600 hover:bg-slate-200"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Xem lại
                    </button>
                ) : appointment.appointmentStatus === 'CONFIRMED' ? (
                    <button
                        onClick={async () => {
                            if (appointment.conversationId) {
                                window.location.href = `/chat?id=${appointment.conversationId}`;
                            } else {
                                try {
                                    setIsLoading(true);
                                    const convo = await getOrCreateConversation(appointment.id);
                                    window.location.href = `/chat?id=${convo.id}`;
                                } catch (error) {
                                    console.error("Failed to get/create conversation:", error);
                                    setIsLoading(false);
                                }
                            }
                        }}
                        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition bg-blue-50 text-blue-600 hover:bg-blue-100"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        Nhắn tin cho bác sĩ
                    </button>
                ) : null}
            </div>
        </div>
    );


    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <LoadingOverlay isLoading={isLoading} text="Đang tải lịch hẹn" />
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
                                <p className="text-3xl font-bold text-blue-600">{upcomingData.total}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">📅</div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 mb-1">Đã hoàn thành</p>
                                <p className="text-3xl font-bold text-green-600">{pastData.total}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">✅</div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 mb-1">Đã hủy</p>
                                <p className="text-3xl font-bold text-red-600">-</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-2xl">❌</div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6 flex gap-4 border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab("upcoming")}
                        className={`pb-3 text-sm font-medium transition relative ${activeTab === "upcoming" ? "text-dermcare" : "text-slate-600 hover:text-slate-900"}`}
                    >
                        Sắp tới ({upcomingData.total})
                        {activeTab === "upcoming" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-dermcare" />}
                    </button>
                    <button
                        onClick={() => setActiveTab("past")}
                        className={`pb-3 text-sm font-medium transition relative ${activeTab === "past" ? "text-dermcare" : "text-slate-600 hover:text-slate-900"}`}
                    >
                        Hoàn thành ({pastData.total})
                        {activeTab === "past" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-dermcare" />}
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    {!isLoading && (
                        <>
                            {activeTab === "upcoming" && (
                                upcomingData.items.length === 0 ? (
                                    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-soft">
                                        <div className="text-6xl mb-4">📅</div>
                                        <h3 className="text-xl font-semibold text-slate-900 mb-2">Chưa có lịch hẹn</h3>
                                        <p className="text-slate-600 mb-6">Bạn chưa có lịch hẹn nào sắp tới</p>
                                        <Link href="/doctors" className="inline-flex rounded-full bg-dermcare px-6 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-dermcare-dark transition">
                                            Đặt lịch ngay
                                        </Link>
                                    </div>
                                ) : (
                                    upcomingData.items.map(apt => <AppointmentCard key={apt.id} appointment={apt} />)
                                )
                            )}
                            {activeTab === "past" && (
                                pastData.items.length === 0 ? (
                                    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-soft">
                                        <div className="text-6xl mb-4">📋</div>
                                        <h3 className="text-xl font-semibold text-slate-900 mb-2">Chưa có lịch sử</h3>
                                        <p className="text-slate-600">Bạn chưa có lịch hẹn nào trong quá khứ</p>
                                    </div>
                                ) : (
                                    pastData.items.map(apt => <AppointmentCard key={apt.id} appointment={apt} />)
                                )
                            )}

                            {/* Load more button */}
                            {(activeTab === "upcoming" ? upcomingData.hasMore : pastData.hasMore) && (
                                <div className="flex justify-center pt-4 pb-8">
                                    <button
                                        onClick={loadMore}
                                        disabled={isLoadingMore}
                                        className="rounded-full bg-white border border-slate-200 px-8 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition shadow-sm disabled:opacity-50"
                                    >
                                        {isLoadingMore ? "Đang tải thêm..." : "Xem thêm lịch hẹn"}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
