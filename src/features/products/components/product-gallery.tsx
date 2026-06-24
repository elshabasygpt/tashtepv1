"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  name: string;
  badges?: React.ReactNode;
}

export function ProductGallery({ images, name, badges }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const activeImage = images[activeIndex] || images[0];

  return (
    <div className="flex flex-col-reverse md:flex-row gap-micro-md">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-micro-sm overflow-x-auto md:overflow-y-auto hide-scroll md:w-24 shrink-0">
          {images.map((img, idx) => (
            <button
              key={img + idx}
              type="button"
              aria-label={`صورة ${idx + 1}`}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "relative w-20 h-24 md:w-full md:h-28 rounded-lg overflow-hidden shrink-0 border-2 transition-colors",
                idx === activeIndex ? "border-obsidian" : "border-stone opacity-70 hover:opacity-100"
              )}
            >
              <Image src={img} alt={`${name} - ${idx + 1}`} fill sizes="100px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="flex-grow aspect-[3/4] bg-stone rounded-lg relative overflow-hidden">
        {badges && <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">{badges}</div>}
        {activeImage ? (
          <Image src={activeImage} alt={name} fill sizes="(max-width: 768px) 100vw, 60vw" className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-secondary font-medium">صورة المنتج</div>
        )}
      </div>
    </div>
  );
}
