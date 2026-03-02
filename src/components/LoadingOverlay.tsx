"use client";

interface LoadingOverlayProps {
    isLoading: boolean;
    text?: string;
}

export default function LoadingOverlay({ isLoading, text = "Đang tải" }: LoadingOverlayProps) {
    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
            <style>{`
                @keyframes wave {
                    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                    30% { transform: translateY(-12px); opacity: 1; }
                }
                .dot-wave span {
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: white;
                    animation: wave 1.4s ease-in-out infinite;
                }
                .dot-wave span:nth-child(1) { animation-delay: 0s; }
                .dot-wave span:nth-child(2) { animation-delay: 0.2s; }
                .dot-wave span:nth-child(3) { animation-delay: 0.4s; }
                .dot-wave span:nth-child(4) { animation-delay: 0.6s; }
                .dot-wave span:nth-child(5) { animation-delay: 0.8s; }
            `}</style>

            <div className="flex flex-col items-center gap-5 rounded-2xl bg-white/10 backdrop-blur-md px-10 py-8 shadow-2xl border border-white/20">
                {/* Dots wave */}
                <div className="dot-wave flex items-center gap-2">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                {/* Text */}
                <p className="text-white font-medium text-base tracking-wide">{text}...</p>
            </div>
        </div>
    );
}
