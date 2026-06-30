"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badgeKey?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "لوحة القيادة",       href: "/admin",                   icon: "dashboard" },
  { label: "التحليلات",           href: "/admin/analytics",         icon: "bar_chart" },
  { label: "المنتجات",            href: "/admin/products",          icon: "inventory_2" },
  { label: "الأقسام",             href: "/admin/categories",        icon: "category" },
  { label: "الماركات",            href: "/admin/brands",            icon: "label" },
  { label: "الكوبونات",           href: "/admin/coupons",           icon: "local_offer" },
  { label: "كروت الهدايا",        href: "/admin/gift-cards",        icon: "card_giftcard" },
  { label: "المقالات",            href: "/admin/articles",          icon: "article" },
  { label: "الشحن والمحافظات",    href: "/admin/shipping",          icon: "local_shipping" },
  { label: "الطلبات",             href: "/admin/orders",            icon: "receipt_long",     badgeKey: "pendingOrders" },
  { label: "رسائل التواصل",       href: "/admin/messages",          icon: "mail",             badgeKey: "unreadMessages" },
  { label: "النيوزلتر",           href: "/admin/newsletter",        icon: "campaign" },
  { label: "التقييمات",           href: "/admin/reviews",           icon: "star" },
  { label: "طلبات الاسترداد",     href: "/admin/returns",           icon: "assignment_return", badgeKey: "pendingReturns" },
  { label: "المستخدمين",          href: "/admin/users",             icon: "group" },
  { label: "إعدادات الرئيسية",    href: "/admin/settings/home",     icon: "home" },
  { label: "صفحة من نحن",        href: "/admin/settings/about",    icon: "info" },
  { label: "صفحة اتصل بنا",      href: "/admin/settings/contact",  icon: "call" },
  { label: "الإعدادات العامة",    href: "/admin/settings/general",  icon: "settings" },
  { label: "إعدادات البريد",      href: "/admin/settings/email",    icon: "mail_lock" },
  { label: "النسخ الاحتياطي",     href: "/admin/backup",            icon: "backup" },
];

interface BadgeCounts {
  pendingOrders: number;
  unreadMessages: number;
  pendingReturns: number;
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [badges, setBadges] = useState<BadgeCounts>({ pendingOrders: 0, unreadMessages: 0, pendingReturns: 0 });

  useEffect(() => {
    fetch("/api/admin/badge-counts")
      .then((r) => r.json())
      .then((d) => { if (d) setBadges(d); })
      .catch(() => {});
  }, [pathname]);

  return (
    <aside className="w-64 bg-obsidian text-on-primary flex flex-col min-h-screen shrink-0 sticky top-0 h-screen">
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-tashtep-orange text-3xl">home_repair_service</span>
          <span className="font-headline-md text-xl tracking-wider">لوحة الإدارة</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin");
          const badgeCount = item.badgeKey ? badges[item.badgeKey as keyof BadgeCounts] : 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-body-md text-base",
                isActive
                  ? "bg-tashtep-orange text-on-primary font-bold shadow-md"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              )}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {badgeCount > 0 && (
                <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                  {badgeCount > 99 ? "99+" : badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <Button variant="outline" className="w-full text-obsidian border-transparent hover:bg-stone/90 hover:text-obsidian" asChild>
          <Link href="/">
            <span className="material-symbols-outlined text-[18px] ml-2">storefront</span>
            العودة للمتجر
          </Link>
        </Button>
      </div>
    </aside>
  );
}
