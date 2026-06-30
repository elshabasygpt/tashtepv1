import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { randomBytes } from "crypto";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let wishlist = await prisma.wishlist.findFirst({
    where: { userId: session.user.id },
  });

  if (!wishlist) {
    return NextResponse.json({ error: "لا توجد قائمة أمنيات" }, { status: 404 });
  }

  // Generate or return existing token
  if (!wishlist.shareToken) {
    const token = randomBytes(16).toString("hex");
    wishlist = await prisma.wishlist.update({
      where: { id: wishlist.id },
      data: { shareToken: token },
    });
  }

  const shareUrl = `${process.env.APP_URL || "http://localhost:3000"}/wishlist/shared/${wishlist.shareToken}`;
  return NextResponse.json({ shareUrl, token: wishlist.shareToken });
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await prisma.wishlist.updateMany({
    where: { userId: session.user.id },
    data: { shareToken: null },
  });
  return NextResponse.json({ success: true });
}
