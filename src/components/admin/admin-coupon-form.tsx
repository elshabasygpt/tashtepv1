"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCouponAction, updateCouponAction } from "@/actions/coupon.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AdminCouponFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
  isEdit?: boolean;
}

export function AdminCouponForm({ initialData, isEdit }: AdminCouponFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    code: initialData?.code || "",
    discountType: initialData?.discountType || "PERCENTAGE",
    discountValue: initialData?.discountValue || 0,
    minOrderValue: initialData?.minOrderValue || "",
    maxDiscount: initialData?.maxDiscount || "",
    usageLimit: initialData?.usageLimit || "",
    isActive: initialData?.isActive ?? true,
    expiresAt: initialData?.expiresAt ? new Date(initialData.expiresAt).toISOString().split('T')[0] : "",
  });

  const [status, setStatus] = useState<"idle" | "executing">("idle");
  const [result, setResult] = useState<{ success?: boolean; error?: string; serverError?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("executing");
    setResult(null);

    const payload = {
      code: formData.code.toUpperCase(),
      discountType: formData.discountType as "PERCENTAGE" | "FIXED",
      discountValue: Number(formData.discountValue),
      minOrderValue: formData.minOrderValue ? Number(formData.minOrderValue) : null,
      maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
      usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
      isActive: formData.isActive,
      expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : null,
    };

    let res;
    if (isEdit && initialData?.id) {
      res = await updateCouponAction({ id: initialData.id, data: payload });
    } else {
      res = await createCouponAction(payload);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setResult(res as any);
    setStatus("idle");

    if (!res?.error) {
      router.push("/admin/coupons");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl bg-white p-6 rounded-xl border border-stone">
      <div className="space-y-2">
        <Label htmlFor="code">كود الخصم</Label>
        <Input
          id="code"
          required
          placeholder="مثال: SUMMER24"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="discountType">نوع الخصم</Label>
          <select
            id="discountType"
            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={formData.discountType}
            onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
          >
            <option value="PERCENTAGE">نسبة مئوية (%)</option>
            <option value="FIXED">مبلغ ثابت (ج.م)</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="discountValue">قيمة الخصم</Label>
          <Input
            id="discountValue"
            type="number"
            step="0.01"
            min="0"
            required
            value={formData.discountValue}
            onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="minOrderValue">الحد الأدنى للطلب (اختياري)</Label>
          <Input
            id="minOrderValue"
            type="number"
            min="0"
            placeholder="مثال: 500"
            value={formData.minOrderValue}
            onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxDiscount">الحد الأقصى للخصم (اختياري)</Label>
          <Input
            id="maxDiscount"
            type="number"
            min="0"
            placeholder="مثال: 150"
            disabled={formData.discountType === "FIXED"}
            value={formData.maxDiscount}
            onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
          />
          {formData.discountType === "FIXED" && (
            <p className="text-xs text-secondary mt-1">يُطبق فقط على الخصم بالنسبة المئوية</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="usageLimit">حد الاستخدام الكلي (اختياري)</Label>
          <Input
            id="usageLimit"
            type="number"
            min="1"
            placeholder="مثال: 100"
            value={formData.usageLimit}
            onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expiresAt">تاريخ الانتهاء (اختياري)</Label>
          <Input
            id="expiresAt"
            type="date"
            value={formData.expiresAt}
            onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          className="w-4 h-4 text-tashtep-orange rounded border-stone focus:ring-tashtep-orange"
        />
        <Label htmlFor="isActive" className="cursor-pointer">الكوبون مفعل؟</Label>
      </div>

      {result?.error && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">{result.error}</div>
      )}

      <div className="flex justify-between pt-4 border-t border-stone">
        {isEdit && initialData?.id ? (
          <Button 
            type="button" 
            variant="destructive"
            onClick={async () => {
              if (confirm("هل أنت متأكد من حذف هذا الكوبون؟")) {
                await import("@/actions/coupon.actions").then(m => m.deleteCouponAction({ id: initialData.id }));
                router.push("/admin/coupons");
                router.refresh();
              }
            }}
          >
            حذف الكوبون
          </Button>
        ) : <div />}
        <div className="flex gap-3">
          <Button variant="outline" type="button" onClick={() => router.push("/admin/coupons")}>إلغاء</Button>
          <Button type="submit" disabled={status === "executing"} className="bg-indigo-500 hover:bg-indigo-600 text-white">
            {status === "executing" ? "جاري الحفظ..." : "حفظ الكوبون"}
          </Button>
        </div>
      </div>
    </form>
  );
}
