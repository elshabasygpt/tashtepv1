import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface Category {
  id: string;
  name: string;
  image: string;
  description?: string | null;
  itemCount?: number | null;
}

interface CategoryCardProps extends React.HTMLAttributes<HTMLAnchorElement> {
  category: Category;
}

export function CategoryCard({ category, className, ...props }: CategoryCardProps) {
  return (
    <Link 
      href={`/categories/${category.id}`} 
      className={cn("min-w-[280px] md:min-w-[320px] flex-shrink-0 group block snap-start cursor-pointer", className)}
      {...props}
    >
      <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-micro-md bg-stone">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105" 
          style={{ backgroundImage: `url('${category.image || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80"}')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-300 ease-out"></div>
        <div className="absolute bottom-6 left-6 right-6 text-gallery-white flex justify-between items-end">
          <div>
            <h3 className="text-headline-md font-headline-md font-semibold mb-1">{category.name}</h3>
            <p className="text-label-md font-label-md text-gallery-white/80">
              {category.description || `${category.itemCount || 0} منتج`}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gallery-white/20 backdrop-blur-md flex items-center justify-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
            <span className="material-symbols-outlined rtl:rotate-180">arrow_forward</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
