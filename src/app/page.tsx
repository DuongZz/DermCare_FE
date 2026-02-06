"use client";

import { useState } from "react";
import Link from "next/link";

export default function HomePage() {
  // TODO: Replace with real auth state from context/session
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="flex flex-col">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-white px-4 py-8 md:py-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left - Intro */}
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full bg-dermcare-light px-3 py-1 text-xs font-medium text-dermcare-dark">
              Chăm sóc da liễu trực tuyến • 24/7
            </span>

            <div className="space-y-4">
              <h1 className="text-balance text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
                Hệ thống phòng khám da liễu trực tuyến{" "}
                <span className="text-dermcare">Dermcare</span>
              </h1>
              <p className="text-lg text-slate-600 md:text-xl">
                Đặt lịch khám nhanh chóng, kết nối với bác sĩ da liễu hàng đầu,
                theo dõi liệu trình điều trị và lưu trữ hồ sơ da liễu của bạn
                trên một nền tảng duy nhất.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-dermcare px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-dermcare-dark"
              >
                Đặt lịch khám đầu tiên
              </Link>
              <button className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                Xem quy trình khám
              </button>
            </div>

            <p className="text-sm text-slate-500">
              ✓ Không cần xếp hàng • ✓ Bảo mật thông tin bệnh nhân
            </p>
          </div>

          {/* Right - DARA AI Card */}
          <div className="relative">
            <div className="card-elevated overflow-hidden bg-gradient-to-br from-dermcare to-dermcare-dark p-8 text-white">
              {/* Decorative gradient */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.2),_transparent_50%)]" />

              <div className="relative space-y-6">
                {/* Header */}
                <div className="flex items-start">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-2xl backdrop-blur">
                        🤖
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">DARA</h3>
                        <p className="text-xs text-dermcare-light">
                          AI Assistant • 24/7
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="mb-2 text-xl font-semibold">
                    Tư vấn với trợ lý ảo
                  </h4>
                  <p className="text-sm leading-relaxed text-dermcare-light">
                    <strong>Dermcare Artificial Intelligence Recognition Assistant</strong>
                    <br />
                    Trợ lý AI thông minh, sẵn sàng tư vấn và chẩn đoán sơ bộ
                    bệnh da của bạn 24/7
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-lg">💬</span>
                    <span>Tư vấn miễn phí ngay lập tức</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-lg">🎯</span>
                    <span>Chẩn đoán sơ bộ bằng AI</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-lg">⚡</span>
                    <span>Phản hồi trong vài giây</span>
                  </div>
                </div>

                {/* CTA */}
                {isLoggedIn ? (
                  <Link
                    href="/ai-chat"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-base font-semibold text-dermcare shadow-lg transition hover:bg-slate-50"
                  >
                    <span>Bắt đầu chat với DARA</span>
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-base font-semibold text-dermcare shadow-lg transition hover:bg-slate-50"
                  >
                    <span>Đăng nhập để bắt đầu</span>
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                  </Link>
                )}

                <div className="text-center">
                  <p className="text-sm font-semibold text-white">
                    Miễn phí 100%
                  </p>
                  {isLoggedIn ? (
                    <p className="mt-1 text-xs text-dermcare-light">
                      Bắt đầu chat ngay - Không giới hạn
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-dermcare-light">
                      Chỉ cần đăng ký tài khoản và bắt đầu
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-bold text-slate-900 md:text-4xl">
              Dịch vụ chăm sóc da
            </h2>
            <p className="text-lg text-slate-600">
              Chẩn đoán bằng AI và đặt lịch với bác sĩ da liễu
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Service 1 - AI Diagnosis */}
            <div className="card-elevated p-8">
              <div className="mb-4 text-5xl">🤖</div>
              <h3 className="mb-3 text-2xl font-bold text-slate-900">
                Chẩn đoán bằng AI
              </h3>
              <div className="space-y-3 text-slate-600">
                <p>
                  <strong>DARA AI</strong> - Trợ lý ảo thông minh được huấn luyện trên hàng triệu ca bệnh da liễu thực tế.
                </p>
                <ul className="space-y-2 pl-5">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-dermcare">✓</span>
                    <span>Phân tích hình ảnh và triệu chứng chỉ trong vài giây</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-dermcare">✓</span>
                    <span>Độ chính xác cao từ 85% trở lên tùy loại bệnh</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-dermcare">✓</span>
                    <span>Tư vấn sơ bộ và gợi ý phương pháp điều trị</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-dermcare">✓</span>
                    <span>Hoàn toàn miễn phí, không giới hạn số lần sử dụng</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Service 2 - Doctor Consultation */}
            <div className="card-elevated p-8">
              <div className="mb-4 text-5xl">👨‍⚕️</div>
              <h3 className="mb-3 text-2xl font-bold text-slate-900">
                Khám bệnh với bác sĩ chuyên môn
              </h3>
              <div className="space-y-3 text-slate-600">
                <p>
                  Đội ngũ <strong>bác sĩ da liễu hàng đầu</strong> với nhiều năm kinh nghiệm, sẵn sàng tư vấn trực tuyến 24/7.
                </p>
                <ul className="space-y-2 pl-5">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-dermcare">✓</span>
                    <span>Kết nối video call trực tuyến với bác sĩ chuyên khoa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-dermcare">✓</span>
                    <span>Tư vấn chi tiết, chẩn đoán chính xác từ chuyên gia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-dermcare">✓</span>
                    <span>Nhận đơn thuốc điện tử và hướng dẫn điều trị cụ thể</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-dermcare">✓</span>
                    <span>Theo dõi liệu trình và tái khám định kỳ tiện lợi</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Service 3 - Medical Records */}
            <div className="card-elevated p-8">
              <div className="mb-4 text-5xl">📋</div>
              <h3 className="mb-3 text-2xl font-bold text-slate-900">
                Theo dõi hồ sơ y tế
              </h3>
              <div className="space-y-3 text-slate-600">
                <p>
                  Quản lý <strong>hồ sơ sức khỏe</strong> cá nhân một cách khoa học, dễ dàng tra cứu mọi lúc mọi nơi.
                </p>
                <ul className="space-y-2 pl-5">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-dermcare">✓</span>
                    <span>Lưu trữ lịch sử khám bệnh và kết quả chẩn đoán</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-dermcare">✓</span>
                    <span>Theo dõi tiến triển bệnh qua hình ảnh và ghi chú</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-dermcare">✓</span>
                    <span>Quản lý đơn thuốc và lịch uống thuốc nhắc nhở</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-dermcare">✓</span>
                    <span>Bảo mật tuyệt đối, chỉ bạn và bác sĩ truy cập</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED DOCTORS */}
      <section id="doctors" className="bg-white px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-bold text-slate-900 md:text-4xl">
              Bác sĩ tiêu biểu
            </h2>
            <p className="text-lg text-slate-600">
              Đội ngũ bác sĩ da liễu hàng đầu, giàu kinh nghiệm
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: "TS.BS. Đào Quang Dương",
                specialty: "Ung thư da, Viêm da",
                rating: 5.0,
                reviews: 312,
                image: "/duongtro.jpg",
              },
              {
                name: "BS. Đào Quang Yê",
                specialty: "Mụn, Thẩm mỹ da",
                rating: 5.0,
                reviews: 189,
                image: "/duong.jpg",
              },
              {
                name: "BS. Cù Thị Hải Nê",
                specialty: "Viêm da, Da nhạy cảm",
                rating: 3.6,
                reviews: 234,
                image: "/yen.jpg",
              },
              {
                name: "PGS.TS. Phạm Tuấn Hịp",
                specialty: "Ung thư da, Thẩm mỹ",
                rating: 3.6,
                reviews: 428,
                image: "/hiepdan.jpg",
              },
            ].map((doctor, idx) => (
              <div
                key={idx}
                className="card-elevated overflow-hidden text-center transition hover:shadow-lg"
              >
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-dermcare-light to-slate-100">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="mb-1 text-lg font-semibold text-slate-900">
                    {doctor.name}
                  </h3>
                  <p className="mb-3 text-sm text-slate-600">
                    {doctor.specialty}
                  </p>
                  <div className="mb-4 flex items-center justify-center gap-1 text-sm">
                    <span className="text-amber-500">★</span>
                    <span className="font-semibold text-slate-900">
                      {doctor.rating}
                    </span>
                    <span className="text-slate-500">({doctor.reviews})</span>
                  </div>
                  <button className="w-full rounded-lg bg-dermcare py-2 text-sm font-semibold text-white transition hover:bg-dermcare-dark">
                    Đặt lịch khám
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/doctors"
              className="inline-flex items-center gap-2 text-dermcare hover:underline"
            >
              <span className="font-medium">Xem tất cả bác sĩ</span>
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* SPECIALTIES */}
      <section className="bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <h2 className="mb-3 text-3xl font-bold text-slate-900 md:text-4xl">
              Chuyên khoa da liễu
            </h2>
            <p className="text-lg text-slate-600">
              AI có thể chẩn đoán chính xác các bệnh sau
            </p>
          </div>

          {/* Horizontal Scroll Container */}
          <div className="relative">
            {/* Left Arrow */}
            <button
              onClick={() => {
                const container = document.getElementById('specialties-scroll');
                if (container) {
                  container.scrollBy({ left: -280, behavior: 'smooth' });
                }
              }}
              className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition hover:bg-dermcare hover:text-white md:flex items-center justify-center border border-slate-200"
              aria-label="Scroll left"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right Arrow */}
            <button
              onClick={() => {
                const container = document.getElementById('specialties-scroll');
                if (container) {
                  container.scrollBy({ left: 280, behavior: 'smooth' });
                }
              }}
              className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition hover:bg-dermcare hover:text-white md:flex items-center justify-center border border-slate-200"
              aria-label="Scroll right"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div id="specialties-scroll" className="overflow-x-auto pb-4 scrollbar-hide">
              <div className="flex gap-4 pb-2">
                {[
                  { icon: "🔥", name: "Viêm da & Eczema", accuracy: 99, doctors: 8, cases: "15K+" },
                  { icon: "💢", name: "Mụn trứng cá", accuracy: 98, doctors: 6, cases: "12K+" },
                  { icon: "⚠️", name: "Ung thư da", accuracy: 96, doctors: 4, cases: "3K+" },
                  { icon: "🍄", name: "Nấm da", accuracy: 97, doctors: 7, cases: "8K+" },
                  { icon: "🌸", name: "Vẩy nến", accuracy: 98, doctors: 5, cases: "5K+" },
                  { icon: "✨", name: "Thẩm mỹ da", accuracy: 95, doctors: 10, cases: "20K+" },
                  { icon: "🌿", name: "Da nhạy cảm", accuracy: 97, doctors: 8, cases: "10K+" },
                  { icon: "⚡", name: "Zona & Herpes", accuracy: 95, doctors: 3, cases: "4K+" },
                ].map((specialty, idx) => (
                  <div
                    key={idx}
                    className="group min-w-[260px] rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-dermcare hover:shadow-lg"
                  >
                    {/* Icon */}
                    <div className="mb-4 text-5xl">{specialty.icon}</div>

                    {/* Name */}
                    <h3 className="mb-3 text-lg font-bold text-slate-900">
                      {specialty.name}
                    </h3>

                    {/* Accuracy */}
                    <div className="mb-4 rounded-lg bg-dermcare/10 px-3 py-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-600">
                          Độ chính xác AI
                        </span>
                        <span className="text-xl font-bold text-dermcare">
                          {specialty.accuracy}%
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full bg-dermcare transition-all"
                          style={{ width: `${specialty.accuracy}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex items-center justify-between">
                        <span>👨‍⚕️ Bác sĩ</span>
                        <span className="font-semibold text-slate-900">
                          {specialty.doctors} BS
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>📊 Ca đã phân tích</span>
                        <span className="font-semibold text-slate-900">
                          {specialty.cases}
                        </span>
                      </div>
                    </div>

                    {/* Button */}
                    <button className="mt-4 w-full rounded-lg bg-slate-100 py-2 text-sm font-semibold text-slate-700 transition hover:bg-dermcare hover:text-white">
                      Xem chi tiết
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS & TRUST SIGNALS */}
      <section id="about" className="bg-white px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="mb-2 text-4xl font-bold text-dermcare">12+</p>
              <p className="text-sm text-slate-600">Bác sĩ chuyên khoa</p>
            </div>
            <div>
              <p className="mb-2 text-4xl font-bold text-dermcare">12.5K+</p>
              <p className="text-sm text-slate-600">Ca khám thành công</p>
            </div>
            <div>
              <p className="mb-2 text-4xl font-bold text-dermcare">4.9/5.0</p>
              <p className="text-sm text-slate-600">Đánh giá trung bình</p>
            </div>
            <div>
              <p className="mb-2 text-4xl font-bold text-dermcare">&lt;5 phút</p>
              <p className="text-sm text-slate-600">Thời gian chờ</p>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="bg-slate-50 px-4 py-16 overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-bold text-slate-900 md:text-4xl">
              Đánh giá từ bệnh nhân
            </h2>
            <p className="text-lg text-slate-600">
              Hàng nghìn bệnh nhân hài lòng với dịch vụ của chúng tôi
            </p>
          </div>

          <div className="space-y-6">
            {/* Row 1 - Scroll Left to Right */}
            <div className="relative">
              <div className="reviews-scroll-ltr flex gap-6">
                {[
                  ...Array(3).fill([
                    {
                      name: "Nguyễn Minh Ly",
                      age: 28,
                      location: "Hà Nội",
                      rating: 5,
                      text: "Dịch vụ tuyệt vời! AI chẩn đoán chính xác, bác sĩ tư vấn nhiệt tình. Sau 2 tuần điều trị da mụn của em đã cải thiện rõ rệt.",
                      avatar: "NL"
                    },
                    {
                      name: "Anh Khuất Bá Phúc",
                      age: 35,
                      location: "Hà Nội",
                      rating: 5,
                      text: "Tôi có vấn đề về viêm da, thăm khám trực tuyến không cần đến bệnh viện rất tiện. Bác sĩ tư vấn chi tiết, đơn thuốc hiệu quả.",
                      avatar: "KP"
                    },
                    {
                      name: "Bé Trần Minh Trang",
                      age: 6,
                      location: "TP.HCM",
                      rating: 5,
                      text: "Bé bị dị ứng da, app giúp bố mẹ theo dõi tiến triển rất tốt. AI chẩn đoán nhanh, các bác sĩ rất chuyên nghiệp.",
                      avatar: "MT"
                    },
                  ])
                ].flat().map((review, idx) => (
                  <div
                    key={idx}
                    className="min-w-[280px] max-w-[280px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex-shrink-0"
                  >
                    <div className="mb-3 flex gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <span key={i} className="text-amber-400">★</span>
                      ))}
                    </div>
                    <p className="mb-4 text-sm leading-relaxed text-slate-700">
                      "{review.text}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-dermcare text-white font-semibold">
                        {review.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{review.name}</p>
                        <p className="text-xs text-slate-500">
                          {review.age} tuổi • {review.location}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2 - Scroll Right to Left */}
            <div className="relative">
              <div className="reviews-scroll-rtl flex gap-6">
                {[
                  ...Array(3).fill([
                    {
                      name: "Bác Võ Thị Mai",
                      age: 60,
                      location: "Đà Nẵng",
                      rating: 5,
                      text: "Tôi 60 tuổi vẫn dùng app dễ dàng. Bác sĩ nhiệt tình, giải đáp tận tâm. Vấn đề zona của tôi được điều trị kịp thời.",
                      avatar: "VM"
                    },
                    {
                      name: "Phạm Văn Hùng",
                      age: 42,
                      location: "Hải Phòng",
                      rating: 5,
                      text: "Dermcare giúp tôi tiết kiệm thời gian. Không phải xếp hàng, bác sĩ tư vấn online rất tiện lợi. Đơn thuốc được giao tận nhà.",
                      avatar: "PH"
                    },
                    {
                      name: "Lê Thị Hương",
                      age: 24,
                      location: "Cần Thơ",
                      rating: 5,
                      text: "Mình từng ngại đến bệnh viện vì vấn đề da mặt. Dermcare giúp mình tự tin hơn, AI chẩn đoán chính xác, bác sĩ tư vấn kín đáo.",
                      avatar: "LH"
                    },
                  ])
                ].flat().map((review, idx) => (
                  <div
                    key={idx}
                    className="min-w-[280px] max-w-[280px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex-shrink-0"
                  >
                    <div className="mb-3 flex gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <span key={i} className="text-amber-400">★</span>
                      ))}
                    </div>
                    <p className="mb-4 text-sm leading-relaxed text-slate-700">
                      "{review.text}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-dermcare text-white font-semibold">
                        {review.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{review.name}</p>
                        <p className="text-xs text-slate-500">
                          {review.age} tuổi • {review.location}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section id="partners" className="bg-white px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-bold text-slate-900 md:text-4xl">
              Đối tác & Hợp tác
            </h2>
            <p className="text-lg text-slate-600">
              Được tin tưởng bởi các đơn vị hàng đầu
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
            {[
              { name: "Momo", logo: "/momo.png" },
              { name: "ZaloPay", logo: "/zalopay.png" },
              { name: "Facebook", logo: "/fb.png" },
              { name: "Google", logo: "/gg.jpg" },
              { name: "KMA", logo: "/kma.png" }
            ].map((partner, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6 transition hover:border-dermcare hover:shadow-md"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-16 w-auto object-contain"
                />
                <p className="mt-3 text-center text-sm font-semibold text-slate-700">{partner.name}</p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
