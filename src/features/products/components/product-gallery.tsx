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
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const activeImage = images[activeIndex] || images[0];

  const prev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setActiveIndex((i) => (i + 1) % images.length);

  React.useEffect(() => {
    if (!lightboxOpen) return;
    const len = images.length;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") setActiveIndex((i) => (i - 1 + len) % len);
      if (e.key === "ArrowLeft") setActiveIndex((i) => (i + 1) % len);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, images.length]);

  return (
    <>
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
        <div
          className="flex-grow aspect-[3/4] bg-stone rounded-lg relative overflow-hidden cursor-zoom-in group"
          onClick={() => activeImage && setLightboxOpen(true)}
          role="button"
          aria-label="تكبير الصورة"
        >
          {badges && <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">{badges}</div>}
          {activeImage ? (
            <Image src={activeImage} alt={name} fill sizes="(max-width: 768px) 100vw, 60vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-secondary font-medium">صورة المنتج</div>
          )}
          {/* Zoom hint */}
          <div className="absolute bottom-3 left-3 bg-black/50 text-white text-[11px] px-2 py-1 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <span className="material-symbols-outlined text-[14px]">zoom_in</span>
            تكبير
          </div>
          {/* Navigation arrows on multi-image */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="السابق"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
              <button
                type="button"
                aria-label="التالي"
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && activeImage && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            aria-label="إغلاق"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="السابق"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[28px]">chevron_right</span>
              </button>
              <button
                type="button"
                aria-label="التالي"
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[28px]">chevron_left</span>
              </button>
            </>
          )}

          <div
            className="relative w-full max-w-3xl max-h-[85vh] aspect-[3/4] md:aspect-square"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeImage}
              alt={name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setActiveIndex(idx); }}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    idx === activeIndex ? "bg-white" : "bg-white/30 hover:bg-white/60"
                  )}
                  aria-label={`صورة ${idx + 1}`}
                />
              ))}
            </div>
          )}

          <span className="absolute top-4 right-4 text-white/60 text-sm font-mono">
            {activeIndex + 1} / {images.length}
          </span>
        </div>
      )}
    </>
  );
}
