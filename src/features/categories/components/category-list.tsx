import * as React from "react";
import { cn } from "@/lib/utils";

type CategoryListProps = React.HTMLAttributes<HTMLDivElement>;

export function CategoryList({ className, children, ...props }: CategoryListProps) {
  return (
    <div 
      className={cn("grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6", className)} 
      {...props}
    >
      {children}
    </div>
  );
}
