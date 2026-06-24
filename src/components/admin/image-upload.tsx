"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export function ImageUpload({ value, onChange, folder = "misc", label = "اختر صورة" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("فشل رفع الصورة");
      }

      const data = await res.json();
      if (data.urls && data.urls.length > 0) {
        onChange(data.urls[0]);
      }
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء رفع الصورة");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative w-full h-48 rounded-xl overflow-hidden border border-soft-border bg-stone">
          <Image
            src={value}
            alt="Preview"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? "جاري الرفع..." : "تغيير الصورة"}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => onChange("")}
            >
              إزالة
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-48 rounded-xl border-2 border-dashed border-soft-border bg-stone flex flex-col items-center justify-center cursor-pointer hover:border-tashtep-orange hover:bg-white transition-colors"
        >
          <span className="material-symbols-outlined text-4xl text-tertiary-container mb-2">add_photo_alternate</span>
          <span className="text-sm font-label-md text-secondary-foreground">
            {isUploading ? "جاري الرفع..." : label}
          </span>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
