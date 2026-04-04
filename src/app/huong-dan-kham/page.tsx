import Link from "next/link";

const steps = [
    {
        number: "01",
        icon: "🖥️",
        title: "Đăng ký tài khoản",
        description: "Tạo tài khoản miễn phí tại DermCare. Chỉ cần email và mật khẩu, không cần cung cấp tài liệu phức tạp.",
        details: ["Đăng ký bằng email hoặc tài khoản Google/Facebook", "Xác thực email trong vòng 2 phút", "Tài khoản được bảo mật tuyệt đối"],
        color: "from-blue-500 to-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-100",
    },
    {
        number: "02",
        icon: "🤖",
        title: "Tư vấn sơ bộ với DARA AI",
        description: "Trước khi đặt lịch, bạn có thể trao đổi với trợ lý AI DARA để mô tả triệu chứng và nhận tư vấn sơ bộ.",
        details: ["Mô tả triệu chứng bằng text hoặc hình ảnh", "AI phân tích sơ bộ và gợi ý thông tin cần chuẩn bị", "Miễn phí, không giới hạn số lần sử dụng"],
        color: "from-dermcare to-dermcare-dark",
        bg: "bg-pink-50",
        border: "border-pink-100",
    },
    {
        number: "03",
        icon: "🔍",
        title: "Chọn bác sĩ & khung giờ",
        description: "Tìm kiếm bác sĩ da liễu phù hợp theo chuyên khoa, kinh nghiệm, đánh giá. Xem lịch trống và chọn khung giờ thuận tiện nhất.",
        details: ["Lọc theo chuyên khoa, địa điểm, giá tiền", "Xem hồ sơ và đánh giá từ bệnh nhân", "Chọn ngày & giờ từ lịch trống thời gian thực"],
        color: "from-violet-500 to-violet-600",
        bg: "bg-violet-50",
        border: "border-violet-100",
    },
    {
        number: "04",
        icon: "💳",
        title: "Thanh toán phí khám",
        description: "Thanh toán an toàn qua MoMo hoặc ZaloPay. Xác nhận lịch hẹn ngay lập tức sau khi thanh toán thành công.",
        details: ["Hỗ trợ MoMo & ZaloPay", "Xác nhận lịch hẹn tức thì qua email/SMS", "Hoàn tiền nếu hủy trước 24 giờ"],
        color: "from-emerald-500 to-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-100",
    },
    {
        number: "05",
        icon: "👨‍⚕️",
        title: "Khám với bác sĩ chuyên khoa",
        description: "Vào đúng giờ đã đặt, tham gia phiên khám trực tuyến hoặc đến trực tiếp phòng khám. Bác sĩ sẽ thăm khám, chẩn đoán và tư vấn điều trị.",
        details: ["Khám video call trực tiếp với bác sĩ", "Bác sĩ xem lại kết quả AI sơ bộ trước đó", "Nhận tư vấn và chẩn đoán chính xác từ chuyên gia"],
        color: "from-amber-500 to-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-100",
    },
    {
        number: "06",
        icon: "📋",
        title: "Theo dõi sức khỏe theo lời khuyên bác sĩ",
        description: "Sau buổi khám, thực hiện đúng lộ trình điều trị và ghi chú theo hướng dẫn của bác sĩ để đạt hiệu quả tốt nhất.",
        details: ["Đọc kỹ ghi chú và lời khuyên bác sĩ trong hồ sơ", "Theo dõi tiến triển da qua ảnh chụp định kỳ", "Liên hệ lại bác sĩ nếu có dấu hiệu bất thường"],
        color: "from-slate-600 to-slate-700",
        bg: "bg-slate-50",
        border: "border-slate-200",
    },
];


const faqs = [
    {
        q: "Tôi cần chuẩn bị gì trước buổi khám?",
        a: "Bạn chỉ cần thiết bị có camera (điện thoại/máy tính) và kết nối internet ổn định. Nên chụp ảnh rõ vùng da cần khám trước để bác sĩ quan sát tốt hơn.",
    },
    {
        q: "Chi phí khám bao nhiêu?",
        a: "Chi phí được hiển thị rõ trên trang của mỗi bác sĩ trước khi bạn đặt lịch. Thông thường dao động từ 150.000đ - 500.000đ/buổi tùy chuyên khoa và bác sĩ.",
    },
    {
        q: "Tôi có thể hủy lịch không?",
        a: "Có. Bạn có thể hủy hoặc dời lịch trước 24 giờ và được hoàn tiền đầy đủ. Hủy trong vòng 24 giờ sẽ không được hoàn tiền.",
    },
    {
        q: "Đơn thuốc điện tử có giá trị pháp lý không?",
        a: "Đơn thuốc do bác sĩ DermCare cấp có đầy đủ thông tin và chữ ký số, có giá trị pháp lý tại các nhà thuốc liên kết.",
    },
    {
        q: "Thông tin cá nhân của tôi có được bảo mật không?",
        a: "Hoàn toàn bảo mật. Dữ liệu được mã hóa end-to-end, chỉ bạn và bác sĩ điều trị mới có thể truy cập hồ sơ khám bệnh.",
    },
];

