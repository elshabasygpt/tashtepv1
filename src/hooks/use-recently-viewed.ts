"use client";

import { useEffect, useState } from "react";

type RecentProduct = {
  id: string;
  name: string;
  price: number;
  image?: string;
  slug?: string;
};

const KEY = "tashtep_recently_viewed";
const MAX = 6;

export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentProduct[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  function addProduct(product: RecentProduct) {
    setItems(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      const next = [product, ...filtered].slice(0, MAX);
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }

  function clear() {
    setItems([]);
    try { localStorage.removeItem(KEY); } catch {}
  }

  return { items, addProduct, clear };
}
