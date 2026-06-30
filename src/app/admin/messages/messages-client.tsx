"use client";

import * as React from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sendReplyAction } from "@/actions/settings.actions";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Date | string;
}

interface ImapMessage {
  uid: number;
  subject: string;
  from: string;
  fromEmail: string;
  date: string;
  seen: boolean;
  snippet: string;
}

interface Props {
  messages: ContactMessage[];
  imapEnabled: boolean;
  defaultTab: "contact" | "inbox";
  read?: string;
}

export function MessagesClient({ messages, imapEnabled, defaultTab, read }: Props) {
  const [tab, setTab] = React.useState<"contact" | "inbox">(defaultTab);

  return (
    <div>
      {/* Tab switcher */}
      <div className="flex gap-2 mb-6 border-b border-stone">
        <button
          onClick={() => setTab("contact")}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${
            tab === "contact"
              ? "border-tashtep-orange text-tashtep-orange"
              : "border-transparent text-secondary hover:text-obsidian"
          }`}
        >
          <span className="material-symbols-outlined text-[16px] ml-1 align-middle">mail</span>
          رسائل نموذج التواصل
        </button>
        <button
          onClick={() => setTab("inbox")}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${
            tab === "inbox"
              ? "border-tashtep-orange text-tashtep-orange"
              : "border-transparent text-secondary hover:text-obsidian"
          }`}
        >
          <span className="material-symbols-outlined text-[16px] ml-1 align-middle">inbox</span>
          صندوق الوارد (IMAP)
          {!imapEnabled && (
            <span className="mr-2 text-[10px] bg-stone text-secondary px-1.5 py-0.5 rounded">غير مفعّل</span>
          )}
        </button>
      </div>

      {tab === "contact" && (
        <ContactMessagesTab messages={messages} read={read} />
      )}
      {tab === "inbox" && (
        <ImapInboxTab imapEnabled={imapEnabled} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Contact form messages tab
// ---------------------------------------------------------------------------

function ContactMessagesTab({ messages, read }: { messages: ContactMessage[]; read?: string }) {
  return (
    <>
      <div className="flex items-center gap-2 text-sm mb-4">
        <a href="/admin/messages" className={`px-3 py-1.5 rounded-lg border transition-colors ${!read ? "bg-obsidian text-white border-obsidian" : "border-stone text-secondary hover:border-obsidian"}`}>
          الكل
        </a>
        <a href="/admin/messages?read=0" className={`px-3 py-1.5 rounded-lg border transition-colors ${read === "0" ? "bg-obsidian text-white border-obsidian" : "border-stone text-secondary hover:border-obsidian"}`}>
          غير مقروءة
        </a>
        <a href="/admin/messages?read=1" className={`px-3 py-1.5 rounded-lg border transition-colors ${read === "1" ? "bg-obsidian text-white border-obsidian" : "border-stone text-secondary hover:border-obsidian"}`}>
          مقروءة
        </a>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white border border-stone rounded-xl p-12 text-center text-secondary">
          <span className="material-symbols-outlined text-4xl block mb-3 opacity-40">mail</span>
          لا توجد رسائل
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <ContactMessageCard key={msg.id} msg={msg} />
          ))}
        </div>
      )}
    </>
  );
}

