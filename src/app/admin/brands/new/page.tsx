import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BrandForm } from "../brand-form";

export default async function NewBrandPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "MANAGER")) redirect("/");
  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold text-obsidian mb-6">إضافة ماركة جديدة</h2>
      <BrandForm />
    </div>
  );
}
