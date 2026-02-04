module.exports = [
"[project]/src/app/doctors/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DoctorsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const SPECIALTIES = [
    {
        id: "all",
        name: "Tất cả"
    },
    {
        id: "viem-da",
        name: "Viêm da"
    },
    {
        id: "mun",
        name: "Mụn trứng cá"
    },
    {
        id: "ung-thu",
        name: "Ung thư da"
    },
    {
        id: "nam-da",
        name: "Nấm da"
    },
    {
        id: "vay-nen",
        name: "Vẩy nến"
    },
    {
        id: "tham-my",
        name: "Thẩm mỹ da"
    },
    {
        id: "nhay-cam",
        name: "Da nhạy cảm"
    }
];
const MOCK_DOCTORS = [
    {
        id: "1",
        name: "BS. Cù Thị Hải Nê",
        specialty: [
            "viem-da",
            "nhay-cam"
        ],
        image: "/yen.jpg",
        rating: 3.6,
        reviewCount: 234,
        experience: 12,
        education: "Đại học Phương Đông",
        hospital: "Bệnh viện Da liễu Trung ương",
        price: "300.000 - 500.000đ",
        availableSlots: 8
    },
    {
        id: "2",
        name: "BS. Đào Quang Yê",
        specialty: [
            "mun",
            "tham-my"
        ],
        image: "/duong.jpg",
        rating: 5.0,
        reviewCount: 189,
        experience: 15,
        education: "Đại học Password",
        hospital: "Phòng khám Da liễu Sài Gòn",
        price: "400.000 - 600.000đ",
        availableSlots: 5
    },
    {
        id: "3",
        name: "TS.BS. Đào Quang Dương",
        specialty: [
            "ung-thu",
            "viem-da"
        ],
        image: "/duongtro.jpg",
        rating: 5.0,
        reviewCount: 312,
        experience: 20,
        education: "Học Viện Kỹ thuật Mật mã",
        hospital: "Bệnh viện Ung bướu TP.HCM",
        price: "500.000 - 800.000đ",
        availableSlots: 3
    },
    {
        id: "4",
        name: "BS. Cao Khuê Béo",
        specialty: [
            "nam-da",
            "viem-da"
        ],
        image: "/khue.jpg",
        rating: 3.8,
        reviewCount: 156,
        experience: 10,
        education: "Đại học Y Nghệ An",
        hospital: "Phòng khám Da liễu Khuê Múp",
        price: "250.000 - 400.000đ",
        availableSlots: 12
    },
    {
        id: "5",
        name: "BS. Tốt Chiến",
        specialty: [
            "vay-nen",
            "nhay-cam"
        ],
        image: "/ganarcho.jpg",
        rating: 0.1,
        reviewCount: 203,
        experience: 14,
        education: "Đại học Y Dược Manchester",
        hospital: "Bệnh viện Da liễu Hà Nội",
        price: "350.000 - 550.000đ",
        availableSlots: 6
    },
    {
        id: "6",
        name: "BS. Đỗ Ngọc Đức",
        specialty: [
            "mun",
            "viem-da"
        ],
        image: "/duc.jpg",
        rating: 1.8,
        reviewCount: 142,
        experience: 8,
        education: "Đại học Y Nem Định",
        hospital: "Phòng khám Hai Ngón",
        price: "300.000 - 450.000đ",
        availableSlots: 35
    },
    {
        id: "7",
        name: "PGS.TS. Phạm Tuấn Hịp",
        specialty: [
            "ung-thu",
            "tham-my"
        ],
        image: "/hiepdan.jpg",
        rating: 3.6,
        reviewCount: 428,
        experience: 25,
        education: "Đại học Y Thanh Hóa, Hà Nội",
        hospital: "Bệnh viện Da liễu Trung ương Ba Sáu",
        price: "600.000 - 1.000.000đ",
        availableSlots: 36
    }
];
function DoctorsPage() {
    const [selectedSpecialty, setSelectedSpecialty] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("all");
    // Filter doctors based on selected specialty
    const filteredDoctors = selectedSpecialty === "all" ? MOCK_DOCTORS : MOCK_DOCTORS.filter((doctor)=>doctor.specialty.includes(selectedSpecialty));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mx-auto max-w-7xl px-4 py-8 md:py-12",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-3xl font-bold text-slate-900 md:text-4xl",
                        children: "Đội ngũ bác sĩ da liễu"
                    }, void 0, false, {
                        fileName: "[project]/src/app/doctors/page.tsx",
                        lineNumber: 142,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-slate-600",
                        children: "Kết nối với các bác sĩ da liễu hàng đầu, được đào tạo chuyên sâu"
                    }, void 0, false, {
                        fileName: "[project]/src/app/doctors/page.tsx",
                        lineNumber: 145,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/doctors/page.tsx",
                lineNumber: 141,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2",
                        children: SPECIALTIES.map((specialty)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setSelectedSpecialty(specialty.id),
                                className: `rounded-full px-4 py-2 text-sm font-medium transition ${selectedSpecialty === specialty.id ? "bg-dermcare text-white shadow-soft" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`,
                                children: specialty.name
                            }, specialty.id, false, {
                                fileName: "[project]/src/app/doctors/page.tsx",
                                lineNumber: 154,
                                columnNumber: 25
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/doctors/page.tsx",
                        lineNumber: 152,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-3 text-sm text-slate-500",
                        children: [
                            "Tìm thấy ",
                            filteredDoctors.length,
                            " bác sĩ"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/doctors/page.tsx",
                        lineNumber: 166,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/doctors/page.tsx",
                lineNumber: 151,
                columnNumber: 13
            }, this),
            filteredDoctors.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3",
                children: filteredDoctors.map((doctor)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card-elevated overflow-hidden transition hover:shadow-lg",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative h-48 bg-gradient-to-br from-dermcare-light to-slate-100",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute inset-0 flex items-center justify-center",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex h-24 w-24 items-center justify-center rounded-full bg-dermcare text-3xl font-bold text-white",
                                        children: doctor.name.charAt(doctor.name.indexOf(" ") + 1)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/doctors/page.tsx",
                                        lineNumber: 182,
                                        columnNumber: 37
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/doctors/page.tsx",
                                    lineNumber: 181,
                                    columnNumber: 33
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/doctors/page.tsx",
                                lineNumber: 180,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-semibold text-slate-900",
                                        children: doctor.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/doctors/page.tsx",
                                        lineNumber: 190,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 text-sm text-slate-600",
                                        children: doctor.hospital
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/doctors/page.tsx",
                                        lineNumber: 193,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-3 flex flex-wrap gap-1.5",
                                        children: doctor.specialty.map((spec)=>{
                                            const specialtyName = SPECIALTIES.find((s)=>s.id === spec)?.name;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "rounded-full bg-dermcare-light px-2.5 py-0.5 text-xs font-medium text-dermcare-dark",
                                                children: specialtyName
                                            }, spec, false, {
                                                fileName: "[project]/src/app/doctors/page.tsx",
                                                lineNumber: 202,
                                                columnNumber: 45
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/doctors/page.tsx",
                                        lineNumber: 196,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-4 flex items-center gap-4 text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-amber-500",
                                                        children: "★"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/doctors/page.tsx",
                                                        lineNumber: 215,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-semibold text-slate-900",
                                                        children: doctor.rating
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/doctors/page.tsx",
                                                        lineNumber: 216,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-slate-500",
                                                        children: [
                                                            "(",
                                                            doctor.reviewCount,
                                                            ")"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/doctors/page.tsx",
                                                        lineNumber: 219,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/doctors/page.tsx",
                                                lineNumber: 214,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-slate-600",
                                                children: [
                                                    doctor.experience,
                                                    " năm KN"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/doctors/page.tsx",
                                                lineNumber: 223,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/doctors/page.tsx",
                                        lineNumber: 213,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-3 space-y-1 text-sm text-slate-600",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: [
                                                    "🎓 ",
                                                    doctor.education
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/doctors/page.tsx",
                                                lineNumber: 230,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-medium text-dermcare",
                                                children: doctor.price
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/doctors/page.tsx",
                                                lineNumber: 231,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/doctors/page.tsx",
                                        lineNumber: 229,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-3 text-sm",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-emerald-600",
                                            children: [
                                                "✓ ",
                                                doctor.availableSlots,
                                                " khung giờ còn trống"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/doctors/page.tsx",
                                            lineNumber: 236,
                                            columnNumber: 37
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/doctors/page.tsx",
                                        lineNumber: 235,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "mt-4 w-full rounded-lg bg-dermcare py-2.5 text-sm font-semibold text-white transition hover:bg-dermcare-dark",
                                        children: "Đặt lịch khám"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/doctors/page.tsx",
                                        lineNumber: 242,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/doctors/page.tsx",
                                lineNumber: 189,
                                columnNumber: 29
                            }, this)
                        ]
                    }, doctor.id, true, {
                        fileName: "[project]/src/app/doctors/page.tsx",
                        lineNumber: 175,
                        columnNumber: 25
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/doctors/page.tsx",
                lineNumber: 173,
                columnNumber: 17
            }, this) : // Empty State
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-lg font-medium text-slate-900",
                            children: "Không tìm thấy bác sĩ"
                        }, void 0, false, {
                            fileName: "[project]/src/app/doctors/page.tsx",
                            lineNumber: 253,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-2 text-sm text-slate-600",
                            children: "Hiện tại chưa có bác sĩ cho chuyên khoa này. Vui lòng chọn chuyên khoa khác."
                        }, void 0, false, {
                            fileName: "[project]/src/app/doctors/page.tsx",
                            lineNumber: 256,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setSelectedSpecialty("all"),
                            className: "mt-4 text-sm font-medium text-dermcare hover:underline",
                            children: "Xem tất cả bác sĩ"
                        }, void 0, false, {
                            fileName: "[project]/src/app/doctors/page.tsx",
                            lineNumber: 260,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/doctors/page.tsx",
                    lineNumber: 252,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/doctors/page.tsx",
                lineNumber: 251,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/doctors/page.tsx",
        lineNumber: 139,
        columnNumber: 9
    }, this);
}
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
];

//# sourceMappingURL=_cb26b237._.js.map