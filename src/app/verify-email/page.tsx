import { verifyEmailAction } from "@/actions/auth.actions";
import { Container } from "@/components/layout/container";
import { redirect } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    redirect("/");
  }

  const result = await verifyEmailAction({ token });

  return (
    <Container className="py-20 flex justify-center items-center min-h-[70vh]">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-secondary text-center space-y-6">
        {result?.data?.success ? (
          <>
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-obsidian">تم توثيق بريدك الإلكتروني بنجاح!</h1>
            <p className="text-muted-foreground text-sm">
              يمكنك الآن الاستفادة من كافة ميزات حسابك في تشطيب.
            </p>
            <div className="pt-4">
              <Link href="/login">
                <Button variant="tashtep" className="w-full">تسجيل الدخول الآن</Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center">
              <XCircle className="h-16 w-16 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-obsidian">فشل توثيق البريد الإلكتروني</h1>
            <p className="text-muted-foreground text-sm">
              {result?.error || "الرابط غير صالح أو منتهي الصلاحية."}
            </p>
            <div className="pt-4">
              <Link href="/">
                <Button variant="outline" className="w-full">العودة للرئيسية</Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </Container>
  );
}
