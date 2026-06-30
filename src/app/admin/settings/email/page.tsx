import { Metadata } from "next";
import { SettingsService } from "@/services/settings.service";
import { AdminEmailSettingsForm } from "@/components/admin/admin-email-settings-form";

export const metadata: Metadata = {
  title: "إعدادات البريد الإلكتروني - لوحة الإدارة",
};

export default async function AdminEmailSettingsPage() {
  const initialData = await SettingsService.getEmailSettings();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-tashtep-orange text-3xl">mail_lock</span>
        <div>
          <h2 className="text-2xl font-headline-md font-bold text-obsidian">إعدادات البريد الإلكتروني</h2>
          <p className="text-secondary text-sm mt-1">
            ضبط بريد الشركة الرسمي — الإشعارات، الإرسال (SMTP)، واستقبال الرسائل (IMAP)
          </p>
        </div>
      </div>

      <AdminEmailSettingsForm initialData={initialData} />
    </div>
  );
}
