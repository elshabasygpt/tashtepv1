export async function register() {
  if (process.env.NODE_ENV === "production") {
    if (process.env.NEXT_RUNTIME === "nodejs") {
      await import("../sentry.server.config");
    }
    if (process.env.NEXT_RUNTIME === "edge") {
      await import("../sentry.edge.config");
    }
  } else {
    // In dev mode, pre-warm key pages 12s after startup so the middleware and
    // shared vendor chunks are compiled before the first user visit.
    if (process.env.NEXT_RUNTIME === "nodejs") {
      setTimeout(async () => {
        const port = process.env.PORT ?? "3000";
        const base = `http://localhost:${port}`;
        // Hit homepage first to trigger middleware compilation, then other pages.
        await fetch(`${base}/`).catch(() => {});
        await new Promise((r) => setTimeout(r, 3000));
        // After middleware is compiled, warm the dynamic pages.
        try {
          const { prisma } = await import("@/lib/prisma");
          const [product, order] = await Promise.all([
            prisma.product.findFirst({ where: { isActive: true }, select: { id: true } }),
            prisma.order.findFirst({ select: { id: true } }),
          ]);
          await Promise.all([
            fetch(`${base}/products`).catch(() => {}),
            fetch(`${base}/blog`).catch(() => {}),
            product ? fetch(`${base}/products/${product.id}`).catch(() => {}) : Promise.resolve(),
            order ? fetch(`${base}/order-success/${order.id}`).catch(() => {}) : Promise.resolve(),
          ]);
        } catch { /* ignore */ }
      }, 12000);
    }
  }
}

