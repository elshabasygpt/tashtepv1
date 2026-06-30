"use client";

import * as React from "react";
import { X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CartItem, type CartItemType } from "./cart-item";
import Link from "next/link";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items?: CartItemType[];
}

export function CartDrawer({ isOpen, onClose, items = [] }: CartDrawerProps) {
  React.useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Slide in from the left in RTL format */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed top-0 left-0 z-50 h-full w-[400px] max-w-[85vw] bg-background shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-tashtep-orange" />
                <h2 className="text-lg font-bold">عربة التسوق</h2>
                <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full font-bold">
                  {items.length}
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4 animate-in fade-in zoom-in-95 duration-300">
                  <div className="h-20 w-20 rounded-full bg-secondary/50 flex items-center justify-center">
                    <ShoppingBag className="h-10 w-10 opacity-50" />
                  </div>
                  <p className="text-lg font-medium text-foreground">عربة التسوق فارغة</p>
                  <p className="text-sm text-center">أضف بعض المنتجات الرائعة واستمتع بتجربة تسوق فريدة.</p>
                  <Button variant="tashtep" className="mt-4 px-8" onClick={onClose}>
                    تصفح المنتجات
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {items.map((item: CartItemType) => (
                  <CartItem
                    key={item.id}
                    item={item}
                  />
                ))}
                </div>
              )}
            </div>

            {items.length > 0 && (() => {
              const taxAmount = Number((total * 0.14).toFixed(2));
              const finalTotal = total + taxAmount;
              return (
              <div className="p-6 border-t bg-secondary/10 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-between mb-2 text-muted-foreground text-sm">
                  <span>المجموع الفرعي</span>
                  <span>{total.toLocaleString("ar-EG")} ج.م</span>
                </div>
                <div className="flex items-center justify-between mb-2 text-muted-foreground text-sm">
                  <span>ضريبة القيمة المضافة (14%)</span>
                  <span>{taxAmount.toLocaleString("ar-EG")} ج.م</span>
                </div>
                <div className="flex items-center justify-between mb-3 text-muted-foreground text-xs">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                    رسوم الشحن
                  </span>
                  <span className="text-tashtep-orange font-medium">تُحسب عند إتمام الطلب</span>
                </div>
                <div className="flex items-center justify-between mb-6 font-bold text-xl text-obsidian border-t border-stone/50 pt-3">
                  <span>الإجمالي المبدئي</span>
                  <span>{finalTotal.toLocaleString("ar-EG")} ج.م</span>
                </div>
                <Button asChild variant="tashtep" className="w-full h-14 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all">
                  <Link href="/checkout" onClick={onClose}>
                    متابعة الدفع
                  </Link>
                </Button>
                <Link href="/cart" onClick={onClose} className="block text-center text-sm text-secondary mt-3 hover:text-obsidian transition-colors">
                  عرض السلة كاملاً
                </Link>
              </div>
            )})()}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
