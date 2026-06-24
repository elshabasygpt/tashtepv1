import { Metadata } from "next";
import Link from "next/link";
import { ArticleService } from "@/services/article.service";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "المقالات - لوحة الإدارة",
};

export default async function AdminArticlesPage() {
  const articles = await ArticleService.getArticles();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-headline-md font-bold text-obsidian">المقالات (مركز المعرفة)</h2>
        <Button className="bg-tashtep-orange text-white hover:bg-tashtep-orange/90" asChild>
          <Link href="/admin/articles/new">
            <span className="material-symbols-outlined ml-2 text-xl">add</span>
            إضافة مقال جديد
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-stone shadow-sm overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-stone text-obsidian border-b border-stone">
            <tr>
              <th className="p-4 font-bold">العنوان</th>
              <th className="p-4 font-bold">الرابط</th>
              <th className="p-4 font-bold">تاريخ النشر</th>
              <th className="p-4 font-bold">الحالة</th>
              <th className="p-4 font-bold w-32">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className="border-b border-stone last:border-0 hover:bg-stone/30 transition-colors">
                <td className="p-4 font-bold text-obsidian">{article.title}</td>
                <td className="p-4 text-secondary font-mono text-sm" dir="ltr">{article.slug}</td>
                <td className="p-4 text-secondary">
                  {new Date(article.createdAt).toLocaleDateString("ar-EG")}
                </td>
                <td className="p-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${article.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                    {article.published ? "منشور" : "مسودة"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild className="h-8">
                      <Link href={`/admin/articles/${article.id}/edit`}>تعديل</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="h-8 border-red-200 text-red-600 hover:bg-red-50">
                      <Link href={`/blog/${article.slug}`} target="_blank">عرض</Link>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-secondary">
                  لا توجد مقالات حتى الآن
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
