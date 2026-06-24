import { ProductService } from "@/services/product.service";
import { CategoryService } from "@/services/category.service";

export const dynamic = "force-dynamic";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ProductGrid } from "@/features/products/components/product-grid";
import { ProductCard } from "@/features/products/components/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ProductFilters } from "@/features/products/components/product-filters";

export const metadata: Metadata = {
  title: "المنتجات",
};

const PAGE_SIZE = 20;

const SORT_MAP: Record<string, Record<string, "asc" | "desc">> = {
  newest: { createdAt: "desc" },
  price_asc: { price: "asc" },
  price_desc: { price: "desc" },
  rating_desc: { rating: "desc" },
};

type SearchParamsType = { [key: string]: string | string[] | undefined };

function buildFilterOptions(searchParams: SearchParamsType) {
  const minPrice = Array.isArray(searchParams.minPrice) ? searchParams.minPrice[0] : searchParams.minPrice;
  const maxPrice = Array.isArray(searchParams.maxPrice) ? searchParams.maxPrice[0] : searchParams.maxPrice;
  const inStock = Array.isArray(searchParams.inStock) ? searchParams.inStock[0] : searchParams.inStock;
  const categoryId = Array.isArray(searchParams.categoryId) ? searchParams.categoryId[0] : searchParams.categoryId;
  const q = Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q;
  
  let colors: string[] | undefined = undefined;
  if (searchParams.color) {
    colors = Array.isArray(searchParams.color) ? searchParams.color : [searchParams.color];
  }

  return {
    minPrice: minPrice ? parseInt(minPrice) : undefined,
    maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
    inStock: inStock === "true",
    categoryId: categoryId || undefined,
    q: q || undefined,
    colors,
  };
}

async function AllProducts({ searchParams }: { searchParams: SearchParamsType }) {
  const pageParam = Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page;
  const page = pageParam ? Math.max(1, parseInt(pageParam)) : 1;
  const sortParam = Array.isArray(searchParams.sort) ? searchParams.sort[0] : searchParams.sort;
  const orderBy = SORT_MAP[sortParam || "newest"] || SORT_MAP.newest;
  const filterOptions = buildFilterOptions(searchParams);

  const [products, total] = await Promise.all([
    ProductService.getProducts({ ...filterOptions, orderBy, page, limit: PAGE_SIZE }),
    ProductService.getProductsCount(filterOptions),
  ]);

  if (products.length === 0) {
    return (
      <div>
        <EmptyState
          title="لا توجد منتجات"
          description="لم نتمكن من العثور على أي منتجات تطابق الفلاتر المحددة."
        />
        <div className="flex justify-center mt-4">
          <Link href="/products" className="font-label-md text-label-md text-obsidian underline hover:text-tashtep-orange transition-colors">
            مسح الفلاتر
          </Link>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const buildPageHref = (targetPage: number) => {
    const params = new URLSearchParams(
      Object.entries(searchParams).filter(([, v]) => v !== undefined) as [string, string][]
    );
    params.set("page", String(targetPage));
    return `/products?${params.toString()}`;
  };

  return (
    <div>
      <p className="font-label-md text-label-md text-secondary mb-micro-md">
        إجمالي {total} منتج
      </p>

      <ProductGrid>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ProductGrid>

      {totalPages > 1 && (
        <nav aria-label="Pagination" className="flex justify-center items-center gap-2 mt-macro-sm">
          <Link
            href={buildPageHref(Math.max(1, page - 1))}
            aria-disabled={page <= 1}
            className={`px-4 py-2 rounded border font-label-md text-label-md transition-colors ${
              page <= 1 ? "pointer-events-none opacity-40 border-soft-border" : "border-soft-border hover:border-obsidian text-obsidian"
            }`}
          >
            السابق
          </Link>
          <span className="font-label-md text-label-md text-secondary px-2">
            صفحة {page} من {totalPages}
          </span>
          <Link
            href={buildPageHref(Math.min(totalPages, page + 1))}
            aria-disabled={page >= totalPages}
            className={`px-4 py-2 rounded border font-label-md text-label-md transition-colors ${
              page >= totalPages ? "pointer-events-none opacity-40 border-soft-border" : "border-soft-border hover:border-obsidian text-obsidian"
            }`}
          >
            التالي
          </Link>
        </nav>
      )}
    </div>
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsType>;
}) {
  const resolvedParams = await searchParams;
  const categories = await CategoryService.getCategories();
  const availableColors = await ProductService.getAvailableColors();

  return (
    <Section className="min-h-screen bg-white py-macro-md md:py-macro-lg">
      <Container className="max-w-container-max">
        <div className="mb-macro-sm">
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-obsidian mb-2">جميع المنتجات</h1>
          <p className="font-body-md text-body-md text-secondary">مجموعة مختارة من أحدث وأفضل المنتجات والخامات.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-gutter">
          <aside className="lg:col-span-1">
            <ProductFilters
              categories={categories.map((c) => ({ id: c.id, name: c.name }))}
              colors={availableColors}
              defaultValues={resolvedParams}
            />
          </aside>
          <div className="lg:col-span-3">
            <Suspense fallback={<div className="flex justify-center py-12"><span className="material-symbols-outlined animate-spin text-[32px] text-tashtep-orange">sync</span></div>}>
              <AllProducts searchParams={resolvedParams} />
            </Suspense>
          </div>
        </div>
      </Container>
    </Section>
  );
}
