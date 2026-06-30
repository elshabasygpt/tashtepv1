import { Resend } from "resend";
import nodemailer from "nodemailer";
import { logger } from "@/lib/logger";
import { SettingsService } from "@/services/settings.service";

const BASE_URL = process.env.APP_URL || "http://localhost:3000";

function esc(str: string | null | undefined): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

// ---------------------------------------------------------------------------
// Transport helpers
// ---------------------------------------------------------------------------

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key || key.startsWith("re_dummy") || key === "") {
    return null;
  }
  return new Resend(key);
}

async function getSmtpTransport(): Promise<nodemailer.Transporter | null> {
  try {
    const cfg = await SettingsService.getEmailSettings();
    if (!cfg.smtpEnabled || !cfg.smtpHost || !cfg.smtpUser || !cfg.smtpPassword) {
      return null;
    }
    return nodemailer.createTransport({
      host: cfg.smtpHost,
      port: cfg.smtpPort,
      secure: cfg.smtpSecure,
      auth: { user: cfg.smtpUser, pass: cfg.smtpPassword },
    });
  } catch {
    return null;
  }
}

async function getAdminEmail(): Promise<string> {
  try {
    const cfg = await SettingsService.getEmailSettings();
    return cfg.adminNotificationEmail || "";
  } catch {
    return "";
  }
}

async function getSmtpFrom(): Promise<string> {
  try {
    const cfg = await SettingsService.getEmailSettings();
    const name = cfg.smtpFromName || "تشطيب";
    const addr = cfg.smtpFromEmail || cfg.smtpUser;
    return `${name} <${addr}>`;
  } catch {
    return "تشطيب <noreply@tashtep.com>";
  }
}

// ---------------------------------------------------------------------------
// Core send function — tries SMTP first, falls back to Resend
// ---------------------------------------------------------------------------

