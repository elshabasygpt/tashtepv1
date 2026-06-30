"use server";

import { z } from "zod";
import { publicAction } from "@/lib/safe-action";
import { GiftCardService } from "@/services/giftcard.service";

const validateGiftCardSchema = z.object({
  code: z.string().min(1),
});

export const validateGiftCardAction = publicAction(
  validateGiftCardSchema,
  async ({ code }) => {
    return await GiftCardService.validate(code.trim().toUpperCase());
  }
);
