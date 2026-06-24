import { Metadata } from "next";
import { SettingsService } from "@/services/settings.service";
import { AdminGeneralForm } from "@/components/admin/admin-general-form";

export const metadata: Metadata = {
  title: "الإعدادات العامة - لوحة الإدارة",
};

export default async function AdminGeneralSettingsPage() {
  const initialData = await SettingsService.getGeneralSettings();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-headline-md font-bold text-obsidian">الإعدادات العامة للموقع</h2>
      </div>

      <AdminGeneralForm initialData={initialData} />
    </div>
  );
}
