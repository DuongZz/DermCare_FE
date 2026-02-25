"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
    DoctorScheduleSlot,
    CreateSchedulePayload,
    getDoctorSchedule,
    createScheduleSlot,
    updateScheduleSlot,
    deleteScheduleSlot,
} from "@/services/scheduleService";

/* ─── Types ─── */
interface DayTemplate {
    dayOfWeek: string;
    label: string;
    isAvailable: boolean;
    morningStart: string;
    morningEnd: string;
    afternoonStart: string;
    afternoonEnd: string;
    slotDuration: number;
    price: number;
}

/* ─── Helpers ─── */
const formatCurrency = (n: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

/** Convert Date to local "YYYY-MM-DD" string (fixes UTC timezone shift) */
const toLocalDateStr = (d: Date): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
};

const isDatePast = (d: string) => new Date(d) < new Date(new Date().toDateString());

const DAY_LABELS = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"];
const DAY_KEYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const defaultTemplate = (): DayTemplate[] =>
    DAY_KEYS.map((key, i) => ({
        dayOfWeek: key,
        label: DAY_LABELS[i],
        isAvailable: i < 5,
        morningStart: "08:00",
        morningEnd: "12:00",
        afternoonStart: "13:30",
        afternoonEnd: "17:30",
        slotDuration: 30,
        price: 250000,
    }));

/* ─── Generate slots from template for a given week starting date ─── */
const generateSlotsFromTemplate = (
    template: DayTemplate[],
    weekStartDate: Date
): DoctorScheduleSlot[] => {
    const slots: DoctorScheduleSlot[] = [];
    template.forEach((day, dayIndex) => {
        if (!day.isAvailable) return;
        const date = new Date(weekStartDate);
        date.setDate(weekStartDate.getDate() + dayIndex);
        const dateStr = toLocalDateStr(date);

        // Morning slots
        if (day.morningStart && day.morningEnd) {
            let cur = new Date(`2000-01-01T${day.morningStart}:00`);
            const end = new Date(`2000-01-01T${day.morningEnd}:00`);
            const dur = day.slotDuration * 60000;
            while (cur < end) {
                let next = new Date(cur.getTime() + dur);
                if (next > end) next = end;
                slots.push({
                    id: `gen-${dateStr}-m-${cur.getTime()}`,
                    doctorId: "",
                    availableDate: dateStr,
                    startTime: cur.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
                    endTime: next.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
                    isBooked: false,
                    price: day.price,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                });
                cur = next;
            }
        }
        // Afternoon slots
        if (day.afternoonStart && day.afternoonEnd) {
            let cur = new Date(`2000-01-01T${day.afternoonStart}:00`);
            const end = new Date(`2000-01-01T${day.afternoonEnd}:00`);
            const dur = day.slotDuration * 60000;
            while (cur < end) {
                let next = new Date(cur.getTime() + dur);
                if (next > end) next = end;
                slots.push({
                    id: `gen-${dateStr}-a-${cur.getTime()}`,
                    doctorId: "",
                    availableDate: dateStr,
                    startTime: cur.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
                    endTime: next.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
                    isBooked: false,
                    price: day.price,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                });
                cur = next;
            }
        }
    });
    return slots;
};

/* ─── Get Monday of the current week ─── */
const getMonday = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    date.setDate(diff);
    date.setHours(0, 0, 0, 0);
    return date;
};

/* ══════════════════════════════════════════════════════════════════
   ConfirmModal — fly-in from top, fade backdrop, fly-out downward
   ══════════════════════════════════════════════════════════════════ */
