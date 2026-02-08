"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import { AuthProvider } from "@/contexts/AuthContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isChat = pathname === "/chat";

    return (
        <AuthProvider>
            {!isChat && <Header />}
            <main className="flex-1">{children}</main>
        </AuthProvider>
    );
}
