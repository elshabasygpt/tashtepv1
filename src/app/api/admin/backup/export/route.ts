import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "MANAGER")) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const [
    users, accounts, sessions, verificationTokens,
    brands, categories,
    products,
    productImages, productVariants,
    reviews, carts, cartItems,
    wishlists, wishlistItems,
    addresses, loyaltyTransactions,
    coupons, couponUsages,
    giftCards,
    orders, orderItems, returnRequests,
    governorates, systemSettings,
    articles, newsletterSubscribers, contactMessages,
  ] = await Promise.all([
    prisma.user.findMany(),
    prisma.account.findMany(),
    prisma.session.findMany(),
    prisma.verificationToken.findMany(),
    prisma.brand.findMany(),
    prisma.category.findMany(),
    prisma.product.findMany({ include: { crossSells: { select: { id: true } } } }),
    prisma.productImage.findMany(),
    prisma.productVariant.findMany(),
    prisma.review.findMany(),
    prisma.cart.findMany(),
    prisma.cartItem.findMany(),
    prisma.wishlist.findMany(),
    prisma.wishlistItem.findMany(),
    prisma.address.findMany(),
    prisma.loyaltyTransaction.findMany(),
    prisma.coupon.findMany(),
    prisma.couponUsage.findMany(),
    prisma.giftCard.findMany(),
    prisma.order.findMany(),
    prisma.orderItem.findMany(),
    prisma.returnRequest.findMany(),
    prisma.governorate.findMany(),
    prisma.systemSetting.findMany(),
    prisma.article.findMany(),
    prisma.newsletterSubscriber.findMany(),
    prisma.contactMessage.findMany(),
  ]);

  const backup = {
    version: "2.0",
    createdAt: new Date().toISOString(),
    dbProvider: "mysql",
    tables: {
      users,
      accounts,
      sessions,
      verificationTokens,
      brands,
      categories,
      products: products.map((p) => ({
        ...p,
        crossSellIds: p.crossSells.map((c) => c.id),
        crossSells: undefined,
      })),
      productImages,
      productVariants,
      reviews,
      carts,
      cartItems,
      wishlists,
      wishlistItems,
      addresses,
      loyaltyTransactions,
      coupons,
      couponUsages,
      giftCards,
      orders,
      orderItems,
      returnRequests,
      governorates,
      systemSettings,
      articles,
      newsletterSubscribers,
      contactMessages,
    },
  };

  // Record last backup timestamp
  await prisma.systemSetting.upsert({
    where: { key: "backup_last_json" },
    update: { value: new Date().toISOString() },
    create: { key: "backup_last_json", value: new Date().toISOString() },
  }).catch(() => {});

  const filename = `tashtep-backup-${new Date().toISOString().slice(0, 10)}.json`;

  return new NextResponse(JSON.stringify(backup, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
