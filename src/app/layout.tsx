export const dynamic = "force-dynamic";

import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import Providers from "./providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "sonner";
import { CategoryService } from "@/services/category.service";
import { SettingsService } from "@/services/settings.service";
import { GovernorateService } from "@/services/governorate.service";
import { CartService } from "@/services/cart.service";
import { getCurrentUser } from "@/lib/auth";
import { WhatsAppWidget } from "@/components/layout/whatsapp-widget";
import { CompareBar } from "@/components/compare-bar";
import { PageTransition } from "@/components/layout/page-transition";
import { I18nProvider } from "@/i18n/provider";
import { getLocale, getMessages } from "@/i18n/get-locale";

export const viewport: Viewport = {
  themeColor: "#ffffff", // Updated to match Stitch gallery-white
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    template: "%s | تشطيب",
    default: "تشطيب - أفضل خامات التشطيب والدهانات في مصر",
  },
  description:
    "تشطيب | المتجر الإلكتروني الأول للدهانات وخامات التشطيب الفاخرة في مصر. أكثر من 500 منتج من أشهر الماركات. توصيل لجميع المحافظات. دفع آمن.",
  keywords: [
    "تشطيب", "دهانات", "ورق حائط", "خامات تشطيب", "ديكور منزلي",
    "دهانات مصر", "شراء دهانات اونلاين", "تشطيب منزل", "ألوان دهانات",
    "أسعار دهانات مصر", "tashtep", "paints egypt", "interior design egypt",
    "أفضل دهانات", "دهانات jotun", "دهانات glc", "دهانات scib",
  ],
  metadataBase: new URL(process.env.APP_URL || "http://localhost:3000"),
  alternates: { canonical: "/" },
  authors: [{ name: "تشطيب" }],
  creator: "تشطيب",
  publisher: "تشطيب",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "/",
    siteName: "تشطيب",
    title: "تشطيب - أفضل خامات التشطيب والدهانات في مصر",
    description: "المتجر الإلكتروني الأول للدهانات وخامات التشطيب الفاخرة في مصر. توصيل لجميع المحافظات.",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "تشطيب - أفضل خامات التشطيب في مصر" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@tashtep",
    title: "تشطيب - أفضل خامات التشطيب في مصر",
    description: "المتجر الإلكتروني الأول للدهانات وخامات التشطيب الفاخرة في مصر.",
    images: ["/og-default.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch categories and filter top-level ones
  const [allCategories, general, governorates, locale, user] = await Promise.all([
    CategoryService.getCategories(),
    SettingsService.getGeneralSettings(),
    GovernorateService.getGovernorates(true),
    getLocale(),
    getCurrentUser(),
  ]);
  const [messages, serverCartCount] = await Promise.all([
    getMessages(locale),
    user ? CartService.getCartCount(user.id) : Promise.resolve(0),
  ]);
  const topLevelCategories = allCategories.filter(c => !c.parent);

  const baseUrl = process.env.APP_URL || "https://tashtep.com";

  // Sitewide Organization/LocalBusiness structured data: ties general SEO to
  // Geo SEO by declaring the governorates we actually ship to (areaServed).
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "Store", "LocalBusiness"],
    "@id": `${baseUrl}/#organization`,
    name: general.storeName,
    url: baseUrl,
    description: general.storeDescription,
    email: general.email,
    telephone: general.phone,
    priceRange: "EGP",
    currenciesAccepted: "EGP",
    paymentAccepted: "نقداً عند الاستلام، بطاقة ائتمان، بطاقة خصم، محافظ إلكترونية",
    address: {
      "@type": "PostalAddress",
      addressCountry: "EG",
      streetAddress: general.address,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "09:00",
        closes: "22:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Friday", "Saturday"],
        opens: "11:00",
        closes: "23:00",
      },
    ],
    areaServed: governorates.map((g) => ({ "@type": "AdministrativeArea", name: g.name })),
    sameAs: [general.facebookUrl, general.instagramUrl, general.twitterUrl].filter(Boolean),
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    name: "تشطيب",
    url: baseUrl,
    inLanguage: "ar-EG",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="ar" dir="rtl" className="antialiased scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600&family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <meta name="geo.region" content="EG" />
        <meta name="geo.placename" content="Egypt" />
        <meta name="language" content="Arabic" />
        <link rel="alternate" hrefLang="ar-eg" href={baseUrl} />
        <link rel="alternate" hrefLang="x-default" href={baseUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
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
          <I18nProvider initialLocale={locale} messages={messages}>
            <div className="relative flex min-h-screen flex-col w-full">
              <Header categories={topLevelCategories} serverCartCount={serverCartCount} />
              <main className="flex-1 flex flex-col">
                <PageTransition>{children}</PageTransition>
              </main>
              <Footer />
            </div>
            <Toaster richColors position="top-center" dir="rtl" />
            <WhatsAppWidget />
            <CompareBar />
          </I18nProvider>
        </Providers>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
