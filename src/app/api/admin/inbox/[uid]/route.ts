import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { SettingsService } from "@/services/settings.service";
import { ImapFlow } from "imapflow";
import iconv from "iconv-lite";

export const dynamic = "force-dynamic";

// Unfold RFC 2822 header continuation lines (CRLF + whitespace → single space)
function unfoldHeaders(headers: string): string {
  return headers.replace(/\r\n[ \t]/g, " ");
}

// Decode a single MIME leaf part given its headers and raw body string.
// Handles base64 and quoted-printable encoding, and non-UTF-8 charsets (e.g. windows-1256).
function decodeMimePart(rawHeaders: string, rawBody: string): string {
  const headers = unfoldHeaders(rawHeaders);

  const cteMatch = headers.match(/content-transfer-encoding:\s*(\S+)/i);
  const cte = cteMatch?.[1]?.toLowerCase() ?? "";

  // Extract charset — default to utf-8 if absent
  const charsetMatch = headers.match(/charset=(?:"([^"]+)"|([^\s;]+))/i);
  const charset = (charsetMatch?.[1] ?? charsetMatch?.[2] ?? "utf-8").trim().toLowerCase();
  const isUtf8 = charset === "utf-8" || charset === "utf8" || charset === "us-ascii" || charset === "ascii";

  if (cte === "base64") {
    try {
      const buf = Buffer.from(rawBody.replace(/\s+/g, ""), "base64");
      rawBody = isUtf8 ? buf.toString("utf-8") : iconv.decode(buf, charset);
    } catch {}
  } else if (cte === "quoted-printable") {
    // Decode =HH escape sequences to raw byte values
    const qpDecoded = rawBody
      .replace(/=\r?\n/g, "")
      .replace(/=([0-9A-Fa-f]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
    if (!isUtf8) {
      try {
        rawBody = iconv.decode(Buffer.from(qpDecoded, "binary"), charset);
      } catch {
        rawBody = qpDecoded;
      }
    } else {
      rawBody = qpDecoded;
    }
  } else {
    // 8bit, 7bit, or no CTE — raw bytes already in binary/latin-1 string.
    // Re-decode from the actual charset (covers windows-1256 8bit Arabic emails).
    try {
      rawBody = iconv.decode(Buffer.from(rawBody, "binary"), charset);
    } catch {
      // Unsupported charset — at least recover valid UTF-8
      rawBody = Buffer.from(rawBody, "binary").toString("utf-8");
    }
  }

  if (headers.match(/content-type:\s*text\/html/i)) {
    rawBody = rawBody.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  }

  return rawBody;
}

// Walk the MIME tree and return the best readable text (text/plain preferred).
// Handles nested multipart/alternative, multipart/mixed, etc.
function extractMimeBody(raw: string): string {
  // Normalize bare LF → CRLF so servers that don't send RFC 2822-compliant
  // line endings still parse correctly.
  const normalized = raw.replace(/\r?\n/g, "\r\n");
  const headerEnd = normalized.indexOf("\r\n\r\n");
  const rawHeaders = headerEnd !== -1 ? normalized.slice(0, headerEnd) : "";
  const headers = unfoldHeaders(rawHeaders);
  const rawBody = headerEnd !== -1 ? normalized.slice(headerEnd + 4) : normalized;

  const ctMatch = headers.match(/content-type:\s*([^\r\n;]+)/i);
  const contentType = ctMatch?.[1]?.toLowerCase().trim() ?? "";

  if (contentType.startsWith("multipart/")) {
    const boundaryMatch = headers.match(/boundary=(?:"([^"]+)"|([^\s;]+))/i);
    const boundary = boundaryMatch?.[1] ?? boundaryMatch?.[2] ?? "";
    if (!boundary) return rawBody.slice(0, 5000);

    const parts = rawBody.split(`--${boundary}`);
    let textResult = "";
    let htmlResult = "";

    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed === "" || trimmed === "--") continue;
      const partHeaderEnd = part.indexOf("\r\n\r\n");
      if (partHeaderEnd === -1) continue;
      const partHeaders = part.slice(0, partHeaderEnd);
      const partHeadersUnfolded = unfoldHeaders(partHeaders);
      const partBody = part.slice(partHeaderEnd + 4).replace(/\r\n$/, "");

      const partCtMatch = partHeadersUnfolded.match(/content-type:\s*([^\r\n;]+)/i);
      const partCt = partCtMatch?.[1]?.toLowerCase().trim() ?? "";

      if (partCt.startsWith("multipart/")) {
        // Nested multipart — recurse with a synthetic full MIME message
        const nested = extractMimeBody(part.trim());
        if (nested && !textResult) textResult = nested;
      } else if (partCt.startsWith("text/plain") && !textResult) {
        textResult = decodeMimePart(partHeaders, partBody);
      } else if (partCt.startsWith("text/html") && !htmlResult) {
        htmlResult = decodeMimePart(partHeaders, partBody);
      }
    }

    return (textResult || htmlResult).slice(0, 5000);
  }

  return decodeMimePart(headers, rawBody).slice(0, 5000);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "MANAGER")) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const { uid } = await params;
    const uidNum = parseInt(uid, 10);
    if (isNaN(uidNum) || uidNum < 1) {
      return NextResponse.json({ error: "معرّف الرسالة غير صحيح" }, { status: 400 });
    }

    const cfg = await SettingsService.getEmailSettings();
    if (!cfg.imapEnabled || !cfg.imapHost || !cfg.imapUser || !cfg.imapPassword) {
      return NextResponse.json({ error: "IMAP غير مفعّل أو بيانات الاتصال ناقصة" }, { status: 400 });
    }

    const client = new ImapFlow({
      host: cfg.imapHost,
      port: cfg.imapPort,
      secure: cfg.imapSecure,
      auth: { user: cfg.imapUser, pass: cfg.imapPassword },
      logger: false,
    });

    await client.connect();

    try {
      await client.mailboxOpen("INBOX");

      let body = "";
      let envelope: Record<string, unknown> = {};

      // Fetch by UID so sequence shifts don't affect the result
      for await (const msg of client.fetch(String(uidNum), {
        envelope: true,
        source: true,
      }, { uid: true })) {
        const fromObj = msg.envelope?.from?.[0];
        envelope = {
          subject: msg.envelope?.subject ?? "",
          from: fromObj
            ? `${fromObj.name || ""} <${fromObj.address ?? ""}>`.trim()
            : "",
          date: msg.envelope?.date?.toISOString() ?? "",
        };

        if (msg.source) {
          // Use binary (latin-1) encoding to preserve raw bytes intact.
          // Charset-specific decoding happens later inside decodeMimePart via iconv.
          const raw = Buffer.isBuffer(msg.source)
            ? msg.source.toString("binary")
            : String(msg.source);
          body = extractMimeBody(raw);
        }
      }

      // UID not found in mailbox (deleted between list and detail fetch)
      if (Object.keys(envelope).length === 0) {
        return NextResponse.json({ error: "الرسالة غير موجودة" }, { status: 404 });
      }

      // Mark as seen using UID mode
      await client.messageFlagsAdd(String(uidNum), ["\\Seen"], { uid: true });

      return NextResponse.json({ envelope, body });
    } finally {
      await client.logout().catch(() => {});
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "خطأ في الاتصال بـ IMAP";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
