import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id, isActive: true },
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
      images: { take: 1, where: { isMain: true }, select: { url: true } },
      variants: { select: { type: true, label: true, value: true }, orderBy: { order: "asc" } },
    },
  });

  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const effectivePrice = product.salePrice ?? product.price;

  return NextResponse.json({
    id: product.id,
    name: product.name,
    price: effectivePrice,
    originalPrice: product.salePrice ? product.price : (product.originalPrice ?? null),
    stock: product.stock,
    rating: product.rating,
    reviewsCount: product.reviewsCount,
    description: product.description,
    isNew: product.isNew,
    category: product.category.name,
    brand: product.brand?.name ?? null,
    image: product.images[0]?.url ?? "",
    colors: product.variants.filter(v => v.type === "COLOR").map(v => v.value),
    sizes: product.variants.filter(v => v.type === "SIZE").map(v => v.label),
  });
}
