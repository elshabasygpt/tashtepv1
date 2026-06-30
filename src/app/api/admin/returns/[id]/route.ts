import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const VALID_STATUSES = ["PENDING", "APPROVED", "REJECTED", "COMPLETED"];

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || !["ADMIN", "MANAGER"].includes(user.role as string)) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const { id } = await params;
  const formData = await req.formData().catch(() => null);
  const newStatus = formData?.get("status") as string | null;
  const adminNote = formData?.get("adminNote") as string | null;

  if (!newStatus || !VALID_STATUSES.includes(newStatus)) {
    return NextResponse.json({ error: "حالة غير صحيحة" }, { status: 400 });
  }

  await prisma.returnRequest.update({
    where: { id },
    data: { status: newStatus, ...(adminNote ? { adminNote } : {}) },
  });

  const referer = req.headers.get("referer") ?? "/admin/returns";
  return NextResponse.redirect(new URL(referer, req.url));
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || !["ADMIN", "MANAGER"].includes(user.role as string)) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  if (body.status && !VALID_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "حالة غير صحيحة" }, { status: 400 });
  }

  const updated = await prisma.returnRequest.update({
    where: { id },
    data: {
      ...(body.status ? { status: body.status } : {}),
      ...(body.adminNote !== undefined ? { adminNote: body.adminNote } : {}),
    },
  });

  return NextResponse.json({ success: true, data: updated });
}
