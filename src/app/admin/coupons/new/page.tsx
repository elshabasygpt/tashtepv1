import { AdminCouponForm } from "@/components/admin/admin-coupon-form";

export default function NewCouponPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-obsidian">إضافة كوبون جديد</h1>
        <p className="text-secondary mt-1">إنشاء كود خصم وتحديد شروطه</p>
      </div>
      
      <AdminCouponForm />
    </div>
  );
}
