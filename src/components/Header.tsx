import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { notificationService } from "@/services/notificationService";
import { io, Socket } from "socket.io-client";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Header() {
    const { isLoggedIn, isDoctor, user, logout } = useAuth();
    const { language, setLanguage, t } = useLanguage();
    const router = useRouter();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showLangMenu, setShowLangMenu] = useState(false);

    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const socketRef = useRef<Socket | null>(null);

    const notifRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const langRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isLoggedIn) return;

        // Fetch initial notifications
        const fetchNotifications = async () => {
            try {
                const data = await notificationService.getNotifications();
                setNotifications(data);
                setUnreadCount(data.filter((n: any) => !n.isRead).length);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();

        // Setup Socket.io
        const token = localStorage.getItem('token');
        const socket = io('http://localhost:4000', {
            auth: { token: `Bearer ${token}` }
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('[Socket] Connected to server');
        });

        socket.on('new_notification', (notification: any) => {
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
        });

        return () => {
            socket.disconnect();
        };
    }, [isLoggedIn]);

    const handleMarkAsRead = async (id: string) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    const handleNotificationClick = async (notif: any) => {
        if (!notif.isRead) {
            await handleMarkAsRead(notif.id);
        }
        setShowNotifications(false);

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

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
            if (langRef.current && !langRef.current.contains(event.target as Node)) {
                setShowLangMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="sticky top-0 z-50 border-b border-slate-100 bg-white h-24">
            <div className="relative mx-auto flex h-full max-w-7xl items-center justify-start gap-8 px-8">
                {/* 1. Logo */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/"
                        className="cursor-pointer"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        <Image
                            src="/logo_dermcare.jpg"
                            alt="Dermcare"
                            width={320}
                            height={96}
                            quality={100}
                            priority
                            className="h-20 w-auto object-contain"
                        />
                    </Link>
                    <span className="sr-only">
                        Dermcare - Phòng khám da liễu trực tuyến
                    </span>
                </div>

                {/* 2. Navigation */}
                <nav className="hidden gap-8 text-sm text-slate-600 md:flex ml-auto whitespace-nowrap">
                    <Link href="/#services" className="hover:text-dermcare">
                        {t('header.nav.services')}
                    </Link>
                    <Link href="/#doctors" className="hover:text-dermcare">
                        {t('header.nav.doctors')}
                    </Link>
                    <Link href="/#specialties" className="hover:text-dermcare">
                        {t('header.nav.specialties')}
                    </Link>
                    <Link href="/#reviews" className="hover:text-dermcare">
                        {t('header.nav.reviews')}
                    </Link>
                    <Link href="/#partners" className="hover:text-dermcare">
                        {t('header.nav.partners')}
                    </Link>
                    <Link href="/#footer" className="hover:text-dermcare">
                        {t('header.nav.about')}
                    </Link>
                </nav>

                {/* 3. Right Actions (Login, Booking, Language, User) */}
                <div className="flex items-center gap-4">
                    {/* Guest: Login & Booking */}
                    {!isLoggedIn && (
                        <>
                            <Link
                                href="/login"
                                className="hidden rounded-full border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 md:inline-flex whitespace-nowrap"
                            >
                                {t('header.actions.login')}
                            </Link>
                            <Link
                                href="/doctors"
                                className="inline-flex rounded-full bg-dermcare px-4 py-1.5 text-sm font-semibold text-white shadow-soft hover:bg-dermcare-dark whitespace-nowrap cursor-pointer"
                            >
                                {t('header.actions.book_now')}
                            </Link>
                        </>
                    )}

                    {/* Logged In: Booking & Bell & User */}
                    {isLoggedIn && (
                        <>
                            {/* Booking/Management Button (Logged In) */}
                            {isDoctor ? (
                                <Link
                                    href="/doctor/shifts"
                                    className="hidden lg:inline-flex rounded-full bg-dermcare px-4 py-1.5 text-sm font-semibold text-white shadow-soft hover:bg-dermcare-dark transition whitespace-nowrap cursor-pointer"
                                >
                                    {t('header.actions.manage_shifts')}
                                </Link>
                            ) : (
                                <Link
                                    href="/doctors"
                                    className="hidden lg:inline-flex rounded-full bg-dermcare px-4 py-1.5 text-sm font-semibold text-white shadow-soft hover:bg-dermcare-dark transition whitespace-nowrap cursor-pointer"
                                >
                                    {t('header.actions.book_now')}
                                </Link>
                            )}

                            {/* Notification Bell */}
                            <div className="relative" ref={notifRef}>
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="relative rounded-full p-1.5 text-slate-600 hover:bg-slate-100 transition"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                    </svg>
                                    {/* Notification Badge */}
                                    {unreadCount > 0 && (
                                        <span className="absolute right-1 top-1 flex h-2 w-2">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                                        </span>
                                    )}
                                </button>

                                {/* Notification Dropdown */}
                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                                        <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                                            <h3 className="font-semibold text-slate-900">Thông báo</h3>
                                            <button
                                                onClick={handleMarkAllAsRead}
                                                className="text-xs text-dermcare hover:underline"
                                            >
                                                Đánh dấu đã đọc tất cả
                                            </button>
                                        </div>
                                        <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                                            {notifications.length === 0 ? (
                                                <div className="px-4 py-8 text-center text-slate-400 text-sm">
                                                    Không có thông báo nào
                                                </div>
                                            ) : (
                                                notifications.map((notif: any) => (
                                                    <div
                                                        key={notif.id}
                                                        onClick={() => handleNotificationClick(notif)}
                                                        className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition flex gap-3 ${!notif.isRead ? 'bg-slate-50' : 'bg-white'}`}
                                                    >
                                                        <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm ${notif.type === 'NOTI_APPOINTMENT' ? 'bg-blue-50 text-blue-600' :
                                                            notif.type === 'NOTI_MESSAGE' ? 'bg-green-50 text-green-600' :
                                                                'bg-purple-50 text-purple-600'
                                                            }`}>
                                                            {notif.type === 'NOTI_APPOINTMENT' ? '📅' : notif.type === 'NOTI_MESSAGE' ? '💬' : '📋'}
                                                        </div>
                                                        <div className="flex-1 flex flex-col items-start">
                                                            <div className="flex justify-between items-start w-full">
                                                                 <p className={`text-sm text-left ${!notif.isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                                                                    {notif.title}
                                                                </p>
                                                                {!notif.isRead && <span className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0 ml-2"></span>}
                                                            </div>
                                                            <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1 w-full text-left">
                                                                {notif.content}
                                                            </p>
                                                            <p className="text-[10px] text-slate-400 mt-1 font-medium w-full text-left" suppressHydrationWarning>
                                                                {(() => {
                                                                    const d = new Date(notif.created_at);
                                                                    // Nếu là NaN hoặc không có Z, thử ép về UTC nếu backend gửi thiếu Z
                                                                    if (notif.created_at && !notif.created_at.toString().includes('Z') && !notif.created_at.toString().includes('+')) {
                                                                        return new Date(notif.created_at + 'Z').toLocaleString('vi-VN');
                                                                    }
                                                                    return d.toLocaleString('vi-VN');
                                                                })()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        <div className="p-2 text-center border-t border-slate-100 bg-slate-50 rounded-b-xl">
                                            <Link href="/notifications" className="text-xs font-semibold text-dermcare hover:text-dermcare-dark transition">
                                                Xem tất cả thông báo
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* User Menu Dropdown */}
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-1.5 rounded-full border border-slate-200 px-2.5 py-1.5 hover:bg-slate-50 transition"
                                >
                                    <svg className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                    <svg
                                        className={`h-4 w-4 text-slate-600 transition ${showUserMenu ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-lg py-2">
                                        <div className="px-4 py-3 border-b border-slate-100">
                                            <p className="text-sm font-semibold text-slate-900 truncate">
                                                {user?.qualifications ? `${user.qualifications} ${user.fullName}` : (user?.fullName || "Người dùng")}
                                            </p>
                                            <p className="text-xs text-slate-500 truncate">{user?.email || "Chưa cập nhật email"}</p>
                                        </div>
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                        >
                                            <span>👤</span>
                                            <span>{t('header.user_menu.profile')}</span>
                                        </Link>
                                        {isDoctor && (
                                            <>
                                                <Link
                                                    href="/doctor/schedule"
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                                >
                                                    <span>📅</span>
                                                    <span>{t('header.user_menu.schedule')}</span>
                                                </Link>
                                                <Link
                                                    href="/doctor/appointments"
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                                >
                                                    <span>📝</span>
                                                    <span>{t('header.user_menu.appointments')}</span>
                                                </Link>

                                            </>
                                        )}
                                        {!isDoctor && (
                                            <>
                                                <Link
                                                    href="/appointments"
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                                >
                                                    <span>📅</span>
                                                    <span>{t('header.user_menu.appointments')}</span>
                                                </Link>
                                                <Link
                                                    href="/medical-records"
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                                >
                                                    <span>📋</span>
                                                    <span>{t('profile.stats.medical_records')}</span>
                                                </Link>
                                            </>
                                        )}
                                        <div className="border-t border-slate-100 mt-2 pt-2">
                                            <button
                                                onClick={() => logout()}
                                                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                <span>🚪</span>
                                                <span>{t('header.user_menu.logout')}</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Language Selector */}
                    <div className="relative" ref={langRef}>
                        <button
                            onClick={() => setShowLangMenu(!showLangMenu)}
                            className="flex items-center justify-between w-[160px] rounded-full border border-slate-200 px-3 py-1.5 hover:bg-slate-50 transition relative"
                        >
                            <div className="flex items-center gap-2">
                                <img
                                    src={language === 'vi' ? "https://flagcdn.com/w40/vn.png" : "https://flagcdn.com/w40/gb.png"}
                                    alt="flag"
                                    className="h-3.5 w-5 object-cover rounded-sm border border-slate-100"
                                />
                                <span className="text-sm font-medium text-slate-600 truncate">{language === 'vi' ? 'Tiếng Việt' : 'English'}</span>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5 text-slate-400 flex-shrink-0">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>

                        {showLangMenu && (
                            <div className="absolute right-0 mt-2 w-40 rounded-xl border border-slate-200 bg-white shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                                <button
                                    onClick={() => { setLanguage('vi'); setShowLangMenu(false); }}
                                    className={`flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-slate-50 ${language === 'vi' ? 'bg-slate-50 font-medium text-dermcare' : 'text-slate-700'}`}
                                >
                                    <img
                                        src="https://flagcdn.com/w40/vn.png"
                                        alt="VN"
                                        className="h-3.5 w-5 object-cover rounded-sm border border-slate-100"
                                    />
                                    <span>Tiếng Việt</span>
                                </button>
                                <button
                                    onClick={() => { setLanguage('en'); setShowLangMenu(false); }}
                                    className={`flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-slate-50 ${language === 'en' ? 'bg-slate-50 font-medium text-dermcare' : 'text-slate-700'}`}
                                >
                                    <img
                                        src="https://flagcdn.com/w40/gb.png"
                                        alt="EN"
                                        className="h-3.5 w-5 object-cover rounded-sm border border-slate-100"
                                    />
                                    <span>English</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header >
    );
}
