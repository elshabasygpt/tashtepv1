import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import fs from "fs";
import path from "path";
import Link from "next/link";
import { RestoreClient } from "./restore-client";
import { UploadsRestoreClient } from "./uploads-restore-client";

export const dynamic = "force-dynamic";

function formatDate(iso: string | null): string {
  if (!iso) return "لم يتم بعد";
  return new Date(iso).toLocaleString("ar-EG", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function countFilesRecursive(dir: string): { count: number; size: number } {
  let count = 0;
  let size = 0;
  if (!fs.existsSync(dir)) return { count, size };
  const scan = (d: string) => {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) { scan(full); }
      else { count++; size += fs.statSync(full).size; }
    }
  };
  scan(dir);
  return { count, size };
}

export default async function BackupPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "MANAGER")) {
    redirect("/");
  }

  // Fetch backup metadata from SystemSetting
  const settings = await prisma.systemSetting.findMany({
    where: {
      key: {
        in: [
          "backup_last_json", "backup_last_db", "backup_last_restore",
          "backup_last_uploads", "backup_last_uploads_restore",
        ],
      },
    },
  });
  const settingMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  // Get uploads folder stats
  const uploadsDir = path.resolve(process.cwd(), "public", "uploads");
  const { count: uploadsCount, size: uploadsSize } = countFilesRecursive(uploadsDir);

  // Count records per table
  const [
    usersCount, productsCount, ordersCount,
    categoriesCount, reviewsCount, subscribersCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.category.count(),
    prisma.review.count(),
    prisma.newsletterSubscriber.count(),
  ]);

  const isAdmin = user.role === "ADMIN";

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-obsidian mb-1">النسخ الاحتياطي والاستعادة</h2>
        <p className="text-secondary text-sm">احفظ بياناتك بانتظام لحماية المتجر من أي فقدان للبيانات</p>
      </div>

      {/* Database stats */}
      <div className="bg-white border border-stone rounded-2xl p-6">
        <h3 className="font-bold text-obsidian mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-tashtep-orange">storage</span>
          حالة قاعدة البيانات
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-4">
          {[
            { label: "مستخدمين", value: usersCount, icon: "group" },
            { label: "منتجات", value: productsCount, icon: "inventory_2" },
            { label: "طلبات", value: ordersCount, icon: "receipt_long" },
            { label: "أقسام", value: categoriesCount, icon: "category" },
            { label: "تقييمات", value: reviewsCount, icon: "star" },
            { label: "مشتركين", value: subscribersCount, icon: "campaign" },
          ].map((s) => (
            <div key={s.label} className="bg-stone/30 rounded-xl p-3 text-center">
              <span className="material-symbols-outlined text-[20px] text-secondary block mb-1">{s.icon}</span>
              <div className="text-xl font-black text-obsidian">{s.value}</div>
              <div className="text-[11px] text-secondary">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-secondary border-t border-stone/50 pt-3">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">photo_library</span>
            الصور المرفوعة: <strong className="text-obsidian mr-1">{uploadsCount} ملف ({formatBytes(uploadsSize)})</strong>
          </span>
        </div>
      </div>

      {/* Last backup status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { key: "backup_last_json", label: "آخر JSON backup", icon: "code", color: "blue" },
          { key: "backup_last_uploads", label: "آخر backup الصور", icon: "photo_library", color: "green" },
          { key: "backup_last_db", label: "آخر DB backup", icon: "storage", color: "purple" },
          { key: "backup_last_restore", label: "آخر استعادة", icon: "restore", color: "amber" },
        ].map((item) => {
          const ts = settingMap[item.key] ?? null;
          const colorMap: Record<string, string> = {
            blue: "bg-blue-50 border-blue-200 text-blue-700",
            green: "bg-green-50 border-green-200 text-green-700",
            purple: "bg-purple-50 border-purple-200 text-purple-700",
            amber: "bg-amber-50 border-amber-200 text-amber-700",
          };
          return (
            <div key={item.key} className={`rounded-xl border p-4 ${colorMap[item.color]}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                <span className="text-xs font-bold">{item.label}</span>
              </div>
              <p className="text-sm font-mono">{formatDate(ts)}</p>
            </div>
          );
        })}
      </div>

      {/* Download options */}
      <div className="bg-white border border-stone rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-obsidian flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-tashtep-orange">download</span>
          إنشاء نسخة احتياطية
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* JSON backup */}
          <div className="border border-stone rounded-xl p-5 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-blue-600 text-[20px]">code</span>
              </div>
              <div>
                <h4 className="font-bold text-obsidian text-sm">Backup JSON</h4>
                <p className="text-xs text-secondary mt-1">كل الجداول — مستخدمين، منتجات، طلبات...</p>
              </div>
            </div>
            <div className="text-xs text-secondary bg-stone/30 rounded-lg p-2 space-y-0.5">
              <p>✓ استعادة كاملة عبر الواجهة</p>
              <p>✓ قابل للقراءة والتدقيق</p>
            </div>
            <Link
              href="/api/admin/backup/export"
              download
              className="w-full h-10 bg-blue-600 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              تحميل JSON
            </Link>
          </div>

          {/* Uploads ZIP backup */}
          <div className="border border-stone rounded-xl p-5 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-green-600 text-[20px]">photo_library</span>
              </div>
              <div>
                <h4 className="font-bold text-obsidian text-sm">Backup الصور (ZIP)</h4>
                <p className="text-xs text-secondary mt-1">كل الصور المرفوعة على السيرفر</p>
              </div>
            </div>
            <div className="text-xs text-secondary bg-stone/30 rounded-lg p-2 space-y-0.5">
              <p>✓ {uploadsCount} صورة / {formatBytes(uploadsSize)}</p>
              <p>✓ استعادة كاملة عبر الواجهة</p>
            </div>
            {uploadsCount > 0 ? (
              <Link
                href="/api/admin/backup/uploads"
                download
                className="w-full h-10 bg-green-600 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">folder_zip</span>
                تحميل ZIP ({formatBytes(uploadsSize)})
              </Link>
            ) : (
              <div className="w-full h-10 bg-stone text-secondary text-sm rounded-xl flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">info</span>
                لا توجد صور مرفوعة بعد
              </div>
            )}
          </div>

          {/* MySQL info card */}
          <div className="border border-stone/40 rounded-xl p-5 space-y-3 opacity-80">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-purple-600 text-[20px]">storage</span>
              </div>
              <div>
                <h4 className="font-bold text-obsidian text-sm">Backup MySQL</h4>
                <p className="text-xs text-secondary mt-1">عبر hPanel أو mysqldump من SSH</p>
              </div>
            </div>
            <div className="text-xs text-secondary bg-stone/30 rounded-lg p-2 space-y-0.5">
              <p>✓ استخدم JSON backup للبيانات</p>
              <p>✓ من SSH: <code className="bg-stone px-1 rounded">mysqldump -u user -p db &gt; backup.sql</code></p>
            </div>
          </div>
        </div>
      </div>

      {/* Restore — ADMIN only */}
      {isAdmin ? (
        <div className="space-y-6">
          <h3 className="font-bold text-obsidian flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-red-500">restore</span>
            استعادة من نسخة احتياطية
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* DB Restore */}
            <div className="bg-white border border-red-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-red-600 mb-2">
                <span className="material-symbols-outlined text-[22px]">warning</span>
                <span className="font-bold text-sm">استعادة قاعدة البيانات</span>
              </div>
              <p className="text-sm text-secondary leading-relaxed">
                تحذف <strong className="text-red-600">كل البيانات الحالية</strong> وتستبدلها بالـ backup JSON.
              </p>
              <RestoreClient />
            </div>

            {/* Uploads Restore */}
            <div className="bg-white border border-orange-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-orange-600 mb-2">
                <span className="material-symbols-outlined text-[22px]">photo_library</span>
                <span className="font-bold text-sm">استعادة الصور</span>
              </div>
              <p className="text-sm text-secondary leading-relaxed">
                تحذف <strong className="text-orange-600">كل الصور الحالية</strong> وتستعيد ملفات ZIP.
              </p>
              <UploadsRestoreClient />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-stone/30 border border-stone rounded-2xl p-6 text-center text-secondary">
          <span className="material-symbols-outlined text-3xl block mb-2">lock</span>
          <p className="text-sm">الاستعادة متاحة لـ ADMIN فقط</p>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-white border border-stone rounded-2xl p-6">
        <h3 className="font-bold text-obsidian mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-secondary">info</span>
          توصيات للنسخ الاحتياطي
        </h3>
        <ul className="space-y-2 text-sm text-secondary list-none">
          {[
            "اعمل backup JSON + ZIP الصور يومياً في وقت منخفض الحركة",
            "احفظ النسخ الاحتياطية على Google Drive أو أي سحابة خارجية",
            "عند استعادة الموقع: أعد أولاً قاعدة البيانات (JSON) ثم الصور (ZIP)",
            "لـ backup قاعدة البيانات بشكل كامل: استخدم mysqldump من SSH أو hPanel",
            "اختبر الاستعادة دورياً للتأكد من أن الـ backup يعمل",
            "قبل أي تحديث كبير أو migration، اعمل backup فوراً",
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-tashtep-orange font-bold shrink-0">{i + 1}.</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
