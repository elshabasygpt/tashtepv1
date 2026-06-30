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
      throw new DatabaseError("حدث خطأ أثناء جلب الطلبات.");
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
          user: { select: { name: true, email: true } },
          items: {
            include: { product: { select: { name: true } } }
          },
        },
      });
      if (!order) throw new NotFoundError("الطلب");
      return order;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError("حدث خطأ أثناء جلب بيانات الطلب.");
    }
  },

  /**
   * Update the payment status of an order (used by Webhooks)
   */
  async updatePaymentStatus(orderId: string, status: "PENDING" | "PAID" | "FAILED" | "REFUNDED"): Promise<void> {
    try {
      // Never downgrade a confirmed PAID order — PAID is a terminal state.
      // Using updateMany with a conditional WHERE makes this idempotent:
      // duplicate webhook deliveries simply update 0 rows without error.
      await prisma.order.updateMany({
        where: { id: orderId, paymentStatus: { not: "PAID" } },
        data: { paymentStatus: status },
      });
    } catch {
      throw new DatabaseError("حدث خطأ أثناء تحديث حالة الدفع.");
    }
  },

  /**
   * Admin: Fetch all orders with optional filters
   */
  async getAllOrders(options?: ProductFilterOptions & { status?: string; search?: string }): Promise<unknown[]> {
    try {
      const take = options?.limit || 50;
      const skip = options?.page ? (options.page - 1) * take : 0;
      const where: Record<string, unknown> = {};
      if (options?.status) where.status = options.status;
      if (options?.search) {
        where.OR = [
          { shippingName: { contains: options.search } },
          { id: { contains: options.search } },
        ];
      }
      return await prisma.order.findMany({
        where,
        take,
        skip,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          items: { include: { product: { select: { name: true, price: true } } } }
        }
      });
    } catch {
      throw new DatabaseError("حدث خطأ أثناء جلب قائمة الطلبات.");
    }
  },

  /**
   * Admin: Update order
   */
  async updateOrder(orderId: string, data: Record<string, unknown>) {
    try {
      return await prisma.order.update({
        where: { id: orderId },
        data,
        include: { user: { select: { email: true, name: true } } },
      });
    } catch {
      throw new DatabaseError("حدث خطأ أثناء تحديث الطلب.");
    }
  },

  /**
   * User: Cancel their own PENDING order
   */
  async cancelOrder(orderId: string, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: { status: true, userId: true },
      });

      if (!order) return { success: false, error: "الطلب غير موجود" };
      if (order.userId !== userId) return { success: false, error: "غير مصرح" };
      if (order.status !== "PENDING") {
        return { success: false, error: "لا يمكن إلغاء الطلب بعد بدء تجهيزه" };
      }

      await prisma.order.update({
        where: { id: orderId },
        data: { status: "CANCELLED" },
      });

      return { success: true };
    } catch {
      throw new DatabaseError("حدث خطأ أثناء إلغاء الطلب.");
    }
  },

  /**
   * Admin: Count all orders (for pagination)
   */
  async getOrdersCount(filters?: { status?: string; search?: string }): Promise<number> {
    try {
      const where: Record<string, unknown> = {};
      if (filters?.status) where.status = filters.status;
      if (filters?.search) {
        where.OR = [
          { shippingName: { contains: filters.search } },
          { id: { contains: filters.search } },
        ];
      }
      return await prisma.order.count({ where });
    } catch {
      throw new DatabaseError("حدث خطأ أثناء احتساب الطلبات.");
    }
  },
};
