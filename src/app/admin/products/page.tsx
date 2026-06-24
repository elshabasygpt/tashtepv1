import { prisma } from "@/lib/prisma";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      images: { take: 1 }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-headline-md font-bold text-obsidian">إدارة المنتجات</h2>
        <Button asChild className="bg-tashtep-orange hover:bg-tashtep-orange/90 text-on-primary">
          <Link href="/admin/products/new">
            <span className="material-symbols-outlined ml-2 text-[20px]">add</span>
            إضافة منتج
          </Link>
        </Button>
      </div>

      <div className="bg-white border border-stone rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-stone/20">
            <TableRow>
              <TableHead className="w-[80px] text-right py-4">صورة</TableHead>
              <TableHead className="text-right py-4">المنتج</TableHead>
              <TableHead className="text-right py-4">القسم</TableHead>
              <TableHead className="text-right py-4">السعر</TableHead>
              <TableHead className="text-right py-4">المخزون</TableHead>
              <TableHead className="text-right py-4">الحالة</TableHead>
              <TableHead className="text-left py-4">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-secondary">
                  لا توجد منتجات مسجلة. قم بإضافة منتج جديد.
                </TableCell>
              </TableRow>
            ) : (
              products.map(product => (
                <TableRow key={product.id} className="hover:bg-stone/10 border-stone/50">
                  <TableCell>
                    <div className="w-12 h-12 rounded bg-stone/30 relative overflow-hidden flex items-center justify-center">
                      {product.images[0] ? (
                        <Image src={product.images[0].url} alt={product.name} fill className="object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-stone-dark">image</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-obsidian line-clamp-1">{product.name}</div>
                    <div className="text-xs text-secondary font-technical-mono">{product.id.slice(-6).toUpperCase()}</div>
                  </TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  <TableCell className="font-headline-md">{product.price} ج.م</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    {product.stock > 0 ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">متوفر</Badge>
                    ) : (
                      <Badge variant="destructive">نفذ المخزون</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </Link>
                      </Button>
                    </div>
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
