import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { Container } from "@/components/layout/container";

export default function ForgotPasswordPage() {
  return (
    <Container className="py-20 flex justify-center items-center min-h-[70vh]">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-secondary">
        <ForgotPasswordForm />
      </div>
    </Container>
  );
}
