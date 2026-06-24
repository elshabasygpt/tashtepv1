import { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminArticleForm } from "@/components/admin/admin-article-form";
import { ArticleService } from "@/services/article.service";

export const metadata: Metadata = {
  title: "تعديل مقال - لوحة الإدارة",
};

export default async function AdminEditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await ArticleService.getArticleById(id);

  if (!article) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-headline-md font-bold text-obsidian">تعديل مقال: {article.title}</h2>
      </div>

      <AdminArticleForm initialData={{
        id: article.id,
        title: article.title,
        slug: article.slug,
        description: article.description || undefined,
        content: article.content,
        image: article.image || undefined,
        published: article.published,
      }} />
    </div>
  );
}
