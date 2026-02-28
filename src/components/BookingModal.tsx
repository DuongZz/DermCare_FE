"use client";

import { useState } from "react";

interface TimeSlot {
    time: string;
    available: boolean;
}

interface DaySchedule {
    date: string;
    dayOfWeek: string;
    slots: TimeSlot[];
}

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    doctor: {
        name: string;
        specialty: string;
        avatar: string;
        qualifications?: string;
    };
}

export default function BookingModal({ isOpen, onClose, doctor }: BookingModalProps) {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<"momo" | "zalo">("momo");
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        notes: ""
    });
    const consultationPrice = 200000; // Giá mặc định


    // Mock schedule data - next 7 days
    const generateSchedule = (): DaySchedule[] => {
        const schedule: DaySchedule[] = [];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            const dayOfWeek = date.toLocaleDateString('vi-VN', { weekday: 'long' });
            const dateStr = date.toISOString().split('T')[0];

            const slots: TimeSlot[] = [
                { time: "08:00", available: Math.random() > 0.3 },
                { time: "09:00", available: Math.random() > 0.3 },
                { time: "10:00", available: Math.random() > 0.3 },
                { time: "11:00", available: Math.random() > 0.3 },
                { time: "14:00", available: Math.random() > 0.3 },
                { time: "15:00", available: Math.random() > 0.3 },
                { time: "16:00", available: Math.random() > 0.3 },
                { time: "17:00", available: Math.random() > 0.3 }
            ];

            schedule.push({ date: dateStr, dayOfWeek, slots });
        }

        return schedule;
    };

    const [schedule] = useState(generateSchedule());

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 2) {
            // Mở popup xác nhận thay vì window.confirm
            setShowConfirm(true);
        } else if (step === 3) {
            // Handle final payment submission
            console.log("Processing Payment:", {
                paymentMethod,
                amount: consultationPrice
            });
            // TODO: Gọi API xử lý thanh toán
            alert("Đang chuyển hướng đến cổng thanh toán...");
            onClose();
            setTimeout(() => setStep(1), 300); // Reset after close animation
        }
    };

    const handleConfirmBooking = () => {
        setShowConfirm(false);
        // Handle initial booking submission
        console.log("Creating Booking:", {
            doctor: doctor.name,
            date: selectedDate,
            time: selectedTime,
            ...formData
        });

        // TODO: Gọi API tạo lịch hẹn tại đây
        // Thay thế alert bằng custom modal success
        setShowSuccess(true);
    };

    const handleContinueToPayment = () => {
        setShowSuccess(false);
        setStep(3); // Chuyển sang bước thanh toán sau khi đặt lịch thành công
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-xl">
                {/* Header */}
                <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <img
                                src={doctor.avatar}
                                alt={doctor.name}
                                className="h-12 w-12 rounded-full object-cover"
                            />
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Đặt lịch khám</h2>
                                <p className="text-sm text-slate-600">
                                    {doctor.qualifications ? `${doctor.qualifications} ${doctor.name}` : doctor.name} • {doctor.specialty}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <form onSubmit={handleNextStep} className="space-y-6">
                        {/* Step 1: Schedule Selection */}
                        {step === 1 && (
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Chọn ngày và giờ
                                </label>
                                <div className="space-y-3">
                                    {schedule.map((day) => (
                                        <div
                                            key={day.date}
                                            className="rounded-lg border border-slate-200 p-4"
                                        >
                                            <div className="mb-3 font-semibold text-slate-900">
                                                {day.dayOfWeek}, {new Date(day.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                            </div>
                                            {/* Use flex-wrap to show all slots across multiple rows if needed */}
                                            <div className="flex flex-wrap gap-2">
                                                {day.slots.map((slot) => (
                                                    <button
                                                        key={`${day.date}-${slot.time}`}
                                                        type="button"
                                                        disabled={!slot.available}
                                                        onClick={() => {
                                                            setSelectedDate(day.date);
                                                            setSelectedTime(slot.time);
                                                            setStep(2);
                                                        }}
                                                        className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${selectedDate === day.date && selectedTime === slot.time
                                                            ? "border-dermcare bg-dermcare text-white shadow-sm"
                                                            : slot.available
                                                                ? "border-slate-200 bg-white text-slate-700 hover:border-dermcare hover:bg-dermcare/5"
                                                                : "border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed"
                                                            }`}
                                                    >
                                                        {slot.time}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Patient Information */}
                        {step === 2 && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <h3 className="mb-4 font-semibold text-slate-900">Thông tin bệnh nhân</h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-700">
                                            Họ và tên <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-dermcare focus:outline-none focus:ring-2 focus:ring-dermcare/20 pointer-events-auto"
                                            placeholder="Nhập họ tên"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-700">
                                            Số điện thoại <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-dermcare focus:outline-none focus:ring-2 focus:ring-dermcare/20 pointer-events-auto"
                                            placeholder="Nhập số điện thoại"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="mb-1 block text-sm font-medium text-slate-700">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-dermcare focus:outline-none focus:ring-2 focus:ring-dermcare/20 pointer-events-auto"
                                            placeholder="Nhập email (tùy chọn)"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="mb-1 block text-sm font-medium text-slate-700">
                                            Chi phí khám
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                disabled
                                                value={`${consultationPrice.toLocaleString('vi-VN')} VNĐ`}
                                                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 font-semibold text-dermcare cursor-not-allowed pointer-events-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="mb-1 block text-sm font-medium text-slate-700">
                                            Ghi chú thêm
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-dermcare focus:outline-none focus:ring-2 focus:ring-dermcare/20 pointer-events-auto"
                                            placeholder="Triệu chứng, thời gian bị, tiền sử bệnh..."
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Payment Method */}
                        {step === 3 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="mb-4 font-semibold text-slate-900">Phương thức thanh toán</h3>
                                <div className="space-y-3">
                                    {/* MoMo */}
                                    <label
                                        className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition ${paymentMethod === 'momo'
                                            ? 'border-pink-500 bg-pink-50'
                                            : 'border-slate-200 hover:border-pink-200'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="momo"
                                            checked={paymentMethod === 'momo'}
                                            onChange={() => setPaymentMethod('momo')}
                                            className="h-5 w-5 border-slate-300 text-pink-500 focus:ring-pink-500"
                                        />
                                        <div className="flex flex-1 items-center justify-between">
                                            <div className="font-semibold text-slate-900">Ví MoMo</div>
                                            <div className="h-8 w-8 rounded bg-pink-500 flex items-center justify-center text-white font-bold text-xs">
                                                MoMo
                                            </div>
                                        </div>
                                    </label>

                                    {/* ZaloPay */}
                                    <label
                                        className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition ${paymentMethod === 'zalo'
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-slate-200 hover:border-blue-200'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="zalo"
                                            checked={paymentMethod === 'zalo'}
                                            onChange={() => setPaymentMethod('zalo')}
                                            className="h-5 w-5 border-slate-300 text-blue-500 focus:ring-blue-500"
                                        />
                                        <div className="flex flex-1 items-center justify-between">
                                            <div className="font-semibold text-slate-900">ZaloPay</div>
                                            <div className="h-8 w-8 rounded bg-blue-500 flex items-center justify-center text-white font-bold text-[10px]">
                                                ZaloPay
                                            </div>
                                        </div>
                                    </label>
                                </div>
                                <div className="mt-6 rounded-lg bg-orange-50 p-4 text-sm text-orange-800 border border-orange-100">
                                    <strong>Lưu ý:</strong> Vui lòng thanh toán phí khám <strong>{consultationPrice.toLocaleString('vi-VN')} VNĐ</strong> để hoàn tất xác nhận lịch hẹn.
                                </div>
                            </div>
                        )}

                        {/* Submit / Navigation */}
                        <div className="flex gap-3 border-t border-slate-200 pt-6">
                            {step === 2 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="flex-1 rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50 transition"
                                    >
                                        Quay lại
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 rounded-lg bg-dermcare px-6 py-3 font-semibold text-white shadow-soft hover:bg-dermcare-dark transition"
                                    >
                                        Xác nhận đặt lịch
                                    </button>
                                </>
                            )}

                            {step === 3 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50 transition"
                                    >
                                        Bỏ qua
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white shadow-soft hover:bg-emerald-700 transition"
                                    >
                                        Thanh toán ngay
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {/* Custom Confirm Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mx-auto">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-center text-lg font-bold text-slate-900">
                            Xác nhận đặt lịch
                        </h3>
                        <p className="mb-6 text-center text-sm text-slate-600">
                            Bạn có chắc chắn muốn đặt lịch khám với <strong className="text-slate-900">{doctor.qualifications ? `${doctor.qualifications} ` : ''}{doctor.name}</strong> vào lúc <strong className="text-slate-900">{selectedTime}</strong> ngày <strong className="text-slate-900">{new Date(selectedDate).toLocaleDateString('vi-VN')}</strong> không?
                        </p>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-50 transition"
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmBooking}
                                className="flex-1 rounded-lg bg-dermcare px-4 py-2.5 font-semibold text-white shadow-soft hover:bg-dermcare-dark transition"
                            >
                                Đồng ý
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mx-auto">
                            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-center text-xl font-bold text-slate-900">
                            Đặt lịch thành công!
                        </h3>
                        <p className="mb-6 text-center text-sm text-slate-600">
                            Lịch hẹn của bạn đã được ghi nhận. Vui lòng tiến hành thanh toán để hoàn tất quá trình đặt khám.
                        </p>
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={handleContinueToPayment}
                                className="w-full rounded-lg bg-dermcare px-4 py-3 font-semibold text-white shadow-soft hover:bg-dermcare-dark transition"
                            >
                                Đến trang Thanh toán
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
