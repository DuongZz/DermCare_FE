"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function PaymentResultPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<"loading" | "success" | "fail">("loading");
    const [message, setMessage] = useState("Đang xử lý kết quả giao dịch...");

    useEffect(() => {
        // === MoMo params ===
        const resultCode = searchParams.get("resultCode");
        const msg = searchParams.get("message");

        // === ZaloPay params ===
        const status = searchParams.get("status");       // 1 = thành công, 0 = thất bại
        const apptransid = searchParams.get("apptransid");

        if (resultCode !== null) {
            // Xử lý kết quả MoMo
            if (resultCode === "0") {
                setStatus("success");
                setMessage(msg || "Thanh toán MoMo thành công. Lịch hẹn của bạn đã được xác nhận.");
            } else {
                setStatus("fail");
                setMessage(msg || "Giao dịch MoMo bị hủy hoặc có lỗi xảy ra.");
            }
        } else if (apptransid !== null) {
            // Xử lý kết quả ZaloPay
            if (status === "1") {
                setStatus("success");
                setMessage("Thanh toán ZaloPay thành công. Lịch hẹn của bạn đã được xác nhận.");
            } else {
                setStatus("fail");
                setMessage("Giao dịch ZaloPay bị hủy hoặc có lỗi xảy ra.");
            }
        } else {
            setStatus("fail");
            setMessage("Không tìm thấy thông tin giao dịch hợp lệ.");
        }
    }, [searchParams]);


    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl text-center">
                {status === "loading" && (
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="h-20 w-20 rounded-full border-4 border-slate-200 border-t-dermcare animate-spin mb-6"></div>
                        <h2 className="text-xl font-bold text-slate-900">Vui lòng chờ...</h2>
                        <p className="mt-2 text-slate-500">{message}</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="animate-in zoom-in duration-300 flex flex-col items-center">
                        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 mb-6 shadow-4xl">
                            <svg className="h-12 w-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold border-b border-slate-100 uppercase pb-4 mb-2 text-emerald-600">Thanh toán thành công</h2>
                        <p className="text-slate-600 mb-8">{message}</p>
                        <div className="flex flex-col gap-3 w-full">
                            <Link href="/user/appointments" className="w-full rounded-xl bg-dermcare px-4 py-3 text-base font-semibold text-white shadow-md hover:bg-dermcare-dark transition-colors">
                                Quản lý Lịch hẹn
                            </Link>
                            <Link href="/" className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors">
                                Trở về Trang chủ
                            </Link>
                        </div>
                    </div>
                )}

                {status === "fail" && (
                    <div className="animate-in fade-in duration-300 flex flex-col items-center">
                        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-100 mb-6 shadow-sm">
                            <svg className="h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold uppercase pb-4 mb-2 text-red-600 border-b border-slate-100">Giao dịch Thất bại</h2>
                        <p className="text-slate-600 mb-8">{message}</p>
                        <div className="flex flex-col gap-3 w-full">
                            <button
                                onClick={() => router.push("/")}
                                className="w-full rounded-xl bg-slate-900 px-4 py-3 text-base font-semibold text-white shadow-md hover:bg-slate-800 transition-colors"
                            >
                                Đặt lại Lịch mới
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
