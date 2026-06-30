import { OrderService } from "@/services/order.service";
import { WishlistService } from "@/services/wishlist.service";
import { LoyaltyService } from "@/services/loyalty.service";
import { ProductService, PrismaProductWithRelations } from "@/services/product.service";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ProductGrid } from "@/features/products/components/product-grid";
import { ProductCard } from "@/features/products/components/product-card";
import { Order } from "@prisma/client";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "تم الاستلام",
  PROCESSING: "قيد التجهيز",
  SHIPPED: "تم الشحن",
  DELIVERED: "تم التسليم",
  CANCELLED: "ملغي",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "text-amber-600 bg-amber-50 border-amber-200",
  PROCESSING: "text-blue-600 bg-blue-50 border-blue-200",
  SHIPPED: "text-purple-600 bg-purple-50 border-purple-200",
  DELIVERED: "text-green-600 bg-green-50 border-green-200",
  CANCELLED: "text-red-600 bg-red-50 border-red-200",
};

const LOYALTY_MILESTONE = 500; // points needed to redeem 125 EGP

export default async function AccountOverviewPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?callbackUrl=/account");
  }

  const [orders, wishlist, loyaltyBalance] = await Promise.all([
    OrderService.getUserOrders(user.id, { limit: 3 }) as Promise<Order[]>,
    WishlistService.getUserWishlist(user.id) as Promise<{ items: { product: PrismaProductWithRelations }[] }>,
    LoyaltyService.getBalance(user.id),
  ]);

  const wishlistProducts = (wishlist?.items || [])
    .slice(0, 4)
    .map((item) => ProductService.mapToUIProduct(item.product));

  const remainder = loyaltyBalance % LOYALTY_MILESTONE;
  const loyaltyProgressPct = remainder === 0 && loyaltyBalance > 0 ? 100 : Math.round(remainder / LOYALTY_MILESTONE * 100);
  const pointsToNext = remainder === 0 ? 0 : LOYALTY_MILESTONE - remainder;
  const loyaltyValue = LoyaltyService.pointsToCash(loyaltyBalance);

  const activeOrder = orders.find((o) => o.status !== "DELIVERED" && o.status !== "CANCELLED");

  return (
    <div className="flex flex-col gap-macro-md">
      <div>
        <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-obsidian mb-2">
          أهلاً، {user.name || "بك"}
        </h1>
        <p className="font-body-md text-body-md text-secondary">نظرة سريعة على حسابك وطلباتك ومفضلتك.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Loyalty Points Card */}
        <div className="md:col-span-2 bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-amber-700 font-medium mb-1">نقاط الولاء</p>
              <p className="text-3xl font-black text-amber-600 tabular-nums">{loyaltyBalance.toLocaleString("ar-EG")}</p>
              <p className="text-xs text-amber-700/80 mt-0.5">= {loyaltyValue} ج.م يمكن استردادها</p>
            </div>
            <span className="material-symbols-outlined text-3xl text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-amber-700">
              <span>التقدم نحو المكافأة القادمة</span>
              <span>{pointsToNext} نقطة متبقية</span>
            </div>
            <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-700"
                style={{ width: `${loyaltyProgressPct}%` }}
              />
            </div>
          </div>
          <Link href="/account/loyalty" className="inline-flex items-center gap-1 mt-3 text-xs text-amber-700 font-bold hover:underline">
            عرض سجل النقاط
            <span className="material-symbols-outlined text-[14px] rtl:rotate-180">arrow_forward</span>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-soft-border rounded-2xl p-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-2xl text-tashtep-orange" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
            <div>
              <p className="text-2xl font-black text-obsidian tabular-nums">{orders.length}</p>
              <p className="text-xs text-secondary">إجمالي الطلبات</p>
            </div>
          </div>
          <div className="bg-white border border-soft-border rounded-2xl p-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-2xl text-red-400" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
            <div>
              <p className="text-2xl font-black text-obsidian tabular-nums">{wishlistProducts.length}</p>
              <p className="text-xs text-secondary">في المفضلة</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active order banner */}
      {activeOrder && (
        <Link
          href={`/account/orders/${activeOrder.id}`}
          className="flex items-center justify-between p-4 bg-tashtep-orange/5 border border-tashtep-orange/30 rounded-xl hover:bg-tashtep-orange/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-tashtep-orange text-xl animate-pulse">local_shipping</span>
            <div>
              <p className="text-sm font-bold text-obsidian">طلبك قيد التنفيذ</p>
              <p className="text-xs text-secondary mt-0.5">
                #{activeOrder.id.slice(-8).toUpperCase()} ·{" "}
                <span className={`font-medium px-1.5 py-0.5 rounded-full border text-[10px] ${STATUS_COLORS[activeOrder.status] || ""}`}>
                  {STATUS_LABELS[activeOrder.status]}
                </span>
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined text-secondary rtl:rotate-180">arrow_forward</span>
        </Link>
      )}

      {/* Recent Orders */}
      <section>
        <div className="flex justify-between items-center mb-micro-md">
          <h2 className="font-headline-md text-headline-md text-obsidian">آخر الطلبات</h2>
          <Link href="/account/orders" className="font-label-md text-label-md text-secondary hover:text-obsidian transition-colors">
            عرض الكل
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-stone rounded-xl p-gutter text-center">
            <p className="font-body-md text-body-md text-secondary mb-3">لا توجد طلبات سابقة بعد.</p>
            <Link href="/products" className="font-label-md text-label-md text-obsidian underline hover:text-tashtep-orange transition-colors">
              تصفح المنتجات
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex justify-between items-center p-4 bg-white border border-soft-border rounded-lg hover:border-obsidian transition-colors"
              >
                <div>
                  <p className="font-technical-mono text-[13px] text-obsidian font-bold">#{order.id.slice(-8).toUpperCase()}</p>
                  <p className="font-label-md text-[13px] text-secondary mt-0.5">
                    {new Intl.DateTimeFormat("ar-EG", { dateStyle: "long" }).format(new Date(order.createdAt))}
                  </p>
                </div>
                <div className="text-end">
                  <p className="font-body-md text-body-md text-obsidian font-bold">{order.totalAmount} ج.م</p>
                  <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full border mt-1 ${STATUS_COLORS[order.status] || "text-secondary bg-stone border-soft-border"}`}>
                    {STATUS_LABELS[order.status] || order.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Wishlist Preview */}
      <section>
        <div className="flex justify-between items-center mb-micro-md">
          <h2 className="font-headline-md text-headline-md text-obsidian">من مفضلتك</h2>
          <Link href="/wishlist" className="font-label-md text-label-md text-secondary hover:text-obsidian transition-colors">
            عرض الكل
          </Link>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="bg-stone rounded-xl p-gutter text-center">
            <p className="font-body-md text-body-md text-secondary mb-3">مفضلتك فارغة حالياً.</p>
            <Link href="/products" className="font-label-md text-label-md text-obsidian underline hover:text-tashtep-orange transition-colors">
              استكشف المنتجات
            </Link>
          </div>
        ) : (
          <ProductGrid>
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductGrid>
        )}
      </section>
    </div>
  );
}
