"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { registerAction } from "@/actions/auth.actions";
import { useRouter } from "next/navigation";

const registerSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const router = useRouter();

  async function onSubmit(data: RegisterFormValues) {
    const result = await registerAction(data);
    if (result?.error) {
      form.setError("root", { message: result.error });
    } else if (result?.success) {
      router.push("/login?registered=true");
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">إنشاء حساب جديد</CardTitle>
        <CardDescription>
          انضم إلى Tashtep وتمتع بتجربة تسوق استثنائية
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {form.formState.errors.root && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md text-center">
              {form.formState.errors.root.message}
            </div>
          )}
          <div className="space-y-2">
            <Input
              id="name"
              placeholder="الاسم الكامل"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Input
              id="email"
              type="email"
              placeholder="البريد الإلكتروني"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Input
              id="password"
              type="password"
              placeholder="كلمة المرور"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Input
              id="confirmPassword"
              type="password"
              placeholder="تأكيد كلمة المرور"
              {...form.register("confirmPassword")}
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
            )}
          </div>
          <Button type="submit" variant="tashtep" className="w-full h-11 text-base mt-2" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
