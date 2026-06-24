"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/hooks/useWishlist";
import { toggleWishlistAction } from "@/actions/wishlist.actions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface WishlistButtonProps {
  productId: string;
  className?: string;
  variant?: "floating" | "outline";
}

export function WishlistButton({ productId, className, variant = "floating" }: WishlistButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const { isWishlisted, toggleWishlist } = useWishlist();
  
  const favorited = isWishlisted(productId);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Optimistic UI update
    toggleWishlist(productId);

    startTransition(async () => {
      const result = await toggleWishlistAction({ productId });
      if (!result?.success && result?.error) {
        // Revert on error
        toggleWishlist(productId);
        router.push("/login");
      }
    });
  };

  if (variant === "outline") {
    return (
      <Button
        size="lg"
        variant="outline"
        className={cn("rounded-full px-8 hover:text-tashtep-orange hover:border-tashtep-orange transition-colors", className, favorited && "text-tashtep-orange border-tashtep-orange")}
        onClick={handleToggle}
        disabled={isPending}
        title={favorited ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
      >
        {isPending ? (
          <span className="material-symbols-outlined h-5 w-5 animate-spin">sync</span>
        ) : (
          <Heart className={cn("h-5 w-5", favorited && "fill-current")} />
        )}
      </Button>
    );
  }

  // default: floating
  return (
    <button 
      aria-label="Add to wishlist" 
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "min-w-[44px] min-h-[44px] p-2 bg-white/70 backdrop-blur-md border rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform duration-300 ease-out z-10",
        favorited ? "border-tashtep-orange" : "border-white/20",
        className
      )}
      title={favorited ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
    >
      {isPending ? (
        <span className="material-symbols-outlined text-[20px] text-charcoal animate-spin">sync</span>
      ) : (
        <span className={cn(
          "material-symbols-outlined text-[20px] transition-colors duration-300 ease-out hover:text-tashtep-orange",
          favorited ? "text-tashtep-orange" : "text-charcoal"
        )}
        style={favorited ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          favorite
        </span>
      )}
    </button>
  );
}
