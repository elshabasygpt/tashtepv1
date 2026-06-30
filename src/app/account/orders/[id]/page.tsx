import { OrderService } from "@/services/order.service";
import { getCurrentUser } from "@/lib/auth";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CancelOrderButton } from "@/features/account/components/cancel-order-button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "تفاصيل الطلب",
};

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>;
}

type OrderItemResponse = {
  id: string;
  quantity: number;
  price: number;
  product?: { name: string; images?: string[] } | null;
};

type OrderResponse = {
  id: string;
  userId: string;
  totalAmount: number;
  shippingCost: number;
  taxAmount?: number;
  discountAmount?: number;
  couponCode?: string | null;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentMethod: "COD" | "CARD";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  createdAt: Date;
  items: OrderItemResponse[];
};

const STATUS_STEPS = [
  { key: "PENDING", label: "تم الاستلام" },
  { key: "PROCESSING", label: "قيد التجهيز" },
  { key: "SHIPPED", label: "تم الشحن" },
  { key: "DELIVERED", label: "تم التسليم" },
] as const;

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?callbackUrl=/account/orders/${id}`);
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
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/account/orders" className="text-secondary hover:text-tashtep-orange transition-colors">
          <ChevronRight className="h-6 w-6 rtl:rotate-180" />
        </Link>
        <h1 className="text-2xl font-headline-md text-obsidian">تفاصيل الطلب</h1>
      </div>

      <div className="bg-white rounded-2xl border border-soft-border shadow-sm p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 pb-4 border-b border-stone">
          <div className="flex items-center gap-3">
            <span className="font-label-md text-secondary">رقم الطلب:</span>
            <span className="font-technical-mono text-lg font-bold text-obsidian">#{order.id.slice(-8).toUpperCase()}</span>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-stone border border-soft-border">
              {isCancelled ? "ملغي" : STATUS_STEPS[currentStepIndex]?.label || order.status}
            </span>
            {order.status === "PENDING" && (
              <CancelOrderButton orderId={order.id} />
            )}
            <Link href={`/account/orders/${order.id}/invoice`} target="_blank">
              <Button variant="outline" size="sm" className="flex items-center gap-1 h-8">
                <span className="material-symbols-outlined text-[16px]">print</span>
                طباعة الفاتورة
              </Button>
            </Link>
          </div>
        </div>

        {/* Status Timeline */}
        {!isCancelled && (
          <div className="pt-4 pb-12 relative w-full mb-8">
            <div className="relative flex justify-between items-center w-full">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-stone -z-10 -translate-y-1/2 rounded"></div>
              <div
                className="absolute top-1/2 right-0 h-1 bg-tashtep-orange -z-10 -translate-y-1/2 transition-all duration-1000 ease-in-out rounded"
                style={{ width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
              ></div>
              {STATUS_STEPS.map((step, idx) => {
                const isDone = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div key={step.key} className="flex flex-col items-center gap-2 relative bg-white px-1 sm:px-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-white transition-colors duration-500 ${
                        isDone ? "bg-tashtep-orange text-white" : "bg-stone border-2 border-soft-border text-secondary"
                      }`}
                    >
                      {isDone ? (
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      ) : (
                        <span className="text-xs">{idx + 1}</span>
                      )}
                    </div>
                    <span
                      className={`text-xs sm:text-sm font-label-md absolute top-10 whitespace-nowrap transition-colors duration-500 ${
                        isCurrent ? "text-tashtep-orange font-bold" : "text-secondary"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {isCancelled && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-lg text-red-800 flex items-center gap-3">
            <span className="material-symbols-outlined">cancel</span>
            <p>لقد تم إلغاء هذا الطلب.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div>
              <span className="block text-sm font-label-md text-secondary mb-1">تاريخ الطلب</span>
              <span className="block text-obsidian">{formattedDate}</span>
            </div>
            <div>
              <span className="block text-sm font-label-md text-secondary mb-1">طريقة الدفع</span>
              <div className="flex items-center gap-2">
                <span className="block text-obsidian">
                  {order.paymentMethod === "COD" ? "الدفع عند الاستلام" : "الدفع إلكترونياً"}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${order.paymentStatus === "PAID" ? "bg-green-100 text-green-800" : order.paymentStatus === "FAILED" ? "bg-red-100 text-red-800" : "bg-stone text-secondary"}`}>
                  {order.paymentStatus === "PAID" ? "مدفوع" : order.paymentStatus === "FAILED" ? "فشل الدفع" : "غير مدفوع"}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-stone/50 p-4 rounded-xl border border-soft-border">
            <span className="block text-sm font-label-md text-secondary mb-2">معلومات الشحن</span>
            <span className="block font-bold text-obsidian mb-1">{order.shippingName}</span>
            <span className="block text-obsidian text-sm">{order.shippingAddress}</span>
            <span className="block text-obsidian text-sm">{order.shippingCity}</span>
          </div>
        </div>

        {/* Items */}
        <div>
          <h3 className="text-lg font-headline-md text-obsidian mb-4 border-b border-soft-border pb-2">المنتجات</h3>
          <div className="flex flex-col divide-y divide-stone">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-4">
                <div className="flex items-center gap-4">
                  {item.product?.images && item.product.images[0] ? (
                    <Image src={item.product.images[0]} alt={item.product.name} width={64} height={64} className="w-16 h-16 object-cover rounded-md border border-stone" />
                  ) : (
                    <div className="w-16 h-16 bg-stone rounded-md border border-soft-border flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary">image</span>
                    </div>
                  )}
                  <div>
                    <span className="block font-bold text-obsidian">{item.product?.name || "منتج"}</span>
                    <span className="text-sm text-secondary">الكمية: {item.quantity}</span>
                  </div>
                </div>
                <div className="text-left">
                  <span className="block font-bold text-obsidian">{item.price * item.quantity} ج.م</span>
                  {item.quantity > 1 && <span className="block text-xs text-secondary">{item.price} ج.م للقطعة</span>}
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-4 mt-2 border-t border-stone space-y-2">
            <div className="flex justify-between items-center text-sm text-secondary">
              <span>المجموع الفرعي</span>
              <span>{order.totalAmount - order.shippingCost - (order.taxAmount || 0) + (order.discountAmount || 0)} ج.م</span>
            </div>
            <div className="flex justify-between items-center text-sm text-secondary">
              <span>تكلفة الشحن</span>
              <span>{order.shippingCost === 0 ? "مجاناً" : `${order.shippingCost} ج.م`}</span>
            </div>
            {(order.discountAmount || 0) > 0 && (
              <div className="flex justify-between items-center text-sm text-green-600 font-medium">
                <span>الخصم {order.couponCode ? `(${order.couponCode})` : ""}</span>
                <span>-{order.discountAmount} ج.م</span>
              </div>
            )}
            <div className="flex justify-between items-center text-sm text-secondary">
              <span>ضريبة القيمة المضافة (14%)</span>
              <span>{order.taxAmount || 0} ج.م</span>
            </div>
            <div className="flex justify-between items-center pt-2 mt-2 border-t border-stone/50">
              <span className="font-bold text-lg text-obsidian">الإجمالي النهائي</span>
              <span className="font-bold text-xl text-tashtep-orange">{order.totalAmount} ج.م</span>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
