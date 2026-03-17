"use client";

import { useState, useEffect } from "react";
import { getAvailableDoctorSchedule } from "@/services/scheduleService";
import { bookAppointment } from "@/services/appointmentService";
import { createMomoPayment, createZaloPayment, checkPaymentTimeout } from "@/services/paymentService";
import { useAuth } from "@/contexts/AuthContext";

interface TimeSlot {
    time: string;
    available: boolean;
    price?: number;
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
        id: string;
        name: string;
        specialty: string;
        avatar: string;
        qualifications?: string;
    };
    conversationId?: string;
    initialDate?: string;
    initialTime?: string;
    initialPrice?: number;
}

export default function BookingModal({ isOpen, onClose, doctor, conversationId, initialDate, initialTime, initialPrice }: BookingModalProps) {
    const { user } = useAuth();
    const PAYMENT_TIMEOUT = {
        momo: 6000,  // 100 phút (MoMo Sandbox default)
        zalo: 1200,  // 20 phút (ZaloPay default)
    };

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [createdAppointmentId, setCreatedAppointmentId] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<"momo" | "zalo">("momo");
    const [timeLeft, setTimeLeft] = useState<number>(PAYMENT_TIMEOUT.momo);
    const [selectedDate, setSelectedDate] = useState<string>(initialDate || "");
    const [selectedTime, setSelectedTime] = useState<string>(initialTime || "");
    const [formData, setFormData] = useState({
        fullName: user?.fullName || "",
        phone: user?.phone || "",
        email: user?.email || "",
        notes: ""
    });

    const [schedule, setSchedule] = useState<DaySchedule[]>([]);

    const selectedSlotOption = schedule.find(d => d.date === selectedDate)?.slots.find(s => s.time === selectedTime);
    const consultationPrice = initialPrice || selectedSlotOption?.price || 250000; // Ưu tiên initialPrice từ prop
    const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
    const [isBooking, setIsBooking] = useState(false);

    // Reset đếm ngược khi đổi phương thức thanh toán
    useEffect(() => {
        setTimeLeft(PAYMENT_TIMEOUT[paymentMethod]);
    }, [paymentMethod]);

    useEffect(() => {
        if (!isOpen) return;
        const fetchSchedule = async () => {

            setIsLoadingSchedule(true);
            try {
                const data = await getAvailableDoctorSchedule(doctor.id);
                const grouped: Record<string, DaySchedule> = {};

                // Initialize 7 days starting from today to ensure they show up in UI
                const today = new Date();
                for (let i = 0; i < 7; i++) {
                    const nextDay = new Date(today);
                    nextDay.setDate(today.getDate() + i);

                    const year = nextDay.getFullYear();
                    const month = String(nextDay.getMonth() + 1).padStart(2, '0');
                    const day = String(nextDay.getDate()).padStart(2, '0');
                    const dateStr = `${year}-${month}-${day}`;

                    const dayOfWeek = nextDay.toLocaleDateString('vi-VN', { weekday: 'long' });

                    grouped[dateStr] = {
                        date: dateStr,
                        dayOfWeek,
                        slots: []
                    };
                }

                data.forEach((slot: any) => {
                    const d = slot.availableDate;
                    if (grouped[d]) {
                        grouped[d].slots.push({
                            time: slot.startTime,
                            available: !slot.isBooked,
                            price: slot.price
                        });
                    }
                });

                const scheduleArray = Object.values(grouped).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                setSchedule(scheduleArray);
            } catch (error) {
                console.error("Failed to fetch schedule", error);
            } finally {
                setIsLoadingSchedule(false);
            }
        };
        fetchSchedule();
    }, [isOpen, doctor.id]);

    const handleNextStep = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 2) {
            setShowConfirm(true);
        } else if (step === 3) {
            if (paymentMethod === 'momo' && createdAppointmentId) {
                try {
                    const res = await createMomoPayment(createdAppointmentId);
                    if (res && res.payUrl) {
                        window.location.href = res.payUrl;
                    } else {
                        console.error('Lỗi PayUrl Momo trả về bị rỗng:', res);
                        alert(`MoMo lỗi Cấu Hình (Missing URL): ${JSON.stringify(res)}`);
                    }
                } catch (error: any) {
                    console.error("Payment Momo Exception:", error?.response?.data || error);
                    alert(`Lỗi API Thanh toán: ${error?.response?.data?.message || error.message || 'Không xác định'}`);
                }
            } else if (paymentMethod === 'zalo' && createdAppointmentId) {
                try {
                    const res = await createZaloPayment(createdAppointmentId);
                    if (res && res.payUrl) {
                        window.location.href = res.payUrl;
                    } else {
                        alert(`ZaloPay lỗi cấu hình (Missing URL): ${JSON.stringify(res)}`);
                    }
                } catch (error: any) {
                    console.error('Payment ZaloPay Exception:', error?.response?.data || error);
                    alert(`Lỗi ZaloPay: ${error?.response?.data?.message || error.message || 'Không xác định'}`);
                }
            }
        }
    };

    const handleConfirmBooking = async () => {
        setIsBooking(true);
        try {
            const result: any = await bookAppointment(doctor.id, {
                appointmentDate: selectedDate,
                appointmentTime: selectedTime,
                conversationId: conversationId,
            });

            // Backend trả về: res.customSuccess(200, '...', booking);
            // Frontend apiClient axios return res.data
            const appointment = result.data || result;
            if (appointment && appointment.id) {
                setCreatedAppointmentId(appointment.id);
            }

            setShowConfirm(false);
            setShowSuccess(true);
        } catch (error: any) {
            console.error("Booking error", error);
            alert(error?.response?.data?.message || "Lỗi đặt lịch, vui lòng thử lại.");
            setShowConfirm(false);
        } finally {
            setIsBooking(false);
        }
    };

    const handleContinueToPayment = () => {
        setShowSuccess(false);
        setStep(3); // Chuyển sang bước thanh toán sau khi đặt lịch thành công
    };

    // Reset data when closing modal or reopen
    useEffect(() => {
        if (!isOpen) {
            setStep(1);
            setCreatedAppointmentId(null);
            setShowSuccess(false);
            setShowConfirm(false);
            setTimeLeft(300);
        } else if (initialDate && initialTime) {
            setSelectedDate(initialDate);
            setSelectedTime(initialTime);
            setStep(2);
            // Pre-fill user data if available
            if (user) {
                setFormData(prev => ({
                    ...prev,
                    fullName: user.fullName || prev.fullName,
                    phone: user.phone || prev.phone,
                    email: user.email || prev.email
                }));
            }
        }
    }, [isOpen, initialDate, initialTime, user]);

    // Timer Countdown for Step 3
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (step === 3 && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (step === 3 && timeLeft === 0 && createdAppointmentId) {
            // Hết giờ
            const handleTimeout = async () => {
                await checkPaymentTimeout(createdAppointmentId);
                alert("Đã hết thời gian thanh toán (5 phút). Lịch khám đã bị hủy. Vui lòng đặt lại.");
                // Tạm thời bỏ onClose() để user xem form báo lỗi test thanh toán
                // onClose(); 
            };
            handleTimeout();
        }
        return () => clearInterval(timer);
    }, [step, timeLeft, createdAppointmentId, onClose]);

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
                                {isLoadingSchedule ? (
                                    <div className="py-8 text-center text-sm text-slate-500">Đang tải lịch khám...</div>
                                ) : schedule.length === 0 ? (
                                    <div className="py-8 text-center text-sm text-slate-500">Bác sĩ chưa có lịch trống nào trong thời gian tới.</div>
                                ) : (
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
                                                    {day.slots.length > 0 ? (
                                                        day.slots.map((slot) => (
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
                                                        ))
                                                    ) : (
                                                        <span className="text-sm italic text-slate-400 py-1">Bác sĩ chưa có lịch khám vào ngày này</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                                <div className="flex items-center justify-between mb-4 font-semibold text-slate-900">
                                    <h3>Phương thức thanh toán</h3>
                                    <span className="text-red-500 font-bold bg-red-50 px-3 py-1 rounded-full text-sm">
                                        Thời gian còn lại: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                                    </span>
                                </div>
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
                                            <img
                                                src="https://developers.momo.vn/v3/assets/images/MOMO-Logo-App-6262c3743a290ef02396a24ea2b66c35.png"
                                                alt="MoMo"
                                                className="h-10 w-10 rounded-full object-contain"
                                            />
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
                                            <div className="h-10 w-10 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8">
                                                    <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white" fontFamily="Arial">ZLP</text>
                                                </svg>
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
                                disabled={isBooking}
                                onClick={handleConfirmBooking}
                                className="flex-1 rounded-lg bg-dermcare px-4 py-2.5 font-semibold text-white shadow-soft hover:bg-dermcare-dark transition disabled:opacity-50"
                            >
                                {isBooking ? 'Đang xử lý...' : 'Đồng ý'}
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
