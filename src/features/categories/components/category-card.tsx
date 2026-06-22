import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
}

interface CategoryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  category: Category;
}

export function CategoryCard({ category, className, ...props }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`}>
      <Card className={cn("group overflow-hidden relative aspect-square border-0 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300", className)} {...props}>
        <div className="absolute inset-0 bg-secondary flex items-center justify-center transition-transform duration-700 group-hover:scale-110">
           {category.image ? (
             <Image src={category.image} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover" alt={category.name} />
           ) : (
             <span className="text-muted-foreground opacity-50 z-10">صورة القسم</span>
           )}
        </div>
        
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute bottom-6 left-4 right-4 text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 z-10">
          <h3 className="text-2xl font-bold text-white tracking-wide drop-shadow-md">{category.name}</h3>
          <div className="w-8 h-1 bg-tashtep-orange mx-auto mt-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 shadow-sm" />
        </div>
      </Card>
    </Link>
  );
}
