import { RegisterForm } from "@/features/auth/components/register-form";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "إنشاء حساب",
  description: "إنشاء حساب جديد في تشطيب",
};

export default function RegisterPage() {
  return (
    <Section className="py-20 bg-gallery min-h-screen flex items-center">
      <Container className="max-w-md w-full">
        <RegisterForm />
      </Container>
    </Section>
  );
}
