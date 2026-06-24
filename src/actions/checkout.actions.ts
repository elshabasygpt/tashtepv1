"use server";

import { z } from "zod";
import { CheckoutService } from "@/services/checkout.service";
import { revalidatePath } from "next/cache";
import { protectedAction } from "@/lib/safe-action";
import { rateLimiter } from "@/lib/rate-limit";
import { headers } from "next/headers";

// Zod Schema matching the CheckoutRequest structure
const checkoutSchema = z.object({
  shippingDetails: z.object({
    fullName: z.string().min(3, "الاسم الكامل مطلوب"),
    phone: z.string().min(10, "رقم الهاتف غير صحيح"),
    address: z.string().min(5, "العنوان التفصيلي مطلوب"),
    city: z.string().min(2, "اسم المدينة مطلوب"),
  }),
  cartItems: z.array(
    z.object({
      productId: z.string().min(1),
      variantId: z.string().min(1).optional(),
      quantity: z.number().int().positive(),
      price: z.number().nonnegative(),
    })
  ).min(1, "عربة التسوق فارغة"),
  paymentMethod: z.enum(["cod", "card"]),
});

/**
 * Server Action to process checkout.
 * Security: PROTECTED (Requires active session).
 * Validation: Strict ZOD schema validation.
 */
export const processCheckoutAction = protectedAction(
  checkoutSchema,
  async (parsedData, user) => {
    // Rate Limiting (20 requests / minute)
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    const rateLimitResult = await rateLimiter.limit(`checkout:${ip}`, { maxRequests: 20, windowMs: 60 * 1000 });
    
    if (!rateLimitResult.success) {
      throw new Error("عذراً، تجاوزت الحد المسموح به من الطلبات. يرجى الانتظار قليلاً.");
    }

    // Securely inject the user ID from the verified session
    const requestPayload = {
      ...parsedData,
      userId: user.id,
    };

    const result = await CheckoutService.processCheckout(requestPayload);

    if (result.success) {
      revalidatePath("/account/orders");
    }

    return result;
  }
);
