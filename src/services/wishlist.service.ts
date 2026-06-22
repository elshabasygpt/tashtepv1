import { prisma } from "@/lib/prisma";
import { DatabaseError } from "@/lib/errors";

export const WishlistService = {
  /**
   * Fetch the saved wishlist for a user
   */
  async getUserWishlist(userId: string): Promise<unknown> {
    try {
      const wishlist = await prisma.wishlist.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                include: { images: true }
              }
            }
          }
        }
      });
      return wishlist || { items: [] };
    } catch {
      throw new DatabaseError("Failed to fetch user wishlist");
    }
  },

  /**
   * Toggle a product in the wishlist (Add if not exists, Remove if exists)
   */
  async toggleWishlistItem(userId: string, productId: string): Promise<{ isAdded: boolean }> {
    try {
      const wishlist = await prisma.wishlist.upsert({
        where: { userId },
        create: { userId },
        update: {},
      });

      const existingItem = await prisma.wishlistItem.findUnique({
        where: {
          wishlistId_productId: {
            wishlistId: wishlist.id,
            productId,
          }
        }
      });

      if (existingItem) {
        await prisma.wishlistItem.delete({
          where: { id: existingItem.id }
        });
        return { isAdded: false };
      } else {
        await prisma.wishlistItem.create({
          data: {
            wishlistId: wishlist.id,
            productId,
          }
        });
        return { isAdded: true };
      }
    } catch {
      throw new DatabaseError("Failed to toggle wishlist item");
    }
  }
};
