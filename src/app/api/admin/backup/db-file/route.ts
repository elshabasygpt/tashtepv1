import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "ADMIN فقط" }, { status: 401 });
  }

  // MySQL doesn't support direct file download — use JSON export instead
  return NextResponse.json(
    { error: "تحميل ملف DB غير متاح مع MySQL. استخدم تصدير JSON بدلاً من ذلك." },
    { status: 400 }
  );
}
