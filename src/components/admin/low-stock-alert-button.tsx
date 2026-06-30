"use client";

import { useState } from "react";
import { toast } from "sonner";

export function LowStockAlertButton() {
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/low-stock", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        if (data.alerted) {
          toast.success(`تم إرسال تنبيه لـ ${data.alerted} منتج بمخزون منخفض`);
        } else {
          toast.info(data.message || "لا توجد منتجات بمخزون منخفض");
        }
      } else {
        toast.error("حدث خطأ أثناء إرسال التنبيه");
      }
    } catch {
      toast.error("تعذر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleSend}
      disabled={loading}
      className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-60"
    >
      <span className="material-symbols-outlined text-[18px]">notifications</span>
      {loading ? "جاري الإرسال..." : "إرسال تنبيه المخزون"}
    </button>
  );
}
