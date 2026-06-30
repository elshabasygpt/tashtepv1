import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Parse ISO date string or null safely
function d(v: unknown): Date | undefined {
  if (!v) return undefined;
  const parsed = new Date(v as string);
  return isNaN(parsed.getTime()) ? undefined : parsed;
}

// Parse required date (falls back to now)
function dr(v: unknown): Date {
  if (!v) return new Date();
  const parsed = new Date(v as string);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

type BackupRow = Record<string, unknown>;

export async function POST(req: NextRequest) {
  // ADMIN only — restore is destructive
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "ADMIN فقط — الاستعادة عملية خطيرة" }, { status: 401 });
  }

  let backup: { version: string; tables: Record<string, BackupRow[]> };
  try {
    backup = await req.json();
  } catch {
    return NextResponse.json({ error: "ملف الـ backup غير صالح" }, { status: 400 });
  }

  const { tables } = backup;
  if (!tables || typeof tables !== "object") {
    return NextResponse.json({ error: "تنسيق الـ backup خاطئ" }, { status: 400 });
  }

  const T = tables as Record<string, BackupRow[]>;
  const safe = (key: string): BackupRow[] => T[key] ?? [];

  try {
    // ── Step 1: Disable FK constraints ────────────────────────────
    await prisma.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS = 0");

    // ── Step 2: Wipe all tables (order doesn't matter with FK off) ─
    const WIPE_ORDER = [
      "ReturnRequest",
      "OrderItem",
      "Order",
      "CouponUsage",
      "CartItem",
      "WishlistItem",
      "LoyaltyTransaction",
      "Address",
      "Review",
      "ProductImage",
      "ProductVariant",
      "_CrossSelling",
      "Cart",
      "Wishlist",
      "Product",
      "Category",
      "Brand",
      "Account",
      "Session",
      "VerificationToken",
      "User",
      "Coupon",
      "GiftCard",
      "Governorate",
      "SystemSetting",
      "Article",
      "NewsletterSubscriber",
      "ContactMessage",
    ];
    const wiped = new Set<string>();
    for (const tbl of WIPE_ORDER) {
      if (!wiped.has(tbl)) {
        await prisma.$executeRawUnsafe(`DELETE FROM \`${tbl}\``);
        wiped.add(tbl);
      }
    }

    // ── Step 3: Insert — independent tables first ──────────────────

    if (safe("governorates").length) {
      await prisma.governorate.createMany({
        data: safe("governorates").map((r) => ({
          id: r.id as string,
          name: r.name as string,
          shippingCost: Number(r.shippingCost ?? 0),
          isActive: Boolean(r.isActive ?? true),
          createdAt: dr(r.createdAt),
          updatedAt: dr(r.updatedAt),
        })),
      });
    }

    if (safe("systemSettings").length) {
      await prisma.systemSetting.createMany({
        data: safe("systemSettings").map((r) => ({
          key: r.key as string,
          value: r.value as string,
          updatedAt: dr(r.updatedAt),
        })),
      });
    }

    if (safe("articles").length) {
      await prisma.article.createMany({
        data: safe("articles").map((r) => ({
          id: r.id as string,
          title: r.title as string,
          slug: r.slug as string,
          description: r.description as string | null ?? null,
          content: r.content as string,
          image: r.image as string | null ?? null,
          published: Boolean(r.published ?? true),
          createdAt: dr(r.createdAt),
          updatedAt: dr(r.updatedAt),
        })),
      });
    }

    if (safe("coupons").length) {
      await prisma.coupon.createMany({
        data: safe("coupons").map((r) => ({
          id: r.id as string,
          code: r.code as string,
          discountType: r.discountType as string,
          discountValue: Number(r.discountValue),
          minOrderValue: r.minOrderValue != null ? Number(r.minOrderValue) : null,
          maxDiscount: r.maxDiscount != null ? Number(r.maxDiscount) : null,
          usageLimit: r.usageLimit != null ? Number(r.usageLimit) : null,
          perUserLimit: r.perUserLimit != null ? Number(r.perUserLimit) : null,
          usedCount: Number(r.usedCount ?? 0),
          isActive: Boolean(r.isActive ?? true),
          expiresAt: d(r.expiresAt) ?? null,
          createdAt: dr(r.createdAt),
          updatedAt: dr(r.updatedAt),
        })),
      });
    }

    if (safe("giftCards").length) {
      await prisma.giftCard.createMany({
        data: safe("giftCards").map((r) => ({
          id: r.id as string,
          code: r.code as string,
          originalBalance: Number(r.originalBalance),
          balance: Number(r.balance),
          isActive: Boolean(r.isActive ?? true),
          expiresAt: d(r.expiresAt) ?? null,
          purchasedByEmail: r.purchasedByEmail as string | null ?? null,
          createdAt: dr(r.createdAt),
          updatedAt: dr(r.updatedAt),
        })),
      });
    }

    if (safe("newsletterSubscribers").length) {
      await prisma.newsletterSubscriber.createMany({
        data: safe("newsletterSubscribers").map((r) => ({
          id: r.id as string,
          email: r.email as string,
          isActive: Boolean(r.isActive ?? true),
          subscribedAt: dr(r.subscribedAt),
        })),
      });
    }

    if (safe("contactMessages").length) {
      await prisma.contactMessage.createMany({
        data: safe("contactMessages").map((r) => ({
          id: r.id as string,
          name: r.name as string,
          email: r.email as string,
          subject: r.subject as string,
          message: r.message as string,
          isRead: Boolean(r.isRead ?? false),
          createdAt: dr(r.createdAt),
        })),
      });
    }

    if (safe("verificationTokens").length) {
      await prisma.verificationToken.createMany({
        data: safe("verificationTokens").map((r) => ({
          identifier: r.identifier as string,
          token: r.token as string,
          expires: dr(r.expires),
        })),
      });
    }

    // ── Catalog ────────────────────────────────────────────────────

    if (safe("brands").length) {
      await prisma.brand.createMany({
        data: safe("brands").map((r) => ({
          id: r.id as string,
          name: r.name as string,
          slug: r.slug as string,
          logo: r.logo as string | null ?? null,
          description: r.description as string | null ?? null,
          createdAt: dr(r.createdAt),
          updatedAt: dr(r.updatedAt),
        })),
      });
    }

    // Categories: parents first (parentId = null), then children
    const cats = safe("categories");
    const parents = cats.filter((c) => !c.parentId);
    const children = cats.filter((c) => Boolean(c.parentId));
    for (const batch of [parents, children]) {
      if (batch.length) {
        await prisma.category.createMany({
          data: batch.map((r) => ({
            id: r.id as string,
            name: r.name as string,
            slug: r.slug as string,
            description: r.description as string | null ?? null,
            image: r.image as string | null ?? null,
            parentId: r.parentId as string | null ?? null,
            createdAt: dr(r.createdAt),
            updatedAt: dr(r.updatedAt),
          })),
        });
      }
    }

    // ── Users & Auth ───────────────────────────────────────────────

    if (safe("users").length) {
      await prisma.user.createMany({
        data: safe("users").map((r) => ({
          id: r.id as string,
          name: r.name as string | null ?? null,
          email: r.email as string | null ?? null,
          emailVerified: d(r.emailVerified) ?? null,
          phone: r.phone as string | null ?? null,
          passwordHash: r.passwordHash as string | null ?? null,
          image: r.image as string | null ?? null,
          role: r.role as string ?? "CUSTOMER",
          loyaltyPoints: Number(r.loyaltyPoints ?? 0),
          createdAt: dr(r.createdAt),
          updatedAt: dr(r.updatedAt),
        })),
      });
    }

    if (safe("accounts").length) {
      await prisma.account.createMany({
        data: safe("accounts").map((r) => ({
          id: r.id as string,
          userId: r.userId as string,
          type: r.type as string,
          provider: r.provider as string,
          providerAccountId: r.providerAccountId as string,
          refresh_token: r.refresh_token as string | null ?? null,
          access_token: r.access_token as string | null ?? null,
          expires_at: r.expires_at != null ? Number(r.expires_at) : null,
          token_type: r.token_type as string | null ?? null,
          scope: r.scope as string | null ?? null,
          id_token: r.id_token as string | null ?? null,
          session_state: r.session_state as string | null ?? null,
        })),
      });
    }

    if (safe("sessions").length) {
      await prisma.session.createMany({
        data: safe("sessions").map((r) => ({
          id: r.id as string,
          sessionToken: r.sessionToken as string,
          userId: r.userId as string,
          expires: dr(r.expires),
        })),
      });
    }

    // ── Products ───────────────────────────────────────────────────

    const productRows = safe("products");
    if (productRows.length) {
      await prisma.product.createMany({
        data: productRows.map((r) => ({
          id: r.id as string,
          name: r.name as string,
          slug: r.slug as string,
          description: r.description as string | null ?? null,
          price: Number(r.price),
          originalPrice: r.originalPrice != null ? Number(r.originalPrice) : null,
          salePrice: r.salePrice != null ? Number(r.salePrice) : null,
          saleStartAt: d(r.saleStartAt) ?? null,
          saleEndAt: d(r.saleEndAt) ?? null,
          stock: Number(r.stock ?? 0),
          lowStockThreshold: Number(r.lowStockThreshold ?? 5),
          isNew: Boolean(r.isNew ?? true),
          isActive: Boolean(r.isActive ?? true),
          rating: Number(r.rating ?? 0),
          reviewsCount: Number(r.reviewsCount ?? 0),
          oemNumber: r.oemNumber as string | null ?? null,
          b2bPrice: r.b2bPrice != null ? Number(r.b2bPrice) : null,
          categoryId: r.categoryId as string,
          brandId: r.brandId as string | null ?? null,
          createdAt: dr(r.createdAt),
          updatedAt: dr(r.updatedAt),
        })),
      });

      // Restore crossSells many-to-many
      for (const r of productRows) {
        const ids = r.crossSellIds as string[] | undefined;
        if (ids && ids.length > 0) {
          await prisma.product.update({
            where: { id: r.id as string },
            data: { crossSells: { connect: ids.map((id) => ({ id })) } },
          }).catch(() => {});
        }
      }
    }

    if (safe("productImages").length) {
      await prisma.productImage.createMany({
        data: safe("productImages").map((r) => ({
          id: r.id as string,
          url: r.url as string,
          alt: r.alt as string | null ?? null,
          productId: r.productId as string,
          isMain: Boolean(r.isMain ?? false),
        })),
      });
    }

    if (safe("productVariants").length) {
      await prisma.productVariant.createMany({
        data: safe("productVariants").map((r) => ({
          id: r.id as string,
          productId: r.productId as string,
          type: r.type as string,
          label: r.label as string,
          value: r.value as string,
          order: Number(r.order ?? 0),
        })),
      });
    }

    if (safe("reviews").length) {
      await prisma.review.createMany({
        data: safe("reviews").map((r) => ({
          id: r.id as string,
          rating: Number(r.rating),
          comment: r.comment as string | null ?? null,
          userId: r.userId as string,
          productId: r.productId as string,
          verifiedPurchase: Boolean(r.verifiedPurchase ?? false),
          createdAt: dr(r.createdAt),
        })),
      });
    }

    // ── Carts & Wishlists ──────────────────────────────────────────

    if (safe("carts").length) {
      await prisma.cart.createMany({
        data: safe("carts").map((r) => ({
          id: r.id as string,
          userId: r.userId as string,
          createdAt: dr(r.createdAt),
          updatedAt: dr(r.updatedAt),
        })),
      });
    }

    if (safe("cartItems").length) {
      await prisma.cartItem.createMany({
        data: safe("cartItems").map((r) => ({
          id: r.id as string,
          cartId: r.cartId as string,
          productId: r.productId as string,
          variantId: r.variantId as string | null ?? null,
          quantity: Number(r.quantity ?? 1),
        })),
      });
    }

    if (safe("wishlists").length) {
      await prisma.wishlist.createMany({
        data: safe("wishlists").map((r) => ({
          id: r.id as string,
          userId: r.userId as string,
          shareToken: r.shareToken as string | null ?? null,
          createdAt: dr(r.createdAt),
          updatedAt: dr(r.updatedAt),
        })),
      });
    }

    if (safe("wishlistItems").length) {
      await prisma.wishlistItem.createMany({
        data: safe("wishlistItems").map((r) => ({
          id: r.id as string,
          wishlistId: r.wishlistId as string,
          productId: r.productId as string,
        })),
      });
    }

    // ── User extras ────────────────────────────────────────────────

    if (safe("addresses").length) {
      await prisma.address.createMany({
        data: safe("addresses").map((r) => ({
          id: r.id as string,
          userId: r.userId as string,
          label: r.label as string ?? "المنزل",
          fullName: r.fullName as string,
          phone: r.phone as string,
          address: r.address as string,
          city: r.city as string,
          isDefault: Boolean(r.isDefault ?? false),
          createdAt: dr(r.createdAt),
          updatedAt: dr(r.updatedAt),
        })),
      });
    }

    if (safe("loyaltyTransactions").length) {
      await prisma.loyaltyTransaction.createMany({
        data: safe("loyaltyTransactions").map((r) => ({
          id: r.id as string,
          userId: r.userId as string,
          points: Number(r.points),
          type: r.type as string,
          description: r.description as string | null ?? null,
          orderId: r.orderId as string | null ?? null,
          createdAt: dr(r.createdAt),
        })),
      });
    }

    if (safe("couponUsages").length) {
      await prisma.couponUsage.createMany({
        data: safe("couponUsages").map((r) => ({
          id: r.id as string,
          couponId: r.couponId as string,
          userId: r.userId as string,
          orderId: r.orderId as string | null ?? null,
          createdAt: dr(r.createdAt),
        })),
      });
    }

    // ── Orders ─────────────────────────────────────────────────────

    if (safe("orders").length) {
      await prisma.order.createMany({
        data: safe("orders").map((r) => ({
          id: r.id as string,
          userId: r.userId as string | null ?? null,
          guestEmail: r.guestEmail as string | null ?? null,
          totalAmount: Number(r.totalAmount),
          shippingCost: Number(r.shippingCost ?? 0),
          couponCode: r.couponCode as string | null ?? null,
          discountAmount: Number(r.discountAmount ?? 0),
          taxAmount: Number(r.taxAmount ?? 0),
          status: r.status as string ?? "PENDING",
          paymentMethod: r.paymentMethod as string ?? "COD",
          paymentStatus: r.paymentStatus as string ?? "PENDING",
          shippingName: r.shippingName as string,
          shippingPhone: r.shippingPhone as string,
          shippingAddress: r.shippingAddress as string,
          shippingCity: r.shippingCity as string,
          createdAt: dr(r.createdAt),
          updatedAt: dr(r.updatedAt),
        })),
      });
    }

    if (safe("orderItems").length) {
      await prisma.orderItem.createMany({
        data: safe("orderItems").map((r) => ({
          id: r.id as string,
          orderId: r.orderId as string,
          productId: r.productId as string,
          variantId: r.variantId as string | null ?? null,
          variantLabel: r.variantLabel as string | null ?? null,
          quantity: Number(r.quantity),
          price: Number(r.price),
        })),
      });
    }

    if (safe("returnRequests").length) {
      await prisma.returnRequest.createMany({
        data: safe("returnRequests").map((r) => ({
          id: r.id as string,
          orderId: r.orderId as string,
          userId: r.userId as string,
          reason: r.reason as string,
          details: r.details as string,
          status: r.status as string ?? "PENDING",
          adminNote: r.adminNote as string | null ?? null,
          createdAt: dr(r.createdAt),
          updatedAt: dr(r.updatedAt),
        })),
      });
    }

    // ── Step 4: Re-enable FK constraints ──────────────────────────
    await prisma.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS = 1");

    // Record restore timestamp
    await prisma.systemSetting.upsert({
      where: { key: "backup_last_restore" },
      update: { value: new Date().toISOString() },
      create: { key: "backup_last_restore", value: new Date().toISOString() },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: "تم استعادة البيانات بنجاح",
      stats: {
        users: safe("users").length,
        products: safe("products").length,
        orders: safe("orders").length,
        categories: safe("categories").length,
      },
    });
  } catch (err) {
    // Re-enable FK even on error
    await prisma.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS = 1").catch(() => {});
    console.error("Restore error:", err);
    return NextResponse.json(
      { error: "فشل الاستعادة: " + (err instanceof Error ? err.message : "خطأ غير معروف") },
      { status: 500 }
    );
  }
}
