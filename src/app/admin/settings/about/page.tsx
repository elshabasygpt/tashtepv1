import { Metadata } from "next";
import { SettingsService } from "@/services/settings.service";
import { AdminAboutForm } from "@/components/admin/admin-about-form";

export const metadata: Metadata = {
  title: "إعدادات صفحة من نحن - لوحة الإدارة",
};

export default async function AdminAboutSettingsPage() {
  const initialData = await SettingsService.getAboutPageContent();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-headline-md font-bold text-obsidian">إعدادات صفحة &quot;من نحن&quot;</h2>
      </div>

      <AdminAboutForm initialData={initialData} />
    </div>
  );
}
