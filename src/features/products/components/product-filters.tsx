"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { filterProductsRedirectAction } from "@/actions/product.actions";

interface ProductFiltersProps {
  defaultValues?: {
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
  };
}

export function ProductFilters({ defaultValues }: ProductFiltersProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-secondary sticky top-24">
      <h3 className="font-bold text-lg mb-4 text-obsidian">تصفية المنتجات</h3>
      <form action={filterProductsRedirectAction} className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-semibold text-charcoal block">السعر (ج.م)</label>
          <div className="flex items-center gap-2">
            <Input 
              type="number" 
              name="minPrice" 
              placeholder="من" 
              defaultValue={defaultValues?.minPrice}
              className="w-full" 
            />
            <span className="text-muted-foreground">-</span>
            <Input 
              type="number" 
              name="maxPrice" 
              placeholder="إلى" 
              defaultValue={defaultValues?.maxPrice}
              className="w-full" 
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input 
            type="checkbox" 
            id="inStock" 
            name="inStock" 
            defaultChecked={defaultValues?.inStock === "true"}
            className="h-4 w-4 rounded border-gray-300 text-tashtep-orange focus:ring-tashtep-orange"
          />
          <label htmlFor="inStock" className="text-sm font-medium text-charcoal cursor-pointer">
            متوفر في المخزون فقط
          </label>
        </div>

        <Button type="submit" variant="tashtep" className="w-full">
          تطبيق الفلاتر
        </Button>
      </form>
    </div>
  );
}
