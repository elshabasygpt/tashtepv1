import Link from "next/link";
import { Container } from "@/components/layout/container";

const NAV_ITEMS = [
  { href: "/account", label: "نظرة عامة" },
  { href: "/account/orders", label: "طلباتي" },
  { href: "/account/returns", label: "طلبات الاسترداد" },
  { href: "/account/loyalty", label: "نقاط الولاء" },
  { href: "/account/addresses", label: "عناويني" },
  { href: "/wishlist", label: "المفضلة" },
  { href: "/account/recently-viewed", label: "شاهدت مؤخراً" },
  { href: "/account/profile", label: "البيانات الشخصية" },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-20 bg-white border-b border-stone shadow-sm">
        <Container className="max-w-container-max">
          <nav className="flex gap-1 overflow-x-auto hide-scroll py-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-label-md text-label-md text-secondary hover:text-obsidian px-4 py-2 rounded-full hover:bg-stone transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </Container>
      </div>
      <div className="py-macro-md md:py-macro-lg">
        <Container className="max-w-container-max">
          {children}
        </Container>
      </div>
    </div>
  );
}
