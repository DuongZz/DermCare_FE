"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getPublicDoctors, PublicDoctor } from "@/services/doctorService";
import userService from "@/services/userService";


export default function HomePage() {
  const { isLoggedIn } = useAuth();
  const [doctors, setDoctors] = useState<PublicDoctor[]>([]);
  const [specializations, setSpecializations] = useState<{ specialization: string; doctorCount: number }[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getPublicDoctors();
        setDoctors(data);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      }
    };
    const fetchSpecializations = async () => {
      try {
        const data = await userService.getSpecializations();
        setSpecializations(data);
      } catch (error) {
        console.error("Failed to fetch specializations:", error);
      }
    };
    fetchDoctors();
    fetchSpecializations();
  }, []);

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
              <Link
                href="/huong-dan-kham"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Xem quy trình khám
              </Link>
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
                      <div className="relative flex h-14 w-14 items-center justify-center">
                        {/* Wave Effects */}
                        <div className="animate-wave absolute inset-0 rounded-full bg-white/30"></div>
                        <div className="animate-wave absolute inset-0 rounded-full bg-white/20" style={{ animationDelay: '0.5s' }}></div>

                        {/* Robot Icon */}
                        <div className="animate-float relative flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-3xl backdrop-blur border border-white/20 shadow-lg">
                          <span className="animate-sway block">🤖</span>
                        </div>
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

                {/* CTA - Chat Input */}
                <div>
                  {isLoggedIn ? (
                    <>
                      <Link
                        href="/chat"
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-dermcare transition hover:bg-dermcare-light"
                      >
                        <span>Bắt đầu chẩn đoán bệnh</span>
                        <span>🔬</span>
                      </Link>
                      <p className="mt-2 text-center text-xs text-dermcare-light">
                        Nhấn để bắt đầu tư vấn với AI 💬
                      </p>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-dermcare transition hover:bg-dermcare-light"
                      >
                        <span>Bắt đầu chẩn đoán bệnh</span>
                        <span>🔬</span>
                      </Link>
                      <p className="mt-2 text-center text-xs text-dermcare-light">
                        Chỉ cần đăng ký tài khoản và bắt đầu
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-slate-50 px-4 py-16">
        <div id="services" className="mx-auto max-w-7xl pt-12 -mt-12">
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
      <section className="bg-white px-4 py-8">
        <div id="doctors" className="mx-auto max-w-7xl pt-14 -mt-14">
          <div className="mb-6 text-center">
            <h2 className="mb-3 text-3xl font-bold text-slate-900 md:text-4xl">
              Bác sĩ tiêu biểu
            </h2>
            <p className="text-lg text-slate-600">
              Đội ngũ bác sĩ da liễu hàng đầu, giàu kinh nghiệm
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {doctors.length > 0 ? doctors.slice(0, 5).map((doctor, idx) => (
              <div
                key={idx}
                className="card-elevated flex flex-col overflow-hidden text-center transition hover:shadow-lg h-full"
              >
                <div className="relative h-44 overflow-hidden bg-gradient-to-br from-dermcare-light to-slate-100 flex-shrink-0">
                  <img
                    src={doctor.avatar || '/default-avatar.png'}
                    alt={doctor.user?.fullName || 'Bác sĩ'}
                    className="h-full w-full object-cover object-top rounded-t-2xl"
                  />
                </div>
                <div className="flex flex-col flex-1 p-4 pb-5">
                  <h3 className="mb-1 text-base font-bold text-slate-900 line-clamp-2">
                    {doctor.qualifications ? `${doctor.qualifications} ${doctor.user.fullName}` : (doctor.user.fullName || 'Bác sĩ')}
                  </h3>
                  <div className="flex-1">
                    <p className="mb-1.5 text-sm text-dermcare font-medium line-clamp-2">
                      {doctor.specialization || "Chưa cập nhật"}
                    </p>
                    <p className="mb-3 text-xs text-slate-500 line-clamp-1 flex items-center justify-center">
                      {doctor.workPlace || "Đang cập nhật"}
                    </p>
                  </div>
                  <div className="mt-auto">
                    <div className="mb-3 flex items-center justify-center gap-1 text-sm bg-slate-50 py-1.5 rounded-lg border border-slate-100">
                      <span className="text-amber-500">★</span>
                      <span className="font-bold text-slate-900">
                        {doctor.rating ? doctor.rating : '--'} / 5
                      </span>
                    </div>
                    <button className="w-full rounded-xl bg-dermcare py-2 text-sm font-semibold text-white transition hover:bg-dermcare-dark shadow-soft">
                      Đặt lịch khám
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-12 text-slate-500 text-center">Đang tải danh sách bác sĩ...</div>
            )}
          </div>

          <div className="mt-4 text-center">
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
        <div id="specialties" className="mx-auto max-w-7xl pt-24 -mt-24">
          {/* Section Header */}
          {/* Section Header */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
              Chuyên khoa
            </h2>
            <p className="mt-1 text-slate-600">
              Danh sách các chuyên khoa da liễu phổ biến
            </p>
          </div>

          {/* Grid Container */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {specializations.length > 0 ? specializations.map((specialty, idx) => {
              const colorPalette = [
                "bg-pink-50 text-pink-700 border-pink-100 group-hover:border-pink-300",
                "bg-blue-50 text-blue-700 border-blue-100 group-hover:border-blue-300",
                "bg-emerald-50 text-emerald-700 border-emerald-100 group-hover:border-emerald-300",
                "bg-amber-50 text-amber-700 border-amber-100 group-hover:border-amber-300",
                "bg-purple-50 text-purple-700 border-purple-100 group-hover:border-purple-300",
                "bg-cyan-50 text-cyan-700 border-cyan-100 group-hover:border-cyan-300",
              ];
              const color = colorPalette[idx % colorPalette.length];
              return (
                <div
                  key={idx}
                  className="group cursor-pointer transition hover:-translate-y-1 hover:scale-105 duration-300"
                >
                  <div className={`flex aspect-square h-full flex-col items-center justify-center overflow-hidden rounded-xl border p-4 text-center shadow-sm hover:shadow-lg transition-all ${color}`}>
                    <h3 className="mb-2 line-clamp-2 text-sm font-bold uppercase tracking-wide">
                      {specialty.specialization}
                    </h3>
                    <p className="text-xs opacity-80 font-medium">{specialty.doctorCount} bác sĩ</p>
                  </div>
                </div>
              );
            }) : (
              <div className="col-span-full py-8 text-center text-slate-400">Đang tải chuyên khoa...</div>
            )}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="bg-slate-50 px-4 py-0 overflow-hidden scroll-mt-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-3 text-center">
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
      <section className="bg-white px-4 py-16">
        <div id="partners" className="mx-auto max-w-7xl pt-24 -mt-24">
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
