import { OrderService } from "@/services/order.service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

const STATUS_OPTIONS = [
  { value: "", label: "جميع الحالات" },
  { value: "PENDING", label: "قيد المراجعة" },
  { value: "PROCESSING", label: "جاري التجهيز" },
  { value: "SHIPPED", label: "تم الشحن" },
  { value: "DELIVERED", label: "تم التوصيل" },
  { value: "CANCELLED", label: "ملغي" },
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; q?: string }>;
}) {
  const { page: pageParam, status, q } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1"));
  const filters = {
    status: status || undefined,
    search: q || undefined,
  };

  const [orders, total] = await Promise.all([
    OrderService.getAllOrders({ limit: PAGE_SIZE, page, ...filters }) as Promise<{ id: string; createdAt: Date; shippingName: string; totalAmount: number; status: string; paymentStatus: string; user: { email: string } }[]>,
    OrderService.getOrdersCount(filters),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const buildHref = (overrides: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    if ((overrides.status ?? status)) p.set("status", overrides.status ?? status ?? "");
    if ((overrides.q ?? q)) p.set("q", overrides.q ?? q ?? "");
    if (overrides.page) p.set("page", overrides.page);
    return `/admin/orders?${p.toString()}`;
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-headline-md font-bold text-obsidian">إدارة الطلبات</h2>
          <span className="bg-stone text-secondary text-sm px-2.5 py-0.5 rounded-full font-medium">{total}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <form method="GET" action="/admin/orders" className="relative">
            {status && <input type="hidden" name="status" value={status} />}
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="ابحث باسم العميل أو رقم الطلب..."
              className="pl-4 pr-10 py-2 text-sm border border-stone rounded-lg bg-white focus:outline-none focus:border-tashtep-orange w-56"
              dir="rtl"
            />
            <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
              <span className="material-symbols-outlined text-[18px]">search</span>
            </button>
          </form>
          {/* Status Filter */}
          <form method="GET" action="/admin/orders">
            {q && <input type="hidden" name="q" value={q} />}
            <select
              name="status"
              defaultValue={status ?? ""}
              onChange={(e) => { const f = e.currentTarget.form; f?.submit(); }}
              className="text-sm border border-stone rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-tashtep-orange"
            >
              {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </form>
          {(status || q) && (
            <Link href="/admin/orders" className="text-sm text-secondary hover:text-red-500 flex items-center gap-1 border border-stone px-2.5 py-2 rounded-lg">
              <span className="material-symbols-outlined text-[14px]">close</span>
              مسح
            </Link>
          )}
          <a
            href={`/api/admin/orders/export${status ? `?status=${status}` : ""}`}
            className="text-sm flex items-center gap-1 border border-stone px-2.5 py-2 rounded-lg hover:bg-stone/50 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            تصدير CSV
          </a>
        </div>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {orders.length === 0 ? (
          <div className="bg-white border border-stone rounded-xl p-8 text-center text-secondary text-sm">لا توجد طلبات.</div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-white border border-stone rounded-xl p-4 space-y-3 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-technical-mono text-sm font-bold text-obsidian">#{order.id.slice(-6).toUpperCase()}</p>
                  <p className="text-xs text-secondary mt-0.5">{new Date(order.createdAt).toLocaleDateString('ar-EG')}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {getStatusBadge(order.status)}
                  {getPaymentBadge(order.paymentStatus)}
                </div>
              </div>
              <div className="border-t border-stone/50 pt-2.5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-obsidian">{order.shippingName}</p>
                  <p className="text-xs text-secondary font-technical-mono">{order.user?.email || "طلب زائر"}</p>
                </div>
                <p className="font-headline-md text-sm font-bold text-obsidian">{order.totalAmount} ج.م</p>
              </div>
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href={`/admin/orders/${order.id}`}>عرض التفاصيل</Link>
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white border border-stone rounded-xl shadow-sm overflow-hidden">
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
                    <div className="flex flex-col">
                      <span className="font-medium text-obsidian">{order.shippingName}</span>
                      <span className="text-xs text-secondary font-technical-mono">{order.user?.email || "طلب زائر"}</span>
                    </div>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-secondary">
            عرض {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} من {total} طلب
          </p>
          <div className="flex items-center gap-2">
            <Link
              href={buildHref({ page: String(page - 1) })}
              aria-disabled={page <= 1}
              className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-colors ${page <= 1 ? "pointer-events-none opacity-40 border-stone" : "border-stone hover:border-obsidian"}`}
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </Link>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const p = totalPages <= 7 ? i + 1 : (page <= 4 ? i + 1 : page - 3 + i);
              if (p < 1 || p > totalPages) return null;
              return (
                <Link
                  key={p}
                  href={buildHref({ page: String(p) })}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors ${p === page ? "bg-tashtep-orange text-white border-tashtep-orange" : "border-stone hover:border-obsidian"}`}
                >
                  {p}
                </Link>
              );
            })}
            <Link
              href={buildHref({ page: String(page + 1) })}
              aria-disabled={page >= totalPages}
              className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-colors ${page >= totalPages ? "pointer-events-none opacity-40 border-stone" : "border-stone hover:border-obsidian"}`}
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