function ConfirmModal({ open, title, message, onConfirm, onCancel }: {
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    const [phase, setPhase] = useState<"enter" | "visible" | "exit" | "hidden">("hidden");

    useEffect(() => {
        if (open) {
            setPhase("enter");
            const t = setTimeout(() => setPhase("visible"), 20);
            return () => clearTimeout(t);
        } else if (phase === "visible") {
            setPhase("exit");
            const t = setTimeout(() => setPhase("hidden"), 350);
            return () => clearTimeout(t);
        }
    }, [open]);

    if (phase === "hidden") return null;

    const isVisible = phase === "visible";
    const isExit = phase === "exit";

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4" onClick={onCancel}>
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? "opacity-100" : isExit ? "opacity-0" : "opacity-0"}`}
            />
            {/* Modal Card */}
            <div
                onClick={(e) => e.stopPropagation()}
                className={`relative bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 w-full max-w-sm transition-all duration-300 ease-out ${isVisible
                    ? "opacity-100 translate-y-0 scale-100"
                    : isExit
                        ? "opacity-0 translate-y-12 scale-95"
                        : "opacity-0 -translate-y-12 scale-95"
                    }`}
            >
                <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 flex-shrink-0">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-base font-bold text-slate-800">{title}</h4>
                        <p className="text-sm text-slate-500 mt-0.5">{message}</p>
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-5">
                    <button
                        onClick={onCancel}
                        className="px-5 py-2 rounded-xl bg-slate-100 text-sm font-bold text-slate-600 hover:bg-slate-200 transition"
                    >
                        Huỷ bỏ
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-5 py-2 rounded-xl bg-rose-500 text-sm font-bold text-white shadow-sm hover:bg-rose-600 transition"
                    >
                        Xác nhận xóa
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════ */
export default function DoctorScheduleManager() {
    const [template, setTemplate] = useState<DayTemplate[]>(defaultTemplate);
    const [slots, setSlots] = useState<DoctorScheduleSlot[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [editForm, setEditForm] = useState({ startTime: "", endTime: "", price: 0 });
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    // Confirm modal state
    const [confirmModal, setConfirmModal] = useState<{
        open: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({ open: false, title: "", message: "", onConfirm: () => { } });

    const showConfirm = useCallback((title: string, message: string, onConfirm: () => void) => {
        setConfirmModal({ open: true, title, message, onConfirm });
    }, []);

    const closeConfirm = useCallback(() => {
        setConfirmModal(prev => ({ ...prev, open: false }));
    }, []);

    const weekStart = useMemo(() => getMonday(selectedDate), [selectedDate]);

    useEffect(() => { fetchSlots(); }, []);

    const fetchSlots = async () => {
        setLoading(true);
        try {
            const data = await getDoctorSchedule();
            setSlots(data.length > 0 ? data : []);
        } catch {
            setSlots([]);
        } finally {
            setLoading(false);
        }
    };

    /* ─── Template handlers ─── */
    const updateDay = (index: number, changes: Partial<DayTemplate>) => {
        setTemplate(prev => prev.map((d, i) => (i === index ? { ...d, ...changes } : d)));
    };

    /* ─── Generate slots from template ─── */
    const handleGenerateSlots = () => {
        setSaving(true);
        try {
            const generated = generateSlotsFromTemplate(template, weekStart);
            setSlots(prev => {
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 7);
                const weekStartStr = toLocalDateStr(weekStart);
                const weekEndStr = toLocalDateStr(weekEnd);
                const kept = prev.filter(s => s.availableDate < weekStartStr || s.availableDate >= weekEndStr || s.isBooked);
                return [...kept, ...generated];
            });

            const activeDays = template.filter(d => d.isAvailable).map(d => d.label);
            alert(`✅ Đã tạo ${generated.length} ca khám cho ${activeDays.length} ngày trong tuần:\n${activeDays.join(", ")}\n\nBấm vào từng ngày ở thanh tuần bên dưới để xem chi tiết.`);
        } finally {
            setSaving(false);
        }
    };

    /* ─── Delete ─── */
    const handleDelete = (id: string) => {
        showConfirm(
            "Xóa ca khám",
            "Bạn có chắc muốn xóa ca khám này?",
            async () => {
                closeConfirm();
                setDeletingId(id);
                try { await deleteScheduleSlot(id); } catch { /* ok */ }
                setSlots(prev => prev.filter(s => s.id !== id));
                setDeletingId(null);
                setSelectedIds(prev => { const next = new Set(prev); next.delete(id); return next; });
            }
        );
    };

    /* ─── Bulk Delete ─── */
    const handleBulkDelete = () => {
        if (selectedIds.size === 0) return;
        showConfirm(
            "Xóa hàng loạt",
            `Bạn có chắc muốn xóa ${selectedIds.size} ca khám đã chọn?`,
            () => {
                closeConfirm();
                setSlots(prev => prev.filter(s => !selectedIds.has(s.id)));
                setSelectedIds(new Set());
            }
        );
    };

    /* ─── Edit ─── */
    const startEdit = (slot: DoctorScheduleSlot) => {
        setEditingSlotId(slot.id);
        setEditForm({ startTime: slot.startTime, endTime: slot.endTime, price: slot.price || 0 });
    };
    const saveEdit = (id: string) => {
        setSlots(prev => prev.map(s => s.id === id ? { ...s, startTime: editForm.startTime, endTime: editForm.endTime, price: editForm.price } : s));
        setEditingSlotId(null);
    };
    const cancelEdit = () => setEditingSlotId(null);

    /* ─── Filter for selected date ─── */
    const currentDateStr = toLocalDateStr(selectedDate);
    const currentSlots = useMemo(() => {
        return slots
            .filter(s => s.availableDate === currentDateStr)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
    }, [slots, currentDateStr]);

    const isPast = isDatePast(currentDateStr);

    /* ─── Selection helpers ─── */
    const selectableSlots = currentSlots.filter(s => !s.isBooked && !isPast);
    const allSelected = selectableSlots.length > 0 && selectableSlots.every(s => selectedIds.has(s.id));
    const toggleSelectAll = () => {
        if (allSelected) {
            setSelectedIds(prev => {
                const next = new Set(prev);
                selectableSlots.forEach(s => next.delete(s.id));
                return next;
            });
        } else {
            setSelectedIds(prev => {
                const next = new Set(prev);
                selectableSlots.forEach(s => next.add(s.id));
                return next;
            });
        }
    };
    const toggleSelect = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    /* ─── Stats ─── */
    const totalSlots = currentSlots.length;
    const bookedSlots = currentSlots.filter(s => s.isBooked).length;
    const availableSlots = totalSlots - bookedSlots;

    if (loading) {
        return (
            <div className="space-y-4 mt-6">
                <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-4 border-dermcare border-t-transparent rounded-full" /></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 mt-6">

            {/* ═══ Confirm Modal ═══ */}
            <ConfirmModal
                open={confirmModal.open}
                title={confirmModal.title}
                message={confirmModal.message}
                onConfirm={confirmModal.onConfirm}
                onCancel={closeConfirm}
            />

            {/* ═══ Section 1: Work Template ═══ */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="bg-gradient-to-r from-dermcare/5 to-transparent px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800">
                        Mẫu lịch làm việc hàng tuần
                    </h3>
                    <button
                        onClick={handleGenerateSlots}
                        disabled={saving}
                        className="inline-flex items-center gap-2 rounded-xl bg-dermcare px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-dermcare/20 hover:bg-dermcare-dark transition disabled:opacity-50"
                    >
                        {saving ? "⏳..." : "Tạo nhanh lịch hẹn"}
                    </button>
                </div>

                {/* Template Grid */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                                <th className="px-4 py-3 text-left w-24">Thứ</th>
                                <th className="px-4 py-3 text-center w-16">Hoạt động</th>
                                <th className="px-4 py-3 text-center">Ca sáng</th>
                                <th className="px-4 py-3 text-center">Ca chiều</th>
                                <th className="px-4 py-3 text-center w-20">Phút/Ca</th>
                                <th className="px-4 py-3 text-center w-28">Giá (VND)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {template.map((day, i) => (
                                <tr key={day.dayOfWeek} className={`transition ${day.isAvailable ? "bg-white" : "bg-slate-50/50"}`}>
                                    <td className="px-4 py-3">
                                        <span className={`text-sm font-bold ${day.isAvailable ? "text-slate-800" : "text-slate-400"}`}>
                                            {day.label}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => updateDay(i, { isAvailable: !day.isAvailable })}
                                            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${day.isAvailable ? "bg-dermcare" : "bg-slate-300"}`}
                                        >
                                            <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${day.isAvailable ? "translate-x-5" : ""}`} />
                                        </button>
                                    </td>
                                    <td className="px-4 py-3">
                                        {day.isAvailable ? (
                                            <div className="flex items-center justify-center gap-1.5">
                                                <input type="time" value={day.morningStart} onChange={e => updateDay(i, { morningStart: e.target.value })}
                                                    className="w-[120px] h-8 rounded-lg border border-slate-200 px-2 text-xs font-medium text-slate-800 focus:border-dermcare focus:outline-none transition" />
                                                <span className="text-slate-400 text-xs">→</span>
                                                <input type="time" value={day.morningEnd} onChange={e => updateDay(i, { morningEnd: e.target.value })}
                                                    className="w-[120px] h-8 rounded-lg border border-slate-200 px-2 text-xs font-medium text-slate-800 focus:border-dermcare focus:outline-none transition" />
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-400 italic">Nghỉ</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {day.isAvailable ? (
                                            <div className="flex items-center justify-center gap-1.5">
                                                <input type="time" value={day.afternoonStart} onChange={e => updateDay(i, { afternoonStart: e.target.value })}
                                                    className="w-[120px] h-8 rounded-lg border border-slate-200 px-2 text-xs font-medium text-slate-800 focus:border-dermcare focus:outline-none transition" />
                                                <span className="text-slate-400 text-xs">→</span>
                                                <input type="time" value={day.afternoonEnd} onChange={e => updateDay(i, { afternoonEnd: e.target.value })}
                                                    className="w-[120px] h-8 rounded-lg border border-slate-200 px-2 text-xs font-medium text-slate-800 focus:border-dermcare focus:outline-none transition" />
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-400 italic">Nghỉ</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {day.isAvailable ? (
                                            <input type="number" value={day.slotDuration} onChange={e => updateDay(i, { slotDuration: Number(e.target.value) })}
                                                min={10} max={120} step={5}
                                                className="w-16 h-8 rounded-lg border border-slate-200 px-2 text-xs font-medium text-center text-slate-800 focus:border-dermcare focus:outline-none transition" />
                                        ) : <span className="text-xs text-slate-400">—</span>}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {day.isAvailable ? (
                                            <input type="number" value={day.price || ""} onChange={e => updateDay(i, { price: Number(e.target.value) })}
                                                min={0} step={10000}
                                                className="w-24 h-8 rounded-lg border border-slate-200 px-2 text-xs font-medium text-center text-slate-800 focus:border-dermcare focus:outline-none transition" />
                                        ) : <span className="text-xs text-slate-400">—</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ═══ Section 2: Weekly Day Selector + Stats ═══ */}
            <div className="flex flex-col sm:flex-row items-stretch gap-4">
                {/* Week Selector Pill */}
                <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto flex-1">
                    {/* Prev Week Arrow */}
                    <button
                        onClick={() => {
                            const prev = new Date(selectedDate);
                            prev.setDate(prev.getDate() - 7);
                            setSelectedDate(prev);
                        }}
                        className="h-10 w-10 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-dermcare transition flex-shrink-0"
                        title="Tuần trước"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                    </button>

                    <div className="text-center min-w-[100px] flex flex-col items-center border-r border-slate-100 pr-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                            Tuần làm việc
                        </p>
                        <h2 className="text-sm font-extrabold text-slate-800">
                            {selectedDate.toLocaleDateString("vi-VN", { month: "long", year: "numeric" })}
                        </h2>
                    </div>
                    <div className="flex items-center gap-1.5">
                        {Array.from({ length: 7 }).map((_, i) => {
                            const currentDay = selectedDate.getDay() === 0 ? 6 : selectedDate.getDay() - 1;
                            const dateOfThisColumn = new Date(selectedDate);
                            dateOfThisColumn.setDate(selectedDate.getDate() - currentDay + i);
                            const isSelected = dateOfThisColumn.toDateString() === selectedDate.toDateString();
                            const isToday = dateOfThisColumn.toDateString() === new Date().toDateString();
                            const dayNames = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
                            const past = isDatePast(toLocalDateStr(dateOfThisColumn));

                            // 3 states: today + selected, today only, selected only, normal
                            let btnClass = "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-dermcare";
                            let labelClass = "text-slate-400";
                            if (isSelected && isToday) {
                                btnClass = "bg-dermcare text-white shadow-md shadow-dermcare/20 ring-2 ring-dermcare ring-offset-2";
                                labelClass = "text-white/70";
                            } else if (isSelected) {
                                btnClass = "bg-slate-700 text-white shadow-md shadow-slate-700/20";
                                labelClass = "text-white/60";
                            } else if (isToday) {
                                btnClass = "bg-dermcare/10 text-dermcare border-2 border-dermcare/40";
                                labelClass = "text-dermcare/60";
                            }

                            return (
                                <button key={i}
                                    onClick={() => setSelectedDate(dateOfThisColumn)}
                                    className={`relative flex flex-col items-center justify-center min-w-[44px] h-12 rounded-xl transition duration-200 ${btnClass} ${past ? "opacity-50" : ""}`}
                                >
                                    <span className={`text-[10px] font-bold uppercase ${labelClass}`}>{dayNames[i]}</span>
                                    <span className="text-sm font-extrabold leading-none mt-0.5">{dateOfThisColumn.getDate()}</span>
                                    {isToday && !isSelected && (
                                        <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-dermcare" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Next Week Arrow */}
                    <button
                        onClick={() => {
                            const next = new Date(selectedDate);
                            next.setDate(next.getDate() + 7);
                            setSelectedDate(next);
                        }}
                        className="h-10 w-10 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-dermcare transition flex-shrink-0"
                        title="Tuần sau"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>

                {/* Mini Stats */}
                <div className="flex gap-2">
                    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white px-4 py-3 shadow-soft flex flex-col justify-center min-w-[80px]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tổng</span>
                        <p className="text-xl font-black text-slate-900 leading-none mt-1">{totalSlots}</p>
                    </div>
                    <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-white px-4 py-3 shadow-soft flex flex-col justify-center min-w-[80px]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-green-600">Trống</span>
                        <p className="text-xl font-black text-green-600 leading-none mt-1">{availableSlots}</p>
                    </div>
                    <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white px-4 py-3 shadow-soft flex flex-col justify-center min-w-[80px]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Đặt</span>
                        <p className="text-xl font-black text-blue-600 leading-none mt-1">{bookedSlots}</p>
                    </div>
                </div>
            </div>

            {/* ═══ Section 3: Schedule Slots List ═══ */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-soft overflow-hidden">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {selectableSlots.length > 0 && (
                            <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={toggleSelectAll}
                                className="w-4 h-4 text-dermcare rounded border-slate-300 focus:ring-dermcare transition cursor-pointer"
                                title="Chọn tất cả"
                            />
                        )}
                        <h3 className="font-bold text-slate-800">
                            Lịch hẹn — {selectedDate.toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit" })}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        {selectedIds.size > 0 && (
                            <button
                                onClick={handleBulkDelete}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-500 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-600 transition"
                            >
                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                Xóa {selectedIds.size} mục
                            </button>
                        )}
                        {isPast && <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-medium">Đã qua</span>}
                    </div>
                </div>

                {currentSlots.length === 0 ? (
                    <div className="py-14 text-center">
                        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-3xl mb-3">📅</div>
                        <p className="text-sm font-semibold text-slate-700">Chưa có lịch hẹn</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {currentSlots.map(slot => (
                            <div
                                key={slot.id}
                                className={`flex items-center gap-4 px-5 py-3 transition hover:bg-slate-50 ${deletingId === slot.id ? "opacity-40" : ""}`}
                            >
                                {/* Checkbox */}
                                {!slot.isBooked && !isPast && (
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.has(slot.id)}
                                        onChange={() => toggleSelect(slot.id)}
                                        className="w-4 h-4 text-dermcare rounded border-slate-300 focus:ring-dermcare transition cursor-pointer flex-shrink-0"
                                    />
                                )}
                                {editingSlotId === slot.id ? (
                                    /* ── Inline Edit Mode ── */
                                    <>
                                        <div className="flex items-center gap-2">
                                            <input type="time" value={editForm.startTime}
                                                onChange={e => setEditForm({ ...editForm, startTime: e.target.value })}
                                                className="w-[120px] h-8 rounded-lg border border-amber-300 px-2 text-xs font-medium text-slate-800 focus:border-dermcare focus:outline-none transition" />
                                            <span className="text-slate-400 text-xs">→</span>
                                            <input type="time" value={editForm.endTime}
                                                onChange={e => setEditForm({ ...editForm, endTime: e.target.value })}
                                                className="w-[120px] h-8 rounded-lg border border-amber-300 px-2 text-xs font-medium text-slate-800 focus:border-dermcare focus:outline-none transition" />
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <input type="number" value={editForm.price || ""}
                                                onChange={e => setEditForm({ ...editForm, price: Number(e.target.value) })}
                                                min={0} step={10000}
                                                className="w-24 h-8 rounded-lg border border-amber-300 px-2 text-xs font-medium text-slate-800 focus:border-dermcare focus:outline-none transition" />
                                            <span className="text-[10px] text-slate-400">VND</span>
                                        </div>
                                        <div className="flex-1" />
                                        <div className="flex gap-1.5">
                                            <button onClick={() => saveEdit(slot.id)}
                                                className="rounded-lg bg-dermcare px-3 py-1.5 text-xs font-bold text-white hover:bg-dermcare-dark transition">
                                                Lưu
                                            </button>
                                            <button onClick={cancelEdit}
                                                className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 transition">
                                                Huỷ
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    /* ── Normal Display Mode ── */
                                    <>
                                        <div className="flex items-center gap-2 min-w-[130px]">
                                            <div className="flex flex-col">
                                                <span className="text-base font-bold text-slate-800">{slot.startTime}</span>
                                                <span className="text-xs font-semibold text-slate-400">đến {slot.endTime}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 min-w-[110px]">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase font-bold text-slate-400">Giá khám</span>
                                                <span className="text-sm font-bold text-dermcare">
                                                    {slot.price ? formatCurrency(slot.price) : "—"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            {slot.isBooked ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                                                    Đã đặt
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                                    Trống
                                                </span>
                                            )}
                                        </div>
                                        {/* Action Buttons */}
                                        {!slot.isBooked && !isPast ? (
                                            <div className="flex gap-1.5 flex-shrink-0">
                                                <button
                                                    onClick={() => startEdit(slot)}
                                                    className="rounded-xl border border-amber-100 bg-amber-50 p-2 text-amber-500 hover:bg-amber-100 hover:text-amber-600 transition"
                                                    title="Sửa"
                                                >
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(slot.id)}
                                                    disabled={deletingId === slot.id}
                                                    className="rounded-xl border border-rose-100 bg-rose-50 p-2 text-rose-500 hover:bg-rose-100 hover:text-rose-600 transition disabled:opacity-50"
                                                    title="Xóa"
                                                >
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ) : slot.isBooked ? (
                                            <span className="text-xs text-slate-400 italic flex-shrink-0">🔒 Đã khóa</span>
                                        ) : null}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
