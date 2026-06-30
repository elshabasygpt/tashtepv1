import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function ProductSkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("w-full bg-white rounded-2xl overflow-hidden border border-soft-border flex flex-col", className)}>
      {/* Image Skeleton */}
      <Skeleton className="w-full aspect-[4/5] rounded-none rounded-t-2xl" />
      
      {/* Content Skeleton */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Category & Title */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-5 w-3/4" />
        </div>

        {/* Rating */}
        <Skeleton className="h-4 w-1/2" />

        <div className="mt-auto pt-2 space-y-4">
          {/* Price */}
          <Skeleton className="h-6 w-2/5" />

          {/* Button */}
          <Skeleton className="h-10 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
