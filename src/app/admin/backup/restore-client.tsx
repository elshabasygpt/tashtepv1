"use client";

import * as React from "react";

export function RestoreClient() {
  const [file, setFile] = React.useState<File | null>(null);
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = React.useState("");
  const [stats, setStats] = React.useState<Record<string, number> | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  async function handleRestore() {
    if (!file) return;

    const confirmed = window.confirm(
      "⚠️ تحذير: سيتم حذف كل البيانات الحالية واستبدالها بالنسخة الاحتياطية.\n\nهل أنت متأكد تماماً؟"
    );
    if (!confirmed) return;

    const confirmed2 = window.confirm("تأكيد أخير: سيتم حذف كل الطلبات والمستخدمين والمنتجات الحالية. متابعة؟");
    if (!confirmed2) return;

    setStatus("loading");
    setMessage("");
    setStats(null);

    try {
      const text = await file.text();
      const backup = JSON.parse(text);

      const res = await fetch("/api/admin/backup/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(backup),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setMessage(data.message ?? "تمت الاستعادة بنجاح");
        setStats(data.stats ?? null);
        setFile(null);
        if (fileRef.current) fileRef.current.value = "";
      } else {
        setStatus("error");
        setMessage(data.error ?? "حدث خطأ أثناء الاستعادة");
      }
    } catch (e) {
      setStatus("error");
      setMessage(e instanceof Error ? e.message : "ملف غير صالح أو حدث خطأ غير متوقع");
    }
  }

  return (
    <div className="bg-white border border-red-200 rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-2 text-red-600 mb-2">
        <span className="material-symbols-outlined text-[22px]">warning</span>
        <span className="font-bold text-sm">منطقة خطرة — ADMIN فقط</span>
      </div>

      <p className="text-sm text-secondary leading-relaxed">
        الاستعادة تحذف <strong className="text-red-600">كل البيانات الحالية</strong> وتستبدلها بالنسخة الاحتياطية.
        تأكد أنك تمتلك نسخة من البيانات الحالية قبل المتابعة.
      </p>

      <div className="space-y-3">
        <label className="block">
          <span className="text-sm font-medium text-obsidian">اختر ملف الـ backup (.json)</span>
          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setStatus("idle");
              setMessage("");
              setStats(null);
            }}
            className="mt-2 block w-full text-sm text-secondary file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-stone file:text-obsidian hover:file:bg-stone/70 cursor-pointer"
          />
        </label>

        {file && (
          <div className="flex items-center gap-2 text-sm text-secondary bg-stone/30 px-3 py-2 rounded-lg">
            <span className="material-symbols-outlined text-[16px] text-green-600">description</span>
            <span className="font-mono truncate">{file.name}</span>
            <span className="mr-auto text-xs">({(file.size / 1024).toFixed(1)} KB)</span>
          </div>
        )}

        <button
          onClick={handleRestore}
          disabled={!file || status === "loading"}
          className="w-full h-11 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {status === "loading" ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              جاري الاستعادة...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">restore</span>
              استعادة من هذا الملف
            </>
          )}
        </button>
      </div>

      {status === "success" && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-green-700 font-bold mb-2">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            {message}
          </div>
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
              {Object.entries(stats).map(([k, v]) => (
                <div key={k} className="bg-white rounded-lg p-2 text-center border border-green-100">
                  <div className="text-lg font-black text-green-600">{v}</div>
                  <div className="text-[11px] text-secondary">{k}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {status === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-2 text-red-700 text-sm">
          <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
          {message}
        </div>
      )}
    </div>
  );
}
