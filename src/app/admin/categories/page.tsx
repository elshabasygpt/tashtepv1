import { CategoryService, CategoryWithRelations } from "@/services/category.service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AdminCategoriesPage() {
  const categories = await CategoryService.getCategories();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-headline-md font-bold text-obsidian">إدارة الأقسام</h2>
        <Button asChild className="bg-indigo-500 hover:bg-indigo-600 text-white">
          <Link href="/admin/categories/new">
            <span className="material-symbols-outlined ml-2 text-[20px]">add</span>
            إضافة قسم
          </Link>
        </Button>
      </div>

      <div className="bg-white border border-stone rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-stone/20">
            <TableRow>
              <TableHead className="text-right py-4">اسم القسم</TableHead>
              <TableHead className="text-right py-4">النوع / القسم الأب</TableHead>
              <TableHead className="text-right py-4">الرابط (Slug)</TableHead>
              <TableHead className="text-right py-4">الوصف</TableHead>
              <TableHead className="text-left py-4">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-secondary">
                  لا توجد أقسام. قم بإضافة قسم جديد.
                </TableCell>
              </TableRow>
            ) : (
              categories.map(category => (
                <TableRow key={category.id} className="hover:bg-stone/10 border-stone/50">
                  <TableCell className="font-medium text-obsidian">{category.name}</TableCell>
                  <TableCell className="text-secondary">
                    {category.parentId && (category as CategoryWithRelations).parent ? (
                       <span className="bg-stone px-2 py-1 rounded text-xs">فرعي من: {(category as CategoryWithRelations).parent!.name}</span>
                    ) : (
                       <span className="bg-tashtep-orange/10 text-tashtep-orange px-2 py-1 rounded text-xs">قسم رئيسي</span>
                    )}
                  </TableCell>
                  <TableCell className="font-technical-mono">{category.slug}</TableCell>
                  <TableCell className="text-secondary max-w-xs truncate">{category.description || "-"}</TableCell>
                  <TableCell className="text-left">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/categories/${category.id}/edit`}>
                        <span className="material-symbols-outlined text-[18px]">edit</span>
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
