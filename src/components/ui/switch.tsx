import * as React from "react";
import { cn } from "@/lib/utils";

export type SwitchProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        className={cn(
          "relative inline-flex items-center cursor-pointer",
          className
        )}
      >
        <input
          type="checkbox"
          role="switch"
          className="peer sr-only"
          ref={ref}
          {...props}
        />
        <div
          className={cn(
            "w-9 h-5 bg-stone peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background rounded-full peer transition-colors",
            "after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-background after:border-stone after:border after:rounded-full after:h-4 after:w-4 after:transition-transform",
            "peer-checked:bg-tashtep-orange peer-checked:after:translate-x-4 rtl:peer-checked:after:-translate-x-4",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
          )}
        ></div>
      </label>
    );
  }
);
Switch.displayName = "Switch";

export { Switch };
