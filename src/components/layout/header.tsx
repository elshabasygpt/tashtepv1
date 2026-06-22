"use client";

import * as React from "react";
import Link from "next/link";
import { Search, ShoppingCart, User, Menu } from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "./container";

export function Header() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = React.useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b shadow-sm"
          : "bg-background border-transparent"
      )}
    >
      <Container>
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Mobile Menu & Logo */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight text-obsidian">
                Tashtep<span className="text-tashtep-orange">.</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <Link href="/products" className="transition-colors hover:text-tashtep-orange">
              المنتجات
            </Link>
            <Link href="/categories" className="transition-colors hover:text-tashtep-orange">
              الأقسام
            </Link>
            <Link href="/offers" className="transition-colors text-destructive hover:text-destructive/80">
              العروض
            </Link>
            <Link href="/inspiration" className="transition-colors hover:text-tashtep-orange">
              أفكار وتصاميم
            </Link>
          </nav>

          {/* Search Bar (Desktop) */}
          <div className="hidden flex-1 max-w-md lg:flex items-center relative mx-4">
            <Search className="absolute right-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="ابحث عن منتجات، ألوان، أو مواد بناء..."
              className="pl-4 pr-10 rounded-full bg-secondary/50 border-transparent focus-visible:border-tashtep-orange"
            />
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Search className="h-5 w-5" />
            </Button>
            <Link href="/account/orders">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-tashtep-orange text-[10px] text-white">
                0
              </span>
              <span className="sr-only">Cart</span>
            </Button>
          </div>
        </div>
      </Container>
    </motion.header>
  );
}
