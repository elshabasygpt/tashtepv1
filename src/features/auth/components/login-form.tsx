"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { loginAction } from "@/actions/auth.actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const router = useRouter();

  async function onSubmit(data: LoginFormValues) {
    const result = await loginAction(data);
    if (result?.error) {
      form.setError("root", { message: result.error });
    } else if (result?.success) {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
        <CardDescription>
          أدخل بريدك الإلكتروني وكلمة المرور للوصول لحسابك
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
            <div className="flex justify-end pt-1">
              <Link href="/forgot-password" className="text-sm text-tashtep-orange hover:underline font-medium">
                نسيت كلمة المرور؟
              </Link>
            </div>
          </div>
          <Button type="submit" variant="tashtep" className="w-full h-11 text-base mt-2" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
