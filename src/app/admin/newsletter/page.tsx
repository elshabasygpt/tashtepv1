import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ active?: string; q?: string }>;
}) {
  const { active, q } = await searchParams;

  const where: Record<string, unknown> = {};
  if (active === "1") where.isActive = true;
  if (active === "0") where.isActive = false;
  if (q) where.email = { contains: q };

  const [subscribers, total, activeCount] = await Promise.all([
    prisma.newsletterSubscriber.findMany({
      where,
      orderBy: { subscribedAt: "desc" },
      take: 200,
    }),
    prisma.newsletterSubscriber.count(),
    prisma.newsletterSubscriber.count({ where: { isActive: true } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-headline-md font-bold text-obsidian">مشتركو النيوزلتر</h2>
          <span className="bg-stone text-secondary text-sm px-2.5 py-0.5 rounded-full font-medium">{total} إجمالي</span>
          <span className="bg-green-100 text-green-700 text-sm px-2.5 py-0.5 rounded-full font-medium">{activeCount} نشط</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter tabs */}
          <div className="flex items-center gap-1 text-sm border border-stone rounded-lg overflow-hidden">
            <Link href="/admin/newsletter" className={`px-3 py-1.5 ${!active ? "bg-obsidian text-white" : "hover:bg-stone/50"}`}>الكل</Link>
            <Link href="/admin/newsletter?active=1" className={`px-3 py-1.5 ${active === "1" ? "bg-obsidian text-white" : "hover:bg-stone/50"}`}>نشط</Link>
            <Link href="/admin/newsletter?active=0" className={`px-3 py-1.5 ${active === "0" ? "bg-obsidian text-white" : "hover:bg-stone/50"}`}>ملغي</Link>
          </div>

          {/* Search */}
          <form method="GET" action="/admin/newsletter" className="relative">
            {active && <input type="hidden" name="active" value={active} />}
            <input
              type="search" name="q" defaultValue={q}
              placeholder="ابحث بالإيميل..."
              className="pl-4 pr-8 py-1.5 text-sm border border-stone rounded-lg bg-white focus:outline-none focus:border-tashtep-orange w-48"
              dir="ltr"
            />
          </form>

          {/* CSV Export */}
          <a
            href="/api/admin/newsletter/export"
            className="text-sm flex items-center gap-1 px-3 py-1.5 border border-stone rounded-lg hover:bg-stone/50 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            تصدير CSV
          </a>
        </div>
      </div>

      <div className="bg-white border border-stone rounded-xl overflow-hidden">
        {subscribers.length === 0 ? (
          <div className="p-12 text-center text-secondary">
            <span className="material-symbols-outlined text-4xl block mb-3 opacity-40">mail</span>
            لا يوجد مشتركون
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-stone/20 border-b border-stone">
              <tr>
                <th className="text-right px-4 py-3 font-medium text-secondary">#</th>
                <th className="text-right px-4 py-3 font-medium text-secondary">البريد الإلكتروني</th>
                <th className="text-right px-4 py-3 font-medium text-secondary">تاريخ الاشتراك</th>
                <th className="text-right px-4 py-3 font-medium text-secondary">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone/40">
              {subscribers.map((sub, i) => (
                <tr key={sub.id} className="hover:bg-stone/10 transition-colors">
                  <td className="px-4 py-3 text-secondary">{i + 1}</td>
                  <td className="px-4 py-3 font-technical-mono text-obsidian">{sub.email}</td>
                  <td className="px-4 py-3 text-secondary">{new Date(sub.subscribedAt).toLocaleDateString("ar-EG")}</td>
                  <td className="px-4 py-3">
                    {sub.isActive ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                        نشط
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone text-secondary text-xs rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-stone-400 inline-block" />
                        ملغي
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
