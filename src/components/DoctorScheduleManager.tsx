"use client";

import { useState, useEffect } from "react";
import {
    DoctorScheduleSlot,
    CreateSchedulePayload,
    getDoctorSchedule,
    createScheduleSlot,
    updateScheduleSlot,
    deleteScheduleSlot,
} from "@/services/scheduleService";

/* ─── Helpers ─── */
const formatDate = (d: string) => {
    try {
        return new Date(d).toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" });
    } catch { return d; }
};

const formatCurrency = (n: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

const isDatePast = (d: string) => new Date(d) < new Date(new Date().toDateString());

/* ─── Mock Data ─── */
const MOCK_SLOTS: DoctorScheduleSlot[] = [
    {
        id: "s1", doctorId: "d1", availableDate: "2026-02-25", startTime: "08:00", endTime: "09:00",
        isBooked: false, price: 250000, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    {
        id: "s2", doctorId: "d1", availableDate: "2026-02-25", startTime: "09:30", endTime: "10:30",
        isBooked: true, price: 250000, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    {
        id: "s3", doctorId: "d1", availableDate: "2026-02-26", startTime: "14:00", endTime: "15:00",
        isBooked: false, price: 300000, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    {
        id: "s4", doctorId: "d1", availableDate: "2026-02-27", startTime: "08:00", endTime: "09:00",
        isBooked: false, price: 250000, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    {
        id: "s5", doctorId: "d1", availableDate: "2026-02-27", startTime: "10:00", endTime: "11:00",
        isBooked: true, price: 300000, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
];

const EMPTY_FORM: CreateSchedulePayload = { availableDate: "", startTime: "", endTime: "", price: 250000 };

/* ═══════════════════════════════════════════ */
export default function DoctorScheduleManager() {
    const [slots, setSlots] = useState<DoctorScheduleSlot[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<CreateSchedulePayload>({ ...EMPTY_FORM });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [filterDate, setFilterDate] = useState("");

    useEffect(() => { fetchSlots(); }, []);

    const fetchSlots = async () => {
        setLoading(true);
        try {
            const data = await getDoctorSchedule();
            setSlots(data.length > 0 ? data : MOCK_SLOTS);
        } catch {
            setSlots(MOCK_SLOTS);
        } finally {
            setLoading(false);
        }
    };

    /* ─── Create / Update ─── */
    const handleSubmit = async () => {
        if (!form.availableDate || !form.startTime || !form.endTime) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }
        if (form.startTime >= form.endTime) {
            alert("Giờ kết thúc phải sau giờ bắt đầu!");
            return;
        }

        setSaving(true);
        try {
            if (editingId) {
                await updateScheduleSlot(editingId, form);
                setSlots(prev => prev.map(s => s.id === editingId ? { ...s, ...form } : s));
            } else {
                const newSlot = await createScheduleSlot(form);
                setSlots(prev => [...prev, { ...newSlot, id: newSlot.id || `new-${Date.now()}`, doctorId: "d1", isBooked: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), ...form }]);
            }
            resetForm();
        } catch (err) {
            console.error("Save failed:", err);
            // Optimistic for mock
            if (editingId) {
                setSlots(prev => prev.map(s => s.id === editingId ? { ...s, ...form } : s));
            } else {
                setSlots(prev => [...prev, { id: `new-${Date.now()}`, doctorId: "d1", isBooked: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), ...form } as DoctorScheduleSlot]);
            }
            resetForm();
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (slot: DoctorScheduleSlot) => {
        setEditingId(slot.id);
        setForm({
            availableDate: slot.availableDate?.split("T")[0] || "",
            startTime: slot.startTime,
            endTime: slot.endTime,
            price: slot.price,
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc muốn xóa ca khám này?")) return;
        setDeletingId(id);
        try {
            await deleteScheduleSlot(id);
        } catch { /* ok for mock */ }
        setSlots(prev => prev.filter(s => s.id !== id));
        setDeletingId(null);
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingId(null);
        setForm({ ...EMPTY_FORM });
    };

    /* ─── Group by Date ─── */
    const filtered = slots
        .filter(s => !filterDate || s.availableDate?.startsWith(filterDate))
        .sort((a, b) => {
            const dateA = `${a.availableDate}T${a.startTime}`;
            const dateB = `${b.availableDate}T${b.startTime}`;
            return dateA.localeCompare(dateB);
        });

    const grouped = filtered.reduce<Record<string, DoctorScheduleSlot[]>>((acc, slot) => {
        const date = slot.availableDate?.split("T")[0] || "unknown";
        if (!acc[date]) acc[date] = [];
        acc[date].push(slot);
        return acc;
    }, {});

    /* ─── Stats ─── */
    const totalSlots = slots.length;
    const bookedSlots = slots.filter(s => s.isBooked).length;
    const availableSlots = totalSlots - bookedSlots;

    /* ─── Loading ─── */
    if (loading) {
        return (
            <div className="space-y-4 mt-6">
                <div className="grid grid-cols-3 gap-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4 animate-pulse">
                            <div className="h-3 w-16 bg-slate-200 rounded mb-2" />
                            <div className="h-7 w-10 bg-slate-200 rounded" />
                        </div>
                    ))}
                </div>
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4 animate-pulse">
                        <div className="h-4 w-48 bg-slate-200 rounded mb-3" />
                        <div className="h-10 w-full bg-slate-100 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-5 mt-6">
            {/* ═══ Stats ═══ */}
            <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 shadow-soft">
                    <span className="text-xs font-medium text-slate-500">Tổng ca</span>
                    <p className="text-2xl font-bold text-slate-900">{totalSlots}</p>
                </div>
                <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-4 shadow-soft">
                    <span className="text-xs font-medium text-green-600">Còn trống</span>
                    <p className="text-2xl font-bold text-green-600">{availableSlots}</p>
                </div>
                <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-4 shadow-soft">
                    <span className="text-xs font-medium text-blue-600">Đã đặt</span>
                    <p className="text-2xl font-bold text-blue-600">{bookedSlots}</p>
                </div>
            </div>

            {/* ═══ Toolbar ═══ */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="relative">
                    <input
                        type="date"
                        value={filterDate}
                        onChange={e => setFilterDate(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-dermcare focus:outline-none focus:ring-2 focus:ring-dermcare/20 transition"
                        placeholder="Lọc theo ngày"
                    />
                    {filterDate && (
                        <button
                            onClick={() => setFilterDate("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-lg"
                        >×</button>
                    )}
                </div>
                <button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="inline-flex items-center gap-2 rounded-xl bg-dermcare px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-dermcare/25 hover:bg-dermcare-dark hover:shadow-lg transition-all"
                >
                    <span className="text-base">＋</span>
                    Thêm ca khám mới
                </button>
            </div>

            {/* ═══ Add/Edit Form ═══ */}
            {showForm && (
                <div className="rounded-2xl border-2 border-dermcare/30 bg-gradient-to-br from-dermcare/5 to-white p-5 shadow-soft animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-900">
                            {editingId ? "✏️ Chỉnh sửa ca khám" : "➕ Thêm ca khám mới"}
                        </h3>
                        <button
                            onClick={resetForm}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">📅 Ngày làm việc</label>
                            <input
                                type="date"
                                value={form.availableDate}
                                onChange={e => setForm({ ...form, availableDate: e.target.value })}
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-dermcare focus:outline-none focus:ring-2 focus:ring-dermcare/20 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">🕐 Giờ bắt đầu</label>
                            <input
                                type="time"
                                value={form.startTime}
                                onChange={e => setForm({ ...form, startTime: e.target.value })}
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-dermcare focus:outline-none focus:ring-2 focus:ring-dermcare/20 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">🕑 Giờ kết thúc</label>
                            <input
                                type="time"
                                value={form.endTime}
                                onChange={e => setForm({ ...form, endTime: e.target.value })}
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-dermcare focus:outline-none focus:ring-2 focus:ring-dermcare/20 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">💰 Giá khám (VND)</label>
                            <input
                                type="number"
                                value={form.price || ""}
                                onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                                min={0}
                                step={10000}
                                placeholder="250,000"
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-dermcare focus:outline-none focus:ring-2 focus:ring-dermcare/20 transition"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={handleSubmit}
                            disabled={saving}
                            className="rounded-xl bg-dermcare px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-dermcare-dark transition disabled:opacity-50"
                        >
                            {saving ? "⏳ Đang lưu..." : editingId ? "💾 Cập nhật" : "✓ Tạo ca khám"}
                        </button>
                        <button
                            onClick={resetForm}
                            disabled={saving}
                            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            )}

            {/* ═══ Schedule List — Grouped by Date ═══ */}
            {Object.keys(grouped).length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
                    <p className="text-5xl mb-3">📅</p>
                    <p className="text-base font-semibold text-slate-700">Chưa có ca khám nào</p>
                    <p className="text-sm text-slate-400 mt-1">Bấm &quot;Thêm ca khám mới&quot; để bắt đầu</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {Object.entries(grouped).map(([date, dateSlots]) => {
                        const past = isDatePast(date);
                        return (
                            <div key={date} className={`rounded-2xl border bg-white shadow-soft overflow-hidden ${past ? "border-slate-200 opacity-70" : "border-slate-200"}`}>
                                {/* Date Header */}
                                <div className={`flex items-center justify-between px-5 py-3 ${past ? "bg-slate-50" : "bg-gradient-to-r from-dermcare/5 to-transparent"}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${past ? "bg-slate-200 text-slate-500" : "bg-dermcare/10 text-dermcare"}`}>
                                            {new Date(date).getDate()}
                                        </div>
                                        <div>
                                            <p className={`text-sm font-bold ${past ? "text-slate-500" : "text-slate-900"}`}>
                                                {formatDate(date)}
                                            </p>
                                            <p className="text-[11px] text-slate-400">
                                                {dateSlots.length} ca · {dateSlots.filter(s => !s.isBooked).length} trống · {dateSlots.filter(s => s.isBooked).length} đã đặt
                                            </p>
                                        </div>
                                    </div>
                                    {past && (
                                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-medium text-slate-400">Đã qua</span>
                                    )}
                                </div>

                                {/* Time Slots */}
                                <div className="divide-y divide-slate-100">
                                    {dateSlots.map(slot => (
                                        <div
                                            key={slot.id}
                                            className={`flex items-center gap-4 px-5 py-3 transition hover:bg-slate-50 ${deletingId === slot.id ? "opacity-40" : ""}`}
                                        >
                                            {/* Time Range */}
                                            <div className="flex items-center gap-2 min-w-[140px]">
                                                <svg className="h-4 w-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-sm font-semibold text-slate-800">
                                                    {slot.startTime} – {slot.endTime}
                                                </span>
                                            </div>

                                            {/* Price */}
                                            <div className="flex items-center gap-1.5 min-w-[100px]">
                                                <span className="text-sm font-bold text-dermcare">
                                                    {slot.price ? formatCurrency(slot.price) : "—"}
                                                </span>
                                            </div>

                                            {/* Status Badge */}
                                            <div className="flex-1">
                                                {slot.isBooked ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                                                        Đã có bệnh nhân đặt
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-[11px] font-semibold text-green-700">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                                                        Còn trống
                                                    </span>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            {!slot.isBooked && !past && (
                                                <div className="flex gap-1.5">
                                                    <button
                                                        onClick={() => handleEdit(slot)}
                                                        className="rounded-lg bg-slate-100 p-2 text-slate-500 hover:bg-dermcare/10 hover:text-dermcare transition"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(slot.id)}
                                                        disabled={deletingId === slot.id}
                                                        className="rounded-lg bg-slate-100 p-2 text-slate-500 hover:bg-red-50 hover:text-red-500 transition disabled:opacity-50"
                                                        title="Xóa"
                                                    >
                                                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                            {slot.isBooked && (
                                                <span className="text-xs text-slate-400 italic">Không thể sửa</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
