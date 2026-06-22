import * as React from "react";
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
              <div key={order.id} className="flex justify-between items-center p-4 border rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex flex-col gap-1">
                  <p className="font-bold text-obsidian">{order.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Intl.DateTimeFormat("ar-EG", { dateStyle: "long" }).format(new Date(order.createdAt))}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="font-bold text-lg">{order.totalAmount} <span className="text-xs font-normal">ج.م</span></p>
                  <div className="flex gap-2">
                    <Badge variant={order.status === "DELIVERED" ? "default" : "secondary"}>
                      {order.status === "DELIVERED" ? "مكتمل" : order.status === "CANCELLED" ? "ملغي" : "قيد التجهيز"}
                    </Badge>
                    <Badge variant={order.paymentStatus === "PAID" ? "default" : "outline"} className={order.paymentStatus === "PAID" ? "bg-green-600 hover:bg-green-700" : ""}>
                      {order.paymentStatus === "PAID" ? "مدفوع" : order.paymentStatus === "FAILED" ? "فشل الدفع" : "غير مدفوع"}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
