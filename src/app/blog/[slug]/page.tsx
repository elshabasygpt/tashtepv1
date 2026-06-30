import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArticleService } from "@/services/article.service";
import { MarkdownRenderer } from "@/components/markdown-renderer";

export const revalidate = 3600;

export async function generateStaticParams() {
  const articles = await ArticleService.getArticles({ publishedOnly: true });
  return articles.map((a: { slug: string }) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await ArticleService.getArticleBySlug(slug);

  if (!article) {
    return { title: "مقال غير موجود" };
  }

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/blog/${article.slug}` },
    authors: [{ name: "تشطيب" }],
    openGraph: {
      title: article.title,
      description: article.description || undefined,
      images: article.image
        ? [{ url: article.image, width: 1200, height: 630, alt: article.title }]
        : undefined,
      type: "article",
      publishedTime: article.createdAt.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description || undefined,
      images: article.image ? [article.image] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await ArticleService.getArticleBySlug(slug);

  if (!article || !article.published) {
    notFound();
  }

  const allArticles = await ArticleService.getArticles({ publishedOnly: true, limit: 4 });
  const relatedArticles = allArticles
    .filter((a: { slug: string }) => a.slug !== article.slug)
    .slice(0, 3);

  const baseUrl = process.env.APP_URL || "https://tashtep.com";
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description || undefined,
    image: article.image ? [article.image] : undefined,
    datePublished: article.createdAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    mainEntityOfPage: `${baseUrl}/blog/${article.slug}`,
    inLanguage: "ar-EG",
    author: { "@type": "Organization", name: "تشطيب", url: baseUrl },
    publisher: {
      "@type": "Organization",
      name: "تشطيب",
      url: baseUrl,
      logo: { "@type": "ImageObject", url: `${baseUrl}/logo.png` },
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".article-lead"],
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "مركز المعرفة", item: `${baseUrl}/blog` },
      { "@type": "ListItem", position: 3, name: article.title, item: `${baseUrl}/blog/${article.slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-gallery-white py-macro-lg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <article className="max-w-3xl mx-auto px-gutter">
        <div className="mb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-secondary mb-6 flex-wrap" aria-label="مسار التنقل">
            <Link href="/" className="hover:text-obsidian transition-colors">الرئيسية</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_left</span>
            <Link href="/blog" className="hover:text-obsidian transition-colors">مركز المعرفة</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_left</span>
            <span className="text-obsidian font-medium line-clamp-1 max-w-[200px] sm:max-w-none">{article.title}</span>
          </nav>

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
            <Image 
              src={article.image} 
              alt={article.title}
              className="object-cover"
              fill
              priority
            />
          </div>
        )}

        {article.description && (
          <div className="article-lead text-xl font-headline-sm text-secondary leading-relaxed mb-8 border-r-4 border-tashtep-orange pr-4 bg-stone/30 p-4 rounded-l-lg">
            {article.description}
          </div>
        )}

        <MarkdownRenderer content={article.content} />

        {/* Internal link to the catalog — keeps blog traffic flowing into products */}
        <div className="mt-10 p-6 rounded-2xl bg-stone/40 border border-soft-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-label-md text-obsidian font-bold">جاهز تبدأ رحلة التشطيب؟ تصفح تشكيلتنا الكاملة من الخامات.</p>
          <Link href="/products" className="flex-shrink-0 bg-tashtep-orange text-on-primary font-label-md px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
            تصفح المنتجات
          </Link>
        </div>

        {relatedArticles.length > 0 && (
          <div className="mt-12 pt-8 border-t border-soft-border">
            <h2 className="text-headline-sm font-headline-sm text-obsidian mb-6">مقالات ذات صلة</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedArticles.map((related: { slug: string; title: string; image: string | null }) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group block rounded-xl overflow-hidden border border-soft-border hover:border-tashtep-orange transition-colors"
                >
                  <div className="relative w-full aspect-video bg-stone">
                    {related.image && (
                      <Image src={related.image} alt={related.title} fill className="object-cover" sizes="33vw" />
                    )}
                  </div>
                  <p className="p-3 font-label-md text-sm text-obsidian line-clamp-2 group-hover:text-tashtep-orange transition-colors">
                    {related.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
