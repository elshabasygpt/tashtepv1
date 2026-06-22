import * as React from "react";
import { cn } from "@/lib/utils";

type ProductGridProps = React.HTMLAttributes<HTMLDivElement>;

export function ProductGrid({ className, children, ...props }: ProductGridProps) {
  return (
    <div 
      className={cn("grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", className)} 
      {...props}
    >
      {children}
    </div>
  );
}
