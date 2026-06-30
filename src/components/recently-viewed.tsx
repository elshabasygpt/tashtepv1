"use client";

import { useEffect } from "react";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import Link from "next/link";

type Props = {
  current: { id: string; name: string; price: number; image?: string };
};

export function TrackRecentlyViewed({ current }: Props) {
  const { addProduct } = useRecentlyViewed();
  useEffect(() => {
    addProduct(current);
  }, [current.id]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

export function RecentlyViewedSection() {
  const { items } = useRecentlyViewed();
  if (items.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="font-bold text-obsidian text-lg mb-4">شاهدت مؤخراً</h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {items.map(p => (
          <Link
            key={p.id}
            href={`/products/${p.id}`}
            className="shrink-0 w-36 border border-soft-border rounded-xl p-3 hover:border-tashtep-orange transition-colors"
          >
            <div className="w-full h-24 bg-stone/30 rounded-lg mb-2 overflow-hidden">
              {p.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              )}
            </div>
            <p className="text-xs font-medium text-obsidian line-clamp-2">{p.name}</p>
            <p className="text-xs text-tashtep-orange font-bold mt-1">{p.price} ج.م</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
