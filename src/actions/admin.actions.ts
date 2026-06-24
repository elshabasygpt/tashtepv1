"use server";

import { z } from "zod";
import { roleAction } from "@/lib/safe-action";
import { ProductService } from "@/services/product.service";
import { OrderService } from "@/services/order.service";
import { CategoryService } from "@/services/category.service";
import { revalidatePath } from "next/cache";

const idSchema = z.string().min(1, "المعرف مطلوب");

// -----------------------------------------------------------------------------
// Products
// -----------------------------------------------------------------------------

const productSchema = z.object({
  name: z.string().min(2, "الاسم قصير جداً"),
  slug: z.string().min(2, "الرابط قصير جداً"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "السعر يجب أن يكون 0 أو أكثر"),
  originalPrice: z.coerce.number().optional(),
  stock: z.coerce.number().int().min(0, "المخزون لا يمكن أن يكون سالباً"),
  isNew: z.boolean().default(false),
  categoryId: z.string().min(1, "القسم مطلوب"),
  images: z.array(z.string()).optional(),
});

export const createProductAction = roleAction(
  productSchema,
  ["ADMIN", "MANAGER"],
  async (data) => {
    const product = await ProductService.createProduct(data);
    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true, message: "تمت إضافة المنتج بنجاح", product };
  }
);

export const updateProductAction = roleAction(
  z.object({ id: idSchema, data: productSchema.partial() }),
  ["ADMIN", "MANAGER"],
  async ({ id, data }) => {
    const product = await ProductService.updateProduct(id, data);
    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath(`/products/${id}`);
    return { success: true, message: "تم تعديل المنتج بنجاح", product };
  }
);

export const deleteProductAction = roleAction(
  idSchema,
  ["ADMIN"],
  async (id) => {
    await ProductService.deleteProduct(id);
    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true, message: "تم حذف المنتج بنجاح" };
  }
);

// -----------------------------------------------------------------------------
// Categories
// -----------------------------------------------------------------------------

const categorySchema = z.object({
  name: z.string().min(2, "الاسم قصير جداً"),
  slug: z.string().min(2, "الرابط قصير جداً"),
  description: z.string().optional(),
  image: z.string().optional(),
  parentId: z.string().optional().nullable(),
});

export const createCategoryAction = roleAction(
  categorySchema,
  ["ADMIN", "MANAGER"],
  async (data) => {
    const category = await CategoryService.createCategory(data);
    revalidatePath("/admin/categories");
    revalidatePath("/");
    return { success: true, message: "تمت إضافة القسم بنجاح", category };
  }
);

export const updateCategoryAction = roleAction(
  z.object({ id: idSchema, data: categorySchema.partial() }),
  ["ADMIN", "MANAGER"],
  async ({ id, data }) => {
    const category = await CategoryService.updateCategory(id, data);
    revalidatePath("/admin/categories");
    revalidatePath("/");
    return { success: true, message: "تم تعديل القسم بنجاح", category };
  }
);

export const deleteCategoryAction = roleAction(
  idSchema,
  ["ADMIN"],
  async (id) => {
    await CategoryService.deleteCategory(id);
    revalidatePath("/admin/categories");
    revalidatePath("/");
    return { success: true, message: "تم حذف القسم بنجاح" };
  }
);

// -----------------------------------------------------------------------------
// Orders
// -----------------------------------------------------------------------------

export const updateOrderStatusAction = roleAction(
  z.object({
    id: idSchema,
    status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]).optional(),
    paymentStatus: z.enum(["PENDING", "PAID", "FAILED"]).optional(),
  }),
  ["ADMIN", "MANAGER"],
  async ({ id, status, paymentStatus }) => {
    const updateData: Record<string, string> = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    if (Object.keys(updateData).length === 0) {
      return { success: false, error: "لا توجد تحديثات مطلوبة" };
    }

    const order = await OrderService.updateOrder(id, updateData);
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);
    revalidatePath(`/account/orders`);
    return { success: true, message: "تم تحديث حالة الطلب بنجاح", order };
  }
);

// -----------------------------------------------------------------------------
// Users
// -----------------------------------------------------------------------------

import { UserService } from "@/services/user.service";

export const updateUserRoleAction = roleAction(
  z.object({ id: idSchema, role: z.enum(["CUSTOMER", "ADMIN", "MANAGER"]) }),
  ["ADMIN"],
  async ({ id, role }) => {
    const user = await UserService.updateUserRole(id, role);
    revalidatePath("/admin/users");
    return { success: true, message: `تم تحديث صلاحية المستخدم بنجاح إلى ${role}`, user };
  }
);
