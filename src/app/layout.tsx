import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "sonner";
import { CategoryService } from "@/services/category.service";

export const viewport: Viewport = {
  themeColor: "#ffffff", // Updated to match Stitch gallery-white
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    template: "%s | تشطيب",
    default: "تشطيب - Tashtep Digital Flagship",
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


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch categories and filter top-level ones
  const allCategories = await CategoryService.getCategories();
  const topLevelCategories = allCategories.filter(c => !c.parent);

  return (
    <html lang="ar" dir="rtl" className="antialiased scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600&family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: `
          .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
          }
          .icon-fill {
            font-variation-settings: 'FILL' 1;
          }
          .hide-scroll::-webkit-scrollbar {
            display: none;
          }
          .hide-scroll {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}} />
      </head>
      <body
        className="bg-gallery-white text-on-background font-body-md antialiased overflow-x-hidden selection:bg-tashtep-orange selection:text-gallery-white"
      >
        <Providers>
          <div className="relative flex min-h-screen flex-col w-full">
            <Header categories={topLevelCategories} />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster richColors position="top-center" dir="rtl" />
        </Providers>
      </body>
    </html>
  );
}
