"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateEmailSettingsAction, testSmtpAction } from "@/actions/settings.actions";
import type { EmailSettings } from "@/services/settings.service";

interface Props {
  initialData: EmailSettings;
}

export function AdminEmailSettingsForm({ initialData }: Props) {
  const [isPending, setIsPending] = React.useState(false);
  const [isTesting, setIsTesting] = React.useState(false);

  const { register, handleSubmit, watch } = useForm<EmailSettings>({
    defaultValues: initialData,
  });

  const smtpEnabled = watch("smtpEnabled");
  const imapEnabled = watch("imapEnabled");

  const onSubmit = async (data: EmailSettings) => {
    setIsPending(true);
    try {
      const result = await updateEmailSettingsAction(data);
      if (result.success) {
        toast.success("تم حفظ إعدادات البريد بنجاح");
      } else {
        toast.error(result.error || "حدث خطأ أثناء الحفظ");
      }
    } catch {
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setIsPending(false);
    }
  };

  const handleTestSmtp = async () => {
    setIsTesting(true);
    try {
      const result = await testSmtpAction();
      if (result.success) {
        toast.success("✅ تم الاتصال بـ SMTP بنجاح!");
      } else {
        toast.error(`❌ فشل الاتصال: ${result.error}`);
      }
    } catch {
      toast.error("حدث خطأ أثناء الاختبار");
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

      {/* Admin Notification Email */}
      <div className="bg-white p-6 rounded-xl border border-stone shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b pb-4">
          <span className="material-symbols-outlined text-tashtep-orange text-2xl">notifications</span>
          <h3 className="text-xl font-headline-md text-obsidian">بريد الإشعارات الإدارية</h3>
        </div>
        <p className="text-sm text-secondary">
          ستصله إشعارات بالطلبات الجديدة، رسائل التواصل، وتنبيهات المخزون المنخفض.
        </p>
        <div className="space-y-2">
          <label className="text-sm font-bold text-obsidian">البريد الإلكتروني للأدمن</label>
          <Input
            {...register("adminNotificationEmail")}
            type="email"
            className="bg-stone max-w-md"
            dir="ltr"
            placeholder="admin@yourcompany.com"
          />
        </div>
      </div>

      {/* SMTP Settings */}
      <div className="bg-white p-6 rounded-xl border border-stone shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b pb-4">
          <span className="material-symbols-outlined text-tashtep-orange text-2xl">send</span>
          <h3 className="text-xl font-headline-md text-obsidian">إعدادات الإرسال (SMTP)</h3>
        </div>
        <p className="text-sm text-secondary">
          اربط بريدك الرسمي لإرسال الإيميلات منه مباشرةً. يدعم Gmail، Outlook، وأي سيرفر SMTP.
          إذا تُرك فارغاً سيُستخدم Resend كبديل.
        </p>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            {...register("smtpEnabled")}
            id="smtpEnabled"
            className="w-5 h-5 accent-tashtep-orange"
          />
          <label htmlFor="smtpEnabled" className="text-sm font-bold text-obsidian cursor-pointer">
            تفعيل الإرسال عبر SMTP
          </label>
        </div>

        {smtpEnabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <label className="text-sm font-bold text-obsidian">سيرفر SMTP (Host)</label>
              <Input {...register("smtpHost")} className="bg-stone" dir="ltr" placeholder="smtp.gmail.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-obsidian">المنفذ (Port)</label>
              <Input {...register("smtpPort", { valueAsNumber: true })} type="number" className="bg-stone" dir="ltr" placeholder="465" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-obsidian">اسم المرسل (From Name)</label>
              <Input {...register("smtpFromName")} className="bg-stone" placeholder="تشطيب" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-obsidian">بريد المرسل (From Email)</label>
              <Input {...register("smtpFromEmail")} type="email" className="bg-stone" dir="ltr" placeholder="info@yourcompany.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-obsidian">اسم المستخدم</label>
              <Input {...register("smtpUser")} className="bg-stone" dir="ltr" placeholder="info@yourcompany.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-obsidian">كلمة المرور أو App Password</label>
              <Input {...register("smtpPassword")} type="password" className="bg-stone" dir="ltr" placeholder="••••••••••••" />
            </div>
            <div className="md:col-span-2 flex items-center gap-3">
              <input
                type="checkbox"
                {...register("smtpSecure")}
                id="smtpSecure"
                className="w-5 h-5 accent-tashtep-orange"
              />
              <label htmlFor="smtpSecure" className="text-sm font-bold text-obsidian cursor-pointer">
                استخدام SSL/TLS (موصى به — Port 465)
              </label>
            </div>

            {/* Gmail help */}
            <div className="md:col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              <strong>Gmail:</strong> Host: smtp.gmail.com — Port: 465 — Secure: ✓<br/>
              استخدم <em>App Password</em> وليس كلمة المرور العادية
              (Google Account → Security → 2-Step Verification → App passwords)
            </div>

            <div className="md:col-span-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleTestSmtp}
                disabled={isTesting}
                className="border-tashtep-orange text-tashtep-orange hover:bg-tashtep-orange/10"
              >
                <span className="material-symbols-outlined text-[18px] ml-2">wifi_tethering</span>
                {isTesting ? "جاري الاختبار..." : "اختبار الاتصال بـ SMTP"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* IMAP Settings */}
      <div className="bg-white p-6 rounded-xl border border-stone shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b pb-4">
          <span className="material-symbols-outlined text-tashtep-orange text-2xl">inbox</span>
          <h3 className="text-xl font-headline-md text-obsidian">إعدادات الاستقبال (IMAP)</h3>
        </div>
        <p className="text-sm text-secondary">
          يتيح لك رؤية صندوق الوارد الخاص ببريد الشركة مباشرةً داخل لوحة الإدارة والرد على العملاء منها.
        </p>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            {...register("imapEnabled")}
            id="imapEnabled"
            className="w-5 h-5 accent-tashtep-orange"
          />
          <label htmlFor="imapEnabled" className="text-sm font-bold text-obsidian cursor-pointer">
            تفعيل صندوق الوارد (IMAP)
          </label>
        </div>

        {imapEnabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <label className="text-sm font-bold text-obsidian">سيرفر IMAP (Host)</label>
              <Input {...register("imapHost")} className="bg-stone" dir="ltr" placeholder="imap.gmail.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-obsidian">المنفذ (Port)</label>
              <Input {...register("imapPort", { valueAsNumber: true })} type="number" className="bg-stone" dir="ltr" placeholder="993" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-obsidian">اسم المستخدم (البريد)</label>
              <Input {...register("imapUser")} className="bg-stone" dir="ltr" placeholder="info@yourcompany.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-obsidian">كلمة المرور أو App Password</label>
              <Input {...register("imapPassword")} type="password" className="bg-stone" dir="ltr" placeholder="••••••••••••" />
            </div>
            <div className="md:col-span-2 flex items-center gap-3">
              <input
                type="checkbox"
                {...register("imapSecure")}
                id="imapSecure"
                className="w-5 h-5 accent-tashtep-orange"
              />
              <label htmlFor="imapSecure" className="text-sm font-bold text-obsidian cursor-pointer">
                استخدام SSL/TLS (موصى به — Port 993)
              </label>
            </div>

            <div className="md:col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              <strong>Gmail:</strong> Host: imap.gmail.com — Port: 993 — Secure: ✓<br/>
              يجب تفعيل IMAP من إعدادات Gmail (Settings → Forwarding and POP/IMAP → Enable IMAP)
            </div>
          </div>
        )}
      </div>

      {/* Save button */}
      <div className="flex justify-end sticky bottom-0 bg-gallery-white p-4 border-t border-stone shadow-lg z-10 -mx-8 px-8">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-tashtep-orange text-white hover:bg-tashtep-orange/90 px-8 py-6 text-lg rounded-xl"
        >
          {isPending ? "جاري الحفظ..." : "حفظ إعدادات البريد"}
        </Button>
      </div>
    </form>
  );
}
