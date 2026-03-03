"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { getAccessToken } from "@/lib/tokenStore";
import {
    createAiConversation,
    getConversations,
    getConversationMessages,
    getDoctorsBySpecialization,
    getPublicDoctorSchedule,
    Conversation,
    ConversationMessage,
    DoctorResult,
    DoctorSchedule,
} from "@/services/chatService";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/v1\/?$/, "") || "http://localhost:4000";

export default function ChatPage() {
    const { isLoggedIn, user: currentUser } = useAuth();
    const router = useRouter();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<ConversationMessage[]>([]);
    const [inputText, setInputText] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);

    // Doctor suggestion state
    const [doctors, setDoctors] = useState<DoctorResult[]>([]);
    const [isFetchingDoctors, setIsFetchingDoctors] = useState(false);
    const [showDoctors, setShowDoctors] = useState(false);
    const [fetchDoctorsError, setFetchDoctorsError] = useState<string | null>(null);
    const [isLoadingConversations, setIsLoadingConversations] = useState(true);
    const [bookingDoctorId, setBookingDoctorId] = useState<string | null>(null);
    const [doctorSchedules, setDoctorSchedules] = useState<Record<string, DoctorSchedule[]>>({});
    const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<Socket | null>(null);

    // Redirect về login nếu chưa đăng nhập
    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/login?redirect=/chat");
        }
    }, [isLoggedIn, router]);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Kết nối Socket.io sau khi đã đăng nhập
    useEffect(() => {
        if (!isLoggedIn) return;

        // Lấy token từ in-memory store (AuthContext dùng cookie + tokenStore, không lưu localStorage)
        const token = getAccessToken();
        console.log("[Chat] isLoggedIn:", isLoggedIn);
        console.log("[Chat] getAccessToken():", token ? `OK (${token.substring(0, 20)}...)` : "NULL - no token!");
        console.log("[Chat] BACKEND_URL:", BACKEND_URL);
        if (!token) {
            console.warn("[Chat] No access token found, cannot connect socket");
            return;
        }

        const socket = io(BACKEND_URL, {
            auth: { token },
            transports: ["polling", "websocket"],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
        });

        socket.on("connect", () => {
            setIsConnected(true);
            console.log("[Chat] ✅ Socket connected! ID:", socket.id);
        });

        socket.on("connect_error", (err) => {
            console.error("[Chat] ❌ Socket connect_error:", err.message, err);
        });

        socket.on("disconnect", (reason) => {
            setIsConnected(false);
            console.log("[Chat] Socket disconnected. Reason:", reason);
        });

        // Nhận tin nhắn mới từ server
        socket.on("new_message", (msg: ConversationMessage) => {
            setMessages((prev) => {
                // 1. Kiểm tra theo ID thực (từ DB)
                if (prev.find((m) => m.id === msg.id)) return prev;

                // 2. Chống trùng với tin nhắn optimistic (cùng content, cùng senderId, và mới gửi gần đây)
                // Chúng ta sẽ thay thế tin nhắn optimistic bằng tin nhắn thực từ server
                const optimisticIndex = prev.findIndex(m =>
                    m.id.startsWith("temp-") &&
                    m.content === msg.content &&
                    !m.isAiMessage
                );

                if (optimisticIndex !== -1) {
                    const newMessages = [...prev];
                    newMessages[optimisticIndex] = msg; // Ghi đè tin nhắn tạm bằng tin nhắn thật
                    return newMessages;
                }

                return [...prev, msg];
            });
            setIsLoading(false);
        });

        socket.on("error", (err: { message: string }) => {
            console.error("[Socket error]", err.message);
            setIsLoading(false);
        });

        socketRef.current = socket;

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, []);

    // Tải danh sách conversations khi mở trang
    useEffect(() => {
        if (!isLoggedIn) return;

        const loadConversations = async () => {
            try {
                const data = await getConversations();
                setConversations(data || []);
                // Tự động mở conversation đầu tiên nếu có
                if (data && data.length > 0) {
                    handleSelectConversation(data[0]);
                }
            } catch (err) {
                console.error("Failed to load conversations:", err);
            } finally {
                setIsLoadingConversations(false);
            }
        };

        loadConversations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn]);

    // Chọn vào 1 conversation → join socket room + load messages
    const handleSelectConversation = async (conv: Conversation) => {
        // Rời room cũ
        if (activeConversation && socketRef.current) {
            socketRef.current.emit("leave_conversation", activeConversation.id);
        }

        setActiveConversation(conv);
        setMessages([]);
        setIsLoading(true);

        try {
            const msgs = await getConversationMessages(conv.id);
            if (!msgs || msgs.length === 0) {
                // Nếu hội thoại trống, thêm tin nhắn chào mừng của DARA
                const welcomeMsg: ConversationMessage = {
                    id: `welcome-${Date.now()}`,
                    isAiMessage: true,
                    content: "Xin chào! 👋 Tôi là **DARA** - Trợ lý AI của Dermcare. Để nhận kết quả chẩn đoán, bạn hãy: 📸 **Tải ảnh** vùng da đang bị bệnh và ✍️ **Mô tả triệu chứng** bạn đang gặp phải. Tôi sẽ phân tích và gợi ý bác sĩ chuyên khoa phù hợp nhất cho bạn!",
                    type: "text",
                    sender: { id: "dara", fullName: "DARA AI", role: "AI" },
                    created_at: new Date().toISOString(),
                    timestamp: Date.now(),
                    conversationId: conv.id
                };
                setMessages([welcomeMsg]);
            } else {
                setMessages(msgs);
            }
        } catch {
            setMessages([]);
        } finally {
            setIsLoading(false);
        }

        // Join socket room
        if (socketRef.current) {
            socketRef.current.emit("join_conversation", conv.id);
        }
    };

    // Tạo cuộc hội thoại mới với AI
    const handleNewConversation = async () => {
        try {
            const newConv = await createAiConversation();
            setConversations((prev) => {
                if (prev.find((c) => c.id === newConv.id)) return prev;
                return [newConv, ...prev];
            });
            handleSelectConversation(newConv);
        } catch (err) {
            console.error("Failed to create ai conversation:", err);
        }
    };

    // Upload ảnh
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

    // Gửi tin nhắn qua Socket
    const handleSendMessage = async () => {
        if (!inputText.trim() && !selectedImage) return;
        if (!activeConversation || !socketRef.current) return;

        setIsLoading(true);
        const content = inputText.trim();
        setInputText("");
        setSelectedImage(null);

        // Optimistic update: Thêm tin nhắn của mình vào UI ngay lập tức
        const myMessage: ConversationMessage = {
            id: `temp-${Date.now()}`,
            content,
            type: "text",
            isAiMessage: false,
            conversationId: activeConversation.id,
            created_at: new Date().toISOString(),
            timestamp: Date.now(),
            sender: currentUser ? {
                id: String(currentUser.id),
                fullName: currentUser.fullName,
                role: currentUser.role
            } : { id: "me", fullName: "Me", role: "PATIENT" }
        };
        setMessages(prev => [...prev, myMessage]);

        socketRef.current.emit("send_message", {
            conversationId: activeConversation.id,
            content,
        });

        // GIẢ LẬP FLOW CHẨN ĐOÁN CHO USER TEST
        if (selectedImage || content.length > 0) {
            setTimeout(() => {
                const diagnosisMsg: ConversationMessage = {
                    id: `diag-${Date.now()}`,
                    isAiMessage: true,
                    content: "Dựa trên hình ảnh và triệu chứng bạn cung cấp, tôi nhận thấy có dấu hiệu của **Viêm da cơ địa**. Đây là một bệnh lý da liễu phổ biến. Bạn hãy bấm nút **Tìm bác sĩ phù hợp** để đặt lịch khám với bác sĩ có cùng chuyên khoa với loại bệnh bạn đang gặp.",
                    type: "text",
                    sender: { id: "dara", fullName: "DARA AI", role: "AI" },
                    created_at: new Date().toISOString(),
                    timestamp: Date.now(),
                    conversationId: activeConversation.id
                };
                setMessages(prev => [...prev, diagnosisMsg]);

                // Cập nhật diagnosisInfo để hiện nút gợi ý bác sĩ
                setActiveConversation(prev => prev ? {
                    ...prev,
                    diagnosisInfo: {
                        disease: "Viêm da cơ địa",
                        specialization: "da liễu"
                    }
                } : null);
                setIsLoading(false);
            }, 1500);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Gợi ý bác sĩ theo chuyên khoa dựa trên diagnosisInfo
    const handleSuggestDoctors = async () => {
        if (!activeConversation?.diagnosisInfo?.specialization) return;

        setIsFetchingDoctors(true);
        setFetchDoctorsError(null);
        try {
            const data = await getDoctorsBySpecialization(activeConversation.diagnosisInfo.specialization);
            setDoctors(data);
            setShowDoctors(true);
        } catch (err) {
            console.error("Failed to fetch doctors:", err);
            setFetchDoctorsError("Không thể lấy danh sách bác sĩ. Vui lòng thử lại.");
        } finally {
            setIsFetchingDoctors(false);
        }
    };

    const handleBookAppointment = async (doctorId: string) => {
        // Nếu đang hiện lịch của đúng bác sĩ này rồi thì đóng lại
        if (bookingDoctorId === doctorId) {
            setBookingDoctorId(null);
            return;
        }

        setBookingDoctorId(doctorId);
        setIsLoadingSchedule(true);
        try {
            const schedules = await getPublicDoctorSchedule(doctorId);

            // Nhóm lịch khám theo ngày
            const grouped: Record<string, DoctorSchedule[]> = {};
            schedules.forEach(slot => {
                const dateKey = slot.date;
                if (!grouped[dateKey]) {
                    grouped[dateKey] = [];
                }
                grouped[dateKey].push(slot);
            });

            // Sắp xếp các slot trong mỗi ngày theo giờ bắt đầu
            Object.keys(grouped).forEach(date => {
                grouped[date].sort((a, b) => a.startTime.localeCompare(b.startTime));
            });

            setDoctorSchedules(grouped);
        } catch (err) {
            console.error("Failed to fetch doctor schedule:", err);
            alert("Không thể lấy lịch khám của bác sĩ.");
            setBookingDoctorId(null);
        } finally {
            setIsLoadingSchedule(false);
        }
    };

    const handleSelectSlot = (slot: DoctorSchedule) => {
        alert(`Bạn đã chọn khung giờ ${slot.startTime} ngày ${slot.date}. (Chức năng tạo đơn đặt lịch sẽ được triển khai ở bước tiếp theo)`);
    };

    const formatTime = (dateStr: string | number) => {
        return new Date(dateStr).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return "Hôm nay";
        if (date.toDateString() === yesterday.toDateString()) return "Hôm qua";
        return date.toLocaleDateString("vi-VN");
    };

    return (
        <div className="fixed inset-0 flex bg-slate-50">
            {/* Sidebar - Chat History */}
            <div className={`${showSidebar ? "w-72" : "w-0"} border-r border-slate-200 bg-white transition-all duration-300 overflow-hidden flex-shrink-0`}>
                <div className="flex h-full flex-col">
                    {/* Sidebar Header */}
                    <div className="border-b border-slate-200 p-4">
                        <button
                            onClick={handleNewConversation}
                            className="w-full rounded-xl border-2 border-dermcare bg-dermcare/5 px-4 py-3 text-sm font-semibold text-dermcare transition hover:bg-dermcare hover:text-white"
                        >
                            ➕ Cuộc hội thoại mới
                        </button>
                    </div>

                    {/* Conversation List */}
                    <div className="flex-1 overflow-y-auto p-3">
                        <p className="mb-2 px-3 text-xs font-semibold text-slate-500">LỊCH SỬ HỘI THOẠI</p>
                        {isLoadingConversations ? (
                            <div className="flex justify-center py-8">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-dermcare border-t-transparent" />
                            </div>
                        ) : conversations.length === 0 ? (
                            <p className="px-3 text-sm text-slate-400">Chưa có cuộc hội thoại nào</p>
                        ) : (
                            <div className="space-y-1">
                                {conversations.map((conv) => {
                                    const isActive = activeConversation?.id === conv.id;
                                    return (
                                        <button
                                            key={conv.id}
                                            onClick={() => handleSelectConversation(conv)}
                                            className={`w-full rounded-lg px-3 py-3 text-left transition ${isActive
                                                ? "bg-dermcare/10 border border-dermcare/20"
                                                : "hover:bg-slate-50"
                                                }`}
                                        >
                                            <p className={`text-sm font-medium truncate ${isActive ? "text-dermcare" : "text-slate-900"}`}>
                                                {conv.lastMessage || "Cuộc hội thoại mới"}
                                            </p>
                                            <p className="mt-0.5 text-xs text-slate-500">{formatDate(conv.updated_at)}</p>
                                            <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${conv.status === "AI_CONSULTING"
                                                ? "bg-blue-100 text-blue-700"
                                                : conv.status === "DOCTOR_CONSULTING"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-slate-100 text-slate-600"
                                                }`}>
                                                {conv.status === "AI_CONSULTING" ? "🤖 AI tư vấn"
                                                    : conv.status === "DOCTOR_CONSULTING" ? "👨‍⚕️ Bác sĩ khám"
                                                        : "✅ Hoàn thành"}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Sidebar Footer */}
                    <div className="border-t border-slate-200 p-4">
                        <div className="text-xs text-slate-500">
                            <div className={`flex items-center gap-1.5 mb-1 ${isConnected ? "text-green-600" : "text-red-500"}`}>
                                <span className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-400"}`} />
                                {isConnected ? "Trực tuyến" : isLoggedIn ? "Mất kết nối" : "Chưa đăng nhập"}
                            </div>
                            <p>💡 Mô tả chi tiết triệu chứng để được tư vấn chính xác</p>
                            <p>💡 Đảm bảo ảnh rõ nét, chất lượng tốt nhất</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex flex-1 flex-col min-w-0">
                {/* Header */}
                <div className="border-b border-slate-200 bg-white px-4 py-4 shadow-sm flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setShowSidebar(!showSidebar)}
                                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-50"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <Link href="/" className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Quay lại
                            </Link>
                            <div className="h-8 w-px bg-slate-300" />
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-dermcare to-dermcare-dark text-2xl text-white shadow-soft">
                                    🤖
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold text-slate-900">DARA AI</h1>
                                    <p className="text-xs text-slate-500">
                                        {activeConversation
                                            ? activeConversation.status === "DOCTOR_CONSULTING"
                                                ? "👨‍⚕️ Bác sĩ đang tham gia"
                                                : "Trợ lý da liễu thông minh • 24/7"
                                            : "Trợ lý da liễu thông minh • 24/7"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-4 py-6">
                    {!activeConversation ? (
                        <div className="flex h-full flex-col items-center justify-center text-center">
                            <div className="mb-4 text-6xl">🤖</div>
                            <h2 className="mb-2 text-xl font-bold text-slate-900">Chào mừng đến với DARA AI</h2>
                            <p className="mb-6 text-sm text-slate-500">Mô tả triệu chứng hoặc upload ảnh vùng da để được tư vấn</p>
                            <button
                                onClick={handleNewConversation}
                                className="rounded-xl bg-dermcare px-6 py-3 font-semibold text-white transition hover:bg-dermcare-dark"
                            >
                                Bắt đầu tư vấn
                            </button>
                        </div>
                    ) : (
                        <div className="mx-auto max-w-5xl space-y-4">
                            {messages.map((message) => {
                                // Logic căn lề: 
                                // - Nếu là AI -> Bên trái
                                // - Nếu là người khác gửi (bác sĩ) -> Bên trái
                                // - Nếu là chính mình (currentUser.id == sender.id) -> Bên phải
                                const isCurrentUser = currentUser && message.sender && String(message.sender.id) === String(currentUser.id);
                                const isAdminOrDoctor = !message.isAiMessage && !isCurrentUser;
                                return (
                                    <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                                        {!isCurrentUser && (
                                            <div className="mr-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-dermcare to-dermcare-dark text-sm text-white">
                                                {message.isAiMessage ? "🤖" : "👨‍⚕️"}
                                            </div>
                                        )}
                                        <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${isCurrentUser
                                            ? "bg-dermcare text-white"
                                            : "bg-white border border-slate-200 text-slate-900"
                                            }`}>
                                            {!isCurrentUser && (
                                                <p className="mb-1 text-xs font-semibold text-dermcare">
                                                    {message.isAiMessage ? "DARA AI" : message.sender?.fullName || "Bác sĩ"}
                                                </p>
                                            )}
                                            <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                                            <p className={`mt-1 text-xs ${isCurrentUser ? "text-dermcare-light" : "text-slate-500"}`}>
                                                {formatTime(message.timestamp || message.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="mr-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-dermcare to-dermcare-dark text-sm text-white">
                                        🤖
                                    </div>
                                    <div className="max-w-[75%] rounded-2xl border border-slate-200 bg-white px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 animate-bounce rounded-full bg-dermcare" />
                                            <div className="h-2 w-2 animate-bounce rounded-full bg-dermcare" style={{ animationDelay: "0.2s" }} />
                                            <div className="h-2 w-2 animate-bounce rounded-full bg-dermcare" style={{ animationDelay: "0.4s" }} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />

                            {/* Nút gợi ý bác sĩ – hiện khi diagnosisInfo có dữ liệu */}
                            {activeConversation?.diagnosisInfo && (
                                <div className="flex flex-col items-center gap-3 pt-2">
                                    <button
                                        onClick={handleSuggestDoctors}
                                        disabled={isFetchingDoctors}
                                        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-dermcare to-dermcare-dark px-10 py-3 text-base font-semibold text-white shadow-lg transition hover:shadow-xl hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {isFetchingDoctors ? (
                                            <>
                                                <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Đang tìm bác sĩ chuyên khoa...
                                            </>
                                        ) : (
                                            <>🔍 Tìm bác sĩ phù hợp</>
                                        )}
                                    </button>
                                    {fetchDoctorsError && (
                                        <p className="text-xs text-red-500">{fetchDoctorsError}</p>
                                    )}

                                    {/* Danh sách bác sĩ */}
                                    {showDoctors && (
                                        <div className="w-full rounded-2xl border border-dermcare/20 bg-white p-4 shadow-sm">
                                            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
                                                👨‍⚕️ Bác sĩ gợi ý ({doctors.length})
                                            </h3>
                                            {doctors.length === 0 ? (
                                                <p className="text-center text-sm text-slate-400">Không tìm thấy bác sĩ phù hợp.</p>
                                            ) : (
                                                <div className="space-y-2">
                                                    {doctors.map((doc) => (
                                                        <div key={doc.userId} className="space-y-2">
                                                            <div
                                                                className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 transition hover:bg-slate-100"
                                                            >
                                                                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-dermcare/20 to-dermcare-dark/20 text-lg font-bold text-dermcare overflow-hidden">
                                                                    {doc.avatar ? (
                                                                        <img src={doc.avatar} alt={doc.fullName} className="h-11 w-11 rounded-full object-cover" />
                                                                    ) : (
                                                                        doc.fullName?.charAt(0) || "?"
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="truncate text-sm font-semibold text-slate-900">
                                                                        {doc.fullName || "Chưa cập nhật"}
                                                                    </p>
                                                                    <p className="text-xs text-slate-500">{doc.specialization}</p>
                                                                    {doc.workPlace && (
                                                                        <p className="truncate text-xs text-slate-400">🏥 {doc.workPlace}</p>
                                                                    )}
                                                                </div>
                                                                <div className="flex flex-col items-end gap-2">
                                                                    <span className="flex-shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-600">
                                                                        ⭐ {doc.rating ?? "N/A"}
                                                                    </span>
                                                                    <button
                                                                        onClick={() => handleBookAppointment(doc.userId)}
                                                                        className={`rounded-lg px-3 py-1.5 text-xs font-bold text-white transition ${bookingDoctorId === doc.userId ? 'bg-slate-500' : 'bg-dermcare hover:bg-dermcare-dark'}`}
                                                                    >
                                                                        {bookingDoctorId === doc.userId ? 'Đóng' : '📅 Đặt lịch'}
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {/* Doctor Schedule Display */}
                                                            {bookingDoctorId === doc.userId && (
                                                                <div className="mt-1 animate-in fade-in slide-in-from-top-2 duration-300 border-t border-slate-100 pt-3">
                                                                    {isLoadingSchedule ? (
                                                                        <div className="flex items-center justify-center py-4">
                                                                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-dermcare border-t-transparent"></div>
                                                                            <span className="ml-2 text-xs text-slate-500">Đang tải lịch khám...</span>
                                                                        </div>
                                                                    ) : Object.keys(doctorSchedules).length === 0 ? (
                                                                        <p className="py-2 text-center text-xs italic text-slate-400">Bác sĩ chưa có lịch khám trống.</p>
                                                                    ) : (
                                                                        <div className="space-y-3">
                                                                            {Object.keys(doctorSchedules).sort().map(date => (
                                                                                <div key={date}>
                                                                                    <p className="mb-1.5 text-[11px] font-bold text-slate-500 uppercase">
                                                                                        📅 {new Date(date).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' })}
                                                                                    </p>
                                                                                    <div className="flex flex-wrap gap-1.5">
                                                                                        {doctorSchedules[date].map(slot => (
                                                                                            <button
                                                                                                key={slot.id}
                                                                                                disabled={slot.isBooked}
                                                                                                onClick={() => handleSelectSlot(slot)}
                                                                                                className={`rounded-md border px-2.5 py-1 text-xs transition duration-200 ${slot.isBooked
                                                                                                    ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                                                                                                    : 'bg-white border-slate-200 text-slate-700 hover:border-dermcare hover:text-dermcare hover:bg-dermcare/5 active:scale-95'
                                                                                                    }`}
                                                                                            >
                                                                                                {slot.startTime}
                                                                                            </button>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Input Area */}
                {activeConversation && (
                    <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg flex-shrink-0">
                        <div className="mx-auto max-w-5xl">
                            {selectedImage && (
                                <div className="mb-3 flex items-start gap-2">
                                    <div className="relative">
                                        <img src={selectedImage} alt="Preview" className="h-20 w-20 rounded-lg border border-slate-200 object-cover" />
                                        <button
                                            onClick={() => setSelectedImage(null)}
                                            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white hover:bg-red-600"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <p className="text-sm text-slate-600">Ảnh đã chọn</p>
                                </div>
                            )}
                            <div className="flex items-start gap-3">
                                <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
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
                                        onKeyDown={handleKeyPress}
                                        placeholder="Mô tả triệu chứng của bạn..."
                                        rows={1}
                                        className="w-full resize-none rounded-xl border-2 border-slate-300 px-4 py-3 text-sm transition focus:border-dermcare focus:outline-none focus:ring-2 focus:ring-dermcare/20"
                                    />
                                </div>
                                <button
                                    onClick={handleSendMessage}
                                    disabled={(!inputText.trim() && !selectedImage) || isLoading}
                                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-dermcare text-xl text-white shadow-soft transition hover:bg-dermcare-dark disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    ➤
                                </button>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}
