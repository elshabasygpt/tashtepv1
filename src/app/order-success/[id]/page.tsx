import { OrderService } from "@/services/order.service";
import { ProductService } from "@/services/product.service";
import { getCurrentUser } from "@/lib/auth";
import { Container } from "@/components/layout/container";
import { ProductGrid } from "@/features/products/components/product-grid";
import { ProductCard } from "@/features/products/components/product-card";
import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "تم تأكيد طلبك",
};

interface OrderSuccessPageProps {
  params: Promise<{ id: string }>;
}

type OrderItemResponse = {
  id: string;
  quantity: number;
  price: number;
  product?: { name: string } | null;
};

type OrderResponse = {
  id: string;
  userId: string;
  totalAmount: number;
  shippingCost: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentMethod: "COD" | "CARD";
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  createdAt: Date;
  items: OrderItemResponse[];
};

const STATUS_STEPS = [
  { key: "PENDING", label: "تم استلام الطلب" },
  { key: "PROCESSING", label: "قيد التجهيز" },
  { key: "SHIPPED", label: "تم الشحن" },
  { key: "DELIVERED", label: "تم التسليم" },
] as const;

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?callbackUrl=/order-success/${id}`);
  }

  let order: OrderResponse;
  try {
    order = (await OrderService.getOrderById(id)) as OrderResponse;
  } catch {
    notFound();
  }

  if (order.userId !== user.id) {
    notFound();
  }

  const recommended = await ProductService.getProducts({ limit: 3 });

  const isCancelled = order.status === "CANCELLED";
  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);

  const formattedDate = new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(new Date(order.createdAt));

  return (
    <main className="bg-background min-h-screen pt-20">
      <Container className="max-w-container-max px-gutter py-macro-lg">
        {/* Success Hero */}
        <section className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto mb-macro-md">
          {!isCancelled && (
            <svg className="w-20 h-20 mb-micro-md" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
              <circle cx="26" cy="26" r="25" fill="none" stroke="#F39223" strokeWidth="2" />
              <path d="M14.1 27.2l7.1 7.2 16.7-16.8" fill="none" stroke="#F39223" strokeWidth="2" />
            </svg>
          )}
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-obsidian mb-micro-sm">
            {isCancelled ? "تم إلغاء هذا الطلب" : "تم تأكيد طلبك بنجاح"}
          </h1>
          <p className="text-body-lg font-body-lg text-secondary">
            {isCancelled
              ? "تواصل معنا إذا كان هذا غير متوقع."
              : "شكراً لاختيارك تشطيب، بدأنا تجهيز طلبك وسيتم التواصل معك قريباً."}
          </p>
        </section>

        {/* Order Summary Card */}
        <section className="w-full max-w-4xl mx-auto mb-macro-md">
          <div className="bg-white rounded-2xl border border-soft-border shadow-[0_10px_40px_rgba(0,0,0,0.02)] p-macro-sm md:p-macro-md">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-macro-sm pb-micro-md border-b border-stone">
              <h2 className="font-headline-md text-headline-md text-obsidian mb-micro-xs md:mb-0">تفاصيل الطلب</h2>
              <div className="flex items-center gap-2 bg-stone p-2 rounded border border-soft-border">
                <span className="font-label-md text-label-md text-secondary">رقم الطلب:</span>
                <span className="font-technical-mono text-technical-mono text-obsidian font-bold">#{order.id.slice(-8).toUpperCase()}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-micro-md mb-macro-md">
              <div>
                <span className="block font-label-md text-label-md text-secondary mb-1">تاريخ الطلب</span>
                <span className="block font-body-md text-body-md text-obsidian">{formattedDate}</span>
              </div>
              <div>
                <span className="block font-label-md text-label-md text-secondary mb-1">طريقة الدفع</span>
                <span className="block font-body-md text-body-md text-obsidian">
                  {order.paymentMethod === "COD" ? "الدفع عند الاستلام" : "الدفع إلكترونياً"}
                </span>
              </div>
              <div className="md:col-span-2">
                <span className="block font-label-md text-label-md text-secondary mb-1">عنوان الشحن</span>
                <span className="block font-body-md text-body-md text-obsidian">
                  {order.shippingName} — {order.shippingAddress}, {order.shippingCity}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="mb-macro-md">
              <h3 className="font-label-md text-label-md text-secondary mb-micro-md">المنتجات</h3>
              <div className="flex flex-col divide-y divide-stone">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-3">
                    <span className="font-body-md text-body-md text-obsidian">
                      {item.product?.name || "منتج"} <span className="text-secondary">× {item.quantity}</span>
                    </span>
                    <span className="font-body-md text-body-md text-obsidian font-bold">{item.price * item.quantity} ج.م</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-4 mt-2 border-t border-stone">
                <span className="font-body-lg text-body-lg font-bold text-obsidian">الإجمالي</span>
                <span className="font-headline-md text-headline-md font-bold text-obsidian">{order.totalAmount} ج.م</span>
              </div>
            </div>

            {/* Status Timeline */}
            {!isCancelled && (
              <div className="pt-micro-md relative">
                <h3 className="font-label-md text-label-md text-secondary mb-macro-sm">حالة الطلب</h3>
                <div className="relative flex justify-between items-center w-full">
                  <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-surface-container-high -z-10 -translate-y-1/2"></div>
                  <div
                    className="absolute top-1/2 right-0 h-[2px] bg-tashtep-orange -z-10 -translate-y-1/2 transition-all duration-1000 ease-in-out"
                    style={{ width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
                  ></div>
                  {STATUS_STEPS.map((step, idx) => {
                    const isDone = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    return (
                      <div key={step.key} className="flex flex-col items-center gap-2 relative bg-white px-2">
                        <div
                          className={
                            isDone
                              ? "w-6 h-6 rounded-full bg-tashtep-orange flex items-center justify-center text-white ring-4 ring-white"
                              : "w-6 h-6 rounded-full bg-surface-bright border-2 border-surface-container-high ring-4 ring-white"
                          }
                        >
                          {isDone && <span className="material-symbols-outlined text-[14px]">check</span>}
                        </div>
                        <span
                          className={
                            isCurrent
                              ? "font-label-md text-label-md text-tashtep-orange font-bold text-center absolute top-8 whitespace-nowrap"
                              : "font-label-md text-label-md text-secondary text-center absolute top-8 whitespace-nowrap"
                          }
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="h-10"></div>
              </div>
            )}
          </div>
        </section>

        {/* Primary Actions */}
        <section className="flex flex-wrap justify-center items-center gap-micro-sm mb-macro-md">
          <Link
            href="/account/orders"
            className="bg-tashtep-orange text-white font-label-md text-label-md px-8 py-4 rounded hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            متابعة الطلب
            <span className="material-symbols-outlined text-[18px]">local_shipping</span>
          </Link>
          <Link
            href="/products"
            className="bg-transparent text-obsidian border border-soft-border font-label-md text-label-md px-8 py-4 rounded hover:border-obsidian transition-colors"
          >
            متابعة التسوق
          </Link>
        </section>

        {/* Recommendations */}
        {recommended.length > 0 && (
          <section className="w-full border-t border-stone pt-macro-lg mb-macro-lg">
            <div className="flex justify-between items-end mb-macro-sm">
              <h3 className="font-headline-md text-headline-md text-obsidian">قد يعجبك أيضاً</h3>
              <Link href="/products" className="font-label-md text-label-md text-secondary hover:text-obsidian flex items-center gap-1 transition-colors">
                عرض الكل
                <span className="material-symbols-outlined text-[18px] rtl:rotate-180">arrow_forward</span>
              </Link>
            </div>
            <ProductGrid>
              {recommended.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </ProductGrid>
          </section>
        )}

        {/* Trust Footer */}
        <section className="w-full border-t border-stone pt-macro-sm pb-macro-md">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-micro-md text-center">
            <div className="flex flex-col items-center justify-center gap-2 px-4">
              <span className="material-symbols-outlined text-secondary text-[24px]">verified</span>
              <span className="font-label-md text-label-md text-obsidian">منتجات أصلية</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 px-4">
              <span className="material-symbols-outlined text-secondary text-[24px]">local_shipping</span>
              <span className="font-label-md text-label-md text-obsidian">شحن لجميع المحافظات</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 px-4">
              <span className="material-symbols-outlined text-secondary text-[24px]">replay</span>
              <span className="font-label-md text-label-md text-obsidian">استرجاع 14 يوم</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 px-4">
              <span className="material-symbols-outlined text-secondary text-[24px]">support_agent</span>
              <span className="font-label-md text-label-md text-obsidian">دعم مجاني</span>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
