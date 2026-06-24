import * as React from "react";
import Link from "next/link";
import { Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface OrderListDto {
  id: string;
  createdAt: Date;
  totalAmount: number;
  status: string;
  paymentStatus: string;
}

interface OrdersListProps {
  orders: OrderListDto[];
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "تم الاستلام",
  PROCESSING: "قيد التجهيز",
  SHIPPED: "تم الشحن",
  DELIVERED: "تم التسليم",
  CANCELLED: "ملغي",
};

export function OrdersList({ orders }: OrdersListProps) {

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl text-obsidian">طلباتي السابقة</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-3">
            <Package className="h-10 w-10 opacity-20" />
            <p className="text-sm">لا توجد طلبات سابقة.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex justify-between items-center p-4 border rounded-lg hover:shadow-sm hover:border-obsidian transition-all"
              >
                <div className="flex flex-col gap-1">
                  <p className="font-bold text-obsidian font-technical-mono">#{order.id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Intl.DateTimeFormat("ar-EG", { dateStyle: "long" }).format(new Date(order.createdAt))}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="font-bold text-lg">{order.totalAmount} <span className="text-xs font-normal">ج.م</span></p>
                  <div className="flex gap-2">
                    <Badge variant={order.status === "DELIVERED" ? "default" : order.status === "CANCELLED" ? "outline" : "secondary"}>
                      {STATUS_LABELS[order.status] || order.status}
                    </Badge>
                    <Badge variant={order.paymentStatus === "PAID" ? "default" : "outline"} className={order.paymentStatus === "PAID" ? "bg-green-600 hover:bg-green-700" : ""}>
                      {order.paymentStatus === "PAID" ? "مدفوع" : order.paymentStatus === "FAILED" ? "فشل الدفع" : "غير مدفوع"}
                    </Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
