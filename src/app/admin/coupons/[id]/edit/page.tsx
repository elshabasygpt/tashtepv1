import { AdminCouponForm } from "@/components/admin/admin-coupon-form";
import { CouponService } from "@/services/coupon.service";
import { notFound } from "next/navigation";

export default async function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const coupon = await CouponService.getCouponById(resolvedParams.id);

  if (!coupon) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-obsidian">تعديل كوبون</h1>
        <p className="text-secondary mt-1">تعديل بيانات الكوبون {coupon.code}</p>
      </div>
      
      <AdminCouponForm initialData={coupon} isEdit />
    </div>
  );
}
