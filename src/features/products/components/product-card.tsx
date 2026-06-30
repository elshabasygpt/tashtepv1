"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ProductActions } from "./product-actions";
import { QuickViewModal } from "./quick-view-modal";
import { useCompare } from "@/hooks/use-compare";
import { useWishlist } from "@/hooks/useWishlist";
import { toggleWishlistAction } from "@/actions/wishlist.actions";
import { toast } from "sonner";

export interface ProductVariantUI {
  id: string;
  type: "COLOR" | "SIZE";
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  stock?: number;
  image: string;
  images?: string[];
  category: string;
  brand?: { name: string; slug: string; image?: string };
  rating: number;
  reviewsCount: number;
  isNew?: boolean;
  description?: string;
  variants?: ProductVariantUI[];
  crossSells?: Product[];
  salePrice?: number | null;
  saleEndAt?: Date | string | null;
  oemNumber?: string | null;
  unitLabel?: string | null;
  unitSize?: number | null;
  deliveryDays?: string | null;
  maxOrderQty?: number | null;
  specs?: string | null;
}

interface ProductCardProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  product: Product;
}

function StarRating({ rating, count, id }: { rating: number; count: number; id: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg key={star} className="w-3 h-3" viewBox="0 0 20 20">
            <defs>
              <linearGradient id={`star-${id}-${star}`} x1="0" x2="1" y1="0" y2="0">
                <stop offset={`${Math.min(1, Math.max(0, rating - star + 1)) * 100}%`} stopColor="#F59E0B" />
                <stop offset={`${Math.min(1, Math.max(0, rating - star + 1)) * 100}%`} stopColor="#D1D5DB" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#star-${id}-${star})`}
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        ))}
      </div>
      <span className="text-[11px] text-secondary tabular-nums">
        {rating.toFixed(1)} <span className="text-stone-400">({count})</span>
      </span>
    </div>
  );
}

