"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

import userService from "@/services/userService";

export default function ProfilePage() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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
        medications: "",
        skinType: "",
        chronicConditions: ""
    });

    // Fetch user Medical Info
    useEffect(() => {
        const fetchMedicalInfo = async () => {
            try {
                const res = await userService.getMedicalInfo();
                if (res.success && res.data) {
                    const medicalInfo = res.data;
                    setProfileData(prev => ({
                        ...prev,
                        bloodType: medicalInfo.bloodGroup || "",
                        allergies: medicalInfo.allergies || "",
                        emergencyContact: medicalInfo.emergencyContact || "",
                        medications: medicalInfo.currentMedications || "",
                        skinType: medicalInfo.skinType || "",
                        chronicConditions: medicalInfo.chronicConditions || ""
                    }));
                }
            } catch (error) {
                console.error("Failed to fetch medical info:", error);
            }
        };

        if (user) {
            fetchMedicalInfo();
        }
    }, [user]);

    useEffect(() => {
        console.log("ProfilePage: user updated", user);
        if (user) {
            setProfileData(prev => ({
                ...prev,
                fullName: user.fullName || "",
                email: user.email || "",
                gender: user.gender || "",
                dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : "",
                phone: user.phone || "",
                address: user.address || "",
            }));
        }
    }, [user]);

    const [editData, setEditData] = useState(profileData);

    // Sync editData when profileData updates (e.g. after fetch)
    useEffect(() => {
        setEditData(profileData);
    }, [profileData]);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const res = await userService.updateMedicalInfo({
                skinType: editData.skinType,
                bloodGroup: editData.bloodType,
                allergies: editData.allergies,
                emergencyContact: editData.emergencyContact,
                currentMedications: editData.medications,
                chronicConditions: editData.chronicConditions
            });

            if (res.success) {
                // Update local state immediately for optimistic UI or re-fetch
                setProfileData(editData);
                setIsEditing(false);
                console.log("Medical info updated successfully");
            } else {
                throw new Error("Update failed");
            }
        } catch (error) {
            console.error("Failed to update medical info:", error);
            alert("Cập nhật thất bại. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setEditData(profileData);
        setIsEditing(false);
    };

    const inputClass = "w-full rounded-md border border-slate-300 bg-white px-2 h-8 text-sm text-slate-900 focus:border-dermcare focus:outline-none focus:ring-1 focus:ring-dermcare/20";

    const EmptyValue = () => <span className="font-normal italic text-slate-400">Chưa cập nhật</span>;

    const BLOOD_TYPES = {
        "A_POSITIVE": "A+",
        "A_NEGATIVE": "A-",
        "B_POSITIVE": "B+",
        "B_NEGATIVE": "B-",
        "AB_POSITIVE": "AB+",
        "AB_NEGATIVE": "AB-",
        "O_POSITIVE": "O+",
        "O_NEGATIVE": "O-",
    };

    return (
        <div className="min-h-screen bg-slate-50 py-2">
            <div className="mx-auto max-w-5xl px-4">

                {/* Header */}
                <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Hồ sơ cá nhân</h1>

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
                <div className="grid gap-3 lg:grid-cols-3">
                    {/* Main Info */}
                    <div className="lg:col-span-2 grid grid-cols-2 gap-3">
                        {/* Personal Information */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                            <h2 className="mb-2 text-base font-bold text-slate-900">Thông tin cá nhân</h2>
                            <div className="grid gap-2.5">
                                <div className="rounded-xl bg-slate-50 px-3 py-2 transition hover:bg-slate-100/80">
                                    <label className="mb-0.5 block text-xs font-medium text-slate-500">Họ và tên</label>
                                    {isEditing ? (
                                        <input type="text" value={editData.fullName} onChange={(e) => setEditData({ ...editData, fullName: e.target.value })} className={inputClass} />
                                    ) : (
                                        <p className="h-8 flex items-center px-2 text-sm font-semibold text-slate-900">{profileData.fullName || <EmptyValue />}</p>
                                    )}
                                </div>

                                <div className="rounded-xl bg-slate-50 px-3 py-2 transition hover:bg-slate-100/80">
                                    <label className="mb-0.5 block text-xs font-medium text-slate-500">Email</label>
                                    {isEditing ? (
                                        <input type="email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} className={inputClass} />
                                    ) : (
                                        <p className="h-8 flex items-center px-2 text-sm font-semibold text-slate-900">{profileData.email || <EmptyValue />}</p>
                                    )}
                                </div>

                                <div className="rounded-xl bg-slate-50 px-3 py-2 transition hover:bg-slate-100/80">
                                    <label className="mb-0.5 block text-xs font-medium text-slate-500">Số điện thoại</label>
                                    {isEditing ? (
                                        <input type="tel" value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} className={inputClass} />
                                    ) : (
                                        <p className="h-8 flex items-center px-2 text-sm font-semibold text-slate-900">{profileData.phone || <EmptyValue />}</p>
                                    )}
                                </div>

                                <div className="rounded-xl bg-slate-50 px-3 py-2 transition hover:bg-slate-100/80">
                                    <label className="mb-0.5 block text-xs font-medium text-slate-500">Ngày sinh</label>
                                    {isEditing ? (
                                        <input type="date" value={editData.dateOfBirth} onChange={(e) => setEditData({ ...editData, dateOfBirth: e.target.value })} className={inputClass} />
                                    ) : (
                                        <p className="h-8 flex items-center px-2 text-sm font-semibold text-slate-900">
                                            {profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toLocaleDateString('vi-VN') : <EmptyValue />}
                                        </p>
                                    )}
                                </div>

                                <div className="rounded-xl bg-slate-50 px-3 py-2 transition hover:bg-slate-100/80">
                                    <label className="mb-0.5 block text-xs font-medium text-slate-500">Giới tính</label>
                                    {isEditing ? (
                                        <select value={editData.gender} onChange={(e) => setEditData({ ...editData, gender: e.target.value })} className={inputClass}>
                                            <option value="MALE">Nam</option>
                                            <option value="FEMALE">Nữ</option>
                                            <option value="OTHER">Khác</option>
                                        </select>
                                    ) : (
                                        <p className="h-8 flex items-center px-2 text-sm font-semibold text-slate-900">
                                            {profileData.gender === "MALE" ? "Nam" : profileData.gender === "FEMALE" ? "Nữ" : profileData.gender ? "Khác" : <EmptyValue />}
                                        </p>
                                    )}
                                </div>

                                <div className="rounded-xl bg-slate-50 px-3 py-2 transition hover:bg-slate-100/80">
                                    <label className="mb-0.5 block text-xs font-medium text-slate-500">Địa chỉ</label>
                                    {isEditing ? (
                                        <input type="text" value={editData.address} onChange={(e) => setEditData({ ...editData, address: e.target.value })} className={inputClass} />
                                    ) : (
                                        <p className="h-8 flex items-center px-2 text-sm font-semibold text-slate-900">{profileData.address || <EmptyValue />}</p>
                                    )}
                                </div>
                            </div>
                            {/* Medical Information */}
                        </div>

                        {/* Medical Information */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft h-full">
                            <h2 className="mb-2 text-base font-bold text-slate-900">Thông tin y tế</h2>
                            <div className="grid gap-2.5">
                                <div className="rounded-xl bg-red-50/60 px-3 py-2 transition hover:bg-red-50">
                                    <label className="mb-0.5 block text-xs font-medium text-slate-500">Nhóm máu</label>
                                    {isEditing ? (
                                        <select value={editData.bloodType} onChange={(e) => setEditData({ ...editData, bloodType: e.target.value })} className={inputClass}>
                                            <option value="">-- Chọn --</option>
                                            <option value="A_POSITIVE">A+</option>
                                            <option value="A_NEGATIVE">A-</option>
                                            <option value="B_POSITIVE">B+</option>
                                            <option value="B_NEGATIVE">B-</option>
                                            <option value="O_POSITIVE">O+</option>
                                            <option value="O_NEGATIVE">O-</option>
                                            <option value="AB_POSITIVE">AB+</option>
                                            <option value="AB_NEGATIVE">AB-</option>
                                        </select>
                                    ) : (
                                        <p className="h-8 flex items-center px-2 text-sm font-semibold text-slate-900">
                                            {BLOOD_TYPES[profileData.bloodType as keyof typeof BLOOD_TYPES] || profileData.bloodType || <EmptyValue />}
                                        </p>
                                    )}
                                </div>

                                <div className="rounded-xl bg-orange-50/60 px-3 py-2 transition hover:bg-orange-50">
                                    <label className="mb-0.5 block text-xs font-medium text-slate-500">Loại da</label>
                                    {isEditing ? (
                                        <select value={editData.skinType} onChange={(e) => setEditData({ ...editData, skinType: e.target.value })} className={inputClass}>
                                            <option value="">-- Chọn --</option>
                                            <option value="Da dầu">Da dầu</option>
                                            <option value="Da khô">Da khô</option>
                                            <option value="Da hỗn hợp">Da hỗn hợp</option>
                                            <option value="Da thường">Da thường</option>
                                            <option value="Da nhạy cảm">Da nhạy cảm</option>
                                        </select>
                                    ) : (
                                        <p className="h-8 flex items-center px-2 text-sm font-semibold text-slate-900">{profileData.skinType || <EmptyValue />}</p>
                                    )}
                                </div>

                                <div className="rounded-xl bg-green-50/60 px-3 py-2 transition hover:bg-green-50">
                                    <label className="mb-0.5 block text-xs font-medium text-slate-500">Liên hệ khẩn cấp</label>
                                    {isEditing ? (
                                        <input type="tel" value={editData.emergencyContact} onChange={(e) => setEditData({ ...editData, emergencyContact: e.target.value })} className={inputClass} />
                                    ) : (
                                        <p className="h-8 flex items-center px-2 text-sm font-semibold text-slate-900">{profileData.emergencyContact || <EmptyValue />}</p>
                                    )}
                                </div>

                                <div className="rounded-xl bg-yellow-50/60 px-3 py-2 transition hover:bg-yellow-50">
                                    <label className="mb-0.5 block text-xs font-medium text-slate-500">Dị ứng</label>
                                    {isEditing ? (
                                        <input type="text" value={editData.allergies} onChange={(e) => setEditData({ ...editData, allergies: e.target.value })} className={inputClass} placeholder="Nhập dị ứng (nếu có)" />
                                    ) : (
                                        <p className="h-8 flex items-center px-2 text-sm font-semibold text-slate-900">{profileData.allergies || <EmptyValue />}</p>
                                    )}
                                </div>

                                <div className="rounded-xl bg-blue-50/60 px-3 py-2 transition hover:bg-blue-50">
                                    <label className="mb-0.5 block text-xs font-medium text-slate-500">Thuốc đang dùng</label>
                                    {isEditing ? (
                                        <input type="text" value={editData.medications} onChange={(e) => setEditData({ ...editData, medications: e.target.value })} className={inputClass} placeholder="Nhập thuốc đang dùng (nếu có)" />
                                    ) : (
                                        <p className="h-8 flex items-center px-2 text-sm font-semibold text-slate-900">{profileData.medications || <EmptyValue />}</p>
                                    )}
                                </div>

                                <div className="rounded-xl bg-purple-50/60 px-3 py-2 transition hover:bg-purple-50">
                                    <label className="mb-0.5 block text-xs font-medium text-slate-500">Bệnh mãn tính</label>
                                    {isEditing ? (
                                        <input type="text" value={editData.chronicConditions} onChange={(e) => setEditData({ ...editData, chronicConditions: e.target.value })} className={inputClass} placeholder="Nhập bệnh mãn tính (nếu có)" />
                                    ) : (
                                        <p className="h-8 flex items-center px-2 text-sm font-semibold text-slate-900">{profileData.chronicConditions || <EmptyValue />}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Sidebar */}
                    <div className="flex flex-col gap-3 h-full">
                        {/* Quick Actions */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                            <h3 className="mb-3 font-semibold text-slate-900">Hành động nhanh</h3>
                            <div className="space-y-2.5">
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
                        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-dermcare-light to-white p-5 shadow-soft flex-1 flex flex-col justify-center">
                            <h3 className="mb-3 font-semibold text-slate-900">Thống kê tài khoản</h3>
                            <div className="space-y-2.5">
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

                    </div>
                </div>
            </div>
        </div>

    );
}
