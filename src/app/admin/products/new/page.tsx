import { prisma } from "@/lib/prisma";
import { AdminProductForm } from "@/components/admin/admin-product-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ select: { id: true, name: true } });
  const brands = await prisma.brand.findMany({ select: { id: true, name: true } });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild className="rounded-full">
          <Link href="/admin/products">
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </Button>
        <h2 className="text-2xl font-headline-md font-bold text-obsidian">إضافة منتج جديد</h2>
      </div>

      <AdminProductForm categories={categories} brands={brands} />
    </div>
  );
}
