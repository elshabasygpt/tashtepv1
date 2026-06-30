"use server";

import { revalidatePath } from "next/cache";
import { publicAction, roleAction } from "@/lib/safe-action";
import { CouponService } from "@/services/coupon.service";
import { z } from "zod";

const baseCouponSchema = z.object({
  code: z.string().min(2, "الكود قصير جداً"),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.number().positive("قيمة الخصم يجب أن تكون موجبة"),
  minOrderValue: z.number().nonnegative().optional().nullable(),
  maxDiscount: z.number().nonnegative().optional().nullable(),
  usageLimit: z.number().int().positive().optional().nullable(),
  isActive: z.boolean().optional(),
  expiresAt: z.date().optional().nullable(),
});

const createCouponSchema = baseCouponSchema.superRefine((data, ctx) => {
  if (data.discountType === "PERCENTAGE" && data.discountValue > 100) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "نسبة الخصم لا يمكن أن تتجاوز 100%",
      path: ["discountValue"],
    });
  }
});

export const createCouponAction = roleAction(
  createCouponSchema,
  ["ADMIN", "MANAGER"],
  async (data) => {
    try {
      const coupon = await CouponService.createCoupon(data);
      revalidatePath("/admin/coupons");
      return coupon;
    } catch (err) {
      throw new Error((err as Error).message || "فشل إنشاء الكوبون");
    }
  }
);

const updateCouponSchema = z.object({
  id: z.string(),
  data: baseCouponSchema.partial().superRefine((data, ctx) => {
    if (data.discountType === "PERCENTAGE" && data.discountValue !== undefined && data.discountValue > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "نسبة الخصم لا يمكن أن تتجاوز 100%",
        path: ["discountValue"],
      });
    }
  }),
});

export const updateCouponAction = roleAction(
  updateCouponSchema,
  ["ADMIN", "MANAGER"],
  async ({ id, data }) => {
    try {
      const coupon = await CouponService.updateCoupon(id, data);
      revalidatePath("/admin/coupons");
      return coupon;
    } catch (err) {
      throw new Error((err as Error).message || "فشل تحديث الكوبون");
    }
  }
);

const deleteSchema = z.object({ id: z.string() });

export const deleteCouponAction = roleAction(
  deleteSchema,
  ["ADMIN"],
  async ({ id }) => {
    try {
      await CouponService.deleteCoupon(id);
      revalidatePath("/admin/coupons");
      return { success: true };
    } catch (err) {
      throw new Error((err as Error).message || "فشل حذف الكوبون");
    }
  }
);

const validateCouponSchema = z.object({
  code: z.string().min(1),
  cartTotal: z.number().nonnegative(),
});

export const validateCouponAction = publicAction(
  validateCouponSchema,
  async ({ code, cartTotal }) => {
    try {
      return await CouponService.validateCoupon(code, cartTotal);
    } catch {
      throw new Error("فشل التحقق من الكود");
    }
  }
);
