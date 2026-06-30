"use client";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

const KEY = "tashtep-wishlist";

function _read(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

let _ids: string[] = typeof window !== "undefined" ? _read() : [];
const _subscribers = new Set<() => void>();

function _notify() { _subscribers.forEach((fn) => fn()); }

function _write(next: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    toast.error("تعذّر حفظ المفضلة");
    return;
  }
  _ids = next;
  _notify();
}

export function wishlistToggle(productId: string) {
  if (_ids.includes(productId)) {
    _write(_ids.filter((id) => id !== productId));
  } else {
    _write([..._ids, productId]);
  }
}

export function wishlistClear() { _write([]); }

export function wishlistSync(ids: string[]) { _write(ids); }

export function useWishlist() {
  const [, rerender] = useState(0);

  useEffect(() => {
    const trigger = () => rerender((n) => n + 1);
    _subscribers.add(trigger);

    // Sync when another tab writes to localStorage
    function onStorage(e: StorageEvent) {
      if (e.key === KEY) { _ids = _read(); _notify(); }
    }
    window.addEventListener("storage", onStorage);

    return () => {
      _subscribers.delete(trigger);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const isWishlisted = useCallback((productId: string) => _ids.includes(productId), []);

  return {
    wishlistIds: _ids,
    toggleWishlist: wishlistToggle,
    isWishlisted,
    clearWishlist: wishlistClear,
    count: _ids.length,
  };
}
