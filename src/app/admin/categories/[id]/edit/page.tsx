import { prisma } from "@/lib/prisma";
import { AdminCategoryForm } from "@/components/admin/admin-category-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    notFound();
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild className="rounded-full">
          <Link href="/admin/categories">
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </Button>
        <h2 className="text-2xl font-headline-md font-bold text-obsidian">تعديل القسم: {category.name}</h2>
      </div>

      <AdminCategoryForm initialData={category} isEdit={true} categories={categories} />
    </div>
  );
}
