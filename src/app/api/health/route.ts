import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  let dbStatus = "disconnected";
  
  try {
    // Ping the database to verify connection
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = "connected";
  } catch {
    dbStatus = "error";
  }

  return NextResponse.json(
    {
      status: "ok",
      version: "1.1.0",
      database: dbStatus,
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
