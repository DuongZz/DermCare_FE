"use client";

import { useState, useEffect } from "react";
import { medicalRecordService } from "@/services/medicalRecordService";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MedicalRecordsPage() {
    const { isLoggedIn, user, isDoctor } = useAuth();
    const router = useRouter();
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);

    useEffect(() => {
        if (!isLoggedIn) return;
        fetchRecords();
    }, [isLoggedIn]);

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const data = await medicalRecordService.getMedicalRecords();
            setRecords(data);
        } catch (error) {
            console.error("Error fetching medical records:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="flex min-h-screen items-center justify-center p-8 text-center bg-slate-50">
                <div className="card-elevated p-12 max-w-md">
                    <h2 className="text-2xl font-bold mb-4 text-slate-900">Vui lòng đăng nhập</h2>
                    <p className="text-slate-600 mb-8">Bạn cần đăng nhập để xem hồ sơ y tế của mình.</p>
                    <Link href="/login" className="inline-block bg-dermcare text-white px-8 py-3 rounded-full font-semibold shadow-soft hover:bg-dermcare-dark transition">
                        Đăng nhập ngay
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Hồ sơ y tế</h1>
                        <p className="text-slate-500 mt-1">Lịch sử khám bệnh và chẩn đoán của bạn</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2">
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tổng số hồ sơ:</span>
                            <span className="text-lg font-bold text-dermcare">{records.length}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* TIMELINE LIST */}
                    <div className="lg:col-span-4 space-y-4">
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Lịch sử khám</h2>
                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-32 bg-white rounded-2xl animate-pulse border border-slate-100"></div>
                                ))}
                            </div>
                        ) : records.length === 0 ? (
                            <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 border-dashed">
                                <span className="text-4xl mb-4 block">📋</span>
                                <p className="text-slate-500">Chưa có hồ sơ y tế nào.</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 scrollbar-hide">
                                {records.map((record) => (
                                    <div
                                        key={record.id}
                                        onClick={() => setSelectedRecord(record)}
                                        className={`group relative p-5 bg-white rounded-2xl border transition-all cursor-pointer shadow-sm hover:shadow-md ${selectedRecord?.id === record.id ? 'border-dermcare ring-1 ring-dermcare' : 'border-slate-100'}`}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 py-0.5 bg-slate-50 rounded border border-slate-100">
                                                {new Date(record.created_at).toLocaleDateString('vi-VN')}
                                            </span>
                                            {record.diagnosis?.AIConfidence > 0.8 && (
                                                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">Độ tin cậy cao</span>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-slate-800 group-hover:text-dermcare transition line-clamp-1">
                                            {record.diagnosis?.AIResult || 'Chưa có chẩn đoán'}
                                        </h3>
                                        <div className="mt-4 flex items-center gap-3 border-t border-slate-50 pt-3">
                                            <img
                                                src={record.doctor?.avatar || '/default-avatar.png'}
                                                alt={record.doctor?.fullName}
                                                className="h-8 w-8 rounded-full object-cover border border-slate-200"
                                            />
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-slate-700 truncate">{record.doctor?.fullName}</p>
                                                <p className="text-[10px] text-slate-400 truncate">Bác sĩ chuyên khoa</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RECORD DETAIL */}
                    <div className="lg:col-span-8">
                        {selectedRecord ? (
                            <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden min-h-[60vh] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-dermcare to-dermcare-dark p-8 text-white">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-dermcare-light">
                                                <span className="text-sm">📅</span>
                                                <span className="text-sm font-medium">Báo cáo y tế ngày {new Date(selectedRecord.created_at).toLocaleDateString('vi-VN')}</span>
                                            </div>
                                            <h2 className="text-3xl font-bold">{selectedRecord.diagnosis?.AIResult || 'Thông tin chẩn đoán'}</h2>
                                        </div>
                                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur p-3 rounded-2xl border border-white/20">
                                            <img
                                                src={selectedRecord.doctor?.avatar || '/default-avatar.png'}
                                                alt={selectedRecord.doctor?.fullName}
                                                className="h-12 w-12 rounded-full border-2 border-white/30"
                                            />
                                            <div>
                                                <p className="text-sm font-bold">{selectedRecord.doctor?.fullName}</p>
                                                <p className="text-xs text-dermcare-light">Bác sĩ phụ trách</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                                    <div className="space-y-8">
                                        {/* Diagnosis Info */}
                                        <section className="space-y-3">
                                            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-widest">
                                                <span className="h-1.5 w-1.5 rounded-full bg-dermcare"></span>
                                                Kết quả chẩn đoán
                                            </h4>
                                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                <p className="text-slate-700 leading-relaxed font-medium">
                                                    {selectedRecord.diagnosis?.AIResult}
                                                </p>
                                                {selectedRecord.diagnosis?.AIConfidence && (
                                                    <div className="mt-3 text-xs text-slate-400">
                                                        Phân tích AI: {(selectedRecord.diagnosis.AIConfidence * 100).toFixed(1)}% độ chuẩn xác
                                                    </div>
                                                )}
                                            </div>
                                        </section>

                                        {/* Treatment */}
                                        <section className="space-y-3">
                                            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-widest">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                                Liệu trình & Đơn thuốc
                                            </h4>
                                            <div className="p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100 border-dashed">
                                                <p className="text-slate-700 leading-relaxed">
                                                    {selectedRecord.treatment || 'Đang cập nhật lời khuyên và đơn thuốc từ bác sĩ...'}
                                                </p>
                                            </div>
                                        </section>
                                    </div>

                                    <div className="space-y-8">
                                        {/* Doctor Notes */}
                                        <section className="space-y-3">
                                            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-widest">
                                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                                                Ghi chú của bác sĩ
                                            </h4>
                                            <div className="p-4 bg-amber-50/20 rounded-2xl border border-amber-100">
                                                <p className="text-slate-700 italic leading-relaxed">
                                                    "{selectedRecord.note || 'Không có ghi chú thêm.'}"
                                                </p>
                                            </div>
                                        </section>

                                        {/* Images */}
                                        {selectedRecord.images && selectedRecord.images.length > 0 && (
                                            <section className="space-y-3">
                                                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-widest">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                                                    Hình ảnh lâm sàng
                                                </h4>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {selectedRecord.images.map((img: string, idx: number) => (
                                                        <img
                                                            key={idx}
                                                            src={img}
                                                            alt={`Skin condition ${idx}`}
                                                            className="h-24 w-full object-cover rounded-xl border border-slate-100 cursor-zoom-in hover:scale-105 transition"
                                                        />
                                                    ))}
                                                </div>
                                            </section>
                                        )}

                                        {/* Footer Actions */}
                                        <div className="pt-8 mt-auto flex gap-3">
                                            <button className="flex-1 bg-slate-900 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition shadow-soft">
                                                <span>📥</span> Tải xuống PDF
                                            </button>
                                            <button 
                                                onClick={() => router.push(`/chat?id=${selectedRecord.appointment?.conversation?.id}`)} 
                                                className="px-6 border-2 border-slate-100 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition"
                                            >
                                                Xem lại chat
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center p-20 min-h-[60vh] text-center">
                                <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center text-4xl mb-6 grayscale opacity-50">
                                    👨‍⚕️
                                </div>
                                <h3 className="text-xl font-bold text-slate-400">Chọn một hồ sơ để xem chi tiết</h3>
                                <p className="text-slate-400 mt-2 max-w-xs">Thông tin chẩn đoán, đơn thuốc và lời khuyên của bác sĩ sẽ hiển thị tại đây.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
