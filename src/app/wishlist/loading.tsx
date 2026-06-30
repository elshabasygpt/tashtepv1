import { ProductSkeletonCard } from "@/features/products/components/product-skeleton-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function WishlistLoading() {
  return (
    <div className="min-h-screen bg-white py-macro-md md:py-macro-lg">
      <div className="max-w-container-max mx-auto px-4 md:px-12 lg:px-16">
        <div className="flex justify-between items-center mb-macro-sm">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
