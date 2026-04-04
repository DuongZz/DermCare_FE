"use client";

import React, { useEffect, useState } from "react";
import { useVoiceCall } from "@/contexts/VoiceCallContext";
import { Phone, PhoneOff, Mic, MicOff, User, Minimize2, Maximize2 } from "lucide-react";

export const VoiceCallModal: React.FC = () => {
    const { 
        callState, 
        caller, 
        recipientName,
        acceptCall, 
        rejectCall, 
        hangupCall 
    } = useVoiceCall();

    const [timer, setTimer] = useState(0);
    const [isMinimized, setIsMinimized] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 }); // offset from bottom-right initial
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (callState === "incoming" || callState === "dialing") {
            setIsMinimized(false);
        }

        let interval: any;
        if (callState === "on-call") {
            interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        } else {
            setTimer(0);
        }
        return () => clearInterval(interval);
    }, [callState]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (callState === "idle") return null;

    const displayName = caller ? caller.fullName : recipientName;
    const avatar = caller ? caller.avatar : null;

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
        // Snapping Logic
        const screenWidth = window.innerWidth;
        const cardWidth = 256; // w-64 = 16rem = 256px
        const currentX = e.clientX;
        
        // Target X positions (relative to screen)
        const leftTarget = 24;
        const rightTarget = screenWidth - cardWidth - 24;
        
        // Initial position is bottom-right (fixed bottom-6 right-6)
        // So we calculate final offset from that initial point
        const initialX = screenWidth - cardWidth - 24;
        const finalX = currentX < screenWidth / 2 ? leftTarget - initialX : 0;
        
        setPosition(prev => ({ ...prev, x: finalX }));
    };

    if (isMinimized) {
        return (
            <div 
                className="fixed bottom-6 right-6 z-[10000] w-64 bg-slate-900/90 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-blue-500/50 cursor-move group transition-transform duration-300 p-4 select-none touch-none"
                style={{ 
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onClick={() => !isDragging && setIsMinimized(false)}
            >
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className={`w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold overflow-hidden border border-white/10 ${callState === "on-call" ? "animate-pulse" : ""}`}>
                            {avatar ? (
                                <img src={avatar} alt="Avatar" className="w-full h-full object-cover pointer-events-none" />
                            ) : (
                                displayName?.charAt(0) || <User className="w-6 h-6" />
                            )}
                        </div>
                        {callState === "on-call" && (
                            <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-ping pointer-events-none" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-white text-sm font-bold truncate">{displayName}</h4>
                        <p className="text-blue-400 text-[10px] font-mono">
                            {callState === "dialing" ? "Đang gọi..." : formatTime(timer)}
                        </p>
                    </div>
                </div>

                {/* Hangup Button - MOVED TO BOTTOM RIGHT */}
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        hangupCall();
                    }}
                    className="absolute bottom-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-full text-white shadow-lg transition-colors z-20"
                >
                    <PhoneOff className="w-3 h-3" />
                </button>
                {/* Maximize Icon on Hover */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                    <Maximize2 className="text-white/50 w-6 h-6" />
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-900/95 backdrop-blur-xl p-4">
            <div className="relative w-full max-w-sm overflow-hidden rounded-[40px] bg-gradient-to-b from-blue-600 to-blue-900 shadow-2xl border border-white/10 p-10 flex flex-col items-center">
                
                {/* Minimize Button - MOVED INSIDE */}
                <button 
                    onClick={() => setIsMinimized(true)}
                    className="absolute top-6 right-6 z-[30] p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/60 hover:text-white transition-all hover:scale-110 active:scale-95"
                    title="Thu nhỏ"
                >
                    <Minimize2 className="w-5 h-5" />
                </button>
                
                {/* --- HEADER --- */}
                <div className="text-center mb-8">
                    <p className="text-blue-200 text-[10px] font-bold uppercase tracking-[0.2em] mb-3 opacity-80">
                        {callState === "dialing" ? "Đang gọi..." : 
                         callState === "incoming" ? "Cuộc gọi thoại đến" : 
                         "Đang trong cuộc gọi"}
                    </p>
                    <h2 className="text-2xl font-bold text-white mb-2 leading-tight">{displayName || "Người dùng"}</h2>
                    {callState === "on-call" && (
                        <p className="text-white/60 font-mono text-lg font-medium">{formatTime(timer)}</p>
                    )}
                </div>

                {/* --- AVATAR AREA --- */}
                <div className="relative mb-12">
                    <div className={`w-40 h-40 rounded-full bg-blue-500/30 flex items-center justify-center border-4 border-white/10 shadow-2xl overflow-hidden relative z-10 ${callState === "on-call" ? "animate-pulse" : ""}`}>
                        {avatar ? (
                            <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-white text-5xl font-bold">
                                {displayName?.charAt(0) || <User className="w-16 h-16" />}
                            </div>
                        )}
                    </div>
                    {/* Pulsing rings for active call - FIXED POINTER EVENTS */}
                    {callState === "on-call" && (
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute inset-0 rounded-full border-4 border-blue-400/40 animate-ping" />
                            <div className="absolute -inset-6 rounded-full border-2 border-blue-400/10 animate-ping delay-300" />
                        </div>
                    )}
                </div>

                {/* --- CONTROLS --- */}
                <div className="flex flex-col items-center gap-10 w-full mt-4">
                    <div className="flex items-center gap-10">
                        {callState === "incoming" ? (
                            <>
                                <button 
                                    onClick={acceptCall}
                                    className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-white shadow-xl transform active:scale-90 transition-all animate-bounce"
                                >
                                    <Phone className="w-8 h-8 fill-current" />
                                </button>
                                <button 
                                    onClick={rejectCall}
                                    className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-xl transform active:scale-90 transition-all"
                                >
                                    <PhoneOff className="w-8 h-8" />
                                </button>
                            </>
                        ) : (
                            <button 
                                onClick={hangupCall}
                                className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-2xl transform active:scale-90 transition-all border-4 border-white/10"
                            >
                                <PhoneOff className="w-8 h-8" />
                            </button>
                        )}
                    </div>
                </div>

                {/* --- FOOTER INFO (SPACER) --- */}
                <div className="mt-8 h-2"></div>
            </div>
            
            <style jsx>{`
                @keyframes pulse-ring {
                    0% { transform: scale(0.8); opacity: 0.5; }
                    100% { transform: scale(1.2); opacity: 0; }
                }
            `}</style>
        </div>
    );
};
