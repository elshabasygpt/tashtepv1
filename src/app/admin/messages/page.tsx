import { prisma } from "@/lib/prisma";
import { SettingsService } from "@/services/settings.service";
import { MessagesClient } from "./messages-client";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ read?: string; tab?: string }>;
}) {
  const { read, tab } = await searchParams;

  const where = read === "1" ? { isRead: true } : read === "0" ? { isRead: false } : {};

  const [messages, unreadCount, emailSettings] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
    }),
    prisma.contactMessage.count({ where: { isRead: false } }),
    SettingsService.getEmailSettings(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-headline-md font-bold text-obsidian">رسائل التواصل</h2>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
              {unreadCount} جديد
            </span>
          )}
        </div>
      </div>

      <MessagesClient
        messages={messages}
        imapEnabled={emailSettings.imapEnabled}
        defaultTab={tab === "inbox" ? "inbox" : "contact"}
        read={read}
      />
    </div>
  );
}
