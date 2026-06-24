import Link from "next/link";
import { Container } from "@/components/layout/container";

const NAV_ITEMS = [
  { href: "/account", label: "نظرة عامة" },
  { href: "/account/orders", label: "طلباتي" },
  { href: "/wishlist", label: "المفضلة" },
  { href: "/account/profile", label: "البيانات الشخصية" },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white py-macro-md md:py-macro-lg">
      <Container className="max-w-container-max">
        <nav className="flex gap-2 overflow-x-auto hide-scroll mb-macro-sm border-b border-stone pb-3">
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
        {children}
      </Container>
    </div>
  );
}
