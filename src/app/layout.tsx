import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
          <header className="sticky top-0 z-50 border-b border-slate-100 bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
              <div className="flex items-center gap-3">
                <Link href="/" className="cursor-pointer">
                  <Image
                    src="/logo_dermcare.jpg"
                    alt="Dermcare - Phòng khám da liễu trực tuyến"
                    width={650}
                    height={180}
                    priority
                    className="h-20 w-auto"
                  />
                </Link>
                <span className="sr-only">
                  Dermcare - Phòng khám da liễu trực tuyến
                </span>
              </div>
              <nav className="hidden gap-6 text-sm text-slate-600 md:flex">
                <a href="#services" className="hover:text-dermcare">
                  Dịch vụ
                </a>
                <a href="#doctors" className="hover:text-dermcare">
                  Bác sĩ
                </a>
                <a href="#about" className="hover:text-dermcare">
                  Về chúng tôi
                </a>
                <a href="#reviews" className="hover:text-dermcare">
                  Đánh giá
                </a>
                <a href="#partners" className="hover:text-dermcare">
                  Hợp tác
                </a>
              </nav>
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="hidden rounded-full border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 md:inline-flex"
                >
                  Đăng nhập
                </Link>
                <button className="inline-flex rounded-full bg-dermcare px-4 py-1.5 text-sm font-semibold text-white shadow-soft hover:bg-dermcare-dark">
                  Đặt lịch ngay
                </button>
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-100 bg-white py-6">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-xs text-slate-500 sm:flex-row">
              <span>© {new Date().getFullYear()} Dermcare. All rights reserved.</span>
              <div className="flex gap-4">
                <a href="#" className="hover:text-dermcare">
                  Chính sách bảo mật
                </a>
                <a href="#" className="hover:text-dermcare">
                  Điều khoản sử dụng
                </a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
