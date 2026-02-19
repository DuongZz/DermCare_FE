"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import BookingModal from "@/components/BookingModal";

// Mock data - sẽ thay bằng API call sau này
interface Doctor {
    id: string;
    name: string;
    specialties: string[]; // Chuyên khoa (VD: Da liễu thẩm mỹ, Nội khoa...)
    skinConditions: string[]; // Sở trường / Mảng bệnh (VD: Mụn, Nám, Sẹo...)
    image: string;
    rating: number;
    reviewCount: number;
    experience: number;
    education: string;
    hospital: string;
    price: string;
    availableSlots: number;
}

const SPECIALTIES = [
    { id: "all", name: "Tất cả" },
    { id: "tham-my", name: "Da liễu Thẩm mỹ" },
    { id: "benh-ly", name: "Da liễu Bệnh lý & Miễn dịch" },
    { id: "ngoai-khoa", name: "Ngoại khoa Da liễu" },
    { id: "noi-khoa", name: "Da liễu Nội khoa" },
    { id: "ung-thu", name: "U & Ung thư da" },
    { id: "nhiem-trung", name: "Nhiễm trùng da & Ký sinh trùng" },
];

const MOCK_DOCTORS: Doctor[] = [
    {
        id: "1",
        name: "BS. Cù Thị Hải Nê",
        specialties: ["Da liễu Nội khoa", "Da liễu Thẩm mỹ"],
        skinConditions: ["Viêm da cơ địa", "Mề đay", "Dị ứng", "Da nhạy cảm"],
        image: "/yen.jpg",
        rating: 3.6,
        reviewCount: 234,
        experience: 12,
        education: "Đại học Phương Đông",
        hospital: "Bệnh viện Da liễu Trung ương",
        price: "300.000 - 500.000đ",
        availableSlots: 8,
    },
    {
        id: "2",
        name: "BS. Đào Quang Yê",
        specialties: ["Da liễu Thẩm mỹ", "Ngoại khoa Da liễu"],
        skinConditions: ["Mụn trứng cá", "Sẹo rỗ", "Lỗ chân lông to", "Trẻ hóa da"],
        image: "/duong.jpg",
        rating: 5.0,
        reviewCount: 189,
        experience: 15,
        education: "Đại học Password",
        hospital: "Phòng khám Da liễu Sài Gòn",
        price: "400.000 - 600.000đ",
        availableSlots: 5,
    },
    {
        id: "3",
        name: "TS.BS. Đào Quang Dương",
        specialties: ["U & Ung thư da", "Ngoại khoa Da liễu"],
        skinConditions: ["Ung thư da", "U lành tính", "Nốt ruồi", "Mụn cóc"],
        image: "/duongtro.jpg",
        rating: 5.0,
        reviewCount: 312,
        experience: 20,
        education: "Học Viện Kỹ thuật Mật mã",
        hospital: "Bệnh viện Ung bướu TP.HCM",
        price: "500.000 - 800.000đ",
        availableSlots: 3,
    },
    {
        id: "4",
        name: "BS. Cao Khuê Béo",
        specialties: ["Da liễu Bệnh lý & Miễn dịch", "Nhiễm trùng da & Ký sinh trùng"],
        skinConditions: ["Nấm da", "Lang ben", "Vảy nến", "Ghẻ"],
        image: "/khuebeo.jpg",
        rating: 3.8,
        reviewCount: 156,
        experience: 10,
        education: "Đại học Y Nghệ An",
        hospital: "Phòng khám Da liễu Khuê Múp",
        price: "250.000 - 400.000đ",
        availableSlots: 12,
    },
    {
        id: "5",
        name: "BS. Tốt Chiến",
        specialties: ["Da liễu Bệnh lý & Miễn dịch", "Nhiễm trùng da & Ký sinh trùng"],
        skinConditions: ["Sùi mào gà", "Lậu", "Giang mai", "Herpes"],
        image: "/ganarcho.jpg",
        rating: 0.1,
        reviewCount: 203,
        experience: 14,
        education: "Đại học Y Dược Manchester",
        hospital: "Bệnh viện Da liễu Hà Nội",
        price: "350.000 - 550.000đ",
        availableSlots: 6,
    },
    {
        id: "6",
        name: "BS. Đỗ Ngọc Đức",
        specialties: ["Da liễu Thẩm mỹ"],
        skinConditions: ["Mụn nội tiết", "Thâm mụn", "Sạm da"],
        image: "/duc.jpg",
        rating: 1.8,
        reviewCount: 142,
        experience: 8,
        education: "Đại học Y Nem Định",
        hospital: "Phòng khám Hai Ngón",
        price: "300.000 - 450.000đ",
        availableSlots: 35,
    },
    {
        id: "7",
        name: "PGS.TS. Phạm Tuấn Hịp",
        specialties: ["Da liễu Thẩm mỹ", "Ngoại khoa Da liễu"],
        skinConditions: ["Nám mảng", "Tàn nhang", "Đồi mồi", "Xóa xăm"],
        image: "/hiepdan.jpg",
        rating: 3.6,
        reviewCount: 428,
        experience: 25,
        education: "Đại học Y Thanh Hóa, Hà Nội",
        hospital: "Bệnh viện Da liễu Trung ương Ba Sáu",
        price: "600.000 - 1.000.000đ",
        availableSlots: 36,
    },
];

