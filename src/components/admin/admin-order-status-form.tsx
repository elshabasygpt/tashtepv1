"use client";

import { useState } from "react";
import { updateOrderStatusAction } from "@/actions/admin.actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface AdminOrderStatusFormProps {
  orderId: string;
  currentStatus: string;
  currentPaymentStatus: string;
}

export function AdminOrderStatusForm({ orderId, currentStatus, currentPaymentStatus }: AdminOrderStatusFormProps) {
  const [status, setStatus] = useState(currentStatus);
  const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus);

  const [actionStatus, setActionStatus] = useState<"idle" | "executing">("idle");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionStatus("executing");
    const res = await updateOrderStatusAction({ id: orderId, status: status as "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED", paymentStatus: paymentStatus as "PENDING" | "PAID" | "FAILED" });
    setResult(res);
    setActionStatus("idle");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl border border-stone">
      <h3 className="font-headline-md text-lg text-obsidian border-b border-stone pb-2">تحديث حالة الطلب</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>حالة الطلب</Label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="PENDING">قيد المراجعة</option>
            <option value="PROCESSING">جاري التجهيز</option>
            <option value="SHIPPED">تم الشحن</option>
            <option value="DELIVERED">تم التوصيل</option>
            <option value="CANCELLED">ملغي</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>حالة الدفع</Label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background"
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
          >
            <option value="PENDING">قيد الانتظار</option>
            <option value="PAID">مدفوع</option>
            <option value="FAILED">فشل الدفع</option>
          </select>
        </div>
      </div>

      {result?.serverError && (
        <div className="text-red-500 text-sm">{result.serverError}</div>
      )}
      {result?.data?.success && (
        <div className="text-green-600 text-sm font-medium">{result.data.message}</div>
      )}

      <div className="pt-2">
        <Button type="submit" disabled={actionStatus === "executing"} className="w-full bg-tashtep-orange hover:bg-tashtep-orange/90 text-white">
          {actionStatus === "executing" ? "جاري التحديث..." : "حفظ التغييرات"}
        </Button>
      </div>
    </form>
  );
}
