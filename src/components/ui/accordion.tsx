"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

type AccordionType = "single" | "multiple";

interface AccordionContextValue {
  type: AccordionType;
  value: string | string[];
  onValueChange: (value: string) => void;
}

const AccordionContext = React.createContext<AccordionContextValue>({
  type: "single",
  value: "",
  onValueChange: () => {},
});

export function Accordion({
  type = "single",
  defaultValue,
  value: controlledValue,
  onValueChange,
  className,
  children,
  ...props
}: {
  type?: AccordionType;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "value" | "onChange">) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string | string[]>(
    defaultValue !== undefined ? defaultValue : type === "single" ? "" : []
  );

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const handleValueChange = React.useCallback(
    (itemValue: string) => {
      let newValue: string | string[];

      if (type === "single") {
        newValue = value === itemValue ? "" : itemValue;
      } else {
        const valueArray = Array.isArray(value) ? value : [];
        newValue = valueArray.includes(itemValue)
          ? valueArray.filter((v) => v !== itemValue)
          : [...valueArray, itemValue];
      }

      if (!isControlled) {
        setUncontrolledValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [isControlled, onValueChange, type, value]
  );

  return (
    <AccordionContext.Provider
      value={{ type, value, onValueChange: handleValueChange }}
    >
      <div className={cn("space-y-1", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

const AccordionItemContext = React.createContext<{ value: string }>({ value: "" });

export const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, ...props }, ref) => {
  return (
    <AccordionItemContext.Provider value={{ value }}>
      <div ref={ref} className={cn("border-b border-stone", className)} {...props} />
    </AccordionItemContext.Provider>
  );
});
AccordionItem.displayName = "AccordionItem";

export const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { value: itemValue } = React.useContext(AccordionItemContext);
  const { value: contextValue, onValueChange } = React.useContext(AccordionContext);

  const isOpen =
    typeof contextValue === "string"
      ? contextValue === itemValue
      : contextValue.includes(itemValue);

  return (
    <h3 className="flex">
      <button
        ref={ref}
        type="button"
        aria-expanded={isOpen}
        onClick={() => onValueChange(itemValue)}
        className={cn(
          "flex flex-1 items-center justify-between py-4 text-sm font-bold transition-all hover:text-tashtep-orange [&[aria-expanded=true]>svg]:rotate-180 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
      </button>
    </h3>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

export const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { value: itemValue } = React.useContext(AccordionItemContext);
  const { value: contextValue } = React.useContext(AccordionContext);

  const isOpen =
    typeof contextValue === "string"
      ? contextValue === itemValue
      : contextValue.includes(itemValue);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      role="region"
      className={cn(
        "overflow-hidden text-sm animate-in fade-in-0 slide-in-from-top-2",
        className
      )}
      data-state={isOpen ? "open" : "closed"}
      {...props}
    >
      <div className="pb-4 pt-0 opacity-90 leading-relaxed">{children}</div>
    </div>
  );
});
AccordionContent.displayName = "AccordionContent";
