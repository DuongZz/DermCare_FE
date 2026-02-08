import type { Metadata } from "next";
import Link from "next/link";
import ClientLayout from "@/components/ClientLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dermcare - Hệ thống phòng khám da liễu trực tuyến",
  description:
    "Đặt lịch, tư vấn và quản lý hồ sơ da liễu trực tuyến với Dermcare."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="page-shell">
        <div className="flex min-h-screen flex-col">
          <ClientLayout>{children}</ClientLayout>
          <footer id="footer" className="border-t border-slate-200 bg-slate-50">
            {/* Main Footer Content */}
            <div className="mx-auto max-w-7xl px-4 py-12">
              <div className="grid gap-8 md:grid-cols-4">
                {/* Brand Column */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <img
                      src="/logo.jpg"
                      alt="Dermcare"
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <div className="text-lg font-bold text-dermcare">Dermcare</div>
                      <div className="text-xs text-slate-500">Hệ thống phòng khám</div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">
                    Nền tảng chăm sóc da liễu trực tuyến với công nghệ AI tiên tiến
                  </p>
                </div>

                {/* Quick Links */}
                <div>
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
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <span>📧</span>
                      <span>dermcareservice@gmail.com</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>📞</span>
                      <span>0943192828</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>📍</span>
                      <span>Thành phố Hà Nội, Việt Nam</span>
                    </li>
                  </ul>
                </div>

                {/* Social & Legal */}
                <div>
                  <h3 className="mb-4 font-semibold text-slate-900">Theo dõi</h3>
                  <div className="flex gap-4 mb-6">
                    <a href="#" className="text-2xl hover:text-dermcare transition">
                      <span>📘</span>
                    </a>
                    <a href="#" className="text-2xl hover:text-dermcare transition">
                      <span>📷</span>
                    </a>
                    <a href="#" className="text-2xl hover:text-dermcare transition">
                      <span>🐦</span>
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
