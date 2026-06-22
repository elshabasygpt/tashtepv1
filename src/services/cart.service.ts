import { prisma } from "@/lib/prisma";
import { DatabaseError } from "@/lib/errors";

export interface CartSyncDTO {
  userId: string;
  items: Array<{
    productId: string;
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
        await prisma.cartItem.upsert({
          where: {
            cartId_productId: {
              cartId: cart.id,
              productId: item.productId,
            },
          },
          create: {
            cartId: cart.id,
            productId: item.productId,
            quantity: item.quantity,
          },
          update: {
            quantity: item.quantity,
          },
        });
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
              }
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
