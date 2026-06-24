import { OrderService } from "@/services/order.service";
import { AdminOrderStatusForm } from "@/components/admin/admin-order-status-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let order: { 
    id: string; status: string; paymentStatus: string; totalAmount: number; 
    shippingName: string; shippingPhone: string; shippingAddress: string; shippingNotes: string; 
    items: { id: string; quantity: number; price: number; product: { name: string } }[] 
  };
  try {
    order = await OrderService.getOrderById(id) as typeof order;
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild className="rounded-full">
          <Link href="/admin/orders">
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </Button>
        <h2 className="text-2xl font-headline-md font-bold text-obsidian">
          تفاصيل الطلب: <span className="font-technical-mono">#{order.id.slice(-6).toUpperCase()}</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-stone rounded-xl p-6">
            <h3 className="font-headline-md text-lg text-obsidian mb-4 border-b border-stone pb-2">عناصر الطلب</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">المنتج</TableHead>
                  <TableHead className="text-center">الكمية</TableHead>
                  <TableHead className="text-left">السعر الإجمالي</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="font-medium">{item.product.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-technical-mono">{item.quantity}</TableCell>
                    <TableCell className="text-left font-headline-md">{item.price * item.quantity} ج.م</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-stone">
              <span className="font-bold text-lg text-secondary">الإجمالي الكلي:</span>
              <span className="font-headline-md text-2xl text-tashtep-orange font-bold">{order.totalAmount} ج.م</span>
            </div>
          </div>
          
          <div className="bg-white border border-stone rounded-xl p-6">
            <h3 className="font-headline-md text-lg text-obsidian mb-4 border-b border-stone pb-2">بيانات العميل والشحن</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="block text-secondary mb-1">الاسم:</span>
                <span className="font-medium text-obsidian">{order.shippingName}</span>
              </div>
              <div>
                <span className="block text-secondary mb-1">الهاتف:</span>
                <span className="font-medium text-obsidian font-technical-mono" dir="ltr">{order.shippingPhone}</span>
              </div>
              <div className="md:col-span-2">
                <span className="block text-secondary mb-1">العنوان:</span>
                <span className="font-medium text-obsidian">{order.shippingAddress}</span>
              </div>
              {order.shippingNotes && (
                <div className="md:col-span-2 bg-stone/20 p-3 rounded-md mt-2">
                  <span className="block text-secondary mb-1">ملاحظات:</span>
                  <span className="text-obsidian">{order.shippingNotes}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <AdminOrderStatusForm 
            orderId={order.id} 
            currentStatus={order.status} 
            currentPaymentStatus={order.paymentStatus} 
          />
        </div>
      </div>
    </div>
  );
}
