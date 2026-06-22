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
    image: item.product?.images?.[0]?.url || ""
  }));

  return (
    <Section className="py-12 bg-gallery min-h-screen">
      <Container>
        <h1 className="text-4xl font-bold text-obsidian mb-8">سلة التسوق</h1>
        
        {mappedItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-2 bg-white p-6 rounded-xl shadow-sm">
              {mappedItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            <div>
              <OrderSummary items={mappedItems} />
              <Button size="lg" className="w-full rounded-full bg-obsidian text-white mt-4" asChild>
                <Link href="/checkout">متابعة الدفع</Link>
              </Button>
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
