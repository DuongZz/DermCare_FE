"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { useSocket } from "./SocketContext";
import { useAuth } from "./AuthContext";

type CallState = "idle" | "dialing" | "incoming" | "on-call";

interface VideoCallContextType {
    callState: CallState;
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    caller: any | null; // Info about the person calling you
    recipientId: string | null; // Who you are calling
    recipientName: string | null; // Name of person you are calling
    conversationId: string | null; // Current chat conversation
    initiateCall: (recipientId: string, recipientName: string, conversationId: string) => Promise<void>;
    acceptCall: () => void;
    rejectCall: () => void;
    hangupCall: () => void;
}

const VideoCallContext = createContext<VideoCallContextType | undefined>(undefined);

export const useVideoCall = () => {
    const context = useContext(VideoCallContext);
    if (!context) throw new Error("useVideoCall must be used within VideoCallProvider");
    return context;
};

const ICE_SERVERS: RTCConfiguration = {
    iceServers: [
        // STUN — phát hiện IP public
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        // TURN — relay dữ liệu khi NAT/firewall ngăn kết nối P2P trực tiếp
        // (bắt buộc để hoạt động qua các mạng/ISP khác nhau)
        {
            urls: "turn:openrelay.metered.ca:80",
            username: "openrelayproject",
            credential: "openrelayproject",
        },
        {
            urls: "turn:openrelay.metered.ca:443",
            username: "openrelayproject",
            credential: "openrelayproject",
        },
        {
            urls: "turns:openrelay.metered.ca:443?transport=tcp",
            username: "openrelayproject",
            credential: "openrelayproject",
        },
    ],
    iceCandidatePoolSize: 10,
};

