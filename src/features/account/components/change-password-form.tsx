"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { changePasswordAction } from "@/actions/auth.actions";
import { Loader2 } from "lucide-react";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "كلمة المرور الحالية مطلوبة"),
  newPassword: z.string().min(6, "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "كلمة المرور الجديدة غير متطابقة",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export function ChangePasswordForm() {
  const [error, setError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  async function onSubmit(data: PasswordFormValues) {
    setError(null);
    setSuccessMsg(null);
    
    const result = await changePasswordAction({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    
    if (result?.data?.success) {
      setSuccessMsg("تم تغيير كلمة المرور بنجاح.");
      form.reset();
    } else {
      setError(result?.error || "كلمة المرور الحالية غير صحيحة، أو حدث خطأ آخر.");
    }
  }

  return (
    <Card className="w-full mt-8">
      <CardHeader>
        <CardTitle className="text-xl text-obsidian">تغيير كلمة المرور</CardTitle>
        <CardDescription>قم بتحديث كلمة المرور الخاصة بحسابك للحفاظ على أمانك.</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 rounded bg-destructive/15 text-destructive text-sm font-medium">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-800 text-sm font-medium border border-green-200">
            {successMsg}
          </div>
        )}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">كلمة المرور الحالية</label>
            <Input type="password" {...form.register("currentPassword")} />
            {form.formState.errors.currentPassword && <p className="text-sm text-destructive">{form.formState.errors.currentPassword.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">كلمة المرور الجديدة</label>
            <Input type="password" {...form.register("newPassword")} />
            {form.formState.errors.newPassword && <p className="text-sm text-destructive">{form.formState.errors.newPassword.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">تأكيد كلمة المرور الجديدة</label>
            <Input type="password" {...form.register("confirmPassword")} />
            {form.formState.errors.confirmPassword && <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>}
          </div>
          <Button type="submit" variant="tashtep" className="mt-4" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <span className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> جاري الحفظ...</span>
            ) : "تغيير كلمة المرور"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
