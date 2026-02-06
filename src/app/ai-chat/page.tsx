"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Message {
    id: string;
    text: string;
    sender: "user" | "ai";
    timestamp: Date;
}

const DARA_RESPONSES = [
    "Chào bạn! Tôi là DARA - Trợ lý AI của Dermcare. Tôi có thể giúp gì cho bạn hôm nay?",
    "Để tư vấn tốt hơn, bạn có thể mô tả triệu chứng hoặc gửi hình ảnh vùng da đang gặp vấn đề không?",
    "Dựa trên mô tả của bạn, tình trạng này có thể là viêm da hoặc dị ứng. Tôi khuyên bạn nên đặt lịch với bác sĩ da liễu để được thẩm định chính xác.",
    "Bạn đã từng gặp tình trạng này trước đây chưa? Có sử dụng sản phẩm chăm sóc da mới nào không?",
    "Tôi hiểu. Để chẩn đoán chính xác hơn, bạn có thể upload hình ảnh hoặc đặt lịch video call với bác sĩ chuyên khoa của chúng tôi.",
    "Cảm ơn bạn đã tin tưởng Dermcare! Nếu cần hỗ trợ gì thêm, tôi luôn ở đây.",
];

export default function AIChat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "Chào bạn! Tôi là DARA - Dermcare Artificial Intelligence Recognition Assistant. Tôi có thể giúp bạn:\n\n💬 Tư vấn về các vấn đề da liễu\n🎯 Chẩn đoán sơ bộ bằng AI\n👨‍⚕️ Kết nối với bác sĩ chuyên khoa\n\nBạn đang gặp vấn đề gì về da?",
            sender: "ai",
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const randomResponse =
                DARA_RESPONSES[Math.floor(Math.random() * DARA_RESPONSES.length)];
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: randomResponse,
                sender: "ai",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);
            setIsTyping(false);
        }, 1500);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
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
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-dermcare to-dermcare-dark text-2xl text-white">
                                🤖
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-slate-900">DARA</h1>
                                <p className="text-xs text-slate-500">
                                    Trợ lý AI • 24/7
                                </p>
                            </div>
                        </div>
                    </div>
                    <Link
                        href="/doctors"
                        className="rounded-full bg-dermcare px-4 py-2 text-sm font-semibold text-white transition hover:bg-dermcare-dark"
                    >
                        Đặt lịch bác sĩ
                    </Link>
                </div>
            </header>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="mx-auto max-w-4xl space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"
                                }`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.sender === "user"
                                    ? "bg-dermcare text-white"
                                    : "bg-white text-slate-900 shadow-sm"
                                    }`}
                            >
                                {message.sender === "ai" && (
                                    <div className="mb-1 flex items-center gap-2">
                                        <span className="text-sm font-semibold text-dermcare">
                                            DARA
                                        </span>
                                    </div>
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
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="max-w-[80%] rounded-2xl bg-white px-4 py-3 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-dermcare">
                                        DARA
                                    </span>
                                    <span className="text-slate-400">đang nhập</span>
                                </div>
                                <div className="mt-1 flex gap-1">
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]"></span>
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]"></span>
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400"></span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Box */}
            <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg">
                <div className="mx-auto max-w-4xl">
                    <div className="flex gap-3">
                        <button className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50">
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </button>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Nhập tin nhắn của bạn..."
                            className="flex-1 rounded-full border border-slate-200 px-6 py-3 outline-none transition focus:border-dermcare focus:ring-2 focus:ring-dermcare/20"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputValue.trim()}
                            className="flex h-12 w-12 items-center justify-center rounded-full bg-dermcare text-white transition hover:bg-dermcare-dark disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                />
                            </svg>
                        </button>
                    </div>
                    <p className="mt-2 text-center text-xs text-slate-500">
                        DARA sử dụng AI để tư vấn. Vui lòng tham khảo bác sĩ để chẩn đoán chính xác.
                    </p>
                </div>
            </div>
        </div>
    );
}
