import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "MANAGER")) {
    return NextResponse.json({ pendingOrders: 0, unreadMessages: 0, pendingReturns: 0 });
  }

  const [pendingOrders, unreadMessages, pendingReturns] = await Promise.all([
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.returnRequest.count({ where: { status: "PENDING" } }),
  ]);

  return NextResponse.json({ pendingOrders, unreadMessages, pendingReturns });
}
