import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center bg-gallery-white">
      {/* Decorative number */}
      <div className="relative select-none mb-8">
        <span className="text-[160px] md:text-[220px] font-black leading-none text-stone/60 tracking-tighter">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-tashtep-orange/10 flex items-center justify-center">
            <span
              className="material-symbols-outlined text-tashtep-orange text-[40px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              search_off
            </span>
          </div>
        </div>
      </div>

      <h1 className="text-2xl md:text-3xl font-headline-md text-obsidian mb-4">
        الصفحة غير موجودة
      </h1>
      <p className="max-w-md text-secondary-foreground leading-relaxed text-balance mb-10">
        عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها. ربما تمت إزالتها أو أن الرابط غير صحيح.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-obsidian text-gallery-white text-sm font-semibold hover:bg-obsidian/90 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">home</span>
          الرئيسية
        </Link>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-tashtep-orange text-white text-sm font-semibold hover:bg-tashtep-orange/90 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">grid_view</span>
          تصفح المنتجات
        </Link>
      </div>
    </div>
  );
}
