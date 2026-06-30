import { CartService } from "@/services/cart.service";
import { getCurrentUser } from "@/lib/auth";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/features/cart/components/cart-item";
import { GuestCartView } from "@/features/cart/components/guest-cart-view";
import { CartUpsell } from "@/features/cart/components/cart-upsell";
import { Metadata } from "next";
import Link from "next/link";
import { OrderSummary } from "@/features/checkout/components/order-summary";

const TRUST_ITEMS = [
  { icon: "local_shipping", label: "شحن سريع" },
  { icon: "verified", label: "منتجات أصلية" },
  { icon: "published_with_changes", label: "إرجاع سهل" },
];

export const metadata: Metadata = {
  title: "سلة التسوق",
};

export default async function CartPage({ searchParams }: { searchParams: Promise<{ empty?: string }> }) {
  const resolvedParams = await searchParams;
  const showEmptyWarning = resolvedParams.empty === "1";
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Section className="py-macro-md md:py-macro-lg bg-white min-h-screen">
        <Container className="max-w-container-max">
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-obsidian mb-macro-sm pb-micro-md border-b border-stone">
            سلة التسوق
          </h1>
          <GuestCartView />
        </Container>
      </Section>
    );
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
        <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-obsidian mb-micro-md pb-micro-md border-b border-stone">
          سلة التسوق
        </h1>

        {showEmptyWarning && (
          <div className="mb-4 flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm">
            <span className="material-symbols-outlined text-amber-500 text-[20px]">info</span>
            <span>سلتك فارغة. أضف منتجات قبل إتمام الطلب.</span>
          </div>
        )}

        {mappedItems.length > 0 ? (
          <>
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
            <CartUpsell />
          </>
        ) : (
          <div className="py-16 text-center flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-stone/50 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-secondary">shopping_cart</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-obsidian mb-2">سلتك فارغة</h2>
              <p className="text-secondary text-sm max-w-xs mx-auto">لم تُضف أي منتجات بعد. تصفح كتالوجنا لاكتشاف خاماتنا المميزة.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/products"
                className="bg-tashtep-orange text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">grid_view</span>
                تصفح المنتجات
              </Link>
              <Link
                href="/categories"
                className="border border-soft-border text-obsidian font-medium px-8 py-3 rounded-xl hover:bg-stone/50 transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">category</span>
                الأقسام
              </Link>
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}
