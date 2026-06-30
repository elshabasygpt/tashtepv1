import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !["ADMIN", "MANAGER"].includes(user.role as string)) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (from || to) {
    where.createdAt = {
      ...(from ? { gte: new Date(from) } : {}),
      ...(to ? { lte: new Date(to + "T23:59:59Z") } : {}),
    };
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: { select: { name: true } } } },
    },
  });

  const STATUS_AR: Record<string, string> = {
    PENDING: "قيد المراجعة",
    PROCESSING: "جاري التجهيز",
    SHIPPED: "تم الشحن",
    DELIVERED: "تم التوصيل",
    CANCELLED: "ملغي",
  };

  const PAYMENT_AR: Record<string, string> = {
    PAID: "مدفوع",
    PENDING: "غير مدفوع",
    FAILED: "فشل الدفع",
  };

  const rows = [
    ["رقم الطلب", "التاريخ", "الاسم", "الإيميل", "المدينة", "المنتجات", "الإجمالي", "الشحن", "الخصم", "الضريبة", "حالة الطلب", "حالة الدفع", "طريقة الدفع"],
    ...orders.map((o) => [
      o.id.slice(-8).toUpperCase(),
      new Date(o.createdAt).toISOString().split("T")[0],
      o.shippingName,
      o.user?.email ?? o.guestEmail ?? "",
      o.shippingCity,
      o.items.map((i) => `${i.product?.name ?? "منتج"} ×${i.quantity}`).join(" | "),
      o.totalAmount.toFixed(2),
      o.shippingCost.toFixed(2),
      (o.discountAmount ?? 0).toFixed(2),
      (o.taxAmount ?? 0).toFixed(2),
      STATUS_AR[o.status] ?? o.status,
      PAYMENT_AR[o.paymentStatus] ?? o.paymentStatus,
      o.paymentMethod === "COD" ? "الدفع عند الاستلام" : "دفع إلكتروني",
    ]),
  ];

  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const bom = "﻿";

  return new NextResponse(bom + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="orders-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
