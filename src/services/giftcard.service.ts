import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

export const GiftCardService = {
  generateCode(): string {
    const raw = randomBytes(6).toString("hex").toUpperCase();
    return `TSHTP-${raw.slice(0, 4)}-${raw.slice(4, 8)}`;
  },

  async createGiftCard(data: {
    originalBalance: number;
    expiresAt?: Date | null;
    purchasedByEmail?: string;
  }) {
    return prisma.giftCard.create({
      data: {
        code: GiftCardService.generateCode(),
        originalBalance: data.originalBalance,
        balance: data.originalBalance,
        expiresAt: data.expiresAt,
        purchasedByEmail: data.purchasedByEmail,
      },
    });
  },

  async validate(code: string): Promise<{ valid: boolean; balance: number; error?: string }> {
    const card = await prisma.giftCard.findUnique({ where: { code: code.toUpperCase() } });
    if (!card) return { valid: false, balance: 0, error: "كود الكرت غير صحيح" };
    if (!card.isActive) return { valid: false, balance: 0, error: "الكرت غير نشط" };
    if (card.expiresAt && new Date() > card.expiresAt) return { valid: false, balance: 0, error: "انتهت صلاحية الكرت" };
    if (card.balance <= 0) return { valid: false, balance: 0, error: "رصيد الكرت صفر" };
    return { valid: true, balance: card.balance };
  },

  async redeem(code: string, amount: number): Promise<{ success: boolean; deducted: number }> {
    const card = await prisma.giftCard.findUnique({ where: { code: code.toUpperCase() } });
    if (!card || !card.isActive || card.balance <= 0) return { success: false, deducted: 0 };
    const deducted = Math.min(amount, card.balance);
    const newBalance = card.balance - deducted;
    await prisma.giftCard.update({
      where: { code: code.toUpperCase() },
      data: { balance: newBalance, isActive: newBalance > 0 },
    });
    return { success: true, deducted };
  },

  async getAllCards() {
    return prisma.giftCard.findMany({ orderBy: { createdAt: "desc" } });
  },
};
