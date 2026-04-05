"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getPublicDoctors, PublicDoctor } from "@/services/doctorService";
import userService from "@/services/userService";
import { getPublicFeedbacks, PublicFeedback } from "@/services/feedbackService";
import { useRouter } from "next/navigation";
import BookingModal from "@/components/BookingModal";

export default function HomePage() {
  const { isLoggedIn, isDoctor } = useAuth();
  const { t, language } = useLanguage();
  const [doctors, setDoctors] = useState<PublicDoctor[]>([]);
  const [specializations, setSpecializations] = useState<{ specialization: string; doctorCount: number }[]>([]);
  const [feedbacks, setFeedbacks] = useState<PublicFeedback[]>([]);
  const router = useRouter();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<{ id: string, name: string, specialty: string, avatar: string, qualifications?: string } | null>(null);

  const handleBookClick = (doctor: PublicDoctor) => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setSelectedDoctor({
      id: doctor.user_id,
      name: doctor.user?.fullName || 'Bác sĩ',
      specialty: doctor.specialization || "Chưa cập nhật",
      avatar: doctor.avatar || "/default-avatar.png",
      qualifications: doctor.qualifications ?? undefined
    });
    setShowBookingModal(true);
  };

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
        const MASTER_SPECIALTIES = [
          "Da liễu Thẩm mỹ",
          "Da liễu Bệnh lý & Miễn dịch",
          "Ngoại khoa Da liễu",
          "Da liễu Nội khoa",
          "U & Ung thư da",
          "Nhiễm trùng da & Ký sinh trùng"
        ];
        
        const completeSpecializations = MASTER_SPECIALTIES.map(name => {
          const found = data.find(item => item.specialization.trim().toLowerCase() === name.trim().toLowerCase());
          return {
            specialization: found ? found.specialization : name,
            doctorCount: found ? found.doctorCount : 0
          };
        });
        
        setSpecializations(completeSpecializations);
      } catch (error) {
        console.error("Failed to fetch specializations:", error);
      }
    };
    const fetchFeedbacks = async () => {
      try {
        const data = await getPublicFeedbacks();
        setFeedbacks(data);
      } catch (error) {
        console.error("Failed to fetch feedbacks:", error);
      }
    };
    fetchDoctors();
    fetchSpecializations();
    fetchFeedbacks();
  }, []);

  return (
    <div className="flex flex-col">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-white px-4 py-8 md:py-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left - Intro */}
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full bg-dermcare-light px-3 py-1 text-xs font-medium text-dermcare-dark">
              {t('home.hero.badge')}
            </span>

            <div className="space-y-4">
              <h1 className="text-balance text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
                {t('home.hero.title')}{" "}
                <span className="text-dermcare">Dermcare</span>
              </h1>
              <p className="text-lg text-slate-600 md:text-xl">
                {t('home.hero.description')}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/huong-dan-kham"
                className="inline-flex items-center justify-center rounded-full bg-dermcare px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-dermcare-dark"
              >
                {t('home.hero.cta')}
              </Link>
            </div>

            <p className="text-sm text-slate-500">
              {t('home.hero.benefits')}
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
                          {t('home.ai.assistant')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="mb-2 text-xl font-semibold">
                    {t('home.ai.title')}
                  </h4>
                  <p className="text-sm leading-relaxed text-dermcare-light">
                    {t('home.ai.description')}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-lg">💬</span>
                    <span>{t('home.ai.features.instant')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-lg">🎯</span>
                    <span>{t('home.ai.features.diagnosis')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-lg">⚡</span>
                    <span>{t('home.ai.features.seconds')}</span>
                  </div>
                </div>

                {/* CTA - Chat Input */}
                <div className="space-y-3">
                  {isLoggedIn ? (
                    <>
                      {!isDoctor && (
                        <Link
                          href="/chat?tab=AI_CONSULTING"
                          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-4 text-sm font-bold text-dermcare shadow-lg transition-all hover:scale-[1.02] hover:bg-slate-50 active:scale-95"
                        >
                          <span className="text-lg">🔬</span>
                          <span>{t('home.ai.cta.start')}</span>
                        </Link>
                      )}
                      <Link
                        href="/chat?tab=DOCTOR_CONSULTING"
                        className={`flex w-full items-center justify-center gap-2 rounded-xl transition-all active:scale-95 ${
                          isDoctor 
                            ? "bg-white px-4 py-4 text-sm font-bold text-dermcare shadow-lg hover:scale-[1.02] hover:bg-slate-50" 
                            : "border border-white/30 bg-white/10 px-4 py-3 text-sm font-semibold hover:bg-white/20"
                        }`}
                      >
                        {!isDoctor && <span className="text-lg">💬</span>}
                        <span>{t('home.ai.cta.messages')}</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-4 text-sm font-bold text-dermcare shadow-lg transition-all hover:scale-[1.02] hover:bg-slate-50 active:scale-95"
                      >
                        <span className="text-lg">🔬</span>
                        <span>{t('home.ai.cta.start_now')}</span>
                      </Link>
                      <p className="text-center text-xs font-medium text-dermcare-light">
                        {t('home.ai.cta.login_save')}
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
              {t('home.services.title')}
            </h2>
            <p className="text-lg text-slate-600">
              {t('home.services.subtitle')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Service 1 - AI Diagnosis */}
            <div className="card-elevated p-8 group hover:border-dermcare/30 transition-all duration-300">
              <h3 className="mb-4 text-2xl font-bold text-slate-900">
                {t('home.services.ai_diagnosis.title')}
              </h3>
              <div className="space-y-3 text-slate-600">
                <p>
                  {t('home.services.ai_diagnosis.description')}
                </p>
                <ul className="space-y-2 pl-5">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-dermcare">✓</span>
                    <span>{t('home.services.ai_diagnosis.benefit1')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-dermcare">✓</span>
                    <span>{t('home.services.ai_diagnosis.benefit2')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-dermcare">✓</span>
                    <span>{t('home.services.ai_diagnosis.benefit3')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-dermcare">✓</span>
                    <span>{t('home.services.ai_diagnosis.benefit4')}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Service 2 - Doctor Consultation */}
            <div className="card-elevated p-8 group hover:border-dermcare/30 transition-all duration-300">
              <h3 className="mb-4 text-2xl font-bold text-slate-900">
                {t('home.services.doctor_consultation.title')}
              </h3>
              <div className="space-y-3 text-slate-600">
                <p>
                  {t('home.services.doctor_consultation.description')}
                </p>
                <ul className="space-y-2 pl-5">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-dermcare">✓</span>
                    <span>{t('home.services.doctor_consultation.benefit1')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-dermcare">✓</span>
                    <span>{t('home.services.doctor_consultation.benefit2')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-dermcare">✓</span>
                    <span>{t('home.services.doctor_consultation.benefit3')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-dermcare">✓</span>
                    <span>{t('home.services.doctor_consultation.benefit4')}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Service 3 - Medical Records */}
            <div className="card-elevated p-8 group hover:border-dermcare/30 transition-all duration-300">
              <h3 className="mb-4 text-2xl font-bold text-slate-900">
                {t('home.services.medical_records.title')}
              </h3>
              <div className="space-y-3 text-slate-600">
                <p>
                  {t('home.services.medical_records.description')}
                </p>
                <ul className="space-y-2 pl-5">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-dermcare">✓</span>
                    <span>{t('home.services.medical_records.benefit1')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-dermcare">✓</span>
                    <span>{t('home.services.medical_records.benefit2')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-dermcare">✓</span>
                    <span>{t('home.services.medical_records.benefit3')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-dermcare">✓</span>
                    <span>{t('home.services.medical_records.benefit4')}</span>
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
              {t('home.doctors.title')}
            </h2>
            <p className="text-lg text-slate-600">
              {t('home.doctors.subtitle')}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {doctors.length > 0 ? doctors.slice(0, 5).map((doctor, idx) => (
              <div
                key={idx}
                className="card-elevated flex flex-col overflow-hidden text-center transition hover:shadow-lg h-full rounded-2xl"
              >
                {/* Doctor Image - Slightly shorter */}
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-dermcare-light to-slate-100 flex-shrink-0">
                  <img
                    src={doctor.avatar || '/default-avatar.png'}
                    alt={doctor.user?.fullName || 'Bác sĩ'}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                
                {/* Doctor Info - Larger text, very tight spacing */}
                <div className="flex flex-col flex-1 p-3 pb-4 text-center">
                  {/* 1. Name Section - Top Aligned */}
                  <div className="min-h-[2.4rem] mb-0.5 flex items-start justify-center pt-1">
                    <h3 className="text-base font-bold text-slate-900 leading-tight line-clamp-2 uppercase">
                      {doctor.qualifications ? `${doctor.qualifications} ${doctor.user.fullName}` : (doctor.user.fullName || 'Bác sĩ')}
                    </h3>
                  </div>

                  {/* 2. Specialization Section - Top Aligned */}
                  <div className="min-h-[1.4rem] mb-0 flex items-start justify-center">
                    <p className="text-[13px] text-dermcare font-medium line-clamp-1 leading-tight">
                       {doctor.specialization || "Chuyên khoa chưa cập nhật"}
                    </p>
                  </div>

                  {/* 3. WorkPlace Section - Top Aligned */}
                  <div className="min-h-[1rem] mb-2 flex items-start justify-center">
                    <p className="text-[11.5px] text-slate-500 line-clamp-1 px-1">
                      {doctor.workPlace || "Nơi công tác chưa cập nhật"}
                    </p>
                  </div>
                  
                  <div className="mt-auto space-y-2.5">
                    <div className="flex items-center justify-center gap-1 text-[12px] bg-slate-50 py-1.5 rounded-lg border border-slate-100">
                      <span className="text-amber-500">★</span>
                      <span className="font-bold text-slate-900">
                        {doctor.rating !== undefined && doctor.rating !== null ? Number(doctor.rating).toFixed(1) : '0.0'} / 5
                      </span>
                    </div>
                    <button 
                      onClick={() => handleBookClick(doctor)}
                      className="w-full rounded-xl bg-dermcare py-2 text-sm font-bold text-white transition hover:bg-dermcare-dark shadow-soft active:scale-95">
                      {t('header.actions.book_now')}
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-12 text-slate-500 text-center">{t('home.doctors.loading')}</div>
            )}
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/doctors"
              className="inline-flex items-center gap-2 text-dermcare hover:underline"
            >
              <span className="font-medium">{t('home.doctors.view_all')}</span>
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
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
              {t('home.specialties.title')}
            </h2>
            <p className="mt-1 text-slate-600">
              {t('home.specialties.subtitle')}
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
                    <p className="text-xs opacity-80 font-medium">{specialty.doctorCount} {t('home.specialties.doctor_count')}</p>
                  </div>
                </div>
              );
            }) : (
              <div className="col-span-full py-8 text-center text-slate-400">{t('home.specialties.loading')}</div>
            )}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="bg-slate-50 px-4 py-0 overflow-hidden scroll-mt-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-3 text-center">
            <h2 className="mb-3 text-3xl font-bold text-slate-900 md:text-4xl">
              {t('home.reviews.title')}
            </h2>
            <p className="text-lg text-slate-600">
              {t('home.reviews.subtitle')}
            </p>
          </div>

          <div className="space-y-6">
            {feedbacks.length > 0 ? (
              <>
                {/* Row 1 - Scroll Left to Right */}
                <div className="relative">
                  <div className="reviews-scroll-ltr flex gap-6">
                    {[
                      ...Array(3).fill(feedbacks.slice(0, Math.ceil(feedbacks.length / 2)))
                    ].flat().map((review, idx) => (
                      <div
                        key={`${review.id}-${idx}`}
                        className="min-w-[280px] max-w-[280px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex-shrink-0 flex flex-col h-[220px]"
                      >
                        {/* Phần trên: Sao đánh giá + Nội dung */}
                        <div className="flex-1 overflow-hidden">
                          <div className="mb-2 flex gap-1">
                            {[...Array(review.rate)].map((_, i) => (
                              <span key={i} className="text-amber-400">★</span>
                            ))}
                          </div>
                          <p className="text-sm leading-relaxed text-slate-700 line-clamp-4">
                            &quot;{review.comment}&quot;
                          </p>
                        </div>
                        {/* Đường phân cách */}
                        <div className="border-t border-slate-100 my-3" />
                        {/* Phần dưới: Thông tin bệnh nhân */}
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-dermcare text-white font-semibold text-sm flex-shrink-0">
                            {review.patientName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 text-sm truncate">{review.patientName}</p>
                            <p className="text-xs text-slate-500">
                              {new Date(review.created_at).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US')}
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
                      ...Array(3).fill(feedbacks.slice(Math.ceil(feedbacks.length / 2)))
                    ].flat().map((review, idx) => (
                      <div
                        key={`${review.id}-${idx}`}
                        className="min-w-[280px] max-w-[280px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex-shrink-0 flex flex-col h-[220px]"
                      >
                        {/* Phần trên: Sao đánh giá + Nội dung */}
                        <div className="flex-1 overflow-hidden">
                          <div className="mb-2 flex gap-1">
                            {[...Array(review.rate)].map((_, i) => (
                              <span key={i} className="text-amber-400">★</span>
                            ))}
                          </div>
                          <p className="text-sm leading-relaxed text-slate-700 line-clamp-4">
                            &quot;{review.comment}&quot;
                          </p>
                        </div>
                        {/* Đường phân cách */}
                        <div className="border-t border-slate-100 my-3" />
                        {/* Phần dưới: Thông tin bệnh nhân */}
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-dermcare text-white font-semibold text-sm flex-shrink-0">
                            {review.patientName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 text-sm truncate">{review.patientName}</p>
                            <p className="text-xs text-slate-500">
                              {new Date(review.created_at).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl">
                {t('home.reviews.empty')}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="bg-white px-4 py-16">
        <div id="partners" className="mx-auto max-w-7xl pt-24 -mt-24">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-bold text-slate-900 md:text-4xl">
              {t('home.partners.title')}
            </h2>
            <p className="text-lg text-slate-600">
              {t('home.partners.subtitle')}
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

      {/* Booking Modal */}
      {selectedDoctor && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedDoctor(null);
          }}
          doctor={{
            id: selectedDoctor.id,
            name: selectedDoctor.name,
            specialty: selectedDoctor.specialty,
            avatar: selectedDoctor.avatar,
            qualifications: selectedDoctor.qualifications
          }}
        />
      )}
    </div>
  );
}
