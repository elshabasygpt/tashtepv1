import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !["ADMIN", "MANAGER"].includes(user.role as string)) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { subscribedAt: "desc" },
  });

  const rows = [
    ["البريد الإلكتروني", "تاريخ الاشتراك", "الحالة"],
    ...subscribers.map((s) => [
      s.email,
      new Date(s.subscribedAt).toISOString().split("T")[0],
      s.isActive ? "نشط" : "ملغي",
    ]),
  ];

  const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const bom = "﻿"; // UTF-8 BOM for Arabic in Excel

  return new NextResponse(bom + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
