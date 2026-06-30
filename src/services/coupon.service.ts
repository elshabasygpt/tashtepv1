import { prisma } from "@/lib/prisma";
import { DatabaseError,  } from "@/lib/errors";
import { Coupon } from "@prisma/client";

export const CouponService = {
  /**
   * Admin: Get all coupons
   */
  async getCoupons(): Promise<Coupon[]> {
    try {
      return await prisma.coupon.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch {
      throw new DatabaseError("Failed to fetch coupons");
    }
  },

  /**
   * Admin: Get a coupon by ID
   */
  async getCouponById(id: string): Promise<Coupon | null> {
    try {
      return await prisma.coupon.findUnique({ where: { id } });
    } catch {
      throw new DatabaseError("Failed to fetch coupon");
    }
  },

  /**
   * Admin: Create Coupon
   */
  async createCoupon(data: {
    code: string;
    discountType: string;
    discountValue: number;
    minOrderValue?: number | null;
    maxDiscount?: number | null;
    usageLimit?: number | null;
    isActive?: boolean;
    expiresAt?: Date | null;
  }): Promise<Coupon> {
    try {
      return await prisma.coupon.create({ data });
    } catch {
      throw new DatabaseError("Failed to create coupon");
    }
  },

  /**
   * Admin: Update Coupon
   */
  async updateCoupon(id: string, data: Partial<Coupon>): Promise<Coupon> {
    try {
      return await prisma.coupon.update({ where: { id }, data });
    } catch {
      throw new DatabaseError("Failed to update coupon");
    }
  },

  /**
   * Admin: Delete Coupon
   */
  async deleteCoupon(id: string): Promise<void> {
    try {
      await prisma.coupon.delete({ where: { id } });
    } catch {
      throw new DatabaseError("Failed to delete coupon");
    }
  },

  /**
   * User: Validate Coupon against cart total (with optional per-user check)
   */
  async validateCoupon(code: string, cartTotal: number, userId?: string): Promise<{ isValid: boolean; discountAmount: number; error?: string }> {
    try {
      const upperCode = code.toUpperCase();
      const coupon = await prisma.coupon.findUnique({ where: { code: upperCode } });

      if (!coupon) {
        return { isValid: false, discountAmount: 0, error: "كود الخصم غير صحيح" };
      }

      if (!coupon.isActive) {
        return { isValid: false, discountAmount: 0, error: "كود الخصم غير فعال" };
      }

      if (coupon.expiresAt && new Date() > coupon.expiresAt) {
        return { isValid: false, discountAmount: 0, error: "كود الخصم منتهي الصلاحية" };
      }

      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return { isValid: false, discountAmount: 0, error: "تم تجاوز الحد الأقصى لاستخدام الكوبون" };
      }

      // Per-user limit check
      if (userId && coupon.perUserLimit != null && coupon.perUserLimit > 0) {
        const userUsage = await prisma.couponUsage.count({
          where: { couponId: coupon.id, userId },
        });
        if (userUsage >= coupon.perUserLimit) {
          return { isValid: false, discountAmount: 0, error: "لقد استخدمت هذا الكوبون من قبل" };
        }
      }

      if (coupon.minOrderValue && cartTotal < coupon.minOrderValue) {
        return { isValid: false, discountAmount: 0, error: `يجب أن يكون إجمالي الطلب ${coupon.minOrderValue} جنيه على الأقل لاستخدام هذا الكود` };
      }

      // Calculate discount
      let discountAmount = 0;
      if (coupon.discountType === "PERCENTAGE") {
        discountAmount = cartTotal * (coupon.discountValue / 100);
        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
          discountAmount = coupon.maxDiscount;
        }
      } else {
        discountAmount = coupon.discountValue;
      }

      // Discount cannot exceed cart total
      if (discountAmount > cartTotal) {
        discountAmount = cartTotal;
      }

      return { isValid: true, discountAmount };
    } catch {
      return { isValid: false, discountAmount: 0, error: "حدث خطأ أثناء التحقق من الكود" };
    }
  },
  
  /**
   * Internal: Increment usage count after a successful order
   */
  async incrementCouponUsage(code: string): Promise<void> {
    try {
      await prisma.coupon.update({
        where: { code },
        data: { usedCount: { increment: 1 } }
      });
    } catch {
      console.error("Failed to increment coupon usage");
    }
  }
};
