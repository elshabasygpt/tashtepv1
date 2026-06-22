import { useState, useCallback, useEffect } from "react";
import type { CartItemType } from "@/features/cart";

// This is a global hook that uses localStorage for guest users.
// In a full implementation, you would sync this with CartService for logged-in users.
export function useCart() {
  const [items, setItems] = useState<CartItemType[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("tashtep-cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to local storage when items change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("tashtep-cart", JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const addItem = useCallback((item: CartItemType) => {
    setItems((current) => {
      const existing = current.find((i) => i.id === item.id);
      if (existing) {
        return current.map((i) => 
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...current, item];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((current) => 
      current.map((i) => i.id === id ? { ...i, quantity } : i)
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  return {
    items,
    isOpen,
    setIsOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total: items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
    count: items.reduce((acc, item) => acc + item.quantity, 0),
  };
}
