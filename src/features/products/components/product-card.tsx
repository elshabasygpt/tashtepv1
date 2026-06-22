"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Heart, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { addToCartAction } from "@/actions/cart.actions";
import { toggleWishlistAction } from "@/actions/wishlist.actions";
import { useRouter } from "next/navigation";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviewsCount: number;
  isNew?: boolean;
  description?: string;
}

interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  product: Product;
}

export function ProductCard({ product, className, ...props }: ProductCardProps) {
  const router = useRouter();
  const [isPendingCart, startTransitionCart] = React.useTransition();
  const [isPendingWishlist, startTransitionWishlist] = React.useTransition();

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startTransitionCart(async () => {
      const result = await addToCartAction({ productId: product.id, quantity: 1 });
      if (!result?.success && result?.error) {
        router.push("/login");
      }
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startTransitionWishlist(async () => {
      const result = await toggleWishlistAction({ productId: product.id });
      if (!result?.success && result?.error) {
        router.push("/login");
      }
    });
  };

  return (
    <Card className={cn("group overflow-hidden border-transparent bg-secondary/30 hover:border-border transition-all duration-300 hover:shadow-lg", className)} {...props}>
      <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-white">
        {product.image ? (
          <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div className="absolute inset-0 bg-muted/20 flex items-center justify-center">
            <span className="text-muted-foreground text-sm font-medium">صورة المنتج</span>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          {product.isNew && <Badge variant="tashtep">جديد</Badge>}
          {discount > 0 && <Badge variant="destructive" className="dir-ltr">-{discount}%</Badge>}
        </div>

        {/* Quick Actions (Hover) */}
        <div className="absolute bottom-3 left-3 translate-y-12 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 flex flex-col gap-2 z-10">
          <Button 
            size="icon" 
            variant="secondary" 
            className="rounded-full shadow-md hover:text-tashtep-orange bg-white/90 backdrop-blur-sm"
            onClick={handleToggleWishlist}
            disabled={isPendingWishlist}
          >
            {isPendingWishlist ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className="h-4 w-4" />}
            <span className="sr-only">Add to wishlist</span>
          </Button>
        </div>
      </Link>

      <CardContent className="p-5">
        <div className="mb-2 text-xs font-medium text-tashtep-orange">{product.category}</div>
        <Link href={`/products/${product.id}`} className="block mb-3 font-semibold hover:text-tashtep-orange transition-colors line-clamp-2 h-12">
          {product.name}
        </Link>
        
        <div className="flex items-center gap-1.5 mb-4">
          <Star className="h-4 w-4 fill-tashtep-orange text-tashtep-orange" />
          <span className="text-sm font-bold">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviewsCount} تقييم)</span>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-xl font-black text-obsidian">{product.price} <span className="text-sm font-normal">ج.م</span></span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">{product.originalPrice} ج.م</span>
            )}
          </div>
          <Button 
            size="icon" 
            variant="tashtep" 
            className="h-10 w-10 rounded-full shadow-md transition-transform active:scale-95 hover:scale-105"
            onClick={handleAddToCart}
            disabled={isPendingCart}
          >
            {isPendingCart ? <Loader2 className="h-5 w-5 animate-spin text-white" /> : <ShoppingCart className="h-5 w-5" />}
            <span className="sr-only">Add to cart</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
