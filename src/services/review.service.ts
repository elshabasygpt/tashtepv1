import { prisma } from "@/lib/prisma";
import { DatabaseError } from "@/lib/errors";

export interface CreateReviewDTO {
  productId: string;
  userId: string;
  rating: number;
  comment?: string;
}

export const ReviewService = {
  async getProductReviews(productId: string) {
    try {
      return await prisma.review.findMany({
        where: { productId },
        include: {
          user: {
            select: { name: true, image: true }
          }
        },
        orderBy: { createdAt: "desc" }
      });
    } catch {
      throw new DatabaseError("حدث خطأ أثناء جلب التقييمات.");
    }
  },

  async hasVerifiedPurchase(userId: string, productId: string): Promise<boolean> {
    const count = await prisma.orderItem.count({
      where: {
        productId,
        order: {
          userId,
          status: { in: ["DELIVERED"] },
        },
      },
    });
    return count > 0;
  },

  async createReview(data: CreateReviewDTO) {
    try {
      const verifiedPurchase = await ReviewService.hasVerifiedPurchase(data.userId, data.productId);

      // Create the review
      const review = await prisma.review.create({
        data: {
          productId: data.productId,
          userId: data.userId,
          rating: data.rating,
          comment: data.comment,
          verifiedPurchase,
        }
      });

      // Update product rating and review count
      const aggregations = await prisma.review.aggregate({
        where: { productId: data.productId },
        _avg: { rating: true },
        _count: { rating: true },
      });

      await prisma.product.update({
        where: { id: data.productId },
        data: {
          rating: aggregations._avg.rating || 0,
          reviewsCount: aggregations._count.rating || 0,
        }
      });

      return review;
    } catch {
      throw new DatabaseError("حدث خطأ أثناء إضافة التقييم. ربما قمت بتقييم هذا المنتج من قبل.");
    }
  }
};
