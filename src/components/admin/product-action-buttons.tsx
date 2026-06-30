"use client";

import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteProductAction, restoreProductAction } from "@/actions/admin.actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function DeleteProductButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!window.confirm("هل أنت متأكد من رغبتك في حذف هذا المنتج؟ (سيتم إخفاؤه من المتجر والاحتفاظ به في السجلات)")) {
      return;
    }
    startTransition(async () => {
      const res = await deleteProductAction(id);
      if (res?.success) toast.success(res.data?.message);
      else toast.error(res?.error || "حدث خطأ أثناء الحذف");
    });
  };

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isPending}>
      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="material-symbols-outlined text-[18px]">delete</span>}
    </Button>
  );
}

export function RestoreProductButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleRestore = () => {
    startTransition(async () => {
      const res = await restoreProductAction(id);
      if (res?.success) toast.success(res.data?.message);
      else toast.error(res?.error || "حدث خطأ أثناء الاستعادة");
    });
  };

  return (
    <Button variant="outline" size="sm" onClick={handleRestore} disabled={isPending} className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200">
      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="material-symbols-outlined text-[18px]">restore</span>}
    </Button>
  );
}
