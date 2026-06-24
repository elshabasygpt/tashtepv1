import { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { GovernorateService } from "@/services/governorate.service";
import { ShippingManager } from "@/features/admin/components/shipping-manager";

export const metadata: Metadata = {
  title: "إدارة الشحن والمحافظات | لوحة الإدارة",
};

export const dynamic = "force-dynamic";

export default async function AdminShippingPage() {
  const user = await getCurrentUser();
  if (user?.role !== "ADMIN") {
    redirect("/");
  }
  
  // Fetch all governorates (including inactive)
  const governorates = await GovernorateService.getGovernorates(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline-md text-obsidian">إدارة الشحن والمحافظات</h1>
          <p className="text-secondary mt-1">إضافة وتعديل المحافظات وتكلفة الشحن الخاصة بكل منها.</p>
        </div>
      </div>
      
      <ShippingManager initialGovernorates={governorates} />
    </div>
  );
}
