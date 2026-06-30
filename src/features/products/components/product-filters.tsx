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

export interface FilterSize {
  value: string;
  label: string;
}

interface ProductFiltersProps {
  categories: FilterCategory[];
  brands?: { id: string; name: string }[];
  colors?: FilterColor[];
  sizes?: FilterSize[];
  defaultValues?: {
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    categoryId?: string;
    brandId?: string;
    sort?: string;
    q?: string;
    colors?: string[];
    sizes?: string[];
  };
}

const SORT_OPTIONS = [
  { value: "newest", label: "الأحدث" },
  { value: "price_asc", label: "السعر: من الأقل للأعلى" },
  { value: "price_desc", label: "السعر: من الأعلى للأقل" },
  { value: "rating_desc", label: "الأعلى تقييماً" },
];

export function ProductFilters({ categories, brands = [], colors = [], sizes = [], defaultValues }: ProductFiltersProps) {
  const router = useRouter();
  const formRef = React.useRef<HTMLFormElement>(null);

  const hasActiveFilters = Boolean(
    defaultValues?.minPrice || 
    defaultValues?.maxPrice || 
    defaultValues?.inStock === "true" || 
    defaultValues?.categoryId ||
    defaultValues?.brandId ||
    (defaultValues?.colors && defaultValues.colors.length > 0) ||
    (defaultValues?.sizes && defaultValues.sizes.length > 0)
  );

  const [isPending, startTransition] = React.useTransition();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const handleSubmit = React.useCallback(() => {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    
    const minPrice = formData.get("minPrice")?.toString();
    const maxPrice = formData.get("maxPrice")?.toString();
    const inStock = formData.get("inStock") === "on";
    const categoryId = formData.get("categoryId")?.toString();
    const brandId = formData.get("brandId")?.toString();
    const sort = formData.get("sort")?.toString();
    const q = formData.get("q")?.toString();
    const selectedColors = formData.getAll("color") as string[];
    const selectedSizes = formData.getAll("size") as string[];

    const params = new URLSearchParams();
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (inStock) params.set("inStock", "true");
    if (categoryId) params.set("categoryId", categoryId);
    if (brandId) params.set("brandId", brandId);
    if (sort) params.set("sort", sort);
    if (q) params.set("q", q);
    
    selectedColors.forEach((color) => {
      params.append("color", color);
    });

    selectedSizes.forEach((size) => {
      params.append("size", size);
    });

    startTransition(() => {
      router.push(`/products?${params.toString()}`, { scroll: false });
      setIsMobileOpen(false);
    });
  }, [router]);

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden mb-4 flex items-center gap-2">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 bg-stone text-obsidian py-3 rounded-lg font-headline-md border border-soft-border shadow-sm active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[20px]">tune</span>
          الفلاتر والتصنيفات
          {hasActiveFilters && (
            <span className="w-5 h-5 rounded-full bg-tashtep-orange text-white text-[11px] font-bold flex items-center justify-center">
              ✓
            </span>
          )}
        </button>
        {hasActiveFilters && (
          <Link href="/products" className="flex items-center gap-1 text-sm text-secondary hover:text-red-500 border border-soft-border px-3 py-3 rounded-lg bg-white transition-colors">
            <span className="material-symbols-outlined text-[16px]">close</span>
            مسح
          </Link>
        )}
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-obsidian/40 z-[100] lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Filters Container */}
      <div className={cn(
        "bg-white border-soft-border relative",
        // Desktop styles:
        "lg:p-gutter lg:rounded-xl lg:border lg:sticky lg:top-24 lg:block",
        // Mobile styles:
        isMobileOpen 
          ? "fixed inset-x-0 bottom-0 z-[101] max-h-[85vh] overflow-y-auto rounded-t-3xl p-6 pb-safe shadow-2xl animate-in slide-in-from-bottom-full duration-300" 
          : "hidden lg:block"
      )}>
        {/* Loading Overlay */}
        {isPending && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center z-50 rounded-xl">
            <span className="material-symbols-outlined text-[32px] text-tashtep-orange animate-spin">sync</span>
          </div>
        )}

        {/* Mobile Header */}
        <div className="flex lg:hidden items-center justify-between mb-6 pb-4 border-b border-soft-border">
          <h3 className="font-headline-md text-[20px] text-obsidian">الفلاتر</h3>
          <div className="flex items-center gap-4">
            {hasActiveFilters && (
              <Link href="/products" onClick={() => setIsMobileOpen(false)} className="font-label-md text-[13px] text-tashtep-orange hover:underline transition-colors">
                مسح
              </Link>
            )}
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-stone text-secondary hover:text-obsidian transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between mb-micro-md">
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

        {/* Brands */}
        {brands.length > 0 && (
          <div className="space-y-2">
            <label className="font-label-md text-label-md text-obsidian block">العلامة التجارية</label>
            <div className="flex flex-wrap gap-2">
              <label
                className={cn(
                  "cursor-pointer rounded-full px-3 py-1.5 font-label-md text-[13px] border transition-colors",
                  !defaultValues?.brandId
                    ? "bg-obsidian text-white border-obsidian"
                    : "bg-stone text-charcoal border-stone hover:border-obsidian"
                )}
              >
                <input type="radio" name="brandId" value="" defaultChecked={!defaultValues?.brandId} className="sr-only" />
                الكل
              </label>
              {brands.map((brand) => (
                <label
                  key={brand.id}
                  className={cn(
                    "cursor-pointer rounded-full px-3 py-1.5 font-label-md text-[13px] border transition-colors",
                    defaultValues?.brandId === brand.id
                      ? "bg-obsidian text-white border-obsidian"
                      : "bg-stone text-charcoal border-stone hover:border-obsidian"
                  )}
                >
                  <input
                    type="radio"
                    name="brandId"
                    value={brand.id}
                    defaultChecked={defaultValues?.brandId === brand.id}
                    className="sr-only"
                  />
                  {brand.name}
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

        {/* Sizes */}
        {sizes.length > 0 && (
          <div className="space-y-2">
            <label className="font-label-md text-label-md text-obsidian block">الحجم / السعة</label>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => {
                const isSelected = defaultValues?.sizes?.includes(size.value);
                return (
                  <label
                    key={size.value}
                    className={cn(
                      "cursor-pointer rounded border px-3 py-1 font-label-md text-[13px] transition-all text-center min-w-[3rem]",
                      isSelected 
                        ? "bg-tashtep-orange text-white border-tashtep-orange shadow-sm" 
                        : "bg-white text-charcoal border-soft-border hover:border-obsidian"
                    )}
                  >
                    <input
                      type="checkbox"
                      name="size"
                      value={size.value}
                      defaultChecked={isSelected}
                      className="sr-only"
                    />
                    {size.label}
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
    </>
  );
}
