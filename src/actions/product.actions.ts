"use server";

import { z } from "zod";
import { ProductService } from "@/services/product.service";
import { publicAction, roleAction } from "@/lib/safe-action";
import { rateLimiter } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Schemas
const idSchema = z.string().min(1, "المعرف غير صحيح");
const querySchema = z.string().min(1, "يجب إدخال كلمة للبحث");

/**
 * Server Action to fetch all products.
 * Security: PUBLIC
 */
const filterSchema = z.object({
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  inStock: z.boolean().optional(),
  minRating: z.number().optional(),
  categoryId: z.string().optional(),
  sort: z.string().optional(),
});

export const getProductsAction = publicAction(
  filterSchema,
  async (parsedInput) => {
    return await ProductService.getProducts(parsedInput);
  }
);

export async function filterProductsRedirectAction(formData: FormData) {
  const minPrice = formData.get("minPrice")?.toString();
  const maxPrice = formData.get("maxPrice")?.toString();
  const inStock = formData.get("inStock") === "on";
  
  const searchParams = new URLSearchParams();
  if (minPrice) searchParams.set("minPrice", minPrice);
  if (maxPrice) searchParams.set("maxPrice", maxPrice);
  if (inStock) searchParams.set("inStock", "true");
  
  redirect(`/products?${searchParams.toString()}`);
}

/**
 * Server Action to fetch a single product by ID.
 * Security: PUBLIC
 * Validation: Validates ID string.
 */
export const getProductByIdAction = publicAction(
  idSchema,
  async (id) => {
    return await ProductService.getProductById(id);
  }
);

/**
 * Server Action for searching products.
 * Security: PUBLIC
 * Validation: Validates search query string.
 */
export const searchProductsAction = publicAction(
  querySchema,
  async (query) => {
    // Rate Limiting (100 requests / minute)
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    const rateLimitResult = await rateLimiter.limit(`search:${ip}`, { maxRequests: 100, windowMs: 60 * 1000 });
    
    if (!rateLimitResult.success) {
      throw new Error("عذراً، تم حظر البحث مؤقتاً لتجاوز الحد المسموح. حاول مجدداً بعد قليل.");
    }

    return await ProductService.searchProducts(query);
  }
);

/**
 * Example of an Admin-only action to delete a product.
 * Security: ROLE-BASED (ADMIN ONLY)
 */
export const deleteProductAction = roleAction(
  idSchema,
  ["ADMIN"],
  async (id, user) => {
    // await ProductService.deleteProduct(id);
    return { success: true, message: `Product ${id} deleted by Admin ${user.email}` };
  }
);
