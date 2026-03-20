"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  doctorName?: string;
  isSubmitting?: boolean;
}

const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  doctorName = "Bác sĩ",
  isSubmitting = false,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [comment, setComment] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="mx-4 w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="relative p-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            ✕
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-dermcare/10 text-4xl shadow-inner animate-bounce-subtle">
              🌟
            </div>
            
            <h2 className="mb-2 text-2xl font-bold text-slate-900">
              Đánh giá buổi tư vấn
            </h2>
            <p className="mb-8 text-slate-500 text-sm leading-relaxed px-4">
              Cảm ơn bạn đã tin dùng Dermcare. Vui lòng chia sẻ trải nghiệm của bạn với <span className="font-semibold text-dermcare">{doctorName}</span> để giúp chúng tôi phục vụ tốt hơn.
            </p>

            {/* Stars */}
            <div className="mb-8 flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="group relative focus:outline-none"
                >
                  <Star
                    size={40}
                    className={`transition-all duration-200 ${
                      (hover || rating) >= star
                        ? "fill-yellow-400 text-yellow-400 scale-110"
                        : "text-slate-200 group-hover:text-slate-300"
                    }`}
                  />
                  {(hover || rating) >= star && (
                    <div className="absolute inset-0 animate-ping rounded-full bg-yellow-400/20" />
                  )}
                </button>
              ))}
            </div>

            {/* Label for rating */}
            <div className="mb-6 h-6">
              {rating > 0 && (
                <span className="text-sm font-bold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200 animate-in slide-in-from-bottom-2">
                  {rating === 5 ? "Tuyệt vời! 😍" : 
                   rating === 4 ? "Rất hài lòng! 😊" :
                   rating === 3 ? "Bình thường 😐" :
                   rating === 2 ? "Không hài lòng ☹️" : "Rất tệ 😡"}
                </span>
              )}
            </div>

            {/* Comment Area */}
            <div className="w-full">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Để lại lời nhắn cho bác sĩ hoặc hệ thống (không bắt buộc)..."
                className="w-full h-24 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 outline-none transition focus:border-dermcare focus:ring-2 focus:ring-dermcare/20 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="mt-8 flex w-full gap-3">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 rounded-2xl border border-slate-200 py-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 active:scale-95 disabled:opacity-50"
              >
                Để sau
              </button>
              <button
                onClick={() => onSubmit(rating, comment)}
                disabled={rating === 0 || isSubmitting}
                className="flex-2 flex-[2] rounded-2xl bg-dermcare py-4 text-sm font-bold text-white shadow-lg shadow-dermcare/20 transition hover:bg-dermcare-dark active:scale-95 disabled:bg-slate-300 disabled:shadow-none flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>Gửi đánh giá</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
