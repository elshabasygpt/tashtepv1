"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, ShoppingCart, ExternalLink } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { addToCartAction } from "@/actions/cart.actions";
import { useCart, guestCartItemId } from "@/hooks/useCart";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Product, ProductVariantUI } from "./product-card";

interface QuickViewModalProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickViewModal({ product, open, onOpenChange }: QuickViewModalProps) {
  const router = useRouter();
  const { status } = useSession();
  const { addItem } = useCart();
  const [isPendingCart, startTransitionCart] = React.useTransition();

  const colors = product.variants?.filter((v: ProductVariantUI) => v.type === "COLOR") || [];
  const sizes = product.variants?.filter((v: ProductVariantUI) => v.type === "SIZE") || [];
  const [selectedVariantId, setSelectedVariantId] = React.useState<string | undefined>(
    colors.length === 1 ? colors[0].id : undefined
  );

  const effectivePrice = product.salePrice ?? product.price;
  const comparePrice = product.salePrice ? product.price : product.originalPrice;
  const discount = comparePrice
    ? Math.round(((comparePrice - effectivePrice) / comparePrice) * 100)
    : 0;

  const variantsCount = colors.length + sizes.length;

  function handleAddToCart() {
    if (variantsCount > 0 && !selectedVariantId) {
      toast.error("يرجى اختيار الخيار المناسب أولاً", { position: "bottom-center" });
      return;
    }

    if (status !== "authenticated") {
      addItem({
        id: guestCartItemId(product.id, selectedVariantId),
        productId: product.id,
        variantId: selectedVariantId,
        name: product.name,
        price: effectivePrice,
        quantity: 1,
        image: product.image,
      });
      toast.success("تمت الإضافة إلى السلة بنجاح", { position: "bottom-center" });
      onOpenChange(false);
      return;
    }

    startTransitionCart(async () => {
      const result = await addToCartAction({ productId: product.id, variantId: selectedVariantId, quantity: 1 });
      if (result?.success) {
        router.refresh();
        toast.success("تمت الإضافة إلى السلة بنجاح", { position: "bottom-center" });
        onOpenChange(false);
      } else {
        toast.error(result?.error || "حدث خطأ أثناء الإضافة إلى السلة", { position: "bottom-center" });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 h-full">
          {/* Image */}
          <div className="relative aspect-square sm:aspect-auto bg-[#F5F3F0] min-h-[240px]">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-stone-400">category</span>
              </div>
            )}
            {discount > 0 && (
              <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                خصم {discount}%
              </span>
            )}
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[80vh] sm:max-h-none">
            <div>
              <p className="text-xs text-secondary font-medium mb-1">{product.category}</p>
              <h2 className="text-lg font-bold text-obsidian leading-snug">{product.name}</h2>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-obsidian tabular-nums">
                {new Intl.NumberFormat("ar-EG").format(effectivePrice)}
              </span>
              <span className="text-sm font-bold text-secondary">ج.م</span>
              {comparePrice && (
                <span className="text-sm text-secondary line-through tabular-nums">
                  {new Intl.NumberFormat("ar-EG").format(comparePrice)} ج.م
                </span>
              )}
            </div>

            {/* Rating */}
            {product.reviewsCount > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-secondary">
                <span className="text-amber-400">★</span>
                <span>{product.rating.toFixed(1)}</span>
                <span>({product.reviewsCount} تقييم)</span>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <p className="text-sm text-secondary leading-relaxed line-clamp-3">
                {product.description}
              </p>
            )}

            {/* Color variants */}
            {colors.length > 0 && (
              <div>
                <p className="text-xs font-bold text-obsidian mb-2">اللون</p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      aria-label={color.label}
                      title={color.label}
                      onClick={() => setSelectedVariantId(color.id)}
                      className={cn(
                        "w-7 h-7 rounded-full border-2 transition-all",
                        selectedVariantId === color.id
                          ? "ring-2 ring-offset-1 ring-tashtep-orange border-transparent"
                          : "border-white shadow-sm hover:scale-110"
                      )}
                      style={{ backgroundColor: color.value }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size variants */}
            {sizes.length > 0 && (
              <div>
                <p className="text-xs font-bold text-obsidian mb-2">الحجم / المقاس</p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setSelectedVariantId(size.id)}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium border transition-all",
                        selectedVariantId === size.id
                          ? "bg-obsidian text-white border-obsidian"
                          : "bg-white text-obsidian border-stone hover:border-obsidian"
                      )}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock */}
            {product.stock === 0 && (
              <p className="text-sm font-bold text-red-500">نفد من المخزون</p>
            )}
            {product.stock !== undefined && product.stock > 0 && product.stock <= 5 && (
              <p className="text-sm font-bold text-amber-600">كميات محدودة — {product.stock} قطع متبقية</p>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-2 mt-auto pt-2">
              <Button
                variant="tashtep"
                className="w-full h-11 gap-2"
                disabled={isPendingCart || product.stock === 0}
                onClick={handleAddToCart}
              >
                {isPendingCart ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShoppingCart className="w-4 h-4" />
                )}
                {product.stock === 0 ? "نفد من المخزون" : variantsCount > 0 && !selectedVariantId ? "اختر خياراتك" : "أضف للسلة"}
              </Button>
              <Link
                href={`/products/${product.id}`}
                onClick={() => onOpenChange(false)}
                className="flex items-center justify-center gap-1.5 text-sm text-secondary hover:text-obsidian transition-colors py-2"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                عرض الصفحة الكاملة
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
