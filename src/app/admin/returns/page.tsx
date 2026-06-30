import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDING:   { label: "قيد المراجعة", color: "bg-amber-100 text-amber-700 border-amber-200" },
  APPROVED:  { label: "تمت الموافقة", color: "bg-blue-100 text-blue-700 border-blue-200" },
  REJECTED:  { label: "مرفوض",       color: "bg-red-100 text-red-700 border-red-200" },
  COMPLETED: { label: "مكتمل",       color: "bg-green-100 text-green-700 border-green-200" },
};

export default async function AdminReturnsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const returns = await prisma.returnRequest.findMany({
    where: status ? { status } : undefined,
    include: {
      user: { select: { name: true, email: true } },
      order: { select: { id: true, totalAmount: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const pending = await prisma.returnRequest.count({ where: { status: "PENDING" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-headline-md font-bold text-obsidian">طلبات الاسترداد</h2>
          {pending > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">{pending} جديد</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm">
          {["", "PENDING", "APPROVED", "REJECTED", "COMPLETED"].map((s) => (
            <Link
              key={s}
              href={s ? `/admin/returns?status=${s}` : "/admin/returns"}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${(status ?? "") === s ? "bg-obsidian text-white border-obsidian" : "border-stone text-secondary hover:border-obsidian"}`}
            >
              {s ? STATUS_MAP[s]?.label : "الكل"}
            </Link>
          ))}
        </div>
      </div>

      {returns.length === 0 ? (
        <div className="bg-white border border-stone rounded-xl p-12 text-center text-secondary">
          <span className="material-symbols-outlined text-4xl block mb-3 opacity-40">assignment_return</span>
          لا توجد طلبات استرداد
        </div>
      ) : (
        <div className="space-y-3">
          {returns.map((r) => {
            const st = STATUS_MAP[r.status] ?? { label: r.status, color: "bg-stone text-secondary border-stone" };
            return (
              <div key={r.id} className="bg-white border border-stone rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="font-technical-mono text-sm font-bold text-obsidian">
                        طلب #{r.order.id.slice(-8).toUpperCase()}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${st.color}`}>{st.label}</span>
                      <span className="text-xs text-secondary">{r.order.totalAmount} ج.م</span>
                    </div>
                    <p className="text-sm font-medium text-obsidian mb-1">{r.user.name} — <span className="font-technical-mono text-secondary">{r.user.email}</span></p>
                    <p className="text-sm text-secondary mb-1"><strong>السبب:</strong> {r.reason}</p>
                    <p className="text-sm text-secondary line-clamp-2">{r.details}</p>
                  </div>
                  <div className="text-xs text-secondary shrink-0 text-left">
                    {new Date(r.createdAt).toLocaleDateString("ar-EG")}
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-stone/50">
                  {["APPROVED", "REJECTED", "COMPLETED"].map((newStatus) => (
                    newStatus !== r.status && (
                      <form key={newStatus} action={`/api/admin/returns/${r.id}`} method="POST">
                        <input type="hidden" name="status" value={newStatus} />
                        <button
                          type="submit"
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                            newStatus === "APPROVED" ? "border-blue-300 text-blue-700 hover:bg-blue-50" :
                            newStatus === "REJECTED" ? "border-red-300 text-red-700 hover:bg-red-50" :
                            "border-green-300 text-green-700 hover:bg-green-50"
                          }`}
                        >
                          {STATUS_MAP[newStatus]?.label}
                        </button>
                      </form>
                    )
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
