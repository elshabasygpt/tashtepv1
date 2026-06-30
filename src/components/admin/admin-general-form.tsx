"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateGeneralSettingsAction } from "@/actions/settings.actions";
import type { GeneralSettings } from "@/services/settings.service";

interface AdminGeneralFormProps {
  initialData: GeneralSettings;
}

export function AdminGeneralForm({ initialData }: AdminGeneralFormProps) {
  const [isPending, setIsPending] = React.useState(false);

  const { register, handleSubmit } = useForm<GeneralSettings>({
    defaultValues: initialData,
  });

  const onSubmit = async (data: GeneralSettings) => {
    setIsPending(true);
    try {
      const result = await updateGeneralSettingsAction(data);

      if (result.success) {
        toast.success("تم حفظ الإعدادات العامة بنجاح");
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
        <h3 className="text-xl font-headline-md text-obsidian border-b pb-4">بيانات المتجر</h3>
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-obsidian">اسم المتجر</label>
            <Input {...register("storeName", { required: true })} className="bg-stone" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-obsidian">وصف المتجر القصير (للـ Footer)</label>
            <Textarea {...register("storeDescription", { required: true })} className="bg-stone min-h-[100px]" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-stone shadow-sm space-y-6">
        <h3 className="text-xl font-headline-md text-obsidian border-b pb-4">بيانات التواصل (تظهر في الشريط العلوي والـ Footer)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-obsidian">رقم الهاتف</label>
            <Input {...register("phone", { required: true })} className="bg-stone" dir="ltr" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-obsidian">البريد الإلكتروني</label>
            <Input {...register("email", { required: true })} type="email" className="bg-stone" dir="ltr" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-obsidian">العنوان المادي (المقر)</label>
            <Input {...register("address", { required: true })} className="bg-stone" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-stone shadow-sm space-y-6">
        <h3 className="text-xl font-headline-md text-obsidian border-b pb-4">بيانات الفاتورة الضريبية</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-obsidian">الرقم الضريبي</label>
            <Input {...register("taxId")} className="bg-stone" dir="ltr" placeholder="مثال: 123-456-789" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-obsidian">نسبة الضريبة (%)</label>
            <Input {...register("taxRate", { valueAsNumber: true })} type="number" className="bg-stone" dir="ltr" placeholder="14" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-stone shadow-sm space-y-6">
        <h3 className="text-xl font-headline-md text-obsidian border-b pb-4">روابط وسائل التواصل الاجتماعي</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-obsidian">فيسبوك (Facebook)</label>
            <Input {...register("facebookUrl")} className="bg-stone" dir="ltr" placeholder="https://..." />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-obsidian">إنستغرام (Instagram)</label>
            <Input {...register("instagramUrl")} className="bg-stone" dir="ltr" placeholder="https://..." />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-obsidian">إكس (تويتر)</label>
            <Input {...register("twitterUrl")} className="bg-stone" dir="ltr" placeholder="https://..." />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-stone shadow-sm space-y-6">
        <h3 className="text-xl font-headline-md text-obsidian border-b pb-4">أيقونة الدردشة الفورية (WhatsApp Widget)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2 flex items-center gap-3">
            <input 
              type="checkbox" 
              {...register("whatsappEnabled")} 
              id="whatsappEnabled" 
              className="w-5 h-5 accent-tashtep-orange"
            />
            <label htmlFor="whatsappEnabled" className="text-sm font-bold text-obsidian cursor-pointer">
              تفعيل أيقونة الواتساب العائمة في جميع الصفحات
            </label>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-obsidian">رقم الواتساب</label>
            <Input {...register("whatsappNumber")} className="bg-stone" dir="ltr" placeholder="201000000000" />
            <p className="text-xs text-secondary mt-1">يجب أن يشمل كود الدولة بدون علامة (+) أو أصفار (مثال: 2010...)</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-obsidian">الرسالة الافتراضية</label>
            <Input {...register("whatsappMessage")} className="bg-stone" placeholder="مرحباً فريق تشطيب..." />
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
