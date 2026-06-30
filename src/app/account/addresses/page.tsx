import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AddressService } from "@/services/address.service";
import { AddressManager } from "@/features/account/components/address-manager";

export const dynamic = "force-dynamic";
export const metadata = { title: "عناوين الشحن — تشطيب" };

export default async function AddressesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const addresses = await AddressService.getUserAddresses(session.user.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-obsidian">عناوين الشحن</h1>
      <AddressManager addresses={addresses} userId={session.user.id} />
    </div>
  );
}
