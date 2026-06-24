import * as React from "react";
import { cn } from "@/lib/utils";

type CategoryListProps = React.HTMLAttributes<HTMLDivElement>;

export function CategoryList({ className, children, ...props }: CategoryListProps) {
  return (
    <div 
      className={cn("flex overflow-x-auto hide-scroll gap-macro-sm pb-8 snap-x snap-mandatory", className)} 
      {...props}
    >
      {children}
    </div>
  );
}
