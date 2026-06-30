"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createGiftCardAction } from "@/actions/admin.actions";

export function CreateGiftCardForm() {
  const [amount, setAmount] = useState("100");
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await createGiftCardAction({ amount: Number(amount), email: email || undefined });
      if (result.success && result.code) {
        toast.success(`تم إنشاء الكرت: ${result.code}`, { duration: 8000 });
        setEmail("");
      } else {
        toast.error(result.error ?? "حدث خطأ");
      }
    });
  }

  return (
    <form onSubmit={handleCreate} className="bg-white border border-soft-border rounded-xl p-5 flex flex-wrap gap-4 items-end">
      <div>
        <label className="text-xs text-secondary block mb-1">القيمة (ج.م)</label>
        <select value={amount} onChange={e => setAmount(e.target.value)} className="border border-soft-border rounded-lg px-3 py-2 text-sm">
          {[50, 100, 200, 500, 1000].map(v => <option key={v} value={v}>{v} ج.م</option>)}
        </select>
      </div>
      <div className="flex-1 min-w-[200px]">
        <label className="text-xs text-secondary block mb-1">بريد المستلم (اختياري)</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="example@email.com"
          className="w-full border border-soft-border rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="bg-tashtep-orange text-white px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
      >
        {isPending ? "جاري الإنشاء..." : "إنشاء كرت هدية"}
      </button>
    </form>
  );
}
