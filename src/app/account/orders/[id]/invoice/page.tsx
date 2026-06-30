import { OrderService } from "@/services/order.service";
import { SettingsService } from "@/services/settings.service";
import { getCurrentUser } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

type InvoiceOrderItem = {
  id: string;
  quantity: number;
  price: number;
  variantLabel?: string | null;
  product?: { name: string } | null;
};

type InvoiceOrder = {
  id: string;
  userId?: string | null;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  paymentMethod: string;
  paymentStatus: string;
  couponCode?: string | null;
  taxAmount?: number | null;
  discountAmount?: number | null;
  shippingCost?: number | null;
  totalAmount: number;
  createdAt: Date;
  items: InvoiceOrderItem[];
};

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?callbackUrl=/account/orders/${id}/invoice`);
  }

  let order: InvoiceOrder;
  try {
    order = (await OrderService.getOrderById(id)) as InvoiceOrder;
  } catch {
    notFound();
  }

  if (order.userId !== user.id && (user as { role?: string }).role !== "ADMIN") {
    notFound();
  }

  const settings = await SettingsService.getGeneralSettings();

  const formattedDate = new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(order.createdAt));

  const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxAmount = order.taxAmount ?? 0;
  const discountAmount = order.discountAmount ?? 0;
  const shippingCost = order.shippingCost ?? 0;

  return (
    <div className="bg-white min-h-screen p-8 text-obsidian" style={{ direction: "rtl" }}>
      <style dangerouslySetInnerHTML={{
        __html: `@media print { header,footer,nav{display:none!important} body{background:white!important} .no-print{display:none!important} @page{margin:1cm;size:A4} }`,
      }} />

      <div className="max-w-4xl mx-auto border border-stone p-8 rounded-none md:rounded-xl shadow-none md:shadow-sm relative">

        <div className="no-print absolute top-4 left-4 flex gap-2">
          <button className="print-btn flex items-center gap-2 px-4 py-2 bg-tashtep-orange text-white rounded-lg text-sm font-bold shadow hover:bg-opacity-90">
            <span className="material-symbols-outlined text-[18px]">print</span>
            طباعة الفاتورة
          </button>
          <Link href={`/account/orders/${order.id}`} className="px-4 py-2 border border-stone text-obsidian rounded-lg text-sm font-bold hover:bg-stone/50">
            رجوع
          </Link>
        </div>
        <script dangerouslySetInnerHTML={{ __html: `document.addEventListener('DOMContentLoaded',()=>{const b=document.querySelector('.print-btn');if(b)b.onclick=()=>window.print()})` }} />

        {/* Invoice Header */}
        <div className="flex justify-between items-start mt-12 mb-12 border-b border-stone pb-8">
          <div>
            <h1 className="text-3xl font-black text-tashtep-orange mb-2">فاتورة ضريبية</h1>
            <p className="text-sm text-secondary font-technical-mono">رقم الفاتورة: #{order.id.slice(-8).toUpperCase()}</p>
            <p className="text-sm text-secondary">التاريخ: {formattedDate}</p>
          </div>
          <div className="text-left">
            <h2 className="text-2xl font-black text-obsidian uppercase tracking-tighter">{settings.storeName}</h2>
            {settings.taxId && <p className="text-sm text-secondary mt-1">الرقم الضريبي: {settings.taxId}</p>}
            <p className="text-sm text-secondary">{settings.email}</p>
            <p className="text-sm text-secondary">{settings.phone}</p>
          </div>
        </div>

        {/* Customer Details */}
        <div className="mb-10 grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-bold text-secondary mb-2 uppercase tracking-wider">فاتورة إلى</h3>
            <p className="font-bold text-obsidian text-lg">{order.shippingName}</p>
            <p className="text-obsidian">{order.shippingAddress}</p>
            <p className="text-obsidian">{order.shippingCity}</p>
            <p className="text-obsidian mt-1">{order.shippingPhone}</p>
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-secondary mb-2 uppercase tracking-wider">تفاصيل الدفع</h3>
            <p className="text-obsidian">
              <span className="font-bold">الطريقة:</span>{" "}
              {order.paymentMethod === "COD" ? "الدفع عند الاستلام" : "بطاقة ائتمان"}
            </p>
            <p className="text-obsidian">
              <span className="font-bold">الحالة:</span>{" "}
              {order.paymentStatus === "PAID" ? "مدفوع" : "غير مدفوع"}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b-2 border-obsidian text-obsidian">
                <th className="py-3 px-2 w-[50%]">المنتج</th>
                <th className="py-3 px-2">الكمية</th>
                <th className="py-3 px-2">سعر الوحدة</th>
                <th className="py-3 px-2 text-left">المجموع</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b border-stone">
                  <td className="py-4 px-2">
                    <p className="font-bold">{item.product?.name ?? "منتج"}</p>
                    {item.variantLabel && <p className="text-xs text-secondary">{item.variantLabel}</p>}
                  </td>
                  <td className="py-4 px-2">{item.quantity}</td>
                  <td className="py-4 px-2">{item.price} ج.م</td>
                  <td className="py-4 px-2 text-left font-bold">{item.price * item.quantity} ج.م</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-full md:w-1/2 space-y-3">
            <div className="flex justify-between text-secondary">
              <span>المجموع الفرعي</span>
              <span>{subtotal} ج.م</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>الخصم {order.couponCode ? `(${order.couponCode})` : ""}</span>
                <span>-{discountAmount} ج.م</span>
              </div>
            )}
            <div className="flex justify-between text-secondary">
              <span>ضريبة القيمة المضافة ({settings.taxRate}%)</span>
              <span>{taxAmount} ج.م</span>
            </div>
            <div className="flex justify-between text-secondary pb-3 border-b border-stone">
              <span>تكلفة الشحن</span>
              <span>{shippingCost === 0 ? "مجاناً" : `${shippingCost} ج.م`}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="font-bold text-xl text-obsidian">الإجمالي النهائي</span>
              <span className="font-black text-2xl text-tashtep-orange">{order.totalAmount} ج.م</span>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-stone text-center text-sm text-secondary">
          <p>شكراً لتعاملكم مع {settings.storeName}. في حال وجود أي استفسارات، يرجى التواصل معنا عبر {settings.email}</p>
        </div>
      </div>
    </div>
  );
}
