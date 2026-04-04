"use client";

import React, { useEffect, useRef, useState } from "react";
import { useVideoCall } from "@/contexts/VideoCallContext";
import { Phone, PhoneOff, Video, VideoOff, X, Minimize2, Maximize2 } from "lucide-react";

export const VideoCallModal: React.FC = () => {
    const { 
        callState, 
        localStream, 
        remoteStream, 
        caller, 
        recipientId, 
        recipientName,
        acceptCall, 
        rejectCall, 
        hangupCall 
    } = useVideoCall();

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const [isMinimized, setIsMinimized] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (callState === "incoming" || callState === "dialing") {
            setIsMinimized(false);
        }
    }, [callState]);

    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream, isMinimized]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream, isMinimized]);

    if (callState === "idle") return null;

    // Draggable Logic
    const handlePointerDown = (e: React.PointerEvent) => {
        setDragStart({ 
            x: e.clientX - position.x, 
            y: e.clientY - position.y 
        });
        setIsDragging(false);
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (e.buttons !== 1) return;
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        
        if (Math.abs(newX - position.x) > 5 || Math.abs(newY - position.y) > 5) {
            setIsDragging(true);
        }
        
        setPosition({ x: newX, y: newY });
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        const screenWidth = window.innerWidth;
        const cardWidth = 320; // w-80 = 20rem = 320px
        const currentX = e.clientX;
        
        const leftTarget = 24;
        const rightTarget = screenWidth - cardWidth - 24;
        const initialX = screenWidth - cardWidth - 24;
        const finalX = currentX < screenWidth / 2 ? leftTarget - initialX : 0;
        
        setPosition(prev => ({ ...prev, x: finalX }));
    };

    if (isMinimized) {
        return (
            <div 
                className="fixed bottom-6 right-6 z-[9999] w-80 aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-2 border-blue-500/50 cursor-move group transition-transform duration-300 select-none touch-none"
                style={{ 
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onClick={() => !isDragging && setIsMinimized(false)}
            >
                {/* Minimized Video Content */}
                <div className="absolute inset-0 bg-black pointer-events-none">
                    {remoteStream ? (
                        <video 
                            ref={remoteVideoRef} 
                            autoPlay 
                            playsInline 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-white/50">
                            <Video className="w-8 h-8 mb-2" />
                            <span className="text-xs uppercase tracking-wider font-bold">Cuộc gọi...</span>
                        </div>
                    )}
                </div>

                {/* Local PiP (Ultra Mini) */}
                <div className="absolute top-2 right-2 w-20 aspect-video bg-gray-800 rounded-md overflow-hidden border border-blue-400 z-10 pointer-events-none">
                    <video 
                        ref={localVideoRef} 
                        autoPlay 
                        playsInline 
                        muted 
                        className="w-full h-full object-cover mirror"
                    />
                </div>

                {/* Restore Button Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                    <Maximize2 className="text-white w-10 h-10" />
                </div>
                
                {/* Small Hangup Button - FIXED POSITION */}
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        hangupCall();
                    }}
                    className="absolute bottom-3 right-3 p-2 bg-red-500 hover:bg-red-600 rounded-full text-white shadow-xl transition-all hover:scale-110 active:scale-90 z-20"
                >
                    <PhoneOff className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-8">
            <div className="relative w-full max-w-6xl aspect-video bg-gray-900 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10">
                
                {/* Minimize Button - MOVED TO LEFT */}
                <button 
                    onClick={() => setIsMinimized(true)}
                    className="absolute top-6 left-6 z-[30] p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all hover:scale-110 active:scale-95"
                    title="Thu nhỏ"
                >
                    <Minimize2 className="w-6 h-6" />
                </button>

                {/* --- VIDEO AREA --- */}
                <div className="absolute inset-0 flex">
                    {/* Remote Video (Full Screen) */}
                    <div className="relative flex-1 bg-black">
                        {remoteStream ? (
                            <video 
                                ref={remoteVideoRef} 
                                autoPlay 
                                playsInline 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                {callState !== "incoming" && (
                                    <>
                                        <div className="w-24 h-24 bg-blue-600/20 rounded-full flex items-center justify-center mb-4 animate-pulse">
                                            <Video className="w-12 h-12 text-blue-500" />
                                        </div>
                                        <p className="text-xl font-medium">
                                            {callState === "dialing" ? `Đang gọi cho ${recipientName || "người dùng"}...` : 
                                             callState === "on-call" ? "Đang chờ kết nối..." : 
                                             ""}
                                        </p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Local Video (PiP) */}
                    <div className="absolute top-6 right-6 w-1/4 aspect-video bg-gray-800 rounded-xl overflow-hidden border-2 border-blue-500 shadow-lg z-10 transition-all hover:scale-105">
                        <video 
                            ref={localVideoRef} 
                            autoPlay 
                            playsInline 
                            muted 
                            className="w-full h-full object-cover mirror"
                        />
                    </div>
                </div>

                {/* --- OVERLAY CONTROLS --- */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-6 z-20">
                    
                    {/* Incoming Call Options */}
                    {callState === "incoming" && (
                        <>
                            <button 
                                onClick={acceptCall}
                                className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-white shadow-xl transform active:scale-95 transition-all animate-bounce"
                                title="Chấp nhận"
                            >
                                <Phone className="w-8 h-8 fill-current" />
                            </button>
                            <button 
                                onClick={rejectCall}
                                className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-xl transform active:scale-95 transition-all"
                                title="Từ chối"
                            >
                                <PhoneOff className="w-8 h-8" />
                            </button>
                        </>
                    )}

                    {/* Active/Dialing Call Options */}
                    {(callState === "on-call" || callState === "dialing") && (
                        <button 
                            onClick={hangupCall}
                            className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-xl transform active:scale-95 transition-all"
                            title="Kết thúc"
                        >
                            <PhoneOff className="w-8 h-8" />
                        </button>
                    )}
                </div>

                {/* --- CALLER INFO (INCOMING) --- */}
                {callState === "incoming" && caller && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                        <div className="w-40 h-40 bg-blue-600 rounded-full mx-auto mb-8 flex items-center justify-center text-white text-5xl font-bold shadow-[0_0_30px_rgba(37,99,235,0.4)]">
                            {caller.fullName?.charAt(0)}
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-3">{caller.fullName}</h2>
                        <p className="text-blue-400 text-xl font-medium">Cuộc gọi video đến...</p>
                    </div>
                )}

            </div>

            <style jsx>{`
                .mirror {
                    transform: scaleX(-1);
                }
            `}</style>
        </div>
    );
};
