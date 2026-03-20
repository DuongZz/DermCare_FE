import type { Metadata } from "next";
import Link from "next/link";
import ClientLayout from "@/components/ClientLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dermcare - Hệ thống phòng khám da liễu trực tuyến",
  description:
    "Đặt lịch, tư vấn và quản lý hồ sơ da liễu trực tuyến với Dermcare.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="page-shell">
        <div className="flex min-h-screen flex-col">
          <ClientLayout>{children}</ClientLayout>
          <footer id="footer" className="border-t border-slate-200 bg-slate-50">
            {/* Main Footer Content */}
            <div className="mx-auto max-w-7xl px-4 py-10">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Brand Column */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <img
                      src="/logo_dermcare.jpg"
                      alt="Dermcare"
                      className="h-12 w-auto object-contain"
                    />
                    <div className="sr-only">
                      <div className="text-lg font-bold text-dermcare">Dermcare</div>
                      <div className="text-xs text-slate-500">Hệ thống phòng khám</div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">
                    Nền tảng chăm sóc da liễu trực tuyến với công nghệ AI tiên tiến
                  </p>
                </div>

                {/* Quick Links */}
                <div className="ml-4">
                  <h3 className="mb-4 font-semibold text-slate-900">Liên kết</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>
                      <a href="#services" className="hover:text-dermcare">Dịch vụ</a>
                    </li>
                    <li>
                      <a href="#doctors" className="hover:text-dermcare">Bác sĩ</a>
                    </li>
                    <li>
                      <a href="#about" className="hover:text-dermcare">Về chúng tôi</a>
                    </li>
                    <li>
                      <a href="#reviews" className="hover:text-dermcare">Đánh giá</a>
                    </li>
                    <li>
                      <a href="#partners" className="hover:text-dermcare">Đối tác</a>
                    </li>
                  </ul>
                </div>

                {/* Contact Info */}
                <div>
                  <h3 className="mb-4 font-semibold text-slate-900">Liên hệ</h3>
                  <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0">📧</span>
                      <span className="break-words">dermcareservice@gmail.com</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0">📞</span>
                      <span>0943192828</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0">📍</span>
                      <span className="break-words leading-relaxed">Số 14, dãy A8, Thôn Giấy, Cơ khí, TT Phú Minh, Phú Xuyên, Thành phố Hà Nội, Việt Nam</span>
                    </li>
                  </ul>
                </div>

                {/* Social & Legal */}
                <div>
                  <h3 className="mb-4 font-semibold text-slate-900">Theo dõi</h3>
                  <div className="flex gap-4 mb-6">
                    <a
                      href="https://www.facebook.com/quang.duong.43913"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1877F2] hover:scale-110 transition-transform"
                      title="Facebook"
                    >
                      <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                    <a
                      href="https://www.instagram.com/iuemnhatnha/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#E4405F] hover:scale-110 transition-transform"
                      title="Instagram"
                    >
                      <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                  </div>
                  <div className="space-y-2 text-sm text-slate-600">
                    <a href="#" className="block hover:text-dermcare">
                      Chính sách bảo mật
                    </a>
                    <a href="#" className="block hover:text-dermcare">
                      Điều khoản sử dụng
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Copyright Bar */}
            <div className="border-t border-slate-200 bg-white py-4">
              <div className="mx-auto max-w-7xl px-4 text-center text-sm text-slate-500">
                © {new Date().getFullYear()} Dermcare. All rights reserved.
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
