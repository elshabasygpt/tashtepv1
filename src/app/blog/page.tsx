import { Metadata } from "next";
import Link from "next/link";
import { ArticleService } from "@/services/article.service";

export const metadata: Metadata = {
  title: "مركز المعرفة",
  description: "اكتشف أحدث المقالات والنصائح في عالم الدهانات والتشطيبات.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const articles = await ArticleService.getArticles({ publishedOnly: true });

  return (
    <div className="min-h-screen bg-gallery-white">
      {/* Hero Section */}
      <section className="bg-surface-bright py-macro-lg border-b border-soft-border">
        <div className="max-w-container-max mx-auto px-gutter text-center">
          <h1 className="text-headline-lg font-headline-lg text-obsidian mb-4">مركز المعرفة</h1>
          <p className="text-body-lg text-secondary max-w-2xl mx-auto">
            دليلك الشامل لإلهام وإتقان تصميم منزلك، مقالات ونصائح حصرية من خبراء تشطيب.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-macro-lg max-w-container-max mx-auto px-gutter">
        {articles.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-headline-md text-obsidian mb-4">لا توجد مقالات حالياً</h2>
            <p className="text-secondary">يرجى العودة لاحقاً لاكتشاف محتوى جديد.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {articles.map((article: { id: string; title: string; slug: string; description: string | null; image: string | null; createdAt: Date }) => (
              <Link key={article.id} href={`/blog/${article.slug}`} className="group block h-full">
                <article className="flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm border border-soft-border hover:shadow-md transition-shadow duration-300">
                  <div className="relative w-full aspect-[4/3] bg-stone overflow-hidden">
                    {article.image ? (
                      <img 
                        src={article.image} 
                        alt={article.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-stone text-secondary">
                        <span className="material-symbols-outlined text-4xl opacity-50">image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-sm text-secondary mb-3 font-mono">
                      {new Date(article.createdAt).toLocaleDateString("ar-EG")}
                    </span>
                    <h2 className="text-headline-sm font-headline-sm text-obsidian mb-3 group-hover:text-tashtep-orange transition-colors">
                      {article.title}
                    </h2>
                    {article.description && (
                      <p className="text-body-md text-secondary line-clamp-3 mb-6 flex-1">
                        {article.description}
                      </p>
                    )}
                    <span className="text-label-md font-bold text-obsidian border-b border-obsidian pb-1 self-start inline-flex items-center gap-1 group-hover:text-tashtep-orange group-hover:border-tashtep-orange transition-all">
                      اقرأ المزيد
                      <span className="material-symbols-outlined text-[14px] rtl:rotate-180 transition-transform group-hover:-translate-x-1">arrow_forward</span>
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
