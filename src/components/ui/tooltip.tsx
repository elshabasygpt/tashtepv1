import * as React from "react";
import { cn } from "@/lib/utils";

export interface TooltipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "content"> {
  content: React.ReactNode;
  side?: "top" | "bottom" | "start" | "end";
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ className, content, children, side = "top", ...props }, ref) => {
    return (
      <div className="group relative inline-block" ref={ref} {...props}>
        {children}
        <div
          role="tooltip"
          className={cn(
            "pointer-events-none absolute z-50 opacity-0 transition-all duration-200 ease-in-out group-hover:opacity-100 group-focus-within:opacity-100",
            "rounded-md bg-charcoal px-3 py-1.5 text-xs text-background shadow-md whitespace-nowrap",
            // Positioning logic based on 'side'
            side === "top" && "bottom-full start-1/2 -translate-x-1/2 mb-2 rtl:translate-x-1/2 group-hover:-translate-y-1",
            side === "bottom" && "top-full start-1/2 -translate-x-1/2 mt-2 rtl:translate-x-1/2 group-hover:translate-y-1",
            side === "start" && "end-full top-1/2 -translate-y-1/2 me-2 group-hover:-translate-x-1 rtl:group-hover:translate-x-1",
            side === "end" && "start-full top-1/2 -translate-y-1/2 ms-2 group-hover:translate-x-1 rtl:group-hover:-translate-x-1",
            className
          )}
        >
          {content}
          {/* Tooltip Arrow */}
          <div
            className={cn(
              "absolute h-2 w-2 bg-charcoal rotate-45",
              side === "top" && "bottom-[-4px] start-1/2 -translate-x-1/2 rtl:translate-x-1/2",
              side === "bottom" && "top-[-4px] start-1/2 -translate-x-1/2 rtl:translate-x-1/2",
              side === "start" && "end-[-4px] top-1/2 -translate-y-1/2",
              side === "end" && "start-[-4px] top-1/2 -translate-y-1/2"
            )}
          />
        </div>
      </div>
    );
  }
);
Tooltip.displayName = "Tooltip";

export { Tooltip };
