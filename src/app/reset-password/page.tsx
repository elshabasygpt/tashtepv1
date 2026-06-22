import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
import { Container } from "@/components/layout/container";
import { redirect } from "next/navigation";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    redirect("/forgot-password");
  }

  return (
    <Container className="py-20 flex justify-center items-center min-h-[70vh]">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-secondary">
        <ResetPasswordForm token={token} />
      </div>
    </Container>
  );
}
