import { Skeleton } from "@/components/ui/skeleton";

function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-soft-border flex flex-col">
      <Skeleton className="w-full aspect-[4/3] rounded-none" />
      <div className="p-6 flex flex-col gap-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-5 w-3/5" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-4 w-20 mt-2" />
      </div>
    </div>
  );
}

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-gallery-white">
      <section className="bg-surface-bright py-macro-lg border-b border-soft-border">
        <div className="max-w-container-max mx-auto px-gutter text-center">
          <Skeleton className="h-10 w-48 mx-auto mb-4" />
          <Skeleton className="h-5 w-96 mx-auto" />
        </div>
      </section>
      <section className="py-macro-lg max-w-container-max mx-auto px-gutter">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {Array.from({ length: 6 }).map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
