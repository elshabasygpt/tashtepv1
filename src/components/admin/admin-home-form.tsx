"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateHomePageHeroAction } from "@/actions/settings.actions";
import type { HomePageHero } from "@/services/settings.service";
import { ImageUpload } from "@/components/admin/image-upload";

interface AdminHomeFormProps {
  initialData: HomePageHero;
}

export function AdminHomeForm({ initialData }: AdminHomeFormProps) {
  const [isPending, setIsPending] = React.useState(false);

  const { register, handleSubmit, watch, setValue } = useForm<HomePageHero>({
    defaultValues: initialData,
  });

  const onSubmit = async (data: HomePageHero) => {
    setIsPending(true);
    try {
      const result = await updateHomePageHeroAction(data);

      if (result.success) {
        toast.success("تم تحديث محتوى الصفحة بنجاح");
      } else {
        toast.error(result.error || "حدث خطأ أثناء الحفظ");
      }
    } catch {
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
      <div className="bg-white p-6 rounded-xl border border-stone shadow-sm space-y-6">
        <h3 className="text-xl font-headline-md text-obsidian border-b pb-4">القسم الافتتاحي (Hero Section)</h3>
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-obsidian">شريط الإشعار (Badge)</label>
            <Input {...register("badge", { required: true })} className="bg-stone" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-obsidian">العنوان الرئيسي</label>
            <Input {...register("title", { required: true })} className="bg-stone" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-obsidian">النص الترحيبي</label>
            <Textarea {...register("subtitle", { required: true })} className="bg-stone min-h-[100px]" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-obsidian">نص الزر الأساسي</label>
            <Input {...register("ctaText", { required: true })} className="bg-stone" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-obsidian">رابط الزر الأساسي</label>
            <Input {...register("ctaLink", { required: true })} className="bg-stone" dir="ltr" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-obsidian">نص الزر الثانوي (مثال: شاهد الإلهام)</label>
            <Input {...register("secondaryCtaText", { required: true })} className="bg-stone" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-obsidian">صورة الخلفية</label>
            <ImageUpload
              value={watch("image") || ""}
              onChange={(url) => setValue("image", url, { shouldDirty: true })}
              folder="home"
              label="اختر صورة للخلفية"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button 
          type="submit" 
          className="bg-tashtep-orange hover:bg-tashtep-orange/90 text-white px-8 py-6 text-lg rounded-xl"
          disabled={isPending}
        >
          {isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
        </Button>
      </div>
    </form>
  );
}