export default function HuongDanKhamPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <section className="bg-gradient-to-br from-dermcare to-dermcare-dark px-4 py-16 text-white">
                <div className="mx-auto max-w-4xl text-center">
                    <span className="mb-4 inline-flex rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium backdrop-blur">
                        🏥 Hướng dẫn dành cho bệnh nhân mới
                    </span>
                    <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                        Quy trình khám tại DermCare
                    </h1>
                    <p className="mb-8 text-lg text-white/80 md:text-xl">
                        Từ đăng ký đến nhận đơn thuốc — đơn giản, nhanh chóng và an toàn.<br />
                        Chỉ cần 5 phút để hoàn tất đặt lịch với bác sĩ da liễu chuyên khoa.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-bold text-dermcare shadow-lg transition hover:bg-slate-50"
                        >
                            Đặt lịch ngay
                        </Link>
                        <Link
                            href="/doctors"
                            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-8 py-3 text-sm font-medium backdrop-blur transition hover:bg-white/20"
                        >
                            Xem danh sách bác sĩ
                        </Link>
                    </div>
                </div>
            </section>

            {/* Steps */}
            <section className="px-4 py-16">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold text-slate-900">6 bước đơn giản</h2>
                        <p className="mt-2 text-slate-500">Quy trình khám online tại DermCare từ A đến Z</p>
                    </div>

                    <div className="relative space-y-6">
                        {/* Vertical line */}
                        <div className="absolute left-8 top-12 hidden h-[calc(100%-48px)] w-0.5 bg-slate-100 md:block" />

                        {steps.map((step, idx) => (
                            <div key={idx} className={`relative flex gap-6 rounded-2xl border ${step.border} ${step.bg} p-6`}>
                                {/* Step number circle */}
                                <div className={`relative z-10 flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-lg`}>
                                    <span className="text-2xl">{step.icon}</span>
                                    <span className="text-xs font-bold opacity-80">{step.number}</span>
                                </div>

                                <div className="flex-1">
                                    <h3 className="mb-1 text-lg font-bold text-slate-900">{step.title}</h3>
                                    <p className="mb-3 text-sm text-slate-600">{step.description}</p>
                                    <ul className="space-y-1">
                                        {step.details.map((detail, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                                <span className="mt-0.5 text-dermcare">✓</span>
                                                <span>{detail}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Payment methods */}
            <section className="bg-slate-50 px-4 py-12">
                <div className="mx-auto max-w-4xl">
                    <h2 className="mb-8 text-center text-2xl font-bold text-slate-900">Phương thức thanh toán hỗ trợ</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {[
                            { name: "MoMo", logo: "/momo.png", desc: "Thanh toán qua ví điện tử MoMo, hoàn tiền trong 7 ngày làm việc nếu hủy lịch hợp lệ." },
                            { name: "ZaloPay", logo: "/zalopay.png", desc: "Thanh toán qua ZaloPay, liên kết thẻ ngân hàng nhanh chóng và bảo mật." },
                        ].map((method) => (
                            <div key={method.name} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                                <img src={method.logo} alt={method.name} className="h-12 w-12 object-contain" />
                                <div>
                                    <p className="font-semibold text-slate-900">{method.name}</p>
                                    <p className="text-sm text-slate-500">{method.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="px-4 py-16">
                <div className="mx-auto max-w-3xl">
                    <h2 className="mb-10 text-center text-2xl font-bold text-slate-900">Câu hỏi thường gặp</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="rounded-xl border border-slate-200 bg-white p-5">
                                <p className="mb-2 font-semibold text-slate-900">❓ {faq.q}</p>
                                <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-gradient-to-br from-dermcare to-dermcare-dark px-4 py-16 text-white text-center">
                <div className="mx-auto max-w-2xl">
                    <h2 className="mb-3 text-3xl font-bold">Sẵn sàng đặt lịch khám?</h2>
                    <p className="mb-8 text-white/80">Đăng ký tài khoản miễn phí và đặt lịch với bác sĩ da liễu ngay hôm nay.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/login" className="rounded-full bg-white px-8 py-3 text-sm font-bold text-dermcare shadow-lg hover:bg-slate-50 transition">
                            Bắt đầu ngay
                        </Link>
                        <Link href="/" className="rounded-full border border-white/40 bg-white/10 px-8 py-3 text-sm font-medium hover:bg-white/20 transition">
                            ← Về trang chủ
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
