import Link from "next/link";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "السلة", href: "/cart", icon: "shopping_cart" },
  { label: "إتمام الطلب", href: null, icon: "receipt_long" },
  { label: "تأكيد الطلب", href: null, icon: "check_circle" },
];

export function CheckoutStepper({ currentStep = 1 }: { currentStep?: 0 | 1 | 2 }) {
  return (
    <nav aria-label="مراحل الطلب" className="flex items-center justify-center gap-0 mb-macro-sm">
      {STEPS.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        const stepNode = (
          <div
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
              isActive && "bg-tashtep-orange/10 text-tashtep-orange",
              isCompleted && "text-green-600",
              !isActive && !isCompleted && "text-secondary"
            )}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "16px", fontVariationSettings: isCompleted ? "'FILL' 1" : "'FILL' 0" }}
            >
              {isCompleted ? "check_circle" : step.icon}
            </span>
            <span className="hidden sm:inline">{step.label}</span>
          </div>
        );

        return (
          <div key={step.label} className="flex items-center">
            {index > 0 && (
              <div
                className={cn(
                  "w-8 sm:w-12 h-px mx-1",
                  isCompleted ? "bg-green-400" : "bg-stone-200"
                )}
              />
            )}
            {isCompleted && step.href ? (
              <Link href={step.href} aria-label={`العودة إلى ${step.label}`}>
                {stepNode}
              </Link>
            ) : (
              <span aria-current={isActive ? "step" : undefined}>{stepNode}</span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
