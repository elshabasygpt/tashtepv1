"use client";

import * as React from "react";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { updateCartItemQuantityAction, removeCartItemAction } from "@/actions/cart.actions";

export interface CartItemType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variantLabel?: string;
  productId?: string;
  variantId?: string;
}

interface CartItemProps {
  item: CartItemType;
  /** Override for the default DB-backed update/remove (used for the guest/local cart). */
  onUpdateQuantity?: (quantity: number) => void;
  onRemove?: () => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const [isPending, startTransition] = React.useTransition();

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (onUpdateQuantity) return onUpdateQuantity(newQuantity);
    startTransition(async () => {
      await updateCartItemQuantityAction({ itemId: item.id, quantity: newQuantity });
    });
  };

  const handleRemove = () => {
    if (onRemove) return onRemove();
    startTransition(async () => {
      await removeCartItemAction({ itemId: item.id });
    });
  };

  return (
    <div className={`flex gap-4 py-4 border-b last:border-0 ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-secondary/50 flex items-center justify-center">
        {item.image ? (
          <Image src={item.image} fill sizes="96px" className="object-cover" alt={item.name} />
        ) : (
          <span className="text-xs text-muted-foreground">صورة</span>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between gap-2">
          <div>
            <h3 className="font-bold text-lg line-clamp-2">{item.name}</h3>
            {item.variantLabel && (
              <p className="text-sm text-secondary mt-0.5">{item.variantLabel}</p>
            )}
          </div>
          <p className="text-lg font-bold text-charcoal whitespace-nowrap">{item.price} ج.م</p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2 border rounded-md p-1 bg-white">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-sm"
              onClick={() => handleUpdateQuantity(item.quantity - 1)}
              disabled={item.quantity <= 1 || isPending}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-base font-medium w-8 text-center">{item.quantity}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-sm"
              onClick={() => handleUpdateQuantity(item.quantity + 1)}
              disabled={isPending}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-4">
             <span className="font-black text-xl text-tashtep-orange whitespace-nowrap hidden sm:block">
               {item.quantity * item.price} ج.م
             </span>
             <Button 
               variant="ghost" 
               size="icon" 
               className="h-10 w-10 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-full"
               onClick={handleRemove}
               disabled={isPending}
             >
               {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
