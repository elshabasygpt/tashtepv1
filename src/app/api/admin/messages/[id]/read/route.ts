import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || !["ADMIN", "MANAGER"].includes(user.role as string)) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const { id } = await params;
  const msg = await prisma.contactMessage.findUnique({ where: { id } });
  if (!msg) return NextResponse.json({ error: "not found" }, { status: 404 });

  await prisma.contactMessage.update({
    where: { id },
    data: { isRead: !msg.isRead },
  });

  const referer = req.headers.get("referer") ?? "/admin/messages";
  return NextResponse.redirect(new URL(referer, req.url));
}
