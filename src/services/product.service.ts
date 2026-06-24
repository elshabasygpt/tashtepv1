import { prisma } from "@/lib/prisma";
import { type Product as UIProduct } from "@/features/products/components/product-card";
import { DatabaseError, NotFoundError } from "@/lib/errors";
import { Product, Category, ProductImage, ProductVariant, Prisma } from "@prisma/client";

export type PrismaProductWithRelations = Product & {
  category?: Category | null;
  images?: ProductImage[];
  variants?: ProductVariant[];
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
  colors?: string[];
  q?: string;
}

export const ProductService = {
  /**
   * Helper to map Prisma Product to the expected UI Product interface.
   * This ensures the UI remains fully decoupled from the DB schema.
   */
  mapToUIProduct(prismaProduct: PrismaProductWithRelations): UIProduct {
    const sortedImages = [...(prismaProduct.images || [])].sort((a, b) => (b.isMain ? 1 : 0) - (a.isMain ? 1 : 0));
    const mainImage = sortedImages[0]?.url || "";

    return {
      id: prismaProduct.id,
      name: prismaProduct.name,
      price: prismaProduct.price,
      originalPrice: prismaProduct.originalPrice || undefined,
      category: prismaProduct.category?.name || "عام",
      image: mainImage,
      images: sortedImages.length > 0 ? sortedImages.map((img) => img.url) : undefined,
      rating: prismaProduct.rating || 0,
      reviewsCount: prismaProduct.reviewsCount || 0,
      isNew: prismaProduct.isNew,
      description: prismaProduct.description || undefined,
      variants: prismaProduct.variants && prismaProduct.variants.length > 0
        ? prismaProduct.variants
            .sort((a, b) => a.order - b.order)
            .map((v) => ({ id: v.id, type: v.type as "COLOR" | "SIZE", label: v.label, value: v.value }))
        : undefined,
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
      if (options?.colors && options.colors.length > 0) {
        where.variants = {
          some: {
            type: "COLOR",
            value: { in: options.colors }
          }
        };
      }

      if (options?.q) {
        where.OR = [
          { name: { contains: options.q } },
          { description: { contains: options.q } },
        ];
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
    } catch (e) {
      console.error("Prisma Error:", e);
      throw new DatabaseError("Failed to fetch products");
    }
  },

  /**
   * Count products matching the same filters as getProducts, for pagination.
   */
  async getProductsCount(options?: ProductFilterOptions): Promise<number> {
    try {
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
      if (options?.colors && options.colors.length > 0) {
        where.variants = {
          some: {
            type: "COLOR",
            value: { in: options.colors }
          }
        };
      }
      if (options?.q) {
        where.OR = [
          { name: { contains: options.q } },
          { description: { contains: options.q } },
        ];
      }

      return await prisma.product.count({ where });
    } catch {
      throw new DatabaseError("Failed to count products");
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
          variants: true,
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
      if (options?.colors && options.colors.length > 0) {
        where.variants = {
          some: {
            type: "COLOR",
            value: { in: options.colors }
          }
        };
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
  },

  /**
   * Admin: Create a new product
   */
  async createProduct(data: Omit<Prisma.ProductUncheckedCreateInput, "images"> & { images?: string[] }): Promise<UIProduct> {
    try {
      const { images, ...rest } = data;
      const product = await prisma.product.create({
        data: {
          ...rest,
          ...(images && images.length > 0 ? {
            images: {
              create: images.map((url, i) => ({ url, isMain: i === 0 }))
            }
          } : {})
        },
        include: { category: true, images: true, variants: true }
      });
      return ProductService.mapToUIProduct(product);
    } catch (e) {
      console.error(e);
      throw new DatabaseError("Failed to create product");
    }
  },

  /**
   * Admin: Update an existing product
   */
  async updateProduct(id: string, data: Omit<Prisma.ProductUncheckedUpdateInput, "images"> & { images?: string[] }): Promise<UIProduct> {
    try {
      const { images, ...rest } = data;
      const product = await prisma.product.update({
        where: { id },
        data: {
          ...rest,
          ...(images ? {
            images: {
              deleteMany: {},
              create: images.map((url, i) => ({ url, isMain: i === 0 }))
            }
          } : {})
        },
        include: { category: true, images: true, variants: true }
      });
      return ProductService.mapToUIProduct(product);
    } catch (e) {
      console.error(e);
      throw new DatabaseError("Failed to update product");
    }
  },

  /**
   * Admin: Delete a product
   */
  async deleteProduct(id: string): Promise<void> {
    try {
      await prisma.product.delete({
        where: { id },
      });
    } catch (e) {
      console.error(e);
      throw new DatabaseError("Failed to delete product");
    }
  },

  /**
   * Fetch all available unique colors from the variants table
   */
  async getAvailableColors(): Promise<{ value: string; label: string }[]> {
    try {
      const variants = await prisma.productVariant.findMany({
        where: { type: "COLOR" },
        distinct: ["value"],
        select: { value: true, label: true },
      });
      return variants;
    } catch (e) {
      console.error("Failed to fetch colors:", e);
      return [];
    }
  }
};
