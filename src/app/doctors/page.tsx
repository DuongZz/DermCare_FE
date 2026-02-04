"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Mock data - sẽ thay bằng API call sau này
interface Doctor {
    id: string;
    name: string;
    specialty: string[];
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
    { id: "viem-da", name: "Viêm da" },
    { id: "mun", name: "Mụn trứng cá" },
    { id: "ung-thu", name: "Ung thư da" },
    { id: "nam-da", name: "Nấm da" },
    { id: "vay-nen", name: "Vẩy nến" },
    { id: "tham-my", name: "Thẩm mỹ da" },
    { id: "nhay-cam", name: "Da nhạy cảm" },
];

const MOCK_DOCTORS: Doctor[] = [
    {
        id: "1",
        name: "BS. Cù Thị Hải Nê",
        specialty: ["viem-da", "nhay-cam"],
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
        specialty: ["mun", "tham-my"],
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
        specialty: ["ung-thu", "viem-da"],
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
        specialty: ["nam-da", "viem-da"],
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
        specialty: ["vay-nen", "nhay-cam"],
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
        specialty: ["mun", "viem-da"],
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
        specialty: ["ung-thu", "tham-my"],
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
    const [selectedSpecialty, setSelectedSpecialty] = useState("all");

    // Filter doctors based on selected specialty
    const filteredDoctors =
        selectedSpecialty === "all"
            ? MOCK_DOCTORS
            : MOCK_DOCTORS.filter((doctor) =>
                doctor.specialty.includes(selectedSpecialty)
            );

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
                            className="card-elevated overflow-hidden transition hover:shadow-lg"
                        >
                            {/* Doctor Image */}
                            <div className="relative h-48 bg-gradient-to-br from-dermcare-light to-slate-100 overflow-hidden">
                                <Image
                                    src={doctor.image}
                                    alt={doctor.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Doctor Info */}
                            <div className="p-5">
                                <h3 className="text-lg font-semibold text-slate-900">
                                    {doctor.name}
                                </h3>
                                <p className="mt-1 text-sm text-slate-600">{doctor.hospital}</p>

                                {/* Specialties */}
                                <div className="mt-3 flex flex-wrap gap-1.5">
                                    {doctor.specialty.map((spec) => {
                                        const specialtyName = SPECIALTIES.find(
                                            (s) => s.id === spec
                                        )?.name;
                                        return (
                                            <span
                                                key={spec}
                                                className="rounded-full bg-dermcare-light px-2.5 py-0.5 text-xs font-medium text-dermcare-dark"
                                            >
                                                {specialtyName}
                                            </span>
                                        );
                                    })}
                                </div>

                                {/* Stats */}
                                <div className="mt-4 flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                        <span className="text-amber-500">★</span>
                                        <span className="font-semibold text-slate-900">
                                            {doctor.rating}
                                        </span>
                                        <span className="text-slate-500">
                                            ({doctor.reviewCount})
                                        </span>
                                    </div>
                                    <div className="text-slate-600">
                                        {doctor.experience} năm KN
                                    </div>
                                </div>

                                {/* Education & Price */}
                                <div className="mt-3 space-y-1 text-sm text-slate-600">
                                    <p>🎓 {doctor.education}</p>
                                    <p className="font-medium text-dermcare">{doctor.price}</p>
                                </div>

                                {/* Available Slots */}
                                <div className="mt-3 text-sm">
                                    <span className="text-emerald-600">
                                        ✓ {doctor.availableSlots} khung giờ còn trống
                                    </span>
                                </div>

                                {/* Action Button */}
                                <button className="mt-4 w-full rounded-lg bg-dermcare py-2.5 text-sm font-semibold text-white transition hover:bg-dermcare-dark">
                                    Đặt lịch khám
                                </button>
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
        </div>
    );
}
