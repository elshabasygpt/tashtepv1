"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  label?: string;
}

export function MultiImageUpload({ value, onChange, folder = "products", label = "إضافة صورة" }: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("file", file);
      });
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("فشل رفع الصور");
      }

      const data = await res.json();
      if (data.urls && data.urls.length > 0) {
        onChange([...value, ...data.urls]);
      }
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء رفع الصور");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {value.map((url, index) => (
          <div key={index} className="relative w-full h-32 rounded-xl overflow-hidden border border-soft-border bg-stone group">
            <Image
              src={url}
              alt={`Preview ${index}`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeImage(index)}
              >
                إزالة
              </Button>
            </div>
          </div>
        ))}

        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-32 rounded-xl border-2 border-dashed border-soft-border bg-stone flex flex-col items-center justify-center cursor-pointer hover:border-tashtep-orange hover:bg-white transition-colors"
        >
          <span className="material-symbols-outlined text-3xl text-tertiary-container mb-1">add_photo_alternate</span>
          <span className="text-xs font-label-md text-secondary-foreground text-center px-2">
            {isUploading ? "جاري الرفع..." : label}
          </span>
        </div>
      </div>
      
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
