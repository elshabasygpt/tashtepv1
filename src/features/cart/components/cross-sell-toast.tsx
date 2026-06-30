"use client";

import React, { useTransition } from "react";
import Image from "next/image";
import { type Product } from "@/features/products/components/product-card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, Plus, X } from "lucide-react";
import { addToCartAction } from "@/actions/cart.actions";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useCart, guestCartItemId } from "@/hooks/useCart";

interface CrossSellToastProps {
  productName: string;
  crossSells: Product[];
  onDismiss: () => void;
}

export function CrossSellToast({ productName, crossSells, onDismiss }: CrossSellToastProps) {
  const { status } = useSession();
  const { addItem } = useCart();
  const [isPending, startTransition] = useTransition();

  const handleAddCrossSell = (product: Product) => {
    const defaultVariantId = product.variants?.[0]?.id;

    if (status !== "authenticated") {
      addItem({
        id: guestCartItemId(product.id, defaultVariantId),
        productId: product.id,
        variantId: defaultVariantId,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        variantLabel: product.variants?.[0]?.label,
      });
      toast.success(`تمت إضافة ${product.name} إلى السلة بنجاح`);
      return;
    }

    startTransition(async () => {
      const result = await addToCartAction({
        productId: product.id,
        variantId: defaultVariantId,
        quantity: 1
      });
      if (result?.success) {
        toast.success(`تمت إضافة ${product.name} إلى السلة بنجاح`);
      } else {
        toast.error(result?.error || "حدث خطأ أثناء الإضافة إلى السلة");
      }
    });
  };

  return (
    <div className="w-[350px] sm:w-[400px] flex flex-col gap-3 p-4 bg-white rounded-lg border border-stone pointer-events-auto">
      <div className="flex items-start justify-between">
        <div className="flex gap-2 items-center text-success">
          <CheckCircle2 className="w-5 h-5" />
          <p className="font-label-md text-obsidian">تمت إضافة <span className="font-bold">{productName}</span> للسلة</p>
        </div>
        <button onClick={onDismiss} className="text-secondary hover:text-obsidian p-1 rounded-full hover:bg-stone">
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {crossSells.length > 0 && (
        <div className="mt-2 border-t border-stone pt-3">
          <p className="text-[12px] font-label-md text-secondary mb-3">قد تحتاج أيضاً إلى المنتجات المكملة التالية:</p>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {crossSells.map((crossSell) => (
              <div key={crossSell.id} className="flex-shrink-0 w-[140px] border border-stone rounded p-2 flex flex-col gap-2 bg-surface-bright">
                <div className="relative w-full h-20 bg-white border border-stone rounded">
                  <Image 
                    src={crossSell.image || "https://placehold.co/400x400/f8f9fa/e9ecef.png?text=بدون+صورة"} 
                    alt={crossSell.name} 
                    fill 
                    className="object-contain p-1"
                  />
                </div>
                <div className="flex flex-col">
                  <p className="text-[11px] font-bold text-obsidian truncate" title={crossSell.name}>{crossSell.name}</p>
                  <p className="text-[11px] text-tashtep-orange">{crossSell.price} ج.م</p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-7 text-[10px] w-full p-0 flex gap-1 mt-auto"
                  onClick={() => handleAddCrossSell(crossSell)}
                  disabled={isPending}
                >
                  {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                  أضف للسلة
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
