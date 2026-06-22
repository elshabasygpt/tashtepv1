import type { Metadata, Viewport } from "next";
import { Tajawal } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import Providers from "./providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#111111", // Obsidian Black for premium feel
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    template: "%s | Tashtep",
    default: "Tashtep | Premium Finishing Materials",
  },
  description:
    "A premium Egyptian ecommerce platform specialized in paints, decorative materials, and finishing supplies. Operating natively in Arabic.",
  keywords: [
    "paints",
    "decorative materials",
    "egypt",
    "tashtep",
    "interior design",
    "تشطيب",
    "دهانات",
    "ورق حائط",
  ],
  metadataBase: new URL(process.env.APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "/",
    siteName: "Tashtep",
  },
  twitter: {
    card: "summary_large_image",
    site: "@tashtep",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="antialiased scroll-smooth" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-gallery text-obsidian font-sans selection:bg-obsidian selection:text-gallery",
          tajawal.variable
        )}
      >
        <Providers>
          <div className="relative flex min-h-screen flex-col mx-auto max-w-[1440px] w-full">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
