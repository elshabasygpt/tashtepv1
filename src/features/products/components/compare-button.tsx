"use client";

import { useCompare } from "@/hooks/use-compare";
import { cn } from "@/lib/utils";

interface CompareButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
  };
  className?: string;
}

export function CompareButton({ product, className }: CompareButtonProps) {
  const { add, remove, has } = useCompare();
  const inCompare = has(product.id);

  function handleClick() {
    if (inCompare) {
      remove(product.id);
    } else {
      add({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      });
    }
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all",
        inCompare
          ? "bg-tashtep-orange/10 border-tashtep-orange text-tashtep-orange hover:bg-tashtep-orange/20"
          : "border-stone/60 text-secondary hover:border-obsidian hover:text-obsidian",
        className
      )}
    >
      <span
        className="material-symbols-outlined text-[18px]"
        style={{ fontVariationSettings: inCompare ? "'FILL' 1" : "'FILL' 0" }}
      >
        compare_arrows
      </span>
      {inCompare ? "إزالة من المقارنة" : "أضف للمقارنة"}
    </button>
  );
}
