import { AdminCategoryForm } from "@/components/admin/admin-category-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CategoryService } from "@/services/category.service";

export default async function NewCategoryPage() {
  const categories = await CategoryService.getCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild className="rounded-full">
          <Link href="/admin/categories">
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </Button>
        <h2 className="text-2xl font-headline-md font-bold text-obsidian">إضافة قسم جديد</h2>
      </div>

      <AdminCategoryForm categories={categories} />
    </div>
  );
}
