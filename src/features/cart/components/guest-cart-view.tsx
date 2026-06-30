"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { OrderSummary } from "@/features/checkout/components/order-summary";
import { CartItem } from "./cart-item";
import { useCart } from "@/hooks/useCart";

const TRUST_ITEMS = [
  { icon: "local_shipping", label: "شحن سريع" },
  { icon: "verified", label: "منتجات أصلية" },
  { icon: "published_with_changes", label: "إرجاع سهل" },
];

export function GuestCartView() {
  const { items, updateQuantity, removeItem, isHydrated } = useCart();

  if (!isHydrated) return null;

  if (items.length === 0) {
    return (
      <EmptyState
        title="السلة فارغة"
        description="لم تقم بإضافة أي منتجات إلى سلة التسوق بعد. تصفح الكتالوج لاكتشاف خاماتنا المميزة."
      />
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-macro-sm">
      <div className="w-full lg:w-[65%] flex flex-col gap-micro-md">
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={(quantity) => updateQuantity(item.id, quantity)}
            onRemove={() => removeItem(item.id)}
          />
        ))}
      </div>
      <div className="w-full lg:w-[35%]">
        <div className="lg:sticky lg:top-28 bg-stone/50 rounded-xl p-gutter border border-soft-border">
          <OrderSummary items={items} />
          <Button size="lg" className="w-full rounded bg-obsidian text-white mt-4 h-14" asChild>
            <Link href="/checkout">إتمام الطلب</Link>
          </Button>
          <Link
            href="/products"
            className="block text-center w-full mt-3 h-14 leading-[3.5rem] border border-obsidian text-obsidian rounded font-label-md text-label-md hover:bg-white transition-colors"
          >
            متابعة التسوق
          </Link>

          <div className="mt-8 flex justify-between items-center pt-6 border-t border-surface-container-high opacity-80">
            {TRUST_ITEMS.map((item) => (
              <div key={item.icon} className="flex flex-col items-center gap-1">
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
