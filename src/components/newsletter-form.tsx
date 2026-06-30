"use client";

import * as React from "react";

interface NewsletterFormProps {
  inputClassName?: string;
  buttonClassName?: string;
  wrapperClassName?: string;
}

export function NewsletterForm({ inputClassName, buttonClassName, wrapperClassName }: NewsletterFormProps) {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error" | "duplicate">("idle");
  const [message, setMessage] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (res.status === 409) {
        setStatus("duplicate");
        setMessage(data.error ?? "أنت مشترك بالفعل");
      } else if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "حدث خطأ، يرجى المحاولة مجدداً");
      } else {
        setStatus("success");
        setMessage(data.message ?? "تم الاشتراك بنجاح!");
        setEmail("");
      }
    } catch {
      setStatus("error");
      setMessage("تعذر الاتصال بالخادم");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 bg-green-500/20 border border-green-400/30 rounded-xl px-5 py-4">
        <span className="material-symbols-outlined text-green-400 text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        <span className="text-sm text-green-300 font-medium">{message}</span>
      </div>
    );
  }

  return (
    <div className={wrapperClassName}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row-reverse gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
          required
          placeholder="بريدك الإلكتروني..."
          dir="ltr"
          disabled={status === "loading"}
          className={inputClassName ?? "flex-1 px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-tashtep-orange focus:bg-white/15 transition-all text-sm text-right"}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={buttonClassName ?? "px-8 py-3.5 bg-tashtep-orange text-white rounded-xl font-bold text-sm hover:bg-tashtep-orange/90 disabled:opacity-60 transition-colors whitespace-nowrap"}
        >
          {status === "loading" ? (
            <span className="flex items-center gap-2 justify-center">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              جاري...
            </span>
          ) : "اشترك الآن"}
        </button>
      </form>
      {(status === "error" || status === "duplicate") && (
        <p className={`text-xs mt-2 ${status === "duplicate" ? "text-amber-300" : "text-red-300"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
