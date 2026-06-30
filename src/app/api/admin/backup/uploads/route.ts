import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "MANAGER")) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const uploadsDir = path.resolve(process.cwd(), "public", "uploads");

  if (!fs.existsSync(uploadsDir)) {
    return NextResponse.json({ error: "مجلد الصور غير موجود" }, { status: 404 });
  }

  const zip = new AdmZip();
  zip.addLocalFolder(uploadsDir, "uploads");

  const buffer = zip.toBuffer();

  if (buffer.length < 100) {
    return NextResponse.json({ error: "لا توجد صور للنسخ الاحتياطي" }, { status: 404 });
  }

  const filename = `tashtep-uploads-${new Date().toISOString().slice(0, 10)}.zip`;

  await prisma.systemSetting.upsert({
    where: { key: "backup_last_uploads" },
    update: { value: new Date().toISOString() },
    create: { key: "backup_last_uploads", value: new Date().toISOString() },
  }).catch(() => {});

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(buffer.length),
    },
  });
}
