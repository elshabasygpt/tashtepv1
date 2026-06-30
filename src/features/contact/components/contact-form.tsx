"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

type FormStatus = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = React.useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = React.useState("");
  const formRef = React.useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(json.error ?? "حدث خطأ، يرجى المحاولة مجدداً");
      } else {
        setStatus("success");
        formRef.current?.reset();
      }
    } catch {
      setStatus("error");
      setErrorMsg("تعذر الاتصال بالخادم. يرجى المحاولة لاحقاً.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <span className="material-symbols-outlined text-green-600 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        </div>
        <h3 className="text-xl font-bold text-obsidian">تم إرسال رسالتك!</h3>
        <p className="text-secondary text-sm max-w-xs">شكراً لتواصلك معنا. سيرد عليك فريقنا خلال 24 ساعة.</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-2 text-sm text-tashtep-orange hover:underline"
        >
          إرسال رسالة أخرى
        </button>
      </div>
    );
  }

  const inputClass = "w-full rounded-xl border border-soft-border bg-stone py-3 px-4 focus:ring-0 focus:border-tashtep-orange focus:bg-white transition-colors outline-none text-sm";

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-obsidian mb-1.5">الاسم بالكامل <span className="text-red-500">*</span></label>
        <input type="text" id="name" name="name" required minLength={2} className={inputClass} placeholder="محمد أحمد" />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-obsidian mb-1.5">البريد الإلكتروني <span className="text-red-500">*</span></label>
        <input type="email" id="email" name="email" required className={inputClass} placeholder="example@email.com" dir="ltr" />
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-obsidian mb-1.5">الموضوع <span className="text-red-500">*</span></label>
        <input type="text" id="subject" name="subject" required minLength={3} className={inputClass} placeholder="استفسار عن المنتجات" />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-obsidian mb-1.5">الرسالة <span className="text-red-500">*</span></label>
        <textarea id="message" name="message" required minLength={10} rows={5} className={`${inputClass} resize-none`} placeholder="اكتب رسالتك هنا..." />
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          <span className="material-symbols-outlined text-[18px]">error</span>
          {errorMsg}
        </div>
      )}

      <Button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-tashtep-orange text-white hover:bg-obsidian transition-colors h-12 rounded-xl text-sm font-bold"
      >
        {status === "loading" ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            جاري الإرسال...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">send</span>
            إرسال الرسالة
          </span>
        )}
      </Button>
    </form>
  );
}
