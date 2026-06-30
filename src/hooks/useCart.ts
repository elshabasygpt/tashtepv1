"use client";

import { useSyncExternalStore } from "react";
import type { CartItemType } from "@/features/cart";
export { guestCartItemId, parseCartItemId } from "@/lib/cart-utils";

const STORAGE_KEY = "tashtep-guest-cart";

let items: CartItemType[] = [];
let isOpen = false;
let isHydrated = false;
let storageListenerRegistered = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Safari private browsing or quota exceeded — silently skip persistence
  }
}

function hydrate() {
  if (isHydrated || typeof window === "undefined") return;
  isHydrated = true;
  try {
    let saved = window.localStorage.getItem(STORAGE_KEY);
    // One-time migration from the previous key used before v1.2
    if (!saved) {
      const legacy = window.localStorage.getItem("tashtep-cart");
      if (legacy) {
        saved = legacy;
        window.localStorage.setItem(STORAGE_KEY, legacy);
        window.localStorage.removeItem("tashtep-cart");
      }
    }
    if (saved) items = JSON.parse(saved);
  } catch {
    items = [];
  }
}

function subscribe(listener: () => void) {
  hydrate();
  if (!storageListenerRegistered && typeof window !== "undefined") {
    storageListenerRegistered = true;
    window.addEventListener("storage", (e) => {
      if (e.key === null) { items = []; emit(); return; } // localStorage.clear() in another tab
      if (e.key !== STORAGE_KEY) return;
      try {
        items = e.newValue ? JSON.parse(e.newValue) : [];
      } catch {
        items = [];
      }
      emit();
    });
  }
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getItemsSnapshot() {
  hydrate();
  return items;
}

function getIsOpenSnapshot() {
  return isOpen;
}

function getIsHydratedSnapshot() {
  return isHydrated;
}

const SERVER_ITEMS: CartItemType[] = [];
function getServerItemsSnapshot() { return SERVER_ITEMS; }
function getServerOpenSnapshot() { return false; }
function getServerHydratedSnapshot() { return false; }

function setIsOpen(value: boolean) {
  isOpen = value;
  emit();
}

function addItem(item: CartItemType) {
  const existing = items.find((i) => i.id === item.id);
  items = existing
    ? items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i))
    : [...items, item];
  isOpen = true;
  persist();
  emit();
}

function removeItem(id: string) {
  items = items.filter((i) => i.id !== id);
  persist();
  emit();
}

function updateQuantity(id: string, quantity: number) {
  items = items.map((i) => (i.id === id ? { ...i, quantity } : i));
  persist();
  emit();
}

function clearCart() {
  items = [];
  persist();
  emit();
}

/**
 * Shared guest-cart store (localStorage-backed) used for unauthenticated visitors.
 * All components calling this hook read/write the same in-memory state via
 * useSyncExternalStore, so the header badge, drawer, and cart page stay in sync.
 */
export function useCart() {
  const cartItems = useSyncExternalStore(subscribe, getItemsSnapshot, getServerItemsSnapshot);
  const open = useSyncExternalStore(subscribe, getIsOpenSnapshot, getServerOpenSnapshot);
  const hydrated = useSyncExternalStore(subscribe, getIsHydratedSnapshot, getServerHydratedSnapshot);

  return {
    items: cartItems,
    isOpen: open,
    isHydrated: hydrated,
    setIsOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    count: cartItems.reduce((acc, item) => acc + item.quantity, 0),
  };
}
