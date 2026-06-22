import { prisma } from "@/lib/prisma";
import { DatabaseError, UnauthorizedError } from "@/lib/errors";
import { PaymobService } from "@/lib/paymob";

export interface CheckoutRequest {
  userId?: string;
  shippingDetails: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
  };
  cartItems: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  paymentMethod: "cod" | "card";
}

export interface CheckoutResult {
  success: boolean;
  orderId?: string;
  paymentUrl?: string; // If using Paymob/Fawry
  message?: string;
}

export const CheckoutService = {
  /**
   * Process a complete order checkout.
   * Handles total calculation, order creation in DB, and cart clearing securely via Transactions.
   */
  async processCheckout(data: CheckoutRequest): Promise<CheckoutResult> {
    if (!data.userId) {
      throw new UnauthorizedError("User must be logged in to checkout.");
    }

    try {
      const subtotal = data.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      const shipping = 50;
      const totalAmount = subtotal + shipping;

      const user = await prisma.user.findUnique({
        where: { id: data.userId },
        select: { email: true }
      });

      if (!user?.email) {
        throw new DatabaseError("User email not found");
      }

      // Process inside a Prisma Transaction to guarantee atomicity
      const order = await prisma.$transaction(async (tx) => {
        // 1. Create the Order
        const newOrder = await tx.order.create({
          data: {
            userId: data.userId!,
            totalAmount,
            shippingCost: shipping,
            paymentMethod: data.paymentMethod === "card" ? "CARD" : "COD",
            shippingName: data.shippingDetails.fullName,
            shippingPhone: data.shippingDetails.phone,
            shippingAddress: data.shippingDetails.address,
            shippingCity: data.shippingDetails.city,
            items: {
              create: data.cartItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
              })),
            },
          },
        });

        // 2. Clear the user's cart
        const cart = await tx.cart.findUnique({ where: { userId: data.userId! } });
        if (cart) {
          await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
        }

        return newOrder;
      });

      if (data.paymentMethod === "card") {
        const billingData = {
          apartment: "NA",
          email: user.email,
          floor: "NA",
          first_name: data.shippingDetails.fullName.split(" ")[0] || "User",
          street: data.shippingDetails.address,
          building: "NA",
          phone_number: data.shippingDetails.phone,
          shipping_method: "NA",
          postal_code: "NA",
          city: data.shippingDetails.city,
          country: "EG",
          last_name: data.shippingDetails.fullName.split(" ").slice(1).join(" ") || "Name",
          state: data.shippingDetails.city,
        };

        const paymentUrl = await PaymobService.generateIframeUrl(totalAmount, order.id, billingData);

        return {
          success: true,
          orderId: order.id,
          paymentUrl,
        };
      }

      return {
        success: true,
        orderId: order.id,
        message: "تم استلام طلبك بنجاح. الدفع عند الاستلام.",
      };

    } catch {
      throw new DatabaseError("Failed to process checkout transaction");
    }
  }
};
