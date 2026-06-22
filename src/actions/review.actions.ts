"use server";

import { z } from "zod";
import { ReviewService } from "@/services/review.service";
import { protectedAction } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";

const createReviewSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export const createReviewAction = protectedAction(
  createReviewSchema,
  async (input, user) => {
    await ReviewService.createReview({
      productId: input.productId,
      userId: user.id,
      rating: input.rating,
      comment: input.comment,
    });

    revalidatePath(`/products/${input.productId}`);
    return { success: true, message: "تم إضافة التقييم بنجاح" };
  }
);
