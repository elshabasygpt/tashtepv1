import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "ADMIN فقط" }, { status: 401 });
  }

  // Resolve db file path — Prisma resolves "file:./prisma/dev.db" relative to
  // the schema directory (prisma/), not the project root. Mirror that here.
  const dbUrl = process.env.DATABASE_URL ?? "";
  const relativePath = dbUrl.replace("file:", "");
  const schemaDir = path.resolve(process.cwd(), "prisma");
  const dbPath = path.resolve(schemaDir, relativePath);

  if (!fs.existsSync(dbPath)) {
    return NextResponse.json({ error: "ملف قاعدة البيانات غير موجود" }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(dbPath);
  const filename = `tashtep-db-${new Date().toISOString().slice(0, 10)}.db`;

  // Record timestamp
  await prisma.systemSetting.upsert({
    where: { key: "backup_last_db" },
    update: { value: new Date().toISOString() },
    create: { key: "backup_last_db", value: new Date().toISOString() },
  }).catch(() => {});

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(fileBuffer.length),
    },
  });
}
