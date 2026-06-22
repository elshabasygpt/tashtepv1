import { OrdersList } from "@/features/account/components/orders-list";
import { OrderService } from "@/services/order.service";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Order } from "@prisma/client";
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
    <Container className="py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-obsidian">حسابي - الطلبات</h1>
        <OrdersList orders={orderDtos} />
      </div>
    </Container>
  );
}
