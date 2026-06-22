import { CartService } from "@/services/cart.service";
import { getCurrentUser } from "@/lib/auth";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CheckoutForm } from "@/features/checkout/components/checkout-form";
import { OrderSummary } from "@/features/checkout/components/order-summary";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "إتمام الطلب",
};

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?callbackUrl=/checkout");
  }

  const cart = (await CartService.getUserCart(user.id)) as { items: unknown[] };
  const items = cart?.items || [];

  if (items.length === 0) {
    redirect("/cart");
  }

  type CartItemResponse = {
    id: string;
    productId: string;
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
        <h1 className="text-4xl font-bold text-obsidian mb-8">إتمام الطلب</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CheckoutForm cartItems={cartItemsData.map((i) => ({ productId: i.productId, quantity: i.quantity, price: i.product?.price || 0 }))} />
          </div>
          <div>
            <OrderSummary items={mappedItems} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
