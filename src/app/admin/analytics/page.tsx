import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LowStockAlertButton } from "@/components/admin/low-stock-alert-button";

export const dynamic = "force-dynamic";
export const metadata = { title: "التحليلات — تشطيب أدمن" };

function fmt(n: number) {
  return new Intl.NumberFormat("ar-EG", { minimumFractionDigits: 0 }).format(n);
}
function fmtMoney(n: number) {
  return new Intl.NumberFormat("ar-EG", { minimumFractionDigits: 2 }).format(n);
}

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user || !["ADMIN", "MANAGER"].includes((session.user as { role?: string }).role ?? "")) {
    redirect("/admin");
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  const [
    totalRevenue,
    monthRevenue,
    lastMonthRevenue,
    totalOrders,
    monthOrders,
    pendingOrders,
    totalUsers,
    newUsersMonth,
    topProducts,
    ordersByStatus,
    ordersByCity,
    lowStockCount,
    revenueByDay,
  ] = await Promise.all([
    prisma.order.aggregate({ _sum: { totalAmount: true }, where: { paymentStatus: "PAID" } }),
    prisma.order.aggregate({ _sum: { totalAmount: true }, where: { paymentStatus: "PAID", createdAt: { gte: startOfMonth } } }),
    prisma.order.aggregate({ _sum: { totalAmount: true }, where: { paymentStatus: "PAID", createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
    prisma.order.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
    prisma.order.groupBy({
      by: ["shippingCity"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    }),
    prisma.product.count({ where: { isActive: true, stock: { lte: 5 } } }),
    prisma.order.findMany({
      where: { paymentStatus: "PAID", createdAt: { gte: startOfMonth } },
      select: { createdAt: true, totalAmount: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  // Enrich top products with names
  const productIds = topProducts.map(p => p.productId);
  const productNames = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true },
  });
  const nameMap = new Map(productNames.map(p => [p.id, p.name]));

  const thisMonth = monthRevenue._sum.totalAmount ?? 0;
  const lastMonth = lastMonthRevenue._sum.totalAmount ?? 0;
  const growth = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0;

  // Aggregate revenue by day
  const dailyMap = new Map<string, number>();
  for (const o of revenueByDay) {
    const day = o.createdAt.toISOString().slice(0, 10);
    dailyMap.set(day, (dailyMap.get(day) ?? 0) + o.totalAmount);
  }
  const dailyRevenue = Array.from(dailyMap.entries());
  const maxDaily = Math.max(...dailyRevenue.map(d => d[1]), 1);

  const statusLabels: Record<string, string> = {
    PENDING: "قيد الانتظار", PROCESSING: "قيد التجهيز",
    SHIPPED: "في الطريق", DELIVERED: "مُسلَّم", CANCELLED: "ملغي",
  };
  const statusColors: Record<string, string> = {
    PENDING: "bg-amber-400", PROCESSING: "bg-blue-400",
    SHIPPED: "bg-purple-400", DELIVERED: "bg-green-500", CANCELLED: "bg-red-400",
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-obsidian">التحليلات</h1>
        <a
          href="/api/admin/export/orders"
          className="inline-flex items-center gap-2 bg-tashtep-orange text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          تصدير CSV
        </a>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "إجمالي الإيرادات", value: `${fmtMoney(totalRevenue._sum.totalAmount ?? 0)} ج.م`, icon: "payments", color: "text-green-600" },
          { label: "إيرادات الشهر", value: `${fmtMoney(thisMonth)} ج.م`, icon: "trending_up", color: growth >= 0 ? "text-green-600" : "text-red-600", sub: `${growth >= 0 ? "+" : ""}${growth.toFixed(1)}% عن الشهر الماضي` },
          { label: "إجمالي الطلبات", value: fmt(totalOrders), icon: "shopping_bag", color: "text-blue-600", sub: `${monthOrders} هذا الشهر` },
          { label: "طلبات معلقة", value: fmt(pendingOrders), icon: "pending", color: pendingOrders > 20 ? "text-red-600" : "text-amber-600" },
          { label: "إجمالي المستخدمين", value: fmt(totalUsers), icon: "group", color: "text-purple-600", sub: `${newUsersMonth} مستخدم جديد هذا الشهر` },
          { label: "منتجات مخزون منخفض", value: fmt(lowStockCount), icon: "inventory_2", color: lowStockCount > 0 ? "text-red-600" : "text-green-600" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white border border-soft-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-secondary text-xs">{kpi.label}</span>
              <span className={`material-symbols-outlined text-[20px] ${kpi.color}`}>{kpi.icon}</span>
            </div>
            <p className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</p>
            {kpi.sub && <p className="text-secondary text-xs mt-1">{kpi.sub}</p>}
          </div>
        ))}
      </div>

      {/* Revenue bar chart (last 14 days) */}
      {dailyRevenue.length > 0 && (
        <div className="bg-white border border-soft-border rounded-xl p-5">
          <h2 className="font-bold text-obsidian mb-4">الإيرادات اليومية (الشهر الحالي)</h2>
          <div className="flex items-end gap-1 h-32">
            {dailyRevenue.map(([day, amount]) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-tashtep-orange rounded-t opacity-80 hover:opacity-100 transition-opacity"
                  style={{ height: `${(amount / maxDaily) * 100}%`, minHeight: "2px" }}
                  title={`${day}: ${fmtMoney(amount)} ج.م`}
                />
                <span className="text-[9px] text-secondary rotate-45 origin-right hidden md:block">{day.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {/* Orders by status */}
        <div className="bg-white border border-soft-border rounded-xl p-5">
          <h2 className="font-bold text-obsidian mb-4">الطلبات حسب الحالة</h2>
          <div className="space-y-3">
            {ordersByStatus.map(s => {
              const pct = totalOrders > 0 ? (s._count.id / totalOrders) * 100 : 0;
              return (
                <div key={s.status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{statusLabels[s.status] ?? s.status}</span>
                    <span className="font-bold">{s._count.id}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${statusColors[s.status] ?? "bg-gray-400"}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top products */}
        <div className="bg-white border border-soft-border rounded-xl p-5">
          <h2 className="font-bold text-obsidian mb-4">أكثر المنتجات مبيعاً</h2>
          <ol className="space-y-3">
            {topProducts.map((p, i) => (
              <li key={p.productId} className="flex items-center gap-3 text-sm">
                <span className="w-6 h-6 rounded-full bg-tashtep-orange/10 text-tashtep-orange font-bold flex items-center justify-center text-xs">{i + 1}</span>
                <span className="flex-1 text-obsidian truncate">{nameMap.get(p.productId) ?? p.productId}</span>
                <span className="text-secondary">{p._sum.quantity} وحدة</span>
              </li>
            ))}
            {topProducts.length === 0 && <p className="text-secondary text-sm">لا توجد بيانات بعد</p>}
          </ol>
        </div>

        {/* Orders by city */}
        <div className="bg-white border border-soft-border rounded-xl p-5">
          <h2 className="font-bold text-obsidian mb-4">الطلبات حسب المحافظة</h2>
          <ol className="space-y-3">
            {ordersByCity.map((c, i) => (
              <li key={c.shippingCity} className="flex items-center gap-3 text-sm">
                <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-xs">{i + 1}</span>
                <span className="flex-1 text-obsidian">{c.shippingCity || "غير محدد"}</span>
                <span className="text-secondary">{c._count.id} طلب</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <Link href="/admin" className="text-sm text-secondary hover:text-obsidian">← العودة للداشبورد</Link>
        <a href="/api/admin/low-stock" target="_blank" className="text-sm text-amber-600 hover:underline">عرض تقرير المخزون المنخفض</a>
        <LowStockAlertButton />
      </div>
    </div>
  );
}
