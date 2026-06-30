import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  orderId: z.string().min(1),
  reason: z.string().min(3),
  details: z.string().min(10, "الرجاء كتابة تفاصيل أكثر (10 أحرف على الأقل)"),
});

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? "بيانات غير صحيحة" }, { status: 400 });
  }

  const { orderId, reason, details } = parsed.data;

  // Verify order belongs to user and is DELIVERED
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { userId: true, status: true },
  });

  if (!order || order.userId !== user.id) {
    return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
  }

  if (order.status !== "DELIVERED") {
    return NextResponse.json({ error: "لا يمكن تقديم طلب استرداد إلا للطلبات المُسلَّمة" }, { status: 400 });
  }

  const existing = await prisma.returnRequest.findFirst({ where: { orderId, userId: user.id } });
  if (existing) {
    return NextResponse.json({ error: "تم تقديم طلب استرداد لهذا الطلب مسبقاً" }, { status: 409 });
  }

  await prisma.returnRequest.create({
    data: { orderId, userId: user.id, reason, details },
  });

  return NextResponse.json({ success: true });
}
