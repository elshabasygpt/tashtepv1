import { prisma } from "@/lib/prisma";
import { Brand } from "@prisma/client";
import { DatabaseError } from "@/lib/errors";

export const BrandService = {
  /**
   * Fetch all brands
   */
  async getBrands(): Promise<Brand[]> {
    try {
      return await prisma.brand.findMany({
        orderBy: { name: "asc" },
      });
    } catch (e) {
      console.error("Failed to fetch brands:", e);
      return [];
    }
  },

  /**
   * Get brand by ID
   */
  async getBrandById(id: string): Promise<Brand | null> {
    try {
      return await prisma.brand.findUnique({
        where: { id },
      });
    } catch {
      throw new DatabaseError("Failed to fetch brand");
    }
  },

  /**
   * Create a new brand
   */
  async createBrand(data: Omit<Brand, "id" | "createdAt" | "updatedAt">): Promise<Brand> {
    try {
      return await prisma.brand.create({ data });
    } catch {
      throw new DatabaseError("Failed to create brand");
    }
  },

  /**
   * Update an existing brand
   */
  async updateBrand(id: string, data: Partial<Omit<Brand, "id" | "createdAt" | "updatedAt">>): Promise<Brand> {
    try {
      return await prisma.brand.update({
        where: { id },
        data,
      });
    } catch {
      throw new DatabaseError("Failed to update brand");
    }
  },

  /**
   * Delete a brand
   */
  async deleteBrand(id: string): Promise<Brand> {
    try {
      return await prisma.brand.delete({
        where: { id },
      });
    } catch {
      throw new DatabaseError("Failed to delete brand");
    }
  },
};
