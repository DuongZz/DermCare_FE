(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/services/scheduleService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createScheduleSlot",
    ()=>createScheduleSlot,
    "deleteScheduleSlot",
    ()=>deleteScheduleSlot,
    "getDoctorSchedule",
    ()=>getDoctorSchedule,
    "updateScheduleSlot",
    ()=>updateScheduleSlot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/apiClient.ts [app-client] (ecmascript)");
;
const getDoctorSchedule = async ()=>{
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/doctor/schedule');
    return data.data || data;
};
const createScheduleSlot = async (payload)=>{
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/doctor/schedule', payload);
    return data.data || data;
};
const updateScheduleSlot = async (id, payload)=>{
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/doctor/schedule/${id}`, payload);
    return data.data || data;
};
const deleteScheduleSlot = async (id)=>{
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/doctor/schedule/${id}`);
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/DoctorScheduleManager.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DoctorScheduleManager
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$scheduleService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/scheduleService.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
/* ─── Helpers ─── */ const formatCurrency = (n)=>new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND"
    }).format(n);
/** Convert Date to local "YYYY-MM-DD" string (fixes UTC timezone shift) */ const toLocalDateStr = (d)=>{
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
};
const isDatePast = (d)=>new Date(d) < new Date(new Date().toDateString());
const DAY_LABELS = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "CN"
];
const DAY_KEYS = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday"
];
const defaultTemplate = ()=>DAY_KEYS.map((key, i)=>({
            dayOfWeek: key,
            label: DAY_LABELS[i],
            isAvailable: i < 5,
            morningStart: "08:00",
            morningEnd: "12:00",
            afternoonStart: "13:30",
            afternoonEnd: "17:30",
            slotDuration: 30,
            price: 250000
        }));
