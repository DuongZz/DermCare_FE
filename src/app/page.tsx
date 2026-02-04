export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-12 md:py-16">
      <section className="grid gap-10 md:grid-cols-[1.1fr_minmax(0,0.9fr)] md:items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center rounded-full bg-dermcare-light px-3 py-1 text-xs font-medium text-dermcare-dark">
            Chăm sóc da liễu trực tuyến • 24/7
          </span>
          <div className="space-y-4">
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
              Hệ thống phòng khám da liễu trực tuyến{" "}
              <span className="text-dermcare">Dermcare</span>
            </h1>
            <p className="max-w-xl text-sm text-slate-600 md:text-base">
              Đặt lịch khám nhanh chóng, kết nối với bác sĩ da liễu hàng đầu,
              theo dõi liệu trình điều trị và lưu trữ hồ sơ da liễu của bạn
              trên một nền tảng duy nhất.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="inline-flex items-center justify-center rounded-full bg-dermcare px-5 py-2 text-sm font-semibold text-white shadow-soft hover:bg-dermcare-dark">
              Đặt lịch khám đầu tiên
            </button>
            <button className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Xem quy trình khám
            </button>
            <p className="text-[11px] text-slate-500">
              Không cần xếp hàng • Bảo mật thông tin bệnh nhân
            </p>
          </div>
        </div>

        <div className="card-elevated relative overflow-hidden p-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,156,216,0.08),_transparent_55%)]" />
          <div className="relative space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Bác sĩ đang sẵn sàng
                </p>
                <p className="text-2xl font-semibold text-slate-900">
                  12 bác sĩ
                </p>
              </div>
              <div className="flex -space-x-2">
                <div className="h-9 w-9 rounded-full border-2 border-white bg-dermcare-light" />
                <div className="h-9 w-9 rounded-full border-2 border-white bg-dermcare" />
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[11px] font-medium text-slate-600">
                  +9
                </div>
              </div>
            </div>

            <div className="grid gap-3 text-xs md:grid-cols-3">
              <div className="rounded-xl border border-slate-100 bg-white/80 p-3">
                <p className="text-[11px] font-medium text-slate-500">
                  Thời gian chờ trung bình
                </p>
                <p className="mt-1 text-lg font-semibold text-emerald-600">
                  &lt; 5 phút
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-white/80 p-3">
                <p className="text-[11px] font-medium text-slate-500">
                  Ca khám trực tuyến
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  12.5K+
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-white/80 p-3">
                <p className="text-[11px] font-medium text-slate-500">
                  Mức độ hài lòng
                </p>
                <p className="mt-1 text-lg font-semibold text-amber-500">
                  4.9 / 5.0
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="services"
        className="grid gap-6 md:grid-cols-3 md:items-stretch"
      >
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900 md:text-xl">
            Dịch vụ nổi bật
          </h2>
          <p className="text-xs text-slate-600 md:text-sm">
            Các dịch vụ chuyên sâu được thiết kế riêng cho từng tình trạng da
            liễu của bạn.
          </p>
        </div>
        <div className="card-elevated p-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Khám da liễu trực tuyến
          </h3>
          <p className="mt-1 text-xs text-slate-600">
            Kết nối với bác sĩ da liễu thông qua video call bảo mật, chia sẻ
            hình ảnh và triệu chứng chi tiết.
          </p>
        </div>
        <div className="card-elevated p-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Theo dõi liệu trình
          </h3>
          <p className="mt-1 text-xs text-slate-600">
            Nhận nhắc nhở sử dụng thuốc, upload hình ảnh tiến triển và nhận góp
            ý từ bác sĩ theo từng giai đoạn.
          </p>
        </div>
      </section>
    </div>
  );
}
