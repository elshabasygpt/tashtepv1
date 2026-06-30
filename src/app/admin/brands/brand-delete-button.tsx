"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteBrandAction } from "@/actions/admin.actions";
import { useRouter } from "next/navigation";

export function BrandDeleteButton({ brandId, brandName }: { brandId: string; brandName: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`هل أنت متأكد من حذف ماركة "${brandName}"؟`)) return;
    setLoading(true);
    await deleteBrandAction(brandId);
    router.refresh();
    setLoading(false);
  }

  return (
    <Button variant="outline" size="sm" onClick={handleDelete} disabled={loading}
      className="text-red-600 border-red-200 hover:bg-red-50">
      <span className="material-symbols-outlined text-[16px]">{loading ? "hourglass_empty" : "delete"}</span>
    </Button>
  );
}
