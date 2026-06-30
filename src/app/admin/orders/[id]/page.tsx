import { OrderService } from "@/services/order.service";
import { AdminOrderStatusForm } from "@/components/admin/admin-order-status-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const fmt = (n: number) =>
  new Intl.NumberFormat("ar-EG", { minimumFractionDigits: 2 }).format(n);

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING:    { label: "قيد المراجعة",  color: "bg-amber-100 text-amber-800" },
  PROCESSING: { label: "جاري التجهيز",  color: "bg-blue-100 text-blue-800" },
  SHIPPED:    { label: "تم الشحن",      color: "bg-purple-100 text-purple-800" },
  DELIVERED:  { label: "تم التوصيل",   color: "bg-green-100 text-green-800" },
  CANCELLED:  { label: "ملغي",          color: "bg-red-100 text-red-800" },
};

const PAY_LABELS: Record<string, { label: string; color: string }> = {
  PENDING:  { label: "قيد الانتظار", color: "bg-amber-100 text-amber-800" },
  PAID:     { label: "مدفوع",        color: "bg-green-100 text-green-800" },
  FAILED:   { label: "فشل الدفع",   color: "bg-red-100 text-red-800" },
  REFUNDED: { label: "مسترد",        color: "bg-gray-100 text-gray-800" },
};

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let order: {
    id: string; status: string; paymentStatus: string; paymentMethod: string;
    totalAmount: number; shippingCost: number; discountAmount: number; taxAmount: number;
    shippingName: string; shippingPhone: string; shippingAddress: string; shippingCity: string;
    customerNotes?: string | null; trackingNumber?: string | null;
    guestEmail?: string | null; createdAt: Date; updatedAt: Date;
    user?: { name: string | null; email: string | null } | null;
    items: { id: string; quantity: number; price: number; variantLabel?: string | null; product: { name: string } }[];
  };

  try {
    order = await OrderService.getOrderById(id) as typeof order;
  } catch {
    notFound();
  }

  const customerEmail = order.user?.email ?? order.guestEmail ?? "—";
  const customerName  = order.user?.name  ?? order.shippingName;
  const statusInfo  = STATUS_LABELS[order.status]  ?? { label: order.status,        color: "bg-stone text-secondary" };
  const payInfo     = PAY_LABELS[order.paymentStatus] ?? { label: order.paymentStatus, color: "bg-stone text-secondary" };

  const subtotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild className="rounded-full shrink-0">
          <Link href="/admin/orders">
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-obsidian">
            طلب رقم <span className="font-mono">#{order.id.slice(-8).toUpperCase()}</span>
          </h2>
          <p className="text-secondary text-sm mt-0.5">
            {new Date(order.createdAt).toLocaleString("ar-EG", { dateStyle: "full", timeStyle: "short" })}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-bold shrink-0 ${statusInfo.color}`}>
          {statusInfo.label}
        </span>
        <span className={`px-3 py-1 rounded-full text-sm font-bold shrink-0 ${payInfo.color}`}>
          {payInfo.label}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          {/* Order items */}
          <div className="bg-white border border-stone rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-stone">
              <h3 className="font-bold text-obsidian">عناصر الطلب</h3>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-stone/30">
                <tr>
                  <th className="text-right px-6 py-3 font-medium text-secondary">المنتج</th>
                  <th className="text-center px-4 py-3 font-medium text-secondary">الكمية</th>
                  <th className="text-center px-4 py-3 font-medium text-secondary">سعر الوحدة</th>
                  <th className="text-left px-6 py-3 font-medium text-secondary">الإجمالي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone/60">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-obsidian">{item.product.name}</div>
                      {item.variantLabel && (
                        <div className="text-xs text-secondary mt-0.5">{item.variantLabel}</div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center font-mono">{item.quantity}</td>
                    <td className="px-4 py-4 text-center font-mono">{fmt(item.price)}</td>
                    <td className="px-6 py-4 text-left font-bold text-obsidian">{fmt(item.price * item.quantity)} ج.م</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Summary */}
            <div className="px-6 py-4 border-t border-stone space-y-2 text-sm">
              <div className="flex justify-between text-secondary">
                <span>المجموع الفرعي</span>
                <span className="font-mono">{fmt(subtotal)} ج.م</span>
              </div>
              {order.shippingCost > 0 && (
                <div className="flex justify-between text-secondary">
                  <span>الشحن</span>
                  <span className="font-mono">{fmt(order.shippingCost)} ج.م</span>
                </div>
              )}
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>الخصم</span>
                  <span className="font-mono">- {fmt(order.discountAmount)} ج.م</span>
                </div>
              )}
              {order.taxAmount > 0 && (
                <div className="flex justify-between text-secondary">
                  <span>الضريبة</span>
                  <span className="font-mono">{fmt(order.taxAmount)} ج.م</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-stone font-bold text-base text-obsidian">
                <span>الإجمالي الكلي</span>
                <span className="font-mono text-tashtep-orange">{fmt(order.totalAmount)} ج.م</span>
              </div>
            </div>
          </div>

          {/* Customer & Shipping info */}
          <div className="bg-white border border-stone rounded-xl p-6">
            <h3 className="font-bold text-obsidian mb-4 pb-2 border-b border-stone">بيانات العميل والشحن</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="block text-secondary mb-1">الاسم</span>
                <span className="font-medium text-obsidian">{customerName}</span>
              </div>
              <div>
                <span className="block text-secondary mb-1">البريد الإلكتروني</span>
                <span className="font-medium text-obsidian font-mono text-xs" dir="ltr">{customerEmail}</span>
              </div>
              <div>
                <span className="block text-secondary mb-1">الهاتف</span>
                <span className="font-medium text-obsidian font-mono" dir="ltr">{order.shippingPhone}</span>
              </div>
              <div>
                <span className="block text-secondary mb-1">المحافظة / المدينة</span>
                <span className="font-medium text-obsidian">{order.shippingCity}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="block text-secondary mb-1">العنوان التفصيلي</span>
                <span className="font-medium text-obsidian">{order.shippingAddress}</span>
              </div>
              <div>
                <span className="block text-secondary mb-1">طريقة الدفع</span>
                <span className="font-medium text-obsidian">
                  {order.paymentMethod === "cod" ? "الدفع عند الاستلام" : "بطاقة بنكية"}
                </span>
              </div>
              {order.trackingNumber && (
                <div>
                  <span className="block text-secondary mb-1">رقم التتبع</span>
                  <span className="font-mono font-bold text-tashtep-orange">{order.trackingNumber}</span>
                </div>
              )}
              {order.customerNotes && (
                <div className="sm:col-span-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <span className="block text-amber-700 font-bold text-xs mb-1">ملاحظة العميل</span>
                  <span className="text-obsidian">{order.customerNotes}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: Status form */}
        <div className="space-y-4">
          <AdminOrderStatusForm
            orderId={order.id}
            currentStatus={order.status}
            currentPaymentStatus={order.paymentStatus}
            currentTrackingNumber={order.trackingNumber ?? ""}
          />
        </div>
      </div>
    </div>
  );
}
