"use client";

import * as React from "react";
import { CheckoutForm } from "./checkout-form";
import { OrderSummary } from "./order-summary";
import { type CartItemType } from "@/features/cart/components/cart-item";
import { Governorate } from "@prisma/client";

interface CheckoutClientWrapperProps {
  cartItems: {
    productId: string;
    variantId?: string;
    quantity: number;
    price: number;
  }[];
  mappedItems: CartItemType[];
  defaultValues?: {
    fullName?: string;
    phone?: string;
  };
  governorates: Governorate[];
}

export function CheckoutClientWrapper({
  cartItems,
  mappedItems,
  defaultValues,
  governorates,
}: CheckoutClientWrapperProps) {
  const [shippingCost, setShippingCost] = React.useState(0);

  const handleCityChange = (cityName: string) => {
    const gov = governorates.find((g) => g.name === cityName);
    setShippingCost(gov?.shippingCost || 0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
      <div className="lg:col-span-2">
        <CheckoutForm
          cartItems={cartItems}
          defaultValues={defaultValues}
          governorates={governorates}
          onCityChange={handleCityChange}
        />
      </div>
      <div>
        <div className="lg:sticky lg:top-28 bg-stone/50 rounded-xl p-gutter border border-soft-border">
          <OrderSummary items={mappedItems} shippingCost={shippingCost} />

          <div className="mt-8 flex justify-between items-center pt-6 border-t border-surface-container-high opacity-80">
            {[
              { icon: "lock", label: "دفع مؤمّن بالكامل" },
              { icon: "local_shipping", label: "شحن لجميع المحافظات" },
              { icon: "replay", label: "إرجاع خلال 14 يوم" },
            ].map((item) => (
              <div key={item.icon} className="flex flex-col items-center gap-1 text-center">
                <span className="material-symbols-outlined text-secondary">{item.icon}</span>
                <span className="font-technical-mono text-[10px] text-secondary">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
