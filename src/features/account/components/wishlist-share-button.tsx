"use client";

import * as React from "react";
import { toast } from "sonner";
import { generateWishlistShareLinkAction } from "@/actions/wishlist.actions";

interface WishlistShareButtonProps {
  existingToken?: string | null;
}

export function WishlistShareButton({ existingToken }: WishlistShareButtonProps) {
  const [isPending, setIsPending] = React.useState(false);
  const [token, setToken] = React.useState<string | null>(existingToken ?? null);

  const shareUrl = token
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/wishlist/shared/${token}`
    : null;

  async function handleGenerateLink() {
    setIsPending(true);
    try {
      const result = await generateWishlistShareLinkAction({});
      if (result?.data?.token) {
        setToken(result.data.token);
        const url = `${window.location.origin}/wishlist/shared/${result.data.token}`;
        await navigator.clipboard.writeText(url);
        toast.success("تم نسخ رابط المشاركة");
      }
    } catch {
      toast.error("حدث خطأ، حاول مرة أخرى");
    } finally {
      setIsPending(false);
    }
  }

  async function handleCopyLink() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("تم نسخ الرابط");
    } catch {
      toast.error("تعذر النسخ، انسخ الرابط يدوياً");
    }
  }

  if (token) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-4 py-2 border border-tashtep-orange text-tashtep-orange rounded-lg text-sm font-bold hover:bg-tashtep-orange/5 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">content_copy</span>
          نسخ رابط المشاركة
        </button>
        <button
          onClick={handleGenerateLink}
          disabled={isPending}
          className="text-xs text-secondary hover:text-obsidian transition-colors underline"
        >
          تجديد الرابط
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleGenerateLink}
      disabled={isPending}
      className="flex items-center gap-2 px-4 py-2 border border-soft-border text-secondary rounded-lg text-sm font-bold hover:border-tashtep-orange hover:text-tashtep-orange transition-colors disabled:opacity-60"
    >
      <span className="material-symbols-outlined text-[16px]">share</span>
      {isPending ? "جاري الإنشاء..." : "مشاركة المفضلة"}
    </button>
  );
}
