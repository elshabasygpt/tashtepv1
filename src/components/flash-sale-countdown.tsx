"use client";

import { useEffect, useState } from "react";

type Props = {
  saleEndAt: Date | string;
  salePrice: number;
  originalPrice: number;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function FlashSaleCountdown({ saleEndAt, salePrice, originalPrice }: Props) {
  const [timeLeft, setTimeLeft] = useState<{ h: number; m: number; s: number } | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    function tick() {
      const diff = new Date(saleEndAt).getTime() - Date.now();
      if (diff <= 0) {
        setExpired(true);
        setTimeLeft(null);
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ h, m, s });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [saleEndAt]);

  if (expired || !timeLeft) return null;

  const discount = Math.round(((originalPrice - salePrice) / originalPrice) * 100);

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="material-symbols-outlined text-red-500 text-[20px]">bolt</span>
        <span className="font-bold text-red-600 text-sm">عرض محدود الوقت — خصم {discount}%</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          {[{ v: timeLeft.h, l: "ساعة" }, { v: timeLeft.m, l: "دقيقة" }, { v: timeLeft.s, l: "ثانية" }].map(({ v, l }) => (
            <div key={l} className="text-center">
              <div className="bg-red-600 text-white font-bold text-lg rounded px-2 py-1 min-w-[40px] text-center">
                {pad(v)}
              </div>
              <div className="text-xs text-red-500 mt-1">{l}</div>
            </div>
          ))}
        </div>
        <div className="mr-auto text-right">
          <span className="text-2xl font-bold text-red-600">{salePrice} ج.م</span>
          <span className="text-sm text-secondary line-through mr-2">{originalPrice} ج.م</span>
        </div>
      </div>
    </div>
  );
}
