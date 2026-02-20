module.exports = [
"[project]/src/services/doctorService.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getDoctorAppointments",
    ()=>getDoctorAppointments,
    "getDoctorById",
    ()=>getDoctorById,
    "getDoctors",
    ()=>getDoctors,
    "searchDoctors",
    ()=>searchDoctors,
    "updateAppointmentStatus",
    ()=>updateAppointmentStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/apiClient.ts [app-ssr] (ecmascript)");
;
const getDoctors = async ()=>{
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get('/doctors');
    return data;
};
const getDoctorById = async (id)=>{
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(`/doctors/${id}`);
    return data;
};
const searchDoctors = async (query)=>{
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get('/doctors/search', {
        params: {
            q: query
        }
    });
    return data;
};
const getDoctorAppointments = async ()=>{
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get('/doctor/appointments');
    return data.data || data;
};
const updateAppointmentStatus = async (appointmentId, status)=>{
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].patch(`/doctor/appointments/${appointmentId}/status`, {
        status
    });
    return data.data || data;
};
}),
"[project]/src/components/DoctorAppointments.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DoctorAppointments
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$doctorService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/doctorService.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const STATUS_MAP = {
    PENDING: {
        label: "Chờ xác nhận",
        color: "text-amber-700",
        bg: "bg-amber-50 border-amber-200"
    },
    CONFIRMED: {
        label: "Đã xác nhận",
        color: "text-blue-700",
        bg: "bg-blue-50 border-blue-200"
    },
    COMPLETED: {
        label: "Hoàn thành",
        color: "text-green-700",
        bg: "bg-green-50 border-green-200"
    },
    CANCELLED: {
        label: "Đã hủy",
        color: "text-red-700",
        bg: "bg-red-50 border-red-200"
    },
    RESCHEDULED: {
        label: "Đổi lịch",
        color: "text-purple-700",
        bg: "bg-purple-50 border-purple-200"
    }
};
const FILTER_OPTIONS = [
    {
        value: "ALL",
        label: "Tất cả"
    },
    {
        value: "PENDING",
        label: "Chờ xác nhận"
    },
    {
        value: "CONFIRMED",
        label: "Đã xác nhận"
    },
    {
        value: "COMPLETED",
        label: "Hoàn thành"
    },
    {
        value: "CANCELLED",
        label: "Đã hủy"
    }
];
function DoctorAppointments() {
    const [appointments, setAppointments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [filter, setFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("ALL");
    const [updatingId, setUpdatingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchAppointments();
    }, []);
    const fetchAppointments = async ()=>{
        setLoading(true);
        try {
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$doctorService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDoctorAppointments"])();
            setAppointments(data);
        } catch (error) {
            console.error("Failed to fetch doctor appointments:", error);
        } finally{
            setLoading(false);
        }
    };
    const handleUpdateStatus = async (appointmentId, newStatus)=>{
        setUpdatingId(appointmentId);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$doctorService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateAppointmentStatus"])(appointmentId, newStatus);
            // Optimistic update
            setAppointments((prev)=>prev.map((apt)=>apt.id === appointmentId ? {
                        ...apt,
                        appointmentStatus: newStatus
                    } : apt));
        } catch (error) {
            console.error("Failed to update appointment status:", error);
            alert("Cập nhật trạng thái thất bại. Vui lòng thử lại.");
        } finally{
            setUpdatingId(null);
        }
    };
    const filteredAppointments = filter === "ALL" ? appointments : appointments.filter((a)=>a.appointmentStatus === filter);
    const formatDate = (dateStr)=>{
        try {
            return new Date(dateStr).toLocaleDateString('vi-VN', {
                weekday: 'short',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch  {
            return dateStr;
        }
    };
    const formatCurrency = (amount)=>{
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-2xl border border-slate-200 bg-white p-6 shadow-soft",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3 mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-2xl",
                            children: "🩺"
                        }, void 0, false, {
                            fileName: "[project]/src/components/DoctorAppointments.tsx",
                            lineNumber: 82,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-lg font-bold text-slate-900",
                            children: "Quản lý ca khám"
                        }, void 0, false, {
                            fileName: "[project]/src/components/DoctorAppointments.tsx",
                            lineNumber: 83,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/DoctorAppointments.tsx",
                    lineNumber: 81,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center py-12",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-8 w-8 animate-spin rounded-full border-4 border-dermcare border-t-transparent"
                        }, void 0, false, {
                            fileName: "[project]/src/components/DoctorAppointments.tsx",
                            lineNumber: 86,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "ml-3 text-sm text-slate-500",
                            children: "Đang tải lịch hẹn..."
                        }, void 0, false, {
                            fileName: "[project]/src/components/DoctorAppointments.tsx",
                            lineNumber: 87,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/DoctorAppointments.tsx",
                    lineNumber: 85,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/DoctorAppointments.tsx",
            lineNumber: 80,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-2xl border border-slate-200 bg-white p-6 shadow-soft",
        id: "appointments",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-2xl",
                                children: "🩺"
                            }, void 0, false, {
                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                lineNumber: 98,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-lg font-bold text-slate-900",
                                        children: "Quản lý ca khám"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                                        lineNumber: 100,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-slate-500",
                                        children: [
                                            appointments.length,
                                            " lịch hẹn"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                                        lineNumber: 101,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                lineNumber: 99,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                        lineNumber: 97,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2 flex-wrap",
                        children: FILTER_OPTIONS.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setFilter(opt.value),
                                className: `rounded-full px-3 py-1 text-xs font-medium transition ${filter === opt.value ? "bg-dermcare text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
                                children: opt.label
                            }, opt.value, false, {
                                fileName: "[project]/src/components/DoctorAppointments.tsx",
                                lineNumber: 108,
                                columnNumber: 25
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                        lineNumber: 106,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/DoctorAppointments.tsx",
                lineNumber: 96,
                columnNumber: 13
            }, this),
            filteredAppointments.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center py-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-4xl mb-3",
                        children: "📭"
                    }, void 0, false, {
                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                        lineNumber: 125,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-slate-500",
                        children: filter === "ALL" ? "Chưa có lịch hẹn nào" : `Không có lịch hẹn "${FILTER_OPTIONS.find((o)=>o.value === filter)?.label}"`
                    }, void 0, false, {
                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                        lineNumber: 126,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/DoctorAppointments.tsx",
                lineNumber: 124,
                columnNumber: 17
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: filteredAppointments.map((apt)=>{
                    const status = STATUS_MAP[apt.appointmentStatus] || STATUS_MAP.PENDING;
                    const isUpdating = updatingId === apt.id;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `rounded-xl border p-4 transition hover:shadow-md ${status.bg}`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2 mb-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-lg",
                                                    children: "👤"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                    lineNumber: 145,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-semibold text-slate-900 truncate",
                                                    children: apt.patient?.fullName || "Bệnh nhân"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                    lineNumber: 146,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${status.color} ${status.bg}`,
                                                    children: status.label
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                    lineNumber: 149,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/DoctorAppointments.tsx",
                                            lineNumber: 144,
                                            columnNumber: 41
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        "📅 ",
                                                        formatDate(apt.appointmentDate)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                    lineNumber: 154,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        "🕐 ",
                                                        apt.appointmentTime
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                    lineNumber: 155,
                                                    columnNumber: 45
                                                }, this),
                                                apt.patient?.phone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        "📞 ",
                                                        apt.patient.phone
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                    lineNumber: 156,
                                                    columnNumber: 68
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        "💰 ",
                                                        formatCurrency(apt.price)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                    lineNumber: 157,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/DoctorAppointments.tsx",
                                            lineNumber: 153,
                                            columnNumber: 41
                                        }, this),
                                        apt.note && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1.5 text-xs text-slate-500 italic line-clamp-2",
                                            children: [
                                                "📝 ",
                                                apt.note
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/DoctorAppointments.tsx",
                                            lineNumber: 160,
                                            columnNumber: 45
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/DoctorAppointments.tsx",
                                    lineNumber: 143,
                                    columnNumber: 37
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2 flex-shrink-0",
                                    children: [
                                        apt.appointmentStatus === "PENDING" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleUpdateStatus(apt.id, "CONFIRMED"),
                                                    disabled: isUpdating,
                                                    className: "rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50",
                                                    children: isUpdating ? "..." : "✓ Xác nhận"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                    lineNumber: 170,
                                                    columnNumber: 49
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleUpdateStatus(apt.id, "CANCELLED"),
                                                    disabled: isUpdating,
                                                    className: "rounded-lg bg-red-50 border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition disabled:opacity-50",
                                                    children: isUpdating ? "..." : "✗ Từ chối"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/DoctorAppointments.tsx",
                                                    lineNumber: 177,
                                                    columnNumber: 49
                                                }, this)
                                            ]
                                        }, void 0, true),
                                        apt.appointmentStatus === "CONFIRMED" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>handleUpdateStatus(apt.id, "COMPLETED"),
                                            disabled: isUpdating,
                                            className: "rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 transition disabled:opacity-50",
                                            children: isUpdating ? "..." : "✓ Hoàn thành"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/DoctorAppointments.tsx",
                                            lineNumber: 187,
                                            columnNumber: 45
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/DoctorAppointments.tsx",
                                    lineNumber: 167,
                                    columnNumber: 37
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/DoctorAppointments.tsx",
                            lineNumber: 141,
                            columnNumber: 33
                        }, this)
                    }, apt.id, false, {
                        fileName: "[project]/src/components/DoctorAppointments.tsx",
                        lineNumber: 137,
                        columnNumber: 29
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/components/DoctorAppointments.tsx",
                lineNumber: 131,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/DoctorAppointments.tsx",
        lineNumber: 94,
        columnNumber: 9
    }, this);
}
}),
"[project]/src/services/userService.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/apiClient.ts [app-ssr] (ecmascript)");
;
const userService = {
    getMedicalInfo: async ()=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get('/users/me/medical-info');
        return response.data;
    },
    updateMedicalInfo: async (data)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].patch('/users/me/medical-info', data);
        return response.data;
    }
};
const __TURBOPACK__default__export__ = userService;
}),
"[project]/src/app/profile/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProfilePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$DoctorAppointments$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/DoctorAppointments.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$userService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/userService.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
function ProfilePage() {
    const { user, isDoctor } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const [isEditing, setIsEditing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [profileData, setProfileData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        fullName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        address: "",
        emergencyContact: "",
        bloodType: "",
        allergies: "",
        medications: "",
        skinType: "",
        chronicConditions: ""
    });
    // Fetch user Medical Info
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const fetchMedicalInfo = async ()=>{
            try {
                const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$userService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getMedicalInfo();
                if (res.success && res.data) {
                    const medicalInfo = res.data;
                    setProfileData((prev)=>({
                            ...prev,
                            bloodType: medicalInfo.bloodGroup || "",
                            allergies: medicalInfo.allergies || "",
                            emergencyContact: medicalInfo.emergencyContact || "",
                            medications: medicalInfo.currentMedications || "",
                            skinType: medicalInfo.skinType || "",
                            chronicConditions: medicalInfo.chronicConditions || ""
                        }));
                }
            } catch (error) {
                console.error("Failed to fetch medical info:", error);
            }
        };
        if (user) {
            fetchMedicalInfo();
        }
    }, [
        user
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        console.log("ProfilePage: user updated", user);
        if (user) {
            setProfileData((prev)=>({
                    ...prev,
                    fullName: user.fullName || "",
                    email: user.email || "",
                    gender: user.gender || "",
                    dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : "",
                    phone: user.phone || "",
                    address: user.address || ""
                }));
        }
    }, [
        user
    ]);
    const [editData, setEditData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(profileData);
    // Sync editData when profileData updates (e.g. after fetch)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setEditData(profileData);
    }, [
        profileData
    ]);
    const handleSave = async ()=>{
        setIsLoading(true);
        try {
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$userService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].updateMedicalInfo({
                skinType: editData.skinType,
                bloodGroup: editData.bloodType,
                allergies: editData.allergies,
                emergencyContact: editData.emergencyContact,
                currentMedications: editData.medications,
                chronicConditions: editData.chronicConditions
            });
            if (res.success) {
                // Update local state immediately for optimistic UI or re-fetch
                setProfileData(editData);
                setIsEditing(false);
                console.log("Medical info updated successfully");
            } else {
                throw new Error("Update failed");
            }
        } catch (error) {
            console.error("Failed to update medical info:", error);
            alert("Cập nhật thất bại. Vui lòng thử lại.");
        } finally{
            setIsLoading(false);
        }
    };
    const handleCancel = ()=>{
        setEditData(profileData);
        setIsEditing(false);
    };
    const inputClass = "w-full rounded-md border border-slate-300 bg-white px-2 h-8 text-sm text-slate-900 focus:border-dermcare focus:outline-none focus:ring-1 focus:ring-dermcare/20";
    const EmptyValue = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "font-normal italic text-slate-400",
            children: "Chưa cập nhật"
        }, void 0, false, {
            fileName: "[project]/src/app/profile/page.tsx",
            lineNumber: 113,
            columnNumber: 30
        }, this);
    const BLOOD_TYPES = {
        "A_POSITIVE": "A+",
        "A_NEGATIVE": "A-",
        "B_POSITIVE": "B+",
        "B_NEGATIVE": "B-",
        "AB_POSITIVE": "AB+",
        "AB_NEGATIVE": "AB-",
        "O_POSITIVE": "O+",
        "O_NEGATIVE": "O-"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-slate-50 py-2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto max-w-5xl px-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-2 flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-3xl font-bold text-slate-900",
                                    children: "Hồ sơ cá nhân"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/profile/page.tsx",
                                    lineNumber: 134,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/profile/page.tsx",
                                lineNumber: 133,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/profile/page.tsx",
                            lineNumber: 132,
                            columnNumber: 21
                        }, this),
                        !isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setIsEditing(true),
                            className: "rounded-full bg-dermcare px-6 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-dermcare-dark transition",
                            children: "✏️ Chỉnh sửa"
                        }, void 0, false, {
                            fileName: "[project]/src/app/profile/page.tsx",
                            lineNumber: 140,
                            columnNumber: 25
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleCancel,
                                    className: "rounded-full border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition",
                                    children: "Hủy"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/profile/page.tsx",
                                    lineNumber: 148,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleSave,
                                    className: "rounded-full bg-dermcare px-6 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-dermcare-dark transition",
                                    children: "Lưu thay đổi"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/profile/page.tsx",
                                    lineNumber: 154,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/profile/page.tsx",
                            lineNumber: 147,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/profile/page.tsx",
                    lineNumber: 131,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid gap-3 lg:grid-cols-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lg:col-span-2 grid grid-cols-2 gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-2xl border border-slate-200 bg-white p-5 shadow-soft",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "mb-2 text-base font-bold text-slate-900",
                                            children: "Thông tin cá nhân"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/profile/page.tsx",
                                            lineNumber: 170,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid gap-2.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-xl bg-slate-50 px-3 py-2 transition hover:bg-slate-100/80",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "mb-0.5 block text-xs font-medium text-slate-500",
                                                            children: "Họ và tên"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 173,
                                                            columnNumber: 37
                                                        }, this),
                                                        isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: editData.fullName,
                                                            onChange: (e)=>setEditData({
                                                                    ...editData,
                                                                    fullName: e.target.value
                                                                }),
                                                            className: inputClass
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 175,
                                                            columnNumber: 41
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "h-8 flex items-center px-2 text-sm font-semibold text-slate-900",
                                                            children: profileData.fullName || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EmptyValue, {}, void 0, false, {
                                                                fileName: "[project]/src/app/profile/page.tsx",
                                                                lineNumber: 177,
                                                                columnNumber: 145
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 177,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                    lineNumber: 172,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-xl bg-slate-50 px-3 py-2 transition hover:bg-slate-100/80",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "mb-0.5 block text-xs font-medium text-slate-500",
                                                            children: "Email"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 182,
                                                            columnNumber: 37
                                                        }, this),
                                                        isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "email",
                                                            value: editData.email,
                                                            onChange: (e)=>setEditData({
                                                                    ...editData,
                                                                    email: e.target.value
                                                                }),
                                                            className: inputClass
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 184,
                                                            columnNumber: 41
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "h-8 flex items-center px-2 text-sm font-semibold text-slate-900",
                                                            children: profileData.email || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EmptyValue, {}, void 0, false, {
                                                                fileName: "[project]/src/app/profile/page.tsx",
                                                                lineNumber: 186,
                                                                columnNumber: 142
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 186,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                    lineNumber: 181,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-xl bg-slate-50 px-3 py-2 transition hover:bg-slate-100/80",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "mb-0.5 block text-xs font-medium text-slate-500",
                                                            children: "Số điện thoại"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 191,
                                                            columnNumber: 37
                                                        }, this),
                                                        isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "tel",
                                                            value: editData.phone,
                                                            onChange: (e)=>setEditData({
                                                                    ...editData,
                                                                    phone: e.target.value
                                                                }),
                                                            className: inputClass
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 193,
                                                            columnNumber: 41
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "h-8 flex items-center px-2 text-sm font-semibold text-slate-900",
                                                            children: profileData.phone || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EmptyValue, {}, void 0, false, {
                                                                fileName: "[project]/src/app/profile/page.tsx",
                                                                lineNumber: 195,
                                                                columnNumber: 142
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 195,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                    lineNumber: 190,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-xl bg-slate-50 px-3 py-2 transition hover:bg-slate-100/80",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "mb-0.5 block text-xs font-medium text-slate-500",
                                                            children: "Ngày sinh"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 200,
                                                            columnNumber: 37
                                                        }, this),
                                                        isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "date",
                                                            value: editData.dateOfBirth,
                                                            onChange: (e)=>setEditData({
                                                                    ...editData,
                                                                    dateOfBirth: e.target.value
                                                                }),
                                                            className: inputClass
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 202,
                                                            columnNumber: 41
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "h-8 flex items-center px-2 text-sm font-semibold text-slate-900",
                                                            children: profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toLocaleDateString('vi-VN') : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EmptyValue, {}, void 0, false, {
                                                                fileName: "[project]/src/app/profile/page.tsx",
                                                                lineNumber: 205,
                                                                columnNumber: 136
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 204,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                    lineNumber: 199,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-xl bg-slate-50 px-3 py-2 transition hover:bg-slate-100/80",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "mb-0.5 block text-xs font-medium text-slate-500",
                                                            children: "Giới tính"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 211,
                                                            columnNumber: 37
                                                        }, this),
                                                        isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            value: editData.gender,
                                                            onChange: (e)=>setEditData({
                                                                    ...editData,
                                                                    gender: e.target.value
                                                                }),
                                                            className: inputClass,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "MALE",
                                                                    children: "Nam"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                                    lineNumber: 214,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "FEMALE",
                                                                    children: "Nữ"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                                    lineNumber: 215,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "OTHER",
                                                                    children: "Khác"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                                    lineNumber: 216,
                                                                    columnNumber: 45
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 213,
                                                            columnNumber: 41
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "h-8 flex items-center px-2 text-sm font-semibold text-slate-900",
                                                            children: profileData.gender === "MALE" ? "Nam" : profileData.gender === "FEMALE" ? "Nữ" : profileData.gender ? "Khác" : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EmptyValue, {}, void 0, false, {
                                                                fileName: "[project]/src/app/profile/page.tsx",
                                                                lineNumber: 220,
                                                                columnNumber: 157
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 219,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                    lineNumber: 210,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-xl bg-slate-50 px-3 py-2 transition hover:bg-slate-100/80",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "mb-0.5 block text-xs font-medium text-slate-500",
                                                            children: "Địa chỉ"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 226,
                                                            columnNumber: 37
                                                        }, this),
                                                        isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: editData.address,
                                                            onChange: (e)=>setEditData({
                                                                    ...editData,
                                                                    address: e.target.value
                                                                }),
                                                            className: inputClass
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 228,
                                                            columnNumber: 41
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "h-8 flex items-center px-2 text-sm font-semibold text-slate-900",
                                                            children: profileData.address || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EmptyValue, {}, void 0, false, {
                                                                fileName: "[project]/src/app/profile/page.tsx",
                                                                lineNumber: 230,
                                                                columnNumber: 144
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 230,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                    lineNumber: 225,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/profile/page.tsx",
                                            lineNumber: 171,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/profile/page.tsx",
                                    lineNumber: 169,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-2xl border border-slate-200 bg-white p-5 shadow-soft h-full",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "mb-2 text-base font-bold text-slate-900",
                                            children: "Thông tin y tế"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/profile/page.tsx",
                                            lineNumber: 239,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid gap-2.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-xl bg-red-50/60 px-3 py-2 transition hover:bg-red-50",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "mb-0.5 block text-xs font-medium text-slate-500",
                                                            children: "Nhóm máu"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 242,
                                                            columnNumber: 37
                                                        }, this),
                                                        isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            value: editData.bloodType,
                                                            onChange: (e)=>setEditData({
                                                                    ...editData,
                                                                    bloodType: e.target.value
                                                                }),
                                                            className: inputClass,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "",
                                                                    children: "-- Chọn --"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                                    lineNumber: 245,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "A_POSITIVE",
                                                                    children: "A+"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                                    lineNumber: 246,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "A_NEGATIVE",
                                                                    children: "A-"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                                    lineNumber: 247,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "B_POSITIVE",
                                                                    children: "B+"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                                    lineNumber: 248,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "B_NEGATIVE",
                                                                    children: "B-"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                                    lineNumber: 249,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "O_POSITIVE",
                                                                    children: "O+"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                                    lineNumber: 250,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "O_NEGATIVE",
                                                                    children: "O-"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                                    lineNumber: 251,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "AB_POSITIVE",
                                                                    children: "AB+"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                                    lineNumber: 252,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "AB_NEGATIVE",
                                                                    children: "AB-"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                                    lineNumber: 253,
                                                                    columnNumber: 45
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 244,
                                                            columnNumber: 41
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "h-8 flex items-center px-2 text-sm font-semibold text-slate-900",
                                                            children: BLOOD_TYPES[profileData.bloodType] || profileData.bloodType || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EmptyValue, {}, void 0, false, {
                                                                fileName: "[project]/src/app/profile/page.tsx",
                                                                lineNumber: 257,
                                                                columnNumber: 137
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 256,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                    lineNumber: 241,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-xl bg-orange-50/60 px-3 py-2 transition hover:bg-orange-50",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "mb-0.5 block text-xs font-medium text-slate-500",
                                                            children: "Loại da"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 263,
                                                            columnNumber: 37
                                                        }, this),
                                                        isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            value: editData.skinType,
                                                            onChange: (e)=>setEditData({
                                                                    ...editData,
                                                                    skinType: e.target.value
                                                                }),
                                                            className: inputClass,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "",
                                                                    children: "-- Chọn --"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                                    lineNumber: 266,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "Da dầu",
                                                                    children: "Da dầu"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                                    lineNumber: 267,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "Da khô",
                                                                    children: "Da khô"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                                    lineNumber: 268,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "Da hỗn hợp",
                                                                    children: "Da hỗn hợp"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                                    lineNumber: 269,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "Da thường",
                                                                    children: "Da thường"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                                    lineNumber: 270,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "Da nhạy cảm",
                                                                    children: "Da nhạy cảm"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                                    lineNumber: 271,
                                                                    columnNumber: 45
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 265,
                                                            columnNumber: 41
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "h-8 flex items-center px-2 text-sm font-semibold text-slate-900",
                                                            children: profileData.skinType || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EmptyValue, {}, void 0, false, {
                                                                fileName: "[project]/src/app/profile/page.tsx",
                                                                lineNumber: 274,
                                                                columnNumber: 145
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 274,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                    lineNumber: 262,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-xl bg-green-50/60 px-3 py-2 transition hover:bg-green-50",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "mb-0.5 block text-xs font-medium text-slate-500",
                                                            children: "Liên hệ khẩn cấp"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 279,
                                                            columnNumber: 37
                                                        }, this),
                                                        isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "tel",
                                                            value: editData.emergencyContact,
                                                            onChange: (e)=>setEditData({
                                                                    ...editData,
                                                                    emergencyContact: e.target.value
                                                                }),
                                                            className: inputClass
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 281,
                                                            columnNumber: 41
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "h-8 flex items-center px-2 text-sm font-semibold text-slate-900",
                                                            children: profileData.emergencyContact || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EmptyValue, {}, void 0, false, {
                                                                fileName: "[project]/src/app/profile/page.tsx",
                                                                lineNumber: 283,
                                                                columnNumber: 153
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 283,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                    lineNumber: 278,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-xl bg-yellow-50/60 px-3 py-2 transition hover:bg-yellow-50",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "mb-0.5 block text-xs font-medium text-slate-500",
                                                            children: "Dị ứng"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 288,
                                                            columnNumber: 37
                                                        }, this),
                                                        isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: editData.allergies,
                                                            onChange: (e)=>setEditData({
                                                                    ...editData,
                                                                    allergies: e.target.value
                                                                }),
                                                            className: inputClass,
                                                            placeholder: "Nhập dị ứng (nếu có)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 290,
                                                            columnNumber: 41
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "h-8 flex items-center px-2 text-sm font-semibold text-slate-900",
                                                            children: profileData.allergies || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EmptyValue, {}, void 0, false, {
                                                                fileName: "[project]/src/app/profile/page.tsx",
                                                                lineNumber: 292,
                                                                columnNumber: 146
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 292,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                    lineNumber: 287,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-xl bg-blue-50/60 px-3 py-2 transition hover:bg-blue-50",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "mb-0.5 block text-xs font-medium text-slate-500",
                                                            children: "Thuốc đang dùng"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 297,
                                                            columnNumber: 37
                                                        }, this),
                                                        isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: editData.medications,
                                                            onChange: (e)=>setEditData({
                                                                    ...editData,
                                                                    medications: e.target.value
                                                                }),
                                                            className: inputClass,
                                                            placeholder: "Nhập thuốc đang dùng (nếu có)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 299,
                                                            columnNumber: 41
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "h-8 flex items-center px-2 text-sm font-semibold text-slate-900",
                                                            children: profileData.medications || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EmptyValue, {}, void 0, false, {
                                                                fileName: "[project]/src/app/profile/page.tsx",
                                                                lineNumber: 301,
                                                                columnNumber: 148
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 301,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                    lineNumber: 296,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-xl bg-purple-50/60 px-3 py-2 transition hover:bg-purple-50",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "mb-0.5 block text-xs font-medium text-slate-500",
                                                            children: "Bệnh mãn tính"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 306,
                                                            columnNumber: 37
                                                        }, this),
                                                        isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: editData.chronicConditions,
                                                            onChange: (e)=>setEditData({
                                                                    ...editData,
                                                                    chronicConditions: e.target.value
                                                                }),
                                                            className: inputClass,
                                                            placeholder: "Nhập bệnh mãn tính (nếu có)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 308,
                                                            columnNumber: 41
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "h-8 flex items-center px-2 text-sm font-semibold text-slate-900",
                                                            children: profileData.chronicConditions || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EmptyValue, {}, void 0, false, {
                                                                fileName: "[project]/src/app/profile/page.tsx",
                                                                lineNumber: 310,
                                                                columnNumber: 154
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 310,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                    lineNumber: 305,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/profile/page.tsx",
                                            lineNumber: 240,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/profile/page.tsx",
                                    lineNumber: 238,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/profile/page.tsx",
                            lineNumber: 167,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-3 h-full",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-2xl border border-slate-200 bg-white p-5 shadow-soft",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "mb-3 font-semibold text-slate-900",
                                            children: "Hành động nhanh"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/profile/page.tsx",
                                            lineNumber: 322,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/appointments",
                                                    className: "flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm text-slate-700 transition hover:border-dermcare hover:bg-dermcare/5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xl",
                                                            children: "📅"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 328,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Đặt lịch khám"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 329,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                    lineNumber: 324,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/medical-records",
                                                    className: "flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm text-slate-700 transition hover:border-dermcare hover:bg-dermcare/5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xl",
                                                            children: "📋"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 335,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Hồ sơ y tế"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 336,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                    lineNumber: 331,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/chat",
                                                    className: "flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm text-slate-700 transition hover:border-dermcare hover:bg-dermcare/5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xl",
                                                            children: "🤖"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 342,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Chat với DARA AI"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 343,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                    lineNumber: 338,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/profile/page.tsx",
                                            lineNumber: 323,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/profile/page.tsx",
                                    lineNumber: 321,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-2xl border border-slate-200 bg-gradient-to-br from-dermcare-light to-white p-5 shadow-soft flex-1 flex flex-col justify-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "mb-3 font-semibold text-slate-900",
                                            children: "Thống kê tài khoản"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/profile/page.tsx",
                                            lineNumber: 350,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm text-slate-600",
                                                            children: "Lượt khám"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 353,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-lg font-bold text-dermcare",
                                                            children: "12"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 354,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                    lineNumber: 352,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm text-slate-600",
                                                            children: "Hồ sơ y tế"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 357,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-lg font-bold text-dermcare",
                                                            children: "8"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 358,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                    lineNumber: 356,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm text-slate-600",
                                                            children: "Bác sĩ theo dõi"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 361,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-lg font-bold text-dermcare",
                                                            children: "3"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 362,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                    lineNumber: 360,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/profile/page.tsx",
                                            lineNumber: 351,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/profile/page.tsx",
                                    lineNumber: 349,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/profile/page.tsx",
                            lineNumber: 319,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/profile/page.tsx",
                    lineNumber: 165,
                    columnNumber: 17
                }, this),
                isDoctor && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$DoctorAppointments$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/src/app/profile/page.tsx",
                        lineNumber: 373,
                        columnNumber: 25
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/profile/page.tsx",
                    lineNumber: 372,
                    columnNumber: 21
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/profile/page.tsx",
            lineNumber: 128,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/profile/page.tsx",
        lineNumber: 127,
        columnNumber: 9
    }, this);
}
}),
];

//# sourceMappingURL=src_b8337bca._.js.map