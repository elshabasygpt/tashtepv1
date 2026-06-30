"use server";

import { z } from "zod";
import { roleAction } from "@/lib/safe-action";
import { ProductService } from "@/services/product.service";
import { OrderService } from "@/services/order.service";
import { CategoryService } from "@/services/category.service";
import { AlgoliaService } from "@/services/algolia.service";
import { pusherServer } from "@/lib/pusher";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const idSchema = z.string().min(1, "المعرف مطلوب");

// Valid order status transitions — prevents illegal state changes (e.g., CANCELLED → SHIPPED)
const ORDER_TRANSITIONS: Record<string, string[]> = {
  PENDING:    ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED:    ["DELIVERED", "CANCELLED"],
  DELIVERED:  [],
  CANCELLED:  [],
};

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
  brandId: z.string().optional().nullable(),
  images: z.array(z.string()).optional(),
  oemNumber: z.string().optional().nullable(),
  unitLabel: z.string().optional().nullable(),
  unitSize: z.coerce.number().optional().nullable(),
  deliveryDays: z.string().optional().nullable(),
  maxOrderQty: z.coerce.number().int().optional().nullable(),
  specs: z.string().optional().nullable(),
});

export const createProductAction = roleAction(
  productSchema,
  ["ADMIN", "MANAGER"],
  async (data) => {
    const product = await ProductService.createProduct(data);
    await AlgoliaService.saveProduct(product);
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
    
    // Broadcast if stock was updated
    if (data.stock !== undefined && pusherServer) {
      pusherServer.trigger('inventory-channel', 'stock-update', {
        productId: id,
        stock: product.stock
      }).catch(console.error);
    }
    
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
    return { success: true, message: "تم حذف المنتج بنجاح (نظام الحذف الآمن)" };
  }
);

export const restoreProductAction = roleAction(
  idSchema,
  ["ADMIN"],
  async (id) => {
    await ProductService.updateProduct(id, { isActive: true });
    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true, message: "تمت استعادة المنتج بنجاح" };
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
// Brands
// -----------------------------------------------------------------------------

const brandSchema = z.object({
  name: z.string().min(2, "الاسم قصير جداً"),
  slug: z.string().min(2, "الرابط قصير جداً"),
  description: z.string().optional(),
  logo: z.string().optional().nullable(),
});

export const createBrandAction = roleAction(
  brandSchema,
  ["ADMIN", "MANAGER"],
  async (data) => {
    const brand = await prisma.brand.create({ data });
    revalidatePath("/admin/brands");
    revalidatePath("/products");
    return { success: true, message: "تمت إضافة الماركة بنجاح", brand };
  }
);

export const updateBrandAction = roleAction(
  z.object({ id: idSchema, data: brandSchema.partial() }),
  ["ADMIN", "MANAGER"],
  async ({ id, data }) => {
    const brand = await prisma.brand.update({ where: { id }, data });
    revalidatePath("/admin/brands");
    revalidatePath("/products");
    return { success: true, message: "تم تعديل الماركة بنجاح", brand };
  }
);

export const deleteBrandAction = roleAction(
  idSchema,
  ["ADMIN"],
  async (id) => {
    await prisma.brand.delete({ where: { id } });
    revalidatePath("/admin/brands");
    revalidatePath("/products");
    return { success: true, message: "تم حذف الماركة بنجاح" };
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
    trackingNumber: z.string().max(100).optional(),
  }),
  ["ADMIN", "MANAGER"],
  async ({ id, status, paymentStatus, trackingNumber }) => {
    const updateData: Record<string, string | null> = {};
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber || null;

    if (status) {
      // Validate the transition against the allowed state machine
      const current = await prisma.order.findUnique({ where: { id }, select: { status: true } });
      if (!current) return { success: false, error: "الطلب غير موجود" };
      const allowed = ORDER_TRANSITIONS[current.status] ?? [];
      if (!allowed.includes(status)) {
        return {
          success: false,
          error: `لا يمكن تغيير حالة الطلب من "${current.status}" إلى "${status}"`,
        };
      }
      // Atomic guard: only apply if status hasn't changed since our read (prevents TOCTOU race).
      const guard = await prisma.order.updateMany({
        where: { id, status: current.status },
        data: { status },
      });
      if (guard.count === 0) {
        return { success: false, error: "تغيرت حالة الطلب بواسطة مسؤول آخر. يرجى تحديث الصفحة والمحاولة مرة أخرى." };
      }
      updateData.status = status;
    }

    if (Object.keys(updateData).length === 0) {
      return { success: false, error: "لا توجد تحديثات مطلوبة" };
    }

    const order = await OrderService.updateOrder(id, updateData);

    // Notify customer when order status changes (fire-and-forget)
    if (status) {
      const customerEmail = order.user?.email || order.guestEmail;
      if (customerEmail) {
        EmailService.sendOrderStatusUpdate({
          to: customerEmail,
          orderId: order.id,
          customerName: order.user?.name || order.shippingName || "عزيزي العميل",
          newStatus: order.status,
          trackingNumber: (order as { trackingNumber?: string | null }).trackingNumber ?? undefined,
        }).catch(() => {});
      }
    }

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
import { EmailService } from "@/lib/email";

export const updateUserRoleAction = roleAction(
  z.object({ id: idSchema, role: z.enum(["CUSTOMER", "ADMIN", "MANAGER"]) }),
  ["ADMIN"],
  async ({ id, role }) => {
    const user = await UserService.updateUserRole(id, role);
    revalidatePath("/admin/users");
    return { success: true, message: `تم تحديث صلاحية المستخدم بنجاح إلى ${role}`, user };
  }
);

// -----------------------------------------------------------------------------
// Bulk product actions
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Gift Cards
// -----------------------------------------------------------------------------

export async function createGiftCardAction(data: {
  amount: number;
  email?: string;
}): Promise<{ success: boolean; code?: string; error?: string }> {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role ?? "";
  if (!["ADMIN", "MANAGER"].includes(role)) return { success: false, error: "غير مصرح" };

  const { GiftCardService } = await import("@/services/giftcard.service");
  const card = await GiftCardService.createGiftCard({
    originalBalance: data.amount,
    purchasedByEmail: data.email,
  });
  revalidatePath("/admin/gift-cards");
  return { success: true, code: card.code };
}

export async function bulkProductActionAction(
  ids: string[],
  action: "activate" | "deactivate" | "delete"
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role ?? "";
  if (!["ADMIN", "MANAGER"].includes(role)) {
    return { success: false, error: "غير مصرح" };
  }
  if (!ids.length) return { success: false, error: "لم يتم تحديد أي منتجات" };

  if (action === "delete") {
    await prisma.product.updateMany({ where: { id: { in: ids } }, data: { isActive: false } });
  } else {
    await prisma.product.updateMany({
      where: { id: { in: ids } },
      data: { isActive: action === "activate" },
    });
  }
  revalidatePath("/admin/products");
  return { success: true };
}
