import { Metadata } from "next";
import { SettingsService } from "@/services/settings.service";
import { AdminContactForm } from "@/components/admin/admin-contact-form";

export const metadata: Metadata = {
  title: "إعدادات صفحة اتصل بنا - لوحة الإدارة",
};

export const dynamic = "force-dynamic";

export default async function AdminContactSettingsPage() {
  const content = await SettingsService.getContactPageContent();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline-md text-obsidian">صفحة اتصل بنا</h1>
        <p className="text-secondary mt-2 text-body-md">
          إدارة وتعديل محتوى صفحة &quot;اتصل بنا&quot; بما في ذلك معلومات التواصل ومواعيد العمل والخريطة.
        </p>
      </div>

      <AdminContactForm initialData={content} />
    </div>
  );
}
