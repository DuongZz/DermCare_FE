"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    DoctorScheduleSlot,
    CreateSchedulePayload,
    getDoctorSchedule,
    updateScheduleSlot,
    deleteScheduleSlot,
    autoGenerateSchedule
} from "@/services/scheduleService";
import { completeConversation } from "@/services/chatService";
import { useCallback, useEffect, useMemo, useState } from "react";

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

const isDatePast = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [y, m, d] = dateStr.split('-').map(Number);
    const targetDate = new Date(y, m - 1, d);
    return targetDate < today;
};

const isSlotPast = (dateStr: string, startTime: string) => {
    const now = new Date();
    const [y, m, d] = dateStr.split('-').map(Number);
    const [hours, minutes] = startTime.split(':').map(Number);
    const slotDate = new Date(y, m - 1, d, hours, minutes);
    return slotDate < now;
};

/** Precise time check: Is current time within the appointment slot? */
const isAppointmentActive = (dateStr: string, startTime: string) => {
    const now = new Date();
    const d = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
    const [y, m, day] = d.split('-').map(Number);
    const [h, min] = startTime.split(':').map(Number);
    const slotStart = new Date(y, m - 1, day, h, min);

    // Assume 30 mins duration for session 
    const slotEnd = new Date(slotStart.getTime() + 30 * 60000);

    return now >= slotStart && now <= slotEnd;
};

