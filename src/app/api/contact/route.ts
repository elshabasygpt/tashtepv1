import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { rateLimiter } from "@/lib/rate-limit";
import { EmailService } from "@/lib/email";

const schema = z.object({
  name: z.string().min(2, "الاسم قصير جداً").max(100),
  email: z.string().email("بريد إلكتروني غير صحيح"),
  subject: z.string().min(3, "الموضوع قصير جداً").max(200),
  message: z.string().min(10, "الرسالة قصيرة جداً").max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const rl = await rateLimiter.limit(`contact:${ip}`, { maxRequests: 5, windowMs: 60 * 60 * 1000 });
    if (!rl.success) {
      return NextResponse.json({ error: "تم تجاوز الحد المسموح به. يرجى المحاولة بعد ساعة." }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? "بيانات غير صحيحة";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    await prisma.contactMessage.create({ data: parsed.data });

    // Notify admin (fire-and-forget — don't block the response)
    EmailService.notifyAdminNewContactMessage(parsed.data).catch(() => {});

    return NextResponse.json({ message: "تم إرسال رسالتك بنجاح! سنتواصل معك قريباً." });
  } catch {
    return NextResponse.json({ error: "حدث خطأ، يرجى المحاولة مجدداً" }, { status: 500 });
  }
}
