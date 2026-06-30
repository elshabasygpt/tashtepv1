"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

type CompareItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
};

const KEY = "tashtep_compare";
const MAX = 3;

// ── Module-level singleton store ─────────────────────────────────────────────
// All useCompare() instances share one state object, eliminating N listeners.

function _read(): CompareItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Hydrate immediately on module load (client-side only) so the first render
// already has the correct state — no flash / layout shift on page load.
let _items: CompareItem[] = typeof window !== "undefined" ? _read() : [];
const _subscribers = new Set<() => void>();

function _notify() {
  _subscribers.forEach((fn) => fn());
}

function _write(next: CompareItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    toast.error("تعذّر حفظ قائمة المقارنة");
    return;
  }
  _items = next;
  _notify();
}

// ── Public API (called outside React) ────────────────────────────────────────

export function compareAdd(item: CompareItem) {
  if (_items.find((p) => p.id === item.id)) return;
  if (_items.length >= MAX) {
    toast.error("يمكنك مقارنة 3 منتجات كحد أقصى", { position: "bottom-center" });
    return;
  }
  const next = [..._items, item];
  _write(next);
  if (next.length === MAX) {
    toast.success("اكتملت المقارنة! اضغط 'مقارنة الآن'", { position: "bottom-center" });
  }
}

export function compareRemove(id: string) {
  _write(_items.filter((p) => p.id !== id));
}

export function compareClear() {
  _write([]);
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useCompare() {
  const [, rerender] = useState(0);

  useEffect(() => {
    const trigger = () => rerender((n) => n + 1);
    _subscribers.add(trigger);
    return () => { _subscribers.delete(trigger); };
  }, []);

  const has = useCallback((id: string) => _items.some((p) => p.id === id), []);

  return {
    items: _items,
    add: compareAdd,
    remove: compareRemove,
    clear: compareClear,
    has,
    count: _items.length,
  };
}
