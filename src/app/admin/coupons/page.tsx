import { CouponService } from "@/services/coupon.service";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const coupons = await CouponService.getCoupons();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-obsidian">الكوبونات والخصومات</h1>
          <p className="text-secondary mt-1">إدارة أكواد الخصم وتحديد قيمتها وشروطها</p>
        </div>
        <Link href="/admin/coupons/new">
          <Button className="bg-tashtep-orange hover:bg-tashtep-orange/90 text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">add</span>
            إضافة كوبون جديد
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-stone overflow-hidden">
        <table className="w-full text-right text-sm">
          <thead className="bg-surface-container-low text-secondary border-b border-stone">
            <tr>
              <th className="p-4 font-semibold">الكود</th>
              <th className="p-4 font-semibold">الخصم</th>
              <th className="p-4 font-semibold">الاستخدام</th>
              <th className="p-4 font-semibold">الحالة</th>
              <th className="p-4 font-semibold">انتهاء الصلاحية</th>
              <th className="p-4 font-semibold">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone">
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-secondary">لا توجد كوبونات حالياً</td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-indigo-600">{coupon.code}</td>
                  <td className="p-4">
                    {coupon.discountType === "PERCENTAGE" ? `%${coupon.discountValue}` : `${coupon.discountValue} ج.م`}
                  </td>
                  <td className="p-4">
                    {coupon.usedCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : "مرة"}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {coupon.isActive ? "فعال" : "معطل"}
                    </span>
                  </td>
                  <td className="p-4 text-secondary">
                    {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString("ar-EG") : "دائم"}
                  </td>
                  <td className="p-4">
                    <Link href={`/admin/coupons/${coupon.id}/edit`} className="text-tashtep-orange hover:underline">
                      تعديل/عرض
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
