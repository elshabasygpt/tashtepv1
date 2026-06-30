"use client";

import { useState } from "react";

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  items: FaqItem[];
  title?: string;
  hideSchema?: boolean;
}

export function FaqSection({ items, title = "أسئلة شائعة", hideSchema = false }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <div>
      {!hideSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      {title && (
        <h2 className="text-headline-sm font-headline-sm text-obsidian mb-6">{title}</h2>
      )}
      <div className="space-y-2.5">
        {items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={item.question}
              className={`rounded-xl border transition-all duration-200 ${
                isOpen
                  ? "border-tashtep-orange/50 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
                  : "border-stone bg-white hover:border-tashtep-orange/30 hover:shadow-sm"
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-right"
              >
                <span
                  className={`font-semibold text-sm leading-snug transition-colors ${
                    isOpen ? "text-tashtep-orange" : "text-obsidian"
                  }`}
                >
                  {item.question}
                </span>
                <span
                  className={`material-symbols-outlined flex-shrink-0 text-[20px] transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-tashtep-orange" : "text-secondary"
                  }`}
                >
                  expand_more
                </span>
              </button>

              {/* Animated answer panel using grid trick */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-5 border-t border-stone/50">
                    <p className="pt-4 text-body-md text-secondary leading-relaxed">{item.answer}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
