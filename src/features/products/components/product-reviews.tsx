"use client";

import * as React from "react";
import { Star, Loader2, BadgeCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createReviewAction } from "@/actions/review.actions";
import { useRouter } from "next/navigation";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  verifiedPurchase?: boolean;
  user: {
    name: string | null;
    image: string | null;
  };
}

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
  isAuthenticated: boolean;
}

function RatingHistogram({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  const histogram = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const pct = Math.round((count / reviews.length) * 100);
    return { star, count, pct };
  });

  return (
    <div className="flex flex-col sm:flex-row gap-6 p-5 bg-stone/40 rounded-xl border border-stone mb-6">
      <div className="flex flex-col items-center justify-center min-w-[80px] text-center">
        <span className="text-4xl font-bold text-obsidian leading-none">{avg.toFixed(1)}</span>
        <div className="flex items-center gap-0.5 mt-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`h-3.5 w-3.5 ${s <= Math.round(avg) ? "fill-tashtep-orange text-tashtep-orange" : "fill-stone text-stone"}`}
            />
          ))}
        </div>
        <span className="text-xs text-secondary mt-1">{reviews.length} تقييم</span>
      </div>

      <div className="flex-1 flex flex-col gap-1.5">
        {histogram.map(({ star, count, pct }) => (
          <div key={star} className="flex items-center gap-2 text-xs">
            <span className="w-4 text-left text-secondary shrink-0">{star}</span>
            <Star className="h-3 w-3 fill-tashtep-orange text-tashtep-orange shrink-0" />
            <div className="flex-1 bg-stone rounded-full h-2 overflow-hidden">
              <div className="bg-tashtep-orange h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <span className="w-8 text-left text-secondary shrink-0">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProductReviews({ productId, reviews, isAuthenticated }: ProductReviewsProps) {
  const router = useRouter();
  const [rating, setRating] = React.useState(5);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [comment, setComment] = React.useState("");
  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    startTransition(async () => {
      const result = await createReviewAction({ productId, rating, comment });
      if (!result?.success) {
        setError(result?.error || "حدث خطأ أثناء إضافة التقييم");
      } else {
        setRating(5);
        setComment("");
      }
    });
  };

  return (
    <div className="mt-12 bg-white p-6 rounded-2xl border border-secondary">
      <h3 className="text-2xl font-bold text-obsidian mb-6">تقييمات المنتج</h3>

      <RatingHistogram reviews={reviews} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          {reviews.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">لا توجد تقييمات حتى الآن. كن أول من يقيّم هذا المنتج!</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={review.user.image || undefined} />
                      <AvatarFallback>{review.user.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-charcoal">{review.user.name || "مستخدم"}</p>
                        {review.verifiedPurchase && (
                          <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100">
                            <BadgeCheck className="h-3 w-3" />
                            مشترٍ موثق
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-tashtep-orange text-tashtep-orange" : "fill-muted text-muted"}`} />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground mr-auto">{new Date(review.createdAt).toLocaleDateString("ar-EG")}</span>
                  </div>
                  {review.comment && <p className="text-charcoal leading-relaxed">{review.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-secondary/20 p-6 rounded-xl h-fit">
          <h4 className="font-bold text-lg mb-4">أضف تقييمك</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">التقييم</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none"
                  >
                    <Star className={`h-7 w-7 transition-colors ${star <= (hoverRating || rating) ? "fill-tashtep-orange text-tashtep-orange" : "fill-muted text-muted"}`} />
                  </button>
                ))}
                <span className="mr-2 text-sm text-secondary">
                  {["", "سيء", "مقبول", "جيد", "جيد جداً", "ممتاز"][hoverRating || rating]}
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-semibold text-charcoal mb-2">
                تعليقك <span className="font-normal text-secondary">(اختياري)</span>
              </label>
              <Textarea id="comment" placeholder="أخبرنا برأيك في هذا المنتج..." value={comment} onChange={(e) => setComment(e.target.value)} className="resize-none" rows={4} />
            </div>

            {error && <p className="text-sm text-destructive font-medium">{error}</p>}

            <Button type="submit" variant="tashtep" className="w-full" disabled={isPending}>
              {isPending ? <Loader2 className="h-5 w-5 animate-spin ml-2" /> : null}
              {isAuthenticated ? "إرسال التقييم" : "تسجيل الدخول للتقييم"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
