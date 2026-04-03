"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
    const { t } = useLanguage();

    return (
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
                        </div>
                        <p className="text-sm text-slate-600">
                            {t('footer.description')}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="ml-4">
                        <h3 className="mb-4 font-semibold text-slate-900">{t('footer.quick_links')}</h3>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li>
                                <a href="#services" className="hover:text-dermcare">{t('header.nav.services')}</a>
                            </li>
                            <li>
                                <a href="#doctors" className="hover:text-dermcare">{t('header.nav.doctors')}</a>
                            </li>
                            <li>
                                <a href="#about" className="hover:text-dermcare">{t('header.nav.about')}</a>
                            </li>
                            <li>
                                <a href="#reviews" className="hover:text-dermcare">{t('header.nav.reviews')}</a>
                            </li>
                            <li>
                                <a href="#partners" className="hover:text-dermcare">{t('header.nav.partners')}</a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="mb-4 font-semibold text-slate-900">{t('footer.contact')}</h3>
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
                                <span className="break-words leading-relaxed">
                                    Số 14, dãy A8, Thôn Giấy, Cơ khí, TT Phú Minh, Phú Xuyên, Thành phố Hà Nội, Việt Nam
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Social & Legal */}
                    <div>
                        <h3 className="mb-4 font-semibold text-slate-900">{t('footer.follow')}</h3>
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
                        </div>
                        <div className="space-y-2 text-sm text-slate-600">
                            <a href="#" className="block hover:text-dermcare">
                                {t('footer.privacy')}
                            </a>
                            <a href="#" className="block hover:text-dermcare">
                                {t('footer.terms')}
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
    );
}
