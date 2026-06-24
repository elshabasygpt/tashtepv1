"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProductAction, updateProductAction } from "@/actions/admin.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MultiImageUpload } from "@/components/admin/multi-image-upload";

type Category = { id: string; name: string };

interface AdminProductFormProps {
  categories: Category[];
  initialData?: { id: string; name: string; slug: string; description: string | null; price: number; originalPrice: number | null; stock: number; categoryId: string; images?: string[] };
  isEdit?: boolean;
}

export function AdminProductForm({ categories, initialData, isEdit }: AdminProductFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    price: initialData?.price?.toString() || "",
    originalPrice: initialData?.originalPrice?.toString() || "",
    stock: initialData?.stock?.toString() || "0",
    categoryId: initialData?.categoryId || "",
    images: initialData?.images || [],
  });

  const [status, setStatus] = useState<"idle" | "executing">("idle");
  const [result, setResult] = useState<{ success?: boolean; error?: string; serverError?: string; validationErrors?: Record<string, unknown> } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("executing");

    const payload = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      stock: parseInt(formData.stock),
      categoryId: formData.categoryId,
      images: formData.images,
    };

    let res;
    if (isEdit && initialData?.id) {
      res = await updateProductAction({ id: initialData.id, data: payload });
    } else {
      res = await createProductAction(payload);
    }
    
    setResult(res);
    setStatus("idle");

    if (res?.success) {
      router.push("/admin/products");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-6 rounded-xl border border-stone">
      <div className="space-y-2">
        <Label>صور المنتج</Label>
        <MultiImageUpload 
          value={formData.images} 
          onChange={(urls) => setFormData(prev => ({ ...prev, images: urls }))} 
          folder="products"
          label="إضافة صورة للمنتج"
        />
        <p className="text-xs text-secondary mt-1">يمكنك إضافة وإزالة الصور بسهولة. سيتم عرض الصور في صفحة المنتج.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">اسم المنتج</Label>
          <Input
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">الرابط (Slug)</Label>
          <Input
            id="slug"
            required
            className="font-technical-mono text-left"
            dir="ltr"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryId">القسم</Label>
        <select
          id="categoryId"
          required
          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={formData.categoryId}
          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
        >
          <option value="">-- اختر القسم --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">السعر (ج.م)</Label>
          <Input
            id="price"
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="originalPrice">السعر قبل الخصم (اختياري)</Label>
          <Input
            id="originalPrice"
            type="number"
            min="0"
            step="0.01"
            value={formData.originalPrice}
            onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">المخزون</Label>
          <Input
            id="stock"
            type="number"
            required
            min="0"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">الوصف</Label>
        <Textarea
          id="description"
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      {/* Basic Error Display */}
      {result?.serverError && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
          {result.serverError}
        </div>
      )}
      {result?.validationErrors && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
          البيانات المدخلة غير صحيحة.
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-stone">
        <Button variant="outline" type="button" onClick={() => router.push("/admin/products")}>
          إلغاء
        </Button>
        <Button type="submit" disabled={status === "executing"} className="bg-tashtep-orange hover:bg-tashtep-orange/90 text-on-primary">
          {status === "executing" ? "جاري الحفظ..." : "حفظ المنتج"}
        </Button>
      </div>
    </form>
  );
}
