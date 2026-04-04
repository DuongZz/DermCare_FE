"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { getAccessToken } from '@/lib/tokenStore';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/v1\/?$/, "") || "http://localhost:4000";

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isLoggedIn } = useAuth();
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!isLoggedIn) {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                setIsConnected(false);
            }
            return;
        }

        const token = getAccessToken();
        if (!token) return;

        if (!socketRef.current) {
            console.log("[SocketContext] 🛠️ Initializing socket connection...");
            const socket = io(BACKEND_URL, {
                auth: { token: `Bearer ${token}` }, // Use Bearer prefix for consistency
                transports: ["polling", "websocket"],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 2000,
            });

            socket.on("connect", () => {
                setIsConnected(true);
                console.log("[SocketContext] ✅ Connected:", socket.id);
            });

            socket.on("disconnect", () => {
                setIsConnected(false);
                console.log("[SocketContext] ❌ Disconnected");
            });

            socket.on("connect_error", (err) => {
                console.error("[SocketContext] Connection error:", err.message);
            });

            socketRef.current = socket;
        }

        return () => {
            // We keep the socket alive globally, but could disconnect on unmount 
            // of the entire Provider (which is basically app close)
        };
    }, [isLoggedIn]);

    return (
        <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
