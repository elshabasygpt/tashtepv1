"use client";

import { useState } from "react";
import { updateOrderStatusAction } from "@/actions/admin.actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING:    ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED:    ["DELIVERED"],
  DELIVERED:  [],
  CANCELLED:  [],
};

const STATUS_LABELS: Record<string, string> = {
  PENDING:    "قيد المراجعة",
  PROCESSING: "جاري التجهيز",
  SHIPPED:    "تم الشحن",
  DELIVERED:  "تم التوصيل",
  CANCELLED:  "ملغي",
};

interface AdminOrderStatusFormProps {
  orderId: string;
  currentStatus: string;
  currentPaymentStatus: string;
  currentTrackingNumber?: string;
}

export function AdminOrderStatusForm({
  orderId,
  currentStatus,
  currentPaymentStatus,
  currentTrackingNumber = "",
}: AdminOrderStatusFormProps) {
  const [status, setStatus]               = useState(currentStatus);
  const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus);
  const [trackingNumber, setTrackingNumber] = useState(currentTrackingNumber);
  const [actionStatus, setActionStatus]   = useState<"idle" | "executing">("idle");
  const [resultMsg, setResultMsg]         = useState<{ type: "error" | "success"; text: string } | null>(null);

  const allowedTransitions = VALID_TRANSITIONS[currentStatus] ?? [];
  const isFinalState = allowedTransitions.length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allowedTransitions.includes(status) && status !== currentStatus) {
      setResultMsg({ type: "error", text: "هذا التحويل غير مسموح به" });
      return;
    }
    setActionStatus("executing");
    setResultMsg(null);
    const res = await updateOrderStatusAction({
      id: orderId,
      status: status as "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED",
      paymentStatus: paymentStatus as "PENDING" | "PAID" | "FAILED",
      trackingNumber: trackingNumber.trim() || undefined,
    });
    const outerError = !res?.success ? res?.error : undefined;
    const innerError = res?.data && !res.data.success ? (res.data as { error?: string }).error : undefined;
    const errText = outerError ?? innerError;
    if (errText) {
      setResultMsg({ type: "error", text: errText });
    } else if (res?.data?.success) {
      const msg = (res.data as { message?: string }).message;
      setResultMsg({ type: "success", text: msg ?? "تم التحديث بنجاح" });
    }
    setActionStatus("idle");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl border border-stone">
      <h3 className="text-lg font-bold text-obsidian border-b border-stone pb-2">تحديث الطلب</h3>

      {isFinalState ? (
        <div className="text-sm text-secondary bg-stone/50 p-3 rounded-lg">
          الطلب في حالة نهائية (<strong>{STATUS_LABELS[currentStatus]}</strong>) ولا يمكن تغيير حالته.
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <Label>حالة الطلب</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value={currentStatus}>{STATUS_LABELS[currentStatus]} (الحالية)</option>
              {allowedTransitions.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
            <p className="text-xs text-secondary">التحويلات المسموحة فقط تظهر في القائمة</p>
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

          <div className="space-y-2">
            <Label htmlFor="trackingNumber">رقم التتبع <span className="text-secondary text-xs">(اختياري)</span></Label>
            <Input
              id="trackingNumber"
              placeholder="مثال: EG123456789"
              dir="ltr"
              className="font-mono"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />
            <p className="text-xs text-secondary">سيُرسل للعميل مع إيميل التحديث عند الشحن</p>
          </div>
        </>
      )}

      {resultMsg && (
        <div className={`text-sm px-3 py-2 rounded-lg ${resultMsg.type === "error" ? "text-red-700 bg-red-50 border border-red-200" : "text-green-700 bg-green-50 border border-green-200"}`}>
          {resultMsg.text}
        </div>
      )}

      {!isFinalState && (
        <Button
          type="submit"
          disabled={actionStatus === "executing"}
          className="w-full bg-tashtep-orange hover:bg-tashtep-orange/90 text-white"
        >
          {actionStatus === "executing" ? "جاري الحفظ..." : "حفظ التغييرات"}
        </Button>
      )}
    </form>
  );
}