/** Has the appointment slot already ended? */
const isAppointmentEnded = (dateStr: string, startTime: string) => {
    const now = new Date();
    const d = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
    const [y, m, day] = d.split('-').map(Number);
    const [h, min] = startTime.split(':').map(Number);
    const slotStart = new Date(y, m - 1, day, h, min);

    // Appointment ends 30 mins after start time
    const slotEnd = new Date(slotStart.getTime() + 30 * 60000);
    return now > slotEnd;
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
function ConfirmModal({ open, title, message, onConfirm, onCancel, confirmText = "Xác nhận xóa", confirmButtonClass = "bg-rose-500 hover:bg-rose-600" }: {
    open: boolean;
    title: string;
    message: string;
    confirmText?: string;
    confirmButtonClass?: string;
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
                        className={`px-5 py-2 rounded-xl text-sm font-bold text-white shadow-sm transition ${confirmButtonClass}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════════
   AlertModal — For beautiful generic alerts
   ══════════════════════════════════════════════════════════════════ */
function AlertModal({ open, title, message, isSuccess = true, onClose, actionButton, onAction }: {
    open: boolean;
    title: string;
    message: string;
    isSuccess?: boolean;
    onClose: () => void;
    actionButton?: string;
    onAction?: () => void;
}) {
    const [phase, setPhase] = useState<"enter" | "visible" | "exit" | "hidden">("hidden");

    useEffect(() => {
        if (open) {
            setPhase("enter");
            const t = setTimeout(() => setPhase("visible"), 20);
            return () => clearTimeout(t);
        } else if (phase === "visible") {
            setPhase("exit");
            const t = setTimeout(() => setPhase("hidden"), 300);
            return () => clearTimeout(t);
        }
    }, [open]);

    if (phase === "hidden") return null;

    const isVisible = phase === "visible";
    const isExit = phase === "exit";

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4" onClick={onClose}>
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
            />
            {/* Modal Card */}
            <div
                onClick={(e) => e.stopPropagation()}
                className={`relative bg-white rounded-2xl shadow-xl border border-slate-100 p-6 w-full max-w-sm transition-all duration-300 ease-out flex flex-col items-center text-center ${isVisible
                    ? "opacity-100 translate-y-0 scale-100"
                    : isExit
                        ? "opacity-0 translate-y-8 scale-95"
                        : "opacity-0 translate-y-8 scale-95"
                    }`}
            >
                {/* Icon */}
                <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-4 ${isSuccess ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"}`}>
                    {isSuccess ? (
                        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                </div>

                <h4 className="text-xl font-black text-slate-800 mb-2">{title}</h4>
                <p className="text-sm text-slate-500 mb-6 px-2 whitespace-pre-wrap leading-relaxed">{message}</p>

                <div className="flex flex-col gap-2 w-full">
                    {actionButton && onAction && (
                        <button
                            onClick={onAction}
                            className="w-full py-3 rounded-xl bg-dermcare text-sm font-bold text-white shadow-md shadow-dermcare/20 hover:bg-dermcare-dark hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                        >
                            {actionButton}
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className={`w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 ${actionButton ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-slate-800 text-white shadow-md shadow-slate-200 hover:bg-slate-700 hover:-translate-y-0.5 active:translate-y-0"}`}
                    >
                        {actionButton ? "Bỏ qua" : "Đóng"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════ */
export default function DoctorScheduleSlots() {
    const router = useRouter();
    const [slots, setSlots] = useState<DoctorScheduleSlot[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [editForm, setEditForm] = useState({ startTime: "", endTime: "", price: 0 });
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const searchParams = useSearchParams();
    const [highlightedId, setHighlightedId] = useState<string | null>(null);

    // Confirm modal state
    const [confirmModal, setConfirmModal] = useState<{
        open: boolean;
        title: string;
        message: string;
        confirmText?: string;
        confirmButtonClass?: string;
        onConfirm: () => void;
    }>({ open: false, title: "", message: "", onConfirm: () => { } });

    const showConfirm = useCallback((title: string, message: string, onConfirm: () => void, confirmText = "Xác nhận xóa", confirmButtonClass = "bg-rose-500 hover:bg-rose-600") => {
        setConfirmModal({ open: true, title, message, confirmText, confirmButtonClass, onConfirm });
    }, []);

    const closeConfirm = useCallback(() => {
        setConfirmModal(prev => ({ ...prev, open: false }));
    }, []);

    const [alertModal, setAlertModal] = useState<{
        open: boolean;
        title: string;
        message: string;
        isSuccess: boolean;
        actionButton?: string;
        onAction?: () => void;
    }>({ open: false, title: "", message: "", isSuccess: true });

    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isToastVisible, setIsToastVisible] = useState(false);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setIsToastVisible(true), 10);
        setTimeout(() => setIsToastVisible(false), 2700);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const showAlert = useCallback((title: string, message: string, isSuccess = true, actionButton?: string, onAction?: () => void) => {
        setAlertModal({ open: true, title, message, isSuccess, actionButton, onAction });
    }, []);

    const closeAlert = useCallback(() => {
        setAlertModal(prev => ({ ...prev, open: false }));
    }, []);

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

    /** Handle Highlighting from Notifications */
    useEffect(() => {
        const id = searchParams.get('id');
        if (id && slots.length > 0) {
            // Find slot by id or appointmentId
            const targetSlot = slots.find(s => s.id === id || s.appointmentId === id);
            if (targetSlot) {
                // Switch to that date
                setSelectedDate(new Date(targetSlot.availableDate));
                setHighlightedId(targetSlot.id);

                // Scroll to it
                setTimeout(() => {
                    const el = document.getElementById(`slot-${targetSlot.id}`);
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 600);

                // Clear highlight after 5s
                const timer = setTimeout(() => setHighlightedId(null), 5000);
                return () => clearTimeout(timer);
            }
        }
    }, [searchParams, slots]);

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

    /* ─── Auto Generate Weekly Schedule ─── */
    const handleGenerateWeeklySchedule = async () => {
        showConfirm(
            "Tạo lịch tự động",
            `Hệ thống sẽ sinh ca khám cho 7 ngày của tuần đang hiển thị. Các ngày đã qua hoặc trống lịch mẫu sẽ tự động được bỏ qua. Bạn có chắc chắn?`,
            async () => {
                closeConfirm();
                setLoading(true);
                let totalCreated = 0;
                let failCount = 0;
                const successDates: string[] = [];

                // Bắt đầu vòng lặp 7 ngày, tính từ Thứ 2 của tuần đang được xem (selectedDate)
                const currentDayIndex = selectedDate.getDay() === 0 ? 6 : selectedDate.getDay() - 1;
                const baseDate = new Date(selectedDate);
                baseDate.setDate(selectedDate.getDate() - currentDayIndex); // Trượt về ngày Thứ 2 của cái tuần đó
                baseDate.setHours(0, 0, 0, 0);

                for (let i = 0; i < 7; i++) {
                    const d = new Date(baseDate);
                    d.setDate(baseDate.getDate() + i);
                    const dateStr = toLocalDateStr(d); // YYYY-MM-DD

                    // Bỏ qua nếu là ngày trong quá khứ
                    if (isDatePast(dateStr)) {
                        continue;
                    }

                    try {
                        const res = await autoGenerateSchedule(dateStr);
                        // res is likely { success: true, message: ..., data: { totalGenerated: ... } }
                        const generated = res?.data?.totalGenerated || 0;
                        totalCreated += generated;
                        successDates.push(dateStr);
                    } catch (err: any) {
                        const errorMsg = err.response?.data?.errorMessage || err.message;
                        const errorType = err.response?.data?.errorType;

                        if (errorType === "NOT_FOUND") {
                            showAlert(
                                "Thiếu mẫu lịch làm việc",
                                errorMsg,
                                false,
                                "Tới trang cấu hình",
                                () => {
                                    closeAlert();
                                    router.push("/doctor/schedule");
                                }
                            );
                            setLoading(false);
                            return;
                        }
                        failCount++;
                    }
                }

                // Re-fetch entire schedule after 1s to allow promises to settle
                setTimeout(() => {
                    fetchSlots();
                    if (totalCreated > 0) {
                        showToast(`Hoàn tất! Đã tạo thêm ${totalCreated} ca khám mới.`);
                    } else if (successDates.length > 0) {
                        showToast(`Xử lý hoàn tất. Không có ca khám mới nào cần tạo.`);
                    } else {
                        showToast(`Không thể tạo ca khám. Vui lòng kiểm tra lại cấu hình.`);
                    }
                }, 1000);
            },
            "Xác nhận tạo",
            "bg-dermcare hover:bg-dermcare-dark"
        );
    };

    /* ─── Edit ─── */
    const startEdit = (slot: DoctorScheduleSlot) => {
        setEditingSlotId(slot.id);
        setEditForm({ startTime: slot.startTime, endTime: slot.endTime, price: slot.price || 0 });
    };
    const saveEdit = async (id: string) => {
        try {
            await updateScheduleSlot(id, {
                startTime: editForm.startTime,
                endTime: editForm.endTime,
                price: editForm.price
            });
            setSlots(prev => prev.map(s => s.id === id ? { ...s, startTime: editForm.startTime, endTime: editForm.endTime, price: editForm.price } : s));
            showToast("Cập nhật ca khám thành công!");
            setEditingSlotId(null);
        } catch (error) {
            console.error("Lỗi cập nhật ca khám", error);
            showToast("Cập nhật ca khám thất bại!");
        }
    };
    const cancelEdit = () => setEditingSlotId(null);

    /* ─── Complete Consultation ─── */
    const handleComplete = (slot: DoctorScheduleSlot) => {
        if (!slot.conversationId) return;
        showConfirm(
            "Hoàn thành ca khám",
            "Bạn có chắc chắn muốn đánh dấu ca khám này là đã hoàn thành? Hành động này sẽ kết thúc cuộc hội thoại và cập nhật trạng thái lịch hẹn.",
            async () => {
                closeConfirm();
                setLoading(true);
                const convoId = slot.conversationId;
                if (!convoId) return;
                try {
                    await completeConversation(convoId);
                    setSlots(prev => prev.map(s => s.id === slot.id ? { ...s, appointmentStatus: 'COMPLETED' } : s));
                    showToast("Đã hoàn thành ca khám!");
                } catch (error) {
                    console.error("Lỗi hoàn thành ca khám:", error);
                    showToast("Không thể hoàn thành ca khám. Vui lòng thử lại!");
                } finally {
                    setLoading(false);
                }
            },
            "Xác nhận hoàn thành",
            "bg-emerald-500 hover:bg-emerald-600"
        );
    };

    /* ─── Filter for selected date ─── */
    const currentDateStr = toLocalDateStr(selectedDate);
    const currentSlots = useMemo(() => {
        return slots
            .filter(s => s.availableDate === currentDateStr)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
    }, [slots, currentDateStr]);

    const isPast = isDatePast(currentDateStr);

    /* ─── Selection helpers ─── */
    const selectableSlots = currentSlots.filter(s => !s.isBooked && !isSlotPast(currentDateStr, s.startTime));
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
        <div className="space-y-6 mt-0 relative">
            {toastMessage && (
                <div className={`fixed top-28 left-1/2 z-[100] rounded-full border border-dermcare bg-white px-6 py-2.5 text-sm font-semibold text-dermcare shadow-lg transition-all duration-500 ease-in-out transform ${isToastVisible
                    ? 'translate-y-0 opacity-100 -translate-x-1/2'
                    : '-translate-y-12 opacity-0 -translate-x-1/2'
                    }`}>
                    {toastMessage}
                </div>
            )}

            {/* ═══ Confirm Modal ═══ */}
            <ConfirmModal
                open={confirmModal.open}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.confirmText}
                confirmButtonClass={confirmModal.confirmButtonClass}
                onConfirm={confirmModal.onConfirm}
                onCancel={closeConfirm}
            />

            {/* ═══ Alert Modal ═══ */}
            <AlertModal
                open={alertModal.open}
                title={alertModal.title}
                message={alertModal.message}
                isSuccess={alertModal.isSuccess}
                actionButton={alertModal.actionButton}
                onAction={alertModal.onAction}
                onClose={closeAlert}
            />

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
            <div className="rounded-2xl border border-slate-200 bg-white shadow-soft overflow-hidden mt-6">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
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

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                        {!isPast && (
                            <button
                                onClick={handleGenerateWeeklySchedule}
                                disabled={loading}
                                className={`inline-flex items-center gap-1.5 rounded-xl bg-dermcare px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-dermcare-dark transition whitespace-nowrap ${loading ? 'opacity-50' : ''}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                {loading ? 'Đang tạo...' : 'Tạo ca khám trong tuần'}
                            </button>
                        )}

                        {selectedIds.size > 0 && (
                            <button
                                onClick={handleBulkDelete}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-500 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-600 transition whitespace-nowrap"
                            >
                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                Xóa {selectedIds.size} mục
                            </button>
                        )}
                        {isPast && <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">Đã qua</span>}
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
                                id={`slot-${slot.id}`}
                                className={`group relative flex items-center gap-4 px-5 py-3 transition-all duration-300 hover:bg-slate-50 ${deletingId === slot.id ? "opacity-40" : ""} ${highlightedId === slot.id ? "bg-dermcare/5 ring-1 ring-inset ring-dermcare z-10" : ""}`}
                            >
                                {/* Highlight Indicator */}
                                {highlightedId === slot.id && (
                                    <div className="absolute left-0 top-1 bottom-1 w-1 bg-dermcare rounded-r-full shadow-[0_0_8px_rgba(10,143,220,0.4)]" />
                                )}
                                { /* Checkbox Container (Fixed Width to prevent jump) */ }
                                <div className="w-5 flex-shrink-0 flex items-center justify-center">
                                    {!slot.isBooked && !isSlotPast(slot.availableDate, slot.startTime) && (
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.has(slot.id)}
                                            onChange={() => toggleSelect(slot.id)}
                                            className="w-4 h-4 text-dermcare rounded border-slate-300 focus:ring-dermcare transition cursor-pointer"
                                        />
                                    )}
                                </div>
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
                                        <div className="flex items-center gap-2 w-28 sm:w-32 flex-shrink-0">
                                            <div className="flex flex-col">
                                                <span className="text-base font-bold text-slate-800">{slot.startTime}</span>
                                                <span className="text-xs font-semibold text-slate-400">đến {slot.endTime}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 w-24 sm:w-28 flex-shrink-0">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase font-bold text-slate-400">Giá khám</span>
                                                <span className="text-sm font-bold text-dermcare">
                                                    {slot.price ? formatCurrency(slot.price) : "—"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-28 sm:w-32 flex-shrink-0">
                                            {slot.isBooked ? (
                                                slot.appointmentStatus === 'COMPLETED' ? (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                                        Hoàn thành
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                                                        Đã đặt
                                                    </span>
                                                )
                                            ) : isSlotPast(slot.availableDate, slot.startTime) ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                                    Đã qua
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                                    Trống
                                                </span>
                                            )}
                                        </div>
                                        {/* Action Buttons */}
                                        <div className="flex-1 flex justify-end gap-1.5 overflow-x-auto no-scrollbar">
                                            {/* Edit Button - only show for unbooked slots (if not past) */}
                                            {!slot.isBooked && !isSlotPast(slot.availableDate, slot.startTime) && (
                                                <button
                                                    onClick={() => startEdit(slot)}
                                                    className="rounded-xl border border-amber-100 bg-amber-50 p-2 text-amber-500 hover:bg-amber-100 hover:text-amber-600 transition"
                                                    title="Sửa"
                                                >
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </button>
                                            )}

                                            {/* Delete Button - only for unbooked slots */}
                                            {!slot.isBooked && !isSlotPast(slot.availableDate, slot.startTime) && (
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
                                            )}

                                            {/* Consultation Buttons for Booked Slots */}
                                            {slot.isBooked && slot.conversationId && (
                                                slot.appointmentStatus === "COMPLETED" ? (
                                                    <Link
                                                        href={`/chat?id=${slot.conversationId}`}
                                                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-slate-100 transition whitespace-nowrap"
                                                    >
                                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        Xem lại
                                                    </Link>
                                                ) : isAppointmentActive(slot.availableDate, slot.startTime) ? (
                                                    <Link
                                                        href={`/chat?id=${slot.conversationId}`}
                                                        className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-600 transition shadow-sm shadow-emerald-200 animate-pulse whitespace-nowrap"
                                                    >
                                                        <span className="relative flex h-2 w-2">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                                        </span>
                                                        Tư vấn ngay
                                                    </Link>
                                                ) : isAppointmentEnded(slot.availableDate, slot.startTime) ? (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleComplete(slot)}
                                                            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-700 transition shadow-sm shadow-emerald-100 whitespace-nowrap"
                                                        >
                                                            Hoàn thành
                                                        </button>
                                                        <Link
                                                            href={`/chat?id=${slot.conversationId}`}
                                                            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition whitespace-nowrap shadow-sm"
                                                        >
                                                            Nhắn tin
                                                        </Link>
                                                    </div>
                                                ) : (
                                                    <Link
                                                        href={`/chat?id=${slot.conversationId}`}
                                                        className="flex items-center gap-1.5 rounded-xl border border-dermcare/20 bg-dermcare/5 px-3 py-1.5 text-[11px] font-bold text-dermcare hover:bg-dermcare hover:text-white transition whitespace-nowrap"
                                                    >
                                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                        </svg>
                                                        Nhắn tin
                                                    </Link>
                                                )
                                            )}

                                            {/* Fallback for booked slots without conversation */}
                                            {slot.isBooked && !slot.conversationId && !isSlotPast(slot.availableDate, slot.startTime) && (
                                                <span className="text-xs text-slate-400 italic flex items-center">🔒 Chờ khởi tạo</span>
                                            )}

                                            {/* Past indicator */}
                                            {isSlotPast(slot.availableDate, slot.startTime) && !slot.isBooked && (
                                                <span className="text-xs text-slate-400 italic flex items-center flex-shrink-0">📅 Quá hạn</span>
                                            )}
                                        </div>
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
