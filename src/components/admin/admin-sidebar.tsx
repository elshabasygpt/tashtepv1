"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { label: "لوحة القيادة", href: "/admin", icon: "dashboard" },
  { label: "المنتجات", href: "/admin/products", icon: "inventory_2" },
  { label: "الأقسام", href: "/admin/categories", icon: "category" },
  { label: "المقالات", href: "/admin/articles", icon: "article" },
  { label: "الشحن والمحافظات", href: "/admin/shipping", icon: "local_shipping" },
  { label: "الطلبات", href: "/admin/orders", icon: "receipt_long" },
  { label: "المستخدمين", href: "/admin/users", icon: "group" },
  { label: "إعدادات الرئيسية", href: "/admin/settings/home", icon: "home" },
  { label: "صفحة من نحن", href: "/admin/settings/about", icon: "info" },
  { label: "صفحة اتصل بنا", href: "/admin/settings/contact", icon: "call" },
  { label: "الإعدادات العامة", href: "/admin/settings/general", icon: "settings" },
];

export function AdminSidebar() {
  const pathname = usePathname();

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
              {item.label}
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