function ContactMessageCard({ msg }: { msg: ContactMessage }) {
  const [expanded, setExpanded] = React.useState(false);
  const [showReply, setShowReply] = React.useState(false);

  return (
    <div className={`bg-white border rounded-xl p-5 transition-all ${msg.isRead ? "border-stone/60 opacity-80" : "border-tashtep-orange/30 shadow-sm"}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-bold text-obsidian">{msg.name}</span>
            <span className="text-secondary text-sm font-technical-mono">{msg.email}</span>
            {!msg.isRead && <Badge className="bg-tashtep-orange text-white text-[10px] px-2 py-0">جديد</Badge>}
          </div>
          <p className="font-medium text-sm text-obsidian mb-2">{msg.subject}</p>
          <p
            className={`text-secondary text-sm leading-relaxed ${expanded ? "" : "line-clamp-3"}`}
            style={{ whiteSpace: "pre-wrap" }}
          >
            {msg.message}
          </p>
          {msg.message.length > 150 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-tashtep-orange hover:underline mt-1"
            >
              {expanded ? "عرض أقل" : "عرض الكل"}
            </button>
          )}
        </div>
        <div className="text-xs text-secondary shrink-0 text-left">
          {new Date(msg.createdAt).toLocaleDateString("ar-EG")}
          <br />
          {new Date(msg.createdAt).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-stone/50">
        <button
          onClick={() => setShowReply(!showReply)}
          className="text-xs flex items-center gap-1 text-tashtep-orange hover:underline"
        >
          <span className="material-symbols-outlined text-[14px]">reply</span>
          رد على العميل
        </button>
        <MarkReadButton id={msg.id} isRead={msg.isRead} />
      </div>

      {showReply && (
        <ReplyForm
          to={msg.email}
          customerName={msg.name}
          originalSubject={msg.subject}
          onClose={() => setShowReply(false)}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// IMAP inbox tab
// ---------------------------------------------------------------------------

function ImapInboxTab({ imapEnabled }: { imapEnabled: boolean }) {
  const [messages, setMessages] = React.useState<ImapMessage[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selected, setSelected] = React.useState<ImapMessage | null>(null);
  const [body, setBody] = React.useState<string>("");
  const [loadingBody, setLoadingBody] = React.useState(false);

  const fetchInbox = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/inbox?limit=30");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessages(data.messages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل تحميل صندوق الوارد");
    } finally {
      setLoading(false);
    }
  };

  const openMessage = async (msg: ImapMessage) => {
    setSelected(msg);
    setBody("");
    setLoadingBody(true);
    try {
      const res = await fetch(`/api/admin/inbox/${msg.uid}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBody(data.body || "");
      // Mark as seen locally
      setMessages(prev => prev.map(m => m.uid === msg.uid ? { ...m, seen: true } : m));
    } catch {
      setBody("تعذّر تحميل محتوى الرسالة.");
    } finally {
      setLoadingBody(false);
    }
  };

  if (!imapEnabled) {
    return (
      <div className="bg-white border border-stone rounded-xl p-12 text-center">
        <span className="material-symbols-outlined text-4xl block mb-3 opacity-40 text-secondary">inbox</span>
        <p className="text-secondary text-sm mb-4">IMAP غير مفعّل حالياً</p>
        <a
          href="/admin/settings/email"
          className="inline-flex items-center gap-2 text-sm text-tashtep-orange hover:underline"
        >
          <span className="material-symbols-outlined text-[16px]">settings</span>
          تفعيل من إعدادات البريد
        </a>
      </div>
    );
  }

  if (selected) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-1 text-sm text-secondary hover:text-obsidian"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          العودة لصندوق الوارد
        </button>

        <div className="bg-white border border-stone rounded-xl p-6 space-y-4">
          <div className="border-b pb-4 space-y-1">
            <h3 className="font-bold text-obsidian text-lg">{selected.subject}</h3>
            <p className="text-sm text-secondary">
              من: <span className="text-obsidian">{selected.from}</span>
              {selected.fromEmail && ` <${selected.fromEmail}>`}
            </p>
            <p className="text-xs text-secondary">
              {new Date(selected.date).toLocaleString("ar-EG")}
            </p>
          </div>

          {loadingBody ? (
            <div className="text-center py-8 text-secondary">
              <span className="material-symbols-outlined animate-spin text-3xl block mb-2">progress_activity</span>
              جاري تحميل الرسالة...
            </div>
          ) : (
            <div className="text-sm text-obsidian leading-relaxed whitespace-pre-wrap font-technical-mono bg-stone/30 p-4 rounded-lg max-h-80 overflow-y-auto">
              {body || "الرسالة فارغة"}
            </div>
          )}

          <div className="pt-4 border-t">
            <ReplyForm
              to={selected.fromEmail}
              customerName={selected.from}
              originalSubject={selected.subject}
              onClose={() => setSelected(null)}
              alwaysVisible
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-secondary">
          {messages.length > 0 ? `${messages.length} رسالة` : "لا توجد رسائل محملة"}
        </p>
        <Button
          variant="outline"
          onClick={fetchInbox}
          disabled={loading}
          className="border-stone text-obsidian hover:bg-stone/50"
          size="sm"
        >
          <span className={`material-symbols-outlined text-[16px] ml-1 ${loading ? "animate-spin" : ""}`}>
            {loading ? "progress_activity" : "refresh"}
          </span>
          {loading ? "جاري التحميل..." : messages.length > 0 ? "تحديث" : "تحميل صندوق الوارد"}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          <strong>خطأ:</strong> {error}
          <br />
          <span className="text-xs mt-1 block">تحقق من إعدادات IMAP في صفحة إعدادات البريد.</span>
        </div>
      )}

      {messages.length === 0 && !loading && !error && (
        <div className="bg-white border border-stone rounded-xl p-12 text-center text-secondary">
          <span className="material-symbols-outlined text-4xl block mb-3 opacity-40">inbox</span>
          اضغط &ldquo;تحميل صندوق الوارد&rdquo; لعرض رسائلك
        </div>
      )}

      {messages.length > 0 && (
        <div className="space-y-2">
          {messages.map((msg) => (
            <button
              key={msg.uid}
              onClick={() => openMessage(msg)}
              className={`w-full text-right bg-white border rounded-xl p-4 hover:border-tashtep-orange/50 transition-all ${
                msg.seen ? "border-stone/60 opacity-80" : "border-tashtep-orange/30 shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`font-bold text-sm ${msg.seen ? "text-secondary" : "text-obsidian"}`}>
                      {msg.from || msg.fromEmail}
                    </span>
                    {!msg.seen && (
                      <span className="w-2 h-2 bg-tashtep-orange rounded-full shrink-0" />
                    )}
                  </div>
                  <p className={`text-sm mb-1 ${msg.seen ? "font-normal text-secondary" : "font-semibold text-obsidian"}`}>
                    {msg.subject}
                  </p>
                  {msg.snippet && (
                    <p className="text-xs text-secondary line-clamp-1">{msg.snippet}</p>
                  )}
                </div>
                <span className="text-xs text-secondary shrink-0">
                  {new Date(msg.date).toLocaleDateString("ar-EG")}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reply form (shared by both tabs)
// ---------------------------------------------------------------------------

function ReplyForm({
  to,
  customerName,
  originalSubject,
  onClose,
  alwaysVisible = false,
}: {
  to: string;
  customerName: string;
  originalSubject: string;
  onClose: () => void;
  alwaysVisible?: boolean;
}) {
  const [body, setBody] = React.useState("");
  const [sending, setSending] = React.useState(false);

  const handleSend = async () => {
    if (!body.trim()) {
      toast.error("الرجاء كتابة نص الرد");
      return;
    }
    setSending(true);
    try {
      const result = await sendReplyAction({ to, customerName, originalSubject, replyBody: body });
      if (result.success) {
        toast.success("تم إرسال الرد بنجاح ✅");
        setBody("");
        if (!alwaysVisible) onClose();
      } else {
        toast.error(result.error || "فشل إرسال الرد");
      }
    } catch {
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-4 bg-stone/30 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm text-secondary">
        <span className="material-symbols-outlined text-[16px]">reply</span>
        الرد على: <strong className="text-obsidian">{customerName}</strong>
        <span className="font-technical-mono text-xs">({to})</span>
      </div>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={5}
        className="w-full border border-stone rounded-lg p-3 text-sm focus:outline-none focus:border-tashtep-orange resize-none bg-white"
        placeholder="اكتب ردك هنا..."
        dir="auto"
      />
      <div className="flex items-center gap-3">
        <Button
          onClick={handleSend}
          disabled={sending}
          className="bg-tashtep-orange text-white hover:bg-tashtep-orange/90"
          size="sm"
        >
          <span className="material-symbols-outlined text-[16px] ml-1">send</span>
          {sending ? "جاري الإرسال..." : "إرسال الرد"}
        </Button>
        {!alwaysVisible && (
          <button onClick={onClose} className="text-sm text-secondary hover:text-obsidian">
            إلغاء
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mark read button
// ---------------------------------------------------------------------------

function MarkReadButton({ id, isRead }: { id: string; isRead: boolean }) {
  return (
    <form action={`/api/admin/messages/${id}/read`} method="POST">
      <button
        type="submit"
        className="text-xs flex items-center gap-1 text-secondary hover:text-obsidian transition-colors"
      >
        <span className="material-symbols-outlined text-[14px]">{isRead ? "mark_email_unread" : "mark_email_read"}</span>
        {isRead ? "تحديد كغير مقروء" : "تحديد كمقروء"}
      </button>
    </form>
  );
}
