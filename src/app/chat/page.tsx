"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
    id: string;
    type: "user" | "ai";
    text: string;
    image?: string;
    timestamp: Date;
}

export default function ChatPage() {
    const { isLoggedIn } = useAuth();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            type: "ai",
            text: "Xin chào! Tôi là DARA - trợ lý AI chuyên về da liễu. Bạn có thể mô tả triệu chứng hoặc upload ảnh vùng da cần tư vấn để tôi giúp bạn!",
            timestamp: new Date(),
        },
    ]);
    const [inputText, setInputText] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Mock conversation history
    const [conversations] = useState([
        { id: "1", title: "Tư vấn nốt đỏ trên má", date: "Hôm nay", active: true },
        { id: "2", title: "Hỏi về kem trị mụn", date: "Hôm qua", active: false },
        { id: "3", title: "Da khô và ngứa", date: "2 ngày trước", active: false },
        { id: "4", title: "Tư vấn về vết thâm", date: "3 ngày trước", active: false },
    ]);

    // Handle image selection
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle sending message
    const handleSendMessage = async () => {
        if (!inputText.trim() && !selectedImage) return;

        // Create user message
        const userMessage: Message = {
            id: Date.now().toString(),
            type: "user",
            text: inputText,
            image: selectedImage || undefined,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputText("");
        setSelectedImage(null);
        setIsLoading(true);

        // Simulate AI response
        setTimeout(() => {
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: "ai",
                text: "Cảm ơn bạn đã chia sẻ thông tin. Dựa trên triệu chứng và hình ảnh bạn cung cấp, tôi nhận thấy đây có thể là biểu hiện của viêm da. Tuy nhiên, để có chẩn đoán chính xác, tôi khuyên bạn nên đặt lịch khám với bác sĩ da liễu chuyên khoa.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);
            setIsLoading(false);
        }, 2000);
    };

    // Handle key press
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="fixed inset-0 flex bg-slate-50">
            {/* Sidebar - Chat History */}
            <div className={`${showSidebar ? "w-72" : "w-0"} border-r border-slate-200 bg-white transition-all duration-300 overflow-hidden`}>
                <div className="flex h-full flex-col">
                    {/* Sidebar Header */}
                    <div className="border-b border-slate-200 p-4">
                        <button className="w-full rounded-xl border-2 border-dermcare bg-dermcare/5 px-4 py-3 text-sm font-semibold text-dermcare transition hover:bg-dermcare hover:text-white">
                            ➕ Cuộc hội thoại mới
                        </button>
                    </div>

                    {/* Conversation List */}
                    <div className="flex-1 overflow-y-auto p-3">
                        <p className="mb-2 px-3 text-xs font-semibold text-slate-500">LỊCH SỬ HỘI THOẠI</p>
                        <div className="space-y-1">
                            {conversations.map((conv) => (
                                <button
                                    key={conv.id}
                                    className={`w-full rounded-lg px-3 py-3 text-left transition ${conv.active
                                        ? "bg-dermcare/10 border border-dermcare/20"
                                        : "hover:bg-slate-50"
                                        }`}
                                >
                                    <p className={`text-sm font-medium ${conv.active ? "text-dermcare" : "text-slate-900"}`}>
                                        {conv.title}
                                    </p>
                                    <p className="mt-0.5 text-xs text-slate-500">{conv.date}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar Footer */}
                    <div className="border-t border-slate-200 p-4">
                        <div className="text-xs text-slate-500">
                            <p className="mb-1">💡 Mẹo sử dụng:</p>
                            <p>• Upload ảnh rõ nét</p>
                            <p>• Mô tả chi tiết triệu chứng</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex flex-1 flex-col">{/* Header */}
                <div className="border-b border-slate-200 bg-white px-4 py-4 shadow-sm">
                    <div className="mx-auto flex max-w-7xl items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setShowSidebar(!showSidebar)}
                                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-50"
                                title="Toggle sidebar"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <Link
                                href="/"
                                className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:border-slate-300"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                <span>Quay lại</span>
                            </Link>
                            <div className="h-8 w-px bg-slate-300" />
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-dermcare to-dermcare-dark text-2xl text-white shadow-soft">
                                    🤖
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold text-slate-900">DARA AI</h1>
                                    <p className="text-xs text-slate-500">Trợ lý da liễu thông minh • 24/7</p>
                                </div>
                            </div>
                        </div>
                        <Link
                            href="/doctors"
                            className="rounded-lg bg-dermcare px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-dermcare-dark"
                        >
                            Đặt lịch bác sĩ
                        </Link>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-4 py-6">
                    <div className="mx-auto max-w-5xl space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.type === "user"
                                        ? "bg-dermcare text-white"
                                        : "bg-white border border-slate-200 text-slate-900"
                                        }`}
                                >
                                    {message.image && (
                                        <div className="mb-2 overflow-hidden rounded-lg">
                                            <img
                                                src={message.image}
                                                alt="Uploaded"
                                                className="h-auto w-full max-w-sm"
                                            />
                                        </div>
                                    )}
                                    {message.text && (
                                        <p className="whitespace-pre-wrap text-sm">{message.text}</p>
                                    )}
                                    <p
                                        className={`mt-1 text-xs ${message.type === "user" ? "text-dermcare-light" : "text-slate-500"
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

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-[80%] rounded-2xl border border-slate-200 bg-white px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 animate-bounce rounded-full bg-dermcare"></div>
                                        <div
                                            className="h-2 w-2 animate-bounce rounded-full bg-dermcare"
                                            style={{ animationDelay: "0.2s" }}
                                        ></div>
                                        <div
                                            className="h-2 w-2 animate-bounce rounded-full bg-dermcare"
                                            style={{ animationDelay: "0.4s" }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Input Area */}
                <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg">
                    <div className="mx-auto max-w-5xl">
                        {/* Image Preview */}
                        {selectedImage && (
                            <div className="mb-3 flex items-start gap-2">
                                <div className="relative">
                                    <img
                                        src={selectedImage}
                                        alt="Preview"
                                        className="h-20 w-20 rounded-lg border border-slate-200 object-cover"
                                    />
                                    <button
                                        onClick={() => setSelectedImage(null)}
                                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white hover:bg-red-600"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <p className="text-sm text-slate-600">
                                    Ảnh đã chọn - Nhấn gửi để tải lên
                                </p>
                            </div>
                        )}
                        {/* Input Box */}
                        <div className="flex items-start gap-3">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageSelect}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border-2 border-slate-300 bg-white text-xl text-slate-600 transition hover:border-dermcare hover:bg-dermcare/5"
                                title="Upload ảnh"
                            >
                                📷
                            </button>
                            <div className="flex-1">
                                <textarea
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Mô tả triệu chứng của bạn..."
                                    rows={1}
                                    className="w-full resize-none rounded-xl border-2 border-slate-300 px-4 py-3 text-sm transition focus:border-dermcare focus:outline-none focus:ring-2 focus:ring-dermcare/20"
                                />
                            </div>
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputText.trim() && !selectedImage}
                                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-dermcare text-xl text-white shadow-soft transition hover:bg-dermcare-dark disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                            >
                                ➤
                            </button>
                        </div>

                        <p className="mt-2 text-center text-xs text-slate-500">
                            💡 Bạn có thể upload ảnh và mô tả triệu chứng để được tư vấn chính xác hơn
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

