"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
      <h1 className="text-9xl font-bold text-stone">404</h1>
      <h2 className="mt-8 text-2xl font-light text-obsidian">
        الصفحة غير موجودة
      </h2>
      <p className="mt-4 max-w-lg text-charcoal leading-relaxed text-balance">
        عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها. ربما تمت إزالتها أو أن الرابط غير صحيح.
      </p>
      <Link
        href="/"
        className="mt-12 inline-flex h-12 items-center justify-center rounded-sm bg-obsidian px-8 text-sm font-medium text-gallery transition-opacity hover:opacity-80"
      >
        العودة للرئيسية
      </Link>
    </div>
  );
}
