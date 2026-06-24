import { prisma } from "@/lib/prisma";
import { DatabaseError, NotFoundError } from "@/lib/errors";
import { Category, Prisma } from "@prisma/client";

export type CategoryWithRelations = Prisma.CategoryGetPayload<{
  include: {
    subcategories: true;
    parent: true;
  };
}>;

export const CategoryService = {
  /**
   * Fetch all categories
   */
  async getCategories(): Promise<CategoryWithRelations[]> {
    try {
      return await prisma.category.findMany({
        include: {
          subcategories: true,
          parent: true,
        },
        orderBy: { name: "asc" },
      });
    } catch {
      throw new DatabaseError("Failed to fetch categories");
    }
  },

  /**
   * Fetch category by its unique slug
   */
  async getCategoryBySlug(slug: string): Promise<CategoryWithRelations | null> {
    try {
      const category = await prisma.category.findUnique({
        where: { slug },
        include: {
          subcategories: true,
          parent: true,
        }
      });
      if (!category) throw new NotFoundError("القسم");
      return category;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError("Failed to fetch category by slug");
    }
  },

  /**
   * Admin: Create Category
   */
  async createCategory(data: { name: string; slug: string; description?: string; image?: string; parentId?: string | null }): Promise<Category> {
    try {
      return await prisma.category.create({ data });
    } catch {
      throw new DatabaseError("Failed to create category");
    }
  },

  /**
   * Admin: Update Category
   */
  async updateCategory(id: string, data: { name?: string; slug?: string; description?: string; image?: string; parentId?: string | null }): Promise<Category> {
    try {
      return await prisma.category.update({ where: { id }, data });
    } catch {
      throw new DatabaseError("Failed to update category");
    }
  },

  /**
   * Admin: Delete Category
   */
  async deleteCategory(id: string): Promise<void> {
    try {
      await prisma.category.delete({ where: { id } });
    } catch {
      throw new DatabaseError("Failed to delete category");
    }
  }
};
