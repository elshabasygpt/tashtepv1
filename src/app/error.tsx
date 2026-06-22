"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Tashtep Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
      <h2 className="text-2xl font-light text-obsidian">
        حدث خطأ غير متوقع
      </h2>
      <p className="mt-4 max-w-lg text-charcoal leading-relaxed text-balance">
        نعتذر عن هذا الخلل. فريقنا الهندسي يعمل على مراقبة أداء المنصة وتحسينه باستمرار.
      </p>
      <button
        onClick={() => reset()}
        className="mt-8 inline-flex h-12 items-center justify-center rounded-sm bg-obsidian px-8 text-sm font-medium text-gallery transition-opacity hover:opacity-80"
      >
        المحاولة مرة أخرى
      </button>
    </div>
  );
}
