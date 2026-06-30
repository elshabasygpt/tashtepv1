"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Governorate } from "@prisma/client";
import { useCart } from "@/hooks/useCart";
import { CheckoutClientWrapper } from "./checkout-client-wrapper";

interface GuestCheckoutViewProps {
  governorates: Governorate[];
}

export function GuestCheckoutView({ governorates }: GuestCheckoutViewProps) {
  const router = useRouter();
  const { items, isHydrated } = useCart();

  React.useEffect(() => {
    if (!isHydrated) return;
    if (items.length === 0) router.replace("/cart");
  }, [isHydrated, items.length, router]);

  if (!isHydrated || items.length === 0) return null;

  const cartItems = items.map((item) => ({
    productId: item.productId!,
    variantId: item.variantId,
    quantity: item.quantity,
    price: item.price,
  }));

  return (
    <CheckoutClientWrapper
      cartItems={cartItems}
      mappedItems={items}
      governorates={governorates}
      isGuest
    />
  );
}
