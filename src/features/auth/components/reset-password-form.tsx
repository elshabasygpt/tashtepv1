"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPasswordAction } from "@/actions/auth.actions";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const resetPasswordSchema = z.object({
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  confirmPassword: z.string().min(6, "تأكيد كلمة المرور مطلوب"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [error, setError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const router = useRouter();

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(data: ResetPasswordValues) {
    setError(null);
    setSuccessMsg(null);
    
    const result = await resetPasswordAction({ token, password: data.password });
    
    if (result?.data?.success) {
      setSuccessMsg("تم إعادة تعيين كلمة المرور بنجاح. سيتم تحويلك لصفحة تسجيل الدخول...");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } else {
      setError(result?.error || "حدث خطأ غير متوقع. حاول مرة أخرى.");
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-obsidian">إعادة تعيين كلمة المرور</h1>
        <p className="text-sm text-muted-foreground">
          أدخل كلمة المرور الجديدة لتأمين حسابك.
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
          <Loader2 className="h-5 w-5 animate-spin mx-auto text-green-700" />
        </div>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">كلمة المرور الجديدة</label>
            <Input type="password" {...form.register("password")} dir="ltr" className="text-left" />
            {form.formState.errors.password && <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">تأكيد كلمة المرور</label>
            <Input type="password" {...form.register("confirmPassword")} dir="ltr" className="text-left" />
            {form.formState.errors.confirmPassword && <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" variant="tashtep" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> جاري الحفظ...</span>
            ) : "تغيير كلمة المرور"}
          </Button>
        </form>
      )}
    </div>
  );
}
