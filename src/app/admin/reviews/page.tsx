import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { DeleteReviewButton } from "./delete-button";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ rating?: string; q?: string }>;
}) {
  const { rating, q } = await searchParams;

  const where: Record<string, unknown> = {};
  if (rating) where.rating = parseInt(rating);
  if (q) {
    where.OR = [
      { comment: { contains: q } },
      { user: { name: { contains: q } } },
      { product: { name: { contains: q } } },
    ];
  }

  const reviews = await prisma.review.findMany({
    where,
    include: {
      user: { select: { name: true, email: true } },
      product: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const totalByRating = await prisma.review.groupBy({
    by: ["rating"],
    _count: true,
    orderBy: { rating: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-headline-md font-bold text-obsidian">تقييمات المنتجات</h2>
          <span className="bg-stone text-secondary text-sm px-2.5 py-0.5 rounded-full font-medium">{reviews.length}</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Rating filter */}
          <div className="flex items-center gap-1">
            <Link href="/admin/reviews" className={`px-3 py-1.5 text-sm border rounded-lg ${!rating ? "bg-obsidian text-white border-obsidian" : "border-stone hover:bg-stone/50"}`}>الكل</Link>
            {[5, 4, 3, 2, 1].map((r) => (
              <Link key={r} href={`/admin/reviews?rating=${r}`} className={`px-3 py-1.5 text-sm border rounded-lg flex items-center gap-1 ${rating === String(r) ? "bg-obsidian text-white border-obsidian" : "border-stone hover:bg-stone/50"}`}>
                {r} <span className="text-amber-400">★</span>
              </Link>
            ))}
          </div>

          {/* Search */}
          <form method="GET" action="/admin/reviews" className="relative">
            {rating && <input type="hidden" name="rating" value={rating} />}
            <input
              type="search" name="q" defaultValue={q}
              placeholder="ابحث في التقييمات..."
              className="pl-4 pr-8 py-1.5 text-sm border border-stone rounded-lg bg-white focus:outline-none focus:border-tashtep-orange w-48"
              dir="rtl"
            />
          </form>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-3 flex-wrap">
        {totalByRating.map((g) => (
          <div key={g.rating} className="bg-white border border-stone rounded-xl px-4 py-3 flex items-center gap-2">
            <span className="text-amber-400 text-lg">{"★".repeat(g.rating)}{"☆".repeat(5 - g.rating)}</span>
            <span className="font-bold text-obsidian">{g._count}</span>
          </div>
        ))}
      </div>

      <div className="bg-white border border-stone rounded-xl overflow-hidden">
        {reviews.length === 0 ? (
          <div className="p-12 text-center text-secondary">
            <span className="material-symbols-outlined text-4xl block mb-3 opacity-40">star</span>
            لا توجد تقييمات
          </div>
        ) : (
          <div className="divide-y divide-stone/40">
            {reviews.map((review) => (
              <div key={review.id} className="px-5 py-4 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-sm text-obsidian">{review.user.name ?? "مجهول"}</span>
                    <span className="text-xs text-secondary font-technical-mono">{review.user.email}</span>
                    <span className="text-amber-400 text-sm">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                  </div>
                  <p className="text-xs text-tashtep-orange mb-1">
                    <Link href={`/products/${review.product.id}`} className="hover:underline">{review.product.name}</Link>
                  </p>
                  {review.comment && (
                    <p className="text-sm text-secondary leading-relaxed">{review.comment}</p>
                  )}
                </div>
                <div className="text-xs text-secondary shrink-0 text-left">
                  {new Date(review.createdAt).toLocaleDateString("ar-EG")}
                </div>
                <DeleteReviewButton id={review.id} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

