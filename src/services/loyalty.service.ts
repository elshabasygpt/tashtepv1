import { prisma } from "@/lib/prisma";

const POINTS_PER_EGP = 0.1;    // 1 point per 10 EGP spent
const POINTS_CASH_RATE = 0.25; // 1 point = 0.25 EGP

export const LoyaltyService = {
  async getBalance(userId: string): Promise<number> {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { loyaltyPoints: true } });
    return user?.loyaltyPoints ?? 0;
  },

  async getHistory(userId: string) {
    return prisma.loyaltyTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  },

  pointsForOrder(totalAmount: number): number {
    return Math.floor(totalAmount * POINTS_PER_EGP);
  },

  pointsToCash(points: number): number {
    return Number((points * POINTS_CASH_RATE).toFixed(2));
  },

  maxRedeemablePoints(cartTotal: number): number {
    // Max 30% of order value can be paid with points
    const maxCash = cartTotal * 0.3;
    return Math.floor(maxCash / POINTS_CASH_RATE);
  },

  async earnPoints(userId: string, orderId: string, orderTotal: number) {
    const points = LoyaltyService.pointsForOrder(orderTotal);
    if (points <= 0) return;
    await prisma.$transaction([
      prisma.user.update({ where: { id: userId }, data: { loyaltyPoints: { increment: points } } }),
      prisma.loyaltyTransaction.create({
        data: { userId, orderId, points, type: "EARNED", description: `طلب #${orderId.slice(-8).toUpperCase()}` },
      }),
    ]);
    return points;
  },

  async redeemPoints(userId: string, orderId: string, points: number) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { loyaltyPoints: true } });
    if (!user || user.loyaltyPoints < points) throw new Error("رصيد النقاط غير كافٍ");
    const cashValue = LoyaltyService.pointsToCash(points);
    await prisma.$transaction([
      prisma.user.update({ where: { id: userId }, data: { loyaltyPoints: { decrement: points } } }),
      prisma.loyaltyTransaction.create({
        data: { userId, orderId, points: -points, type: "REDEEMED", description: `استرداد ${cashValue} ج.م` },
      }),
    ]);
    return cashValue;
  },
};
