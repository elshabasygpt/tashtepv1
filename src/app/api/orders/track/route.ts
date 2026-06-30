import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email")?.trim().toLowerCase();
  const orderId = searchParams.get("orderId")?.trim();

  if (!email && !orderId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const order = await prisma.order.findFirst({
    where: {
      OR: [
        orderId ? { id: orderId } : {},
        email  ? { guestEmail: email } : {},
        email  ? { user: { email } } : {},
      ].filter(c => Object.keys(c).length > 0),
    },
    select: {
      id: true,
      status: true,
      paymentStatus: true,
      totalAmount: true,
      createdAt: true,
      shippingName: true,
      shippingCity: true,
      items: {
        select: {
          quantity: true,
          price: true,
          product: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}
