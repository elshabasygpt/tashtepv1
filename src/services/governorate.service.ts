import { prisma } from "@/lib/prisma";
import { DatabaseError } from "@/lib/errors";
import { Governorate } from "@prisma/client";

export class GovernorateService {
  /**
   * Fetch all governorates
   */
  static async getGovernorates(activeOnly: boolean = false): Promise<Governorate[]> {
    try {
      return await prisma.governorate.findMany({
        where: activeOnly ? { isActive: true } : undefined,
        orderBy: { name: "asc" },
      });
    } catch (error) {
      console.error(error);
      throw new DatabaseError("Failed to fetch governorates");
    }
  }

  /**
   * Fetch shipping cost for a specific governorate by name
   */
  static async getShippingCost(name: string): Promise<number> {
    try {
      const gov = await prisma.governorate.findUnique({
        where: { name },
        select: { shippingCost: true, isActive: true },
      });
      if (!gov || !gov.isActive) return 0;
      return gov.shippingCost;
    } catch (error) {
      console.error(error);
      return 0; // default safe fallback
    }
  }

  /**
   * Create a new governorate
   */
  static async createGovernorate(data: { name: string; shippingCost: number; isActive?: boolean }): Promise<Governorate> {
    try {
      return await prisma.governorate.create({
        data,
      });
    } catch (error) {
      console.error(error);
      throw new DatabaseError("Failed to create governorate");
    }
  }

  /**
   * Update an existing governorate
   */
  static async updateGovernorate(id: string, data: { name?: string; shippingCost?: number; isActive?: boolean }): Promise<Governorate> {
    try {
      return await prisma.governorate.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error(error);
      throw new DatabaseError("Failed to update governorate");
    }
  }

  /**
   * Delete a governorate
   */
  static async deleteGovernorate(id: string): Promise<void> {
    try {
      await prisma.governorate.delete({
        where: { id },
      });
    } catch (error) {
      console.error(error);
      throw new DatabaseError("Failed to delete governorate");
    }
  }
}
