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
import { ChevronLeft } from "lucide-react";
import { ProductFilters } from "@/features/products/components/product-filters";
import { ProductSkeletonCard } from "@/features/products/components/product-skeleton-card";

export const metadata: Metadata = {
  title: "المنتجات",
  description: "تسوق أحدث الدهانات وخامات التشطيب والديكور الداخلي بأفضل الأسعار. توصيل لجميع محافظات مصر.",
  alternates: { canonical: "/products" },
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
  const brandId = Array.isArray(searchParams.brandId) ? searchParams.brandId[0] : searchParams.brandId;
  const q = Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q;
  
  let colors: string[] | undefined = undefined;
  if (searchParams.color) {
    colors = Array.isArray(searchParams.color) ? searchParams.color : [searchParams.color];
  }

  let sizes: string[] | undefined = undefined;
  if (searchParams.size) {
    sizes = Array.isArray(searchParams.size) ? searchParams.size : [searchParams.size];
  }

  return {
    minPrice: minPrice ? parseInt(minPrice) : undefined,
    maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
    inStock: inStock === "true",
    categoryId: categoryId || undefined,
    brandId: brandId || undefined,
    q: q || undefined,
    colors,
    sizes,
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
            className={`w-10 h-10 flex items-center justify-center rounded border transition-colors ${
              page <= 1 ? "pointer-events-none opacity-40 border-soft-border text-secondary" : "border-soft-border hover:border-obsidian text-obsidian"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </Link>
          
          {(() => {
            const getPaginationItems = (currentPage: number, totalPages: number) => {
              if (totalPages <= 7) {
                return Array.from({ length: totalPages }, (_, i) => i + 1);
              }
              if (currentPage <= 4) {
                return [1, 2, 3, 4, 5, '...', totalPages];
              }
              if (currentPage >= totalPages - 3) {
                return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
              }
              return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
            };

            const items = getPaginationItems(page, totalPages);

            return items.map((item, index) => {
              if (item === '...') {
                return <span key={`ellipsis-${index}`} className="px-2 text-secondary">...</span>;
              }
              
              const isCurrent = item === page;
              return (
                <Link
                  key={`page-${item}`}
                  href={buildPageHref(item as number)}
                  className={`w-10 h-10 flex items-center justify-center rounded border font-label-md transition-colors ${
                    isCurrent 
                      ? "bg-tashtep-orange text-white border-tashtep-orange pointer-events-none" 
                      : "border-soft-border hover:border-obsidian text-charcoal bg-white"
                  }`}
                >
                  {item}
                </Link>
              );
            });
          })()}

          <Link
            href={buildPageHref(Math.min(totalPages, page + 1))}
            aria-disabled={page >= totalPages}
            className={`w-10 h-10 flex items-center justify-center rounded border transition-colors ${
              page >= totalPages ? "pointer-events-none opacity-40 border-soft-border text-secondary" : "border-soft-border hover:border-obsidian text-obsidian"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
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
  const availableBrands = await ProductService.getAvailableBrands();
  const availableColors = await ProductService.getAvailableColors();
  const availableSizes = await ProductService.getAvailableSizes();

  return (
    <Section className="min-h-screen bg-white py-macro-md md:py-macro-lg">
      <Container className="max-w-container-max">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-secondary mb-6" aria-label="مسار التنقل">
          <Link href="/" className="hover:text-obsidian transition-colors">الرئيسية</Link>
          <ChevronLeft className="h-3.5 w-3.5" />
          <span className="text-obsidian font-medium">المنتجات</span>
        </nav>

        <div className="mb-macro-sm">
          <h1 className="font-display-hero-mobile md:font-display-hero text-[32px] md:text-[48px] text-obsidian mb-2">
            جميع المنتجات
          </h1>
          <p className="font-body-lg text-body-lg text-secondary max-w-2xl">
            اكتشف تشكيلتنا الواسعة من الدهانات عالية الجودة، وأدوات التشطيب التي تناسب جميع احتياجاتك
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-gutter">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-[280px] shrink-0">
            <ProductFilters 
              categories={categories.map((c) => ({ id: c.id, name: c.name }))}
              brands={availableBrands.map((b) => ({ id: b.id, name: b.name }))}
              colors={availableColors}
              sizes={availableSizes}
              defaultValues={{
                minPrice: !Array.isArray(resolvedParams.minPrice) ? resolvedParams.minPrice : undefined,
                maxPrice: !Array.isArray(resolvedParams.maxPrice) ? resolvedParams.maxPrice : undefined,
                inStock: !Array.isArray(resolvedParams.inStock) ? resolvedParams.inStock : undefined,
                categoryId: !Array.isArray(resolvedParams.categoryId) ? resolvedParams.categoryId : undefined,
                brandId: !Array.isArray(resolvedParams.brandId) ? resolvedParams.brandId : undefined,
                sort: !Array.isArray(resolvedParams.sort) ? resolvedParams.sort : undefined,
                q: !Array.isArray(resolvedParams.q) ? resolvedParams.q : undefined,
                colors: Array.isArray(resolvedParams.color) ? resolvedParams.color : (resolvedParams.color ? [resolvedParams.color] : undefined),
                sizes: Array.isArray(resolvedParams.size) ? resolvedParams.size : (resolvedParams.size ? [resolvedParams.size] : undefined),
              }}
            />
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <Suspense fallback={
              <ProductGrid>
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductSkeletonCard key={i} />
                ))}
              </ProductGrid>
            }>
              <AllProducts searchParams={resolvedParams} />
            </Suspense>
          </main>
        </div>
      </Container>
    </Section>
  );
}
