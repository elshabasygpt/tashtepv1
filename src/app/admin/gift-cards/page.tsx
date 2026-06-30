import { GiftCardService } from "@/services/giftcard.service";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CreateGiftCardForm } from "@/components/admin/create-gift-card-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "كروت الهدايا — تشطيب أدمن" };

function fmt(n: number) {
  return new Intl.NumberFormat("ar-EG", { minimumFractionDigits: 2 }).format(n);
}

export default async function GiftCardsPage() {
  const session = await auth();
  if (!["ADMIN", "MANAGER"].includes((session?.user as { role?: string } | undefined)?.role ?? "")) {
    redirect("/admin");
  }

  const cards = await GiftCardService.getAllCards();

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-obsidian">كروت الهدايا</h1>
      </div>

      <CreateGiftCardForm />

      <div className="bg-white border border-soft-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone/20">
            <tr>
              <th className="text-right p-3">الكود</th>
              <th className="text-right p-3">القيمة الأصلية</th>
              <th className="text-right p-3">الرصيد الحالي</th>
              <th className="text-right p-3">تاريخ الانتهاء</th>
              <th className="text-right p-3">البريد</th>
              <th className="text-right p-3">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {cards.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-secondary">لا توجد كروت</td></tr>
            ) : cards.map(c => (
              <tr key={c.id} className="border-t border-soft-border hover:bg-stone/5">
                <td className="p-3 font-mono font-bold text-tashtep-orange">{c.code}</td>
                <td className="p-3">{fmt(c.originalBalance)} ج.م</td>
                <td className="p-3">{fmt(c.balance)} ج.م</td>
                <td className="p-3 text-secondary">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("ar-EG") : "بلا انتهاء"}</td>
                <td className="p-3 text-secondary text-xs">{c.purchasedByEmail || "—"}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${c.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {c.isActive ? "نشط" : "منتهي"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
