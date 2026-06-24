"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCategoryAction, updateCategoryAction } from "@/actions/admin.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/admin/image-upload";

interface AdminCategoryFormProps {
  initialData?: { id: string; name: string; slug: string; description: string | null; image?: string | null; parentId?: string | null };
  isEdit?: boolean;
  categories: { id: string; name: string; parentId?: string | null }[];
}

export function AdminCategoryForm({ initialData, isEdit, categories }: AdminCategoryFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    image: initialData?.image || "",
    parentId: initialData?.parentId || "",
  });

  const [status, setStatus] = useState<"idle" | "executing">("idle");
  const [result, setResult] = useState<{ success?: boolean; error?: string; serverError?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("executing");
    
    const payload = { 
      ...formData, 
      image: formData.image || undefined, 
      parentId: formData.parentId || null 
    };

    let res;
    if (isEdit && initialData?.id) {
      res = await updateCategoryAction({ id: initialData.id, data: payload });
    } else {
      res = await createCategoryAction(payload);
    }
    
    setResult(res);
    setStatus("idle");

    if (res?.success) {
      router.push("/admin/categories");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl bg-white p-6 rounded-xl border border-stone">
      <div className="space-y-2">
        <Label>صورة القسم</Label>
        <ImageUpload 
          value={formData.image} 
          onChange={(url) => setFormData(prev => ({ ...prev, image: url }))} 
          folder="categories"
          label="اختر صورة للقسم"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">اسم القسم</Label>
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

      <div className="space-y-2">
        <Label htmlFor="parentId">القسم الرئيسي (اختياري)</Label>
        <select
          id="parentId"
          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          value={formData.parentId}
          onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
        >
          <option value="">-- قسم رئيسي --</option>
          {categories
            .filter(c => c.id !== initialData?.id) // Prevent self-referencing
            .filter(c => c.parentId === null) // Allow only top-level categories as parents (optional rule, but good practice)
            .map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <p className="text-xs text-secondary">اختر قسماً إذا أردت جعل هذا القسم فرعياً. يفضل اختيار الأقسام الرئيسية فقط.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">الوصف (اختياري)</Label>
        <Textarea
          id="description"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      {result?.serverError && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">{result.serverError}</div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-stone">
        <Button variant="outline" type="button" onClick={() => router.push("/admin/categories")}>إلغاء</Button>
        <Button type="submit" disabled={status === "executing"} className="bg-indigo-500 hover:bg-indigo-600 text-white">
          {status === "executing" ? "جاري الحفظ..." : "حفظ القسم"}
        </Button>
      </div>
    </form>
  );
}
