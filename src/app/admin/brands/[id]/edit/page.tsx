import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BrandForm } from "../../brand-form";

export default async function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "MANAGER")) redirect("/");

  const { id } = await params;
  const brand = await prisma.brand.findUnique({ where: { id } });
  if (!brand) notFound();

  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold text-obsidian mb-6">تعديل ماركة: {brand.name}</h2>
      <BrandForm brand={brand} />
    </div>
  );
}
