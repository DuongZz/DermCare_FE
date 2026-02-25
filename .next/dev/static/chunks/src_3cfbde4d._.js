(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/services/doctorService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAllDoctors",
    ()=>getAllDoctors,
    "getDoctorAppointments",
    ()=>getDoctorAppointments,
    "getDoctorById",
    ()=>getDoctorById,
    "getDoctors",
    ()=>getDoctors,
    "getPublicDoctors",
    ()=>getPublicDoctors,
    "searchDoctors",
    ()=>searchDoctors,
    "updateAppointmentDetails",
    ()=>updateAppointmentDetails,
    "updateAppointmentStatus",
    ()=>updateAppointmentStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/apiClient.ts [app-client] (ecmascript)");
;
const getDoctors = async ()=>{
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/doctors');
    return data;
};
const getPublicDoctors = async ()=>{
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/doctors/public');
    return data.data;
};
const getAllDoctors = async ()=>{
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/doctors/all');
    return data.data;
};
const getDoctorById = async (id)=>{
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/doctors/${id}`);
    return data;
};
const searchDoctors = async (query)=>{
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/doctors/search', {
        params: {
            q: query
        }
    });
    return data;
};
const getDoctorAppointments = async ()=>{
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/doctor/appointments');
    return data.data || data;
};
const updateAppointmentStatus = async (appointmentId, status)=>{
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/doctor/appointments/${appointmentId}/status`, {
        status
    });
    return data.data || data;
};
const updateAppointmentDetails = async (appointmentId, details)=>{
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(`/doctor/appointments/${appointmentId}`, details);
    return data.data || data;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/DoctorAppointments.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DoctorAppointments
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$doctorService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/doctorService.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
/* ─── Status Configs ─── */ const APPOINTMENT_STATUS = {
    PENDING: {
        label: "Chờ xác nhận",
        icon: "⏳",
        text: "text-amber-700",
        bg: "bg-amber-50",
        border: "border-amber-200",
        dot: "bg-amber-400"
    },
    CONFIRMED: {
        label: "Đã xác nhận",
        icon: "✅",
        text: "text-blue-700",
        bg: "bg-blue-50",
        border: "border-blue-200",
        dot: "bg-blue-400"
    },
    COMPLETED: {
        label: "Hoàn thành",
        icon: "🎉",
        text: "text-green-700",
        bg: "bg-green-50",
        border: "border-green-200",
        dot: "bg-green-400"
    },
    CANCELLED: {
        label: "Đã hủy",
        icon: "❌",
        text: "text-red-700",
        bg: "bg-red-50",
        border: "border-red-200",
        dot: "bg-red-400"
    },
    RESCHEDULED: {
        label: "Đổi lịch",
        icon: "🔄",
        text: "text-purple-700",
        bg: "bg-purple-50",
        border: "border-purple-200",
        dot: "bg-purple-400"
    }
};
const PAYMENT_STATUS = {
    PENDING: {
        label: "Chưa thanh toán",
        icon: "💳",
        text: "text-amber-600",
        bg: "bg-amber-50"
    },
    PAID: {
        label: "Đã thanh toán",
        icon: "✅",
        text: "text-green-600",
        bg: "bg-green-50"
    },
    CANCELLED: {
        label: "Đã hủy TT",
        icon: "🚫",
        text: "text-red-600",
        bg: "bg-red-50"
    }
};
const FILTER_TABS = [
    {
        value: "ALL",
        label: "Tất cả",
        icon: "📋"
    },
    {
        value: "PENDING",
        label: "Chờ xác nhận",
        icon: "⏳"
    },
    {
        value: "CONFIRMED",
        label: "Đã xác nhận",
        icon: "✅"
    },
    {
        value: "COMPLETED",
        label: "Hoàn thành",
        icon: "🎉"
    },
    {
        value: "CANCELLED",
        label: "Đã hủy",
        icon: "❌"
    },
    {
        value: "RESCHEDULED",
        label: "Đổi lịch",
        icon: "🔄"
    }
];
/* ─── Helpers ─── */ const formatDate = (d)=>{
    try {
        return new Date(d).toLocaleDateString("vi-VN", {
            weekday: "short",
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    } catch  {
        return d;
    }
};
const formatCurrency = (n)=>new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND"
    }).format(n);
const timeAgo = (d)=>{
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} phút trước`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} giờ trước`;
    const days = Math.floor(hrs / 24);
    return `${days} ngày trước`;
};
/* ─── Mock Data (remove when BE is ready) ─── */ const MOCK_APPOINTMENTS = [
    {
        id: "mock-1",
        patientId: "p1",
        doctorId: "d1",
        appointmentDate: "2026-02-25",
        appointmentTime: "09:00",
        appointmentStatus: "PENDING",
        note: "Bệnh nhân bị ngứa da vùng cánh tay trái kéo dài 2 tuần, đã dùng kem bôi nhưng không đỡ.",
        price: 250000,
        paymentStatus: "PENDING",
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        patient: {
            id: "p1",
            fullName: "Nguyễn Văn An",
            email: "an.nguyen@gmail.com",
            phone: "0901234567",
            gender: "MALE"
        }
    },
    {
        id: "mock-2",
        patientId: "p2",
        doctorId: "d1",
        appointmentDate: "2026-02-26",
        appointmentTime: "14:30",
        appointmentStatus: "CONFIRMED",
        note: "Tái khám sau điều trị mụn trứng cá.",
        price: 300000,
        paymentStatus: "PAID",
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        patient: {
            id: "p2",
            fullName: "Trần Thị Bích",
            email: "bich.tran@gmail.com",
            phone: "0912345678",
            gender: "FEMALE"
        }
    },
    {
        id: "mock-3",
        patientId: "p3",
        doctorId: "d1",
        appointmentDate: "2026-02-20",
        appointmentTime: "10:00",
        appointmentStatus: "COMPLETED",
        note: "Khám tổng quát da liễu định kỳ.",
        price: 200000,
        paymentStatus: "PAID",
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        patient: {
            id: "p3",
            fullName: "Lê Hoàng Minh",
            email: "minh.le@gmail.com",
            phone: "0923456789",
            gender: "MALE"
        }
    },
    {
        id: "mock-4",
        patientId: "p4",
        doctorId: "d1",
        appointmentDate: "2026-02-22",
        appointmentTime: "16:00",
        appointmentStatus: "CANCELLED",
        note: "",
        price: 250000,
        paymentStatus: "CANCELLED",
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        patient: {
            id: "p4",
            fullName: "Phạm Mai Linh",
            email: "linh.pham@gmail.com",
            phone: "0934567890",
            gender: "FEMALE"
        }
    }
];
function DoctorAppointments() {
    _s();
    const [appointments, setAppointments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [filter, setFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("ALL");
    const [updatingId, setUpdatingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [expandedId, setExpandedId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [editingId, setEditingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editForm, setEditForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        appointmentDate: "",
        appointmentTime: "",
        price: 0
    });
    const [savingEdit, setSavingEdit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DoctorAppointments.useEffect": ()=>{
            fetchAppointments();
        }
    }["DoctorAppointments.useEffect"], []);
    const fetchAppointments = async ()=>{
        setLoading(true);
        try {
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$doctorService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoctorAppointments"])();
            setAppointments(data.length > 0 ? data : MOCK_APPOINTMENTS);
        } catch (err) {
            console.error("Failed to load appointments, using mock data:", err);
            setAppointments(MOCK_APPOINTMENTS);
        } finally{
            setLoading(false);
        }
    };
    const handleUpdateStatus = async (id, status)=>{
        setUpdatingId(id);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$doctorService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateAppointmentStatus"])(id, status);
            setAppointments((prev)=>prev.map((a)=>a.id === id ? {
                        ...a,
                        appointmentStatus: status
                    } : a));
        } catch (err) {
            console.error("Failed to update:", err);
            alert("Cập nhật trạng thái thất bại!");
        } finally{
            setUpdatingId(null);
        }
    };
    const startEditing = (apt)=>{
        setEditingId(apt.id);
        setEditForm({
            appointmentDate: apt.appointmentDate?.split("T")[0] || "",
            appointmentTime: apt.appointmentTime || "",
            price: apt.price || 0
        });
    };
    const cancelEditing = ()=>{
        setEditingId(null);
    };
    const saveEdit = async (id)=>{
        setSavingEdit(true);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$doctorService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateAppointmentDetails"])(id, editForm);
            setAppointments((prev)=>prev.map((a)=>a.id === id ? {
                        ...a,
                        ...editForm
                    } : a));
            setEditingId(null);
        } catch (err) {
            console.error("Failed to save:", err);
            alert("Lưu thay đổi thất bại!");
        } finally{
            setSavingEdit(false);
        }
    };
    /* ─── Filtered + Searched ─── */ const filtered = appointments.filter((a)=>filter === "ALL" || a.appointmentStatus === filter).filter((a)=>{
        if (!searchTerm) return true;
        const q = searchTerm.toLowerCase();
        return a.patient?.fullName?.toLowerCase().includes(q) || a.patient?.email?.toLowerCase().includes(q) || a.patient?.phone?.toLowerCase().includes(q) || a.note?.toLowerCase().includes(q);
    });
    /* ─── Stats ─── */ const stats = {
        total: appointments.length,
        pending: appointments.filter((a)=>a.appointmentStatus === "PENDING").length,
        confirmed: appointments.filter((a)=>a.appointmentStatus === "CONFIRMED").length,
        completed: appointments.filter((a)=>a.appointmentStatus === "COMPLETED").length
    };
    /* ─── Loading Skeleton ─── */ if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-2 md:grid-cols-4 gap-3",
                    children: [
                        ...Array(4)
                    ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-2xl border border-slate-200 bg-white p-4 animate-pulse",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-3 w-20 bg-slate-200 rounded mb-2"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/DoctorAppointments.tsx",
                                    lineNumber: 211,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-7 w-12 bg-slate-200 rounded"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/DoctorAppointments.tsx",
                                    lineNumber: 212,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, i, true, {
                            fileName: "[project]/src/components/DoctorAppointments.tsx",
                            lineNumber: 210,
                            columnNumber: 25
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/components/DoctorAppointments.tsx",
                    lineNumber: 208,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-3",
                    children: [
                        ...Array(3)
                    ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-2xl border border-slate-200 bg-white p-5 animate-pulse",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-12 w-12 rounded-full bg-slate-200"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                                        lineNumber: 221,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-4 w-40 bg-slate-200 rounded"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                lineNumber: 223,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-3 w-64 bg-slate-200 rounded"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                lineNumber: 224,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-3 w-32 bg-slate-200 rounded"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                lineNumber: 225,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                                        lineNumber: 222,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                lineNumber: 220,
                                columnNumber: 29
                            }, this)
                        }, i, false, {
                            fileName: "[project]/src/components/DoctorAppointments.tsx",
                            lineNumber: 219,
                            columnNumber: 25
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/components/DoctorAppointments.tsx",
                    lineNumber: 217,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/DoctorAppointments.tsx",
            lineNumber: 206,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 md:grid-cols-4 gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                        label: "Tổng lịch hẹn",
                        value: stats.total,
                        icon: "📊",
                        color: "slate"
                    }, void 0, false, {
                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                        lineNumber: 239,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                        label: "Chờ xác nhận",
                        value: stats.pending,
                        icon: "⏳",
                        color: "amber"
                    }, void 0, false, {
                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                        lineNumber: 240,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                        label: "Đã xác nhận",
                        value: stats.confirmed,
                        icon: "✅",
                        color: "blue"
                    }, void 0, false, {
                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                        lineNumber: 241,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                        label: "Hoàn thành",
                        value: stats.completed,
                        icon: "🎉",
                        color: "green"
                    }, void 0, false, {
                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                        lineNumber: 242,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/DoctorAppointments.tsx",
                lineNumber: 238,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-slate-200 bg-white p-4 shadow-soft",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative mb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/DoctorAppointments.tsx",
                                    lineNumber: 250,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                lineNumber: 249,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "Tìm theo tên, email, SĐT bệnh nhân...",
                                value: searchTerm,
                                onChange: (e)=>setSearchTerm(e.target.value),
                                className: "w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-dermcare focus:bg-white focus:outline-none focus:ring-2 focus:ring-dermcare/20 transition"
                            }, void 0, false, {
                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                lineNumber: 252,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                        lineNumber: 248,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2 flex-wrap",
                        children: FILTER_TABS.map((tab)=>{
                            const count = tab.value === "ALL" ? appointments.length : appointments.filter((a)=>a.appointmentStatus === tab.value).length;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setFilter(tab.value),
                                className: `inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${filter === tab.value ? "bg-dermcare text-white shadow-md shadow-dermcare/25 scale-105" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: tab.icon
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                                        lineNumber: 276,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: tab.label
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                                        lineNumber: 277,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `ml-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${filter === tab.value ? "bg-white/25 text-white" : "bg-slate-200/80 text-slate-500"}`,
                                        children: count
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                                        lineNumber: 278,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, tab.value, true, {
                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                lineNumber: 268,
                                columnNumber: 29
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                        lineNumber: 262,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/DoctorAppointments.tsx",
                lineNumber: 246,
                columnNumber: 13
            }, this),
            filtered.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-5xl mb-3",
                        children: "📭"
                    }, void 0, false, {
                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                        lineNumber: 291,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-base font-semibold text-slate-700",
                        children: "Không có lịch hẹn nào"
                    }, void 0, false, {
                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                        lineNumber: 292,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-slate-400 mt-1",
                        children: searchTerm ? `Không tìm thấy kết quả cho "${searchTerm}"` : filter !== "ALL" ? `Không có lịch hẹn "${FILTER_TABS.find((t)=>t.value === filter)?.label}"` : "Chưa có bệnh nhân nào đặt lịch"
                    }, void 0, false, {
                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                        lineNumber: 293,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/DoctorAppointments.tsx",
                lineNumber: 290,
                columnNumber: 17
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: filtered.map((apt)=>{
                    const status = APPOINTMENT_STATUS[apt.appointmentStatus] || APPOINTMENT_STATUS.PENDING;
                    const payment = PAYMENT_STATUS[apt.paymentStatus] || PAYMENT_STATUS.PENDING;
                    const isExpanded = expandedId === apt.id;
                    const isUpdating = updatingId === apt.id;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `group rounded-2xl border bg-white shadow-soft transition-all hover:shadow-md ${status.border}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col sm:flex-row sm:items-center gap-4 p-5 cursor-pointer",
                                onClick: ()=>setExpandedId(isExpanded ? null : apt.id),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `flex-shrink-0 h-12 w-12 rounded-full ${status.bg} ${status.border} border flex items-center justify-center text-lg font-bold ${status.text}`,
                                        children: apt.patient?.fullName?.charAt(0)?.toUpperCase() || "?"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                                        lineNumber: 320,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2 flex-wrap",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-sm font-bold text-slate-900 truncate",
                                                        children: apt.patient?.fullName || "Bệnh nhân"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                        lineNumber: 327,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${status.text} ${status.bg} ${status.border} border`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: `h-1.5 w-1.5 rounded-full ${status.dot}`
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                                lineNumber: 332,
                                                                columnNumber: 49
                                                            }, this),
                                                            status.label
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                        lineNumber: 331,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${payment.text} ${payment.bg}`,
                                                        children: [
                                                            payment.icon,
                                                            " ",
                                                            payment.label
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                        lineNumber: 336,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                lineNumber: 326,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-slate-500",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "inline-flex items-center gap-1",
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
                                                                    d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                                    lineNumber: 342,
                                                                    columnNumber: 132
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                                lineNumber: 342,
                                                                columnNumber: 49
                                                            }, this),
                                                            formatDate(apt.appointmentDate)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                        lineNumber: 341,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "inline-flex items-center gap-1",
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
                                                                    d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                                    lineNumber: 346,
                                                                    columnNumber: 132
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                                lineNumber: 346,
                                                                columnNumber: 49
                                                            }, this),
                                                            apt.appointmentTime
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                        lineNumber: 345,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "inline-flex items-center gap-1 font-semibold text-dermcare",
                                                        children: formatCurrency(apt.price)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                        lineNumber: 349,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                lineNumber: 340,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                                        lineNumber: 325,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 flex-shrink-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "hidden sm:flex gap-2",
                                                children: [
                                                    apt.appointmentStatus === "PENDING" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: (e)=>{
                                                                    e.stopPropagation();
                                                                    handleUpdateStatus(apt.id, "CONFIRMED");
                                                                },
                                                                disabled: isUpdating,
                                                                className: "rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                                                                children: isUpdating ? "⏳" : "✓ Xác nhận"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                                lineNumber: 361,
                                                                columnNumber: 53
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: (e)=>{
                                                                    e.stopPropagation();
                                                                    handleUpdateStatus(apt.id, "CANCELLED");
                                                                },
                                                                disabled: isUpdating,
                                                                className: "rounded-lg border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 hover:border-red-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                                                                children: isUpdating ? "⏳" : "✗ Từ chối"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                                lineNumber: 368,
                                                                columnNumber: 53
                                                            }, this)
                                                        ]
                                                    }, void 0, true),
                                                    apt.appointmentStatus === "CONFIRMED" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: (e)=>{
                                                            e.stopPropagation();
                                                            handleUpdateStatus(apt.id, "COMPLETED");
                                                        },
                                                        disabled: isUpdating,
                                                        className: "rounded-lg bg-green-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-green-700 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                                                        children: isUpdating ? "⏳" : "✓ Hoàn thành"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                        lineNumber: 378,
                                                        columnNumber: 49
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                lineNumber: 358,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: `h-5 w-5 text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`,
                                                fill: "none",
                                                stroke: "currentColor",
                                                viewBox: "0 0 24 24",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M19 9l-7 7-7-7"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                    lineNumber: 393,
                                                    columnNumber: 45
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                lineNumber: 389,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                                        lineNumber: 356,
                                        columnNumber: 37
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                lineNumber: 315,
                                columnNumber: 33
                            }, this),
                            isExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border-t border-slate-100 px-5 pb-5 pt-4 animate-in fade-in slide-in-from-top-2 duration-200",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "rounded-xl bg-slate-50 p-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "text-xs font-bold text-slate-500 uppercase tracking-wider mb-3",
                                                        children: "Thông tin bệnh nhân"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                        lineNumber: 404,
                                                        columnNumber: 49
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DetailRow, {
                                                                label: "Họ tên",
                                                                value: apt.patient?.fullName
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                                lineNumber: 406,
                                                                columnNumber: 53
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DetailRow, {
                                                                label: "Email",
                                                                value: apt.patient?.email
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                                lineNumber: 407,
                                                                columnNumber: 53
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DetailRow, {
                                                                label: "SĐT",
                                                                value: apt.patient?.phone
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                                lineNumber: 408,
                                                                columnNumber: 53
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DetailRow, {
                                                                label: "Giới tính",
                                                                value: apt.patient?.gender === "MALE" ? "Nam" : apt.patient?.gender === "FEMALE" ? "Nữ" : apt.patient?.gender
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                                lineNumber: 409,
                                                                columnNumber: 53
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                        lineNumber: 405,
                                                        columnNumber: 49
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                lineNumber: 403,
                                                columnNumber: 45
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "rounded-xl bg-slate-50 p-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between mb-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                className: "text-xs font-bold text-slate-500 uppercase tracking-wider",
                                                                children: "Chi tiết lịch hẹn"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                                lineNumber: 419,
                                                                columnNumber: 53
                                                            }, this),
                                                            editingId !== apt.id && (apt.appointmentStatus === "PENDING" || apt.appointmentStatus === "CONFIRMED" || apt.appointmentStatus === "RESCHEDULED") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: (e)=>{
                                                                    e.stopPropagation();
                                                                    startEditing(apt);
                                                                },
                                                                className: "inline-flex items-center gap-1 rounded-lg bg-dermcare/10 px-2.5 py-1 text-[11px] font-semibold text-dermcare hover:bg-dermcare/20 transition",
                                                                children: "✏️ Chỉnh sửa"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                                lineNumber: 421,
                                                                columnNumber: 57
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                        lineNumber: 418,
                                                        columnNumber: 49
                                                    }, this),
                                                    editingId === apt.id ? /* ── Edit Mode ── */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "block text-[11px] font-medium text-slate-500 mb-1",
                                                                        children: "📅 Ngày khám"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                                        lineNumber: 434,
                                                                        columnNumber: 61
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "date",
                                                                        value: editForm.appointmentDate,
                                                                        onChange: (e)=>setEditForm({
                                                                                ...editForm,
                                                                                appointmentDate: e.target.value
                                                                            }),
                                                                        className: "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-dermcare focus:outline-none focus:ring-2 focus:ring-dermcare/20 transition"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                                        lineNumber: 435,
                                                                        columnNumber: 61
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                                lineNumber: 433,
                                                                columnNumber: 57
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "block text-[11px] font-medium text-slate-500 mb-1",
                                                                        children: "🕐 Giờ khám"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                                        lineNumber: 443,
                                                                        columnNumber: 61
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "time",
                                                                        value: editForm.appointmentTime,
                                                                        onChange: (e)=>setEditForm({
                                                                                ...editForm,
                                                                                appointmentTime: e.target.value
                                                                            }),
                                                                        className: "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-dermcare focus:outline-none focus:ring-2 focus:ring-dermcare/20 transition"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                                        lineNumber: 444,
                                                                        columnNumber: 61
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                                lineNumber: 442,
                                                                columnNumber: 57
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "block text-[11px] font-medium text-slate-500 mb-1",
                                                                        children: "💰 Giá khám (VND)"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                                        lineNumber: 452,
                                                                        columnNumber: 61
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        value: editForm.price,
                                                                        onChange: (e)=>setEditForm({
                                                                                ...editForm,
                                                                                price: Number(e.target.value)
                                                                            }),
                                                                        min: 0,
                                                                        step: 10000,
                                                                        className: "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-dermcare focus:outline-none focus:ring-2 focus:ring-dermcare/20 transition"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                                        lineNumber: 453,
                                                                        columnNumber: 61
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                                lineNumber: 451,
                                                                columnNumber: 57
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex gap-2 pt-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>saveEdit(apt.id),
                                                                        disabled: savingEdit,
                                                                        className: "flex-1 rounded-lg bg-dermcare px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-dermcare-dark transition disabled:opacity-50",
                                                                        children: savingEdit ? "⏳ Đang lưu..." : "💾 Lưu thay đổi"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                                        lineNumber: 463,
                                                                        columnNumber: 61
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: cancelEditing,
                                                                        disabled: savingEdit,
                                                                        className: "rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50",
                                                                        children: "Hủy"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                                        lineNumber: 470,
                                                                        columnNumber: 61
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                                lineNumber: 462,
                                                                columnNumber: 57
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                        lineNumber: 432,
                                                        columnNumber: 53
                                                    }, this) : /* ── View Mode ── */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DetailRow, {
                                                                label: "Ngày khám",
                                                                value: formatDate(apt.appointmentDate)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                                lineNumber: 482,
                                                                columnNumber: 57
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DetailRow, {
                                                                label: "Giờ khám",
                                                                value: apt.appointmentTime
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                                lineNumber: 483,
                                                                columnNumber: 57
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DetailRow, {
                                                                label: "Giá khám",
                                                                value: formatCurrency(apt.price),
                                                                highlight: true
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                                lineNumber: 484,
                                                                columnNumber: 57
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DetailRow, {
                                                                label: "Thanh toán",
                                                                value: `${payment.icon} ${payment.label}`
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                                lineNumber: 485,
                                                                columnNumber: 57
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DetailRow, {
                                                                label: "Ngày tạo",
                                                                value: timeAgo(apt.created_at)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                                lineNumber: 486,
                                                                columnNumber: 57
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                        lineNumber: 481,
                                                        columnNumber: 53
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                lineNumber: 417,
                                                columnNumber: 45
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                                        lineNumber: 401,
                                        columnNumber: 41
                                    }, this),
                                    apt.note && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-4 rounded-xl bg-amber-50 border border-amber-100 p-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "text-xs font-bold text-amber-700 uppercase tracking-wider mb-1.5",
                                                children: "📝 Ghi chú / Triệu chứng"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                lineNumber: 495,
                                                columnNumber: 49
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-amber-900 leading-relaxed",
                                                children: apt.note
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                lineNumber: 496,
                                                columnNumber: 49
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                                        lineNumber: 494,
                                        columnNumber: 45
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2 mt-4 sm:hidden",
                                        children: [
                                            apt.appointmentStatus === "PENDING" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleUpdateStatus(apt.id, "CONFIRMED"),
                                                        disabled: isUpdating,
                                                        className: "flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition disabled:opacity-50",
                                                        children: isUpdating ? "⏳" : "✓ Xác nhận"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                        lineNumber: 504,
                                                        columnNumber: 53
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleUpdateStatus(apt.id, "CANCELLED"),
                                                        disabled: isUpdating,
                                                        className: "flex-1 rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition disabled:opacity-50",
                                                        children: isUpdating ? "⏳" : "✗ Từ chối"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                        lineNumber: 511,
                                                        columnNumber: 53
                                                    }, this)
                                                ]
                                            }, void 0, true),
                                            apt.appointmentStatus === "CONFIRMED" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>handleUpdateStatus(apt.id, "COMPLETED"),
                                                disabled: isUpdating,
                                                className: "flex-1 rounded-xl bg-green-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 transition disabled:opacity-50",
                                                children: isUpdating ? "⏳" : "✓ Hoàn thành"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                lineNumber: 521,
                                                columnNumber: 49
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                                        lineNumber: 501,
                                        columnNumber: 41
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                lineNumber: 400,
                                columnNumber: 37
                            }, this)
                        ]
                    }, apt.id, true, {
                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                        lineNumber: 310,
                        columnNumber: 29
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/components/DoctorAppointments.tsx",
                lineNumber: 302,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/DoctorAppointments.tsx",
        lineNumber: 236,
        columnNumber: 9
    }, this);
}
_s(DoctorAppointments, "4K/1z73zxVSxjmaxO/WbilAgpG4=");
_c = DoctorAppointments;
/* ─── Sub-components ─── */ function StatCard({ label, value, icon, color }) {
    const colorMap = {
        slate: "from-slate-50 to-white border-slate-200",
        amber: "from-amber-50 to-white border-amber-200",
        blue: "from-blue-50 to-white border-blue-200",
        green: "from-green-50 to-white border-green-200"
    };
    const textMap = {
        slate: "text-slate-900",
        amber: "text-amber-600",
        blue: "text-blue-600",
        green: "text-green-600"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `rounded-2xl border bg-gradient-to-br ${colorMap[color]} p-4 shadow-soft transition hover:shadow-md`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs font-medium text-slate-500",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                        lineNumber: 558,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-lg",
                        children: icon
                    }, void 0, false, {
                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                        lineNumber: 559,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/DoctorAppointments.tsx",
                lineNumber: 557,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: `text-2xl font-bold ${textMap[color]}`,
                children: value
            }, void 0, false, {
                fileName: "[project]/src/components/DoctorAppointments.tsx",
                lineNumber: 561,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/DoctorAppointments.tsx",
        lineNumber: 556,
        columnNumber: 9
    }, this);
}
_c1 = StatCard;
function DetailRow({ label, value, highlight }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center justify-between",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-xs text-slate-500",
                children: label
            }, void 0, false, {
                fileName: "[project]/src/components/DoctorAppointments.tsx",
                lineNumber: 569,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: `text-sm font-medium ${highlight ? "text-dermcare font-bold" : "text-slate-800"}`,
                children: value || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-slate-300 italic",
                    children: "—"
                }, void 0, false, {
                    fileName: "[project]/src/components/DoctorAppointments.tsx",
                    lineNumber: 571,
                    columnNumber: 27
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/DoctorAppointments.tsx",
                lineNumber: 570,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/DoctorAppointments.tsx",
        lineNumber: 568,
        columnNumber: 9
    }, this);
}
_c2 = DetailRow;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "DoctorAppointments");
__turbopack_context__.k.register(_c1, "StatCard");
__turbopack_context__.k.register(_c2, "DetailRow");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/doctor/appointments/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DoctorAppointmentsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$DoctorAppointments$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/DoctorAppointments.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function DoctorAppointmentsPage() {
    _s();
    const { isLoggedIn, isDoctor } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DoctorAppointmentsPage.useEffect": ()=>{
            if (!isLoggedIn || !isDoctor) {
                router.push("/");
            }
        }
    }["DoctorAppointmentsPage.useEffect"], [
        isLoggedIn,
        isDoctor,
        router
    ]);
    if (!isLoggedIn || !isDoctor) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-slate-50 py-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto max-w-6xl px-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-3xl font-bold text-slate-900",
                            children: "Quản lý lịch hẹn"
                        }, void 0, false, {
                            fileName: "[project]/src/app/doctor/appointments/page.tsx",
                            lineNumber: 24,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-slate-500 mt-1",
                            children: "Xem và quản lý các ca khám của bạn"
                        }, void 0, false, {
                            fileName: "[project]/src/app/doctor/appointments/page.tsx",
                            lineNumber: 25,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/doctor/appointments/page.tsx",
                    lineNumber: 23,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$DoctorAppointments$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/app/doctor/appointments/page.tsx",
                    lineNumber: 27,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/doctor/appointments/page.tsx",
            lineNumber: 22,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/doctor/appointments/page.tsx",
        lineNumber: 21,
        columnNumber: 9
    }, this);
}
_s(DoctorAppointmentsPage, "S3zM3JpGzCzeJG+fQmvB2YIo1io=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = DoctorAppointmentsPage;
var _c;
__turbopack_context__.k.register(_c, "DoctorAppointmentsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_3cfbde4d._.js.map