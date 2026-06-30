import { prisma } from "@/lib/prisma";
import { DatabaseError } from "@/lib/errors";
import { randomBytes } from "crypto";

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
      return await prisma.$transaction(async (tx) => {
        const wishlist = await tx.wishlist.upsert({
          where: { userId },
          create: { userId },
          update: {},
        });

        const existingItem = await tx.wishlistItem.findUnique({
          where: {
            wishlistId_productId: {
              wishlistId: wishlist.id,
              productId,
            },
          },
        });

        if (existingItem) {
          await tx.wishlistItem.delete({ where: { id: existingItem.id } });
          return { isAdded: false };
        } else {
          await tx.wishlistItem.create({
            data: { wishlistId: wishlist.id, productId },
          });
          return { isAdded: true };
        }
      });
    } catch {
      throw new DatabaseError("Failed to toggle wishlist item");
    }
  },

  async generateShareToken(userId: string): Promise<string> {
    try {
      const token = randomBytes(16).toString("hex");
      await prisma.wishlist.upsert({
        where: { userId },
        create: { userId, shareToken: token },
        update: { shareToken: token },
      });
      return token;
    } catch {
      throw new DatabaseError("Failed to generate share token");
    }
  },

  async getWishlistShareToken(userId: string): Promise<string | null> {
    try {
      const wishlist = await prisma.wishlist.findUnique({
        where: { userId },
        select: { shareToken: true },
      });
      return wishlist?.shareToken ?? null;
    } catch {
      return null;
    }
  },
};
