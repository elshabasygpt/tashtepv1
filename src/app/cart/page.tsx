import { CartService } from "@/services/cart.service";
import { getCurrentUser } from "@/lib/auth";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/features/cart/components/cart-item";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { OrderSummary } from "@/features/checkout/components/order-summary";

const TRUST_ITEMS = [
  { icon: "local_shipping", label: "شحن سريع" },
  { icon: "verified", label: "منتجات أصلية" },
  { icon: "published_with_changes", label: "إرجاع سهل" },
];

export const metadata: Metadata = {
  title: "سلة التسوق",
};

export default async function CartPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?callbackUrl=/cart");
  }

  const cart = (await CartService.getUserCart(user.id)) as { items: unknown[] };
  const items = cart?.items || [];
  
  type CartItemResponse = {
    id: string;
    quantity: number;
    variant?: { label: string } | null;
    product?: {
      name: string;
      price: number;
      images?: Array<{ url: string }>;
    };
  };

  const cartItemsData = items as CartItemResponse[];

  const mappedItems = cartItemsData.map((item) => ({
    id: item.id,
    name: item.product?.name || "منتج بدون اسم",
    price: item.product?.price || 0,
    quantity: item.quantity,
    image: item.product?.images?.[0]?.url || "",
    variantLabel: item.variant?.label,
  }));

  return (
    <Section className="py-macro-md md:py-macro-lg bg-white min-h-screen">
      <Container className="max-w-container-max">
        <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-obsidian mb-macro-sm pb-micro-md border-b border-stone">
          سلة التسوق
        </h1>

        {mappedItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-macro-sm">
            <div className="w-full lg:w-[65%] flex flex-col gap-micro-md">
              {mappedItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            <div className="w-full lg:w-[35%]">
              <div className="lg:sticky lg:top-28 bg-stone/50 rounded-xl p-gutter border border-soft-border">
                <OrderSummary items={mappedItems} />
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
        ) : (
          <EmptyState
            title="السلة فارغة"
            description="لم تقم بإضافة أي منتجات إلى سلة التسوق بعد. تصفح الكتالوج لاكتشاف خاماتنا المميزة."
          />
        )}
      </Container>
    </Section>
  );
}
