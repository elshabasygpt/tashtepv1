"use client";

import React, { useState, useEffect, useRef } from "react";
import { algoliasearch } from "algoliasearch";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "MOCK";
const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || "MOCK";
const isMock = appId === "MOCK";

// Initialize Algolia client (only if real keys provided)
const client = isMock ? null : algoliasearch(appId, searchKey);
const INDEX_NAME = "tashtep_products";

export function AlgoliaSearchBox({ isMobile = false }: { isMobile?: boolean }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ objectID: string; name?: string; image?: string; price?: number; category?: string }[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search logic
  useEffect(() => {
    const searchAlgolia = async () => {
      if (!query.trim()) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      if (isMock || !client) {
        // Fallback or do nothing if no Algolia key
        return;
      }

      setIsLoading(true);
      try {
        const responses = await client.search({
          requests: [
            {
              indexName: INDEX_NAME,
              query: query,
              hitsPerPage: 5,
            }
          ]
        });
        
        const hits = (responses.results[0] as { hits?: { objectID: string; name?: string; image?: string; price?: number; category?: string }[] })?.hits || [];
        setResults(hits);
        setIsOpen(true);
      } catch (error) {
        console.error("Algolia search error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(searchAlgolia, 300); // Debounce
    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/products?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="relative group w-full">
        <div className="absolute inset-y-0 right-0 pl-3 flex items-center pointer-events-none pr-4">
          <span className="material-symbols-outlined text-tertiary-container group-focus-within:text-obsidian transition-colors duration-200" style={{ fontSize: '20px' }}>search</span>
        </div>
        <input
          className={`block w-full border-soft-border bg-stone pl-4 pr-12 text-editorial-text focus:border-tashtep-orange focus:bg-white focus:ring-0 text-sm font-label-md transition-all duration-300 ease-in-out placeholder:text-tertiary-container shadow-sm outline-none ${
            isMobile ? "rounded-full py-2" : "rounded-xl h-[48px]"
          }`}
          dir="rtl"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0) setIsOpen(true) }}
          placeholder="ابحث عن دهان، معجون، ماركة..."
          type="search"
          autoComplete="off"
        />
        {isLoading && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Loader2 className="w-4 h-4 text-tertiary-container animate-spin" />
          </div>
        )}
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && results.length > 0 && !isMock && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-soft-border z-50 overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            {results.map((hit) => (
              <Link
                key={hit.objectID}
                href={`/products/${hit.objectID}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 hover:bg-stone/30 transition-colors border-b border-soft-border last:border-0"
              >
                <div className="w-12 h-12 relative flex-shrink-0 bg-stone/50 rounded overflow-hidden">
                  {hit.image ? (
                    <Image src={hit.image} alt={hit.name ?? ""} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary text-sm">image</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="font-headline-md text-sm text-obsidian truncate">{hit.name}</span>
                  <span className="font-label-md text-xs text-secondary truncate">{hit.category}</span>
                </div>
                <div className="mr-auto font-headline-md text-sm text-tashtep-orange whitespace-nowrap">
                  {hit.price} ج.م
                </div>
              </Link>
            ))}
          </div>
          <div className="p-2 border-t border-soft-border bg-stone/20 text-center">
            <Link 
              href={`/products?q=${encodeURIComponent(query)}`}
              onClick={() => setIsOpen(false)}
              className="text-xs font-label-md text-tashtep-orange hover:underline"
            >
              عرض كل النتائج
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
