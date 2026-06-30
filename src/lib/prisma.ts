import { PrismaClient } from "@prisma/client";
import { unstable_noStore } from "next/cache";
import "@/lib/env";

function makePrismaClient() {
  const base = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

  return base.$extends({
    query: {
      $allModels: {
        async $allOperations({ args, query }) {
          try {
            unstable_noStore();
          } catch {}
          return query(args);
        },
      },
    },
  });
}

type ExtendedClient = ReturnType<typeof makePrismaClient>;
const globalForPrisma = globalThis as unknown as { prisma: ExtendedClient };

export const prisma = globalForPrisma.prisma ?? makePrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