async function send(options: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<void> {
  const smtp = await getSmtpTransport();
  if (smtp) {
    try {
      const from = await getSmtpFrom();
      await smtp.sendMail({
        from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        replyTo: options.replyTo,
      });
      return;
    } catch (err) {
      logger.error({ err, to: options.to }, "SMTP send failed — falling back to Resend");
    }
  }

  const resend = getResend();
  if (!resend) {
    logger.warn("No email transport configured — email skipped");
    return;
  }
  try {
    await resend.emails.send({
      from: "تشطيب <noreply@tashtep.com>",
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
    });
  } catch (err) {
    logger.error({ err, to: options.to }, "Resend send failed");
  }
}

// ---------------------------------------------------------------------------
// HTML layout
// ---------------------------------------------------------------------------

function layout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8"/>
  <style>
    body { font-family: Arial, sans-serif; background:#f5f5f5; margin:0; padding:0; direction:rtl; }
    .wrap { max-width:600px; margin:0 auto; background:#fff; border-radius:8px; overflow:hidden; }
    .header { background:#1C1C1E; padding:24px 32px; }
    .header h1 { color:#fff; margin:0; font-size:22px; }
    .body { padding:32px; color:#333; line-height:1.7; }
    .btn { display:inline-block; background:#F97316; color:#fff; padding:12px 28px; border-radius:6px; text-decoration:none; font-weight:bold; }
    .table { width:100%; border-collapse:collapse; margin:16px 0; }
    .table th { background:#f5f5f5; padding:10px 12px; text-align:right; font-size:13px; color:#666; }
    .table td { padding:10px 12px; border-bottom:1px solid #eee; font-size:14px; }
    .total { background:#FFF7ED; padding:16px; border-radius:6px; margin-top:16px; }
    .footer { background:#f5f5f5; padding:16px 32px; font-size:12px; color:#999; text-align:center; }
    .status-badge { display:inline-block; padding:4px 12px; border-radius:20px; font-size:13px; font-weight:bold; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header"><h1>🏠 تشطيب</h1></div>
    <div class="body">${body}</div>
    <div class="footer">© ${new Date().getFullYear()} تشطيب — جميع الحقوق محفوظة</div>
  </div>
</body>
</html>`;
}

const ORDER_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING:    { label: "قيد الانتظار",  color: "#F59E0B" },
  PROCESSING: { label: "قيد التجهيز",   color: "#3B82F6" },
  SHIPPED:    { label: "في الطريق",     color: "#8B5CF6" },
  DELIVERED:  { label: "تم التسليم",    color: "#10B981" },
  CANCELLED:  { label: "ملغي",          color: "#EF4444" },
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const EmailService = {
  // --- Customer emails ---

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    const shopUrl = BASE_URL;
    await send({
      to,
      subject: "أهلاً بك في تشطيب! 🏠",
      html: layout(
        "أهلاً بك",
        `<p>مرحباً ${esc(name)}،</p>
         <p>يسعدنا انضمامك لعائلة <strong>تشطيب</strong> — وجهتك الأولى لمنتجات التشطيب والتجديد.</p>
         <p style="margin:16px 0;">كل ما تحتاجه لمنزلك في مكان واحد: أدوات كهربائية، سباكة، دهانات، وأكثر بكثير.</p>
         <p style="margin:24px 0;"><a class="btn" href="${shopUrl}/products">تصفح المنتجات الآن</a></p>
         <p style="color:#999;font-size:13px;">لأي استفسار راسلنا عبر صفحة التواصل أو عبر الواتساب.</p>`
      ),
    });
  },

  async sendVerificationEmail(to: string, name: string, token: string): Promise<void> {
    const link = `${BASE_URL}/verify-email?token=${token}`;
    await send({
      to,
      subject: "تفعيل حسابك في تشطيب",
      html: layout(
        "تفعيل الحساب",
        `<p>مرحباً ${esc(name)}،</p>
         <p>شكراً لتسجيلك في <strong>تشطيب</strong>. الرجاء تفعيل حسابك بالنقر على الزر أدناه:</p>
         <p style="margin:24px 0;"><a class="btn" href="${link}">تفعيل الحساب</a></p>
         <p style="color:#999;font-size:13px;">الرابط صالح لمدة 24 ساعة. إذا لم تقم بإنشاء هذا الحساب يمكنك تجاهل هذه الرسالة.</p>`
      ),
    });
  },

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const link = `${BASE_URL}/reset-password?token=${token}`;
    await send({
      to,
      subject: "إعادة تعيين كلمة المرور — تشطيب",
      html: layout(
        "إعادة تعيين كلمة المرور",
        `<p>مرحباً،</p>
         <p>تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك. انقر على الزر أدناه لإتمام العملية:</p>
         <p style="margin:24px 0;"><a class="btn" href="${link}">إعادة تعيين كلمة المرور</a></p>
         <p style="color:#999;font-size:13px;">الرابط صالح لمدة ساعة واحدة فقط. إذا لم تطلب ذلك يمكنك تجاهل هذه الرسالة.</p>`
      ),
    });
  },

  async sendOrderConfirmation(options: {
    to: string;
    orderId: string;
    customerName: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    subtotal: number;
    shippingCost: number;
    discountAmount: number;
    taxAmount: number;
    totalAmount: number;
    paymentMethod: string;
    shippingAddress: string;
    shippingCity: string;
  }): Promise<void> {
    const { to, orderId, customerName, items, subtotal, shippingCost, discountAmount, taxAmount, totalAmount, paymentMethod, shippingAddress, shippingCity } = options;
    const orderUrl = `${BASE_URL}/account/orders/${orderId}`;
    const fmt = (n: number) => new Intl.NumberFormat("ar-EG", { minimumFractionDigits: 2 }).format(n);

    const itemRows = items
      .map(i => `<tr><td>${esc(i.name)}</td><td style="text-align:center;">${i.quantity}</td><td>${fmt(i.price)} ج.م</td></tr>`)
      .join("");

    await send({
      to,
      subject: `تأكيد طلبك #${orderId.slice(-8).toUpperCase()} — تشطيب`,
      html: layout(
        "تأكيد الطلب",
        `<p>مرحباً ${esc(customerName)}،</p>
         <p>تم استلام طلبك بنجاح وهو قيد المراجعة الآن. سيتم التواصل معك قريباً لتأكيد موعد التسليم.</p>
         <h3 style="margin-top:24px;">تفاصيل الطلب</h3>
         <table class="table">
           <thead><tr><th>المنتج</th><th style="text-align:center;">الكمية</th><th>السعر</th></tr></thead>
           <tbody>${itemRows}</tbody>
         </table>
         <div class="total">
           <p style="margin:4px 0;">المجموع الفرعي: <strong>${fmt(subtotal)} ج.م</strong></p>
           ${discountAmount > 0 ? `<p style="margin:4px 0;color:#10B981;">الخصم: <strong>- ${fmt(discountAmount)} ج.م</strong></p>` : ""}
           <p style="margin:4px 0;">الشحن: <strong>${fmt(shippingCost)} ج.م</strong></p>
           <p style="margin:4px 0;">ضريبة القيمة المضافة (14%): <strong>${fmt(taxAmount)} ج.م</strong></p>
           <p style="margin:8px 0;font-size:16px;font-weight:bold;border-top:1px solid #e5e7eb;padding-top:8px;">الإجمالي: ${fmt(totalAmount)} ج.م</p>
         </div>
         <p style="margin-top:16px;"><strong>طريقة الدفع:</strong> ${paymentMethod === "COD" ? "الدفع عند الاستلام" : "بطاقة ائتمانية"}</p>
         <p><strong>عنوان التسليم:</strong> ${esc(shippingAddress)}، ${esc(shippingCity)}</p>
         <p style="margin-top:24px;"><a class="btn" href="${orderUrl}">تتبع طلبك</a></p>`
      ),
    });
  },

  async sendLowStockAlert(
    to: string,
    products: Array<{ name: string; stock: number; lowStockThreshold: number }>
  ): Promise<void> {
    const rows = products
      .map(p => `<tr><td style="padding:8px 12px;text-align:right;">${esc(p.name)}</td><td style="padding:8px 12px;text-align:center;color:#EF4444;font-weight:bold;">${p.stock}</td><td style="padding:8px 12px;text-align:center;color:#999;">${p.lowStockThreshold}</td></tr>`)
      .join("");
    await send({
      to,
      subject: `⚠️ تنبيه: ${products.length} منتج بمخزون منخفض — تشطيب`,
      html: layout(
        "تنبيه مخزون منخفض",
        `<p>الأدمن، المنتجات التالية وصلت للحد الأدنى من المخزون وتحتاج تجديداً:</p>
         <table class="table">
           <thead><tr><th>المنتج</th><th style="text-align:center;">المخزون الحالي</th><th style="text-align:center;">الحد الأدنى</th></tr></thead>
           <tbody>${rows}</tbody>
         </table>
         <p style="margin-top:20px;"><a class="btn" href="${BASE_URL}/admin/products">إدارة المنتجات</a></p>`
      ),
    });
  },

  async sendOrderStatusUpdate(options: {
    to: string;
    orderId: string;
    customerName: string;
    newStatus: string;
    trackingNumber?: string;
  }): Promise<void> {
    const { to, orderId, customerName, newStatus, trackingNumber } = options;
    const statusInfo = ORDER_STATUS_LABELS[newStatus] || { label: newStatus, color: "#666" };
    const orderUrl = `${BASE_URL}/account/orders/${orderId}`;

    const trackingBlock = trackingNumber
      ? `<div style="margin:16px 0;background:#FFF7ED;border:1px solid #FED7AA;border-radius:8px;padding:16px;">
           <p style="margin:0 0 4px;font-size:13px;color:#92400E;font-weight:bold;">رقم تتبع الشحنة</p>
           <p style="margin:0;font-size:18px;font-weight:bold;font-family:monospace;color:#EA580C;letter-spacing:1px;">${esc(trackingNumber)}</p>
         </div>`
      : "";

    await send({
      to,
      subject: `تحديث حالة طلبك #${orderId.slice(-8).toUpperCase()} — تشطيب`,
      html: layout(
        "تحديث الطلب",
        `<p>مرحباً ${esc(customerName)}،</p>
         <p>تم تحديث حالة طلبك:</p>
         <p style="margin:20px 0;">
           <span class="status-badge" style="background:${statusInfo.color}22;color:${statusInfo.color};">
             ${esc(String(statusInfo.label))}
           </span>
         </p>
         ${trackingBlock}
         <p style="margin-top:24px;"><a class="btn" href="${orderUrl}">عرض تفاصيل الطلب</a></p>`
      ),
    });
  },

  // --- Admin notification emails ---

  async notifyAdminNewOrder(options: {
    orderId: string;
    customerName: string;
    customerEmail: string;
    totalAmount: number;
    itemCount: number;
    paymentMethod: string;
    shippingCity: string;
  }): Promise<void> {
    const adminEmail = await getAdminEmail();
    if (!adminEmail) return;

    const { orderId, customerName, customerEmail, totalAmount, itemCount, paymentMethod, shippingCity } = options;
    const fmt = (n: number) => new Intl.NumberFormat("ar-EG", { minimumFractionDigits: 2 }).format(n);
    const orderUrl = `${BASE_URL}/admin/orders/${orderId}`;

    await send({
      to: adminEmail,
      subject: `🛒 طلب جديد #${orderId.slice(-8).toUpperCase()} — ${fmt(totalAmount)} ج.م`,
      html: layout(
        "طلب جديد",
        `<p>تم استلام طلب جديد على المتجر!</p>
         <table class="table">
           <tr><th>رقم الطلب</th><td><strong>#${orderId.slice(-8).toUpperCase()}</strong></td></tr>
           <tr><th>العميل</th><td>${esc(customerName)} &lt;${esc(customerEmail)}&gt;</td></tr>
           <tr><th>المبلغ الإجمالي</th><td><strong style="color:#F97316;">${fmt(totalAmount)} ج.م</strong></td></tr>
           <tr><th>عدد المنتجات</th><td>${itemCount} منتج</td></tr>
           <tr><th>طريقة الدفع</th><td>${paymentMethod === "COD" ? "الدفع عند الاستلام" : "بطاقة ائتمانية"}</td></tr>
           <tr><th>مدينة التسليم</th><td>${esc(shippingCity)}</td></tr>
         </table>
         <p style="margin-top:20px;"><a class="btn" href="${orderUrl}">عرض الطلب في لوحة الإدارة</a></p>`
      ),
    });
  },

  async notifyAdminNewContactMessage(options: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<void> {
    const adminEmail = await getAdminEmail();
    if (!adminEmail) return;

    const { name, email, subject, message } = options;
    const messagesUrl = `${BASE_URL}/admin/messages`;

    await send({
      to: adminEmail,
      replyTo: email,
      subject: `📨 رسالة تواصل جديدة: ${subject}`,
      html: layout(
        "رسالة تواصل جديدة",
        `<p>تلقيت رسالة تواصل جديدة من الموقع:</p>
         <table class="table">
           <tr><th>الاسم</th><td>${esc(name)}</td></tr>
           <tr><th>البريد الإلكتروني</th><td>${esc(email)}</td></tr>
           <tr><th>الموضوع</th><td>${esc(subject)}</td></tr>
         </table>
         <div style="background:#f9f9f9;border-right:4px solid #F97316;padding:16px;margin:16px 0;border-radius:4px;">
           <pre style="margin:0;white-space:pre-wrap;font-family:inherit;">${esc(message)}</pre>
         </div>
         <p style="margin-top:20px;">
           <a class="btn" href="${messagesUrl}">عرض الرسائل في لوحة الإدارة</a>
           &nbsp;&nbsp;
           <a href="mailto:${esc(email)}?subject=${encodeURIComponent("رداً على: " + subject)}" style="color:#F97316;">رد مباشرة على المرسل</a>
         </p>`
      ),
    });
  },

  // --- Admin reply to customer ---

  async sendReplyToCustomer(options: {
    to: string;
    customerName: string;
    originalSubject: string;
    replyBody: string;
  }): Promise<void> {
    const { to, customerName, originalSubject, replyBody } = options;
    await send({
      to,
      subject: `رداً على: ${originalSubject}`,
      html: layout(
        "رد من فريق تشطيب",
        `<p>مرحباً ${esc(customerName)}،</p>
         <div style="white-space:pre-wrap;">${esc(replyBody)}</div>
         <hr style="margin:24px 0;border:none;border-top:1px solid #eee;"/>
         <p style="color:#999;font-size:13px;">هذا الرد بخصوص رسالتك: <em>${esc(originalSubject)}</em></p>`
      ),
    });
  },

  // --- SMTP connection test ---

  async testSmtpConnection(): Promise<{ success: boolean; error?: string }> {
    const smtp = await getSmtpTransport();
    if (!smtp) {
      return { success: false, error: "SMTP غير مفعّل أو غير مضبوط" };
    }
    try {
      await smtp.verify();
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "فشل الاتصال" };
    }
  },
};
