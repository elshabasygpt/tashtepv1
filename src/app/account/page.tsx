import { OrderService } from "@/services/order.service";
import { WishlistService } from "@/services/wishlist.service";
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

export default async function AccountOverviewPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?callbackUrl=/account");
  }

  const [orders, wishlist] = await Promise.all([
    OrderService.getUserOrders(user.id, { limit: 3 }) as Promise<Order[]>,
    WishlistService.getUserWishlist(user.id) as Promise<{ items: { product: PrismaProductWithRelations }[] }>,
  ]);

  const wishlistProducts = (wishlist?.items || [])
    .slice(0, 4)
    .map((item) => ProductService.mapToUIProduct(item.product));

  return (
    <div className="flex flex-col gap-macro-md">
      <div>
        <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-obsidian mb-2">
          أهلاً، {user.name || "بك"}
        </h1>
        <p className="font-body-md text-body-md text-secondary">نظرة سريعة على حسابك وطلباتك ومفضلتك.</p>
      </div>

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
                href={`/order-success/${order.id}`}
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
                  <p className="font-label-md text-[13px] text-tashtep-orange mt-0.5">{STATUS_LABELS[order.status] || order.status}</p>
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
