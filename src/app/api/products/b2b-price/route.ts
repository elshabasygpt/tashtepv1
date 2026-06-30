import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// Returns b2b price for a product if the user has TRADE role
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "Missing productId" }, { status: 400 });

  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role ?? "";
  if (!["TRADE", "ADMIN", "MANAGER"].includes(role)) {
    return NextResponse.json({ visible: false });
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { b2bPrice: true, price: true, name: true },
  });

  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    visible: !!product.b2bPrice,
    b2bPrice: product.b2bPrice,
    regularPrice: product.price,
    savings: product.b2bPrice ? +(product.price - product.b2bPrice).toFixed(2) : 0,
  });
}
