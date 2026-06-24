"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { protectedAction } from "@/lib/safe-action";
import { GovernorateService } from "@/services/governorate.service";

const governorateSchema = z.object({
  name: z.string().min(2, "اسم المحافظة يجب أن يكون حرفين على الأقل"),
  shippingCost: z.coerce.number().min(0, "تكلفة الشحن لا يمكن أن تكون سالبة"),
  isActive: z.boolean().default(true),
});

const updateGovernorateSchema = governorateSchema.extend({
  id: z.string().min(1),
});

const idSchema = z.object({
  id: z.string().min(1),
});

export const createGovernorateAction = protectedAction(
  governorateSchema,
  async (data, user) => {
    if (user.role !== "ADMIN") throw new Error("Unauthorized");
    
    await GovernorateService.createGovernorate(data);
    revalidatePath("/admin/shipping");
    return { success: true };
  }
);

export const updateGovernorateAction = protectedAction(
  updateGovernorateSchema,
  async (data, user) => {
    if (user.role !== "ADMIN") throw new Error("Unauthorized");
    
    const { id, ...updateData } = data;
    await GovernorateService.updateGovernorate(id, updateData);
    revalidatePath("/admin/shipping");
    return { success: true };
  }
);

export const deleteGovernorateAction = protectedAction(
  idSchema,
  async ({ id }, user) => {
    if (user.role !== "ADMIN") throw new Error("Unauthorized");
    
    await GovernorateService.deleteGovernorate(id);
    revalidatePath("/admin/shipping");
    return { success: true };
  }
);
