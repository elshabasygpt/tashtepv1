"use client";

import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import Link from "next/link";
import Image from "next/image";

export default function RecentlyViewedPage() {
  const { items, clear } = useRecentlyViewed();

  return (
    <div className="flex flex-col gap-macro-md">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-obsidian mb-1">
            المنتجات التي شاهدتها
          </h1>
          <p className="font-body-md text-body-md text-secondary">
            {items.length > 0 ? `${items.length} منتج شاهدته مؤخراً` : "لم تشاهد أي منتجات بعد"}
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={clear}
            className="font-label-md text-label-md text-secondary hover:text-red-500 flex items-center gap-1.5 border border-soft-border px-3 py-2 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
            مسح السجل
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-stone rounded-2xl p-12 text-center flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-[56px] text-secondary/40">history</span>
          <p className="font-body-md text-body-md text-secondary">لا يوجد سجل تصفح حتى الآن.</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-tashtep-orange text-white px-5 py-2.5 rounded-full font-label-md text-label-md hover:bg-tashtep-orange/90 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">grid_view</span>
            تصفح المنتجات
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group flex flex-col bg-white border border-soft-border rounded-2xl overflow-hidden hover:border-tashtep-orange/50 hover:shadow-md transition-all"
            >
              <div className="aspect-square bg-stone/30 relative overflow-hidden">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[40px] text-secondary/30">image</span>
                  </div>
                )}
              </div>
              <div className="p-3 flex flex-col gap-1">
                <p className="font-label-md text-[13px] text-obsidian line-clamp-2 leading-snug">{product.name}</p>
                <p className="font-headline-md text-tashtep-orange text-[15px] font-bold tabular-nums">
                  {product.price.toLocaleString("ar-EG")} ج.م
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
