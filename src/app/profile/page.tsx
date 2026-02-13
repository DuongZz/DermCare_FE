"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        fullName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        address: "",
        emergencyContact: "",
        bloodType: "",
        allergies: "",
        medications: ""
    });

    useEffect(() => {
        console.log("ProfilePage: user updated", user);
        if (user) {
            setProfileData(prev => ({
                ...prev,
                fullName: user.fullName || "",
                email: user.email || "",
                gender: user.gender || "",
                // Convert ISO date to YYYY-MM-DD for input[type=date] if needed, 
                // but simpler just to keep as string if already in that format or empty
                dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : "",
                phone: user.phone || "",
                address: user.address || "",
                // Keep other fields if they were edited locally or set default
            }));
        }
    }, [user]);

    const [editData, setEditData] = useState(profileData);

    // Sync editData when profileData updates (e.g. after fetch)
    useEffect(() => {
        setEditData(profileData);
    }, [profileData]);

    const handleSave = () => {
        setProfileData(editData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditData(profileData);
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="mx-auto max-w-5xl px-4">
                {/* Breadcrumb */}
                <div className="mb-6 flex items-center gap-2 text-sm text-slate-600">
                    <Link href="/" className="hover:text-dermcare">Trang chủ</Link>
                    <span>/</span>
                    <span className="text-slate-900 font-medium">Hồ sơ cá nhân</span>
                </div>

                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-dermcare to-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                            {profileData.fullName ? profileData.fullName.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Hồ sơ cá nhân</h1>
                            <p className="text-slate-600">Quản lý thông tin cá nhân của bạn</p>
                        </div>
                    </div>

                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="rounded-full bg-dermcare px-6 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-dermcare-dark transition"
                        >
                            ✏️ Chỉnh sửa
                        </button>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={handleCancel}
                                className="rounded-full border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSave}
                                className="rounded-full bg-dermcare px-6 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-dermcare-dark transition"
                            >
                                Lưu thay đổi
                            </button>
                        </div>
                    )}
                </div>

                {/* Profile Content */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
                            <h2 className="mb-4 text-xl font-bold text-slate-900">Thông tin cá nhân</h2>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Họ và tên</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editData.fullName}
                                            onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-dermcare focus:outline-none focus:ring-2 focus:ring-dermcare/20"
                                        />
                                    ) : (
                                        <p className="text-slate-900">{profileData.fullName}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={editData.email}
                                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-dermcare focus:outline-none focus:ring-2 focus:ring-dermcare/20"
                                        />
                                    ) : (
                                        <p className="text-slate-900">{profileData.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Số điện thoại</label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={editData.phone}
                                            onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-dermcare focus:outline-none focus:ring-2 focus:ring-dermcare/20"
                                        />
                                    ) : (
                                        <p className="text-slate-900">{profileData.phone}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Ngày sinh</label>
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            value={editData.dateOfBirth}
                                            onChange={(e) => setEditData({ ...editData, dateOfBirth: e.target.value })}
                                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-dermcare focus:outline-none focus:ring-2 focus:ring-dermcare/20"
                                        />
                                    ) : (
                                        <p className="text-slate-900">{profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toLocaleDateString('vi-VN') : "Chưa cập nhật"}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Giới tính</label>
                                    {isEditing ? (
                                        <select
                                            value={editData.gender}
                                            onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-dermcare focus:outline-none focus:ring-2 focus:ring-dermcare/20"
                                        >
                                            <option value="MALE">Nam</option>
                                            <option value="FEMALE">Nữ</option>
                                            <option value="OTHER">Khác</option>
                                        </select>
                                    ) : (
                                        <p className="text-slate-900">
                                            {profileData.gender === "MALE" ? "Nam" : profileData.gender === "FEMALE" ? "Nữ" : "Khác"}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Địa chỉ</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editData.address}
                                            onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-dermcare focus:outline-none focus:ring-2 focus:ring-dermcare/20"
                                        />
                                    ) : (
                                        <p className="text-slate-900">{profileData.address}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Medical Information */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
                            <h2 className="mb-4 text-xl font-bold text-slate-900">Thông tin y tế</h2>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Nhóm máu</label>
                                    {isEditing ? (
                                        <select
                                            value={editData.bloodType}
                                            onChange={(e) => setEditData({ ...editData, bloodType: e.target.value })}
                                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-dermcare focus:outline-none focus:ring-2 focus:ring-dermcare/20"
                                        >
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                        </select>
                                    ) : (
                                        <p className="text-slate-900">{profileData.bloodType}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Liên hệ khẩn cấp</label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={editData.emergencyContact}
                                            onChange={(e) => setEditData({ ...editData, emergencyContact: e.target.value })}
                                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-dermcare focus:outline-none focus:ring-2 focus:ring-dermcare/20"
                                        />
                                    ) : (
                                        <p className="text-slate-900">{profileData.emergencyContact}</p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Dị ứng</label>
                                    {isEditing ? (
                                        <textarea
                                            value={editData.allergies}
                                            onChange={(e) => setEditData({ ...editData, allergies: e.target.value })}
                                            rows={2}
                                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-dermcare focus:outline-none focus:ring-2 focus:ring-dermcare/20"
                                            placeholder="Nhập các loại dị ứng (nếu có)"
                                        />
                                    ) : (
                                        <p className="text-slate-900">{profileData.allergies}</p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Thuốc đang dùng</label>
                                    {isEditing ? (
                                        <textarea
                                            value={editData.medications}
                                            onChange={(e) => setEditData({ ...editData, medications: e.target.value })}
                                            rows={2}
                                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-dermcare focus:outline-none focus:ring-2 focus:ring-dermcare/20"
                                            placeholder="Nhập các loại thuốc đang sử dụng (nếu có)"
                                        />
                                    ) : (
                                        <p className="text-slate-900">{profileData.medications}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
                            <h3 className="mb-4 font-semibold text-slate-900">Hành động nhanh</h3>
                            <div className="space-y-3">
                                <Link
                                    href="/appointments"
                                    className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm text-slate-700 transition hover:border-dermcare hover:bg-dermcare/5"
                                >
                                    <span className="text-xl">📅</span>
                                    <span>Đặt lịch khám</span>
                                </Link>
                                <Link
                                    href="/medical-records"
                                    className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm text-slate-700 transition hover:border-dermcare hover:bg-dermcare/5"
                                >
                                    <span className="text-xl">📋</span>
                                    <span>Hồ sơ y tế</span>
                                </Link>
                                <Link
                                    href="/chat"
                                    className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm text-slate-700 transition hover:border-dermcare hover:bg-dermcare/5"
                                >
                                    <span className="text-xl">🤖</span>
                                    <span>Chat với DARA AI</span>
                                </Link>
                            </div>
                        </div>

                        {/* Account Stats */}
                        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-dermcare-light to-white p-6 shadow-soft">
                            <h3 className="mb-4 font-semibold text-slate-900">Thống kê tài khoản</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600">Lượt khám</span>
                                    <span className="text-lg font-bold text-dermcare">12</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600">Hồ sơ y tế</span>
                                    <span className="text-lg font-bold text-dermcare">8</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600">Bác sĩ theo dõi</span>
                                    <span className="text-lg font-bold text-dermcare">3</span>
                                </div>
                            </div>
                        </div>

                        {/* Security */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
                            <h3 className="mb-4 font-semibold text-slate-900">Bảo mật</h3>
                            <div className="space-y-3">
                                <button className="flex w-full items-center justify-between rounded-lg border border-slate-200 p-3 text-sm text-slate-700 transition hover:border-dermcare hover:bg-dermcare/5">
                                    <span>Đổi mật khẩu</span>
                                    <span>→</span>
                                </button>
                                <button className="flex w-full items-center justify-between rounded-lg border border-slate-200 p-3 text-sm text-slate-700 transition hover:border-dermcare hover:bg-dermcare/5">
                                    <span>Xác thực 2 yếu tố</span>
                                    <span>→</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
