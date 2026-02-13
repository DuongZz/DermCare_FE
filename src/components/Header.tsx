"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
    const { isLoggedIn, user, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);

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
                            <button className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100 transition">
                                <span className="text-xl">🔔</span>
                                {/* Notification Badge */}
                                <span className="absolute right-1 top-1 flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                                </span>
                            </button>

                            {/* User Menu Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 rounded-full border border-slate-200 p-1 pr-3 hover:bg-slate-50 transition"
                                >
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-dermcare to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                                        {user?.fullName?.charAt(0).toUpperCase() || "U"}
                                    </div>
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
