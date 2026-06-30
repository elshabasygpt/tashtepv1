import * as React from "react";
import Link from "next/link";
import { SettingsService } from "@/services/settings.service";
import { NewsletterForm } from "@/components/newsletter-form";

const SOCIAL_ICONS = {
  Facebook: "M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z",
  Instagram: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  Twitter: "M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.384 4.482A13.972 13.972 0 011.671 3.149a4.93 4.93 0 001.523 6.574 4.903 4.903 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.084 4.928 4.928 0 004.6 3.419A9.9 9.9 0 010 19.54a13.94 13.94 0 007.548 2.212c9.142 0 14.307-7.721 13.995-14.646A10.025 10.025 0 0024 4.557z",
};

const WHATSAPP_PATH = "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z";

const TRUST_ITEMS = [
  { icon: "local_shipping", label: "شحن لجميع المحافظات" },
  { icon: "verified", label: "منتجات أصلية 100%" },
  { icon: "support_agent", label: "استشارة مجانية" },
  { icon: "autorenew", label: "استرجاع خلال 14 يوم" },
];

const PAYMENT_METHODS = ["VISA", "Mastercard", "مدى", "Paymob"];

export async function Footer() {
  const settings = await SettingsService.getGeneralSettings();

  const socialLinks = (
    [
      { label: "Facebook" as const, url: settings.facebookUrl },
      { label: "Instagram" as const, url: settings.instagramUrl },
      { label: "Twitter" as const, url: settings.twitterUrl },
    ] as { label: keyof typeof SOCIAL_ICONS; url: string | null | undefined }[]
  ).filter((l) => l.url);

  const whatsappHref = settings.phone
    ? `https://wa.me/${settings.phone.replace(/[^0-9]/g, "")}`
    : null;

  return (
    <footer className="w-full bg-obsidian text-white" dir="rtl">
      <div className="max-w-container-max mx-auto px-gutter">

        {/* ── 1. CTA Band ────────────────────────────────────────── */}
        <div className="py-macro-lg border-b border-white/10 text-center">
          <h2 className="text-display-hero-mobile md:text-[64px] font-display-hero font-light text-white mb-6 leading-tight">
            كل مساحة تستحق<br className="hidden md:block" /> لمسة استثنائية.
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/products"
              className="bg-tashtep-orange text-white font-label-md text-label-md px-10 py-4 rounded-full hover:opacity-90 transition-opacity"
            >
              استكشف المنتجات
            </Link>
            <Link
              href="/contact"
              className="border border-white/30 text-white font-label-md text-label-md px-10 py-4 rounded-full hover:border-white hover:bg-white/5 transition-all"
            >
              احجز استشارة مجانية
            </Link>
          </div>
        </div>

        {/* ── 2. Main Content Grid ────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-gutter gap-y-10 py-macro-md border-b border-white/10">

          {/* Brand Column */}
          <div className="lg:col-span-4">
            <p className="text-[28px] font-bold font-headline-md text-white mb-4 leading-none">
              {settings.storeName}
            </p>
            <p className="text-white/50 text-body-md font-body-md mb-8 leading-relaxed max-w-[280px]">
              {settings.storeDescription}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url!}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:border-tashtep-orange hover:text-tashtep-orange transition-all duration-200"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d={SOCIAL_ICONS[social.label]} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Company Nav */}
          <div className="lg:col-span-2">
            <h4 className="text-white/40 text-[11px] font-bold mb-6">الشركة</h4>
            <ul className="space-y-4">
              {[
                { label: "عن تشطيب", href: "/about" },
                { label: "الأسئلة الشائعة", href: "/faq" },
                { label: "المدونة", href: "/blog" },
                { label: "تواصل معنا", href: "/contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-white/55 text-body-md font-body-md hover:text-tashtep-orange transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shopping Nav */}
          <div className="lg:col-span-3">
            <h4 className="text-white/40 text-[11px] font-bold mb-6">التسوق</h4>
            <ul className="space-y-4">
              {[
                { label: "جميع المنتجات", href: "/products" },
                { label: "الدهانات", href: "/products" },
                { label: "التشطيبات", href: "/products" },
                { label: "ورق الحائط", href: "/products" },
                { label: "الأدوات والكماليات", href: "/products" },
              ].map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.href}
                    className="text-white/55 text-body-md font-body-md hover:text-tashtep-orange transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-3">
            <h4 className="text-white/40 text-[11px] font-bold mb-6">تواصل معنا</h4>
            <ul className="space-y-5">
              {settings.phone && (
                <li className="flex items-center gap-3" dir="ltr">
                  <span className="material-symbols-outlined text-[18px] text-tashtep-orange flex-shrink-0">
                    call
                  </span>
                  <span className="text-white/55 text-body-md font-body-md">{settings.phone}</span>
                </li>
              )}
              {settings.email && (
                <li className="flex items-center gap-3" dir="ltr">
                  <span className="material-symbols-outlined text-[18px] text-tashtep-orange flex-shrink-0">
                    mail
                  </span>
                  <span className="text-white/55 text-body-md font-body-md">{settings.email}</span>
                </li>
              )}
              {settings.address && (
                <li className="flex items-start gap-3" dir="rtl">
                  <span className="material-symbols-outlined text-[18px] text-tashtep-orange flex-shrink-0 mt-0.5">
                    location_on
                  </span>
                  <span className="text-white/55 text-body-md font-body-md">{settings.address}</span>
                </li>
              )}
              {whatsappHref && (
                <li>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366]/10 border border-[#25D366]/25 text-[#4ADE80] px-4 py-2 rounded-full text-label-md font-label-md hover:bg-[#25D366]/20 transition-colors"
                  >
                    <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
                      <path d={WHATSAPP_PATH} />
                    </svg>
                    واتساب
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* ── 3. Newsletter ───────────────────────────────────────── */}
        <div className="py-10 border-b border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-right">
              <h3 className="text-white text-[20px] font-bold font-headline-md mb-1">
                أحدث أفكار الديكور والعروض
              </h3>
              <p className="text-white/40 text-body-md font-body-md">لن نرسل أكثر من رسالة أسبوعياً.</p>
            </div>
            <div className="w-full md:w-auto md:min-w-[400px]">
              <NewsletterForm />
            </div>
          </div>
        </div>

        {/* ── 4. Trust Strip ──────────────────────────────────────── */}
        <div className="py-8 border-b border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6">
            {TRUST_ITEMS.map((item) => (
              <div key={item.icon} className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px] text-tashtep-orange">
                  {item.icon}
                </span>
                <span className="text-white/50 text-label-md font-label-md">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. Bottom Bar ───────────────────────────────────────── */}
        <div className="py-6 flex flex-col md:flex-row justify-between items-center gap-5">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <p className="text-white/30 text-[13px]">
              © {new Date().getFullYear()} {settings.storeName}. جميع الحقوق محفوظة.
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-white/30 text-[13px] hover:text-white/60 transition-colors"
              >
                سياسة الخصوصية
              </Link>
              <Link
                href="/terms"
                className="text-white/30 text-[13px] hover:text-white/60 transition-colors"
              >
                الشروط والأحكام
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white/25 text-[11px] ml-1">طرق الدفع</span>
            {PAYMENT_METHODS.map((method) => (
              <span
                key={method}
                className="border border-white/15 text-white/40 text-[11px] px-2.5 py-1 rounded font-mono"
              >
                {method}
              </span>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
