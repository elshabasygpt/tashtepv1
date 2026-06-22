"use client";

import * as React from "react";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toggleWishlistAction } from "@/actions/wishlist.actions";
import { useRouter } from "next/navigation";

interface WishlistButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  productId: string;
  initialIsWishlisted?: boolean;
}

export function WishlistButton({ productId, initialIsWishlisted = false, className, ...props }: WishlistButtonProps) {
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = React.useState(initialIsWishlisted);
  const [isPending, startTransition] = React.useTransition();

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await toggleWishlistAction({ productId });
      if (result?.success) {
        setIsWishlisted(result.data?.isAdded ?? false);
      } else {
        if (result?.error) router.push("/login");
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleWishlist}
      disabled={isPending}
      className={cn("rounded-full transition-all duration-300", className)}
      {...props}
    >
      {isPending ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Heart className={cn("h-5 w-5 transition-all duration-300", isWishlisted ? "fill-destructive text-destructive scale-110" : "text-muted-foreground")} />
      )}
      <span className="sr-only">
        {isWishlisted ? "إزالة من المفضلة" : "إضافة للمفضلة"}
      </span>
    </Button>
  );
}
