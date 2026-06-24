"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { ArticleService } from "@/services/article.service";
import { z } from "zod";

const articleSchema = z.object({
  title: z.string().min(3, "عنوان المقال يجب أن يكون 3 أحرف على الأقل"),
  slug: z.string().min(3, "الرابط يجب أن يكون 3 أحرف على الأقل").regex(/^[a-z0-9-]+$/, "الرابط يجب أن يحتوي على أحرف إنجليزية صغيرة، أرقام، وعلامة (-) فقط"),
  description: z.string().optional(),
  content: z.string().min(10, "محتوى المقال يجب أن يكون 10 أحرف على الأقل"),
  image: z.string().optional(),
  published: z.boolean().default(true),
});

export async function createArticleAction(data: z.infer<typeof articleSchema>) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "MANAGER")) {
      return { success: false, error: "غير مصرح لك بإضافة مقالات" };
    }

    const validation = articleSchema.safeParse(data);
    if (!validation.success) {
      return { success: false, error: validation.error.errors[0].message };
    }

    // Check slug uniqueness
    const existing = await ArticleService.getArticleBySlug(data.slug);
    if (existing) {
      return { success: false, error: "الرابط (Slug) مستخدم بالفعل، الرجاء اختيار رابط آخر" };
    }

    const article = await ArticleService.createArticle(validation.data);

    revalidatePath("/blog");
    revalidatePath("/");

    return { success: true, articleId: article.id };
  } catch (error) {
    console.error("Failed to create article:", error);
    return { success: false, error: "حدث خطأ أثناء حفظ المقال" };
  }
}

export async function updateArticleAction(id: string, data: z.infer<typeof articleSchema>) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "MANAGER")) {
      return { success: false, error: "غير مصرح لك بتعديل المقالات" };
    }

    const validation = articleSchema.safeParse(data);
    if (!validation.success) {
      return { success: false, error: validation.error.errors[0].message };
    }

    // Check slug uniqueness if slug changed
    const existing = await ArticleService.getArticleBySlug(data.slug);
    if (existing && existing.id !== id) {
      return { success: false, error: "الرابط (Slug) مستخدم بالفعل، الرجاء اختيار رابط آخر" };
    }

    await ArticleService.updateArticle(id, validation.data);

    revalidatePath("/blog");
    revalidatePath(`/blog/${data.slug}`);
    revalidatePath("/");
    revalidatePath("/admin/articles");

    return { success: true };
  } catch (error) {
    console.error("Failed to update article:", error);
    return { success: false, error: "حدث خطأ أثناء تحديث المقال" };
  }
}

export async function deleteArticleAction(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "MANAGER")) {
      return { success: false, error: "غير مصرح لك بحذف المقالات" };
    }

    await ArticleService.deleteArticle(id);

    revalidatePath("/blog");
    revalidatePath("/");
    revalidatePath("/admin/articles");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete article:", error);
    return { success: false, error: "حدث خطأ أثناء حذف المقال" };
  }
}
