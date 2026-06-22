import { ProductService } from "@/services/product.service";
import { Container } from "@/components/layout/container";

export const dynamic = "force-dynamic";
import { Section } from "@/components/layout/section";
import { ProductGrid } from "@/features/products/components/product-grid";
import { ProductCard } from "@/features/products/components/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "نتائج البحث",
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

async function SearchResults({ query }: { query: string }) {
  const products = query ? await ProductService.searchProducts(query) : [];

  if (products.length === 0) {
    return (
      <EmptyState 
        title="لم نجد ما تبحث عنه" 
        description="جرب البحث بكلمات مختلفة أو تصفح الأقسام من القائمة الرئيسية." 
      />
    );
  }

  return (
    <ProductGrid>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ProductGrid>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";

  return (
    <Section className="py-12 bg-white min-h-screen">
      <Container>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-obsidian mb-2">نتائج البحث</h1>
          <p className="text-charcoal">
            {query ? `نعرض نتائج البحث عن: "${query}"` : "يرجى إدخال كلمة للبحث في شريط البحث أعلاه."}
          </p>
        </div>
        
        <Suspense key={query} fallback={<div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-tashtep-orange" /></div>}>
          <SearchResults query={query} />
        </Suspense>
      </Container>
    </Section>
  );
}
