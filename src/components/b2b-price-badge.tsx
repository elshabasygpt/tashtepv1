"use client";

import { useEffect, useState } from "react";

type Props = { productId: string };

export function B2BPriceBadge({ productId }: Props) {
  const [data, setData] = useState<{ visible: boolean; b2bPrice?: number; savings?: number } | null>(null);

  useEffect(() => {
    fetch(`/api/products/b2b-price?productId=${productId}`)
      .then(r => r.json())
      .then(setData)
      .catch(() => {});
  }, [productId]);

  if (!data?.visible || !data.b2bPrice) return null;

  return (
    <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="material-symbols-outlined text-blue-600 text-[18px]">business</span>
        <span className="font-bold text-blue-700 text-sm">سعر الجملة (B2B)</span>
      </div>
      <p className="text-2xl font-bold text-blue-700">{data.b2bPrice} ج.م</p>
      {data.savings && data.savings > 0 && (
        <p className="text-xs text-blue-500 mt-1">توفر {data.savings} ج.م عن سعر التجزئة</p>
      )}
    </div>
  );
}
