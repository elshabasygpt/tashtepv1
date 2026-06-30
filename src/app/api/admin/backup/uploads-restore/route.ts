import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "ADMIN فقط" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "لم يتم إرسال ملف" }, { status: 400 });
    }

    if (!file.name.endsWith(".zip")) {
      return NextResponse.json({ error: "يجب أن يكون الملف بصيغة ZIP" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Validate it's a real ZIP
    if (buffer[0] !== 0x50 || buffer[1] !== 0x4b) {
      return NextResponse.json({ error: "الملف ليس ZIP صالح" }, { status: 400 });
    }

    const zip = new AdmZip(buffer);
    const entries = zip.getEntries();

    if (entries.length === 0) {
      return NextResponse.json({ error: "ملف ZIP فارغ" }, { status: 400 });
    }

    const uploadsDir = path.resolve(process.cwd(), "public", "uploads");

    // Wipe existing uploads
    if (fs.existsSync(uploadsDir)) {
      fs.rmSync(uploadsDir, { recursive: true, force: true });
    }
    fs.mkdirSync(uploadsDir, { recursive: true });

    // Extract — only allow image files for security
    const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
    let extracted = 0;
    let skipped = 0;

    for (const entry of entries) {
      if (entry.isDirectory) continue;

      const entryName = entry.entryName;
      const ext = path.extname(entryName).toLowerCase();

      if (!ALLOWED_EXT.has(ext)) {
        skipped++;
        continue;
      }

      // Prevent path traversal
      const safeName = entryName.replace(/\.\.\//g, "").replace(/\.\.\\/g, "");
      const destPath = path.resolve(uploadsDir, "..", safeName);

      // Ensure the destination is inside public/
      const publicDir = path.resolve(process.cwd(), "public");
      if (!destPath.startsWith(publicDir)) {
        skipped++;
        continue;
      }

      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.writeFileSync(destPath, entry.getData());
      extracted++;
    }

    await prisma.systemSetting.upsert({
      where: { key: "backup_last_uploads_restore" },
      update: { value: new Date().toISOString() },
      create: { key: "backup_last_uploads_restore", value: new Date().toISOString() },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: `تمت استعادة الصور بنجاح`,
      stats: { extracted, skipped },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "خطأ غير متوقع";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
