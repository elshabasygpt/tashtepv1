"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { addToCartAction } from "@/actions/cart.actions";
import { useRouter } from "next/navigation";
import { WishlistButton } from "@/features/wishlist/components/wishlist-button";
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
  image: string;
  images?: string[];
  category: string;
  rating: number;
  reviewsCount: number;
  isNew?: boolean;
  description?: string;
  variants?: ProductVariantUI[];
}

interface ProductCardProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  product: Product;
}

export function ProductCard({ product, className, ...props }: ProductCardProps) {
  const router = useRouter();
  const [isPendingCart, startTransitionCart] = React.useTransition();
  const colors = React.useMemo(() => product.variants?.filter((v) => v.type === "COLOR") || [], [product.variants]);
  const [selectedVariantId, setSelectedVariantId] = React.useState<string | undefined>(
    colors.length === 1 ? colors[0].id : undefined
  );

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (colors.length > 0 && !selectedVariantId) {
      toast.error("يرجى اختيار اللون أولاً", { position: "bottom-center" });
      return;
    }

    startTransitionCart(async () => {
      const result = await addToCartAction({ productId: product.id, variantId: selectedVariantId, quantity: 1 });
      if (result?.success) {
        toast.success("تمت الإضافة إلى السلة بنجاح", { position: "bottom-center" });
      } else if (result?.error) {
        toast.error("يرجى تسجيل الدخول أولاً", { position: "bottom-center" });
        router.push("/login");
      }
    });
  };

  return (
    <Link 
      href={`/products/${product.id}`}
      className={cn(
        "group relative w-full bg-gallery-white rounded-2xl overflow-hidden border border-stone transition-shadow duration-300 hover:shadow-[0_10px_40px_rgba(0,0,0,0.04)] flex flex-col cursor-pointer hover:-translate-y-1 transition-transform",
        className
      )}
      style={{ backgroundColor: '#FAFAF8' }}
      {...props}
    >
      {/* Image Section (70% approx, using aspect ratio) */}
      <div className="relative w-full aspect-[4/5] bg-stone overflow-hidden">
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-obsidian text-on-primary text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
              جديد
            </span>
          )}
          {discount > 0 && (
            <span className="bg-error text-on-primary text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
              خصم {discount}%
            </span>
          )}
        </div>

        {product.image ? (
          <Image 
            src={product.image} 
            alt={product.name} 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.05]" 
          />
        ) : (
          <div className="absolute inset-0 bg-stone flex flex-col items-center justify-center gap-2">
            <span className="material-symbols-outlined text-tertiary-container text-3xl">image_not_supported</span>
            <span className="text-tertiary-container text-sm font-medium">صورة المنتج</span>
          </div>
        )}

        {/* Floating Wishlist Button */}
        <WishlistButton 
          productId={product.id} 
          className="absolute top-micro-md left-micro-md" 
          variant="floating" 
        />

        {/* Quick Add Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-micro-md opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out z-10 bg-gradient-to-t from-obsidian/40 to-transparent">
          <button 
            onClick={handleAddToCart}
            disabled={isPendingCart}
            className="w-full bg-tashtep-orange text-on-primary font-label-md text-label-md py-3 rounded-lg hover:opacity-90 transition-opacity duration-300 ease-out flex items-center justify-center gap-2 h-12 min-h-[44px] shadow-md"
          >
            {isPendingCart ? (
              <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
            ) : (
              <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
            )}
            <span>أضف للسلة</span>
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-gutter flex flex-col gap-micro-xs flex-grow justify-between">
        <div>
          {/* Brand / Category */}
          <p className="font-body-md text-[13px] text-tertiary-container uppercase tracking-wider mb-1">
            {product.category}
          </p>
          {/* Product Name */}
          <h3 className="font-headline-md text-[18px] text-obsidian leading-tight line-clamp-2 mb-2">
            {product.name}
          </h3>
          
          {/* Color Swatches */}
          {colors.length > 0 && (
            <div className="flex gap-1.5 mt-2 mb-1 overflow-x-auto hide-scroll" onClick={(e) => e.preventDefault()}>
              {colors.map((color) => (
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
                    "w-6 h-6 rounded-full border shadow-sm transition-all flex-shrink-0",
                    selectedVariantId === color.id ? "ring-2 ring-offset-1 ring-obsidian" : "border-stone hover:scale-110"
                  )}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-micro-md">
          {/* Price */}
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="font-technical-mono text-[12px] text-secondary line-through">
                {new Intl.NumberFormat('ar-EG', { minimumFractionDigits: 2 }).format(product.originalPrice)} ج.م
              </span>
            )}
            <div className="flex items-baseline gap-1 text-obsidian">
              <span className="font-headline-md text-[28px] font-bold">{new Intl.NumberFormat('ar-EG', { minimumFractionDigits: 2 }).format(product.price)}</span>
              <span className="font-body-md text-[14px] font-bold">ج.م</span>
            </div>
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5 text-tashtep-orange">
              {[...Array(5)].map((_, i) => (
                <span 
                  key={i} 
                  className="material-symbols-outlined text-[14px]" 
                  style={{ fontVariationSettings: `'FILL' ${i < Math.round(product.rating) ? 1 : 0}` }}
                >
                  star
                </span>
              ))}
            </div>
            <span className="font-technical-mono text-[12px] text-secondary">
              {product.rating} ({product.reviewsCount})
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
