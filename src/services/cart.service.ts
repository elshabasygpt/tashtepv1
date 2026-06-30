import { prisma } from "@/lib/prisma";
import { DatabaseError } from "@/lib/errors";
import { Redis } from "@upstash/redis";

export interface CartItemDTO {
  productId: string;
  variantId?: string | null;
  quantity: number;
}

export interface CartSyncDTO {
  userId: string;
  items: CartItemDTO[];
}

const redisUrl = process.env.UPSTASH_REDIS_REST_URL || "MOCK";
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || "MOCK";
const isMock = redisUrl === "MOCK";

const redis = isMock ? null : new Redis({
  url: redisUrl,
  token: redisToken,
});

// In-memory fallback if Redis is not configured
const mockCartStore = new Map<string, string>();

const getRedisCart = async (key: string): Promise<CartItemDTO[]> => {
  if (isMock) {
    const data = mockCartStore.get(key);
    return data ? JSON.parse(data) : [];
  }
  return await redis?.get<CartItemDTO[]>(key) || [];
};

const setRedisCart = async (key: string, items: CartItemDTO[]) => {
  if (isMock) {
    mockCartStore.set(key, JSON.stringify(items));
    return;
  }
  // Expiry in 7 days
  await redis?.set(key, items, { ex: 60 * 60 * 24 * 7 });
};

const deleteRedisCart = async (key: string) => {
  if (isMock) {
    mockCartStore.delete(key);
    return;
  }
  await redis?.del(key);
};

export const CartService = {
  /**
   * Synchronize local guest cart with Redis once the user logs in.
   */
  async syncCart(data: CartSyncDTO): Promise<void> {
    try {
      const key = `cart:${data.userId}`;
      const existingItems = await getRedisCart(key);
      
      const newItems = [...existingItems];
      
      for (const item of data.items) {
        const variantId = item.variantId ?? null;
        const existingIndex = newItems.findIndex(i => i.productId === item.productId && (i.variantId ?? null) === variantId);
        
        if (existingIndex > -1) {
          // Guest cart wins: the user's last active session is the ground truth.
          // This preserves intentional quantity reductions made while browsing as a guest.
          newItems[existingIndex].quantity = item.quantity;
        } else {
          newItems.push({
            productId: item.productId,
            variantId,
            quantity: item.quantity,
          });
        }
      }

      await setRedisCart(key, newItems);
    } catch {
      throw new DatabaseError("Failed to sync cart to Redis");
    }
  },

  /**
   * Fetch the saved cart for a specific user from Redis and hydrate with Database.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getUserCart(userId: string): Promise<any> {
    try {
      const key = `cart:${userId}`;
      const items = await getRedisCart(key);
      
      if (items.length === 0) return { items: [] };

      // Hydrate with DB products
      const productIds = items.map(i => i.productId);
      const variantIds = items.map(i => i.variantId).filter((id): id is string => Boolean(id));

      const [products, variants] = await Promise.all([
        prisma.product.findMany({ 
          where: { id: { in: productIds } },
          include: { images: true }
        }),
        variantIds.length > 0 ? prisma.productVariant.findMany({ where: { id: { in: variantIds } } }) : []
      ]);

      const productMap = new Map(products.map(p => [p.id, p]));
      const variantMap = new Map(variants.map(v => [v.id, v]));

      const hydratedItems = items.map((item) => {
        const product = productMap.get(item.productId);
        const variant = item.variantId ? variantMap.get(item.variantId) : null;

        if (!product) return null; // Product might have been deleted

        return {
          id: `${item.productId}::${item.variantId || 'default'}`,
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          product,
          variant,
        };
      }).filter(Boolean);

      return { items: hydratedItems };
    } catch {
      throw new DatabaseError("Failed to fetch user cart from Redis");
    }
  },

  /**
   * Add a single item to the user's cart
   */
  async addToCart(userId: string, productId: string, variantId: string | null, quantity: number): Promise<void> {
    try {
      const key = `cart:${userId}`;
      const items = await getRedisCart(key);
      const newItems = [...items];
      
      const existingIndex = newItems.findIndex(i => i.productId === productId && (i.variantId ?? null) === variantId);
      if (existingIndex > -1) {
        newItems[existingIndex].quantity += quantity;
      } else {
        newItems.push({ productId, variantId, quantity });
      }

      await setRedisCart(key, newItems);
    } catch {
      throw new DatabaseError("Failed to add item to Redis cart");
    }
  },

  /**
   * Update quantity of a cart item identified by (productId, variantId) — content-addressed,
   * not positional, so concurrent mutations in other tabs cannot corrupt the wrong item.
   */
  async updateCartItem(userId: string, productId: string, variantId: string | null, quantity: number): Promise<boolean> {
    try {
      const key = `cart:${userId}`;
      const items = await getRedisCart(key);
      const idx = items.findIndex(i => i.productId === productId && (i.variantId ?? null) === variantId);
      if (idx > -1) {
        items[idx] = { ...items[idx], quantity };
        await setRedisCart(key, items);
        return true;
      }
      return false;
    } catch {
      throw new DatabaseError("Failed to update Redis cart item");
    }
  },

  /**
   * Remove an item from the cart identified by (productId, variantId).
   */
  async removeCartItem(userId: string, productId: string, variantId: string | null): Promise<boolean> {
    try {
      const key = `cart:${userId}`;
      const items = await getRedisCart(key);
      const filtered = items.filter(i => !(i.productId === productId && (i.variantId ?? null) === variantId));
      if (filtered.length !== items.length) {
        await setRedisCart(key, filtered);
        return true;
      }
      return false;
    } catch {
      throw new DatabaseError("Failed to remove Redis cart item");
    }
  },

  /**
   * Get the total item quantity count for a user's cart (lightweight, no DB hydration).
   */
  async getCartCount(userId: string): Promise<number> {
    try {
      const key = `cart:${userId}`;
      const items = await getRedisCart(key);
      return items.reduce((sum, item) => sum + item.quantity, 0);
    } catch {
      return 0;
    }
  },

  /**
   * Clear the user's cart after successful checkout.
   */
  async clearUserCart(userId: string): Promise<void> {
    try {
      const key = `cart:${userId}`;
      await deleteRedisCart(key);
    } catch {
      throw new DatabaseError("Failed to clear user cart in Redis");
    }
  }
};
