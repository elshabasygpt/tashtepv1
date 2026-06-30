import { OrdersList } from "@/features/account/components/orders-list";
import { OrderService } from "@/services/order.service";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Order } from "@prisma/client";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";

// For build compatibility with db-reliant pages
export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch actual orders from DB
  const orders = await OrderService.getUserOrders(user.id) as Order[];

  // Map to the DTO expected by the component
  const orderDtos = orders.map((o) => ({
    id: o.id,
    createdAt: o.createdAt,
    totalAmount: o.totalAmount,
    status: o.status,
    paymentStatus: o.paymentStatus,
  }));

  return (
    <Section className="py-macro-md bg-white min-h-[60vh]">
      <Container className="max-w-4xl">
        <div className="flex items-center gap-3 mb-macro-sm">
          <span className="material-symbols-outlined text-tashtep-orange text-2xl">receipt_long</span>
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-obsidian">طلباتي</h1>
          {orderDtos.length > 0 && (
            <span className="bg-tashtep-orange/10 text-tashtep-orange text-sm font-bold px-2.5 py-0.5 rounded-full">
              {orderDtos.length}
            </span>
          )}
        </div>
        <OrdersList orders={orderDtos} />
      </Container>
    </Section>
  );
}
