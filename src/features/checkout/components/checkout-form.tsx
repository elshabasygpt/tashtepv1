"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { processCheckoutAction } from "@/actions/checkout.actions";
import { useRouter } from "next/navigation";
import { Loader2, CreditCard, Banknote } from "lucide-react";
import { Label } from "@/components/ui/label";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  phone: z.string().min(10, "رقم الهاتف غير صالح"),
  address: z.string().min(5, "العنوان يجب أن يكون مفصلاً"),
  city: z.string().min(2, "المدينة مطلوبة"),
  paymentMethod: z.enum(["cod", "card"]),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  cartItems: {
    productId: string;
    quantity: number;
    price: number;
  }[];
}

export function CheckoutForm({ cartItems }: CheckoutFormProps) {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { fullName: "", phone: "", address: "", city: "", paymentMethod: "cod" },
  });

  async function onSubmit(data: CheckoutFormValues) {
    setError(null);
    const payload = {
      shippingDetails: {
        fullName: data.fullName,
        phone: data.phone,
        address: data.address,
        city: data.city,
      },
      cartItems: cartItems,
      paymentMethod: data.paymentMethod,
    };
    const result = await processCheckoutAction(payload);
    
    if (result?.data?.success) {
      if (result.data.paymentUrl) {
        // Redirect to Paymob iframe
        window.location.href = result.data.paymentUrl;
      } else {
        router.push("/account/orders"); // Redirect to actual orders page
      }
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
            <div className="space-y-2">
              <Input placeholder="الاسم الكامل" {...form.register("fullName")} />
              {form.formState.errors.fullName && <p className="text-sm text-destructive">{form.formState.errors.fullName.message}</p>}
            </div>
            <div className="space-y-2">
              <Input placeholder="رقم الهاتف" type="tel" {...form.register("phone")} />
              {form.formState.errors.phone && <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Input placeholder="العنوان بالتفصيل (الشارع، رقم العمارة، الشقة)" {...form.register("address")} />
            {form.formState.errors.address && <p className="text-sm text-destructive">{form.formState.errors.address.message}</p>}
          </div>
          <div className="space-y-2">
            <Input placeholder="المدينة / المحافظة" {...form.register("city")} />
            {form.formState.errors.city && <p className="text-sm text-destructive">{form.formState.errors.city.message}</p>}
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
          <Button type="submit" variant="tashtep" className="w-full h-12 text-base mt-6 rounded-lg" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <span className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> جاري التأكيد...</span>
            ) : "تأكيد الطلب والدفع"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
