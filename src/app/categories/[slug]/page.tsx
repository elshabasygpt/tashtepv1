import { CategoryService, CategoryWithRelations } from "@/services/category.service";
import { ProductService } from "@/services/product.service";
import { ProductGrid } from "@/features/products/components/product-grid";
import { ProductCard } from "@/features/products/components/product-card";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { EmptyState } from "@/components/ui/empty-state";
import { CategoryList } from "@/features/categories/components/category-list";
import { CategoryCard } from "@/features/categories/components/category-card";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const category = await CategoryService.getCategoryBySlug(resolvedParams.slug);
    if (!category) return { title: "القسم غير موجود" };

    const description = category.description || `تسوق منتجات ${category.name} من تشطيب. توصيل لجميع محافظات مصر.`;

    return {
      title: category.name,
      description,
      alternates: { canonical: `/categories/${category.slug}` },
      openGraph: {
        title: category.name,
        description,
        images: category.image ? [category.image] : undefined,
      },
    };
  } catch {
    return { title: "القسم غير موجود" };
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  try {
    const resolvedParams = await params;
    const category = await CategoryService.getCategoryBySlug(resolvedParams.slug);
    if (!category) {
      notFound();
    }

    const products = await ProductService.getProductsByCategory(resolvedParams.slug);

    const baseUrl = process.env.APP_URL || "https://tashtep.com";

    const itemListJsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: category.name,
      description: category.description || `منتجات ${category.name} في تشطيب`,
      numberOfItems: products.length,
      itemListElement: products.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${baseUrl}/products/${p.id}`,
        name: p.name,
      })),
    };

    const breadcrumbJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "الرئيسية", item: baseUrl },
        { "@type": "ListItem", position: 2, name: "الأقسام", item: `${baseUrl}/categories` },
        { "@type": "ListItem", position: 3, name: category.name, item: `${baseUrl}/categories/${category.slug}` },
      ],
    };

    return (
      <Section className="py-12 bg-gallery min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <Container>
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-obsidian">{category.name}</h1>
            {category.description && (
              <p className="mt-2 text-obsidian/70 max-w-2xl">{category.description}</p>
            )}
            <p className="mt-3 text-secondary leading-relaxed max-w-2xl text-sm">
              اكتشف تشكيلتنا الواسعة من منتجات {category.name} بأفضل الأسعار وأعلى معايير الجودة.
              نوفر توصيلاً سريعاً لجميع محافظات مصر مع ضمان الجودة الأصلية على جميع منتجاتنا.
              {products.length > 0 ? ` يتوفر حالياً ${products.length} منتج في هذا القسم.` : ""}
            </p>
          </div>

          {(category as CategoryWithRelations).subcategories && (category as CategoryWithRelations).subcategories.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-obsidian mb-6">الأقسام الفرعية</h2>
              <CategoryList>
                {(category as CategoryWithRelations).subcategories.map((sub) => (
                  <CategoryCard key={sub.id} category={{ ...sub, image: sub.image || "" }} />
                ))}
              </CategoryList>
            </div>
          )}

          {products.length > 0 ? (
            <ProductGrid>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </ProductGrid>
          ) : (
            <EmptyState
              title="لا توجد منتجات"
              description="لم يتم إضافة منتجات إلى هذا القسم بعد. يرجى العودة لاحقاً."
            />
          )}
        </Container>
      </Section>
    );
  } catch {
    notFound();
  }
}
