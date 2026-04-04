"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import BookingModal from "@/components/BookingModal";
import { getAllDoctors, PublicDoctor } from "@/services/doctorService";

const SPECIALTIES = [
    { id: "all", name: "Tất cả" },
    { id: "tham-my", name: "Da liễu Thẩm mỹ" },
    { id: "benh-ly", name: "Da liễu Bệnh lý & Miễn dịch" },
    { id: "ngoai-khoa", name: "Ngoại khoa Da liễu" },
    { id: "noi-khoa", name: "Da liễu Nội khoa" },
    { id: "ung-thu", name: "U & Ung thư da" },
    { id: "nhiem-trung", name: "Nhiễm trùng da & Ký sinh trùng" },
];

export default function DoctorsPage() {
    const router = useRouter();
    const { isLoggedIn } = useAuth();
    const [selectedSpecialty, setSelectedSpecialty] = useState("all");
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<{ id: string, name: string, specialty: string, avatar: string, qualifications?: string } | null>(null);

    const [doctors, setDoctors] = useState<PublicDoctor[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const data = await getAllDoctors();
                setDoctors(data);
            } catch (error) {
                console.error("Failed to fetch doctors:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    // Filter doctors based on selected specialty
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
            ? doctors
            : doctors.filter((doctor) => {
                const keyword = getFilterKeyword(selectedSpecialty).toLowerCase();
                return doctor.specialization?.toLowerCase().includes(keyword);
            });

    const handleBookClick = (doctor: PublicDoctor) => {
        if (!isLoggedIn) {
            router.push("/login");
            return;
        }

        setSelectedDoctor({
            id: doctor.user_id,
            name: doctor.user.fullName,
            specialty: doctor.specialization || "Chưa cập nhật",
            avatar: doctor.avatar || "/default-avatar.png",
            qualifications: doctor.qualifications ?? undefined
        });
        setShowBookingModal(true);
    };

    return (
        <div className="mx-auto max-w-7xl px-4 pt-4 pb-8 md:pt-6 md:pb-12 text-center md:text-left">
            {/* Header */}
            <div className="mb-6">
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
                {!isLoading && (
                    <p className="mt-3 text-sm text-slate-500">
                        Tìm thấy {filteredDoctors.length} bác sĩ
                    </p>
                )}
            </div>

            {/* Doctors Grid */}
            {isLoading ? (
                <div className="py-20 text-center text-slate-500">Đang tải danh sách bác sĩ...</div>
            ) : filteredDoctors.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {filteredDoctors.map((doctor) => (
                        <div
                            key={doctor.user_id}
                            className="card-elevated overflow-hidden transition hover:shadow-lg flex flex-col h-full rounded-2xl"
                        >
                            {/* Doctor Image */}
                            <div className="relative h-72 bg-gradient-to-br from-dermcare-light to-slate-100 overflow-hidden group">
                                <Image
                                    src={doctor.avatar || "/default-avatar.png"}
                                    alt={doctor.user.fullName || "Bác sĩ"}
                                    fill
                                    className="object-cover object-top transition duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            {/* Doctor Info */}
                            <div className="p-4 flex-1 flex flex-col">
                                <div className="min-h-[3.2rem] mb-1 flex items-start">
                                    <h3 className="text-lg font-bold text-slate-900 leading-tight line-clamp-2">
                                        {doctor.qualifications ? `${doctor.qualifications} ${doctor.user.fullName}` : (doctor.user.fullName || 'Bác sĩ')}
                                    </h3>
                                </div>
                                <p className="text-xs font-medium text-dermcare mb-1.5 truncate">{doctor.workPlace || "Đang cập nhật"}</p>

                                {/* Stats */}
                                <div className="mb-2.5 flex items-center gap-2 text-sm border-b border-slate-100 pb-1.5">
                                    <div className="flex items-center gap-1">
                                        <span className="text-amber-500">★</span>
                                        <span className="font-bold text-slate-900">
                                            {doctor.rating ? doctor.rating : "--"} / 5
                                        </span>
                                    </div>
                                </div>

                                {/* Specialties & Conditions Sections */}
                                <div className="space-y-1.5 mb-2.5">
                                    <div>
                                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                            Chuyên khoa
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {doctor.specialization ? (
                                                <span className="inline-flex items-center rounded bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                    {doctor.specialization}
                                                </span>
                                            ) : (
                                                <span className="text-[11px] text-slate-400 italic">Chưa cập nhật</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleBookClick(doctor)}
                                    className="mt-auto w-full rounded-xl bg-dermcare py-2 text-sm font-bold text-white shadow-soft transition hover:bg-dermcare-dark hover:shadow-lg active:scale-[0.98]"
                                >
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

            {/* Booking Modal */}
            {selectedDoctor && (
                <BookingModal
                    isOpen={showBookingModal}
                    onClose={() => {
                        setShowBookingModal(false);
                        setSelectedDoctor(null);
                    }}
                    doctor={{
                        id: selectedDoctor.id,
                        name: selectedDoctor.name,
                        specialty: selectedDoctor.specialty,
                        avatar: selectedDoctor.avatar,
                        qualifications: selectedDoctor.qualifications
                    }}
                />
            )}
        </div>
    );
}
