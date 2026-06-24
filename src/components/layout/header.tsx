"use client";

import * as React from "react";
import Link from "next/link";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type HeaderCategory = {
  id: string;
  name: string;
  slug: string;
  subcategories?: {
    id: string;
    name: string;
    slug: string;
  }[];
};

export function Header({ categories = [] }: { categories?: HeaderCategory[] }) {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { count: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { status } = useSession();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  return (
    <header
      className={cn(
        "bg-white border-b border-soft-border sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled ? "shadow-sm" : ""
      )}
    >
      <div className="max-w-container-max mx-auto px-4 md:px-12 lg:px-16 h-[88px] flex justify-between items-center w-full rtl">
        {/* Right Section: Logo & Nav */}
        <div className="flex items-center gap-2 md:gap-macro-sm flex-shrink-0">
          <Link href="/" className="focus:outline-none focus:ring-2 focus:ring-tashtep-orange rounded-DEFAULT transition-transform duration-300 ease-out hover:scale-[0.98]">
            <img 
              alt="Tashtep Logo" 
              className="h-10 w-auto object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfBFrjhfb00UMBeqpphIFKFZkREBR7w_3peFSBDZUZqnd-pMa4U0F9FAMz409vcHqJC8EzU6HpBE1V5BDCF3JjGrZEqSwDsglIYxtzUP-_zVKE9gJpQPIajZzP7iPqAmfTsSBLtxesb8erw8OqUBSarw_9xZ5WyC-vquqL_gZZFNxDgfFUhllcm4qzaUTeEvotHkXngBJW36ljSaBTNCnfmgPTnSeYgTbNH66BWaBa4hbsLPLICjvk_5VpN_r6Vp8EJi-7vU-mp7N2"
            />
          </Link>
          
          <nav className="hidden md:flex items-center gap-gutter font-label-md text-editorial-text">
            <Link href="/" className="hover:text-tashtep-orange transition-all duration-300 ease-out text-tashtep-orange border-b-2 border-transparent hover:border-tashtep-orange pb-1">الرئيسية</Link>
            <div
              className="relative"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <Link
                href="/products"
                className="hover:text-tashtep-orange transition-all duration-300 ease-out flex items-center gap-1 group border-b-2 border-transparent hover:border-tashtep-orange pb-1"
              >
                المنتجات
                <span
                  className="material-symbols-outlined group-hover:text-tashtep-orange transition-colors duration-300 ease-out"
                  style={{ fontSize: '16px', transform: isMegaMenuOpen ? 'rotate(180deg)' : undefined }}
                >
                  expand_more
                </span>
              </Link>

              {isMegaMenuOpen && categories && categories.length > 0 && (
                <div className="fixed top-[88px] left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
                  <div
                    aria-hidden="true"
                    className="fixed inset-0 bg-obsidian/20 backdrop-blur-sm -z-10 pointer-events-auto"
                    onClick={() => setIsMegaMenuOpen(false)}
                  ></div>
                  <div
                    className="pointer-events-auto w-full max-w-container-max bg-white rounded-b-3xl shadow-[0_40px_80px_rgba(0,0,0,0.06)] border-x border-b border-soft-border overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300"
                    onMouseEnter={() => setIsMegaMenuOpen(true)}
                    onMouseLeave={() => setIsMegaMenuOpen(false)}
                  >
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter p-macro-md">
                      {categories.slice(0, 4).map((column: HeaderCategory) => (
                        <div key={column.id} className="flex flex-col space-y-gutter">
                          <Link href={`/categories/${column.slug}`}>
                            <h3 className="font-headline-md text-headline-md text-obsidian pb-micro-sm border-b border-stone font-bold hover:text-tashtep-orange transition-colors cursor-pointer">
                              {column.name}
                            </h3>
                          </Link>
                          {column.subcategories && column.subcategories.length > 0 && (
                            <ul className="flex flex-col space-y-micro-md">
                              {column.subcategories.map((sub: { id: string, name: string, slug: string }) => (
                                <li key={sub.id}>
                                  <Link
                                    href={`/categories/${sub.slug}`}
                                    className="font-body-md text-body-md text-charcoal flex items-center group hover:text-secondary"
                                  >
                                    <span className="material-symbols-outlined text-[16px] ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-tashtep-orange">
                                      arrow_back
                                    </span>
                                    {sub.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="bg-stone border-t border-stone px-macro-sm py-gutter flex justify-end items-center">
                      <Link href="/products" className="text-tashtep-orange font-label-md text-label-md flex items-center gap-2 hover:opacity-80 transition-opacity">
                        عرض كل المنتجات
                        <span className="material-symbols-outlined text-[18px] rtl:rotate-180">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Link href="/categories" className="hover:text-tashtep-orange transition-all duration-300 ease-out flex items-center gap-1 group border-b-2 border-transparent hover:border-tashtep-orange pb-1">
              الأقسام
            </Link>
            <Link href="/about" className="hover:text-tashtep-orange transition-all duration-300 ease-out flex items-center gap-1 group border-b-2 border-transparent hover:border-tashtep-orange pb-1">
              من نحن
            </Link>
            <Link href="/blog" className="hover:text-tashtep-orange transition-all duration-300 ease-out flex items-center gap-1 group border-b-2 border-transparent hover:border-tashtep-orange pb-1">
              المدونة
            </Link>
            <Link href="/contact" className="hover:text-tashtep-orange transition-all duration-300 ease-out flex items-center gap-1 group border-b-2 border-transparent hover:border-tashtep-orange pb-1">
              اتصل بنا
            </Link>
          </nav>
        </div>

        {/* Center Section: Dominant Search */}
        <div className="hidden md:flex flex-grow justify-center px-8">
          <div className="w-full max-w-[640px]">
            <form action="/products" className="relative group">
              <div className="absolute inset-y-0 right-0 pl-3 flex items-center pointer-events-none pr-4">
                <span className="material-symbols-outlined text-tertiary-container group-focus-within:text-obsidian transition-colors duration-200" style={{ fontSize: '20px' }}>search</span>
              </div>
              <input 
                className="block w-full rounded-xl border-soft-border bg-stone h-[48px] pl-4 pr-12 text-editorial-text focus:border-tashtep-orange focus:bg-white focus:ring-0 text-sm font-label-md transition-all duration-300 ease-in-out placeholder:text-tertiary-container shadow-sm outline-none" 
                dir="rtl" 
                id="search" 
                name="q" 
                placeholder="ابحث عن دهان، معجون، ورق حائط، أداة أو ماركة..." 
                type="search"
              />
            </form>
          </div>
        </div>

        {/* Left Section: Utility Icons */}
        <div className="flex items-center gap-0.5 md:gap-macro-sm flex-shrink-0">
          <Link href="/wishlist" aria-label="المفضلة" className="p-2 text-editorial-text hover:text-tashtep-orange transition-colors duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-tashtep-orange rounded-full relative">
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>favorite</span>
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-tashtep-orange text-white text-[10px] font-bold border border-white">{wishlistCount}</span>
            )}
          </Link>
          {status === "authenticated" ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="p-2 text-editorial-text hover:text-tashtep-orange transition-colors duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-tashtep-orange rounded-full cursor-pointer">
                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>person</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white border-soft-border z-50">
                <Link href="/account" className="w-full">
                  <DropdownMenuItem className="cursor-pointer font-label-md text-editorial-text hover:bg-stone focus:bg-stone flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">dashboard</span>
                    حسابي
                  </DropdownMenuItem>
                </Link>
                <Link href="/account/profile" className="w-full">
                  <DropdownMenuItem className="cursor-pointer font-label-md text-editorial-text hover:bg-stone focus:bg-stone flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">badge</span>
                    الملف الشخصي
                  </DropdownMenuItem>
                </Link>
                <Link href="/account/orders" className="w-full">
                  <DropdownMenuItem className="cursor-pointer font-label-md text-editorial-text hover:bg-stone focus:bg-stone flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                    طلباتي
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem 
                  className="cursor-pointer font-label-md text-error hover:bg-error/10 focus:bg-error/10 flex items-center gap-2"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" aria-label="تسجيل الدخول" className="p-2 text-editorial-text hover:text-tashtep-orange transition-colors duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-tashtep-orange rounded-full">
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>person</span>
            </Link>
          )}
          <Link href="/cart" aria-label="عربة التسوق" className="p-2 text-editorial-text hover:text-tashtep-orange transition-colors duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-tashtep-orange rounded-full relative">
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>shopping_cart</span>
            <span className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-tashtep-orange text-white text-[10px] font-bold border border-white">{cartCount}</span>
          </Link>
          <button
            aria-label="القائمة الرئيسية"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="md:hidden p-2.5 text-editorial-text hover:text-tashtep-orange transition-colors duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-tashtep-orange rounded-full"
            type="button"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
              {isMobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-4 border-b border-soft-border">
        <form action="/products" className="relative group">
          <div className="absolute inset-y-0 right-0 pl-3 flex items-center pointer-events-none pr-4">
            <span className="material-symbols-outlined text-tertiary-container" style={{ fontSize: '20px' }}>search</span>
          </div>
          <input
            className="block w-full rounded-full border-stone bg-stone py-2 pl-4 pr-12 text-editorial-text focus:border-obsidian focus:bg-white focus:ring-0 text-sm font-label-md placeholder:text-tertiary-container shadow-sm outline-none"
            dir="rtl"
            id="mobile-search"
            name="q"
            placeholder="ابحث..."
            type="search"
          />
        </form>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-soft-border bg-white max-h-[calc(100vh-88px)] overflow-y-auto">
          <nav className="flex flex-col py-2">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3.5 font-label-md text-label-md text-editorial-text hover:bg-stone transition-colors">
              الرئيسية
            </Link>
            <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3.5 font-label-md text-label-md text-editorial-text hover:bg-stone transition-colors">
              المنتجات
            </Link>
            <Link href="/categories" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3.5 font-label-md text-label-md text-editorial-text hover:bg-stone transition-colors">
              الأقسام
            </Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3.5 font-label-md text-label-md text-editorial-text hover:bg-stone transition-colors">
              من نحن
            </Link>
            <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3.5 font-label-md text-label-md text-editorial-text hover:bg-stone transition-colors">
              المدونة
            </Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3.5 font-label-md text-label-md text-editorial-text hover:bg-stone transition-colors">
              اتصل بنا
            </Link>
            <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3.5 font-label-md text-label-md text-editorial-text hover:bg-stone transition-colors">
              المفضلة
            </Link>
            <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3.5 font-label-md text-label-md text-editorial-text hover:bg-stone transition-colors">
              عربة التسوق
            </Link>
            <div className="border-t border-stone my-2"></div>
            {status === "authenticated" ? (
              <>
                <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3.5 font-label-md text-label-md text-editorial-text hover:bg-stone transition-colors">
                  حسابي
                </Link>
                <Link href="/account/orders" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3.5 font-label-md text-label-md text-editorial-text hover:bg-stone transition-colors">
                  طلباتي
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="px-4 py-3.5 text-start font-label-md text-label-md text-error hover:bg-error/10 transition-colors"
                >
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3.5 font-label-md text-label-md text-editorial-text hover:bg-stone transition-colors">
                تسجيل الدخول
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
