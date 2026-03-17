"use client";

import { useState, useEffect } from "react";
import { notificationService } from "@/services/notificationService";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
    const { isLoggedIn, isDoctor } = useAuth();
    const router = useRouter();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoggedIn) return;
        fetchNotifications();
    }, [isLoggedIn]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const data = await notificationService.getNotifications();
            setNotifications(data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    const handleNotificationClick = async (notif: any) => {
        if (!notif.isRead) {
            await handleMarkAsRead(notif.id);
        }

        if (notif.type === 'NOTI_APPOINTMENT') {
            if (isDoctor) {
                router.push(`/doctor/shifts?id=${notif.referenceId}`);
            } else {
                router.push(`/appointments/${notif.referenceId}`);
            }
        } else if (notif.type === 'NOTI_MESSAGE') {
            router.push('/chat');
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="flex min-h-screen items-center justify-center p-8 text-center">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h2>
                    <p className="text-slate-600 mb-6">Bạn cần đăng nhập để xem thông báo.</p>
                    <Link href="/login" className="bg-dermcare text-white px-6 py-2 rounded-full font-semibold">
                        Đăng nhập
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Thông báo</h1>
                    <button
                        onClick={handleMarkAllAsRead}
                        disabled={notifications.every(n => n.isRead)}
                        className="text-sm font-semibold text-dermcare hover:text-dermcare-dark disabled:text-slate-400"
                    >
                        Đánh dấu đã đọc tất cả
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-slate-500">Đang tải thông báo...</div>
                    ) : notifications.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            <div className="text-4xl mb-4">🔔</div>
                            <p>Không có thông báo nào.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    onClick={() => handleNotificationClick(notif)}
                                    className={`p-6 hover:bg-slate-50 transition cursor-pointer flex gap-4 ${!notif.isRead ? 'bg-blue-50/30' : 'bg-white'}`}
                                >
                                    <div className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 text-xl ${notif.type === 'NOTI_APPOINTMENT' ? 'bg-blue-50 text-blue-600' :
                                        notif.type === 'NOTI_MESSAGE' ? 'bg-green-50 text-green-600' :
                                            'bg-purple-50 text-purple-600'
                                        }`}>
                                        {notif.type === 'NOTI_APPOINTMENT' ? '📅' : notif.type === 'NOTI_MESSAGE' ? '💬' : '📋'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between w-full">
                                            <h3 className={`text-base truncate text-left ${!notif.isRead ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                                                {notif.title}
                                            </h3>
                                            {!notif.isRead && <span className="h-2.5 w-2.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0 ml-2"></span>}
                                        </div>
                                        <p className="text-sm text-slate-600 mt-1 leading-relaxed w-full text-left">
                                            {notif.content}
                                        </p>
                                        <div className="mt-2 flex items-center gap-3">
                                            <span className="text-xs text-slate-400 text-left">
                                                {new Date(notif.created_at).toLocaleString('vi-VN')}
                                            </span>
                                            {notif.type === 'NOTI_APPOINTMENT' && (
                                                <Link
                                                    href={notif.referenceId ? `/appointments/${notif.referenceId}` : '/appointments'}
                                                    className="text-xs font-bold text-dermcare hover:underline"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    Chi tiết lịch hẹn
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
