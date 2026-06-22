import { LoginForm } from "@/features/auth/components/login-form";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
  description: "تسجيل الدخول إلى حسابك في تشطيب",
};

export default function LoginPage() {
  return (
    <Section className="py-20 bg-gallery min-h-screen flex items-center">
      <Container className="max-w-md w-full">
        <LoginForm />
      </Container>
    </Section>
  );
}
