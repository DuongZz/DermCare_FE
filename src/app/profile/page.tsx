"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

import userService from "@/services/userService";
import apiClient from "@/lib/apiClient";

export default function ProfilePage() {
    const { user, isDoctor, fetchUser } = useAuth();
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

    // Doctor-specific edit state (column 2 only)
    const [doctorEditData, setDoctorEditData] = useState({
        specialization: "",
        qualifications: "",
        workPlace: "",
    });

    // Avatar
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    // Sync doctor edit data from user
    useEffect(() => {
        if (user && isDoctor) {
            setDoctorEditData({
                specialization: user.specialization || "",
                qualifications: user.qualifications || "",
                workPlace: user.work_place || "",
            });
        }
    }, [user, isDoctor]);

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
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isToastVisible, setIsToastVisible] = useState(false);

    const showToast = (msg: string) => {
        setToastMessage(msg);

        // Start enter animation slightly after render
        setTimeout(() => setIsToastVisible(true), 10);

        // Start leave animation at 2.7s
        setTimeout(() => setIsToastVisible(false), 2700);
        // Completely remove at 3s
        setTimeout(() => setToastMessage(null), 3000);
    };

    // Sync editData when profileData updates (e.g. after fetch)
    useEffect(() => {
        setEditData(profileData);
    }, [profileData]);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            if (isDoctor) {
                // Doctor: save doctor-specific fields (column 2)
                const res = await apiClient.patch('/doctors/update-info', doctorEditData);
                await fetchUser(); // Re-fetch user data to update UI
                setIsEditing(false);
                showToast(res.data?.message || "Cập nhật thông tin thành công!");
                console.log("Doctor info updated successfully");
            } else {
                // Patient: save personal info + medical info song song
                const [profileRes, medicalRes] = await Promise.all([
                    userService.updateProfile({
                        fullName: editData.fullName,
                        phone: editData.phone,
                        gender: editData.gender,
                        dateOfBirth: editData.dateOfBirth || undefined,
                        address: editData.address,
                    }),
                    userService.updateMedicalInfo({
                        skinType: editData.skinType,
                        bloodGroup: editData.bloodType,
                        allergies: editData.allergies,
                        emergencyContact: editData.emergencyContact,
                        currentMedications: editData.medications,
                        chronicConditions: editData.chronicConditions
                    }),
                ]);

                await fetchUser(); // Refresh lại user data trên UI
                setProfileData(editData);
                setIsEditing(false);
                showToast("Cập nhật thông tin thành công!");
            }

        } catch (error) {
            console.error("Failed to save:", error);
            showToast("Cập nhật thất bại. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setEditData(profileData);
        if (isDoctor && user) {
            setDoctorEditData({
                specialization: user.specialization || "",
                qualifications: user.qualifications || "",
                workPlace: user.work_place || "",
            });
        }
        setIsEditing(false);
    };

    // Avatar upload
    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        // Preview
        const reader = new FileReader();
        reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
        reader.readAsDataURL(file);
        // Upload
        setUploadingAvatar(true);
        try {
            const formData = new FormData();
            formData.append('avatar', file);
            const response = await apiClient.patch('/doctors/update-avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            await fetchUser();
            showToast(response.data?.message || "Cập nhật ảnh đại diện thành công!");
            console.log("Avatar updated");
        } catch (err) {
            console.error("Avatar upload failed:", err);
            showToast("Lỗi tải ảnh lên! Vui lòng thử lại.");
        } finally {
            setUploadingAvatar(false);
        }
    };

    const inputClass = "w-full rounded-md border border-slate-300 bg-white px-2 h-8 text-sm text-slate-900 focus:border-dermcare focus:outline-none focus:ring-1 focus:ring-dermcare/20";

    const EmptyValue = () => <span className="font-normal text-slate-400">--</span>;

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
        <div className="min-h-screen bg-slate-50 py-2 pt-3 relative">
            {toastMessage && (
                <div className={`fixed top-28 left-1/2 z-[100] rounded-full border border-dermcare bg-white px-6 py-2.5 text-sm font-semibold text-dermcare shadow-lg transition-all duration-500 ease-in-out transform ${isToastVisible
                    ? 'translate-y-0 opacity-100 -translate-x-1/2'
                    : '-translate-y-12 opacity-0 -translate-x-1/2'
                    }`}>
                    {toastMessage}
                </div>
            )}
            <div className="mx-auto max-w-5xl px-4">

                {/* Header */}
                <div className="mb-5 flex items-center justify-between">
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
                            ✏️ {isDoctor ? 'Chỉnh sửa hồ sơ bác sĩ' : 'Chỉnh sửa'}
                        </button>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={handleCancel}
                                disabled={isLoading}
                                className="rounded-full border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="rounded-full bg-dermcare px-6 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-dermcare-dark transition disabled:opacity-50"
                            >
                                {isLoading ? '⏳ Đang lưu...' : '💾 Lưu thay đổi'}
                            </button>
                        </div>
                    )}
                </div>


                {/* Profile Content */}
                <div className="grid gap-4 lg:grid-cols-3">
                    {/* Main Info */}
                    <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                        {/* Column 1: Avatar Upload (Doctor) / Personal Info (Patient) */}
                        {isDoctor ? (
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft flex flex-col items-center justify-center text-center h-full">
                                {/* Avatar */}
                                <div className="relative group mb-4">
                                    <div className="h-56 w-56 rounded-2xl border-2 border-dermcare/20 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center shadow-md">
                                        {(avatarPreview || user?.avatar) ? (
                                            <Image
                                                src={avatarPreview || user?.avatar || ''}
                                                alt="Avatar"
                                                width={224}
                                                height={224}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-8xl font-bold text-dermcare/30">
                                                {user?.fullName?.charAt(0)?.toUpperCase() || '?'}
                                            </span>
                                        )}
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                </div>

                                {/* Name & Info */}
                                <h3 className="text-lg font-bold text-slate-900">
                                    {user?.qualifications ? `${user.qualifications} ${user.fullName}` : (user?.fullName || 'Bác sĩ')}
                                </h3>
                                {user?.specialization && (
                                    <p className="text-sm text-dermcare font-medium mt-2">{user.specialization}</p>
                                )}
                                {user?.work_place && (
                                    <p className="text-sm text-slate-500 mt-0.5">{user.work_place}</p>
                                )}

                                {/* Upload Button */}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploadingAvatar}
                                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-dermcare/30 bg-dermcare/5 px-4 py-2 text-sm font-medium text-dermcare hover:bg-dermcare/10 transition disabled:opacity-50"
                                >
                                    {uploadingAvatar ? '⏳ Đang tải...' : '📷 Thay đổi ảnh'}
                                </button>

                                {user?.rating ? (
                                    <div className="mt-3 flex items-center gap-1 text-sm text-amber-500 font-semibold">
                                        ⭐ {user.rating}/5
                                    </div>
                                ) : null}
                            </div>
                        ) : (
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
                                        <p className="h-8 flex items-center px-2 text-sm font-semibold text-slate-900">{profileData.email || <EmptyValue />}</p>
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
                            </div>
                        )}

                        {/* Doctor Info — EDITABLE column 2 */}
                        {isDoctor ? (
                            <div className={`rounded-2xl border bg-white p-5 shadow-soft h-full ${isEditing ? 'border-dermcare/40 ring-2 ring-dermcare/10' : 'border-slate-200'}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-base font-bold text-slate-900">Thông tin bác sĩ</h2>
                                    {isEditing && (
                                        <span className="text-[10px] font-semibold text-dermcare bg-dermcare/10 px-2 py-0.5 rounded-full">Đang chỉnh sửa</span>
                                    )}
                                </div>
                                <div className="grid gap-4">
                                    <div className="rounded-xl bg-blue-50/60 px-4 py-3 transition hover:bg-blue-50">
                                        <label className="mb-1 block text-xs font-medium text-slate-500">Chuyên khoa</label>
                                        {isEditing ? (
                                            <select value={doctorEditData.specialization} onChange={(e) => setDoctorEditData({ ...doctorEditData, specialization: e.target.value })} className={inputClass}>
                                                <option value="">-- Chọn chuyên khoa --</option>
                                                <option value="Da liễu thẩm mỹ">Da liễu thẩm mỹ</option>
                                                <option value="Da liễu bệnh lý & miễn dịch">Da liễu bệnh lý & miễn dịch</option>
                                                <option value="Ngoại khoa da liễu">Ngoại khoa da liễu</option>
                                                <option value="Da liễu nội khoa">Da liễu nội khoa</option>
                                                <option value="U & ung thư da">U & ung thư da</option>
                                                <option value="Nhiễm trùng da & ký sinh trùng">Nhiễm trùng da & ký sinh trùng</option>
                                            </select>
                                        ) : (
                                            <p className="h-8 flex items-center px-2 text-sm font-semibold text-slate-900">{user?.specialization || <EmptyValue />}</p>
                                        )}
                                    </div>
                                    <div className="rounded-xl bg-green-50/60 px-4 py-3 transition hover:bg-green-50">
                                        <label className="mb-1 block text-xs font-medium text-slate-500">Chuyên môn</label>
                                        {isEditing ? (
                                            <select value={doctorEditData.qualifications} onChange={(e) => setDoctorEditData({ ...doctorEditData, qualifications: e.target.value })} className={inputClass}>
                                                <option value="">-- Chọn chuyên môn --</option>
                                                <option value="BS">Bác sĩ (BS)</option>
                                                <option value="ThS.BS">Thạc sĩ, Bác sĩ (ThS.BS)</option>
                                                <option value="TS.BS">Tiến sĩ, Bác sĩ (TS.BS)</option>
                                                <option value="BS.CKI">Bác sĩ Chuyên khoa I (BS.CKI)</option>
                                                <option value="BS.CKII">Bác sĩ Chuyên khoa II (BS.CKII)</option>
                                                <option value="PGS.TS.BS">Phó Giáo sư, Tiến sĩ, Bác sĩ (PGS.TS.BS)</option>
                                                <option value="GS.TS.BS">Giáo sư, Tiến sĩ, Bác sĩ (GS.TS.BS)</option>
                                            </select>
                                        ) : (
                                            <p className="h-8 flex items-center px-2 text-sm font-semibold text-slate-900">{user?.qualifications || <EmptyValue />}</p>
                                        )}
                                    </div>
                                    <div className="rounded-xl bg-indigo-50/60 px-4 py-3 transition hover:bg-indigo-50">
                                        <label className="mb-1 block text-xs font-medium text-slate-500">Nơi làm việc</label>
                                        {isEditing ? (
                                            <input type="text" value={doctorEditData.workPlace} onChange={(e) => setDoctorEditData({ ...doctorEditData, workPlace: e.target.value })} className={inputClass} placeholder="VD: Bệnh viện Da liễu TP.HCM..." />
                                        ) : (
                                            <p className="h-8 flex items-center px-2 text-sm font-semibold text-slate-900">{user?.work_place || <EmptyValue />}</p>
                                        )}
                                    </div>
                                    <div className="rounded-xl bg-amber-50/60 px-4 py-3 transition hover:bg-amber-50">
                                        <label className="mb-1 block text-xs font-medium text-slate-500">Đánh giá</label>
                                        <p className="h-8 flex items-center px-2 text-sm font-semibold text-slate-900">
                                            {user?.rating ? `⭐ ${user.rating}/5` : "--"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
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
                        )}

                    </div>

                    {/* Sidebar */}
                    <div className="flex flex-col gap-3 h-full">
                        {/* Quick Actions */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                            <h3 className="mb-3 font-semibold text-slate-900">Hành động nhanh</h3>
                            <div className="space-y-2.5">
                                {isDoctor ? (
                                    <>
                                        <Link
                                            href="/doctor/appointments"
                                            className="flex items-center gap-3 rounded-lg border border-dermcare/30 bg-dermcare/5 p-3 text-sm text-dermcare font-medium transition hover:border-dermcare hover:bg-dermcare/10"
                                        >
                                            <span className="text-xl">🩺</span>
                                            <span>Quản lý lịch hẹn</span>
                                        </Link>
                                        <Link
                                            href="/doctor/schedule"
                                            className="flex items-center gap-3 rounded-lg border border-dermcare/30 bg-dermcare/5 p-3 text-sm text-dermcare font-medium transition hover:border-dermcare hover:bg-dermcare/10"
                                        >
                                            <span className="text-xl">🗓️</span>
                                            <span>Lịch làm việc</span>
                                        </Link>
                                    </>
                                ) : (
                                    <>
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
                                    </>
                                )}
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
                            <h3 className="mb-3 font-semibold text-slate-900">{isDoctor ? 'Thống kê hoạt động' : 'Thống kê tài khoản'}</h3>
                            <div className="space-y-2.5">
                                {isDoctor ? (
                                    <>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Ca khám</span>
                                            <span className="text-lg font-bold text-dermcare">--</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Bệnh nhân</span>
                                            <span className="text-lg font-bold text-dermcare">--</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Đánh giá TB</span>
                                            <span className="text-lg font-bold text-dermcare">--</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
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
                                    </>
                                )}
                            </div>
                        </div>

                    </div>
                </div>


            </div>
        </div>

    );
}
