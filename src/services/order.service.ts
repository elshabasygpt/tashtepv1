import { prisma } from "@/lib/prisma";
import { DatabaseError, NotFoundError } from "@/lib/errors";
import { type ProductFilterOptions } from "./product.service";

export const OrderService = {
  /**
   * Fetch orders belonging to a specific user with pagination
   */
  async getUserOrders(userId: string, options?: ProductFilterOptions): Promise<unknown[]> {
    try {
      const take = options?.limit || 10;
      const skip = options?.page ? (options.page - 1) * take : 0;
      const orderBy = options?.orderBy || { createdAt: "desc" };

      return await prisma.order.findMany({
        where: { userId },
        take,
        skip,
        orderBy,
        include: {
          items: {
            include: { product: true }
          }
        }
      });
    } catch {
      throw new DatabaseError("Failed to fetch user orders");
    }
  },

  /**
   * Fetch a specific order by ID
   */
  async getOrderById(orderId: string): Promise<unknown | null> {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: { product: true }
          }
        }
      });
      if (!order) throw new NotFoundError("الطلب");
      return order;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError("Failed to fetch order by id");
    }
  },

  /**
   * Update the payment status of an order (used by Webhooks)
   */
  async updatePaymentStatus(orderId: string, status: "PENDING" | "PAID" | "FAILED" | "REFUNDED"): Promise<void> {
    try {
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: status }
      });
    } catch {
      throw new DatabaseError("Failed to update payment status");
    }
  },

  /**
   * Admin: Fetch all orders
   */
  async getAllOrders(options?: ProductFilterOptions): Promise<unknown[]> {
    try {
      const take = options?.limit || 50;
      const skip = options?.page ? (options.page - 1) * take : 0;
      return await prisma.order.findMany({
        take,
        skip,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          items: { include: { product: { select: { name: true, price: true } } } }
        }
      });
    } catch {
      throw new DatabaseError("Failed to fetch all orders");
    }
  },

  /**
   * Admin: Update order
   */
  async updateOrder(orderId: string, data: Record<string, unknown>): Promise<unknown> {
    try {
      return await prisma.order.update({
        where: { id: orderId },
        data,
      });
    } catch {
      throw new DatabaseError("Failed to update order");
    }
  }
};
