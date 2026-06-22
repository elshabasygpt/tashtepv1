import { prisma } from "@/lib/prisma";
import { type Product as UIProduct } from "@/features/products/components/product-card";
import { DatabaseError, NotFoundError } from "@/lib/errors";
import { Product, Category, ProductImage, Prisma } from "@prisma/client";

export type PrismaProductWithRelations = Product & {
  category?: Category | null;
  images?: ProductImage[];
};

export interface ProductFilterOptions {
  page?: number;
  limit?: number;
  orderBy?: Record<string, "asc" | "desc">;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  minRating?: number;
  categoryId?: string;
}

export const ProductService = {
  /**
   * Helper to map Prisma Product to the expected UI Product interface.
   * This ensures the UI remains fully decoupled from the DB schema.
   */
  mapToUIProduct(prismaProduct: PrismaProductWithRelations): UIProduct {
    const mainImage = prismaProduct.images?.find((img) => img.isMain)?.url 
      || prismaProduct.images?.[0]?.url 
      || "";

    return {
      id: prismaProduct.id,
      name: prismaProduct.name,
      price: prismaProduct.price,
      originalPrice: prismaProduct.originalPrice || undefined,
      category: prismaProduct.category?.name || "عام",
      image: mainImage,
      rating: prismaProduct.rating || 0,
      reviewsCount: prismaProduct.reviewsCount || 0,
      isNew: prismaProduct.isNew,
      description: prismaProduct.description || undefined,
    };
  },

  /**
   * Fetch all available products with optional filtering and pagination.
   */
  async getProducts(options?: ProductFilterOptions): Promise<UIProduct[]> {
    try {
      const take = options?.limit || 20;
      const skip = options?.page ? (options.page - 1) * take : 0;
      const orderBy = options?.orderBy || { createdAt: "desc" };

      const where: Prisma.ProductWhereInput = {};
      
      if (options?.minPrice !== undefined) {
        where.price = typeof where.price === "object" ? { ...where.price, gte: options.minPrice } : { gte: options.minPrice };
      }
      if (options?.maxPrice !== undefined) {
        where.price = typeof where.price === "object" ? { ...where.price, lte: options.maxPrice } : { lte: options.maxPrice };
      }
      if (options?.inStock) {
        where.stock = { gt: 0 };
      }
      if (options?.minRating !== undefined) {
        where.rating = typeof where.rating === "object" ? { ...where.rating, gte: options.minRating } : { gte: options.minRating };
      }
      if (options?.categoryId) {
        where.categoryId = options.categoryId;
      }

      const products = await prisma.product.findMany({
        where,
        take,
        skip,
        orderBy,
        include: {
          category: true,
          images: true,
        },
      });
      return products.map(ProductService.mapToUIProduct);
    } catch {
      throw new DatabaseError("Failed to fetch products");
    }
  },

  /**
   * Fetch a specific product by ID.
   */
  async getProductById(id: string): Promise<UIProduct | null> {
    try {
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          images: true,
        },
      });
      if (!product) throw new NotFoundError("المنتج");
      return ProductService.mapToUIProduct(product);
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError("Failed to fetch product by id");
    }
  },

  /**
   * Fetch products by specific category slug with optional pagination.
   */
  async getProductsByCategory(categorySlug: string, options?: ProductFilterOptions): Promise<UIProduct[]> {
    try {
      const take = options?.limit || 20;
      const skip = options?.page ? (options.page - 1) * take : 0;
      const orderBy = options?.orderBy || { createdAt: "desc" };

      const where: Prisma.ProductWhereInput = { category: { is: { slug: categorySlug } } };
      
      if (options?.minPrice !== undefined) {
        where.price = typeof where.price === "object" ? { ...where.price, gte: options.minPrice } : { gte: options.minPrice };
      }
      if (options?.maxPrice !== undefined) {
        where.price = typeof where.price === "object" ? { ...where.price, lte: options.maxPrice } : { lte: options.maxPrice };
      }
      if (options?.inStock) {
        where.stock = { gt: 0 };
      }
      if (options?.minRating !== undefined) {
        where.rating = typeof where.rating === "object" ? { ...where.rating, gte: options.minRating } : { gte: options.minRating };
      }

      const products = await prisma.product.findMany({
        where,
        take,
        skip,
        orderBy,
        include: {
          category: true,
          images: true,
        },
      });
      return products.map(ProductService.mapToUIProduct);
    } catch {
      throw new DatabaseError(`Failed to fetch products by category: ${categorySlug}`);
    }
  },

  /**
   * Search products by query string with optional pagination.
   */
  async searchProducts(query: string, options?: ProductFilterOptions): Promise<UIProduct[]> {
    try {
      const take = options?.limit || 20;
      const skip = options?.page ? (options.page - 1) * take : 0;
      const orderBy = options?.orderBy || { createdAt: "desc" };

      const where: Prisma.ProductWhereInput = {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
          { category: { is: { name: { contains: query } } } }
        ],
      };

      if (options?.minPrice !== undefined) {
        where.price = typeof where.price === "object" ? { ...where.price, gte: options.minPrice } : { gte: options.minPrice };
      }
      if (options?.maxPrice !== undefined) {
        where.price = typeof where.price === "object" ? { ...where.price, lte: options.maxPrice } : { lte: options.maxPrice };
      }
      if (options?.inStock) {
        where.stock = { gt: 0 };
      }
      if (options?.minRating !== undefined) {
        where.rating = typeof where.rating === "object" ? { ...where.rating, gte: options.minRating } : { gte: options.minRating };
      }
      if (options?.categoryId) {
        where.categoryId = options.categoryId;
      }

      const products = await prisma.product.findMany({
        where,
        take,
        skip,
        orderBy,
        include: {
          category: true,
          images: true,
        },
      });
      return products.map(ProductService.mapToUIProduct);
    } catch {
      throw new DatabaseError("Failed to search products");
    }
  }
};
