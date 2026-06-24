import { prisma } from "@/lib/prisma";
import { DatabaseError } from "@/lib/errors";

export interface CartSyncDTO {
  userId: string;
  items: Array<{
    productId: string;
    variantId?: string | null;
    quantity: number;
  }>;
}

export const CartService = {
  /**
   * Synchronize local guest cart with the database once the user logs in.
   */
  async syncCart(data: CartSyncDTO): Promise<void> {
    try {
      const cart = await prisma.cart.upsert({
        where: { userId: data.userId },
        create: { userId: data.userId },
        update: {},
      });

      for (const item of data.items) {
        const variantId = item.variantId ?? null;
        const existing = await prisma.cartItem.findFirst({
          where: { cartId: cart.id, productId: item.productId, variantId },
        });

        if (existing) {
          await prisma.cartItem.update({
            where: { id: existing.id },
            data: { quantity: item.quantity },
          });
        } else {
          await prisma.cartItem.create({
            data: {
              cartId: cart.id,
              productId: item.productId,
              variantId,
              quantity: item.quantity,
            },
          });
        }
      }
    } catch {
      throw new DatabaseError("Failed to sync cart");
    }
  },

  /**
   * Fetch the saved cart for a specific user from the database.
   */
  async getUserCart(userId: string): Promise<unknown> {
    try {
      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                include: { images: true }
              },
              variant: true,
            }
          }
        }
      });
      return cart || { items: [] };
    } catch {
      throw new DatabaseError("Failed to fetch user cart");
    }
  },

  /**
   * Clear the user's cart after successful checkout.
   */
  async clearUserCart(userId: string): Promise<void> {
    try {
      const cart = await prisma.cart.findUnique({ where: { userId } });
      if (cart) {
        await prisma.cartItem.deleteMany({
          where: { cartId: cart.id },
        });
      }
    } catch {
      throw new DatabaseError("Failed to clear user cart");
    }
  }
};
