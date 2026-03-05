"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { getDoctorsBySpecialization, DoctorResult } from "@/services/chatService";

// ============================
// Hardcoded Test Config
// ============================
const HARDCODED_DISEASE = "Viêm da cơ địa";
const HARDCODED_SPECIALIZATION = "da liễu";

interface Message {
    id: string;
    text: string;
    sender: "user" | "ai";
    timestamp: Date;
    showSuggestDoctorBtn?: boolean;
}

// ============================
// Fake simulated diagnosis flow
// ============================
const CONVERSATION_FLOW: string[] = [
    `Cảm ơn bạn đã chia sẻ 🙏 Dựa trên mô tả và hình ảnh bạn cung cấp, tôi đang phân tích...`,
    `✅ **Kết quả chẩn đoán sơ bộ:**\n\n🔍 Tình trạng: **${HARDCODED_DISEASE}**\n\nĐây là tình trạng viêm mãn tính của da, thường gây ngứa ngáy, đỏ và bong tróc. Bạn nên gặp bác sĩ **Da liễu** để được thăm khám và điều trị đúng phác đồ.`,
];

export default function AIChat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            text: "Xin chào 👋 Tôi là **DARA** - Trợ lý AI của Dermcare.\n\nĐể nhận kết quả chẩn đoán, bạn hãy:\n📸 **Tải ảnh** vùng da đang bị bệnh.\n✍️ **Mô tả triệu chứng** bạn đang gặp phải.\n\nTôi sẽ phân tích và đưa ra gợi ý phù hợp!\n\n**Lưu ý:** Kết quả chẩn đoán sơ bộ chỉ là số liệu tham khảo. Nếu không chắc chắn về tình trạng bệnh, xin hãy vui lòng đặt lịch khám với bác sĩ để được tư vấn chuẩn nhất.",
            sender: "ai",
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [flowStep, setFlowStep] = useState(0);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Doctor suggestion state
    const [doctors, setDoctors] = useState<DoctorResult[]>([]);
    const [isFetchingDoctors, setIsFetchingDoctors] = useState(false);
    const [showDoctors, setShowDoctors] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, doctors]);

    const addAiMessage = (text: string, showSuggestDoctorBtn = false) => {
        const aiMsg: Message = {
            id: Date.now().toString(),
            text,
            sender: "ai",
            timestamp: new Date(),
            showSuggestDoctorBtn,
        };
        setMessages((prev) => [...prev, aiMsg]);
    };

    const handleSend = () => {
        if (!inputValue.trim() && !imagePreview) return;

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            text: imagePreview ? `[Hình ảnh đính kèm] ${inputValue}` : inputValue,
            sender: "user",
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setImagePreview(null);
        setIsTyping(true);

        // Simulate AI response following the flow
        const currentStep = flowStep;
        setTimeout(() => {
            if (currentStep < CONVERSATION_FLOW.length) {
                const isLastStep = currentStep === CONVERSATION_FLOW.length - 1;
                addAiMessage(CONVERSATION_FLOW[currentStep], isLastStep);
                setFlowStep((prev) => prev + 1);
            } else {
                addAiMessage(
                    "Bạn có muốn tôi hỗ trợ thêm gì không? Bạn cũng có thể đặt lịch với bác sĩ da liễu để được khám trực tiếp."
                );
            }
            setIsTyping(false);
        }, 1500);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setImagePreview(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSuggestDoctors = async () => {
        setIsFetchingDoctors(true);
        setShowDoctors(false);
        setFetchError(null);
        try {
            const result = await getDoctorsBySpecialization(HARDCODED_SPECIALIZATION);
            setDoctors(result);
            setShowDoctors(true);
        } catch (err: any) {
            setFetchError("Không thể tải danh sách bác sĩ. Vui lòng thử lại.");
            console.error(err);
        } finally {
            setIsFetchingDoctors(false);
        }
    };

    return (
        <div className="flex h-screen flex-col bg-slate-50">
            {/* Header */}
            <header className="border-b border-slate-200 bg-white px-4 py-4 shadow-sm">
                <div className="mx-auto flex max-w-4xl items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-dermcare text-xl text-white"
                        >
                            ←
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-dermcare to-dermcare-dark text-2xl text-white shadow-md">
                                🤖
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-slate-900">DARA</h1>
                                <p className="text-xs text-slate-500">Trợ lý AI Da liễu • 24/7</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                            🧪 Chế độ test
                        </span>
                        <Link
                            href="/doctors"
                            className="rounded-full bg-dermcare px-4 py-2 text-sm font-semibold text-white transition hover:bg-dermcare-dark"
                        >
                            Đặt lịch bác sĩ
                        </Link>
                    </div>
                </div>
            </header>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="mx-auto max-w-4xl space-y-4">

                    {/* Test Info Banner */}
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        <span className="font-semibold">🧪 Chế độ test:</span>{" "}
                        Bệnh cứng là <strong>{HARDCODED_DISEASE}</strong> • Chuyên khoa:{" "}
                        <strong>{HARDCODED_SPECIALIZATION}</strong>. Gửi bất kỳ tin nhắn nào để bắt đầu flow.
                    </div>

                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                            {message.sender === "ai" && (
                                <div className="mr-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-dermcare to-dermcare-dark text-sm">
                                    🤖
                                </div>
                            )}
                            <div className="max-w-[78%]">
                                <div
                                    className={`rounded-2xl px-4 py-3 ${message.sender === "user"
                                        ? "bg-dermcare text-white"
                                        : "bg-white text-slate-900 shadow-sm border border-slate-100"
                                        }`}
                                >
                                    {message.sender === "ai" && (
                                        <span className="mb-1 block text-xs font-semibold text-dermcare">DARA</span>
                                    )}
                                    <p className="whitespace-pre-line text-sm leading-relaxed">
                                        {message.text}
                                    </p>
                                    <p
                                        className={`mt-1 text-xs ${message.sender === "user"
                                            ? "text-dermcare-light"
                                            : "text-slate-400"
                                            }`}
                                    >
                                        {message.timestamp.toLocaleTimeString("vi-VN", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>

                                {/* Suggest Doctors Button – hiển thị sau khi chẩn đoán xong */}
                                {message.showSuggestDoctorBtn && (
                                    <div className="mt-3">
                                        <button
                                            onClick={handleSuggestDoctors}
                                            disabled={isFetchingDoctors}
                                            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-dermcare to-dermcare-dark px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            {isFetchingDoctors ? (
                                                <>
                                                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                    </svg>
                                                    Đang tải bác sĩ...
                                                </>
                                            ) : (
                                                <>👨‍⚕️ Gợi ý bác sĩ theo chuyên khoa</>
                                            )}
                                        </button>
                                        {fetchError && (
                                            <p className="mt-2 text-xs text-red-500">{fetchError}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="mr-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-dermcare to-dermcare-dark text-sm">
                                🤖
                            </div>
                            <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
                                <span className="mb-1 block text-xs font-semibold text-dermcare">DARA</span>
                                <div className="flex gap-1">
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-dermcare [animation-delay:-0.3s]" />
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-dermcare [animation-delay:-0.15s]" />
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-dermcare" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Doctor List Results */}
                    {showDoctors && doctors.length > 0 && (
                        <div className="rounded-2xl border border-dermcare/20 bg-white p-4 shadow-sm">
                            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
                                <span>👨‍⚕️</span>
                                <span>Bác sĩ {HARDCODED_SPECIALIZATION} gợi ý ({doctors.length})</span>
                            </h3>
                            <div className="space-y-3">
                                {doctors.map((doc) => (
                                    <div
                                        key={doc.userId}
                                        className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 transition hover:bg-slate-100"
                                    >
                                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-dermcare/20 to-dermcare-dark/20 text-xl font-bold text-dermcare">
                                            {doc.avatar ? (
                                                <img
                                                    src={doc.avatar}
                                                    alt={doc.fullName}
                                                    className="h-12 w-12 rounded-full object-cover"
                                                />
                                            ) : (
                                                doc.fullName.charAt(0)
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="truncate text-sm font-semibold text-slate-900">
                                                {doc.fullName || "Chưa cập nhật tên"}
                                            </p>
                                            <p className="text-xs text-slate-500">{doc.specialization}</p>
                                            {doc.workPlace && (
                                                <p className="truncate text-xs text-slate-400">🏥 {doc.workPlace}</p>
                                            )}
                                        </div>
                                        <div className="flex flex-shrink-0 flex-col items-end gap-1">
                                            <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-600">
                                                ⭐ {doc.rating ?? "N/A"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-3 text-center text-xs text-slate-400">
                                Gọi API <code className="text-dermcare">/conversations/doctors?specialization={HARDCODED_SPECIALIZATION}</code>
                            </p>
                        </div>
                    )}

                    {showDoctors && doctors.length === 0 && (
                        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-500">
                            Không tìm thấy bác sĩ nào với chuyên khoa <strong>{HARDCODED_SPECIALIZATION}</strong>.
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Image Preview */}
            {imagePreview && (
                <div className="border-t border-slate-200 bg-white px-4 pt-3">
                    <div className="relative mx-auto max-w-4xl">
                        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-2 pr-10">
                            <img src={imagePreview} alt="Preview" className="h-14 w-14 rounded-lg object-cover" />
                            <span className="text-sm text-slate-600">Ảnh đã chọn</span>
                        </div>
                        <button
                            onClick={() => setImagePreview(null)}
                            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 text-slate-600 hover:bg-slate-400"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {/* Input Box */}
            <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg">
                <div className="mx-auto max-w-4xl">
                    <div className="flex gap-3">
                        {/* Upload image button */}
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageSelect}
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            title="Tải ảnh lên"
                            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-dermcare hover:bg-dermcare/10 hover:text-dermcare"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </button>

                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Mô tả triệu chứng của bạn..."
                            className="flex-1 rounded-full border border-slate-200 px-6 py-3 text-sm outline-none transition focus:border-dermcare focus:ring-2 focus:ring-dermcare/20"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputValue.trim() && !imagePreview}
                            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-dermcare text-white transition hover:bg-dermcare-dark disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                    <p className="mt-2 text-center text-xs text-slate-400">
                        DARA sử dụng AI để tư vấn sơ bộ. Vui lòng gặp bác sĩ để chẩn đoán chính xác.
                    </p>
                </div>
            </div>
        </div>
    );
}
