import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductCard } from "@/features/products/components/product-card";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const wishlist = await prisma.wishlist.findFirst({
    where: { shareToken: token },
    include: { user: { select: { name: true } } },
  });
  if (!wishlist) return { title: "قائمة غير موجودة" };
  return {
    title: `قائمة أمنيات ${wishlist.user?.name ?? ""} — تشطيب`,
    description: `تصفح قائمة الأمنيات المشاركة`,
  };
}

export default async function SharedWishlistPage({ params }: Props) {
  const { token } = await params;

  const wishlist = await prisma.wishlist.findFirst({
    where: { shareToken: token },
    include: {
      user: { select: { name: true } },
      items: {
        include: {
          product: {
            select: {
              id: true, name: true, price: true, originalPrice: true,
              stock: true, isActive: true, isNew: true, rating: true,
              reviewsCount: true,
              images: { take: 1, select: { url: true } },
              category: { select: { name: true } },
            },
          },
        },
      },
    },
  });

  if (!wishlist) notFound();

  const activeItems = wishlist.items.filter(i => i.product.isActive);

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-obsidian">
            قائمة أمنيات {wishlist.user?.name ?? ""}
          </h1>
          <p className="text-secondary mt-1">{activeItems.length} منتج</p>
        </div>

        {activeItems.length === 0 ? (
          <div className="text-center py-16 text-secondary">
            <span className="material-symbols-outlined text-5xl">favorite_border</span>
            <p className="mt-3">القائمة فارغة</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {activeItems.map(item => (
              <ProductCard
                key={item.id}
                product={{
                  id: item.product.id,
                  name: item.product.name,
                  price: item.product.price,
                  originalPrice: item.product.originalPrice ?? undefined,
                  stock: item.product.stock,
                  image: item.product.images[0]?.url ?? "",
                  images: item.product.images.map(i => i.url),
                  category: item.product.category.name,
                  rating: item.product.rating,
                  reviewsCount: item.product.reviewsCount,
                  isNew: item.product.isNew,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
