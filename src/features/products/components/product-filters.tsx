"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export interface FilterCategory {
  id: string;
  name: string;
}

export interface FilterColor {
  value: string;
  label: string;
}

interface ProductFiltersProps {
  categories: FilterCategory[];
  colors?: FilterColor[];
  defaultValues?: {
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    categoryId?: string;
    sort?: string;
    q?: string;
    colors?: string[];
  };
}

const SORT_OPTIONS = [
  { value: "newest", label: "الأحدث" },
  { value: "price_asc", label: "السعر: من الأقل للأعلى" },
  { value: "price_desc", label: "السعر: من الأعلى للأقل" },
  { value: "rating_desc", label: "الأعلى تقييماً" },
];

export function ProductFilters({ categories, colors = [], defaultValues }: ProductFiltersProps) {
  const router = useRouter();
  const formRef = React.useRef<HTMLFormElement>(null);

  const hasActiveFilters = Boolean(
    defaultValues?.minPrice || 
    defaultValues?.maxPrice || 
    defaultValues?.inStock === "true" || 
    defaultValues?.categoryId ||
    (defaultValues?.colors && defaultValues.colors.length > 0)
  );

  const handleSubmit = React.useCallback(() => {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    
    const minPrice = formData.get("minPrice")?.toString();
    const maxPrice = formData.get("maxPrice")?.toString();
    const inStock = formData.get("inStock") === "on";
    const categoryId = formData.get("categoryId")?.toString();
    const sort = formData.get("sort")?.toString();
    const q = formData.get("q")?.toString();
    const selectedColors = formData.getAll("color") as string[];

    const params = new URLSearchParams();
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (inStock) params.set("inStock", "true");
    if (categoryId) params.set("categoryId", categoryId);
    if (sort) params.set("sort", sort);
    if (q) params.set("q", q);
    
    selectedColors.forEach((color) => {
      params.append("color", color);
    });

    router.push(`/products?${params.toString()}`);
  }, [router]);

  return (
    <div className="bg-white p-gutter rounded-xl border border-soft-border sticky top-24">
      <div className="flex items-center justify-between mb-micro-md">
        <h3 className="font-headline-md text-[20px] text-obsidian">تصفية المنتجات</h3>
        {hasActiveFilters && (
          <Link href="/products" className="font-label-md text-[13px] text-secondary hover:text-tashtep-orange transition-colors underline">
            مسح الفلاتر
          </Link>
        )}
      </div>

      <form ref={formRef} className="space-y-gutter" onChange={(e) => {
        // Only auto-submit for selects, checkboxes, radios
        const target = e.target as HTMLInputElement;
        if (target.type === "radio" || target.type === "checkbox" || target.tagName === "SELECT") {
          handleSubmit();
        }
      }}>
        {defaultValues?.q && <input type="hidden" name="q" value={defaultValues.q} />}

        {/* Sort */}
        <div className="space-y-2">
          <label className="font-label-md text-label-md text-obsidian block">الترتيب حسب</label>
          <select
            name="sort"
            defaultValue={defaultValues?.sort || "newest"}
            className="w-full h-10 rounded border border-soft-border bg-stone px-3 font-body-md text-body-md text-obsidian focus:border-tashtep-orange focus:ring-0 outline-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="space-y-2">
            <label className="font-label-md text-label-md text-obsidian block">الفئة</label>
            <div className="flex flex-wrap gap-2">
              <label
                className={cn(
                  "cursor-pointer rounded-full px-3 py-1.5 font-label-md text-[13px] border transition-colors",
                  !defaultValues?.categoryId
                    ? "bg-obsidian text-white border-obsidian"
                    : "bg-stone text-charcoal border-stone hover:border-obsidian"
                )}
              >
                <input type="radio" name="categoryId" value="" defaultChecked={!defaultValues?.categoryId} className="sr-only" />
                الكل
              </label>
              {categories.map((category) => (
                <label
                  key={category.id}
                  className={cn(
                    "cursor-pointer rounded-full px-3 py-1.5 font-label-md text-[13px] border transition-colors",
                    defaultValues?.categoryId === category.id
                      ? "bg-obsidian text-white border-obsidian"
                      : "bg-stone text-charcoal border-stone hover:border-obsidian"
                  )}
                >
                  <input
                    type="radio"
                    name="categoryId"
                    value={category.id}
                    defaultChecked={defaultValues?.categoryId === category.id}
                    className="sr-only"
                  />
                  {category.name}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Colors */}
        {colors.length > 0 && (
          <div className="space-y-2">
            <label className="font-label-md text-label-md text-obsidian block">الألوان</label>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => {
                const isSelected = defaultValues?.colors?.includes(color.value);
                const isHex = color.value.startsWith("#");
                
                return (
                  <label
                    key={color.value}
                    title={color.label}
                    className={cn(
                      "cursor-pointer rounded-full w-8 h-8 flex items-center justify-center border-2 transition-all relative group",
                      isSelected ? "border-obsidian scale-110" : "border-transparent hover:scale-105 shadow-sm"
                    )}
                    style={isHex ? { backgroundColor: color.value } : { backgroundColor: "#f3f4f6" }}
                  >
                    <input
                      type="checkbox"
                      name="color"
                      value={color.value}
                      defaultChecked={isSelected}
                      className="sr-only"
                    />
                    {!isHex && <span className="text-[10px] text-charcoal font-bold">{color.label.substring(0, 2)}</span>}
                    {isSelected && isHex && (
                      <span className="material-symbols-outlined text-[16px] text-white mix-blend-difference">check</span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Price */}
        <div className="space-y-2">
          <label className="font-label-md text-label-md text-obsidian block">السعر (ج.م)</label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              name="minPrice"
              placeholder="من"
              defaultValue={defaultValues?.minPrice}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              onBlur={handleSubmit}
              className="w-full"
            />
            <span className="text-secondary">-</span>
            <Input
              type="number"
              name="maxPrice"
              placeholder="إلى"
              defaultValue={defaultValues?.maxPrice}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              onBlur={handleSubmit}
              className="w-full"
            />
          </div>
        </div>

        {/* In stock */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="inStock"
            name="inStock"
            defaultChecked={defaultValues?.inStock === "true"}
            className="h-4 w-4 rounded border-soft-border text-tashtep-orange focus:ring-tashtep-orange"
          />
          <label htmlFor="inStock" className="font-label-md text-label-md text-charcoal cursor-pointer">
            متوفر في المخزون فقط
          </label>
        </div>
      </form>
    </div>
  );
}
