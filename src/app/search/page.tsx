import { ProductService } from "@/services/product.service";
import { CategoryService } from "@/services/category.service";
import { Container } from "@/components/layout/container";

export const dynamic = "force-dynamic";
import { Section } from "@/components/layout/section";
import { ProductGrid } from "@/features/products/components/product-grid";
import { ProductCard } from "@/features/products/components/product-card";
import { ProductSkeletonCard } from "@/features/products/components/product-skeleton-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

function SearchResultsSkeleton() {
  return (
    <div>
      <div className="h-5 w-32 bg-stone animate-pulse rounded mb-4" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "نتائج البحث",
};

const SORT_MAP: Record<string, Record<string, "asc" | "desc">> = {
  newest: { createdAt: "desc" },
  price_asc: { price: "asc" },
  price_desc: { price: "desc" },
  rating_desc: { rating: "desc" },
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string; sort?: string; categoryId?: string; minPrice?: string; maxPrice?: string; inStock?: string }>;
}

async function SearchResults({
  query,
  sort,
  categoryId,
  minPrice,
  maxPrice,
  inStock,
}: {
  query: string;
  sort: string;
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: string;
}) {
  const orderBy = SORT_MAP[sort] ?? SORT_MAP.newest;
  const products = query
    ? await ProductService.searchProducts(query, {
        orderBy,
        categoryId: categoryId || undefined,
        minPrice: minPrice ? parseInt(minPrice) : undefined,
        maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
        inStock: inStock === "true",
      })
    : [];

  if (products.length === 0) {
    return (
      <div>
        <EmptyState
          title="لم نجد ما تبحث عنه"
          description={query ? `لم نجد نتائج لـ "${query}". جرب كلمات مختلفة.` : "أدخل كلمة للبحث في الشريط أعلاه."}
        />
        <div className="flex justify-center mt-4 gap-3">
          <Link href="/products" className="text-sm text-tashtep-orange hover:underline flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">grid_view</span>
            تصفح جميع المنتجات
          </Link>
          <span className="text-stone-300">|</span>
          <Link href="/categories" className="text-sm text-secondary hover:text-obsidian flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">category</span>
            الأقسام
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-secondary mb-4">وجدنا <span className="font-bold text-obsidian">{products.length}</span> نتيجة</p>
      <ProductGrid>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ProductGrid>
    </div>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";
  const sort = resolvedParams.sort || "newest";
  const categoryId = resolvedParams.categoryId;
  const minPrice = resolvedParams.minPrice;
  const maxPrice = resolvedParams.maxPrice;
  const inStock = resolvedParams.inStock;

  const categories = await CategoryService.getCategories();

  const buildFilterHref = (overrides: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    if (query) p.set("q", query);
    if (sort !== "newest") p.set("sort", sort);
    const merged = { categoryId, minPrice, maxPrice, inStock, ...overrides };
    if (merged.categoryId) p.set("categoryId", merged.categoryId);
    if (merged.minPrice) p.set("minPrice", merged.minPrice);
    if (merged.maxPrice) p.set("maxPrice", merged.maxPrice);
    if (merged.inStock === "true") p.set("inStock", "true");
    return `/search?${p.toString()}`;
  };

  const buildSortHref = (s: string) => {
    const p = new URLSearchParams();
    if (query) p.set("q", query);
    p.set("sort", s);
    if (categoryId) p.set("categoryId", categoryId);
    if (minPrice) p.set("minPrice", minPrice);
    if (maxPrice) p.set("maxPrice", maxPrice);
    if (inStock === "true") p.set("inStock", "true");
    return `/search?${p.toString()}`;
  };

  const hasActiveFilters = !!(categoryId || minPrice || maxPrice || inStock === "true");
  const clearHref = query ? `/search?q=${encodeURIComponent(query)}` : "/search";

  return (
    <Section className="py-macro-md bg-white min-h-screen">
      <Container>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-secondary mb-6" aria-label="مسار التنقل">
          <Link href="/" className="hover:text-obsidian transition-colors">الرئيسية</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_left</span>
          <span className="text-obsidian font-medium">نتائج البحث</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-obsidian mb-1">
              {query ? `نتائج: "${query}"` : "نتائج البحث"}
            </h1>
            {!query && (
              <p className="text-secondary text-sm">أدخل كلمة للبحث في شريط البحث أعلاه.</p>
            )}
          </div>

          {query && (
            <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
              <span className="text-sm text-secondary ml-1">ترتيب:</span>
              {[
                { value: "newest", label: "الأحدث" },
                { value: "price_asc", label: "السعر ↑" },
                { value: "price_desc", label: "السعر ↓" },
                { value: "rating_desc", label: "الأعلى تقييماً" },
              ].map((o) => (
                <Link
                  key={o.value}
                  href={buildSortHref(o.value)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors whitespace-nowrap ${
                    sort === o.value
                      ? "bg-obsidian text-white border-obsidian font-medium"
                      : "bg-white text-secondary border-soft-border hover:border-obsidian hover:text-obsidian"
                  }`}
                >
                  {o.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-gutter">
          {/* Sidebar Filters */}
          {query && categories.length > 0 && (
            <aside className="w-full lg:w-[240px] shrink-0">
              <div className="bg-white border border-soft-border rounded-xl p-5 lg:sticky lg:top-24 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-headline-md text-[16px] text-obsidian">تصفية النتائج</h3>
                  {hasActiveFilters && (
                    <Link href={clearHref} className="text-xs text-secondary hover:text-tashtep-orange underline transition-colors">
                      مسح
                    </Link>
                  )}
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <p className="font-label-md text-[13px] text-obsidian">الفئة</p>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={buildFilterHref({ categoryId: undefined })}
                      className={cn(
                        "rounded-full px-3 py-1 text-[12px] border transition-colors",
                        !categoryId ? "bg-obsidian text-white border-obsidian" : "bg-stone text-secondary border-stone hover:border-obsidian"
                      )}
                    >
                      الكل
                    </Link>
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={buildFilterHref({ categoryId: cat.id })}
                        className={cn(
                          "rounded-full px-3 py-1 text-[12px] border transition-colors",
                          categoryId === cat.id ? "bg-obsidian text-white border-obsidian" : "bg-stone text-secondary border-stone hover:border-obsidian"
                        )}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <p className="font-label-md text-[13px] text-obsidian">السعر (ج.م)</p>
                  <form method="GET" action="/search" className="flex items-center gap-2">
                    {query && <input type="hidden" name="q" value={query} />}
                    {sort !== "newest" && <input type="hidden" name="sort" value={sort} />}
                    {categoryId && <input type="hidden" name="categoryId" value={categoryId} />}
                    {inStock === "true" && <input type="hidden" name="inStock" value="true" />}
                    <input
                      type="number"
                      name="minPrice"
                      defaultValue={minPrice}
                      placeholder="من"
                      className="w-full h-9 rounded border border-soft-border bg-stone px-2 text-[13px] text-obsidian focus:border-tashtep-orange focus:ring-0 outline-none"
                    />
                    <span className="text-secondary text-xs shrink-0">-</span>
                    <input
                      type="number"
                      name="maxPrice"
                      defaultValue={maxPrice}
                      placeholder="إلى"
                      className="w-full h-9 rounded border border-soft-border bg-stone px-2 text-[13px] text-obsidian focus:border-tashtep-orange focus:ring-0 outline-none"
                    />
                    <button
                      type="submit"
                      className="h-9 w-9 shrink-0 flex items-center justify-center rounded bg-tashtep-orange text-white hover:bg-tashtep-orange/90 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </form>
                </div>

                {/* In Stock */}
                <Link
                  href={buildFilterHref({ inStock: inStock === "true" ? undefined : "true" })}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg border text-[13px] transition-colors",
                    inStock === "true" ? "bg-tashtep-orange/10 border-tashtep-orange/40 text-tashtep-orange" : "bg-stone border-soft-border text-secondary hover:border-obsidian"
                  )}
                >
                  <span className={cn(
                    "w-4 h-4 rounded border flex items-center justify-center shrink-0",
                    inStock === "true" ? "bg-tashtep-orange border-tashtep-orange" : "border-soft-border"
                  )}>
                    {inStock === "true" && <span className="material-symbols-outlined text-[12px] text-white">check</span>}
                  </span>
                  متوفر في المخزون فقط
                </Link>
              </div>
            </aside>
          )}

          {/* Results */}
          <main className="flex-1">
            <Suspense key={`${query}-${sort}-${categoryId}-${minPrice}-${maxPrice}-${inStock}`} fallback={<SearchResultsSkeleton />}>
              <SearchResults query={query} sort={sort} categoryId={categoryId} minPrice={minPrice} maxPrice={maxPrice} inStock={inStock} />
            </Suspense>
          </main>
        </div>
      </Container>
    </Section>
  );
}
