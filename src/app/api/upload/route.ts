import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getCurrentUser } from "@/lib/auth";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif", "avif"]);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_FILES = 10;

const ALLOWED_FOLDERS = new Set(["products", "categories", "blog", "settings", "misc"]);

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "MANAGER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const folder = (formData.get("folder") as string) || "misc";

    if (!ALLOWED_FOLDERS.has(folder)) {
      return NextResponse.json({ error: "Invalid upload folder" }, { status: 400 });
    }

    const files = formData.getAll("file") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json({ error: `Maximum ${MAX_FILES} files per upload` }, { status: 400 });
    }

    const urls: string[] = [];
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(uploadDir, { recursive: true });

    for (const file of files) {
      if (!(file instanceof File)) continue;

      // Size check
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File "${file.name}" exceeds 5MB limit` },
          { status: 400 }
        );
      }

      // MIME type check
      if (!ALLOWED_MIME_TYPES.has(file.type)) {
        return NextResponse.json(
          { error: `File type "${file.type}" is not allowed. Only images (JPEG, PNG, WebP, GIF, AVIF) are accepted.` },
          { status: 400 }
        );
      }

      // Extension check (defense in depth)
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      if (!ALLOWED_EXTENSIONS.has(ext)) {
        return NextResponse.json(
          { error: `File extension ".${ext}" is not allowed` },
          { status: 400 }
        );
      }

      // Verify magic bytes match declared MIME type
      const buffer = Buffer.from(await file.arrayBuffer());
      if (!isMagicBytesValid(buffer, file.type)) {
        return NextResponse.json(
          { error: `File "${file.name}" content does not match its declared type` },
          { status: 400 }
        );
      }

      const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
      const filePath = path.join(uploadDir, safeName);
      await writeFile(filePath, buffer);
      urls.push(`/uploads/${folder}/${safeName}`);
    }

    return NextResponse.json({ urls });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

function isMagicBytesValid(buf: Buffer, mime: string): boolean {
  if (buf.length < 4) return false;
  switch (mime) {
    case "image/jpeg":
    case "image/jpg":
      return buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
    case "image/png":
      return buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
    case "image/gif":
      return buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46;
    case "image/webp":
      return buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46;
    case "image/avif":
      // ftyp box at offset 4
      return buf.length > 8 && buf.slice(4, 8).toString("ascii") === "ftyp";
    default:
      return false;
  }
}
