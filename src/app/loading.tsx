export default function Loading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4 text-obsidian">
      {/* Premium minimal spinner (Apple/Zara style) */}
      <div className="h-5 w-5 animate-spin rounded-full border-[1.5px] border-obsidian border-t-transparent" />
      <span className="text-sm font-medium text-charcoal">
        جاري التحميل...
      </span>
    </div>
  );
}
