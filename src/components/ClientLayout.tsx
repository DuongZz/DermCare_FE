"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "./Toast";
import { SocketProvider } from "@/contexts/SocketContext";
import { VideoCallProvider } from "@/contexts/VideoCallContext";
import { VoiceCallProvider } from "@/contexts/VoiceCallContext";
import { VideoCallModal } from "./VideoCall/VideoCallModal";
import { VoiceCallModal } from "./VoiceCall/VoiceCallModal";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isChat = pathname === "/chat";

    return (
        <AuthProvider>
            <SocketProvider>
                <VideoCallProvider>
                    <VoiceCallProvider>
                        <ToastProvider>
                            {!isChat && <Header />}
                            <main className="flex-1">{children}</main>
                            <VideoCallModal />
                            <VoiceCallModal />
                        </ToastProvider>
                    </VoiceCallProvider>
                </VideoCallProvider>
            </SocketProvider>
        </AuthProvider>
    );
}
