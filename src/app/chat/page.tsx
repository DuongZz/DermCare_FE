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
    getConversationById,
    deleteConversation,
    getConversationMessages,
    getDoctorsBySpecialization,
    getPublicDoctorSchedule,
    analyzeAiCondition,
    Conversation,
    ConversationMessage,
    DoctorResult,
    DoctorSchedule,
    completeConversation,
} from "@/services/chatService";
import { queryKnowledgeBase } from "@/services/knowledgeService";
import BookingModal from "@/components/BookingModal";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/v1\/?$/, "") || "http://localhost:4000";

const WELCOME_MESSAGE_CONTENT = `Xin chào 👋 Tôi là **DARA** - Trợ lý AI của Dermcare.

Để nhận kết quả chẩn đoán, bạn hãy:
📸 **Tải ảnh** vùng da đang bị bệnh.
✍️ **Mô tả triệu chứng** bạn đang gặp phải.

Tôi sẽ phân tích và đưa ra gợi ý phù hợp!

**Lưu ý:** Kết quả chẩn đoán sơ bộ chỉ là số liệu tham khảo. Nếu không chắc chắn về tình trạng bệnh, xin hãy vui lòng đặt lịch khám với bác sĩ để được tư vấn chuẩn nhất.`;

export default function ChatPage() {
    const { isLoggedIn, user: currentUser } = useAuth();
    const router = useRouter();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<ConversationMessage[]>([]);
    const [inputText, setInputText] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);

    // Doctor suggestion state
    const [doctors, setDoctors] = useState<DoctorResult[]>([]);
    const [isFetchingDoctors, setIsFetchingDoctors] = useState(false);
    const [showDoctors, setShowDoctors] = useState(false);
    const [fetchDoctorsError, setFetchDoctorsError] = useState<string | null>(null);
    const [isLoadingConversations, setIsLoadingConversations] = useState(true);
    const [bookingDoctorId, setBookingDoctorId] = useState<string | null>(null);
    const [doctorSchedules, setDoctorSchedules] = useState<Record<string, DoctorSchedule[]>>({});
    const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
    const [aiStatus, setAiStatus] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>("DOCTOR_CONSULTING");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalConversations, setTotalConversations] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [chatMode, setChatMode] = useState<"diagnosis" | "knowledge">("diagnosis");

    // Booking Modal State
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<DoctorSchedule | null>(null);

    const isDoctor = currentUser?.role === "DOCTOR";

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
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "auto", block: "end" });
        }
    }, []);

    useEffect(() => {
        // Cuộn ngay lập tức
        scrollToBottom();
        // Cuộn chậm 1 nhịp để chờ DOM vẽ xong hoặc ảnh load xong (nếu có)
        const timeoutId = setTimeout(() => {
            scrollToBottom();
        }, 150);
        return () => clearTimeout(timeoutId);
    }, [messages, activeConversation, scrollToBottom]);

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
                // Với ảnh, content gốc của optimistic là blob URL cục bộ, còn content từ server là URL thật.
                // Do đó, ta ưu tiên check loại "image" hoặc khớp text nội dung.
                const optimisticIndex = prev.findIndex(m =>
                    m.id.startsWith("temp-") &&
                    !m.isAiMessage &&
                    (
                        (m.type === "text" && m.content === msg.content) ||
                        (m.type === "image" && msg.type === "image")
                    )
                );

                if (optimisticIndex !== -1) {
                    const newMessages = [...prev];
                    const optimisticMsg = prev[optimisticIndex];

                    // Giữ lại clientId để React không re-render làm giật hình
                    // Đối với ảnh, giữ lại blob URL cục bộ để không bị chớp màn hình khi đổi sang URL online
                    newMessages[optimisticIndex] = {
                        ...msg,
                        clientId: optimisticMsg.clientId || optimisticMsg.id,
                        content: (msg.type === 'image' && optimisticMsg.content.startsWith('blob:')) ? optimisticMsg.content : msg.content
                    };
                    return newMessages;
                }

                return [...prev, msg];
            });

            setAiStatus((currentAiStatus) => {
                if (currentAiStatus && !msg.isAiMessage) {
                    // Đang chờ AI phân tích, tin nhắn này chỉ là tin nhắn của mình vọng về từ server -> Không tắt loading
                    return currentAiStatus;
                }

                // Nếu nhận được tin của AI hoặc đang chat bình thường với bác sĩ -> Tắt loading
                setIsLoading(false);
                return null;
            });
        });

        socket.on("conversation_updated", (data: { id: string; status: string; title: string }) => {
            console.log("[Chat] Conversation updated:", data);
            setActiveConversation(prev => {
                if (prev && prev.id === data.id) {
                    return { ...prev, status: data.status as any, title: data.title };
                }
                return prev;
            });
            setConversations(prev => prev.map(c =>
                c.id === data.id ? { ...c, status: data.status as any, title: data.title } : c
            ));
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

    // Chọn vào 1 conversation → join socket room + load messages
    const handleSelectConversation = useCallback(async (conv: Conversation) => {
        // Rời room cũ
        if (activeConversation && socketRef.current) {
            socketRef.current.emit("leave_conversation", activeConversation.id);
        }

        setActiveConversation(conv);
        setMessages([]);
        setIsLoading(true);

        try {
            console.log("[Chat] Fetching messages for:", conv.id);
            const msgs = await getConversationMessages(conv.id);
            console.log("[Chat] Messages received (count):", msgs?.length);
            
            if (!msgs || msgs.length === 0) {
                console.log("[Chat] No messages found, applying fallback welcome message.");
                // Nếu hội thoại trống, thêm tin nhắn chào mừng của DARA
                const welcomeMsg: ConversationMessage = {
                    id: `welcome-${Date.now()}`,
                    isAiMessage: true,
                    content: WELCOME_MESSAGE_CONTENT,
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
        } catch (err) {
            console.error("[Chat] Error loading messages:", err);
            setMessages([]);
        } finally {
            setIsLoading(false);
        }

        // Join socket room
        if (socketRef.current) {
            socketRef.current.emit("join_conversation", conv.id);
        }
    }, [activeConversation]);

    const loadConversations = useCallback(async (status: string, page: number = 1, append: boolean = false) => {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const targetId = urlParams.get('id');

            // Nếu lần đầu load và có ID trên URL, ta cần biết STATUS của nó để chuyển tab tương ứng
            if (page === 1 && targetId && !append) {
                try {
                    const targetConv = await getConversationById(targetId);
                    if (targetConv && targetConv.status !== status) {
                        console.log("[Chat] Auto-switching tab to:", targetConv.status);
                        setActiveTab(targetConv.status);
                        // Khi setActiveTab chạy, useEffect sẽ gọi lại loadConversations với status mới
                        return;
                    }
                } catch (err) {
                    console.error("[Chat] Failed to fetch target conversation metadata:", err);
                }
            }

            if (page === 1) setIsLoadingConversations(true);
            const result = await getConversations(status, page);
            
            if (append) {
                setConversations(prev => [...prev, ...result.conversations]);
            } else {
                setConversations(result.conversations);
            }
            
            setTotalConversations(result.total);
            setHasMore(result.conversations.length === 5 && (page * 5) < result.total);
            setCurrentPage(page);

            // Kiểm tra xem có ID hội thoại trên URL không (chỉ làm ở lần load đầu tiên)
            if (page === 1) {
                const urlParams = new URLSearchParams(window.location.search);
                const targetId = urlParams.get('id');

                if (result.conversations.length > 0) {
                    if (targetId) {
                        const targetConv = result.conversations.find(c => c.id === targetId);
                        if (targetConv) {
                            handleSelectConversation(targetConv);
                        } else {
                            handleSelectConversation(result.conversations[0]);
                        }
                    } else if (!activeConversation) {
                        handleSelectConversation(result.conversations[0]);
                    }
                }
            }
        } catch (err) {
            console.error("Failed to load conversations:", err);
        } finally {
            if (page === 1) setIsLoadingConversations(false);
        }
    }, [activeConversation, handleSelectConversation]);

    // Tải danh sách conversations khi mở trang hoặc đổi tab
    useEffect(() => {
        if (!isLoggedIn) return;
        loadConversations(activeTab, 1, false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn, activeTab]);

    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [conversationIdToDelete, setConversationIdToDelete] = useState<string | null>(null);

    // Mở modal xác nhận xóa
    const openDeleteModal = (e: React.MouseEvent, conversationId: string) => {
        e.stopPropagation();
        setConversationIdToDelete(conversationId);
        setShowDeleteModal(true);
    };

    // Thực hiện xóa hội thoại sau khi xác nhận
    const handleConfirmDelete = async () => {
        if (!conversationIdToDelete) return;

        setIsDeleting(conversationIdToDelete);
        try {
            await deleteConversation(conversationIdToDelete);
            
            // Cập nhật danh sách local
            const updatedList = conversations.filter(c => c.id !== conversationIdToDelete);
            setConversations(updatedList);
            
            // Cập nhật tổng số lượng và trạng thái hasMore
            setTotalConversations(prev => {
                const newTotal = Math.max(0, prev - 1);
                // Nếu số lượng còn lại nhỏ hơn hoặc bằng 5, không cần "Xem thêm" nữa
                if (newTotal <= 5) setHasMore(false);
                return newTotal;
            });

            if (activeConversation?.id === conversationIdToDelete) {
                setActiveConversation(null);
                setMessages([]);
            }
            setShowDeleteModal(false);
            setConversationIdToDelete(null);
        } catch (err) {
            console.error("Failed to delete conversation:", err);
            alert("Không thể xóa cuộc hội thoại. Vui lòng thử lại.");
        } finally {
            setIsDeleting(null);
        }
    };

    // Tạo cuộc hội thoại mới với AI
    const handleNewConversation = async () => {
        try {
            // Chuyển sang tab AI trước để người dùng thấy danh sách được cập nhật
            setActiveTab("AI_CONSULTING");
            
            const newConv = await createAiConversation();
            
            // Nếu đang ở tab AI rồi, cập nhật danh sách ngay lập tức
            if (activeTab === "AI_CONSULTING") {
                setConversations((prev) => {
                    if (prev.find((c) => c.id === newConv.id)) return prev;
                    return [newConv, ...prev];
                });
            }
            
            handleSelectConversation(newConv);
        } catch (err) {
            console.error("Failed to create ai conversation:", err);
        }
    };

    // Upload ảnh
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Gửi tin nhắn qua Socket / Hoặc gửi ảnh cho AI phân tích
    // Truy vấn kiến thức RAG
    const handleKnowledgeQuery = async () => {
        if (!inputText.trim() || !activeConversation) return;

        const question = inputText.trim();
        setInputText("");
        setIsLoading(true);
        setAiStatus("DARA AI đang tra cứu kiến thức...");

        // 1. Optimistic User Message
        const myMessage: ConversationMessage = {
            id: `temp-rag-${Date.now()}`,
            clientId: `temp-rag-${Date.now()}`,
            content: question,
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

        try {
            const response = await queryKnowledgeBase(question);
            console.log("RAG Response:", response);

            // 2. AI RAG Message
            const aiMsg: ConversationMessage = {
                id: `ai-rag-${Date.now()}`,
                content: response.answer,
                type: "text",
                isAiMessage: true,
                conversationId: activeConversation.id,
                created_at: new Date().toISOString(),
                timestamp: Date.now() + 10,
                sender: { id: "dara", fullName: "DARA AI", role: "AI" }
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error: any) {
            console.error("RAG Error Details:", error);
            const errMsg = error.response?.data?.message || error.message || "Lỗi không xác định";
            alert(`Không thể tra cứu kiến thức: ${errMsg}. Vui lòng kiểm tra GOOGLE_API_KEY.`);
        } finally {
            setIsLoading(false);
            setAiStatus(null);
        }
    };

    const handleSendMessage = async () => {
        if ((!inputText.trim() && !selectedImage) || !activeConversation || isLoading) return;

        if (chatMode === "knowledge") {
            handleKnowledgeQuery();
            return;
        }

        const content = inputText.trim();
        const imageFile = selectedImageFile;

        setInputText("");
        setSelectedImage(null);
        setSelectedImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";

        const isAiConsulting = activeConversation.status === 'AI_CONSULTING';
        const isDoctor = currentUser?.role === 'DOCTOR';

        // Nếu là phiên chat AI và KHÔNG PHẢI bác sĩ nhắn, ta gửi cả ảnh và chữ qua API analyzeAiCondition
        if (isAiConsulting && !isDoctor) {
            setIsLoading(true);
            setAiStatus("DARA AI đang phân tích dữ liệu của bạn...");

            // Reset chẩn đoán cũ và ẩn danh sách bác sĩ khi bắt đầu chẩn đoán mới
            setActiveConversation(prev => prev ? { ...prev, diagnosisInfo: null } : null);
            setShowDoctors(false);
            setDoctors([]);

            // 1. Optimistic Text Message
            let myTextMessage: ConversationMessage | null = null;
            if (content) {
                myTextMessage = {
                    id: `temp-text-${Date.now()}`,
                    clientId: `temp-text-${Date.now()}`,
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
                setMessages(prev => [...prev, myTextMessage!]);
            }

            // 2. Optimistic Image Message
            let tempImageMsg: ConversationMessage | null = null;
            if (imageFile) {
                tempImageMsg = {
                    id: `temp-img-${Date.now()}`,
                    clientId: `temp-img-${Date.now()}`,
                    content: URL.createObjectURL(imageFile),
                    type: "image",
                    isAiMessage: false,
                    conversationId: activeConversation.id,
                    created_at: new Date().toISOString(),
                    timestamp: Date.now() + 1,
                    sender: currentUser ? {
                        id: String(currentUser.id),
                        fullName: currentUser.fullName,
                        role: currentUser.role
                    } : { id: "me", fullName: "Me", role: "PATIENT" }
                };
                setMessages(prev => [...prev, tempImageMsg!]);
            }

            // Gửi API REST đa phương thức
            try {
                const analyzeRes = await analyzeAiCondition(activeConversation.id, imageFile, content);

                if (analyzeRes && analyzeRes.aiResult && analyzeRes.aiResult.specialization) {
                    const resAi = analyzeRes.aiResult;
                    const newTitle = `Tư vấn: ${resAi.disease_name}`;
                    
                    setActiveConversation(prev => prev ? {
                        ...prev,
                        title: newTitle,
                        diagnosisInfo: {
                            disease: resAi.disease_name,
                            specialization: resAi.specialization
                        }
                    } : null);

                    setConversations(prev => prev.map(c =>
                        c.id === activeConversation.id ? { ...c, title: newTitle } : c
                    ));
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu đa phương thức hoặc phân tích AI:", error);
                alert("Có lỗi xảy ra trong quá trình chẩn đoán. Vui lòng thử lại.");
                setAiStatus(null);
                setIsLoading(false);
                // Xóa tin nhắn tạm nếu lỗi
                if (tempImageMsg) {
                    setMessages(prev => prev.filter(msg => msg.id !== tempImageMsg!.id));
                }
                if (myTextMessage) {
                    setMessages(prev => prev.filter(msg => msg.id !== myTextMessage!.id));
                }
            } finally {
                setIsLoading(false);
                setAiStatus(null);
            }
        } else {
            // Logic cũ cho Chat với Bác sĩ: Chỉ được gửi websocket văn bản (hiện tại)
            if (content && socketRef.current) {
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
            }
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!isLoading) {
                handleSendMessage();
            }
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
        setSelectedSlot(slot);
        setIsBookingModalOpen(true);
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
            {/* Modal xác nhận xóa hội thoại AI */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div 
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={() => setShowDeleteModal(false)}
                    />
                    <div className="relative w-full max-w-sm rounded-[24px] border border-white/20 bg-white/80 p-6 shadow-2xl shadow-slate-200/50 backdrop-blur-xl transition-all animate-in fade-in zoom-in duration-300">
                        <div className="mb-4 flex flex-col items-center text-center">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500 shadow-inner">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Xác nhận xóa?</h3>
                            <p className="mt-2 text-sm font-medium text-slate-500 leading-relaxed">
                                Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa cuộc hội thoại này?
                            </p>
                        </div>
                        
                        <div className="flex gap-3 mt-2">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 active:scale-95"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={!!isDeleting}
                                className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-bold text-white shadow-lg shadow-red-200 transition hover:bg-red-600 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ) : "Xóa ngay"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Booking Modal */}
            {isBookingModalOpen && selectedSlot && bookingDoctorId && (
                <BookingModal
                    isOpen={isBookingModalOpen}
                    onClose={() => setIsBookingModalOpen(false)}
                    doctor={{
                        id: bookingDoctorId,
                        name: doctors.find(d => d.userId === bookingDoctorId)?.fullName || "Bác sĩ",
                        specialty: doctors.find(d => d.userId === bookingDoctorId)?.specialization || "",
                        avatar: doctors.find(d => d.userId === bookingDoctorId)?.avatar || "",
                    }}
                    conversationId={activeConversation?.id}
                    initialDate={selectedSlot.date}
                    initialTime={selectedSlot.startTime}
                    initialPrice={selectedSlot.price}
                />
            )}

            {/* Custom Confirmation Modal for Completing Consultation */}
            {showCompleteConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="mb-4 flex flex-col items-center text-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
                                ✓
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-slate-900">Hoàn thành ca khám?</h3>
                            <p className="text-sm text-slate-500">
                                Bạn có chắc chắn muốn kết thúc phiên tư vấn này không? Hành động này sẽ đóng cuộc hội thoại và cập nhật trạng thái lịch hẹn.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCompleteConfirm(false)}
                                disabled={isCompleting}
                                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={async () => {
                                    if (!activeConversation) return;
                                    setIsCompleting(true);
                                    try {
                                        const updated = await completeConversation(activeConversation.id);
                                        setActiveConversation(prev => prev ? { ...prev, status: updated.status } : null);
                                        setConversations(prev => prev.map(c => c.id === activeConversation.id ? { ...c, status: updated.status } : c));
                                        setShowCompleteConfirm(false);
                                    } catch (err) {
                                        console.error("Lỗi hoàn thành ca khám:", err);
                                        alert("Có lỗi xảy ra khi hoàn thành ca khám. Vui lòng thử lại.");
                                    } finally {
                                        setIsCompleting(false);
                                    }
                                }}
                                disabled={isCompleting}
                                className="flex-1 rounded-xl bg-green-600 py-3 text-sm font-bold text-white shadow-lg shadow-green-200 transition hover:bg-green-700 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isCompleting ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ) : "Xác nhận"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
                        {/* Tabs */}
                        <div className="mb-4 flex rounded-lg bg-slate-100 p-1">
                            <button
                                onClick={() => setActiveTab("DOCTOR_CONSULTING")}
                                className={`flex-1 rounded-md py-1.5 text-xs font-bold transition ${activeTab === "DOCTOR_CONSULTING" ? "bg-white text-dermcare shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                            >
                                Bác sĩ
                            </button>
                            <button
                                onClick={() => setActiveTab("AI_CONSULTING")}
                                className={`flex-1 rounded-md py-1.5 text-xs font-bold transition ${activeTab === "AI_CONSULTING" ? "bg-white text-dermcare shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                            >
                                AI
                            </button>
                            <button
                                onClick={() => setActiveTab("COMPLETED")}
                                className={`flex-1 rounded-md py-1.5 text-xs font-bold transition ${activeTab === "COMPLETED" ? "bg-white text-dermcare shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                            >
                                Đã xong
                            </button>
                        </div>

                        <p className="mb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            {activeTab === "AI_CONSULTING" ? "🤖 AI Tư vấn" : activeTab === "DOCTOR_CONSULTING" ? "👨‍⚕️ Bác sĩ khám" : "✅ Hoàn thành"}
                        </p>
                        
                        {isLoadingConversations && conversations.length === 0 ? (
                            <div className="flex justify-center py-8">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-dermcare border-t-transparent" />
                            </div>
                        ) : conversations.length === 0 ? (
                            <p className="px-3 py-6 text-center text-sm text-slate-400">Chưa có cuộc hội thoại nào</p>
                        ) : (
                            <div className="space-y-1">
                                {conversations.map((conv) => {
                                    const isActive = activeConversation?.id === conv.id;
                                    return (
                                        <button
                                            key={conv.id}
                                            onClick={() => handleSelectConversation(conv)}
                                            className={`group w-full rounded-xl px-3 py-3 text-left transition ${isActive
                                                ? "bg-white border border-dermcare/30 shadow-sm"
                                                : "hover:bg-slate-50 border border-transparent"
                                                }`}
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <p className={`text-sm font-bold truncate flex-1 ${isActive ? "text-dermcare" : "text-slate-900"}`}>
                                                    {conv.title || conv.lastMessage || "Hội thoại mới"}
                                                </p>
                                                {activeTab === "AI_CONSULTING" && (
                                                    <button
                                                        onClick={(e) => openDeleteModal(e, conv.id)}
                                                        className="invisible group-hover:visible rounded-md p-1 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
                                                        title="Xóa hội thoại"
                                                        disabled={isDeleting === conv.id}
                                                    >
                                                        {isDeleting === conv.id ? (
                                                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                                                        ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                                            </svg>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                            <div className="mt-1.5 flex items-center justify-between">
                                                <p className="text-[10px] font-medium text-slate-400">{formatDate(conv.updated_at)}</p>
                                                {conv.status !== activeTab && (
                                                    <span className="h-1.5 w-1.5 rounded-full bg-dermcare animate-pulse" />
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}

                                {hasMore && (
                                    <button
                                        onClick={() => loadConversations(activeTab, currentPage + 1, true)}
                                        className="mt-2 w-full rounded-lg py-2 text-xs font-bold text-dermcare hover:bg-dermcare/5 transition"
                                    >
                                        {isLoadingConversations ? "Đang tải..." : "🔽 Xem thêm"}
                                    </button>
                                )}
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
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-dermcare to-dermcare-dark text-2xl text-white shadow-soft overflow-hidden">
                                    {activeConversation?.status === "DOCTOR_CONSULTING" ? (
                                        // Nếu là tư vấn trực tiếp, hiển thị ảnh của đối phương
                                        isDoctor ? (
                                            activeConversation.patient?.avatar ? (
                                                <img src={activeConversation.patient.avatar} alt={activeConversation.patient.fullName} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-slate-200 text-slate-500 text-lg font-bold">
                                                    {activeConversation.patient?.fullName?.charAt(0) || "P"}
                                                </div>
                                            )
                                        ) : (
                                            (activeConversation.doctor as any)?.doctorProfile?.avatar ? (
                                                <img src={(activeConversation.doctor as any).doctorProfile.avatar} alt={activeConversation.doctor?.fullName} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-dermcare text-white text-lg font-bold">
                                                    {activeConversation.doctor?.fullName?.charAt(0) || "D"}
                                                </div>
                                            )
                                        )
                                    ) : (
                                        "🤖"
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold text-slate-900">
                                        {activeConversation?.status === "DOCTOR_CONSULTING"
                                            ? isDoctor 
                                                ? activeConversation.patient?.fullName || "Bệnh nhân"
                                                : `${(activeConversation.doctor as any)?.doctorProfile?.qualifications || ""} ${activeConversation.doctor?.fullName || "Bác sĩ tư vấn"}`.trim()
                                            : "DARA AI"}
                                    </h1>
                                    <p className="text-xs text-slate-500">
                                        {activeConversation
                                            ? activeConversation.status === "DOCTOR_CONSULTING"
                                                ? isDoctor ? "👤 Thông tin bệnh nhân" : "👨‍⚕️ Bác sĩ đang trực tuyến"
                                                : "Trợ lý da liễu thông minh • 24/7"
                                            : "Trợ lý da liễu thông minh • 24/7"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {activeConversation?.status === "DOCTOR_CONSULTING" && (
                            <div className="flex items-center gap-3">
                                {isDoctor && (
                                    <button 
                                        onClick={() => setShowCompleteConfirm(true)}
                                        className="mr-2 flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white shadow-soft transition-all hover:bg-green-700 active:scale-95"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"/>
                                        </svg>
                                        Hoàn thành
                                    </button>
                                )}
                                <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                                    <button 
                                        className="group flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-slate-100 active:scale-95"
                                        title="Bắt đầu cuộc gọi thoại"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 transition-colors group-hover:text-dermcare">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.19-1.28a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                        </svg>
                                    </button>
                                    <button 
                                        className="group flex h-10 w-10 items-center justify-center rounded-full bg-dermcare/10 transition-all hover:bg-dermcare hover:shadow-md active:scale-95"
                                        title="Bắt đầu cuộc gọi video"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-dermcare transition-colors group-hover:text-white">
                                            <path d="m22 8-6 4 6 4V8Z"/>
                                            <rect width="14" height="12" x="2" y="6" rx="2" ry="2"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
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
                                const isSystemMessage = message.sender?.id === 'system';

                                if (isSystemMessage) {
                                    return (
                                        <div key={message.clientId || message.id} className="flex justify-center my-4">
                                            <div className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-medium text-slate-500 border border-slate-200">
                                                <span dangerouslySetInnerHTML={{ __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={message.clientId || message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                                        {!isCurrentUser && (
                                            <div className="mr-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-dermcare to-dermcare-dark text-sm text-white overflow-hidden">
                                                {message.isAiMessage ? (
                                                    "🤖"
                                                ) : (message.sender as any)?.avatar ? (
                                                    <img src={(message.sender as any).avatar} alt={message.sender.fullName} className="h-full w-full object-cover" />
                                                ) : (message.sender as any)?.doctorProfile?.avatar ? (
                                                    <img src={(message.sender as any).doctorProfile.avatar} alt={message.sender.fullName} className="h-full w-full object-cover" />
                                                ) : activeConversation?.status === "DOCTOR_CONSULTING" && String(message.sender?.id) === String(activeConversation.doctor?.id) ? (
                                                    "👨‍⚕️"
                                                ) : (
                                                    "👤"
                                                )}
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
                                            {message.type === 'image' ? (
                                                <img src={message.content} alt="Uploaded attachment" className="max-w-full sm:max-w-md w-auto rounded-xl mt-1 object-cover cursor-pointer hover:opacity-90 transition shadow-sm border border-slate-100" onClick={() => window.open(message.content, "_blank")} />
                                            ) : (
                                                <div className="whitespace-pre-wrap text-sm" dangerouslySetInnerHTML={{ __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                            )}
                                            <p className={`mt-1 text-xs ${isCurrentUser ? "text-dermcare-light" : "text-slate-500"}`}>
                                                {formatTime(message.timestamp || message.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}

                            {isLoading && activeConversation?.status === 'AI_CONSULTING' && (
                                <div className="flex justify-start">
                                    <div className="mr-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-dermcare to-dermcare-dark text-sm text-white">
                                        🤖
                                    </div>
                                    <div className="max-w-[75%] rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                                        <div className="flex flex-col gap-2">
                                            {aiStatus && (
                                                <p className="text-sm font-medium text-dermcare italic animate-pulse">
                                                    {aiStatus}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-1.5 ml-1">
                                                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-dermcare" />
                                                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-dermcare" style={{ animationDelay: "0.2s" }} />
                                                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-dermcare" style={{ animationDelay: "0.4s" }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />

                            {/* Nút gợi ý bác sĩ – hiện khi diagnosisInfo có dữ liệu và đang trong phiên AI */}
                            {activeConversation?.diagnosisInfo && activeConversation.status === 'AI_CONSULTING' && !isDoctor && (
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
                {activeConversation && activeConversation.status !== "COMPLETED" ? (
                    <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg flex-shrink-0">
                        <div className="mx-auto max-w-5xl">
                            {/* Chat Mode Switcher */}
                            {activeConversation?.status !== 'DOCTOR_CONSULTING' && (
                                <div className="mb-3 flex justify-center">
                                    <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 shadow-sm">
                                        <button
                                            onClick={() => setChatMode("diagnosis")}
                                            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${chatMode === "diagnosis"
                                                ? "bg-white text-dermcare shadow-sm"
                                                : "text-slate-500 hover:text-slate-700"
                                                }`}
                                        >
                                            <span className="text-base">🩺</span> Chẩn đoán
                                        </button>
                                        <button
                                            onClick={() => setChatMode("knowledge")}
                                            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${chatMode === "knowledge"
                                                ? "bg-blue-600 text-white shadow-sm"
                                                : "text-slate-500 hover:text-slate-700"
                                                }`}
                                        >
                                            <span className="text-base">📚</span> Tra cứu
                                        </button>
                                    </div>
                                </div>
                            )}

                            {selectedImage && (
                                <div className="mb-3 flex items-start gap-2">
                                    <div className="relative">
                                        <img src={selectedImage} alt="Preview" className="h-20 w-20 rounded-lg border border-slate-200 object-cover" />
                                        <button
                                            onClick={() => {
                                                setSelectedImage(null);
                                                setSelectedImageFile(null);
                                                if (fileInputRef.current) fileInputRef.current.value = "";
                                            }}
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
                                    title="Tải ảnh lên"
                                >
                                    📷
                                </button>


                                <div className="flex-1">
                                    <textarea
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        placeholder={activeConversation?.status === "DOCTOR_CONSULTING" 
                                            ? "Nhập tin nhắn..." 
                                            : chatMode === "diagnosis" 
                                                ? "Mô tả triệu chứng của bạn..." 
                                                : "Nhập câu hỏi bạn muốn tra cứu kiến thức..."}
                                        rows={1}
                                        className={`w-full resize-none rounded-xl border-2 px-4 py-3 text-sm transition focus:outline-none focus:ring-2 ${
                                            activeConversation?.status === "DOCTOR_CONSULTING"
                                                ? "border-slate-300 focus:border-dermcare focus:ring-dermcare/20"
                                                : chatMode === "diagnosis"
                                                    ? "border-slate-300 focus:border-dermcare focus:ring-dermcare/20"
                                                    : "border-blue-200 bg-blue-50/30 focus:border-blue-500 focus:ring-blue-500/20"
                                            }`}
                                    />
                                </div>
                                <button
                                    onClick={handleSendMessage}
                                    disabled={(!inputText.trim() && !selectedImage) || isLoading}
                                    className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-xl text-white shadow-soft transition disabled:cursor-not-allowed disabled:opacity-40 ${chatMode === "diagnosis" ? "bg-dermcare hover:bg-dermcare-dark" : "bg-blue-600 hover:bg-blue-700"
                                        }`}
                                >
                                    ➤
                                </button>
                            </div>

                        </div>
                    </div>
                ) : activeConversation && activeConversation.status === "COMPLETED" ? (
                    <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-center flex-shrink-0">
                        <div className="mx-auto max-w-lg rounded-full border border-slate-200 bg-white px-6 py-2 shadow-sm flex items-center justify-center gap-2">
                            <span className="text-green-500 text-sm">✅</span>
                            <span className="text-sm font-semibold text-slate-700">Phiên tư vấn đã kết thúc.</span>
                            <span className="text-xs text-slate-500">Ca khám này đã được bác sĩ xác nhận hoàn thành.</span>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
