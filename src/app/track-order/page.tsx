"use client";

import { useState } from "react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { toast } from "sonner";
import Link from "next/link";

type OrderResult = {
  id: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
  shippingName: string;
  shippingCity: string;
  items: Array<{ quantity: number; price: number; product: { name: string } }>;
};

const STATUS_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  PENDING:    { label: "قيد الانتظار",  color: "text-amber-600 bg-amber-50",   icon: "hourglass_empty" },
  PROCESSING: { label: "قيد التجهيز",   color: "text-blue-600 bg-blue-50",     icon: "inventory_2" },
  SHIPPED:    { label: "في الطريق",     color: "text-purple-600 bg-purple-50", icon: "local_shipping" },
  DELIVERED:  { label: "تم التسليم",    color: "text-green-600 bg-green-50",   icon: "check_circle" },
  CANCELLED:  { label: "ملغي",          color: "text-red-600 bg-red-50",       icon: "cancel" },
};

export default function TrackOrderPage() {
  const [email, setEmail] = useState("");
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [notFound, setNotFound] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() && !orderId.trim()) {
      toast.error("أدخل البريد الإلكتروني أو رقم الطلب");
      return;
    }
    setLoading(true);
    setOrder(null);
    setNotFound(false);
    try {
      const params = new URLSearchParams();
      if (email) params.set("email", email);
      if (orderId) params.set("orderId", orderId);
      const res = await fetch(`/api/orders/track?${params}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      } else {
        setNotFound(true);
      }
    } catch {
      toast.error("حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  }

  const fmt = (n: number) => new Intl.NumberFormat("ar-EG", { minimumFractionDigits: 2 }).format(n);
  const statusInfo = order ? (STATUS_LABELS[order.status] ?? { label: order.status, color: "text-gray-600 bg-gray-50", icon: "info" }) : null;

  return (
    <Section className="min-h-screen bg-white py-macro-md md:py-macro-lg">
      <Container>
        <div className="max-w-xl mx-auto">
          <div className="mb-8 text-center">
            <span className="material-symbols-outlined text-tashtep-orange text-5xl">local_shipping</span>
            <h1 className="font-display-hero-mobile text-[28px] text-obsidian mt-3 mb-2">تتبع طلبك</h1>
            <p className="text-secondary">أدخل بريدك الإلكتروني أو رقم الطلب</p>
          </div>

          <form onSubmit={handleSearch} className="bg-white border border-soft-border rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
            <div>
              <label className="font-label-md text-sm text-obsidian block mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full border border-soft-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-tashtep-orange"
              />
            </div>
            <div className="flex items-center gap-3 text-secondary text-sm">
              <div className="flex-1 h-px bg-soft-border" />أو<div className="flex-1 h-px bg-soft-border" />
            </div>
            <div>
              <label className="font-label-md text-sm text-obsidian block mb-1">رقم الطلب</label>
              <input
                type="text"
                value={orderId}
                onChange={e => setOrderId(e.target.value)}
                placeholder="مثال: cm3abc..."
                className="w-full border border-soft-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-tashtep-orange"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-tashtep-orange text-white font-label-md py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {loading ? "جاري البحث..." : "بحث"}
            </button>
          </form>

          {notFound && (
            <div className="mt-6 text-center p-6 rounded-2xl border border-soft-border">
              <span className="material-symbols-outlined text-secondary text-4xl">search_off</span>
              <p className="text-secondary mt-2">لم يتم العثور على طلب بهذه البيانات</p>
            </div>
          )}

          {order && statusInfo && (
            <div className="mt-6 rounded-2xl border border-soft-border overflow-hidden">
              <div className="p-5 border-b border-soft-border flex items-center justify-between">
                <div>
                  <p className="text-secondary text-xs mb-1">رقم الطلب</p>
                  <p className="font-label-md font-bold text-obsidian text-sm">{order.id.slice(-12).toUpperCase()}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${statusInfo.color}`}>
                  <span className="material-symbols-outlined text-[16px]">{statusInfo.icon}</span>
                  {statusInfo.label}
                </span>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">العميل</span>
                  <span className="font-bold text-obsidian">{order.shippingName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">المدينة</span>
                  <span className="text-obsidian">{order.shippingCity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">تاريخ الطلب</span>
                  <span className="text-obsidian">{new Date(order.createdAt).toLocaleDateString("ar-EG")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">المنتجات</span>
                  <span className="text-obsidian">{order.items.length} منتج</span>
                </div>
                <div className="flex justify-between text-sm border-t border-soft-border pt-3">
                  <span className="font-bold text-obsidian">الإجمالي</span>
                  <span className="font-bold text-tashtep-orange">{fmt(order.totalAmount)} ج.م</span>
                </div>
              </div>
            </div>
          )}

          <p className="text-center text-secondary text-sm mt-6">
            هل لديك حساب؟{" "}
            <Link href="/account/orders" className="text-tashtep-orange hover:underline font-bold">
              عرض جميع طلباتك
            </Link>
          </p>
        </div>
      </Container>
    </Section>
  );
}
