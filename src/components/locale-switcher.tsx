"use client";

import { useLocale } from "@/i18n/provider";
import { localeLabels, locales } from "@/i18n/config";

export function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();

  const next = locales.find(l => l !== locale) ?? locales[0];

  return (
    <button
      onClick={() => setLocale(next)}
      className="flex items-center gap-1.5 text-sm font-medium text-secondary hover:text-obsidian transition-colors px-2 py-1 rounded-lg hover:bg-stone/50"
      title={`Switch to ${localeLabels[next]}`}
      aria-label={`Switch language to ${localeLabels[next]}`}
    >
      <span className="material-symbols-outlined text-[18px]">language</span>
      <span className="hidden sm:inline">{localeLabels[next]}</span>
    </button>
  );
}
