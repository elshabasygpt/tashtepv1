"use client";

import * as React from "react";
import { ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToCartAction } from "@/actions/cart.actions";
import { useRouter } from "next/navigation";
import { type ProductVariantUI } from "./product-card";
import { WishlistButton } from "@/features/wishlist/components/wishlist-button";
import { toast } from "sonner";

interface ProductPurchasePanelProps {
  productId: string;
  productName: string;
  price: number;
  variants?: ProductVariantUI[];
}

export function ProductPurchasePanel({ productId, productName, price, variants }: ProductPurchasePanelProps) {
  const router = useRouter();
  const [isPendingCart, startTransitionCart] = React.useTransition();
  const panelRef = React.useRef<HTMLDivElement>(null);
  const [isPanelVisible, setIsPanelVisible] = React.useState(true);

  const colors = React.useMemo(() => variants?.filter((v) => v.type === "COLOR") || [], [variants]);
  const sizes = React.useMemo(() => variants?.filter((v) => v.type === "SIZE") || [], [variants]);

  const [selectedColorId, setSelectedColorId] = React.useState<string | undefined>(colors[0]?.id);
  const [selectedSizeId, setSelectedSizeId] = React.useState<string | undefined>(sizes[0]?.id);

  React.useEffect(() => {
    if (!panelRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsPanelVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(panelRef.current);
    return () => observer.disconnect();
  }, []);

  // The purchasable SKU is the size when available, otherwise the color.
  const activeVariantId = selectedSizeId || selectedColorId;
  const selectedColor = colors.find((c) => c.id === selectedColorId);

  const handleAddToCart = () => {
    startTransitionCart(async () => {
      const result = await addToCartAction({ productId, variantId: activeVariantId, quantity: 1 });
      if (result?.success) {
        toast.success("تمت الإضافة إلى السلة بنجاح", { position: "top-center" });
      } else if (result?.error) {
        toast.error("يرجى تسجيل الدخول أولاً", { position: "top-center" });
        router.push("/login");
      }
    });
  };

  return (
    <>
      <div ref={panelRef} className="flex flex-col gap-6">
        {colors.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="font-label-md text-label-md text-obsidian font-bold">
                اللون: <span className="font-normal text-secondary">{selectedColor?.label}</span>
              </span>
            </div>
            <div className="flex gap-3">
              {colors.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  aria-label={color.label}
                  onClick={() => setSelectedColorId(color.id)}
                  className={`w-11 h-11 rounded-full border shadow-sm transition-all ${
                    selectedColorId === color.id ? "ring-2 ring-offset-2 ring-obsidian" : "border-stone hover:scale-105"
                  }`}
                  style={{ backgroundColor: color.value }}
                />
              ))}
            </div>
          </div>
        )}

        {sizes.length > 0 && (
          <div>
            <span className="block font-label-md text-label-md text-obsidian font-bold mb-3">الحجم</span>
            <div className="grid grid-cols-3 gap-3">
              {sizes.map((size) => (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => setSelectedSizeId(size.id)}
                  className={`py-3 px-4 rounded font-label-md text-label-md text-center border transition-colors ${
                    selectedSizeId === size.id
                      ? "border-obsidian bg-white text-obsidian"
                      : "border-stone bg-stone text-charcoal hover:border-obsidian hover:bg-white"
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Button
            size="lg"
            className="flex-1 rounded-full bg-obsidian text-white hover:bg-obsidian/90"
            onClick={handleAddToCart}
            disabled={isPendingCart}
          >
            {isPendingCart ? <Loader2 className="ml-2 h-5 w-5 animate-spin" /> : <ShoppingCart className="ml-2 h-5 w-5" />}
            أضف إلى السلة
          </Button>
          <WishlistButton 
            productId={productId}
            variant="outline"
          />
        </div>
      </div>

      {/* Sticky Add-to-Cart Bar */}
      <div
        className={`fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-stone z-50 shadow-sm transition-transform duration-200 ease-in-out ${
          isPanelVisible ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="max-w-container-max mx-auto px-gutter py-3 flex items-center justify-between gap-4">
          <span className="font-headline-md text-[16px] text-obsidian line-clamp-1 hidden sm:block">{productName}</span>
          <div className="flex items-center gap-4 flex-1 sm:flex-none justify-between sm:justify-end">
            <span className="font-headline-md text-[18px] text-obsidian whitespace-nowrap">{price} ج.م</span>
            <Button
              size="default"
              className="rounded bg-tashtep-orange text-white hover:opacity-90"
              onClick={handleAddToCart}
              disabled={isPendingCart}
            >
              {isPendingCart ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : null}
              أضف للسلة
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
