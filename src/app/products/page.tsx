import { ProductService } from "@/services/product.service";

export const dynamic = "force-dynamic";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ProductGrid } from "@/features/products/components/product-grid";
import { ProductCard } from "@/features/products/components/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { ProductFilters } from "@/features/products/components/product-filters";

export const metadata: Metadata = {
  title: "المنتجات",
};

async function AllProducts({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const minPrice = searchParams.minPrice ? parseInt(searchParams.minPrice) : undefined;
  const maxPrice = searchParams.maxPrice ? parseInt(searchParams.maxPrice) : undefined;
  const inStock = searchParams.inStock === "true";

  const products = await ProductService.getProducts({ minPrice, maxPrice, inStock });
  
  if (products.length === 0) {
    return <EmptyState title="لا توجد منتجات" description="لم نتمكن من العثور على أي منتجات تطابق الفلاتر المحددة." />;
  }
  return (
    <ProductGrid>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ProductGrid>
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedParams = await searchParams;

  return (
    <Section className="min-h-screen bg-white py-12">
      <Container>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold text-obsidian">جميع المنتجات</h1>
            <p className="text-charcoal">مجموعة مختارة من أحدث وأفضل المنتجات والخامات.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <ProductFilters defaultValues={resolvedParams} />
          </aside>
          <div className="lg:col-span-3">
            <Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-tashtep-orange" /></div>}>
              <AllProducts searchParams={resolvedParams} />
            </Suspense>
          </div>
        </div>
      </Container>
    </Section>
  );
}
