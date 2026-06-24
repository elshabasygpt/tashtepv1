import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArticleService } from "@/services/article.service";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await ArticleService.getArticleBySlug(slug);
  
  if (!article) {
    return { title: "مقال غير موجود" };
  }

  return {
    title: article.title,
    description: article.description,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await ArticleService.getArticleBySlug(slug);

  if (!article || !article.published) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gallery-white py-macro-lg">
      <article className="max-w-3xl mx-auto px-gutter">
        <div className="mb-8">
          <Link href="/blog" className="text-secondary hover:text-tashtep-orange inline-flex items-center gap-2 mb-6 transition-colors font-label-md font-bold text-sm">
            <span className="material-symbols-outlined rtl:rotate-180 text-[18px]">arrow_back</span>
            العودة لمركز المعرفة
          </Link>
          
          <h1 className="text-headline-lg font-headline-lg text-obsidian mb-4 leading-tight">
            {article.title}
          </h1>
          
          <div className="flex items-center gap-4 text-secondary text-sm font-mono border-b border-soft-border pb-6">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              {new Date(article.createdAt).toLocaleDateString("ar-EG")}
            </span>
          </div>
        </div>

        {article.image && (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-stone mb-macro-sm shadow-sm">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {article.description && (
          <div className="text-xl font-headline-sm text-secondary leading-relaxed mb-8 border-r-4 border-tashtep-orange pr-4 bg-stone/30 p-4 rounded-l-lg">
            {article.description}
          </div>
        )}

        <div className="prose prose-lg max-w-none prose-headings:font-headline-md prose-headings:text-obsidian prose-p:text-body-md prose-p:text-secondary prose-p:leading-relaxed prose-a:text-tashtep-orange prose-a:no-underline hover:prose-a:underline">
          {article.content.split("\n").map((paragraph: string, idx: number) => (
            <p key={idx} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </div>
  );
}
