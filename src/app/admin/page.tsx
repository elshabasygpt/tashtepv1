import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function AdminDashboardPage() {
  // Fetch stats concurrently
  const [
    usersCount,
    productsCount,
    ordersCount,
    totalRevenueData,
    recentOrders
  ] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        paymentStatus: "PAID",
      }
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
      }
    })
  ]);

  const totalRevenue = totalRevenueData._sum.totalAmount || 0;

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

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "PAID": return <Badge variant="default" className="bg-green-500 text-white">مدفوع</Badge>;
      case "FAILED": return <Badge variant="destructive">فشل الدفع</Badge>;
      default: return <Badge variant="secondary">قيد الانتظار</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-headline-md font-bold text-obsidian">مرحباً بك في لوحة الإدارة</h2>
        <p className="text-secondary text-base">نظرة عامة على أداء المتجر والإحصائيات الرئيسية.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-stone bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-secondary">إجمالي الإيرادات</CardTitle>
            <span className="material-symbols-outlined text-green-500">payments</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline-md text-obsidian">
              {new Intl.NumberFormat('ar-EG', { minimumFractionDigits: 2 }).format(totalRevenue)} ج.م
            </div>
            <p className="text-xs text-secondary mt-1">الطلبات المدفوعة فقط</p>
          </CardContent>
        </Card>

        <Card className="border-stone bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-secondary">إجمالي الطلبات</CardTitle>
            <span className="material-symbols-outlined text-blue-500">shopping_bag</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline-md text-obsidian">+{ordersCount}</div>
            <p className="text-xs text-secondary mt-1">كل الطلبات المسجلة</p>
          </CardContent>
        </Card>

        <Card className="border-stone bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-secondary">المنتجات</CardTitle>
            <span className="material-symbols-outlined text-tashtep-orange">inventory_2</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline-md text-obsidian">+{productsCount}</div>
            <p className="text-xs text-secondary mt-1">منتجات معروضة للبيع</p>
          </CardContent>
        </Card>

        <Card className="border-stone bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-secondary">المستخدمين</CardTitle>
            <span className="material-symbols-outlined text-indigo-500">group</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline-md text-obsidian">+{usersCount}</div>
            <p className="text-xs text-secondary mt-1">مستخدم مسجل بالموقع</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-stone shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-stone/50 pb-4">
            <CardTitle className="text-lg font-headline-md text-obsidian">أحدث الطلبات</CardTitle>
            <Link href="/admin/orders" className="text-sm text-tashtep-orange hover:underline flex items-center gap-1">
              عرض الكل <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-stone/20">
                <TableRow className="border-stone">
                  <TableHead className="font-body-md text-right text-secondary py-3 px-4">رقم الطلب</TableHead>
                  <TableHead className="font-body-md text-right text-secondary py-3 px-4">العميل</TableHead>
                  <TableHead className="font-body-md text-right text-secondary py-3 px-4">الحالة</TableHead>
                  <TableHead className="font-body-md text-right text-secondary py-3 px-4">الدفع</TableHead>
                  <TableHead className="font-body-md text-left text-secondary py-3 px-4">المبلغ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-secondary">
                      لا توجد طلبات حتى الآن.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentOrders.map((order) => (
                    <TableRow key={order.id} className="border-stone/50 hover:bg-stone/20">
                      <TableCell className="font-technical-mono text-sm px-4">
                        <Link href={`/admin/orders/${order.id}`} className="hover:text-tashtep-orange hover:underline">
                          #{order.id.slice(-6).toUpperCase()}
                        </Link>
                      </TableCell>
                      <TableCell className="px-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-obsidian">{order.shippingName}</span>
                          <span className="text-xs text-secondary font-technical-mono">{order.user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4">{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="px-4">{getPaymentStatusBadge(order.paymentStatus)}</TableCell>
                      <TableCell className="text-left font-headline-md text-obsidian px-4">
                        {new Intl.NumberFormat('ar-EG', { minimumFractionDigits: 2 }).format(order.totalAmount)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Space for future quick actions or charts */}
        <Card className="border-stone shadow-sm">
          <CardHeader className="border-b border-stone/50 pb-4">
            <CardTitle className="text-lg font-headline-md text-obsidian">إجراءات سريعة</CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex flex-col gap-3">
            <Link href="/admin/products/new" className="flex items-center gap-3 p-3 rounded-lg border border-stone hover:border-tashtep-orange hover:bg-tashtep-orange/5 transition-colors group">
              <span className="material-symbols-outlined text-tashtep-orange group-hover:scale-110 transition-transform">add_circle</span>
              <span className="font-medium text-obsidian">إضافة منتج جديد</span>
            </Link>
            <Link href="/admin/categories" className="flex items-center gap-3 p-3 rounded-lg border border-stone hover:border-tashtep-orange hover:bg-tashtep-orange/5 transition-colors group">
              <span className="material-symbols-outlined text-indigo-500 group-hover:scale-110 transition-transform">category</span>
              <span className="font-medium text-obsidian">إدارة الأقسام</span>
            </Link>
            <Link href="/admin/users" className="flex items-center gap-3 p-3 rounded-lg border border-stone hover:border-tashtep-orange hover:bg-tashtep-orange/5 transition-colors group">
              <span className="material-symbols-outlined text-green-500 group-hover:scale-110 transition-transform">manage_accounts</span>
              <span className="font-medium text-obsidian">صلاحيات المستخدمين</span>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