export function ProductCard({ product, className, ...props }: ProductCardProps) {
  const colors = React.useMemo(
    () => product.variants?.filter((v) => v.type === "COLOR") || [],
    [product.variants]
  );
  const [selectedVariantId, setSelectedVariantId] = React.useState<string | undefined>(
    colors.length === 1 ? colors[0].id : undefined
  );
  const { add, remove, has } = useCompare();
  const inCompare = has(product.id);
  const { toggleWishlist, isWishlisted } = useWishlist();
  const inWishlist = isWishlisted(product.id);
  const [, startWishlistTransition] = React.useTransition();
  const [quickViewOpen, setQuickViewOpen] = React.useState(false);
  const router = useRouter();

  function handleCompare(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      remove(product.id);
    } else {
      add({ id: product.id, name: product.name, price: product.price, image: product.image, category: product.category });
    }
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const willAdd = !isWishlisted(product.id); // read live state, not stale closure
    toggleWishlist(product.id); // optimistic
    toast[willAdd ? "success" : "info"](
      willAdd ? "أُضيف للمفضلة" : "أُزيل من المفضلة",
      willAdd ? { description: product.name, duration: 2000 } : { duration: 1500 }
    );
    startWishlistTransition(async () => {
      const result = await toggleWishlistAction({ productId: product.id });
      if (!result?.success) {
        toggleWishlist(product.id); // revert
        if (result?.unauthorized) router.push("/login");
      }
    });
  }

  const effectivePrice = product.salePrice ?? product.price;
  const comparePrice = product.salePrice ? product.price : product.originalPrice;
  const discount = comparePrice
    ? Math.round(((comparePrice - effectivePrice) / comparePrice) * 100)
    : 0;

  const hasImage = Boolean(product.image);

  return (
    <>
    <Link
      href={`/products/${product.id}`}
      className={cn(
        "group relative flex flex-col bg-white rounded-2xl overflow-hidden",
        "border border-stone/60 hover:border-stone",
        "shadow-sm hover:shadow-lg",
        "transition-all duration-300 ease-out hover:-translate-y-1",
        className
      )}
      {...props}
    >
      {/* ── Image ────────────────────────────────────────── */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#F5F3F0]">

        {/* Badges */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 items-end">
          {product.isNew && (
            <span className="bg-obsidian text-white text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full shadow">
              جديد
            </span>
          )}
          {discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full shadow">
              خصم {discount}%
            </span>
          )}
        </div>

        {/* Action badges top-left */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          <button
            onClick={handleWishlist}
            aria-label={inWishlist ? "إزالة من المفضلة" : "إضافة للمفضلة"}
            title={inWishlist ? "إزالة من المفضلة" : "إضافة للمفضلة"}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shadow transition-all",
              inWishlist
                ? "bg-red-500 text-white opacity-100"
                : "bg-white/80 backdrop-blur-sm text-secondary opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
            )}
          >
            <span className="material-symbols-outlined text-[15px]"
              style={{ fontVariationSettings: inWishlist ? "'FILL' 1" : "'FILL' 0" }}>
              favorite
            </span>
          </button>
          <button
            onClick={handleCompare}
            aria-label={inCompare ? "إزالة من المقارنة" : "إضافة للمقارنة"}
            title={inCompare ? "إزالة من المقارنة" : "إضافة للمقارنة"}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shadow transition-all",
              inCompare
                ? "bg-tashtep-orange text-white opacity-100"
                : "bg-white/80 backdrop-blur-sm text-secondary opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
            )}
          >
            <span className="material-symbols-outlined text-[15px]">compare_arrows</span>
          </button>
        </div>

        {hasImage ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#F5F3F0] to-[#EAE6E0]">
            <div className="w-16 h-16 rounded-2xl bg-white/60 flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-3xl text-stone-400">category</span>
            </div>
            <span className="text-xs text-stone-400 font-medium">{product.category}</span>
          </div>
        )}

        {/* Quick actions on hover */}
        <ProductActions
          productId={product.id}
          productName={product.name}
          price={effectivePrice}
          image={product.image}
          variantsCount={colors.length + (product.variants?.filter((v) => v.type === "SIZE").length || 0)}
          selectedVariantId={selectedVariantId}
        />

        {/* Quick view button */}
        <button
          type="button"
          aria-label="عرض سريع"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setQuickViewOpen(true);
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm text-obsidian text-xs font-bold px-3 py-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 whitespace-nowrap hover:bg-tashtep-orange hover:text-white"
        >
          عرض سريع
        </button>

        {/* Bottom gradient for readability */}
        {hasImage && (
          <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        )}
      </div>

      {/* ── Content ──────────────────────────────────────── */}
      <div className="flex flex-col gap-2 p-4 flex-grow">

        {/* Category + Brand */}
        <div className="flex items-center gap-1.5 text-[11px] text-secondary font-medium">
          <span>{product.category}</span>
          {product.brand && (
            <>
              <span className="text-stone-300">·</span>
              <span className="text-tashtep-orange">{product.brand.name}</span>
            </>
          )}
        </div>

        {/* Product name */}
        <h3 className="text-sm font-bold text-obsidian leading-snug line-clamp-2 flex-grow">
          {product.name}
        </h3>

        {/* Color swatches */}
        {colors.length > 0 && (
          <div
            className="flex gap-1.5 overflow-x-auto hide-scroll"
            onClick={(e) => e.preventDefault()}
          >
            {colors.slice(0, 6).map((color) => (
              <button
                key={color.id}
                type="button"
                aria-label={color.label}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedVariantId(color.id);
                }}
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all",
                  selectedVariantId === color.id
                    ? "ring-2 ring-offset-1 ring-tashtep-orange border-transparent"
                    : "border-white shadow-sm hover:scale-110"
                )}
                style={{ backgroundColor: color.value }}
                title={color.label}
              />
            ))}
            {colors.length > 6 && (
              <span className="text-[10px] text-secondary self-center">+{colors.length - 6}</span>
            )}
          </div>
        )}

        {/* Rating */}
        <StarRating rating={product.rating} count={product.reviewsCount} id={product.id} />

        {/* Divider */}
        <div className="border-t border-stone/50" />

        {/* Price */}
        <div className="flex items-end justify-between gap-2">
          <div className="flex flex-col">
            {comparePrice && (
              <span className="text-[11px] text-secondary line-through leading-none mb-0.5">
                {new Intl.NumberFormat("ar-EG").format(comparePrice)} ج.م
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-obsidian tabular-nums">
                {new Intl.NumberFormat("ar-EG").format(effectivePrice)}
              </span>
              <span className="text-xs font-bold text-secondary">ج.م</span>
            </div>
          </div>

          {/* Stock badge */}
          {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full self-center">
              {product.stock} فقط
            </span>
          )}
          {product.stock === 0 && (
            <span className="text-[10px] font-bold text-red-500 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full self-center">
              نفذ
            </span>
          )}
        </div>
      </div>
    </Link>

    <QuickViewModal
      product={product}
      open={quickViewOpen}
      onOpenChange={setQuickViewOpen}
    />
    </>
  );
}
