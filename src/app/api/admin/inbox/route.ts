import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { SettingsService } from "@/services/settings.service";
import { ImapFlow } from "imapflow";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ADMIN" && user.role !== "MANAGER")) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const cfg = await SettingsService.getEmailSettings();
    if (!cfg.imapEnabled || !cfg.imapHost || !cfg.imapUser || !cfg.imapPassword) {
      return NextResponse.json({ error: "IMAP غير مفعّل. فعّله من إعدادات البريد أولاً." }, { status: 400 });
    }

    const rawLimit = parseInt(req.nextUrl.searchParams.get("limit") ?? "30", 10);
    const limit = isNaN(rawLimit) || rawLimit < 1 ? 30 : Math.min(rawLimit, 100);

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

      // Get all UIDs via SEARCH ALL (UID-mode) so we select by real UID, not
      // sequence number. Sequence numbers shift after deletions; UIDs are stable.
      // ImapFlow returns false (not []) when the search yields no results.
      const searchResult = await client.search({ all: true }, { uid: true });
      const allUids: number[] = Array.isArray(searchResult) ? searchResult : [];
      const total = allUids.length;

      if (total === 0) {
        return NextResponse.json({ messages: [], total: 0 });
      }

      // Take the last `limit` UIDs (highest = most recent)
      const recentUids = allUids.slice(-limit);
      const uidRange = recentUids.join(",");

      const messages: Array<{
        uid: number;
        subject: string;
        from: string;
        fromEmail: string;
        date: string;
        seen: boolean;
        snippet: string;
      }> = [];

      for await (const msg of client.fetch(uidRange, {
        envelope: true,
        flags: true,
      }, { uid: true })) {
        const from = msg.envelope?.from?.[0];
        const fromName = from?.name || from?.address || "";
        const fromEmail = from?.address ?? "";
        const subject = msg.envelope?.subject || "(بدون موضوع)";
        const date = msg.envelope?.date?.toISOString() ?? new Date().toISOString();
        const seen = msg.flags?.has("\\Seen") ?? false;

        messages.push({
          uid: msg.uid,
          subject,
          from: fromName,
          fromEmail,
          date,
          seen,
          snippet: "",
        });
      }

      // Return newest first
      return NextResponse.json({ messages: messages.reverse(), total });
    } finally {
      await client.logout().catch(() => {});
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "خطأ في الاتصال بـ IMAP";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
