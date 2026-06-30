import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ReturnRequestForm } from "@/features/account/components/return-request-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "طلب استرداد جديد — تشطيب" };

export default async function NewReturnPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const eligibleOrders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
      status: { in: ["DELIVERED"] },
      returnRequests: { none: {} },
    },
    select: { id: true, totalAmount: true, createdAt: true, shippingName: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-obsidian">طلب استرداد جديد</h1>
        <p className="text-sm text-secondary mt-1">يمكنك تقديم طلب استرداد للطلبات التي تم توصيلها خلال 14 يوم.</p>
      </div>
      <ReturnRequestForm eligibleOrders={eligibleOrders} />
    </div>
  );
}
