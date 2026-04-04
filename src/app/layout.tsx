import type { Metadata } from "next";
import ClientLayout from "@/components/ClientLayout";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dermcare - Hệ thống phòng khám da liễu trực tuyến",
  description:
    "Đặt lịch, tư vấn và quản lý hồ sơ da liễu trực tuyến với Dermcare.",
  icons: {
    icon: "/dermcare_logo.png",
  },
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="page-shell">
        <LanguageProvider>
          <div className="flex min-h-screen flex-col">
            <ClientLayout>{children}</ClientLayout>
            <Footer />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
