"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateAboutPageAction } from "@/actions/settings.actions";
import type { AboutPageContent } from "@/services/settings.service";
import { ImageUpload } from "@/components/admin/image-upload";

interface AdminAboutFormProps {
  initialData: AboutPageContent;
}

export function AdminAboutForm({ initialData }: AdminAboutFormProps) {
  const [isPending, setIsPending] = React.useState(false);

  const { register, handleSubmit, watch, setValue } = useForm<AboutPageContent>({
    defaultValues: initialData,
  });

  const onSubmit = async (data: AboutPageContent) => {
    setIsPending(true);
    try {
      const result = await updateAboutPageAction(data);

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
      
      {/* Hero Section Edit */}
      <div className="bg-white p-6 rounded-xl border border-stone shadow-sm space-y-6">
        <h3 className="text-xl font-headline-md text-obsidian border-b pb-4">القسم الافتتاحي (Hero Section)</h3>
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-obsidian">العنوان الرئيسي</label>
            <Input {...register("heroTitle", { required: true })} className="bg-stone" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-obsidian">النص الترحيبي</label>
            <Textarea {...register("heroSubtitle", { required: true })} className="bg-stone min-h-[100px]" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-obsidian">صورة الخلفية</label>
            <ImageUpload
              value={watch("heroImage") || ""}
              onChange={(url) => setValue("heroImage", url, { shouldDirty: true })}
              folder="about"
              label="اختر صورة للخلفية"
            />
          </div>
        </div>
      </div>

      {/* Philosophy Section Edit */}
      <div className="bg-white p-6 rounded-xl border border-stone shadow-sm space-y-6">
        <h3 className="text-xl font-headline-md text-obsidian border-b pb-4">قسم فلسفتنا</h3>
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-obsidian">عنوان القسم</label>
            <Input {...register("philosophyTitle", { required: true })} className="bg-stone" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-obsidian">نص الفلسفة</label>
            <Textarea {...register("philosophyText1", { required: true })} className="bg-stone min-h-[150px]" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-obsidian">الصورة المرفقة</label>
            <ImageUpload
              value={watch("philosophyImage") || ""}
              onChange={(url) => setValue("philosophyImage", url, { shouldDirty: true })}
              folder="about"
              label="اختر صورة لقسم فلسفتنا"
            />
          </div>
        </div>
      </div>

      {/* Vision & Mission Edit */}
      <div className="bg-white p-6 rounded-xl border border-stone shadow-sm space-y-6">
        <h3 className="text-xl font-headline-md text-obsidian border-b pb-4">قسم الرؤية والمهمة</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-obsidian">عنوان الرؤية</label>
              <Input {...register("visionTitle", { required: true })} className="bg-stone" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-obsidian">نص الرؤية</label>
              <Textarea {...register("visionText", { required: true })} className="bg-stone min-h-[150px]" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-obsidian">عنوان المهمة</label>
              <Input {...register("missionTitle", { required: true })} className="bg-stone" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-obsidian">نص المهمة</label>
              <Textarea {...register("missionText", { required: true })} className="bg-stone min-h-[150px]" />
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section Edit */}
      <div className="bg-white p-6 rounded-xl border border-stone shadow-sm space-y-6">
        <h3 className="text-xl font-headline-md text-obsidian border-b pb-4">القسم الختامي (Call to Action)</h3>
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-obsidian">العنوان</label>
            <Input {...register("ctaTitle", { required: true })} className="bg-stone" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-obsidian">النص</label>
            <Textarea {...register("ctaText", { required: true })} className="bg-stone" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-obsidian">نص الزر</label>
            <Input {...register("ctaButtonText", { required: true })} className="bg-stone" />
          </div>
        </div>
      </div>

      <div className="flex justify-end sticky bottom-0 bg-gallery-white p-4 border-t border-stone shadow-lg z-10 -mx-8 px-8">
        <Button 
          type="submit" 
          disabled={isPending}
          className="bg-tashtep-orange text-white hover:bg-tashtep-orange/90 px-8 py-6 text-lg rounded-xl"
        >
          {isPending ? "جاري الحفظ..." : "حفظ التعديلات"}
        </Button>
      </div>
    </form>
  );
}
