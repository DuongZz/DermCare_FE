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
    };
}

export default function BookingModal({ isOpen, onClose, doctor }: BookingModalProps) {
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [bookingType, setBookingType] = useState<"online" | "offline">("online");
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        reason: "",
        notes: ""
    });

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle booking submission
        console.log({
            doctor: doctor.name,
            date: selectedDate,
            time: selectedTime,
            type: bookingType,
            ...formData
        });
        // TODO: API call
        alert("Đặt lịch thành công!");
        onClose();
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
                                    {doctor.name} • {doctor.specialty}
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
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Booking Type */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Hình thức khám
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setBookingType("online")}
                                    className={`rounded-lg border-2 p-4 text-left transition ${bookingType === "online"
                                            ? "border-dermcare bg-dermcare/5"
                                            : "border-slate-200 hover:border-slate-300"
                                        }`}
                                >
                                    <div className="mb-1 text-2xl">💻</div>
                                    <div className="font-semibold text-slate-900">Khám trực tuyến</div>
                                    <div className="text-xs text-slate-600">Video call qua ứng dụng</div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setBookingType("offline")}
                                    className={`rounded-lg border-2 p-4 text-left transition ${bookingType === "offline"
                                            ? "border-dermcare bg-dermcare/5"
                                            : "border-slate-200 hover:border-slate-300"
                                        }`}
                                >
                                    <div className="mb-1 text-2xl">🏥</div>
                                    <div className="font-semibold text-slate-900">Khám tại phòng</div>
                                    <div className="text-xs text-slate-600">Đến trực tiếp phòng khám</div>
                                </button>
                            </div>
                        </div>

                        {/* Schedule Selection */}
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
                                        <div className="grid grid-cols-4 gap-2 md:grid-cols-8">
                                            {day.slots.map((slot) => (
                                                <button
                                                    key={`${day.date}-${slot.time}`}
                                                    type="button"
                                                    disabled={!slot.available}
                                                    onClick={() => {
                                                        setSelectedDate(day.date);
                                                        setSelectedTime(slot.time);
                                                    }}
                                                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${selectedDate === day.date && selectedTime === slot.time
                                                            ? "border-dermcare bg-dermcare text-white"
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

                        {/* Patient Information */}
                        <div className="border-t border-slate-200 pt-6">
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
                                        className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-dermcare focus:outline-none focus:ring-2 focus:ring-dermcare/20"
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
                                        className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-dermcare focus:outline-none focus:ring-2 focus:ring-dermcare/20"
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
                                        className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-dermcare focus:outline-none focus:ring-2 focus:ring-dermcare/20"
                                        placeholder="Nhập email (tùy chọn)"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="mb-1 block text-sm font-medium text-slate-700">
                                        Lý do khám <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.reason}
                                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                        className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-dermcare focus:outline-none focus:ring-2 focus:ring-dermcare/20"
                                        placeholder="VD: Mụn trứng cá, viêm da..."
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="mb-1 block text-sm font-medium text-slate-700">
                                        Ghi chú thêm
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-dermcare focus:outline-none focus:ring-2 focus:ring-dermcare/20"
                                        placeholder="Triệu chứng, thời gian bị, tiền sử bệnh..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex gap-3 border-t border-slate-200 pt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50 transition"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={!selectedDate || !selectedTime}
                                className="flex-1 rounded-lg bg-dermcare px-6 py-3 font-semibold text-white shadow-soft hover:bg-dermcare-dark transition disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Xác nhận đặt lịch
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
