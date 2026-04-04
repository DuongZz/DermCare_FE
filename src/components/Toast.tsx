"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 5000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`
                            pointer-events-auto
                            flex items-center gap-3 px-4 py-3 min-w-[320px] rounded-xl shadow-2xl
                            transform transition-all duration-300 animate-in fade-in slide-in-from-right-4
                            backdrop-blur-md border
                            ${toast.type === 'success' 
                                ? 'bg-emerald-500/90 border-emerald-400 text-white' 
                                : toast.type === 'error'
                                ? 'bg-rose-500/90 border-rose-400 text-white'
                                : 'bg-slate-800/90 border-slate-700 text-white'}
                        `}
                    >
                        <div className="flex-shrink-0">
                            {toast.type === 'success' ? (
                                <CheckCircle size={22} className="text-emerald-50" />
                            ) : toast.type === 'error' ? (
                                <XCircle size={22} className="text-rose-50" />
                            ) : null}
                        </div>
                        <div className="flex-grow text-sm font-medium">
                            {toast.message}
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity p-1"
                        >
                            <X size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
