import { ProductService } from "@/services/product.service";
import { ProductCard } from "@/features/products/components/product-card";
import { ProductSkeletonCard } from "@/features/products/components/product-skeleton-card";
import { Suspense } from "react";

async function UpsellProducts() {
  const products = await ProductService.getProducts({
    limit: 4,
    orderBy: { rating: "desc" },
    inStock: true,
  });

  if (products.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function UpsellSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <ProductSkeletonCard key={i} />
      ))}
    </div>
  );
}

export function CartUpsell() {
  return (
    <section className="mt-macro-md pt-macro-md border-t border-stone">
      <div className="flex items-center gap-2 mb-gutter">
        <span className="material-symbols-outlined text-tashtep-orange text-xl">thumb_up</span>
        <h2 className="text-headline-sm font-headline-sm text-obsidian">قد يعجبك أيضاً</h2>
      </div>
      <Suspense fallback={<UpsellSkeleton />}>
        <UpsellProducts />
      </Suspense>
    </section>
  );
}
