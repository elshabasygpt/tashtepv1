"use client";

import * as React from "react";
import { ShoppingCart, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToCartAction } from "@/actions/cart.actions";
import { toggleWishlistAction } from "@/actions/wishlist.actions";
import { useRouter } from "next/navigation";

interface ProductActionsProps {
  productId: string;
}

export function ProductActions({ productId }: ProductActionsProps) {
  const router = useRouter();
  const [isPendingCart, startTransitionCart] = React.useTransition();
  const [isPendingWishlist, startTransitionWishlist] = React.useTransition();

  const handleAddToCart = () => {
    startTransitionCart(async () => {
      const result = await addToCartAction({ productId, quantity: 1 });
      if (!result?.success && result?.error) {
        router.push("/login");
      }
    });
  };

  const handleToggleWishlist = () => {
    startTransitionWishlist(async () => {
      const result = await toggleWishlistAction({ productId });
      if (!result?.success && result?.error) {
        router.push("/login");
      }
    });
  };

  return (
    <div className="flex gap-4 mt-auto">
      <Button 
        size="lg" 
        className="flex-1 rounded-full bg-obsidian text-white hover:bg-obsidian/90"
        onClick={handleAddToCart}
        disabled={isPendingCart}
      >
        {isPendingCart ? <Loader2 className="ml-2 h-5 w-5 animate-spin" /> : <ShoppingCart className="ml-2 h-5 w-5" />}
        أضف إلى السلة
      </Button>
      <Button 
        size="lg" 
        variant="outline" 
        className="rounded-full px-8 hover:text-rust hover:border-rust"
        onClick={handleToggleWishlist}
        disabled={isPendingWishlist}
      >
        {isPendingWishlist ? <Loader2 className="h-5 w-5 animate-spin" /> : <Heart className="h-5 w-5" />}
      </Button>
    </div>
  );
}
