import * as React from "react";
import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
      role="radiogroup"
    />
  );
});
RadioGroup.displayName = "RadioGroup";

export type RadioGroupItemProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative inline-flex items-center justify-center">
        <input
          type="radio"
          className={cn(
            "peer aspect-square h-4 w-4 shrink-0 appearance-none rounded-full border border-stone bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:border-tashtep-orange transition-all cursor-pointer",
            className
          )}
          ref={ref}
          {...props}
        />
        <div className="pointer-events-none absolute hidden h-2.5 w-2.5 rounded-full bg-tashtep-orange peer-checked:block" />
      </div>
    );
  }
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
