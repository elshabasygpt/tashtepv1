import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { EmailService } from "@/lib/email";
import { SettingsService } from "@/services/settings.service";
import { logger } from "@/lib/logger";

export async function POST() {
  const session = await auth();
  if (!session?.user || !["ADMIN", "MANAGER"].includes((session.user as { role?: string }).role ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const lowStockProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      stock: { gt: 0 },
      // stock is less than or equal to lowStockThreshold
    },
    select: { id: true, name: true, stock: true, lowStockThreshold: true },
  });

  const alerts = lowStockProducts.filter(p => p.stock <= p.lowStockThreshold);

  if (alerts.length === 0) {
    return NextResponse.json({ message: "لا توجد منتجات بمخزون منخفض" });
  }

  // Send email to configured admin notification address (fallback to session email)
  const emailSettings = await SettingsService.getEmailSettings();
  const adminEmail = emailSettings.adminNotificationEmail || session.user.email;
  if (adminEmail) {
    await EmailService.sendLowStockAlert(adminEmail, alerts);
  }

  logger.warn({ count: alerts.length }, "Low stock alert triggered");
  return NextResponse.json({ alerted: alerts.length, products: alerts.map(p => p.name) });
}

// Called automatically via cron or admin button — also run on every product update
export async function GET() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { id: true, name: true, stock: true, lowStockThreshold: true },
  });
  const alerts = products.filter(p => p.stock <= p.lowStockThreshold && p.stock > 0);
  const outOfStock = products.filter(p => p.stock === 0);
  return NextResponse.json({ lowStock: alerts, outOfStock });
}
