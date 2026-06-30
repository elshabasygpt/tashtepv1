export function guestCartItemId(productId: string, variantId?: string | null) {
  return `${productId}::${variantId || "default"}`;
}

export function parseCartItemId(itemId: string): { productId: string; variantId: string | null } {
  const sep = itemId.indexOf("::");
  const productId = sep === -1 ? itemId : itemId.slice(0, sep);
  const raw = sep === -1 ? undefined : itemId.slice(sep + 2);
  return { productId, variantId: raw && raw !== "default" ? raw : null };
}
