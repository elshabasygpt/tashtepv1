"use server";

import { z } from "zod";
import { protectedAction } from "@/lib/safe-action";
import { WishlistService } from "@/services/wishlist.service";
import { revalidatePath } from "next/cache";

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
