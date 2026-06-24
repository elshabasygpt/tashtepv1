"use client";

import * as React from "react";
import { Governorate } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GovernorateForm } from "./governorate-form";
import { deleteGovernorateAction } from "@/actions/governorate.actions";
import { Loader2 } from "lucide-react";

export function ShippingManager({ initialGovernorates }: { initialGovernorates: Governorate[] }) {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingGov, setEditingGov] = React.useState<Governorate | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const handleOpenNew = () => {
    setEditingGov(null);
    setIsFormOpen(true);
  };

  const handleEdit = (gov: Governorate) => {
    setEditingGov(gov);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه المحافظة؟")) return;
    
    setDeletingId(id);
    try {
      await deleteGovernorateAction({ id });
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء الحذف");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-soft-border overflow-hidden p-6">
      <div className="flex justify-end mb-4">
        <Button onClick={handleOpenNew} variant="tashtep" className="gap-2">
          <span className="material-symbols-outlined text-[18px]">add</span>
          إضافة محافظة
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-stone">
            <TableRow>
              <TableHead className="text-right">اسم المحافظة</TableHead>
              <TableHead className="text-right">تكلفة الشحن</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-left">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialGovernorates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-secondary">
                  لا توجد محافظات مضافة بعد. قم بإضافة محافظة جديدة.
                </TableCell>
              </TableRow>
            ) : (
              initialGovernorates.map((gov) => (
                <TableRow key={gov.id}>
                  <TableCell className="font-medium">{gov.name}</TableCell>
                  <TableCell>{gov.shippingCost} ج.م</TableCell>
                  <TableCell>
                    {gov.isActive ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">نشط</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">غير نشط</span>
                    )}
                  </TableCell>
                  <TableCell className="text-left space-x-2 space-x-reverse">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(gov)}>
                      تعديل
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDelete(gov.id)}
                      disabled={deletingId === gov.id}
                    >
                      {deletingId === gov.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "حذف"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <GovernorateForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        governorate={editingGov} 
      />
    </div>
  );
}
