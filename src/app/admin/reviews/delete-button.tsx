"use client";

export function DeleteReviewButton({ id }: { id: string }) {
  return (
    <form action={`/api/admin/reviews/${id}`} method="POST">
      <input type="hidden" name="_method" value="DELETE" />
      <button
        type="submit"
        onClick={(e) => { if (!window.confirm("حذف هذا التقييم؟")) e.preventDefault(); }}
        className="text-xs flex items-center gap-1 text-secondary hover:text-red-500 transition-colors"
        title="حذف"
      >
        <span className="material-symbols-outlined text-[16px]">delete</span>
      </button>
    </form>
  );
}
