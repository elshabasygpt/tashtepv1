import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrandDeleteButton } from "./brand-delete-button";

export const dynamic = "force-dynamic";

export default async function AdminBrandsPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "MANAGER")) redirect("/");

  const brands = await prisma.brand.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { createdAt: "desc" },
  });

  const isAdmin = user.role === "ADMIN";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-obsidian">الماركات</h2>
          <p className="text-secondary text-sm mt-0.5">{brands.length} ماركة مسجلة</p>
        </div>
        <Button variant="tashtep" asChild>
          <Link href="/admin/brands/new">
            <span className="material-symbols-outlined text-[18px] me-1">add</span>
            إضافة ماركة
          </Link>
        </Button>
      </div>

      {brands.length === 0 ? (
        <div className="bg-white border border-stone rounded-2xl p-16 text-center text-secondary">
          <span className="material-symbols-outlined text-5xl block mb-3 opacity-40">label</span>
          <p className="font-medium">لا توجد ماركات بعد</p>
          <p className="text-sm mt-1 mb-4">ابدأ بإضافة أول ماركة</p>
          <Button variant="tashtep" asChild size="sm">
            <Link href="/admin/brands/new">إضافة ماركة</Link>
          </Button>
        </div>
      ) : (
        <div className="bg-white border border-stone rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone/30 border-b border-stone">
              <tr>
                <th className="text-right px-6 py-3 font-medium text-secondary">الماركة</th>
                <th className="text-center px-4 py-3 font-medium text-secondary">عدد المنتجات</th>
                <th className="text-left px-6 py-3 font-medium text-secondary">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone/60">
              {brands.map((brand) => (
                <tr key={brand.id} className="hover:bg-stone/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {brand.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={brand.logo} alt={brand.name} className="w-10 h-10 object-contain rounded-lg border border-stone" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-stone/50 flex items-center justify-center">
                          <span className="material-symbols-outlined text-secondary text-[20px]">label</span>
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-obsidian">{brand.name}</div>
                        <div className="text-xs text-secondary font-mono">{brand.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="px-3 py-1 bg-stone/40 rounded-full text-xs font-bold text-obsidian">
                      {brand._count.products}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/brands/${brand.id}/edit`}>
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </Link>
                      </Button>
                      {isAdmin && brand._count.products === 0 && (
                        <BrandDeleteButton brandId={brand.id} brandName={brand.name} />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
