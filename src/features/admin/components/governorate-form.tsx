"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Governorate } from "@prisma/client";
import { createGovernorateAction, updateGovernorateAction } from "@/actions/governorate.actions";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  name: z.string().min(2, "اسم المحافظة يجب أن يكون حرفين على الأقل"),
  shippingCost: z.coerce.number().min(0, "تكلفة الشحن لا يمكن أن تكون سالبة"),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface GovernorateFormProps {
  governorate?: Governorate | null;
  isOpen: boolean;
  onClose: () => void;
}

export function GovernorateForm({ governorate, isOpen, onClose }: GovernorateFormProps) {
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      shippingCost: 0,
      isActive: true,
    },
  });

  React.useEffect(() => {
    if (governorate) {
      form.reset({
        name: governorate.name,
        shippingCost: governorate.shippingCost,
        isActive: governorate.isActive,
      });
    } else {
      form.reset({
        name: "",
        shippingCost: 0,
        isActive: true,
      });
    }
  }, [governorate, form, isOpen]);

  async function onSubmit(data: FormValues) {
    setError(null);
    try {
      let result;
      if (governorate) {
        result = await updateGovernorateAction({ id: governorate.id, ...data });
      } else {
        result = await createGovernorateAction(data);
      }
      
      if (result?.data?.success) {
        onClose();
        form.reset();
      } else {
        setError(result?.error || "حدث خطأ أثناء الحفظ");
      }
    } catch (err) {
      console.error(err);
      setError("حدث خطأ غير متوقع");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{governorate ? "تعديل بيانات المحافظة" : "إضافة محافظة جديدة"}</DialogTitle>
        </DialogHeader>
        {error && (
          <div className="mb-4 p-3 rounded bg-destructive/15 text-destructive text-sm font-medium">
            {error}
          </div>
        )}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>اسم المحافظة</Label>
            <Input placeholder="مثال: القاهرة" {...form.register("name")} />
            {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label>تكلفة الشحن (ج.م)</Label>
            <Input type="number" {...form.register("shippingCost")} />
            {form.formState.errors.shippingCost && <p className="text-sm text-destructive">{form.formState.errors.shippingCost.message}</p>}
          </div>

          <div className="flex items-center space-x-2 space-x-reverse pt-2">
            <Checkbox 
              id="isActive" 
              checked={form.watch("isActive")} 
              onChange={(e) => form.setValue("isActive", e.target.checked)} 
            />
            <Label htmlFor="isActive" className="cursor-pointer">تفعيل المحافظة (تظهر للعملاء)</Label>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={form.formState.isSubmitting}>
              إلغاء
            </Button>
            <Button type="submit" variant="tashtep" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : null}
              حفظ المحافظة
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
