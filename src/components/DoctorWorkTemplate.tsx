"use client";

import { useState } from "react";
import { createWorkTemplate } from "@/services/scheduleService";

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

/* ═══════════════════════════════════════════ */
export default function DoctorWorkTemplate() {
    const [template, setTemplate] = useState<DayTemplate[]>(defaultTemplate);
    const [saving, setSaving] = useState(false);

    /* ─── Template handlers ─── */
    const updateDay = (index: number, changes: Partial<DayTemplate>) => {
        setTemplate(prev => prev.map((d, i) => (i === index ? { ...d, ...changes } : d)));
    };

    /* ─── Save Template ─── */
    const handleSaveTemplate = async () => {
        setSaving(true);
        try {
            const payload = template.map(t => ({
                dayOfWeek: t.dayOfWeek,
                isAvailable: t.isAvailable,
                morningStartTime: t.morningStart,
                morningEndTime: t.morningEnd,
                afternoonStartTime: t.afternoonStart,
                afternoonEndTime: t.afternoonEnd,
                slotDuration: t.slotDuration,
                price: t.price,
            }));
            await createWorkTemplate(payload);
            alert("Đã lưu lịch làm việc thành công!");
        } catch (error: any) {
            console.error("Save template failed:", error);
            alert("Lỗi khi lưu: " + (error.response?.data?.message || error.message));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6 mt-0">
            {/* ═══ Section 1: Work Template ═══ */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="bg-gradient-to-r from-dermcare/5 to-transparent px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800">
                        Lịch làm việc hàng tuần
                    </h3>
                    <button
                        onClick={handleSaveTemplate}
                        disabled={saving}
                        className="inline-flex items-center gap-2 rounded-xl bg-dermcare px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-dermcare/20 hover:bg-dermcare-dark transition disabled:opacity-50"
                    >
                        {saving ? "⏳ Đang lưu..." : "Lưu lịch làm việc"}
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
        </div>
    );
}
