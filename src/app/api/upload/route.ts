import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "MANAGER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const folder = formData.get("folder") as string || "misc"; 
    const files = formData.getAll("file") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const urls: string[] = [];
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);

    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true });

    for (const file of files) {
      if (!(file instanceof File)) continue;
      
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = file.name.split(".").pop();
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
      const filePath = path.join(uploadDir, filename);

      await writeFile(filePath, buffer);
      urls.push(`/uploads/${folder}/${filename}`);
    }

    return NextResponse.json({ urls });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
