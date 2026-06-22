"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { updateProfileAction } from "@/actions/auth.actions";
import { Loader2 } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  phone: z.string().min(10, "رقم الهاتف غير صالح").optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  defaultValues?: {
    name: string;
    email: string;
    phone: string;
  };
}

export function ProfileForm({ defaultValues }: ProfileFormProps) {
  const [error, setError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: defaultValues || { name: "", email: "", phone: "" },
  });

  async function onSubmit(data: ProfileFormValues) {
    setError(null);
    setSuccessMsg(null);
    
    const result = await updateProfileAction(data);
    
    if (result?.data?.success) {
      setSuccessMsg("تم تحديث البيانات بنجاح.");
    } else {
      setError(result?.error || "حدث خطأ غير متوقع. حاول مرة أخرى.");
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl text-obsidian">البيانات الشخصية</CardTitle>
        <CardDescription>قم بتحديث بياناتك الشخصية ومعلومات التواصل الخاصة بك هنا.</CardDescription>
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
            <label className="text-sm font-semibold text-foreground">الاسم الكامل</label>
            <Input {...form.register("name")} />
            {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">البريد الإلكتروني</label>
            <Input type="email" {...form.register("email")} />
            {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">رقم الهاتف</label>
            <Input type="tel" {...form.register("phone")} />
            {form.formState.errors.phone && <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>}
          </div>
          <Button type="submit" variant="tashtep" className="mt-4" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <span className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> جاري الحفظ...</span>
            ) : "حفظ التغييرات"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