export const VideoCallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { socket } = useSocket();
    const { user } = useAuth();
    const [callState, setCallState] = useState<CallState>("idle");
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [caller, setCaller] = useState<any | null>(null);
    const [recipientId, setRecipientId] = useState<string | null>(null);
    const [recipientName, setRecipientName] = useState<string | null>(null);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [isCaller, setIsCaller] = useState(false);

    const peerConnection = useRef<RTCPeerConnection | null>(null);

    const stopStreams = useCallback(() => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }
        setRemoteStream(null);
    }, [localStream]);

    // --- WebRTC Logic ---

    const createPeerConnection = useCallback((targetId: string) => {
        if (peerConnection.current) peerConnection.current.close();
        
        const pc = new RTCPeerConnection(ICE_SERVERS);
        
        pc.onicecandidate = (event) => {
            if (event.candidate && socket) {
                socket.emit("webrtc:signal", {
                    targetId,
                    signal: { type: "candidate", candidate: event.candidate }
                });
            }
        };

        pc.ontrack = (event) => {
            console.log("[WebRTC] Received remote track");
            setRemoteStream(event.streams[0]);
        };

        peerConnection.current = pc;
        return pc;
    }, [socket]);

    const initiateCall = async (id: string, name: string, convId: string) => {
        if (!socket) return;
        setRecipientId(id);
        setRecipientName(name);
        setConversationId(convId);
        setIsCaller(true);
        setCallState("dialing");
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { min: 640, ideal: 1280, max: 1920 }, 
                    height: { min: 480, ideal: 720, max: 1080 },
                    aspectRatio: { ideal: 1.777777778 }
                }, 
                audio: true 
            });
            setLocalStream(stream);

            let senderName = user?.fullName || "Người dùng";
            if (user?.role === 'DOCTOR') {
                senderName = user.qualifications ? `${user.qualifications} ${user.fullName}` : `BS. ${user.fullName}`;
            }

            socket.emit("call:initiate", {
                recipientId: id,
                sender: { id: user?.id, fullName: senderName, role: user?.role },
                conversationId: convId
            });
        } catch (err) {
            console.error("[WebRTC] Failed to get user media:", err);
            setCallState("idle");
        }
    };

    const acceptCall = async () => {
        if (!socket || !caller) return;
        setCallState("on-call");

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);

            socket.emit("call:respond", { callerId: caller.id, accepted: true });
            // Wait for Offer from Caller
        } catch (err) {
            console.error("[WebRTC] Failed to accept call:", err);
            rejectCall();
        }
    };

    const rejectCall = () => {
        if (socket && caller) {
            socket.emit("call:respond", { callerId: caller.id, accepted: false });
        }
        setCallState("idle");
        setCaller(null);
    };

    const hangupCall = () => {
        const target = recipientId || (caller ? caller.id : null);
        if (socket && target) {
            socket.emit("call:hangup", { targetId: target });
        }
        cleanup();
    };

    const cleanup = useCallback(() => {
        // Gửi thông báo thời lượng cuộc gọi nếu cuộc gọi đã diễn ra
        // Chỉ để Bác sĩ gửi để đảm bảo hiển thị đúng học vị và ảnh đại diện chuyên nghiệp
        if (startTime && conversationId && socket && user?.role === 'DOCTOR') {
            const durationMs = Date.now() - startTime;
            const minutes = Math.floor(durationMs / 60000);
            const seconds = Math.floor((durationMs % 60000) / 1000);
            const formattedDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            socket.emit("send_message", {
                conversationId,
                content: `Cuộc gọi video kết thúc. Thời lượng: **${formattedDuration}**`
            });
        }

        setCallState("idle");
        setCaller(null);
        setRecipientId(null);
        setRecipientName(null);
        setConversationId(null);
        setStartTime(null);
        setIsCaller(false);
        stopStreams();
        if (peerConnection.current) {
            peerConnection.current.close();
            peerConnection.current = null;
        }
    }, [stopStreams, startTime, conversationId, socket, isCaller]);

    // --- Socket Event Handlers ---

    useEffect(() => {
        if (!socket) return;

        socket.on("call:incoming", (data: { from: string; sender: any; conversationId?: string }) => {
            console.log("[Socket] Incoming call from:", data.sender.fullName);
            setCaller(data.sender);
            if (data.conversationId) setConversationId(data.conversationId);
            setIsCaller(false);
            setCallState("incoming");
        });

        socket.on("call:response", async (data: { from: string; accepted: boolean }) => {
            if (data.accepted) {
                console.log("[Socket] Call accepted, starting peer connection");
                setStartTime(Date.now());
                setCallState("on-call");
                
                const pc = createPeerConnection(data.from);
                localStream?.getTracks().forEach(track => pc.addTrack(track, localStream));

                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                socket.emit("webrtc:signal", { targetId: data.from, signal: offer });
            } else {
                console.log("[Socket] Call rejected");
                cleanup();
            }
        });

        socket.on("webrtc:signal", async (data: { from: string; signal: any }) => {
            const pc = peerConnection.current || createPeerConnection(data.from);
            
            if (data.signal.type === "offer") {
                console.log("[WebRTC] Received offer");
                if (callState === "on-call" && !startTime) {
                    setStartTime(Date.now());
                }
                localStream?.getTracks().forEach(track => pc.addTrack(track, localStream));
                await pc.setRemoteDescription(new RTCSessionDescription(data.signal));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.emit("webrtc:signal", { targetId: data.from, signal: answer });
            } else if (data.signal.type === "answer") {
                console.log("[WebRTC] Received answer");
                await pc.setRemoteDescription(new RTCSessionDescription(data.signal));
            } else if (data.signal.type === "candidate") {
                console.log("[WebRTC] Received ice candidate");
                try {
                    await pc.addIceCandidate(new RTCIceCandidate(data.signal.candidate));
                } catch (e) {
                    console.error("[WebRTC] Error adding ice candidate", e);
                }
            }
        });

        socket.on("call:hangup", () => {
            console.log("[Socket] Remote hung up");
            cleanup();
        });

        return () => {
            socket.off("call:incoming");
            socket.off("call:response");
            socket.off("webrtc:signal");
            socket.off("call:hangup");
        };
    }, [socket, localStream, createPeerConnection, cleanup]);

    return (
        <VideoCallContext.Provider value={{
            callState,
            localStream,
            remoteStream,
            caller,
            recipientId,
            recipientName,
            conversationId,
            initiateCall,
            acceptCall,
            rejectCall,
            hangupCall
        }}>
            {children}
        </VideoCallContext.Provider>
    );
};
