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
    return {
      title: category?.name || "القسم غير موجود",
      description: category?.description || `تسوق منتجات ${category?.name} من تشطيب`,
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

    return (
      <Section className="py-12 bg-gallery min-h-screen">
        <Container>
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-obsidian">{category.name}</h1>
            {category.description && (
              <p className="mt-2 text-obsidian/70 max-w-2xl">{category.description}</p>
            )}
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
