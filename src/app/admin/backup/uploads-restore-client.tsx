"use client";

import * as React from "react";

export function UploadsRestoreClient() {
  const [file, setFile] = React.useState<File | null>(null);
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = React.useState("");
  const [stats, setStats] = React.useState<{ extracted: number; skipped: number } | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  async function handleRestore() {
    if (!file) return;

    const confirmed = window.confirm(
      "سيتم حذف كل الصور الحالية في public/uploads واستبدالها بمحتوى الـ ZIP.\n\nمتابعة؟"
    );
    if (!confirmed) return;

    setStatus("loading");
    setMessage("");
    setStats(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/backup/uploads-restore", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setMessage(data.message ?? "تمت استعادة الصور بنجاح");
        setStats(data.stats ?? null);
        setFile(null);
        if (fileRef.current) fileRef.current.value = "";
      } else {
        setStatus("error");
        setMessage(data.error ?? "حدث خطأ أثناء الاستعادة");
      }
    } catch (e) {
      setStatus("error");
      setMessage(e instanceof Error ? e.message : "خطأ غير متوقع");
    }
  }

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="text-sm font-medium text-obsidian">ملف ZIP للصور</span>
        <input
          ref={fileRef}
          type="file"
          accept=".zip,application/zip"
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
          <span className="material-symbols-outlined text-[16px] text-green-600">folder_zip</span>
          <span className="font-mono truncate">{file.name}</span>
          <span className="mr-auto text-xs">({(file.size / 1024).toFixed(1)} KB)</span>
        </div>
      )}

      <button
        onClick={handleRestore}
        disabled={!file || status === "loading"}
        className="w-full h-10 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm"
      >
        {status === "loading" ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            جاري الاستعادة...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[18px]">drive_folder_upload</span>
            استعادة الصور
          </>
        )}
      </button>

      {status === "success" && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
          <div className="flex items-center gap-2 font-bold mb-1">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            {message}
          </div>
          {stats && (
            <p className="text-xs">
              تم استخراج <strong>{stats.extracted}</strong> صورة
              {stats.skipped > 0 && ` (تم تخطي ${stats.skipped} ملف غير مسموح)`}
            </p>
          )}
        </div>
      )}

      {status === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2 text-red-700 text-sm">
          <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
          {message}
        </div>
      )}
    </div>
  );
}
