"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { bulkProductActionAction } from "@/actions/admin.actions";

type Product = {
  id: string;
  name: string;
  isActive: boolean;
  stock: number;
  price: number;
  category: { name: string };
  images: Array<{ url: string }>;
};

export function BulkProductActions({ products }: { products: Product[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  function toggleAll(checked: boolean) {
    setSelected(checked ? new Set(products.map(p => p.id)) : new Set());
  }

  function toggle(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }

  function handleBulk(action: "activate" | "deactivate" | "delete") {
    if (selected.size === 0) return toast.error("اختر منتجاً واحداً على الأقل");
    const label = action === "activate" ? "تفعيل" : action === "deactivate" ? "إيقاف" : "حذف";
    startTransition(async () => {
      const result = await bulkProductActionAction(Array.from(selected), action);
      if (result.success) {
        toast.success(`تم ${label} ${selected.size} منتج`);
        setSelected(new Set());
      } else {
        toast.error(result.error ?? "حدث خطأ");
      }
    });
  }

  const allSelected = products.length > 0 && selected.size === products.length;

  return (
    <>
      {/* Bulk toolbar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-sm font-medium text-blue-700">تم تحديد {selected.size} منتج</span>
          <div className="flex gap-2 mr-auto">
            <button
              onClick={() => handleBulk("activate")}
              disabled={isPending}
              className="text-xs px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
            >
              تفعيل
            </button>
            <button
              onClick={() => handleBulk("deactivate")}
              disabled={isPending}
              className="text-xs px-3 py-1.5 bg-amber-500 text-white rounded-md hover:bg-amber-600 disabled:opacity-50"
            >
              إيقاف
            </button>
            <button
              onClick={() => handleBulk("delete")}
              disabled={isPending}
              className="text-xs px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
            >
              حذف
            </button>
            <button
              onClick={() => setSelected(new Set())}
              className="text-xs px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* Select-all header checkbox */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-soft-border bg-stone/10 text-xs text-secondary">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={e => toggleAll(e.target.checked)}
          className="w-4 h-4 accent-tashtep-orange"
        />
        <span>تحديد الكل ({products.length})</span>
      </div>

      {/* Rows */}
      {products.map(p => (
        <div key={p.id} className="flex items-center gap-3 px-4 py-3 border-b border-soft-border hover:bg-stone/5">
          <input
            type="checkbox"
            checked={selected.has(p.id)}
            onChange={() => toggle(p.id)}
            className="w-4 h-4 accent-tashtep-orange shrink-0"
          />
          <div className="w-10 h-10 rounded bg-stone/30 relative overflow-hidden shrink-0">
            {p.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-stone-dark text-sm flex items-center justify-center h-full">image</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-obsidian text-sm truncate">{p.name}</p>
            <p className="text-xs text-secondary">{p.category.name} · {p.price} ج.م · مخزون: {p.stock}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
            {p.isActive ? "نشط" : "متوقف"}
          </span>
          <a href={`/admin/products/${p.id}/edit`} className="text-secondary hover:text-tashtep-orange">
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </a>
        </div>
      ))}
    </>
  );
}
