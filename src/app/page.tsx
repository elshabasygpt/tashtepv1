import { ProductService } from "@/services/product.service";
import { CategoryService } from "@/services/category.service";

export const dynamic = "force-dynamic";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ProductGrid } from "@/features/products/components/product-grid";
import { ProductCard } from "@/features/products/components/product-card";
import { CategoryList } from "@/features/categories/components/category-list";
import { CategoryCard } from "@/features/categories/components/category-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

async function FeaturedProducts() {
  const products = await ProductService.getProducts({ limit: 8 });
  return (
    <ProductGrid>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ProductGrid>
  );
}

async function FeaturedCategories() {
  const categories = await CategoryService.getCategories();
  return (
    <CategoryList>
      {categories.map((category) => (
        <CategoryCard key={category.id} category={{ ...category, image: category.image || "" }} />
      ))}
    </CategoryList>
  );
}

function SectionLoader() {
  return (
    <div className="flex justify-center items-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-tashtep-orange" />
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <section className="relative flex min-h-[60vh] w-full items-center overflow-hidden bg-obsidian text-gallery">
        <Container className="relative z-10 flex flex-col items-start gap-6 py-20">
          <h1 className="max-w-3xl text-5xl font-black leading-tight sm:text-6xl md:text-7xl">
            جودة تشطيبك تبدأ من هنا
          </h1>
          <p className="max-w-xl text-lg text-gallery/80 md:text-xl">
            اكتشف أحدث خامات التشطيب والديكور الفاخرة بأفضل الأسعار. نوفر لك كل ما تحتاجه لبناء بيت أحلامك.
          </p>
          <Button size="lg" asChild className="mt-4 rounded-full bg-rust text-white hover:bg-rust-dark">
            <Link href="/products">تصفح الكتالوج</Link>
          </Button>
        </Container>
      </section>

      <Section className="bg-white py-16">
        <Container>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-obsidian">التصنيفات</h2>
            <Button variant="outline" asChild className="rounded-full">
              <Link href="/categories">عرض الكل</Link>
            </Button>
          </div>
          <Suspense fallback={<SectionLoader />}>
            <FeaturedCategories />
          </Suspense>
        </Container>
      </Section>

      <Section className="bg-gallery py-16">
        <Container>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-obsidian">أحدث المنتجات</h2>
            <Button variant="outline" asChild className="rounded-full">
              <Link href="/products">تصفح المزيد</Link>
            </Button>
          </div>
          <Suspense fallback={<SectionLoader />}>
            <FeaturedProducts />
          </Suspense>
        </Container>
      </Section>
    </>
  );
}
