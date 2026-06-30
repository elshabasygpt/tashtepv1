import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user || !["ADMIN", "MANAGER"].includes((session.user as { role?: string }).role ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: { select: { name: true } } } },
    },
  });

  const rows: string[] = [
    ["رقم الطلب", "تاريخ الطلب", "اسم العميل", "إيميل العميل", "المدينة", "العنوان", "المنتجات", "المجموع الفرعي", "الخصم", "الشحن", "الضريبة", "الإجمالي", "طريقة الدفع", "حالة الطلب", "حالة الدفع", "الكوبون"].join(","),
  ];

  for (const o of orders) {
    const customerName = o.user?.name || o.shippingName || "";
    const customerEmail = o.user?.email || o.guestEmail || "";
    const products = o.items.map(i => `${i.product?.name ?? "منتج"} ×${i.quantity}`).join(" | ");
    const subtotal = o.items.reduce((s, i) => s + i.price * i.quantity, 0);

    const escape = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;

    rows.push([
      escape(o.id.slice(-12).toUpperCase()),
      escape(new Date(o.createdAt).toLocaleDateString("ar-EG")),
      escape(customerName),
      escape(customerEmail),
      escape(o.shippingCity || ""),
      escape(o.shippingAddress || ""),
      escape(products),
      escape(subtotal.toFixed(2)),
      escape((o.discountAmount ?? 0).toFixed(2)),
      escape((o.shippingCost ?? 0).toFixed(2)),
      escape((o.taxAmount ?? 0).toFixed(2)),
      escape(o.totalAmount.toFixed(2)),
      escape(o.paymentMethod === "COD" ? "الدفع عند الاستلام" : "بطاقة ائتمانية"),
      escape(o.status),
      escape(o.paymentStatus),
      escape(o.couponCode || ""),
    ].join(","));
  }

  const csv = "﻿" + rows.join("\r\n"); // BOM for Excel Arabic support
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="orders-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