/* ─── Generate slots from template for a given week starting date ─── */ const generateSlotsFromTemplate = (template, weekStartDate)=>{
    const slots = [];
    template.forEach((day, dayIndex)=>{
        if (!day.isAvailable) return;
        const date = new Date(weekStartDate);
        date.setDate(weekStartDate.getDate() + dayIndex);
        const dateStr = toLocalDateStr(date);
        // Morning slots
        if (day.morningStart && day.morningEnd) {
            let cur = new Date(`2000-01-01T${day.morningStart}:00`);
            const end = new Date(`2000-01-01T${day.morningEnd}:00`);
            const dur = day.slotDuration * 60000;
            while(cur < end){
                let next = new Date(cur.getTime() + dur);
                if (next > end) next = end;
                slots.push({
                    id: `gen-${dateStr}-m-${cur.getTime()}`,
                    doctorId: "",
                    availableDate: dateStr,
                    startTime: cur.toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit"
                    }),
                    endTime: next.toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit"
                    }),
                    isBooked: false,
                    price: day.price,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });
                cur = next;
            }
        }
        // Afternoon slots
        if (day.afternoonStart && day.afternoonEnd) {
            let cur = new Date(`2000-01-01T${day.afternoonStart}:00`);
            const end = new Date(`2000-01-01T${day.afternoonEnd}:00`);
            const dur = day.slotDuration * 60000;
            while(cur < end){
                let next = new Date(cur.getTime() + dur);
                if (next > end) next = end;
                slots.push({
                    id: `gen-${dateStr}-a-${cur.getTime()}`,
                    doctorId: "",
                    availableDate: dateStr,
                    startTime: cur.toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit"
                    }),
                    endTime: next.toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit"
                    }),
                    isBooked: false,
                    price: day.price,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });
                cur = next;
            }
        }
    });
    return slots;
};
/* ─── Get Monday of the current week ─── */ const getMonday = (d)=>{
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    date.setDate(diff);
    date.setHours(0, 0, 0, 0);
    return date;
};
/* ══════════════════════════════════════════════════════════════════
   ConfirmModal — fly-in from top, fade backdrop, fly-out downward
   ══════════════════════════════════════════════════════════════════ */ function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
    _s();
    const [phase, setPhase] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("hidden");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ConfirmModal.useEffect": ()=>{
            if (open) {
                setPhase("enter");
                const t = setTimeout({
                    "ConfirmModal.useEffect.t": ()=>setPhase("visible")
                }["ConfirmModal.useEffect.t"], 20);
                return ({
                    "ConfirmModal.useEffect": ()=>clearTimeout(t)
                })["ConfirmModal.useEffect"];
            } else if (phase === "visible") {
                setPhase("exit");
                const t = setTimeout({
                    "ConfirmModal.useEffect.t": ()=>setPhase("hidden")
                }["ConfirmModal.useEffect.t"], 350);
                return ({
                    "ConfirmModal.useEffect": ()=>clearTimeout(t)
                })["ConfirmModal.useEffect"];
            }
        }
    }["ConfirmModal.useEffect"], [
        open
    ]);
    if (phase === "hidden") return null;
    const isVisible = phase === "visible";
    const isExit = phase === "exit";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[9999] flex items-center justify-center px-4",
        onClick: onCancel,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? "opacity-100" : isExit ? "opacity-0" : "opacity-0"}`
            }, void 0, false, {
                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                lineNumber: 158,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                onClick: (e)=>e.stopPropagation(),
                className: `relative bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 w-full max-w-sm transition-all duration-300 ease-out ${isVisible ? "opacity-100 translate-y-0 scale-100" : isExit ? "opacity-0 translate-y-12 scale-95" : "opacity-0 -translate-y-12 scale-95"}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 mb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 flex-shrink-0",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "h-5 w-5",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                        lineNumber: 174,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                    lineNumber: 173,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                lineNumber: 172,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "text-base font-bold text-slate-800",
                                        children: title
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                        lineNumber: 178,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-slate-500 mt-0.5",
                                        children: message
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                        lineNumber: 179,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                lineNumber: 177,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                        lineNumber: 171,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-end gap-2 mt-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onCancel,
                                className: "px-5 py-2 rounded-xl bg-slate-100 text-sm font-bold text-slate-600 hover:bg-slate-200 transition",
                                children: "Huỷ bỏ"
                            }, void 0, false, {
                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                lineNumber: 183,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onConfirm,
                                className: "px-5 py-2 rounded-xl bg-rose-500 text-sm font-bold text-white shadow-sm hover:bg-rose-600 transition",
                                children: "Xác nhận xóa"
                            }, void 0, false, {
                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                lineNumber: 189,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                        lineNumber: 182,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                lineNumber: 162,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
        lineNumber: 156,
        columnNumber: 9
    }, this);
}
_s(ConfirmModal, "kR5TiFbJq9e66mCs65NyR2i5HPk=");
_c = ConfirmModal;
function DoctorScheduleManager() {
    _s1();
    const [template, setTemplate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultTemplate);
    const [slots, setSlots] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [deletingId, setDeletingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editingSlotId, setEditingSlotId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedIds, setSelectedIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [editForm, setEditForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        startTime: "",
        endTime: "",
        price: 0
    });
    const [selectedDate, setSelectedDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Date());
    // Confirm modal state
    const [confirmModal, setConfirmModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        open: false,
        title: "",
        message: "",
        onConfirm: {
            "DoctorScheduleManager.useState": ()=>{}
        }["DoctorScheduleManager.useState"]
    });
    const showConfirm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DoctorScheduleManager.useCallback[showConfirm]": (title, message, onConfirm)=>{
            setConfirmModal({
                open: true,
                title,
                message,
                onConfirm
            });
        }
    }["DoctorScheduleManager.useCallback[showConfirm]"], []);
    const closeConfirm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DoctorScheduleManager.useCallback[closeConfirm]": ()=>{
            setConfirmModal({
                "DoctorScheduleManager.useCallback[closeConfirm]": (prev)=>({
                        ...prev,
                        open: false
                    })
            }["DoctorScheduleManager.useCallback[closeConfirm]"]);
        }
    }["DoctorScheduleManager.useCallback[closeConfirm]"], []);
    const weekStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DoctorScheduleManager.useMemo[weekStart]": ()=>getMonday(selectedDate)
    }["DoctorScheduleManager.useMemo[weekStart]"], [
        selectedDate
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DoctorScheduleManager.useEffect": ()=>{
            fetchSlots();
        }
    }["DoctorScheduleManager.useEffect"], []);
    const fetchSlots = async ()=>{
        setLoading(true);
        try {
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$scheduleService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoctorSchedule"])();
            setSlots(data.length > 0 ? data : []);
        } catch  {
            setSlots([]);
        } finally{
            setLoading(false);
        }
    };
    /* ─── Template handlers ─── */ const updateDay = (index, changes)=>{
        setTemplate((prev)=>prev.map((d, i)=>i === index ? {
                    ...d,
                    ...changes
                } : d));
    };
    /* ─── Generate slots from template ─── */ const handleGenerateSlots = ()=>{
        setSaving(true);
        try {
            const generated = generateSlotsFromTemplate(template, weekStart);
            setSlots((prev)=>{
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 7);
                const weekStartStr = toLocalDateStr(weekStart);
                const weekEndStr = toLocalDateStr(weekEnd);
                const kept = prev.filter((s)=>s.availableDate < weekStartStr || s.availableDate >= weekEndStr || s.isBooked);
                return [
                    ...kept,
                    ...generated
                ];
            });
            const activeDays = template.filter((d)=>d.isAvailable).map((d)=>d.label);
            alert(`✅ Đã tạo ${generated.length} ca khám cho ${activeDays.length} ngày trong tuần:\n${activeDays.join(", ")}\n\nBấm vào từng ngày ở thanh tuần bên dưới để xem chi tiết.`);
        } finally{
            setSaving(false);
        }
    };
    /* ─── Delete ─── */ const handleDelete = (id)=>{
        showConfirm("Xóa ca khám", "Bạn có chắc muốn xóa ca khám này?", async ()=>{
            closeConfirm();
            setDeletingId(id);
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$scheduleService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteScheduleSlot"])(id);
            } catch  {}
            setSlots((prev)=>prev.filter((s)=>s.id !== id));
            setDeletingId(null);
            setSelectedIds((prev)=>{
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        });
    };
    /* ─── Bulk Delete ─── */ const handleBulkDelete = ()=>{
        if (selectedIds.size === 0) return;
        showConfirm("Xóa hàng loạt", `Bạn có chắc muốn xóa ${selectedIds.size} ca khám đã chọn?`, ()=>{
            closeConfirm();
            setSlots((prev)=>prev.filter((s)=>!selectedIds.has(s.id)));
            setSelectedIds(new Set());
        });
    };
    /* ─── Edit ─── */ const startEdit = (slot)=>{
        setEditingSlotId(slot.id);
        setEditForm({
            startTime: slot.startTime,
            endTime: slot.endTime,
            price: slot.price || 0
        });
    };
    const saveEdit = (id)=>{
        setSlots((prev)=>prev.map((s)=>s.id === id ? {
                    ...s,
                    startTime: editForm.startTime,
                    endTime: editForm.endTime,
                    price: editForm.price
                } : s));
        setEditingSlotId(null);
    };
    const cancelEdit = ()=>setEditingSlotId(null);
    /* ─── Filter for selected date ─── */ const currentDateStr = toLocalDateStr(selectedDate);
    const currentSlots = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DoctorScheduleManager.useMemo[currentSlots]": ()=>{
            return slots.filter({
                "DoctorScheduleManager.useMemo[currentSlots]": (s)=>s.availableDate === currentDateStr
            }["DoctorScheduleManager.useMemo[currentSlots]"]).sort({
                "DoctorScheduleManager.useMemo[currentSlots]": (a, b)=>a.startTime.localeCompare(b.startTime)
            }["DoctorScheduleManager.useMemo[currentSlots]"]);
        }
    }["DoctorScheduleManager.useMemo[currentSlots]"], [
        slots,
        currentDateStr
    ]);
    const isPast = isDatePast(currentDateStr);
    /* ─── Selection helpers ─── */ const selectableSlots = currentSlots.filter((s)=>!s.isBooked && !isPast);
    const allSelected = selectableSlots.length > 0 && selectableSlots.every((s)=>selectedIds.has(s.id));
    const toggleSelectAll = ()=>{
        if (allSelected) {
            setSelectedIds((prev)=>{
                const next = new Set(prev);
                selectableSlots.forEach((s)=>next.delete(s.id));
                return next;
            });
        } else {
            setSelectedIds((prev)=>{
                const next = new Set(prev);
                selectableSlots.forEach((s)=>next.add(s.id));
                return next;
            });
        }
    };
    const toggleSelect = (id)=>{
        setSelectedIds((prev)=>{
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };
    /* ─── Stats ─── */ const totalSlots = currentSlots.length;
    const bookedSlots = currentSlots.filter((s)=>s.isBooked).length;
    const availableSlots = totalSlots - bookedSlots;
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4 mt-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-center p-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "animate-spin h-8 w-8 border-4 border-dermcare border-t-transparent rounded-full"
                }, void 0, false, {
                    fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                    lineNumber: 357,
                    columnNumber: 58
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                lineNumber: 357,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/DoctorScheduleManager.tsx",
            lineNumber: 356,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6 mt-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ConfirmModal, {
                open: confirmModal.open,
                title: confirmModal.title,
                message: confirmModal.message,
                onConfirm: confirmModal.onConfirm,
                onCancel: closeConfirm
            }, void 0, false, {
                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                lineNumber: 366,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-gradient-to-r from-dermcare/5 to-transparent px-5 py-4 border-b border-slate-100 flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-bold text-slate-800",
                                children: "Mẫu lịch làm việc hàng tuần"
                            }, void 0, false, {
                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                lineNumber: 377,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleGenerateSlots,
                                disabled: saving,
                                className: "inline-flex items-center gap-2 rounded-xl bg-dermcare px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-dermcare/20 hover:bg-dermcare-dark transition disabled:opacity-50",
                                children: saving ? "⏳..." : "Tạo nhanh lịch hẹn"
                            }, void 0, false, {
                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                lineNumber: 380,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                        lineNumber: 376,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "overflow-x-auto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                            className: "w-full text-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        className: "bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-4 py-3 text-left w-24",
                                                children: "Thứ"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                lineNumber: 394,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-4 py-3 text-center w-16",
                                                children: "Hoạt động"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                lineNumber: 395,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-4 py-3 text-center",
                                                children: "Ca sáng"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                lineNumber: 396,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-4 py-3 text-center",
                                                children: "Ca chiều"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                lineNumber: 397,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-4 py-3 text-center w-20",
                                                children: "Phút/Ca"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                lineNumber: 398,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-4 py-3 text-center w-28",
                                                children: "Giá (VND)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                lineNumber: 399,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                        lineNumber: 393,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                    lineNumber: 392,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                    className: "divide-y divide-slate-50",
                                    children: template.map((day, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: `transition ${day.isAvailable ? "bg-white" : "bg-slate-50/50"}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-3",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `text-sm font-bold ${day.isAvailable ? "text-slate-800" : "text-slate-400"}`,
                                                        children: day.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                        lineNumber: 406,
                                                        columnNumber: 41
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                    lineNumber: 405,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-3 text-center",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>updateDay(i, {
                                                                isAvailable: !day.isAvailable
                                                            }),
                                                        className: `relative w-11 h-6 rounded-full transition-colors duration-200 ${day.isAvailable ? "bg-dermcare" : "bg-slate-300"}`,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${day.isAvailable ? "translate-x-5" : ""}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                            lineNumber: 415,
                                                            columnNumber: 45
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                        lineNumber: 411,
                                                        columnNumber: 41
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                    lineNumber: 410,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-3",
                                                    children: day.isAvailable ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-center gap-1.5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "time",
                                                                value: day.morningStart,
                                                                onChange: (e)=>updateDay(i, {
                                                                        morningStart: e.target.value
                                                                    }),
                                                                className: "w-[120px] h-8 rounded-lg border border-slate-200 px-2 text-xs font-medium text-slate-800 focus:border-dermcare focus:outline-none transition"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                                lineNumber: 421,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-slate-400 text-xs",
                                                                children: "→"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                                lineNumber: 423,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "time",
                                                                value: day.morningEnd,
                                                                onChange: (e)=>updateDay(i, {
                                                                        morningEnd: e.target.value
                                                                    }),
                                                                className: "w-[120px] h-8 rounded-lg border border-slate-200 px-2 text-xs font-medium text-slate-800 focus:border-dermcare focus:outline-none transition"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                                lineNumber: 424,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                        lineNumber: 420,
                                                        columnNumber: 45
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs text-slate-400 italic",
                                                        children: "Nghỉ"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                        lineNumber: 428,
                                                        columnNumber: 45
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                    lineNumber: 418,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-3",
                                                    children: day.isAvailable ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-center gap-1.5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "time",
                                                                value: day.afternoonStart,
                                                                onChange: (e)=>updateDay(i, {
                                                                        afternoonStart: e.target.value
                                                                    }),
                                                                className: "w-[120px] h-8 rounded-lg border border-slate-200 px-2 text-xs font-medium text-slate-800 focus:border-dermcare focus:outline-none transition"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                                lineNumber: 434,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-slate-400 text-xs",
                                                                children: "→"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                                lineNumber: 436,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "time",
                                                                value: day.afternoonEnd,
                                                                onChange: (e)=>updateDay(i, {
                                                                        afternoonEnd: e.target.value
                                                                    }),
                                                                className: "w-[120px] h-8 rounded-lg border border-slate-200 px-2 text-xs font-medium text-slate-800 focus:border-dermcare focus:outline-none transition"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                                lineNumber: 437,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                        lineNumber: 433,
                                                        columnNumber: 45
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs text-slate-400 italic",
                                                        children: "Nghỉ"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                        lineNumber: 441,
                                                        columnNumber: 45
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                    lineNumber: 431,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-3 text-center",
                                                    children: day.isAvailable ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        value: day.slotDuration,
                                                        onChange: (e)=>updateDay(i, {
                                                                slotDuration: Number(e.target.value)
                                                            }),
                                                        min: 10,
                                                        max: 120,
                                                        step: 5,
                                                        className: "w-16 h-8 rounded-lg border border-slate-200 px-2 text-xs font-medium text-center text-slate-800 focus:border-dermcare focus:outline-none transition"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                        lineNumber: 446,
                                                        columnNumber: 45
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs text-slate-400",
                                                        children: "—"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                        lineNumber: 449,
                                                        columnNumber: 45
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                    lineNumber: 444,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-3 text-center",
                                                    children: day.isAvailable ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        value: day.price || "",
                                                        onChange: (e)=>updateDay(i, {
                                                                price: Number(e.target.value)
                                                            }),
                                                        min: 0,
                                                        step: 10000,
                                                        className: "w-24 h-8 rounded-lg border border-slate-200 px-2 text-xs font-medium text-center text-slate-800 focus:border-dermcare focus:outline-none transition"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                        lineNumber: 453,
                                                        columnNumber: 45
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs text-slate-400",
                                                        children: "—"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                        lineNumber: 456,
                                                        columnNumber: 45
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                    lineNumber: 451,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, day.dayOfWeek, true, {
                                            fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                            lineNumber: 404,
                                            columnNumber: 33
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                    lineNumber: 402,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                            lineNumber: 391,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                        lineNumber: 390,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                lineNumber: 375,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row items-stretch gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 bg-white px-4 py-3 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    const prev = new Date(selectedDate);
                                    prev.setDate(prev.getDate() - 7);
                                    setSelectedDate(prev);
                                },
                                className: "h-10 w-10 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-dermcare transition flex-shrink-0",
                                title: "Tuần trước",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-4 h-4",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2.5,
                                        d: "M15 19l-7-7 7-7"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                        lineNumber: 479,
                                        columnNumber: 104
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                    lineNumber: 479,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                lineNumber: 470,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center min-w-[100px] flex flex-col items-center border-r border-slate-100 pr-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5",
                                        children: "Tuần làm việc"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                        lineNumber: 483,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-sm font-extrabold text-slate-800",
                                        children: selectedDate.toLocaleDateString("vi-VN", {
                                            month: "long",
                                            year: "numeric"
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                        lineNumber: 486,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                lineNumber: 482,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5",
                                children: Array.from({
                                    length: 7
                                }).map((_, i)=>{
                                    const currentDay = selectedDate.getDay() === 0 ? 6 : selectedDate.getDay() - 1;
                                    const dateOfThisColumn = new Date(selectedDate);
                                    dateOfThisColumn.setDate(selectedDate.getDate() - currentDay + i);
                                    const isSelected = dateOfThisColumn.toDateString() === selectedDate.toDateString();
                                    const isToday = dateOfThisColumn.toDateString() === new Date().toDateString();
                                    const dayNames = [
                                        "T2",
                                        "T3",
                                        "T4",
                                        "T5",
                                        "T6",
                                        "T7",
                                        "CN"
                                    ];
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
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setSelectedDate(dateOfThisColumn),
                                        className: `relative flex flex-col items-center justify-center min-w-[44px] h-12 rounded-xl transition duration-200 ${btnClass} ${past ? "opacity-50" : ""}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `text-[10px] font-bold uppercase ${labelClass}`,
                                                children: dayNames[i]
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                lineNumber: 519,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-extrabold leading-none mt-0.5",
                                                children: dateOfThisColumn.getDate()
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                lineNumber: 520,
                                                columnNumber: 37
                                            }, this),
                                            isToday && !isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-dermcare"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                lineNumber: 522,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                        lineNumber: 515,
                                        columnNumber: 33
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                lineNumber: 490,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    const next = new Date(selectedDate);
                                    next.setDate(next.getDate() + 7);
                                    setSelectedDate(next);
                                },
                                className: "h-10 w-10 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-dermcare transition flex-shrink-0",
                                title: "Tuần sau",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-4 h-4",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2.5,
                                        d: "M9 5l7 7-7 7"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                        lineNumber: 539,
                                        columnNumber: 104
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                    lineNumber: 539,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                lineNumber: 530,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                        lineNumber: 468,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white px-4 py-3 shadow-soft flex flex-col justify-center min-w-[80px]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] font-bold uppercase tracking-wider text-slate-500",
                                        children: "Tổng"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                        lineNumber: 546,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xl font-black text-slate-900 leading-none mt-1",
                                        children: totalSlots
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                        lineNumber: 547,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                lineNumber: 545,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-white px-4 py-3 shadow-soft flex flex-col justify-center min-w-[80px]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] font-bold uppercase tracking-wider text-green-600",
                                        children: "Trống"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                        lineNumber: 550,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xl font-black text-green-600 leading-none mt-1",
                                        children: availableSlots
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                        lineNumber: 551,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                lineNumber: 549,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white px-4 py-3 shadow-soft flex flex-col justify-center min-w-[80px]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] font-bold uppercase tracking-wider text-blue-600",
                                        children: "Đặt"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                        lineNumber: 554,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xl font-black text-blue-600 leading-none mt-1",
                                        children: bookedSlots
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                        lineNumber: 555,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                lineNumber: 553,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                        lineNumber: 544,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                lineNumber: 466,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-slate-200 bg-white shadow-soft overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-slate-50 px-5 py-3 border-b border-slate-100 flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    selectableSlots.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        checked: allSelected,
                                        onChange: toggleSelectAll,
                                        className: "w-4 h-4 text-dermcare rounded border-slate-300 focus:ring-dermcare transition cursor-pointer",
                                        title: "Chọn tất cả"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                        lineNumber: 565,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-bold text-slate-800",
                                        children: [
                                            "Lịch hẹn — ",
                                            selectedDate.toLocaleDateString("vi-VN", {
                                                weekday: "long",
                                                day: "2-digit",
                                                month: "2-digit"
                                            })
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                        lineNumber: 573,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                lineNumber: 563,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    selectedIds.size > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleBulkDelete,
                                        className: "inline-flex items-center gap-1.5 rounded-xl bg-rose-500 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-600 transition",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "h-3.5 w-3.5",
                                                fill: "none",
                                                stroke: "currentColor",
                                                viewBox: "0 0 24 24",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                    lineNumber: 583,
                                                    columnNumber: 116
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                lineNumber: 583,
                                                columnNumber: 33
                                            }, this),
                                            "Xóa ",
                                            selectedIds.size,
                                            " mục"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                        lineNumber: 579,
                                        columnNumber: 29
                                    }, this),
                                    isPast && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-medium",
                                        children: "Đã qua"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                        lineNumber: 587,
                                        columnNumber: 36
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                lineNumber: 577,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                        lineNumber: 562,
                        columnNumber: 17
                    }, this),
                    currentSlots.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "py-14 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-3xl mb-3",
                                children: "📅"
                            }, void 0, false, {
                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                lineNumber: 593,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm font-semibold text-slate-700",
                                children: "Chưa có lịch hẹn"
                            }, void 0, false, {
                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                lineNumber: 594,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                        lineNumber: 592,
                        columnNumber: 21
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "divide-y divide-slate-100",
                        children: currentSlots.map((slot)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `flex items-center gap-4 px-5 py-3 transition hover:bg-slate-50 ${deletingId === slot.id ? "opacity-40" : ""}`,
                                children: [
                                    !slot.isBooked && !isPast && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        checked: selectedIds.has(slot.id),
                                        onChange: ()=>toggleSelect(slot.id),
                                        className: "w-4 h-4 text-dermcare rounded border-slate-300 focus:ring-dermcare transition cursor-pointer flex-shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                        lineNumber: 605,
                                        columnNumber: 37
                                    }, this),
                                    editingSlotId === slot.id ? /* ── Inline Edit Mode ── */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "time",
                                                        value: editForm.startTime,
                                                        onChange: (e)=>setEditForm({
                                                                ...editForm,
                                                                startTime: e.target.value
                                                            }),
                                                        className: "w-[120px] h-8 rounded-lg border border-amber-300 px-2 text-xs font-medium text-slate-800 focus:border-dermcare focus:outline-none transition"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                        lineNumber: 616,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-slate-400 text-xs",
                                                        children: "→"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                        lineNumber: 619,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "time",
                                                        value: editForm.endTime,
                                                        onChange: (e)=>setEditForm({
                                                                ...editForm,
                                                                endTime: e.target.value
                                                            }),
                                                        className: "w-[120px] h-8 rounded-lg border border-amber-300 px-2 text-xs font-medium text-slate-800 focus:border-dermcare focus:outline-none transition"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                        lineNumber: 620,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                lineNumber: 615,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        value: editForm.price || "",
                                                        onChange: (e)=>setEditForm({
                                                                ...editForm,
                                                                price: Number(e.target.value)
                                                            }),
                                                        min: 0,
                                                        step: 10000,
                                                        className: "w-24 h-8 rounded-lg border border-amber-300 px-2 text-xs font-medium text-slate-800 focus:border-dermcare focus:outline-none transition"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                        lineNumber: 625,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[10px] text-slate-400",
                                                        children: "VND"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                        lineNumber: 629,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                lineNumber: 624,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                lineNumber: 631,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-1.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>saveEdit(slot.id),
                                                        className: "rounded-lg bg-dermcare px-3 py-1.5 text-xs font-bold text-white hover:bg-dermcare-dark transition",
                                                        children: "Lưu"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                        lineNumber: 633,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: cancelEdit,
                                                        className: "rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 transition",
                                                        children: "Huỷ"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                        lineNumber: 637,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                lineNumber: 632,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true) : /* ── Normal Display Mode ── */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2 min-w-[130px]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-base font-bold text-slate-800",
                                                            children: slot.startTime
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                            lineNumber: 648,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs font-semibold text-slate-400",
                                                            children: [
                                                                "đến ",
                                                                slot.endTime
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                            lineNumber: 649,
                                                            columnNumber: 49
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                    lineNumber: 647,
                                                    columnNumber: 45
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                lineNumber: 646,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1.5 min-w-[110px]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[10px] uppercase font-bold text-slate-400",
                                                            children: "Giá khám"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                            lineNumber: 654,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm font-bold text-dermcare",
                                                            children: slot.price ? formatCurrency(slot.price) : "—"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                            lineNumber: 655,
                                                            columnNumber: 49
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                    lineNumber: 653,
                                                    columnNumber: 45
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                lineNumber: 652,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1",
                                                children: slot.isBooked ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                            lineNumber: 663,
                                                            columnNumber: 53
                                                        }, this),
                                                        "Đã đặt"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                    lineNumber: 662,
                                                    columnNumber: 49
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "h-1.5 w-1.5 rounded-full bg-green-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                            lineNumber: 668,
                                                            columnNumber: 53
                                                        }, this),
                                                        "Trống"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                    lineNumber: 667,
                                                    columnNumber: 49
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                lineNumber: 660,
                                                columnNumber: 41
                                            }, this),
                                            !slot.isBooked && !isPast ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-1.5 flex-shrink-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>startEdit(slot),
                                                        className: "rounded-xl border border-amber-100 bg-amber-50 p-2 text-amber-500 hover:bg-amber-100 hover:text-amber-600 transition",
                                                        title: "Sửa",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            className: "h-4 w-4",
                                                            fill: "none",
                                                            stroke: "currentColor",
                                                            viewBox: "0 0 24 24",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round",
                                                                strokeWidth: 2,
                                                                d: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                                lineNumber: 682,
                                                                columnNumber: 57
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                            lineNumber: 681,
                                                            columnNumber: 53
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                        lineNumber: 676,
                                                        columnNumber: 49
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleDelete(slot.id),
                                                        disabled: deletingId === slot.id,
                                                        className: "rounded-xl border border-rose-100 bg-rose-50 p-2 text-rose-500 hover:bg-rose-100 hover:text-rose-600 transition disabled:opacity-50",
                                                        title: "Xóa",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            className: "h-4 w-4",
                                                            fill: "none",
                                                            stroke: "currentColor",
                                                            viewBox: "0 0 24 24",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round",
                                                                strokeWidth: 2,
                                                                d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                                lineNumber: 692,
                                                                columnNumber: 57
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                            lineNumber: 691,
                                                            columnNumber: 53
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                        lineNumber: 685,
                                                        columnNumber: 49
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                lineNumber: 675,
                                                columnNumber: 45
                                            }, this) : slot.isBooked ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-slate-400 italic flex-shrink-0",
                                                children: "🔒 Đã khóa"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                                lineNumber: 697,
                                                columnNumber: 45
                                            }, this) : null
                                        ]
                                    }, void 0, true)
                                ]
                            }, slot.id, true, {
                                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                                lineNumber: 599,
                                columnNumber: 29
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                        lineNumber: 597,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/DoctorScheduleManager.tsx",
                lineNumber: 561,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/DoctorScheduleManager.tsx",
        lineNumber: 363,
        columnNumber: 9
    }, this);
}
_s1(DoctorScheduleManager, "l+8RYVtDSOVlfrdAgeRV+IHBKXI=");
_c1 = DoctorScheduleManager;
var _c, _c1;
__turbopack_context__.k.register(_c, "ConfirmModal");
__turbopack_context__.k.register(_c1, "DoctorScheduleManager");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/doctor/schedule/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DoctorSchedulePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$DoctorScheduleManager$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/DoctorScheduleManager.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function DoctorSchedulePage() {
    _s();
    const { isLoggedIn, isDoctor } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DoctorSchedulePage.useEffect": ()=>{
            if (!isLoggedIn || !isDoctor) {
                router.push("/");
            }
        }
    }["DoctorSchedulePage.useEffect"], [
        isLoggedIn,
        isDoctor,
        router
    ]);
    if (!isLoggedIn || !isDoctor) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-slate-50 py-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto max-w-5xl px-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-1",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-3xl font-bold text-slate-900",
                        children: "Quản lý lịch làm việc"
                    }, void 0, false, {
                        fileName: "[project]/src/app/doctor/schedule/page.tsx",
                        lineNumber: 24,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/doctor/schedule/page.tsx",
                    lineNumber: 23,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$DoctorScheduleManager$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/app/doctor/schedule/page.tsx",
                    lineNumber: 26,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/doctor/schedule/page.tsx",
            lineNumber: 22,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/doctor/schedule/page.tsx",
        lineNumber: 21,
        columnNumber: 9
    }, this);
}
_s(DoctorSchedulePage, "S3zM3JpGzCzeJG+fQmvB2YIo1io=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = DoctorSchedulePage;
var _c;
__turbopack_context__.k.register(_c, "DoctorSchedulePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_c84288f9._.js.map