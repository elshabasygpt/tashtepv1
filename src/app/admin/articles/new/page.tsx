import { Metadata } from "next";
import { AdminArticleForm } from "@/components/admin/admin-article-form";

export const metadata: Metadata = {
  title: "إضافة مقال جديد - لوحة الإدارة",
};

export default function AdminNewArticlePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-headline-md font-bold text-obsidian">إضافة مقال جديد</h2>
      </div>

      <AdminArticleForm />
    </div>
  );
}
