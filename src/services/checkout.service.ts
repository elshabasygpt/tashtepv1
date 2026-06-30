import { prisma } from "@/lib/prisma";
import { DatabaseError, UnauthorizedError } from "@/lib/errors";
import { PaymobService } from "@/lib/paymob";
import { GovernorateService } from "./governorate.service";
import { CouponService } from "./coupon.service";
import { GiftCardService } from "./giftcard.service";
import { CartService } from "./cart.service";
import { LoyaltyService } from "./loyalty.service";
import { pusherServer } from "@/lib/pusher";
import { EmailService } from "@/lib/email";

export interface CheckoutRequest {
  userId?: string;
  guestEmail?: string;
  shippingDetails: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
  };
  cartItems: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
    price: number;
  }>;
  paymentMethod: "cod" | "card";
  couponCode?: string;
  giftCardCode?: string;
  loyaltyPointsToRedeem?: number;
  customerNotes?: string;
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
    if (!data.userId && !data.guestEmail) {
      throw new UnauthorizedError("يجب تسجيل الدخول أو إدخال بريد إلكتروني لإتمام الطلب.");
    }

    try {
      const productIds = data.cartItems.map(i => i.productId);
      const variantIds = data.cartItems.map((i) => i.variantId).filter((id): id is string => Boolean(id));

      const [products, variants] = await Promise.all([
        prisma.product.findMany({ where: { id: { in: productIds }, isActive: true } }),
        variantIds.length > 0 ? prisma.productVariant.findMany({ where: { id: { in: variantIds } } }) : []
      ]);

      const productMap = new Map(products.map(p => [p.id, p]));
      const variantMap = new Map(variants.map(v => [v.id, v]));

      // Verify and construct validated cart items with accurate pricing
      const validatedCartItems = data.cartItems.map(item => {
        const product = productMap.get(item.productId);
        if (!product) throw new DatabaseError(`المنتج غير موجود أو غير متاح`);
        
        // Use sale price when an active sale window applies
        const now = new Date();
        const isOnSale =
          product.salePrice != null &&
          (product.saleStartAt == null || product.saleStartAt <= now) &&
          (product.saleEndAt == null || product.saleEndAt > now);
        const price = isOnSale ? (product.salePrice as number) : product.price;
        let variantLabel = undefined;
        
        if (item.variantId) {
          const variant = variantMap.get(item.variantId);
          if (!variant || variant.productId !== item.productId) {
            throw new DatabaseError(`الخيار المحدد غير صالح لهذا المنتج`);
          }
          variantLabel = variant.label;
        }

        return {
          productId: item.productId,
          variantId: item.variantId,
          variantLabel,
          quantity: item.quantity,
          price, // Secure DB price
        };
      });

      const subtotal = validatedCartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      const shipping = await GovernorateService.getShippingCost(data.shippingDetails.city);
      
      let discountAmount = 0;
      let validCouponCode: string | null = null;

      if (data.couponCode) {
        const upperCode = data.couponCode.toUpperCase();
        const couponResult = await CouponService.validateCoupon(upperCode, subtotal, data.userId);
        if (couponResult.isValid) {
          discountAmount = couponResult.discountAmount;
          validCouponCode = upperCode;
        }
      }

      const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
      const taxAmount = Number((subtotalAfterDiscount * 0.14).toFixed(2));
      const baseTotal = subtotalAfterDiscount + shipping + taxAmount;

      // Validate gift card
      let giftCardDiscount = 0;
      let validGiftCardCode: string | null = null;
      if (data.giftCardCode) {
        const giftCardResult = await GiftCardService.validate(data.giftCardCode.toUpperCase());
        if (giftCardResult.valid) {
          giftCardDiscount = Math.min(giftCardResult.balance, baseTotal);
          validGiftCardCode = data.giftCardCode.toUpperCase();
        }
      }

      // Validate loyalty points
      let loyaltyDiscount = 0;
      let confirmedLoyaltyPoints = 0;
      const pointsToRedeem = data.loyaltyPointsToRedeem ?? 0;
      if (pointsToRedeem > 0 && data.userId) {
        const balance = await LoyaltyService.getBalance(data.userId);
        const maxRedeemable = LoyaltyService.maxRedeemablePoints(baseTotal - giftCardDiscount);
        confirmedLoyaltyPoints = Math.min(pointsToRedeem, balance, maxRedeemable);
        loyaltyDiscount = LoyaltyService.pointsToCash(confirmedLoyaltyPoints);
      }

      const totalAmount = Math.max(0, baseTotal - giftCardDiscount - loyaltyDiscount);

      let customerEmail = data.guestEmail || null;
      if (data.userId) {
        const user = await prisma.user.findUnique({
          where: { id: data.userId },
          select: { email: true }
        });
        if (!user?.email) {
          throw new DatabaseError("User email not found");
        }
        customerEmail = user.email;
      }

      if (!customerEmail) {
        throw new DatabaseError("Customer email not found");
      }

      // Process inside a Prisma Transaction to guarantee atomicity
      const order = await prisma.$transaction(async (tx) => {
        // 1. Create the Order
        const newOrder = await tx.order.create({
          data: {
            userId: data.userId || undefined,
            guestEmail: data.userId ? undefined : customerEmail,
            totalAmount,
            shippingCost: shipping,
            couponCode: validCouponCode,
            discountAmount: discountAmount,
            taxAmount,
            paymentMethod: data.paymentMethod === "card" ? "CARD" : "COD",
            shippingName: data.shippingDetails.fullName,
            shippingPhone: data.shippingDetails.phone,
            shippingAddress: data.shippingDetails.address,
            shippingCity: data.shippingDetails.city,
            customerNotes: data.customerNotes || null,
            items: {
              create: validatedCartItems.map((item) => ({
                productId: item.productId,
                variantId: item.variantId,
                variantLabel: item.variantLabel,
                quantity: item.quantity,
                price: item.price,
              })),
            },
          },
        });

        // Decrement stock atomically — reject if any item is out of stock or inactive
        for (const item of validatedCartItems) {
          const stockUpdate = await tx.product.updateMany({
            where: { id: item.productId, isActive: true, stock: { gte: item.quantity } },
            data: { stock: { decrement: item.quantity } },
          });
          if (stockUpdate.count === 0) {
            const name = productMap.get(item.productId)?.name ?? item.productId;
            throw new DatabaseError(`"${name}" غير متوفر بالكمية المطلوبة`);
          }
        }

        // Redeem gift card inside the transaction (atomic — prevents TOCTOU race)
        if (validGiftCardCode && giftCardDiscount > 0) {
          const now = new Date();
          const gcUpdate = await tx.giftCard.updateMany({
            where: {
              code: validGiftCardCode,
              balance: { gte: giftCardDiscount },
              isActive: true,
              OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
            },
            data: { balance: { decrement: giftCardDiscount } },
          });
          if (gcUpdate.count === 0) {
            throw new DatabaseError("رصيد كارت الهدية غير كافٍ أو تم استخدامه");
          }
          // Deactivate card if balance is now zero
          await tx.giftCard.updateMany({
            where: { code: validGiftCardCode, balance: { lte: 0 } },
            data: { isActive: false },
          });
        }

        // Redeem loyalty points inside the transaction (atomic — prevents TOCTOU race)
        if (confirmedLoyaltyPoints > 0 && data.userId) {
          const loyaltyUpdate = await tx.user.updateMany({
            where: { id: data.userId, loyaltyPoints: { gte: confirmedLoyaltyPoints } },
            data: { loyaltyPoints: { decrement: confirmedLoyaltyPoints } },
          });
          if (loyaltyUpdate.count === 0) {
            throw new DatabaseError("رصيد نقاط الولاء غير كافٍ");
          }
          const cashValue = LoyaltyService.pointsToCash(confirmedLoyaltyPoints);
          await tx.loyaltyTransaction.create({
            data: {
              userId: data.userId,
              orderId: newOrder.id,
              points: -confirmedLoyaltyPoints,
              type: "REDEEMED",
              description: `استرداد ${cashValue} ج.م`,
            },
          });
        }

        // Increment coupon usage atomically — prevents race where two concurrent checkouts
        // both pass a read-check and both increment past the limit
        if (validCouponCode) {
          const couponRef = await tx.coupon.findUnique({
            where: { code: validCouponCode },
            select: { id: true, usageLimit: true },
          });
          if (!couponRef) throw new DatabaseError("الكوبون غير موجود.");

          const couponNow = new Date();
          const couponExpiryClause = { OR: [{ expiresAt: null }, { expiresAt: { gt: couponNow } }] };

          if (couponRef.usageLimit !== null) {
            // Atomic conditional increment — re-checks isActive and expiresAt at write time
            // to close the window between pre-tx validateCoupon and the transaction commit.
            const couponUpdate = await tx.coupon.updateMany({
              where: { code: validCouponCode, isActive: true, usedCount: { lt: couponRef.usageLimit }, ...couponExpiryClause },
              data: { usedCount: { increment: 1 } },
            });
            if (couponUpdate.count === 0) {
              throw new DatabaseError("الكوبون لم يعد متاحاً أو انتهت صلاحيته أو تم تجاوز الحد الأقصى.");
            }
          } else {
            // Unlimited coupon — still verify isActive and expiry
            const unlimitedUpdate = await tx.coupon.updateMany({
              where: { code: validCouponCode, isActive: true, ...couponExpiryClause },
              data: { usedCount: { increment: 1 } },
            });
            if (unlimitedUpdate.count === 0) {
              throw new DatabaseError("الكوبون لم يعد متاحاً أو انتهت صلاحيته.");
            }
          }

          if (data.userId) {
            await tx.couponUsage.create({
              data: { couponId: couponRef.id, userId: data.userId, orderId: newOrder.id },
            });
          }
        }

        return newOrder;
      });

      // Earn loyalty points for authenticated users (fire-and-forget — does not affect order total)
      if (data.userId) {
        LoyaltyService.earnPoints(data.userId, order.id, totalAmount).catch(() => {});
      }

      // Broadcast updated stock via Pusher (single batch query, then fire-and-forget per product)
      if (pusherServer) {
        const updatedProducts = await prisma.product.findMany({
          where: { id: { in: productIds } },
          select: { id: true, stock: true },
        });
        for (const p of updatedProducts) {
          pusherServer.trigger('inventory-channel', 'stock-update', {
            productId: p.id,
            stock: p.stock,
          }).catch(console.error);
        }
      }

      // Clear Redis cart — swallow failures so a Redis blip never causes a 500 after the order commits
      if (data.userId) {
        await CartService.clearUserCart(data.userId).catch(() => {});
      }

      // Send order confirmation email (non-blocking)
      const customerName = data.shippingDetails.fullName;
      EmailService.sendOrderConfirmation({
        to: customerEmail,
        orderId: order.id,
        customerName,
        items: validatedCartItems.map(i => ({
          name: productMap.get(i.productId)?.name ?? "منتج",
          quantity: i.quantity,
          price: i.price,
        })),
        subtotal,
        shippingCost: shipping,
        discountAmount,
        taxAmount,
        totalAmount,
        paymentMethod: data.paymentMethod === "card" ? "CARD" : "COD",
        shippingAddress: data.shippingDetails.address,
        shippingCity: data.shippingDetails.city,
      }).catch(() => {}); // fire-and-forget

      // Notify admin of new order (non-blocking)
      EmailService.notifyAdminNewOrder({
        orderId: order.id,
        customerName,
        customerEmail,
        totalAmount,
        itemCount: validatedCartItems.length,
        paymentMethod: data.paymentMethod === "card" ? "CARD" : "COD",
        shippingCity: data.shippingDetails.city,
      }).catch(() => {});

      if (data.paymentMethod === "card") {
        const billingData = {
          apartment: "NA",
          email: customerEmail,
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

        // Wrap Paymob separately — order is already committed, so a payment-gateway
        // failure must return the orderId so the customer can retry payment.
        try {
          const paymentUrl = await PaymobService.generateIframeUrl(totalAmount, order.id, billingData);
          return { success: true, orderId: order.id, paymentUrl };
        } catch (paymobErr) {
          const errMsg = paymobErr instanceof Error ? paymobErr.message : "خطأ في بوابة الدفع";
          return {
            success: false,
            orderId: order.id,
            message: `تم تسجيل طلبك (#${order.id.slice(-8).toUpperCase()}) لكن فشل إنشاء رابط الدفع: ${errMsg}. تواصل مع الدعم لإتمام الدفع.`,
          };
        }
      }

      return {
        success: true,
        orderId: order.id,
        message: "تم استلام طلبك بنجاح. الدفع عند الاستلام.",
      };

    } catch (err) {
      // Re-throw domain errors so callers can distinguish validation failures from infra errors
      if (err instanceof DatabaseError || err instanceof UnauthorizedError) throw err;
      throw new DatabaseError("حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.");
    }
  }
};
