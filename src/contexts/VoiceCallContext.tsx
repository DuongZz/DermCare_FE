"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { useSocket } from "./SocketContext";
import { useAuth } from "./AuthContext";

type VoiceCallState = "idle" | "dialing" | "incoming" | "on-call";

interface VoiceCallContextType {
    callState: VoiceCallState;
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    caller: any | null;
    recipientId: string | null;
    recipientName: string | null;
    conversationId: string | null;
    initiateCall: (recipientId: string, recipientName: string, conversationId: string) => Promise<void>;
    acceptCall: () => void;
    rejectCall: () => void;
    hangupCall: () => void;
}

const VoiceCallContext = createContext<VoiceCallContextType | undefined>(undefined);

export const useVoiceCall = () => {
    const context = useContext(VoiceCallContext);
    if (!context) throw new Error("useVoiceCall must be used within VoiceCallProvider");
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

export const VoiceCallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { socket } = useSocket();
    const { user } = useAuth();
    const [callState, setCallState] = useState<VoiceCallState>("idle");
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [caller, setCaller] = useState<any | null>(null);
    const [recipientId, setRecipientId] = useState<string | null>(null);
    const [recipientName, setRecipientName] = useState<string | null>(null);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [startTime, setStartTime] = useState<number | null>(null);

    const peerConnection = useRef<RTCPeerConnection | null>(null);

    const stopStreams = useCallback(() => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }
        setRemoteStream(null);
    }, [localStream]);

    const createPeerConnection = useCallback((targetId: string) => {
        if (peerConnection.current) peerConnection.current.close();
        const pc = new RTCPeerConnection(ICE_SERVERS);
        
        pc.onicecandidate = (event) => {
            if (event.candidate && socket) {
                socket.emit("voice:signal", {
                    targetId,
                    signal: { type: "candidate", candidate: event.candidate }
                });
            }
        };

        pc.ontrack = (event) => {
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
        setCallState("dialing");
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: true, 
                video: false 
            });
            setLocalStream(stream);

            let senderName = user?.fullName || "Người dùng";
            if (user?.role === 'DOCTOR') {
                senderName = user.qualifications ? `${user.qualifications} ${user.fullName}` : `BS. ${user.fullName}`;
            }

            socket.emit("voice:initiate", {
                recipientId: id,
                sender: { id: user?.id, fullName: senderName, role: user?.role, avatar: (user as any)?.doctorProfile?.avatar || (user as any)?.avatar },
                conversationId: convId
            });
        } catch (err) {
            console.error("[VoiceCall] Failed to get audio:", err);
            setCallState("idle");
        }
    };

    const acceptCall = async () => {
        if (!socket || !caller) return;
        setCallState("on-call");

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            setLocalStream(stream);
            socket.emit("voice:respond", { callerId: caller.id, accepted: true });
        } catch (err) {
            console.error("[VoiceCall] Failed to accept call:", err);
            rejectCall();
        }
    };

    const rejectCall = () => {
        if (socket && caller) {
            socket.emit("voice:respond", { callerId: caller.id, accepted: false });
        }
        setCallState("idle");
    };

    const hangupCall = () => {
        const target = recipientId || (caller ? caller.id : null);
        if (socket && target) {
            socket.emit("voice:hangup", { targetId: target });
        }
        cleanup();
    };

    const cleanup = useCallback(() => {
        if (startTime && conversationId && socket && user?.role === 'DOCTOR') {
            const durationMs = Date.now() - startTime;
            const minutes = Math.floor(durationMs / 60000);
            const seconds = Math.floor((durationMs % 60000) / 1000);
            const formattedDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            socket.emit("send_message", {
                conversationId,
                content: `Cuộc gọi thoại kết thúc. Thời lượng: **${formattedDuration}**`
            });
        }

        setCallState("idle");
        setCaller(null);
        setRecipientId(null);
        setRecipientName(null);
        setConversationId(null);
        setStartTime(null);
        stopStreams();
        if (peerConnection.current) {
            peerConnection.current.close();
            peerConnection.current = null;
        }
    }, [stopStreams, startTime, conversationId, socket, user]);

    useEffect(() => {
        if (!socket) return;

        socket.on("voice:incoming", (data: { from: string; sender: any; conversationId?: string }) => {
            setCaller(data.sender);
            if (data.conversationId) setConversationId(data.conversationId);
            setCallState("incoming");
        });

        socket.on("voice:response", async (data: { from: string; accepted: boolean }) => {
            if (data.accepted) {
                setStartTime(Date.now());
                setCallState("on-call");
                const pc = createPeerConnection(data.from);
                localStream?.getTracks().forEach(track => pc.addTrack(track, localStream));
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                socket.emit("voice:signal", { targetId: data.from, signal: offer });
            } else {
                cleanup();
            }
        });

        socket.on("voice:signal", async (data: { from: string; signal: any }) => {
            const pc = peerConnection.current || createPeerConnection(data.from);
            if (data.signal.type === "offer") {
                if (callState === "on-call" && !startTime) setStartTime(Date.now());
                localStream?.getTracks().forEach(track => pc.addTrack(track, localStream));
                await pc.setRemoteDescription(new RTCSessionDescription(data.signal));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.emit("voice:signal", { targetId: data.from, signal: answer });
            } else if (data.signal.type === "answer") {
                await pc.setRemoteDescription(new RTCSessionDescription(data.signal));
            } else if (data.signal.type === "candidate") {
                try {
                    await pc.addIceCandidate(new RTCIceCandidate(data.signal.candidate));
                } catch (e) {
                    console.error("[VoiceCall] Error adding candidate", e);
                }
            }
        });

        socket.on("voice:hangup", () => cleanup());

        return () => {
            socket.off("voice:incoming");
            socket.off("voice:response");
            socket.off("voice:signal");
            socket.off("voice:hangup");
        };
    }, [socket, localStream, createPeerConnection, cleanup, callState, startTime]);

    return (
        <VoiceCallContext.Provider value={{
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
            <audio 
                ref={(el) => {
                    if (el && remoteStream) el.srcObject = remoteStream;
                }} 
                autoPlay 
            />
        </VoiceCallContext.Provider>
    );
};
