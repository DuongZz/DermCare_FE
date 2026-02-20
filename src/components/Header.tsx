import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
    const { isLoggedIn, isDoctor, user, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [language, setLanguage] = useState<'vn' | 'en'>('vn');
    const [showLangMenu, setShowLangMenu] = useState(false);

    const notifRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const langRef = useRef<HTMLDivElement>(null);

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
                    <Link href="/" className="cursor-pointer">
                        <Image
                            src="/logo_dermcare.jpg"
                            alt="Dermcare - Phòng khám da liễu trực tuyến"
                            width={650}
                            height={180}
                            quality={100}
                            priority
                            className="h-16 w-auto object-contain object-left"
                        />
                    </Link>
                    <span className="sr-only">
                        Dermcare - Phòng khám da liễu trực tuyến
                    </span>
                </div>

                {/* 2. Navigation */}
                <nav className="hidden gap-8 text-sm text-slate-600 md:flex ml-auto whitespace-nowrap">
                    <a href="#services" className="hover:text-dermcare">
                        Dịch vụ
                    </a>
                    <a href="#doctors" className="hover:text-dermcare">
                        Bác sĩ
                    </a>
                    <a href="#specialties" className="hover:text-dermcare">
                        Chuyên khoa
                    </a>
                    <a href="#reviews" className="hover:text-dermcare">
                        Đánh giá
                    </a>
                    <a href="#partners" className="hover:text-dermcare">
                        Hợp tác
                    </a>
                    <a href="#footer" className="hover:text-dermcare">
                        Về chúng tôi
                    </a>
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
                                Đăng nhập
                            </Link>
                            <Link
                                href="/doctors"
                                className="inline-flex rounded-full bg-dermcare px-4 py-1.5 text-sm font-semibold text-white shadow-soft hover:bg-dermcare-dark whitespace-nowrap"
                            >
                                Đặt lịch ngay
                            </Link>
                        </>
                    )}

                    {/* Logged In: Booking & Bell & User */}
                    {isLoggedIn && (
                        <>
                            {/* Booking/Management Button (Logged In) */}
                            {isDoctor ? (
                                <Link
                                    href="/doctor/appointments"
                                    className="hidden lg:inline-flex rounded-full bg-dermcare px-4 py-1.5 text-sm font-semibold text-white shadow-soft hover:bg-dermcare-dark transition whitespace-nowrap"
                                >
                                    Quản lý lịch hẹn
                                </Link>
                            ) : (
                                <Link
                                    href="/doctors"
                                    className="hidden lg:inline-flex rounded-full bg-dermcare px-4 py-1.5 text-sm font-semibold text-white shadow-soft hover:bg-dermcare-dark transition whitespace-nowrap"
                                >
                                    Đặt lịch ngay
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
                                    <span className="absolute right-1 top-1 flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                                    </span>
                                </button>

                                {/* Notification Dropdown */}
                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                                        <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                                            <h3 className="font-semibold text-slate-900">Thông báo</h3>
                                            <button className="text-xs text-dermcare hover:underline">Đánh dấu đã đọc</button>
                                        </div>
                                        <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                                            {[
                                                {
                                                    id: 1,
                                                    type: 'appointment',
                                                    title: 'Nhắc nhở lịch khám',
                                                    message: 'Bạn có lịch khám với BS. Đào Quang Dương vào 14:00 hôm nay.',
                                                    time: '30 phút trước',
                                                    read: false,
                                                    icon: '📅',
                                                    bg: 'bg-blue-50 text-blue-600'
                                                },
                                                {
                                                    id: 2,
                                                    type: 'message',
                                                    title: 'Tin nhắn mới',
                                                    message: 'Bác sĩ đã trả lời câu hỏi của bạn về đơn thuốc: "Chào bạn, thuốc này uống sau ăn..."',
                                                    time: '2 giờ trước',
                                                    read: true,
                                                    icon: '💬',
                                                    bg: 'bg-green-50 text-green-600'
                                                },
                                                {
                                                    id: 3,
                                                    type: 'system',
                                                    title: 'Cập nhật hồ sơ',
                                                    message: 'Hồ sơ sức khỏe của bạn đã được cập nhật thành công.',
                                                    time: '1 ngày trước',
                                                    read: true,
                                                    icon: '📋',
                                                    bg: 'bg-purple-50 text-purple-600'
                                                },
                                                {
                                                    id: 4,
                                                    type: 'promotion',
                                                    title: 'Khuyến mãi hè',
                                                    message: 'Giảm 20% gói khám tổng quát trong tháng này.',
                                                    time: '2 ngày trước',
                                                    read: true,
                                                    icon: '🎁',
                                                    bg: 'bg-orange-50 text-orange-600'
                                                }
                                            ].map((notif) => (
                                                <div key={notif.id} className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition flex gap-3 ${!notif.read ? 'bg-slate-50' : 'bg-white'}`}>
                                                    <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm ${notif.bg}`}>
                                                        {notif.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start">
                                                            <p className={`text-sm ${!notif.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                                                                {notif.title}
                                                            </p>
                                                            {!notif.read && <span className="h-2 w-2 rounded-full bg-blue-500 mt-1.5"></span>}
                                                        </div>
                                                        <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                                                            {notif.message}
                                                        </p>
                                                        <p className="text-[10px] text-slate-400 mt-1 font-medium">
                                                            {notif.time}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
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
                                            <p className="text-sm font-semibold text-slate-900 truncate">{user?.fullName || "Người dùng"}</p>
                                            <p className="text-xs text-slate-500 truncate">{user?.email || "Chưa cập nhật email"}</p>
                                        </div>
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                        >
                                            <span>👤</span>
                                            <span>Hồ sơ cá nhân</span>
                                        </Link>
                                        {isDoctor && (
                                            <Link
                                                href="/doctor/schedule"
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                            >
                                                <span>🗓️</span>
                                                <span>Lịch làm việc</span>
                                            </Link>
                                        )}
                                        {!isDoctor && (
                                            <>
                                                <Link
                                                    href="/appointments"
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                                >
                                                    <span>📅</span>
                                                    <span>Lịch hẹn</span>
                                                </Link>
                                                <Link
                                                    href="/medical-records"
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                                >
                                                    <span>📋</span>
                                                    <span>Hồ sơ y tế</span>
                                                </Link>
                                            </>
                                        )}
                                        <div className="border-t border-slate-100 mt-2 pt-2">
                                            <button
                                                onClick={() => logout()}
                                                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                <span>🚪</span>
                                                <span>Đăng xuất</span>
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
                                    src={language === 'vn' ? "https://flagcdn.com/w40/vn.png" : "https://flagcdn.com/w40/gb.png"}
                                    alt="flag"
                                    className="h-3.5 w-5 object-cover rounded-sm border border-slate-100"
                                />
                                <span className="text-sm font-medium text-slate-600 truncate">{language === 'vn' ? 'Vietnamese' : 'English'}</span>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5 text-slate-400 flex-shrink-0">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>

                        {showLangMenu && (
                            <div className="absolute right-0 mt-2 w-40 rounded-xl border border-slate-200 bg-white shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                                <button
                                    onClick={() => { setLanguage('vn'); setShowLangMenu(false); }}
                                    className={`flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-slate-50 ${language === 'vn' ? 'bg-slate-50 font-medium text-dermcare' : 'text-slate-700'}`}
                                >
                                    <img
                                        src="https://flagcdn.com/w40/vn.png"
                                        alt="VN"
                                        className="h-3.5 w-5 object-cover rounded-sm border border-slate-100"
                                    />
                                    <span>Vietnamese</span>
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
