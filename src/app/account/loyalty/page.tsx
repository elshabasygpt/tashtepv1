import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LoyaltyService } from "@/services/loyalty.service";

export const dynamic = "force-dynamic";
export const metadata = { title: "نقاط الولاء — تشطيب" };

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  EARNED:   { label: "نقاط مكتسبة",  color: "text-green-600" },
  REDEEMED: { label: "نقاط مستردة",  color: "text-red-500" },
  ADJUSTED: { label: "تعديل",         color: "text-blue-600" },
};

export default async function LoyaltyPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [balance, history] = await Promise.all([
    LoyaltyService.getBalance(session.user.id),
    LoyaltyService.getHistory(session.user.id),
  ]);

  const cashValue = LoyaltyService.pointsToCash(balance);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-obsidian">نقاط الولاء</h1>

      {/* Balance card */}
      <div className="bg-gradient-to-br from-tashtep-orange to-amber-500 text-white rounded-2xl p-6">
        <p className="text-orange-100 text-sm">رصيد نقاطك</p>
        <p className="text-5xl font-bold mt-2">{balance.toLocaleString("ar-EG")}</p>
        <p className="text-orange-100 text-sm mt-1">نقطة = {cashValue.toLocaleString("ar-EG")} ج.م</p>
        <div className="mt-4 pt-4 border-t border-white/20 text-sm">
          <p>10 جنيه إنفاق = 1 نقطة &nbsp;·&nbsp; 1 نقطة = 0.25 ج.م خصم</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
        <strong>كيف يعمل البرنامج؟</strong> تحصل على نقاط مع كل طلب. يمكنك استرداد نقاطك كخصم على طلبك القادم (بحد أقصى 30% من قيمة الطلب).
      </div>

      {/* Transaction history */}
      <div>
        <h2 className="font-bold text-obsidian mb-4">سجل النقاط</h2>
        {history.length === 0 ? (
          <p className="text-secondary text-sm">لا توجد معاملات بعد. ابدأ التسوق لتجميع نقاطك!</p>
        ) : (
          <div className="space-y-2">
            {history.map(t => {
              const info = TYPE_LABELS[t.type] ?? { label: t.type, color: "text-gray-600" };
              return (
                <div key={t.id} className="flex items-center justify-between p-3 border border-soft-border rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-obsidian">{info.label}</p>
                    {t.description && <p className="text-xs text-secondary">{t.description}</p>}
                    <p className="text-xs text-secondary">{new Date(t.createdAt).toLocaleDateString("ar-EG")}</p>
                  </div>
                  <span className={`font-bold text-lg ${info.color}`}>
                    {t.points > 0 ? "+" : ""}{t.points}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
