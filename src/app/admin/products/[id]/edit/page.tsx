import { prisma } from "@/lib/prisma";
import { AdminProductForm } from "@/components/admin/admin-product-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const categoriesPromise = prisma.category.findMany({ select: { id: true, name: true } });
  const productPromise = prisma.product.findUnique({
    where: { id },
    include: { images: true, variants: true }
  });

  const [categories, product] = await Promise.all([categoriesPromise, productPromise]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild className="rounded-full">
          <Link href="/admin/products">
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </Button>
        <h2 className="text-2xl font-headline-md font-bold text-obsidian">تعديل المنتج: {product.name}</h2>
      </div>

      <AdminProductForm categories={categories} initialData={{ ...product, images: product.images.map(i => i.url) }} isEdit={true} />
    </div>
  );
}
