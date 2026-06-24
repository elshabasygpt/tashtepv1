import * as React from "react";
import Link from "next/link";



import { SettingsService } from "@/services/settings.service";

export async function Footer() {
  const settings = await SettingsService.getGeneralSettings();

  const dynamicSocialLinks = [
    { label: "Facebook", url: settings.facebookUrl, path: "M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" },
    { label: "Instagram", url: settings.instagramUrl, path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
    { label: "Twitter", url: settings.twitterUrl, path: "M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.384 4.482A13.972 13.972 0 011.671 3.149a4.93 4.93 0 001.523 6.574 4.903 4.903 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.084 4.928 4.928 0 004.6 3.419A9.9 9.9 0 010 19.54a13.94 13.94 0 007.548 2.212c9.142 0 14.307-7.721 13.995-14.646A10.025 10.025 0 0024 4.557z" }
  ].filter(link => link.url); // Only show links that have a URL

  return (
    <footer className="w-full mt-macro-lg bg-[#FAFAF8] text-obsidian">
      <div className="max-w-container-max mx-auto px-gutter">
        {/* Editorial Closing Statement */}
        <div className="py-macro-lg text-center max-w-4xl mx-auto">
          <h2 className="text-display-hero-mobile md:text-display-hero font-display-hero text-obsidian mb-macro-sm">كل مساحة تستحق لمسة استثنائية.</h2>
          <p className="text-body-lg font-body-lg text-secondary mb-macro-md max-w-2xl mx-auto">{settings.storeDescription}</p>
          <div className="flex flex-col md:flex-row justify-center gap-micro-md">
            <Link href="/products" className="bg-tashtep-orange text-white font-label-md text-label-md px-macro-sm py-4 rounded-full hover:opacity-90 transition-all">استكشف المنتجات</Link>
            <Link href="/contact" className="bg-white text-obsidian border border-obsidian font-label-md text-label-md px-macro-sm py-4 rounded-full hover:bg-obsidian hover:text-white transition-all">احجز استشارة مجانية</Link>
          </div>
        </div>

        {/* Trust Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-macro-lg">
          <div className="bg-white border border-surface-container-high rounded-full py-3 px-6 flex items-center justify-center gap-2 shadow-sm">
            <span className="text-lg">🚚</span>
            <span className="font-label-md text-label-md">شحن لجميع المحافظات</span>
          </div>
          <div className="bg-white border border-surface-container-high rounded-full py-3 px-6 flex items-center justify-center gap-2 shadow-sm">
            <span className="text-lg">⭐</span>
            <span className="font-label-md text-label-md">منتجات أصلية 100%</span>
          </div>
          <div className="bg-white border border-surface-container-high rounded-full py-3 px-6 flex items-center justify-center gap-2 shadow-sm">
            <span className="text-lg">📞</span>
            <span className="font-label-md text-label-md">استشارة مجانية</span>
          </div>
          <div className="bg-white border border-surface-container-high rounded-full py-3 px-6 flex items-center justify-center gap-2 shadow-sm">
            <span className="text-lg">↩️</span>
            <span className="font-label-md text-label-md">استرجاع خلال 14 يوم</span>
          </div>
        </div>

        {/* Navigation + Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-macro-md mb-macro-lg border-t border-black/5 pt-macro-md">
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-gutter">
            <div>
              <h4 className="font-bold text-label-md mb-macro-sm uppercase tracking-wider">الشركة</h4>
              <ul className="space-y-3">
                <li><Link className="text-body-md font-body-md text-secondary hover:text-tashtep-orange transition-colors" href="/about">عن تشطيب</Link></li>
                <li><Link className="text-body-md font-body-md text-secondary hover:text-tashtep-orange transition-colors" href="#">المشاريع</Link></li>
                <li><Link className="text-body-md font-body-md text-secondary hover:text-tashtep-orange transition-colors" href="/blog">المدونة</Link></li>
                <li><Link className="text-body-md font-body-md text-secondary hover:text-tashtep-orange transition-colors" href="#">العلامات التجارية</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-label-md mb-macro-sm uppercase tracking-wider">التسوق</h4>
              <ul className="space-y-3">
                <li><Link className="text-body-md font-body-md text-secondary hover:text-tashtep-orange transition-colors" href="/products">الدهانات</Link></li>
                <li><Link className="text-body-md font-body-md text-secondary hover:text-tashtep-orange transition-colors" href="/products">التشطيبات</Link></li>
                <li><Link className="text-body-md font-body-md text-secondary hover:text-tashtep-orange transition-colors" href="/products">ورق الحائط</Link></li>
                <li><Link className="text-body-md font-body-md text-secondary hover:text-tashtep-orange transition-colors" href="/products">الأدوات</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-label-md mb-macro-sm uppercase tracking-wider">خدمة العملاء</h4>
              <ul className="space-y-3 flex flex-col items-start">
                <li className="flex items-center gap-2 text-body-md font-body-md text-secondary" dir="ltr">
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  {settings.phone}
                </li>
                <li className="flex items-center gap-2 text-body-md font-body-md text-secondary" dir="ltr">
                  <span className="material-symbols-outlined text-[16px]">mail</span>
                  {settings.email}
                </li>
                <li className="flex items-center gap-2 text-body-md font-body-md text-secondary" dir="rtl">
                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                  {settings.address}
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-2xl p-8 border border-surface-container-high shadow-sm">
            <h3 className="font-headline-md text-[24px] text-obsidian mb-2">اشترك للحصول على أحدث أفكار الديكور والعروض.</h3>
            <p className="text-body-md font-body-md text-secondary mb-6">لن نرسل أكثر من رسالة أسبوعياً.</p>
            <form className="flex flex-col gap-3">
              <input className="w-full bg-stone border-none rounded-xl py-4 px-6 focus:ring-1 focus:ring-tashtep-orange outline-none" placeholder="بريدك الإلكتروني" type="email" />
              <button className="w-full bg-tashtep-orange text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity" type="submit">اشتراك</button>
            </form>
          </div>
        </div>

        {/* Social */}
        <div className="flex justify-center gap-4 mb-macro-md">
          {dynamicSocialLinks.map((social) => (
            <a
              key={social.label}
              aria-label={social.label}
              className="w-12 h-12 rounded-full border border-surface-container-highest flex items-center justify-center text-secondary hover:border-tashtep-orange hover:text-tashtep-orange hover:scale-105 transition-all duration-200"
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d={social.path}></path></svg>
            </a>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-body-md text-[13px] text-secondary">© {new Date().getFullYear()} {settings.storeName}. جميع الحقوق محفوظة.</p>
            <div className="flex gap-6">
              <Link className="text-body-md text-[13px] text-secondary hover:text-obsidian transition-colors" href="/privacy">سياسة الخصوصية</Link>
              <Link className="text-body-md text-[13px] text-secondary hover:text-obsidian transition-colors" href="/terms">الشروط والأحكام</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
