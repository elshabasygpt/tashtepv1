import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { rateLimiter } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().email("بريد إلكتروني غير صحيح"),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const rl = await rateLimiter.limit(`newsletter:${ip}`, { maxRequests: 10, windowMs: 60 * 60 * 1000 });
    if (!rl.success) {
      return NextResponse.json({ error: "تم تجاوز الحد المسموح به." }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "بريد إلكتروني غير صحيح" },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json(
          { error: "هذا البريد الإلكتروني مشترك بالفعل" },
          { status: 409 }
        );
      }
      // Re-activate if previously unsubscribed
      await prisma.newsletterSubscriber.update({
        where: { email },
        data: { isActive: true },
      });
      return NextResponse.json({ message: "تم تفعيل اشتراكك مجدداً" });
    }

    await prisma.newsletterSubscriber.create({
      data: { email },
    });

    return NextResponse.json({ message: "تم الاشتراك بنجاح! 🎉" });
  } catch {
    return NextResponse.json(
      { error: "حدث خطأ، يرجى المحاولة مجدداً" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "البريد الإلكتروني مطلوب" }, { status: 400 });
    }

    await prisma.newsletterSubscriber.updateMany({
      where: { email },
      data: { isActive: false },
    });

    return NextResponse.json({ message: "تم إلغاء الاشتراك بنجاح" });
  } catch {
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
