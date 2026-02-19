import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
    const { isLoggedIn, user, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const notifRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="sticky top-0 z-50 border-b border-slate-100 bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
                <div className="flex items-center gap-3">
                    <Link href="/" className="cursor-pointer">
                        <Image
                            src="/logo_dermcare.jpg"
                            alt="Dermcare - Phòng khám da liễu trực tuyến"
                            width={650}
                            height={180}
                            priority
                            className="h-20 w-auto"
                        />
                    </Link>
                    <span className="sr-only">
                        Dermcare - Phòng khám da liễu trực tuyến
                    </span>
                </div>

                <nav className="hidden gap-6 text-sm text-slate-600 md:flex">
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

                <div className="flex items-center gap-3">
                    {!isLoggedIn ? (
                        <>
                            <Link
                                href="/login"
                                className="hidden rounded-full border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 md:inline-flex"
                            >
                                Đăng nhập
                            </Link>
                            <Link
                                href="/doctors"
                                className="inline-flex rounded-full bg-dermcare px-4 py-1.5 text-sm font-semibold text-white shadow-soft hover:bg-dermcare-dark"
                            >
                                Đặt lịch ngay
                            </Link>
                        </>
                    ) : (
                        <>
                            {/* Logged in UI */}
                            <Link
                                href="/doctors"
                                className="inline-flex rounded-full bg-dermcare px-4 py-1.5 text-sm font-semibold text-white shadow-soft hover:bg-dermcare-dark"
                            >
                                Đặt lịch ngay
                            </Link>

                            {/* Notification Bell */}
                            <div className="relative" ref={notifRef}>
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100 transition"
                                >
                                    <span className="text-xl">🔔</span>
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
                                    className="flex items-center gap-1.5 rounded-full border border-slate-200 px-2.5 py-2 hover:bg-slate-50 transition"
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
                </div>
            </div>
        </header>
    );
}
