"use client";

import { useCompare } from "@/hooks/use-compare";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function CompareBar() {
  const { items, remove, clear } = useCompare();
  const pathname = usePathname();

  if (pathname === "/compare") return null;
  if (items.length === 0) return null;

  return (
    <>
    <div className="h-20 pointer-events-none" aria-hidden />
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-obsidian text-white shadow-xl border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <span className="text-sm font-medium shrink-0">
          المقارنة ({items.length}/3)
        </span>

        <div className="flex gap-3 flex-1 overflow-x-auto">
          {items.map(item => (
            <div
              key={item.id}
              className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5 shrink-0"
            >
              {item.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-8 h-8 object-cover rounded"
                />
              )}
              <span className="text-sm max-w-[120px] truncate">{item.name}</span>
              <button
                onClick={() => remove(item.id)}
                className="text-white/60 hover:text-white ml-1"
                aria-label="إزالة"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          ))}

          {items.length < 3 &&
            Array.from({ length: 3 - items.length }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-center w-28 h-10 border border-dashed border-white/20 rounded-lg shrink-0"
              >
                <span className="text-white/40 text-xs">+ منتج</span>
              </div>
            ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clear}
            className="text-xs text-white/60 hover:text-white px-2 py-1"
          >
            مسح الكل
          </button>
          {items.length >= 2 && (
            <Link
              href="/compare"
              className="bg-tashtep-orange text-white text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              مقارنة الآن
            </Link>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
