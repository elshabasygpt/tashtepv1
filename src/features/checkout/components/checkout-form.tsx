"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { processCheckoutAction, processGuestCheckoutAction } from "@/actions/checkout.actions";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { Loader2, CreditCard, Banknote } from "lucide-react";
import { Label } from "@/components/ui/label";

import { Select } from "@/components/ui/select";
import { Governorate } from "@prisma/client";

const baseCheckoutSchema = {
  fullName: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  phone: z.string().min(10, "رقم الهاتف غير صالح"),
  address: z.string().min(5, "العنوان يجب أن يكون مفصلاً"),
  city: z.string().min(2, "المدينة مطلوبة"),
  customerNotes: z.string().max(500).optional(),
  paymentMethod: z.enum(["cod", "card"]),
};

const checkoutSchema = z.object(baseCheckoutSchema);
const guestCheckoutSchema = z.object({
  ...baseCheckoutSchema,
  email: z.string().email("البريد الإلكتروني غير صحيح"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema> & { email?: string };

interface CheckoutFormProps {
  cartItems: {
    productId: string;
    variantId?: string;
    quantity: number;
    price: number;
  }[];
  defaultValues?: {
    fullName?: string;
    phone?: string;
  };
  governorates: Governorate[];
  onCityChange: (cityName: string) => void;
  couponCode?: string;
  giftCardCode?: string;
  loyaltyPointsToRedeem?: number;
  /** Render the email field and submit via the public guest-checkout action. */
  isGuest?: boolean;
}

export function CheckoutForm({ cartItems, defaultValues, governorates, onCityChange, couponCode, giftCardCode, loyaltyPointsToRedeem, isGuest }: CheckoutFormProps) {
  const router = useRouter();
  const { clearCart } = useCart();
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(isGuest ? guestCheckoutSchema : checkoutSchema),
    defaultValues: {
      fullName: defaultValues?.fullName || "",
      phone: defaultValues?.phone || "",
      address: "",
      city: "",
      customerNotes: "",
      paymentMethod: "cod",
      email: "",
    },
  });

  async function onSubmit(data: CheckoutFormValues) {
    setError(null);
    const shippingDetails = {
      fullName: data.fullName,
      phone: data.phone,
      address: data.address,
      city: data.city,
    };

    const result = isGuest
      ? await processGuestCheckoutAction({
          shippingDetails,
          cartItems,
          paymentMethod: data.paymentMethod,
          couponCode,
          giftCardCode,
          guestEmail: data.email!,
          customerNotes: data.customerNotes || undefined,
        })
      : await processCheckoutAction({
          shippingDetails,
          cartItems,
          paymentMethod: data.paymentMethod,
          couponCode,
          giftCardCode,
          loyaltyPointsToRedeem: loyaltyPointsToRedeem ?? 0,
          customerNotes: data.customerNotes || undefined,
        });

    if (result?.data?.success) {
      if (isGuest) clearCart();
      if (result.data.paymentUrl) {
        // Redirect to Paymob iframe — validate scheme to prevent javascript: XSS
        try {
          const url = new URL(result.data.paymentUrl);
          if (url.protocol !== "https:") throw new Error("unsafe");
          window.location.href = url.href;
        } catch {
          setError("رابط الدفع غير صالح. يرجى التواصل مع الدعم.");
          return;
        }
      } else if (result.data.orderId) {
        router.push(`/order-success/${result.data.orderId}`);
      } else {
        router.push("/account/orders");
      }
    } else if (result?.data?.orderId) {
      // Order was committed to DB but Paymob failed.
      // Navigate away immediately to prevent duplicate re-submission,
      // passing paymentFailed=1 so the order-success page shows the right message.
      if (isGuest) clearCart();
      router.push(`/order-success/${result.data.orderId}?paymentFailed=1`);
    } else {
      setError(result?.error || result?.data?.message || "حدث خطأ غير متوقع. حاول مرة أخرى.");
    }
  }

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">بيانات الشحن والدفع</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 rounded bg-destructive/15 text-destructive text-sm font-medium">
            {error}
          </div>
        )}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-sm font-medium text-obsidian">الاسم الكامل <span className="text-red-500">*</span></Label>
              <Input id="fullName" placeholder="مثال: محمد أحمد" {...form.register("fullName")} />
              {form.formState.errors.fullName && <p className="text-sm text-destructive">{form.formState.errors.fullName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-sm font-medium text-obsidian">رقم الهاتف <span className="text-red-500">*</span></Label>
              <Input id="phone" placeholder="01xxxxxxxxx" type="tel" dir="ltr" className="text-right" {...form.register("phone")} />
              {form.formState.errors.phone && <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>}
            </div>
          </div>
          {isGuest && (
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-obsidian">البريد الإلكتروني <span className="text-red-500">*</span></Label>
              <Input id="email" placeholder="example@email.com" type="email" dir="ltr" className="text-right" {...form.register("email")} />
              {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="address" className="text-sm font-medium text-obsidian">العنوان بالتفصيل <span className="text-red-500">*</span></Label>
            <Input id="address" placeholder="الشارع، رقم العمارة، الشقة، الدور" {...form.register("address")} />
            {form.formState.errors.address && <p className="text-sm text-destructive">{form.formState.errors.address.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="city" className="text-sm font-medium text-obsidian">المدينة / المحافظة <span className="text-red-500">*</span></Label>
            <Select
              id="city"
              {...form.register("city", {
                onChange: (e) => onCityChange(e.target.value)
              })}
            >
              <option value="" disabled>اختر المحافظة</option>
              {governorates.map((gov) => (
                <option key={gov.id} value={gov.name}>{gov.name}</option>
              ))}
            </Select>
            {form.formState.errors.city && <p className="text-sm text-destructive">{form.formState.errors.city.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="customerNotes" className="text-sm font-medium text-obsidian">ملاحظات إضافية <span className="text-secondary text-xs">(اختياري)</span></Label>
            <textarea
              id="customerNotes"
              rows={3}
              placeholder="مثال: اتركها عند الحارس — لا تتصل قبل الساعة 10 صباحاً"
              className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              {...form.register("customerNotes")}
            />
          </div>

          <div className="space-y-3 pt-4 border-t border-stone">
            <h3 className="font-semibold text-lg">طريقة الدفع</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="radiogroup">
              <div>
                <input
                  type="radio"
                  value="cod"
                  id="cod"
                  className="peer sr-only"
                  {...form.register("paymentMethod")}
                />
                <Label
                  htmlFor="cod"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-checked:border-tashtep-orange cursor-pointer"
                >
                  <Banknote className="mb-3 h-6 w-6" />
                  الدفع عند الاستلام
                </Label>
              </div>
              <div>
                <input
                  type="radio"
                  value="card"
                  id="card"
                  className="peer sr-only"
                  {...form.register("paymentMethod")}
                />
                <Label
                  htmlFor="card"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-checked:border-tashtep-orange cursor-pointer"
                >
                  <CreditCard className="mb-3 h-6 w-6" />
                  الدفع إلكترونياً (بطاقة/محفظة)
                </Label>
              </div>
            </div>
          </div>

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-6 py-3 border-t border-stone/60">
            {[
              { icon: "lock", label: "دفع آمن" },
              { icon: "published_with_changes", label: "إرجاع مجاني" },
              { icon: "local_shipping", label: "توصيل لجميع المحافظات" },
            ].map((t) => (
              <div key={t.icon} className="flex flex-col items-center gap-1 text-secondary">
                <span className="material-symbols-outlined text-[20px] text-tashtep-orange">{t.icon}</span>
                <span className="text-[10px] font-medium whitespace-nowrap">{t.label}</span>
              </div>
            ))}
          </div>

          <Button type="submit" variant="tashtep" className="w-full h-12 text-base rounded-lg" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <span className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> جاري التأكيد...</span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">verified</span>
                تأكيد الطلب والدفع
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
