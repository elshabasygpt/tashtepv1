"use server";

import { z } from "zod";
import { protectedAction } from "@/lib/safe-action";
import { WishlistService } from "@/services/wishlist.service";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const toggleWishlistSchema = z.object({
  productId: z.string().min(1),
});

export const toggleWishlistAction = protectedAction(
  toggleWishlistSchema,
  async (parsedInput, user) => {
    const result = await WishlistService.toggleWishlistItem(user.id, parsedInput.productId);
    revalidatePath("/wishlist");
    return { success: true, isAdded: result.isAdded, message: result.isAdded ? "تمت الإضافة إلى المفضلة" : "تمت الإزالة من المفضلة" };
  }
);

export const getWishlistIdsAction = protectedAction(
  z.object({}),
  async (_input, user) => {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: user.id },
      select: { items: { select: { productId: true } } },
    });
    return wishlist?.items.map((i) => i.productId) ?? [];
  }
);

export const generateWishlistShareLinkAction = protectedAction(
  z.object({}),
  async (_input, user) => {
    const token = await WishlistService.generateShareToken(user.id);
    revalidatePath("/wishlist");
    return { success: true, token };
  }
);
