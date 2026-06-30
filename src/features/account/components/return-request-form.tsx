"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const RETURN_REASONS = [
  "المنتج لا يطابق الوصف",
  "المنتج تالف أو معيب",
  "تم استلام منتج خاطئ",
  "المنتج لم يعجبني",
  "مشكلة في الجودة",
  "سبب آخر",
];

interface EligibleOrder {
  id: string;
  totalAmount: number;
  createdAt: Date;
  shippingName: string;
}

export function ReturnRequestForm({ eligibleOrders }: { eligibleOrders: EligibleOrder[] }) {
  const router = useRouter();
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = React.useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    if (!data.orderId) return setErrorMsg("الرجاء اختيار الطلب");
    if (!data.reason) return setErrorMsg("الرجاء اختيار سبب الاسترداد");
    if (!data.details || String(data.details).length < 10) return setErrorMsg("الرجاء كتابة تفاصيل أكثر");

    setStatus("loading");
    setErrorMsg("");

    const res = await fetch("/api/account/returns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setStatus("success");
    } else {
      const json = await res.json().catch(() => ({}));
      setStatus("error");
      setErrorMsg(json.error ?? "حدث خطأ، يرجى المحاولة مجدداً");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center bg-white rounded-2xl border border-stone p-8">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <span className="material-symbols-outlined text-green-600 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        </div>
        <h3 className="text-xl font-bold text-obsidian">تم تقديم طلب الاسترداد</h3>
        <p className="text-secondary text-sm max-w-xs">سيراجع فريقنا طلبك ويتواصل معك خلال 2-3 أيام عمل.</p>
        <Button onClick={() => router.push("/account/returns")} className="mt-2 bg-tashtep-orange hover:bg-obsidian">
          عرض طلباتي
        </Button>
      </div>
    );
  }

  const inputCls = "w-full rounded-xl border border-soft-border bg-stone py-3 px-4 focus:ring-0 focus:border-tashtep-orange focus:bg-white transition-colors outline-none text-sm";

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-stone rounded-2xl p-6 space-y-5">
      {/* Order select */}
      <div>
        <label className="block text-sm font-medium text-obsidian mb-1.5">
          الطلب <span className="text-red-500">*</span>
        </label>
        {eligibleOrders.length === 0 ? (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
            لا توجد طلبات مؤهلة للاسترداد. يجب أن يكون الطلب بحالة &ldquo;تم التوصيل&rdquo;.
          </div>
        ) : (
          <select name="orderId" required className={inputCls}>
            <option value="">اختر الطلب</option>
            {eligibleOrders.map((o) => (
              <option key={o.id} value={o.id}>
                #{o.id.slice(-8).toUpperCase()} — {o.totalAmount} ج.م — {new Date(o.createdAt).toLocaleDateString("ar-EG")}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Reason */}
      <div>
        <label className="block text-sm font-medium text-obsidian mb-1.5">
          سبب الاسترداد <span className="text-red-500">*</span>
        </label>
        <select name="reason" required className={inputCls}>
          <option value="">اختر السبب</option>
          {RETURN_REASONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* Details */}
      <div>
        <label className="block text-sm font-medium text-obsidian mb-1.5">
          التفاصيل <span className="text-red-500">*</span>
        </label>
        <textarea
          name="details"
          required
          minLength={10}
          rows={4}
          className={`${inputCls} resize-none`}
          placeholder="اشرح المشكلة بالتفصيل..."
        />
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          <span className="material-symbols-outlined text-[18px]">error</span>
          {errorMsg}
        </div>
      )}

      <Button
        type="submit"
        disabled={status === "loading" || eligibleOrders.length === 0}
        className="w-full bg-tashtep-orange text-white hover:bg-obsidian h-12 rounded-xl text-sm font-bold"
      >
        {status === "loading" ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            جاري الإرسال...
          </span>
        ) : "تقديم طلب الاسترداد"}
      </Button>
    </form>
  );
}
