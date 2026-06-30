"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-surface-bright px-4">
          <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl border border-soft-border shadow-sm">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">error</span>
            </div>
            <h2 className="text-2xl font-headline-md text-obsidian">عذراً، حدث خطأ غير متوقع</h2>
            <p className="text-secondary text-body-md">
              واجه نظامنا مشكلة أثناء معالجة طلبك. تم تسجيل الخطأ وسيقوم فريقنا بمراجعته.
            </p>
            <Button
              onClick={() => reset()}
              variant="tashtep"
              className="w-full h-12"
            >
              المحاولة مرة أخرى
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
