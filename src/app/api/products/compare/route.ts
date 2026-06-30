import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ids = searchParams.get("ids")?.split(",").filter(Boolean).slice(0, 3) ?? [];

  if (ids.length === 0) return NextResponse.json([]);

  const products = await prisma.product.findMany({
    where: { id: { in: ids }, isActive: true },
    select: {
      id: true,
      name: true,
      price: true,
      originalPrice: true,
      salePrice: true,
      stock: true,
      rating: true,
      reviewsCount: true,
      description: true,
      isNew: true,
      category: { select: { name: true } },
      brand: { select: { name: true } },
      images: { take: 1, orderBy: [{ isMain: "desc" as const }, { id: "asc" as const }], select: { url: true } },
      variants: {
        select: { type: true, label: true, value: true },
        orderBy: { order: "asc" },
      },
    },
  });

  const mapped = products.map((p) => {
    const effectivePrice = p.salePrice ?? p.price;
    // category is a required relation but SQLite doesn't enforce FKs by default
    const categoryName = (p.category as { name: string } | null)?.name ?? "";
    return {
      id: p.id,
      name: p.name,
      price: effectivePrice,
      originalPrice: p.salePrice ? p.price : (p.originalPrice ?? null),
      stock: p.stock,
      rating: p.rating,
      reviewsCount: p.reviewsCount,
      description: p.description,
      isNew: p.isNew,
      category: categoryName,
      brand: p.brand?.name ?? null,
      image: p.images[0]?.url ?? "",
      colors: p.variants.filter((v) => v.type === "COLOR").map((v) => v.value),
      sizes: p.variants.filter((v) => v.type === "SIZE").map((v) => v.label),
    };
  });

  // Preserve the caller's ordering
  const ordered = ids.map((id) => mapped.find((p) => p.id === id)).filter(Boolean);
  return NextResponse.json(ordered);
}
