import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type CartItemType } from "@/features/cart/components/cart-item";

interface OrderSummaryProps {
  items: CartItemType[];
}

export function OrderSummary({ items }: OrderSummaryProps) {
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 50 : 0; // Flat shipping rate
  const total = subtotal + shipping;

  return (
    <Card className="w-full bg-secondary/20 border-transparent shadow-none">
      <CardHeader>
        <CardTitle className="text-xl">ملخص الطلب</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground line-clamp-1 max-w-[70%]">
              {item.name} <span className="text-xs font-bold px-1 bg-background rounded-md ml-1">x{item.quantity}</span>
            </span>
            <span className="font-medium whitespace-nowrap">{item.price * item.quantity} ج.م</span>
          </div>
        ))}
        
        {items.length === 0 && (
          <div className="text-sm text-muted-foreground py-4 text-center">لا توجد منتجات</div>
        )}
        
        <div className="border-t pt-4 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">المجموع الفرعي</span>
            <span className="font-medium">{subtotal} ج.م</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">تكلفة الشحن</span>
            <span className="font-medium">{shipping} ج.م</span>
          </div>
        </div>

        <div className="border-t pt-4 flex justify-between items-center mt-2">
          <span className="font-bold text-lg text-obsidian">الإجمالي النهائي</span>
          <span className="font-black text-2xl text-tashtep-orange">{total} ج.م</span>
        </div>
      </CardContent>
    </Card>
  );
}
