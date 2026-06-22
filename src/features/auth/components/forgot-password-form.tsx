"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requestPasswordResetAction } from "@/actions/auth.actions";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

const forgotPasswordSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [error, setError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(data: ForgotPasswordValues) {
    setError(null);
    setSuccessMsg(null);
    
    const result = await requestPasswordResetAction(data);
    
    if (result?.data?.success) {
      setSuccessMsg("إذا كان هذا البريد مسجلاً لدينا، فستتلقى رابطاً لإعادة تعيين كلمة المرور قريباً.");
    } else {
      setError(result?.error || "حدث خطأ غير متوقع. حاول مرة أخرى.");
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-obsidian">نسيت كلمة المرور؟</h1>
        <p className="text-sm text-muted-foreground">
          أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded bg-destructive/15 text-destructive text-sm font-medium">
          {error}
        </div>
      )}
      
      {successMsg ? (
        <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-center space-y-4">
          <p className="text-green-800 text-sm font-medium">
            {successMsg}
          </p>
          <Link href="/login" className="inline-flex items-center text-sm font-medium text-tashtep-orange hover:underline">
            <ArrowRight className="ml-2 h-4 w-4" />
            العودة لتسجيل الدخول
          </Link>
        </div>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">البريد الإلكتروني</label>
            <Input type="email" placeholder="name@example.com" {...form.register("email")} dir="ltr" className="text-left" />
            {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
          </div>

          <Button type="submit" variant="tashtep" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> جاري الإرسال...</span>
            ) : "إرسال رابط إعادة التعيين"}
          </Button>

          <div className="text-center text-sm">
            <Link href="/login" className="text-muted-foreground hover:text-tashtep-orange transition-colors">
              تذكرت كلمة المرور؟ تسجيل الدخول
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
