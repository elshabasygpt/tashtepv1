import { OrderService } from "@/services/order.service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminOrdersPage() {
  const orders = await OrderService.getAllOrders({ limit: 100 }) as { id: string; createdAt: Date; shippingName: string; totalAmount: number; status: string; paymentStatus: string; user: { email: string } }[];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING": return <Badge variant="secondary">قيد المراجعة</Badge>;
      case "PROCESSING": return <Badge variant="default" className="bg-blue-500">جاري التجهيز</Badge>;
      case "SHIPPED": return <Badge variant="default" className="bg-indigo-500">تم الشحن</Badge>;
      case "DELIVERED": return <Badge variant="default" className="bg-green-500">تم التوصيل</Badge>;
      case "CANCELLED": return <Badge variant="destructive">ملغي</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "PAID": return <Badge variant="default" className="bg-green-500">مدفوع</Badge>;
      case "FAILED": return <Badge variant="destructive">فشل الدفع</Badge>;
      case "REFUNDED": return <Badge variant="outline">مسترد</Badge>;
      default: return <Badge variant="secondary">قيد الانتظار</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-headline-md font-bold text-obsidian">إدارة الطلبات</h2>
      </div>

      <div className="bg-white border border-stone rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-stone/20">
            <TableRow>
              <TableHead className="text-right py-4">رقم الطلب</TableHead>
              <TableHead className="text-right py-4">التاريخ</TableHead>
              <TableHead className="text-right py-4">العميل</TableHead>
              <TableHead className="text-right py-4">الإجمالي</TableHead>
              <TableHead className="text-right py-4">حالة الطلب</TableHead>
              <TableHead className="text-right py-4">حالة الدفع</TableHead>
              <TableHead className="text-left py-4">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-secondary">
                  لا توجد طلبات.
                </TableCell>
              </TableRow>
            ) : (
              orders.map(order => (
                <TableRow key={order.id} className="hover:bg-stone/10 border-stone/50">
                  <TableCell className="font-technical-mono">#{order.id.slice(-6).toUpperCase()}</TableCell>
                  <TableCell dir="ltr" className="text-right">{new Date(order.createdAt).toLocaleDateString('ar-EG')}</TableCell>
                  <TableCell>
                    <div className="font-medium text-obsidian">{order.shippingName}</div>
                    <div className="text-xs text-secondary font-technical-mono">{order.user.email}</div>
                  </TableCell>
                  <TableCell className="font-headline-md">{order.totalAmount} ج.م</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{getPaymentBadge(order.paymentStatus)}</TableCell>
                  <TableCell className="text-left">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/orders/${order.id}`}>
                        عرض التفاصيل
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
