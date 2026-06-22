import { useState, useCallback, useEffect } from "react";

export function useWishlist() {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem("tashtep-wishlist");
    if (savedWishlist) {
      try {
        setWishlistIds(JSON.parse(savedWishlist));
      } catch (e) {
        console.error("Failed to parse wishlist", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to local storage when items change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("tashtep-wishlist", JSON.stringify(wishlistIds));
    }
  }, [wishlistIds, isInitialized]);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlistIds((current) => {
      if (current.includes(productId)) {
        return current.filter(id => id !== productId);
      } else {
        return [...current, productId];
      }
    });
  }, []);

  const isWishlisted = useCallback((productId: string) => {
    return wishlistIds.includes(productId);
  }, [wishlistIds]);

  const clearWishlist = useCallback(() => {
    setWishlistIds([]);
  }, []);

  return {
    wishlistIds,
    toggleWishlist,
    isWishlisted,
    clearWishlist,
    count: wishlistIds.length,
  };
}
