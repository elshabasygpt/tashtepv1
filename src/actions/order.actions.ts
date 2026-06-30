"use server";

import { z } from "zod";
import { protectedAction } from "@/lib/safe-action";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const cancelOrderSchema = z.object({
  orderId: z.string().min(1),
});

export const cancelOrderAction = protectedAction(
  cancelOrderSchema,
  async (parsedInput, user) => {
    const { orderId } = parsedInput;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error("الطلب غير موجود");
    }

    if (order.userId !== user.id) {
      throw new Error("غير مصرح لك بإلغاء هذا الطلب");
    }

    if (order.status !== "PENDING") {
      throw new Error("لا يمكن إلغاء الطلب لأنه لم يعد قيد الانتظار");
    }

    // Atomically update order and refund coupon if exists
    await prisma.$transaction(async (tx) => {
      // Cancel the order
      await tx.order.update({
        where: { id: orderId },
        data: { status: "CANCELLED" },
      });

      // Restore coupon usage if applicable
      if (order.couponCode) {
        await tx.coupon.update({
          where: { code: order.couponCode },
          data: { usedCount: { decrement: 1 } },
        });
      }
    });

    revalidatePath(`/account/orders`);
    revalidatePath(`/account/orders/${orderId}`);
    revalidatePath(`/admin/orders`);

    return { success: true };
  }
);
