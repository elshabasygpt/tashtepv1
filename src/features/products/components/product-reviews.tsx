"use client";

import * as React from "react";
import { Star, Loader2 } from "lucide-react";
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

export function ProductReviews({ productId, reviews, isAuthenticated }: ProductReviewsProps) {
  const router = useRouter();
  const [rating, setRating] = React.useState(5);
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
                      <p className="font-semibold text-charcoal">{review.user.name || "مستخدم"}</p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < review.rating ? "fill-tashtep-orange text-tashtep-orange" : "fill-muted text-muted"}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground mr-auto">{new Date(review.createdAt).toLocaleDateString("ar-EG")}</span>
                  </div>
                  {review.comment && (
                    <p className="text-charcoal leading-relaxed">{review.comment}</p>
                  )}
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
                    className="focus:outline-none"
                  >
                    <Star 
                      className={`h-6 w-6 transition-colors ${star <= rating ? "fill-tashtep-orange text-tashtep-orange" : "fill-muted text-muted hover:fill-tashtep-orange/50"}`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-semibold text-charcoal mb-2">تعليقك (اختياري)</label>
              <Textarea 
                id="comment"
                placeholder="أخبرنا برأيك في هذا المنتج..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="resize-none"
                rows={4}
              />
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
