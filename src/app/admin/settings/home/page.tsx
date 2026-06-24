import { Metadata } from "next";
import { SettingsService } from "@/services/settings.service";
import { AdminHomeForm } from "@/components/admin/admin-home-form";

export const metadata: Metadata = {
  title: "إعدادات الصفحة الرئيسية - لوحة الإدارة",
};

export default async function AdminHomeSettingsPage() {
  const initialData = await SettingsService.getHomePageHero();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-headline-md font-bold text-obsidian">إعدادات الصفحة الرئيسية</h2>
      </div>

      <AdminHomeForm initialData={initialData} />
    </div>
  );
}
