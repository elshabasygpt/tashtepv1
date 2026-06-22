"use client";

import * as React from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  // Prevent scrolling when sidebar is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />

          {/* Sidebar Panel */}
          <motion.aside
            initial={{ x: "100%" }} // RTL format: coming from right
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed top-0 right-0 z-50 h-full w-[300px] max-w-[80vw] bg-background shadow-2xl lg:hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <Link href="/" className="flex items-center gap-2" onClick={onClose}>
                <span className="text-xl font-bold tracking-tight text-obsidian">
                  Tashtep<span className="text-tashtep-orange">.</span>
                </span>
              </Link>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close Sidebar</span>
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <nav className="flex flex-col gap-4">
                <Link
                  href="/products"
                  className="text-lg font-medium p-2 hover:bg-secondary rounded-md transition-colors"
                  onClick={onClose}
                >
                  المنتجات
                </Link>
                <Link
                  href="/categories"
                  className="text-lg font-medium p-2 hover:bg-secondary rounded-md transition-colors"
                  onClick={onClose}
                >
                  الأقسام
                </Link>
                <Link
                  href="#"
                  className="text-lg font-medium text-destructive p-2 hover:bg-secondary rounded-md transition-colors"
                  onClick={onClose}
                >
                  العروض
                </Link>
                <Link
                  href="#"
                  className="text-lg font-medium p-2 hover:bg-secondary rounded-md transition-colors"
                  onClick={onClose}
                >
                  أفكار وتصاميم
                </Link>
              </nav>

              <div className="mt-8 pt-8 border-t">
                <nav className="flex flex-col gap-4">
                  <Link
                    href="/account"
                    className="text-base text-muted-foreground p-2 hover:text-foreground transition-colors"
                    onClick={onClose}
                  >
                    حسابي
                  </Link>
                  <Link
                    href="/orders"
                    className="text-base text-muted-foreground p-2 hover:text-foreground transition-colors"
                    onClick={onClose}
                  >
                    طلباتي
                  </Link>
                  <Link
                    href="/settings"
                    className="text-base text-muted-foreground p-2 hover:text-foreground transition-colors"
                    onClick={onClose}
                  >
                    الإعدادات
                  </Link>
                </nav>
              </div>
            </div>

            <div className="p-4 border-t">
              <Button variant="tashtep" className="w-full" onClick={onClose}>
                تسجيل الدخول
              </Button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
