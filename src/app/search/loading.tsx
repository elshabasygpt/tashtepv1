import { ProductSkeletonCard } from "@/features/products/components/product-skeleton-card";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Skeleton } from "@/components/ui/skeleton";

export default function SearchLoading() {
  return (
    <Section className="py-macro-md bg-white min-h-screen">
      <Container>
        <Skeleton className="h-4 w-48 mb-6" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <Skeleton className="h-9 w-64" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-9 w-20 rounded-full" />)}
          </div>
        </div>
        <Skeleton className="h-4 w-32 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeletonCard key={i} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