export default function DoctorsPage() {
    const router = useRouter();
    const { isLoggedIn } = useAuth();
    const [selectedSpecialty, setSelectedSpecialty] = useState("all");
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

    // Filter doctors based on selected specialty
    // Mapping ID -> Keyword search or exact match logic
    const getFilterKeyword = (id: string) => {
        switch (id) {
            case "tham-my": return "thẩm mỹ";
            case "benh-ly": return "bệnh lý";
            case "ngoai-khoa": return "ngoại khoa";
            case "noi-khoa": return "nội khoa";
            case "ung-thu": return "ung thư";
            case "nhiem-trung": return "nhiễm trùng";
            default: return "";
        }
    };

    const filteredDoctors =
        selectedSpecialty === "all"
            ? MOCK_DOCTORS
            : MOCK_DOCTORS.filter((doctor) => {
                const keyword = getFilterKeyword(selectedSpecialty).toLowerCase();
                // Check if any of the doctor's specialties contains the keyword
                // Case insensitive comparison
                return doctor.specialties.some(s => s.toLowerCase().includes(keyword));
            });

    const handleBookClick = (doctor: Doctor) => {
        // Check if user is logged in
        if (!isLoggedIn) {
            // Redirect to login if not authenticated
            router.push("/login");
            return;
        }

        // If logged in, show booking modal
        setSelectedDoctor(doctor);
        setShowBookingModal(true);
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                    Đội ngũ bác sĩ da liễu
                </h1>
                <p className="mt-2 text-slate-600">
                    Kết nối với các bác sĩ da liễu hàng đầu, được đào tạo chuyên sâu
                </p>
            </div>

            {/* Specialty Filter */}
            <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                    {SPECIALTIES.map((specialty) => (
                        <button
                            key={specialty.id}
                            onClick={() => setSelectedSpecialty(specialty.id)}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition ${selectedSpecialty === specialty.id
                                ? "bg-dermcare text-white shadow-soft"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                }`}
                        >
                            {specialty.name}
                        </button>
                    ))}
                </div>
                <p className="mt-3 text-sm text-slate-500">
                    Tìm thấy {filteredDoctors.length} bác sĩ
                </p>
            </div>

            {/* Doctors Grid */}
            {filteredDoctors.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredDoctors.map((doctor) => (
                        <div
                            key={doctor.id}
                            className="card-elevated overflow-hidden transition hover:shadow-lg flex flex-col h-full"
                        >
                            {/* Doctor Image */}
                            <div className="relative h-56 bg-gradient-to-br from-dermcare-light to-slate-100 overflow-hidden group">
                                <Image
                                    src={doctor.image}
                                    alt={doctor.name}
                                    fill
                                    className="object-cover transition duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            {/* Doctor Info */}
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-slate-900">
                                    {doctor.name}
                                </h3>
                                <p className="text-sm font-medium text-dermcare mt-0.5">{doctor.hospital}</p>

                                {/* Stats */}
                                <div className="my-3 flex items-center gap-4 text-sm border-b border-slate-100 pb-3">
                                    <div className="flex items-center gap-1">
                                        <span className="text-amber-500">★</span>
                                        <span className="font-bold text-slate-900">
                                            {doctor.rating}
                                        </span>
                                        <span className="text-slate-500">
                                            ({doctor.reviewCount})
                                        </span>
                                    </div>
                                    <div className="text-slate-600 pl-4 border-l border-slate-200">
                                        {doctor.experience} năm KN
                                    </div>
                                </div>

                                {/* Specialties & Conditions Sections */}
                                <div className="space-y-3 mb-4">
                                    {/* 1. Specialties */}
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                                            Chuyên khoa chính
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {doctor.specialties.map((spec, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                                                >
                                                    {spec}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 2. Skin Conditions */}
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                                            Sở trường / Mảng bệnh
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {doctor.skinConditions.map((cond, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                                                >
                                                    {cond}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    {/* Education & Price */}
                                    <div className="flex justify-between items-end text-sm text-slate-600 mb-3 bg-slate-50 p-2 rounded-lg">
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-semibold uppercase">Giá khám</p>
                                            <p className="font-bold text-slate-900">{doctor.price}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-emerald-600 text-xs font-medium flex items-center justify-end gap-1">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                                                </span>
                                                Còn {doctor.availableSlots} lịch
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        onClick={() => handleBookClick(doctor)}
                                        className="w-full rounded-xl bg-dermcare py-3 text-sm font-bold text-white shadow-soft transition hover:bg-dermcare-dark hover:shadow-lg active:scale-[0.98]"
                                    >
                                        Đặt lịch khám
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // Empty State
                <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
                    <div className="mx-auto max-w-sm">
                        <p className="text-lg font-medium text-slate-900">
                            Không tìm thấy bác sĩ
                        </p>
                        <p className="mt-2 text-sm text-slate-600">
                            Hiện tại chưa có bác sĩ cho chuyên khoa này. Vui lòng chọn chuyên
                            khoa khác.
                        </p>
                        <button
                            onClick={() => setSelectedSpecialty("all")}
                            className="mt-4 text-sm font-medium text-dermcare hover:underline"
                        >
                            Xem tất cả bác sĩ
                        </button>
                    </div>
                </div>
            )}

            {/* Booking Modal */}
            {selectedDoctor && (
                <BookingModal
                    isOpen={showBookingModal}
                    onClose={() => {
                        setShowBookingModal(false);
                        setSelectedDoctor(null);
                    }}
                    doctor={{
                        name: selectedDoctor.name,
                        specialty: selectedDoctor.specialties[0], // Lấy chuyên khoa đầu tiên để hiển thị trong modal
                        avatar: selectedDoctor.image
                    }}
                />
            )}
        </div>
    );
}
