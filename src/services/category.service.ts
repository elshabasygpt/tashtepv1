import { prisma } from "@/lib/prisma";
import { DatabaseError, NotFoundError } from "@/lib/errors";
import { Category } from "@prisma/client";

export const CategoryService = {
  /**
   * Fetch all categories
   */
  async getCategories(): Promise<Category[]> {
    try {
      return await prisma.category.findMany({
        orderBy: { name: "asc" },
      });
    } catch {
      throw new DatabaseError("Failed to fetch categories");
    }
  },

  /**
   * Fetch category by its unique slug
   */
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const category = await prisma.category.findUnique({
        where: { slug },
      });
      if (!category) throw new NotFoundError("القسم");
      return category;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError("Failed to fetch category by slug");
    }
  }
};
