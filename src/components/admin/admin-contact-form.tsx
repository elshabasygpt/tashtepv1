"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ContactPageContent } from "@/services/settings.service";
import { updateContactPageAction } from "@/actions/settings.actions";
import { ImageUpload } from "@/components/admin/image-upload";

interface AdminContactFormProps {
  initialData: ContactPageContent;
}

export function AdminContactForm({ initialData }: AdminContactFormProps) {
  const [isPending, setIsPending] = React.useState(false);
  const router = useRouter();

  const { register, handleSubmit, watch, setValue } = useForm<ContactPageContent>({
    defaultValues: initialData,
  });

  const onSubmit = async (data: ContactPageContent) => {
    setIsPending(true);
    try {
      const result = await updateContactPageAction(data);
      if (result.success) {
        alert("تم الحفظ بنجاح!");
        router.refresh();
      } else {
        alert("حدث خطأ أثناء الحفظ: " + result.error);
      }
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء الحفظ");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 rounded-xl shadow-sm border border-soft-border">
      
      {/* القسم الأول: الغلاف */}
      <div className="space-y-4">
        <h3 className="text-xl font-headline-md text-obsidian border-b border-soft-border pb-2">قسم الغلاف (Hero)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-label-md font-label-md text-obsidian">العنوان الرئيسي</label>
            <input 
              {...register("heroTitle")}
              className="w-full rounded-md border border-soft-border px-3 py-2 text-sm focus:border-tashtep-orange focus:outline-none"
              dir="rtl"
            />
          </div>
          <div className="space-y-2">
            <label className="text-label-md font-label-md text-obsidian">صورة الغلاف</label>
            <ImageUpload
              value={watch("heroImage") || ""}
              onChange={(url) => setValue("heroImage", url, { shouldDirty: true })}
              folder="contact"
              label="اختر صورة للغلاف"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-label-md font-label-md text-obsidian">العنوان الفرعي (وصف قصير)</label>
            <textarea 
              {...register("heroSubtitle")}
              className="w-full rounded-md border border-soft-border px-3 py-2 text-sm focus:border-tashtep-orange focus:outline-none"
              rows={2}
              dir="rtl"
            />
          </div>
        </div>
      </div>

      {/* القسم الثاني: معلومات التواصل الأساسية */}
      <div className="space-y-4">
        <h3 className="text-xl font-headline-md text-obsidian border-b border-soft-border pb-2">معلومات التواصل الأساسية</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <label className="text-label-md font-label-md text-obsidian">العنوان الكامل</label>
            <textarea 
              {...register("address")}
              className="w-full rounded-md border border-soft-border px-3 py-2 text-sm focus:border-tashtep-orange focus:outline-none"
              rows={2}
              dir="rtl"
            />
            <p className="text-xs text-secondary">يمكنك استخدام سطر جديد لفصل أجزاء العنوان</p>
          </div>
          <div className="space-y-2">
            <label className="text-label-md font-label-md text-obsidian">أرقام الهواتف</label>
            <textarea 
              {...register("phoneNumbers")}
              className="w-full rounded-md border border-soft-border px-3 py-2 text-sm focus:border-tashtep-orange focus:outline-none text-left"
              rows={3}
              dir="ltr"
            />
            <p className="text-xs text-secondary text-right">رقم هاتف في كل سطر</p>
          </div>
          <div className="space-y-2">
            <label className="text-label-md font-label-md text-obsidian">البريد الإلكتروني</label>
            <textarea 
              {...register("emails")}
              className="w-full rounded-md border border-soft-border px-3 py-2 text-sm focus:border-tashtep-orange focus:outline-none text-left"
              rows={3}
              dir="ltr"
            />
            <p className="text-xs text-secondary text-right">بريد إلكتروني في كل سطر</p>
          </div>
        </div>
      </div>

      {/* القسم الثالث: أوقات العمل */}
      <div className="space-y-4">
        <h3 className="text-xl font-headline-md text-obsidian border-b border-soft-border pb-2">أوقات وساعات العمل</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-label-md font-label-md text-obsidian">الأحد - الخميس</label>
            <input 
              {...register("workingHoursWeekday")}
              className="w-full rounded-md border border-soft-border px-3 py-2 text-sm focus:border-tashtep-orange focus:outline-none"
              dir="rtl"
            />
          </div>
          <div className="space-y-2">
            <label className="text-label-md font-label-md text-obsidian">السبت</label>
            <input 
              {...register("workingHoursSaturday")}
              className="w-full rounded-md border border-soft-border px-3 py-2 text-sm focus:border-tashtep-orange focus:outline-none"
              dir="rtl"
            />
          </div>
          <div className="space-y-2">
            <label className="text-label-md font-label-md text-obsidian">الجمعة</label>
            <input 
              {...register("workingHoursFriday")}
              className="w-full rounded-md border border-soft-border px-3 py-2 text-sm focus:border-tashtep-orange focus:outline-none"
              dir="rtl"
            />
          </div>
        </div>
      </div>

      {/* القسم الرابع: الخريطة */}
      <div className="space-y-4">
        <h3 className="text-xl font-headline-md text-obsidian border-b border-soft-border pb-2">الخريطة (Google Maps)</h3>
        <div className="space-y-2">
          <label className="text-label-md font-label-md text-obsidian">رابط تضمين الخريطة (Embed URL)</label>
          <input 
            {...register("mapUrl")}
            className="w-full rounded-md border border-soft-border px-3 py-2 text-sm focus:border-tashtep-orange focus:outline-none text-left"
            dir="ltr"
            placeholder="https://www.google.com/maps/embed?..."
          />
          <p className="text-xs text-secondary">ضع رابط src المستخرج من كود التضمين الخاص بخرائط جوجل.</p>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-tashtep-orange text-white hover:bg-obsidian transition-colors"
        >
          {isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
        </Button>
      </div>
    </form>
  );
}
