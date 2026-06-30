import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "طلبات الاسترداد — تشطيب" };

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDING:   { label: "قيد المراجعة", color: "bg-amber-100 text-amber-700" },
  APPROVED:  { label: "تمت الموافقة", color: "bg-blue-100 text-blue-700" },
  REJECTED:  { label: "مرفوض",       color: "bg-red-100 text-red-700" },
  COMPLETED: { label: "مكتمل",       color: "bg-green-100 text-green-700" },
};

export default async function ReturnsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const returns = await prisma.returnRequest.findMany({
    where: { userId: session.user.id },
    include: { order: { select: { id: true, totalAmount: true, createdAt: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-obsidian">طلبات الاسترداد</h1>
        <Link
          href="/account/returns/new"
          className="flex items-center gap-2 bg-tashtep-orange text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-obsidian transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          طلب استرداد جديد
        </Link>
      </div>

      {returns.length === 0 ? (
        <div className="bg-white border border-stone rounded-xl p-12 text-center text-secondary">
          <span className="material-symbols-outlined text-4xl block mb-3 opacity-40">assignment_return</span>
          <p className="font-medium">لا توجد طلبات استرداد</p>
          <p className="text-sm mt-1">إذا واجهت مشكلة مع طلبك، يمكنك تقديم طلب استرداد.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {returns.map((r) => {
            const status = STATUS_MAP[r.status] ?? { label: r.status, color: "bg-stone text-secondary" };
            return (
              <div key={r.id} className="bg-white border border-stone rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="font-technical-mono text-sm font-bold text-obsidian">طلب #{r.order.id.slice(-8).toUpperCase()}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.color}`}>{status.label}</span>
                    </div>
                    <p className="text-sm text-secondary mb-1"><strong>سبب الاسترداد:</strong> {r.reason}</p>
                    <p className="text-sm text-secondary line-clamp-2">{r.details}</p>
                    {r.adminNote && (
                      <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700">
                        <strong>ملاحظة الإدارة:</strong> {r.adminNote}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-secondary shrink-0">
                    {new Date(r.createdAt).toLocaleDateString("ar-EG")}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
