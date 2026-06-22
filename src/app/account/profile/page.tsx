import { ProfileForm } from "@/features/account/components/profile-form";
import { UserService } from "@/services/user.service";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/container";

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
    <Container className="py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-obsidian">حسابي - البيانات الشخصية</h1>
        <ProfileForm defaultValues={defaultValues} />
      </div>
    </Container>
  );
}
