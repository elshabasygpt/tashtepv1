import { CartService } from "@/services/cart.service";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GovernorateService } from "@/services/governorate.service";
import { LoyaltyService } from "@/services/loyalty.service";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CheckoutClientWrapper } from "@/features/checkout/components/checkout-client-wrapper";
import { GuestCheckoutView } from "@/features/checkout/components/guest-checkout-view";
import { CheckoutStepper } from "@/features/checkout/components/checkout-stepper";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "إتمام الطلب",
};

export default async function CheckoutPage() {
  const user = await getCurrentUser();

  if (!user) {
    const governorates = await GovernorateService.getGovernorates(true);
    return (
      <Section className="py-macro-md md:py-macro-lg bg-white min-h-screen">
        <Container className="max-w-container-max">
          <CheckoutStepper currentStep={1} />
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-obsidian mb-macro-sm pb-micro-md border-b border-stone">
            إتمام الطلب
          </h1>
          <GuestCheckoutView governorates={governorates} />
        </Container>
      </Section>
    );
  }

  const [cart, dbUser, governorates, loyaltyBalance] = await Promise.all([
    CartService.getUserCart(user.id) as Promise<{ items: unknown[] }>,
    prisma.user.findUnique({ where: { id: user.id }, select: { phone: true } }),
    GovernorateService.getGovernorates(true),
    LoyaltyService.getBalance(user.id),
  ]);

  const items = cart?.items || [];

  if (items.length === 0) {
    redirect("/cart?empty=1");
  }

  type CartItemResponse = {
    id: string;
    productId: string;
    variantId?: string | null;
    variant?: { label: string } | null;
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
    image: item.product?.images?.[0]?.url || "",
    variantLabel: item.variant?.label,
  }));

  const checkoutFormCartItems = cartItemsData.map((i) => ({
    productId: i.productId,
    variantId: i.variantId || undefined,
    quantity: i.quantity,
    price: i.product?.price || 0,
  }));

  return (
    <Section className="py-macro-md md:py-macro-lg bg-white min-h-screen">
      <Container className="max-w-container-max">
        <CheckoutStepper currentStep={1} />
        <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-obsidian mb-macro-sm pb-micro-md border-b border-stone">
          إتمام الطلب
        </h1>
        <CheckoutClientWrapper
          cartItems={checkoutFormCartItems}
          mappedItems={mappedItems}
          defaultValues={{
            fullName: user.name || "",
            phone: dbUser?.phone || "",
          }}
          governorates={governorates}
          loyaltyBalance={loyaltyBalance}
        />
      </Container>
    </Section>
  );
}
