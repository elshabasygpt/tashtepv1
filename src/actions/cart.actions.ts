"use server";

import { z } from "zod";
import { protectedAction } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import { CartService } from "@/services/cart.service";
import { parseCartItemId } from "@/lib/cart-utils";

const addToCartSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1).optional(),
  quantity: z.number().int().positive().default(1),
});

export const addToCartAction = protectedAction(
  addToCartSchema,
  async (parsedInput, user) => {
    await CartService.addToCart(user.id, parsedInput.productId, parsedInput.variantId ?? null, parsedInput.quantity ?? 1);
    revalidatePath("/cart");
    return { success: true, message: "تمت إضافة المنتج إلى السلة" };
  }
);

const updateCartItemSchema = z.object({
  itemId: z.string().min(1),
  quantity: z.number().int().min(1),
});

export const updateCartItemQuantityAction = protectedAction(
  updateCartItemSchema,
  async (parsedInput, user) => {
    const { productId, variantId } = parseCartItemId(parsedInput.itemId);
    const found = await CartService.updateCartItem(user.id, productId, variantId, parsedInput.quantity);
    revalidatePath("/cart");
    return found ? { success: true } : { success: false, error: "العنصر غير موجود في السلة" };
  }
);

const removeCartItemSchema = z.object({
  itemId: z.string().min(1),
});

export const removeCartItemAction = protectedAction(
  removeCartItemSchema,
  async (parsedInput, user) => {
    const { productId, variantId } = parseCartItemId(parsedInput.itemId);
    const found = await CartService.removeCartItem(user.id, productId, variantId);
    revalidatePath("/cart");
    return found ? { success: true } : { success: false, error: "العنصر غير موجود في السلة" };
  }
);

const syncGuestCartSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      variantId: z.string().min(1).optional(),
      quantity: z.number().int().positive(),
    })
  ),
});

/**
 * Merges the guest (localStorage) cart into the user's Redis cart right after login.
 */
export const syncGuestCartAction = protectedAction(
  syncGuestCartSchema,
  async (parsedInput, user) => {
    await CartService.syncCart({ userId: user.id, items: parsedInput.items });
    revalidatePath("/cart");
    return { success: true };
  }
);
