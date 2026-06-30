import Link from "next/link";
import { Button } from "@/components/ui/button";
import { OrderService } from "@/services/order.service";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  variantLabel?: string | null;
  product: { name: string } | null;
};

type FullOrder = {
  id: string;
  userId?: string | null;
  totalAmount: number;
  shippingCost: number;
  discountAmount: number;
  taxAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  shippingName: string;
  shippingCity: string;
  guestEmail?: string | null;
  user?: { email?: string | null } | null;
  items: OrderItem[];
};

export default async function OrderSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ paymentFailed?: string }>;
}) {
  const [resolvedParams, resolvedSearch, currentUser] = await Promise.all([
    params,
    searchParams,
    getCurrentUser(),
  ]);
  // paymentFailed is only shown if the DB confirms the payment is not completed
  // — prevents spoofing via manual ?paymentFailed=1 on a successfully paid order.
  const paymentFailedParam = resolvedSearch.paymentFailed === "1";

  let rawOrder: unknown = null;
  try {
    rawOrder = await OrderService.getOrderById(resolvedParams.id);
  } catch {
    notFound();
  }
  if (!rawOrder) notFound();

  const order = rawOrder as FullOrder;

  // For user-owned orders, verify the requesting session owns it.
  // Guest orders (userId === null) have no session to verify against.
  if (order.userId && (!currentUser || currentUser.id !== order.userId)) {
    notFound();
  }

  // Only show the failure banner when the DB agrees the payment isn't completed.
  const paymentFailed = paymentFailedParam && order.paymentStatus !== "PAID";

  const email = order.user?.email ?? order.guestEmail;

  return (
    <Section className="py-macro-lg bg-white min-h-screen">
      <Container className="max-w-2xl">
        <div className="text-center">
          {paymentFailed ? (
            <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in-75 duration-500">
              <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            </div>
          ) : (
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in-75 duration-500">
              <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
          )}

          {paymentFailed ? (
            <>
              <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-obsidian mb-3">
                تم تسجيل طلبك — الدفع لم يكتمل
              </h1>
              <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-right">
                <p className="text-sm font-medium text-amber-800 mb-1">لم يتم إنشاء رابط الدفع الإلكتروني</p>
                <p className="text-sm text-amber-700">
                  تم حفظ طلبك بنجاح. سيتواصل معك فريق الدعم لإتمام الدفع، أو يمكنك التواصل معنا مباشرةً لتأكيد طريقة السداد.
                </p>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-obsidian mb-3">
                تم تأكيد طلبك بنجاح!
              </h1>
              <p className="text-body-lg text-secondary mb-2">
                شكراً لتسوقك معنا. تم استلام طلبك وهو قيد التجهيز الآن.
              </p>
            </>
          )}

          {email ? (
            <p className="text-sm text-secondary mb-8">
              سيتم إرسال تأكيد الطلب إلى{" "}
              <span className="font-medium text-obsidian">{email}</span>
            </p>
          ) : (
            <p className="text-sm text-secondary mb-8">
              سيصلك تأكيد الطلب على بريدك الإلكتروني قريباً.
            </p>
          )}

          <div className="bg-stone/30 border border-soft-border p-6 rounded-2xl mb-6 mx-auto">
            <span className="block text-sm text-secondary mb-2">رقم الطلب</span>
            <span className="block text-2xl font-technical-mono font-bold text-obsidian tracking-wider">
              #{order.id.slice(-8).toUpperCase()}
            </span>
          </div>

          {/* Order items summary */}
          {order.items?.length > 0 && (
            <div className="bg-white border border-soft-border rounded-2xl mb-6 text-right overflow-hidden">
              <div className="px-5 py-3 border-b border-stone/50 bg-stone/20">
                <span className="text-sm font-bold text-obsidian">ملخص طلبك</span>
              </div>
              <div className="divide-y divide-stone/40">
                {order.items.map((item) => (
                  <div key={item.id} className="px-5 py-3 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-obsidian line-clamp-1">{item.product?.name ?? "منتج"}</p>
                      {item.variantLabel && <p className="text-xs text-secondary">{item.variantLabel}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs text-secondary">{item.quantity} × {item.price} ج.م</span>
                      <p className="text-sm font-bold text-obsidian tabular-nums">{item.quantity * item.price} ج.م</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 border-t border-stone/50 space-y-1.5 bg-stone/10">
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-xs text-secondary">
                    <span>خصم الكوبون</span>
                    <span className="text-green-600">-{order.discountAmount} ج.م</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-secondary">
                  <span>الشحن</span>
                  <span>{order.shippingCost === 0 ? "مجاني" : `${order.shippingCost} ج.م`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-obsidian pt-1 border-t border-stone/50">
                  <span>الإجمالي</span>
                  <span className="tabular-nums">{order.totalAmount} ج.م</span>
                </div>
              </div>
            </div>
          )}

          {/* Order progress steps */}
          <div className="mb-10 px-4">
            <div className="flex items-start justify-between relative">
              <div className="absolute top-4 left-6 right-6 h-0.5 bg-stone z-0" />
              {[
                { icon: "receipt_long", label: "تم الطلب", active: true },
                { icon: "inventory_2", label: "جاري التجهيز", active: false },
                { icon: "local_shipping", label: "في الطريق", active: false },
                { icon: "home", label: "تم التوصيل", active: false },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center gap-2 z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center
                    ${step.active ? "bg-tashtep-orange text-white" : "bg-stone text-secondary"}`}>
                    <span className="material-symbols-outlined text-[16px]"
                      style={{ fontVariationSettings: step.active ? "'FILL' 1" : "'FILL' 0" }}>
                      {step.icon}
                    </span>
                  </div>
                  <span className={`text-[11px] font-medium ${step.active ? "text-tashtep-orange" : "text-secondary"}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href={`/account/orders/${order.id}`}>
              <Button variant="tashtep" className="h-12 px-8 rounded-lg w-full sm:w-auto flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">search</span>
                تتبع الطلب
              </Button>
            </Link>
            <Link href={`/account/orders/${order.id}/invoice`} target="_blank">
              <Button variant="secondary" className="h-12 px-8 rounded-lg w-full sm:w-auto flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                عرض الفاتورة
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" className="h-12 px-8 rounded-lg w-full sm:w-auto">
                الاستمرار في التسوق
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
