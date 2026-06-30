"use client";

import * as React from "react";
import { ShoppingCart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { addToCartAction } from "@/actions/cart.actions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart, guestCartItemId } from "@/hooks/useCart";
import { toast } from "sonner";
import { WishlistButton } from "@/features/wishlist/components/wishlist-button";

interface ProductActionsProps {
  productId: string;
  productName: string;
  price: number;
  image: string;
  variantsCount: number;
  selectedVariantId?: string;
  className?: string;
}

export function ProductActions({
  productId,
  productName,
  price,
  image,
  variantsCount,
  selectedVariantId,
  className
}: ProductActionsProps) {
  const router = useRouter();
  const { status } = useSession();
  const { addItem } = useCart();
  const [isPendingCart, startTransitionCart] = React.useTransition();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (variantsCount > 0 && !selectedVariantId) {
      toast.error("يرجى اختيار اللون/المقاس من صفحة المنتج أولاً", { position: "bottom-center" });
      return;
    }

    if (status !== "authenticated") {
      addItem({
        id: guestCartItemId(productId, selectedVariantId),
        productId,
        variantId: selectedVariantId,
        name: productName,
        price,
        quantity: 1,
        image,
      });
      toast.success("تمت الإضافة إلى السلة بنجاح", { position: "bottom-center" });
      return;
    }

    startTransitionCart(async () => {
      const result = await addToCartAction({ productId, variantId: selectedVariantId, quantity: 1 });
      if (result?.success) {
        router.refresh();
        toast.success("تمت الإضافة إلى السلة بنجاح", { position: "bottom-center" });
      } else {
        toast.error(result?.error || "حدث خطأ أثناء الإضافة إلى السلة", { position: "bottom-center" });
      }
    });
  };

  return (
    <div className={cn("absolute bottom-4 left-0 w-full px-4 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 z-20", className)}>
      <button
        onClick={handleAddToCart}
        disabled={isPendingCart}
        className="flex-1 bg-white text-obsidian font-bold py-2 px-4 rounded-full shadow-lg hover:bg-tashtep-orange hover:text-white transition-colors flex items-center justify-center gap-2"
        aria-label="Add to cart"
      >
        {isPendingCart ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5" />}
        <span>{variantsCount > 0 ? "تحديد الخيارات" : "أضف للسلة"}</span>
      </button>
      <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
        <WishlistButton
          productId={productId}
          className="bg-white text-obsidian rounded-full w-10 h-10 shadow-lg hover:bg-error hover:text-white flex items-center justify-center transition-colors"
          variant="floating"
        />
      </div>
    </div>
  );
}
