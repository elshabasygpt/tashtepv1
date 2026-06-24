import { ProfileForm } from "@/features/account/components/profile-form";
import { ChangePasswordForm } from "@/features/account/components/change-password-form";
import { UserService } from "@/services/user.service";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const sessionUser = await getCurrentUser();

  if (!sessionUser) {
    redirect("/login");
  }

  // Fetch fresh user data from DB
  const user = await UserService.getUserById(sessionUser.id);

  if (!user) {
    redirect("/login");
  }

  const defaultValues = {
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
  };

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-obsidian mb-macro-sm">البيانات الشخصية</h1>
      <ProfileForm defaultValues={defaultValues} />
      <ChangePasswordForm />
    </div>
  );
}
