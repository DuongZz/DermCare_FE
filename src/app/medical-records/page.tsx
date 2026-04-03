"use client";

import { useState, useEffect } from "react";
import { medicalRecordService } from "@/services/medicalRecordService";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Calendar,
    ChevronRight,
    Stethoscope,
    Pill,
    MessageSquare,
    Download,
    Share2,
    RotateCcw,
    Image as ImageIcon,
    X,
    PenLine
} from "lucide-react";

export default function MedicalRecordsPage() {
    const { isLoggedIn, user, isDoctor } = useAuth();
    const router = useRouter();
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoggedIn) return;
        fetchRecords();
    }, [isLoggedIn]);

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const data = await medicalRecordService.getMedicalRecords();
            setRecords(data);
            if (data.length > 0 && !selectedRecord) {
                setSelectedRecord(data[0]);
            }
        } catch (error) {
            console.error("Error fetching medical records:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="flex h-screen items-center justify-center p-8 bg-white">
                <div className="bg-slate-900 p-8 max-w-sm rounded-[2rem] shadow-2xl text-center">
                    <h2 className="text-xl font-bold mb-2 text-white">Yêu cầu đăng nhập</h2>
                    <p className="text-slate-400 mb-8 text-xs">Vui lòng đăng nhập để truy cập hồ sơ y tế.</p>
                    <Link href="/login" className="block w-full bg-white text-slate-900 py-3 rounded-xl font-bold hover:bg-slate-100 transition-all">Đăng nhập</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-white flex flex-col overflow-hidden text-slate-900 font-sans">
            <main className="flex-1 flex overflow-hidden p-6 gap-8 max-w-[1400px] mx-auto w-full">

                {/* 1. SIDEBAR: DARK THEME LIKE WIREFRAME */}
                <div className="w-64 flex flex-col shrink-0 animate-in fade-in duration-500">
                    <h2 className="text-2xl font-black mb-6 px-2 text-slate-900 leading-tight">Hồ sơ y tế</h2>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        {loading ? (
                            Array(4).fill(0).map((_, i) => (
                                <div key={i} className="h-14 bg-slate-100 rounded-[1.25rem] animate-pulse"></div>
                            ))
                        ) : records.length === 0 ? (
                            <div className="p-4 text-center border-2 border-dashed border-slate-100 rounded-[1.25rem]">
                                <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">Không có dữ liệu</p>
                            </div>
                        ) : (
                            records.map((record) => {
                                const isActive = selectedRecord?.id === record.id;
                                const displayName = isDoctor ? record.patient?.fullName : record.doctor?.fullName;

                                return (
                                    <div
                                        key={record.id}
                                        onClick={() => setSelectedRecord(record)}
                                        className={`group relative p-5 flex flex-col justify-center rounded-[1.5rem] transition-all duration-300 cursor-pointer border ${isActive
                                            ? 'bg-white border-[#009EDB]'
                                            : 'bg-white border-[#E2E8F0] hover:border-[#009EDB]/50'
                                            }`}
                                    >
                                        <h3 className={`text-sm font-black mb-1 line-clamp-1 ${isActive ? "text-[#009EDB]" : "text-slate-700"}`}>
                                            Tư vấn với {isDoctor ? `BN. ${record.patient?.fullName}` : `BS. ${record.doctor?.fullName}`}
                                        </h3>
                                        <p className="text-[11px] font-bold text-slate-400">
                                            {new Date(record.created_at).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* 2. MAIN DETAIL: GRAY THEME LIKE WIREFRAME */}
                <div className="flex-1 flex flex-col min-h-0 animate-in fade-in duration-500 delay-100">
                    {selectedRecord ? (
                        <div className="bg-[#F2F2F2] rounded-[2.5rem] pt-6 px-8 pb-8 flex flex-col h-142 overflow-hidden">

                            {/* Top Profile Header - Tightened Spacing */}
                            <div className="flex items-center gap-3 mb-2 px-2">
                                <div className="h-12 w-12 rounded-full bg-white border-2 border-[#009EDB]/20 p-0.5 shrink-0 overflow-hidden">
                                    {isDoctor ? (
                                        selectedRecord.patient?.avatar ? (
                                            <img src={selectedRecord.patient.avatar} className="h-full w-full object-cover rounded-full" alt="" />
                                        ) : (
                                            <div className="h-full w-full bg-slate-50 flex items-center justify-center text-xs font-black text-slate-400 uppercase">
                                                {selectedRecord.patient?.fullName?.charAt(0)}
                                            </div>
                                        )
                                    ) : (
                                        selectedRecord.doctor?.doctorProfile?.avatar ? (
                                            <img src={selectedRecord.doctor.doctorProfile.avatar} className="h-full w-full object-cover rounded-full" alt="" />
                                        ) : (
                                            <div className="h-full w-full bg-slate-50 flex items-center justify-center text-xs font-black text-slate-400 uppercase">
                                                {selectedRecord.doctor?.fullName?.charAt(0)}
                                            </div>
                                        )
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-slate-900 tracking-tight leading-none">
                                        {!isDoctor && "GS. TS. "}{isDoctor ? selectedRecord.patient?.fullName : selectedRecord.doctor?.fullName}
                                    </h2>
                                    <p className="text-[10px] font-bold text-[#009EDB] uppercase tracking-widest mt-1">
                                        {isDoctor ? "Bệnh nhân" : "Bác sĩ phụ trách"}
                                    </p>
                                </div>
                            </div>

                            {/* Inner Split Layout - Tighter Top Spacing */}
                            <div className="flex-1 flex gap-5 min-h-0 overflow-hidden px-2 pb-2 mt-0">

                                {/* 2.1 TEXTUAL COLUMN (LEFT-SUB) - Refined Compact Blocks */}
                                <div className="w-[35%] flex flex-col gap-3 min-h-0">
                                    {/* DiagnosisCard - Content Fitting */}
                                    <div className="bg-white text-slate-600 p-4 rounded-[1.25rem] flex flex-col overflow-hidden h-fit min-h-[80px] border-2 border-[#0284C7]/20">
                                        <div className="flex items-center gap-2 mb-2 shrink-0">
                                            <Stethoscope size={14} className="text-[#0284C7]" />
                                            <h4 className="text-xs font-black uppercase tracking-[0.1em] text-[#0284C7]">Kết quả chẩn đoán</h4>
                                        </div>
                                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                                            <p className="text-sm font-bold leading-tight pr-1 text-slate-700">
                                                {selectedRecord.diagnosis?.AIResult || 'Nhận kết quả...'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* TreatmentCard - Compact Height */}
                                    <div className="bg-white text-slate-600 p-4 rounded-[1.25rem] flex flex-col overflow-hidden h-fit min-h-[170px] border-2 border-[#0284C7]/20">
                                        <div className="flex items-center gap-2 mb-2 shrink-0">
                                            <Pill size={14} className="text-[#0284C7]" />
                                            <h4 className="text-xs font-black uppercase tracking-[0.1em] text-[#0284C7]">Đơn thuốc & Liệu trình</h4>
                                        </div>
                                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                                            <p className="text-sm font-medium leading-relaxed pr-1 whitespace-pre-line text-slate-600">
                                                {selectedRecord.treatment || 'Chưa có liệu trình.'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* NoteCard - Compact Height */}
                                    <div className="bg-white text-slate-600 p-5 rounded-[1.5rem] flex flex-col overflow-hidden border-2 border-[#0284C7]/20 h-fit min-h-[170px]">
                                        <div className="flex items-center gap-2 mb-2 shrink-0">
                                            <PenLine size={16} className="text-[#0284C7]" />
                                            <h4 className="text-xs font-black uppercase tracking-[0.1em] text-[#0284C7]">Ghi chú</h4>
                                        </div>
                                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                                            <p className="text-sm font-bold italic opacity-90 leading-relaxed text-slate-500">
                                                "{selectedRecord.note || 'Không có ghi chú.'}"
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* 2.2 VISUAL COLUMN (RIGHT-SUB) - Content-Fitting Gallery */}
                                <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-hidden">
                                    <div className="bg-white p-6 rounded-[2.5rem] flex flex-col h-[460px] border-2 border-[#0284C7]/10">
                                        <div className="flex items-center gap-3 mb-2 shrink-0">
                                            <ImageIcon size={20} className="text-[#009EDB]" />
                                            <h4 className="text-xs font-black uppercase tracking-[0.1em] text-[#009EDB]">Ảnh chẩn đoán</h4>
                                        </div>

                                        <div className="overflow-y-auto custom-scrollbar pr-2 max-h-[400px]">
                                            {selectedRecord.images && selectedRecord.images.length > 0 ? (
                                                <div className="grid grid-cols-2 gap-2">
                                                    {selectedRecord.images.map((img: string, idx: number) => (
                                                        <div
                                                            key={idx}
                                                            onClick={() => setPreviewImage(img)}
                                                            className={`relative aspect-square rounded-[2rem] overflow-hidden group border border-slate-100 cursor-zoom-in ${idx === 0 && selectedRecord.images.length === 1 ? 'col-span-2' : ''}`}
                                                        >
                                                            <img src={img} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" alt="" />
                                                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="py-12 flex flex-col items-center justify-center opacity-20">
                                                    <ImageIcon size={64} strokeWidth={1} className="text-[#009EDB]" />
                                                    <p className="text-[12px] font-black uppercase mt-6 tracking-widest text-[#009EDB]">Không có ảnh hồ sơ</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Bar Inside Detail - Sitting Directly Below Content */}
                                        <div className="mt-8 flex gap-3 pt-3 border-t border-slate-50">
                                            <button className="flex-1 h-12 bg-[#009EDB] text-white rounded-xl font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#007AB0] transition transform active:scale-95">
                                                <Download size={14} /> Tải hồ sơ PDF
                                            </button>
                                            <button
                                                onClick={() => router.push(`/chat?id=${selectedRecord.appointment?.conversation?.id}`)}
                                                className="h-12 px-6 border-2 border-[#009EDB]/20 text-[#009EDB] rounded-xl font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#009EDB]/5 transition active:scale-95">
                                                <MessageSquare size={14} /> Chat
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-center p-12">
                            <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest leading-loose">Vui lòng chọn hồ sơ ở danh sách bên trái</h3>
                        </div>
                    )}
                </div>
            </main>

            {/* Lightbox / Image Preview Modal */}
            {previewImage && (
                <div
                    className="fixed inset-0 z-[999] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in duration-300"
                    onClick={() => setPreviewImage(null)}
                >
                    <button
                        className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
                        onClick={() => setPreviewImage(null)}
                    >
                        <X size={32} />
                    </button>
                    <div
                        className="relative max-w-5xl max-h-full rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={previewImage}
                            className="w-full h-full object-contain"
                            alt="Phóng to ảnh chẩn đoán"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
