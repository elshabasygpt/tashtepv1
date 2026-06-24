"use server";

import { z } from "zod";
import { protectedAction } from "@/lib/safe-action";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const addToCartSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1).optional(),
  quantity: z.number().int().positive().default(1),
});

export const addToCartAction = protectedAction(
  addToCartSchema,
  async (parsedInput, user) => {
    const cart = await prisma.cart.upsert({
      where: { userId: user.id },
      create: { userId: user.id },
      update: {},
    });

    const variantId = parsedInput.variantId ?? null;

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: parsedInput.productId,
        variantId,
      },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + (parsedInput.quantity ?? 1) },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: parsedInput.productId,
          variantId,
          quantity: parsedInput.quantity ?? 1,
        },
      });
    }

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
  async (parsedInput) => {
    await prisma.cartItem.update({
      where: { id: parsedInput.itemId },
      data: { quantity: parsedInput.quantity },
    });
    revalidatePath("/cart");
    return { success: true };
  }
);

const removeCartItemSchema = z.object({
  itemId: z.string().min(1),
});

export const removeCartItemAction = protectedAction(
  removeCartItemSchema,
  async (parsedInput) => {
    await prisma.cartItem.delete({
      where: { id: parsedInput.itemId },
    });
    revalidatePath("/cart");
    return { success: true };
  }
);
